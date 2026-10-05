#!/usr/bin/env bun
// Render a capture folder into walkthrough.mp4 plus chapters.txt, both written into that folder.
//
//   npx -y bun tiles/aaron-video-gen/scripts/walkthrough/render-walkthrough.ts <run> [--out <file.mp4>] [--calibration-ms <n>] [--dry-run]
//
// <run> follows capture contract version 1 (see ../../references/walkthrough-capture.md).
// Refuses a capture whose status is not "passed", and any run folder or output inside this repo,
// so a work recording can never land in the content pipelines here.
import { execFileSync, spawnSync } from "child_process";
import { existsSync, readFileSync, realpathSync, writeFileSync } from "fs";
import { dirname, join, resolve, sep } from "path";
import { elevenLabs, loadApiKey, loadVoiceProfile, narrate, stepMinMs, type NarrationClip } from "./narration";
import {
  buildTimeline,
  calibrate,
  chapters,
  validateCapture,
  type Capture,
  type Step,
} from "../../remotion/src/projects/walkthrough-video/timeline";

const REMOTION_DIR = resolve(import.meta.dir, "..", "..", "remotion");
const ENTRY = "src/projects/walkthrough-video/index.tsx";

export class RenderRefusal extends Error {}

// The main checkout's root, even when this runs from a worktree inside it.
export function repoRoots(from = import.meta.dir): string[] {
  const roots = new Set<string>();
  try {
    const top = execFileSync("git", ["-C", from, "rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
    roots.add(realpathSync(top));
    const common = execFileSync("git", ["-C", from, "rev-parse", "--path-format=absolute", "--git-common-dir"], { encoding: "utf8" }).trim();
    roots.add(realpathSync(dirname(common)));
  } catch {
    roots.add(realpathSync(resolve(import.meta.dir, "..", "..", "..", "..")));
  }
  return [...roots];
}

function realish(path: string): string {
  // The output file does not exist yet: resolve its closest existing parent.
  let probe = resolve(path);
  const tail: string[] = [];
  while (!existsSync(probe)) {
    tail.unshift(probe.slice(dirname(probe).length + 1));
    probe = dirname(probe);
  }
  return join(realpathSync(probe), ...tail);
}

export function insideAny(path: string, roots: string[]): boolean {
  const real = realish(path);
  return roots.some((root) => real === root || real.startsWith(root + sep));
}

export type Prepared = {
  run: string;
  out: string;
  chaptersPath: string;
  chaptersText: string;
  seconds: number;
  calibrationMs: number;
  calibrationSource: "argument" | "capture.json" | "sync flash" | "none";
  steps: Step[];
  stepMinMs?: number[];
};

// The capture clock and the recording's first frame drift apart by a few hundred ms (the
// screencast starts after the page does). A capture can mark the moment its page turned from
// black to white (capture.json `sync.tMs`); this finds that frame and returns the offset to add
// to every capture time. Null when there is no such transition or ffprobe is missing.
export function detectSyncOffset(video: string, syncMs: number): number | null {
  const movie = `movie='${video.replace(/'/g, "'\\''")}',signalstats`;
  let csv: string;
  try {
    csv = execFileSync(
      "ffprobe",
      ["-v", "error", "-f", "lavfi", "-i", movie, "-read_intervals", `%+${Math.ceil(syncMs / 1000) + 10}`,
        "-show_entries", "frame=pts_time:frame_tags=lavfi.signalstats.YAVG", "-of", "csv=p=0"],
      { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
    );
  } catch {
    return null;
  }
  let sawBlack = false;
  for (const line of csv.split("\n")) {
    const [pts, yavg] = line.split(",").map(Number);
    if (!Number.isFinite(pts) || !Number.isFinite(yavg)) continue;
    if (yavg < 40) sawBlack = true;
    else if (sawBlack && yavg > 200) return Math.round(pts * 1000 - syncMs);
  }
  return null;
}

export function prepare(
  runArg: string,
  outArg?: string,
  roots = repoRoots(),
  calibrationArg?: number,
  stepMinMs?: number[],
): Prepared {
  const run = resolve(runArg);
  const out = resolve(outArg ?? join(run, "walkthrough.mp4"));
  if (insideAny(run, roots)) throw new RenderRefusal(`The capture folder ${run} is inside this repo. Keep captures outside it.`);
  if (insideAny(out, roots)) throw new RenderRefusal(`Refusing to write ${out}: it is inside this repo.`);
  for (const name of ["capture.json", "steps.json", "video.webm"]) {
    if (!existsSync(join(run, name))) throw new RenderRefusal(`${run} has no ${name}; is it a capture folder?`);
  }
  const capture = JSON.parse(readFileSync(join(run, "capture.json"), "utf8")) as Capture;
  const raw = JSON.parse(readFileSync(join(run, "steps.json"), "utf8")) as Step[];
  const problems = validateCapture(capture, raw);
  for (const step of raw) {
    if (step.shot && !existsSync(join(run, step.shot))) problems.push(`step ${step.id}: shot ${step.shot} is missing`);
  }
  if (problems.length) throw new RenderRefusal(`Capture refused:\n- ${problems.join("\n- ")}`);
  let calibrationMs = 0;
  let calibrationSource: Prepared["calibrationSource"] = "none";
  if (calibrationArg !== undefined) [calibrationMs, calibrationSource] = [calibrationArg, "argument"];
  else if (capture.calibrationMs !== undefined) [calibrationMs, calibrationSource] = [capture.calibrationMs, "capture.json"];
  else if (capture.sync) {
    const detected = detectSyncOffset(join(run, "video.webm"), capture.sync.tMs);
    if (detected !== null) [calibrationMs, calibrationSource] = [detected, "sync flash"];
  }
  const steps = calibrate(raw, calibrationMs);
  const timeline = buildTimeline(steps, stepMinMs ? { minStepMs: (_s, i) => stepMinMs[i] ?? 0 } : {});
  return {
    run,
    out,
    chaptersPath: join(dirname(out), "chapters.txt"),
    chaptersText: chapters(timeline, steps),
    seconds: timeline.durationInFrames / timeline.fps,
    calibrationMs,
    calibrationSource,
    steps,
    stepMinMs,
  };
}

export type Args = {
  run?: string;
  out?: string;
  dryRun: boolean;
  calibrationMs?: number;
  narrate: boolean;
  voiceProfile?: string;
};

export function parseArgs(argv: string[]): Args {
  const valueOf = (flag: string) => (argv.indexOf(flag) >= 0 ? argv[argv.indexOf(flag) + 1] : undefined);
  const taken = new Set(["--out", "--calibration-ms", "--voice-profile"].map((f) => argv.indexOf(f) + 1).filter((i) => i > 0));
  const run = argv.find((a, i) => !a.startsWith("--") && !taken.has(i));
  const calibration = valueOf("--calibration-ms");
  return {
    run,
    out: valueOf("--out"),
    dryRun: argv.includes("--dry-run"),
    calibrationMs: calibration === undefined ? undefined : Number(calibration),
    narrate: argv.includes("--narrate"),
    voiceProfile: valueOf("--voice-profile"),
  };
}

async function main(argv: string[]): Promise<number> {
  const { run, out, dryRun, calibrationMs, narrate: withVoice, voiceProfile } = parseArgs(argv);
  if (!run || (calibrationMs !== undefined && !Number.isFinite(calibrationMs))) {
    console.error(
      "usage: render-walkthrough.ts <capture folder> [--out <file.mp4>] [--narrate [--voice-profile <id>]] [--calibration-ms <n>] [--dry-run]",
    );
    return 2;
  }
  const roots = repoRoots();
  let prepared: Prepared;
  try {
    prepared = prepare(run, out, roots, calibrationMs);
  } catch (error) {
    if (error instanceof RenderRefusal) {
      console.error(error.message);
      return 3;
    }
    throw error;
  }
  let clips: NarrationClip[] = [];
  if (withVoice) {
    const profile = loadVoiceProfile(voiceProfile);
    const key = loadApiKey(roots.map((root) => join(root, ".env")));
    clips = await narrate(prepared.run, prepared.steps, profile, elevenLabs(key));
    const source = prepared.calibrationSource;
    prepared = { ...prepare(run, out, roots, prepared.calibrationMs, stepMinMs(prepared.steps, clips)), calibrationSource: source };
    console.log(`voice:    ${profile.name}, ${clips.length} clips in ${join(prepared.run, "narration")}`);
  }
  writeFileSync(prepared.chaptersPath, prepared.chaptersText);
  console.log(`chapters: ${prepared.chaptersPath}`);
  console.log(`length:   ${Math.round(prepared.seconds)} s`);
  console.log(`sync:     ${prepared.calibrationMs} ms (${prepared.calibrationSource})`);
  if (dryRun) return 0;
  const result = spawnSync(
    "npx",
    [
      "remotion",
      "render",
      ENTRY,
      "WalkthroughVideo",
      prepared.out,
      `--public-dir=${prepared.run}`,
      `--props=${JSON.stringify({ calibrationMs: prepared.calibrationMs, stepMinMs: prepared.stepMinMs, narration: clips })}`,
      "--codec=h264",
      "--crf=20",
      "--pixel-format=yuv420p",
      ...(clips.length ? ["--audio-codec=aac"] : ["--muted"]),
      "--log=error",
    ],
    { cwd: REMOTION_DIR, stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error("Remotion render failed.");
    return result.status ?? 1;
  }
  console.log(`video:    ${prepared.out}`);
  return 0;
}

if (import.meta.main) process.exit(await main(process.argv.slice(2)));
