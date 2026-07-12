/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * AI Advisor Mapper
 * -----------------------------------------------------------------------------
 * File      : js/advisor/mapper.js
 * Version   : 1.0.0
 * =============================================================================
 */

class AdvisorMapper {

    toDashboard(result = {}) {

        return {

            module: "AI Advisor",

            overallScore:
                result.overallScore || 0,

            company:
                result.company || {},

            modules:
                result.modules || []

        };

    }

    toExecutiveSummary(result = {}) {

        return {

            company:

                result.company?.company
                    ?.legalName || "",

            overallScore:

                result.overallScore || 0,

            moduleCount:

                (result.modules || [])
                    .length,

            status:

                result.overallScore >= 90
                    ? "Excellent"
                    : result.overallScore >= 75
                        ? "Good"
                        : result.overallScore >= 60
                            ? "Needs Attention"
                            : "Critical"

        };

    }

    toAPI(result = {}) {

        return {

            success: true,

            timestamp:
                new Date().toISOString(),

            data: {

                company:
                    result.company || {},

                overallScore:
                    result.overallScore || 0,

                modules:
                    result.modules || []

            }

        };

    }

    toExport(result = {}) {

        return {

            exportedAt:
                new Date().toISOString(),

            company:
                result.company || {},

            overallScore:
                result.overallScore || 0,

            modules:
                result.modules || []

        };

    }

    toAIContext(result = {}) {

        return {

            module: "AI Advisor",

            score:
                result.overallScore || 0,

            company:
                result.company || {},

            modules:
                result.modules || []

        };

    }

}

const advisorMapper =
    new AdvisorMapper();

export { AdvisorMapper };

export default advisorMapper;
