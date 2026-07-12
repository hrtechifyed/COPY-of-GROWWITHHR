/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Organization Intelligence Mapper
 * -----------------------------------------------------------------------------
 * File      : js/modules/organization/mapper.js
 * Version   : 1.0.0
 * =============================================================================
 */

class OrganizationMapper {

    toDashboard(result = {}) {

        return {

            module: "Organization Intelligence",

            score: result.score || 0,

            findings: result.findings || [],

            risks: result.risks || [],

            recommendations: result.recommendations || [],

            references: result.references || {}

        };

    }

    toPeopleIntelligence(result = {}) {

        return {

            module: "Organization",

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

            module: "Organization",

            score: result.score || 0,

            riskCount:
                (result.risks || []).length,

            recommendationCount:
                (result.recommendations || []).length,

            summary:
                `Organization Score: ${result.score || 0}`,

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

            organizationScore:
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

const organizationMapper =
    new OrganizationMapper();

export { OrganizationMapper };

export default organizationMapper;
