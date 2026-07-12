/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Culture Intelligence Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/culture/repository.js
 * Version   : 1.0.0
 * =============================================================================
 */

import knowledgeLibrary from "../../core/knowledge-library.js";

class CultureRepository {

    constructor() {

        this.categories = Object.freeze({

            guides: "guides",

            frameworks: "frameworks",

            templates: "templates",

            benchmarks: "benchmarks",

            policies: "policies",

            faqs: "faqs"

        });

    }

    all() {

        return {

            guides: this.guides(),

            frameworks: this.frameworks(),

            templates: this.templates(),

            benchmarks: this.benchmarks(),

            policies: this.policies(),

            faqs: this.faqs()

        };

    }

    guides() {

        return knowledgeLibrary.getCategory(
            this.categories.guides
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

            guides:
                data.guides.length,

            frameworks:
                data.frameworks.length,

            templates:
                data.templates.length,

            benchmarks:
                data.benchmarks.length,

            policies:
                data.policies.length,

            faqs:
                data.faqs.length,

            total:

                data.guides.length +

                data.frameworks.length +

                data.templates.length +

                data.benchmarks.length +

                data.policies.length +

                data.faqs.length

        };

    }

}

const cultureRepository =
    new CultureRepository();

export { CultureRepository };

export default cultureRepository;
