/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * AI Advisor Repository
 * -----------------------------------------------------------------------------
 * File      : js/advisor/repository.js
 * Version   : 1.0.0
 * =============================================================================
 */

import knowledgeLibrary from "../core/knowledge-library.js";

class AdvisorRepository {

    constructor() {

        this.categories = Object.freeze({

            guides: "guides",

            frameworks: "frameworks",

            templates: "templates",

            benchmarks: "benchmarks",

            policies: "policies",

            playbooks: "playbooks",

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

            playbooks: this.playbooks(),

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

    playbooks() {

        return knowledgeLibrary.getCategory(
            this.categories.playbooks
        );

    }

    faqs() {

        return knowledgeLibrary.getCategory(
            this.categories.faqs
        );

    }

    search(keyword = "") {

        return knowledgeLibrary.search(
            keyword
        );

    }

    statistics() {

        const data =
            this.all();

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

            playbooks:
                data.playbooks.length,

            faqs:
                data.faqs.length,

            total:

                data.guides.length +

                data.frameworks.length +

                data.templates.length +

                data.benchmarks.length +

                data.policies.length +

                data.playbooks.length +

                data.faqs.length

        };

    }

}

const advisorRepository =
    new AdvisorRepository();

export { AdvisorRepository };

export default advisorRepository;
