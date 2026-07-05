# Recording Script

Read this as Aaron, not as an announcer. The goal is a polished version of your normal English narration.

Do not perform a perfect American accent. Keep the sound recognizable, but make the words clear and comfortable.
Leave natural pauses. Silence is useful training signal and can be trimmed later.

## AI/software/product explanatory English

Target: 25 minutes

Capture the voice Aaron actually needs for YouTube essays: concrete technical explanation, calm transitions, and clear product language.

Guidance:
- Speak as if explaining a real architecture tradeoff to a smart friend.
- Keep the Chinese-English identity in the voice, but make the English easy to listen to.
- Slow down on nouns, numbers, product names, and contrasts.

How to fill the target time:
- Read each read take slowly once, then repeat the strongest takes with slightly different emphasis.
- For each freestyle take, speak from the prompt for 2 to 4 minutes. Do not only read the prompt text.
- If a sentence feels awkward, pause, restart that sentence, and keep recording.

### tech-01: From tool to operating loop

Mode: read

AI coding changes the software loop in a very practical way. The old process separated requirements, design, implementation, testing, documentation, and release evidence into different queues. That separation made sense when each step was slow. But when an AI agent can draft a design, generate tests, implement the change, and summarize the risk in the same session, the bottleneck moves. The important question is no longer which role owns this step. The important question is who owns the outcome end to end, and what evidence makes the work safe to ship.

### tech-02: Review becomes the scarce resource

Mode: read

The surprising part is that AI does not remove review. It makes review more important. A model can produce hundreds of lines of code in a minute, but a human still needs time to understand the behavior, the integration boundary, and the failure mode. So the team has to design a new rhythm. Let the agent move fast inside a small module. Let the owner keep the context. Then use shared tests, clear pull requests, and production signals to align the rest of the team.

### tech-03: Testing as evidence

Mode: read

In this workflow, tests are not paperwork. They are the evidence trail. A good test says: this is the behavior I intended, this is the edge case I considered, and this is the contract I do not want to break next week. When AI writes code quickly, test quality becomes one of the strongest signals of human judgment. The test is where the owner explains the shape of the problem to the rest of the team.

### tech-04: A small module owner

Mode: freestyle

Explain, in your own words, why one person owning a module does not mean working alone. Talk about boundaries, shared standards, release evidence, and when to ask another engineer for review.

### tech-05: When speed creates coordination debt

Mode: read

Speed creates a hidden kind of coordination debt. If one developer and an AI agent can change a feature three times before lunch, everyone else can lose the thread. The fix is not to slow the developer down by default. The fix is to make the unit of alignment smaller and more explicit. What changed? Why did it change? What test proves it? What dashboard will tell us if we were wrong? Those questions let a fast loop stay connected to the team.

### tech-06: Product intuition

Mode: freestyle

Describe a feature request that looks simple at first, then explain how you would use AI to turn it into a design, a test plan, and a first implementation. Keep it concrete and practical.

## Conversational reflection

Target: 10 minutes

Capture a warmer, more personal version of Aaron's voice, with hesitation, pauses, and reflective phrasing.

Guidance:
- Talk like you are thinking with the audience, not presenting a finished memo.
- Leave natural pauses after a contrast or a surprising sentence.
- It is fine to restart a sentence. Keep the best take later.

How to fill the target time:
- Read each read take slowly once, then repeat the strongest takes with slightly different emphasis.
- For each freestyle take, speak from the prompt for 2 to 4 minutes. Do not only read the prompt text.
- If a sentence feels awkward, pause, restart that sentence, and keep recording.

### reflection-01: The feeling of a faster loop

Mode: read

The first time this really hit me, it was not because the AI wrote perfect code. It was because the loop felt different. I could explain the problem, ask for a plan, push back on the plan, and then see an implementation almost immediately. That changes your relationship with the work. You start thinking less like a ticket executor, and more like someone steering a living system.

### reflection-02: What still belongs to the human

Mode: read

I do not think the human role becomes smaller. I think it becomes more compressed. Taste, judgment, sequencing, and responsibility all move closer together. The AI can help with the mechanical parts, but it does not know why this tradeoff matters for this team at this moment. That context is still human work.

### reflection-03: Healthy discomfort

Mode: freestyle

Talk about one part of AI coding that still makes you uncomfortable. Do not make it dramatic. Explain the concern, then explain what kind of process would make it safer.

### reflection-04: Builder identity

Mode: freestyle

Explain what AI-native builder means to you. Keep the tone grounded. Avoid slogans. Talk about curiosity, responsibility, and how you want to work.

## Hooks, transitions, and endings

Target: 10 minutes

Capture short high-importance lines where pacing, pause, and emphasis matter more than raw pronunciation.

Guidance:
- Do not overact the hook. Make it feel like a thought worth leaning into.
- Pause before the final sentence of each ending.
- Vary the first word across takes so the model learns different openings.

How to fill the target time:
- Read each read take slowly once, then repeat the strongest takes with slightly different emphasis.
- For each freestyle take, speak from the prompt for 2 to 4 minutes. Do not only read the prompt text.
- If a sentence feels awkward, pause, restart that sentence, and keep recording.

### hook-01: Quiet contradiction

Mode: read

AI coding is not just making developers faster. It is quietly changing what a software team is.

### hook-02: Bottleneck shift

Mode: read

The bottleneck used to be writing the code. Now the bottleneck is understanding whether the code should exist.

### transition-01: From example to pattern

Mode: read

That example is small, but the pattern is not. Once the loop becomes this fast, the whole workflow has to be redesigned around ownership.

### ending-01: Human standard

Mode: read

The future team may have fewer handoffs, but it needs better standards. The goal is not to remove collaboration. The goal is to make collaboration strong enough for the speed of one focused builder with AI.

### ending-02: Open loop

Mode: freestyle

End a short video in your own words. Invite the audience to rethink team design without sounding like you are selling a framework.

## Technical terms and proper nouns

Target: 5 minutes

Teach the voice how Aaron says common English technical phrases without making pronunciation overcorrected or uncomfortable.

Guidance:
- Read the list slowly first, then read it once in normal sentences.
- Do not perform a perfect American accent. Clear and comfortable is better.
- Keep a little of your natural sound so the voice still feels like you.

How to fill the target time:
- Read each read take slowly once, then repeat the strongest takes with slightly different emphasis.
- For each freestyle take, speak from the prompt for 2 to 4 minutes. Do not only read the prompt text.
- If a sentence feels awkward, pause, restart that sentence, and keep recording.

### terms-01: Core software terms

Mode: terms

API, pull request, code review, regression test, production deploy, staging environment, product requirement, user acceptance testing, quality assurance, observability, incident review, rollback plan, feature flag, architecture boundary, integration test, prompt, context window, evaluation, benchmark, feedback loop.

### terms-02: Terms in sentences

Mode: read

Before I merge a pull request, I want the regression test to describe the behavior clearly. If the feature flag is enabled in production, observability should tell us whether the new path is healthy. If the benchmark looks worse, the owner should pause, review the context, and decide whether the implementation is still worth shipping.

### terms-03: Names and common platforms

Mode: terms

OpenAI, Anthropic, Google, Microsoft, GitHub, Vercel, ElevenLabs, LinkedIn, YouTube, TypeScript, Python, React, Nuxt, Remotion, Turso, SQLite, PostgreSQL.
