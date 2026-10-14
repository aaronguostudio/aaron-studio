---
name: walkthrough-video
description: Render a passed application walkthrough capture into a guided MP4 with captions, click outlines, chapters, and optional narration. Use for product demos recorded by demo-capture or a project's own capture tool.
---

# Walkthrough video

Use the shared renderer in the sibling `aaron-video-gen` runtime. This skill covers application demos; its installation includes only the walkthrough runtime.

Deliver narration, captions, scripts, filenames, and delivery notes in English unless Aaron explicitly requests another language. Reuse a passed capture when only narration changes.

Read [the capture contract](../aaron-video-gen/references/walkthrough-capture.md) for inputs and narration, and [guided-demo.md](../paste-ready-update/references/guided-demo.md) before changing a walk or delivering a video.

For the macOS installation:

```bash
"$HOME/.local/bin/aaron-demo" render "<run-folder>" --stills
```

The renderer writes `walkthrough.mp4`, `chapters.txt`, and the requested review stills next to the capture. Inspect every held-frame still and the end of each wait before delivering. A capture must have `status: "passed"`; fix a failed walk through the project's normal workflow and record again. Keep captures, narration scripts, and delivery pages outside Git repositories.

The default is silent. Add `--narrate` for concise narration, or `--script "<run-folder>/narration.json"` for conversational narration only when requested. Existing authorization covers routine demo narration using included credits; a purchase, paid overage, or increase beyond an active cap requires a budget decision. The versioned voice profile and 1.15x walkthrough speed are the defaults. Narration setup is in the capture contract.

If installed from the full Studio source instead, resolve this skill's symlink, then run the sibling `aaron-video-gen/scripts/walkthrough/render-walkthrough.ts` with Bun. Use the macOS installer to prepare the pinned runtime when dependencies are missing; see [installation](../../docs/demo-tools-macos.md).
