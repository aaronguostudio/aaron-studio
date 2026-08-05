# Video QA Plan: The Authority Boundary

## Status And Scope

- **Status:** PLAN ONLY. None of the checks below has been executed by this document.
- **Film:** `Should You Read AI-Generated Code? Ask This First`
- **QA owner:** independent review pass after implementation and again after encode.
- **Canonical narration:** `audio.mp3`, 284.305125 seconds, already approved at the audio-only gate.
- **Target canvas:** 1920 × 1080, 30 fps, 16:9.
- **Compositions under test:**
  - `AuthorityBoundaryCorePrototype`
  - `AuthorityBoundaryContractPrototype`
  - `AuthorityBoundaryFullFilm`
- **Out of scope:** this plan does not change Remotion code, the storyboard, director files, asset plan, scene registry, or capability status.

The prototypes may pass only as prototypes. No `prototype` or `experimental`
template becomes production-ready from a visual review alone. Registry promotion
also requires the scene-catalog contract, fallback coverage, tests/audit
coverage, and an explicit registry decision. The full render remains blocked
until the storyboard and evidence audits pass in production mode with no
non-available capability.

## Exact Timing Contract

Use `F(t) = ceil(t × 30)` for the first frame on or after a timed event. For a
dependency at frame `F`, inspect `F-1 / F / F+1`. Composition duration uses
`ceil(duration × 30)`; the last valid frame is therefore `durationInFrames - 1`.

| Composition | Source interval | Local interval | Expected frames | Last valid frame | Encoded duration at 30 fps |
|---|---:|---:|---:|---:|---:|
| `AuthorityBoundaryCorePrototype` | 44.884317–128.963628 | 0–84.079311 | 2523 | 2522 | 84.100000 s |
| `AuthorityBoundaryContractPrototype` | 128.963628–216.224218 | 0–87.260590 | 2618 | 2617 | 87.266667 s |
| `AuthorityBoundaryFullFilm` | 0–290.305125 | 0–290.305125 | 8710 | 8709 | 290.333333 s |

For the full film, narration occupies 0–284.305125. The registered
`brand-end-card` owns 284.305125–290.305125, exactly six source seconds and 180
encoded frames (`8530–8709`). `ffprobe` duration may differ from the source
seconds only by the final-frame quantization shown above.

Prototype coverage is deliberate:

| Prototype | Calm/evidence case | Structured explanation | Signature/newest dependency |
|---|---|---|---|
| Core | Accountability evidence and the quiet 12:01 rollback hold | `PAUSED → INACTIVE` system map | Coral authority-path crossing and persistent downstream residue |
| Contract | Equal reading/evidence lanes before focus changes | Four-level cumulative ladder | Evidence lanes compress into the authority statement without layout overlap |

Together they exercise real long copy, dense peer layouts, a connector/path
dependency, a cumulative framework, real narration, captions, and the actual
transitions surrounding each scene family.

## Gate Order

1. Confirm all three composition IDs resolve at 1920 × 1080 / 30 fps with the
   duration contract above.
2. Run director, evidence, and storyboard audits in planning mode.
3. Render both prototypes with narration, intended captions, real transitions,
   and the selected music path. Use concurrency `1` for any canvas, 3D, shader,
   or otherwise nondeterministic scene.
4. Produce source-frame and encoded-master contact sheets, plus sequential
   dependency windows.
5. Watch each prototype once without stopping, then perform frame, caption,
   audio, and technical inspection.
6. Record results in `video-qa-report.md`. Do not render the full film until
   both prototypes pass and every non-available capability is promoted or
   replaced by its audited available fallback.
7. Run storyboard and evidence audits with `--production`, then validate the
   Remotion project if renderer code changed.
8. Render and inspect the full film. A prototype pass does not waive the full
   master checks.

## Prototype 1: Core — Key Frames

Local zero maps to global 44.884317. This slice must test source/accountability,
the hypothetical wrong-state system map, and rollback residue with real audio
and captions.

### Entry / Peak / Exit

| Scene state | Local time | Frame | Expected reading |
|---|---:|---:|---|
| Accountability entry | 0.000000 | 0 | Meaningful source/accountability layout is already present; no blank or taxonomy-only stage. |
| Accountability peak | 11.975683 | 360 | `AUTHORITY` has finished resolving only after the two positions and ownership synthesis are legible. |
| Accountability exit | 15.533333 max | 466 | One hierarchy owns the final debate frame; no partial next layout. |
| Wrong-status entry | 15.534005 | 467 | Full `PAUSED / INACTIVE` scaffold is visible in a quiet state. |
| Wrong-status peak | 53.315683 | 1600 | Authority path and all business consequences have resolved; no endpoint precedes its connector. |
| Wrong-status exit | 56.533333 max | 1696 | Status map hands persistent coral marks to the rollback scene without a black gap. |
| Rollback entry | 56.540445 | 1697 | Rollback illustration is meaningful immediately; retracted code and persistent state can be distinguished. |
| Rollback peak | 80.515683 | 2416 | `rollback code ≠ restore reality` has finished resolving after all downstream residue is visible. |
| Prototype exit | 84.066667 | 2522 | Final phoneme and caption are intact; no flash, stale partial layout, or clipped fade. |

### Dependency Windows

Extract all listed windows sequentially from both the Remotion source and the
encoded prototype. The middle frame is the first frame allowed to show the new
dependent state.

| Dependency | Local time | Before / at / after frames | Pass condition |
|---|---:|---:|---|
| Ownership result begins | 6.130000 | 183 / 184 / 185 | Both attributed quote lanes are established before the shared result appears. |
| Debate lanes begin to clear | 10.835683 | 325 / 326 / 327 | Dense evidence clears before the large authority statement enters; clearing completes at frame 341. |
| Authority statement begins | 11.378000 | 341 / 342 / 343 | The statement owns a separate stage and completes by frame 360. |
| Status-map handoff | 15.534005 | 466 / 467 / 468 | Clean cut/shared-object handoff; never crossfade two complete text-heavy layouts. |
| Status header bridge completes | 16.334005 | 490 / 491 / 492 | Full scaffold and labels are already readable; bridge motion does not delay comprehension. |
| Wrong implementation mapping begins | 23.197005 | 695 / 696 / 697 | Implementation emphasis begins before CI turns green and completes by frame 730. |
| `CI GREEN` begins | 28.688005 | 860 / 861 / 862 | CI appears only after the implementation assumption is established; activation completes by frame 886. |
| Semantic contrast begins | 30.244005 | 907 / 908 / 909 | `INACTIVE` becomes a tension state without resizing either peer; transition completes by frame 1057. |
| Implementation/test agreement | 39.613005 | 1188 / 1189 / 1190 | Agreement is shown as consistency, not verified business truth; animation completes by frame 1222. |
| Authority path begins | 48.994005 | 1469 / 1470 / 1471 | Connector/path starts before any downstream consequence activates. |
| Billing path-arrival threshold | 51.297960 | 1538 / 1539 / 1540 | First node activates only after the path reaches its documented 0.56 progress. |
| Access path-arrival threshold | 51.545050 | 1546 / 1547 / 1548 | Second node follows its own 0.66 arrival; it does not reuse the first threshold. |
| Notification path-arrival threshold | 51.819183 | 1554 / 1555 / 1556 | Third node follows the 0.76 arrival in sequence. |
| Reporting path-arrival threshold | 52.154875 | 1564 / 1565 / 1566 | Final node follows the 0.86 arrival; full path resolves by frame 1600. |
| Rollback scene begins | 56.540445 | 1696 / 1697 / 1698 | The outgoing connection stops while already-propagated state remains visible; bridge completes by frame 1721. |
| 12:01 clock begins | 59.419445 | 1782 / 1783 / 1784 | Clock is readable without covering persistent marks; animation completes by frame 1861. |
| Next bad write stops | 65.131445 | 1953 / 1954 / 1955 | Stop state does not erase consequences; activation completes by frame 1973. |
| Persistent records begin | 67.326445 | 2019 / 2020 / 2021 | Residue appears only after the stop, establishing the causal contrast. |
| Copies / email / access / human action | 69.903445 / 71.842445 / 73.735445 / 75.952445 | 2097–2099 / 2155–2157 / 2212–2214 / 2278–2280 | Each consequence enters in narration order; no terminal-only reveal makes an intermediate consequence arrive early. |
| Final rollback conclusion begins | 79.760445 | 2392 / 2393 / 2394 | Large statement appears only after all evidence is present and completes by frame 2416. |

### Prototype 1 Pass Criteria

- Duration and frame count match the timing table.
- The actual high-content cases—the long accountability quote, two-state map,
  four consequences, and rollback residue—fit at 1920 × 1080 and remain
  readable at 640 × 360.
- A continuous 20–40 second motion sample inside the wrong-status sequence is
  understandable with narration and the intended music path.
- Entry, peak, exit, and every dependency window above pass in both source and
  encoded frames.
- The static/image-sequence fallback is present and semantically complete.
- No source quote lacks visible provenance; the hypothetical example is never
  presented as factual evidence.
- No unresolved overflow, caption collision, blank frame, nondeterministic
  canvas output, or unexplained pause remains.

## Prototype 2: Contract — Key Frames

Local zero maps to global 128.963628. This slice must test the equal-lane
reading/evidence comparison, same-context warning, and cumulative four-level
framework.

### Entry / Peak / Exit

| Scene state | Local time | Frame | Expected reading |
|---|---:|---:|---|
| Evidence comparison entry | 0.000000 | 0 | `SYSTEM MODEL` and `REPEATABLE EVIDENCE` are meaningful equal peers at frame zero. |
| Evidence comparison peak | 20.186372 | 606 | The same-context warning has resolved after both lanes' strengths and limits are understood. |
| Evidence comparison exit | 36.900000 max | 1107 | Authority conclusion resolves before the framework takes the stage. |
| Ladder entry | 36.919728 | 1108 | All four equal cards are visible, muted, and correctly ordered immediately. |
| Ladder peak | 85.116372 | 2554 | All levels remain active cumulatively and the payoff is separate from the cards. |
| Prototype exit | 87.233333 | 2617 | Final caption and cumulative state are complete; no clipped layout or empty tail. |

### Dependency Windows

| Dependency | Local time | Before / at / after frames | Pass condition |
|---|---:|---:|---|
| Evidence bridge completes | 0.800000 | 23 / 24 / 25 | Both peer lanes are fully readable before focus shifts. |
| Tests lane focus begins | 12.283000 | 368 / 369 / 370 | Evidence lane activates on the same baseline and type scale, without resizing the reading lane; completes by frame 395. |
| Same-context warning begins | 19.308000 | 579 / 580 / 581 | Third band enters only after both lanes are understood; it does not float over dense evidence and completes by frame 606. |
| Evidence lanes begin to clear | 28.136372 | 844 / 845 / 846 | Both lanes and warning compress before the concluding statement; clearing completes by frame 872. |
| Authority conclusion begins | 29.236372 | 877 / 878 / 879 | One statement stage owns the frame and remains caption-safe; it completes by frame 905. |
| Ladder handoff | 36.919728 | 1107 / 1108 / 1109 | No double exposure; full muted scaffold exists at the first ladder frame. |
| Ladder bridge completes | 37.719728 | 1131 / 1132 / 1133 | Header and full muted scaffold are stable before activation. |
| `OUTCOME` activation | 39.682728 | 1190 / 1191 / 1192 | Only Outcome changes accent; all card dimensions remain fixed; completes by frame 1213. |
| `EVIDENCE` activation | 46.079728 | 1382 / 1383 / 1384 | Outcome remains active; activation is cumulative and completes by frame 1404. |
| `SYSTEM MODEL` activation | 56.412728 | 1692 / 1693 / 1694 | Earlier levels remain active and readable; completes by frame 1714. |
| `CRITICAL PATH` activation | 71.249728 | 2137 / 2138 / 2139 | Earlier levels remain active; confirmation cue, if present, is synchronized; completes by frame 2160. |
| Cumulative payoff begins | 84.426728 | 2532 / 2533 / 2534 | All four levels are active before `Each level keeps the ones before it.` resolves; payoff completes by frame 2554. |

### Prototype 2 Pass Criteria

- Duration and frame count match the timing table.
- The actual long-copy/high-content evidence lanes and four-level ladder fit at
  1920 × 1080 and remain readable at 640 × 360.
- A continuous 20–40 second sample spanning the same-context warning and/or
  cumulative ladder is clear with narration and intended sound.
- Equal lanes and equal cards keep the same type, dimensions, padding,
  baselines, and outer margins at every sampled frame.
- The full scaffold is visible at ladder entry; no activation resizes or moves
  peer cards; the final payoff has its own stage.
- Source and encoded entry/peak/exit frames and every dependency window match.
- Static/image-sequence fallbacks and failure-mode tests/audits exist before any
  registry promotion is considered.

## Full Film Frame Plan

### First 20 Seconds

| Promise beat | Global time | Frame / window | Pass condition |
|---|---:|---:|---|
| First frame | 0.000000 | 0 / 1 | Approved hero, article title, useful subtitle, and Aaron brand lockup are readable immediately; no black or bare label. |
| Copied CSV patch | 3.715000 | 111 / 112 / 113 | Harmless patch is visually distinct and not generic code decoration. |
| System-of-record patch | 6.177000 | 185 / 186 / 187 | Authoritative patch uses the coral risk role without implying every AI change is dangerous. |
| Green-test question | 10.762000 | 322 / 323 / 324 | Both patches and equal-green-tests tension remain understandable. |
| `I don't` | 15.894000 | 476 / 477 / 478 | The film has answered the binary question, not merely repeated the title. |
| Hidden variable begins | 17.380000 | 521 / 522 / 523 | On-screen thesis starts before the 20-second gate. |
| Twenty-second checkpoint | 20.000000 | 599 / 600 / 601 | Viewer has seen and heard the unequal-patch problem; the complete phrase `what the code is allowed to turn into truth` must already be readable visually even though narration finishes at 21.780317. |

The first-20-second gate fails if title identity waits to animate in, if the
viewer sees only a taxonomy label, or if the visual argument still reads as
"all green tests are equivalent."

### Chapter Boundaries

At every boundary, extract `F-1 / F / F+1` sequentially from the encoded master.
Reject black gaps, double exposure, stale captions, partially initialized
layouts, and full-layout crossfades.

| Boundary | Global time | Frames |
|---|---:|---:|
| Hook → Missing Variable | 21.780317 | 653 / 654 / 655 |
| Missing Variable → Wrong Status | 60.418322 | 1812 / 1813 / 1814 |
| Wrong Status → 12:01 Test | 101.424762 | 3042 / 3043 / 3044 |
| 12:01 Test → Two Kinds of Evidence | 128.963628 | 3868 / 3869 / 3870 |
| Evidence → Four Levels | 165.883356 | 4976 / 4977 / 4978 |
| Four Levels → Objection | 216.224218 | 6486 / 6487 / 6488 |
| Objection → Release Question | 245.620681 | 7368 / 7369 / 7370 |
| Narration → Brand end card | 284.305125 | 8529 / 8530 / 8531 |

### Late-Film Dependencies

| Dependency | Global time | Before / at / after frames | Pass condition |
|---|---:|---:|---|
| Objection bridge completes | 217.024218 | 6510 / 6511 / 6512 | Both equal comparison zones and the objection header are stable. |
| Disposable lane focus / `Agreed` | 223.898218 | 6716 / 6717 / 6718 | Open gate receives focus first and completes by frame 6737; this is a clean argumentative beat, not decoration. |
| Deeper gate turns on | 228.600218 | 6858 / 6859 / 6860 | Authority boundary activates only when consequences are named. |
| Proportional answer begins | 238.678218 | 7160 / 7161 / 7162 | Comparison resolves without winner/loser styling; answer completes by frame 7184. |
| Release scene entry | 245.620681 | 7368 / 7369 / 7370 | Complete five-row scaffold is visible before activation. |
| Release bridge completes | 246.420681 | 7392 / 7393 / 7394 | Five-row scaffold is stable before activation. |
| Allowed transition | 250.706000 | 7521 / 7522 / 7523 | First row activates; later rows remain quiet; completes by frame 7539. |
| Invariant | 253.493000 | 7604 / 7605 / 7606 | Second row activates without moving the first; completes by frame 7623. |
| Divergence signal | 257.080000 | 7712 / 7713 / 7714 | Third row activates in narration order; completes by frame 7730. |
| Reconciliation path | 260.320000 | 7809 / 7810 / 7811 | Fourth row activates; restoration remains distinct from rollback; completes by frame 7827. |
| Owner | 264.023000 | 7920 / 7921 / 7922 | Fifth row activates only after the recovery path; completes by frame 7939. |
| Contract rows begin to clear | 270.000000 | 8099 / 8100 / 8101 | All five rows have resolved before the dense scaffold clears; clearing completes by frame 8122. |
| Cost statement begins | 270.791681 | 8123 / 8124 / 8125 | Cost statement owns a separate stage and completes by frame 8147. |
| Cost statement begins to clear | 275.650000 | 8269 / 8270 / 8271 | No overlap with the final question; clearing completes by frame 8288. |
| Final question begins | 276.573681 | 8297 / 8298 / 8299 | Final question owns the stage, remains caption-safe, and completes by frame 8323. |
| Brand end-card surface | 284.305125 | 8529 / 8530 / 8531 | Narration, captions, and chapter chrome end at the cut; the paper end-card surface replaces the release scene. |
| Brand lockup fully entered | 285.455125 | 8563 / 8564 / 8565 | Aaron identity is fully readable; rule animation completes separately by frame 8584. |
| End-card fade begins | 289.555125 | 8686 / 8687 / 8688 | Fade is calm and intentional; no chapter UI or stale caption returns. |
| Final visible frame | 290.300000 max | 8709 | No stale black frame, old caption, or partial logo remains. |

## Contact Sheets And Sequential Windows

Create a `video-qa/` review directory beside the article and keep source and
encoded evidence separate.

For each composition:

1. Render source stills for every entry, peak, exit, and dependency frame.
2. Render the prototype/master MP4.
3. Decode the same frames from the encoded MP4. For thresholds, decode a
   sequential three-frame window; do **not** use input-side fast seek
   (`-ss` before `-i`).
4. Build two labelled sheets:
   - full-resolution source-versus-master sheet;
   - 640 × 360 mobile-like sheet.
5. Label every tile with composition ID, local/global time, frame number, and
   semantic event. Keep threshold triplets adjacent.

Minimum sheets:

- `core-prototype-source-contact-sheet.png`
- `core-prototype-master-contact-sheet.png`
- `contract-prototype-source-contact-sheet.png`
- `contract-prototype-master-contact-sheet.png`
- `full-master-contact-sheet.png`
- one sequential threshold sheet per chapter boundary and per connector/path
  dependency listed above.

When a canvas/3D frame is involved, render the prototype twice at concurrency
`1` and compare the same pixels. Any nondeterministic blank, clip, or framing
change fails the prototype.

## Caption, Layout, And Safe-Zone Gate

- Horizontal content must stay within `x = 112–1808`.
- Reserve `y = 926–1080` (bottom 154 px) for captions and delivery chrome.
- At 640 × 360, inspect the equivalent safe area: approximately `x = 37–603`
  and the bottom 51 px.
- Captions are stable phrase-level white text, about 31 px at 1080p. No
  karaoke highlight, per-word opacity/scale/blur, decorative accent rule, or
  motion independent of the sentence.
- A phrase may lead its first spoken word by no more than two frames and may
  hold for no more than nine frames (0.30 s) after its final word. No phrase
  may bridge into the wrong chapter or survive onto the end card. Prototype
  frame zero must not display words that were trimmed out of its audio window.
- Captions may not cover diagrams, source attribution, result bands, the
  authority gate, consequence nodes, ladder cards, release rows, logo, or
  navigation.
- Long titles are constrained by both width and height. Reject a layout that
  shrinks one peer independently or forces a long heading into an arbitrary
  column.
- Dense frames must be understandable within two seconds at full size and
  remain readable at 640 × 360.
- Any rotation, perspective, scale, or translation must remain inside its
  declared transform envelope at 0/25/50/75/100% progress and all label/result
  thresholds. Information planes normally remain within 36° Y rotation, at
  least 80% projected width, and 64 px from the next protected zone.
- The end card hides captions and persistent header/chapter chrome. Aaron mark,
  name, and `AI-NATIVE BUILDER · HUMAN-FIRST THINKER` are the only primary
  hierarchy for all 180 end-card frames.

## Motion And Editorial Gate

- Every changing value is frame-driven and repeatable.
- A destination, label, endpoint marker, or arrowhead never precedes the path
  that makes it meaningful. Endpoint markers normally wait until path progress
  ≥ 0.94 and arrowheads until about 0.98; intermediate nodes use their actual
  path-arrival fractions.
- Entry motion settles before the next explanation begins.
- Structured scenes receive a meaningful visual beat at least every eight
  seconds. Calm scenes receive one at least every twelve seconds unless the
  storyboard explicitly documents the hold.
- Evidence compresses or exits before a large conclusion enters.
- Typography-heavy and diagram-heavy layouts do not crossfade as complete
  stages. One information hierarchy owns every boundary frame.
- The status map, same-context warning, four-level ladder, and release contract
  clarify sequence or causality rather than demonstrating a template.
- Watch each prototype and the full film once without stopping. Record pacing,
  fatigue, confusing holds, repetitive composition, and any scene that feels
  like a template demo.

## Audio, Music, And A/V Sync Gate

- Compare the encoded audio against the approved `audio.mp3`; do not regenerate
  narration for visual convenience.
- Narration must begin cleanly at frame zero in the full film. Prototype trims
  must start on a complete phrase and end without clipping a phoneme.
- Spot-check visual-event and caption sync at these full-film anchors, using a
  tolerance of ±2 frames: `F0` opening, `F654` Mitchell/debate, `F1813` status
  case, `F1970/F1997` paused/inactive, `F2208` CI green, `F3130` 12:01 question,
  `F4449` same-context warning, `F5060/F5252/F5562/F6007` ladder levels,
  `F7369` critical-write contract, and `F8354` final question.
- Narration is clear on neutral headphones and a phone speaker. No clipped
  consonants, joins, digital pops, stereo phase problem, or late-section drift.
- If music is used, its source, rights, and selected asset ID must be recorded.
  It must be audibly present where planned, duck smoothly under narration,
  avoid pumping between short phrases, and resolve with the final argument.
- If no music clears, the approved dry-narration fallback is valid; do not leave
  an inaudible or unlicensed track on the timeline.
- Sound effects are sparse and synchronized to visible events. There is no
  decorative whoosh on every transition.
- At frame 8530, narration ends and the end-card sound state begins cleanly.
  A dry six-second end card is allowed only as an intentional documented hold.

## Encoded-Master Technical Checks

Run these checks for both prototypes and the full master, saving raw output in
the QA directory. Command examples are plans, not evidence that they ran.

```bash
# Decode and stream metadata
ffmpeg -v error -i <master.mp4> -f null -
ffprobe -v error -show_streams -show_format -count_frames -of json <master.mp4>

# Final encoded loudness and true peak
ffmpeg -i <master.mp4> -filter_complex "[0:a]ebur128=peak=true" -f null -

# Unexpected black and frozen intervals
ffmpeg -i <master.mp4> -vf "blackdetect=d=0.10:pix_th=0.10:pic_th=0.98" -an -f null -
ffmpeg -i <master.mp4> -vf "freezedetect=n=-50dB:d=1.0" -an -f null -

# Unexpected long silence
ffmpeg -i <master.mp4> -af "silencedetect=n=-45dB:d=1.5" -vn -f null -
```

Technical pass criteria:

- H.264-compatible 1920 × 1080 video, square pixels, 30/1 fps, decodes with no
  errors, and includes the intended audio stream.
- Frame counts are exactly 2523, 2618, and 8710 for the two prototypes and full
  film respectively. Encoded duration is within one 30 fps frame of the table.
- Final full-film mix measures roughly `-16 LUFS` (acceptable planning band
  `-17 to -15 LUFS`) with true peak at or below `-1.5 dBTP`. Prototype excerpts
  may vary in integrated loudness but must remain within `-18 to -14 LUFS` and
  the same true-peak ceiling.
- No unexplained black interval ≥ 0.10 s. In particular, no black gap at frame
  zero, chapter cuts, prototype boundaries, or the end card.
- Every freeze interval maps to a declared still/hold. Reject any unexplained
  structured freeze over eight seconds or calm freeze over twelve seconds.
  The six-second brand end card is allowed only when visually intentional.
- No unintended silence ≥ 1.5 s inside narration. Declared structural pauses
  and a dry end card must be reviewed by ear rather than auto-failed.
- No first/last-word clipping, audio underrun, drift, or stale caption after
  284.305125 seconds.

## Product Acceptance

### Prototype PASS

Each prototype passes only when:

- exact duration, source/master contact sheets, mobile inspection, all
  dependency windows, captions, safe zones, motion, audio, and technical gates
  pass;
- the prototype is understandable in one uninterrupted watch and does not feel
  tiring or like a template demonstration;
- the actual long-title/high-content case passes;
- a deterministic available fallback exists and is legible;
- tests/audit coverage exists for the scene's main failure modes;
- all findings and caveats are recorded in `video-qa-report.md`.

Passing a prototype does not itself change the scene registry.

### Full Film PASS

The full film passes only when:

- both prototypes have passed and production audits accept every capability;
- the first 20 seconds deliver the title/thumbnail promise;
- all chapter boundaries, late-film dependency windows, safe zones, captions,
  full-watch pacing, audio, loudness, decode, black, freeze, and silence checks
  pass;
- a viewer can explain the main claim: review depth follows what code can
  change, and authoritative state requires deeper understanding and recovery;
- visuals add evidence or causal understanding rather than merely duplicating
  narration;
- the status-propagation/rollback sequence is memorable and comprehensible;
- the final question resolves the argument, and the six-second brand end card
  closes cleanly with no stale chapter UI.

Any failed item keeps the relevant prototype or full film at **FAIL / NEEDS
REVISION**. Do not report a pass until the rendered evidence and human full-watch
review exist.
