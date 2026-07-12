/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Talent Intelligence Mapper
 * -----------------------------------------------------------------------------
 * File      : js/modules/talent/mapper.js
 * Version   : 1.0.0
 * =============================================================================
 */

class TalentMapper {

    toDashboard(result = {}) {

        return {

            module: "Talent Intelligence",

            score: result.score || 0,

            findings: result.findings || [],

            risks: result.risks || [],

            recommendations: result.recommendations || [],

            references: result.references || {}

        };

    }

    toPeopleIntelligence(result = {}) {

        return {

            module: "Talent",

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

            module: "Talent",

            score: result.score || 0,

            riskCount:
                (result.risks || []).length,

            recommendationCount:
                (result.recommendations || []).length,

            summary:
                `Talent Score: ${result.score || 0}`,

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

            talentScore:
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

const talentMapper =
    new TalentMapper();

export { TalentMapper };

export default talentMapper;
