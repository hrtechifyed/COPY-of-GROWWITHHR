/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Hiring Intelligence Mapper
 * -----------------------------------------------------------------------------
 * File      : js/modules/hiring/mapper.js
 * Version   : 1.0.0
 * =============================================================================
 */

class HiringMapper {

    toDashboard(result = {}) {

        return {

            module: "Hiring Intelligence",

            score: result.score || 0,

            findings: result.findings || [],

            risks: result.risks || [],

            recommendations: result.recommendations || [],

            references: result.references || {}

        };

    }

    toPeopleIntelligence(result = {}) {

        return {

            module: "Hiring",

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

            module: "Hiring",

            score: result.score || 0,

            riskCount:
                (result.risks || []).length,

            recommendationCount:
                (result.recommendations || []).length,

            summary:
                `Hiring Score: ${result.score || 0}`,

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

            hiringScore:
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

const hiringMapper =
    new HiringMapper();

export { HiringMapper };

export default hiringMapper;
