/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Core Cache Engine
 * -----------------------------------------------------------------------------
 * File      : js/core/cache.js
 * Version   : 1.0.0
 * =============================================================================
 */

import { CACHE } from "../shared/constants/index.js";
import logger from "./logger.js";

class Cache {

    constructor() {

        this.store = new Map();

        this.defaultTTL = CACHE.DEFAULT_TTL;

    }

    set(key, value, ttl = this.defaultTTL) {

        const expiresAt = Date.now() + ttl;

        this.store.set(key, {
            value: structuredClone(value),
            expiresAt
        });

        return value;

    }

    get(key) {

        const item = this.store.get(key);

        if (!item) {
            return null;
        }

        if (Date.now() > item.expiresAt) {

            this.store.delete(key);

            return null;

        }

        return structuredClone(item.value);

    }

    has(key) {

        return this.get(key) !== null;

    }

    delete(key) {

        return this.store.delete(key);

    }

    clear() {

        this.store.clear();

    }

    keys() {

        return [...this.store.keys()];

    }

    values() {

        return [...this.store.values()]
            .map(item => structuredClone(item.value));

    }

    entries() {

        return [...this.store.entries()]
            .map(([key, item]) => ({
                key,
                value: structuredClone(item.value)
            }));

    }

    size() {

        return this.store.size;

    }

    cleanup() {

        const now = Date.now();

        for (const [key, item] of this.store.entries()) {

            if (now > item.expiresAt) {

                this.store.delete(key);

            }

        }

    }

    remember(key, producer, ttl = this.defaultTTL) {

        const cached = this.get(key);

        if (cached !== null) {

            return cached;

        }

        const value = producer();

        this.set(key, value, ttl);

        return value;

    }

    async rememberAsync(key, producer, ttl = this.defaultTTL) {

        const cached = this.get(key);

        if (cached !== null) {

            return cached;

        }

        const value = await producer();

        this.set(key, value, ttl);

        return value;

    }

    statistics() {

        this.cleanup();

        return Object.freeze({

            entries: this.store.size,

            defaultTTL: this.defaultTTL

        });

    }

    export() {

        const data = [];

        for (const [key, value] of this.store.entries()) {

            data.push({
                key,
                value
            });

        }

        return structuredClone(data);

    }

    import(data = []) {

        this.clear();

        data.forEach(item => {

            this.store.set(item.key, item.value);

        });

        logger.info("Cache restored.", {
            entries: this.store.size
        });

    }

}

const cache = new Cache();

setInterval(() => {

    cache.cleanup();

}, 60000);

export { Cache };

export default cache;
