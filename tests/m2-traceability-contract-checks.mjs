/**
 * GrowWithHR Compliance DNA
 * M2 Recommendation Traceability Contract Checks
 *
 * Validates:
 * - the governed JSON Schema;
 * - the pure JavaScript contract helpers;
 * - identifier and status contracts;
 * - conservative evidence defaults;
 * - cross-reference enforcement;
 * - deterministic, deeply frozen output;
 * - absence of browser and delivery side effects.
 */

import assert from "node:assert/strict";

import {
    readFile
} from "node:fs/promises";

import path from "node:path";

import {
    fileURLToPath
} from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const TEST_FILE =
    fileURLToPath(
        import.meta.url
    );

const TEST_DIRECTORY =
    path.dirname(
        TEST_FILE
    );

const PROJECT_ROOT =
    path.resolve(
        TEST_DIRECTORY,
        ".."
    );

const SCHEMA_PATH =
    path.join(
        PROJECT_ROOT,
        "data",
        "schema",
        "recommendation-traceability.schema.v1.json"
    );

const CONTRACT_MODULE_PATH =
    path.join(
        PROJECT_ROOT,
        "js",
        "assessment-v3",
        "traceability-contract.js"
    );

const EXPECTED_CONTRACT_VERSION =
    "1.0.0";

const EXPECTED_SCHEMA_ID =
    "urn:growwithhr:schema:recommendation-traceability:1.0.0";

const FIXED_DATE =
    "2026-07-20";

const FIXED_DATE_TIME =
    "2026-07-20T12:00:00.000Z";

const EXPECTED_APPLICABILITY_STATUSES =
    Object.freeze([
        "applicable",
        "likely-applicable",
        "not-currently-applicable",
        "more-information-needed",
        "specialist-review"
    ]);

const EXPECTED_EVIDENCE_STATUSES =
    Object.freeze([
        "not-requested",
        "not-provided",
        "provided",
        "not-verified",
        "verified"
    ]);

const EXPECTED_SOURCE_TYPES =
    Object.freeze([
        "legislation",
        "regulation",
        "government-guidance",
        "official-portal",
        "regulator-guidance",
        "authoritative-professional-guidance"
    ]);

function clone(value) {
    return JSON.parse(
        JSON.stringify(value)
    );
}

function errorMessages(errors) {
    return (
        Array.isArray(errors)
            ? errors
            : []
    )
        .map((error) => {
            return [
                error.instancePath ||
                    "/",
                error.message ||
                    "unknown error"
            ].join(" ");
        })
        .join("\n");
}

function assertIssue(
    result,
    expectedPath,
    message
) {
    assert.equal(
        result.valid,
        false,
        message
    );

    assert(
        result.errors.some(
            (error) =>
                error.path ===
                expectedPath
        ),
        [
            message,
            `Expected issue path: ${expectedPath}`,
            "Actual issues:",
            JSON.stringify(
                result.errors,
                null,
                2
            )
        ].join("\n")
    );
}

function createValidInput() {
    return {
        contractVersion:
            EXPECTED_CONTRACT_VERSION,

        generatedAt:
            FIXED_DATE_TIME,

        facts: {
            confirmed: [
                {
                    id:
                        "fact.workforce.employee-count",

                    kind:
                        "confirmed",

                    label:
                        "Employee count",

                    value:
                        32,

                    answerKey:
                        "employeeCount",

                    recordedAt:
                        FIXED_DATE_TIME,

                    metadata: {
                        source:
                            "assessment-answer"
                    }
                },
                {
                    id:
                        "fact.footprint.primary-state",

                    kind:
                        "confirmed",

                    label:
                        "Primary operating state",

                    value:
                        "Maharashtra",

                    answerKey:
                        "state",

                    recordedAt:
                        FIXED_DATE_TIME,

                    metadata: {}
                }
            ],

            derived: [
                {
                    id:
                        "fact.workforce.size-band",

                    kind:
                        "derived",

                    label:
                        "Workforce size band",

                    value:
                        "20-49",

                    derivedFrom: [
                        "fact.workforce.employee-count"
                    ],

                    derivationRuleId:
                        "rule.workforce.employee-count.band",

                    metadata: {
                        deterministic:
                            true
                    }
                }
            ]
        },

        ruleEvaluations: [
            {
                ruleId:
                    "rule.workforce.employee-count.minimum-threshold",

                ruleVersion:
                    "1.0.0",

                status:
                    "applicable",

                reason:
                    "The confirmed employee count meets the deterministic review threshold.",

                requiredFactIds: [
                    "fact.workforce.employee-count"
                ],

                triggeringFactIds: [
                    "fact.workforce.employee-count"
                ],

                missingFactIds: [],

                sourceIds: [
                    "source.labour-ministry.official-portal"
                ],

                evaluatedAt:
                    FIXED_DATE_TIME,

                metadata: {
                    evaluator:
                        "representative-fixture"
                }
            }
        ],

        recommendations: [
            {
                id:
                    "recommendation.governance.employment-documentation-review",

                ruleId:
                    "rule.workforce.employee-count.minimum-threshold",

                applicabilityStatus:
                    "applicable",

                title:
                    "Review employment documentation",

                reason:
                    "The organisation has reached the configured workforce review threshold.",

                action:
                    "Review employment documentation and confirm which requirements apply.",

                timeline:
                    "Within 30 days",

                triggeringFactIds: [
                    "fact.workforce.employee-count"
                ],

                missingFactIds: [],

                sourceIds: [
                    "source.labour-ministry.official-portal"
                ],

                limitations: [
                    "This advisory result is not legal certification."
                ],

                metadata: {}
            }
        ],

        sources: [
            {
                id:
                    "source.labour-ministry.official-portal",

                title:
                    "Ministry of Labour and Employment",

                publisher:
                    "Government of India",

                url:
                    "https://labour.gov.in/",

                jurisdiction:
                    "India",

                sourceType:
                    "official-portal",

                reviewedAt:
                    FIXED_DATE,

                notes:
                    "Official portal supplied for further review.",

                official:
                    true
            }
        ],

        limitations: [
            "Assessment answers have not been independently verified.",
            "Applicability may require specialist review."
        ],

        metadata: {
            fixture:
                "m2-contract-valid"
        }
    };
}

function createMoreInformationInput() {
    return {
        contractVersion:
            EXPECTED_CONTRACT_VERSION,

        generatedAt:
            FIXED_DATE_TIME,

        facts: {
            confirmed: [
                {
                    id:
                        "fact.workforce.employee-count",

                    kind:
                        "confirmed",

                    label:
                        "Employee count",

                    value:
                        12,

                    answerKey:
                        "employeeCount",

                    recordedAt:
                        FIXED_DATE_TIME,

                    metadata: {}
                }
            ],

            derived: []
        },

        ruleEvaluations: [
            {
                ruleId:
                    "rule.footprint.primary-state.review",

                ruleVersion:
                    "1.0.0",

                status:
                    "more-information-needed",

                reason:
                    "The primary operating state is required before this rule can be evaluated.",

                requiredFactIds: [
                    "fact.footprint.primary-state"
                ],

                triggeringFactIds: [],

                missingFactIds: [
                    "fact.footprint.primary-state"
                ],

                sourceIds: [
                    "source.labour-ministry.official-portal"
                ],

                evaluatedAt:
                    FIXED_DATE_TIME,

                metadata: {}
            }
        ],

        recommendations: [
            {
                id:
                    "recommendation.footprint.confirm-primary-state",

                ruleId:
                    "rule.footprint.primary-state.review",

                applicabilityStatus:
                    "more-information-needed",

                evidence: {
                    status:
                        "not-requested",

                    notes:
                        "",

                    verificationProcessId:
                        null,

                    verifiedAt:
                        null
                },

                title:
                    "Confirm the primary operating state",

                reason:
                    "State information is required before jurisdiction-specific guidance can be evaluated.",

                action:
                    "Confirm the organisation's primary operating state.",

                timeline:
                    "Before relying on state-specific guidance",

                triggeringFactIds: [],

                missingFactIds: [
                    "fact.footprint.primary-state"
                ],

                sourceIds: [
                    "source.labour-ministry.official-portal"
                ],

                limitations: [
                    "No state-specific applicability conclusion has been reached."
                ],

                metadata: {}
            }
        ],

        sources: [
            {
                id:
                    "source.labour-ministry.official-portal",

                title:
                    "Ministry of Labour and Employment",

                publisher:
                    "Government of India",

                url:
                    "https://labour.gov.in/",

                jurisdiction:
                    "India",

                sourceType:
                    "official-portal",

                reviewedAt:
                    FIXED_DATE,

                notes:
                    "",

                official:
                    true
            }
        ],

        limitations: [],

        metadata: {}
    };
}

async function loadContractModule() {
    const source =
        await readFile(
            CONTRACT_MODULE_PATH,
            "utf8"
        );

    const encoded =
        Buffer.from(
            source,
            "utf8"
        ).toString(
            "base64"
        );

    const moduleUrl =
        `data:text/javascript;base64,${encoded}`;

    return {
        source,

        module:
            await import(
                moduleUrl
            )
    };
}

async function main() {
    const schemaSource =
        await readFile(
            SCHEMA_PATH,
            "utf8"
        );

    const schema =
        JSON.parse(
            schemaSource
        );

    const {
        source:
            contractSource,

        module:
            contract
    } =
        await loadContractModule();

    /* ==========================================================
       Schema identity
    ========================================================== */

    assert.equal(
        schema.$schema,
        "https://json-schema.org/draft/2020-12/schema",
        "The traceability schema must use JSON Schema Draft 2020-12."
    );

    assert.equal(
        schema.$id,
        EXPECTED_SCHEMA_ID,
        "The traceability schema identifier must remain stable."
    );

    assert.equal(
        schema.properties
            .contractVersion
            .const,
        EXPECTED_CONTRACT_VERSION,
        "The schema contract version must remain stable."
    );

    /* ==========================================================
       Runtime identity
    ========================================================== */

    assert.equal(
        contract
            .TRACEABILITY_CONTRACT_VERSION,
        EXPECTED_CONTRACT_VERSION,
        "The runtime contract version must match the schema."
    );

    assert.equal(
        contract
            .TRACEABILITY_SCHEMA_ID,
        EXPECTED_SCHEMA_ID,
        "The runtime schema identifier must match the governed schema."
    );

    /* ==========================================================
       Enumeration alignment
    ========================================================== */

    assert.deepEqual(
        contract
            .APPLICABILITY_STATUSES,
        EXPECTED_APPLICABILITY_STATUSES,
        "Runtime applicability statuses must match the M2 contract."
    );

    assert.deepEqual(
        schema.$defs
            .applicabilityStatus
            .enum,
        EXPECTED_APPLICABILITY_STATUSES,
        "Schema applicability statuses must match the M2 contract."
    );

    assert.deepEqual(
        contract
            .EVIDENCE_STATUSES,
        EXPECTED_EVIDENCE_STATUSES,
        "Runtime evidence statuses must match the M2 contract."
    );

    assert.deepEqual(
        schema.$defs
            .evidenceStatus
            .enum,
        EXPECTED_EVIDENCE_STATUSES,
        "Schema evidence statuses must match the M2 contract."
    );

    assert.deepEqual(
        contract
            .SOURCE_TYPES,
        EXPECTED_SOURCE_TYPES,
        "Runtime source types must match the governed schema."
    );

    assert.deepEqual(
        schema.$defs
            .sourceType
            .enum,
        EXPECTED_SOURCE_TYPES,
        "Schema source types must match the M2 contract."
    );

    /* ==========================================================
       Identifier helpers
    ========================================================== */

    assert.equal(
        contract.isApplicabilityStatus(
            "applicable"
        ),
        true
    );

    assert.equal(
        contract.isApplicabilityStatus(
            "verified"
        ),
        false
    );

    assert.equal(
        contract.isEvidenceStatus(
            "not-requested"
        ),
        true
    );

    assert.equal(
        contract.isEvidenceStatus(
            "applicable"
        ),
        false
    );

    assert.equal(
        contract.isSourceType(
            "official-portal"
        ),
        true
    );

    assert.equal(
        contract
            .TRACEABILITY_IDENTIFIER_PATTERNS
            .fact
            .test(
                "fact.workforce.employee-count"
            ),
        true
    );

    assert.equal(
        contract
            .TRACEABILITY_IDENTIFIER_PATTERNS
            .fact
            .test(
                "Fact.Workforce.EmployeeCount"
            ),
        false
    );

    /* ==========================================================
       Side-effect boundary
    ========================================================== */

    const prohibitedRuntimeReferences = [
        /\bdocument\b/,
        /\bwindow\b/,
        /\blocalStorage\b/,
        /\bsessionStorage\b/,
        /\bfetch\s*\(/,
        /\bXMLHttpRequest\b/,
        /\bsetTimeout\s*\(/,
        /\bsetInterval\s*\(/
    ];

    for (
        const pattern
        of prohibitedRuntimeReferences
    ) {
        assert.equal(
            pattern.test(
                contractSource
            ),
            false,
            `The traceability contract must not contain side-effect reference ${pattern}.`
        );
    }

    /* ==========================================================
       AJV schema compilation
    ========================================================== */

    const ajv =
        new Ajv2020({
            allErrors:
                true,

            strict:
                false,

            validateFormats:
                true
        });

    addFormats(
        ajv
    );

    const validateSchema =
        ajv.compile(
            schema
        );

    /* ==========================================================
       Valid traceability bundle
    ========================================================== */

    const validInput =
        createValidInput();

    const validBundle =
        contract
            .createTraceabilityBundle(
                validInput
            );

    assert.equal(
        validBundle
            .contractVersion,
        EXPECTED_CONTRACT_VERSION
    );

    assert.notStrictEqual(
        validBundle,
        validInput,
        "Contract construction must not return the mutable input object."
    );

    assert.equal(
        Object.isFrozen(
            validBundle
        ),
        true,
        "The returned bundle must be frozen."
    );

    assert.equal(
        Object.isFrozen(
            validBundle.facts
        ),
        true,
        "Nested fact collections must be frozen."
    );

    assert.equal(
        Object.isFrozen(
            validBundle
                .facts
                .confirmed[0]
        ),
        true,
        "Confirmed facts must be frozen."
    );

    assert.equal(
        Object.isFrozen(
            validBundle
                .recommendations[0]
                .evidence
        ),
        true,
        "Evidence records must be frozen."
    );

    assert.deepEqual(
        validBundle
            .recommendations[0]
            .evidence,
        {
            status:
                "not-requested",

            notes:
                "",

            verificationProcessId:
                null,

            verifiedAt:
                null
        },
        "Recommendations without supplied evidence must receive the conservative not-requested default."
    );

    assert.equal(
        validateSchema(
            validBundle
        ),
        true,
        [
            "The runtime-generated bundle must satisfy the governed schema.",
            errorMessages(
                validateSchema.errors
            )
        ].join("\n")
    );

    const validationResult =
        contract
            .validateTraceabilityBundle(
                validInput
            );

    assert.equal(
        validationResult.valid,
        true
    );

    assert.equal(
        validationResult.errors.length,
        0
    );

    assert.equal(
        Object.isFrozen(
            validationResult
        ),
        true
    );

    /* ==========================================================
       More-information-needed scenario
    ========================================================== */

    const moreInformationInput =
        createMoreInformationInput();

    const moreInformationBundle =
        contract
            .createTraceabilityBundle(
                moreInformationInput
            );

    assert.equal(
        moreInformationBundle
            .ruleEvaluations[0]
            .status,
        "more-information-needed"
    );

    assert.deepEqual(
        moreInformationBundle
            .ruleEvaluations[0]
            .missingFactIds,
        [
            "fact.footprint.primary-state"
        ]
    );

    assert.equal(
        validateSchema(
            moreInformationBundle
        ),
        true,
        [
            "The more-information-needed fixture must satisfy the schema.",
            errorMessages(
                validateSchema.errors
            )
        ].join("\n")
    );

    /* ==========================================================
       Invalid identifier
    ========================================================== */

    const invalidIdentifierInput =
        createValidInput();

    invalidIdentifierInput
        .facts
        .confirmed[0]
        .id =
            "FACT_EMPLOYEE_COUNT";

    const invalidIdentifierResult =
        contract
            .validateTraceabilityBundle(
                invalidIdentifierInput
            );

    assertIssue(
        invalidIdentifierResult,
        "/facts/confirmed/0/id",
        "Uppercase legacy-style identifiers must be rejected."
    );

    /* ==========================================================
       Duplicate fact identifier
    ========================================================== */

    const duplicateFactInput =
        createValidInput();

    duplicateFactInput
        .facts
        .confirmed[1]
        .id =
            "fact.workforce.employee-count";

    const duplicateFactResult =
        contract
            .validateTraceabilityBundle(
                duplicateFactInput
            );

    assertIssue(
        duplicateFactResult,
        "/facts/all/1/id",
        "Duplicate fact identifiers must be rejected."
    );

    /* ==========================================================
       Missing triggering reference
    ========================================================== */

    const unresolvedFactInput =
        createValidInput();

    unresolvedFactInput
        .ruleEvaluations[0]
        .triggeringFactIds = [
            "fact.workforce.unknown-value"
        ];

    const unresolvedFactResult =
        contract
            .validateTraceabilityBundle(
                unresolvedFactInput
            );

    assertIssue(
        unresolvedFactResult,
        "/ruleEvaluations/0/triggeringFactIds/0",
        "Triggering facts must resolve to supplied confirmed or derived facts."
    );

    /* ==========================================================
       Missing source reference
    ========================================================== */

    const unresolvedSourceInput =
        createValidInput();

    unresolvedSourceInput
        .recommendations[0]
        .sourceIds = [
            "source.unknown.portal"
        ];

    const unresolvedSourceResult =
        contract
            .validateTraceabilityBundle(
                unresolvedSourceInput
            );

    assertIssue(
        unresolvedSourceResult,
        "/recommendations/0/sourceIds/0",
        "Recommendation sources must resolve to structured source records."
    );

    /* ==========================================================
       Rule and recommendation status mismatch
    ========================================================== */

    const statusMismatchInput =
        createValidInput();

    statusMismatchInput
        .recommendations[0]
        .applicabilityStatus =
            "likely-applicable";

    const statusMismatchResult =
        contract
            .validateTraceabilityBundle(
                statusMismatchInput
            );

    assertIssue(
        statusMismatchResult,
        "/recommendations/0/applicabilityStatus",
        "Recommendation applicability must match its originating rule evaluation."
    );

    /* ==========================================================
       More information requires missing facts
    ========================================================== */

    const emptyMissingFactsInput =
        createMoreInformationInput();

    emptyMissingFactsInput
        .ruleEvaluations[0]
        .missingFactIds = [];

    const emptyMissingFactsResult =
        contract
            .validateTraceabilityBundle(
                emptyMissingFactsInput
            );

    assertIssue(
        emptyMissingFactsResult,
        "/ruleEvaluations/0/missingFactIds",
        "A more-information-needed result must name its missing facts."
    );

    /* ==========================================================
       Not-currently-applicable cannot hide missing information
    ========================================================== */

    const invalidNotApplicableInput =
        createMoreInformationInput();

    invalidNotApplicableInput
        .ruleEvaluations[0]
        .status =
            "not-currently-applicable";

    invalidNotApplicableInput
        .ruleEvaluations[0]
        .triggeringFactIds = [
            "fact.workforce.employee-count"
        ];

    const invalidNotApplicableResult =
        contract
            .validateTraceabilityBundle(
                invalidNotApplicableInput
            );

    assertIssue(
        invalidNotApplicableResult,
        "/ruleEvaluations/0/missingFactIds",
        "Not-currently-applicable must not be used while required information is missing."
    );

    /* ==========================================================
       Evidence verification requirements
    ========================================================== */

    const incompleteVerifiedEvidence =
        contract.createEvidence({
            status:
                "not-requested"
        });

    assert.deepEqual(
        incompleteVerifiedEvidence,
        {
            status:
                "not-requested",

            notes:
                "",

            verificationProcessId:
                null,

            verifiedAt:
                null
        }
    );

    assert.throws(
        () => {
            contract.createEvidence({
                status:
                    "verified",

                notes:
                    "Claimed verified without an approved process."
            });
        },
        contract.TraceabilityContractError,
        "Verified evidence must require an explicit verification process and timestamp."
    );

    const verifiedEvidence =
        contract.createEvidence({
            status:
                "verified",

            notes:
                "Verified through the named review process.",

            verificationProcessId:
                "verification.document-review.v1",

            verifiedAt:
                FIXED_DATE_TIME
        });

    assert.equal(
        verifiedEvidence.status,
        "verified"
    );

    assert.equal(
        verifiedEvidence
            .verificationProcessId,
        "verification.document-review.v1"
    );

    /* ==========================================================
       Source safety
    ========================================================== */

    assert.throws(
        () => {
            contract.createSourceReference({
                id:
                    "source.example.insecure",

                title:
                    "Insecure source",

                publisher:
                    "Example publisher",

                url:
                    "http://example.com/",

                jurisdiction:
                    "India",

                sourceType:
                    "official-portal",

                reviewedAt:
                    FIXED_DATE,

                notes:
                    "",

                official:
                    false
            });
        },
        contract.TraceabilityContractError,
        "Structured source references must use HTTPS."
    );

    /* ==========================================================
       JSON-compatible values
    ========================================================== */

    assert.throws(
        () => {
            contract.createConfirmedFact({
                id:
                    "fact.workforce.invalid-value",

                kind:
                    "confirmed",

                label:
                    "Invalid value",

                value:
                    undefined,

                answerKey:
                    "invalidValue",

                recordedAt:
                    FIXED_DATE_TIME,

                metadata: {}
            });
        },
        contract.TraceabilityContractError,
        "Confirmed facts must contain explicit JSON-compatible values."
    );

    /* ==========================================================
       Input immutability
    ========================================================== */

    assert.equal(
        validInput
            .recommendations[0]
            .evidence,
        undefined,
        "Contract construction must not add evidence fields to the caller's input."
    );

    assert.equal(
        Object.isFrozen(
            validInput
        ),
        false,
        "The mutable caller input must not be frozen as a side effect."
    );

    console.log(
        "GrowWithHR M2 traceability contract checks passed."
    );
}

main().catch(
    (error) => {
        console.error(
            "GrowWithHR M2 traceability contract checks failed."
        );

        console.error(
            error
        );

        process.exitCode =
            1;
    }
);
