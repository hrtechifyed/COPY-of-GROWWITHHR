/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Culture Intelligence Module
 * -----------------------------------------------------------------------------
 * File      : js/modules/culture/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import intelligenceEngine from "../../core/intelligence-engine.js";
import ruleEngine from "../../core/rule-engine.js";

import engine from "./engine.js";

const MODULE = "culture";

/*
|--------------------------------------------------------------------------
| Culture Rules
|--------------------------------------------------------------------------
*/

ruleEngine.register({

    module: MODULE,

    name: "organization-structure",

    description: "Organization structure available.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.organization.departments.length > 0,

            message:
                "Organization structure available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "leadership-readiness",

    description: "Leadership available for culture initiatives.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.organization.reportingLevels >= 2,

            message:
                "Leadership structure available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "growth-stage",

    description: "Culture maturity based on growth stage.",

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
