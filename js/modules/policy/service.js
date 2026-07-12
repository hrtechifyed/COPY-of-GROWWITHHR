/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Policy Intelligence Service
 * -----------------------------------------------------------------------------
 * File      : js/modules/policy/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "../../core/company-dna.js";
import policyEngine from "./engine.js";
import policyRules from "./rules.js";

class PolicyService {

    analyze(context = {}) {

        const company = companyDNA.get();

        return policyEngine.analyze({

            company,

            rules: policyRules.evaluate(company),

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

            module: "policy",

            score: analysis.score,

            findings: analysis.findings.length,

            risks: analysis.risks.length,

            recommendations:
                analysis.recommendations.length

        };

    }

}

const policyService =
    new PolicyService();

export { PolicyService };

export default policyService;
