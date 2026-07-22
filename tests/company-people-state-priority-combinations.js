"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
    return fs.readFileSync(
        path.join(root, relativePath),
        "utf8"
    );
}

function loadAssessmentModules() {
    const context = {
        console,
        window: {
            GrowWithHRModules: {}
        }
    };

    vm.createContext(context);

    [
        "js/executive-assessment/assessment-definition.js",
        "js/executive-assessment/assessment-utils.js",
        "js/executive-assessment/assessment-validation.js",
        "js/executive-assessment/report-mapper.js"
    ].forEach((relativePath) => {
        vm.runInContext(
            read(relativePath),
            context,
            { filename: relativePath }
        );
    });

    return context.window.GrowWithHRModules;
}

function combinations(values, minimumSize, maximumSize) {
    const output = [];

    function visit(start, selection) {
        if (
            selection.length >= minimumSize &&
            selection.length <= maximumSize
        ) {
            output.push([...selection]);
        }

        if (selection.length === maximumSize) {
            return;
        }

        for (let index = start; index < values.length; index += 1) {
            selection.push(values[index]);
            visit(index + 1, selection);
            selection.pop();
        }
    }

    visit(0, []);

    return output;
}

const modules = loadAssessmentModules();
const definitions = modules.AssessmentDefinition;
const validation = modules.AssessmentValidation;
const reportMapper = modules.ReportMapper;

assert(definitions, "AssessmentDefinition must load.");
assert(validation, "AssessmentValidation must load.");
assert(reportMapper, "ReportMapper must load.");

/*
 * Exhaustive finite input space covered by this test:
 *
 * - Company: every legal-entity value in ENTITY_OPTIONS.
 * - People: every current People/HR support value in PEOPLE_FUNCTION_OPTIONS.
 * - State: every Indian state/union-territory value in STATES.
 * - Priorities: every valid unique selection of one, two or three values from
 *   PRIORITY_OPTIONS. The production validator permits one to three priorities.
 */
const companyOptions = definitions.ENTITY_OPTIONS.map(([value]) => value);
const peopleOptions = definitions.PEOPLE_FUNCTION_OPTIONS.map(([value]) => value);
const stateOptions = [...definitions.STATES];
const priorityValues = definitions.PRIORITY_OPTIONS.map(([value]) => value);
const prioritySelections = combinations(priorityValues, 1, 3);
const priorityLabels = new Map(
    definitions.PRIORITY_OPTIONS.map(([value, label]) => [value, label])
);

const totalPossibleCombinations =
    companyOptions.length *
    peopleOptions.length *
    stateOptions.length *
    prioritySelections.length;

let passed = 0;
let failed = 0;
const failureSamples = [];

function recordFailure(input, error) {
    failed += 1;

    if (failureSamples.length < 20) {
        failureSamples.push({
            input,
            message: error instanceof Error
                ? error.message
                : String(error)
        });
    }
}

for (const entity of companyOptions) {
    for (const peopleFunction of peopleOptions) {
        for (const primaryState of stateOptions) {
            for (const priorities of prioritySelections) {
                const input = {
                    entity,
                    peopleFunction,
                    primaryState,
                    priorities
                };

                try {
                    const businessStageResult =
                        validation.validateBusinessStage(
                            {
                                founded: "2020",
                                foundedNotSure: false,
                                entity,
                                fundingStage: "Bootstrapped"
                            },
                            { currentYear: 2026 }
                        );

                    const operatingFootprintResult =
                        validation.validateOperatingFootprint({
                            primaryState,
                            locations: "1",
                            countries: "1"
                        });

                    const peopleReadinessResult =
                        validation.validatePeopleReadiness({
                            peopleFunction,
                            priorities
                        });

                    assert.strictEqual(
                        businessStageResult.valid,
                        true,
                        `Business-stage validation failed for entity ${entity}.`
                    );
                    assert.strictEqual(
                        operatingFootprintResult.valid,
                        true,
                        `Operating-footprint validation failed for state ${primaryState}.`
                    );
                    assert.strictEqual(
                        peopleReadinessResult.valid,
                        true,
                        `People-readiness validation failed for ${peopleFunction}.`
                    );

                    const answers = {
                        companyName: "Combination Test Organisation",
                        industry: "Information Technology / SaaS",
                        industryId: "information_technology",
                        industryCategory: "Technology & Digital",
                        industryRuleProfile: "Information Technology / SaaS",
                        nature: "Provides software services.",
                        founded: "2020",
                        foundedNotSure: false,
                        entity,
                        fundingStage: "Bootstrapped",
                        employees: "1",
                        contractWorkers: "0",
                        interns: "0",
                        apprentices: "0",
                        workModel: "Hybrid",
                        remoteBand: "25-50",
                        primaryState,
                        locations: "1",
                        countries: "1",
                        hiringPlans: "Maintain Current Size",
                        expansionPlans: ["no-major-expansion"],
                        growthContext: "",
                        peopleFunction,
                        priorities
                    };

                    const report = reportMapper.buildReportData({
                        answers,
                        lead: {
                            name: "Combination Test",
                            email: "combination@example.com",
                            role: "hr-people-leader",
                            marketingConsent: false
                        },
                        definitions,
                        generatedAt: "2026-01-01T00:00:00.000Z"
                    });

                    assert.strictEqual(report.entity, entity);
                    assert.strictEqual(report.peopleFunction, peopleFunction);
                    assert.strictEqual(report.primaryState, primaryState);
                    assert.strictEqual(report.state, primaryState);
                    assert.deepStrictEqual(
                        Array.from(report.priorityCodes),
                        priorities
                    );
                    assert.deepStrictEqual(
                        Array.from(report.priorities),
                        priorities.map((priority) => priorityLabels.get(priority))
                    );

                    passed += 1;
                } catch (error) {
                    recordFailure(input, error);
                }
            }
        }
    }
}

assert.strictEqual(
    passed + failed,
    totalPossibleCombinations,
    "Every calculated combination must be executed exactly once."
);

console.log("Company / People / State / Priority exhaustive combination test");
console.log(`Company options: ${companyOptions.length}`);
console.log(`People options: ${peopleOptions.length}`);
console.log(`State options: ${stateOptions.length}`);
console.log(`Valid priority selections (1-3 of ${priorityValues.length}): ${prioritySelections.length}`);
console.log(`Total possible combinations: ${totalPossibleCombinations}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failureSamples.length > 0) {
    console.error("Failure samples:");
    failureSamples.forEach((failure, index) => {
        console.error(
            `${index + 1}. ${JSON.stringify(failure.input)} -> ${failure.message}`
        );
    });
}

assert.strictEqual(
    failed,
    0,
    `${failed} of ${totalPossibleCombinations} combinations failed.`
);
