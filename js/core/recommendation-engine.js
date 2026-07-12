/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Recommendation Engine
 * -----------------------------------------------------------------------------
 * File      : js/core/recommendation-engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import { EVENTS } from "../shared/constants/index.js";
import {
    createId,
    cloneObject,
    timestamp
} from "../shared/utils/index.js";

import eventBus from "./event-bus.js";
import logger from "./logger.js";

class RecommendationEngine {

    constructor() {

        this.recommendations = new Map();

    }

    create(recommendation = {}) {

        const record = {

            id: recommendation.id || createId("recommendation"),

            module: recommendation.module || "core",

            category: recommendation.category || "General",

            title: recommendation.title || "",

            description: recommendation.description || "",

            priority: recommendation.priority || "Medium",

            type: recommendation.type || "Action",

            owner: recommendation.owner || "",

            dueDate: recommendation.dueDate || null,

            status: recommendation.status || "Open",

            references: recommendation.references || [],

            metadata: recommendation.metadata || {},

            createdAt: timestamp(),

            updatedAt: timestamp()

        };

        this.recommendations.set(
            record.id,
            record
        );

        eventBus.emit(
            EVENTS.RECOMMENDATION_CREATED,
            cloneObject(record)
        );

        logger.info(
            "Recommendation created.",
            {
                id: record.id,
                module: record.module
            }
        );

        return cloneObject(record);

    }

    update(id, updates = {}) {

        const record = this.recommendations.get(id);

        if (!record) {
            throw new Error(
                `Recommendation '${id}' not found.`
            );
        }

        Object.assign(record, updates);

        record.updatedAt = timestamp();

        logger.info(
            "Recommendation updated.",
            { id }
        );

        return cloneObject(record);

    }

    remove(id) {

        return this.recommendations.delete(id);

    }

    clear() {

        this.recommendations.clear();

    }

    get(id) {

        const record = this.recommendations.get(id);

        return record
            ? cloneObject(record)
            : null;

    }

    list() {

        return [...this.recommendations.values()]
            .map(cloneObject);

    }

    listByModule(module) {

        return this.list().filter(
            recommendation =>
                recommendation.module === module
        );

    }

    listByPriority(priority) {

        return this.list().filter(
            recommendation =>
                recommendation.priority === priority
        );

    }

    listByStatus(status) {

        return this.list().filter(
            recommendation =>
                recommendation.status === status
        );

    }

    open() {

        return this.listByStatus("Open");

    }

    completed() {

        return this.listByStatus("Completed");

    }

    statistics() {

        const statistics = {

            total: this.recommendations.size,

            open: 0,

            completed: 0,

            modules: {}

        };

        for (const recommendation of this.recommendations.values()) {

            if (recommendation.status === "Open") {
                statistics.open++;
            }

            if (recommendation.status === "Completed") {
                statistics.completed++;
            }

            statistics.modules[
                recommendation.module
            ] =
                (statistics.modules[
                    recommendation.module
                ] || 0) + 1;

        }

        return statistics;

    }

}

const recommendationEngine =
    new RecommendationEngine();

export { RecommendationEngine };

export default recommendationEngine;
