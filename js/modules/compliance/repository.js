/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Compliance Intelligence Repository
 * -----------------------------------------------------------------------------
 * File      : js/modules/compliance/repository.js
 * Version   : 1.0.0
 * =============================================================================
 */

import knowledgeLibrary from "../../core/knowledge-library.js";

class ComplianceRepository {

    constructor() {

        this.categories = Object.freeze({

            laws: "laws",

            policies: "policies",

            templates: "templates",

            notifications: "notifications",

            registers: "registers",

            returns: "returns",

            licenses: "licenses",

            guides: "guides",

            sop: "sop"

        });

    }

    all() {

        return {

            laws: this.laws(),

            policies: this.policies(),

            templates: this.templates(),

            notifications: this.notifications(),

            registers: this.registers(),

            returns: this.returns(),

            licenses: this.licenses(),

            guides: this.guides(),

            sop: this.sop()

        };

    }

    laws() {

        return knowledgeLibrary.getCategory(
            this.categories.laws
        );

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

    notifications() {

        return knowledgeLibrary.getCategory(
            this.categories.notifications
        );

    }

    registers() {

        return knowledgeLibrary.getCategory(
            this.categories.registers
        );

    }

    returns() {

        return knowledgeLibrary.getCategory(
            this.categories.returns
        );

    }

    licenses() {

        return knowledgeLibrary.getCategory(
            this.categories.licenses
        );

    }

    guides() {

        return knowledgeLibrary.getCategory(
            this.categories.guides
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

            laws: data.laws.length,

            policies: data.policies.length,

            templates: data.templates.length,

            notifications: data.notifications.length,

            registers: data.registers.length,

            returns: data.returns.length,

            licenses: data.licenses.length,

            guides: data.guides.length,

            sop: data.sop.length,

            total:

                data.laws.length +

                data.policies.length +

                data.templates.length +

                data.notifications.length +

                data.registers.length +

                data.returns.length +

                data.licenses.length +

                data.guides.length +

                data.sop.length

        };

    }

}

const complianceRepository =
    new ComplianceRepository();

export { ComplianceRepository };

export default complianceRepository;
