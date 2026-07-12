/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Talent Intelligence Service
 * -----------------------------------------------------------------------------
 * File      : js/modules/talent/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "../../core/company-dna.js";
import talentEngine from "./engine.js";
import talentRules from "./rules.js";

class TalentService {

    analyze(context = {}) {

        const company = companyDNA.get();

        return talentEngine.analyze({

            company,

            rules: talentRules.evaluate(company),

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

            module: "talent",

            score: analysis.score,

            findings: analysis.findings.length,

            risks: analysis.risks.length,

            recommendations:
                analysis.recommendations.length

        };

    }

}

const talentService =
    new TalentService();

export { TalentService };

export default talentService;
