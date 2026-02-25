#!/usr/bin/env python3
"""
Knowledge Short v2 — Kling v3 video + ElevenLabs narration + ffmpeg subtitles
"""

import os, sys, time, json, requests, jwt, subprocess, base64
from pathlib import Path
from dotenv import load_dotenv

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)

load_dotenv(Path(__file__).parents[3] / ".baoyu-skills" / ".env", override=True)
load_dotenv(Path("/Users/aaron/Work/aaron-studio/src/content/shorts/prototype-01/.env"), override=True)

ACCESS_KEY = os.getenv("KLING_ACCESS_KEY")
SECRET_KEY = os.getenv("KLING_SECRET_KEY")
ELEVENLABS_KEY = os.getenv("ELEVEN_LABS") or os.getenv("ELEVENLABS_API_KEY")
API_BASE = "https://api-beijing.klingai.com/v1"
VOICE_ID = "991lF4hc0xxfec4Y6B0i"  # Henry

BASE_DIR = Path(__file__).parent
OUTPUT = BASE_DIR / "short-knowledge-01-v2.mp4"

# ─── Content ──────────────────────────────────────────────────────

NARRATION = (
    "Every time you ask ChatGPT a question, "
    "it uses ten times more electricity than a Google search. "
    "One query burns about three watt-hours. Google? Just zero point three. "
    "If everyone switched from Google to AI, "
    "we'd need several new power plants just to keep the lights on. "
    "Your AI assistant has a bigger electricity bill than your fridge."
)

VIDEO_PROMPT = (
    "Cinematic vertical video, dramatic tech documentary style. "
    "Scene 1: Extreme close-up of a glowing AI chip, electric sparks dancing across its surface. "
    "Blue neon light. Camera slowly pulls back to reveal rows of massive GPU server racks "
    "in a dark data center, LEDs blinking like a city at night. Heat waves visible. "
    "Scene 2: Smooth transition to an enormous power plant at dusk. "
    "Massive cooling towers billowing white steam into an orange sunset sky. "
    "Thick power cables stretch from the plant toward the horizon. "
    "Drone shot slowly rising to reveal the scale — the plant stretches endlessly. "
    "Scene 3: Split visual — on one side, a single phone screen glowing with a ChatGPT interface. "
    "On the other side, an entire power grid lighting up, electricity arcing through transformers. "
    "The contrast between the tiny device and massive infrastructure. "
    "Scene 4: Camera rises high above a city at night. Every window, every screen glows. "
    "Power lines pulse with visible electricity flowing toward data centers on the horizon. "
    "The scale is overwhelming — the invisible cost of every question we ask. "
    "Dark moody cinematography, deep blues and electric oranges. Photorealistic. Ominous but beautiful."
)

HOOK_TEXT = "Your AI's electricity bill\nis bigger than your fridge ⚡"

YT_TITLE = "Your AI uses 10x more electricity than Google ⚡"
YT_DESC = "Every ChatGPT query burns 10x more power than a Google search. #ai #chatgpt #funfact #shorts"


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
        "duration": "10",
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
    audio_path = BASE_DIR / "narration-v2.mp3"
    timings_path = BASE_DIR / "timings-v2.json"

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
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "speed": 1.15},
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
        print(f"  📝 {len(words)} words with timings")
        return audio_path, words
    else:
        # Fallback: no timestamps
        print(f"  ⚠️ No timestamps, using streaming endpoint")
        url2 = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
        resp2 = requests.post(url2, headers={
            "xi-api-key": ELEVENLABS_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }, json={
            "text": NARRATION,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "speed": 1.15},
        }, timeout=60)
        audio_path.write_bytes(resp2.content)

        probe = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", str(audio_path)],
            capture_output=True, text=True
        )
        total_dur = float(probe.stdout.strip())
        narr_words = NARRATION.split()
        t_per_w = total_dur / len(narr_words)
        words = [{"word": w, "start": i * t_per_w, "end": (i + 1) * t_per_w} for i, w in enumerate(narr_words)]
        timings_path.write_text(json.dumps(words, indent=2))
        return audio_path, words


# ─── ffmpeg compose ───────────────────────────────────────────────

def build_subtitle_filter(words, max_words=4):
    lines = []
    for i in range(0, len(words), max_words):
        group = words[i:i + max_words]
        text = " ".join(w["word"] for w in group)
        start = group[0]["start"]
        end = group[-1]["end"] + 0.2
        lines.append({"text": text, "start": start, "end": end})

    filters = []
    for line in lines:
        escaped = line["text"].replace("'", "'\\''").replace(":", "\\:").replace("%", "\\%")
        f = (
            f"drawtext=text='{escaped}'"
            f":fontfile=/System/Library/Fonts/Helvetica.ttc"
            f":fontsize=52"
            f":fontcolor=white"
            f":borderw=4"
            f":bordercolor=black@0.8"
            f":x=(w-text_w)/2"
            f":y=h*0.78"
            f":enable='between(t,{line['start']:.2f},{line['end']:.2f})'"
        )
        filters.append(f)

    # Hook text in first 3 seconds
    for i, hookline in enumerate(HOOK_TEXT.split("\n")):
        escaped = hookline.replace("'", "'\\''").replace(":", "\\:")
        y_off = f"(h*0.12)+{i * 70}"
        f = (
            f"drawtext=text='{escaped}'"
            f":fontfile=/System/Library/Fonts/Helvetica.ttc"
            f":fontsize=56"
            f":fontcolor=white"
            f":borderw=4"
            f":bordercolor=black@0.7"
            f":x=(w-text_w)/2"
            f":y={y_off}"
            f":enable='between(t,0.2,3.0)'"
        )
        filters.append(f)

    return ",".join(filters)


def compose(video_path, audio_path, words):
    print("🎬 Composing final video...")

    # Get audio duration
    probe = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", str(audio_path)],
        capture_output=True, text=True
    )
    audio_dur = float(probe.stdout.strip())

    subtitle_filter = build_subtitle_filter(words)

    # Video + narration audio + subtitles + hook text
    cmd = [
        "ffmpeg", "-y",
        "-i", str(video_path),
        "-i", str(audio_path),
        "-vf", subtitle_filter,
        "-map", "0:v", "-map", "1:a",
        "-c:v", "libx264", "-crf", "18",
        "-c:a", "aac", "-b:a", "128k",
        "-t", str(audio_dur + 0.5),
        "-pix_fmt", "yuv420p",
        str(OUTPUT),
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        mb = os.path.getsize(OUTPUT) / 1024 / 1024
        print(f"✅ Output: {OUTPUT.name} ({mb:.1f} MB)")
        return True
    else:
        print(f"❌ ffmpeg error: {result.stderr[-500:]}")
        return False


# ─── Main ─────────────────────────────────────────────────────────

def main():
    print("🧠 Knowledge Short v2: Kling AI + ElevenLabs + Subtitles\n")

    video_path = BASE_DIR / "kling-video.mp4"

    # Step 1: Generate Kling video
    if video_path.exists():
        print(f"⏭️ Kling video cached: {video_path.name}")
    else:
        print("🎬 Submitting to Kling v3...")
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

    # Step 2: Generate TTS
    audio_path, words = generate_tts()

    # Step 3: Compose
    if compose(video_path, audio_path, words):
        # Copy to iCloud
        import shutil
        dest = Path.home() / "Library/Mobile Documents/com~apple~CloudDocs/Aaron-Studio/shorts-ready"
        dest.mkdir(parents=True, exist_ok=True)
        shutil.copy2(OUTPUT, dest / OUTPUT.name)
        print(f"☁️ Synced to iCloud")

        print(f"\n📋 YouTube Upload:")
        print(f"  📹 File: {OUTPUT.name}")
        print(f"  📝 Title: {YT_TITLE}")
        print(f"  📄 Desc: {YT_DESC}")


if __name__ == "__main__":
    main()
