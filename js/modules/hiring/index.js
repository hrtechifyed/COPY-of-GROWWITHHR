/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Hiring Intelligence Module
 * -----------------------------------------------------------------------------
 * File      : js/modules/hiring/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import intelligenceEngine from "../../core/intelligence-engine.js";
import ruleEngine from "../../core/rule-engine.js";

import engine from "./engine.js";

const MODULE = "hiring";

/*
|--------------------------------------------------------------------------
| Hiring Rules
|--------------------------------------------------------------------------
*/

ruleEngine.register({

    module: MODULE,

    name: "hiring-process",

    description: "Hiring process availability.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.organization.departments.length > 0,

            message:
                "Departments available for hiring."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "workforce-planning",

    description: "Hiring plan readiness.",

    priority: "Medium",

    execute(context) {

        return {

            passed:
                context.workforce.totalEmployees >= 0,

            message:
                "Workforce information available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "growth-stage",

    description: "Hiring recommendations based on growth stage.",

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
