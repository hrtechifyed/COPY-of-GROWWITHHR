/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Hiring Intelligence Rules Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/hiring/rules.js
 * Version   : 1.0.0
 * =============================================================================
 */

class HiringRules {

    constructor() {

        this.rules = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.rules = [

            {
                id: "HIR-001",
                title: "Growth Stage Defined",
                category: "Planning",
                priority: "High",
                condition: company =>
                    Boolean(company.business.growthStage),
                recommendation:
                    "Define the organization's growth stage."
            },

            {
                id: "HIR-002",
                title: "Departments Available",
                category: "Organization",
                priority: "High",
                condition: company =>
                    company.organization.departments.length > 0,
                recommendation:
                    "Create functional departments before scaling hiring."
            },

            {
                id: "HIR-003",
                title: "Reporting Structure",
                category: "Organization",
                priority: "Medium",
                condition: company =>
                    company.organization.reportingLevels > 0,
                recommendation:
                    "Define reporting hierarchy."
            },

            {
                id: "HIR-004",
                title: "Workforce Planning",
                category: "Planning",
                priority: "Medium",
                condition: company =>
                    company.workforce.totalEmployees >= 0,
                recommendation:
                    "Maintain workforce planning."
            },

            {
                id: "HIR-005",
                title: "Business Units",
                category: "Growth",
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
                    "Create business units for large organizations."
            },

            {
                id: "HIR-006",
                title: "Office Locations",
                category: "Expansion",
                priority: "Low",
                condition: company =>
                    company.organization.offices.length >= 0,
                recommendation:
                    "Maintain office location records."
            },

            {
                id: "HIR-007",
                title: "Hiring Readiness",
                category: "Hiring",
                priority: "High",
                condition: company =>
                    company.company.legalName.length > 0 &&
                    company.company.entityType.length > 0,
                recommendation:
                    "Complete company profile before hiring."
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

const hiringRules =
    new HiringRules();

export { HiringRules };

export default hiringRules;
