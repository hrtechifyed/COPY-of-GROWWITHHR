/* GrowWithHR acceptance-grade report assembler and founder-only workforce guard */
(() => {
    "use strict";

    const VERSION = "0.24.0-acceptance-report";
    const INSTALL_FLAG = "__growwithhrAcceptanceReportInstalled";
    const SAFE_SEP = " - ";
    const PAGE = Object.freeze({ width: 210, height: 297, left: 16, right: 194, top: 24, bottom: 270 });

    const clean = (value, fallback = "") => String(value ?? "")
        .replace(/[→›]/g, SAFE_SEP)
        .replace(/!['’]/g, SAFE_SEP)
        .replace(/\s+/g, " ")
        .trim() || fallback;
    const list = (value) => Array.isArray(value) ? value.map((item) => clean(item)).filter(Boolean) : (clean(value) ? [clean(value)] : []);
    const unique = (values) => [...new Set(values.map((value) => clean(value)).filter(Boolean))];
    const number = (value) => {
        const match = clean(value).replace(/,/g, "").match(/\d+(?:\.\d+)?/);
        return match ? Number(match[0]) : 0;
    };

    const OFFICIAL_URLS = Object.freeze({
        posh: "https://www.indiacode.nic.in/handle/123456789/2104?locale=en",
        maternity: "https://www.indiacode.nic.in/handle/123456789/9160?locale=en",
        epf: "https://www.epfindia.gov.in/site_en/Acts%26Manuals.php",
        esi: "https://esic.gov.in/Publications/ESIAct1948Amendedupto010610.htm",
        gratuity: "https://www.indiacode.nic.in/handle/123456789/12862?locale=en",
        bonus: "https://www.indiacode.nic.in/handle/123456789/1484?locale=en",
        "minimum-wages": "https://www.indiacode.nic.in/handle/123456789/15793?locale=en",
        "contract-labour": "https://www.indiacode.nic.in/handle/123456789/1490?locale=en",
        "standing-orders": "https://www.indiacode.nic.in/handle/123456789/19411?locale=en",
        factories: "https://www.labour.gov.in/documents/acts-and-policies/industrial-safety-health-kDOxMTMtQWa?-Health=&pageTitle=Industrial-Safety-"
    });

    const STATE_LABOUR_PORTALS = Object.freeze({
        haryana: "https://hrylabour.gov.in/",
        delhi: "https://labour.delhi.gov.in/",
        maharashtra: "https://mahakamgar.maharashtra.gov.in/",
        karnataka: "https://labour.karnataka.gov.in/",
        tamilnadu: "https://labour.tn.gov.in/",
        telangana: "https://labour.telangana.gov.in/",
        gujarat: "https://labour.gujarat.gov.in/",
        rajasthan: "https://labour.rajasthan.gov.in/",
        kerala: "https://lc.kerala.gov.in/",
        "uttar pradesh": "https://uplabour.gov.in/"
    });

    function palette(name) {
        return /dark/i.test(clean(name))
            ? { page: [0,0,0], panel: [15,15,15], alt: [25,25,25], text: [238,238,238], muted: [184,184,184], head: [255,255,255], line: [75,75,75], accent: [245,158,11], green: [91,214,148], amber: [255,190,75], red: [255,120,110] }
            : { page: [255,255,255], panel: [244,247,251], alt: [232,239,248], text: [10,24,48], muted: [53,72,99], head: [4,28,67], line: [166,181,202], accent: [245,158,11], green: [23,128,73], amber: [184,102,0], red: [180,35,24] };
    }

    function source(payload = {}, model = {}) {
        return Object.assign({}, payload, payload.lead || {}, payload.answers || {}, payload.report || {}, model || {});
    }

    function legalStructure(data) {
        return clean(data.establishmentType || data.legalStructure || data.entityType || data.organisationType).toLowerCase();
    }

    function isOpc(data) {
        return /one person company|\bopc\b/.test(legalStructure(data));
    }

    function isOwnerOnly(data) {
        const explicit = clean(data.workforcePresence || data.peopleBeyondOwner || data.nonOwnerWorkforce).toLowerCase();
        return ["owner-only", "only-owner", "no", "none"].includes(explicit);
    }

    function statePortal(data) {
        const state = clean(data.primaryState || data.state || data.registeredState).toLowerCase();
        return STATE_LABOUR_PORTALS[state] || "";
    }

    function normaliseRows(rows, data) {
        const ownerOnly = isOwnerOnly(data);
        return rows.map((original) => {
            const row = { ...original, thresholdResult: { ...(original.thresholdResult || {}) }, inputCoverage: { ...(original.inputCoverage || {}) } };
            row.officialUrl = row.id === "shops" ? statePortal(data) : (OFFICIAL_URLS[row.id] || row.officialUrl || "");
            if (ownerOnly && ["factories", "standing-orders", "contract-labour"].includes(row.id)) {
                row.status = "Not currently triggered";
                row.priority = "LOW";
                row.missingInputs = [];
                row.missingQuestions = [];
                row.inputCoverage.confirmed = row.inputCoverage.required;
                row.thresholdResult = {
                    ...row.thresholdResult,
                    state: "below",
                    label: "No non-owner workforce reported",
                    positionText: "Owner/director only",
                    explanation: "No person other than the owner/director was reported as working with the organisation. Reassess before engaging employees, workers or contractors."
                };
            }
            return row;
        });
    }

    function statusColour(status, colours) {
        if (status === "Applicable") return colours.green;
        if (status === "Review required") return colours.amber;
        if (status === "Needs information") return colours.red;
        return colours.muted;
    }

    function createWriter(doc, colours, sectionPages) {
        let y = PAGE.top;
        let section = "";
        const lineHeight = (size, factor = 1.28) => size * 0.3528 * factor;
        const split = (value, width = 178) => doc.splitTextToSize(clean(value), width);
        const paint = () => {
            doc.setFillColor(...colours.page); doc.rect(0, 0, PAGE.width, PAGE.height, "F");
            doc.setDrawColor(...colours.line); doc.setLineWidth(0.35); doc.rect(5.5, 5.5, 199, 286, "S");
        };
        const addPage = (continuation = false) => {
            doc.addPage(); paint(); y = PAGE.top;
            if (continuation && section) {
                doc.setFont("helvetica", "bold"); doc.setFontSize(7.4); doc.setTextColor(...colours.accent);
                doc.text(`${section.toUpperCase()} - CONTINUED`, PAGE.left, y); y += 9;
            }
        };
        const ensure = (height) => { if (y + height > PAGE.bottom) addPage(true); };
        const text = (value, options = {}) => {
            const size = Number(options.size || 8.5), width = Number(options.width || 178), factor = Number(options.factor || 1.28);
            const lines = split(value, width), height = lines.length * lineHeight(size, factor), after = Number(options.after ?? 3);
            ensure(height + after);
            doc.setFont("helvetica", options.style || "normal"); doc.setFontSize(size); doc.setTextColor(...(options.colour || colours.text));
            const paragraph = clean(value);
            const align = options.align || (options.justify && paragraph.length > 110 ? "justify" : "left");
            doc.text(lines, Number(options.x || PAGE.left), y, { lineHeightFactor: factor, maxWidth: width, align });
            y += height + after;
        };
        const heading = (key, eyebrow, title, intro = "") => {
            section = title; addPage(false); sectionPages[key] = doc.getNumberOfPages();
            doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(...colours.accent); doc.text(clean(eyebrow).toUpperCase(), PAGE.left, y); y += 8;
            text(title, { size: 19, style: "bold", colour: colours.head, factor: 1.15, after: 6 });
            if (intro) text(intro, { colour: colours.muted, after: 7, justify: true });
        };
        const subheading = (value) => text(value, { size: 11, style: "bold", colour: colours.head, after: 4 });
        const bullet = (value, bulletColour = colours.accent) => {
            const lines = split(value, 164), height = lines.length * lineHeight(8.2) + 3; ensure(height);
            doc.setFillColor(...bulletColour); doc.circle(19, y - 1, 0.8, "F");
            doc.setFont("helvetica", "normal"); doc.setFontSize(8.2); doc.setTextColor(...colours.text);
            doc.text(lines, 25, y, { lineHeightFactor: 1.28, maxWidth: 164 }); y += height;
        };
        const callout = (title, body, options = {}) => {
            const width = Number(options.width || 178), x = Number(options.x || PAGE.left);
            const titleLines = split(title, width - 12), bodyLines = split(body, width - 12);
            const height = Math.max(22, titleLines.length * lineHeight(9.1, 1.2) + bodyLines.length * lineHeight(8.05, 1.28) + 14);
            ensure(height + 5);
            doc.setFillColor(...(options.fill || colours.panel)); doc.setDrawColor(...(options.draw || colours.line)); doc.roundedRect(x, y - 4, width, height, 2, 2, "FD");
            doc.setFont("helvetica", "bold"); doc.setFontSize(9.1); doc.setTextColor(...(options.titleColour || colours.head));
            doc.text(titleLines, x + 6, y + 3, { lineHeightFactor: 1.2, maxWidth: width - 12 });
            const bodyY = y + 4 + titleLines.length * lineHeight(9.1, 1.2) + 3;
            doc.setFont("helvetica", "normal"); doc.setFontSize(8.05); doc.setTextColor(...(options.bodyColour || colours.text));
            doc.text(bodyLines, x + 6, bodyY, { lineHeightFactor: 1.28, maxWidth: width - 12 }); y += height + 5;
        };
        const badge = (id, title, body, colourValue = colours.accent) => callout(`${id} - ${title}`, body, { titleColour: colourValue });
        const link = (label, url, x = PAGE.left, width = 170) => {
            if (!url) { text("Official state source is not yet resolved. Confirm the exact enactment with the relevant state labour department.", { size: 7.6, colour: colours.muted }); return; }
            const safeLabel = clean(label), lines = split(safeLabel, width), size = 7.8, factor = 1.2, height = lines.length * lineHeight(size, factor);
            ensure(height + 5); doc.setFont("helvetica", "bold"); doc.setFontSize(size); doc.setTextColor(...colours.accent);
            doc.text(lines, x, y, { lineHeightFactor: factor, maxWidth: width });
            const linkWidth = Math.min(width, Math.max(20, Number(doc.getTextWidth?.(safeLabel) || width)));
            doc.setDrawColor(...colours.accent); doc.line(x, y + 1, x + linkWidth, y + 1);
            if (typeof doc.link === "function") doc.link(x, y - 4, linkWidth, Math.max(5, height + 2), { url });
            y += height + 5;
        };
        return { heading, subheading, text, bullet, callout, badge, link, ensure, addPage, getY: () => y, setY: (value) => { y = value; }, paint };
    }

    function actionMap(rows) {
        const rank = { Applicable: 0, "Needs information": 1, "Review required": 2, "Not currently triggered": 3 };
        return rows.filter((row) => row.status !== "Not currently triggered")
            .sort((a,b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || clean(a.shortTitle).localeCompare(clean(b.shortTitle)))
            .reduce((map, row, index) => map.set(row.id, `A${index + 1}`), new Map());
    }

    function swot(rows, model, data) {
        const employeeCount = number(data.employees || data.employeeCount || data.headcount);
        const strengths = unique([
            data.peopleSupport || data.hrSupport ? `People support model confirmed as ${clean(data.peopleSupport || data.hrSupport)}.` : "",
            data.hiringDirection ? `Hiring direction confirmed as ${clean(data.hiringDirection)}.` : "",
            data.workModel ? `Working model confirmed as ${clean(data.workModel)}.` : "",
            data.primaryState ? `Primary operating state confirmed as ${clean(data.primaryState)}.` : ""
        ]).slice(0,4);
        const weaknesses = rows.filter((row) => ["Needs information", "Review required"].includes(row.status)).slice(0,4)
            .map((row, index) => `W${index + 1}: ${row.shortTitle} - ${row.status === "Needs information" ? clean((row.missingQuestions || [])[0], "a governed input is missing") : "the conclusion depends on state or workforce-specific review"}.`);
        const opportunities = (Array.isArray(model.recommendations) ? model.recommendations : []).slice(0,4)
            .map((item, index) => `O${index + 1}: ${clean(item.title || item.recommendation || `Opportunity ${index + 1}`)}.`);
        const threats = rows.filter((row) => ["near", "below"].includes(row.thresholdResult?.state)).slice(0,4).map((row, index) => {
            const threshold = Number(row.thresholdResult?.threshold || 0), current = Number(row.thresholdResult?.count ?? employeeCount), gap = threshold ? Math.max(0, threshold - current) : 0;
            return `T${index + 1}: ${row.shortTitle} - ${gap ? `${gap} relevant ${gap === 1 ? "person" : "people"} away from the displayed general trigger` : "reassess after the next relevant workforce or operating change"}.`;
        });
        return { strengths, weaknesses, opportunities, threats };
    }

    function renderBrief(writer, rows, model, data, actions, swotData) {
        writer.heading("brief", "5-MINUTE BRIEF", "Founder Brief", "Short on time? Read this section and the Executive Snapshot only. Continue to the Deep Dive for evidence, full SWOT, actions, triggers and legal references.");
        const applicable = rows.filter((row) => row.status === "Applicable").length;
        const review = rows.filter((row) => row.status === "Review required").length;
        const missing = rows.filter((row) => row.status === "Needs information").length;
        writer.callout("Present position in one line", `${clean(data.companyName, "The organisation")} has ${number(data.employees || data.employeeCount || data.headcount)} reported ${number(data.employees || data.employeeCount || data.headcount) === 1 ? "employee" : "employees"}; ${applicable} laws appear applicable, ${review} need review and ${missing} need more information.`);
        writer.subheading("Top three actions");
        [...actions.entries()].slice(0,3).forEach(([id, actionId]) => {
            const row = rows.find((item) => item.id === id); if (row) writer.badge(actionId, row.shortTitle, row.requiredAction);
        });
        writer.subheading("SWOT snapshot");
        writer.bullet(`Strength: ${swotData.strengths[0] || "Core organisation context has been confirmed."}`);
        writer.bullet(`Weakness: ${swotData.weaknesses[0] || "No governed input gap is currently highlighted."}`);
        writer.bullet(`Opportunity: ${swotData.opportunities[0] || "Build a repeatable people operating system before growth accelerates."}`);
        writer.bullet(`Threat: ${swotData.threats[0] || "Future workforce or operating changes may alter legal obligations."}`);
        writer.callout("IF YOU READ NOTHING ELSE", "Confirm the first three action IDs, assign one accountable owner to each, retain evidence of completion and reassess before the next material workforce, state or operating-model change.", { titleColour: [180,35,24] });
    }

    function renderUnderstanding(writer, rows) {
        writer.heading("understanding", "DEEP DIVE - PRESENT", "Understanding Intelligence Engine", "The brief established the immediate position. This section explains what each status means and turns the counts into a decision framework.");
        ["Applicable", "Review required", "Needs information", "Not currently triggered"].forEach((status) => {
            const group = rows.filter((row) => row.status === status);
            const meaning = status === "Applicable" ? "The displayed general trigger appears crossed and the governed inputs were confirmed. Verify the current legal position and maintain evidence."
                : status === "Review required" ? "The answer depends on state rules, workforce categories or a non-universal trigger. Review before treating the law as not applicable."
                : status === "Needs information" ? "A specific assessment answer is missing or Not sure. Complete it before relying on the conclusion."
                : "The displayed general trigger is not currently reached. Reassess after a relevant change.";
            writer.callout(`${group.length} ${group.length === 1 ? "law" : "laws"} - ${status}`, `${meaning}\n\nIncluded: ${group.length ? group.map((row) => row.shortTitle).join(", ") : "None"}.`);
        });
    }

    function renderEvidence(writer, rows, data) {
        writer.heading("evidence", "DEEP DIVE - EVIDENCE", "Evidence and Missing Information", "The status explanation identified uncertainty. This section lists the exact missing answers and the evidence boundary used by the report.");
        const questions = unique(rows.flatMap((row) => row.missingQuestions || []));
        if (!questions.length) writer.callout("No governed assessment inputs are missing", "Documents, registrations and payments are still not independently verified.");
        questions.forEach((question) => writer.callout(question, "Where to answer: Story 3 - Your people - Workforce and statutory eligibility. Choose Not sure when payroll or operations needs to confirm the answer.", { titleColour: [180,35,24] }));
        writer.subheading("Evidence used");
        ["Assessment responses: Used", "Organisation profile: Used", `Uploaded documents: ${data.uploadedDocuments ? "Used" : "Not connected"}`, `Government registrations: ${data.governmentRegistrations ? "Used" : "Not connected"}`].forEach((item) => writer.bullet(item));
        writer.callout("Evidence boundary", "Input coverage confirms which assessment answers were supplied. It does not prove that a registration exists, a payment was made, a committee operates or a statutory record is complete.");
    }

    function renderSwot(writer, swotData) {
        writer.heading("swot", "DEEP DIVE - DIAGNOSE", "SWOT from Your Assessment", "The evidence section established what is known and unknown. This SWOT reuses those same inputs, law statuses, recommendations and future triggers; it does not introduce generic boilerplate.");
        [["Strengths", swotData.strengths], ["Weaknesses", swotData.weaknesses], ["Opportunities", swotData.opportunities], ["Threats", swotData.threats]].forEach(([title, items]) => {
            writer.subheading(title); (items.length ? items : ["No item was generated from the confirmed assessment data."]).forEach((item) => writer.bullet(item));
        });
    }

    function renderComplianceAndStrategy(writer, rows, model, actions, swotData) {
        writer.heading("compliance", "DEEP DIVE - GOVERN", "Compliance Review", `The intelligence engine identified ${rows.filter(r => r.status === "Review required").length} laws needing review and ${rows.filter(r => r.status === "Needs information").length} needing information. This section turns those findings into owned, evidenced actions.`);
        [["R1", "Assign an owner", "One accountable person owns each law, policy or recurring obligation."],["R2", "Retain evidence", "Keep registrations, payment confirmations, training records, licences and review minutes."],["R3", "Review on a cadence", "Review payroll and contractor evidence monthly, thresholds quarterly, major policies annually and after material events."],["R4", "Escalate exceptions", "Overdue, incomplete or high-risk items must be visible in a leadership forum."],["R5", "Reassess after change", "Refresh the assessment after workforce, location, worker type, manufacturing, shifts or ownership changes."]].forEach(([id,title,body]) => writer.badge(id, title, body));
        writer.heading("strategic", "DEEP DIVE - BUILD", "Strategic Recommendations", "The governance rhythm defines how work will be controlled. These recommendations connect business capability-building to the weaknesses, threats and compliance actions already identified.");
        const recommendations = Array.isArray(model.recommendations) ? model.recommendations.slice(0,4) : [];
        recommendations.forEach((item,index) => {
            const actionRef = [...actions.values()][index] || [...actions.values()][0] || "A1";
            const weaknessRef = swotData.weaknesses[index] ? `W${index + 1}` : "the current evidence gap";
            writer.badge(`S${index + 1}`, clean(item.title || `Strategic priority ${index + 1}`), `Responds to ${weaknessRef} and ${actionRef}. Why it matters: ${clean(item.observation || item.suggestionReason, "This capability affects scalable and controlled growth.")} Recommended move: ${clean(item.recommendation, "Define an owner, repeatable process and evidence of progress.")}`);
        });
    }

    function renderPriority(writer, rows, actions, swotData) {
        writer.heading("priority", "DEEP DIVE - ACT", "Priority Compliance Actions", "The preceding sections established the findings and capability gaps. Each action below carries the same ID used in the roadmap and law annexure.");
        [...actions.entries()].forEach(([id, actionId], index) => {
            const row = rows.find((item) => item.id === id); if (!row) return;
            const weakness = swotData.weaknesses[index] ? `W${index + 1}` : "the governed finding";
            writer.badge(actionId, row.shortTitle, `${clean(row.thresholdResult?.explanation || row.thresholdResult?.label)} Do now: ${row.requiredAction} This resolves ${weakness}.`);
        });
    }

    function renderTriggers(writer, rows, swotData, data) {
        writer.heading("triggers", "DEEP DIVE - FUTURE", "Upcoming Compliance Triggers", "The action plan addresses today's position. This section shows what could change the conclusion and ties each future trigger to the Threat references in the SWOT.");
        const hiring = clean(data.hiringDirection, "the stated hiring direction");
        rows.filter((row) => ["near", "below"].includes(row.thresholdResult?.state)).forEach((row,index) => {
            writer.badge(`T${index + 1}`, row.shortTitle, `Current position: ${clean(row.thresholdResult?.positionText || row.thresholdResult?.explanation)}. Displayed trigger: ${clean(row.thresholdResult?.triggerText || row.threshold)}. With ${hiring}, reassess before the relevant count or operating condition changes.`);
        });
    }

    function renderRoadmap(writer, rows, model, actions, swotData) {
        writer.heading("roadmap", "DEEP DIVE - SEQUENCE", "Roadmap - 0 to 90 days", "The findings, recommendations and threats are now connected. The roadmap sequences the same action IDs and shows the weakness or threat each step addresses.");
        const entries = [...actions.entries()].map(([id, actionId], index) => {
            const row = rows.find((item) => item.id === id);
            return row ? `${actionId} - ${row.requiredAction} - resolves ${swotData.weaknesses[index] ? `W${index + 1}` : "the governed finding"}${swotData.threats[index] ? ` and T${index + 1}` : ""}.` : "";
        }).filter(Boolean);
        const modelItems = unique([...list(model.roadmap?.first30), ...list(model.roadmap?.next60), ...list(model.roadmap?.next90)]);
        [["0-30 DAYS", entries.slice(0,3)], ["31-60 DAYS", entries.slice(3,6)], ["61-90 DAYS", entries.slice(6)]].forEach(([label, items], stageIndex) => {
            writer.subheading(label); (items.length ? items : modelItems.slice(stageIndex * 2, stageIndex * 2 + 2)).forEach((item) => writer.bullet(item));
        });
        writer.callout("Founder checkpoint at day 90", "Which actions are complete? What evidence proves completion? Which exceptions remain? What workforce, state or operating change requires this report to be refreshed?");
    }

    function renderLawAnnexure(writer, rows, actions) {
        writer.heading("law", "ANNEXURE - DETAILED REFERENCE", "Law-by-Law Understanding", "The roadmap established what to do and when. This annexure explains the legal trigger, organisation position, action, missing information and official source for every governed law.");
        rows.forEach((row) => {
            const actionId = actions.get(row.id) || "";
            writer.callout(`${actionId ? `${actionId} - ` : ""}${row.shortTitle} - ${row.status}`, clean(row.thresholdResult?.explanation || row.thresholdResult?.label));
            writer.subheading("What this means");
            writer.text(row.status === "Needs information" ? "A specific answer is missing or Not sure; complete it before relying on the conclusion." : row.status === "Review required" ? "The result depends on state, workforce category or a non-universal trigger and needs qualified review." : row.status === "Applicable" ? "The displayed general trigger appears crossed; verify the current legal position and maintain controls." : "The displayed general trigger is not currently reached; reassess after a relevant change.", { justify: true });
            writer.subheading("What to do now"); writer.text(`${actionId ? `${actionId} - ` : ""}${row.requiredAction}`, { style: "bold" });
            writer.callout("Your position versus the displayed trigger", `${clean(row.thresholdResult?.positionText, "Organisation position not confirmed")}\nDisplayed trigger: ${clean(row.thresholdResult?.triggerText, row.threshold)}\nCurrent result: ${clean(row.thresholdResult?.label, row.status)}`);
            const missing = unique(row.missingQuestions || []); writer.text(`Required inputs confirmed: ${Number(row.inputCoverage?.confirmed || 0)} of ${Number(row.inputCoverage?.required || 0)}. This is input coverage, not legal certainty.`, { size: 7.8 });
            missing.forEach((question) => writer.bullet(`Still needed: ${question}`, [180,35,24]));
            writer.text(`Why this law is included: ${row.whyIncluded}`, { size: 8 });
            writer.link(`Open official source for ${row.shortTitle}`, row.officialUrl);
        });
    }

    function renderIndex(writer, rows) {
        writer.heading("index", "ANNEXURE - QUICK REFERENCE", "Governed Law Index", "The detailed cards provide context. This index gives a compact status, trigger, current position, next step and visible official-source link for every law.");
        rows.sort((a,b) => clean(a.shortTitle).localeCompare(clean(b.shortTitle))).forEach((row) => {
            const body = `Status: ${row.status}\nGeneral trigger: ${clean(row.thresholdResult?.triggerText, row.threshold)}\nCurrent state: ${clean(row.thresholdResult?.positionText, "Not confirmed")} - ${clean(row.thresholdResult?.label)}\nNext step: ${row.requiredAction}`;
            writer.callout(row.shortTitle, body);
            writer.link("Open official source", row.officialUrl);
        });
    }

    function renderDisclaimer(writer) {
        writer.heading("disclaimer", "IMPORTANT INFORMATION", "Confidentiality and Disclaimer", "Please read this section before sharing or acting on the advisory.");
        writer.subheading("Confidentiality notice"); writer.text("This advisory is a confidential leadership working document prepared from information supplied by the user. Share it only with appropriate stakeholders.", { justify: true });
        writer.subheading("Advisory disclaimer"); writer.text("It provides general business and people-management guidance and is not legal, tax, accounting, employment-law or regulatory advice. Verify requirements with qualified professionals and current official sources.", { justify: true });
    }

    function renderEnd(doc, writer, colours, data) {
        writer.heading("end", "HRTECHIFY - GROWWITHHR", "End of Report", "");
        writer.setY(125); writer.text(clean(data.companyName, "Your Organisation"), { size: 14, style: "bold", colour: colours.head, align: "center", x: 105, width: 160 });
        writer.text("Revisit this advisory when workforce, locations or the operating model materially change.", { size: 9, colour: colours.muted, align: "center", x: 105, width: 155 });
    }

    function wipeToSnapshot(doc) { while (doc.getNumberOfPages() > 3) doc.deletePage(doc.getNumberOfPages()); }

    function redrawContents(doc, colours, sectionPages) {
        doc.setPage(2); doc.setFillColor(...colours.page); doc.rect(0,0,210,297,"F"); doc.setDrawColor(...colours.line); doc.rect(5.5,5.5,199,286,"S");
        doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...colours.accent); doc.text("REPORT GUIDE",16,24);
        doc.setFontSize(21); doc.setTextColor(...colours.head); doc.text("Choose Your Reading Mode",16,39);
        doc.setFont("helvetica","normal"); doc.setFontSize(8.4); doc.setTextColor(...colours.muted);
        doc.text("Short on time? Read the Executive Snapshot and 5-Minute Brief. Want the complete picture? Continue to the Deep Dive.",16,50,{maxWidth:178,lineHeightFactor:1.28});
        const items = [["Executive Snapshot","snapshot",3],["5-Minute Brief","brief"],["DEEP DIVE","group"],["Understanding Intelligence Engine","understanding"],["Evidence and Missing Information","evidence"],["SWOT from Your Assessment","swot"],["Compliance Review","compliance"],["Strategic Recommendations","strategic"],["Priority Compliance Actions","priority"],["Upcoming Compliance Triggers","triggers"],["Roadmap - 0 to 90 days","roadmap"],["ANNEXURE","group"],["Law-by-Law Understanding","law"],["Governed Law Index","index"]];
        let y=69; items.forEach(([label,key,fixed],index) => {
            if (key === "group") { doc.setFont("helvetica","bold"); doc.setFontSize(7.4); doc.setTextColor(...colours.accent); doc.text(label,20,y); y+=9; return; }
            const page = fixed || sectionPages[key]; if (!page) return;
            doc.setFillColor(...(index%2?colours.panel:colours.alt)); doc.roundedRect(16,y-6,178,10,1.5,1.5,"F");
            doc.setFont("helvetica","bold"); doc.setFontSize(7.7); doc.setTextColor(...colours.text); doc.text(label, key === "law" || key === "index" ? 27:21,y+0.5);
            doc.setTextColor(...colours.accent); doc.text(String(Math.max(1,page-2)),188,y+0.5,{align:"right"}); y+=11;
        });
        doc.setFont("helvetica","normal"); doc.setFontSize(7.2); doc.setTextColor(...colours.muted);
        doc.text("The confidentiality/disclaimer and End of Report pages are outside the reader-facing advisory page count.",16,275,{maxWidth:178});
    }

    function redrawPagination(doc, colours, disclaimerPage, endPage) {
        const advisoryLast = disclaimerPage - 1;
        const total = Math.max(1, advisoryLast - 2);
        for (let page=3; page<=advisoryLast; page+=1) {
            doc.setPage(page); doc.setFillColor(...colours.page); doc.rect(145,277,52,12,"F");
            doc.setFont("helvetica","normal"); doc.setFontSize(7.4); doc.setTextColor(...colours.muted); doc.text(`Page ${page-2} of ${total}`,190,284,{align:"right"});
        }
        [disclaimerPage,endPage].forEach((page) => { if (page) { doc.setPage(page); doc.setFillColor(...colours.page); doc.rect(140,277,57,12,"F"); } });
    }

    function serialise(variant) {
        const doc = variant?.document; if (!doc?.output) return variant;
        const dataUri = doc.output("datauristring"), buffer = doc.output("arraybuffer");
        Object.assign(variant,{ dataUri, base64:dataUri.includes(",")?dataUri.split(",")[1]:dataUri, sizeBytes:buffer.byteLength, pageCount:doc.getNumberOfPages(), acceptanceReportVersion:VERSION });
        return variant;
    }

    function rebuild(doc, themeName, rows, model, payload) {
        const colours = palette(themeName), data = source(payload, model), sectionPages = {};
        wipeToSnapshot(doc);
        const writer = createWriter(doc,colours,sectionPages), actions = actionMap(rows), swotData = swot(rows,model,data);
        renderBrief(writer,rows,model,data,actions,swotData);
        renderUnderstanding(writer,rows); renderEvidence(writer,rows,data); renderSwot(writer,swotData);
        renderComplianceAndStrategy(writer,rows,model,actions,swotData); renderPriority(writer,rows,actions,swotData);
        renderTriggers(writer,rows,swotData,data); renderRoadmap(writer,rows,model,actions,swotData);
        renderLawAnnexure(writer,rows,actions); renderIndex(writer,rows); renderDisclaimer(writer);
        const disclaimerPage = sectionPages.disclaimer; renderEnd(doc,writer,colours,data); const endPage = sectionPages.end;
        redrawContents(doc,colours,sectionPages); redrawPagination(doc,colours,disclaimerPage,endPage);
    }

    function installReport() {
        const service = window.GrowWithHRPDF;
        if (!service || typeof service.buildAdvisoryPdf !== "function" || service[INSTALL_FLAG] || !service.reportSequenceVersion) return false;
        const originalBuild = service.buildAdvisoryPdf.bind(service);
        const originalModel = typeof service.buildAdvisoryModel === "function" ? service.buildAdvisoryModel.bind(service) : null;
        async function buildAdvisoryPdf(payload={}) {
            const result = await originalBuild(payload), model = originalModel ? originalModel(payload) : (payload.model || result?.model || {}), data = source(payload,model);
            const rawRows = typeof service.buildReportLawTransparency === "function" ? service.buildReportLawTransparency(payload,model) : [];
            const rows = normaliseRows(rawRows,data), variants = Array.isArray(result?.pdfs)?result.pdfs:[result];
            variants.forEach((variant)=>{ if (variant?.document) { rebuild(variant.document,variant.theme||payload.theme||result.theme,rows,model,payload); serialise(variant); } });
            if (Array.isArray(result?.pdfs)) { result.sizeBytes=result.pdfs.reduce((sum,item)=>sum+Number(item.sizeBytes||0),0); result.pageCounts=Object.fromEntries(result.pdfs.map((item)=>[item.theme,item.pageCount])); const first=result.pdfs[0]; if(first) Object.assign(result,{dataUri:first.dataUri,base64:first.base64,pageCount:first.pageCount}); }
            return Object.assign(result,{acceptanceReportVersion:VERSION});
        }
        const enhanced=Object.freeze({...service,[INSTALL_FLAG]:true,acceptanceReportVersion:VERSION,buildAdvisoryPdf});
        window.GrowWithHRPDF=enhanced; window.GrowWithHRPDFPolishReady=Promise.resolve(enhanced); return true;
    }

    function application() { return window.executiveAssessment || window.GrowWithHRExecutiveAssessment || window.assessmentApp || null; }
    function answers(app) { return app?.answers || app?.stateModel?.answers || app?.state?.answers || {}; }
    function setAnswer(app,name,value) { if (typeof app?.stateModel?.setAnswer === "function") app.stateModel.setAnswer(name,value); else answers(app)[name]=value; }
    function workforceGuard(app=application()) {
        if (!app || Number(app.currentMoment ?? app.stateModel?.currentMoment) !== 2) return false;
        const data=answers(app), section=document.querySelector("[data-industry-adaptive]"); if (!section || !isOpc(data)) return false;
        let field=section.querySelector('[data-field-wrapper="workforcePresence"]');
        if (!field) {
            field=document.createElement("fieldset"); field.className="advisory-choice-fieldset industry-adaptive-field"; field.dataset.fieldWrapper="workforcePresence";
            field.innerHTML='<legend>Does anyone other than the owner/director currently work for or with the organisation?</legend><p class="advisory-field-help">This controls whether employee, worker and payroll-eligibility questions are relevant for a One Person Company.</p><div class="advisory-choice-pills"><label class="advisory-choice-pill"><input type="radio" name="workforcePresence" value="owner-only"><span>No - only the owner/director</span></label><label class="advisory-choice-pill"><input type="radio" name="workforcePresence" value="other-people"><span>Yes - other people work with the organisation</span></label><label class="advisory-choice-pill"><input type="radio" name="workforcePresence" value="not-sure"><span>Not sure</span></label></div>';
            section.querySelector(".advisory-field-group")?.prepend(field);
        }
        const current=clean(data.workforcePresence); field.querySelectorAll("input").forEach((input)=>{ input.checked=input.value===current; });
        const ownerOnly=current==="owner-only";
        const dependent=["workerCategories","womenEmployees","esiWageEligibility","bonusWageEligibility","workers","usesPower","shiftPattern","nightShifts","womenNightShifts"];
        dependent.forEach((name)=>{ const wrapper=section.querySelector(`[data-field-wrapper="${name}"]`); if(!wrapper)return; wrapper.hidden=ownerOnly; wrapper.querySelectorAll("input").forEach((input)=>{input.disabled=ownerOnly;}); });
        if(ownerOnly){ setAnswer(app,"workerCategories",["owner-only"]); setAnswer(app,"workers","0"); setAnswer(app,"contractors","0"); setAnswer(app,"esiWageEligibility","no"); setAnswer(app,"bonusWageEligibility","no"); }
        return true;
    }

    document.addEventListener("change",(event)=>{
        if(event.target?.name==="workforcePresence") { const app=application(); setAnswer(app,"workforcePresence",event.target.value); app?.saveNow?.(); workforceGuard(app); }
    },true);
    window.addEventListener("growwithhr:assessment-modules-ready",(event)=>queueMicrotask(()=>workforceGuard(event.detail?.application)));
    document.addEventListener("change",()=>queueMicrotask(()=>workforceGuard()),true);

    let attempts=0; const timer=window.setInterval(()=>{ attempts+=1; const reportReady=installReport(); workforceGuard(); if(reportReady || attempts>=200) window.clearInterval(timer); },50);
    window.GrowWithHRAcceptanceCorrections=Object.freeze({version:VERSION,installReport,workforceGuard,normaliseRows,officialUrls:OFFICIAL_URLS,stateLabourPortals:STATE_LABOUR_PORTALS});
})();
