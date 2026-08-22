# Editorial Brief

## Reader Pain

When an agent fails a task, builders can't tell whether to blame the model or the layer around it — so they upgrade models, switch subscriptions, and re-run the same failures. Meanwhile they don't know which of their tooling investments (prompts, skills, configs, workflows) will survive the next platform shift.

## Reader Job To Be Done

Decide where to invest workflow and learning effort in the AI stack — and how to read the DeepSeek/Anthropic harness moves as an operator rather than a spectator.

## One-Sentence Promise

After this post you can name the layer that actually determines whether your agent finishes work, and know which of your own assets are portable across the harness war.

## Sharp Thesis

The harness — not the model — is now the layer that decides whether AI work gets done, and DeepSeek just proved it twice in one week: an independent benchmark showed the same model varying 20 points in success rate and 7x in cost-per-success across harnesses, and then a model company gave its harness away for free to commoditize exactly that layer. For builders, the strategic conclusion is inverted: the more the vendors fight over the harness, the more the durable personal assets become skills, instruction files, and evidence loops — the things every harness now reads.

## Concrete Opening

Composio's 2026-08-11 experiment: same DeepSeek V4-Flash model, 8 harnesses, 30 real SaaS workflows, 240 runs, programmatic verification. Success rate 46.7%→66.7% depending only on harness; cost per successful task $0.028→$0.195 (7x). Seven tasks passed or failed purely on harness choice. "The model didn't change a word." Two days later, DeepSeek open-sourced its harness under MIT — on the same day it GA'd V4-Pro.

## Original Contribution

Beyond the news coverage (launch summaries) and HuaShu's Chinese user-perspective book: (1) the operator reading of the strategy mirror — Anthropic's closed harness as model moat vs DeepSeek's MIT harness as token-sales funnel that systematically absorbs rivals' de facto standards (SKILL.md, AGENTS.md, hooks bridges, MCP naming, Claude Code/Codex as subagent providers — each verified in the repo); (2) the individual-builder decision lens (rent/churn/own) that no coverage has drawn; (3) first-hand repo verification from Aaron's own full-project teardown (commit 47f9438).

## Why Aaron Can Write This

Aaron runs a multi-harness stack daily (Claude Code, Codex, custom pipelines), published the deployment-capability thesis in July before this evidence landed, and did a 14-agent teardown of the DSH repo with file-level verification on 2026-08-15.

## Authority And Scope Boundary

Direct knowledge: repo-verified facts from the local clone; own multi-harness usage. Inferred: DeepSeek's strategic intent (labeled as reading, supported by observable repo choices); training-feedback motivations (flagged as speculation). Will not claim: hands-on DSH production experience (not yet run in anger); Composio numbers as universal truths (their caveats — Pi used different reasoning settings and two providers — stay attached); any judgment of DSH's day-to-day UX (defer to HuaShu's testing and JY's insider quote).

## Evidence Needed

- Composio primary source with methodology and caveats (fetched 2026-08-15; publication 2026-08-11).
- Repo-verified compatibility facts: SKILL.md adoption + deleted proprietary skill format, AGENTS.md/CLAUDE.md dual-read, hooks bridges with 23/30 unsupported events, subagent-claude-code/codex providers, MIT license. (Verified in clone at 47f9438.)
- The strategy mirror facts: Claude Code closed-source core vs DSH MIT; DSH launch same day as V4-Pro GA (2026-08-13).
- One number pair for scale: 12,293 commits / 64 days; 219 packages (repo-verified).
- HN "this time it looks pretty much original" exchange (news.ycombinator.com/item?id=49285244) as reception color.

## Counterargument

Steelman: harness benchmarks are unstable (Composio's own caveats; single benchmark, 30 tasks, one model family) and DSH itself is admittedly rough — insider JY says the experience trails Claude Code/Codex, the README warns of breaking changes, and a plugin ecosystem is a bet, not a fact. The piece must concede: for a builder who just wants work done today, Claude Code remains the better tool; the argument is about where the layers are moving, not which tool to adopt this week. Also concede the harness layer may consolidate quickly, making "harness churn" temporary.

## Reusable Frame

The three-layer asset test for AI-stack investment: **Rent the model** (swappable by design, don't marry it), **expect the harness to churn** (invest usage skill, not deep customization, until the war settles), **own your skills and evidence** (skills, instruction files, eval/feedback loops — the layer every harness now reads, and the only layer that compounds for you). Candidate name: "rent / churn / own."

## Distribution Hook

The Composio number pair is the scroll-stopper: "Same model. Eight harnesses. 7x difference in cost per completed task." Visual: a simple two-axis chart of success rate vs cost-per-success by harness (redrawn from Composio data with attribution), or the strategy-mirror diagram (Anthropic closed vs DeepSeek open, arrows showing asset flow).

## Success Hypothesis

Deep-reader signal (existing winning pattern): above-median read time and at least a few substantive replies from builders recognizing the attribution problem; the "rent / churn / own" frame gets quoted back. Secondary: the post earns citations as the operator-view reference on the DSH launch in English.

## Kill Criteria

Kill or rewrite if the draft becomes: a DSH feature walkthrough or install guide; a launch-news roundup; DeepSeek-vs-Anthropic fan commentary without a decision lens; or a piece whose every claim traces to secondary sources with nothing Aaron verified himself.
