---
title: "I Build Software at a Financial Firm. Anthropic Just Changed the Game."
slug: anthropic-financial-plugins-changed-the-game
date: 2026-02-26
pillar: ai-native-execution
target_audience: Financial professionals, product leaders, AI-curious finance practitioners
tone: Analytical + personal narrative
content_goal: Build authority / thought leadership
estimated_word_count: 2000-2500
publish_day: Wednesday, 2026-02-26
cta_rotation: newsletter
---

# Content Plan: I Build Software at a Financial Firm. Anthropic Just Changed the Game.

## Voice Check

**Positioning:** Ship with AI, not about AI — builder who ships, not commentator who theorizes.
**Voice rule:** Use "I" not "you should." Share what I did, not what others should do.
**This post's personal anchor:** I build software at a financial firm. I lead a dev team and work alongside analysts every day — I see how they actually work — the hours spent on data pulls, Excel plumbing, and formatting. This plugin solves problems I watch my team struggle with in real time. I also build AI-native software (OrgNext), so I evaluate this from both a user and architect perspective.

## Hook / Opening

**Blog hook:** Anthropic quietly dropped something on GitHub today that most people in finance will sleep on — and shouldn't. It's called financial-services-plugins: an open-source toolkit that turns Claude into a full-stack financial analyst. Not a chatbot that knows what a DCF is. An actual working system that pulls live data from S&P Global, FactSet, and Moody's, builds models with real formulas, and outputs publication-ready Excel, PowerPoint, and Word.

**X thread hook (tweet 1):** Anthropic just open-sourced a toolkit that turns Claude into a Wall Street analyst. S&P Global, FactSet, Moody's — all wired in. I build software at a financial firm. Here's why this changes everything:

## Core Argument / Thesis

Anthropic's financial-services-plugins isn't just another AI demo — it's the first credible end-to-end AI financial toolkit backed by institutional data providers. The architecture (Markdown-based, forkable, MCP-connected) is a reference implementation for how enterprise AI should be built. Firms that integrate this into their workflows will have a structural advantage.

## Outline

### Section 1: What It Actually Is
- 5 plugins: core financial-analysis + 4 role-specific (IB, ER, PE, WM)
- 41 skills, 38 slash commands, 11 MCP data connectors
- The key differentiator: zero code — entire system is Markdown + JSON
- Data partners: S&P Global, FactSet, Moody's, LSEG, Morningstar, PitchBook, Daloopa, Aiera, MT Newswires, Chronograph, Egnyte
- End-to-end workflows: Research → Analysis → Modeling → Output (Excel with live formulas, PPT with branded templates, Word)

### Section 2: Why This Matters — From Someone Who Lives It
- Personal experience: watching analysts spend 2-4 hours gathering data before they start thinking
- The data problem is (almost) solved: institutional providers built official MCP connectors — this is a distribution story, not just a tech story
- End-to-end vs point solutions: most AI tools do one thing; this chains the entire workflow in one session
- The architecture insight: skills (auto-triggered domain knowledge) vs commands (explicit actions) — elegant separation
- Plugin structure designed to be forked: swap data sources, inject firm terminology, enforce house style

### Section 3: What I'd Actually Use Tomorrow
- `/comps [company]` — Comparable Company Analysis: our analysts build these constantly, 2-4 hours manual → one command. Excel output has live formulas, not static numbers — critical for trust.
- `/earnings [company] [quarter]` — Post-Earnings Analysis: earnings season sprint, eliminates the 80% mechanical work (data gathering, formatting, boilerplate)
- `/ic-memo [project]` — IC Memo: rigid structure that differs per firm. The skill file is a Markdown template — paste your firm's format, Claude follows it. Customization without prompt engineering.

### Section 4: Will This Replace Junior Analysts?
- No, but it redefines what a junior analyst does
- Automated layer: data pulls, model population, first-draft formatting
- The new expectation: more thinking, less spreadsheet plumbing
- Honest take: headcount pressure is real — some firms hire fewer, others double coverage with the same team
- The winners invest freed hours into deeper analysis, not just cost savings

### Section 5: What This Signals
- MCP is becoming the standard — when S&P, FactSet, Moody's all build MCP connectors, that's commitment
- Anthropic is going vertical — role-specific plugins, industry workflows, data vendor partnerships, open source
- Plugin model is the future of enterprise AI — not fine-tuning, not RAG, but structured forkable configuration
- For builders: this is a reference implementation worth studying (OrgNext connection — customizable framework > monolithic SaaS)

### Conclusion / Call to Action
- The firms that figure out integration in the next 12 months will have a structural advantage
- It's not about replacing people — it's about making every person dramatically more capable
- "And it starts with a Markdown file."
- Blog CTA: newsletter signup — "I write weekly about building with AI in finance. Subscribe to Ship with AI."
- Thread CTA: "I write a weekly newsletter about AI-native execution for product builders. Link in bio."

## Research References

- https://github.com/anthropics/financial-services-plugins — Primary source, full repo analysis
- https://x.com/tradesmax/status/2026786529625125273 — Trending discussion (21.8K views, 256 likes, 347 bookmarks)
- https://github.com/anthropics/financial-services-plugins/blob/main/README.md — Architecture details, plugin structure, MCP integrations list
- https://modelcontextprotocol.io/ — MCP protocol reference

## SEO Notes

**Primary keyword:** Anthropic financial services plugins
**Secondary keywords:** Claude for finance, AI financial analyst, MCP financial data, AI investment banking tools
**Search intent:** Informational — people searching after seeing the announcement want a deep, opinionated breakdown from someone in the industry

## Distribution Plan

### X Post Brief (publish: Wed Feb 26)
**Format:** Single long-form post (X Premium). Standalone value. NO link in main post.
**Hook:** "Anthropic just open-sourced a toolkit that turns Claude into a Wall Street analyst. S&P Global, FactSet, Moody's — all wired in. I build software at a financial firm. Here's why this changes everything:"
**Key points:**
- What it is: 5 plugins, 41 skills, 11 institutional data sources via MCP. Zero code — pure Markdown + JSON.
- Why the data story matters: S&P, FactSet, Moody's building official connectors = distribution, not just tech.
- What I'd use tomorrow: /comps, /earnings, /ic-memo — with specific workflow examples from my firm.
- The junior analyst question: doesn't replace them, redefines what they do. More thinking, less Excel plumbing.
- The signal: MCP is becoming the standard. Anthropic is going vertical. Plugin architecture > monolithic SaaS.
**Closing:** "I write a weekly newsletter about building with AI in finance and product. Link in bio." (cta_rotation: newsletter)
**Reply with link:** "Full deep dive with architecture breakdown: [blog URL]"
**Visual:** Screenshot of the GitHub repo structure + MCP integrations table

### X Standalone Tweet Brief (publish: Fri Feb 28)
**Format:** Single tweet with image.
**The insight:** "The most interesting thing about Anthropic's financial plugins isn't the AI — it's that S&P Global, FactSet, and Moody's all built official MCP connectors. When the data incumbents buy in, the adoption curve compresses dramatically."
**Image idea:** Diagram showing MCP data flow: Data Providers → MCP → Claude → Excel/PPT/Word outputs

### Newsletter / LinkedIn Teaser Brief (publish: Wed Feb 26)
**Format:** Short teaser post — plain text, no markdown. Ends with bare blog URL.
**Structure:**
Anthropic just open-sourced a financial services toolkit that connects Claude directly to S&P Global, FactSet, Moody's, and 8 other institutional data providers. Not a demo — a working system that outputs Excel with live formulas, branded PowerPoint decks, and research reports.

I build software at a financial firm. I see how my team works every day. This is the first AI toolkit that actually maps to real financial workflows — from data pull to deliverable in one session.

I wrote a deep dive on what it is, why the architecture matters, and what I'd actually deploy at my firm tomorrow.

https://aaronguo.com/blog/anthropic-financial-plugins-changed-the-game

### Chinese Version
**Translate:** Full blog post + X post. Adapt for Chinese finance audience — emphasize MCP 协议 becoming industry standard, and the "zero code" angle for non-technical finance professionals.

## Personal Experience Notes

- I lead a dev team at a financial firm, building the tools our analysts use. I watch them spend hours on data gathering and Excel formatting daily — this is not theoretical pain, it's my team's reality.
- Building OrgNext (AI-native firm management) — the plugin architecture mirrors what I believe: customizable frameworks beat monolithic products for enterprise.
- The "trust" angle is key: Excel output with live formulas (not static AI numbers) is critical. Nobody in finance trusts a black box. This design choice shows Anthropic understands the industry.
- Justin (my boss) and I have different views on AI execution speed. This kind of tool could be a bridge — it's practical enough for skeptics to see the value immediately.
- The MCP story connects to my broader thesis: AI-native execution isn't about one tool, it's about the protocol layer that connects everything. MCP for finance is like APIs were for fintech 10 years ago.
