# Opening Sketch v2 — Larger Evidence Frame

Three engineers. Five months. Roughly one million lines of code. About 1,500 pull requests. Zero lines written directly by a human.

Those are OpenAI’s reported numbers from an internal product built with Codex. The company estimates that the team built it in a tenth of the time manual coding would have required.

But the million lines are not the most interesting part of the story. Neither is the absence of human-written code.

The surprising part is what the team did next: it introduced architectural constraints that, in its own words, most companies postpone until they have hundreds of engineers. Strict dependency directions, custom linters, structural tests, repository-local knowledge, and feedback loops were not late-stage governance. They were early prerequisites.

Execution became cheaper, so structure moved earlier.

I had just seen the same inversion in a very different place. DeepSeek Harness accumulated 12,293 commits in 64 days. Behind that output sat 683 decision notes, mechanical gates, documentation budgets, archived reasoning, and postmortems designed to end in executable checks. On the second day of the project, one of its notes stated the principle directly: agents follow enforced gates more reliably than prose conventions, and “a lot of work” is no longer a cost argument when agents do the labor.

At first, that sentence sounds like permission to over-engineer. If agents can write the tests, translate the documents, maintain the notes, and build the verifiers, why not encode everything?

But that is not what either project actually demonstrates.

OpenAI’s team also reported that human QA became the bottleneck. For a period, it spent every Friday—20 percent of the working week—cleaning up patterns the agents had copied and multiplied. DeepSeek’s strongest test suite still missed a broken real-world entry path: 178 tests passed, line coverage reached 100 percent, and the product failed anyway.

The old constraint had not disappeared. It had moved.

When human execution is scarce, process feels like overhead because the same people who produce the work must stop to document, review, and coordinate it. When agent execution becomes abundant, a well-designed constraint can be written once and applied across thousands of future actions. It begins to look less like paperwork and more like capital.

This is a familiar pattern in economic history. General-purpose technologies rarely create their full value through the technology alone. Their gains arrive with complementary investments in processes, products, business models, and human capability—the difficult-to-measure organizational capital around the machine.

A harness is that organizational capital made executable.

It tells an agent what the organization knows, what it permits, what success looks like, and when the machine must return a decision to a human. It allows a piece of judgment to survive the meeting, the chat thread, and the person who first made it.

Yet judgment itself has not become cheap. In Anthropic’s analysis of roughly 400,000 Claude Code sessions, people made about 70 percent of the planning decisions but only 20 percent of the execution decisions. The agent increasingly decided how. People still decided what—and what counted as done.

That division points to the real economics of agent-native work. AI does not eliminate process. It converts good process from coordination overhead into production infrastructure. The scarce resource moves upward: choosing which judgments deserve to be encoded, which exceptions still require a person, and which old rules have stopped earning their keep.

AI made process cheaper. It also made bad process easier to multiply. Judgment is what separates the two.

