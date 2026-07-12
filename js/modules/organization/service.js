/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Organization Intelligence Service
 * -----------------------------------------------------------------------------
 * File      : js/modules/organization/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "../../core/company-dna.js";
import organizationEngine from "./engine.js";
import organizationRules from "./rules.js";

class OrganizationService {

    analyze(context = {}) {

        const company = companyDNA.get();

        return organizationEngine.analyze({

            company,

            rules: organizationRules.evaluate(company),

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

            module: "organization",

            score: analysis.score,

            findings: analysis.findings.length,

            risks: analysis.risks.length,

            recommendations:
                analysis.recommendations.length

        };

    }

}

const organizationService =
    new OrganizationService();

export { OrganizationService };

export default organizationService;
