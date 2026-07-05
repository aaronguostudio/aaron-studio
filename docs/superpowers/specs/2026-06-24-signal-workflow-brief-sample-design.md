# Signal Workflow Brief Sample Design

## Goal

Create a 60-90 second concept sample for a recurring Signal/Radar-powered video format that turns AI product updates into practical workflow judgment.

## Format

The sample is a 16:9 Remotion-rendered video named `SignalWorkflowBriefSample`. It uses one real release-note signal from Perplexity's June 19, 2026 changelog as the source: Deep Research moving into Computer with faster command access, forking, inline actions, analytics APIs, and custom credit limits.

## Viewer Promise

The video is not a release-note recap. It answers one operator question: does this update remove a step from a real research-brief workflow?

## Story Structure

1. Signal found the update.
2. The headline is translated into plain language.
3. A before/after research brief workflow is shown.
4. The verdict is given as Use, Wait, or Skip.
5. The closing points to the next experiment.

## Visual Direction

Use lightweight Remotion cards rather than generated imagery. The design should feel like an operator dashboard: dark background, crisp white typography, restrained teal/amber accents, source cards, workflow arrows, and a verdict scorecard. Motion should use Remotion frame primitives, not CSS transitions or animations.

## Audio Direction

Generate a temporary voiceover with local macOS text-to-speech for the sample. The script is written in Aaron's plain operator voice and should be replaceable by Aaron's own recorded narration in a future pass.

## Output

- `src/content/videos/2026-06-24-signal-workflow-brief-sample/script.md`
- `src/content/videos/2026-06-24-signal-workflow-brief-sample/narration.txt`
- `src/content/videos/2026-06-24-signal-workflow-brief-sample/video.mp4`
- Remotion sample composition and public narration assets under `tiles/aaron-video-gen/remotion/`

## Non-Goals

- Do not integrate the sample into the full blog-production pipeline.
- Do not create a Shorts derivative in this pass.
- Do not require external API calls for TTS, screenshots, or image generation.
- Do not alter the existing `SlideshowVideo` behavior.
