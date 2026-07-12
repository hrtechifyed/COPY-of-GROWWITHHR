/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * AI Advisor Report Builder
 * -----------------------------------------------------------------------------
 * File      : js/advisor/report.js
 * Version   : 1.0.0
 * =============================================================================
 */

import reportEngine from "../core/report-engine.js";
import advisorService from "./service.js";

class AdvisorReport {

    generate(context = {}) {

        const analysis =
            advisorService.analyze(
                context
            );

        return reportEngine.generate({

            type: "AI Advisor",

            module: "advisor",

            title: "AI Advisor Executive Report",

            score:
                analysis.overallScore,

            findings:
                analysis.modules,

            recommendations:
                advisorService
                    .recommendations(
                        context
                    )

        });

    }

    summary(context = {}) {

        const report =
            this.generate(context);

        return {

            id:
                report.id,

            title:
                report.title,

            score:
                report.score,

            generatedAt:
                report.generatedAt,

            findings:

                report.findings.length,

            recommendations:

                report
                    .recommendations
                    .length

        };

    }

    executiveSummary(context = {}) {

        const analysis =
            advisorService.analyze(
                context
            );

        return {

            module:
                "AI Advisor",

            overallScore:
                analysis.overallScore,

            company:

                analysis.company
                    .company
                    ?.legalName || "",

            modules:

                analysis.modules,

            priorities:

                advisorService
                    .priorities(
                        context
                    )

        };

    }

    dashboard(context = {}) {

        const analysis =
            advisorService.analyze(
                context
            );

        return {

            company:

                analysis.company
                    .company
                    ?.legalName || "",

            overallScore:
                analysis.overallScore,

            moduleCount:

                analysis.modules
                    .length,

            priorityCount:

                advisorService
                    .priorities(
                        context
                    )
                    .length

        };

    }

}

const advisorReport =
    new AdvisorReport();

export { AdvisorReport };

export default advisorReport;
