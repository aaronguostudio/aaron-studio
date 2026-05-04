---
type: observation
date: 2026-04-23
status: active
tags: [mawer, ai-tools, investment-proposal, zocks, claude-enterprise, advisor-workstation, wealth-management]
captured_via: brain-ingest skill
source: granola-meeting
related:
  - "[[../../orgs/mawer]]"
  - "[[../../people/jeff-house]]"
  - "[[../../people/aaron]]"
transcript: https://notes.granola.ai/t/7ecbc54f-935f-4c08-8c72-a277e0405152
---

# Mawer AI Tools + Private Wealth Platform Exploration

**Date:** 2026-04-23
**Source:** Granola meeting note (AI-generated summary)
**Captured by:** brain-ingest skill (manual paste)
**Related:** [[people/jeff-house]], [[orgs/mawer]], [[people/aaron]]

## Raw Content

### AI-Powered Investment Proposal Demo
- Aaron demonstrated automated investment proposal generation using Claude AI
  - 20-minute processing time vs. days of manual work
  - Consolidated ETF holdings with automatic look-through analysis
  - Generated account summaries, sector exposure, and what-if scenarios
  - Created both detailed Excel reports and client-facing PowerPoint presentations
- Data privacy handled through masking for demo purposes
  - Enterprise Claude doesn't train on client data (SOC 2 audited)
  - Alternative: use open-source models hosted internally
- Team feedback: excellent detail but may need filtering for specific use cases
  - Risk of analysis paralysis with too much information
  - Need to identify essential data points for investment proposals

### Platform Integration Capabilities
- Built POC connecting to Zocks account in 2 hours
  - Pulls meeting notes and client data automatically
  - Generates consolidated client reports ($2 token cost per report)
  - Shows data sources and reasoning for transparency
- Two implementation paths available:
  1. Direct Claude Enterprise integration with custom skills
  2. Custom web interface using same underlying AI workflows
- Morningstar license integration potential for enhanced data

### Client Communication Automation
- AI-generated personalized audio updates for clients
  - Tailored to individual holdings and previous meeting notes
  - Uses advisor's voice clone for authentic delivery
  - Automatically incorporates weekly investment meeting insights
- Alternative: written quarterly updates instead of audio
- Addresses scalability challenge of personalized client communication

### Next-Generation Advisor Workstation Concept
- Claude's new design feature generated full platform mockup from single prompt
  - Household management interface
  - Real-time portfolio rebalancing with drag-and-drop
  - Integrated financial planning components
  - Proactive task management from multiple data sources
- Would pull tasks from Salesforce, Zocks, and other systems
  - Morning dashboard showing client action items
  - Pre-meeting preparation automation
  - Annual review reminders and preparation

### Next Steps and Priorities
- Aaron finishing current commitments in 2 weeks, then full-time availability
- Immediate focus areas:
  1. Investment proposal tool refinement with Jeff and Katie
  2. Seg trading implementation (official agenda item)
- Need to establish AI governance policy
  - Current approved tools: Chuck (not working well), Microsoft Copilot
  - Enterprise Claude license: ~$40-50/month per user
- Form working group with counselors and associates for feedback
- Integration challenges remain primary roadblock for client data usage
- Plan broader team demo once initial tools proven

## Context

Aaron ran a working-session / demo with an ICG or wealth-platform audience at Mawer, showcasing the Claude-based investment proposal tool (extension of Jeff's Lawson Family work) alongside a Zocks POC and a new Claude-Design-generated advisor workstation mockup. Key strategic signals: (1) the tool has crossed from "Jeff prototype" into a broader conversation about AI governance + platform direction at Mawer; (2) Aaron's personal capacity opens up in ~2 weeks (early May 2026 window); (3) "Seg trading" now on official agenda alongside investment proposal refinement; (4) advisor workstation concept aligns with Jeff's "client quarterback dashboard" vision and [[projects/check-in]] surface area; (5) Claude Enterprise pricing (~$40-50/user/month) is now a named procurement variable.
