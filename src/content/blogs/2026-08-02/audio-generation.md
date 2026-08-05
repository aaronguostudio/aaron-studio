# Audio Generation: What AI Code Can Change

## Status

APPROVED BY AARON on 2026-08-02.

The production narration and three 60-second review windows passed technical QA. Aaron approved the listening gate in the active production thread and authorized the upgraded video workflow.

## Source Lock

- Article: `what-ai-code-can-change.md`
- Article Lock: PASS
- Video brief: `video-brief.md`
- Script: `youtube-script.md`
- Script audit: PASS
- Script SHA-256: `7ed8333f091fe3a16d396963ef1c16286c113e2f5e7db8f6dad83f75bde18a5d`
- Spoken transcript: `audio-transcript.md`
- Transcript SHA-256: `e8ef99c6d7566df2308f1eb778c31a2b71bca4eebd7c769bbf10ba682b6d9ee7`
- Transcript fidelity: PASS; normalized narration text matches the approved hook and all seven script sections exactly
- Conversational rewrite: skipped intentionally because the approved script already passed the spoken-language gate

## Voice And TTS

- Provider: ElevenLabs
- Voice profile: `aaron-pvc-identity-v1`
- Voice ID: `R2DWp7zZuWmGxk3r8GIA`
- Model: `eleven_multilingual_v2`
- Output format: `mp3_44100_192`
- Speed: `1.0`
- Stability: `0.5`
- Similarity boost: `0.75`
- Style: `0.5`
- Speaker boost: enabled
- Profile provenance: Aaron selected blind sample B on 2026-07-11, prioritizing recognizable voice identity

## Outputs

- Final normalized review audio: `audio.mp3`
- Raw ElevenLabs narration: `audio-raw.mp3`
- Opening review window, 0:00–1:00: `audio-sample-60s.mp3`
- Middle review window, 1:52–2:52: `audio-sample-middle-60s.mp3`
- Late review window, 3:44–4:44: `audio-sample-late-60s.mp3`
- Exact transcript sent to TTS: `audio-transcript.md`
- Reproducibility and timing manifest: `audio-generation-manifest.json`

## Technical QA

- Duration: 284.31 seconds, approximately 4:44
- Effective pace: approximately 118 spoken words per minute
- Codec: MP3
- Sample rate: 44.1 kHz
- Channels: mono
- Bitrate: 192 kbps
- Integrated loudness: -16.68 LUFS
- True peak: -1.68 dBTP
- Loudness range: 3.9 LU
- Long silences: 0
- Final and raw files preserved independently: PASS
- Final audio and all three samples decode and probe correctly: PASS
- Raw generation before normalization: -29.73 LUFS, -5.18 dBTP

### Artifact Hashes

| Artifact | SHA-256 |
|---|---|
| `audio.mp3` | `b3d08991083afc0e4d7dd8da2753dced2e5491513632d621d104bec72bc0cd10` |
| `audio-raw.mp3` | `7054692802ae0082b4a3a7fd2345b1f1dedb03694a0ce3a4caa507b9a543ad34` |
| `audio-sample-60s.mp3` | `6da4199bc37cd684f5870430c8b064728d9873f8f67c97e6159346c67bbd81bb` |
| `audio-sample-middle-60s.mp3` | `98da95373565cedf10401af890f2010a60e4d164fc6988fd31424fdf7903ed41` |
| `audio-sample-late-60s.mp3` | `cbdf4a26e248e45a3d61ca1039ee642ddfd03d19e0e80f512e1de775ab10fe0a` |

Independent artifact QA: PASS. This covers file integrity, technical levels, voice-profile configuration, and transcript fidelity; it does not replace human voice approval.

## Listening Scorecard

Score each dimension from 1 to 5. Identity, naturalness, and pronunciation are human gates; technical QA cannot approve them.

| Dimension | Listening question | Score |
|---|---|---:|
| Identity | Does this sound recognizably like Aaron? | approved |
| Naturalness | Does it sound spoken rather than synthesized or presented? | approved |
| Pronunciation | Are Mitchell Hashimoto, Uncle Bob, AI, CI, `paused`, `inactive`, and `system of record` clear? | approved |
| Pace | Is the 1.0-speed delivery steady without dragging or rushing? | approved |
| Technical clarity | Are the state transition, 12:01 test, four review levels, and final change contract easy to follow? | approved |
| Fatigue | Is the voice comfortable across the full 4:44? | approved |

## Decision

APPROVED.

- Use the manifest's measured segment and word timings to replace provisional storyboard timestamps.
- After retiming, render and review both planned 60–90 second visual prototypes before any full-video render.
