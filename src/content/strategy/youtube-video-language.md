# Aaron YouTube Video Language

## Purpose

Aaron's YouTube videos should be adaptations of the blog, not audio versions of the blog. A good video can start from the same thesis, but it needs its own angle, spoken rhythm, tension, visual resets, and payoff.

Default format:

```text
Personal operator story -> tension -> useful frame -> concrete examples -> consequence -> human payoff.
```

## Platform Notes

YouTube's own guidance treats the title and thumbnail as the viewer's expectation-setting surface, so the opening must quickly deliver on that promise. YouTube also recommends keeping thumbnails simple and readable, and titles accurate and succinct:

- https://support.google.com/youtube/answer/12340300

YouTube's retention report evaluates moments such as the first 30 seconds, top moments, spikes, and dips. Use this as the production model: every script should be written so a future retention graph has fewer early dips and more clear top moments:

- https://support.google.com/youtube/answer/9314415

YouTube's creator guidance says growth comes from making videos viewers want to watch and representing the content accurately:

- https://www.youtube.com/creators/resources/

## External Skill Candidates

Surveyed on 2026-06-21 from skills.sh, GitHub, and open-source skill repos. Do not install third-party skills by default. Use this list as a decision aid when the video workflow needs a stronger outside pattern.

High-confidence candidates:

- `remotion-dev/skills@remotion-best-practices` - official Remotion skill. Use when editing the Remotion renderer, adding animation/audio/caption features, or debugging render behavior.
- `heygen-com/hyperframes@hyperframes` - strong HTML-native video stack with agent-facing router skills. Treat as a future experimental path, not a replacement for the current blog slide pipeline.

Script and planning candidates:

- `cdeistopened/skill-stack@youtube-scriptwriting` - useful checkpoint model for viewer promise, shock facts, hook, story structure, rehooks, and editing audits.
- `manojbajaj95/claude-gtm-plugin@youtube-content` - useful title/thumbnail/hook planning rules, especially the rule that the opening must extend the title/thumbnail curiosity rather than repeat it.
- `manojbajaj95/claude-gtm-plugin@youtube-research` - useful for competitor research, transcript deconstruction, and content gap analysis before planning a video.
- `kostja94/marketing-skills@video-marketing` - broad video marketing reference for short-form/long-form hooks; lower priority than the YouTube-specific skills above.

Adoption rules:

- If the problem is "the video sounds like reading the blog," use the `youtube-scriptwriting` and `youtube-content` ideas to improve `video-brief.md` and `youtube-script.md`; do not change renderer.
- If the problem is motion quality, captions, timing, audio, or Remotion reliability, consult the official Remotion skill.
- If the goal is a new video format, such as overlays on existing footage, faceless explainers, or HTML-native motion graphics, consider a separate HyperFrames experiment.
- Before installing any third-party skill, inspect it with `npx skills use <owner/repo@skill>` or `npx skills add <owner/repo> --list`. Prefer project-scoped installation over global installation.

## The Adaptation Rule

Before writing `youtube-script.md`, define a video angle:

```text
This video is not "the blog in narration form." It is about <specific viewer-facing tension>, told through <specific story spine>, so the viewer leaves with <specific operating insight>.
```

The video angle should usually be narrower and punchier than the article. If the article is the full argument, the video is the best guided tour through the argument.

## Required Video Brief

Create `video-brief.md` before `youtube-script.md`.

It must include:

- **Target audience:** specific viewer and what they already believe.
- **Desired emotion:** one primary feeling the video should transfer.
- **Core promise:** the value the viewer gets.
- **Title/thumbnail expectation:** what the viewer thinks they clicked for.
- **High-shock facts or lived moments:** 5-10 bullets with score or rationale.
- **Hook type:** one of the playbook hook types, with target/transformation/stakes.
- **Story structure:** one selected structure and why.
- **Retention beat map:** timestamp/beat/image idea every 20-35 seconds.
- **Audit status:** story flow, comprehension, speed-to-value.

## Structure

Use this as the default long-form essay structure:

1. **Cold open:** start with the concrete moment, contradiction, or result. No generic intro.
2. **Promise:** tell the viewer why the next few minutes matter.
3. **Context:** give only the minimum background required to understand the tension.
4. **Model:** introduce the operating frame.
5. **Proof:** show 2-4 concrete examples or scenes.
6. **Objection:** name the risk, limitation, or common wrong takeaway.
7. **Payoff:** end with what changes for the viewer.

Do not map one blog section to one video section by default. Re-outline for video.

## Spoken Voice

Write for speech, not for reading:

- short sentences, varied rhythm;
- concrete verbs;
- fewer abstract nouns;
- use "I" when the point comes from Aaron's lived workflow;
- one idea per breath;
- paragraph breaks as pauses;
- questions only when they are real tension, not filler.

Avoid:

- "right";
- "you know";
- "what's interesting is" repeated across slides;
- "basically";
- "let's dive in";
- "in today's video";
- "as we all know";
- repeating the same sentence frame more than twice;
- turning every transition into "the real shift is..."

## Retention Devices

Use at least one device every 20-35 seconds:

- a sharp contrast: old way vs new way;
- a concrete example from Aaron's workflow;
- a small reveal: "the important part was not X, it was Y";
- an objection: "this can also go wrong";
- a visual reset tied to a new image;
- a callback to the cold open;
- a one-sentence operating rule.

Do not use fake drama. The tension should come from real stakes: time, judgment, leverage, quality, risk, or human life.

## Visual Rules

Do not inherit a blog illustration style blindly. Use it as an input, then
recommend two or three video treatments and record the selected direction in
`video-treatment.md`.

Give every scene one visual role:

- **Evidence:** source, photograph, screenshot, object, quote, or specific illustration.
- **Explanation:** comparison, process, system map, timeline, framework, or changing state.
- **Emphasis:** one number, contradiction, title, question, or payoff.

Keep one visual spine across typography, grid, color, texture, and image
treatment. Within it, mix calm evidence, structured explanation, and a small
amount of signature motion. Static images are valid when they carry real
information. There is no image quota.

Aim for a meaningful visual beat every 3-8 seconds in dense explanation and
every 8-12 seconds in calm evidence. A beat may be a focus shift, number change,
connector, comparison, crop, or new asset. Do not cut on every sentence.

Keep signature 3D, shader, camera, or pixel motion below roughly 20% of runtime
unless the format itself is an animation film. Avoid dense chart walls, generic
AI dashboards, robots, brains, clouds, and effects that exist only to signal
"AI."

## Quality Gate

Reject or revise the video script before rendering if:

- it can be read as a lightly shortened version of the blog;
- slide titles simply mirror article headings;
- the first 30 seconds do not deliver the title/thumbnail promise;
- the hook starts with meta-introduction instead of story or tension;
- it uses repeated filler phrases;
- it lacks concrete examples beyond the article summary;
- the ending merely summarizes instead of landing a payoff;
- there are no retention beats or visual resets.

## Choosing The Production Path

Use `aaron-video-gen` for hybrid editorial essays that combine narration,
evidence, images, layouts, diagrams, music, and reusable Remotion motion scenes.

Use `yt-script-writer` and `yt-video-producer` when the primary material is
cinematic generated footage, documentary scenes, character continuity, or
shot-based storytelling rather than editorial motion graphics.

Use a separate experiment for a new rendering engine. Do not migrate the main
workflow merely because one scene would be easier elsewhere.
