/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Performance Intelligence Service
 * -----------------------------------------------------------------------------
 * File      : js/modules/performance/service.js
 * Version   : 1.0.0
 * =============================================================================
 */

import companyDNA from "../../core/company-dna.js";
import performanceEngine from "./engine.js";
import performanceRules from "./rules.js";

class PerformanceService {

    analyze(context = {}) {

        const company = companyDNA.get();

        return performanceEngine.analyze({

            company,

            rules: performanceRules.evaluate(company),

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

            module: "performance",

            score: analysis.score,

            findings: analysis.findings.length,

            risks: analysis.risks.length,

            recommendations:
                analysis.recommendations.length

        };

    }

}

const performanceService =
    new PerformanceService();

export { PerformanceService };

export default performanceService;
