/* ==========================================================
   GrowWithHR
   Executive assessment navigation resilience

   Prevents repeated Continue activation from validating a newly rendered
   scene before the user has interacted with it. The lock is scene-aware:
   validation failures unlock immediately, while successful transitions stay
   protected until the user begins answering the new scene.
========================================================== */

(() => {
    "use strict";

    const FALLBACK_UNLOCK_MS = 3000;
    const INSTALL_RETRY_MS = 50;
    const MAX_INSTALL_ATTEMPTS = 100;
    let installed = false;
    let installAttempts = 0;

    function setButtonBusy(button, busy) {
        if (!button) {
            return;
        }

        if (busy) {
            button.setAttribute(
                "aria-busy",
                "true"
            );
            button.dataset.navigationBusy =
                "true";
        } else {
            button.removeAttribute(
                "aria-busy"
            );
            delete button.dataset
                .navigationBusy;
        }
    }

    function install(application) {
        const form =
            application?.elements?.storyForm ||
            document.getElementById(
                "storyForm"
            );

        if (
            installed ||
            !application ||
            !application.__modularFacadeInstalled ||
            !form
        ) {
            return false;
        }

        const shell =
            application?.elements?.shell ||
            document.getElementById(
                "assessmentShell"
            );
        const storyContainer =
            application?.elements?.storyContainer ||
            document.getElementById(
                "storyContainer"
            );
        const backButton =
            application?.elements?.backButton ||
            document.getElementById(
                "backButton"
            );

        let navigationLocked = false;
        let releaseTimer = 0;
        let activeButton = null;
        let lockedMoment = null;

        const currentButton = () => {
            return (
                application?.elements?.nextButton ||
                document.getElementById(
                    "nextButton"
                )
            );
        };

        const release = () => {
            window.clearTimeout(
                releaseTimer
            );
            releaseTimer = 0;
            navigationLocked = false;
            lockedMoment = null;
            setButtonBusy(
                activeButton ||
                currentButton(),
                false
            );
            activeButton = null;
        };

        const lock = (button) => {
            navigationLocked = true;
            lockedMoment =
                application.currentMoment;
            activeButton =
                button ||
                currentButton();

            setButtonBusy(
                activeButton,
                true
            );

            window.clearTimeout(
                releaseTimer
            );
            releaseTimer =
                window.setTimeout(
                    release,
                    FALLBACK_UNLOCK_MS
                );
        };

        const evaluateTransition = () => {
            window.requestAnimationFrame(
                () => {
                    if (!navigationLocked) {
                        return;
                    }

                    if (
                        application.currentMoment ===
                        lockedMoment
                    ) {
                        release();
                    } else {
                        setButtonBusy(
                            currentButton(),
                            true
                        );
                    }
                }
            );
        };

        const releaseAfterNewSceneInteraction = (
            event
        ) => {
            const target = event.target;

            if (
                !navigationLocked ||
                application.currentMoment ===
                    lockedMoment ||
                !storyContainer ||
                !(target instanceof Node) ||
                !target.isConnected ||
                !storyContainer.contains(target)
            ) {
                return;
            }

            release();
        };

        form.addEventListener(
            "submit",
            (event) => {
                if (navigationLocked) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return;
                }

                lock(
                    event.submitter
                );
                evaluateTransition();
            },
            true
        );

        [
            "focusin",
            "input",
            "change",
            "pointerdown",
            "keydown"
        ].forEach((eventName) => {
            storyContainer
                ?.addEventListener(
                    eventName,
                    releaseAfterNewSceneInteraction,
                    true
                );
        });

        backButton
            ?.addEventListener(
                "click",
                release,
                true
            );

        installed = true;

        if (shell) {
            shell.dataset.navigationGuard =
                "ready";
        }

        return true;
    }

    function installCurrentApplication() {
        if (
            install(
                window.executiveAssessment
            ) ||
            installed
        ) {
            return true;
        }

        installAttempts += 1;

        if (
            installAttempts <
            MAX_INSTALL_ATTEMPTS
        ) {
            window.setTimeout(
                installCurrentApplication,
                INSTALL_RETRY_MS
            );
        }

        return false;
    }

    window.addEventListener(
        "growwithhr:assessment-modules-ready",
        (event) => {
            install(
                event?.detail?.application ||
                window.executiveAssessment
            );
        },
        { once: true }
    );

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            installCurrentApplication,
            { once: true }
        );
    } else {
        installCurrentApplication();
    }
})();
