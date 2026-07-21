# GrowWithHR Known Issues and Release Blockers

Last reviewed: 21 July 2026

## Security follow-through

The historically committed `.env` was removed from reachable Git history and the Gmail/OAuth credentials were rotated before restoring live delivery. Remaining administrative follow-through is to complete any GitHub cached-reference purge/support request and re-run the final secret-scanning review.

Current `.gitignore` blocks `.env` and `.env.*` while retaining the placeholder-only `.env.example`.

## Deployment boundary

The GitHub Pages site is static, but its public assessment now sends explicit email-delivery requests to the Render backend. The Render entrypoint permits the exact `https://hrtechifyed.github.io` origin, supports the required browser preflight request and rejects unapproved cross-origin API calls. The Render deployment must continue using `npm start` so `server-entry.js` is loaded.

A free or sleeping Render service may introduce a cold-start delay before the first email request. The client should wait for the request to complete rather than retrying repeatedly.

## Manual verification still required

Automated Chromium, WebKit and mobile-emulation checks do not replace a physical iOS/Android touch test or a real Safari device test. Complete those checks before a client session.

## Intentional limitations

- The public route remains the stable four-chapter assessment.
- The M1-M3 v3 route remains private and no-index.
- No accounts, cloud persistence, cross-device resume or evidence repository exist.
- Applicability and evidence status are advisory and separate; no output is legal certification.
