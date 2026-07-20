/**
 * GrowWithHR Compliance DNA
 * M1 Truthful Analysis Sequence
 *
 * Every visible stage must execute a real callback.
 * A stage is marked complete only after its callback succeeds.
 *
 * Reduced-motion mode removes presentation delays but does
 * not skip validation, adaptation or report preparation.
 */

export const ANALYSIS_STAGE_DEFINITIONS =
    Object.freeze([
        Object.freeze({
            id: "validate",
            label:
                "Checking the captured facts",
            description:
                "Confirm that the organisation story contains usable assessment data."
        }),

        Object.freeze({
            id: "adapt",
            label:
                "Preparing the compatible assessment state",
            description:
                "Translate the Five-Act state into the existing GrowWithHR assessment contract."
        }),

        Object.freeze({
            id: "report",
            label:
                "Building the existing advisory record",
            description:
                "Use the current report mapper without changing recommendation decisions."
        }),

        Object.freeze({
            id: "handoff",
            label:
                "Confirming the advisory handoff",
            description:
                "Confirm that the report, PDF and delivery paths can receive the prepared record."
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

function now() {
    if (
        typeof performance !==
            "undefined" &&
        typeof performance.now ===
            "function"
    ) {
        return performance.now();
    }

    return Date.now();
}

function createAbortError() {
    const error =
        new Error(
            "GrowWithHR analysis sequence was cancelled."
        );

    error.name =
        "AbortError";

    return error;
}

function throwIfAborted(signal) {
    if (signal?.aborted) {
        throw createAbortError();
    }
}

function wait(
    milliseconds,
    signal
) {
    const duration =
        Math.max(
            0,
            Number(milliseconds) || 0
        );

    if (duration === 0) {
        throwIfAborted(signal);

        return Promise.resolve();
    }

    return new Promise(
        (resolve, reject) => {
            throwIfAborted(signal);

            const timer =
                window.setTimeout(
                    finish,
                    duration
                );

            function cleanup() {
                signal?.removeEventListener(
                    "abort",
                    cancel
                );
            }

            function finish() {
                cleanup();
                resolve();
            }

            function cancel() {
                window.clearTimeout(
                    timer
                );

                cleanup();

                reject(
                    createAbortError()
                );
            }

            signal?.addEventListener(
                "abort",
                cancel,
                {
                    once: true
                }
            );
        }
    );
}

function detectReducedMotion(
    runtime = globalThis
) {
    try {
        return Boolean(
            runtime
                ?.matchMedia?.(
                    "(prefers-reduced-motion: reduce)"
                )
                .matches
        );
    } catch (error) {
        return false;
    }
}

function requireHandler(
    handlers,
    stage
) {
    const handler =
        handlers[
            stage.id
        ];

    if (
        typeof handler !==
        "function"
    ) {
        throw new Error(
            `GrowWithHR analysis stage "${stage.id}" requires a real callback.`
        );
    }

    return handler;
}

function normalizeHandlerResult(
    value
) {
    const result =
        asObject(value);

    const hasStructuredResult =
        Object.prototype
            .hasOwnProperty.call(
                result,
                "output"
            ) ||
        Object.prototype
            .hasOwnProperty.call(
                result,
                "contextPatch"
            );

    if (!hasStructuredResult) {
        return {
            output:
                value,

            contextPatch:
                {}
        };
    }

    return {
        output:
            result.output,

        contextPatch:
            asObject(
                result.contextPatch
            )
    };
}

function notify(
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
        callback(payload);
    } catch (error) {
        console.error(
            "GrowWithHR analysis notification failed.",
            error
        );
    }
}

function createStageSnapshot(
    stage,
    status,
    extra = {}
) {
    return Object.freeze({
        id:
            stage.id,

        label:
            stage.label,

        description:
            stage.description,

        status,

        ...extra
    });
}

/**
 * Creates a truthful processing sequence.
 *
 * Required handlers:
 *
 * {
 *   validate(payload) {},
 *   adapt(payload) {},
 *   report(payload) {},
 *   handoff(payload) {}
 * }
 *
 * A handler may return any value:
 *
 * return report;
 *
 * Or it may return:
 *
 * return {
 *   output: report,
 *   contextPatch: {
 *     report
 *   }
 * };
 */
export function createAnalysisSequence(
    options = {}
) {
    const stages =
        Array.isArray(
            options.stages
        ) &&
        options.stages.length
            ? options.stages.map(
                (stage) => {
                    return Object.freeze({
                        ...stage
                    });
                }
            )
            : ANALYSIS_STAGE_DEFINITIONS;

    const handlers =
        asObject(
            options.handlers
        );

    const runtime =
        options.runtime ||
        globalThis;

    const reducedMotion =
        typeof options.reducedMotion ===
        "boolean"
            ? options.reducedMotion
            : detectReducedMotion(
                runtime
            );

    const minimumVisibleMs =
        reducedMotion
            ? 0
            : Math.max(
                0,
                Number(
                    options.minimumVisibleMs
                ) || 180
            );

    let running =
        false;

    let lastResult =
        null;

    async function run(
        initialContext = {},
        runOptions = {}
    ) {
        const runtime =
        options.runtime ||
        globalThis;

    const reducedMotion =
        typeof options.reducedMotion ===
        "boolean"
            ? options.reducedMotion
            : detectReducedMotion(
                runtime
            );

    const minimumVisibleMs =
        reducedMotion
            ? 0
            : Math.max(
                0,
                Number(
                    options.minimumVisibleMs
                ) || 180
            );

    let running =
        false;

    let lastResult =
        null;

    async function run(
        initialContext = {},
        runOptions = {}
    ) {
        if (running) {
            throw new Error(
                "GrowWithHR analysis sequence is already running."
            );
        if (running) {
            throw new Error(
                "GrowWithHR analysis sequence is already running."
            );
        }

        running =
            true;

        lastResult =
            null;

        const signal =
            runOptions.signal ||
            }

        running =
            true;

        lastResult =
            null;

        const signal =
            runOptions.signal ||
            options.signal;

        const options.signal;

        const callbacks = {
            onStart:
 callbacks = {
            onStart:
                runOptions.onStart ||
                options.onStart,

            onStageStart:
                runOptions.onStageStart ||
                options.onStageStart,

            onStageComplete:
                runOptions.on                runOptions.onStart ||
                options.onStart,

            onStageStart:
                runOptions.onStageStart ||
                options.onStageStart,

            onStageComplete:
                runOptions.onStageComplete ||
                options.onStageComplete,

            onStageError:
                runOptionsStageComplete ||
                options.onStageComplete,

            onStageError:
                runOptions.onStageError ||
                options.onStageError,

            onComplete:
                runOptions.onComplete ||
                options.onComplete.onStageError ||
                options.onStageError,

            onComplete:
                runOptions.onComplete ||
                options.onComplete,

            onError:
                runOptions.onError ||
                options.onError
        };

,

            onError:
                runOptions.onError ||
                options.onError
        };

        let context = {
            ...asObject(
                initial        let context = {
            ...asObject(
                initialContext
            )
        };

        const results = {};

        const startedAt =
            newContext
            )
        };

        const results = {};

        const startedAt =
            new Date()
                .toISOString();

        notify(
            callbacks.onStart,
            Object.freeze({
                totalStages:
                    stages.length,

                reducedMotion,

                startedAt
            })
        );

        try {
            for (
                let index = 0;
                index < stages.length;
                index += 1
            ) {
                throwIfAborted(
                    signal
                );

                Date()
                .toISOString();

        notify(
            callbacks.onStart,
            Object.freeze({
                totalStages:
                    stages.length,

                reducedMotion,

                startedAt
            })
        );

        try {
            for (
                let index = 0;
                index < stages.length;
                index += 1
            ) {
                throwIfAborted(
                    signal
                );

                const stage =
                    stages[index];

                const handler =
                    requireHandler(
                        handlers,
                        stage
                    );

                const stageStartedAt =
                    new const stage =
                    stages[index];

                const handler =
                    requireHandler(
                        handlers,
                        stage
                    );

                const stageStartedAt =
                    new Date()
                        .toISOString();

                const timerStartedAt =
                    now();

                const Date()
                        .toISOString();

                const timerStartedAt =
                    now();

                const runningSnapshot =
                    createStageSnapshot(
                        stage,
                        "running",
                        {
 runningSnapshot =
                    createStageSnapshot(
                        stage,
                        "running",
                        {
                            index,
                            number                            index,
                            number:
                                index + 1,

                            totalStages:
                                stages.length,

                            startedAt:
                                stageStartedAt
                        }
                    );

                notify(
                    callbacks
                        .onStageStart,
                    running:
                                index + 1,

                            totalStages:
                                stages.length,

                            startedAt:
                                stageStartedAt
                        }
                    );

                notify(
                    callbacks
                        .onStageStart,
                    runningSnapshot
                );

                try {
                   Snapshot
                );

                try {
                    const rawResult =
                        await handler({
                            stage:
                                runningSnapshot,

                            context: {
                                ...context
                            },

                            results const rawResult =
                        await handler({
                            stage:
                                runningSnapshot,

                            context: {
                                ...context
                            },

                            results: {
                                ...results
                            },

                            signal,

                            reducedMotion
                        });

                    throwIfAborted(
                        signal
                    );

                    const result =
                        normalizeHandlerResult(
                            rawResult
                        );

                    context = {
                        ...context,
                        ...result.contextPatch
                    };

: {
                                ...results
                            },

                            signal,

                            reducedMotion
                        });

                    throwIfAborted(
                        signal
                    );

                    const result =
                        normalizeHandlerResult(
                            rawResult
                        );

                    context = {
                        ...context,
                        ...result.contextPatch
                    };

                    results[
                        stage.id
                    ] =
                        result.output;

                    const elapsed =
                        now() -
                        timerStartedAt;

                    const remainingDelay =
                        minimumVisibleMs -
                        elapsed;

                    if (
                        remainingDelay > 0
                    ) {
                        await wait(
                                               results[
                        stage.id
                    ] =
                        result.output;

                    const elapsed =
                        now() -
                        timerStartedAt;

                    const remainingDelay =
                        minimumVisibleMs -
                        elapsed;

                    if (
                        remainingDelay > 0
                    ) {
                        await wait(
                            remainingDelay,
                            signal
                        );
                    }

                    const completedSnapshot =
                        createStageSnapshot(
                            stage,
                            "complete",
                            {
                                index,
                                number:
                                    index + 1,

                                totalStages:
                                    stages.length,

                                startedAt:
                                    stageStartedAt,

                                completedAt:
                                    new Date()
                                        .toISOString(),

                                output:
                                    result.output
                            }
                        );

                    notify(
                        callbacks
                            .onStageComplete,
                        remainingDelay,
                            signal
                        );
                    }

                    const completedSnapshot =
                        createStageSnapshot(
                            stage,
                            "complete",
                            {
                                index,
                                number:
                                    index + 1,

                                totalStages:
                                    stages.length,

                                startedAt:
                                    stageStartedAt,

                                completedAt:
                                    new Date()
                                        .toISOString(),

                                output:
                                    result.output
                            }
                        );

                    notify(
                        callbacks
                            .onStageComplete,
                        completedSnapshot
                    );
                } catch (error) {
                    const failedSnapshot =
                        createStageSnapshot(
                            stage,
                            "error",
                            completedSnapshot
                    );
                } catch (error) {
                    const failedSnapshot =
                        createStageSnapshot(
                            stage,
                            "error",
                            {
                                index,
                                number:
                                    index + 1,

                                totalStages:
                                    stages.length,

                                startedAt {
                                index,
                                number:
                                    index + 1,

                                totalStages:
                                    stages.length,

                                startedAt:
                                    stageStartedAt,

                                failedAt:
                                    new Date()
                                        .toISOString(),

:
                                    stageStartedAt,

                                failedAt:
                                    new Date()
                                        .toISOString(),

                                error
                            }
                        );

                    notify(
                        callbacks
                            .on                                error
                            }
                        );

                    notify(
                        callbacks
                            .onStageError,
                        failedSnapshot
                    );

                    throw error;
                }
            }

            lastResult =
                Object.freezeStageError,
                        failedSnapshot
                    );

                    throw error;
                }
            }

            lastResult =
                Object.freeze({
                    status:
                        "complete",

                    startedAt,

                    completedAt:
                        new Date()
                            .toISOString({
                    status:
                        "complete",

                    startedAt,

                    completedAt:
                        new Date()
                            .toISOString(),

                    reducedMotion,

                    context:
(),

                    reducedMotion,

                    context:
                        Object.freeze({
                            ...context
                        }),

                    results:
                        Object.freeze({
                                                   Object.freeze({
                            ...context
                        }),

                    results:
                        Object.freeze({
                            ...results
                        })
                });

            notify(
                callbacks.onComplete,
                lastResult
            );

 ...results
                        })
                });

            notify(
                callbacks.onComplete,
                lastResult
            );

            return lastResult;
        } catch (error) {
            const failedResult =
                Object.freeze({
                    status:
            return lastResult;
        } catch (error) {
            const failedResult =
                Object.freeze({
                    status:
                        error?.name ===
                        "AbortError"
                            ? "cancelled"
                            : "error",

                    started                        error?.name ===
                        "AbortError"
                            ? "cancelled"
                            : "error",

                    startedAt,

                    failedAt:
                        new Date()
                            .toISOString(),

At,

                    failedAt:
                        new Date()
                            .toISOString(),

                    reducedMotion,

                    context:
                        Object.freeze({
                            ...context
                        }),

                    reducedMotion,

                    context:
                        Object.freeze({
                            ...context
                        }),

                    results:
                        Object.freeze({
                            ...results
                        }),

                    results:
                        Object.freeze({
                            ...results
                        }),

                    error
                });

            lastResult =
                failedResult;

            notify(
                callbacks.onError,
                failed                    error
                });

            lastResult =
                failedResult;

            notify(
                callbacks.onError,
                failedResult
            );

            throw error;
        } finally {
            running =
               Result
            );

            throw error;
        } finally {
            running =
                false;
        }
    }

    function getStatus() {
        return Object.freeze false;
        }
    }

    function getStatus() {
        return Object.freeze({
            running,

            reducedMotion,

            minimumVisibleMs,

            stageCount:
               ({
            running,

            reducedMotion,

            minimumVisibleMs,

            stageCount:
                stages.length,

            lastResult
        });
    }

    return Object.freeze({
        stages,
        run,
        get stages.length,

            lastResult
        });
    }

    return Object.freeze({
        stages,
        run,
        getStatus
    });
}

export function prefersReducedMotion(
    runtime = globalThis
) {
    return detectReducedMotionStatus
    });
}

export function prefersReducedMotion(
    runtime = globalThis
) {
    return detectReducedMotion(
        runtime
    );
}

export default createAnalysisSequence;
