---
title: "Anthropic Just Handed Finance Teams a Complete AI Stack. I Ran It on Real Work — Here's What I Found."
slug: anthropic-finance-plugins-insider-take
date: 2026-02-26
pillar: product-leadership
target_audience: Financial professionals, product leaders in financial services, AI builders entering finance
tone: Opinion / insider take — confident, specific, grounded in experience
content_goal: Build authority / thought leadership
estimated_word_count: 2000-2500
publish_day: Thursday, 2026-02-26
cta_rotation: newsletter
---

# Content Plan: Anthropic Just Open-Sourced the Financial Firm's AI Stack. I Read the Entire Repo.

## Voice Check

**Positioning:** Ship with AI, not about AI — builder who ships, not commentator.
**Voice rule:** Use "I" not "you should." Share what I did, not what others should do.
**This post's personal anchor:** I spent time this week going through Anthropic's new financial-services-plugins repo — not as a tech blogger, but as someone who manages analysts and runs product at a financial firm. I know what new software adoption looks like from the inside: the compliance review, the IT procurement, the data governance questions, the change management. That lens is what makes this post different from the 50 other breakdowns already published.

## Hook / Opening

**Blog hook:** "Anthropic released its financial-services-plugins this week — five Claude plugins covering everything from DCF models and LBO analysis to equity research reports and IC memos, wired directly to 11 institutional data sources including FactSet, S&P Global, Morningstar, and Moody's. The hot take spreading through finance Twitter is: 'junior analysts are next.' I manage analysts. I run product at a financial firm. I've spent the last few years watching AI come into this industry. Here's my actual take — and it's more nuanced, and more interesting, than the replacement narrative."

**X post hook:** "Everyone's asking if Anthropic's new finance plugins will replace junior analysts. I manage junior analysts. I spent the week going through the repo. My actual answer:"

## Core Argument / Thesis

Anthropic's financial-services-plugins are genuinely important — but not for the reason most people think. The plugins themselves are useful; the real signal is structural: when FactSet, S&P Global, Moody's, LSEG, and PitchBook all build MCP connectors in the same week, that's not a product launch. That's the financial data infrastructure declaring a standard. For product leaders inside financial firms, this is the inflection point to watch — not whether junior analysts will be replaced, but whether your firm will be building on this infrastructure or buying a lagging vendor solution three years from now.

## Outline

### Section 1: What Anthropic Actually Released (The 60-Second Version)
- Not a product in the traditional sense — it's an open-source collection of Markdown + JSON files you install into Claude
- Structure: `financial-analysis` (core, required) + 4 specialist add-ons: investment-banking, equity-research, private-equity, wealth-management
- What it can actually do:
  - `/comps [company]` — comparable company analysis
  - `/dcf [company]` — full DCF model in Excel with live formulas
  - `/lbo [company]` — LBO model with sensitivity tables
  - `/ic-memo [project]` — investment committee memo
  - `/earnings [company] [quarter]` — post-earnings update
  - Full PPT output with firm-branded templates
- 41 skills (auto-triggered domain knowledge), 38 explicit commands
- 11 MCP data connectors: FactSet, S&P Global/Capital IQ, Morningstar, Moody's, LSEG, PitchBook, Aiera, Daloopa, Chronograph, MT Newswires, Egnyte
- Zero code required: pure Markdown + JSON. Apache 2.0 open source. Fork and customize.
- Personal reaction: I read through the repo directory structure. It's clean. It's well-designed. It's the kind of thing I'd actually show my dev team.

### Section 2: The Real Signal — MCP Just Became Wall Street's Standard
- Most coverage focuses on the plugins. The more important story is in the `.mcp.json` file.
- Count the logos: FactSet. S&P Global. Morningstar. Moody's. LSEG. PitchBook. These aren't startups. These are the data vendors that charge $2,400–$10,000+ per seat per year and have multi-year enterprise contracts.
- When ALL of them build native MCP connectors in the same launch window, that's consensus. That's the financial data infrastructure industry saying: "MCP is the protocol we're building on."
- Compare to what happened with APIs in the 2010s — once Bloomberg and FactSet had REST APIs, a whole generation of fintech was built on top. MCP connectors are the 2026 equivalent.
- The market reaction confirmed the read: Thomson Reuters +11%, FactSet +6% AFTER the announcement. They popped because the market realized Anthropic was partnering with incumbent data vendors, not trying to displace them. They're the pipes. Claude is the plumber.
- Personal context: In my firm, we already have FactSet and one or two of these other providers under contract. The question I'm now asking internally is: what does it cost to turn on the MCP connector vs. what we'd build ourselves? That's a very different question than "should we adopt AI?"

### Section 3: What Would Actually Get Adopted (And What Won't)
- Let me be specific about what adoption looks like inside a real financial firm — not a hedge fund or Goldman with dedicated tech teams, but a mid-market investment management firm:
  - **What will get adopted fast:** Anything that speeds up deliverables analysts already produce — earnings summaries, comp tables, draft research notes. The firm already has the data subscriptions. The lift is just: install the plugin, configure `.mcp.json`, done.
  - **What will take longer:** Full DCF and LBO models with live formulas. Not because Claude can't do it — because compliance and risk teams will want to review the model architecture before it goes in a client deck. That's not an AI problem; that's a controls problem we have with Excel templates already.
  - **What the skeptics miss:** A critic I read this week argued that the "skills are just prompts" and anyone can replicate them in a cheaper model. Technically true. Practically irrelevant to an enterprise buyer — firms don't want to build and maintain system prompts for 41 financial workflows. The Markdown files are the product.
  - **The real adoption blocker:** It's not the tool. It's the data. If your firm doesn't already have FactSet or S&P Capital IQ under contract, you're not unlocking the full power. The plugins work without the MCP connectors — but that's like having a Bloomberg terminal with no data feed.
- Personal note: The open-source nature changes the calculus for mid-market. We can fork the repo, add our firm's terminology, swap in the one data provider we do have. That's different from buying a $200K/yr enterprise SaaS contract.

### Section 4: My Honest Answer on the Junior Analyst Question
- The question everyone's asking: will this replace junior analysts?
- My honest answer: it replaces the parts of the junior analyst job that neither the analyst nor the firm values.
  - Nobody goes to Wharton to pull comps for 6 hours. Nobody accepts a PE internship to format a 40-page CIM. These tasks exist because they had to. Now they don't.
  - What this actually does is compress the "data to deliverable" timeline. A task that took a first-year analyst 2 days could take Claude 20 minutes. That's real.
- What it doesn't replace: judgment, relationships, and the ability to see what the data is actually saying vs. what it literally shows. The senior analysts I work with aren't valuable because they can run a DCF. They're valuable because they know which assumptions to question.
- The more precise framing: the junior analyst job will change, not disappear. The skills that survive are the ones that require knowing WHY, not just HOW. Analyst hiring will likely shrink. Analyst output will go up. The people who adapt are the ones who treat Claude as leverage, not as threat.
- Personal reference: I wrote a few weeks ago about McKinsey's 2035 wealth management predictions. This is the same dynamic — the timeline consultants quote is too conservative. The "junior analyst augmented by AI" world isn't 2035. It's 2027 for early movers.

### Section 5: What This Means If You're a Product Leader in Finance
- For product leaders at financial firms, this is not a "watch and wait" moment. A few specific moves I'm thinking about:
  - **Audit your data contracts now.** Which of the 11 MCP providers does your firm already pay for? The ones you have are free wins. The ones you don't have are buy/build decisions.
  - **Fork the repo.** Even if you're not deploying tomorrow, read the skill files. They represent Anthropic's opinionated view of how financial workflows should be structured. That's a roadmap.
  - **The "builder vs. buyer" split is coming.** Firms that understand what's under the hood will customize and compound. Firms that wait for a vendor to package it will pay 3x and get a solution that's already a generation behind. I wrote about this pattern in the McKinsey post — it's happening again, faster.
  - **Start the compliance conversation early.** The technical lift is small. The organizational lift (compliance sign-off, IT security review, data governance) is where time actually goes. Start that clock now.
- This is why I'm building OrgNext: because the future of the financial firm isn't a firm that adopts AI tools. It's a firm that's designed, from the operating model up, around AI as a first-class team member. These plugins are a preview of that architecture.

### Conclusion: The Architecture of the AI-Native Firm
- Anthropic didn't just release plugins this week. They released an architectural blueprint for what the AI-native financial firm looks like: modular, data-connected, workflow-specific, zero-code customizable.
- The junior analyst question is a distraction. The right question is: what does your firm's operating model look like when a single analyst has 11 institutional data sources, 41 domain skills, and 38 on-demand commands at their fingertips?
- The firms building for that world right now will look back at this week's launch the way forward-thinking firms looked at the Bloomberg terminal in 1983 or the Excel pivot table in 1994. Not as a curiosity. As the moment the floor shifted.
- CTA: "I write about this intersection — financial services, AI, and what building AI-native looks like from the inside of a real firm. Newsletter below."

## Research References

- [GitHub - anthropics/financial-services-plugins](https://github.com/anthropics/financial-services-plugins) — Source repo: full plugin structure, commands, skills, MCP connectors
- [Cowork and plugins for finance | Claude](https://claude.com/blog/cowork-plugins-finance) — Anthropic's official launch blog post
- [TechCrunch: Anthropic launches new push for enterprise agents](https://techcrunch.com/2026/02/24/anthropic-launches-new-push-for-enterprise-agents-with-plugins-for-finance-engineering-and-design/) — Market context, coverage of Cowork expansion
- [Bloomberg: Anthropic Links AI Agent With Tools for Investment Banking, HR](https://www.bloomberg.com/news/articles/2026-02-24/anthropic-links-ai-agent-with-tools-for-investment-banking-hr) — Institutional coverage with market reaction data (Thomson Reuters +11%, FactSet +6%)
- [Inferential Investor: Claude Just Launched an Equity Research Plugin. Here's Why You Don't Need It.](https://www.inferentialinvestor.com/p/claude-just-launched-an-equity-research) — Skeptical take: "skills are just prompts," enterprise-only pricing barriers, data cost reality
- [Finextra: Anthropic launches financial services plugins for Claude Cowork](https://www.finextra.com/newsarticle/47353/anthropic-launches-financial-services-plugins-for-claude-cowork) — Finance industry trade press coverage
- [Inc: Anthropic's New Claude Plugins Take Aim at Finance, HR, and More](https://www.inc.com/ben-sherry/anthropics-new-claude-plugins-take-aim-at-finance-hr-and-more-is-your-job-next/91307114) — The "is your job next" framing — represents the hot take to address directly
- [LSEG: Supercharge Claude's Financial Skills With LSEG Data](https://www.lseg.com/en/insights/supercharge-claudes-financial-skills-with-lseg-data) — Partner perspective from LSEG — data vendor buy-in documentation
- [Previous post: McKinsey Says 2035. I Say They're Off by 5 Years.](https://www.aaronguo.com/blogs/mckinsey-wealth-management-2035-ai-insider-take) — Aaron's Feb 17 post to reference/link internally

## SEO Notes

**Primary keyword:** Anthropic financial services plugins
**Secondary keywords:** Claude finance plugins, MCP financial data, Claude replace junior analyst, AI investment banking tools, Claude Cowork finance
**Search intent:** Informational — people searching after seeing the launch announcement want an insider take and practical breakdown. Finance professionals googling to understand the real-world impact. Product leaders evaluating whether/how to adopt.

## Distribution Plan

### X Post Brief (publish: Thursday, 2026-02-26)
**Format:** Single long-form post (X Premium, up to 25K chars). Standalone value. NO link in main post.
**Hook:** "Everyone's asking if Anthropic's new finance plugins will replace junior analysts. I manage junior analysts. I spent the week going through the repo. My actual answer:"
**Key points:**
1. Quick breakdown of what was actually released (5 plugins, 11 MCP data connectors, 41 skills, 38 commands — zero code, pure Markdown + JSON)
2. The real signal: when FactSet, S&P Global, Moody's, LSEG, and PitchBook all build native MCP connectors in the same launch window — that's the financial data infrastructure declaring a standard. Thomson Reuters +11%, FactSet +6% after announcement confirmed it.
3. What would actually get adopted vs. what won't (data contracts are the real bottleneck, not the AI)
4. My honest answer on junior analysts: it replaces the parts nobody valued anyway. The question isn't replacement — it's which skills survive. Judgment survives. Data formatting doesn't.
5. For product leaders in finance: audit your data contracts now, fork the repo, start the compliance conversation early
**Closing:** "I write about building AI-native at the intersection of financial services and product. Newsletter in bio — covers what actually works, not just what launched." (cta_rotation: newsletter)
**Reply with link:** "Full breakdown with the adoption framework → [blog URL]" — posted as a reply, NOT in the main post.
**Visual:** Side-by-side comparison — "What analysts spend time on today" vs. "What Claude handles after this launch" — highlight what survives (judgment, relationships) vs. what gets automated (data pulling, model formatting, report drafting).

### X Standalone Tweet Brief (publish: Saturday, 2026-02-28)
**Format:** Single tweet with image.
**The insight:** "The real signal in Anthropic's finance plugin launch isn't the DCF command or the LBO model. It's that FactSet, S&P, Moody's, LSEG, and PitchBook all built MCP connectors in the same week. When the data infrastructure agrees on a protocol, the application layer gets built on top. Fast."
**Image idea:** Simple visual showing the 11 MCP provider logos feeding into Claude, labeled "The pipes just got laid." Clean, bold typography.

### Newsletter / LinkedIn Teaser Brief (publish: Thursday, 2026-02-26)
**Format:** Short teaser post — same copy works for email newsletter (Beehiiv) and LinkedIn. Plain text, no markdown formatting. Ends with bare blog URL.
**Structure:** 3-4 short paragraphs: hook → insider perspective → the real signal → CTA with bare URL.
**Draft:**
Anthropic released financial-services-plugins this week — five Claude plugins covering DCF models, LBO analysis, equity research reports, IC memos, and wealth management workflows, wired to 11 institutional data sources including FactSet, S&P Global, Moody's, and PitchBook. Zero code. Pure Markdown + JSON. Open source.

The hot take spreading through finance Twitter: "junior analysts are next." I manage analysts. I run product at a financial firm. My read is more nuanced — and the most interesting part of this launch isn't the plugins at all.

When FactSet, S&P Global, Moody's, LSEG, and PitchBook all build MCP connectors in the same launch window, that's not a product announcement. That's the financial data infrastructure declaring a protocol standard. That's the signal worth paying attention to.

https://www.aaronguo.com/blogs/anthropic-finance-plugins-insider-take

### Chinese Version
**Translate:** Full blog post + X post
**Note:** The "AI replacing junior analysts" angle resonates strongly in Chinese finance and tech communities — this is an active conversation in 券商 (brokerage) and PE/VC circles in China. The MCP protocol story is also highly relevant since Chinese tech community is watching MCP adoption closely. Key term translations: 金融分析师 (financial analyst), 投资银行 (investment banking), 私募股权 (private equity), 财富管理 (wealth management). The tone in the Chinese version can be slightly more direct about the replacement timeline.

## Personal Experience Notes

- Aaron is Head of Products & Partner at a financial firm (investment management) — manages developers, QAs, and interacts with analyst teams
- Can speak from experience on: what software adoption looks like inside a regulated financial firm (compliance review, IT security, data governance, procurement)
- Firm already has contracts with one or more of the 11 MCP providers — the "turn on the connector" vs. "buy new data subscription" framing is real
- Manages analysts: the junior analyst replacement question is personal, not theoretical. Has seen firsthand which skills in analysts are irreplaceable vs. which are administrative overhead
- Built AI agent on Mac mini (from Feb 18 post) — understands what "zero-code Markdown" means in practice from a builder's perspective
- Building OrgNext: AI-native firm management — this launch is directly adjacent to what OrgNext is solving. Can reference OrgNext as the larger vision.
- Connection to Feb 17 McKinsey post: that post argued Anthropic's agentic AI timeline is 2027, not 2035. This post is concrete evidence — the data infrastructure is now in place.
- DO NOT name the specific firm — keep as "a financial firm" or "my firm"
- The open-source angle matters: forking the repo and adding firm-specific skills is the move for mid-market firms that don't have dedicated AI engineering teams. This is the democratization story the McKinsey report missed.
- The "Inferential Investor" skeptical take (skills are just prompts, enterprise-only access) is worth addressing directly — it's partially right but misses the enterprise procurement reality: firms don't want to maintain 41 custom system prompts.
