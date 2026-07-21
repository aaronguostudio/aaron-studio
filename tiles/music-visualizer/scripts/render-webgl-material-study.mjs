#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const REMOTION_DIR = join(ROOT, "tiles/aaron-video-gen/remotion");
const ANALYZER = join(ROOT, "tiles/music-visualizer/scripts/analyze-audio.mjs");
const DEFAULT_AUDIO = join(ROOT, "src/content/music-visualizer/prism-breaks-long-night/music-full.m4a");
const DEFAULT_OUTPUT = join(ROOT, "src/content/music-visualizer/webgl-material-study-v1");

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
  if (result.status !== 0) {
    throw new Error(`${command} failed: ${String(result.stderr || result.stdout || "").slice(0, 1200)}`);
  }
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  const audioPath = resolve(args.audio || DEFAULT_AUDIO);
  const outputDir = resolve(args.output || DEFAULT_OUTPUT);
  const startSec = Number(args.start || 15);
  const durationSec = Number(args.duration || 15);
  const seed = Number(args.seed || 902);
  if (!existsSync(audioPath)) throw new Error(`Audio source does not exist: ${audioPath}`);
  if (!Number.isFinite(startSec) || !Number.isFinite(durationSec) || durationSec < 2 || durationSec > 30) {
    throw new Error("duration must be between 2 and 30 seconds.");
  }

  mkdirSync(outputDir, { recursive: true });
  const audioWindow = join(outputDir, "music-sample.m4a");
  const analysisPath = join(outputDir, "audio-analysis.json");
  const propsPath = join(outputDir, "render-props.json");
  const silentRender = join(outputDir, "webgl-material-study-4k60.render.mp4");
  const outputVideo = join(outputDir, `webgl-material-study-${durationSec}s-4k60.mp4`);
  const stillFrames = [0, Math.round(durationSec * 60 * 0.42), Math.max(0, Math.ceil(durationSec * 60) - 2)];
  const stills = ["entry", "body", "exit"].map((name, index) => ({ frame: stillFrames[index], name, path: join(outputDir, `${name}-4k.png`) }));

  runQuiet("ffmpeg", [
    "-y", "-ss", String(startSec), "-t", String(durationSec), "-i", audioPath,
    "-vn", "-c:a", "aac", "-b:a", "256k", audioWindow,
  ]);
  run(process.execPath, [ANALYZER, audioWindow, analysisPath]);
  const audioAnalysis = JSON.parse(readFileSync(analysisPath, "utf8"));
  const props = { audioAnalysis, durationSec, seed };
  writeFileSync(propsPath, JSON.stringify(props, null, 2));

  for (const still of stills) {
    run("npx", [
      "remotion", "still", "src/index.ts", "WebGLMaterialStudy", still.path,
      "--props", propsPath, "--frame", String(still.frame), "--gl=angle", "--ipv4",
    ], { cwd: REMOTION_DIR });
  }

  run("npx", [
    "remotion", "render", "src/index.ts", "WebGLMaterialStudy", silentRender,
    "--props", propsPath, "--codec=h264", "--crf=12", "--concurrency=1", "--gl=angle", "--ipv4", "--pixel-format=yuv420p",
  ], { cwd: REMOTION_DIR });
  runQuiet("ffmpeg", [
    "-y", "-i", silentRender, "-i", audioWindow,
    "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k",
    "-shortest", "-movflags", "+faststart", outputVideo,
  ]);
  rmSync(silentRender, { force: true });

  writeFileSync(join(outputDir, "generation-manifest.json"), JSON.stringify({
    audioAnalysis: analysisPath,
    audioSource: audioPath,
    audioStartSec: startSec,
    audioWindow,
    durationSec,
    format: "3840×2160 / 60fps / high-bitrate H.264 + AAC",
    generatedAt: new Date().toISOString(),
    mapping: {
      calmEnergy: "transmitted light and internal luminance",
      calmHigh: "rim chroma and specular clarity",
      calmLow: "material density and optical depth",
      pulse: "bounded warm tint only; no flash, ring, scale, translation, or camera response",
    },
    motionContract: "Native OGL/WebGL mesh. Fixed camera and fixed silhouette. Time only moves internal surface interference at a long, non-repeating pace.",
    output: outputVideo,
    renderProps: propsPath,
    stills: Object.fromEntries(stills.map((still) => [still.name, still.path])),
  }, null, 2));
  console.log(`4K/60 WebGL material study rendered: ${outputVideo}`);
};

main();
