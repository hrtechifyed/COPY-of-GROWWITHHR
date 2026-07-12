/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Compliance Intelligence Mapper
 * -----------------------------------------------------------------------------
 * File      : js/modules/compliance/mapper.js
 * Version   : 1.0.0
 * =============================================================================
 */

class ComplianceMapper {

    toDashboard(result = {}) {

        return {

            module: "Compliance Intelligence",

            score: result.score || 0,

            findings: result.findings || [],

            risks: result.risks || [],

            recommendations: result.recommendations || [],

            references: result.references || {}

        };

    }

    toPeopleIntelligence(result = {}) {

        return {

            module: "Compliance",

            overallScore: result.score || 0,

            findings: (result.findings || []).map(item => ({

                title: item.rule,

                status: item.result?.passed
                    ? "Pass"
                    : "Fail",

                details: item.result?.message || ""

            })),

            risks: result.risks || [],

            recommendations: result.recommendations || []

        };

    }

    toAIContext(result = {}) {

        return {

            module: "Compliance",

            score: result.score || 0,

            riskCount:
                (result.risks || []).length,

            recommendationCount:
                (result.recommendations || []).length,

            summary:

                `Compliance Score: ${result.score || 0}`,

            findings:
                result.findings || []

        };

    }

    toAPI(result = {}) {

        return {

            success: true,

            timestamp: new Date().toISOString(),

            data: {

                score: result.score || 0,

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

            complianceScore:
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

const complianceMapper =
    new ComplianceMapper();

export { ComplianceMapper };

export default complianceMapper;
