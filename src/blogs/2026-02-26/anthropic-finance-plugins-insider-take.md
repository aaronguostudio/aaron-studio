# Anthropic Just Handed Finance Teams a Complete AI Stack. I Ran It on Real Work — Here's What I Found.

![Blueprint architecture diagram of Anthropic's financial AI stack — Claude + Skills at top, four specialist modules in the middle, 11 institutional data connectors at the bottom. Open Source stamp. Apache 2.0 · Released Feb 2026.](imgs/00-cover.jpg)

Anthropic released its financial-services-plugins this week — five Claude plugins covering DCF models, LBO analysis, equity research reports, IC memos, and wealth management workflows, wired to 11 institutional data sources including FactSet, S&P Global, Morningstar, and Moody's.

I build software at a financial firm. I spent time this week going through the repo — then ran it on real work. I produced a DCF model and a client report. Here's what I actually found.

## What's in the Box

Five plugins. A core foundation layer that installs first — Financial Analysis — then four specialist modules you add based on what your team does:

| Plugin | What it does |
|--------|-------------|
| **Investment Banking** | Drafts CIMs, builds buyer lists, runs merger models, tracks deals |
| **Equity Research** | Writes earnings reports, builds investment theses, runs sector coverage |
| **Private Equity** | Sources deals, runs due diligence, drafts IC memos, monitors portfolio KPIs |
| **Wealth Management** | Preps client meetings, rebalances portfolios, builds financial plans |

Each plugin adds slash commands you run directly — `/comps [company]`, `/dcf [company]`, `/earnings [company] [quarter]`, `/ic-memo [project]`. Output lands in Excel with working formulas, PowerPoint with your firm's branded templates, or Word documents. No code. No setup beyond installing the plugin.

What most coverage glosses over: the skill files. These aren't generic AI prompts dressed in financial vocabulary. They encode the kind of reasoning a senior analyst actually applies to a comp table or an IC memo. Read through a few and you'll see what thoughtful design looks like.

Neither the commands nor the skill files are the most interesting part of this launch.

![Repo architecture: financial-analysis core plugin, four specialist add-ons, 11 MCP data connectors wired to institutional data sources](imgs/01-framework-repo-architecture.jpg)

## The Data Incumbents Just Declared a Standard

FactSet. S&P Global. Morningstar. Moody's. LSEG. PitchBook — eleven institutional data vendors, all building native MCP connectors in the same launch window. These aren't startups. They're the data backbone of institutional finance, with multi-year enterprise contracts embedded at every major firm.

When incumbents this entrenched all move in the same direction at once, that's a standard being declared. The historical parallel: when Bloomberg and FactSet opened REST APIs in the 2010s, a generation of fintech was built on top. MCP is the 2026 version of that moment.

Data vendors are the pipes. Claude is the plumber.

![MCP convergence: 11 institutional data vendors all connecting to MCP Protocol, feeding into Claude and its outputs](imgs/02-infographic-mcp-convergence.jpg)

In my firm, the question isn't "should we adopt AI?" — that's settled. It's: what does it cost to turn on the MCP connector for the data vendor we already have under contract? That's a different, and much more tractable, conversation.

## I Actually Ran It — DCF and Client Report

Reading the repo is one thing. I wanted to know what it actually produces on real work.

I ran two tests: a DCF model and a client-facing report. The output files below are real — unmodified outputs from Claude, shared here exactly as generated so you can see what the plugin actually produces.

**The DCF:**

The output came back as a proper Excel workbook — not a static table, not a screenshot, but a live model with formula references, linked cells, and a sensitivity table built in. The structure followed investment banking conventions: revenue build, margin assumptions, terminal value, WACC calculation, implied valuation range. It wasn't perfect — there were assumptions I'd adjust and a few places where I'd want to override the defaults — but the scaffolding was right, and editing it from that starting point is materially faster than building from scratch.

📎 **[Download: AMZN DCF Model (Excel)](assets/AMZN_DCF_Model_2026-02-25.xlsx)** — actual output from `/dcf AMZN`, unedited after generation

![AMZN DCF model in Excel — scenario assumptions, revenue build, WACC, and sensitivity table as generated](imgs/02-dcf-output-excel.png)

**The Client Report:**

The report output (generated using sample data, not real client information) was similarly structured — executive summary, key metrics, portfolio commentary, formatted for a client-facing context. The language was professional. The structure was standard. Again, not something I'd send as-is without review, but a solid first draft that cuts the "blank page" problem entirely.

![Client report output — formatted for client-facing use](imgs/03-client-report-output.png)

📎 **[Download: Client Performance Report (Excel)](assets/Chen_Robert_Performance_Report_FY2025.xlsx)** — actual output from the client report command, real test run

What I took away from both: the value is not in the final output being perfect. It's in the starting point being right. A blank Excel and a blank document are very different from a correctly-structured workbook and a properly-formatted draft. The former is a task. The latter is an editing job. That gap — from blank page to structured starting point — is where most of the time goes in practice.

## Skills Are Becoming the Product

After using this, I came away thinking about something broader than just these specific plugins.

The architecture here — domain knowledge encoded in Markdown files, organized into skills and commands, wired to data sources via JSON — is a pattern that's going to generalize far beyond financial services. The software isn't the Python or the API calls. The software is the Markdown.

This is a meaningful shift in what building looks like. Skills-oriented project design — where the core IP of the system lives in structured, human-readable domain knowledge files rather than in code — is going to become more common. The codebase of the future, for a lot of knowledge-work automation, might primarily be a collection of well-structured Markdown files.

![Skills Oriented Programming — expertise encoded in structured files, not in code](imgs/07-skills-oriented-programming.jpg)

A few things follow from this:

**The skill files themselves are the moat.** Anyone can install this repo. The differentiation comes from the firm-specific skills layered on top — the proprietary deal frameworks, the house views encoded as constraints, the client communication style formalized into a skill file. That institutional knowledge, codified and version-controlled, is harder to replicate than any SaaS subscription.

**There's a real consulting opportunity around skills configuration.** Writing and structuring skill files for specific industries and workflows is a craft. A firm that hires someone to configure these properly — translating their actual processes into well-structured domain knowledge files — gets something qualitatively different from a firm that installs the defaults and leaves them. As this pattern spreads, the people who know how to do that translation well will be in demand.

**"Just Markdown" is the wrong way to read the skepticism.** One critique circulating this week: these skills are "just prompts," and anyone could replicate them with a cheaper model. Technically true. Practically irrelevant. Firms don't want to write and maintain custom system prompts for 41 financial workflows. The files in this repo are pre-built, version-controlled, professionally designed domain knowledge. The fact that it's Markdown is a feature — any senior person who understands the workflow can read, verify, and extend it without touching a line of code.

## A Real Example: From Agentic Workflow to Skill File

This shift became concrete for me through a conversation I'd been having with our client-facing team a few weeks before this launch.

The problem we were trying to solve: automating personalized investment recommendations. A client comes in with a specific portfolio, specific goals, specific risk profile. Producing a thoughtful, firm-standard recommendation used to take significant manual work — pulling the data, reasoning through the allocation logic, drafting the document in our format.

The original plan was to build an agentic workflow from scratch. Design the data pipeline, write the orchestration logic, build the output template, wire it to our systems, test it, maintain it. Real engineering work — weeks of development, ongoing maintenance, a dedicated person to own it.

After reading through these plugins, I realized we could get most of that done with a skill file.

One skill file that encodes our investment recommendation logic — our allocation framework, our client communication standards, our required disclosures, our output format. One command that pulls the client's portfolio data and runs it through that reasoning. The output: a structured recommendation document, formatted to our standard, ready for advisor review.

I leveraged the wealth management skill to run it against a sample client profile — and the output speaks for itself.

![Output: personalized investment recommendation generated from the skill, formatted to firm standard](imgs/06-investment-recommendation-output.png)

📎 **[Download: Investment Proposal (Markdown)](assets/Guo_Aaron_Investment_Proposal.md)** — actual skill output for a sample client profile, unedited

The thing that surprised me wasn't the quality of the output — it was the speed of building it. What I estimated as a several-week engineering project became a few hours of writing a well-structured Markdown file. The skill file itself is readable by any senior person on the team. It can be reviewed, questioned, and refined without touching a line of code.

That gap — between "we need to build an agentic system" and "we need to write a skill file" — is the paradigm shift. And it's not just for investment recommendations. Any workflow that can be encoded as structured reasoning belongs in a skill file now, not in a custom-built agentic pipeline.

![Paradigm shift: building an agentic workflow (weeks of engineering) vs writing a skill file (hours)](imgs/03-comparison-agentic-vs-skill.jpg)

## What Would Actually Get Adopted

A few things from the technical and hands-on evaluation:

**What moves fast:** Deliverables in known formats where the data subscription is already in place. Earnings summaries, comp tables, first-draft research notes, client-facing reports. The incremental lift: install the plugin, configure `.mcp.json` to point at the provider you already use, done. Months, not years.

**What moves slower:** Full models going directly into client-facing materials without review. Before an AI-generated DCF goes in a pitch deck, compliance and risk need to sign off on the model architecture and the review process. That's not a Claude problem — it's a controls problem that exists with Excel templates already. It just gets more formal when AI is in the loop.

**The real blocker is data, not tooling.** If your firm doesn't have FactSet or Capital IQ under contract, you're not unlocking the full depth of these connectors. The plugins function without the MCP data feeds — but it's the difference between a Bloomberg terminal with a subscription and one without. The open-source nature changes the calculus for mid-market though: fork the repo, configure `.mcp.json` to point at the one provider you do have, add your firm's own models and terminology. What used to require a software project now requires someone who can edit Markdown.

**Start the compliance conversation before you're ready to deploy.** The technical lift is lighter than most teams expect. The organizational lift — compliance sign-off, IT security review, data governance documentation — is where the timeline actually lives. If you wait until you're technically ready to start that conversation, you've already lost two or three months.

![What moves fast vs. what takes longer — adoption framework for mid-market financial firms](imgs/04-comparison-adoption-framework.jpg)

## The Blueprint

Anthropic didn't just release plugins this week. They released a design specification for what the AI-native financial firm's tooling stack looks like.

The architecture: a core plugin with shared modeling infrastructure, specialist add-ons per function, MCP connectors for institutional data, workflow outputs directly to Excel and PowerPoint. Modular, data-connected, workflow-specific, customizable in Markdown.

The more I think about it, the more I think the skill-file pattern is the lasting contribution here — not any specific command or output. Domain knowledge encoded in structured, version-controlled, human-readable files that any sufficiently senior person in the relevant field can read and extend. That's a genuinely new software primitive.

The firms figuring out how to encode their institutional knowledge into skill files right now — their deal frameworks, their research methodologies, their client communication standards — are building something that compounds. Not just a productivity tool. An organizational knowledge system that gets more useful over time.

The firms that wait for a vendor to package this into a licensed product will pay three times as much for something already a generation behind. We've seen this pattern before in financial technology. It's playing out again.

![The Blueprint — AI-native financial firm architecture: institutional knowledge in skill files, core infrastructure with specialist modules, data connectors feeding from below, outputs to Excel/PowerPoint/Word](imgs/08-blueprint-ai-native-firm.jpg)

## Downloads — Real Outputs From This Post

All files below are unmodified outputs from Claude, generated during the tests described above. Shared as-is to show what the plugin actually produces.

| File | Format | Section |
|------|--------|---------|
| [AMZN DCF Model](assets/AMZN_DCF_Model_2026-02-25.xlsx) | Excel | I Actually Ran It |
| [Client Performance Report](assets/Chen_Robert_Performance_Report_FY2025.xlsx) | Excel | I Actually Ran It |
| [Investment Proposal](assets/Guo_Aaron_Investment_Proposal.xlsx) | Excel | From Agentic Workflow to Skill File |
| [Investment Proposal](assets/Guo_Aaron_Investment_Proposal.md) | Markdown | From Agentic Workflow to Skill File |

---

*I write about building AI-native at the intersection of financial services and tech product — what it actually looks like from inside a firm. Newsletter below:*

*→ [Ship with AI on Beehiiv](https://shipwithai.beehiiv.com)*
