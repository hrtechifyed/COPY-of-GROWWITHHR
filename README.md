# GrowWithHR

> Current application version: refer to `package.json`

**GrowWithHR** is an executive HR intelligence and advisory prototype developed
under the HRTechify brand.

It helps founders, business leaders and HR professionals explore company
context, statutory compliance, people-governance priorities and growth
readiness through structured assessments and explainable, rules-based
recommendations.

GrowWithHR is a beta-stage advisory product. It does not provide legal
certification or replace qualified legal, tax, payroll or HR advice.

---

## Current Product

The current GrowWithHR experience includes:

- a public static HTML, CSS and JavaScript website;
- an Executive Advisory company assessment;
- same-browser assessment progress;
- rules-based company and compliance analysis;
- a review step before report preparation;
- browser-side advisory report generation;
- browser-side PDF generation;
- PDF download;
- report delivery through a Node.js and Express backend;
- Gmail API delivery using Google OAuth 2.0;
- optional internal assessment-completion notifications;
- responsive layouts for desktop, laptop, tablet and mobile;
- an experimental React and TypeScript UX layer under `apps/web/src`.

---

## Executive Advisory Experience

The assessment currently guides users through company context that may affect
people, compliance and growth-readiness decisions.

The journey may collect:

- company name and industry;
- business and legal-entity context;
- workforce size and composition;
- work model;
- operating locations;
- hiring and expansion plans;
- people-management readiness;
- recipient details for report delivery.

The experience includes:

1. A branded executive introduction.
2. A guided multi-stage assessment.
3. Company and workforce context questions.
4. Browser-based progress continuity.
5. A review step.
6. Rules-based advisory preparation.
7. PDF generation.
8. Report download.
9. Optional email delivery.
10. Delivery-status feedback and resend support.

The advisory engine uses deterministic rules and structured data.

It must not present generated output as:

- legal certification;
- a government filing status;
- verified compliance without evidence;
- unrestricted legal or professional advice.

---

## Current End-to-End Flow

```text
Visitor opens analyze-company.html
        |
        v
js/executive-assessment.js starts or restores the assessment
        |
        +--> limited localStorage supports same-browser continuity
        |
        v
User completes and reviews company answers
        |
        v
Rules-based advisory model is prepared
        |
        v
js/pdf.js generates the PDF in the browser
        |
        +--> user may download the PDF
        |
        v
User requests email delivery
        |
        v
js/gmail-service.js sends recipient, report and PDF data
        |
        v
POST /api/send-advisory
        |
        v
server.js validates the request and attachment
        |
        v
Gmail API sends the customer email
        |
        +--> optional internal notification
```

---

## Advisory Email Delivery

GrowWithHR includes backend email delivery through the Gmail API.

When a user requests report delivery:

1. The advisory report is generated as a PDF in the browser.
2. The recipient details and information required for delivery are sent to the
   GrowWithHR backend over HTTPS.
3. The backend validates the request.
4. The backend validates the email address.
5. The backend validates the PDF attachment.
6. The backend applies request rate limits.
7. The backend constructs plain-text and HTML email alternatives.
8. The backend sends the report through the Gmail API.
9. An optional internal assessment notification may also be sent.

The customer email may include:

- a personalised greeting;
- the organisation name;
- a summary of the advisory;
- a PDF attachment notice;
- practical next-step guidance;
- a reply-to contact option;
- HRTechify branding;
- the tagline:

  **People • Technology • Growth**

Email delivery uses:

- Google OAuth 2.0;
- Gmail API;
- HTTPS;
- server-side environment variables.

SMTP, browser-side Gmail credentials and Gmail App Passwords are not the
current production delivery approach.

---

## Current Data and Privacy Approach

GrowWithHR does not currently maintain a dedicated assessment database.

Assessment information is primarily handled in the browser while the user
completes the experience.

Limited information may be stored in browser `localStorage` to support:

- same-browser assessment resume;
- prepared report continuity;
- recipient-state continuity;
- delivery-status continuity;
- cached reference information.

Current browser-storage keys include:

```text
growwithhr-advisory-briefing-v2
growwithhr-report
growwithhr-lead
growwithhr-advisory-delivery-v1
growwithhr-industry-catalog-v1
```

This browser storage is not:

- a user account;
- cloud save;
- cross-device resume;
- a customer assessment database;
- a compliance workspace.

When the user requests report delivery, information required to prepare and
send the advisory is transmitted to the GrowWithHR backend.

The backend:

- processes the delivery request;
- validates the recipient address;
- validates the PDF;
- does not intentionally save completed assessment answers to a dedicated
  GrowWithHR database;
- sends the report through the Gmail API;
- may write operational delivery information to application or hosting logs.

Sent emails and PDF attachments may remain in the connected Gmail account
according to that account's configuration and retention practices.

GrowWithHR currently does not provide:

- user accounts;
- cloud-based saved assessments;
- cross-device resume;
- a persistent report database;
- a customer compliance workspace;
- compliance evidence storage;
- document uploads;
- CRM synchronisation;
- Google Drive storage;
- RAG conversation-history storage;
- automated deletion controls for sent Gmail messages.

Any future database, account, CRM, analytics, document-storage,
compliance-workspace or RAG-history feature must be introduced deliberately
with:

- updated architecture documentation;
- updated data-flow documentation;
- updated privacy notices;
- defined retention and deletion rules;
- appropriate access controls;
- security testing;
- appropriate consent or other lawful processing basis.

Detailed documentation:

```text
docs/ARCHITECTURE.md
docs/DATA_FLOW.md
more-info.html
```

---

## Data-Minimisation Guidance

The general company assessment should collect only information required to
prepare and deliver the advisory.

Users should not enter confidential employee-level information such as:

- medical information;
- government identity numbers;
- bank details;
- individual payroll records;
- disciplinary records;
- individual performance records;
- confidential employee complaints;
- health or disability records.

The assessment should use company-level or aggregated workforce information
wherever possible.

---

## Key Features

- Company DNA assessment concept.
- Executive Intelligence framing.
- Compliance and growth-readiness analysis.
- Official-source mapping.
- Guided executive assessment.
- Same-browser progress continuity.
- Review before report generation.
- Contact and report-delivery form.
- Rules-based personalised advisory.
- Browser-side PDF generation.
- PDF download.
- Gmail API email delivery.
- Customer PDF attachment.
- Optional internal notifications.
- Plain-text and HTML email versions.
- Email request rate limiting.
- Backend health-check endpoint.
- Responsive HRTechify-branded interface.
- Shared public site shell.
- Accessibility and reduced-motion considerations.
- Structured compliance and knowledge-base data.
- Automated frontend, journey, UX and end-to-end tests.
- Experimental React and TypeScript components.

---

## Assessment Framework

The current assessment is organised around company context that may affect
people, compliance and growth-readiness decisions.

### 1. Company profile

- organisation name;
- industry;
- business stage;
- legal-entity and operating context.

### 2. Workforce context

- current employee population;
- workforce composition;
- contractors or other workforce categories;
- working model;
- people-management readiness.

### 3. Operating footprint

- state or regional presence;
- office, remote or hybrid arrangements;
- location and establishment context;
- expansion context;
- potential compliance complexity.

### 4. Growth plans

- hiring plans;
- funding or expansion signals;
- leadership priorities;
- people and compliance readiness.

The advisory engine may use these inputs to produce:

- priority areas;
- possible compliance applicability;
- compliance observations;
- maturity indicators;
- leadership considerations;
- recommended next steps.

A user declaration does not prove that an obligation has been completed.

Future compliance outputs should distinguish between:

- applicable;
- likely applicable;
- not currently applicable;
- more information needed;
- specialist review;
- evidence not verified;
- evidence provided;
- verified;
- action required;
- overdue or expiring.

---

## Planned Compliance DNA Direction

The planned Compliance DNA experience will organise the assessment as a
five-act company story:

1. **Meet Your Company**
2. **Meet the People Who Make It Work**
3. **What Makes Your Company Unique**
4. **Build the Compliance DNA**
5. **Reveal the Compliance Story**

The redesign should preserve the legally important company questions while
asking them only when relevant.

The planned architecture should separate:

1. User-confirmed profile facts.
2. Inferred company facts.
3. Deterministic applicability rules.
4. Compliance obligations.
5. Evidence status.
6. Explanations and official sources.

The rules engine should decide applicability.

A future RAG layer may explain rules, retrieve sources and answer follow-up
questions, but it must not invent obligations or independently declare
compliance.

---

## Current Technology Stack

### Frontend

- HTML5;
- CSS3;
- JavaScript;
- static JSON data;
- responsive component styling;
- browser `localStorage`;
- browser-side report rendering;
- browser-side PDF generation;
- jsPDF.

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
- GitHub Pages for static public content where configured;
- Render web service for backend delivery where configured;
- HTTPS API communication;
- server-side environment variables for private OAuth credentials.

### Experimental UX layer

- React and Next.js-ready TypeScript components;
- Zustand state management;
- component-scoped responsive CSS;
- Jest;
- Testing Library examples.

---

## Important Application Files

```text
/
├── index.html
├── analyze-company.html
├── executive-advisory-report.html
├── sample-advisory-report.html
├── official-resources.html
├── more-info.html
├── assessment.html
├── advisory-dashboard.html
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── FILES_OVERVIEW.md
├── CHANGELOG.md
├── RELEASE_NOTES.md
├── ROADMAP.md
│
├── js/
│   ├── executive-assessment.js
│   ├── executive-advisory-report.js
│   ├── gmail-service.js
│   ├── pdf.js
│   ├── site-shell.js
│   ├── build-marker.js
│   ├── intelligence-core.js
│   ├── config/
│   │   └── app-config.js
│   ├── company/
│   ├── core/
│   ├── advisor/
│   └── modules/
│
├── css/
│   ├── 00-design-system.css
│   ├── 01-variables.css
│   ├── 02-base.css
│   ├── 03-typography.css
│   ├── 04-layout.css
│   ├── 05-navbar.css
│   ├── 06-hero.css
│   ├── 07-homepage.css
│   ├── 08-assessment.css
│   ├── 09-dashboard.css
│   ├── 10-modal.css
│   ├── 11-responsive.css
│   ├── 12-executive-assessment.css
│   ├── 13-intro-experience.css
│   ├── 14-executive-advisory.css
│   ├── 15-print.css
│   ├── 16-homepage-refresh.css
│   ├── 17-advisory-briefing.css
│   └── 18-site-shell.css
│
├── data/
│   ├── industries.json
│   ├── states.json
│   ├── entity-types.json
│   ├── official-resources.json
│   ├── compliance-engine.json
│   ├── compliance-rules.json
│   ├── company/
│   ├── reference/
│   ├── requirements/
│   ├── schema/
│   └── knowledge-base/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATA_FLOW.md
│   ├── DESIGN_SYSTEM.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── INTRO_EXPERIENCE_V2_MASTER_PLAN.md
│   ├── TESTING_CHECKLIST.md
│   ├── UX_DECISIONS.md
│   ├── KNOWN_ISSUES.md
│   └── CONTRIBUTING.md
│
├── tests/
│   ├── frontend-production-checks.js
│   ├── assessment-journey-checks.js
│   ├── report-dynamic-scenarios.js
│   ├── requirements-static-check.js
│   ├── e2e/
│   └── playwright/
│
├── apps/
│   └── web/
│       └── src/
│           ├── components/
│           ├── hooks/
│           ├── services/
│           ├── stores/
│           └── types/
│
└── growwithhr-rag/
```

---

## Environment Variables

The backend may require:

```text
GMAIL_USER
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
INTERNAL_NOTIFICATION_EMAIL
REPLY_TO_EMAIL
PORT
```

Real credentials must be stored as private environment variables.

Do not commit:

- `.env`;
- OAuth client secrets;
- refresh tokens;
- Gmail credentials;
- production API keys;
- private recipient information.

Use `.env.example` only as a safe configuration template.

---

## API Endpoints

### Health check

```text
GET /api/health
```

Used to verify backend availability and Gmail delivery configuration.

The health response must not expose OAuth secrets or refresh tokens.

### Advisory delivery

```text
POST /api/send-advisory
```

Used to validate and send the generated advisory report.

The endpoint should apply:

- request validation;
- recipient validation;
- PDF validation;
- attachment-size limits;
- safe filename handling;
- request rate limiting;
- controlled error messages.

---

## Testing

The repository includes static, journey, React and end-to-end tests.

Documented commands include:

```text
npm test
npm run test:frontend
npm run test:journeys
npm run test:ux
npm run test:e2e
npm run test:advisory
```

Important test areas include:

- static production checks;
- assessment navigation;
- required-field validation;
- save and resume;
- report generation;
- PDF download;
- email-delivery request handling;
- responsive behaviour;
- accessibility;
- React privacy components;
- dynamic report scenarios.

---

## Version Management

`package.json` should be the canonical current-version source.

Current-version references may also appear in:

```text
package-lock.json
js/config/app-config.js
README.md
RELEASE_NOTES.md
ROADMAP.md
public page footers
build markers
```

Automatic version updates should modify only approved current-version markers.

They must not rewrite historical version entries in:

```text
CHANGELOG.md
historical release notes
archived implementation plans
migration documentation
```

The README heading intentionally does not hardcode a version number. This
reduces documentation drift.

---

## Documentation Governance

The following documents should remain aligned with the deployed product:

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

Whenever storage, delivery, retention or external services change:

1. Update the architecture documentation.
2. Update the data-flow documentation.
3. Update public privacy wording.
4. Update in-product privacy components.
5. Update the changelog and release notes.
6. Verify the deployed user journey.
7. Check for contradictory legacy or experimental wording.

---

## Future Persistence Gate

Before introducing new persistent storage, define:

- the exact data to be stored;
- the purpose for every field;
- consent or another lawful processing basis;
- access roles and permissions;
- authentication and authorisation;
- encryption in transit and at rest;
- retention periods;
- deletion procedures;
- user access and correction procedures;
- tenant isolation;
- audit logging;
- backup and recovery;
- schema migration;
- rollback and data removal;
- privacy-notice changes;
- security and privacy testing.

This gate applies to:

- customer accounts;
- cloud save;
- compliance workspaces;
- evidence uploads;
- document storage;
- CRM integrations;
- Google Drive integrations;
- analytics profiles;
- RAG conversation history.

---

## Project Status

GrowWithHR remains under active development.

The current production direction is:

- deterministic and explainable compliance foundations;
- a story-led assessment experience;
- safer applicability statuses;
- clearer evidence boundaries;
- official-source traceability;
- stronger privacy documentation;
- controlled future persistence;
- RAG only after the rules foundation is stable.

---

## Brand

```text
HRTechify
GrowWithHR
People • Technology • Growth
```

© 2026 HRTechify. All Rights Reserved.
