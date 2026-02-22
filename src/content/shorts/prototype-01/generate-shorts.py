#!/usr/bin/env python3
"""
Kling v3 Pro — AI Shorts Prototype Generator
Text-to-video, 1080x1920 vertical, high quality shorts.
"""

import os
import sys
import time
import requests
import jwt
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

ACCESS_KEY = os.getenv("KLING_ACCESS_KEY")
SECRET_KEY = os.getenv("KLING_SECRET_KEY")
API_BASE = "https://api-beijing.klingai.com/v1"
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)


def get_token():
    now = int(time.time())
    return jwt.encode(
        {"iss": ACCESS_KEY, "exp": now + 1800, "nbf": now - 5},
        SECRET_KEY,
        algorithm="HS256",
        headers={"alg": "HS256", "typ": "JWT"},
    )


def headers():
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {get_token()}",
    }


# ─── Shorts Prompts ───────────────────────────────────────────────

SHORTS = [
    {
        "id": "short-01-bioluminescent",
        "prompt": (
            "Cinematic vertical video. A massive bioluminescent wave crashes onto a black sand beach at midnight. "
            "Glowing electric-blue particles explode into the air as the wave breaks, creating a curtain of light. "
            "Camera tracks low at water level, moving smoothly along the shoreline. "
            "Stars visible in the sky above. Hyper-realistic, photorealistic quality, shallow depth of field, "
            "anamorphic lens flare from the bioluminescence. 4K cinematic color grading, deep blacks and vivid blues."
        ),
        "duration": "5",
    },
    {
        "id": "short-02-spiral-staircase",
        "prompt": (
            "Cinematic vertical video. An infinite white marble spiral staircase floats among soft pink and golden clouds. "
            "A tiny solitary human figure in dark clothing climbs upward, seen from a dramatic low angle. "
            "Volumetric god rays pierce through gaps in the staircase, casting long shadows. "
            "Slow camera dolly upward following the figure. Dreamlike surreal atmosphere, "
            "architectural photography style, hyper-detailed marble texture, "
            "photorealistic lighting, soft bokeh in the cloud background. Epic and serene."
        ),
        "duration": "5",
    },
    {
        "id": "short-03-dewdrop-city",
        "prompt": (
            "Cinematic vertical video. Extreme macro close-up of a single perfect dewdrop sitting on a cherry blossom petal. "
            "Inside the dewdrop, a miniature futuristic city is reflected with thousands of tiny glowing lights and skyscrapers. "
            "Smooth rack focus from the soft pink petal texture in foreground to the sharp city reflection inside the drop. "
            "Golden hour warm backlight creates a rim light on the dewdrop. "
            "Photorealistic, shallow depth of field, dreamy color palette of pink, gold, and warm white. "
            "Subtle camera push-in toward the dewdrop."
        ),
        "duration": "5",
    },
]


def submit_text2video(prompt, duration="5"):
    """Submit a text-to-video task using kling-v3 pro."""
    payload = {
        "model_name": "kling-v3",
        "prompt": prompt,
        "cfg_scale": 0.5,
        "mode": "pro",
        "duration": duration,
        "aspect_ratio": "9:16",  # vertical for shorts
    }

    for attempt in range(5):
        resp = requests.post(
            f"{API_BASE}/videos/text2video",
            headers=headers(),
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

        if data.get("code") == 1102:
            print(f"  ❌ Insufficient balance")
            return None

        print(f"  ❌ Error (code {data.get('code')}): {data.get('message', data)}")
        return None

    print(f"  ❌ Max retries exceeded")
    return None


def wait_for_task(task_id, max_wait=600):
    elapsed = 0
    while elapsed < max_wait:
        try:
            resp = requests.get(
                f"{API_BASE}/videos/text2video/{task_id}",
                headers=headers(),
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

    print(f"  ⏰ Timeout after {max_wait}s")
    return None


def download_video(url, output_path):
    resp = requests.get(url, stream=True, timeout=120)
    with open(output_path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=8192):
            f.write(chunk)
    size_mb = os.path.getsize(output_path) / 1024 / 1024
    print(f"  💾 Saved: {output_path} ({size_mb:.1f} MB)")


def main():
    print("🎬 Kling v3 Pro — AI Shorts Prototype")
    print(f"   Model: kling-v3 (pro mode)")
    print(f"   Format: 9:16 vertical (1080x1920)")
    print(f"   Shorts: {len(SHORTS)}")
    print()

    if not ACCESS_KEY or not SECRET_KEY:
        print("❌ Missing KLING keys in .env")
        sys.exit(1)

    for i, short in enumerate(SHORTS):
        print(f"\n{'='*60}")
        print(f"[{i+1}/{len(SHORTS)}] {short['id']}")
        print(f"  Prompt: {short['prompt'][:80]}...")

        # Skip if already exists
        existing = list(OUTPUT_DIR.glob(f"{short['id']}*"))
        if existing:
            print(f"  ⏭️ Already exists: {existing[0].name}")
            continue

        # Submit
        task_id = submit_text2video(short["prompt"], short["duration"])
        if not task_id:
            continue

        # Wait
        result = wait_for_task(task_id)
        if result and result.get("task_result", {}).get("videos"):
            video_url = result["task_result"]["videos"][0]["url"]
            output_path = OUTPUT_DIR / f"{short['id']}.mp4"
            download_video(video_url, str(output_path))
        else:
            print(f"  ⚠️ No video output")

    print(f"\n\n🎬 Done! Check output: {OUTPUT_DIR}")
    # List results
    for f in sorted(OUTPUT_DIR.glob("*.mp4")):
        size = f.stat().st_size / 1024 / 1024
        print(f"  📹 {f.name} ({size:.1f} MB)")


if __name__ == "__main__":
    main()
