/* ==========================================================
   GrowWithHR
   Assessment first-scene transition compatibility fix

   Accepts a clearly completed first scene when the only
   validation blocker is a free-text industry that is not an
   exact catalogue option. The value is preserved as a custom
   industry and the existing validator/navigation path is retried.
========================================================== */
(() => {
    "use strict";

    const FIX_VERSION =
        "1.0.0";

    const INSTALL_MARKER =
        "__firstSceneTransitionFixInstalled";

    function cleanText(value) {
        return String(
            value ?? ""
        ).trim();
    }

    function fieldValue(
        application,
        fieldName
    ) {
        const field =
            document.getElementById(
                fieldName
            );

        return cleanText(
            field?.value ??
            application?.answers?.[
                fieldName
            ]
        );
    }

    function hasVisibleError(
        fieldName
    ) {
        const error =
            document.getElementById(
                `${fieldName}Error`
            );

        return Boolean(
            error &&
            !error.hidden &&
            cleanText(
                error.textContent
            )
        );
    }

    function canRetryAsCustomIndustry(
        application
    ) {
        if (
            Number(
                application
                    ?.currentMoment
            ) !== 0
        ) {
            return false;
        }

        if (
            !fieldValue(
                application,
                "companyName"
            ) ||
            !fieldValue(
                application,
                "industry"
            ) ||
            !fieldValue(
                application,
                "nature"
            )
        ) {
            return false;
        }

        return (
            hasVisibleError(
                "industry"
            ) &&
            !hasVisibleError(
                "companyName"
            ) &&
            !hasVisibleError(
                "nature"
            )
        );
    }

    function preserveAsCustomIndustry(
        application
    ) {
        const industryInput =
            document.getElementById(
                "industry"
            );

        const customIndustryInput =
            document.getElementById(
                "customIndustry"
            );

        const customIndustryField =
            document.getElementById(
                "customIndustryField"
            );

        const rawIndustry =
            cleanText(
                industryInput?.value ??
                application
                    ?.answers
                    ?.industry
            );

        if (!rawIndustry) {
            return false;
        }

        if (industryInput) {
            industryInput.value =
                "Other";
        }

        if (customIndustryInput) {
            customIndustryInput.value =
                rawIndustry;
        }

        if (customIndustryField) {
            customIndustryField.hidden =
                false;
        }

        Object.assign(
            application.answers,
            {
                industry:
                    "Other",

                industryId:
                    "other",

                industryCategory:
                    "Other",

                industryRuleProfile:
                    "Other",

                customIndustry:
                    rawIndustry
            }
        );

        return true;
    }

    function install(application) {
        if (
            !application ||
            typeof application
                .continueFromMoment !==
                "function" ||
            application[
                INSTALL_MARKER
            ]
        ) {
            return false;
        }

        const originalContinue =
            application
                .continueFromMoment;

        application
            .continueFromMoment =
            function continueFromMomentWithCustomIndustryFallback() {
                const startingMoment =
                    Number(
                        this.currentMoment
                    );

                originalContinue.call(
                    this
                );

                if (
                    startingMoment !== 0 ||
                    Number(
                        this.currentMoment
                    ) !== 0 ||
                    !canRetryAsCustomIndustry(
                        this
                    ) ||
                    !preserveAsCustomIndustry(
                        this
                    )
                ) {
                    return;
                }

                originalContinue.call(
                    this
                );
            };

        Object.defineProperty(
            application,
            INSTALL_MARKER,
            {
                configurable:
                    false,

                enumerable:
                    false,

                writable:
                    false,

                value:
                    true
            }
        );

        window
            .GrowWithHRAssessmentFirstSceneFix =
            Object.freeze({
                version:
                    FIX_VERSION,

                installed:
                    true
            });

        return true;
    }

    function installCurrentApplication() {
        return install(
            window
                .executiveAssessment
        );
    }

    window.addEventListener(
        "growwithhr:assessment-modules-ready",
        (event) => {
            install(
                event
                    ?.detail
                    ?.application
            );
        },
        {
            once:
                true
        }
    );

    if (
        !installCurrentApplication()
    ) {
        if (
            document.readyState ===
            "loading"
        ) {
            document.addEventListener(
                "DOMContentLoaded",
                installCurrentApplication,
                {
                    once:
                        true
                }
            );
        } else {
            installCurrentApplication();
        }
    }
})();
