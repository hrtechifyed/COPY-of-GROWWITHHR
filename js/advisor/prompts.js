/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * AI Advisor Prompt Library
 * -----------------------------------------------------------------------------
 * File      : js/advisor/prompts.js
 * Version   : 1.0.0
 * =============================================================================
 */

class AdvisorPrompts {

    constructor() {

        this.prompts = Object.freeze({

            executiveSummary:

                "Generate an executive summary highlighting organizational health, major risks, strengths and priority actions.",

            organization:

                "Review organization structure and recommend improvements for scalability and governance.",

            hiring:

                "Analyze hiring maturity and recommend improvements for recruitment effectiveness.",

            performance:

                "Analyze performance management practices and recommend actions to improve employee performance.",

            leadership:

                "Assess leadership capability and recommend development priorities.",

            talent:

                "Review talent management practices and identify succession and retention opportunities.",

            rewards:

                "Review rewards strategy and identify compensation and recognition improvements.",

            learning:

                "Assess learning maturity and recommend capability development initiatives.",

            culture:

                "Review organizational culture and recommend employee engagement improvements.",

            policy:

                "Evaluate policy maturity and recommend governance improvements.",

            compliance:

                "Evaluate statutory compliance readiness and identify compliance priorities.",

            recommendations:

                "Prioritize recommendations based on organizational impact, urgency and implementation effort.",

            roadmap:

                "Prepare a phased implementation roadmap covering immediate, short-term and long-term priorities."

        });

    }

    all() {

        return {

            ...this.prompts

        };

    }

    get(name) {

        return this.prompts[name] || "";

    }

    exists(name) {

        return Object.prototype.hasOwnProperty.call(

            this.prompts,

            name

        );

    }

    names() {

        return Object.keys(

            this.prompts

        );

    }

}

const advisorPrompts =
    new AdvisorPrompts();

export { AdvisorPrompts };

export default advisorPrompts;
