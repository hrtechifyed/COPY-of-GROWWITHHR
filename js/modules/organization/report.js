/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Organization Intelligence Report Builder
 * -----------------------------------------------------------------------------
 * File      : js/modules/organization/report.js
 * Version   : 1.0.0
 * =============================================================================
 */

import reportEngine from "../../core/report-engine.js";
import organizationService from "./service.js";

class OrganizationReport {

    generate(context = {}) {

        const analysis = organizationService.analyze(context);

        return reportEngine.generate({

            type: "Organization",

            module: "organization",

            title: "Organization Intelligence Report",

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

        const analysis = organizationService.analyze(context);

        return {

            module: "Organization Intelligence",

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

        const analysis = organizationService.analyze(context);

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

const organizationReport =
    new OrganizationReport();

export { OrganizationReport };

export default organizationReport;
