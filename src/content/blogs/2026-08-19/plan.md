# Blog Plan: The Harness Is the Product Now

## Meta
- **Author:** Aaron Guo
- **Target:** aaronguo.com blog (EN + ZH bilingual)
- **Tone:** Entrepreneurial, crisp, insight-led, commercially useful; no soft self-help, literary emotion, or teacherly advice.
- **Length:** 1,800-2,400 words
- **Audience:** Technical operators, product leaders, and AI-native builders deciding where to invest in the AI stack
- **CTA:** follow (rotation position after 2026-08-02's "reply")

## Hook

An agent fails a task and you do the thing everyone does: blame the model, maybe upgrade the subscription. Then the receipt that breaks the habit — Composio ran the same DeepSeek V4-Flash through eight harnesses on thirty real SaaS workflows, 240 runs, verified by checking actual app state. Success rate: 46.7% to 66.7%. Cost per completed task: $0.028 to $0.195 — seven times. Seven of thirty tasks passed or failed on harness choice alone. The model didn't change a word. Two days later, DeepSeek open-sourced its own harness under MIT — the same day it GA'd V4-Pro.

## Thesis

The harness — not the model — is now the layer that decides whether AI work gets done, and DeepSeek giving its harness away confirms model companies won't leave that layer to others; for builders, the durable move is to rent the model, expect the harness to churn, and own the one layer every harness now reads: your skills, instruction files, and evidence loops.

## Personal Anchor

Aaron published the deployment-capability thesis on 2026-07-06 ("Expensive Tokens Won't Save Enterprise AI") five weeks before this evidence landed; runs a multi-harness stack daily (Claude Code, Codex, custom pipelines); and cloned the DSH repo the week it dropped, verifying every strategy claim file by file with a 14-agent teardown pinned at commit 47f9438. The compatibility facts in this piece were checked, not read.

## Outline

### Part 1: Seven tasks flipped. Nobody touched the model.
- Point: the attribution problem is real and measurable — the layer around the model moves outcomes as much as the model.
- Evidence: Composio experiment with numbers (C1, C3, C4) and its caveats carried honestly (C2: Pi's different reasoning settings, excluded Prime runs) — use the spread, refuse the ranking.
- Personal beat: the moment of blaming the model for a failed run and having no way to know which layer failed.
- Job: earn the title within 150 words; thesis lands at the end of this section (first 15%).

### Part 2: The layer where tokens become work
- Point: define the harness concretely — context assembly, tool exposure, permissions, recovery, loop control, evidence capture. Models emit tokens; harnesses complete tasks.
- Evidence: the mechanism explains the spread — different harnesses show the same model different worlds (link back: "Fable 5 changed the unit of AI work" — the unit lives in this layer).
- Personal beat: one concrete example from Aaron's own stack of the same task behaving differently across two harnesses.
- Job: give readers the one-paragraph mental model they quote later.

### Part 3: A model company just gave the harness away
- Point: 2026-08-13, DeepSeek open-sources dsh, MIT, same day as V4-Pro GA — with scale receipts (219 packages, 12,293 commits in 64 days).
- Evidence: C5, C6; HN reception color ("this time it looks pretty much original", C11).
- Personal beat: "I cloned it that week and tore it down file by file" — one sentence on the 14-agent method (itself a ship-with-AI proof point).
- Job: pivot from benchmark to strategy; no feature-walkthrough drift.

### Part 4: Three moves you can verify in the repo
- Point: DSH's ecosystem strategy is observable, not speculative — (1) format surrender: adopted Claude Code's SKILL.md verbatim and deleted its own format, reads AGENTS.md/CLAUDE.md zero-config; (2) honest subsets: hook bridge documents 23 of 30 Claude Code events as unsupported instead of faking full compatibility; (3) rival absorption: Claude Code and Codex mounted as subagent providers.
- Evidence: C7, C8, C9 — each with repo paths.
- Then the mirror, labeled as my read (C12, C13): Anthropic's closed harness is a model moat; DeepSeek's open harness is a token-sales funnel that makes rivals' user assets portable. Dependency inversion as competitive weapon.
- Job: this is the section no other coverage has; keep interpretation clearly flagged.

### Part 5: The honest case against all this
- Point: steelman before concluding.
- Evidence: DSH is rough today (JY quote, C10; ALL-CAPS breaking-changes warning); the benchmark is one model family and 30 tasks (C2); the harness layer may consolidate fast, like the JS framework wars.
- Response woven in: today's tool choice is unchanged (Claude Code still wins for daily work); roughness and churn are evidence for the thesis, not against it; consolidation with an unknown winner is exactly why deep harness customization is someone else's sunk cost.
- Job: make a smart skeptic feel represented, then move them.

### Part 6: Rent the model. Expect the harness to churn. Own your skills.
- Point: the three-layer asset test, landed as the piece's takeaway.
- Evidence: C7 makes "own your skills" literal — skills and instruction files are now the cross-harness format layer; every harness reads them.
- Personal beat: what I keep portable (skills, AGENTS.md-style instructions, eval/feedback loops) vs what I let each harness own (its own config); the one-day action: inventory your AI assets into portable vs locked-in — that list is your position in this war.
- Job: close on the frame and the reader's next move, not on a verdict about DeepSeek. Plant one forward hook: next in series, reproducing the token entry-fee measurement on my own stack.

## Visual Ideas
- Cover: two-axis scatter — success rate (y) vs cost per successful task (x) for the 8 harnesses, same-model callout ("the model didn't change"); redrawn from Composio data with attribution.
- Inline 1 (Part 4): strategy mirror diagram — closed harness as moat (Anthropic) vs open harness as funnel (DeepSeek), with user assets (SKILL.md / AGENTS.md / hooks) flowing across the boundary.
- Inline 2 (Part 6): three-layer stack card — Rent (model) / Churn (harness) / Own (skills, instructions, evidence).

## Distribution Plan
- Blog: publish Wed 2026-08-19 morning; newsletter CTA at end.
- X: long-form post same day (hook = the Composio number pair; no link in main post; blog link in reply); standalone tweet Fri 2026-08-21 (the SKILL.md format-surrender insight + diagram).
- Newsletter / LinkedIn: same-day teaser, 3-4 plain-text paragraphs, bare blog URL at end.
- YouTube: candidate for video adaptation after the article package locks; video-native angle = "we benchmarked the wrong layer" (decide at video-brief stage).

## Open Questions
- Pre-publish re-verification only (does not block drafting): official DeepSeek announcement wording for the V4-Pro same-day claim (C5); repo paths at publish-time HEAD (C7/C8); check whether Anthropic/OpenAI responded publicly after 2026-08-15 — if yes, Part 5 gains a paragraph.
