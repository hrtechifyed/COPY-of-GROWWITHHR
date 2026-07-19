# GrowWithHR v0.15.0-beta

**Release name:** Gmail Advisory Delivery and HRTechify Brand Alignment  
**Release date:** July 19, 2026  
**Brand:** HRTechify  
**Tagline:** People • Technology • Growth

---

## Overview

GrowWithHR v0.15.0-beta introduces a working end-to-end Executive Advisory
assessment and report-delivery experience.

Users can:

1. Complete the GrowWithHR assessment.
2. Review their company information.
3. Generate a personalised advisory report.
4. Download the report as a PDF.
5. Request delivery of the PDF by email.
6. Resend a prepared report where supported.

The release includes:

- browser-based assessment progress;
- rules-based advisory preparation;
- browser-side PDF generation;
- a Node.js and Express delivery backend;
- Gmail API delivery using Google OAuth 2.0;
- branded HTML and plain-text customer emails;
- optional internal assessment notifications;
- stronger request and attachment validation;
- shared HRTechify branding;
- corrected architecture, privacy and data-flow documentation.

GrowWithHR remains a beta-stage, rules-based executive advisory product.

The current delivered report primarily focuses on the compliance pillar while
the wider people, growth and governance framework continues to develop.

---

## Major Release Highlights

### Gmail API advisory delivery

GrowWithHR sends advisory reports using the Gmail API over HTTPS.

The delivery flow is:

```text
User completes the Executive Advisory assessment
        |
        v
GrowWithHR prepares the advisory report
        |
        v
The PDF is generated in the browser
        |
        v
The user requests email delivery
        |
        v
The browser sends recipient, report and PDF data
        |
        v
POST /api/send-advisory
        |
        v
The backend validates the request and attachment
        |
        v
The Gmail API sends the customer email and PDF
        |
        +--> Optional internal notification
```

The backend uses Google OAuth 2.0 credentials.

The current production delivery flow does not use:

- SMTP;
- Gmail App Passwords;
- browser-side Gmail credentials;
- the retained legacy EmailJS delivery implementation.

---

## Branded Customer Email

Customers receive a responsive HRTechify-branded email containing:

- a personalised greeting;
- the organisation name;
- a clear PDF attachment notice;
- a summary of the advisory;
- practical next-step guidance;
- a reply-to contact option;
- a founder signature;
- a compact HRTechify footer bar;
- the HRTechify logo;
- the tagline:

  **People • Technology • Growth**

A plain-text email alternative is included for email applications that do not
display HTML content.

External images may be hidden by some email clients until the recipient allows
them.

---

## PDF Advisory Attachment

The advisory report is generated as a PDF in the browser.

The user may:

- download the PDF;
- request delivery of the PDF by email;
- resend the prepared report where supported.

Before sending an attachment, the backend checks that:

- PDF data was supplied;
- the attachment contains valid Base64 data;
- the decoded file has a valid PDF signature;
- the attachment does not exceed the configured size limit;
- the attachment filename is converted to a safe format.

The current customer-facing report primarily covers the compliance pillar, even
when the assessment collects information about wider people or growth
priorities.

---

## Internal Assessment Notifications

GrowWithHR may send a separate internal notification when a user completes an
assessment and requests report delivery.

The notification may include:

- recipient name;
- email address;
- organisation;
- role;
- industry;
- approximate employee count;
- hiring plans;
- selected priorities;
- submission time;
- delivery status.

The internal notification is separate from the customer advisory email.

The configured notification recipient should receive only information required
for the stated operational or follow-up purpose.

---

## Backend and Deployment Improvements

This release includes a Node.js and Express backend with:

- Gmail API integration;
- Google OAuth 2.0 authentication;
- request validation;
- recipient email-address validation;
- Base64 validation;
- PDF-signature validation;
- attachment-size enforcement;
- safe attachment filename handling;
- request rate limiting;
- plain-text and HTML MIME email generation;
- customer email handling;
- internal notification handling;
- protected server and environment-file paths;
- operational error handling;
- deployment health reporting;
- Render deployment support.

---

## API Endpoints

### Health endpoint

```text
GET /api/health
```

The health endpoint is used to check:

- backend availability;
- Gmail delivery configuration;
- required environment-variable availability.

A configured deployment may return a response similar to:

```json
{
  "ok": true,
  "version": "gmail-api-v1",
  "provider": "gmail-api",
  "gmailConfigured": true,
  "missingVariables": []
}
```

The endpoint must not return:

- OAuth client secrets;
- refresh tokens;
- Gmail passwords;
- environment-variable values;
- recipient information.

### Advisory-delivery endpoint

```text
POST /api/send-advisory
```

The endpoint receives the information required to validate and send the
advisory.

It may process:

- recipient information;
- company information used for personalisation;
- assessment answers required for the advisory;
- prepared report data;
- generated PDF data;
- attachment metadata;
- delivery metadata.

---

## Shared HRTechify Branding

Public pages and customer emails use a more consistent HRTechify identity.

The shared footer is:

```text
© 2026 HRTechify. All Rights Reserved. People • Technology • Growth
```

This release improves consistency across:

- public-page headers;
- public-page footers;
- customer emails;
- generated report output;
- navigation;
- responsive layouts.

The Analyze Company page also avoids page-level text rules that incorrectly
enlarge shared footer content.

---

## Executive Advisory Assessment

The current assessment guides users through structured company context.

The assessment may cover:

1. Business and organisation details.
2. Industry and legal-entity context.
3. Workforce size and composition.
4. Operating footprint.
5. Office, remote or hybrid arrangements.
6. Hiring and expansion plans.
7. Leadership and people priorities.
8. Review and recipient confirmation.
9. PDF generation.
10. Email delivery.

Recommendations remain deterministic and rules-based.

GrowWithHR does not present the advisory as a replacement for:

- legal advice;
- tax advice;
- payroll advice;
- statutory advice;
- financial advice;
- employment-law advice;
- professional HR advice.

---

## Browser Progress and Data Handling

The previous open-tab-only architecture description is no longer accurate.

The current assessment may retain limited information in the user's browser to
support same-browser continuity.

Current browser-storage keys include:

```text
growwithhr-advisory-briefing-v2
growwithhr-report
growwithhr-lead
growwithhr-advisory-delivery-v1
growwithhr-industry-catalog-v1
```

Browser storage may support:

- assessment progress;
- current journey position;
- prepared report state;
- recipient details;
- delivery status;
- cached industry reference data.

This storage is not:

- a user account;
- cloud save;
- cross-device resume;
- a persistent assessment database;
- a compliance workspace.

---

## Current Data Flow

Current data handling includes:

1. Company and workforce information is entered in the browser.
2. Assessment logic primarily runs in the browser.
3. Limited progress may be stored in browser `localStorage`.
4. The advisory model is prepared in the browser.
5. The PDF is generated in the browser.
6. Information leaves the browser when the user requests email delivery.
7. The backend validates and processes the delivery request.
8. The Gmail API sends the email and attachment.
9. Sent emails and PDFs may remain in the connected Gmail account.
10. Operational delivery information may appear in application or hosting logs.

The backend does not currently intentionally save completed assessments in a
dedicated GrowWithHR application database.

Detailed documentation is available in:

```text
docs/ARCHITECTURE.md
docs/DATA_FLOW.md
more-info.html
```

---

## Current Beta Scope

### Included

- Static HRTechify landing and information pages.
- Guided Executive Advisory assessment.
- Company and workforce context capture.
- Browser-based progress.
- Same-browser resume behaviour.
- Assessment review before report generation.
- Deterministic advisory recommendations.
- Compliance-focused PDF report generation.
- Browser PDF download.
- Gmail API customer email delivery.
- PDF email attachments.
- Branded HTML customer email.
- Plain-text email alternative.
- Optional internal assessment notification.
- Reply-to email support.
- Backend request rate limiting.
- Gmail API health checks.
- Render backend deployment support.
- Shared header and footer branding.
- Responsive desktop, laptop, tablet and mobile layouts.
- Experimental React and TypeScript UX components.
- Structured compliance and official-source data.
- Automated frontend, assessment, UX and end-to-end tests.

### Not included

- Customer accounts.
- User authentication.
- Role-based authorisation.
- A persistent customer assessment database.
- Cloud-based saved reports.
- Cross-device resume links.
- A customer compliance workspace.
- Compliance evidence storage.
- Document uploads.
- An HRTechify administration dashboard.
- CRM integration.
- Google Drive report storage.
- Subscription billing.
- Automated marketing campaigns.
- Full production analytics and observability.
- RAG conversation-history storage.
- Automated compliance certification.
- Complete advisory coverage across every people and growth pillar.
- Automated deletion controls for sent Gmail messages.

---

## Current Technology

### Frontend

- HTML5;
- CSS3;
- JavaScript;
- static JSON data;
- browser `localStorage`;
- browser-side report generation;
- browser-side PDF generation;
- responsive HRTechify design system.

### Backend

- Node.js;
- Express;
- Gmail API;
- Google OAuth 2.0;
- `googleapis`;
- `express-rate-limit`;
- environment-variable configuration.

### Deployment

- GitHub repository;
- GitHub Pages for configured static content;
- Render web service for the backend;
- HTTPS API communication;
- private deployment environment variables.

### Experimental UX layer

- React and Next.js-ready TypeScript components;
- Zustand state management;
- component-scoped responsive CSS;
- Jest;
- Testing Library examples.

The experimental React layer remains separate from the main deployed static
experience.

---

## Required Environment Variables

The deployed backend may require:

```text
GMAIL_USER
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
INTERNAL_NOTIFICATION_EMAIL
REPLY_TO_EMAIL
PORT
```

These values must be stored privately in the deployment platform.

The following must never be committed to the repository:

- OAuth client secrets;
- OAuth refresh tokens;
- Gmail credentials;
- production API keys;
- private `.env` files;
- private recipient or customer information.

A Gmail refresh token must be treated like a password and revoked immediately
if exposed.

---

## Security and Reliability

This release includes:

- OAuth-based Gmail authorisation;
- no Gmail App Password requirement;
- recipient email validation;
- required-field validation;
- Base64 validation;
- PDF-signature validation;
- attachment-size enforcement;
- request rate limiting;
- safe attachment filenames;
- protected server and environment paths;
- non-secret health-check output;
- customer email error handling;
- internal notification error handling;
- controlled backend responses.

The current release does not yet provide:

- user authentication;
- tenant isolation;
- customer access controls;
- evidence-file scanning;
- stored-document encryption;
- customer audit logs;
- customer-controlled deletion;
- database backup and recovery.

Those controls must be designed before introducing the related persistent
features.

---

## Privacy and Documentation Alignment

This release corrects architecture and privacy documentation that previously
described the product as browser-only or open-tab-only.

The following files now describe the current system:

```text
README.md
FILES_OVERVIEW.md
docs/ARCHITECTURE.md
docs/DATA_FLOW.md
more-info.html
apps/web/src/components/UX/Privacy/DataHandling.tsx
apps/web/src/components/UX/Privacy/PrivacyPolicy.tsx
CHANGELOG.md
RELEASE_NOTES.md
```

The documentation now distinguishes:

- browser memory;
- browser `localStorage`;
- backend delivery processing;
- Gmail API processing;
- Gmail sent-message retention;
- operational logs;
- storage capabilities that are not currently provided.

---

## Future Persistence Gate

Before adding a database, user account, cloud save, compliance workspace,
document upload, evidence repository, CRM integration, analytics profile or RAG
conversation history, GrowWithHR must define:

1. The exact data fields to be stored.
2. The purpose of every stored field.
3. Consent or another lawful processing basis.
4. Retention periods.
5. Deletion procedures.
6. User access and correction procedures.
7. Authentication and authorisation.
8. Tenant isolation.
9. Encryption requirements.
10. Administrator access.
11. Audit logging.
12. Backup and recovery.
13. Schema migration.
14. Rollback and data-removal procedures.
15. Updated privacy information.
16. Security and privacy testing.
17. Product, privacy and legal approval.

No new persistence capability should be treated as production-ready until this
gate is complete.

---

## Known Limitations

- GrowWithHR remains in beta.
- The current report primarily focuses on compliance.
- Browser resume is limited to the same browser environment.
- Browser data may be cleared or replaced.
- Email delivery depends on the connected Google account and OAuth
  authorisation remaining active.
- External email images may be hidden by some email applications.
- Free hosting services may take time to wake after inactivity.
- There is no dedicated customer assessment database.
- There is no customer account or report history.
- There is no cross-device resume.
- There is no compliance evidence repository.
- There is no customer compliance workspace.
- There is no automated deletion control for sent Gmail messages.
- The advisory does not replace qualified professional advice.
- The React and Next.js-ready layer is not the primary deployed application.

---

## Next Release Focus

The next release should focus on the Compliance DNA foundation.

Priorities include:

- introducing the five-act company story;
- preserving the current production route during rollout;
- versioning saved assessment data;
- adding safe migration or reset behaviour;
- improving question branching;
- separating user facts from inferred facts;
- improving applicability statuses;
- connecting recommendations to triggering answers;
- connecting obligations to official sources;
- separating applicability from evidence status;
- improving PDF layout and accessibility;
- expanding privacy and consent testing;
- adding automated Gmail API integration tests;
- strengthening deployment monitoring;
- continuing mobile and tablet validation.

New database, account, CRM, document-storage and RAG features should not be
included until the persistence gate is complete.

---

## Product Direction

GrowWithHR is progressing toward a traceable Compliance DNA and Executive
Advisory platform built around:

- a story-led company assessment;
- explainable recommendations;
- deterministic compliance foundations;
- practical people-governance guidance;
- official-source mapping;
- clear recommendation triggers;
- leadership-ready reports;
- secure customer communication;
- responsive executive experiences;
- evidence-aware compliance status;
- controlled future persistence.

Every recommendation should eventually explain:

1. Why it appears.
2. Which assessment fact triggered it.
3. Which applicability rule produced it.
4. Which official source supports it.
5. What the organisation should do next.
6. What evidence is required.
7. What requires confirmation from a qualified adviser.

---

## Planned RAG Boundary

A future RAG layer may support:

- plain-language explanations;
- statutory and official-source retrieval;
- citations;
- definitions;
- exceptions;
- legal-update summaries;
- follow-up research questions.

RAG must not independently determine:

- legal applicability;
- compliance status;
- evidence validity;
- registration status;
- filing completion;
- penalty amounts without verified sources and effective dates.

Applicability must remain deterministic and traceable to company facts.

---

## Disclaimer

GrowWithHR provides general strategic guidance and structured advisory
information.

It does not replace:

- legal advice;
- financial advice;
- tax advice;
- payroll advice;
- statutory advice;
- employment-law advice;
- compliance advice from a qualified professional;
- professional HR advice.

Users should confirm applicable obligations with qualified advisers and the
relevant official authorities.

---

## Release Information

```text
Version: v0.15.1-beta
Release name: Gmail Advisory Delivery and HRTechify Brand Alignment
Release date: July 19, 2026
Brand: HRTechify
Tagline: People • Technology • Growth
```

---

## Copyright

Copyright © 2026 HRTechify.

All Rights Reserved.

People • Technology • Growth
