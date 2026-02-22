#!/usr/bin/env python3
"""Generate voiceover segments for Video 001 using ElevenLabs API."""

import os
from pathlib import Path
from dotenv import load_dotenv
from elevenlabs import ElevenLabs

load_dotenv()

client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")
OUT_DIR = Path(__file__).parent / "audio"
OUT_DIR.mkdir(exist_ok=True)

# Script segments — narration only (no stage directions)
SEGMENTS = {
    "01-hook": (
        "Last night before bed, I gave my AI agent one instruction: "
        "\"Build these 5 features. I'll check tomorrow.\" "
        "I woke up to this."
    ),
    "02-context": (
        "I'm building ClawMemory — an open-source memory manager for AI agents. "
        "Here's the problem: AI agents like Claude store everything in plain markdown files. "
        "That works great — until your agent has hundreds of memories and you have no idea what it knows about you. "
        "So I built a UI for it. Day one, I had the basics — browse files, edit, search. "
        "But I wanted more. And I didn't want to spend my evening coding."
    ),
    "03-the-prompt": (
        "At 10 PM, I sent my agent this message. Five features: "
        "A health dashboard with activity heatmaps. "
        "A knowledge graph that visualizes how people, projects, and decisions connect. "
        "Semantic search — not just keyword matching, but understanding meaning. "
        "Memory templates for quick capture. "
        "And smart tag filters. "
        "Then I went to sleep."
    ),
    "04-result-intro": (
        "Six hours later. Let me show you what it built."
    ),
    "04a-dashboard": (
        "Health dashboard — total files, chunks indexed, a GitHub-style heatmap showing which days have memories. "
        "It even flags stale memories you haven't updated in 30 days."
    ),
    "04b-graph": (
        "Knowledge graph — every entity my agent knows about, connected. People, projects, tools. "
        "Click a node, see every memory that mentions it."
    ),
    "04c-search": (
        "Search — toggle between full-text and semantic. "
        "Ask \"what does Aaron care about\" and it actually understands the question."
    ),
    "04d-templates-tags": (
        "One-click templates for daily notes, project notes. "
        "Auto-extracted tags across all files. Filter instantly."
    ),
    "04e-result-summary": (
        "Five features. Five clean git commits. Build passing. All done while I was asleep."
    ),
    "05-bigger-picture": (
        "Here's what I think people get wrong about AI agents. "
        "It's not about asking it to write one function. It's about trusting it with a mission. "
        "I didn't say \"write a React component.\" I said \"here's what the product needs, figure it out.\" "
        "That's the shift. You stop being a coder. You start being a builder. "
        "And the craziest part? This is February 2026. The models are only getting better. "
        "Six months from now, I probably won't even need to describe the features. "
        "The agent will look at user feedback and propose them itself."
    ),
    "06-cta": (
        "ClawMemory is open source. Link in the description. "
        "If you're running an AI agent and want a better way to see what it remembers — try it. "
        "And if you're not running an AI agent yet... what are you waiting for?"
    ),
}

def generate():
    for name, text in SEGMENTS.items():
        out_path = OUT_DIR / f"{name}.mp3"
        if out_path.exists():
            print(f"  skip {name} (exists)")
            continue
        print(f"  generating {name} ({len(text)} chars)...")
        audio = client.text_to_speech.convert(
            voice_id=VOICE_ID,
            text=text,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )
        # audio is a generator of bytes
        with open(out_path, "wb") as f:
            for chunk in audio:
                f.write(chunk)
        print(f"  ✓ {name} → {out_path.name}")

    print(f"\nDone! {len(SEGMENTS)} segments → {OUT_DIR}/")

if __name__ == "__main__":
    generate()
