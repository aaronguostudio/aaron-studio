#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../../..");

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    args[key] = inlineValue ?? argv[index + 1];
    if (inlineValue === undefined) index += 1;
  }
  return args;
}

function absolutePath(filePath) {
  return isAbsolute(filePath) ? filePath : resolve(ROOT, filePath);
}

function numberArg(value, name) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`${name} must be a positive number.`);
  return parsed;
}

function durationSec(filePath) {
  const result = spawnSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration", "-of", "json", filePath,
  ], {encoding: "utf8"});
  if (result.status !== 0) throw new Error(`ffprobe failed for ${filePath}: ${result.stderr.trim()}`);
  const duration = Number(JSON.parse(result.stdout).format?.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(`Could not determine duration for ${filePath}.`);
  return duration;
}

function printHelp() {
  console.log(`Usage:
  node tiles/music-visualizer/scripts/stitch-lyria.mjs \\
    --inputs part-01.mp3,part-02.mp3,part-03.mp3 \\
    --duration 600 \\
    --output master.m4a \\
    [--crossfade 6] [--fade-out 8] [--title "Track title"]`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.inputs || !args.duration || !args.output) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  const inputPaths = args.inputs.split(",").map((entry) => absolutePath(entry.trim())).filter(Boolean);
  if (inputPaths.length < 2) throw new Error("At least two --inputs are required.");
  for (const inputPath of inputPaths) {
    if (!existsSync(inputPath)) throw new Error(`Input not found: ${inputPath}`);
  }

  const targetDuration = numberArg(args.duration, "duration");
  const crossfade = numberArg(args.crossfade ?? 6, "crossfade");
  const fadeOut = numberArg(args.fadeOut ?? Math.min(8, targetDuration / 4), "fade-out");
  if (fadeOut >= targetDuration) throw new Error("fade-out must be shorter than duration.");

  const sections = inputPaths.map((file) => ({file, durationSec: durationSec(file)}));
  const availableDuration = sections.reduce((sum, section) => sum + section.durationSec, 0) - crossfade * (sections.length - 1);
  if (availableDuration < targetDuration) {
    throw new Error(`Sections provide ${availableDuration.toFixed(3)}s after crossfades, below the ${targetDuration.toFixed(3)}s target.`);
  }

  const filters = [];
  let previous = "[0:a]";
  for (let index = 1; index < inputPaths.length; index += 1) {
    const label = index === inputPaths.length - 1 ? "[joined]" : `[xf${index}]`;
    filters.push(`${previous}[${index}:a]acrossfade=d=${crossfade}:c1=qsin:c2=qsin${label}`);
    previous = label;
  }
  const fadeStart = targetDuration - fadeOut;
  filters.push(`${previous}atrim=duration=${targetDuration},asetpts=N/SR/TB,afade=t=out:st=${fadeStart}:d=${fadeOut}[aout]`);

  const outputPath = absolutePath(args.output);
  mkdirSync(dirname(outputPath), {recursive: true});
  const command = ["ffmpeg", "-y", "-hide_banner"];
  for (const inputPath of inputPaths) command.push("-i", inputPath);
  command.push("-filter_complex", filters.join(";"), "-map", "[aout]", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart");
  if (args.title) command.push("-metadata", `title=${args.title}`);
  command.push(outputPath);

  const result = spawnSync(command[0], command.slice(1), {stdio: "inherit"});
  if (result.status !== 0) throw new Error(`ffmpeg failed with exit code ${result.status ?? "unknown"}`);

  const manifestPath = args.manifest
    ? absolutePath(args.manifest)
    : outputPath.replace(/\.[^.]+$/, ".stitch-manifest.json");
  writeFileSync(manifestPath, `${JSON.stringify({
    provider: "Google Gemini API",
    method: "independent Lyria sections with equal-power crossfades",
    inputs: sections,
    crossfade: {durationSec: crossfade, curve: "qsin"},
    master: {file: outputPath, durationSec: targetDuration, finalFade: {startSec: fadeStart, durationSec: fadeOut}},
  }, null, 2)}\n`);
  console.log(`Stitched ${targetDuration.toFixed(3)}s master → ${outputPath}`);
}

main();
