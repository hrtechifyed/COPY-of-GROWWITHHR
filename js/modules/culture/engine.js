/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Culture Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/modules/culture/engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import recommendationEngine from "../../core/recommendation-engine.js";
import knowledgeLibrary from "../../core/knowledge-library.js";

class CultureEngine {

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

                    module: "culture",

                    category: "Organization",

                    title: "Create Organization Structure",

                    description:
                        "Departments should exist before formal culture initiatives.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Leadership Readiness
        |--------------------------------------------------------------------------
        */

        if (
            company.organization.reportingLevels < 2
        ) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "culture",

                    category: "Leadership",

                    title: "Develop Leadership Team",

                    description:
                        "Managers play a key role in building organizational culture.",

                    priority: "High",

                    type: "Action"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Employee Experience
        |--------------------------------------------------------------------------
        */

        if (
            company.workforce.totalEmployees >= 30 &&
            company.organization.departments.length < 3
        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "culture",

                    category: "Employee Experience",

                    title: "Strengthen Functional Teams",

                    description:
                        "Clearly defined functional teams improve collaboration and engagement.",

                    priority: "Medium",

                    type: "Improvement"

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

            module: "culture",

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

const cultureEngine =
    new CultureEngine();

export { CultureEngine };

export default cultureEngine;
