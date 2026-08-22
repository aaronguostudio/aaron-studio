# Memory Reflection

## Related Past Posts

- `2026-08-19/deepseek-harness-teardown.md`: series anchor. It established that the harness changes completion rate and cost, that provider-side caching depends on harness-side prefix discipline, and that portable skills/instruction files are Aaron's durable asset layer. Its final sentence explicitly promises this first-request measurement.
- `2026-06-20/ai-became-my-operating-system.md`: moved the unit of work from a task to a work system. This post can now put a measurable fixed cost on starting that system.
- `2026-06-15/fable-5-managing-ai-autonomy.md`: moved the unit from a response to a run and argued for explicit budgets. The new article upgrades “budget” from a general control to an itemized first-request and fan-out cost.
- `2026-07-06/why-ai-companies-are-becoming-deployment-companies.md`: warned that token consumption is an input rather than value. The new article should preserve that boundary: the goal is not minimum tokens, but lower uncached input per successful completed task.

## Ideas To Reuse

- The harness, not only the model, determines cost and reliability.
- Provider stores the cache; the harness determines whether the request prefix can hit it.
- Skills and instruction files are owned assets, but owned assets still have carrying cost when eagerly loaded.
- A run needs a budget and evidence, not only a prompt.
- Concrete bottleneck opening: show the one-word reply and its 17,606-token input receipt before naming the abstraction.

## Ideas To Update

- “Skills are the durable layer” remains true, but portability is not free. An eagerly loaded asset catalog spends context on every fresh session even when no asset is used.
- “Cache discipline is gross margin” needs a two-account correction: caching changes the marginal price of repeated input; it does not shrink the context footprint or restore attention capacity.
- “The unit is a run” needs one further step: fresh sessions and fresh subagents are fixed-cost multiplication events. This must be stated conditionally because harnesses fork and inherit context differently.
- “Token spend is not value” becomes an operating denominator: compare uncached input with successful completed tasks, not with prompts or raw runs.

## Internal Link Candidates

- Link the series anchor in the opening or first mechanism section: `/blogs/deepseek-harness-teardown`.
- Link the run-budget discussion when explaining session fan-out: `/blogs/fable-5-managing-ai-autonomy`.
- Link the operating-system post when explaining workspace memory and capability surfaces: `/blogs/ai-became-my-operating-system`.
- Link the deployment article only if the conclusion uses “tokens are inputs; changed work is value.” Avoid four internal links if three do the job.

## Continuity Thesis

This post extends Aaron's previous writing by turning the abstract claim that “the harness matters” into a reproducible first-request bill. Aaron previously argued that the unit of AI work changed from a response to a run and that skills are the durable asset layer. The new judgment is sharper: every run begins by loading an operating system, that operating system has a measurable carrying cost, and the right target is not the smallest prompt but the lowest uncached input per successful completed task.
