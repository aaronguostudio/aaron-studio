# FDE Voice Test Answer Key

Open this file only after the first listening decision.

## Sample A

- Model: `eleven_v3`
- Mode: Natural
- Stability: `0.5`
- Similarity boost: `0.8`
- Style: `0`
- Speaker boost: enabled
- Speed: `1.03`
- Direction: sparse `[curious]`, `[thoughtful]`, and `[confident]` tags
- Duration: approximately 56.08 seconds

## Sample B

- Model: `eleven_multilingual_v2`
- Mode: current production baseline
- Stability: `0.5`
- Similarity boost: `0.75`
- Style: `0.5`
- Speaker boost: enabled
- Speed: `1.0`
- Duration: approximately 62.93 seconds

## Sample C

- Model: `eleven_multilingual_v2`
- Mode: tuned long-form candidate
- Stability: `0.4`
- Similarity boost: `0.8`
- Style: `0`
- Speaker boost: enabled
- Speed: `1.05`
- Duration: approximately 64.37 seconds

The tuned request produced a slightly longer result despite the higher speed value. This is useful evidence that speed alone does not determine perceived or measured pace, and that ElevenLabs generations remain non-deterministic.

## Sample D

- Model: `eleven_v3`
- Mode: Creative stress test
- Stability: `0`
- Similarity boost: `0.8`
- Style: `0`
- Speaker boost: enabled
- Speed: `1.03`
- Direction: `[excited]` and `[curious]` tags
- Duration: approximately 28.40 seconds

## Technical QA

| Sample | Duration | Integrated loudness | True peak | Decode |
|---|---:|---:|---:|---|
| A | 56.08 s | -16.77 LUFS | -1.72 dBTP | PASS |
| B | 62.93 s | -16.83 LUFS | -1.60 dBTP | PASS |
| C | 64.37 s | -16.76 LUFS | -1.62 dBTP | PASS |
| D | 28.40 s | -17.05 LUFS | -1.73 dBTP | PASS |

The maximum loudness difference is approximately 0.29 dB. All source requests asked ElevenLabs for `mp3_44100_192` directly before final normalization.

## Aaron's Decision

Aaron selected sample B on 2026-07-11. He found it substantially closer to his real voice than sample A. Although A sounded more natural, preserving recognizable voice identity and the long-term value of a personal voice IP was the higher priority.

Sample B is now the production profile `aaron-pvc-identity-v1`.

## Workflow Changes Applied

- Expose model and voice settings as command-line options.
- Add model-specific character limits and request continuity.
- Add deterministic test seeds where supported.
- Request production output quality directly from ElevenLabs.
- Add short blind A/B listening as the gate before full narration.
- Record the promoted voice in a versioned profile, tests, manifests, and skill documentation.

Pronunciation dictionaries, a paragraph-level delivery map, and Voice Remix remain conditional improvements. Add them only when listening reveals a repeatable problem; do not change the approved voice merely to exercise a feature.
