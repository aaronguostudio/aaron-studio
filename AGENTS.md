

# Agent Rules <!-- tessl-managed -->

@.tessl/RULES.md follow the [instructions](.tessl/RULES.md)

If `.tessl/RULES.md` is not installed, fall back to this repo's shared workflow model:

- `tiles/` is the source of truth for reusable workflows.
- Run `scripts/sync-agent-skills.sh` after cloning or changing skills so Codex, Claude, Cursor, and Gemini all see the same local skills.
- Use `config/aaron-studio.json` for repo paths and publishing destinations instead of hard-coded user paths.
- For blog work, prefer `blog-production` as the orchestrator. It routes through `muse`, `blog-brainstorm`, `blog-outline`, `blog-write`, `blog-illustrate`, `aaron-video-gen`, `publish-to-blog`, and `yt-publish`.
