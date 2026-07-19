# GrowWithHR Architecture

> Last Updated: July 2026  
> Current application version: refer to `package.json`

---

## 1. Overview

GrowWithHR currently combines five implementation layers:

1. A deployed static HTML, CSS and JavaScript application.
2. Browser-side assessment state and limited `localStorage` persistence.
3. Browser-side advisory report and PDF generation.
4. A Node.js and Express backend used for report delivery.
5. Gmail API delivery using Google OAuth 2.0.

The repository also contains an experimental React and TypeScript UX layer under
`apps/web/src`. That layer is not the primary deployed application unless a
future release explicitly promotes it.

The current assessment is primarily browser-driven. Limited progress is stored
in the same browser to support resume, report continuity and delivery status.

When a user requests report delivery, the information required to prepare and
send the report is transmitted to the GrowWithHR backend.

GrowWithHR does not currently maintain a dedicated customer, assessment,
compliance-workspace or report database.

---

## 2. Current System Context

```text
User
  |
  v
GrowWithHR browser application
  |
  |-- Guided company assessment
  |-- Browser state
  |-- Limited localStorage persistence
  |-- Rules-based advisory preparation
  |-- PDF generation
  |-- Dynamic report rendering
  |
  v
POST /api/send-advisory
  |
  v
Node.js / Express backend
  |
  |-- Request validation
  |-- PDF validation
  |-- Rate limiting
  |-- MIME email construction
  |
  v
Gmail API
  |
  |-- Customer advisory email
  |-- PDF attachment
  |-- Optional internal notification
```

---

## 3. Current Data Architecture

### 3.1 Browser state

The deployed assessment maintains the active user journey in the browser.

The browser state may include:

- company and industry information;
- workforce information;
- operating-footprint information;
- growth and people-readiness information;
- assessment navigation state;
- report preparation state;
- recipient name, email and role;
- delivery status;
- cached industry reference data.

The primary deployed controller is:

```text
js/executive-assessment.js
```

### 3.2 Browser persistence

The deployed assessment uses `localStorage` for limited continuity and
convenience functions.

Current storage keys include:

```text
growwithhr-advisory-briefing-v2
growwithhr-report
growwithhr-lead
growwithhr-advisory-delivery-v1
growwithhr-industry-catalog-v1
```

These records support functions such as:

- saving and resuming progress in the same browser;
- restoring prepared report information;
- retaining recipient details used by the delivery flow;
- restoring delivery status;
- caching the industry catalogue.

This is not a user account, cloud-save system or cross-device persistence
service.

The assessment should continue to provide clear restart and clear-progress
controls.

Any future change to the saved-answer structure must introduce a schema version
and a migration or safe-reset strategy.

### 3.3 Browser-side report preparation

The browser prepares the advisory model and generates the PDF.

Important files include:

```text
js/executive-assessment.js
js/pdf.js
js/executive-advisory-report.js
executive-advisory-report.html
```

The current advisory is rules-based.

The system must not describe deterministic recommendations as legal
certification or unrestricted professional advice.

### 3.4 Backend transmission

Data is transmitted to the backend when the user requests advisory email
delivery.

The browser-side client is:

```text
js/gmail-service.js
```

The primary delivery endpoint is:

```text
POST /api/send-advisory
```

The request may include:

- recipient information;
- company information used for personalisation;
- assessment answers;
- prepared report data;
- the generated PDF;
- delivery-related metadata.

### 3.5 Backend processing

The backend is implemented in:

```text
server.js
```

Its current responsibilities include:

- serving the static site where applicable;
- exposing `GET /api/health`;
- exposing `POST /api/send-advisory`;
- validating recipient email addresses;
- validating PDF and Base64 content;
- enforcing the PDF attachment-size limit;
- sanitising attachment filenames;
- applying request rate limiting;
- constructing plain-text and HTML email alternatives;
- sending messages through the Gmail API;
- sending an optional internal completion notification;
- producing operational logs.

The backend does not currently intentionally save completed assessments in a
GrowWithHR application database.

### 3.6 Gmail processing and retention

The Gmail API is used to send advisory reports.

Sent emails and PDF attachments may remain in the connected Gmail account
according to that account's configuration, security controls and retention
practices.

Gmail retention is separate from browser `localStorage`.

---

## 4. High-Level User and Data Flow

```text
Open Analyze My Company
        |
        v
Start or resume the assessment
        |
        v
Answer guided company questions
        |
        |-- Progress may be saved in the same browser
        |
        v
Review assessment answers
        |
        v
Enter recipient information
        |
        v
Prepare rules-based advisory
        |
        v
Generate advisory PDF in the browser
        |
        v
Request email delivery
        |
        v
Backend validates recipient and PDF
        |
        v
Gmail API sends customer email
        |
        |-- Optional internal notification
        |
        v
User may view, download or resend the prepared report
```

---

## 5. Application Layers

### 5.1 Public static application

Location:

```text
Repository root HTML, CSS and JavaScript files
```

Responsibilities:

- public website and navigation;
- Analyze My Company assessment;
- assessment progress and review;
- browser save and resume;
- report preparation;
- PDF generation;
- report rendering;
- delivery request initiation;
- shared site shell and responsive behaviour.

Important files include:

```text
index.html
analyze-company.html
executive-advisory-report.html
sample-advisory-report.html
more-info.html
official-resources.html
js/executive-assessment.js
js/gmail-service.js
js/pdf.js
js/executive-advisory-report.js
js/site-shell.js
```

### 5.2 Backend delivery layer

Location:

```text
server.js
```

Responsibilities:

- advisory-delivery API;
- health-check API;
- request and attachment validation;
- rate limiting;
- Gmail API integration;
- internal notification delivery;
- operational error handling and logging.

### 5.3 Browser persistence layer

Primary location:

```text
js/executive-assessment.js
```

Responsibilities:

- writing current assessment progress;
- restoring a saved assessment;
- retaining prepared report state;
- retaining lead and recipient state;
- retaining delivery status;
- clearing or restarting saved state.

Before the Compliance DNA flow changes the answer structure, this layer must
support:

- a schema version;
- backward-compatible reading where practical;
- a safe reset when migration is impossible;
- validation before restored data is used;
- separation of current, legacy and experimental state.

### 5.4 Rules and knowledge layer

Locations include:

```text
data/compliance-engine.json
data/compliance-rules.json
data/requirements/requirements.json
data/knowledge-base/**
js/core/**
js/modules/compliance/**
```

Responsibilities:

- deterministic rule evaluation;
- applicability and recommendation support;
- structured compliance requirements;
- source and citation metadata;
- explainability and traceability.

RAG must not replace deterministic applicability rules.

### 5.5 Experimental React and TypeScript layer

Location:

```text
apps/web/src
```

This layer contains experimental components, state, services and tests.

It is not the primary deployed application unless explicitly promoted by a
future release.

Documentation and user-facing copy in this layer must not contradict the
deployed static application.

Privacy components must accurately disclose browser persistence, backend
delivery and Gmail retention.

---

## 6. Current Storage and Processing Summary

| Data or activity | Current location | Current purpose |
|---|---|---|
| Active assessment answers | Browser memory | Run the assessment |
| Saved assessment progress | Browser `localStorage` | Same-browser resume |
| Prepared report state | Browser `localStorage` | Restore and render the report |
| Recipient details | Browser state and limited `localStorage` | Prepare and deliver the report |
| Generated PDF | Browser, then backend request | Download and email delivery |
| Delivery request | Node.js/Express backend | Validate and send the report |
| Sent email and PDF | Connected Gmail account | Customer delivery |
| Operational status | Browser and application logs | Delivery feedback and troubleshooting |
| Dedicated assessment database | Not currently used | Not applicable |
| User-account storage | Not currently used | Not applicable |
| Cross-device resume | Not currently provided | Not applicable |
| Compliance evidence storage | Not currently provided | Not applicable |
| RAG conversation history | Not currently provided | Not applicable |

---

## 7. Privacy and Data-Handling Principles

GrowWithHR should follow these principles:

- collect only information needed to prepare and deliver the advisory;
- avoid requesting confidential employee-level personal, medical, payroll,
  disciplinary or performance records during the general company assessment;
- clearly distinguish browser storage from backend processing;
- disclose when information is sent for email delivery;
- disclose that sent emails and attachments may remain in Gmail;
- do not describe the current product as entirely no-storage;
- do not imply that backend processing or email delivery does not occur;
- do not introduce new persistence without a documented purpose;
- do not add hidden CRM, analytics, document or admin storage;
- keep user-facing privacy copy aligned with the deployed implementation;
- update retention, deletion and access information before new storage
  launches.

The current public privacy explanation is in:

```text
more-info.html
```

Experimental React privacy components are in:

```text
apps/web/src/components/UX/Privacy/DataHandling.tsx
apps/web/src/components/UX/Privacy/PrivacyPolicy.tsx
```

The detailed current-state data flow is documented in:

```text
docs/DATA_FLOW.md
```

---

## 8. Current Exclusions

GrowWithHR does not currently provide:

- a dedicated assessment database;
- user accounts;
- cloud-saved assessments;
- cross-device resume;
- a persistent customer-report database;
- a customer compliance workspace;
- document or evidence storage;
- CRM synchronisation;
- Google Drive storage;
- automated deletion controls for sent Gmail messages;
- RAG conversation history;
- multi-tenant company workspaces.

These exclusions must be re-evaluated and documented before the relevant
features are released.

---

## 9. Future Persistence Approval Gate

Before adding a database, user accounts, a compliance workspace, document
uploads, evidence storage, CRM integration, analytics profiles or RAG
conversation history, complete all of the following:

1. Define the exact data fields to be stored.
2. Define the product purpose for each stored field.
3. Define the legal basis or consent model.
4. Define retention and deletion periods.
5. Define user access, correction and deletion procedures.
6. Define tenant and company-data isolation.
7. Define authentication and authorisation.
8. Define encryption requirements.
9. Define administrator access and audit logging.
10. Define backup, recovery and deletion behaviour.
11. Define schema versioning and migrations.
12. Define rollback and data-removal procedures.
13. Update this architecture document.
14. Update `docs/DATA_FLOW.md`.
15. Update public privacy notices.
16. Update in-product privacy components.
17. Add security, privacy, migration and deletion tests.
18. Obtain the required product, privacy and legal approvals.

No new persistence capability should be treated as production-ready until this
gate is completed.

---

## 10. Planned Compliance DNA Architecture

The Compliance DNA experience should initially build on the current
browser-driven architecture.

```text
Five-act company story
        |
        v
Adaptive question and branch engine
        |
        v
Company, establishment and workforce profile
        |
        v
Deterministic inference and applicability rules
        |
        v
Compliance Story report
        |
        v
Future consent-based compliance workspace
```

The planned system should separate:

1. **Profile facts** — what the user said or confirmed.
2. **Inferences** — classifications derived from profile facts.
3. **Applicability rules** — deterministic legal and compliance conditions.
4. **Compliance obligations** — registrations, registers, filings and actions.
5. **Evidence status** — whether compliance has been demonstrated.
6. **Explanation** — rationale, sources, consequences and next steps.

---

## 11. RAG Boundary

RAG should be introduced after the deterministic Compliance DNA foundation is
stable.

RAG may support:

- plain-language explanations;
- retrieval of statutory sections, rules and notifications;
- official-source citations;
- definitions and exceptions;
- change summaries;
- follow-up legal-research questions.

RAG must not independently determine:

- whether a law applies;
- whether the company is compliant;
- whether evidence is valid;
- the current status of a registration;
- a penalty amount without a verified source and effective date.

Applicability must remain rules-based and traceable to company facts.

---

## 12. Documentation Governance

The following files must remain aligned:

```text
README.md
FILES_OVERVIEW.md
docs/ARCHITECTURE.md
docs/DATA_FLOW.md
more-info.html
apps/web/src/components/UX/Privacy/DataHandling.tsx
apps/web/src/components/UX/Privacy/PrivacyPolicy.tsx
```

Whenever storage, delivery, external services or data retention change:

1. Update architecture.
2. Update data flow.
3. Update privacy copy.
4. Update release notes and changelog.
5. Verify that the deployed UI matches the documentation.
6. Review legacy and experimental pages for contradictory wording.
