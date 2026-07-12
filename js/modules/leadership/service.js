/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Leadership Intelligence Service
 * -----------------------------------------------------------------------------
 * File      : js/modules/leadership/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "../../core/company-dna.js";
import leadershipEngine from "./engine.js";
import leadershipRules from "./rules.js";

class LeadershipService {

    analyze(context = {}) {

        const company = companyDNA.get();

        return leadershipEngine.analyze({

            company,

            rules: leadershipRules.evaluate(company),

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

            module: "leadership",

            score: analysis.score,

            findings: analysis.findings.length,

            risks: analysis.risks.length,

            recommendations:
                analysis.recommendations.length

        };

    }

}

const leadershipService =
    new LeadershipService();

export { LeadershipService };

export default leadershipService;
