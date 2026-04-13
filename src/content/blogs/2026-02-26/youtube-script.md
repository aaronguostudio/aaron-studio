# YouTube Script: Anthropic Just Gave Wall Street an AI Blueprint. I Ran It on Real Work.

**Estimated length:** 6-8 minutes
**Format:** Narration over illustrations (slides)

---

## [SLIDE: Hook — 00-cover.jpg]

Anthropic released its financial services plugins this week — five modules for Claude covering DCF models, equity research, investment banking, private equity, and wealth management. All open source. All wired to eleven institutional data sources.

[IMAGE: s00-02-hot-take-replace.png]

The hot take spreading through finance social media is that junior analysts are next. I manage analysts. I build software at a financial firm. I spent the week going through the code — and then I ran it on real work.

[IMAGE: s00-03-insider-perspective.png]

Here's my actual take — and it's more nuanced, and more interesting, than the replacement narrative.

---

## [SLIDE: What's in the Box — 01-framework-repo-architecture.jpg]

Five plugins. A core foundation called Financial Analysis that installs first, then four specialist modules you add based on what your team does.

[IMAGE: s01-02-four-modules-breakdown.png]

Investment Banking — for drafting CIMs, building buyer lists, running merger models. Equity Research — for earnings reports, investment theses, sector coverage. Private Equity — deal sourcing, due diligence, IC memos, portfolio monitoring. Wealth Management — client meeting prep, portfolio rebalancing, financial plans.

[IMAGE: s01-03-commands-in-action.png]

You type a command, name a company, and Claude produces a full Excel workbook with live formulas, or a PowerPoint in your firm's branded template. Forty-one built-in skills. Thirty-eight commands. No code required.

[IMAGE: s01-04-skill-files-quality.png]

What most coverage glosses over: the skill files. These aren't generic AI prompts dressed in financial vocabulary. They encode the kind of reasoning a senior analyst actually applies. Read through a few and you'll see what thoughtful design looks like.

---

## [SLIDE: The Real Signal — 02-infographic-mcp-convergence.jpg]

But here's the thing most coverage misses entirely. The commands and the outputs are not the most interesting part of this launch. Not even close.

[IMAGE: s02-02-eleven-vendor-logos.png]

FactSet. S&P Global. Morningstar. Moody's. LSEG. PitchBook. Eleven institutional data vendors — the ones that charge thousands per seat with multi-year enterprise contracts — all built native connectors for Claude. In the same launch window. All at once.

[IMAGE: s02-03-standard-declared.png]

When incumbents this entrenched all move in the same direction at the same time, that's not a product launch. That's a standard being declared.

[IMAGE: s02-04-bloomberg-api-parallel.png]

Think about what happened when Bloomberg and FactSet opened their APIs in the twenty-tens. A whole generation of fintech got built on top of those APIs. This is the twenty-twenty-six version of that moment. The data pipes are being laid.

[IMAGE: s02-05-market-reaction.png]

The market confirmed the read. Thomson Reuters jumped eleven percent. FactSet rose six percent after the announcement. They rallied because Wall Street realized Anthropic is partnering with these data vendors, not competing with them. Data vendors are the pipes. Claude is the plumber.

---

## [SLIDE: I Actually Ran It — 02-dcf-output-excel.png]

Reading about it is one thing. I wanted to know what it actually produces on real work. So I ran two tests — a DCF model and a client report.

[IMAGE: s03-02-dcf-structure-detail.png]

The DCF came back as a proper Excel workbook. Not a screenshot or a static table. A live model with formula references, linked cells, and a sensitivity table built in. Revenue build, margin assumptions, terminal value, WACC calculation, implied valuation range. Investment banking structure. It wasn't perfect — there were assumptions I'd adjust — but the scaffolding was right.

[IMAGE: 03-client-report-output.png]

The client report was similarly structured. Executive summary, key metrics, portfolio commentary. Professional language, formatted for a client-facing context. Not something I'd send as-is without review — but a very solid first draft that cuts the blank page problem entirely.

[IMAGE: s03-04-blank-vs-structured.png]

Here's the key insight. The value isn't that the output is perfect. It's that the starting point is right. A blank Excel and a blank document are very different from a correctly-structured workbook and a formatted draft. The first is a task. The second is an editing job. That gap — from blank page to structured starting point — is where most of the time actually goes.

---

## [SLIDE: Skills Are the Product — 07-skills-oriented-programming.jpg]

After using this, I came away thinking about something even bigger than these specific plugins.

[IMAGE: s04-02-software-is-knowledge.png]

The architecture here — domain knowledge encoded in simple structured files, organized into skills and commands, wired to data sources — this is a pattern that's going to generalize far beyond financial services. The software isn't the code anymore. The software is the knowledge.

[IMAGE: 03-comparison-agentic-vs-skill.jpg]

This became real for me through a project at my firm. We were trying to automate personalized investment recommendations. The original plan — build a full system from scratch. Design the data pipeline, write the orchestration logic, build the output template, wire it to our systems. Weeks of engineering. A dedicated person to maintain it.

[IMAGE: 06-investment-recommendation-output.png]

After reading through these plugins, I built a working version in a few hours. One file encoding our recommendation logic — our framework, our standards, our required format. One command to run it. The output: a structured recommendation, ready for advisor review.

[IMAGE: s04-05-weeks-to-hours.png]

What I estimated as weeks became hours. And any senior person on the team can read the skill file and refine it — no code required. That gap — between "we need to build an agentic system" and "we need to write a skill file" — is the paradigm shift.

---

## [SLIDE: What Gets Adopted — 04-comparison-adoption-framework.jpg]

So what actually gets adopted in a real financial firm? Not a hedge fund with dedicated tech teams — a mid-market firm like the one I work at.

[IMAGE: s05-02-fast-adoption.png]

Things that move fast: deliverables in known formats where the data subscription is already in place. Earnings summaries, comp tables, first-draft research notes, client reports. The lift is small — install the plugin, point it at the data provider you already pay for, done. Months, not years.

[IMAGE: s05-03-compliance-gate.png]

Things that move slower: full models going directly into client-facing materials. Before an AI-generated DCF goes in a pitch deck, compliance and risk teams need to sign off. That's not a Claude problem — that's a controls problem firms already have with Excel templates.

[IMAGE: s05-04-data-is-the-blocker.png]

And the real blocker is not the AI. It's the data. If your firm doesn't already subscribe to these data providers, you're not unlocking the full power. But the open-source nature changes things for mid-market — you can customize the system to work with whatever provider you do have.

---

## [SLIDE: The Blueprint — 08-blueprint-ai-native-firm.jpg]

Anthropic didn't just release plugins this week. They released a blueprint for what the AI-native financial firm looks like. Modular. Data-connected. Workflow-specific. Customizable by anyone who understands the domain.

[IMAGE: s06-02-three-action-items.png]

If you're a product leader in finance, three moves. One — audit your data contracts now. Which of these eleven providers does your firm already pay for? Those are free wins. Two — read the skill files. Even if you're not deploying tomorrow, they represent a well-designed view of how financial workflows should be structured. That's a roadmap. Three — start the compliance conversation early. The technical lift is small. The organizational lift is where the timeline lives.

[IMAGE: s06-03-compounding-knowledge.png]

The firms encoding their institutional knowledge into skill files right now are building something that compounds. Not just a productivity tool. An organizational knowledge system that gets more useful over time. The firms that wait for a vendor to package this will pay three times as much for something already a generation behind.

[IMAGE: s06-04-closing.png]

We've seen this pattern before in financial technology. It's playing out again — faster. If this resonated, subscribe — I share honest takes on building with AI in financial services every week.

---

## Production Notes

- **Total images:** ~27 (10 reused from blog + 17 new video illustrations)
- **Blog images reused:** 00-cover.jpg, 01-framework-repo-architecture.jpg, 02-infographic-mcp-convergence.jpg, 02-dcf-output-excel.png, 03-client-report-output.png, 03-comparison-agentic-vs-skill.jpg, 04-comparison-adoption-framework.jpg, 06-investment-recommendation-output.png, 07-skills-oriented-programming.jpg, 08-blueprint-ai-native-firm.jpg
- **New illustrations to generate (17):**
  - s00-02-hot-take-replace.png — social media hot take "junior analysts are done" with fire/alarm tone
  - s00-03-insider-perspective.png — calm insider at desk, contrasting the noise, "my actual take" feel
  - s01-02-four-modules-breakdown.png — four specialist modules as distinct blocks with icons (IB, ER, PE, WM)
  - s01-03-commands-in-action.png — slash commands flowing into Excel/PPT outputs, clean command-line aesthetic
  - s01-04-skill-files-quality.png — skill files shown as structured knowledge documents, not generic prompts
  - s02-02-eleven-vendor-logos.png — eleven data vendor names arranged as pillars or nodes, institutional weight
  - s02-03-standard-declared.png — convergence visual — all arrows pointing to one protocol, "standard" declared
  - s02-04-bloomberg-api-parallel.png — timeline: 2010s REST APIs spawned fintech → 2026 MCP spawns AI-native finance
  - s02-05-market-reaction.png — stock chart showing Thomson Reuters +11%, FactSet +6%, green arrows up
  - s03-02-dcf-structure-detail.png — zoomed view of DCF model structure: revenue build, WACC, sensitivity table
  - s03-04-blank-vs-structured.png — split: blank page (cold, empty) vs structured draft (warm, progress)
  - s04-02-software-is-knowledge.png — code dissolving into readable knowledge documents, paradigm shift visual
  - s04-05-weeks-to-hours.png — dramatic time compression: "Weeks of engineering → Hours of writing"
  - s05-02-fast-adoption.png — green lane: earnings, comps, reports flowing quickly through a pipeline
  - s05-03-compliance-gate.png — amber/yellow gate: models queued behind compliance review checkpoint
  - s05-04-data-is-the-blocker.png — locked data vault with key labeled "data contracts"
  - s06-02-three-action-items.png — three numbered action items: audit contracts, read skills, start compliance
  - s06-03-compounding-knowledge.png — knowledge system growing over time, compounding curve upward
  - s06-04-closing.png — forward-looking closing visual, dawn/sunrise over financial district
- **Transitions:** 1.2s crossfade between slides, 0.5s crossfade for image switches within slides
- **Music:** Professional, measured pace — documentary-style ambient with subtle electronic undertones. Building through the data vendor section, warm and personal through the "I ran it" section, confident and optimistic in the closing.
- **Pacing:** ~1 minute per slide, image switch every ~15-20s
- **Tone:** Authoritative but accessible — insider perspective, not tech blogger
- **CTA:** Subscribe + newsletter
