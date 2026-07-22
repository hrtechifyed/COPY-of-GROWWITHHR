/* ==========================================================
   GrowWithHR Gmail delivery client
   File: js/gmail-service.js

   Gmail credentials must never be placed in this file.
   This client sends the generated PDF to the Node server.
========================================================== */

(function initialiseGmailService(window) {
    "use strict";

    const DEFAULT_ENDPOINT = "/api/send-advisory";
    const DEFAULT_HEALTH_ENDPOINT = "/api/health";
    const GITHUB_PAGES_ORIGIN = "https://hrtechifyed.github.io";
    const GITHUB_PAGES_PROJECT_PATH = "/GrowwithHR-Version2/";
    const RENDER_ORIGIN = "https://growwithhr.onrender.com";
    const RENDER_ENDPOINT = `${RENDER_ORIGIN}/api/send-advisory`;
    const RENDER_HEALTH_ENDPOINT = `${RENDER_ORIGIN}/api/health`;
    const MAX_PDF_BYTES = 8 * 1024 * 1024;
    const REQUEST_TIMEOUT_MS = 60 * 1000;
    const HEALTH_TIMEOUT_MS = 15 * 1000;

    let activeRequest = null;
    let warmUpRequest = null;
    let lastStatus = null;
    let lastHealthStatus = null;

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

    function getHealthEndpoint() {
        const explicitHealthEndpoint =
            document.body?.dataset?.healthEndpoint ||
            window.GROWWITHHR_HEALTH_ENDPOINT;

        if (cleanText(explicitHealthEndpoint)) {
            return cleanText(explicitHealthEndpoint);
        }

        const emailEndpoint = getEndpoint();
        if (emailEndpoint === RENDER_ENDPOINT) return RENDER_HEALTH_ENDPOINT;
        if (emailEndpoint === DEFAULT_ENDPOINT) return DEFAULT_HEALTH_ENDPOINT;

        try {
            const resolved = new URL(emailEndpoint, window.location.href);
            resolved.pathname = resolved.pathname.replace(
                /\/api\/send-advisory\/?$/,
                "/api/health"
            );
            resolved.search = "";
            resolved.hash = "";
            return resolved.href;
        } catch (_error) {
            return DEFAULT_HEALTH_ENDPOINT;
        }
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
        const padding = source.endsWith("==")
            ? 2
            : source.endsWith("=")
                ? 1
                : 0;
        return Math.max(
            0,
            Math.floor(source.length * 3 / 4) - padding
        );
    }

    function serialisePdf(pdf = {}) {
        const base64 = removeDataUriPrefix(
            pdf.base64 || pdf.dataUri || pdf.data
        );
        const filename = cleanText(
            pdf.filename,
            "GrowWithHR-Advisory.pdf"
        );
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
            window.dispatchEvent(
                new CustomEvent("growwithhr:email-delivery", {
                    detail: lastStatus
                })
            );
        } catch (error) {
            console.warn("Could not dispatch email status event.", error);
        }

        return lastStatus;
    }

    async function readJson(response) {
        try {
            return await response.json();
        } catch (_error) {
            return {};
        }
    }

    async function fetchWithTimeout(
        url,
        options = {},
        timeoutMs = REQUEST_TIMEOUT_MS
    ) {
        const supportsAbort = typeof window.AbortController === "function";
        const controller = supportsAbort ? new window.AbortController() : null;
        const timer = window.setTimeout(() => {
            controller?.abort();
        }, timeoutMs);

        try {
            return await window.fetch(url, {
                ...options,
                signal: controller?.signal || options.signal
            });
        } catch (error) {
            if (error?.name === "AbortError") {
                throw new Error(
                    "The delivery server took too long to respond. Your answers are saved; please try again."
                );
            }
            throw error;
        } finally {
            window.clearTimeout(timer);
        }
    }

    async function warmUp() {
        if (warmUpRequest) return warmUpRequest;

        warmUpRequest = (async () => {
            const response = await fetchWithTimeout(
                getHealthEndpoint(),
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json"
                    },
                    credentials: "omit",
                    cache: "no-store"
                },
                HEALTH_TIMEOUT_MS
            );
            const result = await readJson(response);

            if (!response.ok) {
                throw new Error(
                    result.error ||
                    `Delivery server health check returned status ${response.status}.`
                );
            }

            lastHealthStatus = {
                ok: result.ok !== false,
                gmailConfigured: result.gmailConfigured !== false,
                ...result,
                checkedAt: new Date().toISOString()
            };

            return lastHealthStatus;
        })().finally(() => {
            warmUpRequest = null;
        });

        return warmUpRequest;
    }

    async function postDelivery(action, payload = {}) {
        const lead = { ...(payload.lead || {}) };
        const report = payload.report || {};
        const answers = payload.answers || {};
        const recipient = cleanText(
            lead.email || report.recipientEmail
        ).toLowerCase();

        if (!isValidEmail(recipient)) {
            throw new Error("Please enter a valid recipient email address.");
        }

        lead.email = recipient;
        const pdf = serialisePdf(payload.pdf);

        try {
            const response = await fetchWithTimeout(
                getEndpoint(),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "omit",
                    body: JSON.stringify({
                        action,
                        lead,
                        report,
                        answers,
                        pdf
                    })
                }
            );

            const result = await readJson(response);
            if (!response.ok) {
                throw new Error(
                    result.error ||
                    `Email server returned status ${response.status}.`
                );
            }

            if (
                result.customerSent !== true &&
                result.customerStatus !== "sent"
            ) {
                throw new Error(
                    result.error ||
                    "The email server did not confirm delivery."
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
                error: cleanText(
                    error.message,
                    "Email delivery failed."
                )
            });

            const deliveryError = new Error(failure.error);
            deliveryError.delivery = failure;
            throw deliveryError;
        }
    }

    function sendAdvisory(payload = {}) {
        if (activeRequest) return activeRequest;

        activeRequest = postDelivery(
            payload.action || "capture",
            payload
        ).finally(() => {
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

    function getHealthStatus() {
        return lastHealthStatus;
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
        warmUp,
        sendAdvisory,
        resendCustomer,
        getStatus,
        getHealthStatus,
        clearStatus,
        config: Object.freeze({
            endpoint: getEndpoint(),
            healthEndpoint: getHealthEndpoint(),
            maxAttachmentBytes: MAX_PDF_BYTES,
            requestTimeoutMs: REQUEST_TIMEOUT_MS,
            healthTimeoutMs: HEALTH_TIMEOUT_MS
        })
    });
})(window);
