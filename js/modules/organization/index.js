/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Organization Intelligence Module
 * -----------------------------------------------------------------------------
 * File      : js/modules/organization/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import intelligenceEngine from "../../core/intelligence-engine.js";
import ruleEngine from "../../core/rule-engine.js";

import engine from "./engine.js";

const MODULE = "organization";

/*
|--------------------------------------------------------------------------
| Organization Rules
|--------------------------------------------------------------------------
*/

ruleEngine.register({

    module: MODULE,

    name: "department-structure",

    description: "Validate organization departments.",

    priority: "High",

    execute(context) {

        return {

            passed:
                context.organization.departments.length > 0,

            message:
                "Departments available."

        };

    }

});

ruleEngine.register({

    module: MODULE,

    name: "reporting-levels",

    description: "Validate reporting hierarchy.",

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

    name: "business-units",

    description: "Validate business units.",

    priority: "Medium",

    execute(context) {

        return {

            passed:
                context.organization.businessUnits.length >= 0,

            message:
                "Business unit structure available."

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
