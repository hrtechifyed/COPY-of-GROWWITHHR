/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Talent Intelligence Templates
 * -----------------------------------------------------------------------------
 * File      : js/modules/talent/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class TalentTemplates {

    constructor() {

        this.templates = [

            {
                id: "TAL-TEMP-001",
                category: "Competency",
                name: "Competency Framework",
                description: "Organization competency framework.",
                applicableTo: "All Employees"
            },

            {
                id: "TAL-TEMP-002",
                category: "Career Path",
                name: "Career Progression Framework",
                description: "Career path and promotion framework.",
                applicableTo: "All Employees"
            },

            {
                id: "TAL-TEMP-003",
                category: "Succession",
                name: "Succession Planning Matrix",
                description: "Leadership succession planning template.",
                applicableTo: "Leadership Team"
            },

            {
                id: "TAL-TEMP-004",
                category: "HiPo",
                name: "High Potential Assessment",
                description: "High-potential employee identification template.",
                applicableTo: "Managers"
            },

            {
                id: "TAL-TEMP-005",
                category: "Talent Review",
                name: "Talent Review Grid",
                description: "Talent review and calibration worksheet.",
                applicableTo: "Leadership"
            },

            {
                id: "TAL-TEMP-006",
                category: "Skills",
                name: "Skills Matrix",
                description: "Department skills inventory.",
                applicableTo: "Departments"
            },

            {
                id: "TAL-TEMP-007",
                category: "Promotion",
                name: "Promotion Readiness Assessment",
                description: "Promotion evaluation framework.",
                applicableTo: "Managers"
            },

            {
                id: "TAL-TEMP-008",
                category: "Mobility",
                name: "Internal Mobility Framework",
                description: "Internal movement and career mobility guide.",
                applicableTo: "All Employees"
            },

            {
                id: "TAL-TEMP-009",
                category: "Development",
                name: "Individual Development Plan",
                description: "Employee development planning template.",
                applicableTo: "Employees"
            },

            {
                id: "TAL-TEMP-010",
                category: "Certification",
                name: "Professional Certification Tracker",
                description: "Track certifications and professional development.",
                applicableTo: "HR"

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

            competencies:
                this.byCategory("Competency").length,

            careerPaths:
                this.byCategory("Career Path").length,

            succession:
                this.byCategory("Succession").length,

            highPotential:
                this.byCategory("HiPo").length,

            talentReviews:
                this.byCategory("Talent Review").length,

            skills:
                this.byCategory("Skills").length,

            promotions:
                this.byCategory("Promotion").length,

            mobility:
                this.byCategory("Mobility").length,

            development:
                this.byCategory("Development").length,

            certifications:
                this.byCategory("Certification").length

        };

    }

}

const talentTemplates =
    new TalentTemplates();

export { TalentTemplates };

export default talentTemplates;
