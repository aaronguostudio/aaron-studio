# Daily Log — Install & Manage

One-time setup for nightly 22:00 journal auto-generation.

## Install

```bash
# 1. Make the shell script executable
chmod +x /Users/aguo/aaron/aaron-studio/scripts/daily-log.sh

# 2. Test it manually (should write/refresh today's journal)
/Users/aguo/aaron/aaron-studio/scripts/daily-log.sh
tail -20 /Users/aguo/aaron/aaron-studio/.claude/logs/daily-log.log

# 3. If test passed — install the launchd plist
cp /Users/aguo/aaron/aaron-studio/scripts/com.aaron.daily-log.plist \
   ~/Library/LaunchAgents/com.aaron.daily-log.plist

# 4. Load it (starts the schedule)
launchctl load ~/Library/LaunchAgents/com.aaron.daily-log.plist

# 5. Verify it's loaded
launchctl list | grep daily-log
```

## Uninstall

```bash
launchctl unload ~/Library/LaunchAgents/com.aaron.daily-log.plist
rm ~/Library/LaunchAgents/com.aaron.daily-log.plist
```

## Inspect

```bash
# When will it fire next?
launchctl print gui/$(id -u)/com.aaron.daily-log | grep -A2 'next run'

# Recent runs
tail -50 /Users/aguo/aaron/aaron-studio/.claude/logs/daily-log.log

# Stderr (if errors)
tail -50 /Users/aguo/aaron/aaron-studio/.claude/logs/daily-log.stderr.log
```

## Trigger manually without waiting for 22:00

```bash
launchctl start com.aaron.daily-log
# or
/Users/aguo/aaron/aaron-studio/scripts/daily-log.sh
```

## How it works

- **22:00 local** — launchd triggers `scripts/daily-log.sh`
- Shell script locates `claude` binary, `cd`'s to repo
- Runs `claude -p "Run daily-log skill..."` in headless mode
- Skill reads today's git log + world/_archive + world/ obs deltas + inbox
- Writes `src/brain/journal/YYYY/MM/YYYY-MM-DD.md` — Facts section only
- Reflection section is scaffolded empty (you fill morning after)

## If the Mac was asleep at 22:00

launchd catches missed runs on next wake. The daily-log skill is idempotent — running twice on the same day only refreshes the Facts section; any Reflection you wrote is preserved.

## Weekly review integration

`weekly-review` skill already reads `src/brain/journal/` — Friday review will auto-include these logs, no change needed.

## Known limitations

- `claude -p` needs your auth to be valid. If your Claude Code login expires, the job will fail silently (check stderr log).
- First run might prompt for permissions. Run it manually once before trusting the schedule.
