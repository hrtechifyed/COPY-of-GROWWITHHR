"use strict";

/**
 * report-quality-matrix.js
 *
 * Generates N executive advisory reports across varied company-profile
 * combinations by running the SAME rendering engine the live site uses
 * (js/executive-advisory-report.js), via the same Node `vm` sandbox
 * pattern already used in tests/golden-scenario-checks.js.
 *
 * No browser required. Runs anywhere Node runs — including GitHub Actions
 * or GitHub Codespaces, both free.
 *
 * Output: reports/report-quality-matrix.csv and .json
 *
 * Usage:
 *   node tests/report-quality-matrix.js
 *
 * Add to package.json scripts if you want:
 *   "test:quality-matrix": "node tests/report-quality-matrix.js"
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
    return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const reportSource = read("js/executive-advisory-report.js");

function createElement() {
    return {
        textContent: "",
        innerHTML: "",
        addEventListener() {}
    };
}

function executeScenario(input) {
    const elements = new Map();

    function getElement(id) {
        if (!elements.has(id)) {
            elements.set(id, createElement());
        }
        return elements.get(id);
    }

    const context = {
        console,
        localStorage: {
            getItem(key) {
                return key === "growwithhr-report"
                    ? JSON.stringify(input)
                    : null;
            }
        },
        document: {
            getElementById(id) {
                return getElement(id);
            },
            querySelector(selector) {
                if (selector === ".executive-narrative p") {
                    return getElement("executiveNarrative");
                }
                if (selector === "#lookingAhead p") {
                    return getElement("lookingAheadText");
                }
                return getElement(
                    selector.replace(/[^a-zA-Z0-9_-]/g, "") || "query"
                );
            },
            querySelectorAll() {
                return [];
            }
        },
        window: { print() {} }
    };

    vm.createContext(context);
    vm.runInContext(
        `${reportSource}\nthis.ExecutiveAdvisoryReport = ExecutiveAdvisoryReport;`,
        context
    );

    // eslint-disable-next-line no-new
    new context.ExecutiveAdvisoryReport();

    const complianceHtml = getElement("complianceContainer").innerHTML || "";
    const narrativeHtml = getElement("executiveNarrative").innerHTML || "";

    return {
        companyName: getElement("companyName").textContent,
        organisationStage: getElement("organisationStage").textContent,
        executiveFocus: getElement("executiveFocus").textContent,
        compliance: complianceHtml,
        narrative: narrativeHtml,
        complianceCardCount: (complianceHtml.match(/rule-card/g) || []).length,
        narrativeLength: narrativeHtml.length
    };
}

/* ------------------------------------------------------------------ */
/* 1. Define the input space to sample. Edit these lists freely.       */
/*    Keep total combos reasonable (100-200) — this is a spot-check    */
/*    sample, not the exhaustive test your CI already runs.            */
/* ------------------------------------------------------------------ */

const entities = [
    "Private Limited",
    "One Person Company",
    "Limited Liability Partnership",
    "Partnership",
    "Sole Proprietorship"
];

const states = [
    "Karnataka",
    "Maharashtra",
    "Delhi",
    "Tamil Nadu",
    "Telangana",
    "Uttar Pradesh",
    "Gujarat",
    "West Bengal",
    "Haryana",
    "Rajasthan"
];

const employeeCounts = [1, 5, 9, 20, 50, 100, 250];

const industries = [
    "Information Technology / SaaS",
    "Manufacturing",
    "Retail / E-commerce",
    "Financial Services",
    "Healthcare"
];

const peopleFunctions = [
    "No Formal HR/People Function",
    "Dedicated HR/People Team"
];

const fundingStages = ["Bootstrapped", "Seed", "Series A", "Series B+"];
const hiringPlans = ["Selective Hiring", "Aggressive Hiring", "Maintain Current Size"];
const workModels = ["Hybrid", "Remote", "On-site"];

/* ------------------------------------------------------------------ */
/* 2. Build a sampled combination set (not full cartesian product,     */
/*    which would be 5*10*7*5*2*4*3*3 = way too many). We stratify     */
/*    across the dimensions most likely to change compliance logic:    */
/*    entity, state, employees, industry.                              */
/* ------------------------------------------------------------------ */

function pick(arr, i) {
    return arr[i % arr.length];
}

const scenarios = [];
let idx = 0;

for (const entity of entities) {
    for (const state of states) {
        for (const employees of employeeCounts) {
            const industry = pick(industries, idx);
            const peopleFunction = pick(peopleFunctions, idx);
            const fundingStage = pick(fundingStages, idx);
            const hiringPlan = pick(hiringPlans, idx);
            const workModel = pick(workModels, idx);

            scenarios.push({
                id: `combo-${idx + 1}`,
                input: {
                    companyName: `Matrix Test Co ${idx + 1}`,
                    industry,
                    primaryState: state,
                    entity,
                    employees,
                    contractWorkers: 0,
                    interns: 0,
                    apprentices: 0,
                    peopleFunction,
                    fundingStage,
                    hiringPlans: hiringPlan,
                    workModel,
                    locations: "1"
                }
            });

            idx += 1;
        }
    }
}

console.log(`Generated ${scenarios.length} scenarios.`);

/* ------------------------------------------------------------------ */
/* 3. Run every scenario through the real rendering engine.            */
/* ------------------------------------------------------------------ */

const results = [];
const narrativeHashCounts = new Map();
let failures = 0;

scenarios.forEach((scenario) => {
    try {
        const output = executeScenario(scenario.input);
        const narrativeHash = crypto
            .createHash("sha1")
            .update(output.narrative)
            .digest("hex")
            .slice(0, 10);

        narrativeHashCounts.set(
            narrativeHash,
            (narrativeHashCounts.get(narrativeHash) || 0) + 1
        );

        results.push({
            id: scenario.id,
            entity: scenario.input.entity,
            state: scenario.input.primaryState,
            employees: scenario.input.employees,
            industry: scenario.input.industry,
            organisationStage: output.organisationStage,
            executiveFocus: output.executiveFocus.slice(0, 80),
            complianceCardCount: output.complianceCardCount,
            narrativeLength: output.narrativeLength,
            narrativeHash,
            zeroCompliance: output.complianceCardCount === 0,
            error: ""
        });
    } catch (error) {
        failures += 1;
        results.push({
            id: scenario.id,
            entity: scenario.input.entity,
            state: scenario.input.primaryState,
            employees: scenario.input.employees,
            industry: scenario.input.industry,
            organisationStage: "",
            executiveFocus: "",
            complianceCardCount: "",
            narrativeLength: "",
            narrativeHash: "",
            zeroCompliance: "",
            error: error instanceof Error ? error.message : String(error)
        });
    }
});

/* ------------------------------------------------------------------ */
/* 4. Flag likely quality problems.                                    */
/* ------------------------------------------------------------------ */

const zeroComplianceCount = results.filter((r) => r.zeroCompliance === true).length;
const errorCount = results.filter((r) => r.error).length;

// Narratives repeated across many DIFFERENT profiles suggest the
// engine isn't differentiating output by company profile.
const overusedNarratives = [...narrativeHashCounts.entries()]
    .filter(([, count]) => count > Math.max(5, Math.round(results.length * 0.1)))
    .map(([hash, count]) => ({ hash, count }));

/* ------------------------------------------------------------------ */
/* 5. Write CSV + JSON output.                                         */
/* ------------------------------------------------------------------ */

const outDir = path.join(root, "reports");
fs.mkdirSync(outDir, { recursive: true });

const csvHeader = [
    "id", "entity", "state", "employees", "industry",
    "organisationStage", "executiveFocus", "complianceCardCount",
    "narrativeLength", "narrativeHash", "zeroCompliance", "error"
].join(",");

const csvRows = results.map((r) =>
    [
        r.id, r.entity, r.state, r.employees, r.industry,
        JSON.stringify(r.organisationStage || ""),
        JSON.stringify(r.executiveFocus || ""),
        r.complianceCardCount, r.narrativeLength, r.narrativeHash,
        r.zeroCompliance, JSON.stringify(r.error || "")
    ].join(",")
);

fs.writeFileSync(
    path.join(outDir, "report-quality-matrix.csv"),
    [csvHeader, ...csvRows].join("\n")
);

fs.writeFileSync(
    path.join(outDir, "report-quality-matrix.json"),
    JSON.stringify(
        {
            totalScenarios: results.length,
            failures: errorCount,
            zeroComplianceCount,
            overusedNarratives,
            results
        },
        null,
        2
    )
);

console.log("---------------------------------------------");
console.log(`Total scenarios run:      ${results.length}`);
console.log(`Errors thrown:            ${errorCount}`);
console.log(`Zero-compliance results:  ${zeroComplianceCount}`);
console.log(`Suspiciously repeated narratives (possible lack of differentiation): ${overusedNarratives.length}`);
console.log("Output written to reports/report-quality-matrix.csv and .json");
console.log("---------------------------------------------");

if (errorCount > 0) {
    process.exitCode = 1;
}
