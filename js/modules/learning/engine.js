/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Learning Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/modules/learning/engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import recommendationEngine from "../../core/recommendation-engine.js";
import knowledgeLibrary from "../../core/knowledge-library.js";

class LearningEngine {

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
        | Workforce Readiness
        |--------------------------------------------------------------------------
        */

        if (
            company.workforce.totalEmployees === 0
        ) {

            score -= 20;

            recommendations.push(

                recommendationEngine.create({

                    module: "learning",

                    category: "Learning",

                    title: "Maintain Workforce Information",

                    description:
                        "Employee information is required to build learning programs.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Organization Readiness
        |--------------------------------------------------------------------------
        */

        if (
            company.organization.departments.length === 0
        ) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "learning",

                    category: "Organization",

                    title: "Create Department Structure",

                    description:
                        "Departments enable structured learning paths and training ownership.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Learning Governance
        |--------------------------------------------------------------------------
        */

        if (
            company.workforce.totalEmployees >= 25 &&
            company.organization.reportingLevels === 0
        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "learning",

                    category: "Management",

                    title: "Assign Learning Owners",

                    description:
                        "Managers should own learning and development activities.",

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

        const guides =
            knowledgeLibrary.getCategory("guides");

        return {

            module: "learning",

            score: Math.max(score, 0),

            findings,

            risks,

            recommendations,

            references: {

                guides,

                context

            }

        };

    }

}

const learningEngine =
    new LearningEngine();

export { LearningEngine };

export default learningEngine;
