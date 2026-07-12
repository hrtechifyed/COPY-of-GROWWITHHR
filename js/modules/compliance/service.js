/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Compliance Intelligence Service
 * -----------------------------------------------------------------------------
 * File      : js/modules/compliance/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "../../core/company-dna.js";
import complianceEngine from "./engine.js";
import complianceRules from "./rules.js";

class ComplianceService {

    analyze(context = {}) {

        const company = companyDNA.get();

        return complianceEngine.analyze({

            company,

            rules: complianceRules.evaluate(company),

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

            module: "compliance",

            score: analysis.score,

            findings: analysis.findings.length,

            risks: analysis.risks.length,

            recommendations:
                analysis.recommendations.length

        };

    }

}

const complianceService = new ComplianceService();

export { ComplianceService };

export default complianceService;
