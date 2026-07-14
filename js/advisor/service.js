/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * AI Advisor Service
 * -----------------------------------------------------------------------------
 * File      : js/advisor/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import advisorEngine from "./advisor.js";

class AdvisorService {

    analyze(context = {}) {

        return advisorEngine.analyze(
            context
        );

    }

    summary(context = {}) {

        const analysis =
            this.analyze(context);

        return {

    company:
        analysis.company.company?.legalName || "",

    modules:
        analysis.modules.length,

    observations:
        analysis.observations.length,

    risks:
        analysis.risks.length,

    opportunities:
        analysis.opportunities.length,

    recommendations:
        analysis.recommendations.length

};
    }

    recommendations(context = {}) {

        const analysis =
            this.analyze(context);

        return analysis.modules

            .filter(module =>

                module.recommendations > 0

            )

            .sort(

                (a, b) =>

                    b.recommendations -

                    a.recommendations

            );

    }

    priorities(context = {}) {

    const analysis = this.analyze(context);

    return analysis.recommendations;

}

}

const advisorService =
    new AdvisorService();

export { AdvisorService };

export default advisorService;
