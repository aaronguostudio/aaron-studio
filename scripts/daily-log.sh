#!/bin/bash
# daily-log.sh — invokes the daily-log skill via headless Claude Code CLI.
# Triggered by ~/Library/LaunchAgents/com.aaron.daily-log.plist at 22:00 local nightly.
#
# Manual test: /Users/aguo/aaron/aaron-studio/scripts/daily-log.sh

set -euo pipefail

REPO="/Users/aguo/aaron/aaron-studio"
LOG_DIR="$REPO/.claude/logs"
LOG_FILE="$LOG_DIR/daily-log.log"

mkdir -p "$LOG_DIR"

echo "===== $(date '+%Y-%m-%d %H:%M:%S %Z') — daily-log starting =====" >> "$LOG_FILE"

cd "$REPO"

# Resolve claude binary — launchd has minimal PATH, so be explicit.
CLAUDE_BIN="$(command -v claude || true)"
if [ -z "$CLAUDE_BIN" ]; then
  for candidate in \
    "$HOME/.claude/local/claude" \
    "/usr/local/bin/claude" \
    "/opt/homebrew/bin/claude"; do
    if [ -x "$candidate" ]; then
      CLAUDE_BIN="$candidate"
      break
    fi
  done
fi

if [ -z "$CLAUDE_BIN" ]; then
  echo "ERROR: claude binary not found on PATH or common locations." >> "$LOG_FILE"
  exit 1
fi

echo "Using claude at: $CLAUDE_BIN" >> "$LOG_FILE"

# Invoke daily-log skill. The skill is self-contained and idempotent.
"$CLAUDE_BIN" -p "Run the daily-log skill to write today's journal Facts section. Do not ask for confirmation — auto-write per the skill's headless rules. Report the output path and summary when done." \
  --permission-mode acceptEdits \
  >> "$LOG_FILE" 2>&1

EXIT_CODE=$?

echo "===== $(date '+%Y-%m-%d %H:%M:%S %Z') — daily-log exit=$EXIT_CODE =====" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

exit $EXIT_CODE
