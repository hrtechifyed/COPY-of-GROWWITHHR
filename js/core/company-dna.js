/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Company DNA Engine
 * -----------------------------------------------------------------------------
 * File      : js/core/company-dna.js
 * Version   : 1.0.0
 * =============================================================================
 */

import { STORAGE, EVENTS } from "../shared/constants/index.js";
import {
    createId,
    cloneObject,
    merge,
    timestamp,
    immutable
} from "../shared/utils/index.js";

import validator from "./validator.js";
import persistence from "./persistence.js";
import eventBus from "./event-bus.js";
import logger from "./logger.js";

class CompanyDNA {

    constructor() {

        this.state = this.load();

    }

    defaultState() {

        return {

            id: createId("company"),

            version: "1.0.0",

            company: {
                legalName: "",
                displayName: "",
                entityType: "",
                incorporationDate: "",
                cin: "",
                pan: "",
                tan: "",
                gstin: ""
            },

            industry: {
                sector: "",
                subSector: "",
                nicCode: "",
                businessActivities: []
            },

            geography: {
                headquarters: {
                    country: "India",
                    state: "",
                    city: ""
                },
                operatingStates: [],
                operatingCities: [],
                countries: ["India"]
            },

            workforce: {
                totalEmployees: 0,
                permanentEmployees: 0,
                contractEmployees: 0,
                apprentices: 0,
                interns: 0,
                consultants: 0,
                remoteEmployees: 0,
                womenEmployees: 0,
                disabledEmployees: 0
            },

            organization: {
                departments: [],
                reportingLevels: 0,
                businessUnits: [],
                branches: [],
                factories: [],
                offices: []
            },

            business: {
                businessModel: "",
                fundingStage: "",
                growthStage: "",
                annualRevenue: "",
                payrollFrequency: "",
                financialYear: "April-March"
            },

            compliance: {
                registrations: [],
                licenses: [],
                policies: [],
                applicableActs: [],
                statutoryBodies: []
            },

            metadata: {
                createdAt: timestamp(),
                updatedAt: timestamp(),
                createdBy: "System",
                updatedBy: "System"
            }

        };

    }

    load() {

        return persistence.load(
            STORAGE.COMPANY_DNA,
            this.defaultState()
        );

    }

    save() {

        persistence.save(
            STORAGE.COMPANY_DNA,
            this.state
        );

        eventBus.emit(EVENTS.COMPANY_DNA_UPDATED, this.snapshot());

    }

    snapshot() {

        return immutable(this.state);

    }

    get() {

        return this.snapshot();

    }

    getSection(section) {

        return cloneObject(this.state[section]);

    }

    update(section, data) {

        if (!(section in this.state)) {
            throw new Error(`Unknown section '${section}'.`);
        }

        this.state[section] = merge(
            this.state[section],
            data
        );

        this.state.metadata.updatedAt = timestamp();

        const validation = validator.validate(
            "company-dna",
            this.state
        );

        if (!validation.valid) {
            throw new Error(
                JSON.stringify(validation.errors)
            );
        }

        this.save();

        logger.info("Company DNA updated.", {
            section
        });

        return this.snapshot();

    }

    replace(data) {

        this.state = merge(
            this.defaultState(),
            data
        );

        this.state.metadata.updatedAt = timestamp();

        this.save();

        return this.snapshot();

    }

    reset() {

        this.state = this.defaultState();

        persistence.remove(STORAGE.COMPANY_DNA);

        this.save();

        eventBus.emit(
            EVENTS.COMPANY_DNA_RESET,
            this.snapshot()
        );

        logger.info("Company DNA reset.");

        return this.snapshot();

    }

    exists() {

        return persistence.exists(
            STORAGE.COMPANY_DNA
        );

    }

    export() {

        return JSON.stringify(
            this.state,
            null,
            2
        );

    }

    import(json) {

        this.replace(JSON.parse(json));

        eventBus.emit(
            EVENTS.COMPANY_DNA_CREATED,
            this.snapshot()
        );

        logger.info("Company DNA imported.");

        return this.snapshot();

    }

}

const companyDNA = new CompanyDNA();

export { CompanyDNA };

export default companyDNA;
