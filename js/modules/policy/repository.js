/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Policy Intelligence Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/policy/repository.js
 * Version   : 1.0.0
 * =============================================================================
 */

import knowledgeLibrary from "../../core/knowledge-library.js";

class PolicyRepository {

    constructor() {

        this.categories = Object.freeze({

            policies: "policies",

            templates: "templates",

            frameworks: "frameworks",

            guides: "guides",

            benchmarks: "benchmarks",

            faqs: "faqs"

        });

    }

    all() {

        return {

            policies: this.policies(),

            templates: this.templates(),

            frameworks: this.frameworks(),

            guides: this.guides(),

            benchmarks: this.benchmarks(),

            faqs: this.faqs()

        };

    }

    policies() {

        return knowledgeLibrary.getCategory(
            this.categories.policies
        );

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

            policies:
                data.policies.length,

            templates:
                data.templates.length,

            frameworks:
                data.frameworks.length,

            guides:
                data.guides.length,

            benchmarks:
                data.benchmarks.length,

            faqs:
                data.faqs.length,

            total:

                data.policies.length +

                data.templates.length +

                data.frameworks.length +

                data.guides.length +

                data.benchmarks.length +

                data.faqs.length

        };

    }

}

const policyRepository =
    new PolicyRepository();

export { PolicyRepository };

export default policyRepository;
