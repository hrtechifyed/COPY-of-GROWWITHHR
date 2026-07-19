import {
    readFile,
    readdir
} from "node:fs/promises";

import path from "node:path";

import {
    fileURLToPath
} from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const SCRIPT_FILE =
    fileURLToPath(import.meta.url);

const SCRIPT_DIRECTORY =
    path.dirname(SCRIPT_FILE);

const PROJECT_ROOT =
    path.resolve(
        SCRIPT_DIRECTORY,
        ".."
    );

const SCHEMA_PATH =
    path.join(
        PROJECT_ROOT,
        "data",
        "schema",
        "compliance-law.schema.v1.json"
    );

const LAW_DIRECTORY =
    path.join(
        PROJECT_ROOT,
        "data",
        "knowledge-base",
        "laws"
    );

const SUPPORTED_SCHEMA_VERSION =
    "1.0";

const validationDate =
    process.env.COMPLIANCE_VALIDATION_DATE ||
    new Date()
        .toISOString()
        .slice(0, 10);

/**
 * Converts an absolute path into a stable repository-relative path.
 *
 * @param {string} filePath
 * @returns {string}
 */
function relativePath(filePath) {
    return path
        .relative(
            PROJECT_ROOT,
            filePath
        )
        .split(path.sep)
        .join("/");
}

/**
 * Reads and parses a JSON file.
 *
 * @param {string} filePath
 * @returns {Promise<unknown>}
 */
async function readJson(filePath) {
    const source =
        await readFile(
            filePath,
            "utf8"
        );

    try {
        return JSON.parse(
            source.replace(
                /^\uFEFF/,
                ""
            )
        );
    } catch (error) {
        throw new Error(
            `${relativePath(filePath)} contains invalid JSON: ${error.message}`
        );
    }
}

/**
 * Recursively finds JSON files.
 *
 * @param {string} directory
 * @returns {Promise<string[]>}
 */
async function findJsonFiles(
    directory
) {
    let entries;

    try {
        entries =
            await readdir(
                directory,
                {
                    withFileTypes:
                        true
                }
            );
    } catch (error) {
        if (
            error &&
            error.code ===
                "ENOENT"
        ) {
            return [];
        }

        throw error;
    }

    const files = [];

    for (
        const entry of entries
    ) {
        const entryPath =
            path.join(
                directory,
                entry.name
            );

        if (
            entry.isDirectory()
        ) {
            files.push(
                ...await findJsonFiles(
                    entryPath
                )
            );

            continue;
        }

        if (
            entry.isFile() &&
            entry.name
                .toLowerCase()
                .endsWith(".json")
        ) {
            files.push(
                entryPath
            );
        }
    }

    return files.sort();
}

/**
 * Adds a validation failure.
 *
 * @param {Array<Object>} failures
 * @param {string} file
 * @param {string} location
 * @param {string} message
 */
function addFailure(
    failures,
    file,
    location,
    message
) {
    failures.push({
        file,
        location:
            location || "/",
        message
    });
}

/**
 * Formats an AJV error location.
 *
 * @param {Object} error
 * @returns {string}
 */
function ajvLocation(error) {
    const base =
        error.instancePath ||
        "/";

    if (
        error.keyword ===
            "additionalProperties" &&
        error.params
            ?.additionalProperty
    ) {
        return (
            base === "/"
                ? ""
                : base
        ) +
            "/" +
            error.params
                .additionalProperty;
    }

    if (
        error.keyword ===
            "required" &&
        error.params
            ?.missingProperty
    ) {
        return (
            base === "/"
                ? ""
                : base
        ) +
            "/" +
            error.params
                .missingProperty;
    }

    return base;
}

/**
 * Determines whether the first ISO date is later than the second.
 *
 * @param {string|null|undefined} first
 * @param {string|null|undefined} second
 * @returns {boolean}
 */
function isAfter(
    first,
    second
) {
    if (
        !first ||
        !second
    ) {
        return false;
    }

    return first > second;
}

/**
 * Registers a governed identifier and reports duplicates.
 *
 * @param {Map<string, string>} identifiers
 * @param {Array<Object>} failures
 * @param {string} identifier
 * @param {string} file
 * @param {string} location
 */
function registerIdentifier(
    identifiers,
    failures,
    identifier,
    file,
    location
) {
    if (
        typeof identifier !==
            "string" ||
        !identifier
    ) {
        return;
    }

    if (
        identifiers.has(
            identifier
        )
    ) {
        addFailure(
            failures,
            file,
            location,
            `duplicate identifier "${identifier}"; first declared in ${identifiers.get(identifier)}`
        );

        return;
    }

    identifiers.set(
        identifier,
        `${file}${location}`
    );
}

/**
 * Validates temporal relationships that JSON Schema cannot compare.
 *
 * @param {Object} temporal
 * @param {Array<Object>} failures
 * @param {string} file
 * @param {string} location
 */
function validateTemporal(
    temporal,
    failures,
    file,
    location
) {
    if (
        !temporal ||
        typeof temporal !==
            "object"
    ) {
        return;
    }

    if (
        isAfter(
            temporal.effectiveFrom,
            temporal.effectiveTo
        )
    ) {
        addFailure(
            failures,
            file,
            `${location}/effectiveTo`,
            "effectiveTo cannot be earlier than effectiveFrom"
        );
    }

    if (
        isAfter(
            temporal.lastVerified,
            temporal.nextReviewDue
        )
    ) {
        addFailure(
            failures,
            file,
            `${location}/nextReviewDue`,
            "nextReviewDue cannot be earlier than lastVerified"
        );
    }

    if (
        temporal.nextReviewDue &&
        isAfter(
            validationDate,
            temporal.nextReviewDue
        )
    ) {
        addFailure(
            failures,
            file,
            `${location}/nextReviewDue`,
            `compliance record is overdue for review as of ${validationDate}`
        );
    }
}

/**
 * Validates applicability relationships.
 *
 * @param {Object} applicability
 * @param {Array<Object>} failures
 * @param {string} file
 * @param {string} location
 */
function validateApplicability(
    applicability,
    failures,
    file,
    location
) {
    const employeeCount =
        applicability
            ?.employeeCount;

    if (
        employeeCount &&
        employeeCount.max !==
            null &&
        Number.isInteger(
            employeeCount.min
        ) &&
        Number.isInteger(
            employeeCount.max
        ) &&
        employeeCount.max <
            employeeCount.min
    ) {
        addFailure(
            failures,
            file,
            `${location}/employeeCount/max`,
            "maximum employee count cannot be lower than minimum employee count"
        );
    }
}

/**
 * Validates evidence source references.
 *
 * @param {Array<Object>} evidence
 * @param {Set<string>} sourceIds
 * @param {Array<Object>} failures
 * @param {string} file
 * @param {string} location
 */
function validateEvidence(
    evidence,
    sourceIds,
    failures,
    file,
    location
) {
    if (
        !Array.isArray(
            evidence
        )
    ) {
        return;
    }

    evidence.forEach(
        (
            item,
            index
        ) => {
            if (
                item?.sourceId &&
                !sourceIds.has(
                    item.sourceId
                )
            ) {
                addFailure(
                    failures,
                    file,
                    `${location}/${index}/sourceId`,
                    `unknown sourceId "${item.sourceId}"`
                );
            }
        }
    );
}

/**
 * Performs semantic validation after JSON Schema validation.
 *
 * @param {Object} record
 * @param {string} file
 * @param {Array<Object>} failures
 * @param {Map<string, string>} identifiers
 */
function validateRecordSemantics(
    record,
    file,
    failures,
    identifiers
) {
    const sourceIds =
        new Set();

    for (
        const [
            index,
            source
        ] of (
            record.sources ||
            []
        ).entries()
    ) {
        if (
            sourceIds.has(
                source.sourceId
            )
        ) {
            addFailure(
                failures,
                file,
                `/sources/${index}/sourceId`,
                `duplicate sourceId "${source.sourceId}" within the record`
            );
        }

        sourceIds.add(
            source.sourceId
        );
    }

    if (
        record.authority
            ?.sourceId &&
        !sourceIds.has(
            record.authority
                .sourceId
        )
    ) {
        addFailure(
            failures,
            file,
            "/authority/sourceId",
            `unknown sourceId "${record.authority.sourceId}"`
        );
    }

    const jurisdiction =
        record.jurisdiction;

    if (
        jurisdiction
            ?.stateCode &&
        jurisdiction.code !==
            `IN-${jurisdiction.stateCode}`
    ) {
        addFailure(
            failures,
            file,
            "/jurisdiction/code",
            "jurisdiction code must match stateCode"
        );
    }

    validateTemporal(
        record.temporal,
        failures,
        file,
        "/temporal"
    );

    registerIdentifier(
        identifiers,
        failures,
        record.id,
        file,
        "/id"
    );

    (
        record.definitions ||
        []
    ).forEach(
        (
            definition,
            index
        ) => {
            registerIdentifier(
                identifiers,
                failures,
                definition.id,
                file,
                `/definitions/${index}/id`
            );
        }
    );

    (
        record.rules ||
        []
    ).forEach(
        (
            rule,
            index
        ) => {
            const location =
                `/rules/${index}`;

            registerIdentifier(
                identifiers,
                failures,
                rule.id,
                file,
                `${location}/id`
            );

            validateApplicability(
                rule.applicability,
                failures,
                file,
                `${location}/applicability`
            );

            validateEvidence(
                rule.evidence,
                sourceIds,
                failures,
                file,
                `${location}/evidence`
            );

            validateTemporal(
                rule.temporal,
                failures,
                file,
                `${location}/temporal`
            );
        }
    );

    (
        record.exceptions ||
        []
    ).forEach(
        (
            exception,
            index
        ) => {
            const location =
                `/exceptions/${index}`;

            registerIdentifier(
                identifiers,
                failures,
                exception.id,
                file,
                `${location}/id`
            );

            validateApplicability(
                exception.applicability,
                failures,
                file,
                `${location}/applicability`
            );

            validateEvidence(
                exception.evidence,
                sourceIds,
                failures,
                file,
                `${location}/evidence`
            );
        }
    );

    (
        record.recommendations ||
        []
    ).forEach(
        (
            recommendation,
            index
        ) => {
            registerIdentifier(
                identifiers,
                failures,
                recommendation.id,
                file,
                `/recommendations/${index}/id`
            );
        }
    );

    const governance =
        record.governance;

    if (
        governance
            ?.approvalStatus ===
            "approved"
    ) {
        if (
            !governance
                .approvedBy
        ) {
            addFailure(
                failures,
                file,
                "/governance/approvedBy",
                "approved records must identify the approver"
            );
        }

        if (
            !governance
                .approvedAt
        ) {
            addFailure(
                failures,
                file,
                "/governance/approvedAt",
                "approved records must include an approval timestamp"
            );
        }
    }
}

/**
 * Runs compliance-data validation.
 */
async function main() {
    const schema =
        await readJson(
            SCHEMA_PATH
        );

    const ajv =
        new Ajv2020({
            allErrors: true,
            strict: true,
            allowUnionTypes: true
        });

    addFormats(
        ajv
    );

    let validate;

    try {
        validate =
            ajv.compile(
                schema
            );
    } catch (error) {
        console.error(
            "Compliance schema could not be compiled."
        );

        console.error(
            error.message
        );

        process.exitCode = 1;

        return;
    }

    const lawFiles =
        await findJsonFiles(
            LAW_DIRECTORY
        );

    if (
        lawFiles.length ===
            0
    ) {
        console.error(
            `No compliance-law JSON files were found under ${relativePath(LAW_DIRECTORY)}.`
        );

        process.exitCode = 1;

        return;
    }

    const failures = [];
    const legacyFiles = [];
    const governedFiles = [];
    const identifiers =
        new Map();

    for (
        const filePath of lawFiles
    ) {
        let record;

        try {
            record =
                await readJson(
                    filePath
                );
        } catch (error) {
            addFailure(
                failures,
                relativePath(
                    filePath
                ),
                "/",
                error.message
            );

            continue;
        }

        const file =
            relativePath(
                filePath
            );

        if (
            !record ||
            typeof record !==
                "object" ||
            Array.isArray(
                record
            )
        ) {
            addFailure(
                failures,
                file,
                "/",
                "law file must contain a JSON object"
            );

            continue;
        }

        if (
            !Object.prototype
                .hasOwnProperty
                .call(
                    record,
                    "schemaVersion"
                )
        ) {
            legacyFiles.push(
                file
            );

            continue;
        }

        if (
            record.schemaVersion !==
            SUPPORTED_SCHEMA_VERSION
        ) {
            addFailure(
                failures,
                file,
                "/schemaVersion",
                `unsupported schema version "${record.schemaVersion}"; expected "${SUPPORTED_SCHEMA_VERSION}"`
            );

            continue;
        }

        governedFiles.push(
            file
        );

        const valid =
            validate(
                record
            );

        if (
            !valid
        ) {
            for (
                const error of (
                    validate.errors ||
                    []
                )
            ) {
                addFailure(
                    failures,
                    file,
                    ajvLocation(
                        error
                    ),
                    error.message ||
                        "schema validation failed"
                );
            }

            continue;
        }

        validateRecordSemantics(
            record,
            file,
            failures,
            identifiers
        );
    }

    console.log(
        `Compliance schema: ${relativePath(SCHEMA_PATH)}`
    );

    console.log(
        `Law files discovered: ${lawFiles.length}`
    );

    console.log(
        `Versioned records validated: ${governedFiles.length}`
    );

    console.log(
        `Legacy records awaiting migration: ${legacyFiles.length}`
    );

    if (
        failures.length >
            0
    ) {
        console.error(
            `\nCompliance validation failed with ${failures.length} error(s):`
        );

        failures.forEach(
            (
                failure,
                index
            ) => {
                console.error(
                    `${index + 1}. ${failure.file}${failure.location}: ${failure.message}`
                );
            }
        );

        process.exitCode = 1;

        return;
    }

    if (
        governedFiles.length ===
            0
    ) {
        console.log(
            "\nSchema validation is ready. No versioned law records have been migrated yet."
        );

        return;
    }

    console.log(
        "\nCompliance data validation passed."
    );
}

main().catch(
    (error) => {
        console.error(
            "Compliance validation could not run."
        );

        console.error(
            error.stack ||
            error.message
        );

        process.exitCode = 1;
    }
);
