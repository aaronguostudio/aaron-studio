# Aaron Voice Clone Language Scenario Test Script

Use this document after the ElevenLabs voice clone is created. Generate one audio file per scenario so the results are easy to compare across voice settings.

Recommended first settings:

```text
Model: eleven_multilingual_v2
Stability: 0.55
Similarity: 0.82
Style: 0
Speaker Boost: off
Speed: 0.98
```

Then compare against:

```text
identity-check: stability 0.52, similarity 0.90, style 0, speaker boost on, speed 0.98
calmer-pauses: stability 0.62, similarity 0.80, style 0, speaker boost off, speed 0.95
light-expression: stability 0.45, similarity 0.82, style 0.15, speaker boost off, speed 1.0
```

## How To Score

Score each generated sample from 1 to 5.

| Scenario | Identity | Naturalness | Clarity | Pacing | Listener Fatigue | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| S01 English hook |  |  |  |  |  |  |
| S02 English technical explainer |  |  |  |  |  |  |
| S03 English reflective story |  |  |  |  |  |  |
| S04 English dense terms |  |  |  |  |  |  |
| S05 Mandarin explanation |  |  |  |  |  |  |
| S06 Mandarin reflective |  |  |  |  |  |  |
| S07 Bilingual code-switching |  |  |  |  |  |  |
| S08 Chinese names plus English tools |  |  |  |  |  |  |
| S09 Numbers and metrics |  |  |  |  |  |  |
| S10 Casual aside |  |  |  |  |  |  |
| S11 Long-form paragraph |  |  |  |  |  |  |
| S12 Final video outro |  |  |  |  |  |  |

Production threshold: the best setting should score 4+ on English scenarios S01-S04 and S09-S12. Mandarin and bilingual scenarios are diagnostic unless you plan to publish Chinese narration with this same clone.

## S01 English Hook

Purpose: test short opening energy without fake hype.

Text:

```text
AI coding is not just making developers faster.

It is quietly changing what a software team is.

The bottleneck used to be writing the code. Now the bottleneck is understanding whether the code should exist.
```

Listen for:
- Does it sound like Aaron, not a generic narrator?
- Does it pause naturally after the first sentence?
- Does it avoid sounding overdramatic?

## S02 English Technical Explainer

Purpose: test the main YouTube/video essay use case.

Text:

```text
The old software workflow separated requirements, design, implementation, testing, documentation, and deployment into different queues.

That separation made sense when each step was slow.

But when an AI agent can draft a design, generate tests, implement the change, and summarize the risk in the same session, the bottleneck moves.

The important question is no longer which role owns this step. The important question is who owns the outcome end to end, and what evidence makes the work safe to ship.
```

Listen for:
- Are technical words clear?
- Does the rhythm feel explanatory instead of robotic?
- Does "requirements, design, implementation" stay clean and not rushed?

## S03 English Reflective Story

Purpose: test warmer narration and personal reflection.

Text:

```text
The first time this really hit me, it was not because the AI wrote perfect code.

It was because the loop felt different.

I could explain the problem, ask for a plan, push back on the plan, and then see an implementation almost immediately.

That changes your relationship with the work. You start thinking less like a ticket executor, and more like someone steering a living system.
```

Listen for:
- Does it feel like a person thinking aloud?
- Does the clone preserve warmth without preserving uncomfortable pronunciation artifacts?
- Is the pacing calm enough for a reflective section?

## S04 English Dense Technical Terms

Purpose: stress test product and engineering vocabulary.

Text:

```text
Before I merge a pull request, I want the regression test to describe the behavior clearly.

If the feature flag is enabled in production, observability should tell us whether the new path is healthy.

If the benchmark looks worse, the owner should pause, review the context, and decide whether the implementation is still worth shipping.

API, UAT, QA, TypeScript, React, Nuxt, Remotion, Turso, SQLite, PostgreSQL, ElevenLabs, OpenAI, GitHub, Vercel.
```

Listen for:
- Does each tool name stay understandable?
- Does it mangle "PostgreSQL", "Turso", "Nuxt", or "ElevenLabs"?
- Does the acronym sequence sound too mechanical?

## S05 Mandarin Explanation

Purpose: test whether the English-focused clone can still speak natural Mandarin.

Text:

```text
我觉得 AI 编程真正改变的不是写代码这件事本身，而是整个软件交付的节奏。

以前一个需求要经过业务分析、设计、开发、测试、UAT，然后再部署。

现在很多步骤会被压缩到一个更短的循环里面。一个人可以理解需求，和 AI 一起设计方案，快速实现，再用测试和日志把风险讲清楚。

这不是说团队不重要了。恰恰相反，团队需要更清晰的边界，更好的标准，以及更快的对齐方式。
```

Listen for:
- Is Mandarin fluent and comfortable?
- Does it sound like Aaron or like a translated synthetic voice?
- Does it handle "AI", "UAT" naturally inside Chinese?

## S06 Mandarin Reflective

Purpose: test slower, personal Chinese narration.

Text:

```text
我现在越来越觉得，AI 时代的个人能力不是简单地变强，而是变得更集中。

很多以前需要排队、交接、等待反馈的事情，现在可以在一个人的上下文里面快速完成。

但是这也带来一个新的问题：如果一个人走得太快，团队怎么知道他为什么这样做，又怎么知道这个结果是安全的？

所以真正重要的不是速度本身，而是让速度变得可解释、可验证、可协作。
```

Listen for:
- Does the voice keep a natural reflective cadence?
- Are pauses around the colon-like turns clear?
- Does the sample become too flat after 30 seconds?

## S07 Bilingual Code-Switching

Purpose: test Aaron's real-world mixed-language style.

Text:

```text
我觉得这里最关键的不是 AI generated code 有多快，而是 ownership model 变了。

以前我们会问：这个 step 是 BA 负责，还是 developer 负责，还是 QA 负责？

现在更好的问题是：who owns the outcome end to end?

如果一个 owner 可以把 context、implementation、test evidence 和 release note 都串起来，那团队的 collaboration 就不应该靠更多 meeting，而应该靠更清楚的 boundary 和 evidence。
```

Listen for:
- Does switching between Chinese and English sound natural?
- Are "ownership model", "outcome", "implementation", "test evidence", and "release note" clear?
- Does the voice get confused around mixed grammar?

## S08 Chinese Names Plus English Tools

Purpose: test proper nouns, Chinese names, and product names in one sample.

Text:

```text
假设 Aaron 在团队里面负责一个 Nuxt 项目，后端用 Turso 和 SQLite，部署在 Vercel 上。

他和 Claude Code 一起改了一个 blog publishing workflow，然后用 GitHub Actions 做验证。

这个时候最重要的不是 PR 里面有多少行代码，而是这个 change 有没有清楚地说明：为什么要改，怎么测试，如果 production 出问题应该怎么 rollback。

这种表达方式，才是 AI coding 之后团队真正需要的 shared language。
```

Listen for:
- Does "Aaron" sound natural?
- Does it handle "Nuxt", "Turso", "Vercel", "Claude Code", "GitHub Actions"?
- Does the mixed sentence still sound human?

## S09 Numbers And Metrics

Purpose: test numbers, dates, percentages, and pacing.

Text:

```text
In June 2026, the team shipped 17 small changes across 4 modules.

The median review time dropped from 2.8 days to 7.5 hours.

But the failure rate moved from 1.2 percent to 1.9 percent, which means speed improved before reliability caught up.

That is exactly the kind of signal a good feedback loop should reveal.
```

Listen for:
- Are dates and numbers easy to understand?
- Does "1.2 percent to 1.9 percent" sound precise?
- Does it pause before the conclusion?

## S10 Casual Aside

Purpose: test casual but not fake-casual delivery.

Text:

```text
This is the part that is easy to miss.

AI does not magically remove coordination cost. Sometimes it moves the cost to a place where we are less used to seeing it.

You feel faster because the code appears faster.

But the team still has to understand the decision. And that is where the real work begins.
```

Listen for:
- Does it avoid "presenter voice"?
- Does it sound grounded and conversational?
- Does it preserve Aaron's warmth?

## S11 Long-Form Paragraph

Purpose: test whether the clone stays stable over a longer passage.

Text:

```text
The one-person project is not a fantasy of working alone. It is a design pattern for the AI era.

One person carries the full context of a module, moves quickly with AI, and produces enough evidence that the rest of the team can trust the direction without being dragged into every small decision.

That evidence might be a clean test suite, a short architecture note, a deployment checklist, a dashboard, or a rollback plan.

The team still matters, but the shape of collaboration changes. Instead of splitting every step across different roles, we let one accountable owner move through the loop, and we use shared standards to keep that speed connected to the larger system.

This is how individual acceleration becomes organizational progress instead of organizational noise.
```

Listen for:
- Does the cadence become repetitive?
- Does it maintain energy for the full passage?
- Is there enough variation between idea sentences and conclusion sentences?

## S12 Final Video Outro

Purpose: test a realistic ending for Aaron's channel.

Text:

```text
The future team may have fewer handoffs, but it needs better standards.

The goal is not to remove collaboration.

The goal is to make collaboration strong enough for the speed of one focused builder with AI.

If you are also trying to redesign your own workflow around AI, this is probably the question to sit with:

What should one person own, and what evidence does the team need to trust that ownership?
```

Listen for:
- Does the final question land naturally?
- Does the ending feel thoughtful instead of promotional?
- Would you be comfortable publishing this voice on YouTube?

## File Naming

Recommended generated sample names:

```text
s01-english-hook__natural-baseline.mp3
s02-english-technical-explainer__natural-baseline.mp3
s03-english-reflective-story__natural-baseline.mp3
s04-english-dense-terms__natural-baseline.mp3
s05-mandarin-explanation__natural-baseline.mp3
s06-mandarin-reflective__natural-baseline.mp3
s07-bilingual-code-switching__natural-baseline.mp3
s08-chinese-names-english-tools__natural-baseline.mp3
s09-numbers-metrics__natural-baseline.mp3
s10-casual-aside__natural-baseline.mp3
s11-long-form-paragraph__natural-baseline.mp3
s12-final-video-outro__natural-baseline.mp3
```

Repeat the same names with `identity-check`, `calmer-pauses`, and `light-expression` if you want a full matrix.
