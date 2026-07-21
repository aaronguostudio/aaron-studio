#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const REMOTION_DIR = join(ROOT, "tiles/aaron-video-gen/remotion");
const ANALYZER = join(ROOT, "tiles/music-visualizer/scripts/analyze-audio.mjs");
const DEFAULT_AUDIO = join(ROOT, "src/content/music-visualizer/prism-breaks-long-night/music-full.m4a");
const DEFAULT_OUTPUT = join(ROOT, "src/content/music-visualizer/webgl-motion-proof-v1");

const parseArgs = (argv) => {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const [key, inline] = token.slice(2).split("=", 2);
    values[key] = inline ?? (argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[++index] : true);
  }
  return values;
};

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.status !== 0) throw new Error(`${command} failed with exit code ${result.status ?? "unknown"}`);
};

const runQuiet = (command, args, options = {}) => {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.status !== 0) throw new Error(`${command} failed: ${String(result.stderr || result.stdout || "").slice(0, 1200)}`);
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  const audioPath = resolve(args.audio || DEFAULT_AUDIO);
  const outputDir = resolve(args.output || DEFAULT_OUTPUT);
  const startSec = Number(args.start || 15);
  const durationSec = Number(args.duration || 12);
  const seed = Number(args.seed || 1204);
  if (!existsSync(audioPath)) throw new Error(`Audio source does not exist: ${audioPath}`);
  if (!Number.isFinite(startSec) || !Number.isFinite(durationSec) || durationSec < 6 || durationSec > 20) {
    throw new Error("duration must be between 6 and 20 seconds.");
  }

  mkdirSync(outputDir, { recursive: true });
  const audioWindow = join(outputDir, "music-sample.m4a");
  const analysisPath = join(outputDir, "audio-analysis.json");
  const propsPath = join(outputDir, "render-props.json");
  const silentRender = join(outputDir, "webgl-motion-proof.render.mp4");
  const outputVideo = join(outputDir, `webgl-motion-proof-${durationSec}s-1080p60.mp4`);
  // Capture just after selected low-frequency events, so the QA contact sheet
  // verifies the contained refraction pass rather than only the quiet state.
  const stillFrames = [0, 1.75, 3.75, 6.45, durationSec - 0.05].map((seconds) => Math.max(0, Math.round(seconds * 60)));
  const stills = ["entry", "pass-a", "pass-b", "pass-c", "exit"].map((name, index) => ({ frame: stillFrames[index], name, path: join(outputDir, `${name}.png`) }));

  runQuiet("ffmpeg", ["-y", "-ss", String(startSec), "-t", String(durationSec), "-i", audioPath, "-vn", "-c:a", "aac", "-b:a", "256k", audioWindow]);
  run(process.execPath, [ANALYZER, audioWindow, analysisPath]);
  const props = { audioAnalysis: JSON.parse(readFileSync(analysisPath, "utf8")), durationSec, seed };
  writeFileSync(propsPath, JSON.stringify(props, null, 2));

  for (const still of stills) {
    run("npx", ["remotion", "still", "src/index.ts", "WebGLMotionProof", still.path, "--props", propsPath, "--frame", String(still.frame), "--gl=angle", "--ipv4"], { cwd: REMOTION_DIR });
  }
  run("npx", ["remotion", "render", "src/index.ts", "WebGLMotionProof", silentRender, "--props", propsPath, "--codec=h264", "--crf=16", "--concurrency=1", "--gl=angle", "--ipv4"], { cwd: REMOTION_DIR });
  runQuiet("ffmpeg", ["-y", "-i", silentRender, "-i", audioWindow, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", outputVideo]);
  rmSync(silentRender, { force: true });

  writeFileSync(join(outputDir, "generation-manifest.json"), JSON.stringify({
    audioAnalysis: analysisPath,
    audioSource: audioPath,
    audioStartSec: startSec,
    durationSec,
    format: "1920×1080 / 60fps / H.264 + AAC",
    generatedAt: new Date().toISOString(),
    motionContract: "Static spatial composition. Long material current supplies continuous movement; infrequent strong low-frequency peaks launch a 1.82s contained refractive pass across the primary pane. No camera, object, scale, shake, ring, or equalizer motion.",
    output: outputVideo,
    renderProps: propsPath,
    stills: Object.fromEntries(stills.map((still) => [still.name, still.path])),
  }, null, 2));
  console.log(`Motion proof rendered: ${outputVideo}`);
};

main();
