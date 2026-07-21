#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const libraryRoot = resolve(process.argv[2] || join(ROOT, "src/content/music-visualizer/spectrum-demos-v1"));
const catalog = JSON.parse(readFileSync(join(libraryRoot, "catalog.json"), "utf8"));
const durationSec = 42;
const segmentDuration = durationSec / catalog.styles.length;
const outputPath = join(libraryRoot, "spectrum-library-showcase.mp4");
const inputArgs = [];
const filterParts = [];
const concatInputs = [];

catalog.styles.forEach((style, index) => {
  const videoPath = join(libraryRoot, style.slug, `${style.slug}.mp4`);
  if (!existsSync(videoPath)) throw new Error(`Missing spectrum library video: ${videoPath}`);
  inputArgs.push("-i", videoPath);
  const start = Number((index * segmentDuration).toFixed(3));
  const end = Number(((index + 1) * segmentDuration).toFixed(3));
  filterParts.push(`[${index}:v]trim=start=${start}:end=${end},setpts=PTS-STARTPTS[v${index}]`);
  filterParts.push(`[${index}:a]atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS[a${index}]`);
  concatInputs.push(`[v${index}][a${index}]`);
});
filterParts.push(`${concatInputs.join("")}concat=n=${catalog.styles.length}:v=1:a=1[outv][outa]`);

const result = spawnSync("ffmpeg", [
  "-y",
  "-hide_banner",
  ...inputArgs,
  "-filter_complex", filterParts.join(";"),
  "-map", "[outv]",
  "-map", "[outa]",
  "-c:v", "libx264",
  "-preset", "medium",
  "-crf", "18",
  "-pix_fmt", "yuv420p",
  "-r", "30",
  "-c:a", "aac",
  "-b:a", "192k",
  "-movflags", "+faststart",
  outputPath,
], { cwd: ROOT, stdio: "inherit" });

if (result.status !== 0) throw new Error(`Showcase render failed with exit code ${result.status ?? "unknown"}`);
console.log(`Spectrum showcase: ${outputPath}`);
