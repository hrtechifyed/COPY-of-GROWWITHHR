# GrowWithHR v0.12.2-beta

Codename: Executive Advisory Experience v3 & Homepage Mobile

---

## v0.12.2-beta Executive Advisory Experience v3

- Updated the intro narrative to Brand Reveal, Identity, Growth, Leadership, Transition, executive briefing cards, Coach HRTechify and Executive Assessment CTA.
- Adjusted intro timing toward a 45–60 second premium executive onboarding experience.
- Hardened homepage mobile layout for intelligence cards and the capability carousel with dedicated desktop, laptop, tablet and mobile breakpoints.

---

## v0.12.1-beta Production Demo Fixes

- Begin Assessment remains an explicit user action and hands off to the existing assessment flow.
- New sessions clear previous in-progress assessment inputs.
- Name and email capture remains required before report generation.
- Advisory report generation is validated across 50 dynamic scenarios.
- Trust, explainability and traceability are prioritised over larger AI-model selection.
- About, Privacy and Contact cards are presented horizontally on larger screens, with GDPR reference links in Privacy.

---

## Overview

This release updates the Executive Advisory introduction to the v3 narrative flow, improves homepage mobile compatibility for the carousel and intelligence sections, and keeps the product roadmap focused on trust, explainability, traceability, and production readiness.

The most important product decision in this release is that the brand reveal appears once, then fades away so the rest of the experience focuses on the user's organisation before handing off to the executive assessment.

---

## Highlights

### Executive Advisory Experience v3

The intro now follows a concise executive narrative: brand reveal, identity, growth, leadership, transition, executive briefing cards, Coach HRTechify, and an explicit Executive Assessment CTA.


### Production Readiness Roadmap

The roadmap now identifies compliance knowledge, explainability, security, auditability, multi-tenancy, and production infrastructure as key readiness workstreams. The current readiness estimate remains approximately 65–70% until these workstreams mature.

### Traceability as the Next Major Investment

Every recommendation should eventually explain why it appears, which assessment answers triggered it, which regulation or recognised HR principle it relates to, and what the user should do next.

### Device Layout Test Cases

The testing checklist now includes explicit layout checks for mobile portrait, mobile landscape, tablet portrait, tablet landscape, laptop, and desktop viewports.

### Wizard-Style Assessment Flow

The new `WizardForm` component separates the flow into scenes:

1. Welcome and animated introduction.
2. Company context questions.
3. Contact capture for the open tab only.
4. Personalized advisory report.

### No-Storage Data Policy

The current build uses open-tab memory only.

- No localStorage.
- No sessionStorage.
- No cookies.
- No backend database.
- No Google Drive upload.
- No CRM export.
- No HRTechify admin dashboard.
- No email delivery.
- No cross-device resume link.

If a user leaves midway, refreshes, closes the tab, or switches devices, they must start fresh.

### Personalized Report Generator

The report generator creates a rules-based advisory using the user's company context. It includes:

- Company-specific summary.
- Risk level.
- Maturity score.
- Operating archetype.
- Directional benchmark language.
- CFO and HR viewpoints.
- Priority actions.

### Privacy and Trust Signaling

Privacy notices now appear directly near sensitive assessment areas and in a dedicated privacy component. The copy clearly explains what is and is not stored.

### Visual Consistency

The new UX components use the same font family as the advisory dashboard: `Inter`, `Segoe UI`, `sans-serif`.

---

## Current Beta Scope

Included:

- Static landing and advisory pages from the existing prototype.
- New React/TypeScript assessment UX components.
- Current-tab-only state management.
- No-storage privacy messaging.
- Rules-based personalized report generation.
- Unit-test examples for key UX behavior.

Not included:

- Production backend.
- Persistent user accounts.
- Saved reports.
- Save-and-resume.
- Admin dashboards.
- CRM/email/Google Drive integrations.

---

## Next Release Focus

The next release should focus on integration quality:

- Wire the React UX layer into a runnable application shell.
- Add a confirmed test/build toolchain with lockfile.
- Replace static examples with live routes.
- Decide whether future storage is required and document consent requirements before implementation.
---

## Intro Experience v2.0 and Production Readiness Alignment

Version: `v0.12.2-beta`

This document is aligned with the GrowWithHR Intro Experience v2.0 and production-readiness plan. The current product direction is an AI-powered Executive Advisory Platform with a premium, persistent-hero introduction, deterministic compliance advisory foundations, stronger recommendation traceability, and responsive validation across mobile, tablet, laptop, and desktop breakpoints.
