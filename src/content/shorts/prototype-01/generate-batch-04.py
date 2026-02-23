#!/usr/bin/env python3
"""
AI Shorts Batch 04 — "If This Song Was a Painting" Series
kling-v3 pro | 15s | 9:16 | multi_shot intelligence

Strategy shift: emotion-first, not beauty-first.
- Hook text overlay added via ffmpeg after generation
- Each short designed for maximum swipe-resistance (first 3s)
- Human stories > pure landscapes
- Reveal structure: build-up → payoff
"""

import os, sys, time, requests, jwt, gc, subprocess, shutil
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


# ─── "If This Song Was a Painting" — Emotion-First Shorts ────────

SHORTS = [
    {
        "id": "short-16-interstellar",
        "song": "Interstellar Main Theme (S.T.A.Y.) — Hans Zimmer",
        "music_start": "3:30",
        "music_note": "Organ crescendo begins — the emotional peak of the entire score",
        "lyrics": "(instrumental)",
        "hook_text": "If Interstellar was the last\nthing you ever saw...",
        "yt_title": "If Interstellar was the last thing you ever saw... 🕳️",
        "yt_desc": "Hans Zimmer didn't write music. He wrote a feeling. #interstellar #hansZimmer #aiart #shorts",
        "prompt": (
            "Cinematic vertical video, profound emotional journey with multi-scene transitions. "
            "Scene 1: A lone astronaut floats in complete darkness. Only the reflection of a distant pale blue dot "
            "(Earth) is visible in their helmet visor. Slowly rotating. Complete silence made visible. "
            "The astronaut reaches a gloved hand toward Earth. Desperate, gentle. Extreme close-up of the visor. "
            "Scene 2: Inside the helmet reflection, we see a memory — a small girl running through a wheat field "
            "at golden hour, laughing, turning back to wave. The image ripples like water. "
            "The astronaut's hand presses against the visor, trying to touch the memory. "
            "Tears float in zero gravity, catching starlight. Heartbreaking intimacy. "
            "Scene 3: Camera pulls back rapidly. The astronaut is tiny against an enormous glowing wormhole — "
            "a sphere of bent light and impossible geometry. Rings of fire and ice spiral around it. "
            "The scale is overwhelming. The astronaut drifts toward it, arms spread, surrendering to the unknown. "
            "Cosmic awe mixed with human vulnerability. "
            "Scene 4: Through the wormhole — an infinite library of light. Bookshelves stretching into every dimension. "
            "Points of light pulse like heartbeats. The astronaut floats through, and their hand finally touches "
            "one point of light — and it glows warm gold. Connection across time and space. "
            "A single tear floats upward, reflecting everything. "
            "Deep space blues, warm gold accents, cosmic scale. Photorealistic with Kubrick-level precision. "
            "Emotional devastation through visual poetry."
        ),
    },
    {
        "id": "short-17-everybody-wants-to-rule",
        "song": "Everybody Wants to Rule the World — Tears for Fears",
        "music_start": "0:42",
        "music_note": "First chorus: 'Everybody wants to rule the world' — iconic 80s synth swell",
        "lyrics": "Everybody wants to rule the world",
        "hook_text": "Play this at\nthe end of the world 🌅",
        "yt_title": "Play this at the end of the world 🌅",
        "yt_desc": "Some songs hit different when the world is ending. #80smusic #endoftheworld #tearsforFears #aiart #shorts",
        "prompt": (
            "Cinematic vertical video, bittersweet apocalyptic beauty with multi-scene transitions. "
            "Scene 1: A young person sits alone on the edge of a skyscraper rooftop, legs dangling over the city. "
            "Sunset light is impossibly golden. Below, the city is empty — no cars, no people, just golden light "
            "pouring through abandoned streets. Wind gently moves their hair. They look peaceful, not afraid. "
            "Vintage film quality, 1980s color palette — warm oranges, dusty pinks. "
            "Scene 2: Camera slowly turns to reveal the horizon. The sun is enormous, three times normal size, "
            "setting behind the skyline. Clouds are lit up in layers of gold, pink, and purple. "
            "Skyscrapers cast impossibly long shadows. Flocks of birds fly in murmuration patterns across the giant sun. "
            "Everything is beautiful precisely because it's the last time. "
            "Scene 3: The person stands up, puts on vintage headphones, closes their eyes, and begins to sway — "
            "a tiny figure against the massive sunset. Wind picks up, carrying autumn leaves and pages of books "
            "upward past them into the sky. Their silhouette is perfect against the dying light. "
            "Scene 4: Camera rises high above. The whole city is visible — beautiful, golden, empty, peaceful. "
            "The tiny figure still dances alone on the rooftop. Stars begin appearing in the darkening sky above "
            "while the sunset still burns at the horizon. The world ends not with a bang but with a dance. "
            "Warm 80s color grade: amber, dusty rose, golden hour everything. Photorealistic with nostalgic grain. "
            "Melancholy beauty. Every frame a photograph you'd frame."
        ),
    },
    {
        "id": "short-18-experience-einaudi",
        "song": "Experience — Ludovico Einaudi",
        "music_start": "2:08",
        "music_note": "Strings enter — the emotional explosion moment. Piano + full orchestra.",
        "lyrics": "(instrumental)",
        "hook_text": "The song that makes\nstrangers cry on the subway 🚇",
        "yt_title": "The song that makes strangers cry on the subway 🚇",
        "yt_desc": "Ludovico Einaudi wrote everyone's memories. #experience #einaudi #emotional #aiart #shorts",
        "prompt": (
            "Cinematic vertical video, deeply emotional human story with multi-scene transitions. "
            "Scene 1: Interior of a late-night subway car. Harsh fluorescent light. A few passengers: "
            "everyone on their phones, disconnected. One elderly man sits alone by the window, eyes closed, "
            "hands folded on a walking cane. His face is weathered but peaceful. Subtle camera push toward him. "
            "Ultra-realistic lighting, slightly desaturated like real subway. "
            "Scene 2: As we push closer to his face, the subway window behind him transforms — "
            "it becomes a screen showing memories in watercolor-like motion. A young couple dancing in the rain "
            "on a Paris street. Laughing, spinning, completely alive. The colors bleed warm into the cold subway car. "
            "The old man's lips curl into a faint smile, eyes still closed. "
            "Scene 3: The memory shifts — a woman holding a newborn baby. Morning light through a hospital window. "
            "Her face is exhausted but radiant. A young man's hand (his) reaches into frame to touch the baby's cheek. "
            "The old man's hand tightens slightly on his cane. A single tear traces down his weathered cheek. "
            "Warm golden light leaks from the memory window into the subway. "
            "Scene 4: The old man opens his eyes. The memories fade back to a dark subway window. "
            "He catches the reflection of a young couple sitting across from him, the girl's head on the boy's shoulder. "
            "He smiles — really smiles — with knowing, with acceptance, with a lifetime of love behind his eyes. "
            "The train enters a station, light floods in. Beautiful. "
            "Contrast between cold subway reality and warm golden memories. Photorealistic with emotional depth. "
            "Every detail tells a story. Intimate, devastating, hopeful."
        ),
    },
    {
        "id": "short-19-creep-radiohead",
        "song": "Creep — Radiohead",
        "music_start": "2:30",
        "music_note": "Guitar explosion: 'What the hell am I doing here? I don't belong here' — cathartic release",
        "lyrics": "What the hell am I doing here?\nI don't belong here",
        "hook_text": "POV: You finally left the party\nyou didn't belong at 🚪",
        "yt_title": "POV: You finally left the party you didn't belong at 🚪",
        "yt_desc": "For everyone who's ever felt like a creep. You're not. #radiohead #creep #introvert #pov #shorts",
        "prompt": (
            "Cinematic vertical video, cathartic emotional release with multi-scene transitions. POV style. "
            "Scene 1: POV shot pushing through a crowded house party. Blurred faces, loud chaos implied by "
            "flashing colored lights. Everyone is laughing, talking, connected — but we move through them like a ghost. "
            "No one makes eye contact with the camera/viewer. Shallow depth of field, faces blur past. "
            "Claustrophobic, overwhelming, isolating despite the crowd. Neon party lights, hazy atmosphere. "
            "Scene 2: A hand (our hand, POV) pushes open a heavy door. The noise and light cut instantly. "
            "We step outside into a quiet, empty street at 2 AM. The door closes behind us. "
            "Sudden silence. Cold night air visible as breath. The contrast is immediate and powerful. "
            "Street lamps cast long amber pools of light on wet pavement. Relief. "
            "Scene 3: We walk down the empty street. With each step, the shoulders visibly relax. "
            "Streetlights flicker on one by one ahead, as if the city is lighting a path just for us. "
            "Puddles reflect the lights like scattered stars on the ground. The camera/walking pace becomes confident. "
            "A slight upward tilt — looking at the night sky between buildings. Stars visible. Breathing space. "
            "Scene 4: We stop in the middle of an empty intersection. Look up. The night sky opens up — "
            "an impossible canopy of stars visible between dark buildings. Arms spread slightly at our sides. "
            "Wind rustles a jacket. A slight smile reflected in a dark shop window. "
            "Alone, but not lonely. Free. The right kind of alone. "
            "Cool blue-amber night palette. Photorealistic urban cinematography. "
            "Emotional arc from claustrophobia to liberation. POV intimacy."
        ),
    },
    {
        "id": "short-20-time-inception",
        "song": "Time — Hans Zimmer (Inception)",
        "music_start": "3:07",
        "music_note": "Piano motif accelerates into full orchestra — the 'waking up' crescendo",
        "lyrics": "(instrumental)",
        "hook_text": "The sound of waking up from\na dream you wanted to stay in 💭",
        "yt_title": "The sound of waking up from a dream you wanted to stay in 💭",
        "yt_desc": "Hans Zimmer made us feel something we couldn't name. #inception #time #hansZimmer #dreams #shorts",
        "prompt": (
            "Cinematic vertical video, dreamy to real emotional journey with multi-scene transitions. "
            "Scene 1: A person walks through an impossible dream city. Buildings fold upward like pages of a book. "
            "Streets curve into the sky. Everything is bathed in warm amber light. Cherry blossoms fall upward. "
            "The person touches a wall and it ripples like water. They smile, at peace. Beautiful, surreal architecture. "
            "Scene 2: Cracks of white light begin appearing in the dream world. Tiny at first — "
            "in the walls, the sky, the ground. The person notices. They try to hold onto things — "
            "a railing, a doorframe — but their hand passes through. The world is dissolving. "
            "Urgency mixed with sorrow. Golden light leaks through every crack. "
            "Scene 3: The dream world shatters into millions of luminous fragments that float upward "
            "like inverse snow. The person stands in a void of white light as the last pieces of the dream "
            "dissolve around them — a familiar face, a childhood home, a moment of joy — all becoming particles of light. "
            "They reach for the last fragment: a loved one's hand. Their fingers almost touch "
            "before it dissolves into gold dust. "
            "Scene 4: Hard cut to reality. Eyes open in a bed. Morning light streams through curtains. "
            "Ordinary room. The person lies still for a moment, hand still slightly reaching upward. "
            "Then slowly lowers it to their chest. A breath. The smallest, saddest, most human smile. "
            "They turn to look at the window — golden morning light identical to the dream light. "
            "Maybe it wasn't just a dream. "
            "Dream world: warm amber and impossible gold. Reality: soft natural morning light. "
            "Photorealistic with Inception-level visual ambition. Emotional gut-punch ending."
        ),
    },
]

# ─── Text overlay config per short ────────────────────────────────

HOOK_STYLE = {
    "fontsize": 52,
    "fontcolor": "white",
    "borderw": 3,
    "font": "/System/Library/Fonts/Helvetica.ttc",
    "duration": 2.5,  # seconds to show hook text
    "fade_in": 0.3,
    "fade_out": 0.5,
    "y_position": "h*0.12",  # near top
}


def add_text_overlay(input_path, output_path, hook_text):
    """Add hook text overlay to the first 2.5 seconds using ffmpeg drawtext"""
    lines = hook_text.split("\n")
    filters = []
    
    for i, line in enumerate(lines):
        escaped = line.replace("'", "'\\''").replace(":", "\\:")
        y_offset = f"({HOOK_STYLE['y_position']})+{i * 65}"
        f = (
            f"drawtext=text='{escaped}'"
            f":fontfile={HOOK_STYLE['font']}"
            f":fontsize={HOOK_STYLE['fontsize']}"
            f":fontcolor={HOOK_STYLE['fontcolor']}"
            f":borderw={HOOK_STYLE['borderw']}"
            f":bordercolor=black@0.6"
            f":x=(w-text_w)/2"
            f":y={y_offset}"
            f":enable='between(t,0.2,{HOOK_STYLE['duration']})'"
            f":alpha='if(lt(t,0.5),t/0.3,if(gt(t,{HOOK_STYLE['duration']-0.5}),(({HOOK_STYLE['duration']}-t)/0.5),1))'"
        )
        filters.append(f)
    
    filter_chain = ",".join(filters)
    
    cmd = [
        "ffmpeg", "-y", "-i", str(input_path),
        "-vf", filter_chain,
        "-c:a", "copy", "-c:v", "libx264", "-crf", "18",
        str(output_path)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        mb = os.path.getsize(output_path) / 1024 / 1024
        print(f"  🎬 Text overlay: {output_path} ({mb:.1f} MB)")
        return True
    else:
        print(f"  ⚠️ ffmpeg error: {result.stderr[-200:]}")
        return False


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
    dest = Path.home() / "Library/Mobile Documents/com~apple~CloudDocs/Aaron-Studio/shorts-ready"
    dest.mkdir(parents=True, exist_ok=True)
    for f in files:
        shutil.copy2(f, dest / f.name)
        print(f"  ☁️ Synced: {f.name}")


def main():
    print("🎬 Batch 04 — 'If This Song Was a Painting' Series")
    print(f"   Model: kling-v3 pro | 15s | multi_shot intelligence | 9:16")
    print(f"   Shorts: {len(SHORTS)}")
    print(f"   Strategy: Emotion-first hooks + text overlay\n")

    completed_raw = []
    completed_overlay = []

    for i, s in enumerate(SHORTS):
        print(f"\n{'='*60}")
        print(f"[{i+1}/{len(SHORTS)}] 🎵 {s['song']}")
        print(f"   Hook: \"{s['hook_text'].replace(chr(10), ' | ')}\"")

        raw_out = OUTPUT_DIR / f"{s['id']}.mp4"
        overlay_out = OUTPUT_DIR / f"{s['id']}-hook.mp4"

        # Skip if overlay version already exists
        if overlay_out.exists():
            print(f"  ⏭️ Already complete")
            completed_overlay.append(overlay_out)
            continue

        # Generate raw video if needed
        if not raw_out.exists():
            task_id = submit(s["prompt"])
            if not task_id:
                continue
            print(f"  ✅ Task: {task_id}")

            result = wait_task(task_id)
            if result and result.get("task_result", {}).get("videos"):
                download(result["task_result"]["videos"][0]["url"], str(raw_out))
                completed_raw.append(raw_out)
            else:
                print(f"  ⚠️ No output")
                continue
        else:
            print(f"  ⏭️ Raw exists, adding overlay...")
            completed_raw.append(raw_out)

        # Add text overlay
        if add_text_overlay(raw_out, overlay_out, s["hook_text"]):
            completed_overlay.append(overlay_out)

        gc.collect()
        # Brief pause between generations
        if i < len(SHORTS) - 1 and not raw_out.exists():
            print(f"  ⏳ Cooling 30s...")
            time.sleep(30)

    # Sync all to iCloud
    all_files = completed_raw + completed_overlay
    if all_files:
        print(f"\n{'='*60}")
        print("☁️ Syncing to iCloud Drive...")
        sync_to_icloud(all_files)

    # Print summary
    print(f"\n\n{'='*60}")
    print(f"🎬 BATCH 04 COMPLETE: {len(completed_overlay)}/{len(SHORTS)} with hook overlay")
    print(f"\n📋 Upload Guide:\n")

    for s in SHORTS:
        raw = OUTPUT_DIR / f"{s['id']}.mp4"
        overlay = OUTPUT_DIR / f"{s['id']}-hook.mp4"
        status = "✅" if overlay.exists() else ("⚙️ raw only" if raw.exists() else "❌")

        print(f"  {status} {s['id']}")
        print(f"     📹 File: {s['id']}-hook.mp4")
        print(f"     📝 Title: {s['yt_title']}")
        print(f"     📄 Desc: {s['yt_desc']}")
        print(f"     🎵 Song: {s['song']}")
        print(f"     ⏱️  Start music at: {s['music_start']}")
        if s['lyrics'] != "(instrumental)":
            print(f"     🎤 Key lyrics: {s['lyrics']}")
        print(f"     💡 Note: {s['music_note']}")
        print()


if __name__ == "__main__":
    main()
