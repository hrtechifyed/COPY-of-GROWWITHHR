/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Performance Intelligence Rules Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/performance/rules.js
 * Version   : 1.0.0
 * =============================================================================
 */

class PerformanceRules {

    constructor() {

        this.rules = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.rules = [

            {
                id: "PERF-001",
                title: "Department Structure",
                category: "Organization",
                priority: "High",
                condition: company =>
                    company.organization.departments.length > 0,
                recommendation:
                    "Create departments before implementing performance management."
            },

            {
                id: "PERF-002",
                title: "Reporting Hierarchy",
                category: "Management",
                priority: "High",
                condition: company =>
                    company.organization.reportingLevels > 0,
                recommendation:
                    "Define reporting hierarchy."
            },

            {
                id: "PERF-003",
                title: "Employee Strength",
                category: "Planning",
                priority: "Medium",
                condition: company =>
                    company.workforce.totalEmployees > 0,
                recommendation:
                    "Maintain employee strength records."
            },

            {
                id: "PERF-004",
                title: "Manager Availability",
                category: "Leadership",
                priority: "High",
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
                    "Assign managers for performance reviews."
            },

            {
                id: "PERF-005",
                title: "Growth Stage",
                category: "Strategy",
                priority: "Medium",
                condition: company =>
                    Boolean(company.business.growthStage),
                recommendation:
                    "Define organization growth stage."
            },

            {
                id: "PERF-006",
                title: "Business Model",
                category: "Strategy",
                priority: "Low",
                condition: company =>
                    Boolean(company.business.businessModel),
                recommendation:
                    "Specify business model."
            },

            {
                id: "PERF-007",
                title: "Department Coverage",
                category: "Organization",
                priority: "Medium",
                condition: company =>
                    company.organization.departments.length >= 3,
                recommendation:
                    "Ensure major business functions are represented."

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

const performanceRules =
    new PerformanceRules();

export { PerformanceRules };

export default performanceRules;
