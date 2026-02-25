#!/usr/bin/env python3
"""
15-second knowledge short generator.
ElevenLabs TTS → ffmpeg (background image + word-level subtitles) → 9:16 MP4
"""

import os, json, requests, subprocess
from pathlib import Path

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = "991lF4hc0xxfec4Y6B0i"  # Henry
BASE_DIR = Path(__file__).parent
OUTPUT = BASE_DIR / "short-knowledge-01.mp4"
BG_IMAGE = BASE_DIR / "bg.png"

# The narration — tight 15 seconds
NARRATION = (
    "Every time you ask ChatGPT a question, "
    "it uses ten times more electricity than a Google search. "
    "One query burns about three watt-hours. Google? Just zero point three. "
    "If everyone switched from Google to AI, "
    "we'd need several new power plants just to keep the lights on. "
    "Your AI assistant has a bigger electricity bill than your fridge."
)


def generate_tts():
    """Generate TTS with word-level timestamps via ElevenLabs."""
    audio_path = BASE_DIR / "narration.mp3"
    timings_path = BASE_DIR / "timings.json"

    if audio_path.exists() and timings_path.exists():
        print("⏭️ TTS cached, skipping")
        return audio_path, json.loads(timings_path.read_text())

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps"
    resp = requests.post(url, headers={
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
    }, json={
        "text": NARRATION,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "speed": 1.15},
        "output_format": "mp3_44100_128",
    }, timeout=60)

    data = resp.json()

    if "audio_base64" not in data:
        print(f"⚠️ API response keys: {list(data.keys())}")
        # Try direct streaming endpoint instead
        url2 = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
        resp2 = requests.post(url2, headers={
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }, json={
            "text": NARRATION,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "speed": 1.15},
        }, timeout=60)
        audio_path.write_bytes(resp2.content)
        print(f"💾 Audio (no timings): {audio_path} ({len(resp2.content)/1024:.0f} KB)")
        # Generate approximate word timings from audio duration
        probe = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
             "-of", "csv=p=0", str(audio_path)],
            capture_output=True, text=True
        )
        total_dur = float(probe.stdout.strip())
        narr_words = NARRATION.split()
        time_per_word = total_dur / len(narr_words)
        words = []
        for i, w in enumerate(narr_words):
            words.append({"word": w, "start": i * time_per_word, "end": (i + 1) * time_per_word})
        timings_path.write_text(json.dumps(words, indent=2))
        return audio_path, words

    # Save audio
    import base64
    audio_bytes = base64.b64decode(data["audio_base64"])
    audio_path.write_bytes(audio_bytes)
    print(f"💾 Audio: {audio_path} ({len(audio_bytes)/1024:.0f} KB)")

    # Extract word timings
    alignment = data.get("alignment", {})
    chars = alignment.get("characters", [])
    char_starts = alignment.get("character_start_times_seconds", [])
    char_ends = alignment.get("character_end_times_seconds", [])

    # Build word timings from character timings
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
    print(f"📝 Timings: {len(words)} words")
    return audio_path, words


def build_subtitle_filter(words, max_words=5):
    """Build ffmpeg drawtext filter chain for word-by-word subtitles."""
    # Group words into lines
    lines = []
    for i in range(0, len(words), max_words):
        group = words[i:i + max_words]
        text = " ".join(w["word"] for w in group)
        start = group[0]["start"]
        end = group[-1]["end"] + 0.3
        lines.append({"text": text, "start": start, "end": end})

    filters = []
    for line in lines:
        escaped = line["text"].replace("'", "'\\''").replace(":", "\\:").replace("%", "\\%")
        f = (
            f"drawtext=text='{escaped}'"
            f":fontfile=/System/Library/Fonts/Helvetica.ttc"
            f":fontsize=48"
            f":fontcolor=white"
            f":borderw=3"
            f":bordercolor=black@0.7"
            f":x=(w-text_w)/2"
            f":y=h*0.75"
            f":enable='between(t,{line['start']:.2f},{line['end']:.2f})'"
        )
        filters.append(f)

    return ",".join(filters)


def render_video(audio_path, words):
    """Render 9:16 video with bg image + audio + word subtitles."""
    # Get audio duration
    probe = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(audio_path)],
        capture_output=True, text=True
    )
    duration = float(probe.stdout.strip()) + 0.5

    subtitle_filter = build_subtitle_filter(words)

    # Scale bg image to 1080x1920 (9:16) and add subtitles
    vf = f"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,{subtitle_filter}"

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(BG_IMAGE),
        "-i", str(audio_path),
        "-vf", vf,
        "-c:v", "libx264", "-crf", "18",
        "-c:a", "aac", "-b:a", "128k",
        "-t", str(duration),
        "-pix_fmt", "yuv420p",
        "-shortest",
        str(OUTPUT),
    ]

    print(f"🎬 Rendering {duration:.1f}s video...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        mb = os.path.getsize(OUTPUT) / 1024 / 1024
        print(f"✅ Output: {OUTPUT} ({mb:.1f} MB)")
    else:
        print(f"❌ ffmpeg error: {result.stderr[-500:]}")


def main():
    print("🧠 Knowledge Short #01: GPT vs Google Electricity\n")
    audio_path, words = generate_tts()
    render_video(audio_path, words)

    print(f"\n📋 YouTube Upload Info:")
    print(f"  📹 File: short-knowledge-01.mp4")
    print(f"  📝 Title: Your AI uses 10x more electricity than Google ⚡")
    print(f"  📄 Desc: Every ChatGPT query burns 10x more power than a Google search. #ai #chatgpt #funfact #shorts")
    print(f"  🏷️ Tags: ai, chatgpt, electricity, google, fun facts, tech facts")


if __name__ == "__main__":
    main()
