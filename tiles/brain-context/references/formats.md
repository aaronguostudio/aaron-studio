# Artifact formats

Resolve all paths relative to configured brainRoot. These are templates, not existing project facts.

## Evidence: world/_archive/YYYY-MM-DD/granola-MEETING_ID-r1.md

Frontmatter: `type: observation`, `date` (meeting date), `captured_at` (fetch time with timezone), `status: evidence`, `source: granola`, `source_id`, `revision: 1`, `project`, `evidence_level: transcript-excerpts | summary-only`, `related` (card and project links). Later revisions add `supersedes`.

Body: original title, source URL if actually returned, fetch tool, speaker/coverage limitations, numbered exact excerpts with stable anchors, then a clearly separated interpretation if needed. Excerpts are a selected record, not a full transcript backup. Keep AI summary separate from transcript. Check every quote against the fetched source. Deduplicate on source ID and captured content; a fetch date alone is not a new revision.

## Change card: processing/changes/YYYY-MM-DD-MEETING_ID.md

Frontmatter: `type: note`, `date`, `status: draft | reviewed | superseded`, `project`, `source_id`, `source_revision`, `reviewed_by: null`, `reviewed_at: null`, `related`.

Each claim needs:

| Field | Meaning |
|---|---|
| id | Stable within the source, e.g. C1 |
| kind | proposal / desire / decision / commitment / reported-outcome / verified-outcome / inference |
| statement | Narrow claim; preserve scope and temporal wording |
| evidence | Exact source path and excerpt anchor |
| speaker | Name only if reliable, otherwise unknown |
| confirmation | historical-evidence / needs-confirmation / confirmed-current / disputed / superseded |
| owner / due | Explicit values, or unknown; distinguish suggested timing from commitment |
| impact | Proposed change to the baseline, or none |

Finish with the proposed project delta, conflicts, and at most three consequential questions. Record review outcomes beside claim IDs. All statuses remain local artifact states, not business task statuses.

## Project state: world/projects/PROJECT.md

Use existing project nodes where possible. New nodes use `type: node`, `status: draft` until the current baseline is confirmed, `as_of`, `last_verified`, and `related`.

Separate: confirmed current goal; confirmed in/out of scope; commitments and due dates; historical decisions; proposals/open questions; runtime/issue verification; Observations linking source and card. `last_verified` means current business state was verified, not that an old transcript was fetched today. Record null when not verified.

## Context packet

State project, task, audience, generated date, current-state verification date, source revision paths. Then give confirmed scope, relevant history, unresolved questions, constraints, and what needs live verification. A draft or historical-only packet must say `background only; current execution scope unconfirmed`. Do not silently convert unknown into false, approved, canceled, or complete.

## Aaron's one-minute follow-up

“真正答应的是……；只是探索的是……；当前优先级仍是/改为……；等……以后再决定。”

Store this as its own dated manual source, with the meeting ID it interprets. Preserve the distinction between Aaron's interpretation, another participant's statement, and a mutual agreement.
