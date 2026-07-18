# GrowWithHR v0.15.0-beta

Codename: Gmail Advisory Delivery & HRTechify Brand Alignment

---

## Overview

This release moves GrowWithHR from a browser-only advisory prototype toward a working end-to-end assessment and report-delivery experience.

Users can now complete the GrowWithHR Executive Advisory assessment, generate a personalised PDF report and receive it by email through the Gmail API.

The release also introduces a branded HRTechify customer email, internal assessment notifications, improved backend validation, shared website branding and consistent footer styling across public pages.

GrowWithHR remains a beta-stage, rules-based executive advisory prototype. The current delivered report primarily focuses on the compliance pillar while the wider people, growth and governance framework continues to develop.

---

## Highlights

### Gmail API Advisory Delivery

GrowWithHR now sends advisory reports through the Gmail API over HTTPS.

The backend uses Google OAuth 2.0 credentials rather than SMTP or Gmail App Passwords.

The email-delivery flow now includes:

1. The user completes the Executive Advisory assessment.
2. GrowWithHR generates the advisory report as a PDF.
3. The browser sends the recipient details and PDF securely to the backend.
4. The backend validates the request and attachment.
5. The customer receives the branded email with the PDF attached.
6. An internal notification may be sent to the configured HRTechify inbox.

---

### Branded Customer Email

Customers now receive a responsive HRTechify-branded email containing:

- A personalised greeting.
- The organisation name.
- A clear PDF attachment notice.
- A summary of what the advisory contains.
- Practical next-step guidance.
- A reply-to contact option.
- A founder signature.
- A compact HRTechify footer bar.
- A centred HRTechify logo.
- The centred tagline:

  People • Technology • Growth

A plain-text fallback is also included for email applications that do not support or display HTML content.

---

### PDF Advisory Attachment

The generated advisory report is now delivered as a PDF attachment.

The backend checks that:

- A PDF was supplied.
- The attachment contains valid Base64 data.
- The file begins with a valid PDF signature.
- The attachment does not exceed the configured size limit.
- The filename is converted into a safe format.

The current customer-facing report primarily covers the compliance pillar, even when the assessment captures information relating to wider people or growth priorities.

---

### Internal Assessment Notifications

GrowWithHR can now send an internal notification when a user completes an assessment.

The internal notification may include:

- Name.
- Email address.
- Organisation.
- Role.
- Industry.
- Employee count.
- Hiring plans.
- Selected priorities.
- Submission time.

The internal notification is separate from the customer’s advisory email.

---

### Backend and Deployment Improvements

The release introduces a Node.js and Express backend with:

- Gmail API integration.
- Google OAuth 2.0 authentication.
- Request validation.
- Email-address validation.
- PDF validation.
- Rate limiting.
- Plain-text and HTML MIME email generation.
- Customer and internal email handling.
- Protected server and environment-file paths.
- Deployment health reporting.
- Render deployment support.

The application exposes a health endpoint:

GET /api/health

A configured deployment reports:

{
  "ok": true,
  "version": "gmail-api-v1",
  "provider": "gmail-api",
  "gmailConfigured": true,
  "missingVariables": []
}

---

### Shared HRTechify Branding

The website and customer email now use a more consistent HRTechify identity.

The shared website footer is:

© 2026 HRTechify. All Rights Reserved. People • Technology • Growth

The footer now uses the same shared font sizing and styling across supported public pages.

The Analyze Company page was also corrected so that its page-level paragraph styling does not enlarge the shared footer text.

---

### Executive Advisory Assessment

The current assessment guides users through structured company context, including:

1. Business and organisation details.
2. Workforce and headcount context.
3. Operating footprint and working model.
4. Hiring, expansion and leadership priorities.
5. Review and recipient confirmation.
6. PDF generation and email delivery.

The recommendations remain deterministic and rules-based.

GrowWithHR does not present the output as a replacement for professional legal, financial, tax, compliance or HR advice.

---

### Browser Progress and Data Handling

The previous open-tab-only policy has changed.

The current assessment experience may retain limited progress in the user’s browser to support resume behaviour.

Current data handling includes:

- Assessment information is entered and processed in the browser.
- Limited browser-based progress may be retained locally.
- Report-delivery information is sent to the GrowWithHR backend when the user requests the advisory.
- The backend processes the information for email delivery.
- Assessment answers are not intentionally stored in a dedicated GrowWithHR database.
- Sent emails and PDF attachments are retained by the connected Gmail account according to its settings.
- Non-sensitive delivery and error information may appear in Render application logs.

The current release does not provide cloud-based saved assessments or cross-device continuation.

---

## Current Beta Scope

### Included

- Static HRTechify landing and information pages.
- Guided Executive Advisory assessment.
- Company and workforce context capture.
- Browser-based progress and resume behaviour.
- Assessment review before report generation.
- Deterministic advisory recommendations.
- Compliance-focused PDF report generation.
- Gmail API customer email delivery.
- PDF email attachments.
- Branded HTML email.
- Plain-text email fallback.
- Internal assessment notifications.
- Reply-to email support.
- Backend request rate limiting.
- Gmail API health checks.
- Render deployment.
- Shared header and footer branding.
- Responsive desktop, laptop, tablet and mobile layouts.
- Experimental React and TypeScript UX components.

### Not included

- Customer accounts.
- User authentication.
- Role-based authorization.
- A persistent assessment database.
- Cloud-based saved reports.
- Cross-device resume links.
- HRTechify administration dashboard.
- CRM integration.
- Google Drive report storage.
- Subscription billing.
- Automated marketing campaigns.
- Full production analytics and observability.
- Automated compliance certification.
- Complete advisory coverage across every people and growth pillar.

---

## Technology Updates

### Frontend

- HTML5.
- CSS3.
- JavaScript.
- Static JSON data.
- Browser-based PDF generation.
- Responsive HRTechify design system.

### Backend

- Node.js.
- Express.
- Gmail API.
- Google OAuth 2.0.
- googleapis.
- express-rate-limit.
- Environment-variable configuration.

### Deployment

- GitHub.
- Render.
- HTTPS API delivery.
- Private deployment environment variables.

### Experimental UX Layer

- React/Next.js-ready TypeScript components.
- Zustand state management.
- Component-scoped responsive CSS.
- Jest and Testing Library examples.

The experimental React layer remains separate from the main deployed static experience.

---

## Required Environment Variables

The deployed backend uses:

GMAIL_USER
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
INTERNAL_NOTIFICATION_EMAIL
REPLY_TO_EMAIL

These values must be stored privately in the deployment platform.

OAuth credentials, Client Secrets and Refresh Tokens must never be committed to GitHub or included in public documentation.

---

## Security and Reliability Notes

This release includes:

- OAuth-based Gmail authorization.
- No Gmail App Password requirement.
- Recipient email validation.
- PDF structure and size validation.
- Request rate limiting.
- Safe attachment filenames.
- Protected server and environment paths.
- Non-secret health-check output.
- Customer and internal email error handling.

Gmail Refresh Tokens must be treated like passwords and revoked immediately if exposed.

---

## Known Limitations

- The product remains in beta.
- The current report primarily focuses on compliance.
- External email images may be hidden by some email applications.
- Gmail API delivery depends on the connected Google account and OAuth authorization remaining active.
- Free Render services may take time to wake after inactivity.
- There is no dedicated customer report database.
- There is no customer account or report history.
- Browser resume behaviour is limited to the same browser environment.
- The advisory does not replace qualified professional advice.
- The React/Next.js-ready layer is not yet the primary deployed application.

---

## Next Release Focus

The next release should focus on:

- Expanding advisory coverage beyond the compliance pillar.
- Improving recommendation traceability.
- Connecting every recommendation to the assessment answers that triggered it.
- Adding clearer official-source references.
- Improving PDF layout and branding.
- Strengthening privacy documentation.
- Reviewing browser-storage and consent behaviour.
- Adding automated Gmail API integration tests.
- Adding stronger deployment monitoring.
- Improving accessibility testing.
- Continuing mobile and tablet validation.
- Deciding whether secure report storage or customer accounts are required.
- Planning CRM or partnership workflows only after consent and privacy requirements are defined.

---

## Product Direction

GrowWithHR is progressing toward a traceable Executive Advisory Platform built around:

- Explainable recommendations.
- Deterministic compliance foundations.
- Practical people-governance guidance.
- Official-source mapping.
- Clear recommendation triggers.
- Leadership-ready advisory reports.
- Secure customer communication.
- Responsive executive experiences.

Every recommendation should eventually explain:

1. Why it appears.
2. Which assessment answer triggered it.
3. Which regulation, official source or recognised people principle supports it.
4. What the organisation should do next.
5. What requires confirmation from a qualified adviser.

---

## Disclaimer

GrowWithHR provides general strategic guidance and structured advisory information.

It does not replace legal, financial, tax, statutory, compliance, employment or other professional advice.

Users should confirm applicable obligations with qualified advisers and the relevant official authorities.

---

## Release Information

Version: v0.15.0-beta

Release name: Gmail Advisory Delivery & HRTechify Brand Alignment

Brand: HRTechify

Tagline: People • Technology • Growth

---

## License

Copyright © 2026 HRTechify.

All Rights Reserved.

People • Technology • Growth
