# GrowWithHR Data Flow

> Last Updated: July 2026  
> Current application version: refer to `package.json`

---

## 1. Purpose

This document explains what information GrowWithHR currently handles, where it
is processed, when it leaves the browser, and which forms of persistence are
not yet implemented.

It describes the current Executive Advisory flow.

Future Compliance DNA, workspace, document and RAG features must update this
document before release.

---

## 2. Current Data Categories

GrowWithHR may handle the following categories during the assessment and
delivery journey.

### Company context

- company name;
- industry;
- legal-entity type;
- business stage;
- funding or growth stage;
- operating states or countries;
- locations and work model.

### Workforce context

- approximate employee count;
- workforce composition;
- remote or distributed-work information;
- contractors, consultants, interns or other workforce groups;
- hiring direction;
- HR or People-function structure.

### Assessment and advisory data

- selected answers;
- navigation and completion state;
- inferred company context;
- rules-based recommendations;
- prepared report data;
- PDF-generation state.

### Recipient and delivery data

- recipient name;
- recipient email address;
- recipient role;
- marketing-consent selection, where presented;
- delivery status;
- generated PDF;
- delivery errors or retry state.

### Reference and cache data

- industry catalogue;
- application configuration;
- non-sensitive build or delivery metadata.

GrowWithHR should not request confidential employee-level medical, identity,
disciplinary, payroll or performance data during the general company
assessment.

---

## 3. Browser Processing

The following activities currently take place in the browser:

- rendering the assessment;
- validating answers;
- managing the story journey;
- preparing review summaries;
- applying current rules and recommendation logic;
- preparing the advisory model;
- rendering the dynamic report;
- generating the PDF;
- initiating report download;
- initiating email delivery;
- displaying delivery status.

Primary files include:

```text
analyze-company.html
js/executive-assessment.js
js/pdf.js
js/executive-advisory-report.js
js/gmail-service.js
```

---

## 4. Browser Persistence

The deployed assessment uses `localStorage` for limited same-browser
continuity.

Current storage keys include:

```text
growwithhr-advisory-briefing-v2
growwithhr-report
growwithhr-lead
growwithhr-advisory-delivery-v1
growwithhr-industry-catalog-v1
```

Browser persistence may contain:

- assessment answers;
- the current assessment step;
- prepared report data;
- recipient details;
- delivery status;
- cached reference data.

Purpose:

- allow same-browser resume;
- restore a prepared report;
- support resend and delivery feedback;
- reduce repeated reference-data loading.

Limitations:

- no user account;
- no cloud save;
- no guaranteed cross-device availability;
- browser data may be cleared by the user or browser;
- restored data must be validated before use;
- future answer-schema changes require migration or safe reset.

---

## 5. Backend Transmission

Data leaves the browser when the user requests advisory email delivery.

Endpoint:

```text
POST /api/send-advisory
```

The request may include:

- recipient information;
- company and assessment information needed for personalisation;
- prepared report information;
- the generated PDF;
- attachment filename;
- delivery-related metadata.

The browser-side request is prepared by:

```text
js/gmail-service.js
```

The user should be informed before or at the point of delivery that information
will be transmitted to the backend for this purpose.

---

## 6. Backend Processing

The backend is implemented in:

```text
server.js
```

Current processing includes:

- request receipt;
- recipient email validation;
- required-field validation;
- PDF and Base64 validation;
- PDF-signature validation;
- attachment-size enforcement;
- safe filename handling;
- request rate limiting;
- plain-text email creation;
- HTML email creation;
- Gmail API delivery;
- optional internal notification;
- operational logging and error reporting.

The backend does not currently intentionally write completed assessments to a
GrowWithHR application database.

---

## 7. External Service Processing

### Gmail API

GrowWithHR uses the Gmail API with Google OAuth 2.0 to send reports.

The Gmail account may retain:

- the sent customer email;
- the PDF attachment;
- an internal assessment notification;
- delivery-related message metadata.

Retention depends on the connected Gmail account's settings and operational
practices.

GrowWithHR does not currently provide an in-product automated deletion control
for sent Gmail messages.

---

## 8. Current Data-Flow Diagram

```text
User enters company and workforce information
        |
        v
Browser memory
        |
        +--> localStorage
        |      |
        |      +--> same-browser progress
        |      +--> report state
        |      +--> recipient state
        |      +--> delivery status
        |
        v
Rules-based advisory preparation
        |
        v
Browser PDF generation
        |
        v
User requests email delivery
        |
        v
POST /api/send-advisory
        |
        v
Node.js / Express backend
        |
        +--> validation
        +--> rate limiting
        +--> MIME email construction
        +--> operational logs
        |
        v
Gmail API
        |
        +--> customer email and PDF
        +--> optional internal notification
```

---

## 9. Current Retention Summary

| Data | Current location | Current retention position |
|---|---|---|
| Active assessment state | Browser memory | Until navigation, refresh or replacement |
| Saved assessment progress | Browser `localStorage` | Until cleared, replaced or invalidated |
| Prepared report | Browser `localStorage` | Until cleared or replaced |
| Recipient details | Browser state and `localStorage` | Until cleared or replaced |
| Delivery request | Backend memory during processing | For the duration needed to process the request |
| Operational logs | Hosting or application logs | According to hosting and operational configuration |
| Sent email and PDF | Connected Gmail account | According to Gmail account settings |
| Dedicated assessment database copy | Not currently maintained | Not applicable |
| Cloud-saved assessment | Not currently maintained | Not applicable |
| RAG conversation history | Not currently maintained | Not applicable |

---

## 10. Current Data Recipients

Information may be processed by:

- the user's browser;
- the GrowWithHR Node.js/Express backend;
- the connected Gmail account and Gmail API;
- the configured internal notification recipient, when enabled;
- the hosting provider through ordinary operational logs.

GrowWithHR should not introduce additional recipients without updating this
document and the public privacy explanation.

---

## 11. Current Controls

Current controls include:

- browser-side required-field validation;
- backend recipient validation;
- Base64 and PDF-signature validation;
- PDF attachment-size limits;
- safe attachment filename handling;
- request rate limiting;
- environment-variable protection for Gmail credentials;
- no dedicated assessment database;
- no public exposure of server and environment files;
- same-browser restart and clear-progress behaviour.

Future releases should add explicit retention, deletion, audit and access
controls before introducing stored customer workspaces.

---

## 12. Current Exclusions

The current implementation does not provide:

- user accounts;
- cloud-saved assessments;
- cross-device resume;
- a customer assessment database;
- a compliance evidence repository;
- a document-management system;
- a CRM integration;
- a Google Drive integration;
- a multi-company customer dashboard;
- RAG conversation storage;
- automated Gmail deletion.

---

## 13. Future Persistence Checklist

Before adding any new persistent data store:

1. Identify every field to be stored.
2. Identify why each field is required.
3. Define consent or another lawful processing basis.
4. Define retention and deletion periods.
5. Define user access and correction.
6. Define tenant isolation.
7. Define roles and permissions.
8. Define encryption in transit and at rest.
9. Define administrator access and audit logs.
10. Define backups and restoration.
11. Define schema migration.
12. Define rollback and data deletion.
13. Update `docs/ARCHITECTURE.md`.
14. Update this document.
15. Update `more-info.html`.
16. Update in-product privacy components.
17. Add security and privacy tests.
18. Complete product, privacy and legal review.

---

## 14. Planned Compliance DNA Changes

The Compliance DNA assessment will require additional company, establishment,
workforce and operating facts.

During the initial story-engine releases:

- keep data browser-driven;
- ask only relevant adaptive questions;
- version the saved-answer schema;
- separate stated facts from inferred facts;
- do not describe applicability as verified compliance;
- do not add new remote storage without completing the persistence checklist.

When a future compliance workspace is introduced, this document must specify:

- company account storage;
- establishment records;
- compliance obligations;
- due dates;
- uploaded evidence;
- user roles;
- audit history;
- deletion and export procedures.

---

## 15. Planned RAG Changes

Before RAG is enabled, document:

- which questions and prompts are stored;
- whether conversations are retained;
- which legal documents are retrieved;
- whether company-profile facts are sent to a model provider;
- which model providers process the request;
- retention settings at each provider;
- redaction and data-minimisation controls;
- tenant isolation;
- user deletion and export controls.

RAG must not be released with hidden conversation storage or undocumented
model processing.
