from __future__ import annotations

import argparse  # noqa: F401
import json  # noqa: F401
import os  # noqa: F401
import re
import shutil  # noqa: F401
import time  # noqa: F401
from pathlib import Path  # noqa: F401
from typing import Any

try:
    from seedance_client import (  # noqa: F401
        ArkSeedanceClient,
        build_video_payload,
        estimate_rmb,
        estimate_tokens,
        extract_status,
        extract_task_id,
        extract_video_url,
        poll_task,
    )
except ImportError:
    ArkSeedanceClient = None  # type: ignore[assignment]
    build_video_payload = None  # type: ignore[assignment]
    estimate_rmb = None  # type: ignore[assignment]
    estimate_tokens = None  # type: ignore[assignment]
    extract_status = None  # type: ignore[assignment]
    extract_task_id = None  # type: ignore[assignment]
    extract_video_url = None  # type: ignore[assignment]
    poll_task = None  # type: ignore[assignment]


PRESETS: dict[str, dict[str, str]] = {
    "cartoon_cinematic_worlds": {
        "label": "Cartoon Cinematic Worlds",
        "image": (
            "Create a vertical 9:16 cartoon cinematic first frame for this idea: {idea}. "
            "Use one clear original character silhouette, a cathedral-scale impossible "
            "environment, readable emotion, bold two-color palette plus one accent, soft "
            "volumetric light, and no readable text."
        ),
        "video": (
            "Slow cinematic push-in from the character toward the impossible environment. "
            "Keep the original character stable, add subtle pose motion, drifting cloud "
            "particles, soft light changes, and a clean held final frame."
        ),
    },
    "fpv_fantasy_route": {
        "label": "FPV Fantasy Route",
        "image": (
            "Create a vertical 9:16 planning frame for an FPV fantasy route: {idea}. "
            "Show a complete navigable environment with foreground, midground, destination, "
            "and clear route beats arranged through the scene."
        ),
        "video": (
            "Continuous first-person forward movement through the route, passing foreground "
            "details, crossing the midground, and arriving at the destination without hard "
            "cuts unless the reference image defines them."
        ),
    },
    "aaa_game_character_intro": {
        "label": "AAA Game Character Intro",
        "image": (
            "Create a vertical 9:16 cinematic game-trailer character reveal for this original "
            "character idea: {idea}. Emphasize a strong silhouette, dramatic lighting, clean "
            "pose, and controlled environmental effects."
        ),
        "video": (
            "Slow reveal with a restrained push-in, controlled prop or wardrobe movement, "
            "environmental sparks or mist, and a final held heroic pose."
        ),
    },
    "impossible_product_mythology": {
        "label": "Impossible Product Mythology",
        "image": (
            "Create a vertical 9:16 mythic product hero frame for this fictional object idea: "
            "{idea}. Use ritual scale, premium lighting, clean composition, tactile material "
            "detail, and no real brand marks."
        ),
        "video": (
            "Slow orbit or push-in around the object with elegant glow, particles, steam, "
            "liquid, or transformation while preserving a premium product silhouette."
        ),
    },
    "surreal_youth_anime_short": {
        "label": "Surreal Youth Anime Short",
        "image": (
            "Create a vertical 9:16 surreal youth anime first frame for this original scene: "
            "{idea}. Use a dreamlike setting, simple emotional action, soft cinematic color, "
            "and clear shot intent."
        ),
        "video": (
            "Gentle cinematic motion with wind, hair, wardrobe, lights, and background movement. "
            "Keep faces consistent and avoid complex dialogue or mouth animation."
        ),
    },
}

MODES = {"strong_first_frame", "storyboard_grid", "character_bible_plus_shot"}

SCORE_FIELDS = [
    "hook",
    "visual_impact",
    "imagination",
    "motion",
    "consistency",
    "shareability",
    "defects",
]

_STORYBOARD_GRID_SUFFIX = (
    " Build this as a 3x3 storyboard grid for GPT Image, with consistent style, consistent "
    "characters and objects, clear left-to-right order in each row, and readable progression "
    "from the first panel to the ninth panel."
)

_CHARACTER_BIBLE_SUFFIX = (
    " Add a compact character bible with front, side, and back views, palette notes, wardrobe "
    "details, silhouette anchors, and one action frame that can become the first video shot."
)


def slugify(text: str, max_length: int = 64) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    slug = re.sub(r"-+", "-", slug)
    if max_length > 0:
        slug = slug[:max_length].rstrip("-")
    return slug or "untitled"


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

    stripped_idea = idea.strip()
    preset_config = PRESETS[preset]
    image_prompt = (
        image_prompt_override
        if image_prompt_override is not None
        else preset_config["image"].format(idea=stripped_idea)
    )
    video_prompt = (
        video_prompt_override
        if video_prompt_override is not None
        else preset_config["video"].format(idea=stripped_idea)
    )

    if image_prompt_override is None and mode == "storyboard_grid":
        image_prompt = f"{image_prompt}{_STORYBOARD_GRID_SUFFIX}"
    elif image_prompt_override is None and mode == "character_bible_plus_shot":
        image_prompt = f"{image_prompt}{_CHARACTER_BIBLE_SUFFIX}"

    return {
        "idea": stripped_idea,
        "preset": preset,
        "mode": mode,
        "image_prompt": image_prompt,
        "video_prompt": video_prompt,
    }


def parse_scorecard(text: str) -> dict[str, Any]:
    scores: dict[str, int] = {}
    for field in SCORE_FIELDS:
        match = re.search(rf"^{re.escape(field)}:\s*([1-5])\s*$", text, re.MULTILINE)
        if not match:
            raise ValueError(f"Missing required 1-5 score for {field}")
        scores[field] = int(match.group(1))

    return {
        "scores": scores,
        "publish_candidate": _parse_yes_no(text, "publish_candidate"),
        "upgrade_candidate": _parse_yes_no(text, "upgrade_candidate"),
    }


def critique_template() -> str:
    score_lines = "\n".join(f"{field}: " for field in SCORE_FIELDS)
    return (
        f"{score_lines}\n"
        "keep: \n"
        "change: \n"
        "next_prompt_variation: \n"
        "publish_candidate: yes/no\n"
        "upgrade_candidate: yes/no\n"
    )


def next_variations_template(idea: str, preset: str, mode: str) -> str:
    return (
        f"Base idea: {idea}\n"
        f"Preset: {preset}\n"
        f"Mode: {mode}\n\n"
        "1. Keep the same idea and style, change only the camera path to a slower dolly.\n"
        "2. Keep the same idea and camera path, change only the color palette and lighting mood.\n"
    )


def _parse_yes_no(text: str, field: str) -> bool:
    match = re.search(rf"^{re.escape(field)}:\s*(yes|no)\s*$", text, re.IGNORECASE | re.MULTILINE)
    if not match:
        raise ValueError(f"Missing required yes/no field for {field}")
    return match.group(1).lower() == "yes"
