# My Recent TODO Items

High Priority
- Jon's demo solution
- CF attendance page
- MMS updates
- 


Low Piroirty
- Reply APH Performance message


Backlog (staged for Notion Tasks Tracker — 2026-08-22)
- product-update newsletter skill (general-purpose)
  - Project: aaron-studio | Priority: Low | Agent Mode: Triage only | Scope: M
  - What: product-agnostic skill that turns `brief.md` (human, ~200 words) + auto-extracted repo facts
    (git log / merged PRs / release tags) into a structured `issue.json`, rendered to BOTH an email HTML
    (MJML, Outlook-safe) and a web page. `theme.json` holds brand color/font/logo/tone so it works for
    any product (OrgNext, etc.). QA reuses the claim-ledger pattern: every sentence must trace to a fact
    in facts.json or brief.md — deterministic script, not a prose gate.
  - v1 excludes: send API, subscriber management, auto-screenshot, bilingual, scheduling.
  - Why now = no: v2 roadmap freeze on new complexity; 3-4h/wk budget. Park until blog-production v2 Phase 0-1 lands.
