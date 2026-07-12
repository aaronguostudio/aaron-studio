# Audio Generation: FDE Workflow 3

## Status

Audio approved. Aaron selected blind sample B because it preserved his voice identity better than the more natural v3 candidate. Do not render the video until the newly generated full production file receives a final listening check.

## Source Lock

- Article: `why-ai-companies-are-becoming-deployment-companies.md`
- Article Lock: PASS
- Video brief: `video-brief.md`
- Script: `youtube-script.md`
- Script audit: PASS, estimated 360 seconds, 26 planned image beats, no warnings
- Spoken transcript gate: PASS for the hook and all eight sections
- Spoken words before TTS: approximately 899

## Voice And TTS

- Provider: ElevenLabs
- Voice ID: `R2DWp7zZuWmGxk3r8GIA`
- Voice type: Aaron's new Professional Voice Clone
- Model: `eleven_multilingual_v2`
- Speed: `1.0`
- Stability: `0.5`
- Similarity boost: `0.75`
- Style: `0.5`
- Speaker boost: enabled
- Sample rate: 44.1 kHz
- Channels: mono

## Outputs

- Final normalized review audio: `audio-voice-R2DWp7zZuWmGxk3r8GIA-workflow3.mp3`
- 60-second opening sample: `audio-voice-R2DWp7zZuWmGxk3r8GIA-workflow3-sample-60s.mp3`
- Raw ElevenLabs audio: `audio-voice-R2DWp7zZuWmGxk3r8GIA-workflow3-raw.mp3`
- Exact transcript sent to TTS: `audio-transcript-voice-R2DWp7zZuWmGxk3r8GIA-workflow3.md`
- Rejected formalized-rewrite candidate: `audio-voice-R2DWp7zZuWmGxk3r8GIA-candidate-formalized-rewrite.mp3`
- Rejected candidate transcript: `audio-transcript-voice-R2DWp7zZuWmGxk3r8GIA-candidate-formalized-rewrite.md`

## Technical QA

- Duration: 466.95 seconds, approximately 7:47
- Final bitrate: 192 kbps
- Final integrated loudness: -16.67 LUFS
- Final true peak: -1.66 dB
- Loudness range: 4.1 LU
- Silence longer than two seconds: none detected in the raw generation
- File decode and probe: PASS

## Workflow Finding

The first run exposed a failure in the default conversational rewrite. It made an already natural script more formal and changed ACTOR labels into generic prose. That candidate was rejected before voice evaluation.

The workflow now skips LLM rewriting when source narration already passes the deterministic spoken-language gate. The ACTOR section was also rewritten as declarative checks so every source section passes without requiring an LLM edit.

## Human Listening Scorecard

Score each dimension from 1 to 5:

| Dimension | Question | Score |
|---|---|---:|
| Identity | Does this sound recognizably like Aaron? | pending |
| Naturalness | Does it sound spoken rather than synthesized or presented? | pending |
| Pronunciation | Are Anthropic, OpenAI, AWS, Microsoft, Palantir, FDE, ACTOR, and Recursive clear? | pending |
| Pace | Is the 1.0 speed steady without dragging or rushing? | pending |
| Technical clarity | Are numbers, framework labels, and business terms easy to follow? | pending |
| Fatigue | Is the voice comfortable for the full 7:47? | pending |

## Decision

APPROVED PROFILE: `aaron-pvc-identity-v1`

- Selected sample: B
- Voice ID: `R2DWp7zZuWmGxk3r8GIA`
- Priority: recognizable Aaron identity over generic naturalness
- New production review audio: `audio-voice-R2DWp7zZuWmGxk3r8GIA-identity-v1.mp3`
- New 60-second sample: `audio-voice-R2DWp7zZuWmGxk3r8GIA-identity-v1-sample-60s.mp3`
- New generation manifest: `audio-generation-voice-R2DWp7zZuWmGxk3r8GIA-identity-v1.json`
