from __future__ import annotations

import argparse  # noqa: F401
import json  # noqa: F401
import os  # noqa: F401
import re
import shutil  # noqa: F401
import time  # noqa: F401
from pathlib import Path  # noqa: F401
from typing import Any
from urllib import parse

try:
    from seedance_client import (  # noqa: F401
        ArkSeedanceClient,
        DEFAULT_ARK_BASE_URL,
        DEFAULT_SEEDANCE_MODEL,
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
    DEFAULT_ARK_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"
    DEFAULT_SEEDANCE_MODEL = "doubao-seedance-2-0-260128"
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


def normalize_run_id(raw_run_id: str | None, idea: str) -> str:
    if raw_run_id is None or raw_run_id == "":
        return f"{slugify(idea)}-{time.strftime('%H%M%S')}"

    if (
        "/" in raw_run_id
        or "\\" in raw_run_id
        or Path(raw_run_id).is_absolute()
        or raw_run_id in {".", ".."}
        or slugify(raw_run_id) != raw_run_id
    ):
        raise ValueError("Invalid run-id: use a lower-case slug without path separators.")

    return raw_run_id


def redacted_image_refs(image_url: str | None, image_role: str) -> list[dict[str, Any]]:
    if not image_url:
        return []

    parsed = parse.urlparse(image_url)
    host = parsed.hostname or "local-or-unknown"
    try:
        port = parsed.port
    except ValueError:
        port = None
    ref: dict[str, Any] = {
        "type": "image_url",
        "role": image_role,
        "host": host,
        "has_query": bool(parsed.query),
    }
    if port is not None:
        ref["port"] = port
    return [
        ref
    ]


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


def build_seedance_prompt(
    prompts: dict[str, str],
    *,
    has_image_url: bool,
    has_video_prompt_override: bool,
) -> str:
    if has_image_url or has_video_prompt_override:
        return prompts["video_prompt"]

    return (
        f"Text-to-video scene: {prompts['idea']}\n\n"
        f"Visual direction: {prompts['image_prompt']}\n\n"
        f"Motion direction: {prompts['video_prompt']}"
    )


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
    run_id = normalize_run_id(args.run_id, args.idea)
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
    seedance_prompt = build_seedance_prompt(
        prompts,
        has_image_url=bool(args.image_url),
        has_video_prompt_override=args.video_prompt is not None,
    )
    payload = build_video_payload(
        seedance_prompt,
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
            "image_refs": redacted_image_refs(args.image_url, args.image_role),
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
        "image_refs": redacted_image_refs(args.image_url, args.image_role),
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


def write_error_artifact(run_dir: Path, name: str, exc: Exception) -> dict[str, Any]:
    artifact_path = run_dir / f"{name}_error.txt"
    write_text(artifact_path, f"{exc.__class__.__name__}: {exc}\n")
    return {
        "type": exc.__class__.__name__,
        "message": f"{name.replace('_', ' ')} failed; see local error artifact.",
        "artifact_path": str(artifact_path),
    }


def download_video_with_retry(
    client: Any,
    video_url: str,
    output_path: Path,
    *,
    attempts: int = 2,
) -> Path:
    last_error: Exception | None = None
    for _ in range(attempts):
        try:
            return client.download_video(video_url, output_path)
        except Exception as exc:
            last_error = exc
    if last_error is not None:
        raise last_error
    raise RuntimeError("Video download did not run.")


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
        error = write_error_artifact(run_dir, "submit", exc)
        summary.update({"status": "submit_failed", "submitted": False, "error": error})
        write_json(run_dir / "summary.json", summary)
        print(f"Seedance submit failed. Details: {error['artifact_path']}")
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
        error = write_error_artifact(run_dir, "task", exc)
        summary.update({"status": "task_failed", "submitted": True, "task_id": task_id, "error": error})
        write_json(run_dir / "summary.json", summary)
        print(f"Seedance task failed. Details: {error['artifact_path']}")
        return 1

    write_json(run_dir / "final_response.json", final_response)
    video_url = extract_video_url(final_response)
    if not video_url:
        summary.update({"status": "no_video_url", "submitted": True, "task_id": task_id})
        write_json(run_dir / "summary.json", summary)
        print(f"Task succeeded but no video_url was found. Final response: {run_dir / 'final_response.json'}")
        return 1

    try:
        output_path = download_video_with_retry(client, video_url, run_dir / "output.mp4")
    except Exception as exc:
        error = write_error_artifact(run_dir, "download", exc)
        summary.update({"status": "download_failed", "submitted": True, "task_id": task_id, "error": error})
        write_json(run_dir / "summary.json", summary)
        print(f"Video download failed. Details: {error['artifact_path']}")
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
