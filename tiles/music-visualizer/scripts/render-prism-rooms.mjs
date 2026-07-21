#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const REMOTION_DIR = join(ROOT, "tiles/aaron-video-gen/remotion");
const ANALYZER = join(ROOT, "tiles/music-visualizer/scripts/analyze-audio.mjs");
const DEFAULT_AUDIO = join(ROOT, "src/content/music-visualizer/material-ritual-full-v1/music/master-600s-normalized.m4a");
const DEFAULT_OUTPUT = join(ROOT, "src/content/music-visualizer/prism-rooms-pilot");

const ROOM_SETS = {
  "prism-rooms": {
    title: "Prism Rooms",
    visualAssets: [
      { file: "music-visualizer/prism-rooms/scene-01-suspended.png", scene: "Suspended Prism" },
      { file: "music-visualizer/prism-rooms/scene-02-aperture.png", scene: "The Aperture" },
      { file: "music-visualizer/prism-rooms/scene-03-quiet-field.png", scene: "The Quiet Field" },
    ],
  },
  "obsidian-relay": {
    title: "Obsidian Relay",
    visualAssets: [
      { file: "music-visualizer/obsidian-relay/scene-01-monoliths.png", scene: "Cobalt Monoliths" },
      { file: "music-visualizer/obsidian-relay/scene-02-aperture.png", scene: "Graphite Aperture" },
      { file: "music-visualizer/obsidian-relay/scene-03-release.png", scene: "Low Obsidian Field" },
    ],
  },
  "nocturne-glasshouse": {
    title: "Nocturne Glasshouse",
    visualAssets: [
      { file: "music-visualizer/nocturne-glasshouse/scene-01-stillness.png", scene: "Stillness" },
      { file: "music-visualizer/nocturne-glasshouse/scene-02-interval.png", scene: "Soft Interval" },
      { file: "music-visualizer/nocturne-glasshouse/scene-03-release.png", scene: "Canopy Release" },
    ],
  },
};

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
  if (result.status !== 0) throw new Error(`${command} failed: ${String(result.stderr || result.stdout || "").slice(0, 800)}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const audioPath = resolve(args.audio || DEFAULT_AUDIO);
  const outputDir = resolve(args.output || DEFAULT_OUTPUT);
  const durationSec = Number(args.duration || 54);
  const startSec = Number(args.start ?? (durationSec >= 300 ? 0 : 162));
  const roomSet = String(args.set || "prism-rooms");
  const skipVideo = Boolean(args.stillsOnly);
  const set = ROOM_SETS[roomSet];

  if (!existsSync(audioPath)) throw new Error(`Audio file not found: ${audioPath}`);
  if (!set) throw new Error(`Unknown room set: ${roomSet}`);
  if (!Number.isFinite(durationSec) || durationSec < 30 || durationSec > 600) {
    throw new Error("duration must be between 30 and 600 seconds.");
  }

  mkdirSync(outputDir, { recursive: true });
  const sampleAudio = join(outputDir, "music-sample.m4a");
  const analysisPath = join(outputDir, "audio-analysis.json");
  const propsPath = join(outputDir, "render-props.json");
  const silentRender = join(outputDir, `${roomSet}.render.mp4`);
  const finalVideo = join(outputDir, `${roomSet}-${durationSec}s-1080p.mp4`);

  runQuiet("ffmpeg", [
    "-y", "-ss", String(startSec), "-t", String(durationSec), "-i", audioPath,
    "-vn", "-c:a", "aac", "-b:a", "192k", sampleAudio,
  ]);
  run(process.execPath, [ANALYZER, sampleAudio, analysisPath]);

  const props = {
    durationSec,
    seed: 246,
    roomSet,
    audioAnalysis: JSON.parse(readFileSync(analysisPath, "utf8")),
  };
  writeFileSync(propsPath, JSON.stringify(props, null, 2));

  const fps = 30;
  const transitionFrames = 90;
  const roomDurationInFrames = Math.round((durationSec * fps + transitionFrames * (set.visualAssets.length - 1)) / set.visualAssets.length);
  const transitionOneMidpoint = Math.round(roomDurationInFrames - transitionFrames / 2);
  const transitionTwoMidpoint = Math.round(roomDurationInFrames * 2 - transitionFrames * 1.5);
  const stills = [
    ["entry", 0],
    ["handoff-01", transitionOneMidpoint],
    ["peak", Math.floor((durationSec * fps) / 2)],
    ["handoff-02", transitionTwoMidpoint],
    ["exit", Math.floor(durationSec * fps) - 1],
  ];
  for (const [name, frame] of stills) {
    run("npx", [
      "remotion", "still", "src/index.ts", "PrismRooms", join(outputDir, `${name}.png`),
      "--props", propsPath, "--frame", String(frame), "--gl=swiftshader", "--ipv4",
    ], { cwd: REMOTION_DIR });
  }

  if (!skipVideo) {
    run("npx", [
      "remotion", "render", "src/index.ts", "PrismRooms", silentRender,
      "--props", propsPath, "--concurrency", "2", "--gl=swiftshader", "--ipv4",
    ], { cwd: REMOTION_DIR });
    runQuiet("ffmpeg", [
      "-y", "-i", silentRender, "-i", sampleAudio,
      "-map", "0:v:0", "-map", "1:a:0", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
      "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", finalVideo,
    ]);
    rmSync(silentRender, { force: true });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    title: `${set.title} — ${durationSec}s Visual Study`,
    format: "1080p / 30fps / H.264 + AAC",
    durationSec,
    audioSource: audioPath,
    audioStartSec: startSec,
    audioAnalysis: analysisPath,
    visualAssets: set.visualAssets.map((asset) => ({ ...asset, source: "Original ImageGen artwork, built-in generation tool" })),
    visualContract: "Three original image-generation plates in one museum-scale prism-installation world. Geometry is still; precomputed music analysis only modulates transmitted light, edge shimmer, and floor caustics.",
    motionContract: "Three long-form rooms joined by 3-second crossfades. No pan, bob, beat-driven scale, or object translation; music modulates only transmitted light, edge shimmer, and floor caustics.",
    stills: Object.fromEntries(stills.map(([name]) => [name, join(outputDir, `${name}.png`)])),
    output: skipVideo ? null : finalVideo,
  };
  writeFileSync(join(outputDir, "generation-manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`${set.title} complete: ${skipVideo ? "stills only" : finalVideo}`);
}

main();
