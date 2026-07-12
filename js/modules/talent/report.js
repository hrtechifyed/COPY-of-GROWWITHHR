/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Talent Intelligence Report Builder
 * -----------------------------------------------------------------------------
 * File      : js/modules/talent/report.js
 * Version   : 1.0.0
 * =============================================================================
 */

import reportEngine from "../../core/report-engine.js";
import talentService from "./service.js";

class TalentReport {

    generate(context = {}) {

        const analysis = talentService.analyze(context);

        return reportEngine.generate({

            type: "Talent",

            module: "talent",

            title: "Talent Intelligence Report",

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

        const analysis = talentService.analyze(context);

        return {

            module: "Talent Intelligence",

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

        const analysis = talentService.analyze(context);

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

const talentReport =
    new TalentReport();

export { TalentReport };

export default talentReport;
