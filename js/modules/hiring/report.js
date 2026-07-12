/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Hiring Intelligence Report Builder
 * -----------------------------------------------------------------------------
 * File      : js/modules/hiring/report.js
 * Version   : 1.0.0
 * =============================================================================
 */

import reportEngine from "../../core/report-engine.js";
import hiringService from "./service.js";

class HiringReport {

    generate(context = {}) {

        const analysis = hiringService.analyze(context);

        return reportEngine.generate({

            type: "Hiring",

            module: "hiring",

            title: "Hiring Intelligence Report",

            score: analysis.score,

            findings: analysis.findings,

            recommendations: analysis.recommendations

        });

    }

    summary(context = {}) {

        const report = this.generate(context);

        return {

            id: report.id,

            title: report.title,

            score: report.score,

            generatedAt: report.generatedAt,

            findings: report.findings.length,

            recommendations:
                report.recommendations.length

        };

    }

    executiveSummary(context = {}) {

        const analysis = hiringService.analyze(context);

        return {

            module: "Hiring Intelligence",

            score: analysis.score,

            status:

                analysis.score >= 90
                    ? "Excellent"
                    : analysis.score >= 75
                        ? "Good"
                        : analysis.score >= 60
                            ? "Needs Attention"
                            : "Critical",

            findings: analysis.findings,

            risks: analysis.risks,

            recommendations:
                analysis.recommendations

        };

    }

    dashboard(context = {}) {

        const analysis = hiringService.analyze(context);

        return {

            score: analysis.score,

            findingCount:
                analysis.findings.length,

            riskCount:
                analysis.risks.length,

            recommendationCount:
                analysis.recommendations.length

        };

    }

}

const hiringReport =
    new HiringReport();

export { HiringReport };

export default hiringReport;
