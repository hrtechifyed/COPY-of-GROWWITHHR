# GrowWithHR Architecture

## Deployment decision

The production application is the root-level static HTML/CSS/JavaScript site. `server.js` supplies the optional Gmail delivery API and `server-entry.js` is the CORS-aware production entrypoint used by Render. `apps/web/src` is an archived experimental React/TypeScript UX layer and is not part of the deployed build.

## Public architecture

1. `index.html` presents the product and links to `analyze-company.html`.
2. The stable assessment modules validate answers and persist same-browser progress under protected keys.
3. The stable report mapper prepares the advisory record.
4. `js/pdf.js` generates the PDF in the browser.
5. When email delivery is requested, `js/gmail-service.js` sends a data-minimised request to `POST /api/send-advisory`.
6. On Render the client uses the relative API route; on the approved GitHub Pages deployment the client uses `https://growwithhr.onrender.com/api/send-advisory`.
7. `server-entry.js` permits the exact GitHub Pages origin, answers the browser preflight request and rejects unapproved cross-origin API calls.
8. `server.js` validates the request, applies rate limiting and sends through the Gmail API.

The default approved cross-origin client is `https://hrtechifyed.github.io`. Additional approved origins may be configured through the comma-separated `ALLOWED_CORS_ORIGINS` deployment variable. Wildcard origins are not used.

## Private-beta architecture

`/analyze-company-v3.html` is no-index and disabled from public routing by default. M1-M3 modules consume protected assessment answers through compatibility adapters and produce isolated traceability/Compliance Story output. They do not write a new traceability key or change stable report, PDF, email or delivery contracts.

## Protected browser keys

- `growwithhr-advisory-briefing-v2`
- `growwithhr-report`
- `growwithhr-lead`
- `growwithhr-advisory-delivery-v1`
- `growwithhr-industry-catalog-v1`

Feature-flag overrides use the documented `growwithhr-feature-` prefix and are not assessment records.
