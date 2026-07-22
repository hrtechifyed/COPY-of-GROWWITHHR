import {
    expect,
    test
} from "@playwright/test";

const STORAGE_KEY =
    "growwithhr-advisory-briefing-v2";

test.describe(
    "Assessment first-scene transition",
    () => {
        test.beforeEach(
            async ({ page }) => {
                await page.addInitScript(
                    () => {
                        window.localStorage.clear();
                        window.sessionStorage.clear();
                    }
                );
            }
        );

        test(
            "continues when a completed industry is custom free text",
            async ({ page }) => {
                await page.goto(
                    "/analyze-company.html"
                );

                await page.waitForFunction(
                    () => {
                        const browserWindow =
                            window as Window & {
                                executiveAssessment?:
                                    unknown;

                                GrowWithHRAssessmentFirstSceneFix?: {
                                    installed?:
                                        boolean;
                                };
                            };

                        return Boolean(
                            browserWindow
                                .executiveAssessment &&
                            browserWindow
                                .GrowWithHRAssessmentFirstSceneFix
                                ?.installed
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
                        "Transition Test Company"
                    );

                await page
                    .locator(
                        "#industry"
                    )
                    .fill(
                        "People analytics platform"
                    );

                await page
                    .locator(
                        "#nature"
                    )
                    .fill(
                        "We provide people analytics software to growing businesses."
                    );

                await page
                    .locator(
                        "#nextButton"
                    )
                    .click();

                await expect(
                    page.locator(
                        "#stepTitle"
                    )
                ).toContainText(
                    "context around its stage"
                );

                await expect(
                    page.locator(
                        "#founded"
                    )
                ).toBeVisible();

                const savedState =
                    await page.evaluate(
                        (storageKey) => {
                            const raw =
                                window.localStorage
                                    .getItem(
                                        storageKey
                                    );

                            return raw
                                ? JSON.parse(raw)
                                : null;
                        },
                        STORAGE_KEY
                    );

                expect(
                    savedState
                        ?.currentMoment
                ).toBe(1);

                expect(
                    savedState
                        ?.answers
                        ?.industry
                ).toBe(
                    "Other"
                );

                expect(
                    savedState
                        ?.answers
                        ?.customIndustry
                ).toBe(
                    "People analytics platform"
                );
            }
        );
    }
);
