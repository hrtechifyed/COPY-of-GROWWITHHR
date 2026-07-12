/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Compliance Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/modules/compliance/engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import recommendationEngine from "../../core/recommendation-engine.js";
import knowledgeLibrary from "../../core/knowledge-library.js";

class ComplianceEngine {

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
        | Entity Validation
        |--------------------------------------------------------------------------
        */

        if (!company.company.entityType) {

            score -= 20;

            recommendations.push(

                recommendationEngine.create({

                    module: "compliance",

                    category: "Entity",

                    title: "Define Legal Entity",

                    description:
                        "Configure the legal entity before compliance analysis.",

                    priority: "Critical",

                    type: "Compliance"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Headquarters Validation
        |--------------------------------------------------------------------------
        */

        if (!company.geography.headquarters.state) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "compliance",

                    category: "Location",

                    title: "Head Office Missing",

                    description:
                        "Specify headquarters state to determine applicable labour laws.",

                    priority: "Critical",

                    type: "Compliance"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Workforce Validation
        |--------------------------------------------------------------------------
        */

        if (company.workforce.totalEmployees === 0) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "compliance",

                    category: "Workforce",

                    title: "Update Workforce",

                    description:
                        "Employee strength is required for statutory applicability.",

                    priority: "High",

                    type: "Compliance"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Knowledge References
        |--------------------------------------------------------------------------
        */

        const laws =
            knowledgeLibrary.getCategory("laws");

        return {

            module: "compliance",

            score: Math.max(score, 0),

            findings,

            risks,

            recommendations,

            references: {

                laws,

                context

            }

        };

    }

}

const complianceEngine =
    new ComplianceEngine();

export { ComplianceEngine };

export default complianceEngine;
