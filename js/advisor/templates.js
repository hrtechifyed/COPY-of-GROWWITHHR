/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * AI Advisor Templates
 * -----------------------------------------------------------------------------
 * File      : js/advisor/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class AdvisorTemplates {

    constructor() {

        this.templates = [

            {
                id: "ADV-TEMP-001",
                category: "Executive Summary",
                name: "Executive Summary Report",
                description:
                    "Organization-wide executive summary template.",
                applicableTo:
                    "Leadership"
            },

            {
                id: "ADV-TEMP-002",
                category: "Health Score",
                name: "Organization Health Scorecard",
                description:
                    "Overall organization intelligence scorecard.",
                applicableTo:
                    "Leadership"
            },

            {
                id: "ADV-TEMP-003",
                category: "Risk Assessment",
                name: "Risk Assessment Report",
                description:
                    "Enterprise risk assessment template.",
                applicableTo:
                    "Leadership"
            },

            {
                id: "ADV-TEMP-004",
                category: "Recommendations",
                name: "Priority Recommendation Plan",
                description:
                    "Prioritized recommendation template.",
                applicableTo:
                    "Management"
            },

            {
                id: "ADV-TEMP-005",
                category: "Roadmap",
                name: "Implementation Roadmap",
                description:
                    "30-60-90 day implementation roadmap.",
                applicableTo:
                    "Leadership"
            },

            {
                id: "ADV-TEMP-006",
                category: "Dashboard",
                name: "Executive Dashboard",
                description:
                    "Executive dashboard reporting template.",
                applicableTo:
                    "Leadership"
            },

            {
                id: "ADV-TEMP-007",
                category: "Governance",
                name: "Governance Review",
                description:
                    "Governance assessment template.",
                applicableTo:
                    "Board & Leadership"
            },

            {
                id: "ADV-TEMP-008",
                category: "Transformation",
                name: "Transformation Tracker",
                description:
                    "Business transformation tracking template.",
                applicableTo:
                    "Leadership"
            }

        ];

    }

    list() {

        return [...this.templates];

    }

    get(id) {

        return this.templates.find(

            template =>

                template.id === id

        ) || null;

    }

    byCategory(category) {

        return this.templates.filter(

            template =>

                template.category === category

        );

    }

    search(keyword = "") {

        const query =
            keyword.toLowerCase();

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

            executiveSummary:
                this.byCategory(
                    "Executive Summary"
                ).length,

            healthScore:
                this.byCategory(
                    "Health Score"
                ).length,

            riskAssessment:
                this.byCategory(
                    "Risk Assessment"
                ).length,

            recommendations:
                this.byCategory(
                    "Recommendations"
                ).length,

            roadmap:
                this.byCategory(
                    "Roadmap"
                ).length,

            dashboard:
                this.byCategory(
                    "Dashboard"
                ).length,

            governance:
                this.byCategory(
                    "Governance"
                ).length,

            transformation:
                this.byCategory(
                    "Transformation"
                ).length

        };

    }

}

const advisorTemplates =
    new AdvisorTemplates();

export { AdvisorTemplates };

export default advisorTemplates;
