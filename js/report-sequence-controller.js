/* GrowWithHR report sequencing and working-model locks */
(() => {
    "use strict";

    const VERSION = "0.22.0-report-sequence";
    const INSTALL_FLAG = "__growwithhrReportSequenceInstalled";
    const WORK_MODEL_LOCK_FLAG = "__growwithhrWorkModelLockInstalled";

    const REPORT_ORDER = Object.freeze([
        "snapshot",
        "summary",
        "understanding",
        "evidence",
        "positive",
        "compliance",
        "strategic",
        "priority",
        "upcoming",
        "roadmap",
        "looking",
        "law",
        "index",
        "important",
        "end"
    ]);

    const SECTION_ANCHORS = Object.freeze({
        snapshot: ["EXECUTIVE SNAPSHOT"],
        summary: ["EXECUTIVE SUMMARY"],
        understanding: ["UNDERSTANDING INTELLIGENCE ENGINE", "M4 EXPLAINABLE INTELLIGENCE"],
        evidence: ["EVIDENCE AND MISSING INFORMATION"],
        positive: ["POSITIVE FOUNDATIONS"],
        compliance: ["COMPLIANCE REVIEW"],
        strategic: ["STRATEGIC RECOMMENDATIONS", "RECOMMENDED ACTIONS"],
        priority: ["PRIORITY COMPLIANCE ACTIONS", "PRIORITY ACTIONS"],
        upcoming: ["UPCOMING COMPLIANCE TRIGGERS"],
        roadmap: ["ROADMAP - 0 TO 90 DAYS", "0–90 DAYS ROADMAP", "0-90 DAYS ROADMAP"],
        looking: ["LOOKING AHEAD"],
        law: ["LAW-BY-LAW UNDERSTANDING", "LAWS APPLICABLE"],
        index: ["GOVERNED LAW INDEX", "APPENDIX"],
        important: ["IMPORTANT INFORMATION"],
        end: ["END OF REPORT"]
    });

    const TOC_ITEMS = Object.freeze([
        ["Executive Snapshot", "snapshot"],
        ["Executive Summary", "summary"],
        ["Understanding Intelligence Engine", "understanding"],
        ["Evidence and Missing Information", "evidence"],
        ["Positive Foundations", "positive"],
        ["Compliance Review", "compliance"],
        ["Strategic Recommendations", "strategic"],
        ["Priority Compliance Actions", "priority"],
        ["Upcoming Compliance Triggers", "upcoming"],
        ["Roadmap - 0 to 90 days", "roadmap"],
        ["Looking Ahead", "looking"],
        ["ANNEXURE", "group"],
        ["Law-by-Law Understanding", "law"],
        ["Governed Law Index", "index"],
        ["Important Information", "important"]
    ]);

    const clean = (value, fallback = "") => String(value ?? "").replace(/\s+/g, " ").trim() || fallback;
    const unique = (values) => [...new Set(values.map((value) => clean(value)).filter(Boolean))];

    function palette(name) {
        return /dark/i.test(clean(name))
            ? {
                page: [0, 0, 0],
                panel: [10, 10, 10],
                alt: [21, 21, 21],
                text: [238, 238, 238],
                muted: [184, 184, 184],
                head: [255, 255, 255],
                line: [68, 68, 68],
                accent: [245, 158, 11],
                green: [91, 214, 148],
                amber: [255, 190, 75],
                red: [255, 120, 110]
            }
            : {
                page: [255, 255, 255],
                panel: [244, 247, 251],
                alt: [232, 239, 248],
                text: [10, 24, 48],
                muted: [53, 72, 99],
                head: [4, 28, 67],
                line: [166, 181, 202],
                accent: [245, 158, 11],
                green: [23, 128, 73],
                amber: [184, 102, 0],
                red: [180, 35, 24]
            };
    }

    const colour = (doc, method, value) => doc[method](...value);

    function paintPage(doc, colours) {
        colour(doc, "setFillColor", colours.page);
        doc.rect(0, 0, 210, 297, "F");
        colour(doc, "setDrawColor", colours.line);
        doc.setLineWidth(0.35);
        doc.rect(5.5, 5.5, 199, 286, "S");
    }

    function createWriter(doc, colours) {
        let y = 24;
        let sectionTitle = "";
        const lineHeight = (size, factor = 1.32) => size * 0.3528 * factor;
        const split = (value, width = 178) => doc.splitTextToSize(clean(value), width);

        function addPage(continuation = false) {
            doc.addPage();
            paintPage(doc, colours);
            y = 24;
            if (continuation && sectionTitle) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(7.5);
                colour(doc, "setTextColor", colours.accent);
                doc.text(`${sectionTitle.toUpperCase()} · CONTINUED`, 16, y);
                y += 9;
            }
        }

        function ensure(height) {
            if (y + height > 270) addPage(true);
        }

        function text(value, options = {}) {
            const size = Number(options.size || 8.5);
            const width = Number(options.width || 178);
            const factor = Number(options.factor || 1.32);
            const lines = split(value, width);
            const height = lines.length * lineHeight(size, factor);
            ensure(height + Number(options.after ?? 3));
            doc.setFont("helvetica", options.style || "normal");
            doc.setFontSize(size);
            colour(doc, "setTextColor", options.colour || colours.text);
            doc.text(lines, Number(options.x || 16), y, { lineHeightFactor: factor, maxWidth: width });
            y += height + Number(options.after ?? 3);
        }

        function heading(eyebrow, title, intro = "") {
            sectionTitle = title;
            addPage(false);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            colour(doc, "setTextColor", colours.accent);
            doc.text(clean(eyebrow).toUpperCase(), 16, y);
            y += 8;
            text(title, { size: 19, style: "bold", colour: colours.head, factor: 1.15, after: 6 });
            if (intro) text(intro, { colour: colours.muted, after: 7 });
        }

        function subheading(value) {
            text(value, { size: 11, style: "bold", colour: colours.head, after: 4 });
        }

        function bullet(value, bulletColour = colours.accent) {
            const lines = split(value, 166);
            const height = lines.length * lineHeight(8.3) + 3;
            ensure(height);
            colour(doc, "setFillColor", bulletColour);
            doc.circle(19, y - 1, 0.8, "F");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.3);
            colour(doc, "setTextColor", colours.text);
            doc.text(lines, 25, y, { lineHeightFactor: 1.32, maxWidth: 166 });
            y += height;
        }

        function lawCard(row) {
            const missing = row.missingInputs.map((field) => fieldLabel(field));
            const paragraphs = [
                `Your organisation: ${clean(row.thresholdResult?.count, "Not confirmed")} ${row.id === "contract-labour" ? "contract workers" : row.id === "factories" || row.id === "standing-orders" ? "factory or blue-collar workers" : "employees"}`,
                `Threshold status: ${clean(row.thresholdResult?.label, "Needs information")}`,
                `Required inputs confirmed: ${row.inputCoverage?.confirmed ?? 0} of ${row.inputCoverage?.required ?? 0}. This is input coverage, not legal certainty.`,
                `Threshold: ${clean(row.threshold, "Confirm the current statutory trigger.")}`,
                `Why this law is included: ${clean(row.whyIncluded)}`,
                `Required action: ${clean(row.requiredAction)}`,
                `Missing information: ${missing.length ? missing.join(", ") : "none for the governed inputs"}.`
            ];
            ensure(52);
            const top = y - 4;
            colour(doc, "setFillColor", colours.panel);
            colour(doc, "setDrawColor", colours.line);
            doc.roundedRect(16, top, 178, 11, 2, 2, "FD");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.4);
            colour(doc, "setTextColor", colours.head);
            doc.text(clean(row.shortTitle), 20, y + 2, { maxWidth: 120 });
            doc.setFontSize(7.2);
            colour(doc, "setTextColor", statusColour(row.status, colours));
            doc.text(`${clean(row.status).toUpperCase()} · ${clean(row.priority)}`, 190, y + 2, { align: "right" });
            y += 13;
            paragraphs.forEach((paragraph, index) => text(paragraph, {
                size: index === 2 ? 7.6 : 8.05,
                style: index === 2 ? "bold" : "normal",
                colour: index === 2 ? colours.accent : colours.text,
                after: 2
            }));
            if (row.officialUrl) {
                ensure(8);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(8.2);
                colour(doc, "setTextColor", colours.accent);
                doc.textWithLink(`Open official ${clean(row.shortTitle)}`, 16, y, { url: row.officialUrl });
                y += 8;
            } else {
                text("Exact state legislation link requires the confirmed operating state and enactment.", { size: 8, colour: colours.muted, after: 6 });
            }
        }

        return {
            heading,
            subheading,
            text,
            bullet,
            lawCard,
            getY: () => y,
            setY: (value) => { y = Number(value); }
        };
    }

    function fieldLabel(field) {
        const labels = {
            employees: "employee strength",
            workers: "factory or blue-collar worker strength",
            contractors: "contractor workforce",
            indiaOperations: "India operations",
            establishmentType: "legal establishment type",
            primaryState: "primary operating state",
            operatingStates: "operating states",
            womenEmployees: "women employees",
            wageBand: "wage eligibility information",
            industry: "industry",
            workerCategories: "worker categories",
            usesPower: "manufacturing power usage",
            manufacturingOperations: "manufacturing activities"
        };
        return labels[field] || clean(field);
    }

    function statusColour(status, colours) {
        if (status === "Applicable") return colours.green;
        if (status === "Review required") return colours.amber;
        if (status === "Needs information") return colours.red;
        return colours.muted;
    }

    function pageText(doc, page) {
        try {
            return (doc.internal.pages?.[page] || []).join(" ").toUpperCase();
        } catch (_error) {
            return "";
        }
    }

    function findSectionPage(doc, key) {
        const anchors = SECTION_ANCHORS[key] || [];
        for (let page = 3; page <= doc.getNumberOfPages(); page += 1) {
            const content = pageText(doc, page);
            if (anchors.some((anchor) => content.includes(anchor.toUpperCase()))) return page;
        }
        return 0;
    }

    function locateSectionBlocks(doc) {
        const starts = Object.keys(SECTION_ANCHORS)
            .map((key) => ({ key, start: findSectionPage(doc, key) }))
            .filter((entry) => entry.start)
            .sort((left, right) => left.start - right.start);
        return starts.map((entry, index) => ({
            key: entry.key,
            start: entry.start,
            end: index + 1 < starts.length ? starts[index + 1].start - 1 : doc.getNumberOfPages()
        }));
    }

    function deleteSectionBlocks(doc, keys) {
        const targets = locateSectionBlocks(doc)
            .filter((block) => keys.includes(block.key))
            .flatMap((block) => Array.from({ length: block.end - block.start + 1 }, (_value, index) => block.start + index))
            .sort((left, right) => right - left);
        [...new Set(targets)].forEach((page) => {
            if (page >= 1 && page <= doc.getNumberOfPages()) doc.deletePage(page);
        });
    }

    function source(payload = {}, model = {}) {
        return Object.assign({}, payload, payload.lead || {}, payload.answers || {}, payload.report || {}, model || {});
    }

    function renderUnderstanding(doc, colours, rows) {
        const writer = createWriter(doc, colours);
        const counts = Object.fromEntries(["Applicable", "Review required", "Needs information", "Not currently triggered"]
            .map((status) => [status, rows.filter((row) => row.status === status).length]));
        const next = rows.find((row) => row.status === "Applicable" && row.priority === "HIGH") ||
            rows.find((row) => row.status === "Applicable") ||
            rows.find((row) => row.status === "Review required") ||
            rows.find((row) => row.status === "Needs information");

        writer.heading("Executive insight", "Understanding Intelligence Engine", "A transparent view of statutory triggers, organisation position, evidence coverage and missing information. This is general guidance, not legal certification.");
        writer.subheading("Current statutory position");
        writer.bullet(`${counts.Applicable || 0} laws assessed as applicable`, colours.green);
        writer.bullet(`${counts["Review required"] || 0} laws require review`, colours.amber);
        writer.bullet(`${counts["Needs information"] || 0} laws need more information`, colours.red);
        writer.bullet(`${counts["Not currently triggered"] || 0} laws are not currently triggered`, colours.muted);
        writer.subheading("Next recommended action");
        writer.text(next?.requiredAction || "Complete the missing organisation information before relying on statutory recommendations.", { style: "bold" });
        writer.subheading("How to read this section");
        writer.bullet("Threshold conclusions use the organisation information supplied in the assessment.");
        writer.bullet("Evidence coverage shows which governed inputs were confirmed.");
        writer.bullet("Evidence coverage is not a compliance score or legal-certainty percentage.");
    }

    function renderEvidence(doc, colours, rows, payload, model) {
        const writer = createWriter(doc, colours);
        const data = source(payload, model);
        const missing = unique(rows.flatMap((row) => row.missingInputs || []).map(fieldLabel));
        const evidence = [
            ["Assessment responses", true],
            ["Organisation profile", true],
            ["Uploaded documents", Boolean(data.uploadedDocuments || data.evidenceDocuments)],
            ["Government registrations", Boolean(data.governmentRegistrations)],
            ["Previous assessments", Boolean(data.previousAssessments || data.generatedAt)]
        ];

        writer.heading("Evidence basis", "Evidence and Missing Information", "This page shows what the assessment used and what still needs confirmation before leadership relies on the statutory interpretation.");
        writer.subheading("Missing information");
        (missing.length ? missing : ["No governed assessment inputs are missing."]).forEach((item) => writer.bullet(item, missing.length ? colours.amber : colours.green));
        writer.subheading("Evidence used");
        evidence.forEach(([label, used]) => writer.bullet(`${label}: ${used ? "Used" : "Not connected"}`, used ? colours.green : colours.muted));
        writer.text("Evidence completeness reflects information available to this assessment. It is not proof of statutory compliance.", { style: "italic", colour: colours.muted, after: 6 });
    }

    function renderPriority(doc, colours, rows) {
        const writer = createWriter(doc, colours);
        const actionable = rows.filter((row) => row.status === "Applicable" || row.status === "Review required" || row.status === "Needs information");
        writer.heading("Leadership action", "Priority Compliance Actions", "Actions are ordered by statutory position and evidence completeness. Confirm current legal interpretation before implementation.");
        (actionable.length ? actionable.slice(0, 10) : rows.slice(0, 5)).forEach((row) => {
            writer.subheading(`${clean(row.priority)} · ${clean(row.shortTitle)}`);
            writer.text(clean(row.requiredAction));
            writer.text(`Reason: ${clean(row.thresholdResult?.explanation, row.thresholdResult?.label)}`, { colour: colours.muted });
        });
    }

    function renderUpcoming(doc, colours, rows) {
        const writer = createWriter(doc, colours);
        const upcoming = rows.filter((row) => ["near", "below"].includes(row.thresholdResult?.state));
        writer.heading("Forward view", "Upcoming Compliance Triggers", "These triggers use reported workforce information and general statutory thresholds. State amendments and notifications may change the result.");
        if (!upcoming.length) writer.bullet("No governed headcount trigger is currently shown as approaching or below the displayed threshold.", colours.green);
        upcoming.forEach((row) => writer.bullet(`${clean(row.shortTitle)}: ${clean(row.thresholdResult?.explanation)}`, colours.amber));
    }

    function renderLawUnderstanding(doc, colours, rows) {
        const writer = createWriter(doc, colours);
        writer.heading("Annexure", "Law-by-Law Understanding", "Every card shows the statutory trigger, reported organisation position, resulting status, reasoning, required action, evidence coverage, missing inputs and official source.");
        rows.forEach((row) => writer.lawCard(row));
    }

    function renderLawIndex(doc, colours, rows) {
        const writer = createWriter(doc, colours);
        writer.heading("Annexure", "Governed Law Index", "Laws are listed alphabetically. Open Act links point to the official legislation identified for that law.");
        [...rows].sort((left, right) => clean(left.shortTitle).localeCompare(clean(right.shortTitle))).forEach((row) => {
            writer.text(`${clean(row.shortTitle)} · ${clean(row.status)} · ${clean(row.thresholdResult?.label)}`, { style: "bold", after: 1 });
            if (row.officialUrl) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(8);
                colour(doc, "setTextColor", colours.accent);
                doc.textWithLink("Open Act", 16, writer.getY(), { url: row.officialUrl });
                writer.setY(writer.getY() + 6);
            }
        });
    }

    function drawClosingPage(doc, colours) {
        doc.addPage();
        paintPage(doc, colours);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        colour(doc, "setTextColor", colours.head);
        doc.text("End of Report", 105, 166, { align: "center" });
        colour(doc, "setDrawColor", colours.accent);
        doc.line(67, 153, 90, 153);
        doc.line(120, 153, 143, 153);
    }

    function appendRequestedSections(doc, colours, rows, payload, model) {
        renderUnderstanding(doc, colours, rows);
        renderEvidence(doc, colours, rows, payload, model);
        renderPriority(doc, colours, rows);
        renderUpcoming(doc, colours, rows);
        renderLawUnderstanding(doc, colours, rows);
        renderLawIndex(doc, colours, rows);
        drawClosingPage(doc, colours);
    }

    function reorderPageReferences(doc, desiredPages) {
        if (typeof doc.movePage !== "function") return false;
        for (let target = 1; target < desiredPages.length; target += 1) {
            const reference = desiredPages[target];
            const current = doc.internal.pages.findIndex((page, index) => index > 0 && page === reference);
            if (current > 0 && current !== target) doc.movePage(current, target);
        }
        return true;
    }

    function reorderSections(doc) {
        const blocks = locateSectionBlocks(doc);
        const firstSection = Math.min(...blocks.map((block) => block.start));
        if (!Number.isFinite(firstSection)) return false;

        const pageRefs = doc.internal.pages;
        const prefix = [];
        for (let page = 1; page < firstSection; page += 1) prefix.push(pageRefs[page]);

        const blockRefs = new Map(blocks.map((block) => [
            block.key,
            Array.from({ length: block.end - block.start + 1 }, (_value, index) => pageRefs[block.start + index])
        ]));
        const claimed = new Set(prefix);
        blockRefs.forEach((refs) => refs.forEach((ref) => claimed.add(ref)));
        const unknown = [];
        for (let page = firstSection; page <= doc.getNumberOfPages(); page += 1) {
            if (!claimed.has(pageRefs[page])) unknown.push(pageRefs[page]);
        }

        const desired = [null, ...prefix];
        REPORT_ORDER.forEach((key) => {
            if (key === "important" && unknown.length) desired.push(...unknown);
            desired.push(...(blockRefs.get(key) || []));
        });
        return reorderPageReferences(doc, desired);
    }

    function redrawContents(doc, colours) {
        if (doc.getNumberOfPages() < 2) return;
        doc.setPage(2);
        paintPage(doc, colours);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        colour(doc, "setTextColor", colours.accent);
        doc.text("REPORT GUIDE", 16, 24);
        doc.setFontSize(22);
        colour(doc, "setTextColor", colours.head);
        doc.text("Table of Contents", 16, 39);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.2);
        colour(doc, "setTextColor", colours.muted);
        doc.text("Light and dark reports use the same section order and one continuous page sequence.", 16, 49, { maxWidth: 178 });

        let y = 61;
        TOC_ITEMS.forEach(([label, key], index) => {
            if (key === "group") {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(7.5);
                colour(doc, "setTextColor", colours.accent);
                doc.text(label, 20, y + 1);
                y += 10;
                return;
            }
            const page = findSectionPage(doc, key);
            if (!page) return;
            colour(doc, "setFillColor", index % 2 ? colours.panel : colours.alt);
            doc.roundedRect(16, y - 6, 178, 10.5, 1.5, 1.5, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.8);
            colour(doc, "setTextColor", colours.text);
            doc.text(label, key === "law" || key === "index" || key === "important" ? 27 : 21, y + 0.5);
            colour(doc, "setTextColor", colours.accent);
            doc.text(String(Math.max(1, page - 2)), 188, y + 0.5, { align: "right" });
            y += 12;
        });
    }

    function redrawPageNumbers(doc, colours) {
        const total = Math.max(0, doc.getNumberOfPages() - 3);
        for (let page = 3; page < doc.getNumberOfPages(); page += 1) {
            doc.setPage(page);
            colour(doc, "setFillColor", colours.page);
            doc.rect(162, 278, 34, 10, "F");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            colour(doc, "setTextColor", colours.muted);
            doc.text(`Page ${page - 2} of ${total}`, 190, 284, { align: "right" });
        }
    }

    function rebuildVariant(doc, themeName, rows, payload, model) {
        if (!doc || !Array.isArray(rows)) return;
        const colours = palette(themeName);
        deleteSectionBlocks(doc, ["understanding", "evidence", "priority", "upcoming", "law", "index", "end"]);
        appendRequestedSections(doc, colours, rows, payload, model);
        reorderSections(doc);
        redrawContents(doc, colours);
        redrawPageNumbers(doc, colours);
    }

    function serialiseVariant(variant) {
        if (!variant?.document?.output) return variant;
        const dataUri = variant.document.output("datauristring");
        const buffer = variant.document.output("arraybuffer");
        Object.assign(variant, {
            dataUri,
            base64: dataUri.includes(",") ? dataUri.split(",")[1] : dataUri,
            sizeBytes: buffer.byteLength,
            pageCount: variant.document.getNumberOfPages(),
            reportSequenceVersion: VERSION
        });
        return variant;
    }

    function installReportSequence() {
        const service = window.GrowWithHRPDF;
        if (!service || typeof service.buildAdvisoryPdf !== "function" || service[INSTALL_FLAG]) return false;
        const originalBuild = service.buildAdvisoryPdf.bind(service);
        const originalModel = typeof service.buildAdvisoryModel === "function" ? service.buildAdvisoryModel.bind(service) : null;

        async function buildAdvisoryPdf(payload = {}) {
            const result = await originalBuild(payload);
            const model = originalModel ? originalModel(payload) : (payload.model || result?.model || {});
            const rows = typeof service.buildReportLawTransparency === "function"
                ? service.buildReportLawTransparency(payload, model)
                : [];
            const variants = Array.isArray(result?.pdfs) ? result.pdfs : [result];
            variants.forEach((variant) => {
                if (!variant?.document) return;
                rebuildVariant(variant.document, variant.theme || payload.theme || result.theme, rows, payload, model);
                serialiseVariant(variant);
            });
            if (Array.isArray(result?.pdfs)) {
                result.sizeBytes = result.pdfs.reduce((sum, variant) => sum + Number(variant.sizeBytes || 0), 0);
                result.pageCounts = Object.fromEntries(result.pdfs.map((variant) => [variant.theme, variant.pageCount]));
                const first = result.pdfs[0];
                if (first) Object.assign(result, { dataUri: first.dataUri, base64: first.base64, pageCount: first.pageCount });
            }
            return Object.assign(result, { reportSequenceVersion: VERSION });
        }

        const enhanced = Object.freeze({ ...service, [INSTALL_FLAG]: true, reportSequenceVersion: VERSION, buildAdvisoryPdf });
        window.GrowWithHRPDF = enhanced;
        window.GrowWithHRPDFPolishReady = Promise.resolve(enhanced);
        return true;
    }

    function applicationAnswers(application) {
        return application?.answers || application?.stateModel?.answers || application?.state?.answers || {};
    }

    function setAnswer(application, name, value) {
        if (typeof application?.stateModel?.setAnswer === "function") {
            application.stateModel.setAnswer(name, value);
            return;
        }
        applicationAnswers(application)[name] = value;
    }

    function findApplication() {
        return window.executiveAssessment || window.GrowWithHRExecutiveAssessment || window.assessmentApp || null;
    }

    function resolveRemoteBand(workModel) {
        const value = clean(workModel).toLowerCase().replace(/[_-]+/g, " ");
        if (["office based", "full onsite", "fully onsite", "full on site", "fully on site"].includes(value)) return "0";
        if (["remote", "full remote", "fully remote"].includes(value)) return "100";
        return "";
    }

    function syncWorkingModel(application) {
        if (!document?.querySelectorAll) return;
        const answers = applicationAnswers(application);
        const selectedWorkModel = document.querySelector('input[name="workModel"]:checked')?.value || answers.workModel;
        const target = resolveRemoteBand(selectedWorkModel);
        const controls = Array.from(document.querySelectorAll('input[name="remoteBand"]'));
        if (!controls.length) return;

        controls.forEach((input) => {
            const locked = Boolean(target) && input.value !== target;
            input.disabled = locked;
            input.setAttribute("aria-disabled", locked ? "true" : "false");
            input.closest("label")?.classList.toggle("is-work-model-locked", locked);
            if (locked) input.checked = false;
        });

        if (target) {
            const selected = controls.find((input) => input.value === target);
            if (selected) {
                selected.disabled = false;
                selected.checked = true;
                selected.removeAttribute("aria-disabled");
                selected.closest("label")?.classList.remove("is-work-model-locked");
            }
            setAnswer(application, "remoteBand", target);
            setAnswer(application, "remoteWorkforce", target === "100" ? "Fully remote" : "None");
            setAnswer(application, "remoteExact", "");
            const exactField = document.getElementById("remoteExactField");
            if (exactField) exactField.hidden = true;
            application?.persist?.();
            application?.saveProgress?.();
            application?.saveNow?.();
        }
    }

    function installWorkModelLock(application) {
        if (!application || application[WORK_MODEL_LOCK_FLAG]) return false;
        Object.defineProperty(application, WORK_MODEL_LOCK_FLAG, { value: true });
        document.addEventListener("change", (event) => {
            if (event.target?.name === "workModel") queueMicrotask(() => syncWorkingModel(application));
        }, true);
        const story = document.getElementById("storyContainer");
        if (story && typeof MutationObserver === "function") {
            new MutationObserver(() => queueMicrotask(() => syncWorkingModel(application)))
                .observe(story, { childList: true, subtree: true });
        }
        queueMicrotask(() => syncWorkingModel(application));
        return true;
    }

    function installAll(application = findApplication()) {
        installReportSequence();
        installWorkModelLock(application);
    }

    window.addEventListener?.("growwithhr:assessment-modules-ready", (event) => installAll(event.detail?.application));
    installAll();

    let attempts = 0;
    const timer = window.setInterval?.(() => {
        attempts += 1;
        installAll();
        if ((window.GrowWithHRPDF?.[INSTALL_FLAG] && findApplication()?.[WORK_MODEL_LOCK_FLAG]) || attempts >= 100) {
            window.clearInterval?.(timer);
        }
    }, 100);

    window.GrowWithHRReportSequenceController = Object.freeze({
        version: VERSION,
        reportOrder: REPORT_ORDER,
        tocItems: TOC_ITEMS,
        resolveRemoteBand,
        reorderPageReferences,
        installReportSequence,
        syncWorkingModel
    });
})();
