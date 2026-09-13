# Video QA — DHH AI enthusiasm, v5

Status: LOCAL PREVIEW READY; full-film author review and external publication remain pending.

## Deliverables
- video-v5.mp4: 1080p scored internal preview, restrained music at opening and ending.
- video-v5-nomusic.mp4: same visual stream with approved narration only.
- video-prototype-v5.mp4: 90-second 720p prototype of film 150–240s.
- video-captions-en.srt: 171 phrase groups, timed against the approved narration plus 3-second cover.

## Scope and verification
36 scenes; 503.2s video (8:23), 1920×1080, 30fps, 15,096 frames. Approved 495.192s narration reused in full; 3-second cover and 5-second end card added. No TTS generation in this phase. Article EN/ZH hashes remain unchanged.

Source, asset, director and storyboard preflight PASS. Typecheck and static renderer audit PASS. New implementation is isolated in remotion/src/projects/dhh-ai-enthusiasm; unrelated renderer files and dirty studio changes were preserved.

## Visual review
Inspected the actual encoded master: every scene midpoint in three contact sheets, six critical cut pairs, and the prototype's sequential 18-frame workflow activation strip. Extracted all 108 scene entry/mid/exit frames for review evidence. Full-frame source cover at frame zero inspected at 1920×1080. No clipped titles, caption overlaps, black cut gaps or duplicate scene layers observed in inspected frames. Text-bearing panels remain fixed; underline focus is frame-driven. All four blog workflow nodes activate before the next scene.

Found and fixed in the prototype: a fixed node interval left Review inactive at the cut. Cues now fit the scene duration. Confirmed correction in encoded frames. The extra empty tile in the early prototype sheet was contact-sheet padding, not an encoded black frame.

Intentional holds: statements remain quiet for listening, and the creation discussion holds the DHH illustration with captions. Repeated maps are retained where the same reading positions clarify consecutive decisions. No decorative animation was added to satisfy a numerical quota.

## Audio and ending
See video-production/master-technical-qa.json and music-mix-report.json for measured output values. Narration-only master: about -17.0 LUFS, -4.8 dBTP. Scored mix: about -17.1 LUFS, safely below -1.5 dBTP. A dedicated ending fade reaches silence inside the file. The scored master’s final second measures -91 dB mean and maximum. The scored and narration-only H.264 streams have identical SHA-256 values, so the same visual inspection applies to both. Voice performance and exact caption words match the approved source contract.

Music source: Paper Moon, music:b161e820cd4f5741. Retained original source, normalization and gain-envelope recipe. The 45-second scored audition and full scored output are INTERNAL REVIEW ONLY while music usage rights remain needs-verification. The narration-only file remains available independently. No social, YouTube or production-blog publication performed.

## Review limits
This is same-agent technical QA plus encoded-frame and sequential-motion inspection. It is not a claim of an uninterrupted human watch, headphone/phone-speaker listening, or independent speech recognition. Aaron's narration approval is recorded; full video preference and final publishing approval are separate pending decisions.
