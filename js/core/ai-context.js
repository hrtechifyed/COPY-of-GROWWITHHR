/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * AI Context Engine
 * -----------------------------------------------------------------------------
 * File      : js/core/ai-context.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "./company-dna.js";
import knowledgeLibrary from "./knowledge-library.js";
import recommendationEngine from "./recommendation-engine.js";
import notificationEngine from "./notification-engine.js";
import reportEngine from "./report-engine.js";

import {
    cloneObject,
    timestamp
} from "../shared/utils/index.js";

class AIContext {

    constructor() {

        this.version = "1.0.0";

    }

    build(module = "core", userPrompt = "") {

        const dna = companyDNA.get();

        return {

            version: this.version,

            generatedAt: timestamp(),

            module,

            prompt: userPrompt,

            company: {

                legalName: dna.company.legalName,

                displayName: dna.company.displayName,

                entityType: dna.company.entityType,

                industry: dna.industry.sector,

                subSector: dna.industry.subSector,

                businessModel: dna.business.businessModel,

                growthStage: dna.business.growthStage,

                headquarters: cloneObject(
                    dna.geography.headquarters
                ),

                workforce: cloneObject(
                    dna.workforce
                )

            },

            organization: cloneObject(
                dna.organization
            ),

            compliance: cloneObject(
                dna.compliance
            ),

            knowledge: {

                laws:
                    knowledgeLibrary.getCategory("laws"),

                policies:
                    knowledgeLibrary.getCategory("policies"),

                templates:
                    knowledgeLibrary.getCategory("templates"),

                frameworks:
                    knowledgeLibrary.getCategory("frameworks")

            },

            recommendations:
                recommendationEngine.listByModule(module),

            notifications:
                notificationEngine.listByModule(module),

            reports:
                reportEngine.listByModule(module)

        };

    }

    summary(module = "core") {

        const context = this.build(module);

        return {

            company:
                context.company.displayName,

            industry:
                context.company.industry,

            employees:
                context.company.workforce.totalEmployees,

            growthStage:
                context.company.growthStage,

            recommendations:
                context.recommendations.length,

            notifications:
                context.notifications.length,

            reports:
                context.reports.length

        };

    }

}

const aiContext = new AIContext();

export { AIContext };

export default aiContext;
