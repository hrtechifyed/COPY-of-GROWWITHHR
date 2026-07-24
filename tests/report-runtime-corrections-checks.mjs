import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const runtime = fs.readFileSync("js/report-runtime-corrections.js", "utf8");
const industry = fs.readFileSync("js/industry-adaptive-assessment.js", "utf8");
new vm.Script(runtime, { filename: "js/report-runtime-corrections.js" });
new vm.Script(industry, { filename: "js/industry-adaptive-assessment.js" });

assert(runtime.includes("UNDERSTANDING INTELLIGENCE ENGINE"));
assert(!runtime.includes('INTELLIGENCE_LABEL = "M4'));
assert(runtime.includes('import("./report-sequence-controller.js")'));
assert(runtime.includes("STRATEGIC RECOMMENDATIONS"));
assert(runtime.includes("ROADMAP - 0 TO 90 DAYS"));
assert(runtime.includes("this.link(Number(x)"), "law links must receive an explicit PDF annotation rectangle");
assert(runtime.includes("this.line(Number(x)"), "law links must be visibly underlined");
assert(runtime.includes("Math.abs(Number(width) - 40)"));
assert(runtime.includes("Math.abs(Number(height) - 11)"));
assert(runtime.includes("[244, 247, 251]"));
assert(runtime.includes("[21, 21, 21]"));

assert(industry.includes('import("./report-runtime-corrections.js")'));
assert(industry.includes("applicationMoment(application) !== 2"));
assert(industry.includes("application.renderCurrentMoment = function industryAwareRender"));
assert(industry.includes("window.setInterval"), "late controller installation must be retried");
assert(industry.includes("Manufacturing and plant operations"));
assert(industry.includes("BPO, ITES and contact-centre operations"));
assert(industry.includes("Software and technology operations"));

console.log("Report runtime corrections checks passed.");
