/**
 * GrowWithHR Compliance DNA
 * M2 Recommendation Traceability Contract
 *
 * Pure contract helpers for constructing and validating traceability
 * records. This module has no DOM, network, storage or timing side effects.
 */

export const TRACEABILITY_CONTRACT_VERSION =
    "1.0.0";

export const TRACEABILITY_SCHEMA_ID =
    "urn:growwithhr:schema:recommendation-traceability:1.0.0";

export const APPLICABILITY_STATUS =
    Object.freeze({
        APPLICABLE:
            "applicable",

        LIKELY_APPLICABLE:
            "likely-applicable",

        NOT_CURRENTLY_APPLICABLE:
            "not-currently-applicable",

        MORE_INFORMATION_NEEDED:
            "more-information-needed",

        SPECIALIST_REVIEW:
            "specialist-review"
    });

export const APPLICABILITY_STATUSES =
    Object.freeze(
        Object.values(
            APPLICABILITY_STATUS
        )
    );

export const EVIDENCE_STATUS =
    Object.freeze({
        NOT_REQUESTED:
            "not-requested",

        NOT_PROVIDED:
            "not-provided",

        PROVIDED:
            "provided",

        NOT_VERIFIED:
            "not-verified",

        VERIFIED:
            "verified"
    });

export const EVIDENCE_STATUSES =
    Object.freeze(
        Object.values(
            EVIDENCE_STATUS
        )
    );

export const SOURCE_TYPE =
    Object.freeze({
        LEGISLATION:
            "legislation",

        REGULATION:
            "regulation",

        GOVERNMENT_GUIDANCE:
            "government-guidance",

        OFFICIAL_PORTAL:
            "official-portal",

        REGULATOR_GUIDANCE:
            "regulator-guidance",

        AUTHORITATIVE_PROFESSIONAL_GUIDANCE:
            "authoritative-professional-guidance"
    });

export const SOURCE_TYPES =
    Object.freeze(
        Object.values(
            SOURCE_TYPE
        )
    );

export const TRACEABILITY_IDENTIFIER_PATTERNS =
    Object.freeze({
        fact:
            /^fact\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/,

        rule:
            /^rule\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/,

        recommendation:
            /^recommendation\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/,

        source:
            /^source\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/,

        semanticVersion:
            /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/
    });

const DATE_PATTERN =
    /^\d{4}-\d{2}-\d{2}$/;

const DATE_TIME_PATTERN =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function asObject(value) {
    return (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
    )
        ? value
        : {};
}

function isPlainObject(value) {
    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {
        return false;
    }

    const prototype =
        Object.getPrototypeOf(value);

    return (
        prototype === Object.prototype ||
        prototype === null
    );
}

function cleanText(value) {
    return String(
        value ?? ""
    ).trim();
}

function createIssue(
    path,
    message
) {
    return Object.freeze({
        path:
            cleanText(path) ||
            "/",

        message:
            cleanText(message) ||
            "Traceability contract validation failed."
    });
}

export class TraceabilityContractError
    extends Error {
    constructor(issues) {
        const normalizedIssues =
            Object.freeze(
                (
                    Array.isArray(issues)
                        ? issues
                        : [issues]
                )
                    .filter(Boolean)
                    .map((issue) => {
                        const source =
                            asObject(issue);

                        return createIssue(
                            source.path,
                            source.message
                        );
                    })
            );

        const message =
            normalizedIssues.length
                ? normalizedIssues
                    .map(
                        (issue) =>
                            `${issue.path}: ${issue.message}`
                    )
                    .join("\n")
                : "Traceability contract validation failed.";

        super(message);

        this.name =
            "TraceabilityContractError";

        this.issues =
            normalizedIssues;
    }
}

function fail(
    path,
    message
) {
    throw new TraceabilityContractError([
        createIssue(
            path,
            message
        )
    ]);
}

function deepFreeze(value) {
    if (
        !value ||
        typeof value !== "object" ||
        Object.isFrozen(value)
    ) {
        return value;
    }

    Object.freeze(value);

    for (
        const nestedValue
        of Object.values(value)
    ) {
        deepFreeze(
            nestedValue
        );
    }

    return value;
}

function cloneJsonValue(
    value,
    path,
    options = {}
) {
    const allowNull =
        options.allowNull !== false;

    if (value === null) {
        if (allowNull) {
            return null;
        }

        fail(
            path,
            "A non-null JSON value is required."
        );
    }

    if (
        typeof value === "string" ||
        typeof value === "boolean"
    ) {
        return value;
    }

    if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            fail(
                path,
                "Numbers must be finite."
            );
        }

        return value;
    }

    if (Array.isArray(value)) {
        return value.map(
            (item, index) =>
                cloneJsonValue(
                    item,
                    `${path}/${index}`,
                    {
                        allowNull: true
                    }
                )
        );
    }

    if (isPlainObject(value)) {
        const clone = {};

        for (
            const [key, nestedValue]
            of Object.entries(value)
        ) {
            if (
                nestedValue === undefined ||
                typeof nestedValue ===
                    "function" ||
                typeof nestedValue ===
                    "symbol" ||
                typeof nestedValue ===
                    "bigint"
            ) {
                fail(
                    `${path}/${key}`,
                    "Metadata and fact values must be JSON-compatible."
                );
            }

            clone[key] =
                cloneJsonValue(
                    nestedValue,
                    `${path}/${key}`,
                    {
                        allowNull: true
                    }
                );
        }

        return clone;
    }

    fail(
        path,
        "The value must be JSON-compatible."
    );
}

function normalizeMetadata(
    value,
    path
) {
    const source =
        value === undefined
            ? {}
            : value;

    if (!isPlainObject(source)) {
        fail(
            path,
            "Metadata must be an object."
        );
    }

    return cloneJsonValue(
        source,
        path,
        {
            allowNull: false
        }
    );
}

function requireText(
    value,
    path
) {
    const text =
        cleanText(value);

    if (!text) {
        fail(
            path,
            "A non-empty string is required."
        );
    }

    return text;
}

function normalizeOptionalText(value) {
    return cleanText(value);
}

function requireIdentifier(
    value,
    pattern,
    path,
    label
) {
    const identifier =
        requireText(
            value,
            path
        );

    if (!pattern.test(identifier)) {
        fail(
            path,
            `${label} has an invalid format.`
        );
    }

    return identifier;
}

function requireEnum(
    value,
    allowedValues,
    path,
    label
) {
    const normalized =
        requireText(
            value,
            path
        );

    if (
        !allowedValues.includes(
            normalized
        )
    ) {
        fail(
            path,
            `${label} must be one of: ${allowedValues.join(", ")}.`
        );
    }

    return normalized;
}

function requireBoolean(
    value,
    path
) {
    if (
        typeof value !==
        "boolean"
    ) {
        fail(
            path,
            "A boolean value is required."
        );
    }

    return value;
}

function isValidDate(value) {
    if (!DATE_PATTERN.test(value)) {
        return false;
    }

    const timestamp =
        Date.parse(
            `${value}T00:00:00Z`
        );

    if (!Number.isFinite(timestamp)) {
        return false;
    }

    return new Date(timestamp)
        .toISOString()
        .slice(0, 10) === value;
}

function isValidDateTime(value) {
    return (
        DATE_TIME_PATTERN.test(value) &&
        Number.isFinite(
            Date.parse(value)
        )
    );
}

function requireDateTime(
    value,
    path,
    options = {}
) {
    if (
        options.allowNull === true &&
        (
            value === null ||
            value === undefined ||
            cleanText(value) === ""
        )
    ) {
        return null;
    }

    const dateTime =
        requireText(
            value,
            path
        );

    if (!isValidDateTime(dateTime)) {
        fail(
            path,
            "A valid ISO 8601 date-time with a timezone is required."
        );
    }

    return dateTime;
}

function requireReviewedAt(
    value,
    path
) {
    const reviewedAt =
        requireText(
            value,
            path
        );

    if (
        !isValidDate(reviewedAt) &&
        !isValidDateTime(reviewedAt)
    ) {
        fail(
            path,
            "A valid ISO date or date-time is required."
        );
    }

    return reviewedAt;
}

function requireHttpsUrl(
    value,
    path
) {
    const url =
        requireText(
            value,
            path
        );

    let parsed;

    try {
        parsed =
            new URL(url);
    } catch (error) {
        fail(
            path,
            "A valid URL is required."
        );
    }

    if (
        parsed.protocol !==
        "https:"
    ) {
        fail(
            path,
            "Source URLs must use HTTPS."
        );
    }

    return url;
}

function normalizeTextArray(
    value,
    path,
    options = {}
) {
    const source =
        value === undefined
            ? []
            : value;

    if (!Array.isArray(source)) {
        fail(
            path,
            "An array is required."
        );
    }

    const normalized =
        source.map(
            (item, index) =>
                requireText(
                    item,
                    `${path}/${index}`
                )
        );

    const unique =
        [...new Set(normalized)];

    if (
        unique.length !==
        normalized.length
    ) {
        fail(
            path,
            "Array values must be unique."
        );
    }

    if (
        Number.isInteger(
            options.minimum
        ) &&
        unique.length <
            options.minimum
    ) {
        fail(
            path,
            `At least ${options.minimum} value(s) are required.`
        );
    }

    return unique;
}

function normalizeIdentifierArray(
    value,
    pattern,
    path,
    label,
    options = {}
) {
    const identifiers =
        normalizeTextArray(
            value,
            path,
            options
        );

    for (
        let index = 0;
        index < identifiers.length;
        index += 1
    ) {
        if (
            !pattern.test(
                identifiers[index]
            )
        ) {
            fail(
                `${path}/${index}`,
                `${label} has an invalid format.`
            );
        }
    }

    return identifiers;
}

function normalizeConfirmedFact(
    input,
    path
) {
    const source =
        asObject(input);

    if (
        !Object.keys(source)
            .length
    ) {
        fail(
            path,
            "A confirmed fact object is required."
        );
    }

    return {
        id:
            requireIdentifier(
                source.id,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .fact,
                `${path}/id`,
                "Fact identifier"
            ),

        kind:
            "confirmed",

        label:
            requireText(
                source.label,
                `${path}/label`
            ),

        value:
            cloneJsonValue(
                source.value,
                `${path}/value`,
                {
                    allowNull:
                        false
                }
            ),

        answerKey:
            requireText(
                source.answerKey,
                `${path}/answerKey`
            ),

        recordedAt:
            requireDateTime(
                source.recordedAt,
                `${path}/recordedAt`,
                {
                    allowNull:
                        true
                }
            ),

        metadata:
            normalizeMetadata(
                source.metadata,
                `${path}/metadata`
            )
    };
}

function normalizeDerivedFact(
    input,
    path
) {
    const source =
        asObject(input);

    if (
        !Object.keys(source)
            .length
    ) {
        fail(
            path,
            "A derived fact object is required."
        );
    }

    return {
        id:
            requireIdentifier(
                source.id,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .fact,
                `${path}/id`,
                "Fact identifier"
            ),

        kind:
            "derived",

        label:
            requireText(
                source.label,
                `${path}/label`
            ),

        value:
            cloneJsonValue(
                source.value,
                `${path}/value`,
                {
                    allowNull:
                        false
                }
            ),

        derivedFrom:
            normalizeIdentifierArray(
                source.derivedFrom,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .fact,
                `${path}/derivedFrom`,
                "Fact identifier",
                {
                    minimum: 1
                }
            ),

        derivationRuleId:
            requireIdentifier(
                source.derivationRuleId,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .rule,
                `${path}/derivationRuleId`,
                "Rule identifier"
            ),

        metadata:
            normalizeMetadata(
                source.metadata,
                `${path}/metadata`
            )
    };
}

function normalizeSourceReference(
    input,
    path
) {
    const source =
        asObject(input);

    if (
        !Object.keys(source)
            .length
    ) {
        fail(
            path,
            "A source reference object is required."
        );
    }

    return {
        id:
            requireIdentifier(
                source.id,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .source,
                `${path}/id`,
                "Source identifier"
            ),

        title:
            requireText(
                source.title,
                `${path}/title`
            ),

        publisher:
            requireText(
                source.publisher,
                `${path}/publisher`
            ),

        url:
            requireHttpsUrl(
                source.url,
                `${path}/url`
            ),

        jurisdiction:
            requireText(
                source.jurisdiction,
                `${path}/jurisdiction`
            ),

        sourceType:
            requireEnum(
                source.sourceType,
                SOURCE_TYPES,
                `${path}/sourceType`,
                "Source type"
            ),

        reviewedAt:
            requireReviewedAt(
                source.reviewedAt,
                `${path}/reviewedAt`
            ),

        notes:
            normalizeOptionalText(
                source.notes
            ),

        official:
            requireBoolean(
                source.official,
                `${path}/official`
            )
    };
}

function assertStatusRequirements(
    record,
    path,
    statusProperty
) {
    const status =
        record[statusProperty];

    if (
        status ===
            APPLICABILITY_STATUS
                .MORE_INFORMATION_NEEDED &&
        record.missingFactIds
            .length === 0
    ) {
        fail(
            `${path}/missingFactIds`,
            "Missing fact identifiers are required when more information is needed."
        );
    }

    if (
        status ===
            APPLICABILITY_STATUS
                .NOT_CURRENTLY_APPLICABLE &&
        record.missingFactIds
            .length > 0
    ) {
        fail(
            `${path}/missingFactIds`,
            "A not-currently-applicable result cannot contain missing facts."
        );
    }

    if (
        [
            APPLICABILITY_STATUS
                .APPLICABLE,
            APPLICABILITY_STATUS
                .LIKELY_APPLICABLE,
            APPLICABILITY_STATUS
                .NOT_CURRENTLY_APPLICABLE
        ].includes(status) &&
        record.triggeringFactIds
            .length === 0
    ) {
        fail(
            `${path}/triggeringFactIds`,
            "Triggering fact identifiers are required for an evaluated applicability result."
        );
    }
}

function normalizeRuleEvaluation(
    input,
    path
) {
    const source =
        asObject(input);

    if (
        !Object.keys(source)
            .length
    ) {
        fail(
            path,
            "A rule evaluation object is required."
        );
    }

    const record = {
        ruleId:
            requireIdentifier(
                source.ruleId,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .rule,
                `${path}/ruleId`,
                "Rule identifier"
            ),

        ruleVersion:
            requireIdentifier(
                source.ruleVersion,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .semanticVersion,
                `${path}/ruleVersion`,
                "Rule version"
            ),

        status:
            requireEnum(
                source.status,
                APPLICABILITY_STATUSES,
                `${path}/status`,
                "Applicability status"
            ),

        reason:
            requireText(
                source.reason,
                `${path}/reason`
            ),

        requiredFactIds:
            normalizeIdentifierArray(
                source.requiredFactIds,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .fact,
                `${path}/requiredFactIds`,
                "Fact identifier",
                {
                    minimum: 1
                }
            ),

        triggeringFactIds:
            normalizeIdentifierArray(
                source.triggeringFactIds,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .fact,
                `${path}/triggeringFactIds`,
                "Fact identifier"
            ),

        missingFactIds:
            normalizeIdentifierArray(
                source.missingFactIds,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .fact,
                `${path}/missingFactIds`,
                "Fact identifier"
            ),

        sourceIds:
            normalizeIdentifierArray(
                source.sourceIds,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .source,
                `${path}/sourceIds`,
                "Source identifier",
                {
                    minimum: 1
                }
            ),

        evaluatedAt:
            requireDateTime(
                source.evaluatedAt,
                `${path}/evaluatedAt`
            ),

        metadata:
            normalizeMetadata(
                source.metadata,
                `${path}/metadata`
            )
    };

    assertStatusRequirements(
        record,
        path,
        "status"
    );

    return record;
}

function normalizeEvidence(
    input,
    path
) {
    const source =
        input === undefined
            ? {}
            : asObject(input);

    const status =
        requireEnum(
            source.status ??
                EVIDENCE_STATUS
                    .NOT_REQUESTED,
            EVIDENCE_STATUSES,
            `${path}/status`,
            "Evidence status"
        );

    const verified =
        status ===
            EVIDENCE_STATUS
                .VERIFIED;

    const verificationProcessId =
        verified
            ? requireText(
                source
                    .verificationProcessId,
                `${path}/verificationProcessId`
            )
            : null;

    const verifiedAt =
        verified
            ? requireDateTime(
                source.verifiedAt,
                `${path}/verifiedAt`
            )
            : null;

    if (
        !verified &&
        (
            cleanText(
                source
                    .verificationProcessId
            ) ||
            cleanText(
                source.verifiedAt
            )
        )
    ) {
        fail(
            path,
            "Verification details are allowed only when evidence status is verified."
        );
    }

    return {
        status,

        notes:
            normalizeOptionalText(
                source.notes
            ),

        verificationProcessId,

        verifiedAt
    };
}

function normalizeRecommendation(
    input,
    path
) {
    const source =
        asObject(input);

    if (
        !Object.keys(source)
            .length
    ) {
        fail(
            path,
            "A recommendation object is required."
        );
    }

    const record = {
        id:
            requireIdentifier(
                source.id,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .recommendation,
                `${path}/id`,
                "Recommendation identifier"
            ),

        ruleId:
            requireIdentifier(
                source.ruleId,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .rule,
                `${path}/ruleId`,
                "Rule identifier"
            ),

        applicabilityStatus:
            requireEnum(
                source.applicabilityStatus,
                APPLICABILITY_STATUSES,
                `${path}/applicabilityStatus`,
                "Applicability status"
            ),

        evidence:
            normalizeEvidence(
                source.evidence,
                `${path}/evidence`
            ),

        title:
            requireText(
                source.title,
                `${path}/title`
            ),

        reason:
            requireText(
                source.reason,
                `${path}/reason`
            ),

        action:
            requireText(
                source.action,
                `${path}/action`
            ),

        timeline:
            requireText(
                source.timeline,
                `${path}/timeline`
            ),

        triggeringFactIds:
            normalizeIdentifierArray(
                source.triggeringFactIds,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .fact,
                `${path}/triggeringFactIds`,
                "Fact identifier"
            ),

        missingFactIds:
            normalizeIdentifierArray(
                source.missingFactIds,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .fact,
                `${path}/missingFactIds`,
                "Fact identifier"
            ),

        sourceIds:
            normalizeIdentifierArray(
                source.sourceIds,
                TRACEABILITY_IDENTIFIER_PATTERNS
                    .source,
                `${path}/sourceIds`,
                "Source identifier",
                {
                    minimum: 1
                }
            ),

        limitations:
            normalizeTextArray(
                source.limitations,
                `${path}/limitations`
            ),

        metadata:
            normalizeMetadata(
                source.metadata,
                `${path}/metadata`
            )
    };

    assertStatusRequirements(
        record,
        path,
        "applicabilityStatus"
    );

    return record;
}

function registerUniqueIdentifiers(
    records,
    idProperty,
    path,
    label,
    issues
) {
    const registry =
        new Map();

    records.forEach(
        (record, index) => {
            const identifier =
                record[idProperty];

            if (
                registry.has(
                    identifier
                )
            ) {
                issues.push(
                    createIssue(
                        `${path}/${index}/${idProperty}`,
                        `${label} "${identifier}" duplicates ${registry.get(identifier)}.`
                    )
                );

                return;
            }

            registry.set(
                identifier,
                `${path}/${index}/${idProperty}`
            );
        }
    );

    return registry;
}

function collectReferenceIssues(bundle) {
    const issues = [];

    const allFacts = [
        ...bundle.facts.confirmed,
        ...bundle.facts.derived
    ];

    const factRegistry =
        registerUniqueIdentifiers(
            allFacts,
            "id",
            "/facts/all",
            "Fact identifier",
            issues
        );

    const ruleRegistry =
        registerUniqueIdentifiers(
            bundle.ruleEvaluations,
            "ruleId",
            "/ruleEvaluations",
            "Rule identifier",
            issues
        );

    registerUniqueIdentifiers(
        bundle.recommendations,
        "id",
        "/recommendations",
        "Recommendation identifier",
        issues
    );

    const sourceRegistry =
        registerUniqueIdentifiers(
            bundle.sources,
            "id",
            "/sources",
            "Source identifier",
            issues
        );

    bundle.facts.derived.forEach(
        (fact, factIndex) => {
            fact.derivedFrom.forEach(
                (
                    identifier,
                    identifierIndex
                ) => {
                    if (
                        !factRegistry.has(
                            identifier
                        )
                    ) {
                        issues.push(
                            createIssue(
                                `/facts/derived/${factIndex}/derivedFrom/${identifierIndex}`,
                                `Derived fact source "${identifier}" does not resolve to a supplied fact.`
                            )
                        );
                    }
                }
            );
        }
    );

    bundle.ruleEvaluations.forEach(
        (
            evaluation,
            evaluationIndex
        ) => {
            evaluation
                .triggeringFactIds
                .forEach(
                    (
                        identifier,
                        identifierIndex
                    ) => {
                        if (
                            !factRegistry.has(
                                identifier
                            )
                        ) {
                            issues.push(
                                createIssue(
                                    `/ruleEvaluations/${evaluationIndex}/triggeringFactIds/${identifierIndex}`,
                                    `Triggering fact "${identifier}" does not resolve to a supplied fact.`
                                )
                            );
                        }
                    }
                );

            evaluation
                .missingFactIds
                .forEach(
                    (
                        identifier,
                        identifierIndex
                    ) => {
                        if (
                            factRegistry.has(
                                identifier
                            )
                        ) {
                            issues.push(
                                createIssue(
                                    `/ruleEvaluations/${evaluationIndex}/missingFactIds/${identifierIndex}`,
                                    `Missing fact "${identifier}" is already present in the supplied facts.`
                                )
                            );
                        }
                    }
                );

            evaluation.sourceIds.forEach(
                (
                    identifier,
                    identifierIndex
                ) => {
                    if (
                        !sourceRegistry.has(
                            identifier
                        )
                    ) {
                        issues.push(
                            createIssue(
                                `/ruleEvaluations/${evaluationIndex}/sourceIds/${identifierIndex}`,
                                `Source "${identifier}" does not resolve to a supplied source reference.`
                            )
                        );
                    }
                }
            );
        }
    );

    bundle.recommendations.forEach(
        (
            recommendation,
            recommendationIndex
        ) => {
            const rulePath =
                ruleRegistry.get(
                    recommendation.ruleId
                );

            if (!rulePath) {
                issues.push(
                    createIssue(
                        `/recommendations/${recommendationIndex}/ruleId`,
                        `Rule "${recommendation.ruleId}" does not resolve to a rule evaluation.`
                    )
                );
            } else {
                const evaluation =
                    bundle.ruleEvaluations
                        .find(
                            (candidate) =>
                                candidate.ruleId ===
                                recommendation
                                    .ruleId
                        );

                if (
                    evaluation.status !==
                    recommendation
                        .applicabilityStatus
                ) {
                    issues.push(
                        createIssue(
                            `/recommendations/${recommendationIndex}/applicabilityStatus`,
                            `Recommendation status must match rule evaluation status "${evaluation.status}".`
                        )
                    );
                }
            }

            recommendation
                .triggeringFactIds
                .forEach(
                    (
                        identifier,
                        identifierIndex
                    ) => {
                        if (
                            !factRegistry.has(
                                identifier
                            )
                        ) {
                            issues.push(
                                createIssue(
                                    `/recommendations/${recommendationIndex}/triggeringFactIds/${identifierIndex}`,
                                    `Triggering fact "${identifier}" does not resolve to a supplied fact.`
                                )
                            );
                        }
                    }
                );

            recommendation
                .missingFactIds
                .forEach(
                    (
                        identifier,
                        identifierIndex
                    ) => {
                        if (
                            factRegistry.has(
                                identifier
                            )
                        ) {
                            issues.push(
                                createIssue(
                                    `/recommendations/${recommendationIndex}/missingFactIds/${identifierIndex}`,
                                    `Missing fact "${identifier}" is already present in the supplied facts.`
                                )
                            );
                        }
                    }
                );

            recommendation.sourceIds.forEach(
                (
                    identifier,
                    identifierIndex
                ) => {
                    if (
                        !sourceRegistry.has(
                            identifier
                        )
                    ) {
                        issues.push(
                            createIssue(
                                `/recommendations/${recommendationIndex}/sourceIds/${identifierIndex}`,
                                `Source "${identifier}" does not resolve to a supplied source reference.`
                            )
                        );
                    }
                }
            );
        }
    );

    return issues;
}

export function isApplicabilityStatus(
    value
) {
    return APPLICABILITY_STATUSES
        .includes(value);
}

export function isEvidenceStatus(
    value
) {
    return EVIDENCE_STATUSES
        .includes(value);
}

export function isSourceType(
    value
) {
    return SOURCE_TYPES
        .includes(value);
}

export function createConfirmedFact(
    input
) {
    return deepFreeze(
        normalizeConfirmedFact(
            input,
            "/confirmedFact"
        )
    );
}

export function createDerivedFact(
    input
) {
    return deepFreeze(
        normalizeDerivedFact(
            input,
            "/derivedFact"
        )
    );
}

export function createSourceReference(
    input
) {
    return deepFreeze(
        normalizeSourceReference(
            input,
            "/sourceReference"
        )
    );
}

export function createRuleEvaluation(
    input
) {
    return deepFreeze(
        normalizeRuleEvaluation(
            input,
            "/ruleEvaluation"
        )
    );
}

export function createEvidence(
    input
) {
    return deepFreeze(
        normalizeEvidence(
            input,
            "/evidence"
        )
    );
}

export function createRecommendation(
    input
) {
    return deepFreeze(
        normalizeRecommendation(
            input,
            "/recommendation"
        )
    );
}

export function createTraceabilityBundle(
    input = {}
) {
    const source =
        asObject(input);

    const suppliedVersion =
        source.contractVersion ??
        TRACEABILITY_CONTRACT_VERSION;

    if (
        suppliedVersion !==
        TRACEABILITY_CONTRACT_VERSION
    ) {
        fail(
            "/contractVersion",
            `Contract version must be ${TRACEABILITY_CONTRACT_VERSION}.`
        );
    }

    const facts =
        asObject(
            source.facts
        );

    const confirmed =
        Array.isArray(
            facts.confirmed
        )
            ? facts.confirmed
            : [];

    const derived =
        Array.isArray(
            facts.derived
        )
            ? facts.derived
            : [];

    const ruleEvaluations =
        Array.isArray(
            source.ruleEvaluations
        )
            ? source.ruleEvaluations
            : [];

    const recommendations =
        Array.isArray(
            source.recommendations
        )
            ? source.recommendations
            : [];

    const sources =
        Array.isArray(
            source.sources
        )
            ? source.sources
            : [];

    const bundle = {
        contractVersion:
            TRACEABILITY_CONTRACT_VERSION,

        generatedAt:
            requireDateTime(
                source.generatedAt,
                "/generatedAt"
            ),

        facts: {
            confirmed:
                confirmed.map(
                    (fact, index) =>
                        normalizeConfirmedFact(
                            fact,
                            `/facts/confirmed/${index}`
                        )
                ),

            derived:
                derived.map(
                    (fact, index) =>
                        normalizeDerivedFact(
                            fact,
                            `/facts/derived/${index}`
                        )
                )
        },

        ruleEvaluations:
            ruleEvaluations.map(
                (
                    evaluation,
                    index
                ) =>
                    normalizeRuleEvaluation(
                        evaluation,
                        `/ruleEvaluations/${index}`
                    )
            ),

        recommendations:
            recommendations.map(
                (
                    recommendation,
                    index
                ) =>
                    normalizeRecommendation(
                        recommendation,
                        `/recommendations/${index}`
                    )
            ),

        sources:
            sources.map(
                (
                    sourceReference,
                    index
                ) =>
                    normalizeSourceReference(
                        sourceReference,
                        `/sources/${index}`
                    )
            ),

        limitations:
            normalizeTextArray(
                source.limitations,
                "/limitations"
            ),

        metadata:
            normalizeMetadata(
                source.metadata,
                "/metadata"
            )
    };

    const referenceIssues =
        collectReferenceIssues(
            bundle
        );

    if (
        referenceIssues.length
    ) {
        throw new TraceabilityContractError(
            referenceIssues
        );
    }

    return deepFreeze(
        bundle
    );
}

export function validateTraceabilityBundle(
    input
) {
    try {
        const value =
            createTraceabilityBundle(
                input
            );

        return Object.freeze({
            valid:
                true,

            value,

            errors:
                Object.freeze([])
        });
    } catch (error) {
        const errors =
            error instanceof
                TraceabilityContractError
                ? error.issues
                : Object.freeze([
                    createIssue(
                        "/",
                        error?.message ||
                            "Unknown traceability contract error."
                    )
                ]);

        return Object.freeze({
            valid:
                false,

            value:
                null,

            errors
        });
    }
}

export default Object.freeze({
    contractVersion:
        TRACEABILITY_CONTRACT_VERSION,

    schemaId:
        TRACEABILITY_SCHEMA_ID,

    applicabilityStatus:
        APPLICABILITY_STATUS,

    evidenceStatus:
        EVIDENCE_STATUS,

    sourceType:
        SOURCE_TYPE,

    createConfirmedFact,
    createDerivedFact,
    createSourceReference,
    createRuleEvaluation,
    createEvidence,
    createRecommendation,
    createTraceabilityBundle,
    validateTraceabilityBundle
});
