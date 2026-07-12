/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Performance Intelligence Mapper
 * -----------------------------------------------------------------------------
 * File      : js/modules/performance/mapper.js
 * Version   : 1.0.0
 * =============================================================================
 */

class PerformanceMapper {

    toDashboard(result = {}) {

        return {

            module: "Performance Intelligence",

            score: result.score || 0,

            findings: result.findings || [],

            risks: result.risks || [],

            recommendations: result.recommendations || [],

            references: result.references || {}

        };

    }

    toPeopleIntelligence(result = {}) {

        return {

            module: "Performance",

            overallScore: result.score || 0,

            findings: (result.findings || []).map(item => ({

                title: item.rule,

                status:
                    item.result?.passed
                        ? "Pass"
                        : "Fail",

                details:
                    item.result?.message || ""

            })),

            risks: result.risks || [],

            recommendations:
                result.recommendations || []

        };

    }

    toAIContext(result = {}) {

        return {

            module: "Performance",

            score: result.score || 0,

            riskCount:
                (result.risks || []).length,

            recommendationCount:
                (result.recommendations || []).length,

            summary:
                `Performance Score: ${result.score || 0}`,

            findings:
                result.findings || []

        };

    }

    toAPI(result = {}) {

        return {

            success: true,

            timestamp:
                new Date().toISOString(),

            data: {

                score:
                    result.score || 0,

                findings:
                    result.findings || [],

                risks:
                    result.risks || [],

                recommendations:
                    result.recommendations || [],

                references:
                    result.references || {}

            }

        };

    }

    toExport(result = {}) {

        return {

            exportedAt:
                new Date().toISOString(),

            performanceScore:
                result.score || 0,

            findings:
                result.findings || [],

            risks:
                result.risks || [],

            recommendations:
                result.recommendations || [],

            references:
                result.references || {}

        };

    }

}

const performanceMapper =
    new PerformanceMapper();

export { PerformanceMapper };

export default performanceMapper;
