/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Rewards Intelligence Module
 * -----------------------------------------------------------------------------
 * File      : js/modules/rewards/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import intelligenceEngine from "../../core/intelligence-engine.js";
import ruleEngine from "../../core/rule-engine.js";

import engine from "./engine.js";

const MODULE = "rewards";

/*
|--------------------------------------------------------------------------
| Rewards Rules
|--------------------------------------------------------------------------
*/

ruleEngine.register({

    module: MODULE,

    name: "salary-structure",

    description: "Salary structure readiness.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.workforce.totalEmployees > 0,

            message:
                "Workforce available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "organization-growth",

    description: "Rewards maturity based on growth stage.",

    priority: "Medium",

    execute(context) {

        return {

            passed:
                Boolean(
                    context.business.growthStage
                ),

            message:
                "Growth stage available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "reporting-structure",

    description: "Compensation hierarchy readiness.",

    priority: "Medium",

    execute(context) {

        return {

            passed:
                context.organization.reportingLevels > 0,

            message:
                "Reporting hierarchy available."

        };

    }

});

/*
|--------------------------------------------------------------------------
| Register Module
|--------------------------------------------------------------------------
*/

intelligenceEngine.register({

    name: MODULE,

    version: "1.0.0",

    analyze: engine.analyze.bind(engine)

});

export default engine;
