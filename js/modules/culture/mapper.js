/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Culture Intelligence Mapper
 * -----------------------------------------------------------------------------
 * File      : js/modules/culture/mapper.js
 * Version   : 1.0.0
 * =============================================================================
 */

class CultureMapper {

    toDashboard(result = {}) {

        return {

            module: "Culture Intelligence",

            score: result.score || 0,

            findings: result.findings || [],

            risks: result.risks || [],

            recommendations: result.recommendations || [],

            references: result.references || {}

        };

    }

    toPeopleIntelligence(result = {}) {

        return {

            module: "Culture",

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

            module: "Culture",

            score: result.score || 0,

            riskCount:
                (result.risks || []).length,

            recommendationCount:
                (result.recommendations || []).length,

            summary:
                `Culture Score: ${result.score || 0}`,

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

            cultureScore:
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

const cultureMapper =
    new CultureMapper();

export { CultureMapper };

export default cultureMapper;
