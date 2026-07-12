# Video QA Report V2: FDE Field Signal

## Deliverable

- Master: `fde-field-signal-prototype-v2.mp4`
- Composition: `FdeFieldSignalPrototypeV2`
- Duration: 80.96 seconds
- Video: H.264, 1920x1080, 30 fps, yuv420p-compatible
- Audio: AAC, 48 kHz, stereo
- File size: approximately 6.46 MB
- SHA-256: `4bc2dc6b80da1d937a075db237d07c3fe8df9358ad8f5031c7d450bd40ea9be0`

The original prototype and audio remain preserved for comparison.

## Workflow Gates

- Aaron video script and voice identity: unchanged from the approved prototype.
- Narration retime: PASS at `1.04x`; exact provenance is recorded in
  `audio-retime-v2.json`.
- V2 storyboard planning audit: PASS with expected prototype warnings for
  scenes `s01` through `s04`.
- Remotion typecheck: PASS.
- Remotion source audit: PASS. The only warnings are the two pre-existing static
  files `TitleCard.tsx` and `GradientOverlay.tsx`.
- Skill test suite: PASS, 49 tests.
- Deterministic final render: PASS with concurrency `1`.

## Visual Review

| Scene | V2 check | Result |
|---|---|---|
| Prelude | FDE and the Model -> Field -> Product scaffold are visible on frame zero | PASS |
| Company convergence | Four muted card positions exist at entry; evidence compresses before the question enters | PASS |
| Deployment reveal | Single-accent operating list remains legible behind the paper model plane | PASS |
| Consulting vs FDE | Equal columns, shared node geometry, and one full-width result band | PASS |
| ACTOR | Stable five-card grid; return path completes before the arrowhead appears; payoff uses a separate stage | PASS |

The final encoded-master contact sheet was generated through sequential decode,
not fast seek. A separate 15-frame sequential window around the ACTOR endpoint
was inspected. It contains no dropped layers, orphan arrowhead, or partial
animation state and agrees with the Remotion source still.

`blackdetect` reported a 0.57-second candidate during a very dark evidence-stage
transition and a 0.37-second final fade. Sequential frames confirm the first is
not blank; the second is the intentional ending.

## Audio Review

- Voice: `aaron-pvc-identity-v1`, voice ID `R2DWp7zZuWmGxk3r8GIA`.
- Narration: approved take preserved and retimed to 77.78 seconds.
- Music: approved ElevenLabs cue preserved and retimed to the 80.90-second
  master arc.
- Final encoded mix: approximately `-17.26 LUFS`, `-4.01 dBTP`, and `3.40 LU`
  loudness range.
- No unintended silence above 0.7 seconds. The final 0.86-second silence is the
  intentional music and picture fade.

## Product Review

Technical, layout, and motion QA pass. Aaron's uninterrupted listening and
viewing remain the approval gate for three matters of taste:

1. Whether `1.04x` is the right small increase in narration pace.
2. Whether `signal-editorial-v0.1` should become a reusable visual baseline.
3. Whether the quieter company-card scaffold creates the intended premium pace.

## Reusable Learnings

1. A palette needs semantic roles before it needs more colors.
2. Large statements and dense evidence should use mutually exclusive stages.
3. Equal comparisons should be generated from shared geometry, not hand-tuned
   boxes.
4. Endpoint motion must derive from late parent progress; ACTOR arrowheads now
   begin at about `98.5%` path completion.
5. An approved voice take can be tightened transparently before regenerating
   TTS, provided captions and music are independently retimed.
6. Critical encoded-frame QA must use sequential decoding. Input-side fast seek
   can create a false partial-frame failure around inter-frame animation.
