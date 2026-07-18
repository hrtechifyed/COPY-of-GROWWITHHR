# Repository Update Notes

This repository is the current working copy of GrowWithHR, including the deployed static assessment experience, Gmail API report delivery, PDF generation, shared HRTechify branding and an experimental React/Next.js-ready UX layer.

---

## Latest Update

- Added Gmail API email delivery using Google OAuth 2.0.
- Added secure delivery of personalised advisory PDF reports.
- Added branded HTML and plain-text customer email templates.
- Added internal assessment-completion notifications.
- Added backend recipient, attachment and PDF validation.
- Added email request rate limiting and Gmail configuration health checks.
- Added Render deployment support using private environment variables.
- Added a shared HRTechify header and footer across public pages.
- Updated the shared footer text to:

  **© 2026 HRTechify. All Rights Reserved. People • Technology • Growth**

- Added a compact, centred HRTechify logo and tagline to the customer email footer.
- Standardised footer typography across public pages.
- Corrected the larger footer font on `analyze-company.html`.
- Retained the React/Next.js-ready UX layer under `apps/web/src`.
- Updated documentation to reflect the current browser progress, email delivery and data-handling behaviour.

---

## Current Data Policy

The previous open-tab-only and no-email policy is no longer accurate.

The current implementation handles information in the following ways:

- Assessment information is entered and processed in the user’s browser.
- Limited progress may be stored in the same browser to support resume behaviour.
- The user can review assessment information before generating the report.
- When report delivery is requested, the required assessment, recipient and PDF information is transmitted to the GrowWithHR backend over HTTPS.
- The backend validates the recipient address and PDF attachment.
- The backend sends the customer email and attached report through the Gmail API.
- An internal assessment notification may be sent to the configured HRTechify inbox.
- Assessment answers are not intentionally stored in a dedicated GrowWithHR database.
- Sent messages and PDF attachments remain in the connected Gmail account according to its retention settings.
- Non-sensitive request, delivery and error information may appear in Render application logs.

The current implementation does not provide:

- Customer accounts.
- Cloud-based saved assessments.
- Cross-device resume links.
- A persistent customer report database.
- An HRTechify administration dashboard.
- CRM integration.
- Google Drive report storage.

Users may lose locally retained progress when browser data is cleared, private browsing is used or a different browser or device is opened.

---

## Gmail API Delivery

The current delivery flow is:

1. The user completes the GrowWithHR Executive Advisory assessment.
2. The user reviews the captured information.
3. GrowWithHR generates the advisory report as a PDF.
4. The browser sends the PDF and recipient information to the backend.
5. The backend validates the request.
6. The customer receives the branded advisory email with the PDF attached.
7. An internal notification may also be delivered.

Email delivery uses:

- Node.js.
- Express.
- Gmail API.
- Google OAuth 2.0.
- HTTPS communication.
- Private Render environment variables.

SMTP and Gmail App Password delivery are not used in the current implementation.

---

## Executive Advisory Scope

The current assessment captures company, workforce, operating and growth context.

The delivered advisory currently focuses primarily on the compliance pillar, even when users select wider people, governance or growth priorities.

The recommendations are deterministic and rules-based. They are intended as general strategic guidance and do not replace legal, financial, tax, employment, compliance or other professional advice.

---

## Experimental React UX Layer

The repository continues to include a React/Next.js-ready UX layer under:

```text
apps/web/src
