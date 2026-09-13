# 沙丘真的会唱歌

Open `pilot.mp4` or `review.html`. 74 seconds, English Aaron narration with Chinese subtitles. This is an internal prototype awaiting Aaron's reaction, not a published video.

The evidence and media originals are kept alongside the script. `asset-decision-log.md` explains rights, crop, source reuse and limitations. `video-qa-report.md` separates technical checks from human listening.

Renderer: `tiles/aaron-video-gen/remotion/src/projects/singing-sands-pilot/index.tsx`. Public assets: `tiles/aaron-video-gen/remotion/public/singing-sands-pilot/`.

From the Remotion directory:
`npx remotion render src/projects/singing-sands-pilot/index.tsx SingingSandsPilot <package>/pilot-picture.mp4 --codec=h264 --crf=19 --concurrency=4`

Mux the preserved `pilot-mix.wav` with the picture using H.264 stream copy and AAC 192k, duration 74, faststart. Run `python3 <package>/verify.py` to refresh encoded contact sheets and loudness evidence.

Media attribution: National Park Service. No claim to original U.S. Government works. The macro image is AI generated and used only as an illustration.
