/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Leadership Intelligence Templates
 * -----------------------------------------------------------------------------
 * File      : js/modules/leadership/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class LeadershipTemplates {

    constructor() {

        this.templates = [

            {
                id: "LEAD-TEMP-001",
                category: "Leadership",
                name: "Leadership Competency Framework",
                description: "Core leadership competency framework.",
                applicableTo: "All Leaders"
            },

            {
                id: "LEAD-TEMP-002",
                category: "Coaching",
                name: "Founder Coaching Plan",
                description: "Structured coaching plan for founders.",
                applicableTo: "Founders"
            },

            {
                id: "LEAD-TEMP-003",
                category: "Coaching",
                name: "Manager Coaching Guide",
                description: "Coaching framework for people managers.",
                applicableTo: "Managers"
            },

            {
                id: "LEAD-TEMP-004",
                category: "Delegation",
                name: "Delegation Matrix",
                description: "Delegation responsibility matrix.",
                applicableTo: "Leadership Team"
            },

            {
                id: "LEAD-TEMP-005",
                category: "Communication",
                name: "Difficult Conversation Guide",
                description: "Framework for difficult workplace conversations.",
                applicableTo: "Managers"
            },

            {
                id: "LEAD-TEMP-006",
                category: "Decision Making",
                name: "Decision Framework",
                description: "Decision-making framework for leadership teams.",
                applicableTo: "Leadership"
            },

            {
                id: "LEAD-TEMP-007",
                category: "Management",
                name: "One-on-One Meeting Template",
                description: "Recurring manager-employee meeting template.",
                applicableTo: "Managers"
            },

            {
                id: "LEAD-TEMP-008",
                category: "Leadership",
                name: "Leadership Development Plan",
                description: "Leadership capability development roadmap.",
                applicableTo: "Emerging Leaders"
            },

            {
                id: "LEAD-TEMP-009",
                category: "Assessment",
                name: "Leadership Assessment",
                description: "Leadership capability assessment template.",
                applicableTo: "Leadership Team"
            },

            {
                id: "LEAD-TEMP-010",
                category: "Succession",
                name: "Leadership Succession Plan",
                description: "Leadership continuity and succession planning template.",
                applicableTo: "Executive Team"
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

            leadership:
                this.byCategory("Leadership").length,

            coaching:
                this.byCategory("Coaching").length,

            delegation:
                this.byCategory("Delegation").length,

            communication:
                this.byCategory("Communication").length,

            decisionMaking:
                this.byCategory("Decision Making").length,

            management:
                this.byCategory("Management").length,

            assessment:
                this.byCategory("Assessment").length,

            succession:
                this.byCategory("Succession").length

        };

    }

}

const leadershipTemplates =
    new LeadershipTemplates();

export { LeadershipTemplates };

export default leadershipTemplates;
