#!/usr/bin/env python3
"""
AI Shorts Batch Generator — Trending Topics (Feb 2026)
kling-v3 pro | 9:16 vertical | multi_shot + intelligence
"""

import os, sys, time, requests, jwt, gc
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env", override=True)

ACCESS_KEY = os.getenv("KLING_ACCESS_KEY")
SECRET_KEY = os.getenv("KLING_SECRET_KEY")
API_BASE = "https://api-beijing.klingai.com/v1"
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)


def get_token():
    now = int(time.time())
    return jwt.encode(
        {"iss": ACCESS_KEY, "exp": now + 1800, "nbf": now - 5},
        SECRET_KEY, algorithm="HS256",
        headers={"alg": "HS256", "typ": "JWT"},
    )


def headers():
    return {"Content-Type": "application/json", "Authorization": f"Bearer {get_token()}"}


# ─── Trending Shorts ─────────────────────────────────────────────

SHORTS = [
    {
        "id": "short-06-spacex-xai-merge",
        "topic": "SpaceX acquires xAI — AI meets rockets",
        "duration": "10",
        "prompt": (
            "Cinematic vertical video with dramatic multi-scene storytelling. "
            "Scene 1: A sleek SpaceX Starship rocket stands on a launch pad at sunset, "
            "steam rising from its base. Camera slowly tilts upward along the rocket body. "
            "Warm orange sky, industrial beauty. Photorealistic detail on metal panels and heat tiles. "
            "Scene 2: Inside a futuristic mission control room, walls of holographic screens display "
            "neural network visualizations, training curves, and satellite constellation maps. "
            "Blue light illuminates rows of empty operator stations. AI is running everything autonomously. "
            "Scene 3: The rocket launches in a dramatic night shot, brilliant white flames reflecting off "
            "ocean water below. Camera follows from ground level as the rocket ascends, "
            "creating a pillar of light piercing through clouds. "
            "Scene 4: From orbit, hundreds of AI satellites deploy from the rocket payload bay, "
            "unfolding solar panels like mechanical butterflies. Earth's curved horizon glows blue below. "
            "A web of data connections lights up between satellites. "
            "Photorealistic, cinematic color grading. Industrial warmth transitioning to cosmic blue. "
            "Each scene transitions with natural camera movement."
        ),
    },
    {
        "id": "short-07-underwater-datacenter",
        "topic": "Underwater data centers — the next frontier of cloud computing",
        "duration": "10",
        "prompt": (
            "Cinematic vertical video with immersive multi-scene storytelling. "
            "Scene 1: Camera descends slowly through deep ocean water, shafts of blue-green light "
            "filtering from above. Particles float in the water. Mysterious and vast. "
            "Scene 2: A massive cylindrical data center module emerges from the darkness on the ocean floor, "
            "covered in bioluminescent organisms. Server rack lights glow through reinforced glass panels "
            "in rhythmic patterns. Fiber optic cables snake away into the abyss. Cold blue industrial lighting "
            "contrasts with warm organic bioluminescence. "
            "Scene 3: Close-up through a porthole window: rows of processors inside pulse with data, "
            "holographic readouts float in the water-cooled chamber. Bubbles rise past the camera. "
            "Scene 4: Camera pulls back and up, rising through the water to break the surface. "
            "A calm ocean stretches to the horizon under a starry night sky. "
            "The data center's faint glow visible beneath the surface like a sleeping leviathan. "
            "Photorealistic, National Geographic documentary quality. Deep ocean color palette. "
            "Smooth continuous camera movement throughout."
        ),
    },
    {
        "id": "short-08-robot-artist",
        "topic": "AGIBOT's robot-led live event — machines performing art",
        "duration": "10",
        "prompt": (
            "Cinematic vertical video with emotional multi-scene storytelling. "
            "Scene 1: A dark empty theater stage, single spotlight illuminates dust particles in the air. "
            "Rows of velvet seats empty. Anticipation. Camera slowly pushes toward the stage. "
            "Scene 2: A sleek humanoid robot walks gracefully to center stage under warm theatrical lighting. "
            "Its white ceramic body reflects the spotlights. It raises one arm elegantly, "
            "fingers extending outward like a dancer. Smooth, almost human movement. "
            "Scene 3: The robot begins to paint on a massive floating holographic canvas in mid-air, "
            "each gesture creating trails of luminous color. Sweeping brushstrokes of gold, crimson, "
            "and electric blue bloom in three dimensions around it. The robot moves with artistic passion. "
            "Scene 4: Camera pulls back to reveal the completed artwork: a vast holographic galaxy "
            "of swirling colors filling the entire theater. The robot stands small beneath its creation. "
            "Audience seats now filled with silhouetted figures, standing ovation implied. "
            "Photorealistic with artistic flair. Dramatic theater lighting. "
            "Emotional progression from silence to spectacle."
        ),
    },
    {
        "id": "short-09-google-genie-worlds",
        "topic": "Google Project Genie — AI-generated interactive worlds",
        "duration": "10",
        "prompt": (
            "Cinematic vertical video with wonder-filled multi-scene storytelling. "
            "Scene 1: A child sits at a simple wooden desk in a cozy bedroom, typing on a glowing laptop. "
            "Warm lamplight, books stacked around. The screen emits a soft golden glow on the child's face. "
            "Camera slowly pushes in toward the screen. "
            "Scene 2: The laptop screen expands and shatters outward as a fully realized fantasy world "
            "erupts from it. Lush floating islands with waterfalls, ancient stone temples covered in vines, "
            "and glowing crystal formations burst into existence around the child. "
            "The desk transforms into a cliff edge overlooking an endless valley. "
            "Scene 3: A majestic dragon made of golden light soars through the world, "
            "weaving between floating islands. The child reaches out as the dragon passes close, "
            "leaving trails of sparkles. Wind blows through the child's hair. "
            "Scene 4: Camera rises high above, revealing the entire generated world is contained "
            "inside a glowing sphere hovering above the laptop back in the quiet bedroom. "
            "The child smiles, types again, and a new world begins to form. "
            "Photorealistic fantasy style. Warm golden color palette with jewel tones. "
            "Magical atmosphere with cinematic depth of field."
        ),
    },
]


def submit(prompt, duration="10"):
    payload = {
        "model_name": "kling-v3",
        "prompt": prompt,
        "cfg_scale": 0.5,
        "mode": "pro",
        "duration": duration,
        "aspect_ratio": "9:16",
        "multi_shot": "true",
        "shot_type": "intelligence",
    }
    for attempt in range(5):
        resp = requests.post(f"{API_BASE}/videos/text2video", headers=headers(), json=payload, timeout=120)
        data = resp.json()
        if data.get("code") == 0:
            return data["data"]["task_id"]
        if data.get("code") == 1303:
            wait = 30 * (attempt + 1)
            print(f"  ⏳ Queue full, waiting {wait}s...")
            time.sleep(wait)
            continue
        if data.get("code") == 1102:
            print(f"  ❌ Insufficient balance")
            return None
        print(f"  ❌ Error: {data}")
        return None
    return None


def wait_task(task_id, max_wait=900):
    elapsed = 0
    while elapsed < max_wait:
        try:
            resp = requests.get(f"{API_BASE}/videos/text2video/{task_id}", headers=headers(), timeout=30)
            d = resp.json()
            if d.get("code") != 0:
                time.sleep(15); elapsed += 15; continue
            status = d["data"].get("task_status")
            if status == "succeed":
                return d["data"]
            elif status == "failed":
                print(f"  ❌ Failed: {d['data'].get('task_status_msg')}")
                return None
            else:
                if elapsed % 60 == 0:
                    print(f"  ⏳ {status} ({elapsed}s)")
                time.sleep(15)
                elapsed += 15
        except Exception as e:
            print(f"  ⚠️ {e}")
            time.sleep(15)
            elapsed += 15
    print(f"  ⏰ Timeout")
    return None


def download(url, path):
    resp = requests.get(url, stream=True, timeout=120)
    with open(path, "wb") as f:
        for chunk in resp.iter_content(8192):
            f.write(chunk)
    mb = os.path.getsize(path) / 1024 / 1024
    print(f"  💾 {path} ({mb:.1f} MB)")


def main():
    print("🎬 AI Shorts Batch Generator — Trending Topics")
    print(f"   Model: kling-v3 pro | multi_shot | 9:16")
    print(f"   Shorts: {len(SHORTS)}\n")

    for i, s in enumerate(SHORTS):
        print(f"\n{'='*50}")
        print(f"[{i+1}/{len(SHORTS)}] {s['topic']}")

        out = OUTPUT_DIR / f"{s['id']}.mp4"
        if out.exists():
            print(f"  ⏭️ Exists, skipping")
            continue

        task_id = submit(s["prompt"], s["duration"])
        if not task_id:
            continue
        print(f"  ✅ Task: {task_id}")

        result = wait_task(task_id)
        if result and result.get("task_result", {}).get("videos"):
            download(result["task_result"]["videos"][0]["url"], str(out))
        else:
            print(f"  ⚠️ No output")
        gc.collect()

    print(f"\n\n🎬 All done!")
    for f in sorted(OUTPUT_DIR.glob("short-0[6-9]*.mp4")):
        print(f"  📹 {f.name} ({f.stat().st_size/1024/1024:.1f} MB)")


if __name__ == "__main__":
    main()
