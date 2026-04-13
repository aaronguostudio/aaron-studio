# Muse — EXTEND.md Preferences

Full reference for `.aaron-skills/muse/EXTEND.md`.

---

## Identity

### `version`
- **Type:** integer | **Default:** `1`
- Schema version. Leave as-is.

### `author_name`
- **Type:** string | **Default:** `""`
- Your name or pen name. Muse uses this to frame ideas around your perspective.

### `brand_positioning`
- **Type:** string | **Default:** `""`
- One or two sentences: what you write and why. This shapes how Muse frames every idea it surfaces.

---

## Writing

### `writing_formats`
- **Type:** list | **Default:** `["blog"]`
- **Values:** `blog`, `newsletter`, `linkedin`, `video-script`, `essay`, `thread`, `other`
- The formats you produce. Muse recommends a best-fit format for each idea.

### `content_pillars`
- **Type:** list | **Default:** `[]`
- Your 2–4 recurring topics. Muse uses these to focus web searches and cluster ideas.

### `target_audience`
- **Type:** string | **Default:** `""`
- Who reads your work. Muse evaluates whether a topic will resonate with this audience.

---

## Personal Context — `content_paths`

Paths relative to the project root. Leave empty to skip.

| Field | What Muse reads | Example |
|-------|----------------|---------|
| `journals_dir` | Last 2–3 journal entries (date-prefixed `.md` files) | `"src/brain/journal/"` |
| `reading_notes_dir` | Reading notes from the last 14 days | `"src/brain/reading/"` |
| `brain_dir` | Evergreen "second brain" notes | `"src/brain/"` |
| `past_writing_glob` | Last 3 content plans or outlines (to avoid repeating topics) | `"src/content/blogs/*/content-plan.md"` |

---

## CTA Rotation — `cta_rotation`

Optional. For writers who rotate calls-to-action across posts.

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `enabled` | boolean | `false` | Turn on to include CTA in the confirmed topic summary |
| `sequence` | list | `["follow", "newsletter", "reply"]` | Your rotation order |
| `current` | string | `"follow"` | The next CTA to use. Update manually after each post. |

---

## Signal DB — `signal_db`

Optional. Connect a personal intelligence database for real-time trend data. Muse is fully functional without it.

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `enabled` | boolean | `false` | Enable Signal DB queries |
| `provider` | string | `"turso"` | Database provider (only Turso currently) |
| `database_url` | string | `""` | HTTPS URL of your Turso database |
| `auth_token_env` | string | `"TURSO_AUTH_TOKEN"` | Env variable name holding the token (never the token itself) |
| `tables.daily_pulse` | string | `"daily_pulse"` | Table with `date` + `pulse_text` columns |
| `tables.items` | string | `"items"` | Table with `title`, `source`, `score`, `relevance`, `summary`, `collected_at` |
| `min_relevance` | integer | `7` | Minimum relevance score (1–10). Higher = more focused. |
| `lookback_days` | integer | `7` | Days of history to query |

---

## Hand-off — `next_skill`

- **Type:** string | **Default:** `""`
- After confirming a topic, Muse suggests running this skill next.
- Example: `"blog-brainstorm"` → *"The direction is set. When you're ready: `/blog-brainstorm`"*

---

## Examples

**Minimal** (just you and the web):
```yaml
---
version: 1
author_name: "Jane"
brand_positioning: "I write about design systems and developer experience."
writing_formats:
  - blog
  - newsletter
content_pillars:
  - design systems
  - developer experience
target_audience: "Frontend engineers and design technologists"
content_paths:
  journals_dir: ""
  reading_notes_dir: ""
  brain_dir: ""
  past_writing_glob: ""
cta_rotation:
  enabled: false
  sequence: ["follow", "newsletter", "reply"]
  current: "follow"
signal_db:
  enabled: false
  provider: "turso"
  database_url: ""
  auth_token_env: "TURSO_AUTH_TOKEN"
  tables:
    daily_pulse: "daily_pulse"
    items: "items"
  min_relevance: 7
  lookback_days: 7
next_skill: ""
---
```

**Full** (journals, Signal DB, hand-off):
```yaml
---
version: 1
author_name: "Aaron Guo"
brand_positioning: "Ship with AI, not about AI. Builder in finance."
writing_formats:
  - blog
  - newsletter
  - linkedin
content_pillars:
  - AI-native workflows
  - product leadership
  - building in public
target_audience: "Tech professionals who want to ship with AI"
content_paths:
  journals_dir: "src/brain/journal/"
  reading_notes_dir: "src/brain/reading/"
  brain_dir: "src/brain/"
  past_writing_glob: "src/content/blogs/*/content-plan.md"
cta_rotation:
  enabled: true
  sequence: ["follow", "newsletter", "reply"]
  current: "newsletter"
signal_db:
  enabled: true
  provider: "turso"
  database_url: "https://news-radar-yourname.aws-us-east-1.turso.io"
  auth_token_env: "TURSO_AUTH_TOKEN"
  tables:
    daily_pulse: "daily_pulse"
    items: "items"
  min_relevance: 7
  lookback_days: 7
next_skill: "blog-brainstorm"
---
```
