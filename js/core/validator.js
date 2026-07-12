/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Core Validator
 * -----------------------------------------------------------------------------
 * File      : js/core/validator.js
 * Version   : 1.0.0
 * =============================================================================
 */

import schemaRegistry from "./schema.js";
import logger from "./logger.js";

class Validator {

    constructor() {

        this.errors = [];

    }

    validate(schemaName, data) {

        this.errors = [];

        const schema = schemaRegistry.get(schemaName);

        if (!schema) {

            this.errors.push({
                field: schemaName,
                message: "Schema not found."
            });

            return this.result();

        }

        this.validateObject(schema, data);

        logger.info("Validation completed.", {
            schema: schemaName,
            valid: this.errors.length === 0
        });

        return this.result();

    }

    validateObject(schema, object, parent = "") {

        Object.entries(schema).forEach(([field, expectedType]) => {

            const path = parent
                ? `${parent}.${field}`
                : field;

            const value = object?.[field];

            if (value === undefined || value === null) {

                this.errors.push({
                    field: path,
                    message: "Required field missing."
                });

                return;

            }

            if (!this.checkType(value, expectedType)) {

                this.errors.push({
                    field: path,
                    expected: expectedType,
                    received: this.typeOf(value),
                    message: "Invalid data type."
                });

            }

        });

    }

    checkType(value, expected) {

        switch (expected) {

            case "string":
                return typeof value === "string";

            case "number":
                return typeof value === "number" &&
                    Number.isFinite(value);

            case "boolean":
                return typeof value === "boolean";

            case "array":
                return Array.isArray(value);

            case "object":
                return (
                    typeof value === "object" &&
                    value !== null &&
                    !Array.isArray(value)
                );

            case "date":
                return value instanceof Date;

            default:
                return true;

        }

    }

    typeOf(value) {

        if (Array.isArray(value)) {
            return "array";
        }

        if (value instanceof Date) {
            return "date";
        }

        return typeof value;

    }

    result() {

        return Object.freeze({

            valid: this.errors.length === 0,

            errorCount: this.errors.length,

            errors: [...this.errors]

        });

    }

    hasErrors() {

        return this.errors.length > 0;

    }

    getErrors() {

        return [...this.errors];

    }

    clear() {

        this.errors.length = 0;

    }

}

const validator = new Validator();

export { Validator };

export default validator;
