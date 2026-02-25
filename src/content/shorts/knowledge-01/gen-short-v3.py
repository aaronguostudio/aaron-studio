#!/usr/bin/env python3
"""
Knowledge Short v3 — Kling v3 15s + ElevenLabs 15s + Remotion
Fixes: 15s video, 24fps match, shorter narration, English title, OffthreadVideo
"""

import os, sys, time, json, requests, jwt, subprocess, base64, shutil
from pathlib import Path
from dotenv import load_dotenv

sys.stdout.reconfigure(line_buffering=True)

load_dotenv(Path("/Users/aaron/Work/aaron-studio/.baoyu-skills/.env"), override=True)
load_dotenv(Path("/Users/aaron/Work/aaron-studio/src/content/shorts/prototype-01/.env"), override=True)

ACCESS_KEY = os.getenv("KLING_ACCESS_KEY")
SECRET_KEY = os.getenv("KLING_SECRET_KEY")
ELEVENLABS_KEY = os.getenv("ELEVEN_LABS") or os.getenv("ELEVENLABS_API_KEY")
API_BASE = "https://api-beijing.klingai.com/v1"
VOICE_ID = "991lF4hc0xxfec4Y6B0i"  # Henry

BASE_DIR = Path(__file__).parent
REMOTION_DIR = Path("/Users/aaron/Work/aaron-studio/tiles/aaron-video-gen/remotion")
PUBLIC_DIR = REMOTION_DIR / "public"

# ─── Content (shorter narration to fit ~13-14s audio in 15s video) ─

TITLE = "How Much Power Does AI Use? ⚡"

NARRATION = (
    "Every ChatGPT query uses ten times more electricity than a Google search. "
    "One prompt burns three watt-hours. Google? Just zero point three. "
    "If everyone switched to AI, we'd need new power plants just to keep up. "
    "Your AI has a bigger electricity bill than your fridge."
)

VIDEO_PROMPT = (
    "Cinematic vertical video, dramatic tech documentary style with multi-scene transitions. "
    "Scene 1: Extreme close-up of a glowing AI chip with electric sparks dancing across its surface. "
    "Blue neon light. Camera slowly pulls back revealing massive GPU server racks in a dark data center, "
    "thousands of LEDs blinking like a city at night. Heat waves shimmer in the air. "
    "Scene 2: Smooth transition to an enormous power plant at dusk. Massive cooling towers "
    "billowing white steam into a dramatic orange sunset sky. Drone shot slowly rising to reveal scale. "
    "Thick power cables stretch toward the horizon. Overwhelming industrial beauty. "
    "Scene 3: A single glowing phone screen showing a chat interface, held in a hand. "
    "Behind it, an entire city power grid pulses with visible electricity flowing through transformers. "
    "The contrast between tiny device and massive infrastructure is striking. "
    "Scene 4: Aerial shot of a city at night. Every screen glows. Power lines pulse with energy "
    "flowing toward massive data centers on the horizon. The invisible cost of every question. "
    "Dark moody cinematography, deep blues and electric oranges. Photorealistic. Ominous but beautiful."
)

YT_TITLE = "Your AI uses 10x more electricity than Google ⚡"
YT_DESC = "Every ChatGPT query burns 10x more power than a Google search. #ai #chatgpt #funfact #tech #shorts"


# ─── Kling API ────────────────────────────────────────────────────

def get_token():
    now = int(time.time())
    return jwt.encode(
        {"iss": ACCESS_KEY, "exp": now + 1800, "nbf": now - 5},
        SECRET_KEY, algorithm="HS256",
        headers={"alg": "HS256", "typ": "JWT"},
    )

def kling_headers():
    return {"Content-Type": "application/json", "Authorization": f"Bearer {get_token()}"}

def submit_video():
    payload = {
        "model_name": "kling-v3",
        "prompt": VIDEO_PROMPT,
        "cfg_scale": 0.5,
        "mode": "pro",
        "duration": "15",  # 15 seconds!
        "aspect_ratio": "9:16",
        "multi_shot": "true",
        "shot_type": "intelligence",
    }
    for attempt in range(5):
        resp = requests.post(f"{API_BASE}/videos/text2video", headers=kling_headers(), json=payload, timeout=120)
        data = resp.json()
        if data.get("code") == 0:
            return data["data"]["task_id"]
        if data.get("code") == 1303:
            wait = 30 * (attempt + 1)
            print(f"  ⏳ Queue full, waiting {wait}s...")
            time.sleep(wait)
            continue
        print(f"  ❌ Error: {data}")
        return None
    return None

def wait_task(task_id, max_wait=900):
    elapsed = 0
    while elapsed < max_wait:
        try:
            resp = requests.get(f"{API_BASE}/videos/text2video/{task_id}", headers=kling_headers(), timeout=30)
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
    return None

def download(url, path):
    resp = requests.get(url, stream=True, timeout=120)
    with open(path, "wb") as f:
        for chunk in resp.iter_content(8192):
            f.write(chunk)
    mb = os.path.getsize(path) / 1024 / 1024
    print(f"  💾 {path.name} ({mb:.1f} MB)")


# ─── ElevenLabs TTS ──────────────────────────────────────────────

def generate_tts():
    audio_path = BASE_DIR / "narration-v3.mp3"
    timings_path = BASE_DIR / "timings-v3.json"

    if audio_path.exists() and timings_path.exists():
        print("⏭️ TTS cached")
        return audio_path, json.loads(timings_path.read_text())

    print("🎙️ Generating TTS...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps"
    resp = requests.post(url, headers={
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
    }, json={
        "text": NARRATION,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "speed": 1.2},
        "output_format": "mp3_44100_128",
    }, timeout=60)

    data = resp.json()

    if "audio_base64" in data:
        audio_bytes = base64.b64decode(data["audio_base64"])
        audio_path.write_bytes(audio_bytes)
        print(f"  💾 Audio: {len(audio_bytes)/1024:.0f} KB")

        alignment = data.get("alignment", {})
        chars = alignment.get("characters", [])
        char_starts = alignment.get("character_start_times_seconds", [])
        char_ends = alignment.get("character_end_times_seconds", [])

        words = []
        current_word = ""
        word_start = None
        word_end = None
        for i, ch in enumerate(chars):
            if ch == " ":
                if current_word:
                    words.append({"word": current_word, "start": word_start, "end": word_end})
                    current_word = ""
                    word_start = None
            else:
                if word_start is None:
                    word_start = char_starts[i]
                word_end = char_ends[i]
                current_word += ch
        if current_word:
            words.append({"word": current_word, "start": word_start, "end": word_end})

        timings_path.write_text(json.dumps(words, indent=2))
        
        # Check duration
        dur = words[-1]["end"] if words else 0
        print(f"  📝 {len(words)} words, audio ends at {dur:.1f}s")
        return audio_path, words
    else:
        print(f"  ❌ ElevenLabs error: {data.get('detail', data)}")
        sys.exit(1)


# ─── Remotion Render ──────────────────────────────────────────────

def render_with_remotion(video_path, audio_path, words):
    print("🎬 Preparing Remotion render...")
    
    # Get actual audio duration
    probe = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", str(audio_path)],
        capture_output=True, text=True
    )
    audio_dur = float(probe.stdout.strip())
    
    # Get video fps
    probe_v = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", str(video_path)],
        capture_output=True, text=True
    )
    video_fps = probe_v.stdout.strip().split("/")
    fps = int(video_fps[0]) // int(video_fps[1]) if len(video_fps) == 2 else 24
    print(f"  📐 Video fps: {fps}, Audio duration: {audio_dur:.1f}s")
    
    # Duration = audio + 0.5s padding
    duration_sec = audio_dur + 0.5
    
    # Copy assets to Remotion public dir
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(video_path, PUBLIC_DIR / "ks-video.mp4")
    shutil.copy2(audio_path, PUBLIC_DIR / "ks-narration.mp3")
    
    # Write props
    props = {
        "title": TITLE,
        "videoFile": "ks-video.mp4",
        "audioFile": "ks-narration.mp3",
        "wordTimings": words,
        "fps": fps,
        "durationSec": duration_sec,
    }
    props_file = PUBLIC_DIR / "ks-props.json"
    props_file.write_text(json.dumps(props))
    
    output_path = BASE_DIR / "short-knowledge-01-v3.mp4"
    
    print(f"  🎬 Rendering {duration_sec:.1f}s @ {fps}fps (1080x1920)...")
    
    cmd = [
        "npx", "remotion", "render", "src/index.ts", "KnowledgeShort",
        str(output_path),
        f"--props={props_file}",
        "--codec=h264", "--crf=18", "--concurrency=50%",
    ]
    
    result = subprocess.run(cmd, cwd=str(REMOTION_DIR), capture_output=True, text=True)
    
    if result.returncode == 0:
        mb = os.path.getsize(output_path) / 1024 / 1024
        print(f"✅ Output: {output_path.name} ({mb:.1f} MB)")
        
        # Sync to iCloud
        dest = Path.home() / "Library/Mobile Documents/com~apple~CloudDocs/Aaron-Studio/shorts-ready"
        dest.mkdir(parents=True, exist_ok=True)
        shutil.copy2(output_path, dest / output_path.name)
        print(f"☁️ Synced to iCloud")
        
        print(f"\n📋 YouTube Upload:")
        print(f"  📹 File: {output_path.name}")
        print(f"  📝 Title: {YT_TITLE}")
        print(f"  📄 Desc: {YT_DESC}")
        return True
    else:
        print(f"❌ Render failed")
        # Show last 500 chars of error
        err = (result.stderr or result.stdout)[-500:]
        print(err)
        return False


# ─── Main ─────────────────────────────────────────────────────────

def main():
    print("🧠 Knowledge Short v3: 15s Kling + ElevenLabs + Remotion\n")

    video_path = BASE_DIR / "kling-video-15s.mp4"

    # Step 1: Generate 15s Kling video
    if video_path.exists():
        print(f"⏭️ Kling video cached: {video_path.name}")
    else:
        print("🎬 Submitting to Kling v3 (15s, pro)...")
        task_id = submit_video()
        if not task_id:
            print("❌ Failed to submit")
            return
        print(f"  ✅ Task: {task_id}")

        result = wait_task(task_id)
        if result and result.get("task_result", {}).get("videos"):
            download(result["task_result"]["videos"][0]["url"], video_path)
        else:
            print("❌ No video output")
            return

    # Step 2: Generate TTS (~14s target)
    audio_path, words = generate_tts()

    # Step 3: Render with Remotion
    render_with_remotion(video_path, audio_path, words)


if __name__ == "__main__":
    main()
