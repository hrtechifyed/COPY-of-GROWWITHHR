/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Bootstrap
 * -----------------------------------------------------------------------------
 * File      : js/bootstrap.js
 * Version   : 1.0.0
 * =============================================================================
 */

import * as Core from "./core/index.js";

import organization from "./modules/organization/index.js";
import hiring from "./modules/hiring/index.js";
import performance from "./modules/performance/index.js";
import leadership from "./modules/leadership/index.js";
import talent from "./modules/talent/index.js";
import rewards from "./modules/rewards/index.js";
import learning from "./modules/learning/index.js";
import culture from "./modules/culture/index.js";
import policy from "./modules/policy/index.js";
import compliance from "./modules/compliance/index.js";

import aiAdvisor from "./advisor/index.js";

class GrowWithHRPlatform {

    constructor() {

        this.initialized = false;

    }

    initialize() {

        if (this.initialized) {

            return this;

        }

        this.core = Core;

        this.modules = Object.freeze({

            organization,

            hiring,

            performance,

            leadership,

            talent,

            rewards,

            learning,

            culture,

            policy,

            compliance

        });

        this.shared = Object.freeze({

            frameworks:
                Core.knowledgeLibrary.frameworks(),

            benchmarks:
                Core.knowledgeLibrary.benchmarks(),

            playbooks:
                Core.knowledgeLibrary.playbooks(),

            templates:
                Core.knowledgeLibrary.templates(),

            rules:
                Core.knowledgeLibrary.rules(),

            reports:
                Core.knowledgeLibrary.reports()

        });

        this.graph =
            Core.intelligenceGraph;

        this.advisor =
            aiAdvisor;

        this.dashboard =
            Core.executiveDashboard;

        this.people =
            Core.peopleIntelligenceReport;

        this.initialized = true;

        return this;

    }

    getCore() {

        return this.core;

    }

    getModules() {

        return this.modules;

    }

    getShared() {

        return this.shared;

    }

    getAdvisor() {

        return this.advisor;

    }

    getDashboard() {

        return this.dashboard;

    }

    getPeopleReport() {

        return this.people;

    }

    getGraph() {

        return this.graph;

    }

}

const platform =
    new GrowWithHRPlatform();

export function bootstrap() {

    return platform.initialize();

}

export default bootstrap;
