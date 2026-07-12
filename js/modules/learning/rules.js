/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Learning Intelligence Rules Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/learning/rules.js
 * Version   : 1.0.0
 * =============================================================================
 */

class LearningRules {

    constructor() {

        this.rules = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.rules = [

            {
                id: "LRN-001",
                title: "Employee Database",
                category: "Learning",
                priority: "High",
                condition: company =>
                    company.workforce.totalEmployees > 0,
                recommendation:
                    "Maintain employee information before implementing learning programs."
            },

            {
                id: "LRN-002",
                title: "Department Structure",
                category: "Organization",
                priority: "High",
                condition: company =>
                    company.organization.departments.length > 0,
                recommendation:
                    "Create organization departments."
            },

            {
                id: "LRN-003",
                title: "Reporting Hierarchy",
                category: "Management",
                priority: "Medium",
                condition: company =>
                    company.organization.reportingLevels > 0,
                recommendation:
                    "Define reporting hierarchy."
            },

            {
                id: "LRN-004",
                title: "Growth Stage",
                category: "Strategy",
                priority: "Medium",
                condition: company =>
                    Boolean(company.business.growthStage),
                recommendation:
                    "Define organization growth stage."
            },

            {
                id: "LRN-005",
                title: "Learning Governance",
                category: "Management",
                priority: "Medium",
                condition: company => {

                    if (
                        company.workforce.totalEmployees < 25
                    ) {
                        return true;
                    }

                    return (
                        company.organization.reportingLevels >= 2
                    );

                },
                recommendation:
                    "Assign managers to own learning and development."
            },

            {
                id: "LRN-006",
                title: "Department Coverage",
                category: "Organization",
                priority: "Low",
                condition: company =>
                    company.organization.departments.length >= 3,
                recommendation:
                    "Expand department structure."
            },

            {
                id: "LRN-007",
                title: "Company Profile",
                category: "Foundation",
                priority: "High",
                condition: company =>
                    company.company.legalName.length > 0 &&
                    company.company.entityType.length > 0,
                recommendation:
                    "Complete company profile before building learning strategy."
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

const learningRules =
    new LearningRules();

export { LearningRules };

export default learningRules;
