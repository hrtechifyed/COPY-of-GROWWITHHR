/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Core Schema Registry
 * -----------------------------------------------------------------------------
 * File      : js/core/schema.js
 * Version   : 1.0.0
 * =============================================================================
 */

import { MODULES } from "../shared/constants/index.js";
import logger from "./logger.js";

class SchemaRegistry {

    constructor() {

        this.schemas = new Map();

    }

    register(name, schema) {

        if (!name || typeof name !== "string") {
            throw new TypeError("Schema name is required.");
        }

        if (!schema || typeof schema !== "object") {
            throw new TypeError("Schema must be an object.");
        }

        this.schemas.set(
            name,
            structuredClone(schema)
        );

        logger.info("Schema registered.", {
            schema: name
        });

        return this;

    }

    update(name, schema) {

        if (!this.schemas.has(name)) {
            throw new Error(`Schema '${name}' does not exist.`);
        }

        this.schemas.set(
            name,
            structuredClone(schema)
        );

        logger.info("Schema updated.", {
            schema: name
        });

        return this;

    }

    get(name) {

        if (!this.schemas.has(name)) {
            return null;
        }

        return structuredClone(
            this.schemas.get(name)
        );

    }

    has(name) {

        return this.schemas.has(name);

    }

    remove(name) {

        return this.schemas.delete(name);

    }

    clear() {

        this.schemas.clear();

    }

    names() {

        return [...this.schemas.keys()];

    }

    count() {

        return this.schemas.size;

    }

    export() {

        const output = {};

        for (const [name, schema] of this.schemas.entries()) {

            output[name] = structuredClone(schema);

        }

        return output;

    }

    import(data = {}) {

        this.clear();

        Object.entries(data).forEach(([name, schema]) => {

            this.register(name, schema);

        });

    }

    initialize() {

        this.register(MODULES.COMPANY_DNA, {

            company: "object",
            industry: "object",
            geography: "object",
            workforce: "object",
            organization: "object",
            business: "object",
            compliance: "object",
            metadata: "object"

        });

        this.register(MODULES.RECOMMENDATION_ENGINE, {

            id: "string",
            module: "string",
            title: "string",
            description: "string",
            priority: "string",
            status: "string"

        });

        this.register(MODULES.REPORT_ENGINE, {

            reportId: "string",
            company: "string",
            generatedAt: "string",
            score: "number",
            sections: "array"

        });

        logger.info("Default schemas initialized.");

    }

}

const schemaRegistry = new SchemaRegistry();

schemaRegistry.initialize();

export { SchemaRegistry };

export default schemaRegistry;
