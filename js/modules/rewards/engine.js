/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Rewards Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/modules/rewards/engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import recommendationEngine from "../../core/recommendation-engine.js";
import knowledgeLibrary from "../../core/knowledge-library.js";

class RewardsEngine {

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
        | Salary Structure
        |--------------------------------------------------------------------------
        */

        if (
            company.workforce.totalEmployees === 0
        ) {

            score -= 20;

            recommendations.push(

                recommendationEngine.create({

                    module: "rewards",

                    category: "Compensation",

                    title: "Maintain Workforce Information",

                    description:
                        "Employee strength is required before designing salary structures.",

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

        if (
            !company.business.growthStage
        ) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "rewards",

                    category: "Strategy",

                    title: "Define Growth Stage",

                    description:
                        "Growth stage enables rewards and compensation recommendations.",

                    priority: "Medium",

                    type: "Action"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Reporting Structure
        |--------------------------------------------------------------------------
        */

        if (
            company.workforce.totalEmployees >= 20 &&
            company.organization.reportingLevels === 0
        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "rewards",

                    category: "Organization",

                    title: "Define Reporting Hierarchy",

                    description:
                        "Reporting hierarchy supports compensation and reward governance.",

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

        const benchmarks =
            knowledgeLibrary.getCategory("benchmarks");

        return {

            module: "rewards",

            score: Math.max(score, 0),

            findings,

            risks,

            recommendations,

            references: {

                benchmarks,

                context

            }

        };

    }

}

const rewardsEngine =
    new RewardsEngine();

export { RewardsEngine };

export default rewardsEngine;
