# X Post — Anthropic Finance Plugins

**Format:** Single long-form post (X Premium, standalone value, NO link in main post)
**Publish:** Thursday, 2026-02-26
**Visual:** Screenshot of the actual DCF output or client report — real artifact beats any diagram

---

Anthropic released financial-services-plugins this week. I'm a tech product head at a financial firm who builds AI tools on the side.

I read the repo. Then I actually ran it — produced a DCF model and a client report.

Here's what I found:

---

**What's actually in the repo:**

Not a product in the traditional sense. An open-source collection of Markdown files and JSON config you install into Claude. One core plugin (financial-analysis), then four add-ons: investment-banking, equity-research, private-equity, wealth-management.

The commands:
→ /dcf [company] — DCF to Excel with live formulas and sensitivity tables
→ /comps [company] — comparable company analysis, IB format
→ /lbo [company] — LBO model with financing scenarios
→ /ic-memo [project] — investment committee memo
→ /earnings [company] [quarter] — post-earnings update

41 skills (auto-triggered domain knowledge). 38 commands. Zero code. Pure Markdown + JSON. Apache 2.0 open source.

The skill files are the part most coverage glosses over. They're not generic prompts dressed up with financial vocabulary. They encode structured domain knowledge — the kind of reasoning a senior analyst would apply. Worth reading even if you don't deploy.

---

**The real signal is in `.mcp.json`, not the commands.**

Open it and count the data vendors:

FactSet. S&P Global / Capital IQ. Morningstar. Moody's. LSEG. PitchBook. Chronograph. Daloopa. Aiera. MT Newswires. Egnyte.

Not startups. The $2,400–$10,000+ per-seat, multi-year-contract data vendors that every major financial firm uses and can barely imagine leaving.

When ALL of them build native MCP connectors in the same launch window, that's the financial data infrastructure industry declaring a standard.

The historical parallel: when Bloomberg and FactSet opened REST APIs in the 2010s, a whole generation of fintech was built on top. MCP is the 2026 version of that moment. The pipes are being laid.

Market reaction confirmed it: Thomson Reuters +11%, FactSet +6% after the announcement — they rallied when the market realized Anthropic was partnering with them, not competing. Data vendors are the pipes. Claude is the plumber.

---

**I actually ran it. Here's what the outputs looked like.**

The DCF came back as a live Excel workbook — formula references, linked cells, sensitivity table. Investment banking structure: revenue build, margin assumptions, terminal value, WACC, implied valuation range. Not something I'd send as-is without review, but the scaffolding was right.

The client report was similarly structured — executive summary, key metrics, portfolio commentary, professional language, formatted for a client-facing context. A solid first draft.

The value isn't that the output is perfect. It's that the starting point is right. A blank Excel and a blank document are very different from a correctly-structured workbook and a formatted draft. The former is a task. The latter is an editing job.

[Screenshot of DCF output]
[Screenshot of client report]

---

**The insight that surprised me most: skills are becoming the product.**

The architecture here — domain knowledge in Markdown files, organized into skills and commands, wired to data via JSON — is a pattern that's going to generalize far beyond financial services.

The software isn't the Python or the API calls. The software is the Markdown.

Skills-oriented project design, where the core IP lives in structured human-readable domain knowledge files rather than in code, is going to become more common. The codebase of the future for a lot of knowledge-work automation might primarily be a collection of well-structured Markdown files.

What follows from this:

The skill files themselves are the moat. Anyone can install this repo. Differentiation comes from the firm-specific skills layered on top — proprietary deal frameworks, house views encoded as constraints, institutional communication styles formalized into a skill file. That knowledge, codified and version-controlled, is harder to replicate than any SaaS subscription.

There's a real consulting opportunity around skills configuration. Translating an organization's actual processes into well-structured domain knowledge files is a craft. As this pattern spreads, the people who know how to do that translation will be in demand.

"Just Markdown" is the wrong read on the skepticism circulating this week. Firms don't want to write and maintain 41 custom system prompts. The files in this repo are pre-built, professionally designed domain knowledge. The fact that it's Markdown is a feature — any senior person who understands the workflow can read, verify, and extend it without touching code.

---

**A real example that changed how I think about this:**

A few weeks before this launch, I was in a conversation with our client-facing team about automating personalized investment recommendations. Client comes in with a specific portfolio, specific goals, specific risk profile. Producing a firm-standard recommendation used to take significant manual work.

The original plan: build an agentic workflow. Design the data pipeline, write the orchestration logic, build the output template, wire it to our systems, test it, maintain it. Weeks of development, ongoing maintenance, a dedicated owner. Real engineering.

After reading these plugins, I built a working version with a skill file in a few hours.

One Markdown file encoding our investment recommendation logic — our allocation framework, client communication standards, required disclosures, output format. One command to run it against a client profile. Output: a structured recommendation document, formatted to our standard, ready for advisor review.

[Screenshot: investment recommendation skill file]
[Screenshot: output document]

The surprise wasn't the output quality. It was the build speed. And the skill file is readable by any senior person on the team — reviewable, refinable, without touching code.

That gap — from "we need to build an agentic system" to "we need to write a skill file" — is the paradigm shift. Any workflow that can be encoded as structured reasoning belongs in a skill file now, not in a custom-built pipeline.

---

**On adoption in a real firm:**

Fast: deliverables in known formats where the data subscription is already in place. Earnings summaries, comp tables, first-draft reports. Months, not years.

Slower: full models going directly into client-facing materials. Compliance needs to sign off on the model architecture and the review process before that happens. Not a Claude problem — a controls problem that exists with Excel templates already.

Real blocker: data, not tooling. If your firm doesn't have FactSet or Capital IQ under contract, the MCP connectors don't unlock. But: fork the repo, configure .mcp.json to point at the one provider you do have, add your firm's own models and terminology. What used to require a software project now requires someone who can edit Markdown.

Start the compliance conversation before you're ready to deploy. The technical lift is lighter than expected. The organizational lift is where the timeline actually lives.

---

Anthropic released a design specification this week for what the AI-native financial firm's tooling stack looks like. The lasting contribution isn't any specific command. It's the skill-file pattern — domain knowledge encoded in structured, version-controlled, human-readable files that any senior person in the field can extend.

The firms encoding their institutional knowledge into skill files right now are building something that compounds. Not just a productivity tool. An organizational knowledge system.

I write about building AI-native at the intersection of financial services and tech product. Newsletter in bio.

---

*(Reply to post with blog link)*
**Reply text:** "Full breakdown + real DCF and client report outputs → https://www.aaronguo.com/blogs/anthropic-finance-plugins-insider-take"
