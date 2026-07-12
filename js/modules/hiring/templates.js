/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Hiring Intelligence Templates
 * -----------------------------------------------------------------------------
 * File      : js/modules/hiring/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class HiringTemplates {

    constructor() {

        this.templates = [

            {
                id: "HIR-TEMP-001",
                category: "Hiring Strategy",
                name: "Annual Hiring Plan",
                description: "Organization-wide hiring strategy template.",
                applicableTo: "All Organizations"
            },

            {
                id: "HIR-TEMP-002",
                category: "Job Description",
                name: "Standard Job Description",
                description: "Comprehensive job description template.",
                applicableTo: "All Roles"
            },

            {
                id: "HIR-TEMP-003",
                category: "Interview",
                name: "Structured Interview Guide",
                description: "Behavioral and competency interview guide.",
                applicableTo: "All Roles"
            },

            {
                id: "HIR-TEMP-004",
                category: "Assessment",
                name: "Candidate Evaluation Sheet",
                description: "Standard interview assessment form.",
                applicableTo: "Interview Panel"
            },

            {
                id: "HIR-TEMP-005",
                category: "Offer",
                name: "Offer Approval Checklist",
                description: "Offer release approval workflow.",
                applicableTo: "HR"
            },

            {
                id: "HIR-TEMP-006",
                category: "Offer",
                name: "Offer Letter Template",
                description: "Standard employment offer letter.",
                applicableTo: "Employees"
            },

            {
                id: "HIR-TEMP-007",
                category: "Recruitment",
                name: "Recruitment Dashboard",
                description: "Hiring pipeline tracking template.",
                applicableTo: "Recruiters"
            },

            {
                id: "HIR-TEMP-008",
                category: "Employer Branding",
                name: "Career Page Checklist",
                description: "Employer branding best practices.",
                applicableTo: "Marketing & HR"
            },

            {
                id: "HIR-TEMP-009",
                category: "Onboarding",
                name: "Pre-Joining Checklist",
                description: "Employee pre-joining activity tracker.",
                applicableTo: "HR Operations"
            },

            {
                id: "HIR-TEMP-010",
                category: "Hiring Metrics",
                name: "Recruitment KPI Dashboard",
                description: "Hiring analytics and KPI framework.",
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

            hiringStrategies:
                this.byCategory("Hiring Strategy").length,

            jobDescriptions:
                this.byCategory("Job Description").length,

            interviews:
                this.byCategory("Interview").length,

            assessments:
                this.byCategory("Assessment").length,

            offers:
                this.byCategory("Offer").length,

            recruitment:
                this.byCategory("Recruitment").length,

            employerBranding:
                this.byCategory("Employer Branding").length,

            onboarding:
                this.byCategory("Onboarding").length,

            hiringMetrics:
                this.byCategory("Hiring Metrics").length

        };

    }

}

const hiringTemplates =
    new HiringTemplates();

export { HiringTemplates };

export default hiringTemplates;
