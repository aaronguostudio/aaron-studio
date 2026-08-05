# QA Factory prototype audio

Eight-second, narration-free cue for the `QA Factory` behavior-comedy test.

- `0.000–4.600`: confident excerpt from the approved project music
- `0.700`: synthesized scanner double-pulse
- `3.150`: synthesized approval stamp
- `4.600`: sample-level music stop plus synthesized trap-door clunk
- `4.925–8.000`: digital silence for the deadpan hold

Use `final-mix.wav` as the render master. `final-mix.m4a` is the compact
audition copy. Run `./build-audio.sh` from any directory to regenerate all
audio deterministically from the parent project's selected music.

Technical QA is recorded in `audio-qa.json`; comic timing still requires a
human listen.
