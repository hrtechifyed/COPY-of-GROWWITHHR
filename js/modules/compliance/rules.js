/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Compliance Rules Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/compliance/rules.js
 * Version   : 1.0.0
 * =============================================================================
 */

class ComplianceRules {

    constructor() {

        this.rules = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.rules = [

            {
                id: "COMP-001",
                title: "Entity Registration",
                category: "Entity",
                priority: "Critical",
                condition: company =>
                    Boolean(company.company.entityType),
                recommendation:
                    "Define the legal entity before compliance analysis."
            },

            {
                id: "COMP-002",
                title: "Head Office",
                category: "Location",
                priority: "Critical",
                condition: company =>
                    Boolean(company.geography.headquarters.state),
                recommendation:
                    "Specify headquarters state."
            },

            {
                id: "COMP-003",
                title: "Employee Strength",
                category: "Workforce",
                priority: "High",
                condition: company =>
                    company.workforce.totalEmployees > 0,
                recommendation:
                    "Maintain current employee strength."
            },

            {
                id: "COMP-004",
                title: "Branch Information",
                category: "Organization",
                priority: "Medium",
                condition: company =>
                    company.organization.branches.length >= 0,
                recommendation:
                    "Keep branch information updated."
            },

            {
                id: "COMP-005",
                title: "Factory Information",
                category: "Organization",
                priority: "Medium",
                condition: company =>
                    company.organization.factories.length >= 0,
                recommendation:
                    "Maintain factory records."
            },

            {
                id: "COMP-006",
                title: "Contract Workforce",
                category: "Workforce",
                priority: "High",
                condition: company =>
                    company.workforce.contractEmployees >= 0,
                recommendation:
                    "Track contract employees."
            },

            {
                id: "COMP-007",
                title: "Remote Workforce",
                category: "Workforce",
                priority: "Low",
                condition: company =>
                    company.workforce.remoteEmployees >= 0,
                recommendation:
                    "Maintain remote workforce information."
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

const complianceRules =
    new ComplianceRules();

export { ComplianceRules };

export default complianceRules;
