import {
    defineConfig,
    devices
} from "@playwright/test";

const externalBaseURL =
    process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
    testDir: "./tests/e2e",
    timeout: 30_000,
    expect: {
        timeout: 8_000
    },
    fullyParallel: false,
    retries: process.env.CI ? 2 : 0,
    reporter: [
        ["list"],
        ["html", {
            outputFolder: "playwright-report",
            open: "never"
        }]
    ],
    use: {
        baseURL:
            externalBaseURL ||
            "http://127.0.0.1:4173",
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure"
    },
    webServer: externalBaseURL
        ? undefined
        : {
            command:
                "python3 -m http.server 4173",
            url:
                "http://127.0.0.1:4173",
            reuseExistingServer: true,
            timeout: 20_000
        },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"]
            }
        }
    ]
});
