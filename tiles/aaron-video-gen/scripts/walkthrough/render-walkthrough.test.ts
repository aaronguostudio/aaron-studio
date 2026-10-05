import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { RenderRefusal, detectSyncOffset, insideAny, parseArgs, prepare, repoRoots } from "./render-walkthrough";
import { SKEW_MS, fixtureSteps, makeFixture } from "./make-fixture";

function captureFolder(overrides: Record<string, unknown> = {}): string {
  const run = mkdtempSync(join(tmpdir(), "walkthrough-test-"));
  mkdirSync(join(run, "shots"));
  for (const step of fixtureSteps) writeFileSync(join(run, step.shot!), "png");
  writeFileSync(join(run, "video.webm"), "webm");
  writeFileSync(join(run, "steps.json"), JSON.stringify(fixtureSteps));
  writeFileSync(
    join(run, "capture.json"),
    JSON.stringify({ version: 1, walk: "w", env: "local", title: "T", startedAt: "2026-10-05T00:00:00Z", viewport: { w: 1440, h: 900 }, status: "passed", ...overrides }),
  );
  return run;
}

describe("prepare", () => {
  test("a passed capture yields chapters next to the output", () => {
    const run = captureFolder();
    const prepared = prepare(run);
    expect(prepared.out).toBe(join(run, "walkthrough.mp4"));
    expect(prepared.chaptersPath).toBe(join(run, "chapters.txt"));
    expect(prepared.chaptersText.split("\n")[0]).toBe("0:02  Open the form");
  });

  test("a failed walk never renders", () => {
    const run = captureFolder({ status: "failed", failedStep: "save" });
    expect(() => prepare(run)).toThrow(RenderRefusal);
    expect(() => prepare(run)).toThrow(/at step "save"/);
  });

  test("a missing shot is refused", () => {
    const run = captureFolder();
    writeFileSync(join(run, "steps.json"), JSON.stringify([{ ...fixtureSteps[0], shot: "shots/nope.png" }]));
    expect(() => prepare(run)).toThrow(/shots\/nope.png is missing/);
  });

  test("an output inside this repo is refused, and so is a capture folder inside it", () => {
    const roots = repoRoots();
    const run = captureFolder();
    const inRepo = join(roots[roots.length - 1], "tiles", "x", "walkthrough.mp4");
    expect(() => prepare(run, inRepo, roots)).toThrow(/inside this repo/);
    expect(insideAny(resolve(import.meta.dir), roots)).toBe(true);
    expect(insideAny(run, roots)).toBe(false);
  });
});

describe("parseArgs", () => {
  test("the folder is found with or without --out, before or after it", () => {
    expect(parseArgs(["/run"])).toMatchObject({ run: "/run", out: undefined, dryRun: false });
    expect(parseArgs(["/run", "--out", "/x.mp4"])).toMatchObject({ run: "/run", out: "/x.mp4", dryRun: false });
    expect(parseArgs(["--out", "/x.mp4", "/run", "--dry-run"])).toMatchObject({ run: "/run", out: "/x.mp4", dryRun: true });
    expect(parseArgs(["--calibration-ms", "-250", "/run"])).toMatchObject({ run: "/run", calibrationMs: -250 });
  });
});

const hasFfmpeg = (() => {
  try {
    require("child_process").execFileSync("ffprobe", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

describe("sync flash", () => {
  test.skipIf(!hasFfmpeg)("the skew between the capture clock and the recording is measured and taken off", () => {
    const run = makeFixture(mkdtempSync(join(tmpdir(), "walkthrough-sync-")));
    const offset = detectSyncOffset(join(run, "video.webm"), SKEW_MS + 400)!;
    expect(Math.abs(offset + SKEW_MS)).toBeLessThanOrEqual(40); // one frame at 25 fps
    const prepared = prepare(run);
    expect(prepared.calibrationSource).toBe("sync flash");
    expect(prepared.chaptersText.split("\n")[0]).toBe("0:02  Open the form");
    expect(prepare(run, undefined, repoRoots(), 0).calibrationSource).toBe("argument");
  });

  test("no flash, no offset", () => {
    expect(detectSyncOffset("/nonexistent/video.webm", 400)).toBeNull();
  });
});
