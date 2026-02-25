#!/usr/bin/env bun
/**
 * Render a Knowledge Short using Remotion.
 *
 * Usage:
 *   npx -y bun <this-file> \
 *     --title "AI 有多费电？⚡" \
 *     --video /path/to/kling-video.mp4 \
 *     --audio /path/to/narration.mp3 \
 *     --timings /path/to/timings.json \
 *     --output /path/to/output.mp4 \
 *     [--duration 15] \
 *     [--fps 30] \
 *     [--video2 /path/to/second-clip.mp4] \
 *     [--video-switch-at 10]
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname, basename } from "path";
import { parseArgs } from "util";

const { values: args } = parseArgs({
  options: {
    title: { type: "string" },
    video: { type: "string" },
    audio: { type: "string" },
    timings: { type: "string" },
    output: { type: "string", default: "knowledge-short.mp4" },
    duration: { type: "string", default: "15" },
    fps: { type: "string", default: "30" },
    video2: { type: "string" },
    "video-switch-at": { type: "string", default: "10" },
  },
  strict: false,
});

const REMOTION_DIR = resolve(dirname(new URL(import.meta.url).pathname), "../remotion");
const PUBLIC_DIR = resolve(REMOTION_DIR, "public");

// Validate required args
for (const key of ["title", "video", "audio", "timings"] as const) {
  if (!args[key]) {
    console.error(`❌ Missing --${key}`);
    process.exit(1);
  }
}

const title = args.title!;
const videoPath = resolve(args.video!);
const audioPath = resolve(args.audio!);
const timingsPath = resolve(args.timings!);
const outputPath = resolve(args.output!);
const durationSec = parseFloat(args.duration!);
const fps = parseInt(args.fps!);
const video2Path = args.video2 ? resolve(args.video2) : undefined;
const videoSwitchAt = parseFloat(args["video-switch-at"]!);

console.log(`🧠 Knowledge Short Renderer`);
console.log(`  📝 Title: ${title}`);
console.log(`  🎬 Video: ${basename(videoPath)}`);
console.log(`  🎙️ Audio: ${basename(audioPath)}`);
console.log(`  ⏱️  Duration: ${durationSec}s @ ${fps}fps`);
console.log(`  📐 Resolution: 1080x1920 (9:16)\n`);

// Copy assets to Remotion public dir
mkdirSync(PUBLIC_DIR, { recursive: true });

const videoName = "ks-video.mp4";
const audioName = "ks-narration.mp3";
const video2Name = "ks-video2.mp4";

copyFileSync(videoPath, resolve(PUBLIC_DIR, videoName));
copyFileSync(audioPath, resolve(PUBLIC_DIR, audioName));
if (video2Path && existsSync(video2Path)) {
  copyFileSync(video2Path, resolve(PUBLIC_DIR, video2Name));
}

// Read word timings
const wordTimings = JSON.parse(readFileSync(timingsPath, "utf-8"));

// Build input props
const inputProps = {
  title,
  videoFile: videoName,
  audioFile: audioName,
  wordTimings,
  fps,
  durationSec,
  ...(video2Path ? { videoFile2: video2Name, videoSwitchAt } : {}),
};

const propsFile = resolve(PUBLIC_DIR, "ks-props.json");
writeFileSync(propsFile, JSON.stringify(inputProps, null, 2));

console.log(`🎬 Rendering with Remotion...`);

// Install deps if needed
if (!existsSync(resolve(REMOTION_DIR, "node_modules"))) {
  console.log("📦 Installing Remotion dependencies...");
  execSync("npm install", { cwd: REMOTION_DIR, stdio: "inherit" });
}

// Render
const renderCmd = [
  "npx", "remotion", "render",
  "KnowledgeShort",
  outputPath,
  `--props=${propsFile}`,
  "--codec=h264",
  "--crf=18",
  `--concurrency=50%`,
].join(" ");

try {
  execSync(renderCmd, { cwd: REMOTION_DIR, stdio: "inherit" });
  const mb = (require("fs").statSync(outputPath).size / 1024 / 1024).toFixed(1);
  console.log(`\n✅ Output: ${outputPath} (${mb} MB)`);
} catch (e) {
  console.error("❌ Render failed");
  process.exit(1);
}
