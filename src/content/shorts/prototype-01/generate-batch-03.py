#!/usr/bin/env python3
"""
AI Shorts Batch 03 — Dreamy Visuals × Classic Songs
kling-v3 pro | 15s | 9:16 | multi_shot intelligence
Philosophy: beautiful imagery that naturally pairs with iconic music
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


# ─── Dreamy Shorts: Visual × Music Pairings ──────────────────────

SHORTS = [
    {
        "id": "short-11-bohemian-rhapsody",
        "song_hint": "Bohemian Rhapsody — Queen",
        "prompt": (
            "Cinematic vertical video, surreal operatic dreamscape with multi-scene transitions. "
            "Scene 1: A single silhouetted figure stands on a mirror-flat infinite water surface under a blood-red sky. "
            "Their reflection is perfectly mirrored below. Camera slowly pushes in. Hauntingly beautiful and still. "
            "Scene 2: The sky shatters like stained glass. Enormous fragments of colored glass fall in slow motion "
            "around the figure, each shard reflecting a different reality — galaxies, fire, ocean storms, aurora. "
            "The figure reaches upward as light pours through the breaking sky. Operatic grandeur. "
            "Scene 3: The figure is now floating upward through an impossible cathedral of light. "
            "Massive golden arches stretch infinitely in every direction. Rays of light stream through "
            "rose windows the size of planets. Choirs of light. Transcendent, overwhelming beauty. "
            "Scene 4: Camera rises above everything. The cathedral dissolves into pure starlight. "
            "The figure becomes a single point of light among billions of stars in an infinite cosmos. "
            "Peaceful. Eternal. A slow fade as stars pulse gently. "
            "Photorealistic with painterly surrealism. Rich jewel-tone palette: deep reds, golds, cosmic purples. "
            "Anamorphic lens flares. Every frame a masterpiece."
        ),
    },
    {
        "id": "short-12-fly-me-to-the-moon",
        "song_hint": "Fly Me to the Moon — Frank Sinatra",
        "prompt": (
            "Cinematic vertical video, romantic and whimsical with dreamy multi-scene storytelling. "
            "Scene 1: A couple dances on a rooftop garden at golden hour. The city skyline glows warm amber below. "
            "String lights twinkle overhead. Their shadows stretch long across terracotta tiles. "
            "Camera slowly circles them. Intimate, warm, timeless. Vintage film grain quality. "
            "Scene 2: As they spin, the rooftop lifts away from the city. The building gently floats upward "
            "through cotton candy clouds at sunset. The couple keeps dancing, unaware, lost in each other. "
            "Pink and gold clouds drift past. Magical realism. "
            "Scene 3: They dance through the stratosphere now. Stars begin to appear. Earth's curved blue horizon "
            "glows below them. The rooftop garden is a tiny island of warmth and green in the vastness of space. "
            "Flowers sway in impossible wind. Breathtakingly romantic. "
            "Scene 4: The full moon rises enormous before them, luminous and silver-white. "
            "The rooftop drifts gently toward its surface. The couple finally looks up at the moon, "
            "then at each other, smiling. Camera slowly pulls back to show two tiny figures dancing "
            "on a garden floating toward the moon. "
            "Warm golden palette transitioning to cool silver moonlight. Soft focus, dreamy depth of field. "
            "Photorealistic with fairy-tale wonder. Every frame radiates love and magic."
        ),
    },
    {
        "id": "short-13-hotel-california",
        "song_hint": "Hotel California — Eagles",
        "prompt": (
            "Cinematic vertical video, mysterious and hypnotic with surreal multi-scene storytelling. "
            "Scene 1: A lone vintage convertible drives down an endless desert highway at dusk. "
            "The road stretches perfectly straight to the horizon. Purple and orange desert sky. "
            "Joshua trees silhouetted against dying light. Heat shimmer rises from asphalt. "
            "Camera follows behind the car, low angle. Lonely, beautiful, ominous. "
            "Scene 2: A grand Spanish colonial hotel materializes from desert haze. "
            "Warm light pours from every arched window. Palm trees frame the entrance. "
            "A massive ornate iron gate slowly swings open by itself. The hotel shimmers like a mirage, "
            "almost too beautiful to be real. Candlelight flickers inside. Seductive and unsettling. "
            "Scene 3: Inside a grand ballroom with soaring ceilings and crystal chandeliers. "
            "Elegant people in 1970s fashion dance in slow motion. Their reflections in polished marble floors "
            "don't quite match their movements. Mirrors on the walls show different seasons — "
            "summer in one, winter in another. Time is broken here. Golden light, warm shadows. "
            "Scene 4: Camera drifts toward a balcony. Outside, the desert has become an infinite ocean of stars. "
            "The hotel floats alone in cosmic darkness. Looking back through the glass door, "
            "the party continues forever, dancers frozen in eternal golden light. "
            "Warm amber and desert gold palette. Photorealistic with David Lynch dreamlike quality. "
            "Nostalgic yet deeply mysterious. Cinematic anamorphic lens."
        ),
    },
    {
        "id": "short-14-clair-de-lune",
        "song_hint": "Clair de Lune — Debussy",
        "prompt": (
            "Cinematic vertical video, serene and ethereal with meditative multi-scene storytelling. "
            "Scene 1: A perfectly still mountain lake at midnight. The full moon's reflection creates "
            "a perfect silver circle on glass-like water. A single cherry blossom petal falls in extreme slow motion "
            "toward the water surface. Camera tracks the petal's descent. Absolute silence made visible. "
            "Every star reflected perfectly in the lake. "
            "Scene 2: The petal touches the water. Ripples expand outward in slow motion, "
            "and each ripple transforms into rings of soft bioluminescent light — pale blue, lavender, pearl white. "
            "The light rings expand across the entire lake surface, illuminating underwater. "
            "Schools of silver fish scatter beneath the glowing surface. Otherworldly beauty. "
            "Scene 3: Camera rises slowly above the lake. The bioluminescent ripples have formed "
            "an enormous mandala pattern across the water surface. Surrounding mountains are dusted with snow. "
            "Fireflies rise from the forest edges like ascending stars. The boundary between sky and lake "
            "becomes invisible — stars above, stars below. "
            "Scene 4: Camera continues rising to reveal the entire valley is shaped like a crescent moon. "
            "Rivers of soft light flow through dark forests. The real moon and its reflection align perfectly. "
            "Everything is connected in luminous geometry. Vast, peaceful, infinite. "
            "Silver, moonlight blue, and soft lavender palette. Photorealistic with Japanese woodblock print elegance. "
            "Extreme clarity, meditative pacing, crystalline beauty."
        ),
    },
    {
        "id": "short-15-dream-on",
        "song_hint": "Dream On — Aerosmith",
        "prompt": (
            "Cinematic vertical video, epic and soaring with triumphant multi-scene storytelling. "
            "Scene 1: A child stands at the base of an impossibly tall mountain, looking up. "
            "The peak disappears into swirling golden clouds. The child wears a tattered red scarf "
            "that whips in the wind. Rocky, dramatic landscape. Storm clouds gather. "
            "Determination in a small frame against enormous nature. Camera low angle looking up. "
            "Scene 2: Time-lapse transformation — the child begins climbing. With each step, they age: "
            "teenager, young adult, adult. The mountain shifts around them — ice walls, lava fields, "
            "crystal caves, waterfalls flowing upward. The red scarf remains constant through every transformation. "
            "Seasons change rapidly. Snow, rain, sun, stars. Relentless upward movement. "
            "Scene 3: Now grown, battered and weathered, they burst through the cloud layer into brilliant sunlight. "
            "Above the clouds is a sea of pure gold light. They stand on the summit, wind sweeping their hair back, "
            "red scarf streaming behind them. Arms slowly spread wide. Camera circles in epic helicopter shot. "
            "Scene 4: They leap from the peak and instead of falling, they fly. "
            "Soaring through golden clouds, past other mountains, over an infinite landscape of dreams — "
            "floating cities, crystal oceans, forests of light. The red scarf trails behind like a comet tail. "
            "Freedom. Triumph. Ecstasy. "
            "Epic warm palette: golds, deep blues, sunset orange. Photorealistic with mythic grandeur. "
            "Dramatic volumetric lighting, cinematic scale."
        ),
    },
]


def submit(prompt, duration="15"):
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


def sync_to_icloud(files):
    """Copy completed videos to iCloud Drive for iPhone access"""
    import shutil
    dest = Path.home() / "Library/Mobile Documents/com~apple~CloudDocs/Aaron-Studio/shorts-ready"
    dest.mkdir(parents=True, exist_ok=True)
    for f in files:
        shutil.copy2(f, dest / f.name)
        print(f"  ☁️ Synced to iCloud: {f.name}")


def main():
    print("🎬 AI Shorts Batch 03 — Dreamy Visuals × Classic Songs")
    print(f"   Model: kling-v3 pro | 15s | multi_shot | 9:16")
    print(f"   Shorts: {len(SHORTS)}\n")

    completed = []
    for i, s in enumerate(SHORTS):
        print(f"\n{'='*50}")
        print(f"[{i+1}/{len(SHORTS)}] 🎵 {s['song_hint']}")

        out = OUTPUT_DIR / f"{s['id']}.mp4"
        if out.exists():
            print(f"  ⏭️ Exists, skipping")
            completed.append(out)
            continue

        task_id = submit(s["prompt"])
        if not task_id:
            continue
        print(f"  ✅ Task: {task_id}")

        result = wait_task(task_id)
        if result and result.get("task_result", {}).get("videos"):
            download(result["task_result"]["videos"][0]["url"], str(out))
            completed.append(out)
        else:
            print(f"  ⚠️ No output")
        gc.collect()

    # Sync all to iCloud
    if completed:
        print(f"\n{'='*50}")
        print("☁️ Syncing to iCloud Drive...")
        sync_to_icloud(completed)

    print(f"\n\n🎬 All done! {len(completed)}/{len(SHORTS)} completed")
    for f in completed:
        print(f"  📹 {f.name} ({f.stat().st_size/1024/1024:.1f} MB)")

    print("\n🎵 Song pairing guide:")
    for s in SHORTS:
        out = OUTPUT_DIR / f"{s['id']}.mp4"
        status = "✅" if out.exists() else "❌"
        print(f"  {status} {s['id']}.mp4 → {s['song_hint']}")


if __name__ == "__main__":
    main()
