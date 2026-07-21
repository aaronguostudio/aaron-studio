#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const REMOTION_DIR = join(ROOT, "tiles/aaron-video-gen/remotion");
const ANALYZER = join(ROOT, "tiles/music-visualizer/scripts/analyze-audio.mjs");
const DEFAULT_AUDIO = join(ROOT, "src/content/music-visualizer/midnight-lo-fi-wave/music.mp3");
const DEFAULT_OUTPUT = join(ROOT, "src/content/music-visualizer/ambient-signal-focus-audio-v1");

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (inlineValue !== undefined) args[key] = inlineValue;
    else if (argv[index + 1] && !argv[index + 1].startsWith("--")) args[key] = argv[++index];
    else args[key] = true;
  }
  return args;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.status !== 0) throw new Error(`${command} failed with exit code ${result.status ?? "unknown"}`);
}

function runQuiet(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.status !== 0) {
    throw new Error(`${command} failed: ${String(result.stderr || result.stdout || "").slice(0, 1000)}`);
  }
  return result.stdout;
}

function probe(filePath) {
  return JSON.parse(runQuiet("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration:stream=codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels",
    "-of", "json",
    filePath,
  ]));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const audioPath = resolve(args.audio || DEFAULT_AUDIO);
  const outputDir = resolve(args.output || DEFAULT_OUTPUT);
  const requestedDuration = Number(args.duration || 60);
  const startSec = Number(args.start || 0);
  const skipVideo = Boolean(args.stillsOnly);

  if (!existsSync(audioPath)) throw new Error(`Audio file not found: ${audioPath}`);
  if (!Number.isFinite(requestedDuration) || requestedDuration < 30 || requestedDuration > 90) {
    throw new Error("duration must be between 30 and 90 seconds for a prototype.");
  }

  const audioProbe = probe(audioPath);
  const audioDuration = Number(audioProbe.format?.duration || 0);
  const durationSec = Math.min(requestedDuration, Math.max(0, audioDuration - startSec));
  if (durationSec < 30) throw new Error("Selected audio interval is shorter than 30 seconds.");

  mkdirSync(outputDir, { recursive: true });
  const analysisPath = join(outputDir, "audio-analysis.json");
  const propsPath = join(outputDir, "render-props.json");
  const silentRender = join(outputDir, "ambient-signal-focus.render.mp4");
  const finalVideo = join(outputDir, `ambient-signal-focus-${Math.round(durationSec)}s-1080p.mp4`);
  const contactSheet = join(outputDir, "contact-sheet.jpg");

  run(process.execPath, [ANALYZER, audioPath, analysisPath]);
  const audioAnalysis = JSON.parse(readFileSync(analysisPath, "utf8"));
  const props = {
    scene: "focus",
    durationSec,
    cycleDurationSec: durationSec,
    seed: 2718,
    intensity: 0.88,
    palette: "signal",
    showChrome: false,
    audioAnalysis,
  };
  writeFileSync(propsPath, JSON.stringify(props, null, 2));

  const fps = 30;
  const lastFrame = Math.max(0, Math.floor(durationSec * fps) - 1);
  const stills = [
    ["entry", 0],
    ["first-change", Math.min(lastFrame, 45)],
    ["midpoint", Math.floor(lastFrame / 2)],
    ["release", lastFrame],
  ];

  for (const [name, frame] of stills) {
    run("npx", [
      "remotion", "still", "src/index.ts", "AmbientSignal", join(outputDir, `${name}.png`),
      "--props", propsPath, "--frame", String(frame), "--gl=swiftshader", "--ipv4",
    ], { cwd: REMOTION_DIR });
  }

  runQuiet("ffmpeg", [
    "-y",
    ...stills.flatMap(([name]) => ["-i", join(outputDir, `${name}.png`)]),
    "-filter_complex", "[0:v]scale=480:270[a];[1:v]scale=480:270[b];[2:v]scale=480:270[c];[3:v]scale=480:270[d];[a][b][c][d]hstack=inputs=4",
    "-frames:v", "1", "-q:v", "2", contactSheet,
  ]);

  if (!skipVideo) {
    run("npx", [
      "remotion", "render", "src/index.ts", "AmbientSignal", silentRender,
      "--props", propsPath, "--codec", "h264", "--crf", "18",
      "--concurrency", "2", "--gl=swiftshader", "--ipv4",
    ], { cwd: REMOTION_DIR });
    runQuiet("ffmpeg", [
      "-y", "-i", silentRender, "-ss", String(startSec), "-t", String(durationSec), "-i", audioPath,
      "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
      "-af", "volume=-1.4dB",
      "-movflags", "+faststart", "-shortest", finalVideo,
    ]);
    rmSync(silentRender, { force: true });
  }

  const outputProbe = skipVideo ? null : probe(finalVideo);
  const manifest = {
    generatedAt: new Date().toISOString(),
    title: "Signal Loom — Luminous Tides Focus Study",
    listeningJob: "Deep work and coding: calm visual attention without beat prediction.",
    direction: "Midnight Lo-Fi Wave × Signal Loom",
    status: "candidate — user listening pass required",
    format: "1920×1080 / 30fps / H.264 + AAC",
    durationSec,
    music: {
      title: "Luminous Tides",
      assetId: "music:783d2bf966a67bb4",
      sourcePath: relative(ROOT, audioPath),
      startSec,
      outputGainDb: -1.4,
      rights: "needs-verification before commercial publication",
    },
    audioAnalysis: {
      path: relative(ROOT, analysisPath),
      version: audioAnalysis.analysisVersion,
      featuresUsed: ["calmEnergy", "calmLow", "calmHigh", "pulse"],
    },
    visualContract: "One original signal architecture. Frame-driven geometry follows one 60-second cycle; music changes only internal light pressure, route clarity, and a restrained transient highlight.",
    motionContract: "No beat-driven position, scale, camera movement, or jitter. Route travel and structural drift are deterministic and independent from audio.",
    reviewFrames: Object.fromEntries(stills.map(([name, frame]) => [name, { frame, path: relative(ROOT, join(outputDir, `${name}.png`)) }])),
    contactSheet: relative(ROOT, contactSheet),
    output: skipVideo ? null : relative(ROOT, finalVideo),
    probe: outputProbe,
  };
  writeFileSync(join(outputDir, "generation-manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Signal Loom focus study complete: ${skipVideo ? "stills only" : finalVideo}`);
}

main();
