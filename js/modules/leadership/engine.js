/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Leadership Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/modules/leadership/engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import recommendationEngine from "../../core/recommendation-engine.js";
import knowledgeLibrary from "../../core/knowledge-library.js";

class LeadershipEngine {

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
        | Leadership Structure
        |--------------------------------------------------------------------------
        */

        if (
            company.organization.reportingLevels < 2
        ) {

            score -= 20;

            recommendations.push(

                recommendationEngine.create({

                    module: "leadership",

                    category: "Leadership",

                    title: "Build Leadership Structure",

                    description:
                        "Create management levels to improve delegation and decision making.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Founder Coaching
        |--------------------------------------------------------------------------
        */

        if (
            company.workforce.totalEmployees >= 25 &&
            company.organization.reportingLevels < 3
        ) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "leadership",

                    category: "Founder",

                    title: "Develop Leadership Team",

                    description:
                        "Establish middle management and leadership capabilities for scaling.",

                    priority: "High",

                    type: "Action"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Delegation Readiness
        |--------------------------------------------------------------------------
        */

        if (
            company.workforce.totalEmployees >= 50 &&
            company.organization.departments.length < 5
        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "leadership",

                    category: "Delegation",

                    title: "Strengthen Functional Leadership",

                    description:
                        "Expand departmental leadership to support business growth.",

                    priority: "Medium",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Knowledge References
        |--------------------------------------------------------------------------
        */

        const guides =
            knowledgeLibrary.getCategory("guides");

        return {

            module: "leadership",

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

const leadershipEngine =
    new LeadershipEngine();

export { LeadershipEngine };

export default leadershipEngine;
