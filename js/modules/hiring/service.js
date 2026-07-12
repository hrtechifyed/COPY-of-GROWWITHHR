/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Hiring Intelligence Service
 * -----------------------------------------------------------------------------
 * File      : js/modules/hiring/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "../../core/company-dna.js";
import hiringEngine from "./engine.js";
import hiringRules from "./rules.js";

class HiringService {

    analyze(context = {}) {

        const company = companyDNA.get();

        return hiringEngine.analyze({

            company,

            rules: hiringRules.evaluate(company),

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

            module: "hiring",

            score: analysis.score,

            findings: analysis.findings.length,

            risks: analysis.risks.length,

            recommendations:
                analysis.recommendations.length

        };

    }

}

const hiringService =
    new HiringService();

export { HiringService };

export default hiringService;
