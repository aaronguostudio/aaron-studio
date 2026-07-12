# Blog Production Editorial System

Use this reference for serious essays and substantial rewrites.

## The Editorial Contract

Lock seven decisions before drafting:

1. Reader: one primary reader, not a broad audience list.
2. Job: the decision, diagnosis, or action the reader needs help with.
3. Promise: what the reader will understand or be able to do after reading.
4. Opening: one concrete scene, contradiction, bottleneck, result, or timely event with enough evidentiary weight to carry the first claim.
5. Contribution: the idea this article adds beyond the source material and Aaron's prior posts.
6. Boundary: what the article will not claim and where Aaron lacks direct authority.
7. Hypothesis: why this angle should earn qualified reading, sharing, or response.

Write these into `editorial-scorecard.md`. If the contract is vague, do not solve it with more research or more sections.

Concrete does not mean personal. If the article exists because of a current market or product event, name the subject before introducing an analogy. A personal example may move later when it clarifies the mechanism but is too small to establish the thesis.

## Evidence Discipline

Use `claim-ledger.md` to separate:

- fact: directly supported by a cited source;
- inference: Aaron's interpretation of facts or patterns;
- judgment: an operator conclusion or recommendation;
- personal observation: something Aaron directly experienced.

Prefer primary sources. Treat vendor announcements as evidence of what the vendor says or does, not neutral proof that the product works. Record source dates and verification dates. Remove a claim when its evidence is weak; do not hide uncertainty in smoother prose.

## Draft Architecture

A serious operator essay normally needs this movement:

```text
concrete bottleneck -> surprising pattern -> thesis -> mechanism -> proof
-> credible objection -> usable frame -> implication
```

This is a movement, not a mandatory heading template. Do not mirror the research dossier or list companies one by one. Put the article's original judgment in the first 15% and make the title's promise concrete within the first 150 words.

Use a focus budget:

- one main thesis;
- one core mechanism;
- one reusable frame at most;
- five to seven major sections for a 1,600-2,600 word English essay;
- source/news recap should normally stay below 20% of the article;
- each section must add a new causal step, proof, objection, or decision.

## Revision Protocol

Do not run repeated unbounded polish passes. Use four distinct passes:

1. Structural redraft: change thesis, sequence, evidence, or section jobs.
2. Red team: attack assumptions, authority, counterarguments, and unnecessary paragraphs.
3. Prose edit: improve rhythm and naturalness without changing facts.
4. Package QA: validate frontmatter, links, image paths, artifact state, and stale media.

Record what was added, cut, reframed, and intentionally kept in `editorial-scorecard.md`. This delta is the learning signal for the next post.

## Three Production Locks

Use three explicit locks to prevent downstream work from starting against a moving article:

1. **Argument Lock:** thesis, claim boundaries, evidence, mechanism, credible objection, and the one primary executable framework are stable. Final prose and formal visual planning may start after this lock.
2. **Article Lock:** English and Chinese sibling editions, title, section sequence, image positions, and conclusion are accepted. Final image generation, audio, and video may start after this lock.
3. **Package Lock:** transformed blog files, frontmatter, public image paths, internal links, bilingual routes, and browser-rendered pages have passed. External publishing may start after this lock.

A passing automated score does not create a lock by itself. Record the lock decision in `editorial-scorecard.md` or `postmortem.md`, including the known caveats. When an upstream artifact changes after a lock, identify every downstream asset that is stale and re-run the relevant gate. The existence of an older image, script, audio file, or video is not evidence that it still matches the article.

## Feedback Promotion

Every useful correction should be classified before it changes the global workflow:

- local sentence: fix only the article;
- article lesson: record it in prose, visual, or editorial review;
- reusable rule: update a strategy file or skill when the failure is likely to recur across posts;
- automated check: add a test or validator only when the pattern is detectable with acceptable false-positive cost.

Do not let recurring failures remain trapped in one draft. Also do not turn every taste preference into a global hard rule. Promotion requires a reusable failure mode, a clear desired behavior, and a specific phase that owns the check.

## Scorecard Rules

Score the final article against the weighted template. Passing requires at least 85/100 and no dimension below 70% of its weight. Scores must cite specific evidence in the draft. A number without editorial reasoning is not a gate.

The scorecard cannot override:

- unsupported or stale claims;
- a misleading title;
- broken links or missing images;
- a Chinese version that changes the argument;
- an image set that fails visual critique.

## Bilingual Rule

English and Chinese are sibling editions. Keep the claim set, thesis, and source links aligned, but let sentence order, examples, transitions, and section openings adapt to each language. Do not translate awkward English metaphors merely to preserve symmetry.
