# Video Brief: What I Learned From DeepSeek's Harness

This video is not "the blog in narration form." It is about the invisible layer that quietly decides whether your coding agent finishes its work — told through a guided break-in of the first fully open harness (follow the money first, then the 44/3 gate, then the one-line machine, then the fleet that built it) — so the viewer leaves knowing the three things to copy this week and the one layer to own.

## Target Audience

Developers and technical operators who run coding agents daily (Claude Code / Codex class), already believe "the model is what matters," and have never had a reason to look at the layer between them and the model.

## Desired Emotion

The satisfaction of a mystery resolving into leverage: "the thing I blamed on the model was never the model — and now I know what to do about it."

## Core Promise

By the end you can explain why the same model swings 47% → 67% by harness alone, you know the four verified designs inside DeepSeek's open harness — with their costs — and you leave with three copyable practices and a one-hour exercise that tells you where your tooling investment should go.

## Title/Thumbnail Expectation

- Recommended title: `What I Learned From DeepSeek's Harness` (matches the article; accurate, no bait).
- Thumbnail: existing `imgs/00-cover-thumbnail.png` — "What I Learned / From DeepSeek's / Harness" over the 44/3 paper world.
- Opening obligation: land the same-model 47-vs-67 contradiction inside the first ten seconds; say the word "harness" and connect it to the thumbnail's gate imagery before 0:30.

## High-Shock Facts

- Same model, thirty real workflows, eight harnesses: success 46.7% → 66.7%, cost per completed task ~7x. Nothing about the AI changed. (premise number; C1/C3)
- The winner's reaction: Armin Ronacher — co-founder of the company behind the top-scoring harness — read the rival repo and said it made him want to revisit his own choices. (authority anchor; C22)
- The harness logs 44 kinds of events. The model is allowed to see exactly 3. (C15)
- At launch-week list prices a DeepSeek cache hit cost roughly 1/50th to 1/120th of a miss — caching is the vendor's gross margin, and your harness decides whether you hit it. (C17/C18)
- One timestamp at the top of a system prompt = every request pays full price. (finding 3)
- The loop that runs the agent is one config row; "code mode" differs from standard by one appended row. (C16)
- 12,293 commits in 64 days; the top author made 5,235 of them; `codex/` appears 209 times in the merge history. Most of this code was not typed by humans. (C6/C24)
- The repo has more markdown files than TypeScript files. (C19)
- 178 green tests and 100% coverage shipped alongside a product that died the moment a real editor connected. (C20)
- 27 pre-release checks now stand guard — bought back one crash at a time. (C28)

## Hook Type

Apparent contradiction with money stakes: the same worker produces wildly different results depending on an invisible layer nobody looks at. Target: the viewer's own agent failures. Transformation: from blaming the model to seeing (and owning) the layer. Stakes: the viewer's time, task success, and API bill.

## Story Structure

Cold contradiction (47 vs 67, same model) → the winner blinks (Ronacher) and I go inside (a few days, pinned commit) → follow the money first (the lawyer re-reading the contract; cache = margin; the CI test that refuses to let it break) → the 44/3 gate (what the model may see; replay; the five-line assertion) → the one-line machine (loop as a config row; the two crashes and the 27-check bill) → the fleet that built it (12,293 commits; the rules operating system; "the writer never gets tired") → the honest catch (not your first choice this week; what DeepSeek is really selling — labeled as my read) → payoff (rent / churn / own; the two-column hour).

Selected because the article's order (log first, money third) is right for reading depth but wrong for watch-time: the money story is the fastest universal stake, and the 44/3 gate lands harder once the viewer knows a broken prefix costs real dollars.

## Retention Beat Map

- 0:00 — Cold open: same AI, 47% vs 67%, 7x cost. [IMAGE: split scoreboard]
- 0:25 — The winner read the rival's homework and wanted to revise his own. [IMAGE: quote card]
- 0:50 — Promise + method: a few days inside, every claim pinned to one commit. [IMAGE: 00-cover paper world]
- 1:15 — Reveal 1: your provider holds the safe, your harness holds the key. [IMAGE: 02-metaphor-contract-reread]
- 1:45 — The lawyer re-reads the whole contract for one changed word. [IMAGE: contract close-up]
- 2:15 — A timestamp in the prompt = full price forever; the CI test that goes red before money burns. [IMAGE: bad/good clock sketch]
- 2:45 — Reveal 2: 44 event types, the model sees 3. [IMAGE: 44/3 gate]
- 3:15 — Replay superpower: "what did the model actually see" becomes a lookup. [IMAGE: 01-diagram-log-derive-refuse]
- 3:45 — The five-line assertion you can copy this week. [IMAGE: assertion sketch]
- 4:10 — Reveal 3: the whole agent hangs from one config row; flip it and there is no agent. [IMAGE: config row card]
- 4:40 — The bill: two silent crashes, 178 green tests that meant nothing, 27 checks bought back. [IMAGE: crash/checks card]
- 5:10 — Reveal 4: who built this — 12,293 commits in 64 days, codex/ 209 times. [IMAGE: 03-metaphor-rules-table-fleet]
- 5:40 — The rules OS: a freezer for dead ideas; postmortems that must turn red; the writer never gets tired. [IMAGE: rejected freezer card]
- 6:10 — Objection: today it still trails Claude Code and Codex — and that's fine for what it's really for. [IMAGE: honest-limits card]
- 6:35 — My read, labeled: moat vs funnel — they're selling tokens, not the harness. [IMAGE: strategy mirror card]
- 7:00 — Payoff: rent / churn / own; the two-column hour. [IMAGE: 04-metaphor-two-shelves]
- 7:25 — End card, quiet; series pointer: next I measure the entry fee. [brand end card]

## What The Video Adds

- A reordered spine that starts with money (cache = margin) — the article buries its most universal stake in finding 3; the video leads with it.
- The "provider holds the safe, harness holds the key" division of labor acted out as the video's through-line, with the lawyer scene as its recurring visual anchor (the article uses it once, in prose).
- The 47-vs-67 cold open framed against the viewer's own experience ("yesterday your agent failed a task — whose fault?") — a viewer-facing setup the article never makes explicit.
- The four findings compressed into four *reveals* with explicit callbacks (the cache test "dares" to exist because of the log design — the interlock gets its own beat instead of a subordinate clause).
- A clean separation of verified fact vs "my read" delivered verbally — modeling the article's epistemics for a viewer who won't read the ledger.

## Banned Phrases

- let's dive in
- in today's video
- right
- you know
- basically
- what's interesting is
- here's the kicker
- game changer
- crazy
- this changes everything
- the real shift is

## Ending

End on the two-column hour: "the list will tell you better than any benchmark where your time goes next." Hold one beat, then the quiet Aaron Guo brand end card with the series pointer (next: the first-request entry fee, measured on my own stack). No generic subscribe call.

## Spoken Delivery Contract

- Measured, direct, engineering-minded; first person for everything Aaron verified himself ("I counted the branch names").
- Target 7–8 minutes, approximately 1,050–1,200 spoken words.
- Numbers attributed in narration (Composio's test, the repo at one pinned commit); date-qualify the pricing claim ("at launch-week prices").
- Phrase-level captions only; no music unless the listening pass shows a need.

## Visual Contract

- Base: the Paper Machine Teardown world (warm-white paper, graphite, cyan/green/amber signals) — reuse the six blog finals as anchor scenes; video-only cards (`sNN-MM-*.png`) stay in the same paper language.
- Every scene gets one visual role (evidence / explanation / emphasis); numbers appear as large paper-cut numerals, never dashboards.
- Richness gate target: 20–30 unique images with [IMAGE:] switches every 15–20 seconds — the six blog finals plus ~15–20 video-only cards, generated during visual enrichment (not before audit).
- No robots, dashboards, code screenshots, or glowing AI; the only "screen" allowed is the schematic assertion sketch as a paper card.

## Audit Status

- Brief drafted 2026-08-15 against v13 of the article (post-P1-P6); all facts trace to claim-ledger C-rows noted inline.
- Story flow, comprehension, and speed-to-value: pending `aaron-video-gen --audit-only` after youtube-script.md is drafted.
- Narration, visual enrichment, TTS, listening review, render, and QA: not started.
