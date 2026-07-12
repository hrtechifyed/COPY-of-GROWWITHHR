/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Organization Intelligence Engine
 * -----------------------------------------------------------------------------
 * File      : js/modules/organization/engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import recommendationEngine from "../../core/recommendation-engine.js";
import knowledgeLibrary from "../../core/knowledge-library.js";

class OrganizationEngine {

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
        | Departments
        |--------------------------------------------------------------------------
        */

        if (
            company.organization.departments.length === 0
        ) {

            score -= 20;

            recommendations.push(

                recommendationEngine.create({

                    module: "organization",

                    category: "Structure",

                    title: "Create Departments",

                    description:
                        "Define functional departments for the organization.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Reporting Levels
        |--------------------------------------------------------------------------
        */

        if (
            company.organization.reportingLevels === 0
        ) {

            score -= 15;

            recommendations.push(

                recommendationEngine.create({

                    module: "organization",

                    category: "Hierarchy",

                    title: "Define Reporting Levels",

                    description:
                        "Create a formal reporting hierarchy.",

                    priority: "High",

                    type: "Improvement"

                })

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Business Units
        |--------------------------------------------------------------------------
        */

        if (
            company.workforce.totalEmployees >= 250 &&
            company.organization.businessUnits.length === 0
        ) {

            score -= 10;

            recommendations.push(

                recommendationEngine.create({

                    module: "organization",

                    category: "Business Units",

                    title: "Introduce Business Units",

                    description:
                        "Large organizations should consider business unit structures.",

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

            module: "organization",

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

const organizationEngine =
    new OrganizationEngine();

export { OrganizationEngine };

export default organizationEngine;
