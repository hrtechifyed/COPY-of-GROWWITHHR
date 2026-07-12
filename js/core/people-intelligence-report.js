/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * People Intelligence Report
 * -----------------------------------------------------------------------------
 * File      : js/core/people-intelligence-report.js
 * Version   : 1.0.0
 * =============================================================================
 */

import advisorService from "../advisor/service.js";

class PeopleIntelligenceReport {

    generate(context = {}) {

        const analysis =
            advisorService.analyze(
                context
            );

        return {

            generatedAt:
                new Date().toISOString(),

            company:
                analysis.company,

            overallScore:
                analysis.overallScore,

            modules:
                analysis.modules,

            executiveSummary:
                this.executiveSummary(
                    analysis
                ),

            priorities:
                advisorService
                    .priorities(
                        context
                    ),

            recommendations:
                advisorService
                    .recommendations(
                        context
                    )

        };

    }

    executiveSummary(analysis = {}) {

        return {

            overallScore:
                analysis.overallScore || 0,

            moduleCount:
                (analysis.modules || [])
                    .length,

            status:

                analysis.overallScore >= 90
                    ? "Excellent"
                    : analysis.overallScore >= 75
                        ? "Good"
                        : analysis.overallScore >= 60
                            ? "Needs Attention"
                            : "Critical"

        };

    }

    dashboard(context = {}) {

        const report =
            this.generate(context);

        return {

            company:

                report.company
                    ?.company
                    ?.legalName || "",

            overallScore:
                report.overallScore,

            moduleCount:
                report.modules.length,

            recommendationCount:
                report.recommendations
                    .length,

            priorityCount:
                report.priorities
                    .length

        };

    }

}

const peopleIntelligenceReport =
    new PeopleIntelligenceReport();

export { PeopleIntelligenceReport };

export default peopleIntelligenceReport;
