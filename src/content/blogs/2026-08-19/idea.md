# Idea

## Topic

DeepSeek open-sourced its agent harness (2026-08-13, MIT). A model company building and giving away the harness layer is the strongest new evidence for the thesis Aaron published in July: enterprise AI value is moving from model access to deployment capability. Working title direction: "DeepSeek Just Proved the Harness Is the Product."

## Why Now

- DeepSeek Harness went public on 2026-08-13 and hit ~20K GitHub stars within hours. English-language coverage is still news-level; no operator-grade analysis exists yet.
- Composio published an experiment (2026-08-11): the same model (DeepSeek V4-Flash) run through 8 different harnesses on 240 workflow tasks produced pass rates from 46.7% to 66.7% and a ~7x difference in cost per successful task. "The model didn't change a word."
- Anthropic (closed harness as model moat) and DeepSeek (MIT harness that systematically absorbs competitors' de facto standards — SKILL.md, AGENTS.md, hooks.json, MCP naming, even running Claude Code and Codex as subagent providers) are now running opposite strategies on the same layer. That mirror is the story.

## Target Reader

Technical operators, product leaders, and AI-native builders deciding where the durable layer of the AI stack is — and whether to invest their own learning and tooling in models, harnesses, or skills.

## Reader Pain / Curiosity

- "Models keep leapfrogging each other. What should I actually bet my workflow investment on?"
- "Why would a model company give away a 219-package harness for free?"
- Confusion between model quality and harness quality when an agent fails a task.

## Initial Thesis

The harness is where model capability turns into completed work, so model companies can no longer afford to leave it to others: harness quality now determines whether their model looks good. DeepSeek's move confirms the deployment-capability thesis at the vendor level — and its "embrace rival ecosystems" strategy makes user assets (skills, instruction files, hooks) the truly portable layer, which changes what individual builders should invest in.

## Personal Anchor

Aaron runs his own multi-harness stack (Claude Code, Codex, own agent pipelines) and has an existing published position (2026-07-06 deployment-companies essay) this piece extends with new evidence. Include a concrete "what I checked in the repo myself" element from the full-project teardown (session-log analysis artifact from 2026-08-15, verified against local clone at commit 47f9438).

## Continuity

- Direct sequel to `src/content/blogs/2026-07-06` (why AI companies are becoming deployment companies) — the vendor-level confirmation.
- Links to `2026-07-01` (one-person project: owner/boundary/evidence frame).
- Feeds blog-memory canonical idea: "deployment capability > model access."

## Growth Lesson Applied

Open with a concrete operating bottleneck, not the framework: lead with the Composio result (same model, 8 harnesses, 7x cost spread) or a concrete failed-task-attribution moment, then unfold the strategy analysis.

## Source Notes (for claim ledger later)

- First-party: local clone of deepseek-harness (HEAD 47f9438) + Aaron's teardown artifact (2026-08-15).
- Secondary, dated: HuaShu's orange book v260814 measurements (pinned to rc.6; hours-scale shelf life; label as his measurements).
- Third-party, unreplicated: Composio 8-harness experiment — cite as their published result, not neutral proof.

## Tentative Publish

Wednesday 2026-08-19 (first in the DSH series; time-sensitive — publish before the news window closes).

## Kill Criteria

Do not publish if the piece reads like:

- a DeepSeek Harness feature walkthrough or installation guide (HuaShu's book and official docs own that);
- a news roundup of the launch;
- fan or doom commentary on DeepSeek vs Anthropic without an operator decision lens;
- a piece whose claims all trace to secondary sources with nothing Aaron verified himself.
