# Idea

## Topic

When an agent does something baffling, most builders can't answer the only question that matters: what exactly did the model see? DeepSeek Harness is the first public implementation that makes this answerable byte-for-byte — an append-only session log is the single source of truth, the model's context is a pure projection of it, and a runtime assertion verifies the equivalence before every single LLM request. Working title direction: "Show Me Exactly What the Model Saw."

## Why Now

- Agents are moving into consequential work (money, code in production, long-running autonomy) while most harnesses still can't reconstruct what the model was shown at step N.
- DSH ships the strongest public counter-example: 44 event types, only 3 model-visible; compaction that masks but never deletes; fork/resume/replay as three reads of one log; and a live invariant that refuses to send any request that can't be rebuilt from the log.
- "Can you show me exactly what the model saw?" is about to become a procurement question for agent tooling — trust, debugging, and compliance all hang on it.

## Target Reader

Builders debugging agent misbehavior; engineering leaders evaluating agent platforms; anyone designing their own agent loop.

## Reader Pain / Curiosity

- "The agent did X and I have no idea why — I can't see what context it actually got."
- "My framework compacts history destructively; after a resume I can't audit anything."
- "What's the minimum version of this discipline I can adopt without adopting event sourcing wholesale?"

## Initial Thesis

Auditability of agent context is not a logging feature — it's an architectural invariant, and it's binary: either every model-visible input is reconstructable from a durable record, or your debugging is archaeology. The practical floor is five lines of code: before sending any LLM request, deep-compare the outgoing messages against what your own log says they should be, and crash on mismatch. That one assertion converts silent context drift into a loud development-time failure.

## Personal Anchor

Open with a real debugging incident from Aaron's own agent work — a session where the model's behavior made no sense and the "what did it actually see" question had no answer (candidates: agents-system runs, blog-pipeline automation, a Claude Code session with unexpected context). Then, as the takeaway, actually implement the pre-request assertion in one of Aaron's own pipelines and report what it caught (or that it ran clean — either is evidence).

## Continuity

- Extends the trust/evidence thread of blog-memory ("outcomes need evidence and operating loops") and the ACTOR Trust dimension.
- Links to `2026-08-19` (series anchor) and `2026-08-26` (process piece: same repo, different layer).

## Growth Lesson Applied

Open with the concrete debugging bottleneck (the unanswerable question), not with event-sourcing theory. Keep the engineering depth in service of an operator decision lens: what to demand from agent tools you adopt, what to implement in ones you build.

## Source Notes (for claim ledger later)

- First-party: repo evidence verified in local clone — invariant implementation (packages/core/agent-loop/src/invariant.ts), surface/replace compaction mechanics, "model-visible ⟺ logged" rule in AGENTS.md; Aaron's teardown artifact 2026-08-15.
- HuaShu's measured face of the same fact (44 events / 3 model-visible; a one-line task leaving 44 log rows) — secondary, dated, cite as his measurement.
- Honest cost side: this invariant forbids a whole class of optimizations (persistent code-mode kernels, cross-call state — Anthropic went the opposite way in its code execution API); log volume grows monotonically; compaction saves model tokens, not disk.

## Tentative Publish

Wednesday 2026-09-09 (fourth in series; evergreen; needs the assertion implemented in Aaron's pipeline first).

## Kill Criteria

Do not publish if the piece reads like:

- an event-sourcing tutorial or DSH internals walkthrough with no operator payoff;
- a piece whose only evidence is the DSH repo (the personal debugging anchor and the implemented assertion are mandatory);
- absolutism ("everyone must event-source everything") — the piece must offer the five-line floor, not just the cathedral;
- hype about auditability without the architecture-freedom cost it imposes.
