import {
    expect,
    Page,
    test
} from "@playwright/test";

async function waitForAssessment(page: Page): Promise<void> {
    await page.waitForFunction(() => {
        const application = (
            window as Window & {
                executiveAssessment?: {
                    __modularFacadeInstalled?: boolean;
                };
            }
        ).executiveAssessment;
        const shell = document.getElementById(
            "assessmentShell"
        );

        return Boolean(
            application?.__modularFacadeInstalled &&
            shell?.dataset.navigationGuard ===
                "ready"
        );
    });
}

async function installNavigationTrace(page: Page): Promise<void> {
    await page.evaluate(() => {
        const application = (
            window as Window & {
                executiveAssessment?: Record<string, unknown>;
            }
        ).executiveAssessment;

        if (!application) {
            throw new Error(
                "Assessment application is unavailable."
            );
        }

        const methods = [
            "continueFromMoment",
            "captureAllStoryInputs",
            "captureStoryInput",
            "validateBusinessStage",
            "applyValidationResult",
            "clearMomentErrors",
            "saveNow",
            "showMoment",
            "renderCurrentMoment",
            "updateProgress",
            "updateChapterRail",
            "updateNavigation",
            "updateDynamicVisibility",
            "focusScreen"
        ];

        methods.forEach((name) => {
            const candidate = application[name];

            if (typeof candidate !== "function") {
                return;
            }

            application[name] = function tracedMethod(
                this: Record<string, unknown>,
                ...args: unknown[]
            ) {
                console.info(
                    `[NAVTRACE] ${name}:start`
                );
                const result = candidate.apply(
                    this,
                    args
                );
                console.info(
                    `[NAVTRACE] ${name}:done`
                );
                return result;
            };
        });
    });
}

test.describe(
    "Assessment navigation resilience",
    () => {
        test.setTimeout(25_000);

        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({
                width: 1280,
                height: 900
            });

            await page.addInitScript(() => {
                localStorage.clear();
                sessionStorage.clear();
            });
        });

        test(
            "advances from business stage to workforce without stalling",
            async ({ page }) => {
                page.on("console", (message) => {
                    if (
                        message.text().includes(
                            "[NAVTRACE]"
                        )
                    ) {
                        console.log(message.text());
                    }
                });

                await page.goto(
                    "/analyze-company.html"
                );
                await waitForAssessment(page);
                await installNavigationTrace(page);

                await page.getByRole(
                    "button",
                    { name: "Start my advisory" }
                ).click();

                await page.locator("#companyName").fill(
                    "Navigation Resilience Company"
                );
                await page.locator("#industry").fill(
                    "Information Technology / SaaS"
                );
                await page.locator("#nature").fill(
                    "We provide HR technology services to growing companies."
                );
                await page.locator("#nextButton").click();

                await expect(
                    page.locator("#stepTitle")
                ).toContainText(
                    "context around its stage"
                );

                await page.locator("#founded").fill("2022");
                await page.locator("#entity").selectOption(
                    "Private Limited"
                );
                await expect(
                    page.locator("#nextButton")
                ).not.toHaveAttribute(
                    "aria-busy",
                    "true"
                );
                await page.locator("#nextButton").click();

                await expect(
                    page.locator("#stepTitle")
                ).toContainText(
                    "Who helps the organisation deliver"
                );
            }
        );
    }
);
