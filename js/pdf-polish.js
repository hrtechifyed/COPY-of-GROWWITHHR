/* ==========================================================
   GrowWithHR PDF presentation polish
   Replaces the legacy writer with a page-safe A4 renderer.
   ========================================================== */
(function installGrowWithHRPdfPolish(window, document) {
    "use strict";

    const previous = window.GrowWithHRPDF;
    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;

    if (!previous || typeof previous.buildAdvisoryModel !== "function" || !JsPDF) {
        console.warn("GrowWithHR PDF polish: the base PDF service is unavailable.");
        return;
    }

    const VERSION = "3.0.0-presentation-polish";
    const DEFAULT_FILENAME = "GrowWithHR-Executive-Advisory.pdf";
    const REPORT_STORAGE_KEY = "growwithhr-report";
    const LAST_DOWNLOAD_KEY = "growwithhrLastReportDownload";

    const BRAND = Object.freeze({
        navy: [8, 22, 45],
        navySoft: [25, 41, 70],
        orange: [245, 158, 11],
        orangeDark: [194, 112, 4],
        orangeSoft: [255, 247, 229],
        text: [31, 41, 55],
        muted: [88, 99, 116],
        line: [218, 223, 230],
        panel: [247, 249, 252],
        white: [255, 255, 255]
    });

    const PAGE = Object.freeze({
        width: 210,
        height: 297,
        left: 18,
        right: 18,
        top: 30,
        bottom: 23,
        headerY: 13,
        footerY: 285
    });

    const usableWidth = PAGE.width - PAGE.left - PAGE.right;
    const contentBottom = PAGE.height - PAGE.bottom;
    let logoPromise = null;

    function cleanText(value, fallback = "") {
        if (value === null || value === undefined) return fallback;
        const normalised = String(value).replace(/\s+/g, " ").trim();
        return normalised || fallback;
    }

    function toArray(value) {
        if (Array.isArray(value)) {
            return value.map((item) => cleanText(item)).filter(Boolean);
        }
        const source = cleanText(value);
        return source
            ? source.split(/[,;|]/).map((item) => item.trim()).filter(Boolean)
            : [];
    }

    function unique(values) {
        return Array.from(new Set(values.filter(Boolean)));
    }

    function sentenceList(value) {
        const items = unique(toArray(value));
        if (!items.length) return "Not specified";
        if (items.length === 1) return items[0];
        if (items.length === 2) return `${items[0]} and ${items[1]}`;
        return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
    }

    function pluralise(value, singular, plural = `${singular}s`) {
        const number = Number(value) || 0;
        return `${number} ${number === 1 ? singular : plural}`;
    }

    function formatDate(value) {
        const date = value ? new Date(value) : new Date();
        const safe = Number.isNaN(date.getTime()) ? new Date() : date;
        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(safe);
    }

    function escapeFilename(value) {
        const safe = cleanText(value, "Organisation")
            .replace(/[^a-z0-9]+/gi, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 70);
        return safe || "Organisation";
    }

    function getStoredReport() {
        try {
            const raw = window.localStorage?.getItem(REPORT_STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (error) {
            console.warn("GrowWithHR PDF polish: saved report could not be read.", error);
            return {};
        }
    }

    function loadTransparentLogo() {
        if (logoPromise) return logoPromise;

        logoPromise = new Promise((resolve) => {
            const image = new Image();
            image.decoding = "async";
            image.onload = () => {
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = 256;
                    canvas.height = 256;
                    const context = canvas.getContext("2d");
                    context.clearRect(0, 0, 256, 256);
                    context.drawImage(image, 0, 0, 256, 256);
                    resolve(canvas.toDataURL("image/png"));
                } catch (error) {
                    console.warn("GrowWithHR PDF polish: logo conversion failed.", error);
                    resolve("");
                }
            };
            image.onerror = () => resolve("");
            image.src = new URL(
                "assets/hrtechify-logo-transparent.svg",
                window.location.href
            ).href;
        });

        return logoPromise;
    }

    function createWriter(doc, model, logoDataUrl, options) {
        let cursorY = PAGE.top;
        const runningTitle = cleanText(
            options.runningTitle,
            "GrowWithHR Executive Advisory"
        );

        const setFont = (style = "normal", size = 10.2) => {
            doc.setFont("helvetica", style);
            doc.setFontSize(size);
        };
        const setText = (colour) => doc.setTextColor(...colour);
        const setFill = (colour) => doc.setFillColor(...colour);
        const setDraw = (colour) => doc.setDrawColor(...colour);
        const lineHeight = (size, factor = 1.45) => size * 0.3528 * factor;
        const split = (text, width) => doc.splitTextToSize(cleanText(text), width);

        function header() {
            setFont("bold", 8.5);
            setText(BRAND.navy);
            doc.text("HRTechify", PAGE.left, PAGE.headerY);

            setFont("normal", 8.2);
            setText(BRAND.muted);
            doc.text(runningTitle, PAGE.width - PAGE.right, PAGE.headerY, {
                align: "right"
            });

            setDraw(BRAND.orange);
            doc.setLineWidth(0.45);
            doc.line(PAGE.left, 18, PAGE.width - PAGE.right, 18);
        }

        function addPage() {
            doc.addPage();
            cursorY = PAGE.top;
            header();
        }

        function remainingHeight() {
            return contentBottom - cursorY;
        }

        function ensureSpace(height) {
            if (height > remainingHeight()) addPage();
        }

        function cover() {
            setFill(BRAND.navy);
            doc.rect(0, 0, PAGE.width, 64, "F");

            if (logoDataUrl) {
                try {
                    doc.addImage(logoDataUrl, "PNG", PAGE.left, 13, 28, 28, undefined, "FAST");
                } catch (error) {
                    console.warn("GrowWithHR PDF polish: logo could not be added.", error);
                }
            }

            setFont("bold", 13);
            setText(BRAND.white);
            doc.text("HRTechify", logoDataUrl ? 50 : PAGE.left, 25);
            setFont("normal", 9);
            doc.setTextColor(212, 222, 236);
            doc.text("People • Technology • Growth", logoDataUrl ? 50 : PAGE.left, 32);

            setFont("bold", 9.5);
            setText(BRAND.orange);
            doc.text(
                cleanText(options.coverLabel, "PERSONALISED EXECUTIVE ADVISORY"),
                PAGE.left,
                82
            );

            setFont("bold", 27);
            setText(BRAND.navy);
            const title = split(cleanText(options.coverTitle, "Executive Advisory"), 160);
            doc.text(title, PAGE.left, 99, { lineHeightFactor: 1.08 });

            const titleHeight = title.length * lineHeight(27, 1.08);
            setFont("normal", 15);
            setText(BRAND.navySoft);
            const company = split(model.companyName, 160);
            const companyY = 104 + titleHeight;
            doc.text(company, PAGE.left, companyY, { lineHeightFactor: 1.2 });

            const companyHeight = company.length * lineHeight(15, 1.2);
            const metaY = companyY + companyHeight + 11;
            setFont("normal", 10.3);
            setText(BRAND.text);
            doc.text(`Prepared for ${model.recipientName}`, PAGE.left, metaY);

            if (model.recipientRole) {
                setFont("normal", 9.3);
                setText(BRAND.muted);
                doc.text(model.recipientRole, PAGE.left, metaY + 6.2);
            }

            setFont("normal", 9.3);
            setText(BRAND.muted);
            doc.text(`Prepared ${formatDate(model.generatedAt)}`, PAGE.left, metaY + 14);

            setFill(BRAND.orangeSoft);
            doc.roundedRect(PAGE.left, 184, usableWidth, 48, 4, 4, "F");
            setDraw(BRAND.orange);
            doc.setLineWidth(1.2);
            doc.line(PAGE.left, 184, PAGE.left, 232);

            setFont("normal", 10.5);
            setText(BRAND.text);
            const intro = split(
                cleanText(
                    options.coverIntro,
                    "A practical leadership briefing connecting your organisation profile with people, governance, compliance and growth priorities."
                ),
                usableWidth - 18
            );
            doc.text(intro, PAGE.left + 9, 198, { lineHeightFactor: 1.5 });

            setFont("italic", 8.7);
            setText(BRAND.muted);
            const note = split(
                options.isSample
                    ? "Illustrative sample using fictional organisation information."
                    : "Confidential leadership working document. Verify legal and regulatory requirements with qualified professionals and current official sources.",
                usableWidth
            );
            doc.text(note, PAGE.left, 255, { lineHeightFactor: 1.4 });
        }

        function sectionHeading(overline, title, introduction = "") {
            ensureSpace(34);
            setFont("bold", 8.4);
            setText(BRAND.orangeDark);
            doc.text(cleanText(overline).toUpperCase(), PAGE.left, cursorY);
            cursorY += 7;

            setFont("bold", 18);
            setText(BRAND.navy);
            const titleLines = split(title, usableWidth);
            doc.text(titleLines, PAGE.left, cursorY, { lineHeightFactor: 1.12 });
            cursorY += titleLines.length * lineHeight(18, 1.12) + 3;

            setDraw(BRAND.orange);
            doc.setLineWidth(0.8);
            doc.line(PAGE.left, cursorY, PAGE.left + 28, cursorY);
            cursorY += 7;

            if (introduction) {
                paragraph(introduction, {
                    size: 10.2,
                    colour: BRAND.muted,
                    spacingAfter: 8
                });
            }
        }

        function paragraph(text, settings = {}) {
            const size = settings.size || 10.2;
            const factor = settings.lineHeight || 1.48;
            const spacingAfter = settings.spacingAfter ?? 5;
            const indent = settings.indent || 0;
            const width = settings.width || usableWidth - indent;
            const style = settings.style || "normal";
            const colour = settings.colour || BRAND.text;
            const lines = split(text, width);
            const height = lineHeight(size, factor);
            let index = 0;

            while (index < lines.length) {
                if (remainingHeight() < height + 2) addPage();
                const linesAvailable = Math.max(1, Math.floor(remainingHeight() / height));
                const chunk = lines.slice(index, index + linesAvailable);
                setFont(style, size);
                setText(colour);
                doc.text(chunk, PAGE.left + indent, cursorY, { lineHeightFactor: factor });
                cursorY += chunk.length * height;
                index += chunk.length;
                if (index < lines.length) addPage();
            }

            cursorY += spacingAfter;
        }

        function subheading(title) {
            ensureSpace(16);
            setFont("bold", 12.4);
            setText(BRAND.navy);
            const lines = split(title, usableWidth);
            doc.text(lines, PAGE.left, cursorY, { lineHeightFactor: 1.18 });
            cursorY += lines.length * lineHeight(12.4, 1.18) + 4;
        }

        function bulletList(items, settings = {}) {
            const source = toArray(items);
            source.forEach((item) => {
                const size = settings.size || 10;
                const factor = 1.45;
                const textWidth = usableWidth - 12;
                const lines = split(item, textWidth);
                const itemHeight = lines.length * lineHeight(size, factor) + 3;
                ensureSpace(Math.min(itemHeight, 22));

                setFill(BRAND.orange);
                doc.circle(PAGE.left + 2.2, cursorY - 1.1, 1.05, "F");
                setFont("normal", size);
                setText(BRAND.text);
                doc.text(lines, PAGE.left + 8, cursorY, { lineHeightFactor: factor });
                cursorY += itemHeight;
            });
            cursorY += settings.spacingAfter ?? 2;
        }

        function numberedList(items) {
            toArray(items).forEach((item, index) => {
                const size = 10;
                const factor = 1.45;
                const lines = split(item, usableWidth - 14);
                const itemHeight = lines.length * lineHeight(size, factor) + 4;
                ensureSpace(Math.min(itemHeight, 24));

                setFill(BRAND.orangeSoft);
                doc.circle(PAGE.left + 4, cursorY - 1.8, 3.5, "F");
                setFont("bold", 8.4);
                setText(BRAND.orangeDark);
                doc.text(String(index + 1), PAGE.left + 4, cursorY - 0.6, { align: "center" });

                setFont("normal", size);
                setText(BRAND.text);
                doc.text(lines, PAGE.left + 11, cursorY, { lineHeightFactor: factor });
                cursorY += itemHeight;
            });
            cursorY += 2;
        }

        function profileRow(label, value, alternate) {
            const labelWidth = 47;
            const gap = 6;
            const valueWidth = usableWidth - labelWidth - gap - 12;
            const labelLines = split(label, labelWidth - 6);
            const valueLines = split(cleanText(value, "Not specified"), valueWidth);
            const labelLineHeight = lineHeight(9.3, 1.34);
            const valueLineHeight = lineHeight(10.1, 1.38);
            const textHeight = Math.max(
                labelLines.length * labelLineHeight,
                valueLines.length * valueLineHeight
            );
            const rowHeight = Math.max(14, textHeight + 9);

            ensureSpace(rowHeight + 2);
            setFill(alternate ? BRAND.panel : BRAND.white);
            setDraw(BRAND.line);
            doc.setLineWidth(0.25);
            doc.roundedRect(PAGE.left, cursorY - 5, usableWidth, rowHeight, 2.5, 2.5, "FD");

            setFill(BRAND.orange);
            doc.roundedRect(PAGE.left, cursorY - 5, 2.2, rowHeight, 1, 1, "F");

            setFont("bold", 9.3);
            setText(BRAND.navy);
            doc.text(labelLines, PAGE.left + 7, cursorY + 2, { lineHeightFactor: 1.34 });

            setFont("normal", 10.1);
            setText(BRAND.text);
            doc.text(valueLines, PAGE.left + labelWidth + gap, cursorY + 2, {
                lineHeightFactor: 1.38
            });

            cursorY += rowHeight + 2;
        }

        function profileTable(rows) {
            rows.forEach(([label, value], index) => profileRow(label, value, index % 2 === 1));
            cursorY += 3;
        }

        function contentCard(label, title, body) {
            const titleLines = split(title, usableWidth - 18);
            const bodyLines = split(body, usableWidth - 18);
            const cardHeight =
                9 +
                lineHeight(8.1, 1.2) +
                titleLines.length * lineHeight(12.2, 1.2) +
                bodyLines.length * lineHeight(9.9, 1.46) +
                13;

            if (cardHeight > remainingHeight()) addPage();

            setFill(BRAND.panel);
            setDraw(BRAND.line);
            doc.setLineWidth(0.25);
            doc.roundedRect(PAGE.left, cursorY - 4, usableWidth, cardHeight, 3.5, 3.5, "FD");
            setFill(BRAND.orange);
            doc.roundedRect(PAGE.left, cursorY - 4, 2.4, cardHeight, 1.2, 1.2, "F");

            setFont("bold", 8.1);
            setText(BRAND.orangeDark);
            doc.text(cleanText(label).toUpperCase(), PAGE.left + 8, cursorY + 3);
            cursorY += 9;

            setFont("bold", 12.2);
            setText(BRAND.navy);
            doc.text(titleLines, PAGE.left + 8, cursorY + 3, { lineHeightFactor: 1.2 });
            cursorY += titleLines.length * lineHeight(12.2, 1.2) + 5;

            setFont("normal", 9.9);
            setText(BRAND.text);
            doc.text(bodyLines, PAGE.left + 8, cursorY + 3, { lineHeightFactor: 1.46 });
            cursorY += bodyLines.length * lineHeight(9.9, 1.46) + 10;
        }

        function footers() {
            const total = doc.getNumberOfPages();
            for (let page = 1; page <= total; page += 1) {
                doc.setPage(page);
                setDraw(BRAND.orange);
                doc.setLineWidth(0.35);
                doc.line(PAGE.left, 278, PAGE.width - PAGE.right, 278);

                setFont("bold", 7.5);
                setText(BRAND.navy);
                doc.text("HRTechify | GrowWithHR", PAGE.left, PAGE.footerY);

                setFont("normal", 7.2);
                setText(BRAND.muted);
                doc.text(
                    page === 1 ? "Confidential executive advisory" : runningTitle,
                    PAGE.width / 2,
                    PAGE.footerY,
                    { align: "center" }
                );
                doc.text(`Page ${page} of ${total}`, PAGE.width - PAGE.right, PAGE.footerY, {
                    align: "right"
                });
            }
        }

        return {
            cover,
            addPage,
            sectionHeading,
            paragraph,
            subheading,
            bulletList,
            numberedList,
            profileTable,
            contentCard,
            footers
        };
    }

    function render(doc, model, logoDataUrl, options) {
        const writer = createWriter(doc, model, logoDataUrl, options);
        writer.cover();

        writer.addPage();
        writer.sectionHeading(
            "Executive snapshot",
            "About Your Organisation",
            "A concise view of the organisation context used to shape this advisory."
        );
        writer.profileTable([
            ["Organisation", model.companyName],
            ["Industry", model.industry],
            ["What it does", model.nature],
            ["Operating since", model.founded],
            ["Legal structure", model.entity],
            ["Funding position", model.fundingStage],
            ["Employees", model.employees ? String(model.employees) : "Not specified"],
            [
                "Other workers",
                [
                    model.contractWorkers ? pluralise(model.contractWorkers, "contract worker") : "",
                    model.interns ? pluralise(model.interns, "intern") : "",
                    model.apprentices ? pluralise(model.apprentices, "apprentice") : ""
                ].filter(Boolean).join(", ") || "None specified"
            ],
            ["Working model", model.workModel],
            ["Remote workforce", model.remoteWorkforce],
            ["Primary base", model.primaryState],
            [
                "Operating footprint",
                `${pluralise(model.locations, "location")} across ${pluralise(model.countries, "country", "countries")}`
            ],
            ["Hiring direction", model.hiringPlans],
            ["Expected change", sentenceList(model.expansionPlans)],
            ["People support", model.peopleFunction]
        ]);

        writer.addPage();
        writer.sectionHeading(
            "Executive summary",
            "What Matters Next",
            "This perspective connects the organisation's current stage with the people foundations most likely to matter next."
        );
        model.executiveSummary.forEach((text) => writer.paragraph(text, { spacingAfter: 7 }));
        writer.subheading("Immediate leadership focus");
        writer.numberedList(model.priorities);

        writer.addPage();
        writer.sectionHeading(
            "Executive perspective",
            "Coach HRTechify's Perspective",
            "People capability becomes a strategic business capability when growth introduces greater complexity, dependency and leadership risk."
        );
        model.perspective.forEach((text) => writer.paragraph(text, { spacingAfter: 7 }));
        if (model.growthContext) {
            writer.subheading("Context shared by leadership");
            writer.paragraph(model.growthContext, {
                style: "italic",
                colour: BRAND.muted,
                spacingAfter: 8
            });
        }
        writer.subheading("Positive foundations");
        writer.bulletList(model.strengths);

        writer.addPage();
        writer.sectionHeading(
            "Leadership priorities",
            "Areas Requiring Leadership Attention",
            "These areas are not shortcomings. They are the capabilities most likely to improve execution, consistency and organisational readiness."
        );
        model.recommendations.forEach((item, index) => {
            writer.contentCard(`Priority ${index + 1}`, item.title, item.observation);
            writer.paragraph(item.recommendation, {
                indent: 5,
                width: usableWidth - 10,
                spacingAfter: 8
            });
        });

        writer.addPage();
        writer.sectionHeading(
            "Recommended actions",
            "Strategic Recommendations",
            "Establish the minimum repeatable practice, assign ownership and review whether it improves business and employee outcomes."
        );
        model.recommendations.forEach((item, index) => {
            writer.contentCard(`Action ${index + 1}`, item.title, item.recommendation);
        });

        writer.addPage();
        writer.sectionHeading(
            "Your next steps",
            "Executive Implementation Roadmap",
            "A practical first ninety days. Adjust the pace to reflect capacity, risk and business timing."
        );
        writer.subheading("First 30 days — Create clarity");
        writer.numberedList(model.roadmap.first30);
        writer.subheading("Days 31–60 — Build consistency");
        writer.numberedList(model.roadmap.next60);
        writer.subheading("Days 61–90 — Embed and review");
        writer.numberedList(model.roadmap.next90);

        writer.addPage();
        writer.sectionHeading(
            "Compliance review",
            "What You Should Review",
            "These are governance prompts, not legal conclusions. Confirm applicable obligations with qualified advisers and official authorities."
        );
        writer.bulletList(model.compliance);
        writer.subheading("Suggested governance rhythm");
        writer.numberedList([
            "Assign one accountable owner for each obligation or policy area.",
            "Record the evidence that demonstrates completion, communication and review.",
            "Escalate overdue or high-risk items through a regular leadership forum.",
            "Reassess requirements after changes in headcount, location, worker type or operating model."
        ]);

        writer.addPage();
        writer.sectionHeading(
            "Strategic opportunities",
            "Opportunities for Organisational Growth",
            "Strong people foundations can increase execution speed, leadership capacity and employee confidence when connected directly to business priorities."
        );
        writer.bulletList(model.opportunities);
        writer.subheading("Questions for the leadership team");
        writer.numberedList([
            "Which people decision would most improve business execution during the next quarter?",
            "Where are managers making inconsistent decisions because expectations or ownership are unclear?",
            "Which workforce risk would become most serious if headcount or operating complexity increased quickly?",
            "What evidence will show that the chosen priorities are improving outcomes?"
        ]);

        writer.addPage();
        writer.sectionHeading(
            "Looking ahead",
            "Preparing for the Next Stage of Growth",
            "The strongest organisations revisit their people foundations before complexity becomes a constraint."
        );
        writer.paragraph(
            `${model.companyName} should use this advisory as a leadership working document. Select a small number of actions, assign clear owners, agree evidence of progress and review the priorities alongside business performance.`
        );
        writer.paragraph(
            "Refresh this advisory after a material change in workforce size, operating locations, leadership structure, growth expectations or the People/HR support model."
        );
        writer.subheading("Final thoughts");
        writer.paragraph(
            "Sustainable growth depends on the organisation's ability to make clear, fair and repeatable people decisions. Early investment in the right foundations protects momentum and gives leadership more capacity to focus on the business."
        );

        writer.addPage();
        writer.sectionHeading(
            "Important information",
            options.isSample ? "Sample Notice and Disclaimer" : "Confidentiality, Privacy and Disclaimer"
        );
        if (options.isSample) {
            writer.subheading("Illustrative sample notice");
            writer.paragraph(
                "This sample advisory uses fictional company, workforce and leadership information. It does not describe or assess any real organisation or individual."
            );
        } else {
            writer.subheading("Confidentiality notice");
            writer.paragraph(
                "This Executive Advisory has been prepared for the organisation and recipient identified in this document. It is intended to support internal leadership discussion and should be shared only with appropriate stakeholders."
            );
            writer.subheading("Privacy and data handling");
            writer.paragraph(
                "GrowWithHR uses the information submitted through the Executive Advisory Briefing to prepare and deliver the advisory. Optional marketing communication remains subject to the separate choice selected by the user."
            );
        }
        writer.subheading("Advisory disclaimer");
        writer.paragraph(
            options.isSample
                ? "This document demonstrates the structure and style of a GrowWithHR Executive Advisory. Its observations and recommendations are illustrative and must not be treated as legal, tax, accounting, employment-law or regulatory advice."
                : "This document provides general business and people-management guidance based on information supplied by the user. It is not legal, tax, accounting, employment-law or regulatory advice. Verify requirements with qualified professionals and current official sources before action is taken."
        );
        writer.subheading("About Coach HRTechify");
        writer.paragraph(
            "Coach HRTechify helps founders, business leaders and People/HR leaders understand the organisational implications of growth and identify practical next steps."
        );

        writer.footers();
    }

    async function buildAdvisoryPdf(payload = {}) {
        const model = previous.buildAdvisoryModel(payload);
        const options = {
            isSample: Boolean(payload.isSample),
            runningTitle: cleanText(payload.runningTitle, "GrowWithHR Executive Advisory"),
            coverLabel: cleanText(
                payload.coverLabel,
                payload.isSample
                    ? "ILLUSTRATIVE SAMPLE EXECUTIVE ADVISORY"
                    : "PERSONALISED EXECUTIVE ADVISORY"
            ),
            coverTitle: cleanText(payload.coverTitle, "Executive Advisory"),
            coverIntro: cleanText(payload.coverIntro)
        };
        const logoDataUrl = await loadTransparentLogo();
        const doc = new JsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true,
            putOnlyUsedFonts: true
        });

        doc.setProperties({
            title: options.isSample
                ? `Sample Executive Advisory - ${model.companyName}`
                : `Executive Advisory - ${model.companyName}`,
            subject: options.isSample
                ? "HRTechify GrowWithHR Illustrative Sample Advisory"
                : "GrowWithHR Personalised Executive Advisory",
            author: "HRTechify",
            creator: `GrowWithHR PDF ${VERSION}`,
            keywords: "HRTechify, GrowWithHR, executive advisory, people strategy"
        });

        render(doc, model, logoDataUrl, options);

        const filename = cleanText(
            payload.filename,
            options.isSample
                ? "HRTechify-Sample-Executive-Advisory.pdf"
                : `GrowWithHR-Advisory-${escapeFilename(model.companyName)}.pdf`
        );
        const dataUri = doc.output("datauristring");
        const base64 = dataUri.includes(",") ? dataUri.split(",")[1] : dataUri;
        const arrayBuffer = doc.output("arraybuffer");

        return {
            document: doc,
            filename,
            base64,
            dataUri,
            sizeBytes: arrayBuffer.byteLength,
            pageCount: doc.getNumberOfPages(),
            generatedAt: new Date().toISOString(),
            companyName: model.companyName,
            version: VERSION,
            isSample: options.isSample
        };
    }

    async function downloadAdvisoryPdf(payload = {}) {
        let result = payload.document || payload.pdf || null;
        if (result && typeof result.save === "function") {
            result = { document: result, filename: cleanText(payload.filename, DEFAULT_FILENAME) };
        }
        if (!result || (!result.document && typeof result.save !== "function")) {
            result = await buildAdvisoryPdf(payload);
        }

        const doc = result.document || result;
        const filename = cleanText(result.filename || payload.filename, DEFAULT_FILENAME);
        if (!doc || typeof doc.save !== "function") {
            throw new Error("A valid jsPDF document was not available for download.");
        }
        doc.save(filename);

        try {
            window.localStorage?.setItem(LAST_DOWNLOAD_KEY, new Date().toISOString());
        } catch (error) {
            console.warn("GrowWithHR PDF polish: download time could not be saved.", error);
        }
        return result;
    }

    async function generatePDFReport() {
        const button = document.getElementById("generateReportBtn");
        if (button) {
            button.disabled = true;
            button.setAttribute("aria-busy", "true");
        }

        try {
            const result = await buildAdvisoryPdf({
                report: getStoredReport(),
                lead: {
                    email: cleanText(document.getElementById("userEmail")?.value),
                    deliveryRequested: true
                }
            });
            await downloadAdvisoryPdf(result);
            window.closePDFModal?.();
        } catch (error) {
            console.error("GrowWithHR PDF polish: report generation failed.", error);
            window.alert?.("We could not prepare the PDF just yet. Please try again.");
        } finally {
            if (button) {
                button.disabled = false;
                button.removeAttribute("aria-busy");
            }
        }
    }

    window.GrowWithHRPDF = Object.freeze({
        version: VERSION,
        buildAdvisoryPdf,
        downloadAdvisoryPdf,
        buildAdvisoryModel: previous.buildAdvisoryModel
    });
    window.generatePDFReport = generatePDFReport;
    window.GrowWithHRPDFPolishReady = Promise.resolve(window.GrowWithHRPDF);

    window.dispatchEvent(new CustomEvent("growwithhr:pdf-polish-ready", {
        detail: { version: VERSION }
    }));
})(window, document);
