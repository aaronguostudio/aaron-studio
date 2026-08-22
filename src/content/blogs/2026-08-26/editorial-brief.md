# Editorial Brief — DeepSeek Harness, Part II

## Working title

**AI Made Process Cheaper. Judgment Is Still Expensive.**

## Reader pain

Agent output has grown faster than the reader’s ability to specify, review, integrate, and learn from it. They are caught between two bad intuitions: keep the old lightweight process and drown in output, or imitate a large AI lab and drown in rules.

## Reader job to be done

Recognize which recurring judgments should become durable, executable infrastructure and which proposed rules are merely procedural inflation.

## One-sentence promise

The article gives readers an economic model for why harnesses matter and a three-part test for deciding whether one more rule, evaluation, or decision record will compound or decay.

## Sharp thesis

AI does not eliminate process; it converts good process from coordination overhead into organizational capital. As execution becomes abundant, competitive advantage moves to the quality of the judgments a company can encode, reuse, and retire.

## Opening contradiction

OpenAI’s agent-first product reportedly reached roughly one million lines of code and 1,500 pull requests with an initially three-engineer team and no manually written code. Yet the team says it adopted architectural constraints normally postponed until hundreds of engineers as an early prerequisite. Cheap execution produced a demand for stronger structure, not weaker structure.

DeepSeek Harness independently shows the same inversion at a different organization. The convergence is the opening evidence.

## Original contribution beyond the source material

Treat the harness as **organizational capital in executable form**. Connect agent-native engineering to the established productivity J-curve idea: general-purpose technologies create value only after complementary investment in processes, business models, and human capital.

Then add the missing counterweight: cheap process can create process inflation. The useful distinction is not process versus no process, but capital versus clutter.

## Why Aaron can write this

Aaron has done a primary-source teardown of DeepSeek Harness and is actively testing whether the same studio skills transfer across different frontier agents. His authority is in interpreting the operating system around agent work, not claiming that a small studio incident proves an economy-wide thesis.

## Authority and scope boundary

- OpenAI, Anthropic, and Google/DORA data are self-reported or vendor-associated; present them as evidence of convergence, not neutral universal law.
- DeepSeek Harness is a young, unusually agent-heavy repository; its density is not a template for every team.
- The article argues that the location of scarce work is moving. It does not claim that execution is free or that human review can be eliminated.

## Evidence needed

- OpenAI harness engineering case: scale, team size, early constraints, QA bottleneck, garbage collection.
- DeepSeek Harness: pinned repository measurements, gates/notes/postmortems, and the 178-green-tests failure.
- Anthropic: planning versus execution decision share and returns to domain expertise.
- DORA: AI as amplifier of underlying organizational system.
- Productivity J-curve research: complementary intangible investment around a general-purpose technology.

## Counterargument

The most advanced AI companies are selected examples with access to frontier models, unusually skilled engineers, and incentives to publish success stories. Their process may be overbuilt or economically irrational for ordinary teams.

## Response

Do not copy their volume. Extract the shared mechanism: high agent throughput amplifies both good and bad organizational patterns. A small team should encode fewer judgments, but choose them more carefully. Scale changes the threshold, not the principle.

## Reusable frame: the Process Capital Test

A rule, evaluation, or memory artifact should survive only when:

1. it captures a recurring and expensive judgment;
2. an agent or machine can apply or check it without continuous interpretation;
3. someone owns its revision or retirement when the world changes.

Fail 1: bureaucracy. Fail 2: hidden human toil. Fail 3: institutional fossil.

## Distribution hook

“A three-engineer team produced a million-line product with AI. Their response was not less process. It was architecture you normally postpone until you have hundreds of engineers.”

## Kill criteria

- The DeepSeek quote is treated as a slogan rather than a hypothesis.
- The essay lacks a serious deletion/maintenance mechanism.
- The sources are listed company by company instead of forming one causal argument.
- The first 15% does not establish why the old economics of process changed.

