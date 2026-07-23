import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("js/pdf-law-transparency.js", "utf8");
new vm.Script(source, { filename: "js/pdf-law-transparency.js" });

const sandbox = {
    console,
    window: {
        GrowWithHRPDF: {
            buildAdvisoryPdf: async () => ({ document: null, theme: "light" }),
            buildAdvisoryModel: (payload) => payload.model || {}
        }
    }
};
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const api = sandbox.window.GrowWithHRLawTransparency;
assert(api, "M4 transparency API must be installed");
assert.equal(api.version, "0.19.0-m4-law-transparency");
assert.equal(api.lawCatalog.length, 11, "expected governed law catalog size");

const recommendationByLaw = {
    posh: "Constitute an Internal Committee under POSH",
    maternity: "Review maternity benefit and creche obligations",
    epf: "Complete EPF registration",
    esi: "Review ESIC coverage",
    gratuity: "Maintain gratuity compliance",
    bonus: "Review statutory bonus under Payment of Bonus Act",
    "minimum-wages": "Validate minimum wage obligations under Code on Wages",
    shops: "Complete Shops and Establishments registration",
    "contract-labour": "Review Contract Labour principal employer duties",
    "standing-orders": "Certify standing orders",
    factories: "Review Factories Act licence requirements"
};

const completeAnswers = {
    employees: 60,
    workers: 120,
    contractors: 25,
    indiaOperations: true,
    establishmentType: "Private limited company",
    primaryState: "Karnataka",
    operatingStates: ["Karnataka", "Maharashtra"],
    womenEmployees: true,
    wageBand: "Confirmed",
    industry: "Technology",
    workerCategories: ["Employees", "Workers"],
    usesPower: true,
    manufacturingOperations: true
};

function build(lawId, answers = completeAnswers, title = recommendationByLaw[lawId]) {
    return sandbox.window.GrowWithHRPDF.buildLawTransparency(
        { answers },
        { recommendations: [{ title, observation: "", recommendation: "" }] }
    );
}

// Every catalog entry is detected independently and links only to its governed source.
for (const law of api.lawCatalog) {
    const rows = build(law.id);
    assert.equal(rows.length, 1, `${law.id}: exactly one law should be detected`);
    assert.equal(rows[0].id, law.id);
    assert.equal(rows[0].officialUrl, law.url);
    assert(!/ministry|labour\.gov/i.test(rows[0].officialUrl || ""), `${law.id}: no generic ministry landing page`);
    assert.match(rows[0].confidenceMeaning, /input coverage, not legal certainty/i);
}

// Unrelated recommendations must not create invented law entries.
assert.deepEqual(
    sandbox.window.GrowWithHRPDF.buildLawTransparency(
        { answers: completeAnswers },
        { recommendations: [{ title: "Improve manager capability" }] }
    ),
    []
);

// Exhaust every confirmed/missing input mask for every law.
let masksTested = 0;
for (const law of api.lawCatalog) {
    const required = law.requiredInputs;
    const combinations = 2 ** required.length;
    for (let mask = 0; mask < combinations; mask += 1) {
        const answers = { ...completeAnswers };
        let expectedConfirmed = 0;
        required.forEach((field, index) => {
            if (mask & (1 << index)) {
                expectedConfirmed += 1;
            } else {
                const aliases = {
                    employees: ["employees"], workers: ["workers", "employees"], contractors: ["contractors"],
                    indiaOperations: ["indiaOperations"], establishmentType: ["establishmentType"], primaryState: ["primaryState"],
                    operatingStates: ["operatingStates"], womenEmployees: ["womenEmployees"], wageBand: ["wageBand"],
                    industry: ["industry"], workerCategories: ["workerCategories"], usesPower: ["usesPower"],
                    manufacturingOperations: ["manufacturingOperations"]
                }[field] || [field];
                aliases.forEach((key) => delete answers[key]);
            }
        });
        const [row] = build(law.id, answers);
        assert.equal(row.inputCoverage.confirmed, expectedConfirmed, `${law.id} mask ${mask}: confirmed count`);
        assert.equal(row.inputCoverage.required, required.length, `${law.id} mask ${mask}: required count`);
        assert.equal(row.missingInputs.length, required.length - expectedConfirmed, `${law.id} mask ${mask}: missing count`);
        masksTested += 1;
    }
}
assert(masksTested >= 250, `expected broad combination coverage, got ${masksTested}`);

// Boundary matrix: unknown, below, near, exactly crossed and above.
const boundaryCases = [
    { employees: undefined, expected: "needs-information" },
    { employees: 1, expected: "below" },
    { employees: 8, expected: "near" },
    { employees: 10, expected: "crossed" },
    { employees: 500, expected: "crossed" }
];
for (const testCase of boundaryCases) {
    const answers = { ...completeAnswers };
    if (testCase.employees === undefined) delete answers.employees;
    else answers.employees = testCase.employees;
    const [row] = build("posh", answers);
    assert.equal(row.thresholdResult.state, testCase.expected, `POSH boundary ${String(testCase.employees)}`);
}

// EPF exact 20-person threshold and near-threshold behaviour.
for (const [employees, expected] of [[17, "below"], [18, "near"], [19, "near"], [20, "crossed"], [21, "crossed"]]) {
    const [row] = build("epf", { ...completeAnswers, employees });
    assert.equal(row.thresholdResult.state, expected, `EPF ${employees}`);
}

// Contract labour uses contractor count rather than employee headcount.
for (const [contractors, expected] of [[17, "below"], [18, "near"], [19, "near"], [20, "crossed"]]) {
    const [row] = build("contract-labour", { ...completeAnswers, employees: 500, contractors });
    assert.equal(row.thresholdResult.state, expected, `contract labour ${contractors}`);
}

// Factory threshold switches between 10 with power and 20 without power.
for (const scenario of [
    { workers: 9, usesPower: true, expected: "near" },
    { workers: 10, usesPower: true, expected: "crossed" },
    { workers: 18, usesPower: false, expected: "near" },
    { workers: 20, usesPower: false, expected: "crossed" },
    { workers: 20, usesPower: undefined, expected: "needs-information" }
]) {
    const answers = { ...completeAnswers, workers: scenario.workers };
    if (scenario.usesPower === undefined) delete answers.usesPower;
    else answers.usesPower = scenario.usesPower;
    const [row] = build("factories", answers);
    assert.equal(row.thresholdResult.state, scenario.expected, `factory ${JSON.stringify(scenario)}`);
}

// Multiple laws in one report preserve catalog order and do not duplicate matches.
const allRecommendations = Object.values(recommendationByLaw).map((title) => ({ title }));
const allRows = sandbox.window.GrowWithHRPDF.buildLawTransparency(
    { answers: completeAnswers },
    { recommendations: [...allRecommendations, ...allRecommendations] }
);
assert.equal(allRows.length, api.lawCatalog.length);
assert.deepEqual(allRows.map((row) => row.id), api.lawCatalog.map((law) => law.id));

// Deterministic output for identical input.
const first = sandbox.window.GrowWithHRPDF.buildLawTransparency(
    { answers: completeAnswers },
    { recommendations: allRecommendations }
);
const second = sandbox.window.GrowWithHRPDF.buildLawTransparency(
    { answers: completeAnswers },
    { recommendations: allRecommendations }
);
assert.equal(JSON.stringify(first), JSON.stringify(second));

// Contract checks for visual and clickable PDF output implementation.
assert(source.includes("REQUIRED INPUTS CONFIRMED"));
assert(source.includes("textWithLink"));
assert(source.includes("This is input coverage, not legal certainty"));
assert(source.includes("deletePage"), "existing closing page must be moved, not replaced permanently");
assert(source.includes("drawClosingPage"), "existing closing structure must remain after appendix");
assert(source.includes("Array.isArray(result?.pdfs)"), "dual-theme output must be covered");
assert(!source.includes("confidencePercent"));
assert(!source.includes("overallScore"));

console.log(`M4 law transparency checks passed (${masksTested} input masks plus threshold boundaries).`);