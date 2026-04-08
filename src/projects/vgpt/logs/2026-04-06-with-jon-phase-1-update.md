### Product Demo & Current State

- Demoed the dev environment (not final production) — deployed and functional
- Dashboard shows real data: request volume, revenue (not yet calculated), usage stats
- Customer management flow: create customer → assign API key(s) → one-time credential display (copy on creation, not stored)
- Built-in chat interface for testing keys directly in the UI — supports impersonation mode to debug as a specific user
- API usage logging live: tracks calls per endpoint, per customer (e.g. Aaron Guola at 40 requests)
- Next logging step: capture full question + result per session, visible in the admin dashboard

### Architecture & Collaboration Workflow

- MCP server already deployed to cloud; users always get latest code without restarting
- Repo structure: John owns files outside /src; Aaron’s team manages /src — minimizes merge conflicts
- Current workflow: Aaron fetches upstream from John’s repo, resolves conflicts, pushes to cloud
  - Temporary until on a single shared repo with auto-deploy on push
- Key upgrade pending: key management migration to cloud auth (OAuth) — Zed investigating, some instability on cloud side

### Strategic Discussion

- John’s vision: build 10–20 wizard UIs on top of Vista (AP wizard, AR wizard, subcontract wizard, etc.)
  - ~100 forms cover 99% of usage; dominate that surface area
  - Could build a full ERP alternative — potentially in 1 year vs. the current 10-year trajectory
- Two monetization paths: keep as internal competitive advantage (10x AUM) or sell to other Vista-using firms
- Feedback loop / “dreaming” system discussed as next major capability
  - Log consultant interactions → AI reviews for quality → John does final pass before merging into knowledge base
  - John wants to personally review all feedback data initially to guard against bad/adversarial inputs
  - Eventual goal: self-improving knowledge base from live usage

### Next Steps

- Aaronguostudio
  - Create API accounts for Sunny and Marvin (Vin already set up)
  - Message John with the three API keys when done
  - Merge John’s latest repo changes and deploy to cloud
- John
  - Share APIs with Vin, Sunny, and Marvin — target start today
  - Arrange 2 more API keys for external consultants by Tuesday or Wednesday
  - Review consultant interaction logs once logging is live

---

Chat with meeting transcript: [https://notes.granola.ai/t/f19bb6ca-3193-4d4d-ac4f-f0c9c034491c](https://notes.granola.ai/t/f19bb6ca-3193-4d4d-ac4f-f0c9c034491c)