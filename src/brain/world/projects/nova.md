# Nova — Mawer Internal AI Platform

**Status:** 🔴 Active but unstable, politically exposed
**Stage:** Pre-production, post-failed-COO-retreat
**Org:** [[orgs/mawer]]
**Category:** Day job — political firefight
**Last updated:** 2026-04-10

## What It Is
Internal AI platform intended to host flow-based orchestration, chat experiences, apps, and user-built "interactions". Initiated by [[people/justin-anderson]] and [[people/wilson]].

Core concepts (per Justin's definitions):
- **Interaction**: "Purely vibe-coded" full-stack application with chat/app UI, powered by Nova flows
- **Quest**: Unit of prompt + tool orchestration (either standalone "Creative" interaction or structured "Stage" of a campaign)
- **Campaign**: Multi-stage workflow, with Campaign Template → triggered into Campaign Run
- **Orchestrator**: User who builds templates
- **Manager**: User who triggers/monitors runs
- **Knowledge Worker**: End user who executes stages

## Key People
- [[people/justin-anderson]] — initiator, CTO, narrative builder
- [[people/wilson]] — co-initiator, Head of Data, scope expander
- [[people/narek]] — AI Lead, the only true technical operator on the team
- [[people/duncan-mountford]] — Nova builder, vibe-deep, spreading thin
- [[people/alex]] — narrative supporter, not an engineer-on-Nova
- [[people/chintan]] — Vendor Onboarding campaign owner
- [[people/kyle]] — Outlook + bias interaction
- **Aaron** — Campaign UX polish (7-day sprint April 10-17)

## Current State (April 10, 2026)
- **COO Retreat (April 8) demo failed**: Redis overloaded, vendor app incomplete, hands-on session had no successful builds
- **Decision deadline**: COO group adoption pushed to "after April 17" (next Friday)
- **7-day sprint active**: Campaign system polish + Quest Builder stability + Vendor Onboarding "production grade"
- **Justin message tone**: Zero accountability, full PR mode, "world-changing" language
- **Redis architecture not fixed**: Duncan patching (zombie reaper, maxlen enforcement), Narek proposing real fix (event bus) but no timeline
- **Interaction "definition"**: Marketing language disguised as tech spec, "greater ability than Claude Skills" claim is politically risky

## Aaron's Role in the Sprint
- **In-scope:** Campaign Builder UX, Manager "Structured" tab, io_spec mapping (Justin's #1 priority), terminology consistency, knowledge worker execution polish (low)
- **Out-of-scope:** Quest Builder stability (Duncan+Narek), parallel execution / conditional branching backend (Chintan ask to deflect), interactions (Alex/Mario/etc.), MOAT campaign (Wilson+Vic), any Redis/platform work
- **Hidden #1 priority:** io_spec setting process — 40-50% of Aaron's time should go here
- **Test case:** Chintan's Vendor Onboarding campaign
- **Bonus deliverable:** Terminology glossary

## Risks to Aaron
1. **Scope creep**: Chintan will ask for conditional branching/parallel execution. Deflect.
2. **Platform instability**: UX polish on unstable platform → demo still fails → potential scapegoat
3. **Narrative association**: Being too visible in Nova → tied to fate even if not responsible
4. **Justin dependency**: In-person meeting may pull Aaron closer into inner circle right before potential collapse

## Aaron's Strategy
- Participate but don't own — document scope boundaries ruthlessly
- Deliver UX work that's genuinely good (integrity matters)
- Keep Justin/Duncan in decision chain
- Maintain distance from narrative ("world-changing", "inflection", etc.)
- Never reference [[people/keri]]'s shared info
- Protect [[projects/check-in]] and [[projects/orgnext-mvp]] priority through the sprint

## Probability Assessment (April 10)
- ~30% Nova fully adopted by COO group after April 17
- ~40% Deferred again, limping along
- ~20% Soft shutdown (budget cuts, scope reduction)
- ~10% Hard shutdown by ET

**Aaron's action doesn't change based on these probabilities** — Trusted Operator strategy is robust to all four scenarios.

## Timeline
- 2026-04-17: Next decision deadline (COO group adoption)
- 2026-04-10: Aaron meets Justin 1:1 (UX discussion + likely political processing)
- 2026-04-09: Justin post-retreat PR message; team meeting notes revealed Redis still unstable
- 2026-04-08: COO Retreat — demo failure
- 2026-03-31: Previous deadline (pushed)
- 2026-03-19 (approx): Aaron's deep conversation with GG about Nova internal politics
- 2026 earlier: Justin + Wilson initiated; Aaron moved from core to support role

## What to Watch
- Narek's Redis fix — does it actually get shipped, or shelved in favor of patches?
- Duncan's timesheet app demo to Keri — is he building his own direct line?
- Justin's vacation behavior — engaged or disconnected?
- ET-level signals through Keri
- Scope expansion attempts (MOAT, interactions, new categories)

## Decision Journal Entries Related
- (TBD — add as Aaron logs decisions)

---

**Category:** Tier 1 (day job), risk-managed exposure
**Key principle:** UX polish is the work; distance from narrative is the strategy
