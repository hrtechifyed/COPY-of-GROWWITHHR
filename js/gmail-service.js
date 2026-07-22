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
    const RENDER_ENDPOINT =
        "https://growwithhr.onrender.com/api/send-advisory";
    const RENDER_HEALTH_ENDPOINT =
        "https://growwithhr.onrender.com/api/health";
    const MAX_PDF_BYTES = 8 * 1024 * 1024;
    const REQUEST_TIMEOUT_MS = 60 * 1000;
    const HEALTH_TIMEOUT_MS = 15 * 1000;
    const MAX_RECIPIENTS = 5;
    const ALL_PRIORITIES_VALUE = "all-of-the-above";
    const ALL_PRIORITY_VALUES = Object.freeze([
        "hiring-onboarding",
        "policies-compliance",
        "performance-rewards",
        "manager-capability",
        "culture-engagement",
        "hr-operations-technology",
        "workforce-planning",
        "organisation-design"
    ]);

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

    function parseRecipientEmails(value) {
        return cleanText(value)
            .split(";")
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)
            .filter((email, index, emails) => emails.indexOf(email) === index);
    }

    function validateRecipientEmails(value) {
        const emails = parseRecipientEmails(value);

        if (!emails.length) {
            return {
                valid: false,
                emails,
                message: "Enter at least one work email address."
            };
        }

        if (emails.length > MAX_RECIPIENTS) {
            return {
                valid: false,
                emails,
                message: `Enter no more than ${MAX_RECIPIENTS} email addresses, separated by semicolons.`
            };
        }

        const invalid = emails.find((email) => !isValidEmail(email));
        if (invalid) {
            return {
                valid: false,
                emails,
                message: `Enter a valid email address. “${invalid}” is not valid.`
            };
        }

        return {
            valid: true,
            emails,
            normalized: emails.join("; "),
            message: ""
        };
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

    async function postToRecipients(action, payload = {}) {
        const validation = validateRecipientEmails(
            payload.lead?.email || payload.report?.recipientEmail
        );

        if (!validation.valid) {
            throw new Error(validation.message);
        }

        const deliveries = [];
        for (const email of validation.emails) {
            deliveries.push(await postDelivery(action, {
                ...payload,
                lead: {
                    ...(payload.lead || {}),
                    email
                },
                report: {
                    ...(payload.report || {}),
                    recipientEmail: email,
                    recipientEmails: validation.emails
                }
            }));
        }

        return saveStatus({
            ...(deliveries[deliveries.length - 1] || {}),
            ok: true,
            action,
            recipientCount: validation.emails.length,
            recipients: validation.emails,
            customerSent: true,
            customerStatus: "sent"
        });
    }

    function sendAdvisory(payload = {}) {
        if (activeRequest) return activeRequest;

        activeRequest = postToRecipients(
            payload.action || "capture",
            payload
        ).finally(() => {
            activeRequest = null;
        });
        return activeRequest;
    }

    function resendCustomer(payload = {}) {
        return postToRecipients("resend-customer", payload);
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
        parseRecipientEmails,
        validateRecipientEmails,
        config: Object.freeze({
            endpoint: getEndpoint(),
            healthEndpoint: getHealthEndpoint(),
            maxAttachmentBytes: MAX_PDF_BYTES,
            requestTimeoutMs: REQUEST_TIMEOUT_MS,
            healthTimeoutMs: HEALTH_TIMEOUT_MS,
            maxRecipients: MAX_RECIPIENTS
        })
    });

    function addAllPrioritiesOption(markup) {
        const source = String(markup || "");
        if (
            !source.includes('data-field-wrapper="priorities"') ||
            source.includes(`value="${ALL_PRIORITIES_VALUE}"`)
        ) {
            return source;
        }

        const checked = source.includes(
            `value="${ALL_PRIORITIES_VALUE}" checked`
        ) ? "checked" : "";
        const option = `
            <label class="advisory-checkbox-card advisory-checkbox-card--all">
                <input type="checkbox" name="priorities" value="${ALL_PRIORITIES_VALUE}" ${checked}>
                <span class="advisory-checkbox-card__surface">
                    <strong>All of the above</strong>
                </span>
            </label>`;

        return source.replace(
            /(<p\s+id="prioritiesError")/,
            `${option}$1`
        ).replace(
            "Choose up to three priorities.",
            "Choose up to three priorities, or select All of the above."
        );
    }

    function expandAllPriorities(value) {
        if (!Array.isArray(value)) return value;
        return value.includes(ALL_PRIORITIES_VALUE)
            ? [...ALL_PRIORITY_VALUES]
            : [...value];
    }

    function addTemplateSampleData(value, industry) {
        const sampleData = [
            { id: "EMP-001", role: "Operations Associate", location: "Bengaluru", status: "Active", note: `${industry || "Industry"} sample record` },
            { id: "EMP-002", role: "Customer Success Lead", location: "Mumbai", status: "Active", note: `${industry || "Industry"} sample record` },
            { id: "EMP-003", role: "Finance Analyst", location: "Delhi", status: "Planned", note: `${industry || "Industry"} sample record` },
            { id: "EMP-004", role: "People Operations Partner", location: "Hyderabad", status: "Active", note: `${industry || "Industry"} sample record` },
            { id: "EMP-005", role: "Technology Specialist", location: "Pune", status: "Planned", note: `${industry || "Industry"} sample record` }
        ];

        const report = value && typeof value === "object"
            ? { ...value }
            : value;

        if (!report || typeof report !== "object") return report;

        if (Array.isArray(report.recommendations)) {
            report.recommendations = report.recommendations.map((item) => ({
                ...item,
                templateSampleData: Array.isArray(item?.templateSampleData) && item.templateSampleData.length >= 5
                    ? item.templateSampleData
                    : sampleData.map((record) => ({ ...record }))
            }));
        }

        report.templateSampleData = Array.isArray(report.templateSampleData) && report.templateSampleData.length >= 5
            ? report.templateSampleData
            : sampleData;

        return report;
    }

    function wrapModule(moduleName, wrapper) {
        const modules = window.GrowWithHRModules = window.GrowWithHRModules || {};
        let stored = modules[moduleName];

        Object.defineProperty(modules, moduleName, {
            configurable: true,
            enumerable: true,
            get() {
                return stored;
            },
            set(value) {
                stored = wrapper(value);
            }
        });

        if (stored) stored = wrapper(stored);
    }

    wrapModule("AssessmentScreens", (original) => {
        if (!original || original.__requestedChangesWrapped) return original;
        const wrapped = {
            ...original,
            renderPeopleReadiness(context) {
                return addAllPrioritiesOption(
                    original.renderPeopleReadiness(context)
                );
            },
            renderMoment(identifier, context) {
                return addAllPrioritiesOption(
                    original.renderMoment(identifier, context)
                );
            },
            __requestedChangesWrapped: true
        };
        return Object.freeze(wrapped);
    });

    wrapModule("AssessmentValidation", (original) => {
        if (!original || original.__requestedChangesWrapped) return original;
        const wrapped = {
            ...original,
            validateLead(lead) {
                const normalizedLead = {
                    ...(lead || {}),
                    name: cleanText(lead?.name),
                    email: cleanText(lead?.email),
                    role: cleanText(lead?.role),
                    marketingConsent: Boolean(lead?.marketingConsent)
                };
                const result = {
                    valid: true,
                    errors: {},
                    firstInvalidField: "",
                    normalizedLead
                };

                if (!normalizedLead.name) {
                    result.valid = false;
                    result.errors.name = "Enter your name to continue.";
                    result.firstInvalidField = "name";
                }

                const emailValidation = validateRecipientEmails(normalizedLead.email);
                if (!emailValidation.valid) {
                    result.valid = false;
                    result.errors.email = emailValidation.message;
                    result.firstInvalidField = result.firstInvalidField || "email";
                } else {
                    normalizedLead.email = emailValidation.normalized;
                    normalizedLead.emails = emailValidation.emails;
                }

                return result;
            },
            __requestedChangesWrapped: true
        };
        return Object.freeze(wrapped);
    });

    wrapModule("ReportMapper", (original) => {
        if (!original || original.__requestedChangesWrapped) return original;
        const preparePayload = (payload = {}) => ({
            ...payload,
            answers: {
                ...(payload.answers || {}),
                priorities: expandAllPriorities(payload.answers?.priorities)
            }
        });
        const wrapResult = (result, payload) => addTemplateSampleData(
            result,
            payload?.answers?.industry || payload?.report?.industry
        );
        const wrapped = { ...original, __requestedChangesWrapped: true };

        ["buildReportData", "buildRecords", "buildLeadRecord"].forEach((method) => {
            if (typeof original[method] !== "function") return;
            wrapped[method] = function requestedChangesMapper(payload) {
                const prepared = preparePayload(payload);
                const result = original[method](prepared);
                if (method === "buildRecords" && result && typeof result === "object") {
                    return {
                        ...result,
                        report: wrapResult(result.report, prepared)
                    };
                }
                return method === "buildReportData"
                    ? wrapResult(result, prepared)
                    : result;
            };
        });

        return Object.freeze(wrapped);
    });

    document.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.name !== "priorities") return;

        const controls = Array.from(
            document.querySelectorAll('input[name="priorities"]')
        );
        const allControl = controls.find(
            (control) => control.value === ALL_PRIORITIES_VALUE
        );

        if (target.value === ALL_PRIORITIES_VALUE && target.checked) {
            controls.forEach((control) => {
                if (control !== target) control.checked = false;
            });
        } else if (target.checked && allControl) {
            allControl.checked = false;
        }
    }, true);

    document.addEventListener("DOMContentLoaded", () => {
        const emailInput = document.getElementById("leadEmail");
        const emailLabel = document.querySelector('label[for="leadEmail"]');
        const emailHelp = document.getElementById("leadEmailHelp");

        if (emailInput) {
            emailInput.type = "text";
            emailInput.inputMode = "email";
            emailInput.autocomplete = "email";
            emailInput.placeholder = "name@company.com; colleague@company.com";
        }
        if (emailLabel) {
            emailLabel.childNodes[0].textContent = "Work email address(es) ";
        }
        if (emailHelp) {
            emailHelp.textContent = "Enter up to five email addresses separated by semicolons (;). Each address will receive the advisory.";
        }
    });
})(window);