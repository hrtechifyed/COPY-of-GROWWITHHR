/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Learning Intelligence Templates
 * -----------------------------------------------------------------------------
 * File      : js/modules/learning/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class LearningTemplates {

    constructor() {

        this.templates = [

            {
                id: "LRN-TEMP-001",
                category: "Learning Path",
                name: "Employee Learning Path",
                description: "Structured employee learning roadmap.",
                applicableTo: "All Employees"
            },

            {
                id: "LRN-TEMP-002",
                category: "Training",
                name: "Training Needs Analysis",
                description: "Training needs identification framework.",
                applicableTo: "All Departments"
            },

            {
                id: "LRN-TEMP-003",
                category: "Leadership",
                name: "Leadership Development Program",
                description: "Leadership capability development plan.",
                applicableTo: "Managers"
            },

            {
                id: "LRN-TEMP-004",
                category: "Manager",
                name: "Manager Development Plan",
                description: "Structured learning plan for people managers.",
                applicableTo: "Managers"
            },

            {
                id: "LRN-TEMP-005",
                category: "Skills",
                name: "Skill Matrix",
                description: "Department-wise competency and skill matrix.",
                applicableTo: "Departments"
            },

            {
                id: "LRN-TEMP-006",
                category: "Certification",
                name: "Certification Tracker",
                description: "Professional certification tracking template.",
                applicableTo: "Employees"
            },

            {
                id: "LRN-TEMP-007",
                category: "Development",
                name: "Individual Development Plan",
                description: "Personal development planning template.",
                applicableTo: "All Employees"
            },

            {
                id: "LRN-TEMP-008",
                category: "Workshop",
                name: "Training Calendar",
                description: "Annual learning and workshop calendar.",
                applicableTo: "HR & L&D"
            },

            {
                id: "LRN-TEMP-009",
                category: "Assessment",
                name: "Learning Assessment",
                description: "Post-training assessment template.",
                applicableTo: "Learning Teams"
            },

            {
                id: "LRN-TEMP-010",
                category: "Dashboard",
                name: "Learning Dashboard",
                description: "Learning analytics and training dashboard.",
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

            learningPaths:
                this.byCategory("Learning Path").length,

            training:
                this.byCategory("Training").length,

            leadership:
                this.byCategory("Leadership").length,

            manager:
                this.byCategory("Manager").length,

            skills:
                this.byCategory("Skills").length,

            certification:
                this.byCategory("Certification").length,

            development:
                this.byCategory("Development").length,

            workshops:
                this.byCategory("Workshop").length,

            assessment:
                this.byCategory("Assessment").length,

            dashboards:
                this.byCategory("Dashboard").length

        };

    }

}

const learningTemplates =
    new LearningTemplates();

export { LearningTemplates };

export default learningTemplates;
