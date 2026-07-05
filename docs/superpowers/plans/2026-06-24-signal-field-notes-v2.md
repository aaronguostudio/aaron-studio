# Signal Field Notes V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and render a lower-density, audio-first V2 sample for the Signal/Radar video format.

**Architecture:** Keep V1 intact and add a separate `SignalFieldNotesSample` Remotion composition. Store V2 source content under `src/content/videos/2026-06-24-signal-field-notes-v2/` and the temporary narration MP3 under Remotion `public/signal-field-notes-v2/`.

**Tech Stack:** React, Remotion, TypeScript, macOS `say`, FFmpeg, existing `aaron-video-gen/remotion` package.

---

### Task 1: Add V2 Script and Narration Text

**Files:**
- Create: `src/content/videos/2026-06-24-signal-field-notes-v2/script.md`
- Create: `src/content/videos/2026-06-24-signal-field-notes-v2/narration.txt`

- [ ] **Step 1: Write the V2 script**

The script should use short spoken sentences and five low-density screens: signal, not the feature name, workflow implication, verdict, next test.

- [ ] **Step 2: Review for placeholders and density**

Run: `sed -n '1,220p' src/content/videos/2026-06-24-signal-field-notes-v2/script.md`

Expected: No placeholder text, no table-like screen, no screen with more than one dominant idea.

### Task 2: Generate Temporary Narration

**Files:**
- Create: `tiles/aaron-video-gen/remotion/public/signal-field-notes-v2/narration.mp3`

- [ ] **Step 1: Generate AIFF with macOS say**

Run `say` with a moderate speech rate so the sample is easy to listen to.

- [ ] **Step 2: Convert AIFF to MP3**

Run FFmpeg and place the MP3 in the V2 public asset folder.

- [ ] **Step 3: Confirm duration**

Run: `ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 tiles/aaron-video-gen/remotion/public/signal-field-notes-v2/narration.mp3`

Expected: Duration is between 45 and 65 seconds.

### Task 3: Add Remotion V2 Composition

**Files:**
- Create: `tiles/aaron-video-gen/remotion/src/SignalFieldNotesSample.tsx`
- Modify: `tiles/aaron-video-gen/remotion/src/Root.tsx`

- [ ] **Step 1: Implement audio-first scenes**

Create a Remotion component with five scenes, each dominated by one large phrase. Use frame primitives for fades, drift, progress, and small reveals.

- [ ] **Step 2: Register composition**

Add `SignalFieldNotesSample` to `Root.tsx` as a 1920x1080, 30fps composition.

### Task 4: Validate, Check Stills, and Render

**Files:**
- Create: `src/content/videos/2026-06-24-signal-field-notes-v2/video.mp4`

- [ ] **Step 1: Run Remotion validation**

Run: `npm run validate` from `tiles/aaron-video-gen/remotion`.

Expected: TypeScript passes and audit exits successfully. Existing unrelated warnings may remain.

- [ ] **Step 2: Render representative stills**

Render a few still frames to `src/content/videos/2026-06-24-signal-field-notes-v2/stills/` and inspect them for text overflow or high density.

- [ ] **Step 3: Render the video**

Run: `npx remotion render src/index.ts SignalFieldNotesSample ../../../src/content/videos/2026-06-24-signal-field-notes-v2/video.mp4` from `tiles/aaron-video-gen/remotion`.

- [ ] **Step 4: Verify output metadata**

Run: `ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height -of default=nw=1 src/content/videos/2026-06-24-signal-field-notes-v2/video.mp4`

Expected: H.264/AAC, 1920x1080, 45-65 seconds.
