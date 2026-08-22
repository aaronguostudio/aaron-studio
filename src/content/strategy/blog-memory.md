# Blog Memory

This file is the lightweight global memory layer for Aaron's public writing.

It should capture reusable ideas, frameworks, internal link clusters, and recurring claims that future posts can extend, revise, or challenge.

## Canonical Ideas

- Enterprise AI value is created less by model access than by deployment capability: the system around the model that turns intelligence into trusted work.
- Token spend, model access, and usage charts are not proof that work changed; they need to be tied to outcomes, evidence, and operating loops.
- AI compounds when output becomes a learning loop. The durable pattern is intent -> run -> review -> memory at individual scale, and action -> context -> trust -> outcome -> recursive at enterprise scale.
- The harness layer decides whether agent work completes: the same model swings 46.7% -> 66.7% task success and ~7x cost by harness alone (Composio 2026-08-11; use the spread, never the ranking). The attribution problem now has a number.
- Builders' durable layer is rent / churn / own: models are rented, harnesses churn, and the assets every harness reads — skills, instruction files, recorded decisions — are what you own.
- 服务商负责存，harness 负责命中: prompt caching is stored provider-side, but hit-or-miss is decided by how the harness assembles the request. For a token vendor, cache discipline is gross margin, not a performance detail.
- 机器能查的交机器，判断力留人: agents follow enforced gates far more reliably than prose conventions; in agent teams rule density becomes a guardrail instead of bureaucracy, because the writer never gets tired.
- Portability cuts both ways (dependency inversion): a vendor that adopts its rival's file formats hands the rival's users portable assets — an open challenger sharpens this deliberately.

## Reusable Frameworks

- rent / churn / own asset test: sort your AI assets into two columns — portable (skills, instruction files, decision records) vs locked-in (harness-specific config, proprietary formats). The one-hour inventory tells you where the next investment goes.
- Model-visible ⟺ logged + pre-request assertion: keep the session as an append-only event log, derive the model's context from it, and refuse any request the log can't reconstruct — buys replay, resume, and per-step cost attribution for five lines of code.
- ACTOR for deployment-native AI:
  - Action: what work changes?
  - Context: what must the system know, and what are the boundaries?
  - Trust: what can the system safely do?
  - Outcome: what proves improvement?
  - Recursive: who owns the learning loop, and how does the system improve?

## Internal Link Clusters

- AI operating systems and deployment:
  - `src/content/blogs/2026-06-20/ai-became-my-operating-system.md`
  - `src/content/blogs/2026-07-06/why-ai-companies-are-becoming-deployment-companies.md`
- Ownership, boundary, evidence:
  - `src/content/blogs/2026-07-01/one-person-project-ai-coding-v2.md`
  - `src/content/blogs/2026-07-06/why-ai-companies-are-becoming-deployment-companies.md`
- Reliability and return distance:
  - `src/content/blogs/2026-06-27/farthest-humans-started-as-failure.md`
  - `src/content/blogs/2026-07-06/why-ai-companies-are-becoming-deployment-companies.md`
- Agent harness and portable assets:
  - `src/content/blogs/2026-08-19/deepseek-harness-teardown.md`
  - `src/content/blogs/2026-06-15/fable-5-managing-ai-autonomy.md`
  - `src/content/blogs/2026-07-01/one-person-project-ai-coding-v2.md`
  - `src/content/blogs/2026-07-06/why-ai-companies-are-becoming-deployment-companies.md`

## Claims To Revisit

- "Prompting is an interface skill; workflow engineering is the durable skill." This may deserve a standalone article with examples.
- "Recursive" needs proof from future AI workflow projects. Track whether runbooks, evals, and reusable patterns actually improve subsequent runs.
- "Harnesses churn / don't bind deeply" — revisit if the harness layer stabilizes (DSH's own repo warns compatibility will break; that warning has a shelf life).
- "DSH is the clearest public specimen yet of AI building a complex system" — deliberately bounded ("yet"); update when comparable repos publish their process records.
- The three DSH adoptions (pre-request assertion, cache trio, rejected/ directory) are claims until Aaron's own pipeline carries them. Two are series prerequisites (C ↔ rejected/ directory, D ↔ pre-request assertion); B's prerequisite is the entry-fee measurement, and the cache trio has no tracked follow-up yet.

## Future Branches

- The Deployment-Native Engineer.
- Why Enterprise AI Fails After The Demo.
- ACTOR Framework for AI Workflow Design.
- DSH series: C 制度经济学 (2026-08-26, rejected/ economics), B 成本解剖 (2026-09-02, first-request entry fee), D 日志深潜 (2026-09-09, the assertion in practice); E1–F candidates pending Aaron's call (rules-for-agents, main-loop deepening, tool-pipeline power, one-execution-world, eight-small-designs list).
