---
type: mixed
density: balanced
style: blueprint
image_count: 5
skip: [02-dcf-output, 03-client-report-output, 05-investment-recommendation-skill, 06-investment-recommendation-output]
---

# Illustration Outline — Anthropic Finance Plugins Insider Take

## Cover Image
**Position**: Top of article (before first paragraph)
**Purpose**: Visual anchor for the blog post — the complete AI stack architecture as a blueprint
**Visual Content**: Three-tier blueprint schematic: Claude + Skills (top) → four specialist modules (middle) → 11 data connectors (bottom). Title block: "ANTHROPIC FINANCIAL SERVICES / AI STACK — COMPLETE ARCHITECTURE". Apache 2.0 open-source stamp.
**Type**: infographic
**Style**: blueprint
**Filename**: 00-cover.png

## Illustration 1
**Position**: After "What's in the Repo" section (replaces `imgs/01-repo-architecture.jpg`)
**Purpose**: Visualize the plugin architecture — core + add-ons + data layer — before discussing MCP signal
**Visual Content**: Layered framework: core financial-analysis plugin at top with skills/commands/.mcp.json inside; 4 specialist add-ons (investment-banking, equity-research, private-equity, wealth-management) in middle tier; 11 MCP data connectors at bottom feeding up
**Type**: framework
**Style**: blueprint
**Filename**: 01-framework-repo-architecture.jpg

## Illustration 2
**Position**: NEW — inserted after "The architecture the market priced in: data vendors are the pipes. Claude is the plumber." in the MCP section
**Purpose**: Make the central thesis visual — 11 institutional data vendors all connecting to MCP protocol, then to Claude. The convergence moment.
**Visual Content**: Left side: 11 data vendor names (FactSet, S&P Global, Morningstar, Moody's, LSEG, PitchBook, etc.) as nodes. Center: MCP Protocol as the hub. Right side: Claude → Excel/PPT/Word outputs. Market data points: TR +11%, FactSet +6%.
**Type**: infographic
**Style**: blueprint
**Filename**: 02-infographic-mcp-convergence.jpg

## Illustration 3
**Position**: NEW — inserted after "That gap — between 'we need to build an agentic system' and 'we need to write a skill file' — is the paradigm shift." in the Real Example section
**Purpose**: Show the before/after paradigm shift — complex agentic pipeline vs single skill file
**Visual Content**: Split comparison. LEFT "Build Agentic Workflow": pipeline boxes — data pipeline → orchestration logic → output template → systems integration → testing → maintenance. Label: "Weeks of engineering". RIGHT "Write a Skill File": single Markdown file → run command → structured output. Label: "Hours". Bold divider in center.
**Type**: comparison
**Style**: blueprint
**Filename**: 03-comparison-agentic-vs-skill.png

## Illustration 4
**Position**: After "What Would Actually Get Adopted" section (replaces `imgs/04-adoption-framework.jpg`)
**Purpose**: Show the adoption reality — what moves fast vs what takes longer inside a real firm
**Visual Content**: Two-column comparison. LEFT "Moves Fast (Months)": earnings summaries, comp tables, research notes, client reports — icons for each, green check marks, label "Data subscription already in place". RIGHT "Moves Slower (Compliance Review)": DCF/LBO in client materials, full model sign-off, IT security review — amber warning icons, label "Controls process required". Bottom: shared blocker — "Real blocker: Data contracts, not tooling"
**Type**: comparison
**Style**: blueprint
**Filename**: 04-comparison-adoption-framework.png
