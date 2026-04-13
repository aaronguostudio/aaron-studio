# Muse — Documentation

## Invocation

```
/muse                              # Full discovery — Signal + context + web
/muse I've been thinking about X   # Start with a rough idea, skip to refinement
```

If you arrive with an idea, Muse skips the research phase and goes straight to sharpening your angle.

## First Run

The first time you invoke `/muse`, it asks 6 questions to learn who you are — your name, content pillars, audience, writing formats, and optional Signal DB / personal context paths. This creates `.aaron-skills/muse/EXTEND.md` and only happens once.

To reconfigure: delete `.aaron-skills/muse/EXTEND.md` and run `/muse` again.

## What Muse Does

```
┌─────────────────────────────────────────────┐
│  1. Attune        Read your EXTEND.md       │
│  2. Signal        Query your trend DB       │
│  3. Read You      Journals, notes, past work│
│  4. Scan the Web  4–6 targeted searches     │
│  5. Present       4–6 topic ideas           │
│  6. Go Deeper     Conversation to sharpen   │
│  7. Confirm       One clear direction       │
└─────────────────────────────────────────────┘
```

Steps 2–4 gather intelligence. Steps 5–6 are a conversation. Step 7 is the output.

## What Muse Outputs

A confirmed topic direction — not a content plan, not a draft:

```
## Your Next Piece

Working title: "..."
In one sentence: ...
The story: ...
Pillar: ...
Format: blog / newsletter / ...
Why this week: ...
What makes it yours: ...
```

## With or Without Signal DB

| Setup | What happens |
|-------|-------------|
| **With Signal DB** | Muse queries your Turso database for trending items and daily pulse summaries, then combines with web search + personal context |
| **Without Signal DB** | Muse relies on web search + your journals/notes. Still fully functional — just less personalized trend data |

## EXTEND.md Preferences Reference

All configuration lives in `.aaron-skills/muse/EXTEND.md` (YAML frontmatter). Edit directly to change content pillars, audience, writing formats, Signal DB credentials, CTA rotation, or hand-off skill.

### Identity

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `version` | integer | `1` | Schema version |
| `author_name` | string | `""` | Your name or pen name |
| `brand_positioning` | string | `""` | What you write and why |

### Writing

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `writing_formats` | list | `["blog"]` | Formats: `blog`, `newsletter`, `linkedin`, `video-script`, `essay`, `thread`, `other` |
| `content_pillars` | list | `[]` | Your 2–4 recurring topics |
| `target_audience` | string | `""` | Who reads your work |

### Personal Context — `content_paths`

| Field | What Muse reads | Example |
|-------|----------------|---------|
| `journals_dir` | Last 2–3 journal entries | `"src/brain/journal/"` |
| `reading_notes_dir` | Reading notes from the last 14 days | `"src/brain/reading/"` |
| `brain_dir` | Evergreen "second brain" notes | `"src/brain/"` |
| `past_writing_glob` | Last 3 content plans or outlines | `"src/content/blogs/*/content-plan.md"` |

### CTA Rotation — `cta_rotation`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `false` | Include CTA in confirmed topic summary |
| `sequence` | list | `["follow", "newsletter", "reply"]` | Rotation order |
| `current` | string | `"follow"` | Next CTA to use (update manually after each post) |

### Signal DB — `signal_db`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `false` | Enable Signal DB queries |
| `provider` | string | `"turso"` | Database provider |
| `database_url` | string | `""` | HTTPS URL of your Turso database |
| `auth_token_env` | string | `"TURSO_AUTH_TOKEN"` | Env variable holding the token |
| `tables.daily_pulse` | string | `"daily_pulse"` | Table with `date` + `pulse_text` |
| `tables.items` | string | `"items"` | Table with `title`, `source`, `score`, `relevance`, `summary`, `collected_at` |
| `min_relevance` | integer | `7` | Minimum relevance score (1–10) |
| `lookback_days` | integer | `7` | Days of history to query |

### Hand-off — `next_skill`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `next_skill` | string | `""` | Skill to suggest after confirming a topic (e.g. `"blog-brainstorm"`) |
