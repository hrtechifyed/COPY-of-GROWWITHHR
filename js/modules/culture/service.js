/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Culture Intelligence Service
 * -----------------------------------------------------------------------------
 * File      : js/modules/culture/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "../../core/company-dna.js";
import cultureEngine from "./engine.js";
import cultureRules from "./rules.js";

class CultureService {

    analyze(context = {}) {

        const company = companyDNA.get();

        return cultureEngine.analyze({

            company,

            rules: cultureRules.evaluate(company),

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

            module: "culture",

            score: analysis.score,

            findings: analysis.findings.length,

            risks: analysis.risks.length,

            recommendations:
                analysis.recommendations.length

        };

    }

}

const cultureService =
    new CultureService();

export { CultureService };

export default cultureService;
