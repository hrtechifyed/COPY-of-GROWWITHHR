/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Organization Intelligence Rules Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/organization/rules.js
 * Version   : 1.0.0
 * =============================================================================
 */

class OrganizationRules {

    constructor() {

        this.rules = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.rules = [

            {
                id: "ORG-001",
                title: "Department Structure",
                category: "Structure",
                priority: "High",
                condition: company =>
                    company.organization.departments.length > 0,
                recommendation:
                    "Define organization departments."
            },

            {
                id: "ORG-002",
                title: "Reporting Levels",
                category: "Hierarchy",
                priority: "High",
                condition: company =>
                    company.organization.reportingLevels > 0,
                recommendation:
                    "Create reporting hierarchy."
            },

            {
                id: "ORG-003",
                title: "Business Units",
                category: "Structure",
                priority: "Medium",
                condition: company => {

                    if (
                        company.workforce.totalEmployees < 250
                    ) {
                        return true;
                    }

                    return (
                        company.organization.businessUnits.length > 0
                    );

                },
                recommendation:
                    "Create business units for larger organizations."
            },

            {
                id: "ORG-004",
                title: "Branch Structure",
                category: "Operations",
                priority: "Medium",
                condition: company =>
                    Array.isArray(
                        company.organization.branches
                    ),
                recommendation:
                    "Maintain branch information."
            },

            {
                id: "ORG-005",
                title: "Factory Structure",
                category: "Operations",
                priority: "Medium",
                condition: company =>
                    Array.isArray(
                        company.organization.factories
                    ),
                recommendation:
                    "Maintain factory information."
            },

            {
                id: "ORG-006",
                title: "Office Structure",
                category: "Operations",
                priority: "Low",
                condition: company =>
                    Array.isArray(
                        company.organization.offices
                    ),
                recommendation:
                    "Maintain office information."
            },

            {
                id: "ORG-007",
                title: "Department Coverage",
                category: "Structure",
                priority: "High",
                condition: company =>
                    company.organization.departments.length >= 5,
                recommendation:
                    "Ensure all core business functions have departments."
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

const organizationRules =
    new OrganizationRules();

export { OrganizationRules };

export default organizationRules;
