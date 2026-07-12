/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/core/intelligence-engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import { EVENTS } from "../shared/constants/index.js";
import { createId, cloneObject, timestamp } from "../shared/utils/index.js";

import companyDNA from "./company-dna.js";
import ruleEngine from "./rule-engine.js";
import eventBus from "./event-bus.js";
import logger from "./logger.js";

class IntelligenceEngine {

    constructor() {

        this.modules = new Map();

    }

    register(module = {}) {

        if (!module.name) {
            throw new Error("Module name is required.");
        }

        if (typeof module.analyze !== "function") {
            throw new Error("Module analyze() function is required.");
        }

        this.modules.set(module.name, {

            id: module.id || createId("module"),

            name: module.name,

            version: module.version || "1.0.0",

            enabled: module.enabled !== false,

            analyze: module.analyze

        });

        logger.info("Intelligence module registered.", {
            module: module.name
        });

    }

    unregister(name) {

        return this.modules.delete(name);

    }

    exists(name) {

        return this.modules.has(name);

    }

    get(name) {

        const module = this.modules.get(name);

        if (!module) {
            return null;
        }

        return {

            id: module.id,

            name: module.name,

            version: module.version,

            enabled: module.enabled

        };

    }

    modulesList() {

        return [...this.modules.values()].map(module => ({

            id: module.id,

            name: module.name,

            version: module.version,

            enabled: module.enabled

        }));

    }

    analyze(name, context = {}) {

        const module = this.modules.get(name);

        if (!module) {
            throw new Error(`Module '${name}' not found.`);
        }

        if (!module.enabled) {

            return {

                executed: false,

                skipped: true,

                module: name

            };

        }

        const dna = companyDNA.get();

        const rules = ruleEngine.executeModule(
            name,
            dna
        );

        const result = module.analyze({

            company: cloneObject(dna),

            rules,

            context: cloneObject(context)

        });

        const intelligence = {

            id: createId("intelligence"),

            module: name,

            generatedAt: timestamp(),

            result

        };

        eventBus.emit(
            EVENTS.INTELLIGENCE_UPDATED,
            intelligence
        );

        logger.info("Intelligence generated.", {
            module: name
        });

        return intelligence;

    }

    analyzeAll(context = {}) {

        const output = [];

        for (const module of this.modules.values()) {

            if (!module.enabled) {
                continue;
            }

            output.push(

                this.analyze(
                    module.name,
                    context
                )

            );

        }

        return output;

    }

    enable(name) {

        const module = this.modules.get(name);

        if (module) {
            module.enabled = true;
        }

    }

    disable(name) {

        const module = this.modules.get(name);

        if (module) {
            module.enabled = false;
        }

    }

    clear() {

        this.modules.clear();

    }

    statistics() {

        return {

            registeredModules: this.modules.size,

            enabledModules:
                [...this.modules.values()]
                    .filter(module => module.enabled)
                    .length

        };

    }

}

const intelligenceEngine = new IntelligenceEngine();

export { IntelligenceEngine };

export default intelligenceEngine;
