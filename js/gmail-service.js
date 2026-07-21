/* ==========================================================
   GrowWithHR Gmail delivery client
   File: js/gmail-service.js

   Gmail credentials must never be placed in this file.
   This client sends the generated PDF to the Node server.
========================================================== */

(function initialiseGmailService(window) {
    "use strict";

    const DEFAULT_ENDPOINT = "/api/send-advisory";
    const GITHUB_PAGES_ORIGIN = "https://hrtechifyed.github.io";
    const GITHUB_PAGES_PROJECT_PATH = "/GrowwithHR-Version2/";
    const RENDER_ENDPOINT = "https://growwithhr.onrender.com/api/send-advisory";
    const MAX_PDF_BYTES = 8 * 1024 * 1024;

    let activeRequest = null;
    let lastStatus = null;

    function cleanText(value, fallback = "") {
        if (value === null || value === undefined) return fallback;
        return String(value).trim() || fallback;
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText(value));
    }

    function isGitHubPagesDeployment() {
        const location = window.location;
        if (!location || location.origin !== GITHUB_PAGES_ORIGIN) return false;
        return location.pathname === "/GrowwithHR-Version2" ||
            location.pathname.startsWith(GITHUB_PAGES_PROJECT_PATH);
    }

    function getEndpoint() {
        const explicitEndpoint =
            document.body?.dataset?.emailEndpoint ||
            window.GROWWITHHR_EMAIL_ENDPOINT;

        if (cleanText(explicitEndpoint)) return cleanText(explicitEndpoint);
        return isGitHubPagesDeployment() ? RENDER_ENDPOINT : DEFAULT_ENDPOINT;
    }

    function removeDataUriPrefix(value) {
        const source = cleanText(value);
        if (!source) return "";

        const commaIndex = source.indexOf(",");
        if (source.startsWith("data:") && commaIndex >= 0) {
            return source.slice(commaIndex + 1);
        }
        return source;
    }

    function estimateBase64Size(base64) {
        const source = cleanText(base64).replace(/\s/g, "");
        if (!source) return 0;

        const padding = source.endsWith("==") ? 2 : source.endsWith("=") ? 1 : 0;
        return Math.max(0, Math.floor(source.length * 3 / 4) - padding);
    }

    function serialisePdf(pdf = {}) {
        const base64 = removeDataUriPrefix(pdf.base64 || pdf.dataUri || pdf.data);
        const filename = cleanText(pdf.filename, "GrowWithHR-Advisory.pdf");
        const sizeBytes = Number(pdf.sizeBytes) || estimateBase64Size(base64);

        if (!base64) throw new Error("The advisory PDF was not generated.");
        if (!sizeBytes) throw new Error("The advisory PDF is empty.");
        if (sizeBytes > MAX_PDF_BYTES) {
            throw new Error("The advisory PDF is too large to email.");
        }

        return { base64, filename, sizeBytes };
    }

    function saveStatus(status) {
        lastStatus = {
            ...status,
            updatedAt: new Date().toISOString()
        };

        try {
            window.dispatchEvent(new CustomEvent("growwithhr:email-delivery", {
                detail: lastStatus
            }));
        } catch (error) {
            console.warn("Could not dispatch email status event.", error);
        }

        return lastStatus;
    }

    async function readJson(response) {
        try {
            return await response.json();
        } catch (error) {
            return {};
        }
    }

    async function postDelivery(action, payload = {}) {
        const lead = { ...(payload.lead || {}) };
        const report = payload.report || {};
        const answers = payload.answers || {};
        const recipient = cleanText(lead.email || report.recipientEmail).toLowerCase();

        if (!isValidEmail(recipient)) {
            throw new Error("Please enter a valid recipient email address.");
        }

        lead.email = recipient;
        const pdf = serialisePdf(payload.pdf);

        try {
            const response = await window.fetch(getEndpoint(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "omit",
                body: JSON.stringify({ action, lead, report, answers, pdf })
            });

            const result = await readJson(response);
            if (!response.ok) {
                throw new Error(
                    result.error || `Email server returned status ${response.status}.`
                );
            }

            return saveStatus({
                ok: true,
                mode: "gmail",
                action,
                ...result
            });
        } catch (error) {
            const failure = saveStatus({
                ok: false,
                mode: "gmail",
                action,
                customerStatus: "failed",
                customerSent: false,
                error: cleanText(error.message, "Email delivery failed.")
            });

            const deliveryError = new Error(failure.error);
            deliveryError.delivery = failure;
            throw deliveryError;
        }
    }

    function sendAdvisory(payload = {}) {
        if (activeRequest) return activeRequest;

        activeRequest = postDelivery(payload.action || "capture", payload)
            .finally(() => {
                activeRequest = null;
            });
        return activeRequest;
    }

    function resendCustomer(payload = {}) {
        return postDelivery("resend-customer", payload);
    }

    function getStatus() {
        return lastStatus;
    }

    function clearStatus() {
        lastStatus = null;
    }

    function initialise() {
        return true;
    }

    function isAvailable() {
        return Boolean(window.fetch && getEndpoint());
    }

    window.GrowWithHREmail = Object.freeze({
        initialise,
        isAvailable,
        sendAdvisory,
        resendCustomer,
        getStatus,
        clearStatus,
        config: Object.freeze({
            endpoint: getEndpoint(),
            maxAttachmentBytes: MAX_PDF_BYTES
        })
    });
})(window);
