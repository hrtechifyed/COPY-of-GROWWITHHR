/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Executive Dashboard
 * -----------------------------------------------------------------------------
 * File      : js/core/executive-dashboard.js
 * Version   : 1.0.0
 * =============================================================================
 */

import advisorService from "../advisor/service.js";
import peopleIntelligenceReport from "./people-intelligence-report.js";
import intelligenceGraph from "./intelligence-graph.js";

class ExecutiveDashboard {

    generate(context = {}) {

        const analysis =
            advisorService.analyze(
                context
            );

        const report =
            peopleIntelligenceReport.generate(
                context
            );

        return {

            generatedAt:
                new Date().toISOString(),

            company:
                analysis.company,

            overallScore:
                analysis.overallScore,

            moduleScores:
                analysis.modules,

            graph:
                intelligenceGraph.summary(),

            executiveSummary:
                report.executiveSummary,

            priorities:
                report.priorities,

            recommendations:
                report.recommendations

        };

    }

    summary(context = {}) {

        const dashboard =
            this.generate(context);

        return {

            company:

                dashboard.company
                    ?.company
                    ?.legalName || "",

            overallScore:
                dashboard.overallScore,

            moduleCount:
                dashboard.moduleScores
                    .length,

            recommendationCount:
                dashboard
                    .recommendations
                    .length,

            priorityCount:
                dashboard
                    .priorities
                    .length

        };

    }

}

const executiveDashboard =
    new ExecutiveDashboard();

export { ExecutiveDashboard };

export default executiveDashboard;
