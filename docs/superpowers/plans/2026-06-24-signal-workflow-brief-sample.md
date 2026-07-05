# Signal Workflow Brief Sample Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and render a 60-90 second Remotion concept sample for the Signal Workflow Brief video format.

**Architecture:** Add one standalone Remotion composition beside the existing slideshow renderer. Keep sample content in a dedicated `src/content/videos/2026-06-24-signal-workflow-brief-sample/` directory and place only the render-time narration asset in Remotion `public/`.

**Tech Stack:** React, Remotion, TypeScript, macOS `say`, FFmpeg, existing `aaron-video-gen/remotion` package.

---

### Task 1: Add Sample Content

**Files:**
- Create: `src/content/videos/2026-06-24-signal-workflow-brief-sample/script.md`
- Create: `src/content/videos/2026-06-24-signal-workflow-brief-sample/narration.txt`

- [ ] **Step 1: Create the directory and source files**

Create a concise script with timestamped scenes and a matching narration file. The narration must avoid generic release-note language and use an operator judgment frame: Signal found it, here is the workflow impact, here is the verdict.

- [ ] **Step 2: Review the script**

Run: `sed -n '1,220p' src/content/videos/2026-06-24-signal-workflow-brief-sample/script.md`

Expected: The script has five short scenes and no placeholder text.

### Task 2: Generate Temporary Narration

**Files:**
- Create: `tiles/aaron-video-gen/remotion/public/signal-workflow-brief-sample/narration.mp3`

- [ ] **Step 1: Render local TTS to AIFF**

Run macOS `say` with a natural local voice and write an intermediate AIFF file.

- [ ] **Step 2: Convert narration to MP3**

Run FFmpeg to convert the AIFF file to MP3 in the Remotion public sample folder.

- [ ] **Step 3: Confirm audio duration**

Run: `ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 tiles/aaron-video-gen/remotion/public/signal-workflow-brief-sample/narration.mp3`

Expected: Duration is between 60 and 90 seconds.

### Task 3: Add Remotion Composition

**Files:**
- Create: `tiles/aaron-video-gen/remotion/src/SignalWorkflowBriefSample.tsx`
- Modify: `tiles/aaron-video-gen/remotion/src/Root.tsx`

- [ ] **Step 1: Implement the sample composition**

Create a React component that uses Remotion frame primitives for fade, slide, and progress animations. The component should display a Signal source card, release translation, before/after workflow, verdict scorecard, and closing card.

- [ ] **Step 2: Register the composition**

Add `SignalWorkflowBriefSample` to `Root.tsx` with a fixed 1920x1080 composition and a duration matching the narration.

### Task 4: Validate and Render

**Files:**
- Create: `src/content/videos/2026-06-24-signal-workflow-brief-sample/video.mp4`

- [ ] **Step 1: Run Remotion validation**

Run: `npm run validate` from `tiles/aaron-video-gen/remotion`.

Expected: TypeScript passes and the audit exits successfully. Existing warnings may remain if they are unrelated to the new composition.

- [ ] **Step 2: Render the video**

Run: `npx remotion render src/index.ts SignalWorkflowBriefSample ../../../../src/content/videos/2026-06-24-signal-workflow-brief-sample/video.mp4` from `tiles/aaron-video-gen/remotion`.

Expected: Remotion writes `video.mp4`.

- [ ] **Step 3: Inspect output metadata**

Run: `ffprobe -v error -show_entries format=duration:stream=width,height,codec_type -of default=nw=1 src/content/videos/2026-06-24-signal-workflow-brief-sample/video.mp4`

Expected: The file is 1920x1080 and 60-90 seconds.
