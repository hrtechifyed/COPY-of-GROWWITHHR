# GrowWithHR Current File Overview

This inventory describes the deployed `0.18.0` product. Historical detail belongs in `docs/releases/` and archived audit documents.

## Public surfaces

- `index.html` — homepage.
- `analyze-company.html` — single stable public assessment.
- `assessment.html` — compatibility redirect to the stable assessment.
- `official-resources.html` — source information.
- `sample-advisory-report.html` — fictional illustrative sample.
- `more-info.html` — about, privacy and contact.

## Private review surface

- `analyze-company-v3.html` — no-index M1-M3 private beta; feature flag remains off.

## Runtime

- `app.js`, `styles.css`, `css/`, `js/` — static production application.
- `server-entry.js` — production Node entrypoint with exact-origin CORS handling for GitHub Pages delivery.
- `server.js` — Gmail delivery backend, `/api/health` and `/api/send-advisory`.
- `data/` — governed catalogs, schemas and knowledge material.

## Quality and governance

- `tests/`, `playwright.config.ts`, `.github/workflows/` — maintained automated checks, including CORS preflight coverage.
- `README.md`, `CHANGELOG.md`, `ROADMAP.md`, `docs/` — canonical documentation.
- `apps/web/src/` — archived React/TypeScript experiment; not deployed.
