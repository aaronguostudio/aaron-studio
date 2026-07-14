#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const REMOTION_DIR = join(ROOT, "tiles/aaron-video-gen/remotion");
const ANALYZER = join(ROOT, "tiles/music-visualizer/scripts/analyze-audio.mjs");
const DEFAULT_AUDIO = join(ROOT, "src/content/music-visualizer/material-ritual-full-v1/music/master-600s-normalized.m4a");
const DEFAULT_OUTPUT = join(ROOT, "src/content/music-visualizer/digital-space-studies-v1");

const studies = [
  { variant: "spectral-sanctum", startSec: 162, title: "Spectral Sanctum" },
];

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
  if (result.status !== 0) {
    throw new Error(`${command} failed with exit code ${result.status ?? "unknown"}`);
  }
}

function runQuiet(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.status !== 0) {
    throw new Error(`${command} failed: ${String(result.stderr || result.stdout || "").slice(0, 800)}`);
  }
}

function renderStudy({ study, audioPath, outputDir, durationSec, skipVideo }) {
  const studyDir = join(outputDir, study.variant);
  mkdirSync(studyDir, { recursive: true });

  const sampleAudio = join(studyDir, "music-sample.m4a");
  const analysisPath = join(studyDir, "audio-analysis.json");
  const propsPath = join(studyDir, "render-props.json");
  const silentRender = join(studyDir, `${study.variant}.render.mp4`);
  const finalVideo = join(studyDir, `${study.variant}-18s-1080p.mp4`);
  const gl = study.variant === "tideglass" || study.variant === "resonance-fabric" ? "angle" : "swiftshader";

  runQuiet("ffmpeg", [
    "-y", "-ss", String(study.startSec), "-t", String(durationSec), "-i", audioPath,
    "-vn", "-c:a", "aac", "-b:a", "192k", sampleAudio,
  ]);
  run(process.execPath, [ANALYZER, sampleAudio, analysisPath]);

  const audioAnalysis = JSON.parse(readFileSync(analysisPath, "utf8"));
  const props = {
    variant: study.variant,
    durationSec,
    seed: 114,
    audioAnalysis,
  };
  writeFileSync(propsPath, JSON.stringify(props, null, 2));

  const stills = [
    ["entry", 0],
    ["peak", Math.floor((durationSec * 30) / 2)],
    ["exit", durationSec * 30 - 1],
  ];
  for (const [name, frame] of stills) {
    run("npx", [
      "remotion", "still", "src/index.ts", "DigitalSpaces", join(studyDir, `${name}.png`),
      "--props", propsPath, "--frame", String(frame), `--gl=${gl}`, "--ipv4",
    ], { cwd: REMOTION_DIR });
  }

  if (!skipVideo) {
    run("npx", [
      "remotion", "render", "src/index.ts", "DigitalSpaces", silentRender,
      "--props", propsPath, "--concurrency", "2", `--gl=${gl}`, "--ipv4",
    ], { cwd: REMOTION_DIR });
    runQuiet("ffmpeg", [
      "-y", "-i", silentRender, "-i", sampleAudio,
      "-map", "0:v:0", "-map", "1:a:0", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
      "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", finalVideo,
    ]);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    title: study.title,
    variant: study.variant,
    durationSec,
    audioSource: audioPath,
    audioStartSec: study.startSec,
    audioAnalysis: analysisPath,
    visualContract: "Fixed geometry; only internal material light and density respond to precomputed audio analysis.",
    loopContract: "The visual base cycle returns to its initial state at the specified duration. Audio-linked light remains deliberately bounded for calm playback.",
    stills: Object.fromEntries(stills.map(([name]) => [name, join(studyDir, `${name}.png`)])),
    output: skipVideo ? null : finalVideo,
  };
  writeFileSync(join(studyDir, "generation-manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Study complete: ${study.title} → ${skipVideo ? "stills only" : finalVideo}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const audioPath = resolve(args.audio || DEFAULT_AUDIO);
  const outputDir = resolve(args.output || DEFAULT_OUTPUT);
  const durationSec = Number(args.duration || 18);
  const only = args.variant ? studies.filter((study) => study.variant === args.variant) : studies;

  if (!existsSync(audioPath)) throw new Error(`Audio file not found: ${audioPath}`);
  if (!Number.isFinite(durationSec) || durationSec < 6 || durationSec > 25) {
    throw new Error("duration must be between 6 and 25 seconds for this experimental scene.");
  }
  if (!only.length) throw new Error(`Unknown variant: ${args.variant}`);

  for (const study of only) {
    renderStudy({ study, audioPath, outputDir, durationSec, skipVideo: Boolean(args.stillsOnly) });
  }
}

main();
