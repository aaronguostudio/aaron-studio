#!/usr/bin/env bash
# Sync local tile skills into agent-specific skill directories.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SURFACES=(".agents" ".codex" ".claude" ".cursor" ".gemini")

MAPPINGS=(
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
  "pattern-atlas:tiles/pattern-atlas"
  "daily-log:tiles/daily-log"
  "home-decor-shorts:tiles/home-decor-shorts"
  "knowledge-shorts:tiles/knowledge-shorts"
  "muse:tiles/muse"
  "music-shorts:tiles/music-shorts"
  "music-vibe-shorts:tiles/music-vibe-shorts"
  "music-visualizer:tiles/music-visualizer"
  "notion-task-intake:tiles/notion-task-intake"
  "publish-to-blog:tiles/publish-to-blog"
  "weekly-review:tiles/weekly-review"
  "x-growth:tiles/x-growth"
  "yt-publish:tiles/aaron-yt-pipeline/skills/yt-publish"
  "yt-script-writer:tiles/aaron-yt-pipeline/skills/yt-script-writer"
  "yt-trend-scout:tiles/aaron-yt-pipeline/skills/yt-trend-scout"
  "yt-video-producer:tiles/aaron-yt-pipeline/skills/yt-video-producer"
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

printf '\nSkill sync complete.\n'
