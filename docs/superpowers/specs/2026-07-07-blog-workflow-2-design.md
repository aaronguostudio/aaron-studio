# Blog Workflow 2.0 Design

## Objective

Upgrade Aaron's blog production workflow from a content generation pipeline into an editorial system that produces fewer, stronger, more durable essays.

The 2.0 workflow should make each article prove that it is worth writing before drafting starts. It should also connect new work to Aaron's existing writing, create stronger research and argument structure, produce video as a native media product, and write lessons back into a reusable memory layer.

## Problem

The current workflow can produce a complete package: article, Chinese adaptation, images, video, social copy, and publishing artifacts. That is useful, but it still behaves too much like a production pipeline:

```text
idea -> outline -> article -> images -> video -> publish
```

The quality risk is that a post can become coherent but generic: a clear summary of a topic, with decent sources and acceptable polish, but not enough original judgment, reader pain, personal context, argument pressure, or long-term compounding value.

The FDE article showed the gap. It had a good topic, timely sources, a useful ACTOR framework, and a video package. But the workflow exposed several issues:

- Editorial judgment happened too late.
- Source collection did not automatically become a deeper argument.
- The article's relationship to Aaron's older writing was not systematic.
- Video was initially too close to article adaptation, then needed manual refinement.
- Visual motion quality improved only after review feedback.
- Lessons were not guaranteed to be written back into future workflow defaults.

## Success Criteria

Blog Workflow 2.0 succeeds if each serious post has:

- a clear reader pain or curiosity gap;
- a sharp thesis that a smart reader could disagree with;
- a research dossier with high-quality sources, evidence, and counterarguments;
- a memory reflection pass that checks prior Aaron posts for continuity, contradiction, reuse, and internal links;
- an argument memo before drafting;
- a red-team review before final acceptance;
- a video-native adaptation rather than a blog read-through;
- a postmortem that records whether the prediction matched actual response;
- a memory update that improves future articles.

The goal is not to publish more. The goal is to publish work that compounds.

## Non-Goals

This design does not require full automation on day one.

The first version should be manual-first: templates, gates, explicit artifacts, and a disciplined operating process. Automation should be added after the workflow has been used on a few posts and the stable patterns are clear.

This design also does not force every post through the full heavyweight path. Quick notes, personal updates, or low-stakes posts can use a lighter workflow. Blog Workflow 2.0 is for serious public essays where Aaron wants durable quality.

## Workflow Overview

```text
0. Topic Intake
1. Memory Reflection
2. Editorial Brief
3. Research Dossier
4. Argument Memo
5. Draft
6. Red-Team Review
7. Final Article Package
8. Video-Native Adaptation
9. Visual + Audio Production
10. Distribution
11. Postmortem
12. Memory Update
```

Conceptually, the workflow has six layers:

```text
Judgment Layer   -> decide whether the article is worth writing
Memory Layer     -> connect the post to Aaron's previous work
Research Layer   -> build evidence, examples, and counterarguments
Writing Layer    -> draft, adapt, critique, and finalize
Media Layer      -> produce video, images, audio, and distribution assets
Learning Layer   -> compare predictions with outcomes and update memory
```

## Artifacts

Each serious post lives in:

```text
src/content/blogs/YYYY-MM-DD/
```

Blog Workflow 2.0 adds these artifacts:

```text
idea.md
memory-reflection.md
editorial-brief.md
research-dossier.md
argument-memo.md
plan.md
<slug>.md
<slug>-zh.md
red-team-review.md
video-brief.md
youtube-script.md
youtube-script-audit.md
x-post.md
x-standalone-tweet.md
newsletter-teaser.md
linkedin-brief.md
postmortem.md
canon-note.md
```

Not every artifact must exist for every lightweight post. For a serious post, all pre-writing artifacts should exist before final drafting and media production.

## Step Details

### 0. Topic Intake

Purpose: capture the raw idea and test whether it has reader value.

Artifact:

```text
idea.md
```

Required questions:

- What is the topic?
- Why now?
- Who is the reader?
- What pain, confusion, curiosity, or decision does the reader have?
- What is the initial thesis?
- What would make this article useful rather than merely timely?

Pass standard:

- The topic cannot be justified only by being newsworthy.
- The reader problem must be explicit.
- There must be an initial point of view.

Failure behavior:

- Continue brainstorming.
- Do not move to research or drafting.

### 1. Memory Reflection

Purpose: make each new article interact with Aaron's prior body of work.

Artifact:

```text
memory-reflection.md
```

Required sections:

```markdown
## Related Past Posts

## Ideas To Reuse

## Ideas To Update

## Internal Link Candidates

## Continuity Thesis
```

The pass should check at least three prior posts when relevant. It should look for:

- prior claims that this post extends;
- prior claims that this post revises or complicates;
- reusable phrases, frames, or diagrams;
- internal link candidates;
- old posts that might later link back to the new post.

Pass standard:

- At least one connection is identified, or the pass explicitly explains why no useful connection exists.
- Suggested internal links have semantic value, not SEO filler.
- The continuity thesis explains how the new post fits Aaron's long-term thinking.

Failure behavior:

- If no past posts are checked, stop and run the pass.
- If links are forced or irrelevant, remove them.

### 2. Editorial Brief

Purpose: make the editorial judgment before writing starts.

Artifact:

```text
editorial-brief.md
```

Required sections:

```markdown
## Reader Pain

## Sharp Thesis

## Why Aaron Can Write This

## Evidence Needed

## Counterargument

## Reusable Frame

## Distribution Hook

## Kill Criteria
```

Pass standard:

- The thesis is specific enough to be disagreed with.
- The reader pain is concrete.
- The brief names at least one counterargument or risk.
- The article has a plausible reusable frame, checklist, or decision lens.
- The brief includes kill criteria: what would make the post not worth writing?

Failure behavior:

- Revise the topic or thesis.
- If the post still lacks reader pain or original judgment, stop.

### 3. Research Dossier

Purpose: build the evidence base before prose.

Artifact:

```text
research-dossier.md
```

Required sections:

```markdown
## Primary Sources

## Secondary Sources

## Cases

## Counterarguments

## Quotes And Facts

## Open Questions
```

Pass standard:

- Serious posts should normally have 3-6 high-quality sources.
- Current factual claims must be verified with current sources.
- The dossier includes at least one counterargument, limitation, or risk.
- Sources serve the thesis instead of becoming a link pile.

Failure behavior:

- Keep researching.
- If the evidence does not support the thesis, revise the thesis before drafting.

### 4. Argument Memo

Purpose: prove the argument before drafting the article.

Artifact:

```text
argument-memo.md
```

Required structure:

```text
Thesis
  -> Why now
  -> Mechanism
  -> Evidence
  -> Counterargument
  -> Reusable frame
  -> Implication
```

Pass standard:

- Every major claim has a mechanism.
- Evidence maps to claims.
- The counterargument is not a straw man.
- The reusable frame is useful, not merely a mnemonic.
- The ending implication changes how the reader sees a decision or system.

Failure behavior:

- Revise the memo.
- Do not draft until the memo is coherent.

### 5. Draft

Purpose: write the English article and Chinese adaptation.

Artifacts:

```text
<slug>.md
<slug>-zh.md
```

Writing standard:

- Start from a concrete observation, conflict, or decision.
- Maintain Aaron's operator perspective.
- Use the research dossier and argument memo, but do not expose the scaffolding.
- Explain why the shift happens, not only that it happens.
- Include the fair counterargument.
- Give the reader a reusable frame.
- End with a stronger implication, not a summary.
- Treat the Chinese version as adaptation, not translation.

Pass standard:

- Article depth gate passes.
- Anti-AI style gate passes or any scanner flags are manually reviewed and justified.
- Chinese adaptation reads naturally.

Failure behavior:

- Run a revision pass that adds substance, not adjectives.

### 6. Red-Team Review

Purpose: attack the draft before the audience does.

Artifact:

```text
red-team-review.md
```

Required questions:

- Where does this sound like AI-generated filler?
- Where is it only summarizing news?
- Which claim lacks evidence?
- Which paragraph can be deleted without weakening the argument?
- Is the counterargument fair?
- Is Aaron's personal judgment actually contributing?
- Does the ending sharpen the thesis?
- Does the article contain a reusable idea worth remembering?

Pass standard:

- At least five issues are recorded.
- At least one substantive revision is made.
- The revision changes argument, evidence, structure, or rhythm, not only wording.

Failure behavior:

- Revise and re-check.
- Do not proceed to final package until major red-team issues are resolved or explicitly accepted.

### 7. Final Article Package

Purpose: prepare the public writing package and internal links.

Artifacts:

```text
x-post.md
x-standalone-tweet.md
newsletter-teaser.md
linkedin-brief.md
```

Additional pass:

```text
Internal Link + Canon Pass
```

The internal link pass should:

- add natural links to prior posts when they help the reader;
- avoid forced self-citation;
- note whether old posts should later link back to the new article;
- identify any new canonical concept produced by the article.

Pass standard:

- Distribution copy is teaser-first, not article compression.
- Internal links are useful in context.
- The article has exactly one canonical category and 2-4 specific tags.

### 8. Video-Native Adaptation

Purpose: make video a native media product rather than a narrated article.

Artifacts:

```text
video-brief.md
youtube-script.md
youtube-script-audit.md
```

Required questions:

- What is the first 15-second promise?
- What is the video-specific story spine?
- Which parts should be spoken rather than written?
- Which parts need visuals or motion graphics?
- What does the video add beyond the article?
- Where are the retention beats?
- What should the viewer remember?

Pass standard:

- The script is not a blog read-through.
- It has a cold open with story, tension, or surprise.
- It includes retention beats every 20-35 seconds.
- It adds at least three things beyond the article.
- It passes the YouTube script audit before TTS or rendering.

Failure behavior:

- Revise the video brief or script before rendering.

### 9. Visual + Audio Production

Purpose: make generated media feel like a professional content product.

Quality standards:

- Cover and thumbnail are not generic AI imagery.
- Images express ideas instead of decorating paragraphs.
- Videos avoid long static or blank stages.
- Motion graphics follow narration timing.
- Audio voice is natural and durable for a full listen.
- The opening line must match the article and video thesis.
- Visuals and captions do not overlap or crowd the frame.

Workflow lesson from the FDE post:

Structured motion slides should not sit on a mostly blank stage while narration builds context. Use the anchor image or a richer bridge state first, then transition into the framework near the sentence that names it.

Pass standard:

- Rendered video is checked at key frames.
- Audio sample is reviewed before final video rendering when voice changes.
- iCloud copy or export copy is checksummed when needed.

### 10. Distribution

Purpose: publish and share without flattening the article.

Distribution standards:

- Blog remains the source of truth.
- X is teaser-first.
- LinkedIn adds professional context without becoming a mini article.
- Newsletter gives enough setup to click.
- YouTube metadata reflects the video promise, not only the blog title.

Pass standard:

- External posting requires explicit approval.
- Blog build and target artifacts are verified before publishing.

### 11. Postmortem

Purpose: compare predictions with reality.

Artifact:

```text
postmortem.md
```

Required sections:

```markdown
## Prediction

## Actual 24h

## Actual 7d

## What Worked

## What Failed

## Workflow Lesson

## Next Experiment
```

Pass standard:

- The postmortem compares observed response with the editorial hypothesis.
- It identifies at least one workflow lesson or states that the data is insufficient.
- It names the next experiment.

### 12. Memory Update

Purpose: turn the post into a reusable knowledge asset.

Artifact:

```text
canon-note.md
```

Optional global index:

```text
src/content/strategy/blog-memory.md
```

Required sections:

```markdown
## Canonical Idea

## Reusable Frame

## Claims Added

## Claims Updated

## Internal Link Map

## Future Branches
```

Pass standard:

- The note captures what the post added to Aaron's thinking.
- It identifies future related topics.
- It records internal link opportunities.

## Rollout Plan

### Phase 1: Manual-First Workflow

Create templates and follow the process manually for 2-3 serious posts.

Do not over-automate. The first goal is to learn which gates actually improve quality.

### Phase 2: Skill Updates

After the manual workflow stabilizes, update:

- `blog-production`
- `blog-brainstorm`
- `blog-outline`
- `blog-write`
- `aaron-video-gen`

The orchestrator should recognize the new artifacts and stop when a gate fails.

### Phase 3: Automation

Add automation only where the manual pattern is stable:

- search prior posts for memory reflection candidates;
- suggest internal links;
- generate source checklists;
- run red-team prompts;
- store postmortem predictions;
- update canonical idea index.

## Risks

### Risk: The workflow becomes too heavy.

Mitigation: apply the full workflow only to serious essays. Lightweight notes can use a shorter path.

### Risk: Internal links become forced.

Mitigation: every link must help the reader understand the argument or context. No SEO-only links.

### Risk: Reflection becomes self-referential.

Mitigation: reader pain remains the first standard. Memory reflection supports the article; it does not replace external relevance.

### Risk: Red-team review slows momentum.

Mitigation: require one focused red-team pass, not endless critique.

### Risk: Video production consumes the whole workflow.

Mitigation: video comes after the article argument is strong. Do not polish weak ideas with media.

## Open Questions

- Should `memory-reflection.md` be mandatory for every article or only serious essays?
- Should the global memory layer live in `src/content/strategy/blog-memory.md`, a Notion database, or both?
- Should internal link suggestions update older articles automatically, or remain manual until reviewed?
- What minimum performance data should trigger a postmortem: 24h only, 7d only, or both?

## Recommendation

Adopt Blog Workflow 2.0 as a manual-first editorial workflow for serious essays.

The immediate implementation should add templates and update the orchestrator's quality gates, but not attempt a large automation system yet. The highest leverage change is moving quality judgment before drafting: memory reflection, editorial brief, research dossier, and argument memo.

Once 2-3 posts have gone through the process, automate the stable parts.
