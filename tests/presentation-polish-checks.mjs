import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read = (path) => fs.readFileSync(path, "utf8");
const styles = read("styles.css");
const polish = read("css/19-presentation-polish.css");
const logoRestore = read("css/21-logo-restore.css");
const pdfPolish = read("js/pdf-polish.js");
const buildMarker = read("js/build-marker.js");

assert(styles.includes('@import url("css/19-presentation-polish.css");'));
assert(styles.includes('@import url("css/21-logo-restore.css");'));
assert(polish.includes(".site-nav-glass"));
assert(logoRestore.includes("hrtechify-logo.png"));
assert(logoRestore.includes("mix-blend-mode: screen"));
assert(polish.includes("grid-template-columns: repeat(6"));
assert(polish.includes("@media print"));
assert(polish.includes("break-inside: avoid-page"));

assert(buildMarker.includes('import("./pdf-polish.js")'));
assert(pdfPolish.includes('const VERSION = "3.0.0-presentation-polish"'));
assert(pdfPolish.includes("function profileRow"));
assert(pdfPolish.includes("function ensureSpace"));
assert(pdfPolish.includes("GrowWithHRPDFPolishReady"));

new vm.Script(pdfPolish, { filename: "js/pdf-polish.js" });
new vm.Script(buildMarker, { filename: "js/build-marker.js" });

console.log("Presentation polish checks passed.");
