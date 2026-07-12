/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Rewards Intelligence Rules Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/rewards/rules.js
 * Version   : 1.0.0
 * =============================================================================
 */

class RewardsRules {

    constructor() {

        this.rules = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.rules = [

            {
                id: "REW-001",
                title: "Employee Strength",
                category: "Compensation",
                priority: "High",
                condition: company =>
                    company.workforce.totalEmployees > 0,
                recommendation:
                    "Maintain employee strength information."
            },

            {
                id: "REW-002",
                title: "Growth Stage",
                category: "Strategy",
                priority: "Medium",
                condition: company =>
                    Boolean(company.business.growthStage),
                recommendation:
                    "Define the organization's growth stage."
            },

            {
                id: "REW-003",
                title: "Reporting Hierarchy",
                category: "Organization",
                priority: "Medium",
                condition: company =>
                    company.organization.reportingLevels > 0,
                recommendation:
                    "Define reporting hierarchy."
            },

            {
                id: "REW-004",
                title: "Department Structure",
                category: "Organization",
                priority: "Medium",
                condition: company =>
                    company.organization.departments.length > 0,
                recommendation:
                    "Maintain organization departments."
            },

            {
                id: "REW-005",
                title: "Business Model",
                category: "Strategy",
                priority: "Low",
                condition: company =>
                    Boolean(company.business.businessModel),
                recommendation:
                    "Specify business model."
            },

            {
                id: "REW-006",
                title: "Management Readiness",
                category: "Governance",
                priority: "Medium",
                condition: company => {

                    if (
                        company.workforce.totalEmployees < 20
                    ) {
                        return true;
                    }

                    return (
                        company.organization.reportingLevels >= 2
                    );

                },
                recommendation:
                    "Establish management hierarchy before implementing advanced rewards."
            },

            {
                id: "REW-007",
                title: "Company Profile",
                category: "Foundation",
                priority: "High",
                condition: company =>
                    company.company.legalName.length > 0 &&
                    company.company.entityType.length > 0,
                recommendation:
                    "Complete company profile before designing rewards."

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

const rewardsRules =
    new RewardsRules();

export { RewardsRules };

export default rewardsRules;
