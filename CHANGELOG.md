# Changelog

All notable changes to GrowWithHR are documented here.

---

## [v0.15.1-beta] - Gmail Advisory Delivery and HRTechify Brand Alignment

**Release Date:** 2026-07-19

### Added

- Added a Node.js and Express backend for advisory email delivery.
- Added Gmail API integration using Google OAuth 2.0.
- Added secure delivery of personalised advisory PDF reports.
- Added HTML and plain-text customer email versions.
- Added a branded HRTechify customer email template.
- Added a personalised customer greeting and organisation name.
- Added a PDF attachment notice to the customer email.
- Added a founder signature and reply-to support.
- Added a compact HRTechify email footer bar.
- Added a centred HRTechify logo with the tagline displayed underneath:

  **People • Technology • Growth**

- Added internal assessment-completion notifications.
- Added recipient email-address validation.
- Added Base64 and PDF-signature validation.
- Added PDF attachment size limits.
- Added safe attachment filename handling.
- Added request rate limiting for advisory email requests.
- Added the Gmail API health-check endpoint:

  ```text
  GET /api/health
