#!/usr/bin/env bash
# Sync local tile skills into agent-specific skill directories.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SURFACES=(".agents" ".codex" ".claude" ".cursor" ".gemini")

MAPPINGS=(
  "paste-ready-update:tiles/paste-ready-update"
  "demo-capture:tiles/demo-capture"
  "walkthrough-video:tiles/walkthrough-video"
  "ai-video-lab:tiles/ai-video-lab"
  "aaron-personal-os:tiles/aaron-personal-os"
  "wave-invoice:tiles/wave-invoice"
  "aaron-video-gen:tiles/aaron-video-gen"
  "asset-library:tiles/asset-library"
  "blog-brainstorm:tiles/blog-brainstorm"
  "blog-notes:tiles/blog-notes"
  "blog-canon-alignment:tiles/blog-canon-alignment"
  "blog-illustrate:tiles/blog-illustrate"
  "blog-outline:tiles/blog-outline"
  "blog-prose-editor:tiles/blog-prose-editor"
  "blog-production:tiles/blog-production"
  "blog-write:tiles/blog-write"
  "brain-ingest:tiles/brain-ingest"
  "brain-context:tiles/brain-context"
  "pattern-atlas:tiles/pattern-atlas"
  "project-bootstrap:tiles/project-bootstrap"
  "daily-log:tiles/daily-log"
  "home-decor-shorts:tiles/home-decor-shorts"
  "knowledge-shorts:tiles/knowledge-shorts"
  "muse:tiles/muse"
  "music-shorts:tiles/music-shorts"
  "music-vibe-shorts:tiles/music-vibe-shorts"
  "music-visualizer:tiles/music-visualizer"
  "visual-and-sound-ops:tiles/visual-and-sound-ops"
  "notion-task-intake:tiles/notion-task-intake"
  "publish-to-blog:tiles/publish-to-blog"
  "research-evidence:tiles/research-evidence"
  "weekly-review:tiles/weekly-review"
  "x-growth:tiles/x-growth"
  "yt-publish:tiles/aaron-yt-pipeline/skills/yt-publish"
  "yt-script-writer:tiles/aaron-yt-pipeline/skills/yt-script-writer"
  "yt-trend-scout:tiles/aaron-yt-pipeline/skills/yt-trend-scout"
  "yt-video-producer:tiles/aaron-yt-pipeline/skills/yt-video-producer"
)

# Only workflows intentionally made cross-project Codex skills belong here.
# Their canonical source remains in tiles/, so this is a link rather than a copy.
GLOBAL_CODEX_MAPPINGS=(
  "project-bootstrap:tiles/project-bootstrap"
)

sync_one() {
  local surface="$1"
  local name="$2"
  local target="$3"
  local skills_dir="$surface/skills"
  local link="$skills_dir/$name"

  if [ ! -f "$target/SKILL.md" ]; then
    printf 'skip %-18s -> %s (missing SKILL.md)\n' "$name" "$target"
    return
  fi

  mkdir -p "$skills_dir"

  local rel_target
  rel_target="$(python3 - "$skills_dir" "$target" <<'PY'
import os
import sys
print(os.path.relpath(sys.argv[2], sys.argv[1]))
PY
)"

  if [ -L "$link" ]; then
    local current
    current="$(readlink "$link")"
    if [ "$current" = "$rel_target" ]; then
      printf 'ok   %-18s %s -> %s\n' "$name" "$link" "$rel_target"
      return
    fi
    rm "$link"
  elif [ -e "$link" ]; then
    printf 'keep %-18s %s (real file/dir exists)\n' "$name" "$link"
    return
  fi

  ln -s "$rel_target" "$link"
  printf 'link %-18s %s -> %s\n' "$name" "$link" "$rel_target"
}

for surface in "${SURFACES[@]}"; do
  printf '\n== %s ==\n' "$surface"
  for mapping in "${MAPPINGS[@]}"; do
    name="${mapping%%:*}"
    target="${mapping#*:}"
    sync_one "$surface" "$name" "$target"
  done
done

GLOBAL_CODEX_ROOT="${CODEX_HOME:-$HOME/.codex}"
printf '\n== global Codex ==\n'
for mapping in "${GLOBAL_CODEX_MAPPINGS[@]}"; do
  name="${mapping%%:*}"
  target="${mapping#*:}"
  sync_one "$GLOBAL_CODEX_ROOT" "$name" "$target"
done

printf '\nSkill sync complete.\n'
