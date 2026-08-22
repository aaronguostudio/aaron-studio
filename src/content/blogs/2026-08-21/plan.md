# Blog Plan: I Stopped Renting Intelligence

## Meta
- **Author:** Aaron Guo
- **Target:** aaronguo.com blog (EN + ZH bilingual)
- **Tone:** Entrepreneurial, crisp, operator-grade; the subject is a cost-structure change, not a model review; no install steps, no tuning, no "local wins" absolutism.
- **Length:** ~1,800 words EN; ZH adaptation ~1,600-1,900 chars-equivalent.
- **Audience:** Operators and builders running agents daily, feeling token bills, curious about local but burned by the homelab noise.
- **CTA:** Newsletter — the DSH line continues; this post is its receipt.

## Hook
Yesterday, agent work arrived with an invoice line I couldn't audit. Today, the same kind of work — including this post — runs on chips I own, through a harness with no billing surface at all. The model in the middle is a 27B open-weights file. The version pin: DeepSeek Harness 0.1.0-rc.8, Qwen3.8-27B (Unsloth Q8_0) served by Ollama, M5 Max, 128GB unified memory. Everything in this post was produced on that machine.

## Thesis
Once a local model clears the daily-task bar, what you buy is not intelligence — it's an environment. The metering changes, and the harness (gates, skills, memory, audit) stops being engineering detail and becomes the place where quality responsibility lives.

## Personal Anchor
This production session: idea -> workflow3 artifacts -> bilingual drafts -> style/claim gates -> cover -> social package, all on the local stack, including the moments the model got wrong (a release date my fact-check flipped; a draft the style scanner flagged).

## Outline

### Part 1: The invoice and the meter (~250 words)
- Point: per-token cloud = renting intelligence; the bill is structural, gets worse the more automation works.
- Evidence: one coding-agent task = hundreds of thousands of tokens (pingwest, 2026-08); the version-pinned receipt.
- Personal beat: "This sentence is running with no meter."

### Part 2: The crossover just became real (~300 words)
- Point: 27B crossed the daily-task capability bar; same week the cloud raised the price line.
- Evidence: Qwen3.8-27B — mid-August 2026 open-source; 1M+ downloads in ~2 days; #1 HF global trending; Cline's top local model within 4 days; AA Intelligence Index 52 (pingwest/pandaily, with dates); "local Opus 4.6" nickname, with the source's own caveat: close is not equal (Terminal-Bench/HLE gaps).
- Evidence: DeepSeek V4-Pro peak output 6 -> 27 yuan/MTok + peak/off-peak billing (pingwest, 2026-08). Two curves, one crossing.
- Personal beat: "I draw the line on the capability side, not the price sheet — because the price sheet moves."

### Part 3: When the meter disappears, the harness takes over (~350 words)
- Point: zero marginal cost resurfaces the costs the invoice hid — quality costs. Locally the model's margin is smaller, so enforced gates are the difference between output and slop.
- Evidence: this session's gates fired for real: the style scanner flagged the draft, the claim ledger excluded a date mismatch, the fact-check corrected a release date. Link [teardown](/blogs/deepseek-harness-teardown): the harness logs what it does; here the log IS the audit, not an invoice.
- Evidence: [08-26 post](/blogs/ai-made-process-cheaper-judgment-is-still-expensive) — process cheap, judgment expensive; on a local model judgment has to be enforced in-system.
- Personal beat: the 21-minute pelican (Willison) — the local model thinks a lot and still misses the hard band; the system must catch what the model won't catch.

### Part 4: Self-referential, on purpose (~250 words)
- Point: the machine writing this is the subject; say the conflict of interest out loud.
- Evidence: receipts are version-pinned (rc.8 commit, model ID, machine spec); the gates are adversarial — they flag me, exclude me, correct my date.
- Personal beat: "I am reviewing my own broadcast on my own channel. The audit log is why you should still be able to check."

### Part 5: What it gives up (~300 words)
- Point: the crossover is per work class; a 27B local stack does not replace the frontier.
- Evidence: high-difficulty band (Terminal-Bench/HLE), long-horizon repo-level refactors, one-shot highest-ceiling tasks stay cloud; hardware is not free (128GB has a purchase price).
- Personal beat: the cost-structure math — recurring invoice vs amortized purchase; "the line moves when per-task metering becomes structural cost, which is exactly where agents are."
- Keep to: the honest list of what doesn't transfer.

### Part 6: The local crossover test (~350 words)
- Point: give the reader the test instead of my conclusion.
- Frame (operable): (1) Capability — does a 27B-class model clear this work class's bar on YOUR check, not a benchmark's? (2) Recurrence — is per-token metering structural cost for this class, or rounding error? (3) Audit — does your harness's gate+log replace what the vendor's SLA/invoice gave you? Pass all three -> move local; fail one -> rent that class.
- One-hour validation: pick one real workload class, run it on a 27B GGUF through your harness, read the audit log, diff your last cloud run of the same class.
- Closing (sharpens thesis): at zero marginal cost, the system around the model is the only place quality responsibility lives. Investment order flips: harness first, model is a shelf product. Series CTA: the DSH line gets its receipt; next, the rejection economics of the stack.

## Visual Ideas
- Cover: a split composition — receipt/invoice dissolving into a circuit/chip environment; warm muted palette consistent with the DSH series; no robot, no glowing-AI cliché.
- Inline: optional diagram of the three curves (cloud unit price, local amortized cost, capability threshold) — only if clean; otherwise the cover is enough for this length.

## Distribution Plan
- Blog: EN primary; ZH adaptation (not translation) — "我停止租用智能".
- X: teaser under 280 chars, link in reply; CTA follow.
- x-standalone-tweet: the cost-structure one-liner (invoice = recurring, purchase = amortized).
- LinkedIn: "Your token bill is hiding a cost-structure decision" professional operator angle.
- Newsletter: 80-140 word series-continuity teaser.
- Facebook: personal-network angle, light.

## Open Questions
- Inline diagram: decide yes/no at illustration time based on cover space and article length after prose pass.
