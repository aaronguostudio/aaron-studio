# VGBT — Client Portal + Agent Platform

**Status:** 🟢 Active, post-Nova pivot target
**Stage:** MVP shipped (May '26); auth hardening + Vista reporting integration in flight; CFMA demo target May 31
**Category:** Tier 2 — external revenue hedge (cf. [[themes/financial-freedom]])
**Last updated:** 2026-05-04

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

## Current State (May 4, 2026)
- **MVP shipped** (first month):
  - Admin portal + client portal live
  - MCP service with cloud desktop integration
  - Database querying functional
  - Log audit + notification system launched
  - VPN setup complete
  - CI/CD pipeline fully automated
- **Team coordination via Organized CLI:** ticket creation hours → minutes; AI-generated
  requirements with good context; all PM through organized tenant
- Team running parallel on different components; Aaron is single point of contact for
  requirements gathering; ad-hoc calls keep velocity up
- SQL writable account from Myo established (env-var config pending; tenant- or
  user-level toggle TBD)

### Earlier (April 18, 2026)
- User portal design in progress
- OAuth authentication connector with Claude web — nearly complete (pending Z)
- Foundation work largely completed
- Proprietary agent layer planned (vs relying solely on Claude MCP)
- Aaron studying agent internals: prompt engineering, memory management

## Database Security & Integration Strategy
- **Critical insight:** users won't see full value until DB integration lands
  — copy-paste approach causing friction
- **Onboarding security challenge:** current unlimited-SQL-user approach is not
  viable for large firms. Two real options on the table:
  1. SQL-level user row permissions using existing DB controls
  2. Azure AD integration to inherit user permissions automatically
- Container app identity can be granted access with role-based perms — but clients
  need proper setup knowledge for row-level security
- Permissions inherit from Microsoft / third-party logins
- Two auth approaches: SQL login (full access) vs user login (inherited permissions)
- App registration with Microsoft required for tenant auth

### Vista Security Model (mapped 2026-05-04)
- Multi-layered: security groups with data / program / report / attachment types
- **Data security inherits to third-party programs** — relevant for our integration
- Form / report security does NOT carry over — not relevant to us
- Database structure: `viewpoint` is the standard DB name across all clients
  - **Views** (4 capital letters) — for reporting; security applied here
  - **Tables** (lowercase `b` + 4 capitals) — for data entry
  - View generator must be re-run after security changes
- Application role security must be enabled for external access
  - Public access restrictions currently OFF, need to be ON
  - Data security inherits when properly configured

## Reporting Integration Roadmap
- **Crystal Reports:** integration partially complete
  - ~1GB of DLLs required; deployment strategy unclear
  - Custom reports numbered 10,000+ with security assignment
  - Programmatic create/modify capability built
- **Excel + Power BI:** in separate repos
  - Communication layer strategy TBD (MCP calls vs. single repo)
  - Cross-repo testing is hard
- **WIP (Work in Progress) report = CFMA conference priority (May 31):**
  - Workflow 1: create WIP report from scratch using templates
  - Workflow 2: upload existing WIP report → extract info → optimize → recreate

## Sandbox + Production Path
- **Sandbox (immediate):** Sofos VPN → pure sandbox testing via ViewPoint
- **Production (preferred):** AP Wizard system integration
  - AP Wizard limitation: 2-3 companies/week onboarding
  - VGBT target: 50 companies/week → AP Wizard is a bottleneck
- Admin dashboard remains priority for consultant / company scaling
- SOC2 compliance likely required (to be discussed with Vin)

## Risks
- **CFMA demo deadline** — 3-week feasibility window for WIP report video; first
  realistic assessment due next week
- **Crystal Reports deployment** — ~1GB DLLs, no clear deployment strategy yet
- **Multi-repo testing** — Excel/PowerBI in separate repos makes integration testing hard
- **Onboarding security** — unlimited-SQL-user approach won't scale to large firms;
  need to land SQL-row-perm or Azure AD path before serious customer onboarding
- **AP Wizard throughput ceiling** — 2-3/wk vs 50/wk target, 10-20x gap
- **DB integration complexity** — auth model + view layer needs to be right the first time
- **Aaron time split** — Mawer PW line + Nova polish + VGBT all compete for attention

## Next Steps (as of 2026-05-04)
- **3-week deadline:** CFMA conference demo video — WIP report workflows = primary deliverable
- **This week:** code repository consolidation — bring Jon and team onto main repo, kill
  merge conflicts and delays, target 5-min turnaround for KB changes
- Build feedback / RL module: automated tool-selection validation, background learning
  without manual correction, address cases where appropriate tools aren't called
- Configure SQL writable account env vars; decide tenant- vs. user-level config
- Land one of the two security paths (SQL row perms OR Azure AD inherit) before scaled onboarding
- **Cadence:** weekly Aaron/Jon, bi-weekly team meetings through CFMA period

## Timeline
- 2026-04-18: Jon 1:1 — DB integration identified as critical unlock; sandbox path defined
  ref: [[_archive/2026-04-18/jon-vgbt-sync-client-portal-db-security]]
- 2026-05-04: Jon 1:1 — MVP shipped, Vista security model mapped, CFMA May 31 = WIP report demo target
  ref: [[_archive/2026-05-04/jon-vgbt-1month-catchup]]

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
