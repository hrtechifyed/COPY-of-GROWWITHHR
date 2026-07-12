/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Compliance Intelligence Templates
 * -----------------------------------------------------------------------------
 * File      : js/modules/compliance/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class ComplianceTemplates {

    constructor() {

        this.templates = [

            {
                id: "TEMP-001",
                category: "Policy",
                name: "Employee Code of Conduct",
                description: "Standard employee conduct policy.",
                applicableTo: "All Companies"
            },

            {
                id: "TEMP-002",
                category: "Policy",
                name: "Leave Policy",
                description: "Employee leave policy template.",
                applicableTo: "All Companies"
            },

            {
                id: "TEMP-003",
                category: "Policy",
                name: "Attendance Policy",
                description: "Attendance and working hours policy.",
                applicableTo: "All Companies"
            },

            {
                id: "TEMP-004",
                category: "Policy",
                name: "POSH Policy",
                description: "Prevention of Sexual Harassment Policy.",
                applicableTo: "10+ Employees"
            },

            {
                id: "TEMP-005",
                category: "Register",
                name: "Employee Register",
                description: "Statutory employee register.",
                applicableTo: "Applicable Employers"
            },

            {
                id: "TEMP-006",
                category: "Register",
                name: "Leave Register",
                description: "Employee leave register.",
                applicableTo: "Applicable Employers"
            },

            {
                id: "TEMP-007",
                category: "Notice",
                name: "Minimum Wages Notice",
                description: "Display notice for minimum wages.",
                applicableTo: "Applicable Establishments"
            },

            {
                id: "TEMP-008",
                category: "Notice",
                name: "Working Hours Notice",
                description: "Working hours notice board format.",
                applicableTo: "Applicable Establishments"
            },

            {
                id: "TEMP-009",
                category: "Return",
                name: "Annual Return Checklist",
                description: "Compliance filing checklist.",
                applicableTo: "Applicable Employers"
            },

            {
                id: "TEMP-010",
                category: "Checklist",
                name: "New Establishment Compliance Checklist",
                description: "Initial compliance setup checklist.",
                applicableTo: "New Companies"
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

        const search = keyword.toLowerCase();

        return this.templates.filter(template =>

            template.name
                .toLowerCase()
                .includes(search)

            ||

            template.description
                .toLowerCase()
                .includes(search)

            ||

            template.category
                .toLowerCase()
                .includes(search)

        );

    }

    statistics() {

        return {

            totalTemplates:
                this.templates.length,

            policies:
                this.byCategory("Policy").length,

            notices:
                this.byCategory("Notice").length,

            registers:
                this.byCategory("Register").length,

            returns:
                this.byCategory("Return").length,

            checklists:
                this.byCategory("Checklist").length

        };

    }

}

const complianceTemplates =
    new ComplianceTemplates();

export { ComplianceTemplates };

export default complianceTemplates;
