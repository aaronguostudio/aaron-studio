# Walkthrough capture folder (contract version 1)

`WalkthroughVideo` turns a capture folder into a short walkthrough video:

- a title card;
- the screen recording, with a caption band for each step;
- a drawn pointer with a soft amber halo: it glides onto each control about a second before the click, rests there, and ripples where the click lands;
- an amber outline that draws itself around the control being clicked (from `clicks[].box`), and around each region a step names in `focus`;
- waits fast-forwarded behind an "N× faster" badge;
- an end card.

It is silent by default. With `--narrate`, each step also gets a voice clip (see Narration).

Any tool that drives an app can produce the folder. This side never knows which app it was.

## Render

```bash
npx -y bun tiles/aaron-video-gen/scripts/walkthrough/render-walkthrough.ts <run> [--out <file.mp4>] [--narrate] [--script <script.json>] [--voice-profile <id>] [--speed <0.7-1.2>] [--stills] [--dry-run]
```

- It validates the folder first and refuses a capture whose `status` is not `passed`. A failed walk gets no video.
- It writes `walkthrough.mp4` (H.264, yuv420p; AAC audio only when narrated) and `chapters.txt` (`m:ss  Caption` per step, in output time) into the run folder.
- It refuses a run folder or an output inside this repo. Captures are someone else's material; they never enter the content pipelines here.
- `--dry-run` validates and writes `chapters.txt` without rendering.
- `--stills` also writes `stills/NN-<step-id>.jpg` beside the video: one frame per step, the middle of its hold (the frame the viewer looks at longest), else just before it ends. Look at every one before delivering.
- To test without a real capture, build a synthetic one: `npx -y bun tiles/aaron-video-gen/scripts/walkthrough/make-fixture.ts <empty folder outside the repo>`.

## Pacing

Every step stays on screen long enough to read its caption: `readingMs = 800 + 55 ms per character`, between 2 and 6 seconds (about 18 characters a second, the usual subtitle rate).

- A step that needs more time than it recorded holds one frame for the rest:
  - **an action with clicks** holds just before its first click, with the pointer on the control and the control outlined, so the caption is read (or the line spoken) while the screen shows what is about to happen; then the click plays;
  - **an action without clicks** holds its last frame, the finished screen, with its `focus` outlined (if its last focus ends earlier, it holds the last moment that focus is up);
  - **a wait** holds its first frame.
- A wait is fast-forwarded, but never so fast that it ends before its caption is read.
- A narration line and a 0.4 s pause must fit in its step plus the silent steps after it. The voice plays on while those steps are clicked through, and the time is shared by their reading times. In the concise style every step has its own line, so each step simply stays up for its clip.

## Narration

Two styles, both in an ElevenLabs voice from `config/voice-profiles.json` (the default profile unless `--voice-profile` names another):

- **Concise** (`--narrate`): each step's `narration`, or its caption when it has none. Short and official.
- **Conversational** (`--script <file>`, which implies `--narrate`): a script written for the run, so the video sounds like a person giving the demo. The captions on screen stay the short step titles.

```json
{
  "intro": "Hi, here's a quick tour of the new form.",
  "steps": {
    "open": "Let's start by opening the form. Notice it already knows who you are.",
    "save": "I'll save it now. This takes a few seconds, so I've sped it up."
  },
  "outro": "That's all it takes. Happy to walk through it live."
}
```

- `intro` plays over the title card and `outro` over the end card. The cards stay up as long as their line.
- `steps` maps step ids to lines. A step without a line stays silent, so one line can cover several quick clicks.
- A line for a step id the capture does not have is refused, before any voice is made.
- The script is run material: keep it in the run folder (`narration.conversational.json`). One inside this repo is refused.

- Walkthroughs speak at 1.15× by default, a little faster than the profile's long-form pace. `--speed` sets another speed from 0.7 to 1.2 (ElevenLabs' own setting, so the voice is not pitch-shifted). The profile itself is unchanged.
- The clips are cached in `<run>/narration/`, keyed by voice, settings (speed included) and text. A re-render calls the API only for lines whose words or voice settings changed.
- The key comes from the macOS Keychain (`security add-generic-password -s elevenlabs-api-key -a "$USER" -w`), else from `ELEVENLABS_API_KEY` in this repo's gitignored `.env`. It is never printed.
- The title card and the caption band say "AI narration". The voice is a clone, so the video says so.
- Narrate only when the person whose voice it is asked for it.

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
  - `wait` (server work) is fast-forwarded to about two seconds on screen, at most 16×, and never shorter than its caption's reading time (see Pacing).
- Gaps between steps longer than 1.5 s are fast-forwarded too.
- Each click is logged just before it happens. Its fields are viewport CSS px:
  - `x`, `y` are the centre of the element;
  - `box` is the element's bounding box.
- `shot` is taken before the step's first click, so the element to click is visible.
- The last step is a result step with no clicks. When it has no duration, its shot is held for two seconds.
- `shot` may be `null`. A shot path must stay inside the folder.
- Captions are the reader's words: short and plain.
- `narration` is optional: what the voice says for the step when it should differ from the caption.
- `focus` is optional: the regions the step is about (a card, a row, a total, a filter), each outlined while the recording shows it.

  ```json
  "focus": [{ "box": { "x": 900, "y": 200, "w": 400, "h": 300 }, "fromMs": 1200, "toMs": 2500 }]
  ```

  - `box` is the region's bounding box in viewport CSS px, measured once scrolling has stopped. `[x, y, w, h]` is read too.
  - `fromMs` and `toMs` are on the capture clock and inside the step. Ending a focus at the step's end keeps it up through the hold.
  - On a step without clicks, the pointer parks beside the step's first focus (to its right, else its left), clear of the outline.
