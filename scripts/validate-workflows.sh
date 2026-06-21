#!/usr/bin/env bash
# Validate Aaron Studio workflow wiring across local skills and agent surfaces.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

failures=0

fail() {
  printf 'FAIL: %s\n' "$1"
  failures=$((failures + 1))
}

pass() {
  printf 'PASS: %s\n' "$1"
}

require_file() {
  local path="$1"
  if [ -f "$path" ]; then
    pass "$path exists"
  else
    fail "$path missing"
  fi
}

require_skill() {
  local path="$1"
  require_file "$path/SKILL.md"
  require_file "$path/tile.json"
}

require_agent_skill() {
  local surface="$1"
  local name="$2"
  local path="$surface/skills/$name"

  if [ ! -e "$path" ]; then
    fail "$path missing"
    return
  fi

  if [ -L "$path" ]; then
    local target
    target="$(readlink "$path")"
    if [ -f "$path/SKILL.md" ]; then
      pass "$path -> $target exposes SKILL.md"
    else
      fail "$path -> $target does not expose SKILL.md"
    fi
  elif [ -f "$path/SKILL.md" ]; then
    pass "$path is a skill directory"
  else
    fail "$path is not a skill"
  fi
}

printf '== Workflow tiles ==\n'
for skill in blog-outline blog-write blog-production blog-brainstorm blog-illustrate muse publish-to-blog aaron-video-gen brain-ingest daily-log weekly-review; do
  require_skill "tiles/$skill"
done

for skill in yt-trend-scout yt-script-writer yt-video-producer yt-publish; do
  require_file "tiles/aaron-yt-pipeline/skills/$skill/SKILL.md"
done

printf '\n== Shared config ==\n'
require_file "config/aaron-studio.json"
node -e '
const fs = require("fs");
const cfg = JSON.parse(fs.readFileSync("config/aaron-studio.json", "utf8"));
const required = ["contentRoot", "blogRepo", "blogPublicImages", "shortsReadyDir", "homeDecorReferenceImagesDir", "timezone", "agentSkillSurfaces"];
const missing = required.filter((key) => !cfg[key]);
if (missing.length) {
  console.error(`missing config keys: ${missing.join(", ")}`);
  process.exit(1);
}
if (!Array.isArray(cfg.agentSkillSurfaces) || !cfg.agentSkillSurfaces.includes(".agents")) {
  console.error("agentSkillSurfaces must include .agents");
  process.exit(1);
}
' && pass "config/aaron-studio.json has required keys" || fail "config/aaron-studio.json is invalid"

printf '\n== Agent skill surfaces ==\n'
for surface in .agents .codex .claude .cursor .gemini; do
  for skill in blog-production blog-outline blog-write blog-brainstorm blog-illustrate muse publish-to-blog aaron-video-gen brain-ingest daily-log weekly-review yt-script-writer yt-publish; do
    require_agent_skill "$surface" "$skill"
  done
done

printf '\n== Git ignore hygiene ==\n'
if git check-ignore -q "src/content/blogs/example/.video-gen-cache/narration.mp3"; then
  pass ".video-gen-cache files are ignored"
else
  fail ".video-gen-cache files are not ignored"
fi

if git check-ignore -q "src/content/blogs/example/video.mp4"; then
  pass "generated mp4 files are ignored"
else
  fail "generated mp4 files are not ignored"
fi

if git check-ignore -q "tiles/knowledge-shorts/output/example/narration.mp3"; then
  pass "tile output files are ignored"
else
  fail "tile output files are not ignored"
fi

if git check-ignore -q "src/content/videos/example/audio/01-hook.mp3"; then
  pass "generated narration audio is ignored"
else
  fail "generated narration audio is not ignored"
fi

printf '\n== Documentation ==\n'
require_file "src/content/strategy/youtube-scriptwriting-playbook.md"
require_file "src/content/strategy/remotion-video-engineering.md"
require_file "tiles/aaron-video-gen/scripts/audit-script.ts"
require_file "tiles/aaron-video-gen/scripts/script-audit.ts"
require_file "tiles/aaron-video-gen/scripts/remotion-audit.ts"

if rg -q "Codex" AGENTS.md CLAUDE.md README.md; then
  pass "agent docs mention Codex compatibility"
else
  fail "agent docs do not mention Codex compatibility"
fi

printf '\n'
if [ "$failures" -gt 0 ]; then
  printf '%s validation failure(s)\n' "$failures"
  exit 1
fi

printf 'All workflow validations passed.\n'
