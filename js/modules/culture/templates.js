/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Culture Intelligence Templates
 * -----------------------------------------------------------------------------
 * File      : js/modules/culture/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class CultureTemplates {

    constructor() {

        this.templates = [

            {
                id: "CUL-TEMP-001",
                category: "Values",
                name: "Core Values Framework",
                description: "Organization values definition framework.",
                applicableTo: "All Organizations"
            },

            {
                id: "CUL-TEMP-002",
                category: "Engagement",
                name: "Employee Engagement Survey",
                description: "Standard engagement survey template.",
                applicableTo: "All Employees"
            },

            {
                id: "CUL-TEMP-003",
                category: "Recognition",
                name: "Recognition Program",
                description: "Employee recognition framework.",
                applicableTo: "All Organizations"
            },

            {
                id: "CUL-TEMP-004",
                category: "Communication",
                name: "Internal Communication Plan",
                description: "Internal communication strategy template.",
                applicableTo: "Leadership"
            },

            {
                id: "CUL-TEMP-005",
                category: "Change Management",
                name: "Change Management Framework",
                description: "Organizational change implementation guide.",
                applicableTo: "Growing Organizations"
            },

            {
                id: "CUL-TEMP-006",
                category: "Team Health",
                name: "Team Health Check",
                description: "Team effectiveness assessment template.",
                applicableTo: "Managers"
            },

            {
                id: "CUL-TEMP-007",
                category: "Rituals",
                name: "Culture Ritual Planner",
                description: "Recurring employee engagement rituals.",
                applicableTo: "HR"
            },

            {
                id: "CUL-TEMP-008",
                category: "Experience",
                name: "Employee Experience Journey",
                description: "Employee lifecycle experience map.",
                applicableTo: "HR"
            },

            {
                id: "CUL-TEMP-009",
                category: "Feedback",
                name: "Pulse Survey",
                description: "Short employee pulse survey template.",
                applicableTo: "All Employees"
            },

            {
                id: "CUL-TEMP-010",
                category: "Dashboard",
                name: "Culture Dashboard",
                description: "Culture and engagement analytics dashboard.",
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

            values:
                this.byCategory("Values").length,

            engagement:
                this.byCategory("Engagement").length,

            recognition:
                this.byCategory("Recognition").length,

            communication:
                this.byCategory("Communication").length,

            changeManagement:
                this.byCategory("Change Management").length,

            teamHealth:
                this.byCategory("Team Health").length,

            rituals:
                this.byCategory("Rituals").length,

            experience:
                this.byCategory("Experience").length,

            feedback:
                this.byCategory("Feedback").length,

            dashboards:
                this.byCategory("Dashboard").length

        };

    }

}

const cultureTemplates =
    new CultureTemplates();

export { CultureTemplates };

export default cultureTemplates;
