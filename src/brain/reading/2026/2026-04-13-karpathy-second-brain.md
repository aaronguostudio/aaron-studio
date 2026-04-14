---
type: reading
date: 2026-04-13
status: active
tags: [ai, knowledge-base, second-brain, karpathy, system-design, brain-evolution]
related:
  - "[[../../world/projects/openclaw]]"
  - "[[../../README]]"
---

# The Complete Guide to Karpathy's Second Brain — Aakash Gupta

- **Author:** Aakash Gupta (AI by Aakash newsletter)
- **URL:** https://www.aibyaakash.com/p/karpathy-second-brain
- **Date Read:** 2026-04-13
- **Original source:** Andrej Karpathy's X post (Apr 3, 2026) on LLM-built personal knowledge bases — 18.7M views, 5K+ GitHub stars

## Summary

Karpathy's pattern: a 3-layer LLM-maintained knowledge base. The human captures raw input + writes the schema once; the LLM owns all wiki maintenance forever. Three layers:

- **`raw/`** — junk drawer. Articles, transcripts, docs, notes. Never edited by human, never edited by AI.
- **`wiki/`** — what the AI builds and maintains. Summaries, entity pages, `[[wikilinks]]`, `index.md`. Human never writes here.
- **`CLAUDE.md`** (schema) — written once. Tells the LLM what the KB is about + how to organize.

**Core insight (the kernel):** The reason every personal wiki dies is that maintenance grows faster than value, and humans get bored of the bookkeeping. *"The LLM doesn't get bored."* Delegating maintenance — not the structure itself — is the unlock.

**Conventions:**
- Every wiki page cites its source.
- All cross-refs use `[[page-name]]` links.
- Append-only `log.md` records every ingest.
- **Ingest one source at a time.** Batching loses the ability to guide emphasis.

## Key Takeaways

1. **Compounding > recall.** Existing tools (NotebookLM, ChatGPT uploads, Notion AI) retrieve at query-time → knowledge never compounds. Karpathy's pattern compiles at ingest-time → wiki gets smarter session over session.
2. **The leverage isn't more knowledge — it's less forgetting.** *"The best builders don't just know more. They forget less."*
3. **Three-layer split is non-negotiable.** Raw is human-only. Wiki is AI-only. Schema is the one-time human contract.
4. **Maintenance delegation is the move.** Every previous "second brain" failed because the human had to maintain it. Karpathy's only real innovation is offloading the bookkeeping.
5. **One source at a time.** Sequential ingest preserves emphasis control. Batching destroys it.
6. **Append-only `log.md`** is the audit trail and the hook point for any future automation.

## Use cases Aakash highlights
- **Stakeholder memory** — page per person; query before meetings to know what's landed and what's been pushed back on.
- **Side-project context** — drop notes after each session; AI maintains running context so weekend pickup is 5 min not 60.
- **Team onboarding / institutional memory** — wiki survives when senior people leave.
- **Solved-once-forgot problems** — page per problem type; query before re-debugging.

## How this lands against aaron-studio

**Independent convergence (we already have):**
- Three-layer-ish split: `_archive/YYYY-MM-DD/` ≈ raw, `world/{people,orgs,projects,themes}/` ≈ wiki, [CLAUDE.md](../../../CLAUDE.md) = schema.
- `[[wikilink]]` convention throughout `world/`.
- Citations in Observations sections.
- [INDEX.md](../../world/INDEX.md) as Karpathy's `index.md` analog.

**Where we're ahead of Karpathy:**
- **Identity-oriented** ontology (people, orgs, projects, themes with trust levels, status emojis, tier rankings) vs. Karpathy's flat informational wiki.
- **Growth loop** ([goals/](../../goals/), [reviews/](../../reviews/), [decisions/](../../decisions/)) — Karpathy's pattern is recall, not trajectory.

**Where Karpathy is ahead — what we're adopting (2026-04-13):**
1. **Continuous ingest, not weekly batch.** Add explicit workflow in CLAUDE.md: when raw evidence lands in `world/_archive/`, Claude reads it → updates affected nodes → flags contradictions. No waiting for Friday review.
2. **One source at a time** discipline — explicit rule, no batch ingest going forward.

**What we're NOT adopting:**
- Karpathy's flat `raw/wiki/outputs/` layout. Our typed ontology (`people/`, `orgs/`, `projects/`, `themes/`) carries more semantic weight and we should keep it.
- Karpathy's `log.md`. Initially added it, then removed (same day). Reason: per-node Observations already carry dated, cited entries, and `git log src/brain/world/` answers cross-node "what changed when" perfectly. A global log file would be a third source of truth that could drift from the other two. Karpathy needs `log.md` because his wiki pages don't carry per-page provenance — ours do.

## Implementation
See same-day commits to [CLAUDE.md](../../../../CLAUDE.md) (Continuous ingest section).

## Related
- Aakash's article also covers Anthropic Managed Agents, Gemma 4, Claude Mythos Preview, AutoAgent — interesting but tangential to the second-brain analysis.
- Earlier Karpathy reading: [2026-03-01-karpathy-microgpt.md](2026-03-01-karpathy-microgpt.md).
