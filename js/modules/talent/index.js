/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Talent Intelligence Module
 * -----------------------------------------------------------------------------
 * File      : js/modules/talent/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import intelligenceEngine from "../../core/intelligence-engine.js";
import ruleEngine from "../../core/rule-engine.js";

import engine from "./engine.js";

const MODULE = "talent";

/*
|--------------------------------------------------------------------------
| Talent Rules
|--------------------------------------------------------------------------
*/

ruleEngine.register({

    module: MODULE,

    name: "career-framework",

    description: "Career framework availability.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.organization.departments.length > 0,

            message:
                "Career framework prerequisites available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "leadership-pipeline",

    description: "Leadership pipeline readiness.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.organization.reportingLevels >= 2,

            message:
                "Leadership pipeline available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "growth-stage",

    description: "Talent maturity based on growth stage.",

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
