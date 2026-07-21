/**
 * GrowWithHR Compliance DNA — M3 Private-Beta Presentation
 *
 * Consumes the in-memory M2 diagnostics result only. It does not access
 * browser storage, evaluate rules or modify report, PDF, email or delivery.
 */

import {
    COMPLIANCE_STORY_MODEL_VERSION,
    buildComplianceStory
} from "./compliance-story-model.js";

export const COMPLIANCE_STORY_PRESENTATION_VERSION = "1.0.0";

const PHASE = Object.freeze({
    LOADING: "loading",
    READY: "ready",
    EMPTY: "empty",
    ERROR: "error",
    DESTROYED: "destroyed"
});

const IDS = Object.freeze([
    "dnaComplianceStory",
    "dnaComplianceStoryStatus",
    "dnaComplianceStoryHeadline",
    "dnaComplianceStoryApplicableCount",
    "dnaComplianceStoryLikelyCount",
    "dnaComplianceStoryMoreInfoCount",
    "dnaComplianceStorySpecialistCount",
    "dnaComplianceStoryEvidenceCount",
    "dnaComplianceStorySnapshotList",
    "dnaComplianceStoryPriorityList",
    "dnaComplianceStoryGroupList",
    "dnaComplianceStoryAssumptionList",
    "dnaComplianceStoryContent",
    "dnaComplianceStoryEmpty",
    "dnaComplianceStoryError",
    "dnaComplianceStoryErrorMessage"
]);

const MARKUP = `
<header class="dna-compliance-story__header"><div>
<p class="dna-compliance-story__eyebrow">M3 private-beta advisory</p>
<h2 id="dnaComplianceStoryTitle" class="dna-compliance-story__title">Your Compliance Story</h2>
<p class="dna-compliance-story__description">A safe executive view of the confirmed facts, deterministic findings, actions, implications and sources produced by M2.</p>
</div><span class="dna-compliance-story__model-badge">Model v1</span></header>
<p class="dna-private-note"><span class="dna-private-note__icon" aria-hidden="true">●</span><span>This story consumes the in-memory M2 result. It does not change the stable report, PDF, email or delivery contracts, and it does not certify compliance or evidence.</span></p>
<p id="dnaComplianceStoryStatus" class="dna-compliance-story__status" role="status" aria-live="polite" aria-atomic="true">Waiting for the governed M2 traceability result…</p>
<div id="dnaComplianceStoryContent" class="dna-compliance-story__content" hidden>
<section class="dna-compliance-story__hero"><div><p class="dna-compliance-story__section-eyebrow">Executive summary</p><h3 id="dnaComplianceStoryHeadline">Preparing your compliance story…</h3></div><p class="dna-compliance-story__assurance">Applicability and evidence remain separate. Missing information is shown rather than guessed.</p></section>
<dl class="dna-compliance-story__metrics" aria-label="Compliance Story status counts">
<div class="dna-compliance-story__metric"><dt>Applicable</dt><dd id="dnaComplianceStoryApplicableCount">0</dd></div>
<div class="dna-compliance-story__metric"><dt>Likely applicable</dt><dd id="dnaComplianceStoryLikelyCount">0</dd></div>
<div class="dna-compliance-story__metric"><dt>More information</dt><dd id="dnaComplianceStoryMoreInfoCount">0</dd></div>
<div class="dna-compliance-story__metric"><dt>Specialist review</dt><dd id="dnaComplianceStorySpecialistCount">0</dd></div>
<div class="dna-compliance-story__metric"><dt>Evidence not verified</dt><dd id="dnaComplianceStoryEvidenceCount">0</dd></div>
</dl>
<section class="dna-compliance-story__section" aria-labelledby="dnaComplianceStorySnapshotTitle"><header class="dna-compliance-story__section-header"><div><p class="dna-compliance-story__section-eyebrow">Company snapshot</p><h3 id="dnaComplianceStorySnapshotTitle">The organisation behind the findings</h3></div></header><dl id="dnaComplianceStorySnapshotList" class="dna-compliance-story__snapshot-list"></dl></section>
<section class="dna-compliance-story__section" aria-labelledby="dnaComplianceStoryPriorityTitle"><header class="dna-compliance-story__section-header"><div><p class="dna-compliance-story__section-eyebrow">Top three priorities</p><h3 id="dnaComplianceStoryPriorityTitle">What to address first</h3></div><p>Ranked deterministically from safe status and suggested timeline.</p></header><div id="dnaComplianceStoryPriorityList" class="dna-compliance-story__priority-list"></div></section>
<section class="dna-compliance-story__section" aria-labelledby="dnaComplianceStoryGroupTitle"><header class="dna-compliance-story__section-header"><div><p class="dna-compliance-story__section-eyebrow">Grouped obligations</p><h3 id="dnaComplianceStoryGroupTitle">The full advisory health model</h3></div><p>Every governed rule remains visible, including missing-information and non-current outcomes.</p></header><div id="dnaComplianceStoryGroupList" class="dna-compliance-story__group-list"></div></section>
<section class="dna-compliance-story__section" aria-labelledby="dnaComplianceStoryAssumptionsTitle"><header class="dna-compliance-story__section-header"><div><p class="dna-compliance-story__section-eyebrow">Assumptions and gaps</p><h3 id="dnaComplianceStoryAssumptionsTitle">What still needs confirmation</h3></div></header><ul id="dnaComplianceStoryAssumptionList" class="dna-compliance-story__assumption-list"></ul></section>
</div>
<section id="dnaComplianceStoryEmpty" class="dna-compliance-story__notice" hidden><h3>No saved assessment answers found</h3><p>Complete or save progress in the stable assessment before preparing this story.</p><a class="dna-primary-button" href="analyze-company.html">Open the stable assessment</a></section>
<section id="dnaComplianceStoryError" class="dna-compliance-story__notice dna-compliance-story__notice--error" role="alert" hidden><h3>Compliance Story could not be prepared</h3><p id="dnaComplianceStoryErrorMessage">The private-beta story could not load.</p><p>The stable assessment and its existing report, PDF and delivery paths remain available.</p><a class="dna-secondary-button" href="analyze-company.html">Use the stable assessment</a></section>`;

const asObject = (value) =>
    value && typeof value === "object" && !Array.isArray(value)
        ? value
        : {};
const asArray = (value) => Array.isArray(value) ? value : [];

function element(doc, tag, className = "", text = "") {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== "") node.textContent = String(text);
    return node;
}

function ensureAssets(doc) {
    if (!doc.querySelector('link[data-compliance-story-styles="true"]')) {
        const link = doc.createElement("link");
        link.rel = "stylesheet";
        link.href = "css/20-compliance-story.css";
        link.dataset.complianceStoryStyles = "true";
        doc.head?.append(link);
    }

    let root = doc.getElementById("dnaComplianceStory");
    if (root) return root;

    const traceability = doc.getElementById("dnaTraceability");
    if (!traceability) return null;

    root = doc.createElement("section");
    root.id = "dnaComplianceStory";
    root.className = "dna-compliance-story";
    root.dataset.storyState = PHASE.LOADING;
    root.setAttribute("aria-labelledby", "dnaComplianceStoryTitle");
    root.innerHTML = MARKUP;
    traceability.parentNode?.insertBefore(root, traceability);
    return root;
}

function collect(doc) {
    const result = {};
    IDS.forEach((id) => {
        const node = doc.getElementById(id);
        if (!node) throw new Error(`GrowWithHR M3 requires #${id}.`);
        result[id] = node;
    });
    return result;
}

function formatValue(value) {
    if (value === null || value === undefined || value === "") return "Not supplied";
    if (Array.isArray(value)) return value.length ? value.join(", ") : "None supplied";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

function badge(doc, label, name, value, className) {
    const node = element(doc, "span", className, label);
    node.setAttribute(name, value);
    return node;
}

function factList(doc, facts, emptyText) {
    const list = element(doc, "ul", "dna-compliance-story__fact-list");
    if (!facts.length) {
        list.append(element(doc, "li", "dna-compliance-story__empty-line", emptyText));
        return list;
    }
    facts.forEach((fact) => {
        const item = element(doc, "li");
        item.append(
            element(doc, "strong", "", fact.label),
            element(doc, "span", "", formatValue(fact.value)),
            element(doc, "code", "", fact.id)
        );
        list.append(item);
    });
    return list;
}

function sourceList(doc, sources) {
    const list = element(doc, "ul", "dna-compliance-story__source-list");
    sources.forEach((source) => {
        const item = element(doc, "li");
        const link = element(doc, "a", "dna-compliance-story__source-link", source.title);
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        item.append(
            link,
            element(doc, "span", "", `${source.publisher} · ${source.jurisdiction}`),
            element(doc, "small", "", source.notes || "Source supplied for further review.")
        );
        list.append(item);
    });
    return list;
}

function detail(doc, label, value, wide = false) {
    const block = element(
        doc,
        "div",
        `dna-compliance-story__detail${wide ? " dna-compliance-story__detail--wide" : ""}`
    );
    block.append(
        element(doc, "span", "", label),
        element(doc, "strong", "", value)
    );
    return block;
}

function obligationCard(doc, item, priority = 0) {
    const card = element(doc, "article", "dna-compliance-story__obligation-card");
    card.dataset.obligationId = item.id;
    card.dataset.applicabilityStatus = item.status;
    card.dataset.evidenceStatus = item.evidenceStatus;

    const header = element(doc, "header", "dna-compliance-story__obligation-header");
    const heading = element(doc, "div");
    if (priority) heading.append(element(doc, "span", "dna-compliance-story__priority-number", `Priority ${priority}`));
    heading.append(
        element(doc, "h4", "", item.title),
        element(doc, "code", "", item.ruleId)
    );
    const badges = element(doc, "div", "dna-compliance-story__badges");
    badges.append(
        badge(doc, item.statusLabel, "data-applicability-status", item.status, "dna-compliance-story__status-badge"),
        badge(doc, `Evidence: ${item.evidenceStatusLabel}`, "data-evidence-status", item.evidenceStatus, "dna-compliance-story__evidence-badge")
    );
    header.append(heading, badges);

    const grid = element(doc, "div", "dna-compliance-story__detail-grid");
    grid.append(
        detail(doc, "Next action", item.nextAction, true),
        detail(doc, "Suggested timeline", item.timeline),
        detail(doc, "Implications", item.implications, true)
    );

    const explanations = element(doc, "div", "dna-compliance-story__explanation-grid");
    const why = element(doc, "section");
    why.append(
        element(doc, "h5", "", "Why this appears"),
        element(doc, "p", "", item.rationale),
        factList(doc, item.triggerFacts, "No triggering facts were recorded.")
    );
    const missing = element(doc, "section");
    missing.append(
        element(doc, "h5", "", "Information still needed"),
        factList(doc, item.missingInformation, "No required information is currently missing.")
    );
    explanations.append(why, missing);

    const details = element(doc, "details", "dna-compliance-story__review-details");
    details.append(element(doc, "summary", "", "Sources, limitations and review notices"));
    if (item.sources.length) details.append(sourceList(doc, item.sources));
    const limits = element(doc, "ul", "dna-compliance-story__limitation-list");
    item.limitations.forEach((value) => limits.append(element(doc, "li", "", value)));
    if (item.limitations.length) details.append(limits);

    card.append(header, grid, explanations, details);
    return card;
}

function reset(elements) {
    [
        "dnaComplianceStorySnapshotList",
        "dnaComplianceStoryPriorityList",
        "dnaComplianceStoryGroupList",
        "dnaComplianceStoryAssumptionList"
    ].forEach((id) => elements[id].replaceChildren());
    [
        "dnaComplianceStoryApplicableCount",
        "dnaComplianceStoryLikelyCount",
        "dnaComplianceStoryMoreInfoCount",
        "dnaComplianceStorySpecialistCount",
        "dnaComplianceStoryEvidenceCount"
    ].forEach((id) => { elements[id].textContent = "0"; });
    elements.dnaComplianceStoryHeadline.textContent = "Preparing your compliance story…";
    delete elements.dnaComplianceStory.dataset.modelVersion;
    delete elements.dnaComplianceStory.dataset.traceabilityContractVersion;
}

function render(doc, elements, model) {
    const counts = model.complianceDna.counts;
    elements.dnaComplianceStoryHeadline.textContent = model.complianceDna.headline;
    elements.dnaComplianceStoryApplicableCount.textContent = String(counts.applicable);
    elements.dnaComplianceStoryLikelyCount.textContent = String(counts.likelyApplicable);
    elements.dnaComplianceStoryMoreInfoCount.textContent = String(counts.moreInformationNeeded);
    elements.dnaComplianceStorySpecialistCount.textContent = String(counts.specialistReview);
    elements.dnaComplianceStoryEvidenceCount.textContent = String(counts.evidenceNotVerified);

    model.companySnapshot.forEach((fact) => {
        const card = element(doc, "div", "dna-compliance-story__snapshot-card");
        card.append(element(doc, "span", "", fact.label), element(doc, "strong", "", formatValue(fact.value)));
        elements.dnaComplianceStorySnapshotList.append(card);
    });

    const index = new Map(model.obligations.map((item) => [item.id, item]));
    model.topPriorityIds.forEach((id, position) => {
        const item = index.get(id);
        if (item) elements.dnaComplianceStoryPriorityList.append(obligationCard(doc, item, position + 1));
    });

    model.obligationGroups.forEach((group) => {
        const section = element(doc, "section", "dna-compliance-story__group");
        section.dataset.groupId = group.id;
        const header = element(doc, "header", "dna-compliance-story__group-header");
        header.append(
            element(doc, "h4", "", group.title),
            element(doc, "span", "", `${group.obligationIds.length} ${group.obligationIds.length === 1 ? "item" : "items"}`)
        );
        section.append(header);
        group.obligationIds.forEach((id) => {
            const item = index.get(id);
            if (item) section.append(obligationCard(doc, item));
        });
        elements.dnaComplianceStoryGroupList.append(section);
    });

    if (model.assumptions.length) {
        model.assumptions.forEach((assumption) => {
            const item = element(doc, "li");
            item.append(
                element(doc, "strong", "", assumption.label),
                element(doc, "span", "", assumption.message),
                element(doc, "code", "", assumption.factId)
            );
            elements.dnaComplianceStoryAssumptionList.append(item);
        });
    } else {
        elements.dnaComplianceStoryAssumptionList.append(
            element(doc, "li", "dna-compliance-story__empty-line", "No missing-fact assumptions were recorded for the current model.")
        );
    }

    elements.dnaComplianceStory.dataset.modelVersion = model.modelVersion;
    elements.dnaComplianceStory.dataset.traceabilityContractVersion =
        model.sourceTraceabilityContractVersion;
    elements.dnaComplianceStoryStatus.textContent =
        `Compliance story ready. ${model.topPriorityIds.length} top priorities and ${model.obligations.length} governed items are shown.`;
}

export function createComplianceStoryPresentation(options = {}) {
    const runtime = options.runtime || globalThis.window;
    const doc = options.document || runtime?.document || globalThis.document;
    if (!doc || !ensureAssets(doc)) {
        throw new Error("GrowWithHR M3 requires the private-beta traceability route.");
    }

    const elements = collect(doc);
    const buildModel = options.buildModel || buildComplianceStory;
    const state = { phase: PHASE.LOADING, model: null, error: null, destroyed: false };

    const publicState = () => Object.freeze({
        version: COMPLIANCE_STORY_PRESENTATION_VERSION,
        modelVersion: COMPLIANCE_STORY_MODEL_VERSION,
        phase: state.phase,
        hasModel: Boolean(state.model),
        error: state.error ? String(state.error.message || state.error) : null,
        source: "m2-recommendation-traceability",
        protectedStateReadOnly: true,
        stableReportMutation: false
    });

    const publish = () => runtime?.dispatchEvent?.(
        new runtime.CustomEvent("growwithhr:compliance-story", { detail: publicState() })
    );

    function setPhase(phase, message) {
        state.phase = phase;
        elements.dnaComplianceStory.dataset.storyState = phase;
        elements.dnaComplianceStoryStatus.textContent = message;
        elements.dnaComplianceStoryContent.hidden = phase !== PHASE.READY;
        elements.dnaComplianceStoryEmpty.hidden = phase !== PHASE.EMPTY;
        elements.dnaComplianceStoryError.hidden = phase !== PHASE.ERROR;
        publish();
    }

    function loading() {
        state.model = null;
        state.error = null;
        reset(elements);
        setPhase(PHASE.LOADING, "Waiting for the governed M2 traceability result…");
    }

    function empty() {
        state.model = null;
        state.error = null;
        reset(elements);
        setPhase(PHASE.EMPTY, "No saved assessment answers were found for the private-beta compliance story.");
    }

    function error(value) {
        state.model = null;
        state.error = value;
        reset(elements);
        elements.dnaComplianceStoryErrorMessage.textContent =
            value?.message || "The private-beta compliance story could not be prepared.";
        setPhase(PHASE.ERROR, "The private-beta compliance story could not be prepared.");
    }

    function renderFromTraceability(traceability) {
        if (state.destroyed) throw new Error("The M3 controller has been destroyed.");
        try {
            state.model = buildModel(traceability, {
                metadata: {
                    presentation: "private-beta-compliance-story",
                    presentationVersion: COMPLIANCE_STORY_PRESENTATION_VERSION
                }
            });
            state.error = null;
            render(doc, elements, state.model);
            setPhase(PHASE.READY, elements.dnaComplianceStoryStatus.textContent);
            return state.model;
        } catch (caught) {
            error(caught);
            return null;
        }
    }

    function refresh() {
        const diagnostics = runtime?.GrowWithHRTraceabilityDiagnostics;
        const diagnosticsState = diagnostics?.getState?.();
        if (diagnosticsState?.phase === PHASE.EMPTY) return empty();
        if (diagnosticsState?.phase === PHASE.ERROR) {
            return error(new Error(diagnosticsState.error || "The M2 traceability result is unavailable."));
        }
        const result = diagnostics?.getResult?.();
        if (result?.traceability) return renderFromTraceability(result.traceability);
        return loading();
    }

    const onTraceability = (event) => {
        const detail = asObject(event?.detail);
        if (detail.phase === PHASE.READY) refresh();
        else if (detail.phase === PHASE.EMPTY) empty();
        else if (detail.phase === PHASE.ERROR) {
            error(new Error(detail.error || "The M2 traceability result is unavailable."));
        } else loading();
    };

    runtime?.addEventListener("growwithhr:traceability-diagnostics", onTraceability);

    const controller = Object.freeze({
        version: COMPLIANCE_STORY_PRESENTATION_VERSION,
        modelVersion: COMPLIANCE_STORY_MODEL_VERSION,
        refresh,
        renderFromTraceability,
        getModel: () => state.model,
        getState: publicState,
        destroy() {
            if (state.destroyed) return;
            state.destroyed = true;
            state.phase = PHASE.DESTROYED;
            runtime?.removeEventListener("growwithhr:traceability-diagnostics", onTraceability);
            elements.dnaComplianceStory.dataset.storyState = PHASE.DESTROYED;
            publish();
        }
    });

    refresh();
    return controller;
}

function start() {
    const doc = globalThis.document;
    if (!doc?.getElementById("dnaTraceability")) return;
    try {
        ensureAssets(doc);
        globalThis.window.GrowWithHRComplianceStory =
            createComplianceStoryPresentation();
    } catch (error) {
        console.error("GrowWithHR M3 Compliance Story could not start.", error);
        const root = doc.getElementById("dnaComplianceStory");
        if (root) root.dataset.storyState = PHASE.ERROR;
    }
}

if (typeof globalThis.document !== "undefined") {
    if (globalThis.document.readyState === "loading") {
        globalThis.document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
}

export default Object.freeze({
    version: COMPLIANCE_STORY_PRESENTATION_VERSION,
    modelVersion: COMPLIANCE_STORY_MODEL_VERSION,
    createComplianceStoryPresentation
});
