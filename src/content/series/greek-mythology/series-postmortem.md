---
series_id: greek-mythology
season_id: greek-mythology-athens
document_version: 2.0.0
updated: 2026-08-12
status: package-qa-passed-local
---

# Greek Mythology Series Postmortem

## Current State

- Season: Athens: Gods in Stone / 雅典：石中众神
- Publicly released chapters in this workflow: 0 (no deployment or publication action was performed)
- Local bilingual article + interactive chapter packages: 6 (`package-qa-passed`); Chapter 1 retains its existing published metadata and Chapters 2–6 remain unpublished drafts
- Completed unpublished chapters: 5
- Planned chapters without a package: 0
- Public performance data: not collected
- Series-level decision: ready for an explicit publication decision; no audience data exists yet, so do not infer demand from local QA

## Season Hypothesis

Readers will be more willing to continue through a mythology series when every chapter combines an accessible story with visible evidence boundaries and one useful interaction, rather than behaving like a reference encyclopedia.

This remains a hypothesis until public episodes and qualified behavior data exist.

## Measurement Contract

Use stable IDs in every event. Minimum shared properties:

- `series_id`
- `season_id`
- `chapter_id`
- `episode`
- `locale`
- `interaction_id` or `entity_id` when applicable

Minimum event set:

| Event                       | Meaning                                                 |
| --------------------------- | ------------------------------------------------------- |
| `series_landing_view`       | A reader opened the series entry page.                  |
| `series_episode_open`       | A reader opened a chapter.                              |
| `series_next_click`         | A reader chose the next chapter from within the series. |
| `myth_entity_open`          | A reader opened an entity detail or relationship node.  |
| `myth_interaction_start`    | A reader began the chapter's primary interaction.       |
| `myth_interaction_complete` | A reader reached its defined completion condition.      |
| `language_switch`           | A reader changed the chapter language.                  |

Primary series metrics:

1. Episode-to-next-episode click rate.
2. Primary interaction start and completion rates.
3. Qualified reading depth by episode and locale.
4. Return visits to another series chapter within 7 days.
5. Source-link use and factual correction rate as evidence of trust, not just engagement.

## Episode Ledger

| Chapter ID                                                    | State                                                                                                                             | Prediction                                                                                                                        | 24h           | 7d            | Decision                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------- | ------------------------------------------------------- |
| `greek-mythology-athens-01-athena-poseidon-contest`           | Local bilingual article + interactive prototype; package QA passed; existing publish flag retained; not deployed in this workflow | Evidence-to-reconstruction comparison should make uncertainty legible without slowing the opening.                                | Not collected | Not collected | Ready for explicit publication decision; no data yet    |
| `greek-mythology-athens-02-athena-birth-east-pediment`        | Local bilingual chapter; package QA passed; unpublished                                                                           | Reading from the documented dawn edges toward the lost center should make variant boundaries memorable.                           | Not collected | Not collected | Ready for editorial review; no publication action taken |
| `greek-mythology-athens-03-erechtheion-many-memories`         | Local bilingual chapter; package QA passed; unpublished                                                                           | Walking the asymmetrical sanctuary should help readers hold several sacred obligations without collapsing them into one story.    | Not collected | Not collected | Ready for editorial review; no publication action taken |
| `greek-mythology-athens-04-athena-parthenos-lost-statue`      | Local bilingual chapter; package QA passed; unpublished                                                                           | A distributed archive should communicate both the statue's recoverable outline and its irreducible loss.                          | Not collected | Not collected | Ready for editorial review; no publication action taken |
| `greek-mythology-athens-05-parthenon-frieze-procession`       | Local bilingual chapter; package QA passed; unpublished                                                                           | Following the carved sequence before seeing competing readings should prevent interpretation from masquerading as an inscription. | Not collected | Not collected | Ready for editorial review; no publication action taken |
| `greek-mythology-athens-06-theatre-of-dionysus-myth-on-stage` | Local bilingual chapter; package QA passed; unpublished                                                                           | Layering site chronology with one performance case should show how public viewing turned inherited myth into unresolved argument. | Not collected | Not collected | Ready for editorial review; no publication action taken |

## Review Questions

After each published chapter:

- Did readers understand which details were documented, attested, reconstructed, or invented?
- Did the interaction deepen comprehension or merely delay the story?
- Were any entity names, relationships, or visual features inconsistent with the registries?
- Did either language edition alter a claim or uncertainty boundary?
- Which source links were useful, and which claims attracted correction?
- Which visual assets are worth curating for reuse without making the season repetitive?

After three published chapters:

- Is the next-chapter rate strong enough to justify a dedicated series landing page?
- Is the entity/relationship model genuinely helping navigation?
- Does the visual world remain recognizable without repeating one composition?
- Which workflow rule belongs in `blog-production`, and which remains Greek-mythology-specific?

At season end:

- Continue inside the blog, pause, or migrate to an independent site.
- Promote only stable entity, source, visual, and interaction contracts; do not migrate article-specific clutter.

## Correction Log

No corrections recorded. Add factual corrections here first, then update the owning registry and mark affected downstream assets stale.

## Revision History

| Version | Date       | Change                                                                                                                                                                                                                   |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.0.0   | 2026-08-12 | Completed Chapters 2–6 as bilingual, source-registered, visually provenanced interactive packages; recorded successful local browser and production-boundary QA while retaining all five chapters as unpublished drafts. |
| 1.2.0   | 2026-08-12 | Recorded Chapter 1 as a local bilingual article plus interactive prototype with package QA passed, zero published chapters, and readiness for an explicit publication decision without audience data.                    |
| 1.1.0   | 2026-08-12 | Aligned the current-state counts and episode ledger with the six-chapter Athens: Gods in Stone route.                                                                                                                    |
| 1.0.0   | 2026-08-12 | Created the no-fabrication baseline, event contract, episode ledger, and review cadence.                                                                                                                                 |
