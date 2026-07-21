# Video QA Report

## Result

**PASS — bilingual footage-integrated review candidates**

The English and Chinese cuts now combine two licensed real-world video inserts,
one official source screenshot, light editorial motion, narration, and music.
They are ready for Aaron's creative review. They are not publish-ready until
Aaron approves the cut and the music track receives its final commercial-use
check.

## Masters

### English

- File: `chatgpt-work-content-factory-en-footage-v2.mp4`
- Duration: 42.048 seconds
- Video: H.264, 1080 × 1920, 30 fps, 9:16
- Audio: AAC, 48 kHz, stereo
- Size: 10,341,745 bytes
- Integrated loudness: −16.6 LUFS
- True peak: −4.1 dBFS

### Chinese

- File: `chatgpt-work-content-factory-zh-footage-v2.mp4`
- Duration: 44.544 seconds
- Video: H.264, 1080 × 1920, 30 fps, 9:16
- Audio: AAC, 48 kHz, stereo
- Size: 10,417,180 bytes
- Integrated loudness: −16.6 LUFS
- True peak: −4.5 dBFS

## Visual checks

- The full film keeps the approved light system: warm off-white canvas,
  paper-white cards, charcoal type, and one restrained warm-red signal color.
- The phone-scroll and laptop-research clips decode correctly in the encoded
  masters, remain inside the 9:16 crop, and retain visible source labels.
- The licensed B-roll is visually separated from the official OpenAI source
  screenshot; illustrative footage is not presented as factual proof.
- The phone-to-comparison and laptop-to-evidence cut windows were decoded
  sequentially. No black gap, half-decoded frame, or missing layer appeared.
- English and Chinese display copy remain inside mobile-safe areas.
- Encoded contact sheets were inspected for both languages; no overflow or
  unintended theme change appeared.
- Black-frame detection reported no intervals in either encoded master.

## Audio checks

- Narration uses Aaron's previously approved ElevenLabs voice profile and
  remains the attention spine over the score.
- Both masters contain stereo AAC audio at 48 kHz.
- English: −16.6 LUFS integrated, −4.1 dBFS true peak.
- Chinese: −16.6 LUFS integrated, −4.5 dBFS true peak.
- The Chinese cut has one intentional 1.544-second quiet hold at the end; no
  other silence longer than 0.6 seconds was detected.
- Both licensed source clips are muted; no third-party source audio enters the
  mix.

## Audit checks

- Remotion typecheck: PASS.
- Content-evidence unit tests: 7 PASS, 0 FAIL.
- Production content-evidence audit: PASS, 4 sources, 7 facts, 9 asset beats.
- Director-plan audit: PASS.
- Both final renders: PASS.
- Encoded media inspection, black detection, and loudness analysis: PASS.

## Evidence and rights

- Product claims remain linked to official OpenAI ChatGPT Learn documentation.
- Pexels 6271585 by www.kaboompics.com and Pexels 38496194 by Media Hopper
  Studio are recorded as licensed illustrative B-roll.
- Source pages, creator names, Pexels license URL, retrieval date, raw and
  processed hashes, crop, frame rate, mute policy, and fallbacks are recorded
  in `asset-decision-log.md` and `asset-plan.json`.
- The pipeline rejects licensed media without `license_url`, `creator`, and
  `retrieved_at`.
- A public URL alone cannot clear a source-video beat. News, interview, social,
  film, sport, or music excerpts must use the `commentary-review` lane with an
  exact source range and explicit editorial approval.
- `Paper Moon` remains approved for this local prototype only. Recheck the
  active ElevenLabs music terms or replace it with a cleared track before
  publishing.

## Known limitations

- These two inserts are licensed B-roll, not copied broadcast footage. They
  prove search, acquisition, vertical normalization, source labelling, timeline
  insertion, and rights auditing without pretending that a short excerpt is
  automatically safe.
- The `commentary-review` path is implemented as a production gate but has not
  been used to auto-clear any third-party news clip.
- Product behavior and availability are time-sensitive and should be
  reverified on the publication date.

## QA artifacts

- `qa/en-footage-v2-contact-sheet.png`
- `qa/zh-footage-v2-contact-sheet.png`
- `qa/en-boundary-phone-to-comparison.png`
- `qa/en-boundary-laptop-to-evidence.png`
- `qa/en-evidence-frame-20s.png`
- `qa/ffprobe-en-footage-v2.json`
- `qa/ffprobe-zh-footage-v2.json`
- `qa/en-footage-v2-audio-black.log`
- `qa/zh-footage-v2-audio-black.log`
