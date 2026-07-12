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
                analysis.company.company
                    ?.legalName || "",

            overallScore:
                analysis.overallScore,

            modules:
                analysis.modules.length

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

        const analysis =
            this.analyze(context);

        return analysis.modules

            .filter(module =>

                module.score < 75

            )

            .sort(

                (a, b) =>

                    a.score -

                    b.score

            );

    }

}

const advisorService =
    new AdvisorService();

export { AdvisorService };

export default advisorService;
