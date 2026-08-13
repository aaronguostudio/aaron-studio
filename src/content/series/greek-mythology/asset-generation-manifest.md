---
series_id: greek-mythology
season_id: greek-mythology-athens
chapter_id: greek-mythology-athens-01-athena-poseidon-contest
document_version: 1.1.0
updated: 2026-08-12
---

# Asset Generation Manifest: Athena and Poseidon

## Shared provenance

- Generator: Codex built-in `image_gen.imagegen`
- Model: the tool did not expose a reliable model identifier
- External API or CLI: none
- Manual repainting or compositing: none
- Candidates: one accepted generation for each final asset
- Style reference: `/Users/aaronguo/.codex/generated_images/019ff392-b51d-71f3-b9e7-87ade62baa26/exec-abd14659-137d-43a9-bf27-10a5d3bbc887.png`
- Rights status: AI-generated project asset; the style reference is itself project-generated
- Documentary status: neither image is documentary evidence, a scan, nor an exact archaeological restoration

## `athena-poseidon-reconstruction-v1`

- Final asset: `public/myth-img/athena-poseidon/reconstruction-v1.png` in the blog repository
- Original output: `/Users/aaronguo/.codex/generated_images/019ff3d5-24fe-7ea3-ae44-a3c70d020842/exec-4ab70644-fef8-4365-82f6-5646b630546a.png`
- Dimensions: 1122 × 1402 px
- SHA-256: `ed346e1935f4b67107699f0c3aa55710a89c1b57c2dfdc7eed8b5d4608a81885`
- Entities shown: `deity-athena`, `deity-poseidon`, `token-olive-tree`, `token-salt-water`
- Source IDs consulted for the surrounding experience: `acropolis-museum-parthenon-pediments`, `acropolis-museum-west-pediment-athena`, `acropolis-museum-west-pediment-poseidon`, `pausanias-1.24.5`, `herodotus-8.55`, `meyer-2018-west-pediment`
- Primary reconstruction status: `artistic-interpretation`
- Secondary status: `scholarly-reconstruction`
- Post-processing: none

### Prompt

```text
Use case: historical-scene
Asset type: portrait hero artwork for a mobile interactive before/after reveal, approximately 4:5 aspect ratio
Input image: Image 1 is a style and composition reference only; do not reproduce its UI, typography, labels, slider, buttons, vertical split, or white page background.
Primary request: Create one complete polychrome artistic reconstruction of the mythic contest between Athena and Poseidon on the Acropolis, expressed as a sculptural Greek temple pediment / high-relief tableau carved in warm Pentelic marble.
Scene/backdrop: a single continuous shallow marble architectural relief wall, viewed perfectly front-on with a fixed orthographic-like camera, suitable as the base image of a pixel-aligned drag comparison.
Subject: exactly two complete figures. Athena stands on the left, dignified and restrained, wearing a historically plausible Attic helmet and aegis, holding spear and round shield. Poseidon stands on the right, mature and bearded, holding a three-pronged trident. Between them, one olive tree grows from a narrow salt-water fissure in the marble ground. Their poses convey tension and contest without theatrical combat.
Style/medium: refined museum-quality archaeological reconstruction rendered as carved marble high relief / pediment sculpture, not living humans and not a fantasy painting. Natural chisel marks, subtle age and mineral variation, coherent classical anatomy and drapery.
Composition/framing: portrait 4:5, full-body figures, symmetrical visual balance, Athena left and Poseidon right, olive tree centered, salt-water fissure clearly visible at center bottom, generous but not empty breathing room around silhouettes; absolutely no cropping of helmet, trident, shield, hands, or feet. One continuous scene only.
Lighting/mood: warm Mediterranean museum daylight from upper left, soft directional shadows, solemn and luminous, low contrast enough to reveal carving detail.
Color palette: warm cream Pentelic marble with restrained historically inspired polychromy—mineral Egyptian blue, iron red, ochre, muted olive green, and small accents of aged gold/bronze. Pigment is matte, worn, and integrated into the carving, never glossy or oversaturated.
Materials/textures: tactile Pentelic marble, minute chips and tool marks, faded mineral pigment, aged bronze/gold accents.
Constraints: exact scene hierarchy and fixed front-on camera are important because a second evidence-layer edit must overlay pixel-for-pixel. Exactly two figures, one olive tree, one trident, one spear, one shield, one salt-water fissure. No text, no lettering, no symbols functioning as labels, no border, no interface, no split-screen, no watermark.
Avoid: extra gods or people, Roman armor, Roman helmet, medieval clothing or architecture, Renaissance aesthetics, cinematic fantasy concept art, photoreal live actors, white unpainted statue stereotype, palace interior, columns obscuring figures, modern objects, weapons beyond specified attributes.
```

### Acceptance note

The selected output preserves the two-figure hierarchy, central olive tree, salt-water fissure, fixed frontal camera, warm Pentelic-marble world, and restrained mineral color. It contains no text, UI, extra figures, fantasy armor, or medieval elements.

## `athena-poseidon-evidence-v1`

- Final asset: `public/myth-img/athena-poseidon/evidence-v1.png` in the blog repository
- Original output: `/Users/aaronguo/.codex/generated_images/019ff3d5-24fe-7ea3-ae44-a3c70d020842/exec-dc4f302a-483c-45d4-a704-fd93f8b61ff3.png`
- Derived from: `athena-poseidon-reconstruction-v1`
- Dimensions: 1122 × 1402 px
- SHA-256: `5e92c4089155e01894eb0ecf08dbd1b450347a936788df735f4e70061d9dffc4`
- Entities shown: `deity-athena`, `deity-poseidon`, `token-olive-tree`, `token-salt-water`
- Source IDs consulted for the surrounding experience: `acropolis-museum-parthenon-pediments`, `acropolis-museum-west-pediment-athena`, `acropolis-museum-west-pediment-poseidon`, `meyer-2018-west-pediment`
- Primary reconstruction status: `artistic-interpretation`
- Secondary status: `artifact-documented`
- Post-processing: CSS desaturation in the interface only; the source PNG is unchanged

### Prompt

```text
Use case: precise-object-edit
Asset type: evidence layer for a pixel-aligned mobile before/after drag reveal
Input image: Image 1 is the edit target and the immutable alignment master.
Primary request: Change only the archaeological preservation state of this exact sculptural tableau. Transform the complete polychrome reconstruction into a credible fragmentary museum / excavation evidence layer from the same ancient pediment.
Critical invariants: keep the exact same canvas size, aspect ratio, camera, crop, perspective, pediment geometry, architectural border, lighting direction, ground plane, salt-water fissure path, and the original x/y locations and scale of every subject. Do not zoom, pan, crop, rotate, mirror, recompose, or add any object. It must register over Image 1 for a vertical draggable reveal.
Athena remains: she must NOT be a complete statue. Preserve only a severely weathered fragmentary helmeted head, part of upper torso/aegis, a broken partial shield segment, one short spear shaft fragment, and at most one isolated drapery/limb fragment at their original coordinates. Large portions of her body, both arms, lower robe and legs are missing, leaving irregular broken marble scars, mounting voids, and subtle empty silhouette against the backing slab.
Poseidon remains: he must NOT be a complete statue. Preserve only a weathered bearded head fragment, a partial cracked torso, one isolated forearm/hand fragment, two separated lower-limb fragments, and broken pieces of the trident at their original coordinates. Most of both arms, drapery and legs are missing; the trident is incomplete and visibly broken, never a whole intact trident.
Center remains: the olive tree is only a few damaged trunk and branch fragments in situ; most leaves and branches are lost. Keep the same central trunk footprint. Preserve the salt-water fissure in exactly the same course and position.
Surface treatment: strong ancient weathering, erosion, chips, fractures, lost noses/fingers/edges, dull warm Pentelic marble, accumulated grime in crevices. Almost all pigment has faded away, with only rare microscopic traces of mineral blue, iron red and ochre in protected recesses. No pristine polished surfaces.
Archaeological credibility: read as incomplete surviving stone fragments anchored to or laid against the original weathered backing slab, with irregular absences and negative space—not complete statues recolored beige, not an intact ruin reenactment.
Constraints: no text, no labels, no annotations, no reconstruction outlines drawn in ink, no interface, no split-screen, no additional figures, no display cases, no museum room, no metal armature, no watermark.
Avoid: intact full figures, intact complete Athena, intact complete Poseidon, intact trident, complete shield, complete tree canopy, polished white sculpture, fresh painted clothing, fantasy ruins, Roman or medieval elements, newly invented fragment placements. Change only preservation state; keep all alignment invariants unchanged.
```

### Acceptance note

The selected output visibly breaks the figures into fragments instead of merely removing color, while retaining the canvas, frontal camera, pediment edge, central fissure, and major alignment anchors needed for the interactive reveal. The interface explicitly labels this as a stylized evidence map rather than a replica of surviving fragments.

## Revision history

| Version | Date       | Change                                                                                                                                   |
| ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-08-12 | Added the accepted Chapter 2–6 hero index and delegated full provenance to chapter-owned manifests.                                      |
| 1.0.0   | 2026-08-12 | Recorded the accepted reconstruction and stylized evidence-layer assets with full prompts, hashes, statuses, and documentary disclaimer. |

## Chapter 2–6 asset index

The later chapter heroes remain owned by their chapter directories. Their complete prompts, candidates, source and entity dependencies, hashes, critique decisions, and caveats live in the linked local manifests.

| Chapter | Asset ID                       | Accepted public asset                                                   | Mode                           |  Dimensions | Primary status            | Chapter provenance                                                       |
| ------- | ------------------------------ | ----------------------------------------------------------------------- | ------------------------------ | ----------: | ------------------------- | ------------------------------------------------------------------------ |
| 2       | `east-pediment-lost-center-v1` | `/myth-img/athena-birth-east-pediment/east-pediment-lost-center-v1.png` | `missing-center-pediment`      | 1122 × 1402 | `artistic-interpretation` | `chapters/athena-birth-east-pediment/imgs/generation-manifest.md`        |
| 3       | `erechtheion-memory-map-v1`    | `/myth-img/erechtheion-many-memories/erechtheion-memory-map-v1.png`     | `layered-sanctuary-cutaway`    | 1122 × 1402 | `artistic-interpretation` | `chapters/erechtheion-many-memories/imgs/generation-manifest.md`         |
| 4       | `distributed-archive-v1`       | `/myth-img/athena-parthenos-lost-statue/distributed-archive-v1.png`     | `distributed-archive-assembly` | 1122 × 1402 | `artistic-interpretation` | `chapters/athena-parthenos-lost-statue/imgs/generation-manifest.md`      |
| 5       | `procession-reading-band-v1`   | `/myth-img/parthenon-frieze-procession/procession-reading-band-v1.png`  | `procession-reading-band`      | 1003 × 1568 | `artistic-interpretation` | `chapters/parthenon-frieze-procession/imgs/generation-manifest.md`       |
| 6       | `theatre-palimpsest-v1`        | `/myth-img/theatre-of-dionysus-myth-on-stage/theatre-palimpsest-v1.png` | `chronological-palimpsest`     | 1122 × 1402 | `artistic-interpretation` | `chapters/theatre-of-dionysus-myth-on-stage/imgs/generation-manifest.md` |

Shared facts for these five assets:

- Generator: Codex built-in `image_gen.imagegen`; no external API or CLI.
- Generation date: 2026-08-12.
- Model identifier: not exposed reliably by the tool.
- Candidate policy: one generated candidate was visually inspected and accepted for each chapter hero.
- Reference role: the accepted Chapter 1 reconstruction supplied material and palette continuity only; none of its composition or characters was copied as evidence.
- Post-processing: file copy into the blog public path only; no repainting, compositing, crop, or generative edit recorded.
- Rights: AI-generated project assets; source-page access did not grant reuse of museum or publication imagery.
- Documentary status: all five images are original artistic evidence maps. None is a photograph, scan, measured drawing, recovered ancient view, or exact archaeological restoration.
