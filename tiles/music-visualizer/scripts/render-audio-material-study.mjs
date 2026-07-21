#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const value = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1] ?? fallback;
};

const variant = value("--variant", "ferrofield");
const title = value("--title", variant === "glass-orbit" ? "Glass Orbit" : "Ferrofield");
const artist = value("--artist", "Visual And Sound");
const trackLabel = value("--label", "audio material study");
const audioFile = value("--audio", "");
const outputDir = value("--output", "");
const startSec = Number(value("--start", "0"));
const durationSec = Number(value("--duration", "45"));
const seed = Number(value("--seed", variant === "glass-orbit" ? "641" : "317"));

if (!["ferrofield", "glass-orbit"].includes(variant)) {
  throw new Error("--variant must be ferrofield or glass-orbit");
}
if (!audioFile || !outputDir || !Number.isFinite(startSec) || !Number.isFinite(durationSec)) {
  throw new Error("Usage: node render-audio-material-study.mjs --variant <ferrofield|glass-orbit> --audio <source.m4a> --start <seconds> --duration <seconds> --output <directory>");
}

const run = (command, commandArgs, options = {}) => {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd,
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(`${command} failed\n${result.stderr || result.stdout}`);
  }
  if (result.stdout?.trim()) process.stdout.write(result.stdout);
};

const repoRoot = resolve(new URL("../../..", import.meta.url).pathname);
const remotionRoot = resolve(repoRoot, "tiles/aaron-video-gen/remotion");
const analyzer = resolve(repoRoot, "tiles/music-visualizer/scripts/analyze-audio.mjs");
const resolvedAudio = resolve(audioFile);
const resolvedOutput = resolve(outputDir);

if (!existsSync(resolvedAudio)) throw new Error(`Audio source does not exist: ${resolvedAudio}`);
mkdirSync(resolvedOutput, { recursive: true });

const audioWindow = resolve(resolvedOutput, "audio-window.m4a");
const analysisPath = resolve(resolvedOutput, "audio-analysis.json");
const propsPath = resolve(resolvedOutput, "render-props.json");
const silentVideo = resolve(resolvedOutput, `${variant}-${durationSec}s-1080p.silent.mp4`);
const outputVideo = resolve(resolvedOutput, `${variant}-${durationSec}s-1080p.mp4`);
const manifestPath = resolve(resolvedOutput, "generation-manifest.json");

run("ffmpeg", [
  "-y", "-ss", String(startSec), "-t", String(durationSec), "-i", resolvedAudio,
  "-vn", "-c:a", "aac", "-b:a", "256k", audioWindow,
]);
run("node", [analyzer, audioWindow, analysisPath]);

const analysis = JSON.parse(readFileSync(analysisPath, "utf8"));
const props = { variant, title, artist, trackLabel, durationSec, seed, audioAnalysis: analysis };
writeFileSync(propsPath, JSON.stringify(props, null, 2));

run("npx", [
  "remotion", "render", "src/index.ts", "AudioMaterialStudies", silentVideo,
  `--props=${propsPath}`, "--codec=h264", "--crf=18", "--concurrency=2",
], { cwd: remotionRoot });

run("ffmpeg", [
  "-y", "-i", silentVideo, "-i", audioWindow,
  "-map", "0:v:0", "-map", "1:a:0",
  "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", outputVideo,
]);
rmSync(silentVideo, { force: true });

writeFileSync(manifestPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  title,
  variant,
  format: "1080p / 30fps / H.264 + AAC",
  durationSec,
  audioSource: resolvedAudio,
  audioStartSec: startSec,
  audioWindow,
  audioAnalysis: analysisPath,
  renderProps: propsPath,
  mapping: variant === "ferrofield"
    ? "low-band controls viscosity and field depth; high-band controls rim light; transient controls one contained aperture bloom"
    : "low-band controls volume depth; high-band controls glass rim light; transient controls one contained aperture bloom",
  motionContract: "Precomputed frame-indexed audio analysis only. No beat-driven position, scale, camera movement, or shake.",
  output: outputVideo,
}, null, 2));

console.log(`Rendered ${outputVideo}`);
