# Video QA — Astra at work, review cut V4

Status: TECHNICAL AND SAMPLED VISUAL PASS. Ready for author review; no human full-playback/listening approval is claimed.

## Delivered master
- video.mp4: 485.366667 seconds (8:05), 1920×1080, 30 fps, 14,561 frames, H.264 and 48 kHz stereo AAC.
- video-nomusic.mp4: identical picture, pure narration; no music.
- Original V3 audio and script retained. 41 contiguous scenes; 123 caption groups preserve the exact sequence of 919 provider-timed words. Three-second opening and five-second closing are the only added duration.
- Sha256 and measurements: video-production/technical-qa.json. Renderer: tiles/aaron-video-gen/remotion/src/projects/astra-real-work/index.tsx.

## Visual review
Inspected all 123 encoded samples, covering entry, middle and exit of each scene, across video-production/contact-01.jpg through contact-06.jpg. Headings, supporting labels, source rails and captions occupy separate areas. The manuscript composition remains readable, evidence images retain aspect ratio, and the closing card fades to an empty ivory field. No text collisions, cropped captions, black placeholder frames or stretched images were found in these samples.

The prototype first 90 seconds was separately rendered and checked through 12 representative frames. Main layouts use the registered editorial slots, meaningful scaffolds at entry, and restrained sequential focus. Quiet holds are intentional. Preflight's one repeated system-map warning describes three different actual compositions (compare/row/compare); it is reviewed and accepted, not hidden by changing taxonomy.

## Sound
Delivered encode: -16.64 LUFS integrated, -3.90 dBTP, LRA 3.60 LU. These are input measurements; no new normalization was applied after the mix.

Voice stem matches the decoded approved source at unity gain with only a three-second offset. No compressor, limiter or sidechain. Ten two-second windows across scored and unscored sections fit the encoded voice coefficient between 0.9966 and 0.9989, consistent with small AAC loss, with no music-driven voice reduction. Five music cues have smooth raised-cosine envelopes. Closing music fades over seven seconds and finishes before the final silent second.

These are signal measurements, not a claim that every word was independently recognized or that a person listened through the master. Full-speed musical taste, pacing and voice listening remain the author's review.

## Browser and package
Review V4 loads the complete video with duration 485.366667, readyState 4 and no media error. At the observed approximately 855-pixel-wide browser viewport there is no horizontal overflow. Fixed the formerly cramped sidebar by using a single column below 1000 pixels. Review links include the master, pure narration cut and thumbnail.

Serious package/image/distribution validator passes. It warns that article mtime is newer than script/video: only illustration placement, WebP references and path normalization changed; spoken content is unchanged, the narration hash is unchanged, and final caption/timeline identity was verified. This does not require a new TTS render.

## Release state
Local review only. Article approved; final video review and publication authorization remain pending. No YouTube upload, blog deployment, production branch change or social send occurred in this pass.
