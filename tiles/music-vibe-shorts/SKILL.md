---
name: music-vibe-shorts
description: Generate premium quality music/vibe YouTube Shorts with a signature surreal dreamscape visual style. One video per day, quality over quantity. Use when user asks to "做音乐视频", "music vibe short", "generate a vibe video", "tomorrow's short", or daily video generation for Visual and Sound channel.
---

# Music Vibe Shorts — Visual and Sound Channel

Premium quality YouTube Shorts that pair iconic music with signature surreal dreamscape visuals.

## Channel Info
- **Channel:** Visual and Sound
- **Style:** Surreal Dreamscape — our signature look
- **Output:** 1 video/day, max. Quality > quantity.
- **Goal:** Build a recognizable visual brand that people follow for the aesthetic

## 🎨 Signature Visual Style: "Impossible Spaces"

Every video shares a unified aesthetic — viewers should recognize our videos instantly.

### Core DNA
- **Surreal impossible architecture** floating in dreamscape environments
- **Massive scale** with tiny human figure(s) for emotional contrast
- **Soft pastel palette** — peach, coral, gold, powder blue, lavender
- **Golden hour / twilight lighting** — always warm, always magical
- **Volumetric clouds, god rays, dust particles** — atmosphere is everything
- **Marble, glass, and organic forms** — clean but not sterile
- **Cinematic depth of field** — background softly blurred

### Visual Elements Library
Pick 1-2 per video. Mix and match for variety while keeping the style consistent:

**Architecture (impossible/floating):**
- Spiral staircases floating in clouds (our signature)
- Infinite bridges stretching to nowhere
- Floating islands with single buildings
- Inverted cities (upside down above clouds)
- Massive archways/portals in the sky
- Glass domes suspended over oceans
- Libraries that extend infinitely
- Train stations in the clouds
- Lighthouses on impossible cliff edges
- Temples emerging from mist

**Natural Dreamscapes:**
- Oceans of clouds with structures emerging
- Bioluminescent forests
- Crystal caves with golden light
- Infinite flower fields meeting the sky
- Northern lights over impossible geometry
- Underwater cities with light filtering down
- Desert dunes with floating structures above

**Characters (when used):**
- **Style:** Soft 3D rendered, slightly stylized (not hyperreal, not cartoon)
- **Role:** Always small in frame — the environment is the star
- **Poses:** Contemplative — standing at edge, looking up, walking alone, sitting peacefully
- **Clothing:** Simple, flowing — white/cream dress, long coat, minimal
- **Purpose:** Gives the viewer someone to project onto — "I wish I was there"
- NEVER the focus, always secondary to the environment

### Color Palettes (rotate)
| Palette | Colors | Mood | Best For |
|---------|--------|------|----------|
| **Golden Sunset** | Peach, coral, warm gold, powder blue | Warm, nostalgic | Uplifting songs |
| **Twilight Dream** | Lavender, soft purple, deep blue, silver | Ethereal, melancholic | Sad/reflective songs |
| **Ocean Mist** | Seafoam, teal, white, soft gold | Calm, expansive | Piano/ambient |
| **Dawn Rose** | Blush pink, cream, soft orange, pale blue | Gentle, hopeful | Love songs |
| **Starlight** | Deep navy, silver, warm amber points | Vast, contemplative | Epic/cinematic scores |

### Camera Movement
- **Slow, continuous, sweeping** — NEVER static, NEVER fast
- **Ascending dolly** — camera rises, revealing scale
- **Slow orbit** — circling around central structure
- **Drift through** — floating through an impossible space
- **Pull-back reveal** — start on detail (flowers, light), reveal vast scene
- One movement per video. Slow = luxury.

### What This Style is NOT
- ❌ Photorealistic real-world scenery (that's everyone else)
- ❌ Anime / 2D illustration
- ❌ Dark, gritty, horror
- ❌ Fast cuts, transitions, effects
- ❌ Text overlays, memes, talking head
- ❌ Hyperrealistic faces (uncanny valley risk)

## 📋 Daily Workflow

### Step 1: GG Pitches Ideas (8 PM cron)
GG proposes 3 music video concepts:
- **Song** + artist + why it would work
- **Visual concept** — the impossible space / scene
- **Emotional connection** — why this song + this visual
- **Color palette** suggestion
- Check `songs-used.md` to avoid repeats!

### Step 2: Aaron Picks & Refines
- Aaron picks one (or suggests a different song)
- Together we refine the Kling prompt
- **Optional:** Generate 1-2 still image previews first (via OpenAI image API) to nail the visual before committing to video

### Step 3: Generate Video
- Kling v3 (15s, 9:16, pro, multi_shot)
- Review output — if quality isn't there, regenerate. We don't publish mid work.

### Step 4: Publish
- Aaron adds music via YouTube app (choose the right timestamp!)
- Schedule for optimal time
- Update `songs-used.md`

## 🎵 Music Selection Rules

1. **Check `songs-used.md` FIRST** — never repeat a song
2. **Iconic > obscure** — songs people search for = algorithm fuel
3. **Emotional > upbeat** — our visual style pairs best with contemplative/emotional music
4. **Instrumental sections matter** — the video needs a good 15s segment without vocals competing with visuals
5. **Always suggest a music start timestamp** — the exact 15s window

### Best Song Types for Our Style
- 🎹 Piano pieces (Einaudi, Yiruma, Debussy, Satie)
- 🎻 Film scores (Zimmer, Morricone, Williams)
- 🎸 Iconic rock ballads (Led Zeppelin, Radiohead, Pink Floyd)
- 🎤 Emotional pop/indie (Coldplay, Lord Huron, Sigur Rós)
- 🎵 Classical crossovers (Moonlight Sonata, Clair de Lune)

## Video Prompt Template

```
Cinematic vertical video, [CAMERA MOVEMENT] through a surreal dreamscape.
[IMPOSSIBLE ARCHITECTURE/SCENE DESCRIPTION — specific structure, material, scale].
A [tiny solitary figure / small person in flowing white dress] stands at [POSITION], dwarfed by the massive structure.
[ATMOSPHERIC DETAILS — volumetric clouds, god rays streaming through gaps, soft dust particles, gentle breeze].
[LIGHTING — golden hour / twilight / dawn], casting [warm peach / soft lavender / amber] light across [SURFACES].
Color palette: [PALETTE FROM TABLE ABOVE].
Photorealistic 3D render style, surreal architecture, impossible geometry, extreme scale contrast.
Smooth continuous [MOVEMENT TYPE] camera motion, cinematic depth of field, ethereal atmosphere.
9:16 vertical, 15 seconds.
```

### Example Prompts

**Stairway to Heaven — Led Zeppelin:**
```
Cinematic vertical video, slow ascending dolly shot following a massive floating spiral staircase that winds through golden clouds.
White marble staircase with elegant railings, impossibly suspended in the sky with no supports, curving in an S-shape upward into infinity.
A tiny solitary figure stands at the highest visible platform, silhouetted against the sunset.
Volumetric cumulus clouds billow around the structure, golden hour sunlight streaming through gaps creating dramatic god rays.
Soft dust particles floating in warm light. Subtle lens flare from the setting sun.
Color palette: soft peach, coral, warm gold, powder blue, cream marble.
Photorealistic 3D render style, surreal architecture, impossible geometry, extreme scale contrast.
Smooth continuous ascending camera motion, cinematic depth of field, ethereal atmosphere.
9:16 vertical, 15 seconds.
```

**Mad World — Gary Jules:**
```
Cinematic vertical video, slow drift through an impossible inverted cityscape.
A modern city hangs upside-down from the sky above a still reflective ocean, buildings stretching downward like stalactites.
A tiny figure sits alone at the edge of a floating marble platform between the inverted city and the water, legs dangling.
Twilight atmosphere, the inverted city reflecting perfectly in the glassy water below. Faint stars appearing in the deep blue sky.
Soft lavender fog drifting between the hanging buildings. Distant warm window lights glowing amber.
Color palette: lavender, soft purple, deep blue, silver, warm amber points.
Photorealistic 3D render style, surreal architecture, impossible geometry, melancholic atmosphere.
Smooth continuous slow drift camera motion, cinematic depth of field, ethereal twilight.
9:16 vertical, 15 seconds.
```

**Experience — Ludovico Einaudi:**
```
Cinematic vertical video, slow orbit around a massive glass dome floating above an endless ocean of clouds.
Inside the transparent dome: a single grand piano on a marble floor, surrounded by floating golden leaves and soft light.
A tiny figure in white sits at the piano, visible through the curved glass walls.
Dawn light breaking on the horizon, casting rose-gold reflections across the glass dome surface. Clouds slowly churning below.
Gentle particles of light drifting upward inside the dome like reverse snow.
Color palette: blush pink, cream, soft orange, pale blue, glass reflections.
Photorealistic 3D render style, surreal architecture, impossible beauty, intimate scale within vast emptiness.
Smooth continuous slow orbit camera motion, cinematic depth of field, dawn atmosphere.
9:16 vertical, 15 seconds.
```

## Pipeline

```bash
# Generate video
cd /Users/aaron/Work/aaron-studio && npx -y bun tiles/knowledge-shorts/scripts/generate.ts \
  --topic "[song + concept]" \
  --skip-tts \
  --video-prompt "[full prompt]" \
  --yt-title "[title]" \
  --yt-desc "[description + hashtags]" \
  --output tiles/music-vibe-shorts/output/[slug]/
```

Then copy raw video to iCloud:
```bash
cp tiles/music-vibe-shorts/output/[slug]/kling-video.mp4 \
  "/Users/aaron/Library/Mobile Documents/com~apple~CloudDocs/Aaron-Studio/shorts-ready/vibe-[slug].mp4"
```

**Use `kling-video.mp4` (raw) — Aaron adds music manually via YouTube app.**

## YouTube Metadata

### Title Formats (rotate, keep short)
- "[Song Name] ✨ #music #shorts"
- "[Song] — [Artist] 🌙 #shorts #[genre]"
- "This song hits different at 2am 💫 #[song] #shorts"
- "Close your eyes and listen 🤍 #[artist] #shorts"

### Hashtags
#music #shorts #vibe #aesthetic #dreamscape #surreal
#[songname] #[artist] #[genre]
#cinematicmusic #musicvideo #ethereal #ambience

### Description
```
[Song Name] — [Artist]
[One evocative line about what the song/visual makes you feel]

#music #shorts #[song] #[artist] #aesthetic #dreamscape
```

## Song History

**ALWAYS check before generating:** `tiles/music-vibe-shorts/songs-used.md`

After publishing, update the file with:
- Date, song, artist, views (update later), notes

## Image Preview (Optional Pre-flight)

Before committing to a full Kling video generation (~10 min), optionally generate a still image preview:

```bash
# Use OpenAI image API to preview the visual concept
# If Aaron likes it → proceed to Kling video
# If not → iterate on the prompt
```

This saves Kling credits and time when exploring new visual concepts.

## Quality Standards

- **Every frame must be wallpaper-worthy** — if you wouldn't screenshot it, don't publish it
- **Regenerate if quality isn't there** — we don't ship mid work
- **1 video per day MAX** — overposting kills the algorithm
- **Consistency > virality** — build the brand, views will follow

## ⚠️ Important Notes

- **NO TTS / narration** — music only
- **NO text overlay / captions** — pure visual
- **NO Remotion render** — use raw `kling-video.mp4`
- **Aaron adds music** via YouTube app (GG suggests timestamp)
- **Check songs-used.md** before EVERY generation to avoid repeats
- Sync raw video to iCloud for Aaron to access
