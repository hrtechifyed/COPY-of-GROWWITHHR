/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Policy Intelligence Rules Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/policy/rules.js
 * Version   : 1.0.0
 * =============================================================================
 */

class PolicyRules {

    constructor() {

        this.rules = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.rules = [

            {
                id: "POL-001",
                title: "Company Profile",
                category: "Foundation",
                priority: "High",
                condition: company =>
                    company.company.legalName.length > 0,
                recommendation:
                    "Complete company profile."
            },

            {
                id: "POL-002",
                title: "Organization Structure",
                category: "Organization",
                priority: "High",
                condition: company =>
                    company.organization.departments.length > 0,
                recommendation:
                    "Define organization departments."
            },

            {
                id: "POL-003",
                title: "Business Model",
                category: "Business",
                priority: "High",
                condition: company =>
                    Boolean(company.business.businessModel),
                recommendation:
                    "Define business model."
            },

            {
                id: "POL-004",
                title: "Growth Stage",
                category: "Strategy",
                priority: "Medium",
                condition: company =>
                    Boolean(company.business.growthStage),
                recommendation:
                    "Define organization growth stage."
            },

            {
                id: "POL-005",
                title: "Reporting Structure",
                category: "Organization",
                priority: "Medium",
                condition: company =>
                    company.organization.reportingLevels > 0,
                recommendation:
                    "Define reporting hierarchy."
            },

            {
                id: "POL-006",
                title: "Employee Strength",
                category: "Workforce",
                priority: "Low",
                condition: company =>
                    company.workforce.totalEmployees > 0,
                recommendation:
                    "Maintain employee records."
            },

            {
                id: "POL-007",
                title: "Entity Information",
                category: "Compliance",
                priority: "High",
                condition: company =>
                    company.company.entityType.length > 0,
                recommendation:
                    "Specify legal entity type."

            }

        ];

    }

    list() {

        return [...this.rules];

    }

    get(id) {

        return this.rules.find(
            rule => rule.id === id
        ) || null;

    }

    evaluate(company) {

        return this.rules.map(rule => ({

            id: rule.id,

            title: rule.title,

            category: rule.category,

            priority: rule.priority,

            passed: rule.condition(company),

            recommendation: rule.recommendation

        }));

    }

}

const policyRules =
    new PolicyRules();

export { PolicyRules };

export default policyRules;
