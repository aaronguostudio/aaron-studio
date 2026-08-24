---
name: research-evidence
description: Use when a blog, essay, video, or skill evaluation starts from X, YouTube, an interview, a paper, or mixed web sources and needs a canonical, provenance-rich evidence bundle before editorial conclusions are drawn.
---

# Research Evidence

Build an inspectable source record before research becomes prose. This skill is
the evidence-acquisition layer for `blog-production`; it does not decide the
article thesis and it does not turn inaccessible sources into negative
evidence.

## Output

Write `research-evidence.json` beside the consuming project artifacts. Follow
`references/research-evidence.schema.json`, then validate it with:

```bash
node tiles/research-evidence/scripts/validate-research-evidence.mjs \
  path/to/research-evidence.json
```

The bundle must record the producing skill version, canonical sources,
retrieval method, transcript provenance, claims, coverage gaps, and privacy
state. Separate these claim kinds:

- `source_fact`: directly supported by a recorded source;
- `inference`: a conclusion drawn from one or more sources;
- `operator_observation`: an observed Aaron-owned run, experiment, or result.

Never promote an inference or a proposed experiment to a source fact.

## Acquisition Order

1. Start from the user's exact URL when one exists. Resolve redirects and
   record the canonical URL; do not rely on a repost or summary as the primary
   source.
2. Use ordinary public discovery (`last30days`, web search, platform metadata,
   or `yt-dlp`) to find related material and corroboration.
3. For X, prefer a read-only local browser session when public retrieval is
   incomplete. Record displayed metrics as a time-bounded observation, not a
   stable fact.
4. For YouTube, try public metadata and captions first. If the CLI is blocked
   or discovery returns zero despite a known canonical video, use a read-only
   browser transcript export for at most three editorially selected videos.
5. Hash and count an exported transcript. Record whether captions are human,
   auto-generated, translated, or unknown. Raw transcripts may stay in a
   private evidence directory; do not copy a full third-party transcript into
   a publishable repository just to make the bundle self-contained.
6. Add coverage gaps and limitations. A blocked channel, missing transcript,
   or zero search result means `partial` evidence, not “nothing exists.”

## Browser Transcript Fallback

Use this only for a known, high-value YouTube URL after the public route fails.

- Open the canonical video in the user's existing browser session.
- Export the page transcript through the browser's transcript capability.
- Preserve language, caption kind, line/word/byte counts, retrieval time, and
  SHA-256 in the evidence bundle.
- Do not persist YouTube account cookies, reuse authentication tokens, bypass
  CAPTCHA or bot checks, or attach an account to a transcript API.
- If the browser cannot expose a transcript, record `status: missing` and the
  limitation. Continue with independent sources where possible.

This fallback is a bounded evidence-recovery path, not a general YouTube
scraper.

## Claim Discipline

Every `source_fact` and `inference` must reference existing source IDs. An
`operator_observation` may reference no external source, but its notes must
name the observed run or artifact. Use `verified` only when the recorded
evidence directly supports the claim. Anecdotes, displayed social metrics,
auto-generated captions, and claims without independent reproduction need an
explicit limitation.

Before handoff, run the validator and report:

- bundle status: `complete`, `partial`, or `blocked`;
- number and types of sources;
- transcript coverage and retrieval method;
- unresolved gaps;
- validator result.

The initial worked fixture is
`fixtures/uncle-bob-agents/research-evidence.json`.

