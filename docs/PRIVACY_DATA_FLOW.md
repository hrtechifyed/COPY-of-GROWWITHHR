# GrowWithHR Privacy and Data-Flow Baseline

> Milestone: M0 — Baseline Freeze  
> Application version: 0.15.1-beta  
> Last reviewed: July 2026

## 1. Purpose

This document records the current GrowWithHR data flow before the Compliance DNA transformation begins.

It defines:

- what information the current experience collects;
- where that information is processed;
- where information may be stored;
- when information leaves the browser;
- which external service receives information;
- which privacy boundaries later releases must preserve.

This is an implementation baseline, not a substitute for legal advice or a complete privacy policy.

## 2. Current privacy posture

GrowWithHR currently uses a browser-led assessment.

Assessment progress and report information may be stored in the user's browser through `localStorage`.

GrowWithHR does not currently maintain a dedicated application database for:

- customer accounts;
- completed assessments;
- compliance workspaces;
- generated advisory reports;
- evidence uploads.

Information is transmitted to the GrowWithHR backend when the user requests email delivery of an advisory.

The backend sends email through the Gmail API.

Sent messages and attachments may remain in the connected Gmail account according to that account's settings and retention practices.

## 3. System data-flow summary

```text
User
  |
  v
GrowWithHR browser application
  |
  |-- User enters organisation and workforce information
  |-- Assessment state is processed in the browser
  |-- Progress may be stored in localStorage
  |-- Advisory data is prepared in the browser
  |-- PDF is generated in the browser
  |
  v
User requests email delivery
  |
  v
POST /api/send-advisory
  |
  |-- Recipient validation
  |-- Payload validation
  |-- PDF validation
  |-- Rate limiting
  |-- Email construction
  |
  v
Gmail API
  |
  |-- Customer advisory email
  |-- PDF attachment
  |-- Optional internal completion notification
  |
  v
Connected Gmail account
