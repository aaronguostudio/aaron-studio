# Blog Plan: The Model Got a Body

## Meta
- **Author:** Aaron Guo
- **Target:** aaronguo.com blog (EN + ZH bilingual)
- **Tone:** Entrepreneurial, crisp, insight-led, commercially useful; no soft self-help, literary emotion, or teacherly advice.
- **Length:** ~2,200 words (EN)
- **Audience:** Operators and builders using Claude Code / Codex / ChatGPT daily, deciding whether a harness is a real workflow change.
- **CTA:** reply (rotation)

## Hook
The first thing I noticed, running V4 Pro inside DeepSeek Harness, is that I don't have a toolbox. I have a programming language — exactly one tool I can call directly, and every other tool in the system reached from inside a program I write. That fact rearranged how I worked within ten minutes, and it's where the "feel" of this thing stopped matching every AI I'd used before.

## Thesis
Working inside DeepSeek Harness + V4 Pro doesn't feel like a smarter chatbot — it feels like the model acquired a body (programmable tools, loadable skills, held state, an audit log), and the operational consequence is that you stop reading its prose and start watching its state.

## Personal Anchor
This production session: I'm running the full blog-production pipeline on DSH + V4 Pro right now, with the 57-skill catalog, the goal/todo/subagent primitives, and a live claim ledger — so the "feel" is observed, not remembered.

## Outline

### Part 1: I don't have a toolbox anymore
- Point: The run_code fact, stated concretely; this is the body moment, not a UI tweak.
- Evidence: first-hand (only run_code is directly callable; read/write/bash/grep all live inside the program I write).
- Personal beat: within ten minutes, my unit of work stopped being "a message" and became "a small program that orchestrates the message's work".

### Part 2: The body, in four parts
- Point: the "feel" is structural — four gifts, each named by what it's made of and what it buys.
- Evidence: hands (programmable tool surface), competence (skills as SKILL.md files + base dir), continuity (goal/todo/subagent hold state), memory (append-only log / claim ledger).
- Personal beat: the 57-skill catalog; the claim ledger I'm literally maintaining as I write.

### Part 3: What the body buys
- Point: the unit of work changes from an answer to a job you hand off end-to-end; delegation stops being turn-by-turn risk.
- Evidence: ties to teardown ("harness decides completion/cost/audit") and fable-5 ("unit = run").
- Personal beat: this pipeline — idea → outline → draft → red-team → polish → scorecard — is a job, not a series of prompts.

### Part 4: The honest limit
- Point: the body scales failure faster; the "competence" is partly staging; judgment doesn't auto-improve.
- Evidence: DSH's own docs (runaway reminders only; file tools no timeout); "能干活，但得盯着"; Ronacher "not perfect"; jiayuan_jy "still trails Claude Code/Codex".
- Personal beat: the claim ledger refused a date I wanted to pin — the machine doesn't judge, it records.

### Part 5: Watch the state, not the prose
- Point: the reusable frame; when you hand off a job, check the state (plan/todos, fact-vs-inference ledger, done-vs-failed definition), not just the prose.
- Evidence: this session's artifacts are the demonstration.
- Personal beat: a short executable checklist folded into the one frame.

### Part 6: The body is the asset
- Point: keep models swappable; the body (four gifts) is the asset that compounds — extends teardown's asset-layer rule.
- Evidence: teardown conclusion; local-crossover's "environment is what you buy".
- Personal beat: end on the operating rule, not a summary; CTA demoted to a post-note.

## Visual Ideas
- Cover: a model "gaining hands" — a stylized figure where a terminal/editor becomes the hand, or an abstract "toolbox dissolving into a programming language". Avoid glowing-AI cliché.
- Inline: a small diagram of "chatbox → harnessed body" showing the four gifts; or a screenshot of the run_code-only tool surface.

## Distribution Plan
- Blog: EN + ZH, full deep version.
- X: teaser-first, link in reply.
- Newsletter/LinkedIn: teaser with bare URL.
- YouTube: out of scope for this post (no video requested).

## Open Questions
- None blocking drafting.
