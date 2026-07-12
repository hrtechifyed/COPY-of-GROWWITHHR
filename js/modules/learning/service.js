/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Learning Intelligence Service
 * -----------------------------------------------------------------------------
 * File      : js/modules/learning/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "../../core/company-dna.js";
import learningEngine from "./engine.js";
import learningRules from "./rules.js";

class LearningService {

    analyze(context = {}) {

        const company = companyDNA.get();

        return learningEngine.analyze({

            company,

            rules: learningRules.evaluate(company),

            context

        });

    }

    score() {

        return this.analyze().score;

    }

    findings() {

        return this.analyze().findings;

    }

    risks() {

        return this.analyze().risks;

    }

    recommendations() {

        return this.analyze().recommendations;

    }

    references() {

        return this.analyze().references;

    }

    summary() {

        const analysis = this.analyze();

        return {

            module: "learning",

            score: analysis.score,

            findings: analysis.findings.length,

            risks: analysis.risks.length,

            recommendations:
                analysis.recommendations.length

        };

    }

}

const learningService =
    new LearningService();

export { LearningService };

export default learningService;
