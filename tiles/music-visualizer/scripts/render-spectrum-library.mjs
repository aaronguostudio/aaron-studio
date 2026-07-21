#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const PIPELINE = join(ROOT, "tiles/music-visualizer/scripts/music-visualizer.mjs");
const DEFAULT_AUDIO = join(ROOT, "src/content/music-visualizer/orb-rhythm-lab/prism-pulse/music.mp3");
const DEFAULT_OUTPUT = join(ROOT, "src/content/music-visualizer/spectrum-demos-v1");

const STYLES = [
  { order: 1, id: "spectrum-bars", slug: "linear", title: "Linear Bars" },
  { order: 2, id: "mirrored-spectrum", slug: "mirrored", title: "Mirrored Bars" },
  { order: 3, id: "waveform-line", slug: "waveform-line", title: "Waveform Line" },
  { order: 4, id: "mirrored-waveform", slug: "mirrored-waveform", title: "Mirrored Waveform" },
  { order: 5, id: "filled-spectrum", slug: "filled-spectrum", title: "Filled Spectrum" },
  { order: 6, id: "spectrum-dots", slug: "spectrum-dots", title: "Dot Matrix" },
  { order: 7, id: "twin-spectrum", slug: "twin-spectrum", title: "Twin Track" },
  { order: 8, id: "radial-spectrum", slug: "radial", title: "Radial Bars" },
  { order: 9, id: "radial-waveform", slug: "radial-waveform", title: "Radial Waveform" },
  { order: 10, id: "radial-dots", slug: "radial-dots", title: "Radial Dots" },
  { order: 11, id: "spectrum-arc", slug: "spectrum-arc", title: "Half Arc" },
  { order: 12, id: "filled-radial-spectrum", slug: "filled-radial-spectrum", title: "Filled Radial" },
  { order: 13, id: "triangle-spectrum", slug: "triangle-spectrum", title: "Triangle Trace" },
  { order: 14, id: "x-spectrum", slug: "x-spectrum", title: "X Trace" },
  { order: 15, id: "side-burst-ring", slug: "side-burst-ring", title: "Side Burst Ring" },
];

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

const probeDuration = (audioPath) => {
  const result = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    audioPath,
  ], { encoding: "utf8" });
  const duration = Number.parseFloat(String(result.stdout || "").trim());
  if (!Number.isFinite(duration) || duration < 3) throw new Error(`Could not determine audio duration: ${audioPath}`);
  return duration;
};

const args = parseArgs(process.argv.slice(2));
const audioPath = resolve(args.audio || DEFAULT_AUDIO);
const outputRoot = resolve(args.outputDir || DEFAULT_OUTPUT);
const renderScale = String(args.scale || "1");
const only = args.only ? new Set(String(args.only).split(",").map((value) => value.trim())) : null;
const selected = only ? STYLES.filter((style) => only.has(style.id) || only.has(style.slug)) : STYLES;

if (!existsSync(audioPath)) throw new Error(`Audio file not found: ${audioPath}`);
if (!selected.length) throw new Error("No spectrum styles matched --only.");

mkdirSync(outputRoot, { recursive: true });
const durationSec = probeDuration(audioPath);
const sharedAnalysisPath = join(outputRoot, "linear", "audio-analysis.json");
const results = [];

for (const style of selected) {
  const outputDir = join(outputRoot, style.slug);
  const localAudioPath = join(outputDir, "music.mp3");
  const configPath = join(outputDir, "render-config.json");
  const outputPath = join(outputDir, `${style.slug}.mp4`);
  const analysisPath = join(outputDir, "audio-analysis.json");
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(audioPath, localAudioPath);

  const config = {
    title: `Frequency Field / ${style.title}`,
    artist: "Visual And Sound",
    trackLabel: `spectrum library / ${String(style.order).padStart(2, "0")}`,
    durationSec,
    seed: 731,
    theme: "deep-ink",
    visualStyle: style.id,
    volume: 0.92,
    resolution: "1080p",
  };
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  if (style.slug !== "linear" && existsSync(sharedAnalysisPath) && !args.forceAnalysis) {
    copyFileSync(sharedAnalysisPath, analysisPath);
  }

  if (!args.noRender && (args.force || !existsSync(outputPath))) {
    const command = [
      PIPELINE,
      "--config", configPath,
      "--audio", localAudioPath,
      "--output", outputPath,
      "--scale", renderScale,
    ];
    if (args.forceAnalysis) command.push("--force-analysis");
    const result = spawnSync(process.execPath, command, { cwd: ROOT, stdio: "inherit" });
    if (result.status !== 0) throw new Error(`Render failed for ${style.id}`);
  }

  results.push({
    ...style,
    configPath,
    audioPath: localAudioPath,
    analysisPath,
    videoPath: outputPath,
    rendered: existsSync(outputPath),
  });
}

const existingManifestPath = join(outputRoot, "library-manifest.json");
const previous = existsSync(existingManifestPath)
  ? JSON.parse(readFileSync(existingManifestPath, "utf8"))
  : { styles: [] };
const byId = new Map((previous.styles || []).map((style) => [style.id, style]));
for (const result of results) byId.set(result.id, result);

writeFileSync(existingManifestPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  sourceReference: "https://www.youtube.com/shorts/-PxCBtKoJmA",
  sourceAudio: audioPath,
  durationSec,
  renderScale: Number(renderScale),
  styles: STYLES.map((style) => byId.get(style.id) || style),
}, null, 2)}\n`);

console.log(`Spectrum library: ${results.length} style(s) prepared in ${outputRoot}`);
