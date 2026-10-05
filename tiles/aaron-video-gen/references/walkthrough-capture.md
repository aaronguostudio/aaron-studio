# Walkthrough capture folder (contract version 1)

`WalkthroughVideo` turns a capture folder into a short, silent walkthrough video:

- a title card;
- the screen recording, with a caption band for each step;
- a drawn cursor that rings where each click lands;
- waits fast-forwarded behind an "N× faster" badge;
- an end card.

Any tool that drives an app can produce the folder. This side never knows which app it was.

## Render

```bash
npx -y bun tiles/aaron-video-gen/scripts/walkthrough/render-walkthrough.ts <run> [--out <file.mp4>] [--dry-run]
```

- It validates the folder first and refuses a capture whose `status` is not `passed`. A failed walk gets no video.
- It writes `walkthrough.mp4` (H.264, yuv420p, silent) and `chapters.txt` (`m:ss  Caption` per step, in output time) into the run folder.
- It refuses a run folder or an output inside this repo. Captures are someone else's material; they never enter the content pipelines here.
- `--dry-run` validates and writes `chapters.txt` without rendering.
- To test without a real capture, build a synthetic one: `npx -y bun tiles/aaron-video-gen/scripts/walkthrough/make-fixture.ts <empty folder outside the repo>`.

## Folder

```
<run>/
  capture.json
  video.webm            # screen recording, exactly viewport-sized
  steps.json
  shots/NN-<step-id>.png
  walkthrough.mp4       # written by the renderer
  chapters.txt          # written by the renderer
```

## capture.json

```json
{
  "version": 1,
  "walk": "sample-walk",
  "env": "local",
  "title": "Sample walkthrough",
  "subtitle": "Open a form, save it, wait for it to finish",
  "appRevision": "abc1234",
  "startedAt": "2026-10-05T16:00:00.000Z",
  "viewport": { "w": 1440, "h": 900 },
  "status": "passed",
  "failedStep": "save",
  "failure": "Plain-English reason, only when status is failed",
  "sync": { "tMs": 712 },
  "calibrationMs": 0
}
```

- `viewport` sizes must be even, as H.264 requires.
- `sync` is optional and recommended. The screencast starts a few hundred ms after the capture's clock, so logged times run ahead of the video.
  - To mark the offset, a capture shows an all-black page, turns it white, and logs that moment as `sync.tMs`.
  - The renderer finds that frame with ffprobe and subtracts the difference from every time.
- `calibrationMs` is optional and sets the offset directly. Precedence: `--calibration-ms`, then `calibrationMs`, then `sync`.

## steps.json

```json
[
  {
    "id": "open",
    "caption": "Open the form",
    "kind": "action",
    "startMs": 1000,
    "endMs": 3000,
    "clicks": [{ "tMs": 2500, "x": 230, "y": 188, "box": { "x": 120, "y": 160, "w": 220, "h": 56 } }],
    "shot": "shots/01-open.png"
  }
]
```

- Steps are ordered and do not overlap. Times are milliseconds on the capture's clock, which starts with the recording; see `sync`.
- The video starts at the first step. Anything recorded before it (sign-in, the sync flash, page loads) is left out.
- `kind` takes one of two values:
  - `action` plays at normal speed.
  - `wait` (server work) is fast-forwarded to about two seconds on screen, at most 16×.
- Gaps between steps longer than 1.5 s are fast-forwarded too.
- Each click is logged just before it happens. Its fields are viewport CSS px:
  - `x`, `y` are the centre of the element;
  - `box` is the element's bounding box.
- `shot` is taken before the step's first click, so the element to click is visible.
- The last step is a result step with no clicks. When it has no duration, its shot is held for two seconds.
- `shot` may be `null`. A shot path must stay inside the folder.
- Captions are the reader's words: short and plain.
