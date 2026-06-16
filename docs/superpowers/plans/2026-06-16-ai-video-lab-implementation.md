# AI Video Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `tiles/ai-video-lab`, a self-contained Aaron Studio skill for image-first Seedance 2.0 video experiments with run artifacts, scoring, and prompt-learning memory.

**Architecture:** Add a new tile skill with Python scripts under `tiles/ai-video-lab/scripts/`. Port the working Ark Seedance client from `/Users/aaronguo/Work/lab/apple-mlx`, then layer a lab CLI on top that creates prompt artifacts, dry-run requests, optional live submissions, critique templates, and next-variation notes. Keep large generated outputs in ignored `tiles/ai-video-lab/output/`; keep durable learning in tracked reference and brain files.

**Tech Stack:** Python 3 standard library (`argparse`, `json`, `urllib`, `unittest`), Volcengine Ark Seedance API, Aaron Studio tile skills, `scripts/sync-agent-skills.sh`.

---

## File Structure

Create and modify these files:

- Create: `tiles/ai-video-lab/SKILL.md`  
  Main agent-facing workflow instructions and routing guidance.

- Create: `tiles/ai-video-lab/references/presets.md`  
  Durable preset library for the first visual experiment families.

- Create: `tiles/ai-video-lab/references/scorecard.md`  
  Stable scoring rubric for self-improvement.

- Create: `tiles/ai-video-lab/references/seedance-workflow.md`  
  Practical workflow notes: image prompt detailed, Seedance prompt short, dry-run first.

- Create: `tiles/ai-video-lab/scripts/seedance_client.py`  
  Focused Ark API client, payload builder, token/cost estimator, task polling, URL extraction, download.

- Create: `tiles/ai-video-lab/scripts/run_lab.py`  
  CLI orchestrator for prompt artifacts, run registry, dry-run/live Seedance execution, critique templates, and optional copy to `shortsReadyDir`.

- Create: `tiles/ai-video-lab/scripts/tests/test_seedance_client.py`  
  Unit tests for payload, token estimate, response extraction, and missing key behavior.

- Create: `tiles/ai-video-lab/scripts/tests/test_run_lab.py`  
  Unit tests for dry-run artifact creation, missing key submit behavior, scorecard parsing, and secret-free summaries.

- Create: `src/brain/video-lab/lessons.md`  
  Tracked memory file for durable lessons, not generated media.

- Modify: `scripts/sync-agent-skills.sh`  
  Add `ai-video-lab:tiles/ai-video-lab` to the skill mapping list.

Do not add MP4 files or run outputs to git. `tiles/**/output/` and `*.mp4` are already ignored.

---

### Task 1: Scaffold The Tile Skill

**Files:**
- Create: `tiles/ai-video-lab/SKILL.md`
- Create: `tiles/ai-video-lab/references/presets.md`
- Create: `tiles/ai-video-lab/references/scorecard.md`
- Create: `tiles/ai-video-lab/references/seedance-workflow.md`
- Create: `src/brain/video-lab/lessons.md`
- Modify: `scripts/sync-agent-skills.sh`

- [ ] **Step 1: Initialize the skill directory**

Run:

```bash
python3 /Users/aaronguo/.codex/skills/.system/skill-creator/scripts/init_skill.py \
  ai-video-lab \
  --path tiles \
  --resources scripts,references \
  --interface display_name="AI Video Lab" \
  --interface short_description="Explore high-impact Seedance video workflows" \
  --interface default_prompt="Create a visually striking AI video experiment with a first-frame or storyboard workflow."
```

Expected: command exits `0` and creates `tiles/ai-video-lab/` with `SKILL.md`, `scripts/`, `references/`, and `agents/openai.yaml`.

- [ ] **Step 2: Replace `SKILL.md` with the production workflow**

Replace `tiles/ai-video-lab/SKILL.md` with:

````markdown
---
name: ai-video-lab
description: Use when Aaron asks for Seedance video experiments, AI video lab work, cinematic AI clips, visual impact videos, cartoon or stylized video experiments, GPT Image or Seedream first-frame to video workflows, storyboard-grid videos, or YouTube Shorts candidates made from AI-generated images.
---

# AI Video Lab

Run Aaron's exploratory AI video workflow for visually striking short clips. This skill is a creative lab, not a publishing autopilot. It creates prompt artifacts, Seedance requests, MP4 outputs when approved, critique scorecards, and next prompt variations.

## Default Strategy

Prefer image-first workflows:

```text
idea
  -> choose preset and mode
  -> write GPT Image 2 or Seedream prompt
  -> accept image_url or storyboard reference
  -> write short Seedance motion prompt
  -> dry-run request by default
  -> submit only when Aaron clearly approves cost
  -> critique result
  -> propose one-variable prompt variations
```

Use text-to-video only for quick low-cost smoke tests or when Aaron explicitly asks.

## Workflow Modes

### Strong First Frame

Use for fast experiments. Write one strong 9:16 image prompt and a short Seedance prompt. Best for one impossible scene, one character reveal, one product myth shot, or one cinematic camera move.

### Storyboard Grid

Use for higher-quality experiments. Write a 3x3, 3x4, or 4x4 storyboard image prompt, then ask Seedance to follow the grid sequence. Best for FPV routes, multi-shot cartoon clips, game trailer moments, and 12-15 second Shorts candidates.

### Character Bible Plus Shot

Use when a recurring stylized character matters. First define a front/side/back character reference, wardrobe, palette, and motion notes, then create a shot frame or storyboard grid.

## Presets

Read `references/presets.md` before creating a concept. The initial presets are:

- `cartoon_cinematic_worlds`
- `fpv_fantasy_route`
- `aaa_game_character_intro`
- `impossible_product_mythology`
- `surreal_youth_anime_short`

## Scorecard

Read `references/scorecard.md` before critiquing output. Every run gets a critique file with:

```text
hook:
visual_impact:
imagination:
motion:
consistency:
shareability:
defects:
keep:
change:
next_prompt_variation:
publish_candidate:
upgrade_candidate:
```

Use 1-5 scores. For `defects`, 5 means clean and 1 means severe artifacts.

## Commands

Dry-run a prompt package without spending money:

```bash
python3 tiles/ai-video-lab/scripts/run_lab.py \
  --idea "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds" \
  --preset cartoon_cinematic_worlds \
  --mode strong_first_frame \
  --run-id cartoon-astronaut-vending-001
```

Submit a paid Seedance job when Aaron approves:

```bash
python3 tiles/ai-video-lab/scripts/run_lab.py \
  --idea "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds" \
  --preset cartoon_cinematic_worlds \
  --mode strong_first_frame \
  --run-id cartoon-astronaut-vending-001 \
  --image-url "https://example.com/first-frame.png" \
  --submit
```

Default live settings are low-cost: 4 seconds, 480p, 9:16, no generated audio, no watermark.

## Output Contract

Each run writes:

```text
tiles/ai-video-lab/output/YYYY-MM-DD/<run-id>/
  brief.md
  concept.json
  image_prompt.md
  video_prompt.md
  request.json
  summary.json
  critique.md
  next_variations.md
```

Live submissions also write:

```text
task.json
final_response.json
output.mp4
title_candidates.md
description.md
hashtags.md
```

Generated outputs are local artifacts. Durable lessons belong in `src/brain/video-lab/lessons.md` or `references/presets.md`.

## Safety

Default to original characters, stylized people, fictional products, and non-infringing scenes. Avoid celebrity likenesses, misleading realistic impersonations, explicit sexual content, and unsafe violence. YouTube upload requires separate explicit approval.
````

- [ ] **Step 3: Create preset reference**

Write `tiles/ai-video-lab/references/presets.md`:

````markdown
# AI Video Lab Presets

Use these presets as starting points. Change one major variable per learning pass so results remain interpretable.

## cartoon_cinematic_worlds

Original stylized characters inside impossible cinematic environments.

Image prompt ingredients:
- One clear original character silhouette
- One oversized impossible environment
- Emotional pose readable at thumbnail scale
- Strong palette with two dominant colors and one accent
- No readable text unless intentionally part of the shot

Seedance motion pattern:
- One slow camera move
- Subtle character motion
- Environmental particles, light, smoke, cloth, or floating objects

Good for:
- Cartoon astronauts, tiny explorers, stylized inventors, toy-like heroes
- Cloud cities, impossible vending machines, floating libraries, giant machines

## fpv_fantasy_route

A first-person camera route through a complete scene.

Image prompt ingredients:
- A complete navigable environment
- Clear foreground, midground, and destination
- Characters or objects arranged along a path
- Optional visible route markup when preparing a planning image

Seedance motion pattern:
- Continuous forward camera movement
- Beat-by-beat route description
- No hard cuts unless the storyboard grid defines them

Good for:
- Walking through a fantasy market
- Entering a game lobby
- Moving through an impossible museum

## aaa_game_character_intro

A stylized original character reveal with cinematic game-trailer energy.

Image prompt ingredients:
- Original character only
- Strong pose and readable silhouette
- Dramatic lighting
- Environmental effects such as sparks, mist, rain, or dust
- Optional clean UI nameplate for fictional character identity

Seedance motion pattern:
- Slow reveal
- Controlled weapon, prop, or cape movement
- Final held pose with subtle push-in

Good for:
- Original game heroes
- Cartoon cyberpunk characters
- Fantasy adventurers

## impossible_product_mythology

A normal object presented like a mythic artifact or luxury hero product.

Image prompt ingredients:
- One product-like object
- Ritual setting or impossible scale
- Premium lighting
- Clean composition
- No real brand marks

Seedance motion pattern:
- Slow orbit, push-in, or rack focus
- Object glow, particles, steam, liquid, or transformation

Good for:
- Fictional soda cans, notebooks, cameras, keyboards, watches, shoes

## surreal_youth_anime_short

Stylized coming-of-age, anime, or game-like moments that lean into imagination.

Image prompt ingredients:
- Original youthful character or group
- Dreamlike setting
- Emotional but simple action
- Soft cinematic color
- Clear shot intent

Seedance motion pattern:
- Gentle motion
- Wind, hair, clothing, lights, or background movement
- Avoid complex facial dialogue in version 1
````

- [ ] **Step 4: Create scorecard reference**

Write `tiles/ai-video-lab/references/scorecard.md`:

````markdown
# AI Video Lab Scorecard

Score every output from 1 to 5.

```text
1 = failed
2 = weak
3 = usable direction
4 = strong
5 = publish-level
```

For `defects`, reverse the intuition:

```text
1 = severe artifacts
3 = visible but tolerable issues
5 = clean output
```

## Fields

- `hook`: first-second stopping power
- `visual_impact`: composition, color, scale, contrast
- `imagination`: freshness and surprise
- `motion`: camera movement and animation quality
- `consistency`: character, object, and style stability
- `shareability`: YouTube Shorts potential
- `defects`: artifact cleanliness

## Required Critique Ending

```text
keep:
change:
next_prompt_variation:
publish_candidate: yes/no
upgrade_candidate: yes/no
```

## Learning Rule

For the next run, change only one major variable:

- Camera path
- Character pose
- Environment scale
- Color palette
- Motion intensity
- Shot count
- Style family
````

- [ ] **Step 5: Create Seedance workflow reference**

Write `tiles/ai-video-lab/references/seedance-workflow.md`:

````markdown
# Seedance Workflow Notes

## Prompt Split

Use detailed image prompts and short Seedance prompts.

Image prompt owns:
- Character identity
- Scene design
- Composition
- Palette
- Lighting
- Style
- Storyboard order

Seedance prompt owns:
- Action
- Camera movement
- Duration
- Pacing
- Sequence following

## Default Low-Cost Settings

```text
duration: 4
resolution: 480p
ratio: 9:16
generate_audio: false
watermark: false
```

## Upgrade Rule

Upgrade only after a low-cost run scores at least:

```text
hook >= 4
visual_impact >= 4
motion >= 3
defects >= 3
```

Upgrade options:
- 720p
- 8 to 12 seconds
- storyboard grid instead of single frame
- stronger first frame
- generated audio only after the visual direction works

## Failure Diagnosis

If output is weak, record one primary failure:

- Image too generic
- Seedance prompt too verbose
- Camera move too complex
- Character too realistic
- Too many subjects
- Bad hands or faces
- Object deformation
- Style drift
- Motion too static
- Motion too chaotic
````

- [ ] **Step 6: Create initial durable memory file**

Run:

```bash
mkdir -p src/brain/video-lab
```

Write `src/brain/video-lab/lessons.md`:

```markdown
# AI Video Lab Lessons

This file stores durable lessons from Aaron's AI video experiments.

## Current Defaults

- Start with stylized or cartoon subjects before realistic humans.
- Use GPT Image 2 or Seedream to lock visual design before spending on video.
- Keep Seedance prompts concise: action, camera, duration, pacing.
- Run 480p / 4s tests before upgrading.
- Change one major prompt variable per learning pass.

## Winning Patterns

No winners recorded yet.

## Failure Patterns

No failures recorded yet.
```

- [ ] **Step 7: Add skill to sync mappings**

Modify `scripts/sync-agent-skills.sh` by adding this line inside `MAPPINGS`, near the top:

```bash
  "ai-video-lab:tiles/ai-video-lab"
```

Expected local diff includes only the new mapping line in that script.

- [ ] **Step 8: Validate skill frontmatter**

Run:

```bash
python3 /Users/aaronguo/.codex/skills/.system/skill-creator/scripts/quick_validate.py tiles/ai-video-lab
```

Expected:

```text
Skill is valid!
```

- [ ] **Step 9: Commit scaffold**

Run:

```bash
git add tiles/ai-video-lab/SKILL.md \
  tiles/ai-video-lab/references/presets.md \
  tiles/ai-video-lab/references/scorecard.md \
  tiles/ai-video-lab/references/seedance-workflow.md \
  tiles/ai-video-lab/agents/openai.yaml \
  src/brain/video-lab/lessons.md \
  scripts/sync-agent-skills.sh
git commit -m "feat: scaffold ai video lab skill"
```

Expected: commit succeeds and does not stage unrelated existing worktree changes.

---

### Task 2: Port And Test The Seedance Client

**Files:**
- Create: `tiles/ai-video-lab/scripts/seedance_client.py`
- Create: `tiles/ai-video-lab/scripts/tests/test_seedance_client.py`

- [ ] **Step 1: Write the failing client tests**

Create `tiles/ai-video-lab/scripts/tests/test_seedance_client.py`:

```python
from __future__ import annotations

import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from seedance_client import (  # noqa: E402
    ArkSeedanceClient,
    build_video_payload,
    estimate_rmb,
    estimate_tokens,
    extract_status,
    extract_task_id,
    extract_video_url,
)


class SeedanceClientTests(unittest.TestCase):
    def test_build_video_payload_defaults_to_low_cost_vertical_shape(self) -> None:
        payload = build_video_payload("A cinematic cartoon explorer in a cloud library.")

        self.assertEqual(payload["model"], "doubao-seedance-2-0-260128")
        self.assertEqual(payload["ratio"], "9:16")
        self.assertEqual(payload["resolution"], "480p")
        self.assertEqual(payload["duration"], 4)
        self.assertFalse(payload["generate_audio"])
        self.assertFalse(payload["watermark"])
        self.assertEqual(payload["content"][0]["type"], "text")
        self.assertIn("cloud library", payload["content"][0]["text"])

    def test_build_video_payload_adds_image_reference(self) -> None:
        payload = build_video_payload(
            "Animate the first frame with a slow push-in.",
            image_url="https://example.test/frame.png",
            image_role="first_frame",
        )

        self.assertEqual(payload["content"][1]["type"], "image_url")
        self.assertEqual(payload["content"][1]["image_url"]["url"], "https://example.test/frame.png")
        self.assertEqual(payload["content"][1]["role"], "first_frame")

    def test_build_video_payload_rejects_unsupported_duration(self) -> None:
        with self.assertRaisesRegex(ValueError, "between 4 and 15"):
            build_video_payload("too short", duration=3)

    def test_estimate_tokens_uses_seedance_two_resolution_table(self) -> None:
        self.assertEqual(estimate_tokens("480p", "9:16", 4), 40176)
        self.assertEqual(estimate_tokens("720p", "9:16", 4), 86400)
        self.assertAlmostEqual(estimate_rmb(40176), 1.848096)

    def test_extract_helpers_handle_common_response_shapes(self) -> None:
        self.assertEqual(extract_task_id({"id": "cgt-1"}), "cgt-1")
        self.assertEqual(extract_task_id({"task_id": "cgt-2"}), "cgt-2")
        self.assertEqual(extract_task_id({"data": {"id": "cgt-3"}}), "cgt-3")
        self.assertEqual(extract_status({"data": {"status": "Succeeded"}}), "succeeded")

        response = {"data": {"content": {"video_url": "https://example.test/out.mp4"}}}
        self.assertEqual(extract_video_url(response), "https://example.test/out.mp4")

    def test_live_client_requires_key_before_request(self) -> None:
        with patch.dict(os.environ, {}, clear=True):
            client = ArkSeedanceClient(api_key="")
            with self.assertRaisesRegex(RuntimeError, "ARK_API_KEY"):
                client.submit_task({"model": "x", "content": []})


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
python3 -m unittest discover -s tiles/ai-video-lab/scripts/tests -p 'test_seedance_client.py' -v
```

Expected: FAIL with `ModuleNotFoundError: No module named 'seedance_client'`.

- [ ] **Step 3: Implement the Seedance client**

Create `tiles/ai-video-lab/scripts/seedance_client.py`:

```python
from __future__ import annotations

import json
import os
import time
from pathlib import Path
from typing import Any
from urllib import error, parse, request


DEFAULT_ARK_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"
DEFAULT_SEEDANCE_MODEL = "doubao-seedance-2-0-260128"

ALLOWED_RATIOS = {"16:9", "4:3", "1:1", "3:4", "9:16", "21:9", "adaptive"}
ALLOWED_IMAGE_ROLES = {"first_frame", "last_frame", "reference_image"}
ALLOWED_RESOLUTIONS = {"480p", "720p", "1080p"}

SEEDANCE_2_PIXELS = {
    ("480p", "16:9"): (864, 496),
    ("480p", "4:3"): (752, 560),
    ("480p", "1:1"): (640, 640),
    ("480p", "3:4"): (560, 752),
    ("480p", "9:16"): (496, 864),
    ("480p", "21:9"): (992, 432),
    ("720p", "16:9"): (1280, 720),
    ("720p", "4:3"): (1112, 834),
    ("720p", "1:1"): (960, 960),
    ("720p", "3:4"): (834, 1112),
    ("720p", "9:16"): (720, 1280),
    ("720p", "21:9"): (1470, 630),
    ("1080p", "16:9"): (1920, 1080),
    ("1080p", "4:3"): (1664, 1248),
    ("1080p", "1:1"): (1440, 1440),
    ("1080p", "3:4"): (1248, 1664),
    ("1080p", "9:16"): (1080, 1920),
    ("1080p", "21:9"): (2206, 946),
}

TERMINAL_SUCCESS_STATUSES = {"succeeded", "completed"}
TERMINAL_FAILURE_STATUSES = {"failed", "cancelled", "canceled", "expired"}


def build_video_payload(
    prompt: str,
    *,
    model: str = DEFAULT_SEEDANCE_MODEL,
    ratio: str = "9:16",
    resolution: str = "480p",
    duration: int = 4,
    generate_audio: bool = False,
    watermark: bool = False,
    seed: int | None = None,
    image_url: str | None = None,
    image_role: str = "first_frame",
    return_last_frame: bool = False,
) -> dict[str, Any]:
    if duration < 4 or duration > 15:
        raise ValueError("Seedance 2.0 duration must be between 4 and 15 seconds.")
    if ratio not in ALLOWED_RATIOS:
        raise ValueError(f"Unsupported ratio: {ratio}")
    if resolution not in ALLOWED_RESOLUTIONS:
        raise ValueError(f"Unsupported resolution: {resolution}")
    if image_role not in ALLOWED_IMAGE_ROLES:
        raise ValueError(f"Unsupported image role: {image_role}")

    content: list[dict[str, Any]] = [{"type": "text", "text": prompt}]
    if image_url:
        content.append({"type": "image_url", "image_url": {"url": image_url}, "role": image_role})

    payload: dict[str, Any] = {
        "model": model,
        "content": content,
        "generate_audio": generate_audio,
        "ratio": ratio,
        "resolution": resolution,
        "duration": duration,
        "watermark": watermark,
    }
    if seed is not None:
        payload["seed"] = seed
    if return_last_frame:
        payload["return_last_frame"] = True
    return payload


def estimate_tokens(resolution: str, ratio: str, duration: int, fps: int = 24) -> int:
    try:
        width, height = SEEDANCE_2_PIXELS[(resolution, ratio)]
    except KeyError as exc:
        raise ValueError(f"No fixed token estimate for {resolution} {ratio}.") from exc
    return int(width * height * duration * fps / 1024)


def estimate_rmb(tokens: int, price_per_million: float = 46.0) -> float:
    return tokens * price_per_million / 1_000_000


def extract_task_id(response: dict[str, Any]) -> str | None:
    return _first_string_at(response, ("id",), ("task_id",), ("data", "id"), ("data", "task_id"))


def extract_status(response: dict[str, Any]) -> str | None:
    status = _first_string_at(response, ("status",), ("data", "status"))
    return status.lower() if status else None


def extract_video_url(response: dict[str, Any]) -> str | None:
    return _first_string_at(
        response,
        ("content", "video_url"),
        ("data", "content", "video_url"),
        ("result", "content", "video_url"),
        ("video_url",),
        ("result_url",),
    )


class ArkSeedanceClient:
    def __init__(
        self,
        *,
        api_key: str | None = None,
        base_url: str = DEFAULT_ARK_BASE_URL,
        timeout: float = 30.0,
    ) -> None:
        self.api_key = api_key if api_key is not None else os.environ.get("ARK_API_KEY", "")
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def submit_task(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._json_request("POST", "/contents/generations/tasks", payload)

    def get_task(self, task_id: str) -> dict[str, Any]:
        quoted_id = parse.quote(task_id, safe="")
        return self._json_request("GET", f"/contents/generations/tasks/{quoted_id}")

    def download_video(self, video_url: str, output_path: Path) -> Path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with request.urlopen(video_url, timeout=self.timeout) as response:
            output_path.write_bytes(response.read())
        return output_path

    def _json_request(self, method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        if not self.api_key:
            raise RuntimeError("ARK_API_KEY is required for live Seedance requests.")

        data = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
        req = request.Request(
            f"{self.base_url}{path}",
            data=data,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method=method,
        )
        try:
            with request.urlopen(req, timeout=self.timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Seedance HTTP {exc.code}: {body}") from exc


def poll_task(
    client: ArkSeedanceClient,
    task_id: str,
    *,
    timeout_seconds: float = 900.0,
    poll_seconds: float = 8.0,
) -> dict[str, Any]:
    deadline = time.time() + timeout_seconds
    last_response: dict[str, Any] | None = None

    while time.time() < deadline:
        last_response = client.get_task(task_id)
        status = extract_status(last_response)
        if status in TERMINAL_SUCCESS_STATUSES:
            return last_response
        if status in TERMINAL_FAILURE_STATUSES:
            raise RuntimeError(f"Seedance task {task_id} ended with status={status}: {last_response}")
        time.sleep(poll_seconds)

    raise TimeoutError(f"Timed out waiting for Seedance task {task_id}. Last response: {last_response}")


def _first_string_at(data: dict[str, Any], *paths: Any) -> str | None:
    for path in paths:
        value: Any = data
        for key in path:
            if not isinstance(value, dict) or key not in value:
                value = None
                break
            value = value[key]
        if isinstance(value, str) and value:
            return value
    return None
```

- [ ] **Step 4: Run client tests**

Run:

```bash
python3 -m unittest discover -s tiles/ai-video-lab/scripts/tests -p 'test_seedance_client.py' -v
```

Expected: all tests pass.

- [ ] **Step 5: Commit client**

Run:

```bash
git add tiles/ai-video-lab/scripts/seedance_client.py \
  tiles/ai-video-lab/scripts/tests/test_seedance_client.py
git commit -m "feat: add ai video lab seedance client"
```

Expected: commit succeeds and contains only the client and client tests.

---

### Task 3: Add Lab Prompt And Scorecard Logic

**Files:**
- Create: `tiles/ai-video-lab/scripts/run_lab.py`
- Create: `tiles/ai-video-lab/scripts/tests/test_run_lab.py`

- [ ] **Step 1: Write failing tests for prompt generation and scorecard parsing**

Create `tiles/ai-video-lab/scripts/tests/test_run_lab.py` with the first tests:

```python
from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from run_lab import build_lab_prompts, parse_scorecard, slugify  # noqa: E402


class PromptAndScorecardTests(unittest.TestCase):
    def test_slugify_creates_stable_short_slug(self) -> None:
        self.assertEqual(slugify("Cartoon Astronaut: Cloud Vending Machine!"), "cartoon-astronaut-cloud-vending-machine")

    def test_build_lab_prompts_includes_idea_and_short_video_prompt(self) -> None:
        prompts = build_lab_prompts(
            "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
            preset="cartoon_cinematic_worlds",
            mode="strong_first_frame",
        )

        self.assertIn("cathedral-sized vending machine", prompts["image_prompt"])
        self.assertIn("cartoon cinematic", prompts["image_prompt"].lower())
        self.assertIn("slow", prompts["video_prompt"].lower())
        self.assertLess(len(prompts["video_prompt"].split()), 90)

    def test_parse_scorecard_extracts_scores_and_candidates(self) -> None:
        parsed = parse_scorecard(
            """
hook: 4
visual_impact: 5
imagination: 4
motion: 3
consistency: 4
shareability: 5
defects: 3
keep: the scale contrast
change: simplify camera motion
next_prompt_variation: keep the scene but switch to a slower dolly
publish_candidate: yes
upgrade_candidate: no
"""
        )

        self.assertEqual(parsed["scores"]["hook"], 4)
        self.assertEqual(parsed["scores"]["visual_impact"], 5)
        self.assertTrue(parsed["publish_candidate"])
        self.assertFalse(parsed["upgrade_candidate"])

    def test_parse_scorecard_rejects_missing_score(self) -> None:
        with self.assertRaisesRegex(ValueError, "motion"):
            parse_scorecard(
                """
hook: 4
visual_impact: 5
imagination: 4
consistency: 4
shareability: 5
defects: 3
publish_candidate: no
upgrade_candidate: no
"""
            )


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
python3 -m unittest discover -s tiles/ai-video-lab/scripts/tests -p 'test_run_lab.py' -v
```

Expected: FAIL with `ModuleNotFoundError: No module named 'run_lab'`.

- [ ] **Step 3: Implement prompt and scorecard functions**

Create `tiles/ai-video-lab/scripts/run_lab.py` with this initial content:

```python
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import time
from pathlib import Path
from typing import Any

try:
    from seedance_client import (
        DEFAULT_ARK_BASE_URL,
        DEFAULT_SEEDANCE_MODEL,
        ArkSeedanceClient,
        build_video_payload,
        estimate_rmb,
        estimate_tokens,
        extract_task_id,
        extract_video_url,
        poll_task,
    )
except ImportError:
    from .seedance_client import (
        DEFAULT_ARK_BASE_URL,
        DEFAULT_SEEDANCE_MODEL,
        ArkSeedanceClient,
        build_video_payload,
        estimate_rmb,
        estimate_tokens,
        extract_task_id,
        extract_video_url,
        poll_task,
    )


PRESETS: dict[str, dict[str, str]] = {
    "cartoon_cinematic_worlds": {
        "label": "Cartoon Cinematic Worlds",
        "image": (
            "Create a vertical 9:16 cartoon cinematic key frame. Make an original stylized character with a clear "
            "silhouette inside an impossible, oversized environment. Emphasize thumbnail-readable scale contrast, "
            "expressive pose, rich color, cinematic lighting, and no readable text. Idea: {idea}"
        ),
        "video": (
            "Animate the provided frame as a cinematic cartoon shot. Use a slow push-in, subtle character motion, "
            "floating particles, soft light movement, and stable composition. Keep the original character and world consistent."
        ),
    },
    "fpv_fantasy_route": {
        "label": "FPV Fantasy Route",
        "image": (
            "Create a vertical 9:16 cinematic planning frame for an FPV route. Design a complete navigable fantasy scene "
            "with foreground entrance, midground encounters, and a clear destination. Arrange characters and objects along "
            "a readable camera path. Idea: {idea}"
        ),
        "video": (
            "Follow the route implied by the reference image. Move forward smoothly in first person, approach each beat in order, "
            "and keep the camera path continuous without sudden jumps."
        ),
    },
    "aaa_game_character_intro": {
        "label": "AAA Game Character Intro",
        "image": (
            "Create a vertical 9:16 original AAA game character reveal frame. Use a fictional stylized character, dramatic "
            "lighting, strong silhouette, environmental effects, and polished game-trailer composition. Avoid real brands "
            "and celebrity likenesses. Idea: {idea}"
        ),
        "video": (
            "Animate as a game character intro. Use controlled slow motion, environmental sparks or mist, a subtle push-in, "
            "and a final held hero pose. Keep motion physically coherent."
        ),
    },
    "impossible_product_mythology": {
        "label": "Impossible Product Mythology",
        "image": (
            "Create a vertical 9:16 mythic product hero frame for a fictional object. Present the object like a luxury artifact "
            "in an impossible ritual setting with premium lighting, clean composition, and no real brand marks. Idea: {idea}"
        ),
        "video": (
            "Animate as a premium product myth shot. Use a slow orbit or push-in, subtle glow, particles, and rack focus. "
            "Keep the object stable and visually clean."
        ),
    },
    "surreal_youth_anime_short": {
        "label": "Surreal Youth Anime Short",
        "image": (
            "Create a vertical 9:16 stylized anime or game-like cinematic frame. Use original youthful characters, a dreamlike "
            "setting, emotional simplicity, soft cinematic color, and a clear visual beat. Idea: {idea}"
        ),
        "video": (
            "Animate as a gentle surreal anime short. Use wind, hair, clothing, lights, and background motion. Avoid complex "
            "facial dialogue and keep the emotional beat simple."
        ),
    },
}

MODES = {"strong_first_frame", "storyboard_grid", "character_bible_plus_shot"}
SCORE_FIELDS = ["hook", "visual_impact", "imagination", "motion", "consistency", "shareability", "defects"]


def slugify(text: str, max_length: int = 64) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")
    slug = re.sub(r"-{2,}", "-", slug)
    return slug[:max_length].strip("-") or "ai-video-lab-run"


def build_lab_prompts(
    idea: str,
    *,
    preset: str,
    mode: str,
    image_prompt_override: str | None = None,
    video_prompt_override: str | None = None,
) -> dict[str, str]:
    if preset not in PRESETS:
        raise ValueError(f"Unsupported preset: {preset}")
    if mode not in MODES:
        raise ValueError(f"Unsupported mode: {mode}")

    preset_data = PRESETS[preset]
    image_prompt = image_prompt_override or preset_data["image"].format(idea=idea)
    video_prompt = video_prompt_override or preset_data["video"]

    if mode == "storyboard_grid" and image_prompt_override is None:
        image_prompt += (
            " Build this as a 3x3 storyboard grid with consistent style, clear left-to-right reading order, "
            "no panel labels, and one simple action per panel."
        )
    if mode == "character_bible_plus_shot" and image_prompt_override is None:
        image_prompt += (
            " Include a compact character bible: front view, side view, back view, palette notes, wardrobe notes, "
            "and one cinematic action frame."
        )

    return {"image_prompt": image_prompt, "video_prompt": video_prompt}


def parse_scorecard(text: str) -> dict[str, Any]:
    scores: dict[str, int] = {}
    for field in SCORE_FIELDS:
        match = re.search(rf"^{re.escape(field)}:\s*([1-5])\s*$", text, flags=re.MULTILINE | re.IGNORECASE)
        if not match:
            raise ValueError(f"Missing 1-5 score for {field}.")
        scores[field] = int(match.group(1))

    return {
        "scores": scores,
        "publish_candidate": _parse_yes_no(text, "publish_candidate"),
        "upgrade_candidate": _parse_yes_no(text, "upgrade_candidate"),
    }


def critique_template() -> str:
    return """# Critique

hook:
visual_impact:
imagination:
motion:
consistency:
shareability:
defects:

keep:
change:
next_prompt_variation:
publish_candidate: no
upgrade_candidate: no
"""


def next_variations_template(idea: str, preset: str, mode: str) -> str:
    return f"""# Next Variations

Base idea: {idea}
Preset: {preset}
Mode: {mode}

## Variation 1 - Camera Path

Keep character, environment, palette, and motion intensity. Change only the camera path.

## Variation 2 - Environment Scale

Keep character, camera path, palette, and motion intensity. Change only the scale relationship between subject and environment.
"""


def _parse_yes_no(text: str, field: str) -> bool:
    match = re.search(rf"^{re.escape(field)}:\s*(yes|no)\s*$", text, flags=re.MULTILINE | re.IGNORECASE)
    if not match:
        raise ValueError(f"Missing yes/no value for {field}.")
    return match.group(1).lower() == "yes"
```

- [ ] **Step 4: Run prompt and scorecard tests**

Run:

```bash
python3 -m unittest discover -s tiles/ai-video-lab/scripts/tests -p 'test_run_lab.py' -v
```

Expected: all tests pass.

- [ ] **Step 5: Commit prompt and scorecard logic**

Run:

```bash
git add tiles/ai-video-lab/scripts/run_lab.py \
  tiles/ai-video-lab/scripts/tests/test_run_lab.py
git commit -m "feat: add ai video lab prompt scorecard logic"
```

Expected: commit succeeds and contains only `run_lab.py` and its tests.

---

### Task 4: Add Dry-Run Artifact CLI

**Files:**
- Modify: `tiles/ai-video-lab/scripts/run_lab.py`
- Modify: `tiles/ai-video-lab/scripts/tests/test_run_lab.py`

- [ ] **Step 1: Extend tests for dry-run artifacts**

Append these tests to `PromptAndScorecardTests` in `tiles/ai-video-lab/scripts/tests/test_run_lab.py`:

```python
    def test_dry_run_writes_artifacts_and_secret_free_summary(self) -> None:
        from run_lab import main

        with tempfile.TemporaryDirectory() as tmp:
            exit_code = main(
                [
                    "--idea",
                    "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                    "--preset",
                    "cartoon_cinematic_worlds",
                    "--mode",
                    "strong_first_frame",
                    "--run-id",
                    "cartoon-astronaut-vending-001",
                    "--output-root",
                    tmp,
                ]
            )

            self.assertEqual(exit_code, 0)
            run_dir = Path(tmp) / time.strftime("%Y-%m-%d") / "cartoon-astronaut-vending-001"
            self.assertTrue((run_dir / "brief.md").exists())
            self.assertTrue((run_dir / "concept.json").exists())
            self.assertTrue((run_dir / "image_prompt.md").exists())
            self.assertTrue((run_dir / "video_prompt.md").exists())
            self.assertTrue((run_dir / "request.json").exists())
            self.assertTrue((run_dir / "summary.json").exists())
            self.assertTrue((run_dir / "critique.md").exists())
            self.assertTrue((run_dir / "next_variations.md").exists())

            summary_text = (run_dir / "summary.json").read_text(encoding="utf-8")
            self.assertNotIn("ARK_API_KEY", summary_text)
            self.assertNotIn("Authorization", summary_text)
            self.assertIn('"status": "dry_run"', summary_text)
```

Also add `import time` near the top of the test file:

```python
import time
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
python3 -m unittest discover -s tiles/ai-video-lab/scripts/tests -p 'test_run_lab.py' -v
```

Expected: FAIL with `AttributeError` or import failure for `main`.

- [ ] **Step 3: Add CLI and artifact writing to `run_lab.py`**

Append this code to `tiles/ai-video-lab/scripts/run_lab.py`:

```python

def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return run(args)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run Aaron Studio AI Video Lab Seedance experiments.")
    parser.add_argument("--idea", required=True)
    parser.add_argument("--preset", choices=sorted(PRESETS), default="cartoon_cinematic_worlds")
    parser.add_argument("--mode", choices=sorted(MODES), default="strong_first_frame")
    parser.add_argument("--run-id")
    parser.add_argument("--output-root", type=Path, default=Path("tiles/ai-video-lab/output"))
    parser.add_argument("--image-prompt")
    parser.add_argument("--video-prompt")
    parser.add_argument("--image-url")
    parser.add_argument("--image-role", default="first_frame", choices=["first_frame", "last_frame", "reference_image"])
    parser.add_argument("--ark-url", default=os.environ.get("ARK_BASE_URL", DEFAULT_ARK_BASE_URL))
    parser.add_argument("--model", default=os.environ.get("ARK_SEEDANCE_MODEL", DEFAULT_SEEDANCE_MODEL))
    parser.add_argument("--ratio", default="9:16", choices=["16:9", "4:3", "1:1", "3:4", "9:16", "21:9"])
    parser.add_argument("--resolution", default="480p", choices=["480p", "720p", "1080p"])
    parser.add_argument("--duration", type=int, default=4)
    parser.add_argument("--generate-audio", action="store_true")
    parser.add_argument("--watermark", action="store_true")
    parser.add_argument("--seed", type=int)
    parser.add_argument("--return-last-frame", action="store_true")
    parser.add_argument("--submit", action="store_true")
    parser.add_argument("--timeout-seconds", type=float, default=900.0)
    parser.add_argument("--poll-seconds", type=float, default=8.0)
    parser.add_argument("--copy-to-shorts-ready", action="store_true")
    return parser


def run(args: argparse.Namespace) -> int:
    repo_root = find_repo_root(Path.cwd())
    output_root = args.output_root if args.output_root.is_absolute() else repo_root / args.output_root
    run_id = args.run_id or f"{slugify(args.idea)}-{time.strftime('%H%M%S')}"
    run_date = time.strftime("%Y-%m-%d")
    run_dir = output_root / run_date / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    prompts = build_lab_prompts(
        args.idea,
        preset=args.preset,
        mode=args.mode,
        image_prompt_override=args.image_prompt,
        video_prompt_override=args.video_prompt,
    )
    payload = build_video_payload(
        prompts["video_prompt"],
        model=args.model,
        ratio=args.ratio,
        resolution=args.resolution,
        duration=args.duration,
        generate_audio=args.generate_audio,
        watermark=args.watermark,
        seed=args.seed,
        image_url=args.image_url,
        image_role=args.image_role,
        return_last_frame=args.return_last_frame,
    )
    tokens = estimate_tokens(args.resolution, args.ratio, args.duration)
    estimated_cost = estimate_rmb(tokens)

    write_text(run_dir / "brief.md", render_brief(args.idea, args.preset, args.mode, run_id))
    write_json(
        run_dir / "concept.json",
        {
            "run_id": run_id,
            "date": run_date,
            "idea": args.idea,
            "preset": args.preset,
            "mode": args.mode,
            "image_url": args.image_url,
        },
    )
    write_text(run_dir / "image_prompt.md", prompts["image_prompt"] + "\n")
    write_text(run_dir / "video_prompt.md", prompts["video_prompt"] + "\n")
    write_json(run_dir / "request.json", payload)
    write_text(run_dir / "critique.md", critique_template())
    write_text(run_dir / "next_variations.md", next_variations_template(args.idea, args.preset, args.mode))

    summary = {
        "run_id": run_id,
        "provider": "volcengine-ark",
        "base_url": args.ark_url,
        "model": args.model,
        "mode": args.mode,
        "preset": args.preset,
        "duration": args.duration,
        "resolution": args.resolution,
        "aspect_ratio": args.ratio,
        "generate_audio": args.generate_audio,
        "watermark": args.watermark,
        "estimated_tokens": tokens,
        "estimated_cost_rmb": round(estimated_cost, 4),
        "image_refs": [args.image_url] if args.image_url else [],
        "request_path": str(run_dir / "request.json"),
        "status": "dry_run",
        "submitted": False,
    }
    write_json(run_dir / "summary.json", summary)

    print(f"Run dir: {run_dir}")
    print(f"Request JSON: {run_dir / 'request.json'}")
    print(f"Estimated tokens: {tokens} (~RMB {estimated_cost:.2f} at RMB 46 / 1M tokens)")

    if not args.submit:
        print("Dry run only. Add --submit to create a paid Ark task.")
        return 0

    return submit_and_download(args, run_dir, payload, summary)


def render_brief(idea: str, preset: str, mode: str, run_id: str) -> str:
    return f"""# AI Video Lab Brief

Run: {run_id}
Preset: {preset}
Mode: {mode}

## Idea

{idea}

## Learning Rule

Change one major variable per follow-up run.
"""


def find_repo_root(start: Path) -> Path:
    current = start.resolve()
    for candidate in [current, *current.parents]:
        if (candidate / "config" / "aaron-studio.json").exists():
            return candidate
    return current


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def submit_and_download(
    args: argparse.Namespace,
    run_dir: Path,
    payload: dict[str, Any],
    summary: dict[str, Any],
) -> int:
    if not os.environ.get("ARK_API_KEY"):
        summary.update({"status": "missing_api_key", "submitted": False})
        write_json(run_dir / "summary.json", summary)
        print("ARK_API_KEY is required for --submit. Dry-run files were still written.")
        return 2

    client = ArkSeedanceClient(base_url=args.ark_url)
    try:
        task_response = client.submit_task(payload)
    except Exception as exc:
        summary.update({"status": "submit_failed", "submitted": False, "error": str(exc)})
        write_json(run_dir / "summary.json", summary)
        print(f"Seedance submit failed: {exc}")
        return 1

    write_json(run_dir / "task.json", task_response)
    task_id = extract_task_id(task_response)
    if not task_id:
        summary.update({"status": "no_task_id", "submitted": True})
        write_json(run_dir / "summary.json", summary)
        print(f"Could not find task id in response: {run_dir / 'task.json'}")
        return 1

    try:
        final_response = poll_task(
            client,
            task_id,
            timeout_seconds=args.timeout_seconds,
            poll_seconds=args.poll_seconds,
        )
    except Exception as exc:
        summary.update({"status": "task_failed", "submitted": True, "task_id": task_id, "error": str(exc)})
        write_json(run_dir / "summary.json", summary)
        print(f"Seedance task failed: {exc}")
        return 1

    write_json(run_dir / "final_response.json", final_response)
    video_url = extract_video_url(final_response)
    if not video_url:
        summary.update({"status": "no_video_url", "submitted": True, "task_id": task_id})
        write_json(run_dir / "summary.json", summary)
        print(f"Task succeeded but no video_url was found. Final response: {run_dir / 'final_response.json'}")
        return 1

    try:
        output_path = client.download_video(video_url, run_dir / "output.mp4")
    except Exception as exc:
        summary.update({"status": "download_failed", "submitted": True, "task_id": task_id, "error": str(exc)})
        write_json(run_dir / "summary.json", summary)
        print(f"Video download failed: {exc}")
        return 1

    summary.update(
        {
            "status": "succeeded",
            "submitted": True,
            "task_id": task_id,
            "final_response_path": str(run_dir / "final_response.json"),
            "video_path": str(output_path),
        }
    )
    if args.copy_to_shorts_ready:
        copied_path = copy_to_shorts_ready(find_repo_root(Path.cwd()), output_path, f"{summary['run_id']}.mp4")
        summary["shorts_ready_path"] = str(copied_path)
    write_json(run_dir / "summary.json", summary)
    write_publish_files(run_dir, summary["run_id"])
    print(f"Video: {output_path}")
    return 0


def copy_to_shorts_ready(repo_root: Path, output_path: Path, filename: str) -> Path:
    config_path = repo_root / "config" / "aaron-studio.json"
    config = json.loads(config_path.read_text(encoding="utf-8"))
    destination_dir = Path(config["shortsReadyDir"])
    destination_dir.mkdir(parents=True, exist_ok=True)
    destination = destination_dir / filename
    shutil.copy2(output_path, destination)
    return destination


def write_publish_files(run_dir: Path, run_id: str) -> None:
    write_text(
        run_dir / "title_candidates.md",
        f"""# Title Candidates

1. This AI video feels like a lost animated film
2. I made this with GPT Image and Seedance
3. A tiny impossible world, generated by AI
""",
    )
    write_text(
        run_dir / "description.md",
        f"""# Description

AI video experiment: {run_id}

Generated as part of Aaron's AI Video Lab using an image-first workflow and Seedance animation.
""",
    )
    write_text(
        run_dir / "hashtags.md",
        """# Hashtags

#aivideo #seedance #gptimage #generativeai #shorts
""",
    )


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 4: Run dry-run tests**

Run:

```bash
python3 -m unittest discover -s tiles/ai-video-lab/scripts/tests -p 'test_run_lab.py' -v
```

Expected: all tests pass.

- [ ] **Step 5: Commit dry-run CLI**

Run:

```bash
git add tiles/ai-video-lab/scripts/run_lab.py \
  tiles/ai-video-lab/scripts/tests/test_run_lab.py
git commit -m "feat: add ai video lab dry run artifacts"
```

Expected: commit succeeds and contains only `run_lab.py` and the dry-run test update.

---

### Task 5: Add Submit Safety Tests And Full Verification

**Files:**
- Modify: `tiles/ai-video-lab/scripts/tests/test_run_lab.py`
- Modify: `tiles/ai-video-lab/scripts/run_lab.py`

- [ ] **Step 1: Add missing-key submit test**

Add these imports near the top of `tiles/ai-video-lab/scripts/tests/test_run_lab.py`:

```python
import os
from unittest.mock import patch
```

Append this test to `PromptAndScorecardTests`:

```python
    def test_submit_without_api_key_returns_clear_error_and_keeps_request(self) -> None:
        from run_lab import main

        with tempfile.TemporaryDirectory() as tmp:
            with patch.dict(os.environ, {}, clear=True):
                exit_code = main(
                    [
                        "--idea",
                        "A mythic fictional camera floating above a glass desert",
                        "--preset",
                        "impossible_product_mythology",
                        "--mode",
                        "strong_first_frame",
                        "--run-id",
                        "missing-key-product-myth-001",
                        "--output-root",
                        tmp,
                        "--submit",
                    ]
                )

            self.assertEqual(exit_code, 2)
            run_dir = Path(tmp) / time.strftime("%Y-%m-%d") / "missing-key-product-myth-001"
            self.assertTrue((run_dir / "request.json").exists())
            summary_text = (run_dir / "summary.json").read_text(encoding="utf-8")
            self.assertIn('"status": "missing_api_key"', summary_text)
            self.assertNotIn("Authorization", summary_text)
```

- [ ] **Step 2: Run the new test**

Run:

```bash
python3 -m unittest discover -s tiles/ai-video-lab/scripts/tests -p 'test_run_lab.py' -v
```

Expected: all tests pass.

- [ ] **Step 3: Run full AI Video Lab unit suite**

Run:

```bash
python3 -m unittest discover -s tiles/ai-video-lab/scripts/tests -v
```

Expected: all tests pass.

- [ ] **Step 4: Run a real dry-run command**

Run:

```bash
python3 tiles/ai-video-lab/scripts/run_lab.py \
  --idea "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds" \
  --preset cartoon_cinematic_worlds \
  --mode strong_first_frame \
  --run-id plan-verification-cartoon-001
```

Expected:

```text
Dry run only. Add --submit to create a paid Ark task.
```

Also verify:

```bash
test -f tiles/ai-video-lab/output/$(date +%F)/plan-verification-cartoon-001/request.json
test -f tiles/ai-video-lab/output/$(date +%F)/plan-verification-cartoon-001/critique.md
```

Expected: both commands exit `0`. The output directory is ignored and should not appear as a staged git change.

- [ ] **Step 5: Sync skills**

Run:

```bash
scripts/sync-agent-skills.sh
```

Expected output includes `ai-video-lab` links for `.agents`, `.codex`, `.claude`, `.cursor`, and `.gemini`.

- [ ] **Step 6: Check git status**

Run:

```bash
git status --short tiles/ai-video-lab scripts/sync-agent-skills.sh src/brain/video-lab .agents .codex .claude .cursor .gemini
```

Expected: tracked source files are modified or added. The generated `tiles/ai-video-lab/output/` run is absent because it is ignored. Agent skill symlinks may show as new if the sync script adds them.

- [ ] **Step 7: Commit verification work**

Run:

```bash
git add tiles/ai-video-lab/scripts/tests/test_run_lab.py \
  tiles/ai-video-lab/scripts/run_lab.py \
  .agents/skills/ai-video-lab \
  .codex/skills/ai-video-lab \
  .claude/skills/ai-video-lab \
  .cursor/skills/ai-video-lab \
  .gemini/skills/ai-video-lab
git commit -m "test: verify ai video lab workflow"
```

Expected: commit succeeds. If a symlink path does not exist because the sync script skipped that surface, leave that missing path out of `git add` and record the skipped surface in the final report.

---

### Task 6: Final Review

**Files:**
- Review all files created or modified by Tasks 1-5.

- [ ] **Step 1: Run all verification commands**

Run:

```bash
python3 /Users/aaronguo/.codex/skills/.system/skill-creator/scripts/quick_validate.py tiles/ai-video-lab
python3 -m unittest discover -s tiles/ai-video-lab/scripts/tests -v
python3 tiles/ai-video-lab/scripts/run_lab.py \
  --idea "An original cartoon courier rides a paper airplane through a neon cloud city" \
  --preset cartoon_cinematic_worlds \
  --mode strong_first_frame \
  --run-id final-verification-courier-001
```

Expected:

- Skill validator prints `Skill is valid!`
- Unit tests pass
- Dry-run command writes request and summary files and exits `0`

- [ ] **Step 2: Inspect for secrets**

Run:

```bash
rg -n "ARK_API_KEY|Authorization|Bearer " tiles/ai-video-lab src/brain/video-lab
```

Expected: no matches except explanatory text in docs or tests that does not include a real key. If any real credential appears, remove it before committing.

- [ ] **Step 3: Inspect ignored output behavior**

Run:

```bash
git status --short --ignored tiles/ai-video-lab | sed -n '1,120p'
```

Expected: source files may be tracked; `tiles/ai-video-lab/output/` appears only under ignored entries.

- [ ] **Step 4: Confirm no unrelated files are staged**

Run:

```bash
git diff --cached --name-only
```

Expected: only AI Video Lab files, sync symlinks, and `scripts/sync-agent-skills.sh` appear.

- [ ] **Step 5: Commit final fixes if needed**

If Step 1-4 required file changes, stage only those files and run:

```bash
git commit -m "chore: finish ai video lab validation"
```

Expected: commit succeeds, or there is nothing new to commit.

## Self-Review

Spec coverage:

- New `ai-video-lab` skill: Task 1.
- Presets and workflow references: Task 1.
- Ported Seedance client: Task 2.
- Dry-run and live submit path: Tasks 4 and 5.
- Run registry and artifact contract: Task 4.
- Scorecard and self-improvement loop: Tasks 1 and 3.
- Missing key safety: Tasks 2 and 5.
- Secret-free summaries: Tasks 4, 5, and 6.
- Skill sync: Tasks 1 and 5.

Type consistency:

- `preset` values match `PRESETS` keys and `SKILL.md` names.
- `mode` values match `MODES` and the command examples.
- `summary.json` keys match the approved design: `run_id`, `mode`, `preset`, `model`, `duration`, `resolution`, `aspect_ratio`, `generate_audio`, `watermark`, `estimated_tokens`, `estimated_cost_rmb`, `image_refs`, `status`.

Execution note:

- Live API execution remains opt-in through `--submit`.
- The plan intentionally keeps image generation manual in version 1 and accepts `--image-url`.
- YouTube upload is not included.
