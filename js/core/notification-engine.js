/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Notification Engine
 * -----------------------------------------------------------------------------
 * File      : js/core/notification-engine.js
 * Version   : 1.0.0
 * =============================================================================
 */

import {
    EVENTS
} from "../shared/constants/index.js";

import {
    createId,
    timestamp,
    cloneObject
} from "../shared/utils/index.js";

import eventBus from "./event-bus.js";
import logger from "./logger.js";

class NotificationEngine {

    constructor() {

        this.notifications = new Map();

    }

    create({

        module = "core",

        category = "General",

        title = "",

        message = "",

        priority = "Medium",

        type = "System",

        recipient = "System",

        read = false,

        metadata = {}

    } = {}) {

        const notification = {

            id: createId("notification"),

            module,

            category,

            title,

            message,

            priority,

            type,

            recipient,

            read,

            metadata,

            createdAt: timestamp(),

            updatedAt: timestamp()

        };

        this.notifications.set(
            notification.id,
            notification
        );

        eventBus.emit(
            EVENTS.NOTIFICATION_CREATED,
            cloneObject(notification)
        );

        logger.info(
            "Notification created.",
            {
                id: notification.id,
                module
            }
        );

        return cloneObject(notification);

    }

    get(id) {

        const notification = this.notifications.get(id);

        return notification
            ? cloneObject(notification)
            : null;

    }

    list() {

        return [...this.notifications.values()]
            .map(cloneObject);

    }

    listByModule(module) {

        return this.list().filter(
            notification =>
                notification.module === module
        );

    }

    listByPriority(priority) {

        return this.list().filter(
            notification =>
                notification.priority === priority
        );

    }

    unread() {

        return this.list().filter(
            notification => !notification.read
        );

    }

    read(id) {

        const notification = this.notifications.get(id);

        if (!notification) {
            return null;
        }

        notification.read = true;
        notification.updatedAt = timestamp();

        logger.info(
            "Notification marked as read.",
            { id }
        );

        return cloneObject(notification);

    }

    unreadNotification(id) {

        const notification = this.notifications.get(id);

        if (!notification) {
            return null;
        }

        notification.read = false;
        notification.updatedAt = timestamp();

        return cloneObject(notification);

    }

    remove(id) {

        return this.notifications.delete(id);

    }

    clear() {

        this.notifications.clear();

    }

    statistics() {

        const statistics = {

            total: this.notifications.size,

            unread: 0,

            read: 0,

            modules: {}

        };

        for (const notification of this.notifications.values()) {

            if (notification.read) {
                statistics.read++;
            } else {
                statistics.unread++;
            }

            statistics.modules[
                notification.module
            ] =
                (statistics.modules[
                    notification.module
                ] || 0) + 1;

        }

        return statistics;

    }

}

const notificationEngine =
    new NotificationEngine();

export { NotificationEngine };

export default notificationEngine;
