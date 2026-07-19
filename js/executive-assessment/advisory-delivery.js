/* ==========================================================
   GrowWithHR
   Executive Advisory Delivery Orchestrator

   Responsibility:
   - Prepare the advisory PDF through GrowWithHRPDF
   - Send the advisory through GrowWithHREmail
   - Preserve the existing lead-endpoint fallback
   - Resend a customer copy
   - Coordinate PDF downloads
   - Return progress and delivery results to the facade

   This module must not:
   - access or modify assessment-screen DOM elements;
   - change assessment navigation;
   - write report, lead or delivery records to localStorage;
   - display alerts or validation errors;
   - own the assessment's mutable state.

   UI updates and persistence remain responsibilities of the
   compatibility facade and AssessmentStorage module.
========================================================== */

(() => {
    "use strict";

    const modules =
        window.GrowWithHRModules =
        window.GrowWithHRModules || {};

    const DEFAULT_ACTION =
        "capture";

    const RESEND_ACTION =
        "resend-customer";

    const DEFAULT_PROGRESS_STAGES = Object.freeze([
        Object.freeze({
            index: 0,
            id: "organise-context",
            message: "Organising your context…"
        }),
        Object.freeze({
            index: 1,
            id: "build-document",
            message: "Building your advisory document…"
        }),
        Object.freeze({
            index: 2,
            id: "send-advisory",
            message: "Sending your advisory…"
        })
    ]);

    function asObject(value) {
        return (
            value &&
            typeof value === "object" &&
            !Array.isArray(value)
        )
            ? value
            : {};
    }

    function asArray(value) {
        return Array.isArray(value)
            ? [...value]
            : [];
    }

    function cleanText(
        value,
        fallback = ""
    ) {
        if (
            value === null ||
            value === undefined
        ) {
            return fallback;
        }

        return String(value).trim() ||
            fallback;
    }

    function cloneAnswers(value) {
        const answers = {
            ...asObject(value)
        };

        if (
            Object.prototype.hasOwnProperty.call(
                answers,
                "expansionPlans"
            )
        ) {
            answers.expansionPlans =
                asArray(
                    answers.expansionPlans
                );
        }

        if (
            Object.prototype.hasOwnProperty.call(
                answers,
                "priorities"
            )
        ) {
            answers.priorities =
                asArray(
                    answers.priorities
                );
        }

        return answers;
    }

    function normaliseAction(value) {
        const action =
            cleanText(
                value,
                DEFAULT_ACTION
            );

        return action ||
            DEFAULT_ACTION;
    }

    function getPdfService(
        suppliedService
    ) {
        return (
            suppliedService ||
            window.GrowWithHRPDF ||
            null
        );
    }

    function getEmailService(
        suppliedService
    ) {
        return (
            suppliedService ||
            window.GrowWithHREmail ||
            null
        );
    }

    function getReportMapper(
        suppliedMapper
    ) {
        return (
            suppliedMapper ||
            modules.ReportMapper ||
            null
        );
    }

    function getLeadEndpoint(
        suppliedEndpoint
    ) {
        return cleanText(
            suppliedEndpoint ||
            document.body?.dataset
                ?.leadEndpoint ||
            window
                .GROWWITHHR_LEAD_ENDPOINT
        );
    }

    function getFetch(
        suppliedFetch
    ) {
        if (
            typeof suppliedFetch ===
            "function"
        ) {
            return suppliedFetch;
        }

        if (
            typeof window.fetch ===
            "function"
        ) {
            return window.fetch.bind(
                window
            );
        }

        return null;
    }

    async function readJson(response) {
        try {
            return await response.json();
        } catch (error) {
            return {};
        }
    }

    function customerWasSent(delivery) {
        const record =
            asObject(delivery);

        return (
            record.customerStatus ===
                "sent" ||
            record.customerSent ===
                true
        );
    }

    function normaliseDeliveryResult(
        result,
        defaults = {}
    ) {
        const source =
            asObject(result);

        const fallback =
            asObject(defaults);

        const ok =
            source.ok !== undefined
                ? Boolean(source.ok)
                : fallback.ok !== undefined
                    ? Boolean(fallback.ok)
                    : true;

        return {
            ...fallback,
            ...source,
            ok,
            action:
                normaliseAction(
                    source.action ||
                    fallback.action
                ),
            mode:
                cleanText(
                    source.mode ||
                    fallback.mode,
                    "unknown"
                ),
            customerSent:
                customerWasSent({
                    ...fallback,
                    ...source
                }),
            updatedAt:
                cleanText(
                    source.updatedAt ||
                    fallback.updatedAt
                ) ||
                new Date()
                    .toISOString()
        };
    }

    function createDeliveryError(
        error,
        context = {}
    ) {
        const original =
            error instanceof Error
                ? error
                : new Error(
                    cleanText(
                        error,
                        "Advisory delivery failed."
                    )
                );

        const wrapped =
            new Error(
                cleanText(
                    original.message,
                    "Advisory delivery failed."
                )
            );

        wrapped.name =
            "GrowWithHRDeliveryError";

        wrapped.cause =
            original;

        wrapped.stage =
            cleanText(
                context.stage
            );

        wrapped.action =
            normaliseAction(
                context.action
            );

        wrapped.delivery =
            original.delivery ||
            context.delivery ||
            null;

        return wrapped;
    }

    async function notify(
        callback,
        payload
    ) {
        if (
            typeof callback !==
            "function"
        ) {
            return;
        }

        try {
            await callback(payload);
        } catch (error) {
            console.warn(
                "GrowWithHR: a delivery lifecycle callback failed.",
                error
            );
        }
    }

    function allowInterfacePaint() {
        return new Promise((resolve) => {
            if (
                typeof window
                    .requestAnimationFrame ===
                    "function"
            ) {
                window.requestAnimationFrame(
                    () => {
                        window.setTimeout(
                            resolve,
                            20
                        );
                    }
                );

                return;
            }

            window.setTimeout(
                resolve,
                20
            );
        });
    }

    function resolveRecords(
        payload,
        mapper
    ) {
        const source =
            asObject(payload);

        let report = {
            ...asObject(
                source.report ||
                source.reportData ||
                source.advisory
            )
        };

        let lead = {
            ...asObject(
                source.lead ||
                source.leadRecord
            )
        };

        const answers =
            cloneAnswers(
                source.answers
            );

        const reportMapper =
            getReportMapper(
                mapper
            );

        if (
            (!Object.keys(report).length ||
                !Object.keys(lead).length) &&
            reportMapper &&
            typeof reportMapper
                .buildRecords ===
                "function"
        ) {
            const records =
                reportMapper
                    .buildRecords({
                        ...source,
                        answers,
                        report,
                        lead
                    });

            if (
                !Object.keys(report).length
            ) {
                report = {
                    ...asObject(
                        records?.report
                    )
                };
            }

            if (
                !Object.keys(lead).length
            ) {
                lead = {
                    ...asObject(
                        records?.lead
                    )
                };
            }
        }

        if (
            !Object.keys(report).length &&
            reportMapper &&
            typeof reportMapper
                .buildReportData ===
                "function"
        ) {
            report = {
                ...asObject(
                    reportMapper
                        .buildReportData({
                            ...source,
                            answers,
                            lead
                        })
                )
            };
        }

        if (
            !Object.keys(lead).length &&
            reportMapper &&
            typeof reportMapper
                .buildLeadRecord ===
                "function"
        ) {
            lead = {
                ...asObject(
                    reportMapper
                        .buildLeadRecord({
                            ...source,
                            answers
                        })
                )
            };
        }

        return {
            report,
            lead,
            answers
        };
    }

    class AdvisoryDeliveryService {
        constructor(options = {}) {
            this.options = {
                ...asObject(options)
            };

            this.activeOperation =
                null;

            this.lastPdf =
                null;

            this.lastDelivery =
                null;
        }

        getPdfService() {
            return getPdfService(
                this.options.pdfService
            );
        }

        getEmailService() {
            return getEmailService(
                this.options.emailService
            );
        }

        getReportMapper() {
            return getReportMapper(
                this.options.reportMapper
            );
        }

        getLeadEndpoint() {
            return getLeadEndpoint(
                this.options.leadEndpoint
            );
        }

        getFetch() {
            return getFetch(
                this.options.fetch
            );
        }

        resolveRecords(payload) {
            return resolveRecords(
                payload,
                this.getReportMapper()
            );
        }

        async preparePdf(payload = {}) {
            const source =
                asObject(payload);

            const existingPdf =
                source.pdf ||
                source.pdfDocument ||
                source.document ||
                null;

            if (existingPdf) {
                this.lastPdf =
                    existingPdf;

                return existingPdf;
            }

            const pdfService =
                this.getPdfService();

            if (
                !pdfService ||
                typeof pdfService
                    .buildAdvisoryPdf !==
                    "function"
            ) {
                return null;
            }

            const records =
                this.resolveRecords(
                    source
                );

            try {
                const result =
                    await pdfService
                        .buildAdvisoryPdf({
                            report:
                                records.report,
                            lead:
                                records.lead,
                            answers:
                                records.answers
                        });

                this.lastPdf =
                    result;

                return result;
            } catch (error) {
                throw createDeliveryError(
                    error,
                    {
                        stage:
                            "build-document",
                        action:
                            source.action
                    }
                );
            }
        }

        async submitLeadToEndpoint(
            action,
            payload = {}
        ) {
            const endpoint =
                this.getLeadEndpoint();

            if (!endpoint) {
                return normaliseDeliveryResult(
                    {
                        ok: true,
                        mode:
                            "local-integration-hook",
                        action,
                        customerStatus:
                            "not-configured",
                        customerSent:
                            false,
                        internalStatus:
                            "not-configured"
                    }
                );
            }

            const fetchImplementation =
                this.getFetch();

            if (!fetchImplementation) {
                throw createDeliveryError(
                    "Fetch is not available for the configured lead endpoint.",
                    {
                        stage:
                            "send-advisory",
                        action
                    }
                );
            }

            const records =
                this.resolveRecords(
                    payload
                );

            let response;

            try {
                response =
                    await fetchImplementation(
                        endpoint,
                        {
                            method:
                                "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify({
                                    action,
                                    lead:
                                        records.lead,
                                    advisory:
                                        records.report
                                }),
                            credentials:
                                "same-origin"
                        }
                    );
            } catch (error) {
                throw createDeliveryError(
                    error,
                    {
                        stage:
                            "send-advisory",
                        action
                    }
                );
            }

            const result =
                await readJson(
                    response
                );

            if (!response.ok) {
                throw createDeliveryError(
                    result.error ||
                    `Lead endpoint returned ${response.status}.`,
                    {
                        stage:
                            "send-advisory",
                        action,
                        delivery:
                            result
                    }
                );
            }

            return normaliseDeliveryResult(
                result,
                {
                    ok: true,
                    mode: "endpoint",
                    action
                }
            );
        }

        async send(payload = {}) {
            const source =
                asObject(payload);

            const action =
                normaliseAction(
                    source.action
                );

            const records =
                this.resolveRecords(
                    source
                );

            const pdf =
                source.pdf ||
                source.pdfDocument ||
                source.document ||
                this.lastPdf ||
                null;

            const emailService =
                this.getEmailService();

            try {
                if (
                    action ===
                        RESEND_ACTION &&
                    emailService &&
                    typeof emailService
                        .resendCustomer ===
                        "function"
                ) {
                    const result =
                        await emailService
                            .resendCustomer({
                                lead:
                                    records.lead,
                                report:
                                    records.report,
                                answers:
                                    records.answers,
                                pdf
                            });

                    this.lastDelivery =
                        normaliseDeliveryResult(
                            result,
                            {
                                action,
                                mode:
                                    "gmail"
                            }
                        );

                    return this
                        .lastDelivery;
                }

                if (
                    emailService &&
                    typeof emailService
                        .sendAdvisory ===
                        "function"
                ) {
                    const result =
                        await emailService
                            .sendAdvisory({
                                action,
                                lead:
                                    records.lead,
                                report:
                                    records.report,
                                answers:
                                    records.answers,
                                pdf
                            });

                    this.lastDelivery =
                        normaliseDeliveryResult(
                            result,
                            {
                                action,
                                mode:
                                    "gmail"
                            }
                        );

                    return this
                        .lastDelivery;
                }

                this.lastDelivery =
                    await this
                        .submitLeadToEndpoint(
                            action,
                            records
                        );

                return this
                    .lastDelivery;
            } catch (error) {
                throw createDeliveryError(
                    error,
                    {
                        stage:
                            "send-advisory",
                        action,
                        delivery:
                            error?.delivery
                    }
                );
            }
        }

        async prepareAndSend(
            payload = {}
        ) {
            if (this.activeOperation) {
                return this
                    .activeOperation;
            }

            const source =
                asObject(payload);

            const action =
                normaliseAction(
                    source.action
                );

            const onProgress =
                source.onProgress ||
                this.options.onProgress;

            const onComplete =
                source.onComplete ||
                this.options.onComplete;

            const onError =
                source.onError ||
                this.options.onError;

            this.activeOperation =
                (async () => {
                    let currentStage =
                        DEFAULT_PROGRESS_STAGES[0];

                    try {
                        const records =
                            this.resolveRecords(
                                source
                            );

                        await notify(
                            onProgress,
                            {
                                ...currentStage,
                                action,
                                records
                            }
                        );

                        if (
                            source.allowPaint !==
                            false
                        ) {
                            await allowInterfacePaint();
                        }

                        currentStage =
                            DEFAULT_PROGRESS_STAGES[1];

                        await notify(
                            onProgress,
                            {
                                ...currentStage,
                                action,
                                records
                            }
                        );

                        const pdf =
                            await this.preparePdf({
                                ...source,
                                ...records,
                                action
                            });

                        currentStage =
                            DEFAULT_PROGRESS_STAGES[2];

                        await notify(
                            onProgress,
                            {
                                ...currentStage,
                                action,
                                records,
                                pdf
                            }
                        );

                        const delivery =
                            await this.send({
                                ...source,
                                ...records,
                                action,
                                pdf
                            });

                        const result = {
                            ok:
                                delivery.ok !==
                                false,
                            action,
                            records,
                            report:
                                records.report,
                            lead:
                                records.lead,
                            answers:
                                records.answers,
                            pdf,
                            delivery,
                            customerSent:
                                customerWasSent(
                                    delivery
                                )
                        };

                        await notify(
                            onComplete,
                            result
                        );

                        return result;
                    } catch (error) {
                        const failure =
                            createDeliveryError(
                                error,
                                {
                                    stage:
                                        currentStage.id,
                                    action,
                                    delivery:
                                        error?.delivery
                                }
                            );

                        await notify(
                            onError,
                            {
                                error:
                                    failure,
                                action,
                                stage:
                                    currentStage
                            }
                        );

                        throw failure;
                    }
                })()
                    .finally(() => {
                        this.activeOperation =
                            null;
                    });

            return this
                .activeOperation;
        }

        async resendCustomer(
            payload = {}
        ) {
            const source =
                asObject(payload);

            const records =
                this.resolveRecords(
                    source
                );

            const pdf =
                source.pdf ||
                source.pdfDocument ||
                source.document ||
                this.lastPdf ||
                await this.preparePdf({
                    ...source,
                    ...records,
                    action:
                        RESEND_ACTION
                });

            const delivery =
                await this.send({
                    ...source,
                    ...records,
                    action:
                        RESEND_ACTION,
                    pdf
                });

            this.lastPdf =
                pdf;

            this.lastDelivery =
                delivery;

            return {
                ok:
                    delivery.ok !==
                    false,
                action:
                    RESEND_ACTION,
                report:
                    records.report,
                lead:
                    records.lead,
                answers:
                    records.answers,
                pdf,
                delivery,
                customerSent:
                    customerWasSent(
                        delivery
                    )
            };
        }

        async download(payload = {}) {
            const source =
                asObject(payload);

            const records =
                this.resolveRecords(
                    source
                );

            const pdf =
                source.pdf ||
                source.pdfDocument ||
                source.document ||
                this.lastPdf ||
                await this.preparePdf({
                    ...source,
                    ...records
                });

            const pdfService =
                this.getPdfService();

            if (
                pdfService &&
                typeof pdfService
                    .downloadAdvisoryPdf ===
                    "function"
            ) {
                const result =
                    await pdfService
                        .downloadAdvisoryPdf({
                            document:
                                pdf,
                            report:
                                records.report,
                            lead:
                                records.lead,
                            answers:
                                records.answers,
                            filename:
                                source.filename
                        });

                this.lastPdf =
                    result ||
                    pdf;

                return {
                    ok: true,
                    mode: "download",
                    pdf:
                        this.lastPdf,
                    report:
                        records.report,
                    lead:
                        records.lead,
                    answers:
                        records.answers
                };
            }

            return {
                ok: false,
                mode:
                    "print-fallback",
                reason:
                    "pdf-service-unavailable",
                reportUrl:
                    cleanText(
                        source.reportUrl
                    ),
                pdf,
                report:
                    records.report,
                lead:
                    records.lead,
                answers:
                    records.answers
            };
        }

        getStatus() {
            return {
                busy:
                    Boolean(
                        this.activeOperation
                    ),
                hasPdf:
                    Boolean(
                        this.lastPdf
                    ),
                lastDelivery:
                    this.lastDelivery
                        ? {
                            ...this
                                .lastDelivery
                        }
                        : null
            };
        }

        clearRuntimeState() {
            this.lastPdf =
                null;

            this.lastDelivery =
                null;
        }
    }

    function create(options = {}) {
        return new AdvisoryDeliveryService(
            options
        );
    }

    let defaultService = null;

    function getDefaultService() {
        if (!defaultService) {
            defaultService =
                create();
        }

        return defaultService;
    }

    function preparePdf(payload = {}) {
        return getDefaultService()
            .preparePdf(payload);
    }

    function send(payload = {}) {
        return getDefaultService()
            .send(payload);
    }

    function prepareAndSend(
        payload = {}
    ) {
        return getDefaultService()
            .prepareAndSend(payload);
    }

    function resendCustomer(
        payload = {}
    ) {
        return getDefaultService()
            .resendCustomer(payload);
    }

    function download(payload = {}) {
        return getDefaultService()
            .download(payload);
    }

    const AdvisoryDelivery = {
        moduleVersion: "1.0.0",

        DEFAULT_ACTION,
        RESEND_ACTION,
        DEFAULT_PROGRESS_STAGES,

        create,
        preparePdf,
        send,
        prepareAndSend,
        resendCustomer,
        download,

        resolveRecords,
        normaliseDeliveryResult,
        customerWasSent,
        allowInterfacePaint,

        AdvisoryDeliveryService
    };

    modules.AdvisoryDelivery =
        Object.freeze(
            AdvisoryDelivery
        );
})();
