/**
 * GrowWithHR Compliance DNA
 * M1 Five-Act Bootstrap
 *
 * Connects the private-beta HTML presentation layer
 * to the Five-Act story engine.
 *
 * This file does not calculate compliance results
 * or modify the stable v2 assessment.
 */

import createStoryEngine from "./story-engine.js";

const STABLE_ASSESSMENT_ROUTE =
    "analyze-company.html";

const REQUIRED_ELEMENT_IDS =
    Object.freeze([
        "dnaCurrentAct",
        "dnaProgressLabel",
        "dnaProgressValue",
        "dnaStageEyebrow",
        "dnaStageTitle",
        "dnaStageDescription",
        "dnaStartButton",
        "dnaActList",
        "dnaLiveRegion"
    ]);

function requireElement(id) {
    const element =
        document.getElementById(id);

    if (!element) {
        throw new Error(
            `GrowWithHR Compliance DNA requires #${id}.`
        );
    }

    return element;
}

function collectElements() {
    const elements = {};

    for (
        const id
        of REQUIRED_ELEMENT_IDS
    ) {
        elements[id] =
            requireElement(id);
    }

    elements.progressBar =
        document.querySelector(
            '[role="progressbar"]'
        );

    elements.actItems =
        Array.from(
            document.querySelectorAll(
                "[data-act]"
            )
        );

    elements.actButtons =
        Array.from(
            document.querySelectorAll(
                "[data-act-button]"
            )
        );

    if (!elements.progressBar) {
        throw new Error(
            "GrowWithHR Compliance DNA requires a progressbar."
        );
    }

    if (
        elements.actItems.length !== 5 ||
        elements.actButtons.length !== 5
    ) {
        throw new Error(
            "GrowWithHR Compliance DNA requires five story acts."
        );
    }

    return elements;
}

function getPrimaryButtonLabel(
    state
) {
    if (state.isFinalAct) {
        return "Open the stable assessment";
    }

    const nextAct =
        state.acts[
            state.currentActNumber
        ];

    return `Continue to ${nextAct.label}`;
}

function announce(
    elements,
    message
) {
    elements.dnaLiveRegion.hidden =
        false;

    elements.dnaLiveRegion.textContent =
        "";

    window.requestAnimationFrame(
        () => {
            elements.dnaLiveRegion.textContent =
                message;
        }
    );
}

function updateActNavigation(
    elements,
    state
) {
    for (
        const item
        of elements.actItems
    ) {
        const itemActNumber =
            Number.parseInt(
                item.dataset.act,
                10
            );

        const isActive =
            itemActNumber ===
            state.currentActNumber;

        const isComplete =
            itemActNumber <
            state.currentActNumber;

        item.classList.toggle(
            "is-active",
            isActive
        );

        item.classList.toggle(
            "is-complete",
            isComplete
        );
    }

    for (
        const button
        of elements.actButtons
    ) {
        const buttonActNumber =
            Number.parseInt(
                button.dataset.actButton,
                10
            );

        const isActive =
            buttonActNumber ===
            state.currentActNumber;

        if (isActive) {
            button.setAttribute(
                "aria-current",
                "step"
            );
        } else {
            button.removeAttribute(
                "aria-current"
            );
        }

        const act =
            state.acts[
                buttonActNumber - 1
            ];

        button.setAttribute(
            "aria-label",
            `Act ${act.number} of ${state.totalActs}, ${act.label}: ${act.status}`
        );
    }
}

function updateProgress(
    elements,
    state
) {
    elements.dnaCurrentAct.textContent =
        `Act ${state.currentActNumber} of ${state.totalActs}`;

    elements.dnaProgressLabel.textContent =
        state.currentAct.label;

    elements.dnaProgressValue.style.width =
        `${state.progress}%`;

    elements.progressBar.setAttribute(
        "aria-valuenow",
        String(
            state.currentActNumber
        )
    );

    elements.progressBar.setAttribute(
        "aria-valuetext",
        `Act ${state.currentActNumber} of ${state.totalActs}: ${state.currentAct.label}`
    );
}

function updateStage(
    elements,
    state
) {
    elements.dnaStageEyebrow.textContent =
        state.currentAct.eyebrow;

    elements.dnaStageTitle.textContent =
        state.currentAct.title;

    elements.dnaStageDescription.textContent =
        state.currentAct.description;

    elements.dnaStartButton.textContent =
        getPrimaryButtonLabel(
            state
        );

    elements.dnaStartButton.dataset.currentAct =
        String(
            state.currentActNumber
        );
}

function render(
    elements,
    state,
    options = {}
) {
    updateProgress(
        elements,
        state
    );

    updateActNavigation(
        elements,
        state
    );

    updateStage(
        elements,
        state
    );

    if (options.announce) {
        announce(
            elements,
            `${state.currentAct.eyebrow}. ${state.currentAct.title}`
        );
    }
}

function bindActButtons(
    elements,
    engine
) {
    for (
        const button
        of elements.actButtons
    ) {
        button.addEventListener(
            "click",
            () => {
                const actNumber =
                    Number.parseInt(
                        button.dataset.actButton,
                        10
                    );

                engine.setAct(
                    actNumber
                );

                const title =
                    elements.dnaStageTitle;

                title.setAttribute(
                    "tabindex",
                    "-1"
                );

                title.focus({
                    preventScroll: false
                });
            }
        );
    }
}

function bindPrimaryButton(
    elements,
    engine
) {
    elements.dnaStartButton.addEventListener(
        "click",
        () => {
            const state =
                engine.getState();

            if (state.isFinalAct) {
                window.location.assign(
                    STABLE_ASSESSMENT_ROUTE
                );

                return;
            }

            engine.next();

            const title =
                elements.dnaStageTitle;

            title.setAttribute(
                "tabindex",
                "-1"
            );

            title.focus({
                preventScroll: false
            });
        }
    );
}

function initializeComplianceDna() {
    const elements =
        collectElements();

    const engine =
        createStoryEngine({
            initialAct: 1
        });

    let isInitialRender =
        true;

    engine.subscribe(
        (state) => {
            render(
                elements,
                state,
                {
                    announce:
                        !isInitialRender
                }
            );

            isInitialRender =
                false;
        }
    );

    bindActButtons(
        elements,
        engine
    );

    bindPrimaryButton(
        elements,
        engine
    );

    window.GrowWithHRComplianceDna =
        Object.freeze({
            version:
                "m1-five-act-shell",

            route:
                "analyze-company-v3.html",

            fallbackRoute:
                STABLE_ASSESSMENT_ROUTE,

            getState:
                engine.getState,

            setAct:
                engine.setAct,

            next:
                engine.next,

            previous:
                engine.previous,

            reset:
                engine.reset
        });
}

function handleInitializationError(
    error
) {
    console.error(
        "GrowWithHR Compliance DNA could not start.",
        error
    );

    const startButton =
        document.getElementById(
            "dnaStartButton"
        );

    if (startButton) {
        startButton.textContent =
            "Open the stable assessment";

        startButton.addEventListener(
            "click",
            () => {
                window.location.assign(
                    STABLE_ASSESSMENT_ROUTE
                );
            },
            {
                once: true
            }
        );
    }
}

function start() {
    try {
        initializeComplianceDna();
    } catch (error) {
        handleInitializationError(
            error
        );
    }
}

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        start,
        {
            once: true
        }
    );
} else {
    start();
}
