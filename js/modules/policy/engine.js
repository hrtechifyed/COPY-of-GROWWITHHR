/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Policy Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/modules/policy/engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import recommendationEngine from "../../core/recommendation-engine.js";
import knowledgeLibrary from "../../core/knowledge-library.js";

class PolicyEngine {

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
        | Company Profile
        |--------------------------------------------------------------------------
        */

        if (
            !company.company.legalName
        ) {

            score -= 20;

            recommendations.push(

                recommendationEngine.create({

                    module: "policy",

                    category: "Foundation",

                    title: "Complete Company Profile",

                    description:
                        "Company information is required before generating HR policies.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Organization Structure
        |--------------------------------------------------------------------------
        */

        if (
            company.organization.departments.length === 0
        ) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "policy",

                    category: "Organization",

                    title: "Define Organization Structure",

                    description:
                        "Departments help determine applicable workplace policies.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Business Model
        |--------------------------------------------------------------------------
        */

        if (
            !company.business.businessModel
        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "policy",

                    category: "Business",

                    title: "Define Business Model",

                    description:
                        "Business model is required for policy recommendations.",

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

        const policies =
            knowledgeLibrary.getCategory("policies");

        return {

            module: "policy",

            score: Math.max(score, 0),

            findings,

            risks,

            recommendations,

            references: {

                policies,

                context

            }

        };

    }

}

const policyEngine =
    new PolicyEngine();

export { PolicyEngine };

export default policyEngine;
