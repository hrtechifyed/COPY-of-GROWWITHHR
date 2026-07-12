/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Talent Intelligence Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/talent/repository.js
 * Version   : 1.0.0
 * =============================================================================
 */

import knowledgeLibrary from "../../core/knowledge-library.js";

class TalentRepository {

    constructor() {

        this.categories = Object.freeze({

            frameworks: "frameworks",

            templates: "templates",

            guides: "guides",

            benchmarks: "benchmarks",

            policies: "policies",

            faqs: "faqs"

        });

    }

    all() {

        return {

            frameworks: this.frameworks(),

            templates: this.templates(),

            guides: this.guides(),

            benchmarks: this.benchmarks(),

            policies: this.policies(),

            faqs: this.faqs()

        };

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

            frameworks:
                data.frameworks.length,

            templates:
                data.templates.length,

            guides:
                data.guides.length,

            benchmarks:
                data.benchmarks.length,

            policies:
                data.policies.length,

            faqs:
                data.faqs.length,

            total:

                data.frameworks.length +

                data.templates.length +

                data.guides.length +

                data.benchmarks.length +

                data.policies.length +

                data.faqs.length

        };

    }

}

const talentRepository =
    new TalentRepository();

export { TalentRepository };

export default talentRepository;
