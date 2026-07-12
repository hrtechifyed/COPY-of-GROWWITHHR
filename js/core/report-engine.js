/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Report Engine
 * -----------------------------------------------------------------------------
 * File      : js/core/report-engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import {
    EVENTS,
    REPORT_TYPES
} from "../shared/constants/index.js";

import {
    createId,
    timestamp,
    cloneObject
} from "../shared/utils/index.js";

import companyDNA from "./company-dna.js";
import recommendationEngine from "./recommendation-engine.js";
import eventBus from "./event-bus.js";
import logger from "./logger.js";

class ReportEngine {

    constructor() {

        this.reports = new Map();

    }

    generate({

        type = REPORT_TYPES.PEOPLE_INTELLIGENCE,

        module = "core",

        title = "",

        score = 0,

        findings = [],

        recommendations = []

    } = {}) {

        const dna = companyDNA.get();

        const report = {

            id: createId("report"),

            type,

            module,

            title,

            generatedAt: timestamp(),

            company: {

                id: dna.id,

                legalName: dna.company.legalName,

                displayName: dna.company.displayName,

                entityType: dna.company.entityType,

                industry: dna.industry.sector,

                headquarters: cloneObject(
                    dna.geography.headquarters
                ),

                workforce: cloneObject(
                    dna.workforce
                )

            },

            score,

            findings: cloneObject(findings),

            recommendations: recommendations.length
                ? cloneObject(recommendations)
                : recommendationEngine.listByModule(module),

            metadata: {

                version: "1.0.0",

                createdBy: "Report Engine"

            }

        };

        this.reports.set(
            report.id,
            report
        );

        eventBus.emit(
            EVENTS.REPORT_GENERATED,
            cloneObject(report)
        );

        logger.info(
            "Report generated.",
            {
                id: report.id,
                module,
                type
            }
        );

        return cloneObject(report);

    }

    get(id) {

        const report = this.reports.get(id);

        return report
            ? cloneObject(report)
            : null;

    }

    list() {

        return [...this.reports.values()]
            .map(cloneObject);

    }

    listByModule(module) {

        return this.list().filter(
            report => report.module === module
        );

    }

    listByType(type) {

        return this.list().filter(
            report => report.type === type
        );

    }

    remove(id) {

        return this.reports.delete(id);

    }

    clear() {

        this.reports.clear();

    }

    statistics() {

        const statistics = {

            totalReports: this.reports.size,

            reportTypes: {},

            modules: {}

        };

        for (const report of this.reports.values()) {

            statistics.reportTypes[
                report.type
            ] =
                (statistics.reportTypes[
                    report.type
                ] || 0) + 1;

            statistics.modules[
                report.module
            ] =
                (statistics.modules[
                    report.module
                ] || 0) + 1;

        }

        return statistics;

    }

}

const reportEngine = new ReportEngine();

export { ReportEngine };

export default reportEngine;
