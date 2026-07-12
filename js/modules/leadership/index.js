/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Leadership Intelligence Module
 * -----------------------------------------------------------------------------
 * File      : js/modules/leadership/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import intelligenceEngine from "../../core/intelligence-engine.js";
import ruleEngine from "../../core/rule-engine.js";

import engine from "./engine.js";

const MODULE = "leadership";

/*
|--------------------------------------------------------------------------
| Leadership Rules
|--------------------------------------------------------------------------
*/

ruleEngine.register({

    module: MODULE,

    name: "leadership-hierarchy",

    description: "Leadership hierarchy exists.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.organization.reportingLevels >= 2,

            message:
                "Leadership hierarchy available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "manager-readiness",

    description: "Managers available for coaching.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.workforce.totalEmployees < 15 ||

                context.organization.reportingLevels >= 2,

            message:
                "Management readiness evaluated."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "growth-stage",

    description: "Leadership maturity based on growth stage.",

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
