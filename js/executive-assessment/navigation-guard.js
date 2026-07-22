/* ==========================================================
   GrowWithHR
   Executive assessment navigation resilience

   Prevents rapid repeated Continue activation from submitting the newly
   rendered scene before the user has answered it. The guard works at the form
   event boundary and leaves the assessment controller methods unchanged.
========================================================== */

(() => {
    "use strict";

    const LOCK_DURATION_MS = 450;
    let installed = false;

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

    function showRecoverableError(application) {
        const message =
            "We couldn’t move to the next scene. Your answers are still here—please try Continue again.";
        const footer =
            application?.elements?.footerMessage ||
            document.getElementById(
                "footerMessage"
            );
        const assertive =
            application?.elements?.assertiveRegion ||
            document.getElementById(
                "assertiveRegion"
            );

        if (footer) {
            footer.textContent = message;
        }

        if (assertive) {
            assertive.textContent = "";

            window.requestAnimationFrame(() => {
                assertive.textContent = message;
            });
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
            !form
        ) {
            return false;
        }

        let navigationLocked = false;
        let releaseTimer = 0;
        let activeButton = null;

        const release = () => {
            window.clearTimeout(
                releaseTimer
            );
            releaseTimer = 0;
            navigationLocked = false;
            setButtonBusy(
                activeButton,
                false
            );
            activeButton = null;
        };

        form.addEventListener(
            "submit",
            (event) => {
                if (navigationLocked) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return;
                }

                navigationLocked = true;
                activeButton =
                    event.submitter ||
                    application?.elements?.nextButton ||
                    document.getElementById(
                        "nextButton"
                    );

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
                        LOCK_DURATION_MS
                    );
            },
            true
        );

        const handleNavigationError = () => {
            if (!navigationLocked) {
                return;
            }

            release();
            showRecoverableError(
                application
            );
        };

        window.addEventListener(
            "error",
            handleNavigationError
        );
        window.addEventListener(
            "unhandledrejection",
            handleNavigationError
        );

        installed = true;

        const shell =
            application?.elements?.shell ||
            document.getElementById(
                "assessmentShell"
            );

        if (shell) {
            shell.dataset.navigationGuard =
                "ready";
        }

        return true;
    }

    function installCurrentApplication() {
        return install(
            window.executiveAssessment
        );
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
