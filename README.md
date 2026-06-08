# Aaron Studio

Personal life OS and content studio powered by AI skills — journaling, life context, blog writing, image generation, video creation, and publishing.

## Setup

### Prerequisites

- [Bun](https://bun.sh/) — `curl -fsSL https://bun.sh/install | bash`
- [FFmpeg](https://ffmpeg.org/) — `brew install ffmpeg`
- [edge-tts](https://github.com/rany2/edge-tts) — `pip install edge-tts`
- [Tessl CLI](https://tessl.io/) — `npm install -g tessl`

### Clone and install skills

```bash
git clone <repo-url> aaron-studio
cd aaron-studio
tessl install
./scripts/sync-agent-skills.sh
```

`tessl install` installs Tessl-managed dependencies. `scripts/sync-agent-skills.sh` creates local skill symlinks for Codex, Claude, Cursor, and Gemini from the canonical `tiles/` directory.

### Environment variables

```bash
cp .env.example .env
# Edit .env and fill in your API keys
```

A symlink at `.baoyu-skills/.env` is tracked in the repo so all skills share the same keys automatically.

## Skills

| Skill | Source | Description |
|-------|--------|-------------|
| `brain-ingest` | local (`tiles/`) | Capture raw input into `src/brain/` with confirmation |
| `daily-log` | local (`tiles/`) | Generate today's journal Facts section |
| `weekly-review` | local (`tiles/`) | Draft weekly review from local brain evidence |
| `muse` | local (`tiles/`) | Find timely writing topics from Signal, journals, notes, and web context |
| `blog-production` | local (`tiles/`) | Orchestrate the full blog workflow from idea to publishing |
| `blog-outline` | local (`tiles/`) | Turn a topic or plan into a writing-ready blog outline |
| `blog-write` | local (`tiles/`) | Draft the EN/ZH article package, X, newsletter, and YouTube script |
| `blog-brainstorm` | local (`tiles/`) | Research and generate `content-plan.md` |
| `baoyu-article-illustrator` | [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills) | Generate illustrations for blog articles |
| `baoyu-image-gen` | [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills) | AI image generation (OpenAI, Google, DashScope) |
| `aaron-video-gen` | local (`tiles/`) | Generate YouTube videos from script + slide images |
| `publish-to-blog` | local (`tiles/`) | Publish blog posts |

## Blog workflow

Use `blog-production` to resume or run the workflow:

```text
muse
  -> blog-brainstorm
  -> blog-outline
  -> blog-write
  -> blog-illustrate
  -> aaron-video-gen
  -> publish-to-blog
  -> yt-publish
```

Each post lives in `src/content/blogs/YYYY-MM-DD/`. New workflow output prefers `plan.md`, `<slug>.md`, `<slug>-zh.md`, `x-post.md`, `x-standalone-tweet.md`, `newsletter-teaser.md`, `youtube-script.md`, and `youtube-metadata.md`.

## Project structure

```
src/brain/          Aaron's operating system (world graph, goals, reviews, journal, reading)
src/content/blogs/  Blog posts organized by date (YYYY-MM-DD/)
src/content/        All publishable content (blogs, strategy, writing, shorts, videos)
src/inbox/          Single capture point — processed weekly
tiles/              Source-of-truth local skills
.baoyu-skills/      Project-level skill preferences and env
.claude/skills/     Skill symlinks for Claude Code
.codex/skills/      Skill symlinks for Codex
.agents/skills/     Skill symlinks for Codex desktop / agent runtimes
.tessl/             Installed skill cache (gitignored)
```

## Validation

Run this after changing workflow wiring:

```bash
./scripts/sync-agent-skills.sh
./scripts/validate-workflows.sh
```
