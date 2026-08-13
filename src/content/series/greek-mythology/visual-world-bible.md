---
series_id: greek-mythology
season_id: greek-mythology-athens
document_version: 2.0.0
entity_bible_version: 2.0.0
source_registry_version: 1.5.0
updated: 2026-08-12
---

# Visual World Bible — Athens: Gods in Stone

## World Thesis

Build an archaeological editorial world in which fragments, texts, reconstruction, and imagination can coexist without pretending to be the same kind of evidence.

The result should feel tactile, contemporary, and authored—not like a white-marble textbook, a fantasy-game poster, or a Marvel-style pantheon.

## Visual Grammar

- Begin with a real anchor: stone, fragment, plan, inscription, landscape, or museum record.
- Let one relation carry each image. Do not turn a scene into an encyclopedia spread.
- Use negative space and clear visual hierarchy so story remains easy to read.
- Treat full-color, complete divine bodies as interpretations unless a specific feature is source-backed.
- Keep ancient Greek, Roman, Byzantine, medieval, and modern layers visually distinct. Chapter 1 is set within an ancient Athenian myth-and-monument frame; it must not inherit medieval costume or architecture.
- Never imply that a generated image is a photograph, scan, or exact restoration.

## Reconstruction Status Treatment

Status must be available in alt text, caption, nearby copy, or interaction semantics. Color alone is never enough.

| Status                     | Visual treatment                                                                                         | Required label behavior                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `artifact-documented`      | Restrained stone/material view, fragment boundary, inventory or site context when licensed.              | State what survives; do not complete missing anatomy invisibly.    |
| `text-attested`            | Text trace, token, or narrative vignette clearly tied to a named passage.                                | Name the author and passage; call it a tradition or account.       |
| `scholarly-reconstruction` | Layered assembly, ghosted missing portions, measured alignment, or comparison with a documented drawing. | State the reconstruction basis and visible uncertainty.            |
| `artistic-interpretation`  | Fully staged scene, atmosphere, complete figures, and expressive palette.                                | Use the exact label; never present it as archaeological certainty. |

## Chapter 1 Character Continuity

Stable character keys come from `entity-bible.json`.

### `deity-athena`

- Preserve a readable helmet-and-aegis silhouette when the scene needs immediate recognition.
- A possible spear, shield, stride, and orientation toward Poseidon belong to `scholarly-reconstruction`, not `artifact-documented` anatomy.
- Exact facial features, complexion, garment colors, helmet colors, and complete pose remain `artistic-interpretation` until further evidence is registered.

### `deity-poseidon`

- Preserve a broad opposing silhouette and the possibility of a raised trident action when the scene needs immediate recognition.
- The raised arm, exact stance, trident design, face, hair, cloth, water effects, and complete anatomy must retain their reconstruction or interpretation label.
- Do not default to superhero armor, a glowing weapon, or a modern fantasy sea king.

### Set-Level Rule

Athena and Poseidon should remain recognizable across images through silhouette, gesture family, proportion, and a small recurring motif—not through an unsupported claim that one generated portrait is their canonical ancient appearance.

## Chapters 2–6 Mode Continuity

The five later chapter heroes form one evidence-atlas family. They share warm stone and paper, graphite reconstruction traces, restrained mineral pigment, raking light, and text-free pixels. Their compositions must remain different because each chapter asks a different question.

| Chapter              | Stable visual mode             | One allowed visual predicate                                                                                                              | Evidence boundary                                                                                                                                              |
| -------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2 — East pediment    | `missing-center-pediment`      | Surviving or reconstructed edge witnesses direct attention toward an intentionally empty birth center.                                    | Helios, Selene, witness identities, and the central choreography do not carry equal certainty; the hero is an interpretive map, not the surviving pediment.    |
| 3 — Erechtheion      | `layered-sanctuary-cutaway`    | Uneven architecture makes several sacred memories legible without flattening them into one room.                                          | Interior partitions, cult placements, the olive court, sacred openings, and the Korai's identity are partly reconstructed; the cutaway is not a measured plan. |
| 4 — Athena Parthenos | `distributed-archive-assembly` | Several unlike witnesses align around the absence of one lost colossal body.                                                              | No copy, account, shield, or complete generated figure is an exact substitute for Pheidias's original.                                                         |
| 5 — Frieze           | `procession-reading-band`      | Observable movement advances toward a central cloth scene whose action remains disputed.                                                  | The Panathenaic reading is leading scholarship, not an ancient caption; the alternative route remains a named proposal rather than a second documentary layer. |
| 6 — Theatre          | `chronological-palimpsest`     | Later stone, an earlier performance space, festival evidence, surviving words, and supplied staging occupy visibly different time layers. | The 458 BCE venue and performance cannot be recovered as a complete premiere view; the audience must not be shown as the dramatic jury.                        |

Do not reuse a mode merely as visual skin. A triangular absence, axonometric cutaway, vertical assembly, horizontal reading band, and chronological theatre bowl should stay compositionally distinct while sharing the same material language.

## Uncertainty Rendering Rules

- Solid material in a generated image is not automatically `artifact-documented`. A source-backed object may be represented solidly, but invented joins, poses, surfaces, locations, scale relationships, and surrounding architecture remain reconstruction or interpretation.
- Use gaps, ghosted graphite, displaced layers, incomplete edges, or competing paths to show uncertainty. Never use visual polish to close an evidentiary gap.
- A modern continuous scene assembled from several sources takes the status of its least secure material claim; every accepted Chapter 2–6 hero therefore has primary status `artistic-interpretation`.
- A secondary evidence status describes the inputs consulted, not the truth status of every generated pixel.
- Do not let one source type impersonate another: ancient text is not an artifact photograph, a Roman copy is not the Greek original, a current ruin is not an earlier performance venue, and a scholarly title is not an ancient inscription.
- When two identifications or readings are disputed, show the uncertainty through an open label in HTML or through non-exclusive visual paths. Do not generate two fully realized scenes whose equal visual weight falsely implies equal scholarly support.
- Empty space can be the most accurate completion. Preserve the Chapter 2 center, Chapter 4 missing original, Chapter 5 unnamed action, and Chapter 6 performance gap as visible absences.

## Version Dependencies and Staleness

The accepted Chapter 2–6 assets in this revision were reviewed against:

- `entity-bible.json` version `2.0.0`;
- `source-registry.json` version `1.5.0`;
- the chapter-local bilingual story and interaction packages current on 2026-08-12.

An accepted asset becomes stale when a source support or limitation changes in a way that affects a depicted feature, when an entity ID is deprecated or its visual continuity changes, when an interaction changes what a hotspot claims, or when a chapter's locked interpretation changes. A registry version bump alone does not force regeneration; the owning visual critique must record whether the change affects pixels, captions, alt text, or only provenance metadata.

## Materials and Palette

The palette is an editorial system, not a claim about exact ancient coloration.

- Base: warm Pentelic-marble and paper tones.
- Structural dark: graphite and weathered bronze.
- Accents: Aegean blue, mineral red, olive green, and restrained gold.
- Saturation: lower for evidence layers; richer for explicitly artistic scenes.
- Texture: carved stone, pigment dust, linen, paper, and sea haze; keep surfaces clean enough for mobile reading.

Do not use pure white marble as the only visual truth. Do not assign a specific pigment to a specific Chapter 1 sculpture without a registered source.

## Composition and Interaction

- Cover: one conflict or choice, no cast collage.
- Evidence image: show what is present and what is missing.
- Narrative scene: one moment, human-readable staging, no floating label cloud.
- Relationship view: large nodes, bilingual names outside generated pixels, accessible text fallback.
- Evidence-to-reconstruction comparison: preserve keyboard control, reduced-motion behavior, explicit value text, and a nearby disclaimer.
- Every interactive idea must still communicate its core claim when JavaScript or motion is unavailable.

## Typography and Exact Text

- Render factual labels, status names, citations, and bilingual names in HTML whenever possible.
- Generated pixels should normally contain no text.
- When exact text is unavoidable, list every allowed word in the prompt and reject all invented copy during visual critique.

## Provenance Contract

Every accepted series image must have a record in the owning chapter's `imgs/generation-manifest.md` with:

- `series_id`, `season_id`, and `chapter_id`;
- visual asset ID and immutable filename;
- entity IDs shown;
- source IDs consulted;
- one primary `reconstruction_status` plus any secondary statuses;
- prompt path, backend, provider/model when known, candidates, and selected candidate;
- reference assets and `derived_from` asset IDs;
- edits and post-processing;
- actual dimensions and aspect ratio;
- rights status and attribution needs;
- a plain statement that generated imagery is not documentary evidence.

After critique, reusable assets enter `asset-library` through its existing scan, curate, and use workflow. Do not create a parallel series asset database.

## Reject List

- superhero armor, game-poster composition, or cinematic battle spectacle;
- Roman toga used as a generic Greek costume;
- medieval architecture or clothing inside an unlabeled ancient scene;
- pristine white-statue clichés presented as historical truth;
- neon tridents, sci-fi HUDs, and glowing deity dashboards;
- museum-style labels fabricated inside generated images;
- exact restoration language for an artistic reconstruction;
- repeated front-facing deity portraits that erase the evidence/story rhythm.

## Portability

- Stable IDs live in the JSON registries; this Markdown describes presentation rules only.
- Assets remain chapter-owned and are referenced by IDs and relative manifest paths.
- Routes, frameworks, and UI components may change when the series becomes an independent site without changing entity, source, chapter, or asset identity.
- Web, video, social, and future spatial experiences should consume the same entity/source/status records.

## Revision History

| Version | Date       | Change                                                                                                                                                                                                                     |
| ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.0.0   | 2026-08-12 | Registered the five Chapter 2–6 evidence-atlas modes, their uncertainty-rendering rules, and dependency/staleness contract against entity-bible 2.0.0 and source-registry 1.5.0.                                           |
| 1.3.0   | 2026-08-12 | Aligned stable source and entity dependencies after the article evidence audit; no accepted visual asset became stale because chronology and inference boundaries did not change the generated scene.                      |
| 1.2.0   | 2026-08-12 | Updated entity and source dependencies for the integrated Chapter 1 article; no accepted visual asset was made stale because the new records expand narrative and place evidence rather than visual reconstruction claims. |
| 1.1.0   | 2026-08-12 | Aligned dependency versions after adopting the six-chapter Athens: Gods in Stone route.                                                                                                                                    |
| 1.0.0   | 2026-08-12 | Established the Athens visual thesis, evidence treatments, Chapter 1 continuity, provenance contract, and portability rules.                                                                                               |
