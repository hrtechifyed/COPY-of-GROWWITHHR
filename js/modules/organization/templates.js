/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Organization Intelligence Templates
 * -----------------------------------------------------------------------------
 * File      : js/modules/organization/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class OrganizationTemplates {

    constructor() {

        this.templates = [

            {
                id: "ORG-TEMP-001",
                category: "Organization Chart",
                name: "Startup Organization Structure",
                description: "Recommended organization structure for startups with up to 25 employees.",
                applicableTo: "Startup"
            },

            {
                id: "ORG-TEMP-002",
                category: "Organization Chart",
                name: "Growth Organization Structure",
                description: "Recommended structure for organizations with 25-100 employees.",
                applicableTo: "Growth"
            },

            {
                id: "ORG-TEMP-003",
                category: "Organization Chart",
                name: "Enterprise Organization Structure",
                description: "Recommended multi-level organization design.",
                applicableTo: "Enterprise"
            },

            {
                id: "ORG-TEMP-004",
                category: "Department",
                name: "HR Department Structure",
                description: "Standard Human Resources department hierarchy.",
                applicableTo: "All Organizations"
            },

            {
                id: "ORG-TEMP-005",
                category: "Department",
                name: "Engineering Department Structure",
                description: "Engineering reporting hierarchy.",
                applicableTo: "Technology Companies"
            },

            {
                id: "ORG-TEMP-006",
                category: "Department",
                name: "Sales Department Structure",
                description: "Sales organization hierarchy.",
                applicableTo: "Sales Organizations"
            },

            {
                id: "ORG-TEMP-007",
                category: "Job Architecture",
                name: "Job Level Framework",
                description: "Career level framework from Individual Contributor to Executive.",
                applicableTo: "All Organizations"
            },

            {
                id: "ORG-TEMP-008",
                category: "Governance",
                name: "Delegation Matrix",
                description: "Decision authority matrix.",
                applicableTo: "Growing Organizations"
            },

            {
                id: "ORG-TEMP-009",
                category: "Planning",
                name: "Workforce Planning Template",
                description: "Annual workforce planning template.",
                applicableTo: "All Organizations"
            },

            {
                id: "ORG-TEMP-010",
                category: "Assessment",
                name: "Organization Review Checklist",
                description: "Periodic organization effectiveness checklist.",
                applicableTo: "All Organizations"
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

            organizationCharts:
                this.byCategory("Organization Chart").length,

            departments:
                this.byCategory("Department").length,

            jobArchitecture:
                this.byCategory("Job Architecture").length,

            governance:
                this.byCategory("Governance").length,

            planning:
                this.byCategory("Planning").length,

            assessments:
                this.byCategory("Assessment").length

        };

    }

}

const organizationTemplates =
    new OrganizationTemplates();

export { OrganizationTemplates };

export default organizationTemplates;
