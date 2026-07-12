/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Leadership Intelligence Rules Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/leadership/rules.js
 * Version   : 1.0.0
 * =============================================================================
 */

class LeadershipRules {

    constructor() {

        this.rules = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.rules = [

            {
                id: "LEAD-001",
                title: "Leadership Structure",
                category: "Leadership",
                priority: "High",
                condition: company =>
                    company.organization.reportingLevels >= 2,
                recommendation:
                    "Establish leadership hierarchy."
            },

            {
                id: "LEAD-002",
                title: "Manager Availability",
                category: "Management",
                priority: "High",
                condition: company => {

                    if (
                        company.workforce.totalEmployees < 15
                    ) {
                        return true;
                    }

                    return (
                        company.organization.reportingLevels >= 2
                    );

                },
                recommendation:
                    "Assign managers for growing teams."
            },

            {
                id: "LEAD-003",
                title: "Growth Stage",
                category: "Strategy",
                priority: "Medium",
                condition: company =>
                    Boolean(company.business.growthStage),
                recommendation:
                    "Define organization growth stage."
            },

            {
                id: "LEAD-004",
                title: "Department Leadership",
                category: "Organization",
                priority: "Medium",
                condition: company =>
                    company.organization.departments.length >= 3,
                recommendation:
                    "Assign department heads."
            },

            {
                id: "LEAD-005",
                title: "Delegation Readiness",
                category: "Delegation",
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
                    "Strengthen delegation through functional leaders."
            },

            {
                id: "LEAD-006",
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
                id: "LEAD-007",
                title: "Founder Readiness",
                category: "Leadership",
                priority: "High",
                condition: company =>
                    company.company.legalName.length > 0 &&
                    company.business.businessModel.length > 0,
                recommendation:
                    "Complete organization profile for leadership guidance."
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

const leadershipRules =
    new LeadershipRules();

export { LeadershipRules };

export default leadershipRules;
