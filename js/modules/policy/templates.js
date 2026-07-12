/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Policy Intelligence Templates
 * -----------------------------------------------------------------------------
 * File      : js/modules/policy/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class PolicyTemplates {

    constructor() {

        this.templates = [

            {
                id: "POL-TEMP-001",
                category: "HR Policy",
                name: "Employee Handbook",
                description: "Comprehensive employee handbook template.",
                applicableTo: "All Organizations"
            },

            {
                id: "POL-TEMP-002",
                category: "Leave",
                name: "Leave Policy",
                description: "Annual, sick, maternity and special leave policy.",
                applicableTo: "All Employees"
            },

            {
                id: "POL-TEMP-003",
                category: "Attendance",
                name: "Attendance Policy",
                description: "Working hours and attendance management policy.",
                applicableTo: "All Employees"
            },

            {
                id: "POL-TEMP-004",
                category: "Code of Conduct",
                name: "Code of Conduct",
                description: "Employee code of conduct and workplace ethics.",
                applicableTo: "All Employees"
            },

            {
                id: "POL-TEMP-005",
                category: "Remote Work",
                name: "Hybrid Work Policy",
                description: "Hybrid and remote work guidelines.",
                applicableTo: "Eligible Employees"
            },

            {
                id: "POL-TEMP-006",
                category: "Performance",
                name: "Performance Management Policy",
                description: "Performance review and appraisal policy.",
                applicableTo: "Managers"
            },

            {
                id: "POL-TEMP-007",
                category: "Security",
                name: "Information Security Policy",
                description: "Information security and data protection policy.",
                applicableTo: "All Employees"
            },

            {
                id: "POL-TEMP-008",
                category: "Travel",
                name: "Business Travel Policy",
                description: "Business travel and expense reimbursement policy.",
                applicableTo: "Employees"
            },

            {
                id: "POL-TEMP-009",
                category: "Compliance",
                name: "Workplace Compliance Policy",
                description: "Legal, statutory and workplace compliance policy.",
                applicableTo: "Leadership & HR"
            },

            {
                id: "POL-TEMP-010",
                category: "Dashboard",
                name: "Policy Compliance Dashboard",
                description: "Policy adoption and compliance analytics dashboard.",
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

            hrPolicies:
                this.byCategory("HR Policy").length,

            leave:
                this.byCategory("Leave").length,

            attendance:
                this.byCategory("Attendance").length,

            conduct:
                this.byCategory("Code of Conduct").length,

            remoteWork:
                this.byCategory("Remote Work").length,

            performance:
                this.byCategory("Performance").length,

            security:
                this.byCategory("Security").length,

            travel:
                this.byCategory("Travel").length,

            compliance:
                this.byCategory("Compliance").length,

            dashboards:
                this.byCategory("Dashboard").length

        };

    }

}

const policyTemplates =
    new PolicyTemplates();

export { PolicyTemplates };

export default policyTemplates;
