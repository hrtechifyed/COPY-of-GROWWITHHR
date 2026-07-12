/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Performance Intelligence Templates
 * -----------------------------------------------------------------------------
 * File      : js/modules/performance/templates.js
 * Version   : 1.0.0
 * =============================================================================
 */

class PerformanceTemplates {

    constructor() {

        this.templates = [

            {
                id: "PERF-TEMP-001",
                category: "Goal Setting",
                name: "OKR Framework",
                description: "Company and team Objectives & Key Results template.",
                applicableTo: "All Organizations"
            },

            {
                id: "PERF-TEMP-002",
                category: "Goal Setting",
                name: "KPI Library",
                description: "Department-wise KPI framework.",
                applicableTo: "All Departments"
            },

            {
                id: "PERF-TEMP-003",
                category: "Review",
                name: "Quarterly Performance Review",
                description: "Quarterly employee performance review template.",
                applicableTo: "All Employees"
            },

            {
                id: "PERF-TEMP-004",
                category: "Review",
                name: "Annual Performance Review",
                description: "Annual appraisal form.",
                applicableTo: "All Employees"
            },

            {
                id: "PERF-TEMP-005",
                category: "Feedback",
                name: "360 Degree Feedback",
                description: "Peer, manager and self-feedback questionnaire.",
                applicableTo: "Managers & Leaders"
            },

            {
                id: "PERF-TEMP-006",
                category: "Calibration",
                name: "Performance Calibration Sheet",
                description: "Performance calibration meeting worksheet.",
                applicableTo: "Leadership Team"
            },

            {
                id: "PERF-TEMP-007",
                category: "Improvement",
                name: "Performance Improvement Plan",
                description: "Employee Performance Improvement Plan (PIP).",
                applicableTo: "Employees"
            },

            {
                id: "PERF-TEMP-008",
                category: "Promotion",
                name: "Promotion Assessment",
                description: "Promotion readiness evaluation template.",
                applicableTo: "Managers"
            },

            {
                id: "PERF-TEMP-009",
                category: "Reward",
                name: "Performance Reward Matrix",
                description: "Performance-based rewards framework.",
                applicableTo: "HR"
            },

            {
                id: "PERF-TEMP-010",
                category: "Dashboard",
                name: "Performance Dashboard",
                description: "Organization-wide performance analytics dashboard.",
                applicableTo: "Leadership"
            }

        ];

    }

    list() {

        return [...this.templates];

    }

    get(id) {

        return this.templates.find(
            template => template.id === id
        ) || null;

    }

    byCategory(category) {

        return this.templates.filter(
            template => template.category === category
        );

    }

    search(keyword = "") {

        const query = keyword.toLowerCase();

        return this.templates.filter(template =>

            template.name
                .toLowerCase()
                .includes(query)

            ||

            template.description
                .toLowerCase()
                .includes(query)

            ||

            template.category
                .toLowerCase()
                .includes(query)

        );

    }

    statistics() {

        return {

            totalTemplates:
                this.templates.length,

            goalSetting:
                this.byCategory("Goal Setting").length,

            reviews:
                this.byCategory("Review").length,

            feedback:
                this.byCategory("Feedback").length,

            calibration:
                this.byCategory("Calibration").length,

            improvement:
                this.byCategory("Improvement").length,

            promotion:
                this.byCategory("Promotion").length,

            rewards:
                this.byCategory("Reward").length,

            dashboards:
                this.byCategory("Dashboard").length

        };

    }

}

const performanceTemplates =
    new PerformanceTemplates();

export { PerformanceTemplates };

export default performanceTemplates;
