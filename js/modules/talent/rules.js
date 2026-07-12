/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Talent Intelligence Rules Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/talent/rules.js
 * Version   : 1.0.0
 * =============================================================================
 */

class TalentRules {

    constructor() {

        this.rules = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.rules = [

            {
                id: "TAL-001",
                title: "Career Framework",
                category: "Career",
                priority: "High",
                condition: company =>
                    company.organization.departments.length > 0,
                recommendation:
                    "Create a career framework."
            },

            {
                id: "TAL-002",
                title: "Leadership Pipeline",
                category: "Succession",
                priority: "High",
                condition: company =>
                    company.organization.reportingLevels >= 2,
                recommendation:
                    "Develop leadership pipeline."
            },

            {
                id: "TAL-003",
                title: "Growth Stage",
                category: "Strategy",
                priority: "Medium",
                condition: company =>
                    Boolean(company.business.growthStage),
                recommendation:
                    "Define organization growth stage."
            },

            {
                id: "TAL-004",
                title: "Department Coverage",
                category: "Organization",
                priority: "Medium",
                condition: company =>
                    company.organization.departments.length >= 3,
                recommendation:
                    "Expand department structure."
            },

            {
                id: "TAL-005",
                title: "Talent Development",
                category: "Development",
                priority: "Medium",
                condition: company => {

                    if (
                        company.workforce.totalEmployees < 50
                    ) {
                        return true;
                    }

                    return (
                        company.organization.departments.length >= 5
                    );

                },
                recommendation:
                    "Strengthen development opportunities."
            },

            {
                id: "TAL-006",
                title: "Business Units",
                category: "Organization",
                priority: "Low",
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
                    "Create business units for enterprise organizations."
            },

            {
                id: "TAL-007",
                title: "Company Profile",
                category: "Foundation",
                priority: "High",
                condition: company =>
                    company.company.legalName.length > 0 &&
                    company.company.entityType.length > 0,
                recommendation:
                    "Complete company profile before talent planning."
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

const talentRules =
    new TalentRules();

export { TalentRules };

export default talentRules;
