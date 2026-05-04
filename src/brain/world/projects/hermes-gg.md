# Hermes / GG Infrastructure

**Status:** 🟢 Core operating infrastructure
**Category:** Infrastructure / AI-native life
**Last updated:** 2026-05-04

## What It Is
Hermes Agent is now the core shell for GG, replacing the previous OpenClaw-centered setup. GG is Aaron's AI-native operating partner running through Hermes with persistent memory, skills, tools, Telegram gateway, and local machine access.

## Migration State
- Old OpenClaw directory has been archived to `/Users/aaron/.openclaw.pre-migration`
- Hermes home: `/Users/aaron/.hermes/`
- OpenClaw migration archive: `/Users/aaron/.hermes/migration/openclaw/20260503T231629/`
- Current source-of-truth persona: `/Users/aaron/.hermes/SOUL.md`
- Injected memory: `/Users/aaron/.hermes/memories/MEMORY.md` and `USER.md`

## Operating Design
- Memory = durable facts and pointers
- Skills = reusable workflows
- World files = complex context and sensitive stakeholder/project maps
- Cron = proactive cadence
- Tools/API/providers = execution surface

## Guardrails
- Do not blindly re-import OpenClaw config with overwrite
- Promote old OpenClaw context selectively into world files or skills
- Keep sensitive details in private local files; avoid leaking into public content
- Update Hermes skills when workflow improvements are discovered

## Related
- [[themes/ai-native-life]]
- [[people/aaron]]
