# VGBT — Client Portal + Agent Platform

**Status:** 🟢 Active, post-Nova pivot target
**Stage:** User portal design + OAuth integration in progress; DB integration next critical unlock
**Category:** Tier 2 — external revenue hedge (cf. [[themes/financial-freedom]])
**Last updated:** 2026-04-18

## What It Is
Client-facing portal + agent platform that integrates with ViewPoint-class
accounting / back-office systems. Aimed at scaling company onboarding
(target: 50 companies/week) with inherited Microsoft tenant permissions
and view-based data security.

## Key People
- **Aaron** — technical direction, DB integration, agent architecture
- [[people/jon]] — business partner / co-founder
- [[people/drew]] — team member, currently in Germany for surgery
- Z (TBD) — OAuth authentication work
- Vin (TBD) — ViewPoint / AP Wizard access contact
- Indian developer (TBD, contractor @ $20-25/hr, on probationary evaluation)

## Current State (April 18, 2026)
- User portal design in progress
- OAuth authentication connector with Claude web — nearly complete (pending Z)
- Foundation work largely completed
- Proprietary agent layer planned (vs relying solely on Claude MCP)
- Aaron studying agent internals: prompt engineering, memory management

## Database Security & Integration Strategy
- **Critical insight:** users won't see full value until DB integration lands
  — copy-paste approach causing friction
- Permissions inherit from Microsoft / third-party logins
- Two auth approaches: SQL login (full access) vs user login (inherited permissions)
- Data security via views (e.g., APVM table → APVM view)
- App registration with Microsoft required for tenant auth

## Sandbox + Production Path
- **Sandbox (immediate):** Sofos VPN → pure sandbox testing via ViewPoint
- **Production (preferred):** AP Wizard system integration
  - AP Wizard limitation: 2-3 companies/week onboarding
  - VGBT target: 50 companies/week → AP Wizard is a bottleneck
- Admin dashboard remains priority for consultant / company scaling
- SOC2 compliance likely required (to be discussed with Vin)

## Risks
- **AP Wizard throughput ceiling** — 2-3/wk vs 50/wk target, 10-20x gap
- **Drew bandwidth** — surgery recovery, limited operational capacity ~1 week
- **Indian dev uncertainty** — performance below bar, may be eliminated
- **DB integration complexity** — auth model + view layer needs to be right the first time
- **Aaron time split** — Mawer PW line + Nova polish + VGBT all compete for attention

## Next Steps (as of 2026-04-18)
- Aaron: contact Vin Monday for ViewPoint / DB access
- Aaron: follow up with Z on OAuth status
- Drew: surgery Monday, out of commission few days
- Vin may raise SOC2 compliance requirements

## Timeline
- 2026-04-18: Jon 1:1 — DB integration identified as critical unlock; sandbox path defined
  ref: [[_archive/2026-04-18/jon-vgbt-sync-client-portal-db-security]]

## What to Watch
- OAuth completion (Z dependency)
- ViewPoint access grant from Vin
- SOC2 conversation outcome
- AP Wizard throughput negotiation
- Indian dev performance decision
- DB integration technical design

## Open Questions
- Full list of target customers / pilot companies?
- Revenue model and pricing?
- Licensing / business structure with Jon and Drew?

---

**Category:** Tier 2 — primary external revenue engine post-Nova decline
**Key principle:** DB integration is the user-value unlock. Everything else is scaffolding.
