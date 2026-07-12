/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Core Event Bus
 * -----------------------------------------------------------------------------
 * File      : js/core/event-bus.js
 * Version   : 1.0.0
 * =============================================================================
 */

import { EVENTS } from "../shared/constants/index.js";

class EventBus {

    constructor() {

        this.listeners = new Map();
        this.onceListeners = new Map();

    }

    on(event, callback) {

        if (typeof callback !== "function") {
            throw new TypeError("Event callback must be a function.");
        }

        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        this.listeners.get(event).add(callback);

        return () => this.off(event, callback);

    }

    once(event, callback) {

        if (typeof callback !== "function") {
            throw new TypeError("Event callback must be a function.");
        }

        if (!this.onceListeners.has(event)) {
            this.onceListeners.set(event, new Set());
        }

        this.onceListeners.get(event).add(callback);

        return () => this.off(event, callback);

    }

    off(event, callback) {

        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);

            if (this.listeners.get(event).size === 0) {
                this.listeners.delete(event);
            }
        }

        if (this.onceListeners.has(event)) {
            this.onceListeners.get(event).delete(callback);

            if (this.onceListeners.get(event).size === 0) {
                this.onceListeners.delete(event);
            }
        }

    }

    emit(event, payload = {}) {

        if (this.listeners.has(event)) {

            [...this.listeners.get(event)].forEach(listener => {

                try {
                    listener(payload);
                } catch (error) {
                    console.error(error);
                }

            });

        }

        if (this.onceListeners.has(event)) {

            [...this.onceListeners.get(event)].forEach(listener => {

                try {
                    listener(payload);
                } catch (error) {
                    console.error(error);
                }

            });

            this.onceListeners.delete(event);

        }

    }

    has(event) {

        return (
            this.listeners.has(event) ||
            this.onceListeners.has(event)
        );

    }

    listenerCount(event) {

        let count = 0;

        if (this.listeners.has(event)) {
            count += this.listeners.get(event).size;
        }

        if (this.onceListeners.has(event)) {
            count += this.onceListeners.get(event).size;
        }

        return count;

    }

    clear(event) {

        if (event) {
            this.listeners.delete(event);
            this.onceListeners.delete(event);
            return;
        }

        this.listeners.clear();
        this.onceListeners.clear();

    }

    events() {

        return Array.from(new Set([
            ...this.listeners.keys(),
            ...this.onceListeners.keys()
        ]));

    }

    initialize() {

        this.emit(EVENTS.PLATFORM_INITIALIZED, {
            initializedAt: new Date().toISOString()
        });

    }

}

const eventBus = new EventBus();

export { EventBus };

export default eventBus;
