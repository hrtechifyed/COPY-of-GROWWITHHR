import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("js/report-acceptance-corrections.js", "utf8");
const bootstrap = fs.readFileSync("js/report-runtime-bootstrap.js", "utf8");

assert.match(source, /5-MINUTE BRIEF/);
assert.match(source, /DEEP DIVE/);
assert.match(source, /SWOT from Your Assessment/);
assert.match(source, /IF YOU READ NOTHING ELSE/);
assert.match(source, /Governed Law Index/);
assert.match(source, /Open official source/);
assert.match(source, /doc\.link\(/);
assert.match(source, /STATE_LABOUR_PORTALS/);
assert.match(source, /hrylabour\.gov\.in/);
assert.match(source, /epfindia\.gov\.in/);
assert.match(source, /esic\.gov\.in/);
assert.match(source, /workforcePresence/);
assert.match(source, /owner-only/);
assert.match(source, /No person other than the owner\/director/);
assert.match(source, /while \(doc\.getNumberOfPages\(\) > 3\)/);
assert.match(source, /The confidentiality\/disclaimer and End of Report pages are outside/);
assert.doesNotMatch(source, /present position →/);
assert.doesNotMatch(source, /Your people →/);
assert.match(bootstrap, /report-acceptance-corrections\.js/);

console.log("Report acceptance correction contracts passed.");
