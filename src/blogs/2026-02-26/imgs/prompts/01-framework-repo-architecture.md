---
illustration_id: 01
type: framework
style: blueprint
---

Plugin Architecture Framework — Claude Financial Services Repo

Layout: three-tier hierarchical diagram, top-to-bottom flow

TIER 1 (TOP) — Core Plugin:
- Large box labeled "financial-analysis" with subtitle "Core / Required"
- Three sub-components inside: "skills/" (domain knowledge, auto-triggered), "commands/" (38 slash commands), ".mcp.json" (11 data connectors)

TIER 2 (MIDDLE) — Specialist Add-ons:
- Four equal-width boxes connected down from core:
  - "investment-banking" — CIMs, buyer lists, merger models
  - "equity-research" — earnings, coverage, theses
  - "private-equity" — deal sourcing, DD, IC memos
  - "wealth-management" — client reviews, rebalancing

TIER 3 (BOTTOM) — Data Layer:
- Row of 11 small labeled nodes: FactSet, S&P Global, Morningstar, Moody's, LSEG, PitchBook, Chronograph, Daloopa, Aiera, MT Newswires, Egnyte
- Connected up via MCP protocol lines into the core plugin's .mcp.json
- Label at bottom: "11 MCP Data Connectors — Institutional Grade"

CONNECTIONS: Straight 90-degree connector lines, downward arrows from core to add-ons, upward arrows from data layer to core

LABELS: All text in monospace/engineering font style, clear hierarchy

COLORS:
- Background: Blueprint Off-White #FAF8F5 with subtle grid overlay
- Core plugin box: Engineering Blue #2563EB fill, white text
- Specialist add-ons: Navy Blue #1E3A5F fill, white text
- Data connector nodes: Light Blue #BFDBFE fill, Deep Slate #334155 text
- Connector lines: Deep Slate #334155, 1.5px stroke
- Section labels: Amber #F59E0B for tier labels

STYLE: Blueprint technical schematic, precise thin lines, grid-aligned, no shadows, no gradients, engineering precision

Clean composition with generous white space. Simple blueprint-paper background with subtle grid. All elements grid-aligned with consistent spacing. ASPECT: 16:9
