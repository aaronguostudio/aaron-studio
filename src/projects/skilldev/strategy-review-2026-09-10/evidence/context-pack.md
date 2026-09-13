# Context pack: "Skill IDE" venture thesis (for research agents)

Date: 2026-09-09. Everything below is internal context. PRIVACY RULE: never put personal names, employer names, or the venture's internal codename into any web search query or external tool. Refer to the founders as "Founder A" and "Founder B" and the product as "the skill dev tool" in any outbound query.

## 1. The thesis under test (founders' own words, paraphrased)

"Much of future software will be skill-based. We (two co-founders) want to build a Skill IDE: a tool where users can develop skills, eval them, let them self-iterate, and make them observable. We want to ship tools and possibly a cloud service. We have the passion to build a real company; we need to find the right direction. Judge critically whether this thesis is right, or whether there is a better opportunity."

"Skill" here means the Agent Skills format popularized by Anthropic (SKILL.md folder with YAML frontmatter, progressive disclosure, bundled scripts/references), now an open spec (agentskills.io) adopted by other agent harnesses.

## 2. What already exists (their assets)

### 2a. SkillDev POC (built Aug 23 – Sep 7, 2026; ~5.9k LOC TypeScript; private, unlicensed, unpublished)
- Positioning: "local-first development, testing, and observability toolkit for Agent Skills."
- Vertical slice: inspect (normalize a skill bundle into a manifest + workflow.html graph), run (synthetic controlled runs or JSON fixtures through pluggable model adapters; Ollama adapter only so far), evaluate (deterministic rubrics not shown to the model), compare (baseline vs candidate deltas), report (Git-pinned multi-fixture suite with continue/pivot/stop verdict), explore (static React Flow viewer), plus an "editorial review" workspace for before/after artifact comparison with human judgment.
- Evidence model: skill.manifest.json, run.json, events.jsonl (append-only stage/tool/approval/artifact events), artifacts.json, evaluation.json, comparison.json, suite-report.
- Deliberate exclusions so far: auth, cloud storage, collaboration, billing, hosted registry, production deployment, a general-purpose IDE. No hidden chain-of-thought is collected.
- Continue gates the founders wrote for themselves: complex skill inspectable without modification; 5 fixtures against pinned baseline/candidate; seeded regression detected; failed case becomes fixture in <10 min; second skill onboarded without core change; at least one external skill author understands it without founder-specific context.
- Pivot/stop gates: if runtime traces unavailable, narrow to vendor-neutral manifest + structural linter + fixture protocol; if rubrics too brittle, pivot; stop if report doesn't reduce real review time.
- Lighthouse skill: a mature 10-skill blog-production orchestrator (content, images, video, distribution). Inspect result: 107 nodes, 121 edges, 40 declared artifacts.
- Second dogfood: an "agent-context" CLI/MCP project used SkillDev fixtures for behavioral checks.

### 2b. Founder A's skill library
- 32 custom skills in a personal monorepo, synced to Claude Code, Codex, Cursor, Gemini via a sync script; managed with Tessl "tiles" (tessl.json dependencies, including third-party skill packs pinned by commit).
- Skills range 39–777 lines; only name+description frontmatter used; Claude Code-only fields unused.
- Known pain from their own audit of the blog-production chain: 23 named gates, only ~5 actually checked by scripts; 0/19 packages with postmortems containing real numbers; a golden video was a 1,582-line one-off; feedback loop open at both ends. Their own lesson: "failures should become scripts, not paragraphs."

### 2c. Related prior work
- "Open Foundry": an ontology-driven "software foundry" repo (ontologies → capabilities → blueprints → evaluations → templates → Skills as compiled release artifacts). Skills are treated as the release artifact of validated knowledge.
- A 14-note teardown of an open-source agent harness (a Chinese AI lab's "harness") observed that the harness "surrendered completely to the SKILL.md de facto standard" on format, implementing only fields it can enforce, and treating skills as an ordinary plugin row. Signal: the skill *format* is commoditizing; the *semantics/enforcement* layer is where harnesses differ.

## 3. Founders' profile and constraints (do not search these)
- Founder A: ~15+ years software; senior manager & partner at a mid-size Canadian asset manager (leads dev + QA, head of products); simultaneously CEO of an early-stage "AI-native firm management" SaaS startup with a small offshore dev team and one anchor customer relationship. Strong operator identity: "I don't care what tools, I want to solve business problems." Deep domain: regulated wealth/asset management operations (portfolio look-through reports, investment proposals, compliance dashboards). Has demand-side pull inside the day job: business users asking for more Claude-skill-based workflow tools. Also runs a content pipeline (blog + YouTube) as personal brand. Time budget for side ventures: roughly 3–4 h/week content, 5–7 h/week CEO time for the startup; day job is full-time. Located in Calgary, Canada.
- Founder B: very strong engineer; Founder A's direct report at the day job AND CTO/co-founder of the startup. Built the SkillDev POC quickly. Known for pushing back on AI sycophancy. Founder A is close to committing to a 50/50 co-founding arrangement with Founder B "starting from some products, then exploring business models."
- Constraint: clean boundary between day-job work and outside ventures; the day job is a regulated financial firm.
- Existing startup (firm management SaaS) already competes for the same CEO time slot.

## 4. What the platform vendor's own docs say today (verified 2026-09-09 from official docs)
- Agent Skills: three-level progressive disclosure (metadata always loaded ~100 tokens; SKILL.md on trigger <5k tokens; resources/scripts on demand). description is the routing mechanism.
- Official best-practices page explicitly recommends: eval-first development (3 scenarios, baseline without skill), "Claude A writes skill, Claude B uses it" iteration loop, test across Haiku/Sonnet/Opus, scripts over prose, plan-validate-execute, checklists.
- Official docs state: "There is not currently a built-in way to run these evaluations [on the API]. Users can create their own evaluation system."
- BUT Claude Code ships a `skill-creator` plugin (official marketplace) that generates evals.json, grading.json, benchmark.json (token/time cost with vs without skill) and an HTML report; there is also a `/skill-doctor` report and a `claude plugin eval` command (early access) for plugin eval suites with JSON reports, sandbox, CI.
- Enterprise doc lists what's missing at platform level: usage analytics not available through the Skills API; custom skills do not sync across claude.ai / API / Claude Code; no centralized admin management on claude.ai; skill content scanning only for Enterprise on claude.ai/Cowork, not API, not Claude Code; recommends maintaining an internal registry (purpose/owner/version/dependencies/eval status), version pinning, checksums, signed commits, coexistence testing, "start specific, consolidate later," role-based bundles, recall limits (~20 skills per API request; too many skills degrade selection).
- Sharing models: claude.ai per-user zip upload; API workspace-wide; Claude Code personal/project/plugin; plugins are the closest thing to a distribution channel.
- Anthropic engineering blog: near-term focus is "the full lifecycle of creating, editing, discovering, sharing, and using Skills"; long-term "enabling agents to create, edit, and evaluate Skills on their own."
- Claude Code skill frontmatter now includes: disable-model-invocation, user-invocable, allowed-tools, model, effort, context: fork, agent, background, paths, arguments, hooks, dynamic shell injection; skillOverrides in settings; synced skills from claude.ai account; live editing; monorepo nested skills; skill content lifecycle (5k tokens per skill retained after compaction, 25k shared).

## 5. Questions the research must answer
Q1. Is "skills" a durable abstraction or a transient vendor feature? What is adoption momentum across vendors (Anthropic, OpenAI/Codex, Google, Microsoft/GitHub, Cursor, Amazon, open-source harnesses)? Is the open spec real?
Q2. Who is already building skill dev/eval/observability tooling (vendors, open source, startups)? What do they have, what's missing?
Q3. What is the platform-absorption risk: how much of "skill IDE + eval + observability" will the vendors ship natively within 12–24 months? Evidence, not vibes.
Q4. What do practitioners actually complain about with skills (triggering, evals, versioning, sharing, security, context bloat, drift)? Which complaints are willingness-to-pay signals?
Q5. What do enterprises (especially regulated finance) need for skill governance, and who is selling to them?
Q6. What do historical platform-extension ecosystems (VS Code, Chrome, npm, Zapier, Salesforce AppExchange, Shopify, WordPress, ChatGPT plugins/GPT Store, MCP) teach about where third-party tooling companies win vs get absorbed?
Q7. Business models and rough market size for such tooling: comparable pricing, comparable exits, realistic revenue paths for a 2-person part-time team in year 1.
Q8. What alternative or adjacent opportunities exist that better fit the founders' assets (regulated-finance domain depth, operator credibility, an existing SaaS startup, a content harness, a working POC)?
