# Asset Decision Log

## SpaceX official — Booster 20 rollout

- Job: establish current Flight 13 preparation on the first frame.
- Source page: https://x.com/SpaceX/status/2075353490713432440
- Creator: SpaceX.
- Retrieved: 2026-07-15.
- Source range: `00:00.000–00:06.400`.
- Raw file: `assets/raw/booster20-rollout.mp4`.
- Raw SHA-256: `9824afb99d7fe249d305b408f72c684ac520e3375b2d26a284d52c6e1f2b832b`.
- Normalized file: `assets/normalized/booster-rollout-vertical.mp4`.
- Normalized SHA-256: `1e2c3712fc6f5a39844cd1464bddfc6fb9ee002a84ba336da0a78fa59e5ec016`.
- Treatment: 4K source preserved unchanged; minimal excerpt normalized to a
  1080x1920, 30 fps, silent insert with a full-width sharp center and blurred
  vertical background.
- Rights lane: `commentary-review`; approved for this local prototype with an
  on-screen source label. This is not a license or a claim of zero risk.
- Fallback: source-labelled still from the same official post.

## SpaceX official — Flight 13 announcement / static fire

- Job: make the engine and propulsion context physically legible while the
  narration distinguishes spectacle from the actual test.
- Source page: https://x.com/SpaceX/status/2076075162420629714
- Creator: SpaceX.
- Retrieved: 2026-07-15.
- Source range: `00:08.000–00:14.200`.
- Raw file: `assets/raw/flight13-announcement.mp4`.
- Raw SHA-256: `4b96f4f053e62ffa20de64345f2935091c421bf60aa330be5a2c1d49c0384cc7`.
- Normalized file: `assets/normalized/static-fire-vertical.mp4`.
- Normalized SHA-256: `987a97ce64c73a167ecd7df3936c77d79048fb961430039d6df4cdda2e1f965c`.
- Treatment: 1080x1920, 30 fps, muted, source-labelled.
- Rights lane: `commentary-review`; approved for this local prototype.
- Fallback: owned propulsion statement card.

## SpaceX official — Starship test archive

- Job: provide one short visual reset before the payoff without implying that
  Flight 13 has already launched.
- Source page: https://x.com/SpaceX/status/2076075162420629714
- Creator: SpaceX.
- Retrieved: 2026-07-15.
- Source range: `00:48.000–00:54.200`.
- Normalized file: `assets/normalized/launch-archive-vertical.mp4`.
- Normalized SHA-256: `d2a2e22730d6c152da57459c479f8744525794790405dc0e1c3d77a8cf166f68`.
- Treatment: 1080x1920, 30 fps, muted, labelled `STARSHIP TEST ARCHIVE`.
- Rights lane: `commentary-review`; approved for this local prototype.
- Fallback: owned end statement on the ivory field.

## SpaceX official — Ship 40 test reset

- Job: break the long FAA explanation with a current physical vehicle test
  while the narration names the four corrective actions.
- Source page: https://x.com/SpaceX/status/2076075162420629714
- Creator: SpaceX.
- Retrieved: 2026-07-15.
- Source range used in the master: `00:16.000–00:19.000`.
- Normalized file: `assets/normalized/ship-static-fire-vertical.mp4`.
- Normalized SHA-256: `543d9c2f025793065f08c69688342cf0445cd0e2af17b3c1a8e8a801dcd88b5c`.
- Treatment: 1080x1920, 30 fps, muted, labelled `SHIP 40 TEST`.
- Rights lane: `commentary-review`; approved for this local prototype.
- Fallback: owned four-corrective-actions result card.

## FAA findings

- Job: support the two likely causes and four corrective actions.
- Source: https://www.faa.gov/newsroom/statements/general-statements
- Treatment: facts are restated in an original Remotion comparison; the FAA
  page design and imagery are not copied.
- Rights: U.S. government text used as a factual primary source.

## Music — Prism Pulse

- Library asset: `music:1943a4323794b66a`.
- Canonical file: `src/content/music-visualizer/orb-rhythm-lab/prism-pulse/music.mp3`.
- SHA-256: `1943a4323794b66a24377c51ed5ee3c08e3772a83bef0ab87e237c753f26a77d`.
- Job: restrained forward pulse beneath the narration.
- Selected derivative: `tiles/aaron-video-gen/remotion/public/tutorial-shorts/starship-flight-13/prism-pulse-59s.mp3`.
- Selected derivative SHA-256: `bbaaf5748051f8cfd0745c8158e00b60bb542aa223326f63e183e78325d333c9`.
- Treatment: two copies crossfaded over two seconds, trimmed to 59.05 seconds,
  then faded out over the final three seconds.
- Status: selected for the local prototype; active ElevenLabs commercial-use
  terms must be verified or the cue replaced before publication.
- Fallback: narration-only mix.

## Final master

- File: `starship-flight-13-en-prototype.mp4`.
- SHA-256: `edfe9d48ea69736ef350a8ee7f48c93fca2c9e90f5cf67d2c247428b2082b96c`.
- Rights status: creative-review prototype. The four source-labelled SpaceX
  excerpts remain in the `commentary-review` lane; they are not represented as
  licensed, public-domain, or risk-free.
