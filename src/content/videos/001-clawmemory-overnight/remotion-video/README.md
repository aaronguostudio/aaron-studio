# ClawMemory Overnight — Remotion Video

AI video pipeline proof of concept. Tells the story: *"I told my AI agent to build features while I slept."*

## Quick Start

```bash
npm install
npm start        # Opens Remotion Studio for preview
```

## Render

```bash
npx remotion render src/index.ts Video --output out/video.mp4
```

## Customize

Edit `src/data/script.ts` to change scenes, timing, subtitles, and animations.

### Adding Voiceover

Drop an MP3 into `public/` and update the composition's default props in `src/Root.tsx`:

```tsx
defaultProps: {
  audioSrc: "voiceover.mp3",
}
```

## Project Structure

- `src/Root.tsx` — Composition registration (30fps, 1920×1080, 60s)
- `src/Video.tsx` — Main video component with scene sequencing
- `src/components/Scene.tsx` — Ken Burns animations (zoom, pan)
- `src/components/Subtitle.tsx` — Animated subtitle overlay
- `src/components/Transition.tsx` — Crossfade between scenes
- `src/data/script.ts` — Scene data (images, subtitles, timing)
- `public/` — Scene images (scene-01.png through scene-06.png)

## Vision

Fully automated pipeline: **script → images → voiceover → video**. Each step is AI-assisted, with Remotion as the programmatic video renderer.
