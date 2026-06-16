# AI Video Lab Lessons

This file stores durable lessons from Aaron's AI video experiments.

## Current Defaults

- Start with stylized or cartoon subjects before realistic humans.
- Use GPT Image 2 or Seedream to lock visual design before spending on video.
- Keep Seedance prompts concise: action, camera, duration, pacing.
- Run 480p / 4s tests before upgrading.
- Change one major prompt variable per learning pass.

## Winning Patterns

- 2026-06-16, `ytv-anime-rain-crane-story-001`: Multi-shot workflow succeeded. Five generated anime first frames were each sent to Seedance as `1080p / 4s / 9:16 / generate_audio=true`, then trimmed and concatenated into a 15-second short with AAC audio. Actual usage: 982,125 tokens, about RMB 45.18. The result has clearer story progression than a single 15-second image-to-video run: establishing shot, crane close-up, character reaction, crane release, moon-bound finale. Best next variable: improve character consistency across separately generated first frames.
- 2026-06-16, `ytv-anime-rain-crane-hq-001`: Image-first workflow succeeded at high quality. A generated 1080x1920 anime first frame, passed to Seedance as first_frame with `1080p / 15s / 9:16`, preserved style, character identity, rain, moon, glowing paper crane, and reflections. Scores: hook 5, visual impact 5, imagination 4, motion 4, consistency 5, defects 5. Best next variable: add one clearer action beat without changing style.
- 2026-06-16, `ytv-cartoon-cloud-courier-live-003`: A full text-to-video prompt with explicit subject, vehicle, destination, style, camera, palette, and negative constraints produced the first usable cartoon direction. Scores: hook 4, visual impact 4, imagination 4, motion 3, consistency 4, defects 4. Upgrade candidate.

## Failure Patterns

- 2026-06-16, `ytv-cartoon-cloud-courier-live-002`: A short motion-only Seedance prompt lost the core concept and produced a generic dreamy realistic scene. For text-to-video, include the full scene concept in the Seedance prompt. Reserve short motion prompts for image-to-video when a first frame is already locked.
