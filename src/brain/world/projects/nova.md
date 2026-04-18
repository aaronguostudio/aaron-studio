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

## Current State (April 15, 2026)
- **COO Retreat (April 8) demo failed**: Redis overloaded, vendor app incomplete, hands-on session had no successful builds
- **CEO demo (April 15) also failed**: "Platform was not stable enough to really showcase it to Eric." Justin pivoted to "larger themes" narrative conversation
- **ET Offsite (next week)**: Eric invited Justin to present Nova. Could be opportunity or tribunal. Real decision point.
- **Production launch proposed: May 25** — now framed as retreat + production milestone. Justin's own issue list contradicts readiness (Quest Builder in regression, Chat janky, params janky, infra unstable). Duncan "confident" but track record doesn't support.
- **External hiring proposed** — in a layoff environment, politically dangerous
- **Research adoption**: Justin claims increasing interest from research colleagues, credits Alex
- **Justin wants Nova in Private Wealth**: mentioned Dave Buchanan's team for client-side interactions — potential conflict with Keri/David/Aaron's separate PW tech line
- **Narrative escalation**: Nova now framed as "Enterprise AI OS" across three pillars (research, client-facing, support). Being packaged for ET offsite.
- **Redis architecture still not fixed**

### Nova Team Meeting (April 15)
- Justin framed three pillars: research (alpha), client-facing (net inflows), support (efficiency)
- Wilson presented open source model strategy — fine-tuning for determinism, cost management. Only part with real technical substance.
- Aaron asked scope question: "should teams stop building outside Nova?" — Justin confirmed external platforms (client portal etc) stay separate. **This gives Keri/David/Aaron PW line political cover, from Justin's own mouth.**
- Aaron announced shift to client-facing AI lab (mirroring Alex's research-side) — smart positioning that works regardless of Nova's fate
- Alex advised backend-first, light frontend — "no attachment to legacy UI." Consistent with his pattern: strategic advice, no engineering commitment.
- Duncan confident on May 25 despite ongoing Quest Builder regressions
- **Aaron designated as "orchestrator"** — expected to lead coordination and platform adoption. Risk: time sink competing with Keri's "Head of Products, focus on seg" mandate.
- Justin proposing split meetings: core builders vs orchestrators
- Follow-ups: production date confirmation (Justin), Quest/Campaign builder refinement (Duncan/Wilson), scope clarification at May retreat (Justin)

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

## Research Adoption Reality (April 15)
- Research IS using AI tools actively (Joshua Samuel, Peter Lampert, etc.) — this is real
- But they're using **Claude + MCP + data feeds**, not Nova's Quest/Campaign system
- Justin packages this as "Nova adoption" — brand attribution without product dependency
- Research champions (Peter, Vijay) now willing to advocate to ET/Board for Nova
- **Nova's political survival mechanism: real AI usage by Research → branded as Nova success → political capital for ET offsite**
- Implication: Nova can survive politically even if Quest Builder / Campaign Builder never reach production quality

## Nova Strategy Meeting (April 17) — "Big Debate"
- Team internally admits **60% confidence** on May 25 milestone (vs Justin's public "written in blood")
- Scope pulled back: COO ops + Research only initially, NOT firm-wide (retreat from earlier narrative)
- $400K Claude annual run rate acknowledged — open source models as cost mitigation
- **ET Offsite: next Tuesday/Wednesday, 3-hour AI agenda, Amarash + Justin presenting** — real decision point
- Microsoft Foundry evaluation ongoing (Dwight leading) — potential Nova killer if governance/security comparison favors Foundry
- "Savage mode" reduced to sustainable pace — acknowledgment the sprint was unsustainable
- 47 "active" campaigns claimed — definition unclear
- Patrick doing Risk monitor as "hobby-time" — resource thinness signal
- Phased rollout: (1) Chuck replacement chat firm-wide, (2) workflows COO/Research only, (3) expansion after stability
- Aaron NOT in any next steps action items — clean exit confirmed
- Justin + Wilson acknowledged as "expensive resources" — someone raised ROI question

## Probability Assessment (April 17 — updated)
- ~10% Nova fully adopted firm-wide after ET offsite
- ~35% Narrow adoption (COO+Research only), limping toward May 25
- ~30% Deferred again, scope further reduced
- ~15% Foundry wins comparison → Nova soft shutdown
- ~10% Hard shutdown by ET

**Aaron's action doesn't change based on these probabilities** — Trusted Operator strategy is robust to all four scenarios.

## Key Conflict: Nova vs PW Tech Line
- Justin wants to expand Nova into Private Wealth (mentioned Dave Buchanan's team)
- Keri/David/Aaron are building a separate PW tech transformation line
- These two tracks will collide. Aaron must ensure Keri and David's plan isn't hijacked by Nova scope expansion
- **Mitigated (April 15):** Aaron got Justin to confirm on record that external platforms stay separate. This is political cover.
- **Action:** Don't raise this directly. Let Keri manage the boundary. If asked, Aaron's position: "PW needs are business-driven, not platform-driven."

## Key Risk: Orchestrator Role Creep
- Justin designated Aaron as orchestrator — "expected to lead coordination and platform adoption"
- Keri's mandate: Head of Products, focus on seg, major builds
- These two demands compete for Aaron's time
- **Action:** Participate enough to stay visible, don't let it consume seg/PW/check-in bandwidth. If overloaded, escalate to Keri privately.

## Timeline
- 2026-04-17: Strategy meeting — 60% confidence admitted, scope narrowed to COO+Research, Foundry comparison started
- 2026-04-15: CEO demo failed (platform unstable). Justin pivoted to narrative. ET offsite invite secured.
- 2026-04-22/23: **ET Offsite — 3hr AI agenda, Amarash + Justin presenting. REAL DECISION POINT.**
- 2026-05-25: Proposed production launch (60% team confidence, high risk of slip)
- 2026-04-17: Original decision deadline (COO group adoption) — now superseded by ET offsite
- 2026-04-10: Aaron meets Justin 1:1 (UX discussion + likely political processing)
- 2026-04-09: Justin post-retreat PR message; direct message to Aaron narrowing io_spec as #1; shared Interaction definition; team meeting revealed Redis still unstable (Narek proposing real fix, Duncan patching); Alex shared Bezos inflection piece
  refs:
    - [[_archive/2026-04-09/justin-post-retreat-message]]
    - [[_archive/2026-04-09/justin-direct-message-aaron-ux]]
    - [[_archive/2026-04-09/justin-interaction-definition]]
    - [[_archive/2026-04-09/nova-team-meeting-notes]]
    - [[_archive/2026-04-09/redis-architecture-discussion]]
    - [[_archive/2026-04-09/alex-bezos-squiggly-lines]]
- 2026-04-08: COO Retreat — demo failure (Redis overloaded, vendor app incomplete, hands-on session produced no successful builds)
- 2026-03-31: Previous deadline (pushed)
- 2026-03-19 (approx): Aaron's deep conversation with GG about Nova internal politics
- 2026 earlier: Justin + Wilson initiated; Aaron moved from core to support role

## What to Watch
- **ET Offsite (Apr 22/23)** — 3hr AI session outcome. Does Nova get mandate, get narrowed, or get killed?
- **Foundry comparison (Dwight)** — if Foundry wins on governance/security, Nova's "on-prem" moat evaporates
- **$400K token cost** — will ET see this as investment or waste?
- Narek's Redis fix — does it actually get shipped, or shelved in favor of patches?
- Duncan's Quest Builder progress — "achilles heel" with 40 days to fix
- Scope expansion attempts despite "no new features" commitment

## Decision Journal Entries Related
- (TBD — add as Aaron logs decisions)

## Observations
- **2026-04-18** — W16 review: clean exit secured. Apr 17 strategy meeting — Aaron NOT in any action items; scope narrowed to COO+Research; team admitted 60% May 25 confidence. Aaron publicly announced pivot to client-facing AI lab. (source: [[../../reviews/weekly/2026-W16]])

---

**Category:** Tier 1 (day job), risk-managed exposure
**Key principle:** UX polish is the work; distance from narrative is the strategy
