/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Rewards Intelligence Mapper
 * -----------------------------------------------------------------------------
 * File      : js/modules/rewards/mapper.js
 * Version   : 1.0.0
 * =============================================================================
 */

class RewardsMapper {

    toDashboard(result = {}) {

        return {

            module: "Rewards Intelligence",

            score: result.score || 0,

            findings: result.findings || [],

            risks: result.risks || [],

            recommendations: result.recommendations || [],

            references: result.references || {}

        };

    }

    toPeopleIntelligence(result = {}) {

        return {

            module: "Rewards",

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

            module: "Rewards",

            score: result.score || 0,

            riskCount:
                (result.risks || []).length,

            recommendationCount:
                (result.recommendations || []).length,

            summary:
                `Rewards Score: ${result.score || 0}`,

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

            rewardsScore:
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

const rewardsMapper =
    new RewardsMapper();

export { RewardsMapper };

export default rewardsMapper;
