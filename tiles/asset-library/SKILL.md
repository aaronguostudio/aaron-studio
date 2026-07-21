---
name: asset-library
description: Index, search, curate, deduplicate, and record reuse of Aaron Studio media assets. Use when a blog, video, Short, music visualizer, or other content workflow needs existing music, audio, images, video, visualizer presets, or templates; when new generated media should be registered; or when asset rights, quality, provenance, variants, and usage history need review.
---

# Asset Library

Use the local-first catalog as Aaron Studio's reusable media memory. Keep original assets in their project folders; treat `assets.jsonl` and SQLite as derived indexes, not as replacement storage.

## Core rules

1. Search before generating a new asset.
2. Filter by technical fit, quality status, and rights before considering style.
3. Prefer `approved`; include `candidate` only when exploration or review is acceptable.
4. Never recommend `restricted` or `archived` assets for production use.
5. Record actual use so future searches can balance reuse against repetition.
6. Run `scan` after a workflow creates or changes reusable media or manifests.
7. Use file hashes to deduplicate content. Do not create separate music records for copied demo audio.

## Commands

Run commands from the Aaron Studio repository root.

```bash
node tiles/asset-library/scripts/asset-library.mjs scan
node tiles/asset-library/scripts/asset-library.mjs search --query "calm piano" --type music --max-duration 60 --status approved,candidate
node tiles/asset-library/scripts/asset-library.mjs show --id music:ASSET_ID
node tiles/asset-library/scripts/asset-library.mjs use --id music:ASSET_ID --project src/content/blogs/YYYY-MM-DD --role background-music
node tiles/asset-library/scripts/asset-library.mjs curate --id music:ASSET_ID --status approved --rating 4 --note "Reviewed for narration beds"
node tiles/asset-library/scripts/asset-library.mjs validate
node tiles/asset-library/scripts/asset-hook.mjs inbox
```

Add `--json` to `search`, `show`, or `stats` when another script or agent will consume the result.

## Reuse workflow

1. Translate the content need into constraints: asset type, intended role, duration, aspect ratio, mood, energy, rights, and quality status.
2. Run `search` with structured filters. Review the top three results and their reasons.
3. Inspect the canonical file and preview before selecting it.
4. If nothing fits, generate a new asset in the owning content workflow.
5. Run `scan`, then `curate` after QA and rights review.
6. Run `use` only when the asset is actually selected for a project.

## Catalog contract

- Human-curated overrides live in `src/content/asset-library/curation.json`.
- Append-only reuse events live in `src/content/asset-library/usage.jsonl`.
- The Git-readable derived catalog lives in `src/content/asset-library/assets.jsonl`.
- The disposable SQLite/FTS index lives in `.cache/asset-library/assets.sqlite`.
- The browsable local catalog lives in `src/content/asset-library/index.html`.
- Hook-detected, not-yet-reviewed candidates live in `src/content/asset-library/inbox.jsonl`.
- Read [references/asset.schema.json](references/asset.schema.json) before adding a new scanner or asset type.

Do not hand-edit `assets.jsonl`, `summary.json`, `index.html`, or the SQLite database. Rebuild them with `scan`.

## Hook intake

The project hook records a turn start timestamp on `UserPromptSubmit` and checks only newly changed candidate files on `Stop`. It does not read the transcript, call a model, hash media, probe media, or run a full library scan.

Generation manifests may set an explicit intake policy:

```json
{
  "asset_library": {
    "policy": "auto",
    "scope": "generic",
    "kind": "music"
  }
}
```

Use `auto` for a generic output that should enter the Inbox automatically, `suggest` when review is needed, and `ignore` or `scope: project-specific` for one-project media. Hook intake never marks an asset `approved`. Without an explicit policy, only new music-visualizer audio with a nearby generation manifest and new reusable visualizer configs are admitted; blog and video media default to ignored.

## Runtime

Use Node.js 22.5 or newer because the local search index uses `node:sqlite`. Keep `ffprobe` available for audio metadata extraction. The workflow has no npm dependencies.

## Integration gate

For blog and video production, run a search after the outline, brief, or asset plan is stable and before generating media. Record the selected IDs in the project artifact or production notes. For music-visualizer output, scan only after the generation manifest and QA artifacts exist.
