/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Organization Intelligence Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/organization/repository.js
 * Version   : 1.0.0
 * =============================================================================
 */

import knowledgeLibrary from "../../core/knowledge-library.js";

class OrganizationRepository {

    constructor() {

        this.categories = Object.freeze({

            frameworks: "frameworks",

            templates: "templates",

            guides: "guides",

            benchmarks: "benchmarks",

            policies: "policies",

            sop: "sop"

        });

    }

    all() {

        return {

            frameworks: this.frameworks(),

            templates: this.templates(),

            guides: this.guides(),

            benchmarks: this.benchmarks(),

            policies: this.policies(),

            sop: this.sop()

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

    sop() {

        return knowledgeLibrary.getCategory(
            this.categories.sop
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

            sop:
                data.sop.length,

            total:

                data.frameworks.length +

                data.templates.length +

                data.guides.length +

                data.benchmarks.length +

                data.policies.length +

                data.sop.length

        };

    }

}

const organizationRepository =
    new OrganizationRepository();

export { OrganizationRepository };

export default organizationRepository;
