#!/bin/bash
# daily-log.sh — invokes the daily-log skill via a headless agent CLI.
# Triggered by ~/Library/LaunchAgents/com.aaron.daily-log.plist at 22:00 local nightly.
#
# Manual test: ./scripts/daily-log.sh

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$REPO/.agent-logs"
LOG_FILE="$LOG_DIR/daily-log.log"
PROMPT="Run the daily-log skill to write today's journal Facts section. Do not ask for confirmation — auto-write per the skill's headless rules. Report the output path and summary when done."

mkdir -p "$LOG_DIR"

echo "===== $(date '+%Y-%m-%d %H:%M:%S %Z') — daily-log starting =====" >> "$LOG_FILE"

cd "$REPO"

find_bin() {
  local name="$1"
  shift

  local found
  found="$(command -v "$name" || true)"
  if [ -n "$found" ]; then
    printf '%s\n' "$found"
    return
  fi

  local candidate
  for candidate in "$@"; do
    if [ -x "$candidate" ]; then
      printf '%s\n' "$candidate"
      return
    fi
  done

  return 0
}

run_codex() {
  local bin="$1"
  echo "Using codex at: $bin" >> "$LOG_FILE"
  "$bin" exec \
    --cd "$REPO" \
    --ask-for-approval never \
    --sandbox workspace-write \
    "$PROMPT"
}

run_claude() {
  local bin="$1"
  echo "Using claude at: $bin" >> "$LOG_FILE"
  "$bin" -p "$PROMPT" --permission-mode acceptEdits
}

AGENT="${AARON_STUDIO_AGENT:-auto}"
AGENT_BIN="${AARON_STUDIO_AGENT_BIN:-}"

if [ -n "$AGENT_BIN" ] && [ ! -x "$AGENT_BIN" ]; then
  echo "ERROR: AARON_STUDIO_AGENT_BIN is not executable: $AGENT_BIN" >> "$LOG_FILE"
  exit 1
fi

if [ -z "$AGENT_BIN" ]; then
  case "$AGENT" in
    codex)
      AGENT_BIN="$(find_bin codex "$HOME/.codex/bin/codex" "/Applications/Codex.app/Contents/Resources/codex" "/opt/homebrew/bin/codex" "/usr/local/bin/codex")"
      ;;
    claude)
      AGENT_BIN="$(find_bin claude "$HOME/.claude/local/claude" "/opt/homebrew/bin/claude" "/usr/local/bin/claude")"
      ;;
    auto)
      AGENT_BIN="$(find_bin codex "$HOME/.codex/bin/codex" "/Applications/Codex.app/Contents/Resources/codex" "/opt/homebrew/bin/codex" "/usr/local/bin/codex")"
      if [ -z "$AGENT_BIN" ]; then
        AGENT_BIN="$(find_bin claude "$HOME/.claude/local/claude" "/opt/homebrew/bin/claude" "/usr/local/bin/claude")"
      fi
      ;;
    *)
      echo "ERROR: AARON_STUDIO_AGENT must be auto, codex, or claude." >> "$LOG_FILE"
      exit 1
      ;;
  esac
fi

if [ -z "$AGENT_BIN" ]; then
  echo "ERROR: no codex or claude binary found on PATH or common locations." >> "$LOG_FILE"
  exit 1
fi

set +e
case "$(basename "$AGENT_BIN")" in
  codex)
    run_codex "$AGENT_BIN" >> "$LOG_FILE" 2>&1
    ;;
  claude)
    run_claude "$AGENT_BIN" >> "$LOG_FILE" 2>&1
    ;;
  *)
    echo "ERROR: cannot infer agent kind from binary: $AGENT_BIN" >> "$LOG_FILE"
    exit 1
    ;;
esac

EXIT_CODE=$?
set -e

echo "===== $(date '+%Y-%m-%d %H:%M:%S %Z') — daily-log exit=$EXIT_CODE =====" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

exit $EXIT_CODE
