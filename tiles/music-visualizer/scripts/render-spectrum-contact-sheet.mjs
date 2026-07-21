#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const REMOTION_DIR = join(ROOT, "tiles/aaron-video-gen/remotion");
const DEFAULT_LIBRARY = join(ROOT, "src/content/music-visualizer/spectrum-demos-v1");

const parseArgs = (argv) => {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (argv[index + 1] && !argv[index + 1].startsWith("--")) {
      args[key] = argv[index + 1];
      index += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
};

const run = (command, commandArgs, options = {}) => {
  const result = spawnSync(command, commandArgs, { stdio: "inherit", ...options });
  if (result.status !== 0) throw new Error(`${command} failed with exit code ${result.status ?? "unknown"}`);
};

const args = parseArgs(process.argv.slice(2));
const libraryRoot = resolve(args.library || DEFAULT_LIBRARY);
const catalog = JSON.parse(readFileSync(join(libraryRoot, "catalog.json"), "utf8"));
const frame = Number(args.frame || 630);
const tempRoot = join("/tmp", "aaron-spectrum-library-stills");
rmSync(tempRoot, { recursive: true, force: true });
mkdirSync(tempRoot, { recursive: true });

for (const style of catalog.styles) {
  const outputDir = join(libraryRoot, style.slug);
  const previewPath = join(outputDir, "preview.png");
  const propsPath = join(tempRoot, `${String(style.order).padStart(2, "0")}-props.json`);
  const numberedPreview = join(tempRoot, `${String(style.order).padStart(2, "0")}.png`);

  if (!args.force && existsSync(previewPath)) {
    copyFileSync(previewPath, numberedPreview);
    continue;
  }

  const config = JSON.parse(readFileSync(join(outputDir, "render-config.json"), "utf8"));
  const audioAnalysis = JSON.parse(readFileSync(join(outputDir, "audio-analysis.json"), "utf8"));
  writeFileSync(propsPath, JSON.stringify({ ...config, audioFile: "music.mp3", audioAnalysis }));

  run("npx", [
    "remotion",
    "still",
    "src/index.ts",
    "MusicVisualizer",
    previewPath,
    "--props", propsPath,
    "--frame", String(frame),
    "--scale", "0.5",
    "--port", "3718",
    "--ipv4",
  ], { cwd: REMOTION_DIR });
  copyFileSync(previewPath, numberedPreview);
}

run("ffmpeg", [
  "-y",
  "-hide_banner",
  "-loglevel", "error",
  "-framerate", "1",
  "-start_number", "1",
  "-i", join(tempRoot, "%02d.png"),
  "-vf", "scale=384:216,tile=5x3:padding=10:margin=10:color=0x0d0f12",
  "-frames:v", "1",
  join(libraryRoot, "catalog-contact-sheet.jpg"),
]);

console.log(`Spectrum contact sheet: ${join(libraryRoot, "catalog-contact-sheet.jpg")}`);
