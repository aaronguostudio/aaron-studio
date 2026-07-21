# Asset Decision Log

## Licensed footage — phone news scan

- Job: turn “scan the news again” into a physical, immediately recognizable
  action instead of another animated card.
- Source: Pexels video 6271585 by www.kaboompics.com, retrieved 2026-07-15.
- Source page: https://www.pexels.com/video/a-person-scrolling-through-a-mobile-phone-6271585/
- License: https://www.pexels.com/license/
- Raw SHA-256: `243ae314f1e19f5eec63e1f502017546b4784e88e45cf78faea35473a22adf3a`
- Processed SHA-256: `da2fd472be30beabe8a1dc82b740e95c3090db9bae45fcc53b2719fd7ab66cac`
- Treatment: center crop to 9:16, normalize to 1080x1920 at 30fps, remove
  source audio, and retain an on-screen source label.
- Fallback: warm Remotion card listing the three repeated research actions.

## Licensed footage — laptop source research

- Job: show source research as real-world action before the official evidence
  screenshot appears.
- Source: Pexels video 38496194 by Media Hopper Studio, retrieved 2026-07-15.
- Source page: https://www.pexels.com/video/browsing-open-access-guide-on-laptop-38496194/
- License: https://www.pexels.com/license/
- Raw SHA-256: `f9808e09931afc6bebc5e4cde17fc808f4f78165c76e9a3dd7a0d4c56575c5af`
- Processed SHA-256: `4dfe8935f2cdeb72d388f82aaafcc7143e8eecf01394478993f6ed419bf0c3ff`
- Treatment: crop the research screen to 9:16, normalize to 1080x1920 at
  30fps, remove source audio, and retain an on-screen source label.
- Fallback: the official documentation screenshot that follows it.

## News-footage review rule

- A public URL is evidence of where a clip came from, not permission to reuse
  the clip.
- Broadcast, interview, social, film, sports, and music excerpts enter the
  `commentary-review` lane. They require a source time range, a stated
  commentary purpose, an on-screen source, and explicit editorial approval.
- This prototype deliberately uses licensed B-roll for the automatic lane. It
  does not treat the reference Short or a news broadcaster's footage as cleared.

## Official OpenAI documentation screenshot

- Job: prove that longer-running work, scheduled tasks, and review/approval are
  product capabilities rather than speculative claims.
- Source: official ChatGPT Learn documentation, captured 2026-07-15.
- File: `tiles/aaron-video-gen/remotion/public/tutorial-shorts/chatgpt-work-content-factory/work-official-doc.png`
- Treatment: place inside a warm source frame; keep the source label visible.
- Fallback: a static evidence card with the official source titles and URLs.

## Remotion-native layouts

- Job: explain comparison, daily research, production, and human gates without
  pretending to be product UI.
- Provenance: original code and typography in `TutorialShort.tsx`.
- Rights: owned.
- Fallback: static cards exported from the same layout.

## Music — Paper Moon

- Job: maintain pace underneath the approved English or Chinese narration.
- Source: locally generated 45-second instrumental in the existing music
  visualizer workspace.
- File: `tiles/aaron-video-gen/remotion/public/music-visualizer/paper-moon.mp3`
- Status: prototype-only. Verify the active ElevenLabs paid-plan terms or
  replace it with a fully cleared track before publication.
- Fallback: render silently or use a newly generated/cleared 45-second cue.
