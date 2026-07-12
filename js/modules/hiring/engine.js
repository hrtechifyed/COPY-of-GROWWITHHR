/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Hiring Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/modules/hiring/engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import recommendationEngine from "../../core/recommendation-engine.js";
import knowledgeLibrary from "../../core/knowledge-library.js";

class HiringEngine {

    analyze({
        company,
        rules,
        context = {}
    }) {

        const findings = [];
        const recommendations = [];
        const risks = [];

        let score = 100;

        /*
        |--------------------------------------------------------------------------
        | Rule Evaluation
        |--------------------------------------------------------------------------
        */

        rules.forEach(rule => {

            findings.push({
                rule: rule.rule,
                result: rule.result
            });

            if (
                rule.result &&
                rule.result.passed === false
            ) {

                score -= 10;

                risks.push({
                    rule: rule.rule,
                    message: rule.result.message
                });

            }

        });

        /*
        |--------------------------------------------------------------------------
        | Hiring Readiness
        |--------------------------------------------------------------------------
        */

        if (
            company.organization.departments.length === 0
        ) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "hiring",

                    category: "Organization",

                    title: "Define Departments",

                    description:
                        "Create departments before scaling hiring.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Growth Stage
        |--------------------------------------------------------------------------
        */

        if (!company.business.growthStage) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "hiring",

                    category: "Planning",

                    title: "Define Growth Stage",

                    description:
                        "Growth stage enables hiring strategy recommendations.",

                    priority: "Medium",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Workforce Planning
        |--------------------------------------------------------------------------
        */

        if (
            company.workforce.totalEmployees >= 50 &&
            company.organization.reportingLevels === 0
        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "hiring",

                    category: "Planning",

                    title: "Build Workforce Plan",

                    description:
                        "Formal workforce planning is recommended beyond 50 employees.",

                    priority: "Medium",

                    type: "Action"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | References
        |--------------------------------------------------------------------------
        */

        const templates =
            knowledgeLibrary.getCategory("templates");

        return {

            module: "hiring",

            score: Math.max(score, 0),

            findings,

            risks,

            recommendations,

            references: {

                templates,

                context

            }

        };

    }

}

const hiringEngine =
    new HiringEngine();

export { HiringEngine };

export default hiringEngine;
