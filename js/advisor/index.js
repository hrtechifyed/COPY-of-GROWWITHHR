/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * AI Advisor Module
 * -----------------------------------------------------------------------------
 * File      : js/advisor/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import advisorService from "./service.js";

class AIAdvisor {

    analyze(context = {}) {

        return advisorService.analyze(
            context
        );

    }

    summary(context = {}) {

        return advisorService.summary(
            context
        );

    }

    recommendations(context = {}) {

        return advisorService
            .recommendations(context);

    }

    priorities(context = {}) {

        return advisorService
            .priorities(context);

    }

}

const aiAdvisor =
    new AIAdvisor();

export { AIAdvisor };

export { default as advisorEngine } from "./advisor.js";
export { AdvisorEngine } from "./advisor.js";

export { default as advisorService } from "./service.js";
export { AdvisorService } from "./service.js";

export { default as advisorRepository } from "./repository.js";
export { AdvisorRepository } from "./repository.js";

export { default as advisorMapper } from "./mapper.js";
export { AdvisorMapper } from "./mapper.js";

export { default as advisorReport } from "./report.js";
export { AdvisorReport } from "./report.js";

export { default as advisorTemplates } from "./templates.js";
export { AdvisorTemplates } from "./templates.js";

export { default as advisorPrompts } from "./prompts.js";
export { AdvisorPrompts } from "./prompts.js";

export default aiAdvisor;
