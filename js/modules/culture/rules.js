/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Culture Intelligence Rules Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/culture/rules.js
 * Version   : 1.0.0
 * =============================================================================
 */

class CultureRules {

    constructor() {

        this.rules = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.rules = [

            {
                id: "CUL-001",
                title: "Organization Structure",
                category: "Organization",
                priority: "High",
                condition: company =>
                    company.organization.departments.length > 0,
                recommendation:
                    "Create organization departments."
            },

            {
                id: "CUL-002",
                title: "Leadership Structure",
                category: "Leadership",
                priority: "High",
                condition: company =>
                    company.organization.reportingLevels >= 2,
                recommendation:
                    "Develop leadership hierarchy."
            },

            {
                id: "CUL-003",
                title: "Growth Stage",
                category: "Strategy",
                priority: "Medium",
                condition: company =>
                    Boolean(company.business.growthStage),
                recommendation:
                    "Define organization growth stage."
            },

            {
                id: "CUL-004",
                title: "Department Coverage",
                category: "Organization",
                priority: "Medium",
                condition: company =>
                    company.organization.departments.length >= 3,
                recommendation:
                    "Expand department structure."
            },

            {
                id: "CUL-005",
                title: "Employee Experience Readiness",
                category: "Employee Experience",
                priority: "Medium",
                condition: company => {

                    if (
                        company.workforce.totalEmployees < 30
                    ) {
                        return true;
                    }

                    return (
                        company.organization.departments.length >= 3
                    );

                },
                recommendation:
                    "Strengthen organizational structure for employee experience."

            },

            {
                id: "CUL-006",
                title: "Business Model",
                category: "Strategy",
                priority: "Low",
                condition: company =>
                    Boolean(company.business.businessModel),
                recommendation:
                    "Specify business model."
            },

            {
                id: "CUL-007",
                title: "Company Profile",
                category: "Foundation",
                priority: "High",
                condition: company =>
                    company.company.legalName.length > 0 &&
                    company.company.entityType.length > 0,
                recommendation:
                    "Complete company profile before culture initiatives."
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

const cultureRules =
    new CultureRules();

export { CultureRules };

export default cultureRules;
