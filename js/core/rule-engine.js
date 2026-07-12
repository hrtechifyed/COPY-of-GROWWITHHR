/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Rule Engine
 * -----------------------------------------------------------------------------
 * File      : js/core/rule-engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import { EVENTS } from "../shared/constants/index.js";
import { createId, cloneObject } from "../shared/utils/index.js";

import eventBus from "./event-bus.js";
import logger from "./logger.js";

class RuleEngine {

    constructor() {

        this.rules = new Map();

    }

    register(rule = {}) {

        if (!rule.name) {
            throw new Error("Rule name is required.");
        }

        if (typeof rule.execute !== "function") {
            throw new Error("Rule execute function is required.");
        }

        const definition = {

            id: rule.id || createId("rule"),

            module: rule.module || "core",

            name: rule.name,

            description: rule.description || "",

            priority: rule.priority || "Medium",

            enabled: rule.enabled !== false,

            execute: rule.execute

        };

        this.rules.set(
            definition.name,
            definition
        );

        logger.info("Rule registered.", {
            rule: definition.name
        });

      eventBus.emit(
    EVENTS.RULE_ENGINE_READY,
    {
        id: definition.id,
        module: definition.module,
        name: definition.name,
        description: definition.description,
        priority: definition.priority,
        enabled: definition.enabled
    }
);
        return definition.id;

    }

    unregister(name) {

        return this.rules.delete(name);

    }

    exists(name) {

        return this.rules.has(name);

    }

    get(name) {

        if (!this.rules.has(name)) {
            return null;
        }

        const rule = this.rules.get(name);

        return {

            id: rule.id,
            module: rule.module,
            name: rule.name,
            description: rule.description,
            priority: rule.priority,
            enabled: rule.enabled

        };

    }

    list() {

        return [...this.rules.values()].map(rule => ({

            id: rule.id,
            module: rule.module,
            name: rule.name,
            description: rule.description,
            priority: rule.priority,
            enabled: rule.enabled

        }));

    }

    execute(name, context = {}) {

        const rule = this.rules.get(name);

        if (!rule) {
            throw new Error(`Rule '${name}' not found.`);
        }

        if (!rule.enabled) {

            return {

                executed: false,
                skipped: true,
                result: null

            };

        }

        logger.info("Executing rule.", {
            rule: name
        });

        const result = rule.execute(
            cloneObject(context)
        );

        return {

            executed: true,

            skipped: false,

            rule: name,

            result

        };

    }

    executeModule(module, context = {}) {

        const results = [];

        for (const rule of this.rules.values()) {

            if (
                rule.module !== module ||
                !rule.enabled
            ) {
                continue;
            }

            results.push({

                rule: rule.name,

                result: rule.execute(
                    cloneObject(context)
                )

            });

        }

        return results;

    }

    executeAll(context = {}) {

        const output = [];

        for (const rule of this.rules.values()) {

            if (!rule.enabled) {
                continue;
            }

            output.push({

                module: rule.module,

                rule: rule.name,

                result: rule.execute(
                    cloneObject(context)
                )

            });

        }

        return output;

    }

    enable(name) {

        const rule = this.rules.get(name);

        if (rule) {
            rule.enabled = true;
        }

    }

    disable(name) {

        const rule = this.rules.get(name);

        if (rule) {
            rule.enabled = false;
        }

    }

    clear() {

        this.rules.clear();

    }

    statistics() {

        const modules = {};

        for (const rule of this.rules.values()) {

            modules[rule.module] =
                (modules[rule.module] || 0) + 1;

        }

        return {

            totalRules: this.rules.size,

            modules

        };

    }

}

const ruleEngine = new RuleEngine();

export { RuleEngine };

export default ruleEngine;
