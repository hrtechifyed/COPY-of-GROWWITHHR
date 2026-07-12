/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Rewards Intelligence Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/rewards/repository.js
 * Version   : 1.0.0
 * =============================================================================
 */

import knowledgeLibrary from "../../core/knowledge-library.js";

class RewardsRepository {

    constructor() {

        this.categories = Object.freeze({

            benchmarks: "benchmarks",

            frameworks: "frameworks",

            templates: "templates",

            guides: "guides",

            policies: "policies",

            faqs: "faqs"

        });

    }

    all() {

        return {

            benchmarks: this.benchmarks(),

            frameworks: this.frameworks(),

            templates: this.templates(),

            guides: this.guides(),

            policies: this.policies(),

            faqs: this.faqs()

        };

    }

    benchmarks() {

        return knowledgeLibrary.getCategory(
            this.categories.benchmarks
        );

    }

    frameworks() {

        return knowledgeLibrary.getCategory(
            this.categories.frameworks
        );

    }

    templates() {

        return knowledgeLibrary.getCategory(
            this.categories.templates
        );

    }

    guides() {

        return knowledgeLibrary.getCategory(
            this.categories.guides
        );

    }

    policies() {

        return knowledgeLibrary.getCategory(
            this.categories.policies
        );

    }

    faqs() {

        return knowledgeLibrary.getCategory(
            this.categories.faqs
        );

    }

    search(keyword = "") {

        return knowledgeLibrary.search(keyword);

    }

    statistics() {

        const data = this.all();

        return {

            benchmarks:
                data.benchmarks.length,

            frameworks:
                data.frameworks.length,

            templates:
                data.templates.length,

            guides:
                data.guides.length,

            policies:
                data.policies.length,

            faqs:
                data.faqs.length,

            total:

                data.benchmarks.length +

                data.frameworks.length +

                data.templates.length +

                data.guides.length +

                data.policies.length +

                data.faqs.length

        };

    }

}

const rewardsRepository =
    new RewardsRepository();

export { RewardsRepository };

export default rewardsRepository;
