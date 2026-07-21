import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = 41000 + (process.pid % 1000);
const baseUrl = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["server-entry.js"], {
    env: {
        ...process.env,
        PORT: String(port),
        GMAIL_USER: "sender@example.com",
        GOOGLE_CLIENT_ID: "test-client-id",
        GOOGLE_CLIENT_SECRET: "test-client-secret",
        GOOGLE_REFRESH_TOKEN: "test-refresh-token"
    },
    stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
child.stdout.on("data", (chunk) => {
    output += chunk.toString();
});
child.stderr.on("data", (chunk) => {
    output += chunk.toString();
});

async function waitForServer() {
    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
        if (child.exitCode !== null) {
            throw new Error(`Server exited before tests ran.\n${output}`);
        }
        try {
            const response = await fetch(`${baseUrl}/api/health`);
            if (response.ok) return;
        } catch (error) {
            // Server is still starting.
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`Timed out waiting for server.\n${output}`);
}

try {
    await waitForServer();

    const preflight = await fetch(`${baseUrl}/api/send-advisory`, {
        method: "OPTIONS",
        headers: {
            Origin: "https://hrtechifyed.github.io",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"
        }
    });

    assert.equal(preflight.status, 204);
    assert.equal(
        preflight.headers.get("access-control-allow-origin"),
        "https://hrtechifyed.github.io"
    );
    assert.match(
        preflight.headers.get("access-control-allow-methods") || "",
        /POST/
    );

    const sameOrigin = await fetch(`${baseUrl}/api/health`, {
        headers: { Origin: baseUrl }
    });
    assert.equal(sameOrigin.status, 200);
    assert.equal(sameOrigin.headers.get("access-control-allow-origin"), baseUrl);

    const blocked = await fetch(`${baseUrl}/api/health`, {
        headers: { Origin: "https://example.invalid" }
    });
    assert.equal(blocked.status, 403);

    console.log("Server CORS checks passed.");
} finally {
    child.kill("SIGTERM");
}
