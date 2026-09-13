# Brain → Notion: curated migration, 2026-09-06

Operational record only. Knowledge pages are maintained in Notion; this directory contains source identity and disposition, not duplicate knowledge bodies.

- [Brain home](https://app.notion.com/p/3d3b5667a0c681b08ef6d856eed210ee)
- [Selection and migration record](https://app.notion.com/p/3d3b5667a0c6816e8b70c82409290605)
- `inventory.json`: 158 source files, SHA-256, size, review depth and disposition. Full inventory does not mean full factual review.
- `source-map.json`: 14 source files mapped to 13 curated knowledge pages. Harness concept and project principle share one page. The additional Brain migration decision has no legacy file.

This pass added 11 pages to the 3-page pilot, for 14 knowledge database records total. It preserved the initial 3-item review selection. Empty files, incomplete goals and a context-free scratch prompt were excluded from the new knowledge base, not physically deleted.

Original source files and unrelated worktree edits were left unchanged. Existing local skills, timers and other databases were not migrated. No commit or push was performed.

To resume, query Notion by source identity and fetch the current page before editing. Compare source hashes before re-importing. Update the existing Notion page rather than recreating it. The summaries are selective derivatives; use the retained source when deeper detail is needed. Do not treat old project or personal observations as current verified facts.

Checks passed: 158 inventory entries and unchanged source hashes; 14 sources mapped to 13 unique knowledge pages; 14 Notion records including the migration decision; 14/14 page relation and source-identity checks; 3 records in the preserved review view.

Connector handling: update properties with the explicit `update_properties` command; content insert commands do not apply attached property changes. `来源路径` uses inline-code formatting to prevent filenames from turning into web links. Strip Markdown backticks and normalize `<br>` to newlines when matching to the plain paths in `source-map.json`.

## First project workbench

The existing [Aaron Studio project](https://app.notion.com/p/394b5667a0c681a59619f483e5435b62) now contains the current Brain focus, confirmed direction, open questions, outcomes, a small update template, and linked knowledge and task views. The Brain homepage points to it. Original project identity, historical context, and all 14 task relations were preserved; no task statuses were changed.

Read-back checks on 2026-09-06: related knowledge view `3d3b5667-a0c6-8194-9f55-000c4822d909` returns 6 curated cards; task views `3d3b5667-a0c6-8158-b941-000c6a828fb1`, `3d3b5667-a0c6-8168-8b9f-000c1090cbc6`, and `3d3b5667-a0c6-81ad-b9db-000c892bdea7` return 11 Not started, 0 In progress, and 3 Done records respectively. These are existing tracker statuses, not a new acceptance review. Local capture and review skills have not yet been switched to Notion.

## Daily capture entrypoint

`tiles/brain-ingest` v0.2.0 now routes explicit knowledge capture to the configured Notion inbox and supports finding/organizing captures. Shared destinations live in `config/aaron-studio.json`. Existing task routing and meeting-context promotion boundaries remain; the task-intake example now requires explicit backlog intent. Local legacy guidance was adjusted without moving old source content.

Validation: skill quick validation, all workflow validations, five local agent skill links, and diff whitespace checks passed. Notion guide, workbench and existing decision were updated and read back. No synthetic inbox note was created; the next real capture remains the end-to-end usability check. This does not install skills on another computer, switch daily-log/weekly-review/brain-context, or enable background sync. No commit or push.

## World migration

All 51 World Markdown files were migrated: 19 people, 2 organizations, 10 historical project backgrounds, 6 themes, 11 evidence records and 3 legacy guides. `world-map.json` preserves source hashes, destination IDs, category pages, read-back checks and unresolved references. World sources remain unchanged. Page bodies retain the originals with history labels, converted internal links and incoming references; all 251 unique per-page outgoing World links passed read-back checks. Missing Drew and out-of-scope review/processing references remain literal source references. The Brain homepage links to World. New World edits belong in Notion; local context-baseline workflows are not globally migrated.

## Remaining personal records and research

`remaining-map.json` records 63 additional full texts (including 14 sources previously represented only by curated summaries). `remaining-verification.json` records read-back checks and retained/excluded items. `coverage.json` is the current complete disposition of all 158 Brain files: 114 full texts in Notion, 44 retained/excluded. Historical `inventory.json` describes the first pass only. Original selected source hashes remained unchanged. World W16/processing references were connected, and 13 curated cards now link to their 14 source texts. Filename autolinks introduced by Notion were corrected on 17 pages.

The two raw reference attachments (Agentspace PDF and orange-book-full-text.txt) remain local; their bodies were not uploaded. Daily-log, weekly-review and brain-context automation behavior remains unchanged. No commit, push or source deletion.
