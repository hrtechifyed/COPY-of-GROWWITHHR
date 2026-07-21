/* ==========================================
   executive-advisory-report.js
   Dynamic Executive Advisory Engine
   Uses the same advisory model as PDF generation.
========================================== */
class ExecutiveAdvisoryReport {
    constructor() {
        this.reportData = JSON.parse(localStorage.getItem("growwithhr-report") || "{}");
        this.model = this.buildModel();
        this.cacheElements();
        this.init();
    }

    buildModel() {
        const service = window.GrowWithHRPDF;
        if (service && typeof service.buildAdvisoryModel === "function") {
            return service.buildAdvisoryModel({ report: this.reportData });
        }
        const employees = Math.max(1, Number.parseInt(this.reportData.employees, 10) || 1);
        return { ...this.reportData, employees, employeeLabel: `${employees} ${employees === 1 ? "employee" : "employees"}` };
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
        if (!about) return;
        about.innerHTML = `
            <p class="eyebrow">ABOUT THIS ADVISORY</p>
            <h2>Prepared for Executive Leadership</h2>
            <p>This personalised working document translates the information supplied during the GrowWithHR Executive Assessment into practical leadership actions. It is intended to support discussion and planning, and is not legal or regulatory advice.</p>`;
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
        const paragraphs = Array.isArray(this.model.executiveSummary) ? this.model.executiveSummary : [];
        target.innerHTML = paragraphs.map((text) => `<p>${this.escape(text)}</p>`).join("") ||
            `<p>${this.escape(this.model.companyName)} has ${this.escape(this.model.employeeLabel)}. The advisory below focuses on practical people, governance and growth actions.</p>`;
    }

    generateStrengths() {
        const strengths = (this.model.strengths || []).map((body, index) => [
            `Positive foundation ${index + 1}`,
            body
        ]);
        this.renderCards("observationsContainer", strengths, "Organisational Strength");
    }

    generateLeadershipPriorities() {
        const items = (this.model.recommendations || []).map((item) => [item.title, item.observation]);
        this.renderCards("attentionContainer", items, "Leadership Priority");
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
            </div>
            ${resource}
        </div>`;
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
        const items = (this.model.compliance || []).map((body, index) => [`Review area ${index + 1}`, body]);
        this.renderCards("complianceContainer", items, "Compliance Review");
    }

    generateStrategicOpportunities() {
        const items = (this.model.opportunities || []).map((body, index) => [`Opportunity ${index + 1}`, body]);
        this.renderCards("opportunitiesContainer", items, "Strategic Opportunity");
    }

    generateLookingAhead() {
        const target = document.getElementById("lookingAheadText") || document.querySelector("#lookingAhead p");
        if (!target) return;
        target.textContent = `Revisit this advisory whenever the workforce, locations, funding stage or operating model materially changes. Current workforce: ${this.model.employeeLabel}.`;
    }

    renderCards(containerId, items, meta) {
        const container = this.ids[containerId];
        if (!container) return;
        container.innerHTML = items.map(([title, body]) => this.card(title, body, meta)).join("");
    }

    bindDownload() {
        document.querySelectorAll("[data-action='download-pdf'], #downloadPdf").forEach((button) => {
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

document.addEventListener("DOMContentLoaded", () => new ExecutiveAdvisoryReport(), { once: true });
