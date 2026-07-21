import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read = (path) => fs.readFileSync(path, "utf8");
const styles = read("styles.css");
const polish = read("css/19-presentation-polish.css");
const pdfPolish = read("js/pdf-polish.js");
const buildMarker = read("js/build-marker.js");
const logo = read("assets/hrtechify-logo-transparent.svg");

assert(styles.includes('@import url("css/19-presentation-polish.css");'));
assert(polish.includes(".site-nav-glass"));
assert(polish.includes("hrtechify-logo-transparent.svg"));
assert(polish.includes("grid-template-columns: repeat(6"));
assert(polish.includes("@media print"));
assert(polish.includes("break-inside: avoid-page"));

assert(buildMarker.includes('import("./pdf-polish.js")'));
assert(pdfPolish.includes('const VERSION = "3.0.0-presentation-polish"'));
assert(pdfPolish.includes("function profileRow"));
assert(pdfPolish.includes("function ensureSpace"));
assert(pdfPolish.includes("GrowWithHRPDFPolishReady"));
assert(pdfPolish.includes("hrtechify-logo-transparent.svg"));

assert(logo.startsWith("<?xml"));
assert(logo.includes("<svg"));
assert(!logo.includes('fill="#000"'));
assert(!logo.includes('fill="black"'));

new vm.Script(pdfPolish, { filename: "js/pdf-polish.js" });
new vm.Script(buildMarker, { filename: "js/build-marker.js" });

console.log("Presentation polish checks passed.");
