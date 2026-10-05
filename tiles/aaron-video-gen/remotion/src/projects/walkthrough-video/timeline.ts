// Pure timeline math for WalkthroughVideo. The composition and the render CLI share it, so the
// chapters written next to the mp4 always match what the video shows.
//
// Input is a capture folder (contract version 1): capture.json, steps.json, video.webm, shots/.
// The output timeline is: title card, then the recording from the first step on (the lead-in
// before it, sign-in and page loads, is left out) cut into segments (actions at normal speed,
// waits and long gaps fast-forwarded), then an end card.

export const FPS = 30;
export const TITLE_MS = 2500;
export const END_MS = 2500;
export const RESULT_HOLD_MS = 2000;
export const CAPTION_BAND = 96;
export const MAX_SPEED = 16;
// A fast-forwarded stretch lasts about this long on screen.
export const FAST_FORWARD_TARGET_MS = 2000;
// Gaps between steps shorter than this play at normal speed.
export const GAP_FAST_FORWARD_MS = 1500;

export type Box = { x: number; y: number; w: number; h: number };
export type Click = { tMs: number; x: number; y: number; box?: Box };
export type StepKind = "action" | "wait";
export type Step = {
  id: string;
  caption: string;
  kind: StepKind;
  startMs: number;
  endMs: number;
  clicks: Click[];
  shot: string | null;
  narration?: string;
};
export type Capture = {
  version: 1;
  walk: string;
  env: string;
  title: string;
  subtitle?: string;
  appRevision?: string;
  startedAt: string;
  viewport: { w: number; h: number };
  status: "passed" | "failed";
  failedStep?: string;
  failure?: string;
  calibrationMs?: number;
  // A sync flash: at tMs (capture clock) the page turned from black to white. The renderer finds
  // that frame in the recording and derives calibrationMs from it.
  sync?: { tMs: number };
};

export type Segment = {
  srcStartMs: number;
  srcEndMs: number;
  speed: number;
  fromFrame: number;
  frames: number;
  // Index into steps, or null for a gap between steps.
  step: number | null;
  // A still image shown instead of the recording (a result step with no recorded duration).
  still?: string;
  // The recording held on its frame at srcStartMs, so a short step stays up long enough.
  freeze?: boolean;
};

export type TimelineOptions = {
  // The least time each step stays on screen, in output ms. Defaults to the time it takes to read
  // the caption; narration passes the length of the step's voice clip instead.
  minStepMs?: (step: Step, index: number) => number;
};

// Time to notice a caption and read it, as subtitles are timed: 0.8 s to notice it, then about
// 18 characters a second, within bounds.
export const READ_MIN_MS = 2000;
export const READ_MAX_MS = 6000;

export function readingMs(caption: string): number {
  return Math.min(READ_MAX_MS, Math.max(READ_MIN_MS, Math.round(800 + 55 * caption.trim().length)));
}

export type Timeline = {
  fps: number;
  titleFrames: number;
  endFrames: number;
  videoFrames: number;
  durationInFrames: number;
  segments: Segment[];
};

export function validateCapture(capture: Capture, steps: Step[]): string[] {
  const problems: string[] = [];
  if (capture.version !== 1) problems.push(`capture.json version is ${capture.version}, expected 1`);
  if (capture.status !== "passed") {
    problems.push(
      `capture status is "${capture.status}"` +
        (capture.failedStep ? ` at step "${capture.failedStep}"` : "") +
        "; only a passed walk gets a video",
    );
  }
  const { w, h } = capture.viewport ?? { w: 0, h: 0 };
  if (!(w > 0 && h > 0 && w % 2 === 0 && h % 2 === 0)) {
    problems.push(`viewport ${w}x${h} must be positive and even (H.264)`);
  }
  if (!capture.title?.trim()) problems.push("capture.json has no title");
  if (capture.sync !== undefined && !(typeof capture.sync?.tMs === "number" && capture.sync.tMs >= 0)) {
    problems.push("capture.json sync.tMs must be a non-negative number");
  }
  if (!Array.isArray(steps) || steps.length === 0) {
    problems.push("steps.json has no steps");
    return problems;
  }
  let previousEnd = 0;
  const ids = new Set<string>();
  steps.forEach((step, i) => {
    const where = `step ${i + 1} (${step.id})`;
    if (!step.id || ids.has(step.id)) problems.push(`${where}: missing or duplicate id`);
    ids.add(step.id);
    if (!step.caption?.trim()) problems.push(`${where}: empty caption`);
    if (step.kind !== "action" && step.kind !== "wait") problems.push(`${where}: kind must be action or wait`);
    if (!(step.startMs >= previousEnd)) problems.push(`${where}: starts before the previous step ends`);
    if (!(step.endMs >= step.startMs)) problems.push(`${where}: ends before it starts`);
    previousEnd = Math.max(previousEnd, step.endMs);
    for (const click of step.clicks ?? []) {
      if (click.tMs < step.startMs || click.tMs > step.endMs) problems.push(`${where}: click at ${click.tMs} ms is outside the step`);
      if (click.x < 0 || click.y < 0 || click.x > w || click.y > h) problems.push(`${where}: click (${click.x}, ${click.y}) is outside the viewport`);
    }
    if (step.shot != null && (step.shot.startsWith("/") || step.shot.split(/[\\/]/).includes(".."))) {
      problems.push(`${where}: shot path must stay inside the capture folder`);
    }
  });
  return problems;
}

// Apply the capture's calibration offset to every time it carries.
export function calibrate(steps: Step[], calibrationMs = 0): Step[] {
  if (!calibrationMs) return steps;
  return steps.map((step) => ({
    ...step,
    startMs: step.startMs + calibrationMs,
    endMs: step.endMs + calibrationMs,
    clicks: (step.clicks ?? []).map((c) => ({ ...c, tMs: c.tMs + calibrationMs })),
  }));
}

export function speedFor(durationMs: number, fastForward: boolean): number {
  if (!fastForward) return 1;
  return Math.min(MAX_SPEED, Math.max(1, Math.ceil(durationMs / FAST_FORWARD_TARGET_MS)));
}

const msToFrames = (ms: number) => Math.round((ms * FPS) / 1000);

export function buildTimeline(steps: Step[], options: TimelineOptions = {}): Timeline {
  const minStepMs = options.minStepMs ?? ((step: Step) => readingMs(step.caption));
  type Piece = Omit<Segment, "fromFrame" | "frames"> & { outMs: number };
  const pieces: Piece[] = [];
  let cursor = steps[0]?.startMs ?? 0;
  steps.forEach((step, i) => {
    if (step.startMs > cursor) {
      const gap = step.startMs - cursor;
      const speed = speedFor(gap, gap >= GAP_FAST_FORWARD_MS);
      pieces.push({ srcStartMs: cursor, srcEndMs: step.startMs, speed, step: null, outMs: gap / speed });
    }
    const duration = step.endMs - step.startMs;
    const minMs = Math.max(0, minStepMs(step, i));
    if (duration === 0) {
      // Nothing recorded for this step: hold its shot (the result) as a still.
      if (step.shot) {
        pieces.push({ srcStartMs: step.startMs, srcEndMs: step.endMs, speed: 1, step: i, still: step.shot, outMs: Math.max(RESULT_HOLD_MS, minMs) });
      } else if (minMs > 0) {
        pieces.push({ srcStartMs: step.startMs, srcEndMs: step.startMs, speed: 1, step: i, freeze: true, outMs: minMs });
      }
    } else {
      let speed = speedFor(duration, step.kind === "wait");
      // Fast-forward no faster than the caption can be read.
      if (duration / speed < minMs) speed = Math.max(1, Math.floor(duration / minMs));
      const shown = duration / speed;
      // Still too short at normal speed: hold the step's first frame first, so the caption is read
      // before the action happens.
      if (shown < minMs) {
        pieces.push({ srcStartMs: step.startMs, srcEndMs: step.startMs, speed: 1, step: i, freeze: true, outMs: minMs - shown });
      }
      pieces.push({ srcStartMs: step.startMs, srcEndMs: step.endMs, speed, step: i, outMs: shown });
    }
    cursor = Math.max(cursor, step.endMs);
  });

  // Frame positions come from cumulative milliseconds, so rounding never drifts.
  const titleFrames = msToFrames(TITLE_MS);
  let outMs = 0;
  const segments: Segment[] = [];
  for (const piece of pieces) {
    const fromFrame = titleFrames + msToFrames(outMs);
    outMs += piece.outMs;
    const frames = titleFrames + msToFrames(outMs) - fromFrame;
    if (frames <= 0) continue;
    const { outMs: _ignored, ...segment } = piece;
    segments.push({ ...segment, fromFrame, frames });
  }
  const videoFrames = msToFrames(outMs);
  const endFrames = msToFrames(END_MS);
  return { fps: FPS, titleFrames, endFrames, videoFrames, durationInFrames: titleFrames + videoFrames + endFrames, segments };
}

// The output frame at which a moment of the recording is shown.
export function sourceMsToFrame(timeline: Timeline, ms: number): number {
  const { segments } = timeline;
  if (segments.length === 0) return timeline.titleFrames;
  let seg = segments.find((s) => !s.still && ms >= s.srcStartMs && ms < s.srcEndMs);
  if (!seg) seg = ms < segments[0].srcStartMs ? segments[0] : segments[segments.length - 1];
  const within = Math.min(Math.max(ms - seg.srcStartMs, 0), seg.srcEndMs - seg.srcStartMs);
  return seg.fromFrame + Math.min(seg.frames - 1, Math.round(((within / seg.speed) * FPS) / 1000));
}

export function stepAtFrame(timeline: Timeline, frame: number): Segment | undefined {
  return timeline.segments.find((s) => frame >= s.fromFrame && frame < s.fromFrame + s.frames);
}

export function formatClock(frame: number, fps = FPS): string {
  const total = Math.floor(frame / fps);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

// One line per step: "m:ss  Caption", at the frame where the step first appears.
export function chapters(timeline: Timeline, steps: Step[]): string {
  const lines: string[] = [];
  steps.forEach((step, i) => {
    const seg = timeline.segments.find((s) => s.step === i);
    if (seg) lines.push(`${formatClock(seg.fromFrame, timeline.fps)}  ${step.caption}`);
  });
  return lines.join("\n") + "\n";
}

export type CursorState = { x: number; y: number; visible: boolean; ripple: number | null };

const GLIDE_FRAMES = 18;

// Playwright recordings have no cursor, so draw one: it glides to each logged click and ripples there.
export function cursorAt(timeline: Timeline, steps: Step[], viewport: { w: number; h: number }, frame: number): CursorState {
  const clicks = steps.flatMap((s) => s.clicks ?? []).map((c) => ({ x: c.x, y: c.y, frame: sourceMsToFrame(timeline, c.tMs) }));
  const videoEnd = timeline.titleFrames + timeline.videoFrames;
  if (clicks.length === 0 || frame < timeline.titleFrames || frame >= videoEnd) {
    return { x: viewport.w / 2, y: viewport.h / 2, visible: false, ripple: null };
  }
  let previous = { x: viewport.w / 2, y: viewport.h / 2, frame: timeline.titleFrames };
  for (const click of clicks) {
    if (frame < click.frame) {
      const start = Math.max(previous.frame, click.frame - GLIDE_FRAMES);
      const t = frame <= start ? 0 : (frame - start) / Math.max(1, click.frame - start);
      const eased = t * t * (3 - 2 * t);
      return { x: previous.x + (click.x - previous.x) * eased, y: previous.y + (click.y - previous.y) * eased, visible: true, ripple: rippleAt(clicks, frame) };
    }
    previous = click;
  }
  return { x: previous.x, y: previous.y, visible: true, ripple: rippleAt(clicks, frame) };
}

const RIPPLE_FRAMES = 15;

function rippleAt(clicks: { frame: number }[], frame: number): number | null {
  for (const click of clicks) {
    const age = frame - click.frame;
    if (age >= 0 && age < RIPPLE_FRAMES) return age / RIPPLE_FRAMES;
  }
  return null;
}
