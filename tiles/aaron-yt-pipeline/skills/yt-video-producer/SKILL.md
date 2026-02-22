---
name: yt-video-producer
description: Generate AI video clips for each scene, add TTS narration, assemble the final video with transitions and music. Supports Kling and Google Veo models. Use when user asks to "produce video", "generate video clips", "make the video", "assemble video", "create AI video", or "generate scenes".
---

# YouTube Video Producer

Generate AI video clips for each scene in a video script, add TTS narration, and assemble everything into a final MP4.

## Output

| File | Path | Purpose |
|------|------|---------|
| Scene clips | `src/videos/YYYY-MM-DD-{slug}/scenes/scene-XX.mp4` | Individual AI-generated video clips |
| Narration | `src/videos/YYYY-MM-DD-{slug}/narration/narration-XX.mp3` | Per-scene TTS audio |
| Final video | `src/videos/YYYY-MM-DD-{slug}/final.mp4` | Assembled video with narration |
| Metadata | `src/videos/YYYY-MM-DD-{slug}/metadata.yaml` | YouTube title, description, tags |

## Prerequisites

- **FFmpeg** must be installed (`brew install ffmpeg`)
- **edge-tts** for free TTS (`pip install edge-tts`), OR **OPENAI_API_KEY** for premium TTS
- **KLING_API_KEY** for Kling video generation, OR **GOOGLE_PROJECT_ID** + gcloud auth for Google Veo
- Scripts are at `${SKILL_DIR}/../../scripts/`

## Workflow

### Step 1: Load Script and Preferences

**Find the video project directory.** If the user specifies a path, use it. Otherwise, look for the most recent `src/videos/*/video-script.md` file.

Read the video script from `video-script.md`. Parse and display a summary:
- Title, scene count, estimated length
- Total narration word count

Check for preferences:

```bash
test -f .aaron-skills/aaron-yt-pipeline/EXTEND.md && echo "project"
test -f "$HOME/.aaron-skills/aaron-yt-pipeline/EXTEND.md" && echo "user"
```

Read preferences for: video_provider, video_model, variations_per_scene, tts_provider, voice, resolution, fps.

### Step 2: Confirm Generation Plan

Before generating (which costs money), present the plan:

```
Video Generation Plan:
- Provider: Kling (kling-v2.6-pro)
- Scenes: 12
- Duration per scene: 5-8s
- Variations per scene: 2
- Total clips to generate: 24
- Estimated cost: ~$6.72 (24 clips x $0.28)
- Estimated generation time: ~30-60 minutes
```

Use `AskUserQuestion`:

| Q | Question | Options |
|---|----------|---------|
| Q1 | Ready to start generating? | Start generation, Adjust settings first, Cancel |

If "Adjust settings", ask about provider, variations count, or specific scenes to skip.

### Step 3: Generate AI Video Clips

For each scene in the script, generate video clips:

```bash
npx -y bun ${SKILL_DIR}/../../scripts/video-gen-api.ts \
  --provider kling \
  --prompt "[video prompt from script]" \
  --duration [scene duration] \
  --aspect-ratio 16:9 \
  --output src/videos/YYYY-MM-DD-{slug}/scenes/scene-01-v1.mp4
```

**Generate variations** (default 2 per scene based on `variations_per_scene` preference):
- `scene-01-v1.mp4`, `scene-01-v2.mp4`
- Use slightly different prompt variations (add "alternative angle" or adjust camera direction)

**Progress reporting:** After each scene completes, report:
```
Scene 3/12: "The Solution" — 2 variations generated (45s total wait)
```

**Error handling:** If a generation fails:
- Retry once with the same prompt
- If still fails, report the error and continue to the next scene
- At the end, list any failed scenes for the user to decide

### Step 4: Scene Selection (Approval Gate)

After all scenes are generated, present the results.

For each scene with multiple variations, ask the user to choose:

Use `AskUserQuestion` (batch scenes in groups of 4 to avoid too many questions):

| Q | Question | Options |
|---|----------|---------|
| Q1 | Scene 1 "[title]" — which variation? | Variation 1, Variation 2, Regenerate with different prompt |
| Q2 | Scene 2 "[title]" — which variation? | Variation 1, Variation 2, Regenerate with different prompt |

If only 1 variation was generated (or user requested single), skip selection for that scene.

**Rename selected clips:** Copy the chosen variations to `scene-01.mp4`, `scene-02.mp4`, etc. (without the `-v1`/`-v2` suffix) so the assemble step picks them up cleanly.

### Step 5: Generate TTS Narration

```bash
npx -y bun ${SKILL_DIR}/../../scripts/post-production.ts tts \
  --script src/videos/YYYY-MM-DD-{slug}/video-script.md \
  --tts edge-tts \
  --voice en-US-AndrewMultilingualNeural \
  --output-dir src/videos/YYYY-MM-DD-{slug}/narration/
```

Report: total narration duration, per-scene breakdown.

### Step 6: Assemble Final Video

```bash
npx -y bun ${SKILL_DIR}/../../scripts/post-production.ts assemble \
  --scenes-dir src/videos/YYYY-MM-DD-{slug}/scenes/ \
  --narration-dir src/videos/YYYY-MM-DD-{slug}/narration/ \
  --script src/videos/YYYY-MM-DD-{slug}/video-script.md \
  --output src/videos/YYYY-MM-DD-{slug}/final.mp4 \
  --resolution 1920x1080 \
  --fps 30
```

Optionally add music:
```bash
  --music src/videos/YYYY-MM-DD-{slug}/assets/bg-music.mp3 \
  --music-volume 0.08
```

### Step 7: Final Review (Approval Gate)

Report the result:

```
Video Production Complete!

File: src/videos/YYYY-MM-DD-{slug}/final.mp4
Duration: 6:32
Size: 148 MB
Resolution: 1920x1080
Scenes: 12
Provider: Kling (kling-v2.6-pro)
```

Use `AskUserQuestion`:

| Q | Question | Options |
|---|----------|---------|
| Q1 | How does the final video look? | Approve — ready for publishing, Re-generate specific scenes, Re-assemble with different settings |

If re-generation is needed, go back to Step 3 for the specific scenes.

### Step 8: Generate Metadata

Create `src/videos/YYYY-MM-DD-{slug}/metadata.yaml`:

```yaml
title: "YouTube Title — max 60 chars, click-worthy"
description: |
  [First 2-3 sentences — this appears in search results]

  Timestamps:
  0:00 - Introduction
  0:15 - [Scene 2 title]
  0:30 - [Scene 3 title]
  ...

  [2-3 sentences about the channel / what you do]

  #hashtag1 #hashtag2 #hashtag3
tags:
  - tag1
  - tag2
  - tag3
category: "28"  # Science & Technology
language: en
privacy: unlisted
```

Pull title options and description draft from the Production Notes section of the video script if available.

### Step 9: Generate Thumbnail

Use the `/baoyu-image-gen` skill to generate a thumbnail:
- Reference the thumbnail concept from Production Notes
- Generate at 1280x720 (YouTube thumbnail size)
- Save to `src/videos/YYYY-MM-DD-{slug}/assets/thumbnail.png`

**Print final summary:**

```
Video Production Complete!

File: src/videos/YYYY-MM-DD-{slug}/final.mp4
Duration: 6:32
Thumbnail: src/videos/YYYY-MM-DD-{slug}/assets/thumbnail.png
Metadata: src/videos/YYYY-MM-DD-{slug}/metadata.yaml

Next: Run /yt-publish to upload to YouTube.
```

## Notes

- Scene clips are generated asynchronously — each takes 2-5 minutes depending on the provider.
- The assemble step uses the `scenes/` directory with files named `scene-01.mp4`, `scene-02.mp4`, etc.
- Variation files (`scene-01-v1.mp4`, `scene-01-v2.mp4`) are kept for reference but only selected clips are used.
- If the user wants to replace a scene with a manually created clip, they can place it in `scenes/` with the correct name.
- Background music is optional. If no music file is provided, the video will have narration only.
- For very long videos (15+ min), consider generating scenes in batches to manage API costs.
- The metadata.yaml is used by the `/yt-publish` skill for upload.
