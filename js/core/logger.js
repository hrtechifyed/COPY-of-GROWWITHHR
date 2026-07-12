/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Core Logger
 * -----------------------------------------------------------------------------
 * File      : js/core/logger.js
 * Version   : 1.0.0
 * =============================================================================
 */

import { PLATFORM } from "../shared/constants/index.js";
import { LogLevel } from "../shared/enums/index.js";

class Logger {

    constructor() {

        this.level = LogLevel.INFO;
        this.history = [];
        this.maxHistory = 5000;
        this.enabled = true;

    }

    setLevel(level) {

        this.level = level;
        return this;

    }

    getLevel() {

        return this.level;

    }

    enable() {

        this.enabled = true;

    }

    disable() {

        this.enabled = false;

    }

    clear() {

        this.history.length = 0;

    }

    getHistory() {

        return [...this.history];

    }

    export() {

        return JSON.stringify(this.history, null, 2);

    }

    debug(message, context = {}) {

        this.write(LogLevel.DEBUG, message, context);

    }

    info(message, context = {}) {

        this.write(LogLevel.INFO, message, context);

    }

    warn(message, context = {}) {

        this.write(LogLevel.WARN, message, context);

    }

    error(message, context = {}) {

        this.write(LogLevel.ERROR, message, context);

    }

    fatal(message, context = {}) {

        this.write(LogLevel.FATAL, message, context);

    }

    write(level, message, context = {}) {

        if (!this.enabled) {
            return;
        }

        const record = Object.freeze({

            id: crypto.randomUUID(),

            timestamp: new Date().toISOString(),

            application: PLATFORM.NAME,

            version: PLATFORM.VERSION,

            level,

            message,

            context

        });

        this.history.push(record);

        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        switch (level) {

            case LogLevel.DEBUG:
                console.debug(record);
                break;

            case LogLevel.INFO:
                console.info(record);
                break;

            case LogLevel.WARN:
                console.warn(record);
                break;

            case LogLevel.ERROR:
                console.error(record);
                break;

            case LogLevel.FATAL:
                console.error(record);
                break;

            default:
                console.log(record);

        }

    }

}

const logger = new Logger();

export { Logger };

export default logger;
