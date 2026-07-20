"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
    return fs.readFileSync(
        path.join(root, relativePath),
        "utf8"
    );
}

function assertIncludes(source, expected, message) {
    assert(
        source.includes(expected),
        message || `Expected to find: ${expected}`
    );
}

function assertBefore(source, first, second, message) {
    const firstPosition = source.indexOf(first);
    const secondPosition = source.indexOf(second);

    assert(firstPosition >= 0, `Missing: ${first}`);
    assert(secondPosition >= 0, `Missing: ${second}`);

    assert(
        firstPosition < secondPosition,
        message
    );
}

const html = read("analyze-company.html");
const controller = read("js/executive-assessment.js");
const storage = read(
    "js/executive-assessment/assessment-storage.js"
);
const css = read("css/17-advisory-briefing.css");

/* Stable route structure */

[
    'id="assessmentShell"',
    'id="landingScreen"',
    'id="startAssessment"',
    'id="resumeAssessmentButton"',
    'id="startAgainButton"',
    'id="conversationWorkspace"',
    'id="storyForm"',
    'id="storyContainer"',
    'id="chapterRail"',
    'id="progressTrack"',
    'id="reviewScreen"',
    'id="reviewContainer"',
    'id="contactScreen"',
    'id="leadCaptureForm"',
    'id="loadingScreen"',
    'id="generationSteps"',
    'id="successScreen"',
    'id="downloadReportButton"',
    'id="emailAgainButton"'
].forEach((contract) => {
    assertIncludes(
        html,
        contract,
        `Stable assessment contract is missing: ${contract}`
    );
});

assert.strictEqual(
    html.split('id="startAssessment"').length - 1,
    1,
    "The start button must render exactly once."
);

/* Journey order */

assertBefore(
    html,
    'id="landingScreen"',
    'id="conversationWorkspace"',
    "Landing must appear before the assessment workspace."
);

assertBefore(
    html,
    'id="conversationWorkspace"',
    'id="reviewScreen"',
    "Assessment must appear before review."
);

assertBefore(
    html,
    'id="reviewScreen"',
    'id="contactScreen"',
    "Review must appear before contact collection."
);

assertBefore(
    html,
    'id="contactScreen"',
    'id="loadingScreen"',
    "Contact collection must appear before generation."
);

assertBefore(
    html,
    'id="loadingScreen"',
    'id="successScreen"',
    "Generation must appear before completion."
);

/* Configuration */

assertIncludes(
    html,
    '"chapters": 4',
    "The current route must retain four chapters."
);

assertIncludes(
    html,
    '"storyMoments": 7',
    "The current route must retain seven story moments."
);

/* Existing integrations */

[
    'src="js/pdf.js"',
    'src="js/gmail-service.js"',
    'src="js/executive-assessment/assessment-storage.js"',
    'src="js/executive-assessment.js"'
].forEach((script) => {
    assertIncludes(
        html,
        script,
        `Required integration is missing: ${script}`
    );
});

/* Controller and persistence */

assertIncludes(
    controller,
    "Storage.readAssessment();",
    "Saved assessment progress must be restored."
);

assertIncludes(
    controller,
    "State.createDefaultState();",
    "A clean initial state must remain available."
);

assertIncludes(
    controller,
    "this.bindEvents();",
    "Assessment interactions must remain connected."
);

assertIncludes(
    controller,
    "this.initialiseView();",
    "The initial assessment view must be prepared."
);

assertIncludes(
    storage,
    '"growwithhr-advisory-briefing-v2"',
    "The existing browser storage key must be preserved."
);

assertIncludes(
    storage,
    "window.localStorage.getItem",
    "Stored progress must remain readable."
);

assertIncludes(
    storage,
    "window.localStorage.setItem",
    "Assessment progress must remain writable."
);

/* Responsive and accessibility safeguards */

assertIncludes(
    css,
    "body.analyze-company-page",
    "Assessment CSS must remain page-scoped."
);

assertIncludes(
    css,
    "min-height: 100dvh",
    "Dynamic viewport support is required."
);

assertIncludes(
    css,
    "overflow-x: clip",
    "Horizontal overflow protection is required."
);

assertIncludes(
    css,
    ":focus-visible",
    "Keyboard focus styling is required."
);

assertIncludes(
    css,
    "[hidden]",
    "Hidden assessment screens must remain concealed."
);

assert(
    /@media\s*\(/.test(css),
    "Responsive breakpoints are required."
);

/* Removed intro must not return */

assert(
    !html.includes('src="js/intro-sequence.js"'),
    "The stable route must not depend on the obsolete intro sequence."
);

console.log("Frontend production checks passed.");
