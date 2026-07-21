import { expect, test, type Page } from "@playwright/test";

const route = "/analyze-company-v3.html";
const key = "growwithhr-advisory-briefing-v2";
const expectedRules = 7;

function state() {
    return {
        version: "2.1.0",
        schemaVersion: 1,
        started: true,
        completed: true,
        currentMoment: 0,
        answers: {
            companyName: "Example Private Limited",
            industry: "Technology",
            entity: "Private Limited",
            employees: 32,
            contractWorkers: 4,
            interns: 2,
            apprentices: 1,
            workModel: "Hybrid",
            remoteBand: "25-50",
            primaryState: "Maharashtra",
            locations: 3,
            countries: 1,
            hiringPlans: "Significant Growth",
            expansionPlans: ["new-locations", "scale-operations"],
            peopleFunction: "Founder Led",
            priorities: ["policies-compliance", "workforce-planning"]
        },
        lead: { name: "", email: "", role: "", marketingConsent: false },
        ui: { showSupplementalWorkforce: true },
        updatedAt: "2026-07-21T10:00:00.000Z"
    };
}

async function install(page: Page) {
    await page.addInitScript(({ storageKey, value }) => {
        localStorage.setItem(storageKey, JSON.stringify(value));
    }, { storageKey: key, value: state() });
}

async function open(page: Page) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
}

async function expectPhase(page: Page, phase: "ready" | "empty" | "error") {
    await expect(page.locator("#dnaComplianceStory"))
        .toHaveAttribute("data-story-state", phase);
}

test.describe("M3 Compliance Story", () => {
    test("renders one safe story from the governed M2 result", async ({ page }) => {
        await install(page);
        await open(page);
        await expectPhase(page, "ready");

        const root = page.locator("#dnaComplianceStory");
        await expect(root).toBeVisible();
        await expect(root).toHaveAttribute("data-model-version", "1.0.0");
        await expect(root).toHaveAttribute("data-traceability-contract-version", "1.0.0");
        await expect(page.locator("#dnaComplianceStoryHeadline"))
            .toContainText("current advisory");
        await expect(page.locator("#dnaComplianceStoryApplicableCount"))
            .toHaveText(String(expectedRules));
        await expect(page.locator("#dnaComplianceStoryEvidenceCount"))
            .toHaveText(String(expectedRules));
        await expect(page.locator(
            "#dnaComplianceStoryPriorityList .dna-compliance-story__obligation-card"
        )).toHaveCount(3);
        await expect(page.locator(
            "#dnaComplianceStoryGroupList .dna-compliance-story__obligation-card"
        )).toHaveCount(expectedRules);
        await expect(page.locator("#dnaComplianceStorySnapshotList"))
            .toContainText("Example Private Limited");

        const priority = page.locator(
            "#dnaComplianceStoryPriorityList .dna-compliance-story__obligation-card"
        ).first();
        await expect(priority).toContainText("Why this appears");
        await expect(priority).toContainText("Next action");
        await expect(priority).toContainText("Implications");
        await expect(priority).toContainText("Evidence: Not requested");

        const source = priority.locator(".dna-compliance-story__source-link").first();
        await expect(source).toHaveAttribute("href", /^https:\/\//);
        await expect(source).toHaveAttribute("target", "_blank");
        await expect(source).toHaveAttribute("rel", /noopener/);

        const controller = await page.evaluate(() => (
            window as Window & {
                GrowWithHRComplianceStory?: { getState: () => unknown };
            }
        ).GrowWithHRComplianceStory?.getState() || null);

        expect(controller).toMatchObject({
            version: "1.0.0",
            modelVersion: "1.0.0",
            phase: "ready",
            hasModel: true,
            source: "m2-recommendation-traceability",
            protectedStateReadOnly: true,
            stableReportMutation: false
        });
        await expect(page.locator("#dnaTraceability"))
            .toHaveAttribute("data-traceability-state", "ready");
    });

    test("shows a safe empty state without saved answers", async ({ page }) => {
        await open(page);
        await expectPhase(page, "empty");
        const panel = page.locator("#dnaComplianceStoryEmpty");
        await expect(panel).toBeVisible();
        await expect(panel).toContainText("No saved assessment answers found");
        await expect(panel.getByRole("link", {
            name: "Open the stable assessment",
            exact: true
        })).toHaveAttribute("href", "analyze-company.html");
        await expect(page.locator("#dnaComplianceStoryContent")).toBeHidden();
    });

    test("shows a safe error when the governed catalog cannot load", async ({ page }) => {
        await page.route("**/data/assessment/recommendation-rules.v1.json", async (request) => {
            await request.fulfill({
                status: 503,
                contentType: "application/json",
                body: JSON.stringify({ error: "Unavailable" })
            });
        });
        await install(page);
        await open(page);
        await expectPhase(page, "error");
        const panel = page.locator("#dnaComplianceStoryError");
        await expect(panel).toBeVisible();
        await expect(page.locator("#dnaComplianceStoryErrorMessage"))
            .toContainText("status 503");
        await expect(panel.getByRole("link", {
            name: "Use the stable assessment",
            exact: true
        })).toHaveAttribute("href", "analyze-company.html");
    });

    test("remains readable and keyboard-operable on mobile", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await install(page);
        await open(page);
        await expectPhase(page, "ready");

        const columns = await page.locator(".dna-compliance-story__metrics")
            .evaluate((node) => getComputedStyle(node)
                .gridTemplateColumns.split(/\s+/).filter(Boolean).length);
        expect(columns).toBe(1);

        const root = page.locator("#dnaComplianceStory");
        expect(await root.evaluate((node) => node.scrollWidth <= node.clientWidth + 1))
            .toBe(true);

        const details = page.locator(
            "#dnaComplianceStoryPriorityList .dna-compliance-story__obligation-card details"
        ).first();
        await details.locator("summary").focus();
        await page.keyboard.press("Enter");
        await expect(details).toHaveAttribute("open", "");
        await expect(page.locator("#dnaComplianceStoryGroupList")).toBeVisible();
    });
});
