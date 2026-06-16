# AI Video Lab Lessons

This file stores durable lessons from Aaron's AI video experiments.

## Current Defaults

- Start with stylized or cartoon subjects before realistic humans.
- Use GPT Image 2 or Seedream to lock visual design before spending on video.
- Keep Seedance prompts concise: action, camera, duration, pacing.
- Run 480p / 4s tests before upgrading.
- Change one major prompt variable per learning pass.

## Winning Patterns

- 2026-06-16, `ytv-neon-reef-minute-prototype-001`: First one-minute multi-shot workflow succeeded. Eight GPT Image first frames were used as Seedance `1080p / 8s / 9:16 / generate_audio=true` image-to-video shots, then concatenated into a 64.66-second vertical rough cut with AAC audio. Actual usage: 3,126,600 tokens, about RMB 143.82. The result validates the longer-form strategy: short clips can be unified into a more complete YouTube Shorts story when the character bible, palette, object anchors, and shot list are repeated aggressively. Best next variable: add a unified music/ambience bed and transitions so the final feels less like separate clips.
- 2026-06-16, storyboard batch `ytv-glass-desert-librarian-001`, `ytv-neon-reef-mechanic-001`, `ytv-aurora-shrine-drummer-001`: Three distinct anime storyboard-grid first frames were each sent to Seedance as `1080p / 15s / 9:16 / generate_audio=true`. All three succeeded with AAC audio. Actual usage: 731,025 tokens each; estimated cost about RMB 33.53 each. The batch is a strong exploration pattern because it tests multiple characters, worlds, and hooks in parallel. Best YouTube Shorts candidate: `ytv-neon-reef-mechanic-001` for clearer action and commercial visual punch. Best style assets: glass desert librarian for elegance, aurora shrine drummer for ritual fantasy. Best next variable: convert the winning concept into separate 4-second shot clips for stronger story progression.
- 2026-06-16, `ytv-anime-rain-crane-story-001`: Multi-shot workflow succeeded. Five generated anime first frames were each sent to Seedance as `1080p / 4s / 9:16 / generate_audio=true`, then trimmed and concatenated into a 15-second short with AAC audio. Actual usage: 982,125 tokens, about RMB 45.18. The result has clearer story progression than a single 15-second image-to-video run: establishing shot, crane close-up, character reaction, crane release, moon-bound finale. Best next variable: improve character consistency across separately generated first frames.
- 2026-06-16, `ytv-anime-rain-crane-hq-001`: Image-first workflow succeeded at high quality. A generated 1080x1920 anime first frame, passed to Seedance as first_frame with `1080p / 15s / 9:16`, preserved style, character identity, rain, moon, glowing paper crane, and reflections. Scores: hook 5, visual impact 5, imagination 4, motion 4, consistency 5, defects 5. Best next variable: add one clearer action beat without changing style.
- 2026-06-16, `ytv-cartoon-cloud-courier-live-003`: A full text-to-video prompt with explicit subject, vehicle, destination, style, camera, palette, and negative constraints produced the first usable cartoon direction. Scores: hook 4, visual impact 4, imagination 4, motion 3, consistency 4, defects 4. Upgrade candidate.

## Failure Patterns

- 2026-06-16, `ytv-neon-reef-minute-prototype-001` first submission attempt: Using default `python3` failed every Ark submit with `SSL: CERTIFICATE_VERIFY_FAILED` because `/usr/local/bin/python3` resolves to Python 3.14.5 with empty/default-missing cert paths. Use `python3.12` for live Ark requests in this workspace; its cert path reaches `/private/etc/ssl/cert.pem` and Ark responds normally.
- 2026-06-16, `ytv-cartoon-cloud-courier-live-002`: A short motion-only Seedance prompt lost the core concept and produced a generic dreamy realistic scene. For text-to-video, include the full scene concept in the Seedance prompt. Reserve short motion prompts for image-to-video when a first frame is already locked.
