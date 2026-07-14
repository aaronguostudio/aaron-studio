#!/usr/bin/env python3
"""Generate and QA a strict first/last-frame Seedance cinematic loop.

The command is dry-run by default. Pass --submit only after the anchor image
and prompt have passed visual review. Local image paths are sent to Ark as data
URLs, so no public image host is needed.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import mimetypes
import os
import ssl
import subprocess
import sys
import time
from pathlib import Path
from typing import Any
from urllib import error, parse, request


DEFAULT_ARK_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"
DEFAULT_MODEL = "doubao-seedance-2-0-260128"
SUCCESS = {"succeeded", "completed"}
FAILURE = {"failed", "cancelled", "canceled", "expired"}

PIXELS = {
    ("480p", "16:9"): (864, 496),
    ("720p", "16:9"): (1280, 720),
    ("1080p", "16:9"): (1920, 1080),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--run-id", required=True, help="Stable output folder name.")
    parser.add_argument("--prompt", required=True, help="Original Seedance prompt, preferably Chinese.")
    parser.add_argument("--first-frame", help="Local path, https URL, or data URL.")
    parser.add_argument("--last-frame", help="Defaults to --first-frame for a strict loop.")
    parser.add_argument("--bootstrap-anchor", action="store_true", help="Create a short text-to-video world study and extract anchor.png. Run the strict loop as a second command.")
    parser.add_argument("--anchor-second", type=float, default=0.5, help="Frame timestamp to extract from a bootstrap study.")
    parser.add_argument("--output-dir", help="Defaults to src/content/music-visualizer/<run-id>/seedance.")
    parser.add_argument("--model", default=os.environ.get("ARK_SEEDANCE_MODEL", DEFAULT_MODEL))
    parser.add_argument("--base-url", default=os.environ.get("ARK_BASE_URL", DEFAULT_ARK_BASE_URL))
    parser.add_argument("--duration", type=int, default=15, choices=range(4, 16))
    parser.add_argument("--resolution", default="720p", choices=("480p", "720p", "1080p"))
    parser.add_argument("--ratio", default="16:9", choices=("16:9",))
    parser.add_argument("--seed", type=int, help="Optional deterministic generation seed.")
    parser.add_argument("--submit", action="store_true", help="Create a paid Ark task. Otherwise only write the request record.")
    parser.add_argument("--poll-seconds", type=float, default=8.0)
    parser.add_argument("--timeout-seconds", type=float, default=900.0)
    return parser.parse_args()


def local_or_remote_image(source: str) -> tuple[str, dict[str, str]]:
    if source.startswith(("https://", "http://", "data:")):
        return source, {"source": source, "kind": "remote-or-data"}

    path = Path(source).expanduser().resolve()
    if not path.is_file():
        raise FileNotFoundError(f"Anchor image does not exist: {path}")
    mime = mimetypes.guess_type(path.name)[0] or "image/png"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    return f"data:{mime};base64,{encoded}", {
        "source": str(path),
        "kind": "local-file",
        "mime": mime,
        "sha256": digest,
    }


def build_payload(args: argparse.Namespace) -> tuple[dict[str, Any], list[dict[str, str]]]:
    if not args.first_frame:
        raise ValueError("--first-frame is required unless --bootstrap-anchor is used.")
    first_source, first_record = local_or_remote_image(args.first_frame)
    last_source, last_record = local_or_remote_image(args.last_frame or args.first_frame)
    payload: dict[str, Any] = {
        "model": args.model,
        "content": [
            {"type": "text", "text": args.prompt},
            {"type": "image_url", "image_url": {"url": first_source}, "role": "first_frame"},
            {"type": "image_url", "image_url": {"url": last_source}, "role": "last_frame"},
        ],
        "generate_audio": False,
        "ratio": args.ratio,
        "resolution": args.resolution,
        "duration": args.duration,
        "watermark": False,
        "return_last_frame": True,
    }
    if args.seed is not None:
        payload["seed"] = args.seed
    return payload, [first_record, last_record]


def build_bootstrap_payload(args: argparse.Namespace) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "model": args.model,
        "content": [{"type": "text", "text": args.prompt}],
        "generate_audio": False,
        "ratio": args.ratio,
        "resolution": args.resolution,
        "duration": args.duration,
        "watermark": False,
    }
    if args.seed is not None:
        payload["seed"] = args.seed
    return payload


def request_record(payload: dict[str, Any], image_records: list[dict[str, str]]) -> dict[str, Any]:
    record = {key: value for key, value in payload.items() if key != "content"}
    record["content"] = [payload["content"][0], {"type": "image_url", "role": "first_frame", "input": image_records[0]}, {"type": "image_url", "role": "last_frame", "input": image_records[1]}]
    return record


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def estimate_tokens(resolution: str, ratio: str, duration: int) -> int:
    width, height = PIXELS[(resolution, ratio)]
    return int(width * height * duration * 24 / 1024)


def dotenv_value(name: str) -> str:
    """Read one simple key from the workspace .env without sourcing shell code."""
    dotenv = Path.cwd() / ".env"
    if not dotenv.is_file():
        return ""
    prefix = f"{name}="
    for raw_line in dotenv.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if line.startswith(prefix):
            return line[len(prefix):].strip().strip("\"'")
    return ""


class ArkClient:
    def __init__(self, base_url: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = os.environ.get("ARK_API_KEY", "") or dotenv_value("ARK_API_KEY")
        self.ssl_context = self._ssl_context()

    @staticmethod
    def _ssl_context() -> ssl.SSLContext:
        """Use a verified CA bundle on macOS installations lacking Python defaults."""
        candidates = [
            os.environ.get("SSL_CERT_FILE", ""),
            "/etc/ssl/cert.pem",
            "/opt/homebrew/etc/ca-certificates/cert.pem",
        ]
        for candidate in candidates:
            if candidate and Path(candidate).is_file():
                return ssl.create_default_context(cafile=candidate)
        return ssl.create_default_context()

    def _json_request(self, method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        if not self.api_key:
            raise RuntimeError("ARK_API_KEY is required for --submit. Set it in your shell; do not paste it into chat.")
        data = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
        req = request.Request(
            f"{self.base_url}{path}",
            data=data,
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            method=method,
        )
        try:
            with request.urlopen(req, timeout=45, context=self.ssl_context) as response:
                return json.loads(response.read().decode("utf-8"))
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Seedance HTTP {exc.code}: {detail}") from exc

    def submit(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._json_request("POST", "/contents/generations/tasks", payload)

    def status(self, task_id: str) -> dict[str, Any]:
        return self._json_request("GET", f"/contents/generations/tasks/{parse.quote(task_id, safe='')}")

    def download(self, video_url: str, output: Path) -> None:
        output.parent.mkdir(parents=True, exist_ok=True)
        with request.urlopen(video_url, timeout=120, context=self.ssl_context) as response:
            output.write_bytes(response.read())


def first_string(data: dict[str, Any], *paths: tuple[str, ...]) -> str | None:
    for path in paths:
        value: Any = data
        for key in path:
            if not isinstance(value, dict):
                value = None
                break
            value = value.get(key)
        if isinstance(value, str) and value:
            return value
    return None


def poll(client: ArkClient, task_id: str, timeout_seconds: float, poll_seconds: float) -> dict[str, Any]:
    deadline = time.monotonic() + timeout_seconds
    last: dict[str, Any] | None = None
    while time.monotonic() < deadline:
        last = client.status(task_id)
        status = first_string(last, ("status",), ("data", "status"))
        normalized = status.lower() if status else ""
        if normalized in SUCCESS:
            return last
        if normalized in FAILURE:
            raise RuntimeError(f"Seedance task failed with status={status}: {last}")
        print(f"Seedance task {task_id}: {status or 'pending'}", flush=True)
        time.sleep(poll_seconds)
    raise TimeoutError(f"Timed out waiting for Seedance task {task_id}. Last response: {last}")


def run(command: list[str]) -> None:
    result = subprocess.run(command, text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError(f"Command failed: {' '.join(command)}\n{result.stderr[-2000:]}")


def make_loop_qa(video: Path, run_dir: Path, duration: int) -> dict[str, str]:
    frames: list[Path] = []
    for index, second in enumerate((0.0, duration * 0.25, duration * 0.5, duration * 0.75, max(0.0, duration - 0.04))):
        output = run_dir / f"frame-{index:02d}.jpg"
        run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{second:.3f}", "-i", str(video), "-frames:v", "1", "-update", "1", str(output)])
        frames.append(output)

    contact_sheet = run_dir / "contact-sheet.jpg"
    inputs: list[str] = []
    filters: list[str] = []
    for index, frame in enumerate(frames):
        inputs.extend(["-i", str(frame)])
        filters.append(f"[{index}:v]scale=384:216[f{index}]")
    filters.append("".join(f"[f{index}]" for index in range(len(frames))) + f"hstack=inputs={len(frames)}[out]")
    run(["ffmpeg", "-loglevel", "error", "-y", *inputs, "-filter_complex", ";".join(filters), "-map", "[out]", "-frames:v", "1", "-update", "1", str(contact_sheet)])

    seam = run_dir / "loop-seam-preview.mp4"
    run([
        "ffmpeg", "-loglevel", "error", "-y",
        "-sseof", "-1.5", "-i", str(video),
        "-t", "1.5", "-i", str(video),
        "-filter_complex", "[0:v][1:v]concat=n=2:v=1:a=0[out]",
        "-map", "[out]", "-an", str(seam),
    ])
    return {"contact_sheet": str(contact_sheet), "loop_seam_preview": str(seam)}


def main() -> int:
    args = parse_args()
    run_dir = Path(args.output_dir or f"src/content/music-visualizer/{args.run_id}/seedance").resolve()
    if args.bootstrap_anchor:
        if args.first_frame or args.last_frame:
            raise ValueError("--bootstrap-anchor creates a new anchor and cannot be combined with --first-frame or --last-frame.")
        payload = build_bootstrap_payload(args)
        request_path = run_dir / "anchor-request.json"
        write_json(request_path, payload)
        tokens = estimate_tokens(args.resolution, args.ratio, args.duration)
        summary: dict[str, Any] = {
            "run_id": args.run_id,
            "provider": "volcengine-ark",
            "base_url": args.base_url,
            "model": args.model,
            "mode": "text-to-video-anchor-bootstrap",
            "request_path": str(request_path),
            "duration": args.duration,
            "resolution": args.resolution,
            "ratio": args.ratio,
            "camera_fixed": "prompt-and-frame-anchoring-only; unsupported as a Seedance 2.0 API parameter",
            "estimated_tokens": tokens,
            "estimated_rmb": round(tokens * 46 / 1_000_000, 4),
            "submitted": args.submit,
        }
        write_json(run_dir / "anchor-summary.json", summary)
        print(json.dumps(summary, ensure_ascii=False, indent=2))
        if not args.submit:
            print("Dry run only. Re-run with --submit to create the paid Seedance anchor task.")
            return 0
        client = ArkClient(args.base_url)
        task = client.submit(payload)
        write_json(run_dir / "anchor-task.json", task)
        task_id = first_string(task, ("id",), ("task_id",), ("data", "id"), ("data", "task_id"))
        if not task_id:
            raise RuntimeError(f"Seedance anchor response has no task id: {task}")
        final_response = poll(client, task_id, args.timeout_seconds, args.poll_seconds)
        write_json(run_dir / "anchor-final-response.json", final_response)
        video_url = first_string(final_response, ("content", "video_url"), ("data", "content", "video_url"), ("result", "content", "video_url"), ("video_url",))
        if not video_url:
            raise RuntimeError(f"Seedance anchor completion response has no video URL: {final_response}")
        study = run_dir / "anchor-study.mp4"
        client.download(video_url, study)
        anchor = run_dir / "anchor.png"
        run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{args.anchor_second:.3f}", "-i", str(study), "-frames:v", "1", "-update", "1", str(anchor)])
        summary.update({
            "task_id": task_id,
            "final_response_path": str(run_dir / "anchor-final-response.json"),
            "study_path": str(study),
            "anchor_path": str(anchor),
        })
        write_json(run_dir / "anchor-summary.json", summary)
        print(f"Saved original anchor image: {anchor}")
        return 0

    payload, image_records = build_payload(args)
    record = request_record(payload, image_records)
    request_path = run_dir / "request.json"
    write_json(request_path, record)

    tokens = estimate_tokens(args.resolution, args.ratio, args.duration)
    estimate_rmb = round(tokens * 46 / 1_000_000, 4)
    summary: dict[str, Any] = {
        "run_id": args.run_id,
        "provider": "volcengine-ark",
        "base_url": args.base_url,
        "model": args.model,
        "mode": "strict-first-last-loop",
        "request_path": str(request_path),
        "duration": args.duration,
        "resolution": args.resolution,
        "ratio": args.ratio,
        "camera_fixed": "prompt-and-frame-anchoring-only; unsupported as a Seedance 2.0 API parameter",
        "estimated_tokens": tokens,
        "estimated_rmb": estimate_rmb,
        "submitted": args.submit,
    }
    write_json(run_dir / "summary.json", summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))

    if not args.submit:
        print("Dry run only. Inspect request.json, then re-run with --submit to create a paid Seedance task.")
        return 0

    client = ArkClient(args.base_url)
    task = client.submit(payload)
    write_json(run_dir / "task.json", task)
    task_id = first_string(task, ("id",), ("task_id",), ("data", "id"), ("data", "task_id"))
    if not task_id:
        raise RuntimeError(f"Seedance task response has no task id: {task}")
    final_response = poll(client, task_id, args.timeout_seconds, args.poll_seconds)
    write_json(run_dir / "final_response.json", final_response)
    video_url = first_string(final_response, ("content", "video_url"), ("data", "content", "video_url"), ("result", "content", "video_url"), ("video_url",))
    if not video_url:
        raise RuntimeError(f"Seedance completion response has no video URL: {final_response}")
    output = run_dir / "output.mp4"
    client.download(video_url, output)
    summary.update({"task_id": task_id, "final_response_path": str(run_dir / "final_response.json"), "output_path": str(output)})
    summary["qa"] = make_loop_qa(output, run_dir, args.duration)
    write_json(run_dir / "summary.json", summary)
    print(f"Saved Seedance loop: {output}")
    print(f"Seam preview: {summary['qa']['loop_seam_preview']}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # Keep the CLI error short and actionable.
        print(f"seedance-cinematic-loop: {exc}", file=sys.stderr)
        raise SystemExit(1)
