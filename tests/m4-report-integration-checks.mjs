import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read = (path) => fs.readFileSync(path, "utf8");
const transparency = read("js/pdf-law-transparency.js");
const adaptive = read("js/industry-adaptive-assessment.js");
const serverEntry = read("server-entry.js");
const delivery = read("server-m4-delivery.js");

new vm.Script(transparency, { filename: "js/pdf-law-transparency.js" });
new vm.Script(adaptive, { filename: "js/industry-adaptive-assessment.js" });
new vm.Script(serverEntry, { filename: "server-entry.js" });
new vm.Script(delivery, { filename: "server-m4-delivery.js" });

const sandbox = {
    console,
    document: { body: { classList: { contains: () => false } } },
    window: {
        GrowWithHRPDF: {
            buildAdvisoryPdf: async () => ({ document: null, theme: "light" }),
            buildAdvisoryModel: (payload) => payload.model || {}
        }
    }
};
vm.createContext(sandbox);
vm.runInContext(transparency, sandbox);

const api = sandbox.window.GrowWithHRLawTransparency;
assert(api, "M4 report transparency API must install without a browser DOM");
assert.equal(api.integrationVersion, "0.20.0-m4-integrated-report");

const completeAnswers = {
    companyName: "ABC Technologies Pvt Ltd",
    employees: 62,
    workers: 35,
    contractors: 25,
    indiaOperations: true,
    establishmentType: "Private Limited",
    primaryState: "Karnataka",
    operatingStates: ["Karnataka", "Maharashtra"],
    womenEmployees: "yes",
    wageBand: "Confirmed",
    industry: "Manufacturing",
    workerCategories: ["Employees", "Workers"],
    usesPower: "yes",
    manufacturingOperations: "yes"
};

const allLaws = sandbox.window.GrowWithHRPDF.buildReportLawTransparency(
    { answers: completeAnswers },
    { recommendations: [] }
);
assert.equal(allLaws.length, api.lawCatalog.length, "the production report must show every governed law");
assert(allLaws.every((law) => law.status && law.priority && law.requiredAction));
assert(allLaws.some((law) => law.thresholdResult.state === "crossed"));

const scoped = sandbox.window.GrowWithHRPDF.buildLawTransparency(
    { answers: completeAnswers },
    { recommendations: [{ title: "Review ESIC coverage" }] }
);
assert.deepEqual(Array.from(scoped, (law) => law.id), ["esi"], "ESIC must not cross-match POSH IC");

[
    "Executive compliance summary",
    "Law-by-law explainability",
    "UPCOMING COMPLIANCE TRIGGERS",
    "Missing information",
    "Evidence used",
    "Recommendations roadmap",
    "Governed law index",
    "REQUIRED INPUTS CONFIRMED",
    "This is input coverage, not legal certainty",
    "buildReportLawTransparency",
    "Table of Contents",
    "moveImportantInformationToEnd",
    "redrawPageNumbers",
    "one continuous page sequence",
    "Not currently triggered"
].forEach((expected) => assert(transparency.includes(expected), `missing report integration marker: ${expected}`));

assert(transparency.includes('["workers", "workerCount", "workmen", "factoryWorkers", "blueCollarWorkers"]'));
assert(!transparency.includes('"totalWorkers", "employees"'), "employee count must not substitute for factory-worker count");
assert(transparency.includes('["7,16,31", [0, 0, 0]]'));
assert(transparency.includes('page: [0, 0, 0]'));
assert(transparency.includes('panel: [10, 10, 10]'));
assert(transparency.includes('alt: [21, 21, 21]'));

assert(transparency.includes('import("./industry-adaptive-assessment.js")'));
assert(adaptive.includes("INDUSTRY-SPECIFIC QUESTIONS"));
assert(adaptive.includes("Manufacturing and plant operations"));
assert(adaptive.includes("BPO, ITES and contact-centre operations"));
assert(adaptive.includes("Software and technology operations"));

assert(serverEntry.includes('require("./server-m4-delivery")'));
assert(serverEntry.includes("handleM4DeliveryRequest(request, response)"));
assert(delivery.includes('const ROUTE = "/api/send-advisory-v2"'));
assert(delivery.includes("GMAIL_SAFE_RAW_ATTACHMENT_BYTES"));
assert(delivery.includes("createZip(pdfs)"));
assert(delivery.includes('contentType: "application/zip"'));
assert(delivery.includes('"Report versions delivered"'));
assert(delivery.includes("bundledAsZip"));
assert(delivery.includes("bcc: recipients.slice(1)"));

const founderHtmlPosition = delivery.indexOf("${escapeHtml(FOUNDER_NAME)}</span>");
assert(founderHtmlPosition >= 0, "the founder name must be plain text in the customer HTML signature");
const founderContext = delivery.slice(Math.max(0, founderHtmlPosition - 80), founderHtmlPosition + 80);
assert(!/<strong/i.test(founderContext), "Anurag Sinha must not be bold in the email body");

assert(!transparency.includes("confidencePercent"));
assert(!transparency.includes("overallScore"));

console.log("M4 integrated report, black theme and adaptive-industry checks passed.");
