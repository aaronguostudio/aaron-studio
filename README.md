# Aaron Studio

Personal content studio powered by AI skills — blog writing, image generation, video creation, and publishing.

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
```

This installs all skill dependencies defined in `tessl.json`.

### Environment variables

```bash
cp .env.example .env
# Edit .env and fill in your API keys
```

A symlink at `.baoyu-skills/.env` is tracked in the repo so all skills share the same keys automatically.

## Skills

| Skill | Source | Description |
|-------|--------|-------------|
| `baoyu-article-illustrator` | [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills) | Generate illustrations for blog articles |
| `baoyu-image-gen` | [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills) | AI image generation (OpenAI, Google, DashScope) |
| `aaron-video-gen` | local (`tiles/`) | Generate YouTube videos from script + slide images |
| `publish-to-blog` | local (`tiles/`) | Publish blog posts |

## Project structure

```
src/blogs/          Blog posts organized by date (YYYY-MM-DD/)
tiles/              Local skills (aaron-video-gen, publish-to-blog)
.baoyu-skills/      Project-level skill preferences and env
.claude/skills/     Skill symlinks for Claude Code
.tessl/             Installed skill cache (gitignored)
```
