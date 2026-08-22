# Idea

## Topic

Before you type a single word to an agent, the bill has already started: HuaShu's teardown of DeepSeek Harness measured a 13,809-token "entry fee" per session — tool documentation 47%, the user's own skill catalog 45%, system prompt 6%, and the actual question 29 tokens (0.2%). Reproduce the same measurement on Aaron's own stack and turn fixed-cost anatomy into an operator frame. Working title direction: "The 13,809-Token Entry Fee."

## Why Now

- Agent usage is shifting from chat to long-running sessions and subagent fan-outs, where the fixed cost is paid once per session per agent — most builders have never itemized it.
- DeepSeek's pricing makes cache hits 50-120x cheaper than misses, and the harness engineers prompt-prefix stability as a first-class constraint (every package README must declare its KV-cache effect; an e2e test asserts every non-first request has a cache hit). Cache discipline is now literally gross margin.
- The numbers are fresh, concrete, and nobody in the English-speaking world has written the operator version.

## Target Reader

Builders running agents daily (Claude Code, Codex, custom pipelines) who see token bills but have never decomposed the fixed vs marginal structure; team leads budgeting agent usage.

## Reader Pain / Curiosity

- "Why is my agent bill this high when my questions are short?"
- "Do my installed skills/MCP servers cost me anything when I don't use them?" (Yes — per session, per subagent.)
- "Is 'let the model write programs to orchestrate tools' (code mode / PTC) actually cheaper?" (Counterintuitive: on small tasks it's slower and more expensive; it trades fixed overhead up for marginal cost down.)

## Initial Thesis

An agent session has a cost structure like a factory, not a phone call: a fixed entry fee (tool schemas + skill catalog + system prompt) paid per session and re-paid by every subagent, and a marginal cost dominated by cache economics. Operators who don't know their entry fee routinely pay 82% overhead for capabilities they never invoke (HuaShu: a 57-skill catalog raised boot cost from ~7,600 to ~13,838 tokens). The operating rule: audit your entry fee, treat skill-catalog size as a per-session tax, and protect prompt-prefix stability like margin.

## Personal Anchor (prep required before drafting)

Reproduce the differential-weighing measurement on Aaron's own pipeline (Claude Code session and/or aaron-studio agent runs): itemize the first-request bill (tools, skills, system prompt, user input). Aaron's own tiles/skills catalog makes a neat mirror of HuaShu's 57-skill measurement. This measurement is the article's spine — without it the piece is second-hand.

## Continuity

- Extends blog-memory canonical idea: "token spend, model access, and usage charts are not proof that work changed."
- Links to `2026-08-19` (harness piece, series anchor) and `2026-06-20` (AI became my operating system).

## Growth Lesson Applied

Open with the concrete bill moment (a short question, a five-figure token charge, the itemized receipt) — not with cache theory.

## Source Notes (for claim ledger later)

- HuaShu's numbers are secondary, pinned to dsh rc.6 and pre-2026-08-17 pricing (DeepSeek switched to time-of-day pricing after his snapshot) — cite as his dated measurements, then lead with Aaron's own reproduced numbers as primary evidence.
- PTC comparison caveat is mandatory: his "14x slower, 12x output" result is a single run on a 3-small-files task — the regime where PTC must lose. State the applicability boundary (many steps, large intermediates, conclusion-only tasks).
- First-party: Aaron's own measurements; repo evidence on KV-cache gates (verify-package-readme-model-experience.ts, request-cache e2e) verified in local clone.

## Tentative Publish

Wednesday 2026-09-02 (third in series; requires the measurement experiment; numbers age with pricing changes so re-check before publish).

## Kill Criteria

Do not publish if the piece reads like:

- a rehash of HuaShu's chapter with no original measurement;
- a DeepSeek pricing explainer (the point is the cost structure of agents generally, DSH is the best-documented example);
- cache micro-optimization advice with no decision lens for operators;
- numbers quoted without their snapshot dates and version pins.
