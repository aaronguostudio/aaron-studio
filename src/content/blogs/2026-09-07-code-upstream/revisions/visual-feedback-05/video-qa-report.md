# Video review — code upstream

Decision: READY FOR AUTHOR REVIEW. Technical and sampled visual checks pass. This is not a publication or full-listening approval.

## Current artifacts

- Master: `video.mp4`, SHA-256 `002b25ee11d371a91a2e433296107b4f03e1b086177e811dceac569254af8d2e`.
- Alternative: `video-nomusic.mp4`, with the same picture stream and unchanged narration.
- Runtime: 469.667 seconds (about 7:50); 1920 × 1080, 30 fps, 14,090 frames, H.264 video and 48 kHz stereo AAC audio.
- 39 contiguous scenes; 117 captions aligned to the exact provider-timed word sequence.
- Existing author-approved voice profile; this newly generated performance has not received author listening approval.

## Direction and visual review

The film inherits the established warm-paper editorial style and registered layouts. The cover and three supporting illustrations depict listening to a customer, making product choices, and a product becoming part of everyday work. They are conceptual illustrations, not documentary evidence. Source-based passages use attributed paraphrases.

The baseline's representative encoded frame and QA report were inspected. A 90-second prototype was checked with 24 entry/middle/exit samples before the complete render. The full master was then decoded into 117 exact-index samples, covering entry, middle and exit of all 39 scenes. All 13 contact sheets were visually inspected; see `video-production/frame-index.json` and `contact-01.jpg` through `contact-13.jpg`.

No sampled text overflow, subtitle collision, distorted figure, competing evidence layer, or image aspect-ratio defect was found. The first frame carries the cover and author identity. Layouts alternate between comparison, rows, a concise statement, media, and a process. The conclusion returns to a product in use, then the author identity and a quiet final frame. Both thumbnail candidates were inspected at 320 × 180 before selecting the first.

Some structured beats deliberately hold for 8–9 seconds during one spoken thought. The preflight warnings are retained and reviewed. No novel 3D, canvas, semantic sprite or experimental animation is used. Sampled stills do not establish full-speed motion quality; a complete normal-speed watch and quarter-speed motion sweep have not been performed.

## Sound review

Four restrained music cues total 117 seconds, with gradual fades. The narration bus remains at gain 1.0 throughout; there is no sidechain, narration ducking, compressor or mix limiter. Ten measured windows in the final AAC encode recover narration gain between 0.9960 and 0.9989, consistent with codec loss rather than music-driven pumping.

The encoded mix measures −16.58 LUFS and −3.98 dBTP. Its final second decodes to exact zero PCM. Scored and unscored picture-stream hashes match. Sources, cue times and fades are recorded in `sound-plan.json`; reused music includes Paper Moon and previously generated Google Lyria cues. This records provenance and prior use, not a new certification of publication rights.

Opening, middle and late narration samples are available. Headphone listening, phone-speaker listening and a complete uninterrupted audiovisual watch have not been performed; they remain review items. Technical loudness is not a substitute for judging delivery, pacing or musical taste.

## Browser and package checks

The local bilingual reading page renders four images per language and switches languages without horizontal overflow. The browser loaded the full master at 1920 × 1080, duration 469.667 seconds, readyState 4 and no media error. This verifies load/decode readiness, not a complete browser playback review.

Accepted article prose remains unchanged after excluding image references and cover metadata; the content-lock check passes. The SkillDev review pack records the author's actual moderate preference and preserves rejected versions. Neither automated checks nor this report imply that the new illustrations or video have received author approval.

## Release status

Local review only. Before publication: resolve author media feedback, complete listening/full-watch review and confirm applicable music usage rights. No blog deployment, YouTube upload or external post has been performed for this package.
