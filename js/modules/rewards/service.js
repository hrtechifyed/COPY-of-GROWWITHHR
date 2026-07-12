/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Rewards Intelligence Service
 * -----------------------------------------------------------------------------
 * File      : js/modules/rewards/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "../../core/company-dna.js";
import rewardsEngine from "./engine.js";
import rewardsRules from "./rules.js";

class RewardsService {

    analyze(context = {}) {

        const company = companyDNA.get();

        return rewardsEngine.analyze({

            company,

            rules: rewardsRules.evaluate(company),

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

            module: "rewards",

            score: analysis.score,

            findings: analysis.findings.length,

            risks: analysis.risks.length,

            recommendations:
                analysis.recommendations.length

        };

    }

}

const rewardsService =
    new RewardsService();

export { RewardsService };

export default rewardsService;
