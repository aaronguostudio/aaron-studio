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
- **Soft 3D rendered, slightly stylized** — NOT photorealistic, NOT cartoon, NOT live-action
- **Surreal impossible architecture** floating in dreamscape environments
- **Massive scale** with tiny stylized figure(s) for emotional contrast
- **Soft pastel palette** — peach, coral, gold, powder blue, lavender
- **Golden hour / twilight lighting** — always warm, always magical
- **Volumetric clouds, god rays, dust particles, floating light particles** — atmosphere is everything
- **Marble, glass, ceramic-smooth surfaces, and organic forms** — clean but not sterile
- **Cinematic depth of field** — background softly blurred

### ⚠️ Kling Prompt Style Rules (CRITICAL)
Kling is a Chinese LLM — **ALL prompts MUST be written in Chinese** for best results.

**Every prompt MUST start with this style declaration to prevent live-action output:**
> 柔和3D渲染风格竖屏视频，略带风格化，非真人非卡通。

**Mandatory style phrases to include in EVERY prompt:**
- `柔和3D渲染风格` / `软3D渲染风格` — anchors the 3D style
- `略带风格化，非真人非卡通` — prevents photorealistic/anime drift
- `建筑表面光滑如陶瓷` — ensures stylized material look
- `风格化的小人影` — keeps characters stylized, not realistic humans
- `漂浮光粒子` / `体积光` — signature atmospheric elements
- `梦幻` / `超现实` — reinforces dreamscape feel

**NEVER use these phrases (they cause live-action output):**
- ❌ `Photorealistic 3D render style` — too ambiguous, Kling defaults to live-action
- ❌ `写实风格` without `3D渲染` — will generate real people
- ❌ Overly specific real-world descriptions (e.g. "欧洲小镇", "咖啡馆") without dreamscape framing

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
- **Style:** Stylized small figures (风格化的小人影) — like music box figurines, NOT real humans
- **Role:** Always small in frame — the environment is the star
- **Poses:** Contemplative — standing at edge, looking up, walking alone, sitting peacefully
- **Clothing:** Simple, flowing — white/cream dress, long dark coat, minimal
- **Motion:** Smooth but slightly mechanical — 像精致的音乐盒人偶
- **Purpose:** Gives the viewer someone to project onto — "I wish I was there"
- NEVER the focus, always secondary to the environment
- When multiple figures: each should do DIFFERENT activities, avoid identical/repetitive actions

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
- ❌ Live-action / photorealistic real-world scenery (that's everyone else)
- ❌ Real human faces or bodies — always stylized figures
- ❌ Anime / 2D illustration
- ❌ Dark, gritty, horror — even sad songs should be beautiful
- ❌ Fast cuts, transitions, effects
- ❌ Text overlays, memes, talking head
- ❌ Hyperrealistic faces (uncanny valley risk)
- ❌ Surface-level literal interpretations of song titles

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
- **MUST show the full Chinese prompt to Aaron BEFORE generating** — never auto-generate without approval
- Together we refine the Kling prompt
- **Optional:** Generate 1-2 still image previews first (via OpenAI image API) to nail the visual before committing to video

### Step 2.5: Write Poetic Text Overlay
Every video gets a **single poetic line in English** overlaid on the visuals.

**Rules:**
- 1 sentence, max ~12 words — less is more
- English only, poetic and evocative
- Must capture the **emotional essence** of the song, not describe the visuals
- Subtle — complements the scene, never competes with it
- No song titles, no artist names, no movie references
- No quotes from actual lyrics (copyright)

**Style examples:**
| Song | Poetic Text |
|------|-------------|
| Comptine d'un autre été | Some summers never leave your fingertips |
| Clair de Lune | Moonlight falls where no one is watching |
| Experience | Some roads only make sense looking back |
| Stairway to Heaven | Every step closer to the sky |
| Mad World | The quietest people carry the loudest storms |

**Rendering:** The text is rendered via Remotion using `--poetic-text` flag. It appears as italic serif text in the lower third with a gentle fade in/out.

### Step 3: Generate Video
- Kling v3 (15s, 9:16, pro, multi_shot)
- **Prompt MUST be in Chinese** — Kling is a Chinese LLM, Chinese prompts produce better results
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

### 🎯 Song Interpretation Rules (CRITICAL)
**Understand the REAL meaning of lyrics, not the surface-level title.**
- Research what the song is actually about — the emotions, the story, the human experience
- Do NOT create literal visual translations of song titles (e.g. "Mad World" ≠ upside-down world)
- The visual should capture the **emotional essence** — what does the listener FEEL?
- Example: "Mad World" is about the numbness of everyday life, people performing happiness while feeling empty inside. The "madness" is hidden beneath the surface of normalcy — not chaos or horror.
- When in doubt, ask Aaron about the intended emotional direction before generating

### Best Song Types for Our Style
- 🎹 Piano pieces (Einaudi, Yiruma, Debussy, Satie)
- 🎻 Film scores (Zimmer, Morricone, Williams)
- 🎸 Iconic rock ballads (Led Zeppelin, Radiohead, Pink Floyd)
- 🎤 Emotional pop/indie (Coldplay, Lord Huron, Sigur Rós)
- 🎵 Classical crossovers (Moonlight Sonata, Clair de Lune)

## Video Prompt Template (中文)

**All prompts MUST be in Chinese. Always start with the style declaration line.**

```
柔和3D渲染风格竖屏视频，略带风格化，非真人非卡通。
[镜头运动]，[揭示/穿越/环绕] 一个超现实的梦幻 [场景]。
[超现实建筑/场景描述——具体结构、材质（大理石、玻璃、陶瓷光滑表面）、规模]。
[风格化小人影描述——位置、动作、服装、与环境的关系]。
[氛围细节——体积光、漂浮光粒子、柔和雾气、微风]。
[光线——黄昏金色 / 暮光 / 黎明]，[色彩投射效果]。
色调：[从色板表选择]。
软3D渲染风格，略带超现实，梦幻建筑，柔和材质，
极端尺度对比，电影级景深，体积光，漂浮光粒子。
平滑连续的 [运动类型] 镜头。9:16竖屏，15秒。
```

### Example Prompts

**Stairway to Heaven — Led Zeppelin:**
```
柔和3D渲染风格竖屏视频，略带风格化，非真人非卡通。
缓慢上升的镜头，跟随一座巨大的漂浮螺旋阶梯在金色云海中蜿蜒上升。
白色大理石阶梯带有优雅的栏杆，不可思议地悬浮在天空中没有任何支撑，以S形向上弯曲延伸至无穷远处。
建筑表面光滑如陶瓷，散发着柔和的光泽。
一个风格化的小人影站在最高的可见平台上，在落日前形成剪影。
体积感的积云在结构周围翻涌，黄昏阳光从缝隙中倾泻形成壮观的体积光。
淡金色光粒子在温暖光线中漂浮。
色调：柔和蜜桃色、珊瑚色、温暖金色、粉蓝色、奶油色大理石。
软3D渲染风格，略带超现实，梦幻建筑，柔和材质，
极端尺度对比，电影级景深，体积光，漂浮光粒子。
平滑连续的缓慢上升镜头。9:16竖屏，15秒。
```

**Mad World — Gary Jules (✅ 已验证成功):**
歌曲本意：日常生活的麻木，人们忙碌、伪装、机械地生活，丢失了内心的真实。"Mad" 不是疯狂或恐怖，而是表面正常之下隐藏的空洞。
```
柔和3D渲染风格竖屏视频，略带风格化，非真人非卡通。
缓慢上升的镜头，揭示一个超现实的梦幻小镇。
柔和的大理石和淡粉色建筑沿着一条蜿蜒的街道排列，
建筑表面光滑如陶瓷，窗户透出温暖的琥珀色光芒。
街道上漂浮着淡金色的光粒子和柔和的雾气。
街上有十几个风格化的小人影在各自活动：
有人低头看着手中发光的方块，有人在橱窗前驻足，
有人推着小车缓缓走过，有人坐在街边长椅上翻阅书页。
他们的动作流畅但略带机械感，像是精致的音乐盒人偶在运转。
画面前景右侧，一个穿深色长风衣的小人影独自靠在一根大理石柱旁，
双手插在口袋里，安静地注视着眼前的一切。
他是唯一一个完全静止的人，与周围流动的人群形成鲜明对比。
黄昏的金色光线从建筑之间倾泻而下，形成柔和的体积光。
天空是渐变的蜜桃色与淡薰衣草紫，几朵柔软的云彩漂浮其中。
色调：温暖蜜桃色、柔和金色、奶油白、淡珊瑚色、淡薰衣草紫。
软3D渲染风格，略带超现实，梦幻建筑，柔和材质，
极端尺度对比，电影级景深，体积光，漂浮光粒子。
平滑连续的缓慢上升镜头。9:16竖屏，15秒。
```

**Experience — Ludovico Einaudi:**
```
柔和3D渲染风格竖屏视频，略带风格化，非真人非卡通。
缓慢环绕镜头，围绕一个巨大的透明玻璃穹顶，漂浮在无尽的云海之上。
穹顶内部：一架三角钢琴置于大理石地板上，被漂浮的金色落叶和柔光环绕。
建筑表面光滑如陶瓷和玻璃，折射着柔和的光线。
一个穿白衣的风格化小人影坐在钢琴前，透过弯曲的玻璃墙壁可见。
黎明的光线在地平线上破晓，在玻璃穹顶表面投射出玫瑰金色的反光。云层在下方缓缓翻涌。
温柔的光粒子在穹顶内向上飘浮，像反向的雪花。
色调：腮红粉、奶油色、柔和橙色、淡蓝色、玻璃折射光。
软3D渲染风格，略带超现实，梦幻建筑，柔和材质，
极端尺度对比，电影级景深，体积光，漂浮光粒子。
平滑连续的缓慢环绕镜头。9:16竖屏，15秒。
```

## Pipeline

```bash
# Generate video with series branding + poetic text overlay
npx -y bun tiles/knowledge-shorts/scripts/generate.ts \
  --topic "[song + concept]" \
  --video-prompt "[full Chinese prompt]" \
  --series-name "100 Songs 100 Dreams" \
  --episode-number [N] \
  --song-name "[Song Name]" \
  --artist-name "[Artist]" \
  --poetic-text "[English poetic line]" \
  --yt-title "[title]" \
  --yt-desc "[description + hashtags]" \
  --output tiles/music-vibe-shorts/output/[slug]/
```

**Output:** `short-final.mp4` (Remotion-rendered with branding + text overlay) is synced to iCloud.
**Aaron adds music** via YouTube app (GG suggests timestamp).

**Episode numbering:** Check `songs-used.md` Published table to determine the next episode number.

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
- **ONE poetic text line** — English, italic serif, subtle fade in/out via Remotion `--poetic-text`
- **NO word-by-word captions** — no ElevenLabs, no title banner
- **Use `short-final.mp4`** (Remotion-rendered with text overlay), NOT raw kling-video.mp4
- **Aaron adds music** via YouTube app (GG suggests timestamp)
- **Check songs-used.md** before EVERY generation to avoid repeats
- Sync Remotion output to iCloud for Aaron to access
