/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Core Error Classes
 * -----------------------------------------------------------------------------
 * File      : js/core/errors.js
 * Version   : 1.0.0
 * =============================================================================
 */

class GrowWithHRError extends Error {

    constructor(
        message = "GrowWithHR Error",
        code = "GWHR_ERROR",
        details = {}
    ) {

        super(message);

        this.name = this.constructor.name;
        this.code = code;
        this.details = Object.freeze({ ...details });
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace?.(this, this.constructor);

    }

    toJSON() {

        return {
            name: this.name,
            code: this.code,
            message: this.message,
            details: this.details,
            timestamp: this.timestamp,
            stack: this.stack
        };

    }

}

class ValidationError extends GrowWithHRError {

    constructor(message = "Validation failed", details = {}) {

        super(
            message,
            "VALIDATION_ERROR",
            details
        );

    }

}

class ConfigurationError extends GrowWithHRError {

    constructor(message = "Configuration error", details = {}) {

        super(
            message,
            "CONFIGURATION_ERROR",
            details
        );

    }

}

class PersistenceError extends GrowWithHRError {

    constructor(message = "Persistence error", details = {}) {

        super(
            message,
            "PERSISTENCE_ERROR",
            details
        );

    }

}

class RuleEngineError extends GrowWithHRError {

    constructor(message = "Rule engine error", details = {}) {

        super(
            message,
            "RULE_ENGINE_ERROR",
            details
        );

    }

}

class IntelligenceError extends GrowWithHRError {

    constructor(message = "Intelligence engine error", details = {}) {

        super(
            message,
            "INTELLIGENCE_ENGINE_ERROR",
            details
        );

    }

}

class RecommendationError extends GrowWithHRError {

    constructor(message = "Recommendation engine error", details = {}) {

        super(
            message,
            "RECOMMENDATION_ENGINE_ERROR",
            details
        );

    }

}

class ReportError extends GrowWithHRError {

    constructor(message = "Report generation error", details = {}) {

        super(
            message,
            "REPORT_ENGINE_ERROR",
            details
        );

    }

}

class NotificationError extends GrowWithHRError {

    constructor(message = "Notification error", details = {}) {

        super(
            message,
            "NOTIFICATION_ERROR",
            details
        );

    }

}

class KnowledgeLibraryError extends GrowWithHRError {

    constructor(message = "Knowledge library error", details = {}) {

        super(
            message,
            "KNOWLEDGE_LIBRARY_ERROR",
            details
        );

    }

}

class CompanyDNAError extends GrowWithHRError {

    constructor(message = "Company DNA error", details = {}) {

        super(
            message,
            "COMPANY_DNA_ERROR",
            details
        );

    }

}

export {
    GrowWithHRError,
    ValidationError,
    ConfigurationError,
    PersistenceError,
    RuleEngineError,
    IntelligenceError,
    RecommendationError,
    ReportError,
    NotificationError,
    KnowledgeLibraryError,
    CompanyDNAError
};

export default Object.freeze({
    GrowWithHRError,
    ValidationError,
    ConfigurationError,
    PersistenceError,
    RuleEngineError,
    IntelligenceError,
    RecommendationError,
    ReportError,
    NotificationError,
    KnowledgeLibraryError,
    CompanyDNAError
});
