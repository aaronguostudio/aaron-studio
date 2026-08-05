# Music Candidate Review — Human Review Required 001

## Recommendation

Select **Candidate B — Dry Acoustic Deadpan** as the safest production source.
It has the most controllable voiceover bed, the lowest loudness range (`6.6 LU`),
ample peak headroom (`-7.1 dBTP` raw), an unmistakable four-second silence, and
no late dynamic surge. Its generated silent passage begins later than the edit's
first feedback quote, so the final mix should automate the music down at `03.8`
and return with a deliberate source edit around `07.2–11.5`; do not simply lay
the untouched file under the entire film.

Candidate C is the stronger alternate if the cut needs more kinetic contrast.
Its feedback section is almost silent (`-52.3 dBFS` mean) and its final leave is
excellent, but the `21.6 LU` range and `-1.3 dBTP` peak make it more intrusive
under narration. Candidate A is rejected for this cut because nearly all of its
energy arrives after `15.8`, producing the opposite of the requested confident
opening and embarrassed drop.

## Fair Audition Files

Each `audition-normalized.m4a` is exactly `24.000s`, 48 kHz stereo AAC, and
level-matched to approximately `-21 LUFS` without changing the internal
dynamics. The original Eleven Music response remains untouched as `music.mp3`.

| Candidate | Character | Raw LUFS | LRA | True peak | Main silence | Decision |
|---|---|---:|---:|---:|---|---|
| A | Forensic chamber | -20.7 | 18.9 | -3.6 dBTP | none | Reject |
| B | Dry acoustic deadpan | -20.3 | 6.6 | -7.1 dBTP | 7.732–11.831s | Select |
| C | Kinetic editorial | -20.8 | 21.6 | -1.3 dBTP | 6.244–11.020s | Alternate |

## Human Gate

The runtime used for this production can generate and technically inspect audio
but cannot monitor it through an audio-input channel. Waveforms, spectrograms,
section loudness, silence placement, headroom, and prompt compliance were
reviewed; Aaron's quick human listen remains the final taste gate before the
track ships. This is especially important for this series, whose premise is that
technical QA is not a substitute for human judgment.

## Provenance And Rights

- All three sources were generated through the repository's Eleven Music API
  workflow with model `music_v2` and `force_instrumental: true`.
- Prompts, request configs, provider song IDs, source hashes, technical analysis,
  and normalized audition copies are retained beside each source file.
- The tracks are project-specific and explicitly excluded from automatic asset
  library intake until a human selects one.
- Reconfirm the active ElevenLabs paid-plan and Music terms before commercial
  publication, as recorded in each generation manifest.
