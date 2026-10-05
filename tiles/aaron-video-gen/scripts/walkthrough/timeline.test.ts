import { describe, expect, test } from "bun:test";
import {
  FPS,
  MAX_SPEED,
  buildTimeline,
  calibrate,
  chapters,
  cursorAt,
  sourceMsToFrame,
  speedFor,
  validateCapture,
  type Capture,
  type Step,
} from "../../remotion/src/projects/walkthrough-video/timeline";

const capture: Capture = {
  version: 1,
  walk: "sample",
  env: "local",
  title: "Sample walkthrough",
  startedAt: "2026-10-05T00:00:00.000Z",
  viewport: { w: 1440, h: 900 },
  status: "passed",
};

const steps: Step[] = [
  { id: "open", caption: "Open the form", kind: "action", startMs: 1000, endMs: 3000, clicks: [{ tMs: 2500, x: 100, y: 200 }], shot: "shots/01-open.png" },
  { id: "save", caption: "Wait for it to save", kind: "wait", startMs: 3000, endMs: 19000, clicks: [], shot: "shots/02-save.png" },
  { id: "done", caption: "Saved", kind: "action", startMs: 19000, endMs: 19000, clicks: [], shot: "shots/03-done.png" },
];

describe("validateCapture", () => {
  test("accepts a passed capture", () => {
    expect(validateCapture(capture, steps)).toEqual([]);
  });

  test("refuses a failed walk and names the step", () => {
    const problems = validateCapture({ ...capture, status: "failed", failedStep: "save" }, steps);
    expect(problems.join(" ")).toContain('status is "failed" at step "save"');
  });

  test("refuses overlapping steps, stray clicks, odd viewports and escaping shot paths", () => {
    const bad: Step[] = [
      { ...steps[0], clicks: [{ tMs: 5000, x: 100, y: 200 }] },
      { ...steps[1], startMs: 2000, shot: "../outside.png" },
    ];
    const problems = validateCapture({ ...capture, viewport: { w: 1441, h: 900 } }, bad).join("\n");
    expect(problems).toContain("outside the step");
    expect(problems).toContain("starts before the previous step ends");
    expect(problems).toContain("must be positive and even");
    expect(problems).toContain("inside the capture folder");
  });
});

describe("buildTimeline", () => {
  const timeline = buildTimeline(steps);

  test("fast-forwards waits and long gaps, plays actions at normal speed", () => {
    expect(speedFor(16000, true)).toBe(8);
    expect(speedFor(600000, true)).toBe(MAX_SPEED);
    expect(speedFor(16000, false)).toBe(1);
    const bySource = timeline.segments.map((s) => [s.srcStartMs, s.srcEndMs, s.speed, s.step]);
    expect(bySource).toEqual([
      // the lead-in before the first step (sign-in, page loads) is left out
      [1000, 3000, 1, 0],
      [3000, 19000, 8, 1],
      [19000, 19000, 1, 2], // the result step has no recording, so its shot is held
    ]);
    expect(timeline.segments[2].still).toBe("shots/03-done.png");
  });

  test("segments are contiguous and the duration adds up", () => {
    let frame = timeline.titleFrames;
    for (const s of timeline.segments) {
      expect(s.fromFrame).toBe(frame);
      frame += s.frames;
    }
    expect(frame).toBe(timeline.titleFrames + timeline.videoFrames);
    expect(timeline.durationInFrames).toBe(frame + timeline.endFrames);
    // 2 s action + 16 s / 8 + 2 s held result = 6 s of video.
    expect(timeline.videoFrames).toBe(6 * FPS);
  });

  test("calibration shifts every recorded time", () => {
    const shifted = calibrate(steps, 120);
    expect(shifted[0].startMs).toBe(1120);
    expect(shifted[0].clicks[0].tMs).toBe(2620);
    expect(calibrate(steps, 0)).toBe(steps);
  });
});

describe("mapping and chapters", () => {
  const timeline = buildTimeline(steps);

  test("a recorded moment maps to the output frame, through fast-forward", () => {
    expect(sourceMsToFrame(timeline, 2500)).toBe(timeline.titleFrames + Math.round(1.5 * FPS));
    // Halfway through the 8x wait: 2 s of normal-speed video, then 8 s / 8 = 1 s.
    expect(sourceMsToFrame(timeline, 11000)).toBe(timeline.titleFrames + 3 * FPS);
  });

  test("chapters use output time, after the title card", () => {
    expect(chapters(timeline, steps)).toBe("0:02  Open the form\n0:04  Wait for it to save\n0:06  Saved\n");
  });

  test("the cursor glides to the click and ripples there", () => {
    const clickFrame = sourceMsToFrame(timeline, 2500);
    const before = cursorAt(timeline, steps, capture.viewport, timeline.titleFrames);
    expect(before).toMatchObject({ x: 720, y: 450, visible: true, ripple: null });
    const at = cursorAt(timeline, steps, capture.viewport, clickFrame);
    expect(at).toMatchObject({ x: 100, y: 200, ripple: 0 });
    expect(cursorAt(timeline, steps, capture.viewport, 0).visible).toBe(false);
  });
});
