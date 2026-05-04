# Signal — AI-Curated News Aggregator

**Status:** 🟢 Built / active system
**Category:** Alpha + infrastructure
**Last updated:** 2026-05-04

## What It Is
Signal is Aaron's AI-curated news/intelligence feed. It started as News Radar and was renamed Signal because Aaron preferred the feel: "Noise removed. What's left is what matters."

## Canonical Paths
- Collectors/code: `/Users/aaron/Work/aaron-studio/src/news-radar/`
- Public blog route: `/signal` in Aaron's Nuxt blog
- Historical migration notes: `/Users/aaron/.hermes/migration/openclaw/20260503T231629/archive/workspace/memory/2026-03-04.md` and `2026-03-05.md`

## Architecture Snapshot
- DB: Turso cloud (`news-radar-aaronguo.aws-us-east-1.turso.io`)
- Collectors: Node.js scripts
- Sources: Hacker News, X/Twitter, Reddit, Product Hunt, GitHub Trending, later Lobsters and ArXiv
- X method: `syndication.twitter.com/srv/timeline-profile/screen-name/{user}` parsing `__NEXT_DATA__`; Nitter/RSSHub were unreliable/dead
- Scoring: evolved from keyword relevance to LLM-based personalized scoring
- Summaries: AI summary field separate from original source summary
- Public integration: Nuxt `/signal`, i18n EN/ZH, 5-10 minute cache patterns

## Strategic Role
Signal is both:
1. Aaron's personal intelligence surface
2. A public credibility artifact showing AI-native infrastructure in action

It supports Alpha and may feed OrgNext thinking by turning broad AI/business noise into ranked, useful signal.

## Maintenance Notes
- Do not rely on old OpenClaw cron IDs; Hermes cron was reset during migration
- If restoring scheduled collection, recreate Hermes-native cron jobs rather than importing legacy job IDs
- Preserve secrets in `.env`, not world files

## Related
- [[projects/aaronguoblog]]
- [[projects/orgnext-mvp]]
- [[themes/ai-native-life]]
