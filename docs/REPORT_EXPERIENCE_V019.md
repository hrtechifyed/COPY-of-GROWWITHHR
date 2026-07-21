# GrowWithHR v0.19 Report Experience

Status: release candidate implementation

## Scope

This change improves report presentation and implementation usefulness without changing the public page layout, site navigation, brand identity, assessment chapters, compliance decision logic, Gmail delivery boundary or browser-storage keys.

## Assessment rules

- Employee count is a whole number with a minimum of one.
- Selecting `One Person Company` sets employee count to `1` and disables the field.
- Restored or malformed values are normalised before report preparation.
- Singular and plural wording is derived from the normalised count.

## Report-style choice

The lead-capture form presents two PDF styles:

- **Light:** print-friendly, low-ink page background with HRTechify navy and gold accents.
- **Dark:** presentation-focused deep navy background with HRTechify gold accents.

The selected style is used for the generated download and emailed attachment. The choice is stored in browser `localStorage` under `growwithhr-report-theme` so subsequent downloads remain consistent on that device.

## PDF presentation

- A4 portrait, searchable/selectable text and page-safe wrapping.
- Original `assets/hrtechify-logo.png` artwork, circularly clipped for report use.
- Compact sections with fewer forced page breaks and reduced unused space.
- Consistent running header, footer and page numbering.
- Identical advisory content across light and dark styles.

## Recommendation structure

Each strategic recommendation may contain:

1. observation;
2. recommended action;
3. implementation steps;
4. accountable owner;
5. suggested timing;
6. downloadable starter resource.

Repeated titles and identical text entries are removed before rendering.

## Resource governance

Resources in `resources/` are editable starting points. They are not legal advice, proof of compliance, statutory filings or substitutes for qualified professional review. Users must verify applicability and current requirements using official sources and appropriate advisers.

## Compatibility boundaries

Unchanged:

- `/analyze-company.html` public assessment route;
- `/api/send-advisory` delivery endpoint;
- Gmail/OAuth server environment variables;
- existing browser assessment/report storage keys;
- public navigation and page grids;
- private-beta M1–M3 compliance models;
- deterministic compliance applicability logic.

## Acceptance criteria

- One Person Company displays a disabled employee field containing `1`.
- Other entity types cannot proceed with a workforce count below `1`.
- One employee is described using singular wording; two or more use plural wording.
- Light and dark PDFs can be selected at lead capture.
- Both report styles use the correct HRTechify logo and contain the same advisory content.
- Recommendations show implementation steps and working resource links.
- Website report cards preserve the existing layout classes.
- Existing assessment, PDF, Gmail delivery, CORS and compliance tests continue to pass.
- `npm run test:report-experience` and the complete `npm test` suite pass.
