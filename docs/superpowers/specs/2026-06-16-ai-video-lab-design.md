# AI Video Lab Design

## Purpose

Create an Aaron Studio skill for exploratory AI video generation using an image-first workflow with Seedance 2.0. The first release is not a full Content Lab product. It is a repeatable creative lab for making visually striking, imaginative short videos that can be published to Aaron's AI video YouTube channel.

The skill should help Aaron do three things well:

1. Generate high-impact video experiments quickly.
2. Preserve enough metadata to understand why a result worked or failed.
3. Improve over time by turning critique into reusable prompt and style knowledge.

## Context

The starting point is the working PoC in `/Users/aaronguo/Work/lab/apple-mlx`, which proved that the Ark China endpoint can submit Seedance 2.0 jobs, poll asynchronously, download MP4 output, and estimate cost. The successful smoke test used `doubao-seedance-2-0-260128`, 4 seconds, 480p, 9:16, no audio, no watermark, and cost about 1.85 RMB.

The creative pattern to adopt is:

```text
GPT Image 2 or Seedream defines the visual world
  -> Seedance 2.0 animates that world
  -> Aaron critiques the result
  -> the next prompt variation is generated from the critique
```

External workflow references repeatedly point to the same division of labor: image generation locks the subject, composition, and style; Seedance should receive shorter prompts focused on action, camera movement, duration, and pacing.

## Scope

Version 1 should support exploratory batches for visually arresting short clips:

- Cartoon cinematic worlds
- FPV fantasy route videos
- AAA game character intros
- Impossible product mythology
- Surreal youth, anime, or stylized short films

Version 1 should not attempt:

- Fully automated YouTube upload
- A public gallery UI
- Long-form films
- Voiceover, captions, or complex audio mixing
- Automated model comparison across every video provider
- A production-grade SaaS module

## Skill Shape

Create a new tile skill:

```text
tiles/ai-video-lab/
  SKILL.md
  references/
    presets.md
    scorecard.md
    seedance-workflow.md
  scripts/
    seedance_client.py
    run_lab.py
```

The skill triggers when Aaron asks for Seedance video experiments, AI video lab work, cinematic AI clips, visual impact videos, cartoon/video experiments, or YouTube Shorts made from GPT Image or Seedream frames.

The skill should be an orchestrator, not just a thin API wrapper. It should choose a workflow mode, create or accept visual references, run Seedance, save a complete run record, ask for or infer critique, and propose the next variation.

## Workflow Modes

### 1. Strong First Frame

Use this for the fastest exploration. Generate or accept one strong 9:16 image, then animate it with a concise Seedance prompt.

Use cases:

- One impossible space
- One stylized character pose
- One product myth shot
- One cinematic reveal

Default settings:

- 4 seconds
- 480p for exploration
- 9:16
- `generate_audio=false`
- `watermark=false`

### 2. Storyboard Grid

Use this as the main quality workflow once the idea deserves more structure. Generate a 3x3, 3x4, or 4x4 storyboard grid, then ask Seedance to follow the sequence.

Use cases:

- FPV route through a complete scene
- Multi-shot cartoon sequence
- Luxury product mini-ad
- Game trailer montage
- A 12 to 15 second YouTube Short candidate

The image prompt should be detailed and specific. The video prompt should be short and focused on sequence following, camera behavior, and pacing.

### 3. Character Bible Plus Shot

Use this when a recurring stylized or cartoon character matters. First create a small visual bible, then use it as an anchor for scenes.

Artifacts:

- Character front/side/back reference
- Wardrobe and color notes
- Personality and movement notes
- One or more shot frames or storyboard grids

This mode is preferred over realistic human continuity for early experiments, because stylized characters are more forgiving and can become a recognizable visual brand.

## Initial Presets

### Cartoon Cinematic Worlds

Original stylized characters inside impossible cinematic environments. Prioritize character silhouette, clear emotional pose, and a scene that feels larger than the character.

### FPV Fantasy Route

One complete scene map with visible path logic. GPT Image or manual markup defines where the camera enters, who it approaches, and what changes at each beat.

### AAA Game Character Intro

A character reveal with stylized UI, cinematic lighting, controlled slow motion, sparks, smoke, or environmental effects. Works well for original characters rather than real people.

### Impossible Product Mythology

A normal object presented like a mythic artifact or luxury brand hero. Useful for highly shareable, surreal product-style videos.

### Surreal Youth / Anime Short

Stylized coming-of-age, anime, or game-like short clips that lean into AI imagination rather than photorealism.

## Artifact Contract

Each experiment batch gets a run directory under an ignored output path:

```text
tiles/ai-video-lab/output/YYYY-MM-DD/<run-id>/
  brief.md
  concept.json
  image_prompt.md
  video_prompt.md
  request.json
  task.json
  final_response.json
  summary.json
  output.mp4
  critique.md
  next_variations.md
```

When a result becomes useful beyond the current batch, the skill should distill the lesson into a tracked library file:

```text
tiles/ai-video-lab/references/presets.md
src/brain/video-lab/lessons.md
```

The output directory can hold large and messy local artifacts. The library and brain files should contain only durable knowledge: prompt patterns, failure modes, visual taste, and winning recipes.

## Run Registry

Every `summary.json` should include:

```json
{
  "run_id": "2026-06-16-cartoon-city-001",
  "mode": "storyboard_grid",
  "preset": "cartoon_cinematic_worlds",
  "model": "doubao-seedance-2-0-260128",
  "duration": 4,
  "resolution": "480p",
  "aspect_ratio": "9:16",
  "generate_audio": false,
  "watermark": false,
  "estimated_tokens": 40176,
  "estimated_cost_rmb": 1.85,
  "image_refs": [],
  "video_path": "tiles/ai-video-lab/output/...",
  "status": "succeeded"
}
```

The registry should never include API keys, signed URLs that should remain private, or secrets from environment files.

## Scorecard

Each critique uses a stable 1 to 5 scorecard:

```text
hook: first-second stopping power
visual_impact: composition, color, scale, contrast
imagination: freshness and surprise
motion: camera movement and animation quality
consistency: character, object, and style stability
shareability: YouTube Shorts potential
defects: hands, faces, object warping, text artifacts, camera jumps
```

The critique must end with:

```text
keep:
change:
next_prompt_variation:
publish_candidate: yes/no
upgrade_candidate: yes/no
```

This turns subjective taste into reusable training signal for future prompts.

## Self-Improvement Loop

The lab should run in batches, not isolated one-offs:

```text
Generate 3 concepts
  -> make 1 image or storyboard per concept
  -> run low-cost Seedance tests
  -> critique each output
  -> pick 1 winner
  -> generate 2 variations from the winner
  -> optionally upgrade the best result to 720p or longer duration
  -> distill lessons into the lab memory
```

Prompt mutation should change only one major variable at a time:

- Camera path
- Character pose
- Environment scale
- Color palette
- Motion intensity
- Shot count
- Style family

The skill should explicitly avoid changing multiple variables at once during learning passes, because that makes the result hard to interpret.

## Data Flow

```text
User idea
  -> choose preset and workflow mode
  -> create concept brief
  -> create or accept visual reference
  -> build Seedance request
  -> dry-run by default unless Aaron asks to submit
  -> submit task
  -> poll until terminal status
  -> download MP4
  -> write registry files
  -> critique
  -> propose next variations
  -> copy publish candidates to shorts-ready when approved
```

The skill should use `config/aaron-studio.json` for repo paths and destinations. It should use `shortsReadyDir` when copying finished candidates for YouTube or manual review.

## Error Handling

Missing API key:

- Do not submit.
- Write the dry-run payload.
- Tell Aaron to set a rotated `ARK_API_KEY`.

Task failure:

- Save the full task response.
- Mark the run as failed in `summary.json`.
- Extract the provider error when present.
- Suggest one smaller retry.

No video URL:

- Save `final_response.json`.
- Mark the run as `no_video_url`.
- Do not pretend the job succeeded.

Download failure:

- Preserve the URL in the local response file when safe.
- Retry once.
- Leave a clear note in `summary.json`.

Low quality output:

- Do not delete it.
- Critique it.
- Generate a focused next variation.

## Safety And Publishing

The first version should default to original characters, stylized people, fictional products, or non-infringing scenes. Avoid celebrity likenesses, misleading realistic impersonations, explicit sexual content, or unsafe violence. YouTube upload remains a separate approval step.

For publish candidates, the skill should prepare:

```text
title_candidates.md
description.md
hashtags.md
```

The skill may copy an approved MP4 to `shortsReadyDir`, but it should not upload automatically.

## Testing

Implementation should include tests for:

- Dry-run payload generation
- Missing key behavior
- Cost estimate for known settings
- Summary JSON shape
- Critique scorecard parsing
- Output path creation
- No secret leakage in saved files

Live API tests should remain opt-in behind an explicit `--submit` flag and should use low-cost settings by default.

## Implementation Decisions

The first implementation should make these concrete choices:

- Port the existing `apple-mlx` Seedance client into `tiles/ai-video-lab/scripts/seedance_client.py` so the skill is self-contained inside Aaron Studio.
- Treat image generation as manual or prompt-artifact based in version 1. The skill writes strong GPT Image 2 or Seedream prompts, accepts `--image-url`, and does not require an image API integration yet.
- Keep generated runs under `tiles/ai-video-lab/output/` for version 1, because `tiles/**/output/` is already ignored by the repo. Add `videoLabRoot` to `config/aaron-studio.json` only if the lab later needs a shared content registry outside the tile.

The recommended first implementation is conservative: create the skill, port the Seedance client into the tile, support manual `--image-url`, support dry-run and submit, and make the self-improvement scorecard mandatory after each batch.
