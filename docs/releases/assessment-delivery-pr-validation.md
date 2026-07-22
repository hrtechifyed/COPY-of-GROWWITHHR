# Complete assessment delivery validation

This change set protects the public journey from the homepage **Analyze My Company** action through all seven assessment moments, review, contact capture, PDF creation and confirmed email delivery.

## Acceptance criteria

- A visitor can open the assessment from the homepage.
- Free-text industries that are not in the catalogue are preserved using the existing `Other` and `customIndustry` fields.
- Every assessment moment validates and advances without compatibility-script retries.
- The assessment page does not install a page-wide mutation observer.
- PDF and report enhancements are loaded only on assessment and report pages, not the homepage.
- The delivery service warms the Render backend before final submission when possible.
- Email delivery has a bounded timeout and produces a recoverable error instead of an indefinite loading screen.
- Completion is shown only after the email endpoint confirms customer delivery.
- The end-to-end browser test verifies a valid PDF payload and the persisted completion, report and delivery records.

## Production dependency

Live email delivery requires the Render service health endpoint to report that Gmail is configured. CI verifies the browser-to-server contract with a controlled endpoint response; it does not use production Gmail credentials or send a real message.
