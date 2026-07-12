/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Learning Intelligence Module
 * -----------------------------------------------------------------------------
 * File      : js/modules/learning/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import intelligenceEngine from "../../core/intelligence-engine.js";
import ruleEngine from "../../core/rule-engine.js";

import engine from "./engine.js";

const MODULE = "learning";

/*
|--------------------------------------------------------------------------
| Learning Rules
|--------------------------------------------------------------------------
*/

ruleEngine.register({

    module: MODULE,

    name: "learning-framework",

    description: "Learning framework readiness.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.workforce.totalEmployees > 0,

            message:
                "Workforce information available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "organization-readiness",

    description: "Organization supports structured learning.",

    priority: "Medium",

    execute(context) {

        return {

            passed:
                context.organization.departments.length > 0,

            message:
                "Department structure available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "growth-stage",

    description: "Learning maturity based on growth stage.",

    priority: "Medium",

    execute(context) {

        return {

            passed:
                Boolean(
                    context.business.growthStage
                ),

            message:
                "Growth stage identified."

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
