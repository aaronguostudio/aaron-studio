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
        content.append(
            {
                "type": "image_url",
                "image_url": {"url": image_url},
                "role": image_role,
            }
        )

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
    return _first_string_at(
        response,
        ("id",),
        ("task_id",),
        ("data", "id"),
        ("data", "task_id"),
        ("task", "id"),
        ("data", "task", "id"),
    )


def extract_status(response: dict[str, Any]) -> str | None:
    status = _first_string_at(
        response,
        ("status",),
        ("data", "status"),
        ("task", "status"),
        ("data", "task", "status"),
    )
    return status.lower() if status else None


def extract_video_url(response: dict[str, Any]) -> str | None:
    return _first_string_at(
        response,
        ("content", "video_url"),
        ("data", "content", "video_url"),
        ("result", "content", "video_url"),
        ("data", "result", "content", "video_url"),
        ("data", "result", "video_url"),
        ("video", "url"),
        ("data", "video", "url"),
        ("video_url",),
        ("data", "video_url"),
        ("result_url",),
        ("data", "result_url"),
    )


class ArkSeedanceClient:
    def __init__(
        self,
        *,
        api_key: str | None = None,
        base_url: str = DEFAULT_ARK_BASE_URL,
        timeout: float = 30.0,
    ) -> None:
        self.api_key = os.environ.get("ARK_API_KEY", "") if api_key is None else api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def submit_task(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._json_request("POST", "/contents/generations/tasks", payload)

    def get_task(self, task_id: str) -> dict[str, Any]:
        quoted_id = parse.quote(task_id, safe="")
        return self._json_request("GET", f"/contents/generations/tasks/{quoted_id}")

    def download_video(self, video_url: str, output_path: str | Path) -> Path:
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with request.urlopen(video_url, timeout=self.timeout) as response:
            path.write_bytes(response.read())
        return path

    def _json_request(
        self,
        method: str,
        path: str,
        payload: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
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
    deadline = time.monotonic() + timeout_seconds
    last_response: dict[str, Any] | None = None

    while time.monotonic() < deadline:
        last_response = client.get_task(task_id)
        status = extract_status(last_response)
        if status in TERMINAL_SUCCESS_STATUSES:
            return last_response
        if status in TERMINAL_FAILURE_STATUSES:
            raise RuntimeError(f"Seedance task {task_id} ended with status={status}: {last_response}")
        time.sleep(poll_seconds)

    raise TimeoutError(f"Timed out waiting for Seedance task {task_id}. Last response: {last_response}")


def _first_string_at(data: dict[str, Any], *paths: tuple[str, ...]) -> str | None:
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
