#!/usr/bin/env python3
"""
Kling AI Batch Video Generator (China API)
Generates video clips from image pairs using Kling AI's image-to-video API.
Processes one task at a time to respect concurrency limits.
"""

import os
import sys
import json
import time
import base64
import io
import gc
import requests
import jwt
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image

# Load .env
load_dotenv(Path(__file__).parent / ".env")

ACCESS_KEY = os.getenv("KLING_ACCESS_KEY")
SECRET_KEY = os.getenv("KLING_SECRET_KEY")
API_BASE = "https://api-beijing.klingai.com/v1"

ART_DIR = Path(__file__).parent / "art"
OUTPUT_DIR = Path(__file__).parent / "clips"
OUTPUT_DIR.mkdir(exist_ok=True)


def get_token():
    now = int(time.time())
    return jwt.encode(
        {"iss": ACCESS_KEY, "exp": now + 1800, "nbf": now - 5},
        SECRET_KEY,
        algorithm="HS256",
        headers={"alg": "HS256", "typ": "JWT"},
    )


def get_headers():
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {get_token()}",
    }


def image_to_base64(image_path: str) -> str:
    img = Image.open(image_path)
    img = img.resize((768, 512))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    img.close()
    buf.close()
    gc.collect()
    return b64


def find_image(name: str) -> str:
    for subdir in ART_DIR.iterdir():
        if subdir.is_dir() and name in subdir.name:
            for f in subdir.iterdir():
                if f.suffix == ".png":
                    return str(f)
    return None


def submit_task(prompt, start_path, end_path=None, duration="5"):
    payload = {
        "model_name": "kling-v1-6",
        "prompt": prompt,
        "cfg_scale": 0.5,
        "mode": "std",
        "duration": "10",
        "aspect_ratio": "16:9",
        "image": image_to_base64(start_path),
    }
    if end_path:
        payload["tail_image"] = image_to_base64(end_path)

    for attempt in range(5):
        resp = requests.post(
            f"{API_BASE}/videos/image2video",
            headers=get_headers(),
            json=payload,
            timeout=120,
        )
        data = resp.json()

        if data.get("code") == 0:
            task_id = data["data"]["task_id"]
            print(f"  ✅ Task submitted: {task_id}")
            return task_id

        if data.get("code") == 1303:  # parallel limit
            wait = 30 * (attempt + 1)
            print(f"  ⏳ Parallel limit, waiting {wait}s...")
            time.sleep(wait)
            continue

        if data.get("code") == 1102:  # balance
            print(f"  ❌ Insufficient balance")
            return None

        print(f"  ❌ Error: {data}")
        return None

    print(f"  ❌ Max retries exceeded")
    return None


def wait_for_task(task_id, max_wait=600):
    elapsed = 0
    while elapsed < max_wait:
        try:
            resp = requests.get(
                f"{API_BASE}/videos/image2video/{task_id}",
                headers=get_headers(),
                timeout=30,
            )
            data = resp.json()
            if data.get("code") != 0:
                print(f"  ⚠️ Query error: {data}")
                time.sleep(15)
                elapsed += 15
                continue

            status = data["data"].get("task_status")
            if status == "succeed":
                print(f"  ✅ Complete!")
                return data["data"]
            elif status == "failed":
                msg = data["data"].get("task_status_msg", "unknown")
                print(f"  ❌ Failed: {msg}")
                return None
            else:
                print(f"  ⏳ {status} ({elapsed}s)")
                time.sleep(15)
                elapsed += 15
        except Exception as e:
            print(f"  ⚠️ {e}")
            time.sleep(15)
            elapsed += 15

    print(f"  ⏰ Timeout")
    return None


def download_video(url, output_path):
    resp = requests.get(url, stream=True, timeout=120)
    with open(output_path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=8192):
            f.write(chunk)
    size_mb = os.path.getsize(output_path) / 1024 / 1024
    print(f"  💾 Saved: {output_path} ({size_mb:.1f} MB)")


# ─── Task Definitions ───

TASKS = [
    {"id": "clip-01", "name": "Hook: Night coding to phone", "start": "scene-01", "end": "scene-05", "prompt": "Character sits at desk at night, picks up phone, looks at screen. Warm room lighting, gentle movement."},
    {"id": "clip-02", "name": "Hook: Phone to sleep", "start": "scene-05", "end": "scene-02", "prompt": "Character puts phone down, room darkens, character lies down to sleep. Smooth transition from desk to bed."},
    {"id": "clip-03", "name": "Hook: Night to morning", "start": "scene-02", "end": "scene-03", "prompt": "Night transforms to morning. Moonlight fades, sunrise light comes through window. Character opens eyes, sits up excitedly."},
    {"id": "clip-04", "name": "Context: Overwhelmed by files", "start": "context-01", "end": None, "prompt": "Character stands looking at scattered floating documents and files, slightly overwhelmed expression, gentle animation."},
    {"id": "clip-05", "name": "Context: Files to organized UI", "start": "context-01", "end": "context-02", "prompt": "Scattered documents organize themselves into a clean screen interface. Character smiles, scene becomes orderly."},
    {"id": "clip-06", "name": "Context: Building the UI", "start": "context-02", "end": None, "prompt": "Character types on laptop, simple UI appears on screen, character nods with satisfaction. Gentle movement."},
    {"id": "clip-07", "name": "Context: Wants more, nighttime", "start": "context-02", "end": "scene-01", "prompt": "Character leans back from laptop, looks at clock on wall, scene transitions to nighttime. Character looks thoughtful."},
    {"id": "clip-08", "name": "Prompt: Typing on phone", "start": "scene-05", "end": None, "prompt": "Character holds phone, typing a message. WhatsApp chat bubbles appear on phone screen. Focused expression."},
    {"id": "clip-09", "name": "Prompt: Phone to sleep", "start": "scene-05", "end": "scene-02", "prompt": "Character puts phone on nightstand, room goes dark, character falls asleep peacefully. Clock on wall accelerates."},
    {"id": "clip-10", "name": "Result: Wake up excited", "start": "scene-02", "end": "scene-03", "prompt": "Morning light floods room, character wakes up excited, rushes to laptop, eyes go wide seeing the screen."},
    {"id": "clip-11", "name": "Result: Celebration", "start": "scene-03", "end": None, "prompt": "Character leans back from laptop, arms spread wide in celebration, big smile. Confetti or sparkle effects."},
    {"id": "clip-12", "name": "Insight: Whiteboard", "start": "insight-01", "end": None, "prompt": "Character stands at whiteboard, gestures while explaining. Hand points at text on whiteboard. Confident teaching pose."},
    {"id": "clip-13", "name": "Insight: Whiteboard to mountain", "start": "insight-01", "end": "scene-06", "prompt": "Whiteboard scene transforms into epic mountain landscape. Character rises to mountain top, looking at horizon."},
    {"id": "clip-14", "name": "Insight: Mountain epic", "start": "scene-06", "end": None, "prompt": "Character on mountain top, sunrise brightens, futuristic cityscape appears on horizon. Hopeful, epic feeling."},
    {"id": "clip-15", "name": "CTA: Show ClawMemory", "start": "cta-01", "end": None, "prompt": "Character gestures toward screen showing ClawMemory UI. Stars and sparkles animate around the logo."},
    {"id": "clip-16", "name": "CTA: Look at camera", "start": "cta-01", "end": None, "prompt": "Character looks directly at camera, points forward confidently, slight smile. Warm inviting expression."},
]


def main():
    print("🎬 Kling AI Batch Video Generator")
    print(f"   Tasks: {len(TASKS)}")
    print()

    if not ACCESS_KEY or not SECRET_KEY:
        print("❌ Missing keys in .env")
        sys.exit(1)

    # Check which clips already exist
    existing = set()
    for f in OUTPUT_DIR.iterdir():
        if f.suffix == ".mp4":
            existing.add(f.stem.split("-")[0] + "-" + f.stem.split("-")[1])

    completed = 0
    for i, task in enumerate(TASKS):
        clip_id = task["id"]
        print(f"\n[{i+1}/{len(TASKS)}] {task['name']}")

        # Skip if already downloaded
        existing_files = list(OUTPUT_DIR.glob(f"{clip_id}*"))
        if existing_files:
            print(f"  ⏭️ Already exists, skipping")
            completed += 1
            continue

        start_img = find_image(task["start"])
        end_img = find_image(task["end"]) if task["end"] else None

        if not start_img:
            print(f"  ❌ Missing image: {task['start']}")
            continue

        # Submit
        task_id = submit_task(task["prompt"], start_img, end_img)
        if not task_id:
            continue

        # Wait
        result = wait_for_task(task_id)
        if result and result.get("task_result", {}).get("videos"):
            video_url = result["task_result"]["videos"][0]["url"]
            safe_name = task["name"].replace(": ", "-").replace(" ", "_").lower()
            output_path = OUTPUT_DIR / f"{clip_id}-{safe_name}.mp4"
            download_video(video_url, str(output_path))
            completed += 1
        else:
            print(f"  ⚠️ No video output")

        # Cleanup memory
        gc.collect()

    print(f"\n\n🎬 Done! {completed}/{len(TASKS)} videos ready")
    print(f"   Output: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
