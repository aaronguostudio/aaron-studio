---
type: observation
date: 2026-05-04
status: active
tags: [vgbt, jon, mvp, mcp, sql-security, vista, viewpoint, crystal-reports, cfma, conference, organized-cli]
captured_via: brain-ingest skill
source: granola-meeting
related:
  - "[[../../people/jon]]"
  - "[[../../projects/vgbt]]"
  - "[[../../people/aaron]]"
transcript: https://notes.granola.ai/t/9d24f175-37e2-4b3f-8c72-f960cc06b24e
---

# Jon 1:1 — VGBT 1-Month Catch-Up: MVP Done, Vista Security, CFMA Push

**Date:** 2026-05-04
**Source:** Granola meeting (AI-generated summary)
**Captured by:** brain-ingest skill (manual paste)
**Related:** [[people/jon]], [[projects/vgbt]]

## Raw Content

### Project Progress & Team Coordination
- First month MVP completed successfully:
  - Admin portal, client portal, MCP service with cloud desktop integration
  - Database querying functionality working
  - Log audit system + notification system launched
  - VPN setup completed
  - CICD pipeline fully automated
- Team coordination significantly improved with Organized CLI:
  - Ticket creation now takes minutes vs. hours
  - AI-generated requirements with good context
  - All project management through organized tenant
- Team working well in parallel on different components
  - Aaron as single point of contact for requirements gathering
  - Efficient communication through frequent ad-hoc calls

### Technical Architecture & Database Integration
- SQL database access established with writable account from Myo
  - Need to configure environment variables in backend
  - Feature should be tenant-level or user-level configurable
- Security and permissions = major challenge for client onboarding
  - Current approach: unlimited SQL user access (not viable for large firms)
  - Two potential solutions:
    1. SQL-level user row permissions with existing database controls
    2. Azure AD integration to inherit user permissions automatically
- Container app identity can be granted access with role-based permissions
  - Clients need proper setup knowledge for row-level security

### Vista Security System Deep Dive
- Vista uses complex multi-layered security model:
  - Security groups with data/program/report/attachment types
  - Data security inherits to third-party programs (relevant for integration)
  - Form/report security doesn't carry over (not relevant)
- Database structure: viewpoint database name standard across all clients
  - Views (4 capital letters) for reporting with security applied
  - Tables (lowercase 'b' + 4 capitals) for data entry
  - View generator must be run after security changes
- Application role security needs to be enabled for external access
  - Public access restrictions currently off, need to be on
  - Will inherit data security when properly configured

### Reporting Integration Roadmap
- Crystal Reports integration partially complete
  - Requires ~1GB of DLLs, deployment strategy unclear
  - Custom reports numbered 10,000+ with security assignment
  - Programmatic creation/modification capability built
- Excel and Power BI integrations in separate repos
  - Need clear communication layer strategy (MCP calls vs. single repo)
  - Testing difficult with separate repositories
- WIP (Work in Progress) report = priority for CFMA conference May 31
  - Two workflows needed:
    1. Create WIP report from scratch using templates
    2. Upload existing WIP report, extract info, optimize and recreate

### Next Steps & Conference Preparation
- Three-week deadline for conference demo video
  - Focus on WIP report workflows as primary deliverable
  - Need realistic feasibility assessment by next week
- Code repository consolidation this week
  - Bring Jon and team onto main repository
  - Eliminate merge conflicts and delays
  - 5-minute turnaround for knowledge base changes
- Feedback and reinforcement learning module
  - Automated tool selection validation
  - Background learning without manual correction
  - Address cases where appropriate tools aren't called
- Meeting cadence: weekly Aaron/Jon, bi-weekly team meetings through conference period

## Context

Three-week-out checkpoint vs. the 2026-04-18 sync. Big delta: MVP shipped (admin/client portals,
MCP service, log audit, notifications, VPN, full CI/CD), and Organized CLI adoption collapsed
ticket-creation time from hours to minutes. Auth/security strategy has crystallized into two
real options (SQL row perms vs. Azure AD inherit) — this is the same "DB integration is the
unlock" thread from April 18, now formalized. New surface area: Vista's multi-layered security
model and the viewpoint DB convention (4-capital views, b+4-capital tables). Reporting integration
is the next bottleneck — Crystal partially built, Excel/PowerBI in separate repos, WIP report
chosen as the CFMA May 31 demo target. Hard deadline: 3-week conference demo video.
