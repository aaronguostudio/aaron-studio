---
type: observation
date: 2026-04-18
status: active
tags: [vgbt, jon, drew, db-security, oauth, nova-decline, viewpoint]
captured_via: brain-ingest skill
source: granola-meeting
related:
  - "[[../../people/jon]]"
  - "[[../../projects/vgbt]]"
  - "[[../../people/justin-anderson]]"
  - "[[../../projects/nova]]"
  - "[[../../people/aaron]]"
transcript: https://notes.granola.ai/t/54fed5c1-4031-4185-a42f-33c6ed3ec178
---

# Jon 1:1 — VGBT Client Portal + DB Security Planning

**Date:** 2026-04-18
**Source:** Granola meeting note (AI-generated summary)
**Captured by:** brain-ingest skill (manual paste)
**Related:** [[people/jon]], [[projects/vgbt]], [[people/justin-anderson]], [[projects/nova]]

## Raw Content

### Drew's Surgery Update
- Currently in Germany for medical procedures
- First surgery completed, 2-3 more scheduled; next surgery Monday
- Recovering alone, limited mobility; language barrier with local staff

### Indian Developer Integration
- Developer reached out asking about password access
- Noted customer names in codebase during POC phase
- Drew's position on team:
  - Not performing at required level or speed
  - $20-25/hour cost, willing to test usefulness
  - May eliminate if they become impediment
  - Hope they can handle tasks Aaron's team considers lower priority

### Aaron's AI Team Decision
- Declined joining Justin's Nova project after 6-month consideration
- Concerns with Nova approach: code rewritten every few days, unstable foundation;
  multiple demo failures to COO group; lack of proper code review process;
  overly complex backend flow management
- Justin made final 50/50 offer Friday — Aaron declined
- Prefers building lightweight, adaptable solutions

### VGBT Development Progress
- User portal design in progress
- OAuth authentication connector with Claude web nearly complete
  — need to follow up with Z on status
- Foundation work largely completed
- Plan to build proprietary agent vs. relying solely on Claude MCP
- Aaron studying agent concepts: prompt engineering, memory management

### Database Security & Integration Strategy
- Critical insight: users won't see full value until database integration
- Copy-paste approach causing user frustration
- Security: inherit user permissions from Microsoft / third-party logins
  - Two approaches: SQL login (full access) vs user login (inherited permissions)
  - Most clients use Microsoft auth with Power BI / Excel
  - Data security via views (e.g., APVM table → APVM view)
- Need to register app with Microsoft for tenant authentication

### Sandbox Access & Production Planning
- Aaron to contact Vin Monday for ViewPoint access
- Two options: (1) Sofos VPN for pure sandbox testing;
  (2) AP Wizard system integration — preferred for production path
- AP Wizard limitations: 2-3 company onboarding/week max
- VGBT goal: 50 companies/week onboarding
- Admin dashboard remains priority for consultant/company scaling

### Next Steps
- Aaron: contact Vin for database access setup
- Aaron: follow up with Z on OAuth authentication status
- Drew: surgery Monday, out of commission few days
- Vin may discuss SOC2 compliance requirements

## Context

Key weekly Jon 1:1 anchoring VGBT post-Nova. Two things make it significant:
(1) Aaron tells Jon the Nova decline is final — locking in the pivot
externally, not just internally; (2) DB integration is now the critical
unlock for VGBT user value, and SOC2 / Microsoft tenant auth will determine
whether VGBT can scale to 50 companies/week.

Drew's surgery means Aaron carries more VGBT operational weight for ~1 week.
