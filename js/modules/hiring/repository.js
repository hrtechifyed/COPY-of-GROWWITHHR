/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Hiring Intelligence Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/hiring/repository.js
 * Version   : 1.0.0
 * =============================================================================
 */

import knowledgeLibrary from "../../core/knowledge-library.js";

class HiringRepository {

    constructor() {

        this.categories = Object.freeze({

            templates: "templates",

            frameworks: "frameworks",

            guides: "guides",

            benchmarks: "benchmarks",

            policies: "policies",

            faqs: "faqs"

        });

    }

    all() {

        return {

            templates: this.templates(),

            frameworks: this.frameworks(),

            guides: this.guides(),

            benchmarks: this.benchmarks(),

            policies: this.policies(),

            faqs: this.faqs()

        };

    }

    templates() {

        return knowledgeLibrary.getCategory(
            this.categories.templates
        );

    }

    frameworks() {

        return knowledgeLibrary.getCategory(
            this.categories.frameworks
        );

    }

    guides() {

        return knowledgeLibrary.getCategory(
            this.categories.guides
        );

    }

    benchmarks() {

        return knowledgeLibrary.getCategory(
            this.categories.benchmarks
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

            templates:
                data.templates.length,

            frameworks:
                data.frameworks.length,

            guides:
                data.guides.length,

            benchmarks:
                data.benchmarks.length,

            policies:
                data.policies.length,

            faqs:
                data.faqs.length,

            total:

                data.templates.length +

                data.frameworks.length +

                data.guides.length +

                data.benchmarks.length +

                data.policies.length +

                data.faqs.length

        };

    }

}

const hiringRepository =
    new HiringRepository();

export { HiringRepository };

export default hiringRepository;
