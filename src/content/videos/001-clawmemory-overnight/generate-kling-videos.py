#!/usr/bin/env python3
"""
Batch generate Kling AI image-to-video clips for Video 001.
Uses Kling AI Open Platform API (JWT auth).
Docs: https://klingai.com/global/dev/docs

API flow:
1. Generate JWT token from access_key + secret_key
2. POST /v1/videos/image2video to create task
3. GET /v1/videos/image2video/{task_id} to poll status
4. Download result video
"""

import os, json, time, base64, hashlib, hmac, struct
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv
import requests
import jwt  # pip install PyJWT

load_dotenv()

ACCESS_KEY = os.getenv("KLING_ACCESS_KEY")
SECRET_KEY = os.getenv("KLING_SECRET_KEY")
BASE_URL = "https://api.klingai.com"

VIDEO_DIR = Path(__file__).parent
ART_DIR = VIDEO_DIR / "art"
OUT_DIR = VIDEO_DIR / "video"
OUT_DIR.mkdir(exist_ok=True)

def get_jwt_token():
    """Generate JWT token for Kling API auth."""
    now = int(time.time())
    payload = {
        "iss": ACCESS_KEY,
        "exp": now + 1800,  # 30 min
        "nbf": now - 5,
        "iat": now,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256", headers={"typ": "JWT", "alg": "HS256"})

def image_to_base64(path):
    """Read image file and return base64 data URI."""
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    return f"data:image/png;base64,{data}"

def find_image(scene_dir):
    """Find the first .png in a scene directory."""
    for f in sorted(Path(scene_dir).glob("*.png")):
        return f
    return None

# Clip definitions: (name, start_image_dir, end_image_dir_or_None, prompt)
CLIPS = [
    ("clip-01-hook", "scene-01-hook", "scene-05-phone",
     "A young Asian man sits at desk at night, picks up phone, looks at screen. Warm room lighting, gentle movement. Cartoon illustration style."),
    ("clip-02-sleep", "scene-05-phone", "scene-02-sleep",
     "Character puts phone down, room darkens, lies down to sleep. Smooth transition from desk to bed. Warm cartoon style."),
    ("clip-03-wakeup", "scene-02-sleep", "scene-03-wakeup",
     "Night transforms to morning. Moonlight fades, sunrise light through window. Character opens eyes, sits up excitedly. Cartoon style."),
    ("clip-04-context1", "context-01", None,
     "Character stands looking at scattered floating documents and markdown files, slightly overwhelmed. Gentle animation, warm cartoon style."),
    ("clip-05-context2", "context-01", "context-02",
     "Scattered documents organize themselves into a clean screen interface. Character smiles, scene becomes orderly. Cartoon style."),
    ("clip-06-prompt", "scene-01-hook", None,
     "Character typing on phone at night, sending a message. Screen glows. Chat bubbles appear. Warm lighting, cartoon style."),
    ("clip-07-lights-off", "scene-01-hook", "scene-02-sleep",
     "Room lights dim, character walks to bed, lies down. Clock on wall visible. Time-lapse feel. Cartoon style."),
    ("clip-08-dashboard", "scene-04-present", None,
     "Character at computer, screen shows colorful dashboard with heatmap and charts. Excited expression, pointing at screen. Cartoon style."),
    ("clip-09-graph", "scene-04-present", None,
     "Character at computer, screen shows network graph with connected nodes. Character clicks a node, sidebar appears. Cartoon style."),
    ("clip-10-search", "scene-04-present", None,
     "Character typing search query, results appearing dynamically on screen. Impressed expression. Cartoon style."),
    ("clip-11-templates", "scene-04-present", None,
     "Character clicking buttons on screen, template cards appearing. Quick and satisfying UI interactions. Cartoon style."),
    ("clip-12-summary", "scene-03-wakeup", "scene-04-present",
     "Character stands proudly in front of computer showing completed features. Five checkmarks appear one by one. Cartoon style."),
    ("clip-13-insight", "insight-01", None,
     "Character standing at whiteboard, drawing and gesturing while explaining. Thoughtful expression, warm lighting. Cartoon style."),
    ("clip-14-builder", "scene-06-builder", None,
     "Character transforms from typing code to directing with hands, orchestrating floating UI components. Empowering feel. Cartoon style."),
    ("clip-15-future", "scene-06-builder", None,
     "Calendar pages flip rapidly (Feb → Aug 2026). AI agent autonomously builds features. Futuristic glow. Cartoon style."),
    ("clip-16-cta", "cta-01", None,
     "GitHub star button gets clicked, counter goes up. ClawMemory logo shines. Inviting and warm. Cartoon style."),
]

def create_task(clip_name, start_img_path, end_img_path, prompt):
    """Submit image-to-video task to Kling API."""
    token = get_jwt_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    body = {
        "model_name": "kling-v1",
        "image": image_to_base64(start_img_path),
        "prompt": prompt,
        "duration": "5",
        "mode": "std",
        "cfg_scale": 0.5,
    }

    if end_img_path:
        body["image_tail"] = image_to_base64(end_img_path)

    print(f"  📤 Submitting {clip_name}...")
    resp = requests.post(f"{BASE_URL}/v1/videos/image2video", json=body, headers=headers, timeout=30)

    if resp.status_code != 200:
        print(f"  ❌ HTTP {resp.status_code}: {resp.text[:200]}")
        return None

    data = resp.json()
    if data.get("code") != 0:
        print(f"  ❌ API error: {data.get('message', data)}")
        return None

    task_id = data["data"]["task_id"]
    print(f"  ✓ Task created: {task_id}")
    return task_id

def poll_task(task_id, clip_name, max_wait=600):
    """Poll task status until complete or timeout."""
    token = get_jwt_token()
    headers = {"Authorization": f"Bearer {token}"}

    start = time.time()
    while time.time() - start < max_wait:
        resp = requests.get(f"{BASE_URL}/v1/videos/image2video/{task_id}", headers=headers, timeout=15)
        data = resp.json()

        if data.get("code") != 0:
            print(f"  ❌ Poll error: {data.get('message')}")
            return None

        status = data["data"]["task_status"]
        if status == "succeed":
            video_url = data["data"]["task_result"]["videos"][0]["url"]
            print(f"  ✓ {clip_name} ready!")
            return video_url
        elif status == "failed":
            print(f"  ❌ {clip_name} failed: {data['data'].get('task_status_msg')}")
            return None
        else:
            elapsed = int(time.time() - start)
            print(f"    ⏳ {clip_name} [{status}] {elapsed}s...", end="\r")
            time.sleep(10)

    print(f"  ⏰ {clip_name} timed out after {max_wait}s")
    return None

def download_video(url, out_path):
    """Download video from URL."""
    resp = requests.get(url, timeout=60)
    with open(out_path, "wb") as f:
        f.write(resp.content)
    size_mb = len(resp.content) / 1024 / 1024
    print(f"  💾 Saved {out_path.name} ({size_mb:.1f}MB)")

def main():
    print(f"🎬 Kling AI Batch Video Generation")
    print(f"   {len(CLIPS)} clips to generate\n")

    # Phase 1: Submit all tasks
    tasks = {}
    for clip_name, start_dir, end_dir, prompt in CLIPS:
        out_path = OUT_DIR / f"{clip_name}.mp4"
        if out_path.exists():
            print(f"  skip {clip_name} (exists)")
            continue

        start_img = find_image(ART_DIR / start_dir)
        if not start_img:
            print(f"  ⚠️ No image found in art/{start_dir}/, skipping")
            continue

        end_img = find_image(ART_DIR / end_dir) if end_dir else None
        if end_dir and not end_img:
            print(f"  ⚠️ No end image in art/{end_dir}/, using single-image mode")

        task_id = create_task(clip_name, start_img, end_img, prompt)
        if task_id:
            tasks[clip_name] = task_id

        time.sleep(1)  # Rate limit courtesy

    if not tasks:
        print("\n✅ All clips already generated or no tasks submitted.")
        return

    print(f"\n⏳ {len(tasks)} tasks submitted. Polling for results...\n")

    # Phase 2: Poll all tasks
    for clip_name, task_id in tasks.items():
        video_url = poll_task(task_id, clip_name)
        if video_url:
            out_path = OUT_DIR / f"{clip_name}.mp4"
            download_video(video_url, out_path)

    print(f"\n🎬 Done! Check {OUT_DIR}/")

if __name__ == "__main__":
    main()
