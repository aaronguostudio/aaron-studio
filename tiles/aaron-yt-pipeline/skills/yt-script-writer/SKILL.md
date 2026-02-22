---
name: yt-script-writer
description: Write an AI video script with scene-by-scene prompts for AI video generation models. Takes an approved idea and produces a structured video-script.md with video prompts, motion descriptions, narration, and text overlays. Use when user asks to "write video script", "create video script", "script a YouTube video", "generate video prompts", or "write scenes".
---

# YouTube Script Writer

Write a complete video script with scene-by-scene AI video generation prompts, narration, and production notes.

## Output

| File | Path | Purpose |
|------|------|---------|
| Video script | `src/videos/YYYY-MM-DD-{slug}/video-script.md` | Scene-by-scene script with AI video prompts and narration |

## Workflow

### Step 1: Load Idea and Preferences

**Find the video project directory.** If the user specifies a path, use it. Otherwise, look for the most recent `src/videos/*/ideas.md` file.

Read the approved idea from `ideas.md` for context: title, hook, angle, target length, style, and research references.

Check for preferences:

```bash
test -f .aaron-skills/aaron-yt-pipeline/EXTEND.md && echo "project"
test -f "$HOME/.aaron-skills/aaron-yt-pipeline/EXTEND.md" && echo "user"
```

Read preferences for: resolution, aspect_ratio, default_style, voice, language.

### Step 2: Research Deep Dive

Use `WebSearch` and `WebFetch` to gather **3-5 reference sources** on the selected topic. Focus on:
- Specific facts, data points, and examples to make the script concrete
- Existing video structures that work well for this topic
- Visual reference concepts that would translate well to AI video generation
- Quotes or statistics that add authority

### Step 3: Plan the Scene Structure

Before writing, plan the overall structure based on the video style:

**Tutorial/How-to structure:**
1. Hook (5-8s) — show the end result
2. Problem (10-15s) — why this matters
3. Steps (bulk of video) — 3-5 key steps with demos
4. Recap (10-15s) — summary of key points
5. CTA (5-8s) — subscribe/like

**Explainer/Essay structure:**
1. Hook (5-8s) — provocative question or surprising fact
2. Context (15-20s) — set the stage
3. Core argument (bulk) — 3-4 supporting points with evidence
4. Counterpoint (15-20s) — address the obvious objection
5. Conclusion (10-15s) — restate thesis with impact
6. CTA (5-8s)

**News/Trends recap structure:**
1. Hook (5-8s) — biggest headline
2. Story 1 (30-60s) — most important development
3. Story 2 (30-60s) — second story
4. Story 3 (30-60s) — third story
5. What it means (15-20s) — synthesis
6. CTA (5-8s)

**Story/Documentary structure:**
1. Cold open (10-15s) — dramatic moment from the middle
2. Beginning (30-60s) — how it started
3. Rising action (bulk) — key events and turning points
4. Climax (15-20s) — the pivotal moment
5. Resolution (15-20s) — where things stand now
6. CTA (5-8s)

### Step 4: Write the Video Script

Write the complete script in this format:

```markdown
# Video Script: [Title]

**Length:** [X-Y minutes]  |  **Style:** [style]  |  **Aspect ratio:** [16:9]

---

## [SCENE 01: Scene Title — Xs]

**Video prompt:** [Detailed description for the AI video generation model. Include:
- Subject/action (what is happening)
- Setting/environment (where)
- Camera angle and movement (how it's shot)
- Lighting and mood (atmosphere)
- Visual style (cinematic, animated, flat illustration, etc.)
Be specific — "a developer typing on a MacBook in a sunlit home office, camera slowly orbits the desk, warm morning light through blinds, shallow depth of field" is much better than "someone working on a computer"]

**Motion:** [Camera movement: static, slow push-in, orbit, pan left, tracking shot, zoom out, etc.]

**Text overlay:** [Optional — any text to burn into the video: titles, labels, stats]

**Narration:**
[The spoken narration for this scene. Write in a natural, conversational voice.
This will be converted to speech via TTS.]

---
```

**Video prompt writing guidelines:**
- Be very specific about visual content — AI models need detailed descriptions
- Include camera movement in the prompt (not just in the Motion field)
- Describe the lighting, color palette, and mood
- Specify the visual style: photorealistic, cinematic, animated, flat design, etc.
- Keep prompts under 500 characters for best results with most models
- Avoid text in the video prompt (AI models struggle with text) — use Text overlay instead
- Each scene should be 5-10 seconds (model limits)
- For longer scenes, split into multiple sub-scenes

**Narration writing guidelines:**
- Write conversationally — this will be spoken aloud
- Short sentences. Vary rhythm.
- Use "I" voice if it's a personal take
- Match narration length to scene duration (~150 words per minute)
- Scene with 8s duration = ~20 words of narration
- Include natural pauses as paragraph breaks

**Production Notes section** at the end:

```markdown
## Production Notes

- **Music:** [Mood/genre recommendation for background music]
- **Color grade:** [Overall color direction]
- **Pacing:** [Quick cuts vs. longer holds]
- **Thumbnail concept:** [Description of thumbnail image to generate]
- **Title options:**
  1. [YouTube title option 1 — max 60 chars, click-worthy]
  2. [YouTube title option 2]
  3. [YouTube title option 3]
- **Description draft:**
  [2-3 sentence YouTube description with relevant keywords]
- **Tags:** [comma-separated relevant tags]
```

### Step 5: Present Script for Approval

Display the full script with a summary:

```
Script Summary:
- Title: "[Video Title]"
- Scenes: [N]
- Total narration: ~[X] words (~[Y] minutes)
- Video clips needed: [N] (at [duration] each)
- Estimated generation cost: ~$[X] (based on [provider] pricing)
```

Use `AskUserQuestion`:

| Q | Question | Options |
|---|----------|---------|
| Q1 | How does the script look? | Approve — ready for video generation, Needs revisions — I'll describe changes |

If the user requests revisions, iterate until approved.

### Step 6: Save Approved Script

Write the script to `src/videos/YYYY-MM-DD-{slug}/video-script.md`.

**After saving, print:**

```
Script Complete!

Title: "[Video Title]"
Scenes: [N]
Estimated length: [X] minutes
Saved: src/videos/YYYY-MM-DD-{slug}/video-script.md

Next: Run /yt-video-producer to generate AI video clips and assemble the final video.
```

## Notes

- This skill writes the VIDEO SCRIPT only. It does NOT generate video clips or audio.
- Scene durations should be 5-10 seconds each (matching AI video model capabilities).
- For a 5-minute video, expect 30-40 scenes at ~8s each.
- The video-script.md format is different from youtube-script.md (which is for static slide-based videos).
- If writing for a specific AI model (configured in EXTEND.md), tailor prompt style to that model's strengths.
- Narration should be complete sentences — TTS cannot interpret bullet points or shorthand well.
- When referencing specific products, tools, or brands, be accurate in the narration but use generic visuals in the video prompt to avoid copyright issues.
