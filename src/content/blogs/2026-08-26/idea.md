# Idea

## Working Title

**AI Made Process Cheaper. Judgment Is Still Expensive.**

## Topic

DeepSeek Harness contains an early project note: agents follow enforced gates more reliably than prose conventions, and “a lot of work” is no longer a decisive cost argument when agents do the labor.

The larger idea is not that AI-native teams should add more process. It is that AI changes the economic category of good process. Tests, constraints, decision memory, evaluations, and feedback loops can become **organizational capital**: costly to choose well, cheap to execute repeatedly, and capable of compounding across thousands of agent runs.

## Why Now

- OpenAI reports that an initially three-engineer team drove Codex to build an internal product with roughly one million lines of code and 1,500 pull requests in five months, with no manually written code. Their surprising response to cheap execution was to introduce architectural constraints earlier, not later.
- DeepSeek Harness independently converged on unusually dense decision records, gates, generators, and postmortems across 12,293 commits in 64 days.
- Anthropic’s study of roughly 400,000 Claude Code sessions found a clear division of labor: people made about 70% of planning decisions but only 20% of execution decisions.
- DORA’s 2025 research describes AI as an amplifier of the underlying organizational system, not an independent source of high performance.

Together these suggest a structural shift rather than a tool trend: execution is becoming abundant, while intent, acceptance criteria, architecture, and institutional memory remain scarce.

## Target Reader

Product and engineering leaders, founders, and AI-native builders deciding how their operating model should change when a small number of people can direct a much larger amount of agent labor.

## Reader Tension

- “If agents can generate code, tests, and documentation, why does shipping still feel constrained?”
- “Should a small team really adopt process that used to belong to a large organization?”
- “How do I distinguish compounding guardrails from AI-generated bureaucracy?”

## Thesis

AI does not remove process; it changes its economics. When execution can scale without proportional headcount, the rules, feedback loops, and institutional memory surrounding the work become production infrastructure. The scarce input moves upward to judgment: deciding what matters, what can be encoded, and what must eventually be retired.

## Original Contribution

Name the difference between **process capital** and **process inflation**.

- Process capital captures a recurring, expensive judgment and lets the system apply it cheaply.
- Process inflation creates more rules, documents, or checks without reducing future human judgment.

Proposed test: a rule earns permanence only if it encodes a recurring judgment, can be executed or checked without continuous human interpretation, and has a clear owner or retirement condition.

## Why Aaron Can Write This

Aaron has inspected the DeepSeek Harness repository and its engineering history deeply enough to see the machinery behind its output, and is building a studio whose reusable skills must work across Claude, Codex, and other agents. That operator experience supplies the questions and interpretation. It should not be inflated into the article’s principal evidence; the principal evidence comes from larger, independently converging systems and research.

## Publication Timing

The folder date is a series identity, not a deadline. Research and drafting continue now. Publication follows once the DeepSeek claims are freshly verified and the argument survives red-team review.

## Kill Criteria

Do not publish if the essay becomes:

- a celebration of large code or commit counts;
- “more process is good” advice without a theory of deletion;
- a claim that tests and gates replace judgment;
- a prescription to copy AI-lab process density into every small team;
- a vendor-case collage without an original economic mechanism.

