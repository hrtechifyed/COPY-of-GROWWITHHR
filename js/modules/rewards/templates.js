/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Rewards Intelligence Templates
 * -----------------------------------------------------------------------------
 * File      : js/modules/rewards/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class RewardsTemplates {

    constructor() {

        this.templates = [

            {
                id: "REW-TEMP-001",
                category: "Salary Structure",
                name: "Salary Structure Framework",
                description: "Standard salary structure template.",
                applicableTo: "All Organizations"
            },

            {
                id: "REW-TEMP-002",
                category: "Salary Band",
                name: "Salary Band Matrix",
                description: "Role-wise salary band framework.",
                applicableTo: "All Organizations"
            },

            {
                id: "REW-TEMP-003",
                category: "Variable Pay",
                name: "Variable Pay Framework",
                description: "Performance-linked incentive framework.",
                applicableTo: "Performance-Based Organizations"
            },

            {
                id: "REW-TEMP-004",
                category: "Benefits",
                name: "Employee Benefits Policy",
                description: "Benefits and allowances structure.",
                applicableTo: "All Employees"
            },

            {
                id: "REW-TEMP-005",
                category: "Bonus",
                name: "Annual Bonus Framework",
                description: "Bonus calculation and eligibility template.",
                applicableTo: "Eligible Employees"
            },

            {
                id: "REW-TEMP-006",
                category: "ESOP",
                name: "ESOP Planning Guide",
                description: "Employee Stock Option planning framework.",
                applicableTo: "Growing Organizations"
            },

            {
                id: "REW-TEMP-007",
                category: "Benchmark",
                name: "Compensation Benchmark Sheet",
                description: "Market compensation benchmarking template.",
                applicableTo: "HR"
            },

            {
                id: "REW-TEMP-008",
                category: "Incentive",
                name: "Sales Incentive Plan",
                description: "Sales incentive calculation framework.",
                applicableTo: "Sales Teams"
            },

            {
                id: "REW-TEMP-009",
                category: "Recognition",
                name: "Employee Recognition Program",
                description: "Recognition and rewards program template.",
                applicableTo: "All Organizations"
            },

            {
                id: "REW-TEMP-010",
                category: "Dashboard",
                name: "Rewards Dashboard",
                description: "Rewards and compensation analytics dashboard.",
                applicableTo: "Leadership"

            }

        ];

    }

    list() {

        return [...this.templates];

    }

    get(id) {

        return this.templates.find(
            template => template.id === id
        ) || null;

    }

    byCategory(category) {

        return this.templates.filter(
            template => template.category === category
        );

    }

    search(keyword = "") {

        const query = keyword.toLowerCase();

        return this.templates.filter(template =>

            template.name
                .toLowerCase()
                .includes(query)

            ||

            template.description
                .toLowerCase()
                .includes(query)

            ||

            template.category
                .toLowerCase()
                .includes(query)

        );

    }

    statistics() {

        return {

            totalTemplates:
                this.templates.length,

            salaryStructures:
                this.byCategory("Salary Structure").length,

            salaryBands:
                this.byCategory("Salary Band").length,

            variablePay:
                this.byCategory("Variable Pay").length,

            benefits:
                this.byCategory("Benefits").length,

            bonus:
                this.byCategory("Bonus").length,

            esop:
                this.byCategory("ESOP").length,

            benchmarks:
                this.byCategory("Benchmark").length,

            incentives:
                this.byCategory("Incentive").length,

            recognition:
                this.byCategory("Recognition").length,

            dashboards:
                this.byCategory("Dashboard").length

        };

    }

}

const rewardsTemplates =
    new RewardsTemplates();

export { RewardsTemplates };

export default rewardsTemplates;
