/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Talent Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/modules/talent/engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import recommendationEngine from "../../core/recommendation-engine.js";
import knowledgeLibrary from "../../core/knowledge-library.js";

class TalentEngine {

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
        | Succession Planning
        |--------------------------------------------------------------------------
        */

        if (

            !company.talent ||

            company.talent.successionPlan !== true

        ) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "talent",

                    category: "Succession",

                    title: "Establish Succession Planning",

                    description:
                        "Identify critical roles and prepare succession plans.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | High Potential Employees
        |--------------------------------------------------------------------------
        */

        if (

            !company.talent ||

            !Array.isArray(company.talent.highPotentialEmployees) ||

            company.talent.highPotentialEmployees.length === 0

        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "talent",

                    category: "Talent Identification",

                    title: "Identify High Potential Employees",

                    description:
                        "Create a structured high-potential talent program.",

                    priority: "Medium",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Critical Roles
        |--------------------------------------------------------------------------
        */

        if (

            company.workforce.totalEmployees >= 100 &&

            (

                !company.talent ||

                !Array.isArray(company.talent.criticalRoles) ||

                company.talent.criticalRoles.length === 0

            )

        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "talent",

                    category: "Critical Roles",

                    title: "Identify Critical Roles",

                    description:
                        "Document business-critical roles and build continuity plans.",

                    priority: "Medium",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Talent Reviews
        |--------------------------------------------------------------------------
        */

        if (

            !company.talent ||

            company.talent.talentReviewFrequency === "None"

        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "talent",

                    category: "Talent Review",

                    title: "Conduct Periodic Talent Reviews",

                    description:
                        "Review talent regularly to support development and retention.",

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

        const frameworks =
            knowledgeLibrary.getCategory("frameworks");

        return {

            module: "talent",

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

const talentEngine =
    new TalentEngine();

export { TalentEngine };

export default talentEngine;
