/* ==========================================
   executive-advisory-report.js
   Dynamic Executive Advisory Engine
   Uses the shared report-experience model without changing page layout.
========================================== */
class ExecutiveAdvisoryReport {
    constructor() {
        if (window.__growwithhrExecutiveReportInitialising) {
            return window.__growwithhrExecutiveReportInitialising;
        }
        window.__growwithhrExecutiveReportInitialising = this;
        this.reportData = JSON.parse(localStorage.getItem("growwithhr-report") || "{}");
        this.ids = {};
        this.initialiseWhenReady();
    }

    async initialiseWhenReady() {
        if (!window.GrowWithHRReportExperience) {
            await Promise.race([
                new Promise((resolve) => window.addEventListener("growwithhr:report-experience-ready", resolve, { once: true })),
                new Promise((resolve) => setTimeout(resolve, 1200))
            ]);
        }
        this.model = this.buildModel();
        this.cacheElements();
        this.init();
        window.executiveAdvisory = this;
    }

    fallbackRecommendations() {
        const selected = Array.isArray(this.reportData.priorities)
            ? this.reportData.priorities
            : [];
        const titles = selected.length
            ? selected.slice(0, 4)
            : ["Policies and compliance", "Workforce planning", "Manager capability"];
        const library = {
            "Hiring and onboarding": [
                "Growth increases pressure on role clarity, selection quality and consistent onboarding.",
                "Create a repeatable hiring and onboarding system with approved role profiles, structured interviews and a practical first-90-day plan."
            ],
            "Policies and compliance": [
                "Policies and statutory governance need to keep pace with workforce size, location and operating complexity.",
                "Establish a controlled policy and compliance calendar covering ownership, due dates, evidence, communication and escalation."
            ],
            "Performance and rewards": [
                "Clear expectations and transparent reward decisions become more important as the organisation grows.",
                "Introduce a simple performance rhythm connecting business priorities, role outcomes, manager feedback and fair decisions."
            ],
            "Manager capability": [
                "Growth outcomes depend heavily on the quality and consistency of day-to-day management.",
                "Define essential manager expectations and support them with practical routines, tools and coaching."
            ],
            "Culture and engagement": [
                "Culture becomes less dependent on founder proximity and more dependent on repeated leadership behaviour.",
                "Translate the desired culture into observable behaviours, leadership routines and employee experiences."
            ],
            "HR operations and technology": [
                "Fragmented people administration can reduce visibility and create avoidable operational risk.",
                "Standardise employee-data, document, leave, attendance and reporting processes before adding system complexity."
            ],
            "Workforce planning": [
                "Hiring plans need a practical view of capability, cost, timing and organisational capacity.",
                "Create a rolling workforce plan linking business priorities to critical roles, timing, cost and alternatives."
            ],
            "Organisation design": [
                "Unclear accountabilities and overlapping decision rights can slow execution.",
                "Clarify structure, accountabilities, spans of control and decision rights for the next stage of growth."
            ]
        };
        return titles.map((title) => ({
            title,
            observation: library[title]?.[0] || "Leadership should create clearer ownership and repeatable people practices.",
            recommendation: library[title]?.[1] || "Assign an accountable owner, define dated actions and review progress using evidence."
        }));
    }

    buildModel() {
        const service = window.GrowWithHRPDF;
        if (service && typeof service.buildAdvisoryModel === "function") {
            return service.buildAdvisoryModel({ report: this.reportData });
        }
        const employees = Math.max(1, Number.parseInt(this.reportData.employees, 10) || 1);
        const base = {
            ...this.reportData,
            employees,
            employeeLabel: `${employees} ${employees === 1 ? "employee" : "employees"}`,
            recommendations: this.fallbackRecommendations(),
            executiveSummary: [
                `${this.text(this.reportData.companyName, "The organisation")} operates in ${this.text(this.reportData.industry, "its selected industry")} with ${employees} ${employees === 1 ? "employee" : "employees"}.`,
                "The immediate objective is to create enough clarity, consistency and evidence for leadership to scale without unnecessary process."
            ],
            strengths: [
                "Leadership has completed a structured review of the organisation's current people context.",
                "The workforce and operating model have been made visible for planning and governance decisions."
            ],
            priorities: this.fallbackRecommendations().map((item) => item.title),
            roadmap: {
                first30: ["Assign owners and confirm the highest-priority actions."],
                next60: ["Introduce the minimum repeatable practices and retain completion evidence."],
                next90: ["Review adoption, outcomes and the next set of priorities."]
            },
            compliance: [
                "Confirm employment documentation, records and policy acknowledgements are complete and securely retained.",
                "Maintain a compliance calendar with named owners, due dates and evidence of completion."
            ],
            opportunities: [
                "Use workforce information as a regular leadership input.",
                "Strengthen manager capability before adding unnecessary process or technology."
            ]
        };
        return window.GrowWithHRReportExperience?.enhanceModel
            ? window.GrowWithHRReportExperience.enhanceModel(base)
            : base;
    }

    cacheElements() {
        this.ids = [
            "companyName", "companyState", "companyIndustry", "companyEntity", "employeeCount",
            "growthStage", "peopleStructure", "organisationStage", "executiveFocus",
            "observationsContainer", "attentionContainer", "recommendationsContainer",
            "roadmapContainer", "complianceContainer", "opportunitiesContainer"
        ].reduce((items, id) => ({ ...items, [id]: document.getElementById(id) }), {});
    }

    init() {
        this.reduceStaticRepetition();
        this.populateCompanyProfile();
        this.generateExecutiveNarrative();
        this.generateStrengths();
        this.generateLeadershipPriorities();
        this.generateRecommendations();
        this.generateRoadmap();
        this.generateComplianceReview();
        this.generateStrategicOpportunities();
        this.generateLookingAhead();
        this.bindDownload();
    }

    text(value, fallback = "Not provided") {
        return value && String(value).trim() ? String(value).trim() : fallback;
    }

    number(value, minimum = 0) {
        const parsed = Number.parseInt(value, 10);
        return Number.isSafeInteger(parsed) && parsed >= minimum ? parsed : minimum;
    }

    stage() {
        const employees = this.number(this.model.employees, 1);
        if (employees >= 500) return "Enterprise Organisation";
        if (employees >= 100) return "Scaling Organisation";
        if (employees >= 20) return "Growth Organisation";
        if (employees === 1) return "One-person Organisation";
        return "Developing Organisation";
    }

    set(id, value) {
        if (this.ids[id]) this.ids[id].textContent = value;
    }

    escape(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    card(title, body, meta = "Executive Guidance", extra = "") {
        return `<article class="exec-card"><span>${this.escape(meta)}</span><h3>${this.escape(title)}</h3><p>${this.escape(body)}</p>${extra}</article>`;
    }

    reduceStaticRepetition() {
        const about = document.querySelector("section .executive-summary-card .summary-hero-copy");
        if (about) {
            about.innerHTML = `
                <p class="eyebrow">ABOUT THIS ADVISORY</p>
                <h2>Prepared for Executive Leadership</h2>
                <p>This personalised working document translates the information supplied during the GrowWithHR Executive Assessment into practical leadership actions. It supports discussion and planning and is not legal or regulatory advice.</p>`;
        }
        const outlook = document.getElementById("futureOutlook");
        if (outlook) outlook.innerHTML = '<p id="lookingAheadText"></p>';
    }

    populateCompanyProfile() {
        const data = this.model;
        const employees = this.number(data.employees, 1);
        const stage = this.stage();
        this.set("companyName", this.text(data.companyName));
        this.set("companyState", this.text(data.primaryState || data.state));
        this.set("companyIndustry", this.text(data.industry));
        this.set("companyEntity", this.text(data.entity));
        this.set("employeeCount", data.employeeLabel || `${employees} ${employees === 1 ? "employee" : "employees"}`);
        this.set("growthStage", this.text(data.fundingStage, stage));
        this.set("peopleStructure", this.text(data.peopleFunction));
        this.set("organisationStage", stage);
        const focus = data.peopleFunction === "No Formal HR/People Function"
            ? "Establish clear people ownership before growth creates avoidable execution and compliance pressure."
            : data.peopleFunction === "Founder Led"
                ? "Move founder-led people decisions into repeatable management routines, policies and ownership."
                : "Use the existing people capability to strengthen leadership cadence, workforce planning and governance.";
        this.set("executiveFocus", focus);
    }

    generateExecutiveNarrative() {
        const target = document.getElementById("executiveNarrative") || document.querySelector(".executive-narrative p");
        if (!target) return;
        target.innerHTML = (this.model.executiveSummary || [])
            .map((text) => `<p>${this.escape(text)}</p>`).join("");
    }

    generateStrengths() {
        this.renderCards("observationsContainer", (this.model.strengths || []).map((body, index) => [`Positive foundation ${index + 1}`, body]), "Organisational Strength");
    }

    generateLeadershipPriorities() {
        this.renderCards("attentionContainer", (this.model.recommendations || []).map((item) => [item.title, item.observation]), "Leadership Priority");
    }

    implementationMarkup(item) {
        const steps = (item.howTo || []).map((step) => `<li>${this.escape(step)}</li>`).join("");
        const resource = item.resourceUrl
            ? `<a class="exec-card__resource" href="${this.escape(item.resourceUrl)}" download>${this.escape(item.resourceLabel || "Open template")} →</a>`
            : "";
        return `<div class="exec-card__implementation">
            <h4>How to implement</h4>
            <ol>${steps}</ol>
            <div class="exec-card__meta-row">
                ${item.owner ? `<span><strong>Owner:</strong> ${this.escape(item.owner)}</span>` : ""}
                ${item.timeframe ? `<span><strong>Timing:</strong> ${this.escape(item.timeframe)}</span>` : ""}
            </div>${resource}</div>`;
    }

    generateRecommendations() {
        const target = this.ids.recommendationsContainer;
        if (!target) return;
        target.innerHTML = (this.model.recommendations || []).map((item) =>
            this.card(item.title, item.recommendation, "Strategic Recommendation", this.implementationMarkup(item))
        ).join("");
    }

    generateRoadmap() {
        const roadmap = [
            ["0–30 days", (this.model.roadmap?.first30 || []).join(" ")],
            ["31–60 days", (this.model.roadmap?.next60 || []).join(" ")],
            ["61–90 days", (this.model.roadmap?.next90 || []).join(" ")]
        ].filter(([, body]) => body);
        this.renderCards("roadmapContainer", roadmap, "Executive Roadmap");
    }

    generateComplianceReview() {
        this.renderCards("complianceContainer", (this.model.compliance || []).map((body, index) => [`Review area ${index + 1}`, body]), "Compliance Review");
    }

    generateStrategicOpportunities() {
        this.renderCards("opportunitiesContainer", (this.model.opportunities || []).map((body, index) => [`Opportunity ${index + 1}`, body]), "Strategic Opportunity");
    }

    generateLookingAhead() {
        const target = document.getElementById("lookingAheadText") || document.querySelector("#lookingAhead p");
        if (target) target.textContent = `Revisit this advisory whenever the workforce, locations, funding stage or operating model materially changes. Current workforce: ${this.model.employeeLabel}.`;
    }

    renderCards(containerId, items, meta) {
        const container = this.ids[containerId];
        if (container) container.innerHTML = items.map(([title, body]) => this.card(title, body, meta)).join("");
    }

    bindDownload() {
        document.querySelectorAll("[data-action='download-pdf'], #downloadPdf, #downloadReport").forEach((button) => {
            if (button.dataset.reportDownloadBound === "true") return;
            button.dataset.reportDownloadBound = "true";
            button.addEventListener("click", async () => {
                if (window.GrowWithHRPDF?.downloadAdvisoryPdf) {
                    await window.GrowWithHRPDF.downloadAdvisoryPdf({ report: this.reportData });
                } else {
                    window.print();
                }
            });
        });
    }
}
