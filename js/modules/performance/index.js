/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Performance Intelligence Module
 * -----------------------------------------------------------------------------
 * File      : js/modules/performance/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import intelligenceEngine from "../../core/intelligence-engine.js";
import ruleEngine from "../../core/rule-engine.js";

import engine from "./engine.js";

const MODULE = "performance";

/*
|--------------------------------------------------------------------------
| Performance Rules
|--------------------------------------------------------------------------
*/

ruleEngine.register({

    module: MODULE,

    name: "goal-framework",

    description: "Performance goal framework available.",

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

    name: "reporting-structure",

    description: "Reporting hierarchy available.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.organization.reportingLevels > 0,

            message:
                "Reporting hierarchy defined."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "employee-strength",

    description: "Performance process applicability.",

    priority: "Medium",

    execute(context) {

        return {

            passed:
                context.workforce.totalEmployees > 0,

            message:
                "Employee information available."

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
