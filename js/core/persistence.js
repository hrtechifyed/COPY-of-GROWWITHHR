/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Core Persistence Engine
 * -----------------------------------------------------------------------------
 * File      : js/core/persistence.js
 * Version   : 1.0.0
 * =============================================================================
 */

import logger from "./logger.js";
import {
    PersistenceError
} from "./errors.js";

class Persistence {

    constructor() {

        this.driver = window.localStorage;

    }

    setDriver(driver) {

        if (!driver) {
            throw new PersistenceError(
                "Invalid persistence driver."
            );
        }

        this.driver = driver;

        return this;

    }

    save(key, value) {

        try {

            this.driver.setItem(
                key,
                JSON.stringify(value)
            );

            logger.info("Persistence save successful.", {
                key
            });

            return true;

        } catch (error) {

            throw new PersistenceError(
                "Unable to save data.",
                {
                    key,
                    error: error.message
                }
            );

        }

    }

    load(key, defaultValue = null) {

        try {

            const value = this.driver.getItem(key);

            if (value === null) {
                return defaultValue;
            }

            return JSON.parse(value);

        } catch (error) {

            throw new PersistenceError(
                "Unable to load data.",
                {
                    key,
                    error: error.message
                }
            );

        }

    }

    exists(key) {

        return this.driver.getItem(key) !== null;

    }

    remove(key) {

        try {

            this.driver.removeItem(key);

            logger.info("Persistence remove successful.", {
                key
            });

            return true;

        } catch (error) {

            throw new PersistenceError(
                "Unable to remove data.",
                {
                    key,
                    error: error.message
                }
            );

        }

    }

    clear() {

        try {

            this.driver.clear();

            logger.info("Persistence storage cleared.");

            return true;

        } catch (error) {

            throw new PersistenceError(
                "Unable to clear storage.",
                {
                    error: error.message
                }
            );

        }

    }

    keys() {

        const keys = [];

        for (let index = 0; index < this.driver.length; index++) {

            keys.push(
                this.driver.key(index)
            );

        }

        return keys;

    }

    export() {

        const data = {};

        this.keys().forEach(key => {

            data[key] = this.load(key);

        });

        return data;

    }

    import(data = {}) {

        Object.entries(data).forEach(([key, value]) => {

            this.save(key, value);

        });

        logger.info("Persistence import completed.", {
            records: Object.keys(data).length
        });

    }

}

const persistence = new Persistence();

export { Persistence };

export default persistence;
