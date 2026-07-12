/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Compliance Intelligence Module
 * -----------------------------------------------------------------------------
 * File      : js/modules/compliance/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import intelligenceEngine from "../../core/intelligence-engine.js";
import ruleEngine from "../../core/rule-engine.js";

import engine from "./engine.js";

const MODULE = "compliance";

/*
|--------------------------------------------------------------------------
| Default Rules
|--------------------------------------------------------------------------
*/

ruleEngine.register({

    module: MODULE,

    name: "minimum-workforce",

    description: "Validates workforce information.",

    priority: "High",

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

    name: "head-office",

    description: "Checks headquarters availability.",

    priority: "High",

    execute(context) {

        return {

            passed:
                Boolean(
                    context.geography.headquarters.state
                ),

            message:
                "Headquarters identified."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "entity",

    description: "Checks legal entity.",

    priority: "Critical",

    execute(context) {

        return {

            passed:
                Boolean(
                    context.company.entityType
                ),

            message:
                "Entity available."

        };

    }

});

/*
|--------------------------------------------------------------------------
| Register Intelligence Module
|--------------------------------------------------------------------------
*/

intelligenceEngine.register({

    name: MODULE,

    version: "1.0.0",

    analyze: engine.analyze.bind(engine)

});

export default engine;
