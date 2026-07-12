/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Policy Intelligence Module
 * -----------------------------------------------------------------------------
 * File      : js/modules/policy/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import intelligenceEngine from "../../core/intelligence-engine.js";
import ruleEngine from "../../core/rule-engine.js";

import engine from "./engine.js";

const MODULE = "policy";

/*
|--------------------------------------------------------------------------
| Policy Rules
|--------------------------------------------------------------------------
*/

ruleEngine.register({

    module: MODULE,

    name: "company-information",

    description: "Company profile available.",

    priority: "High",

    execute(context) {

        return {

            passed:
                Boolean(
                    context.company.legalName
                ),

            message:
                "Company profile available."

        };

    }

});

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

    name: "business-model",

    description: "Business model identified.",

    priority: "Medium",

    execute(context) {

        return {

            passed:
                Boolean(
                    context.business.businessModel
                ),

            message:
                "Business model identified."

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
