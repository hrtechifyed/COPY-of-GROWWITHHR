/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Performance Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/modules/performance/engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import recommendationEngine from "../../core/recommendation-engine.js";
import knowledgeLibrary from "../../core/knowledge-library.js";

class PerformanceEngine {

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
        | Organization Readiness
        |--------------------------------------------------------------------------
        */

        if (
            company.organization.departments.length === 0
        ) {

            score -= 20;

            recommendations.push(

                recommendationEngine.create({

                    module: "performance",

                    category: "Organization",

                    title: "Create Department Structure",

                    description:
                        "Departments should be defined before implementing a performance management framework.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Reporting Hierarchy
        |--------------------------------------------------------------------------
        */

        if (
            company.organization.reportingLevels === 0
        ) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "performance",

                    category: "Hierarchy",

                    title: "Define Reporting Hierarchy",

                    description:
                        "Managers are required for structured goal setting and performance reviews.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Employee Strength
        |--------------------------------------------------------------------------
        */

        if (
            company.workforce.totalEmployees >= 20 &&
            company.organization.reportingLevels < 2
        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "performance",

                    category: "Management",

                    title: "Introduce Performance Managers",

                    description:
                        "Organizations with 20 or more employees should establish structured people management.",

                    priority: "Medium",

                    type: "Action"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Knowledge References
        |--------------------------------------------------------------------------
        */

        const frameworks =
            knowledgeLibrary.getCategory("frameworks");

        return {

            module: "performance",

            score: Math.max(score, 0),

            findings,

            risks,

            recommendations,

            references: {

                frameworks,

                context

            }

        };

    }

}

const performanceEngine =
    new PerformanceEngine();

export { PerformanceEngine };

export default performanceEngine;
