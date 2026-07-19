import {
    expect,
    Page,
    test
} from "@playwright/test";

const REQUIRED_MODULES = [
    "AssessmentDefinition",
    "AssessmentUtils",
    "AssessmentStorage",
    "IndustryCatalog",
    "AssessmentValidation",
    "AssessmentFields",
    "AssessmentScreens",
    "AssessmentReview",
    "ReportMapper",
    "AdvisoryDelivery",
    "AssessmentState"
] as const;

const STORAGE_KEY =
    "growwithhr-advisory-briefing-v2";

interface BrowserErrorLog {
    consoleErrors: string[];
    pageErrors: string[];
}

function collectBrowserErrors(
    page: Page
): BrowserErrorLog {
    const errors: BrowserErrorLog = {
        consoleErrors: [],
        pageErrors: []
    };

    page.on(
        "console",
        (message) => {
            if (
                message.type() ===
                "error"
            ) {
                errors.consoleErrors.push(
                    message.text()
                );
            }
        }
    );

    page.on(
        "pageerror",
        (error) => {
            errors.pageErrors.push(
                error.message
            );
        }
    );

    return errors;
}

async function clearBrowserState(
    page: Page
): Promise<void> {
    await page.addInitScript(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
    });
}

async function seedSavedAssessment(
    page: Page
): Promise<void> {
    await page.addInitScript(
        ({ storageKey }) => {
            window.localStorage.setItem(
                storageKey,
                JSON.stringify({
                    version:
                        "2.1.0",

                    schemaVersion:
                        1,

                    started:
                        true,

                    completed:
                        false,

                    currentMoment:
                        2,

                    answers: {
                        locations:
                            "1",

                        countries:
                            "1",

                        expansionPlans:
                            [],

                        priorities:
                            [],

                        companyName:
                            "Modular Test Company",

                        industry:
                            "Information Technology / SaaS",

                        industryId:
                            "information_technology",

                        industryCategory:
                            "Technology & Digital",

                        industryRuleProfile:
                            "Information Technology / SaaS",

                        nature:
                            "We provide HR technology services.",

                        founded:
                            "2024",

                        foundedNotSure:
                            false,

                        entity:
                            "Private Limited"
                    },

                    lead: {
                        name:
                            "",

                        email:
                            "",

                        role:
                            "",

                        marketingConsent:
                            false
                    },

                    ui: {
                        showSupplementalWorkforce:
                            false
                    },

                    updatedAt:
                        new Date()
                            .toISOString()
                })
            );
        },
        {
            storageKey:
                STORAGE_KEY
        }
    );
}

test.describe(
    "Executive assessment modular bridge",
    () => {
        test.beforeEach(
            async ({ page }) => {
                await page.setViewportSize({
                    width: 1440,
                    height: 900
                });
            }
        );

        test(
            "loads every extracted module",
            async ({ page }) => {
                await clearBrowserState(
                    page
                );

                const browserErrors =
                    collectBrowserErrors(
                        page
                    );

                await page.goto(
                    "/analyze-company.html"
                );

                await expect(
                    page.locator(
                        "#assessmentShell"
                    )
                ).toBeVisible();

                const moduleStatus =
                    await page.evaluate(
                        (
                            requiredModules
                        ) => {
                            const modules =
                                (
                                    window as Window & {
                                        GrowWithHRModules?: Record<
                                            string,
                                            unknown
                                        >;
                                    }
                                )
                                    .GrowWithHRModules ||
                                {};

                            return Object.fromEntries(
                                requiredModules.map(
                                    (
                                        moduleName
                                    ) => [
                                        moduleName,
                                        Boolean(
                                            modules[
                                                moduleName
                                            ]
                                        )
                                    ]
                                )
                            );
                        },
                        REQUIRED_MODULES
                    );

                for (
                    const moduleName of
                    REQUIRED_MODULES
                ) {
                    expect(
                        moduleStatus[
                            moduleName
                        ],
                        `${moduleName} should be loaded`
                    ).toBe(true);
                }

                expect(
                    browserErrors
                        .pageErrors
                ).toEqual([]);

                expect(
                    browserErrors
                        .consoleErrors
                ).toEqual([]);
            }
        );

        test(
            "installs the compatibility facade on the existing controller",
            async ({ page }) => {
                await clearBrowserState(
                    page
                );

                await page.goto(
                    "/analyze-company.html"
                );

                await page.waitForFunction(
                    () => {
                        const application =
                            (
                                window as Window & {
                                    executiveAssessment?: {
                                        __modularFacadeInstalled?:
                                            boolean;
                                    };
                                }
                            )
                                .executiveAssessment;

                        return Boolean(
                            application
                                ?.__modularFacadeInstalled
                        );
                    }
                );

                const status =
                    await page.evaluate(
                        () => {
                            const browserWindow =
                                window as Window & {
                                    executiveAssessment?: {
                                        __modularFacadeInstalled?:
                                            boolean;

                                        __modularFacadeVersion?:
                                            string;

                                        assessmentState?:
                                            unknown;

                                        industryCatalogService?:
                                            unknown;

                                        deliveryService?:
                                            unknown;
                                    };

                                    GrowWithHRCompatibilityFacade?: {
                                        version:
                                            string;
                                    };
                                };

                            const application =
                                browserWindow
                                    .executiveAssessment;

                            return {
                                hasApplication:
                                    Boolean(
                                        application
                                    ),

                                facadeInstalled:
                                    Boolean(
                                        application
                                            ?.__modularFacadeInstalled
                                    ),

                                facadeVersion:
                                    application
                                        ?.__modularFacadeVersion,

                                publicFacadeVersion:
                                    browserWindow
                                        .GrowWithHRCompatibilityFacade
                                        ?.version,

                                hasStateModel:
                                    Boolean(
                                        application
                                            ?.assessmentState
                                    ),

                                hasIndustryService:
                                    Boolean(
                                        application
                                            ?.industryCatalogService
                                    ),

                                hasDeliveryService:
                                    Boolean(
                                        application
                                            ?.deliveryService
                                    )
                            };
                        }
                    );

                expect(
                    status.hasApplication
                ).toBe(true);

                expect(
                    status.facadeInstalled
                ).toBe(true);

                expect(
                    status.facadeVersion
                ).toBe("1.0.0");

                expect(
                    status
                        .publicFacadeVersion
                ).toBe("1.0.0");

                expect(
                    status.hasStateModel
                ).toBe(true);

                expect(
                    status
                        .hasIndustryService
                ).toBe(true);

                expect(
                    status
                        .hasDeliveryService
                ).toBe(true);
            }
        );

        test(
            "keeps the first-visit experience working",
            async ({ page }) => {
                await clearBrowserState(
                    page
                );

                await page.goto(
                    "/analyze-company.html"
                );

                await page.waitForFunction(
                    () => {
                        return Boolean(
                            (
                                window as Window & {
                                    executiveAssessment?: {
                                        __modularFacadeInstalled?:
                                            boolean;
                                    };
                                }
                            )
                                .executiveAssessment
                                ?.__modularFacadeInstalled
                        );
                    }
                );

                await expect(
                    page.locator(
                        "#firstVisitActions"
                    )
                ).toBeVisible();

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Start my advisory"
                        }
                    )
                    .click();

                await expect(
                    page.locator(
                        "#conversationWorkspace"
                    )
                ).toBeVisible();

                await expect(
                    page.locator(
                        "#stepTitle"
                    )
                ).toContainText(
                    "business you’re building"
                );

                await expect(
                    page.locator(
                        "#companyName"
                    )
                ).toBeVisible();

                await expect(
                    page.locator(
                        "#industry"
                    )
                ).toBeVisible();

                await expect(
                    page.locator(
                        "#nature"
                    )
                ).toBeVisible();
            }
        );

        test(
            "renders the first screen through the extracted renderer",
            async ({ page }) => {
                await clearBrowserState(
                    page
                );

                await page.goto(
                    "/analyze-company.html"
                );

                await page.waitForFunction(
                    () => {
                        return Boolean(
                            (
                                window as Window & {
                                    executiveAssessment?: {
                                        __modularFacadeInstalled?:
                                            boolean;
                                    };
                                }
                            )
                                .executiveAssessment
                                ?.__modularFacadeInstalled
                        );
                    }
                );

                const renderResult =
                    await page.evaluate(
                        () => {
                            const application =
                                (
                                    window as Window & {
                                        executiveAssessment?: {
                                            renderBusinessBasics:
                                                () => string;
                                        };
                                    }
                                )
                                    .executiveAssessment;

                            if (!application) {
                                return "";
                            }

                            return application
                                .renderBusinessBasics();
                        }
                    );

                expect(
                    renderResult
                ).toContain(
                    'id="companyName"'
                );

                expect(
                    renderResult
                ).toContain(
                    'id="industry"'
                );

                expect(
                    renderResult
                ).toContain(
                    'id="nature"'
                );

                expect(
                    renderResult
                ).toContain(
                    "advisory-field-group"
                );
            }
        );

        test(
            "restores existing saved progress",
            async ({ page }) => {
                await seedSavedAssessment(
                    page
                );

                await page.goto(
                    "/analyze-company.html"
                );

                await page.waitForFunction(
                    () => {
                        return Boolean(
                            (
                                window as Window & {
                                    executiveAssessment?: {
                                        __modularFacadeInstalled?:
                                            boolean;
                                    };
                                }
                            )
                                .executiveAssessment
                                ?.__modularFacadeInstalled
                        );
                    }
                );

                await expect(
                    page.locator(
                        "#resumePanel"
                    )
                ).toBeVisible();

                await expect(
                    page.getByText(
                        "Your progress is saved."
                    )
                ).toBeVisible();

                const restoredState =
                    await page.evaluate(
                        () => {
                            const application =
                                (
                                    window as Window & {
                                        executiveAssessment?: {
                                            started:
                                                boolean;

                                            currentMoment:
                                                number;

                                            answers: {
                                                companyName?:
                                                    string;
                                            };

                                            assessmentState?: {
                                                createPersistenceSnapshot:
                                                    () => {
                                                        currentMoment:
                                                            number;

                                                        answers: {
                                                            companyName?:
                                                                string;
                                                        };
                                                    };
                                            };
                                        };
                                    }
                                )
                                    .executiveAssessment;

                            if (!application) {
                                return null;
                            }

                            const snapshot =
                                application
                                    .assessmentState
                                    ?.createPersistenceSnapshot();

                            return {
                                started:
                                    application.started,

                                currentMoment:
                                    application
                                        .currentMoment,

                                companyName:
                                    application
                                        .answers
                                        .companyName,

                                snapshotMoment:
                                    snapshot
                                        ?.currentMoment,

                                snapshotCompany:
                                    snapshot
                                        ?.answers
                                        .companyName
                            };
                        }
                    );

                expect(
                    restoredState
                        ?.started
                ).toBe(true);

                expect(
                    restoredState
                        ?.currentMoment
                ).toBe(2);

                expect(
                    restoredState
                        ?.companyName
                ).toBe(
                    "Modular Test Company"
                );

                expect(
                    restoredState
                        ?.snapshotMoment
                ).toBe(2);

                expect(
                    restoredState
                        ?.snapshotCompany
                ).toBe(
                    "Modular Test Company"
                );
            }
        );

        test(
            "delegates validation to the extracted validation module",
            async ({ page }) => {
                await clearBrowserState(
                    page
                );

                await page.goto(
                    "/analyze-company.html"
                );

                await page.waitForFunction(
                    () => {
                        return Boolean(
                            (
                                window as Window & {
                                    executiveAssessment?: {
                                        __modularFacadeInstalled?:
                                            boolean;
                                    };
                                }
                            )
                                .executiveAssessment
                                ?.__modularFacadeInstalled
                        );
                    }
                );

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Start my advisory"
                        }
                    )
                    .click();

                await page
                    .locator(
                        "#nextButton"
                    )
                    .click();

                await expect(
                    page.locator(
                        "#companyNameError"
                    )
                ).toContainText(
                    "Enter your organisation’s name."
                );

                await expect(
                    page.locator(
                        "#industryError"
                    )
                ).toContainText(
                    "Choose the industry"
                );

                await expect(
                    page.locator(
                        "#natureError"
                    )
                ).toContainText(
                    "Describe what your organisation does"
                );

                await expect(
                    page.locator(
                        "#companyName"
                    )
                ).toHaveAttribute(
                    "aria-invalid",
                    "true"
                );
            }
        );

        test(
            "writes progress through the extracted storage module",
            async ({ page }) => {
                await clearBrowserState(
                    page
                );

                await page.goto(
                    "/analyze-company.html"
                );

                await page.waitForFunction(
                    () => {
                        return Boolean(
                            (
                                window as Window & {
                                    executiveAssessment?: {
                                        __modularFacadeInstalled?:
                                            boolean;
                                    };
                                }
                            )
                                .executiveAssessment
                                ?.__modularFacadeInstalled
                        );
                    }
                );

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Start my advisory"
                        }
                    )
                    .click();

                await page
                    .locator(
                        "#companyName"
                    )
                    .fill(
                        "Storage Test Company"
                    );

                await page.evaluate(
                    () => {
                        const application =
                            (
                                window as Window & {
                                    executiveAssessment?: {
                                        saveNow:
                                            () => unknown;
                                    };
                                }
                            )
                                .executiveAssessment;

                        application
                            ?.saveNow();
                    }
                );

                const saved =
                    await page.evaluate(
                        (storageKey) => {
                            const raw =
                                window
                                    .localStorage
                                    .getItem(
                                        storageKey
                                    );

                            return raw
                                ? JSON.parse(
                                    raw
                                )
                                : null;
                        },
                        STORAGE_KEY
                    );

                expect(saved)
                    .not
                    .toBeNull();

                expect(
                    saved.started
                ).toBe(true);

                expect(
                    saved.answers
                        .companyName
                ).toBe(
                    "Storage Test Company"
                );

                expect(
                    saved.schemaVersion
                ).toBe(1);
            }
        );
    }
);
