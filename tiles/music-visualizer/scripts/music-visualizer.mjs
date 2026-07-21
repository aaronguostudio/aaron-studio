#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const REMOTION_DIR = join(ROOT, "tiles/aaron-video-gen/remotion");
const DEFAULT_PROMPT =
  "Instrumental only. Minimalist felt upright piano, intimate close-miked recording, sparse repeating motif, gentle rubato, soft pedal noise, warm room ambience, quietly satisfying and hypnotic, low dynamic range, spacious pauses, suitable for deep work and reading. No vocals, no drums, no abrupt climax, no trailer impacts, no bright arpeggios, no dramatic key change. Structure: 20-second opening, a gentle piano theme, a small harmonic variation, one quiet lift, then a slow unresolved outro.";
const RESOLUTION_PRESETS = {
  "1080p": { width: 1920, height: 1080, renderScale: 0.75 },
  "2k": { width: 2560, height: 1440, renderScale: 1.333333 },
  "4k": { width: 3840, height: 2160, renderScale: 2 },
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (inlineValue !== undefined) {
      args[key] = inlineValue;
    } else if (argv[i + 1] && !argv[i + 1].startsWith("--")) {
      args[key] = argv[i + 1];
      i += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function loadDotEnv(filePath) {
  if (!existsSync(filePath)) return;
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    const value = match[2].trim().replace(/^['"]|['"]$/g, "");
    process.env[match[1]] = value;
  }
}

function slugify(value) {
  return String(value || "music-visualizer")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "music-visualizer";
}

function absolutePath(filePath) {
  return resolve(ROOT, filePath);
}

function parseResolution(value) {
  const normalized = String(value || "1080p").trim().toLowerCase().replace("×", "x");
  if (RESOLUTION_PRESETS[normalized]) return { name: normalized, ...RESOLUTION_PRESETS[normalized] };
  const match = normalized.match(/^(\d+)x(\d+)$/);
  if (match) {
    const width = Number(match[1]);
    const height = Number(match[2]);
    if (width >= 640 && height >= 360) return { name: normalized, width, height, renderScale: width / 1920 };
  }
  throw new Error(`Unsupported resolution: ${value}. Use 1080p, 2k, 4k, or WIDTHxHEIGHT.`);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function probeDuration(filePath) {
  const result = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    filePath,
  ], { encoding: "utf8" });
  const duration = Number.parseFloat(String(result.stdout || "").trim());
  return Number.isFinite(duration) && duration > 0 ? duration : undefined;
}

async function generateMusic({ prompt, compositionPlan, durationSec, outputPath }) {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is required to generate music. Pass --audio for a local-audio render.");
  }
  if (compositionPlan && prompt) {
    throw new Error("Provide either a prompt or a compositionPlan, not both.");
  }
  if (!compositionPlan && !prompt) {
    throw new Error("An Eleven Music prompt or compositionPlan is required.");
  }

  const url = new URL("https://api.elevenlabs.io/v1/music");
  url.searchParams.set("output_format", "auto");
  const requestBody = compositionPlan
    ? {
      composition_plan: compositionPlan,
      model_id: "music_v2",
    }
    : {
      prompt,
      model_id: "music_v2",
      music_length_ms: Math.round(durationSec * 1000),
      force_instrumental: true,
    };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Eleven Music API failed (${response.status}): ${body.slice(0, 800)}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  writeFileSync(outputPath, bytes);
  return {
    songId: response.headers.get("song-id") || undefined,
    model: "music_v2",
    outputFormat: response.headers.get("content-type") || "auto",
  };
}

function runRender({ propsPath, outputPath, gl, scale }) {
  const args = [
    "remotion",
    "render",
    "src/index.ts",
    "MusicVisualizer",
    outputPath,
    "--props",
    propsPath,
    "--concurrency",
    "1",
    "--port",
    "3717",
    "--ipv4",
  ];
  if (gl) args.push(`--gl=${gl}`);
  if (scale !== undefined && scale !== 1) args.push(`--scale=${scale}`);

  const result = spawnSync("npx", args, { cwd: REMOTION_DIR, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`Remotion render failed with exit code ${result.status ?? "unknown"}`);
  }
}

function runAudioAnalysis({ audioPath, analysisPath }) {
  const analyzerPath = join(dirname(fileURLToPath(import.meta.url)), "analyze-audio.mjs");
  const result = spawnSync(process.execPath, [analyzerPath, audioPath, analysisPath], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`Audio analysis failed with exit code ${result.status ?? "unknown"}`);
  }
}

function printHelp() {
  console.log(`Music Visualizer pipeline

Usage:
  node tiles/music-visualizer/scripts/music-visualizer.mjs --config <config.json> [options]

Options:
  --audio <path>       Use an existing audio file instead of Eleven Music
  --duration <sec>     Audio/video duration; default comes from config
  --output <path>      Rendered MP4 path
  --resolution <preset> Final output size: 1080p, 2k, 4k, or WIDTHxHEIGHT
  --scale <0.5-2>      Override Remotion render scale; defaults from resolution
  --gl <mode>          Chromium renderer mode; defaults to swiftshader for stable renders
  --force-music        Regenerate music instead of using cached output
  --force-analysis     Recompute audio features for an audio-reactive render
  --no-render          Prepare artifacts without rendering
`);
}

function finalizeVideo({ inputPath, outputPath, audioPath, width, height }) {
  const filters = ["-vf", `scale=${width}:${height}:flags=lanczos`];
  const result = spawnSync("ffmpeg", [
    "-y",
    "-i", inputPath,
    "-i", audioPath,
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-shortest",
    ...filters,
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "18",
    "-c:a", "aac",
    "-b:a", "192k",
    "-movflags", "+faststart",
    outputPath,
  ], { encoding: "utf8", stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`Final video mux failed with exit code ${result.status ?? "unknown"}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  loadDotEnv(join(ROOT, ".env"));
  loadDotEnv(join(ROOT, ".baoyu-skills/.env"));

  const configPath = args.config ? absolutePath(args.config) : join(ROOT, "tiles/music-visualizer/references/example-config.json");
  const rawConfig = readJson(configPath);
  const slug = slugify(rawConfig.title);
  const outputDir = args.output
    ? dirname(absolutePath(args.output))
    : join(ROOT, "src/content/music-visualizer", slug);
  mkdirSync(outputDir, { recursive: true });

  const compositionPlan = rawConfig.compositionPlan;
  const planDurationSec = Array.isArray(compositionPlan?.chunks)
    ? compositionPlan.chunks.reduce((total, chunk) => total + Number(chunk.duration_ms || 0), 0) / 1000
    : undefined;
  const durationSec = Number(args.duration || rawConfig.durationSec || planDurationSec || 45);
  if (!Number.isFinite(durationSec) || durationSec < 3) {
    throw new Error("Duration must be at least 3 seconds.");
  }
  if (compositionPlan && (!Number.isFinite(planDurationSec) || planDurationSec < 3)) {
    throw new Error("compositionPlan.chunks must contain valid duration_ms values.");
  }
  if (compositionPlan && Math.abs(planDurationSec - durationSec) > 0.01) {
    throw new Error(`compositionPlan duration (${planDurationSec}s) must equal requested duration (${durationSec}s).`);
  }
  const resolution = parseResolution(args.resolution || rawConfig.resolution || "1080p");
  const renderScale = Number(args.scale ?? resolution.renderScale);
  if (!Number.isFinite(renderScale) || renderScale < 0.5 || renderScale > 2) {
    throw new Error("Scale must be between 0.5 and 2.");
  }
  const visualStyle = rawConfig.visualStyle || "ink-current";
  const audioReactiveStyles = new Set(["audio-mix", "lofi-wave", "coffee-room", "folded-light", "neon-strands", "neon-orb", "prism-chamber", "wave-grid", "signal-bloom", "clay-atlas", "pigment-tide", "paper-atlas", "spectrum-bars", "mirrored-spectrum", "waveform-line", "mirrored-waveform", "filled-spectrum", "spectrum-dots", "twin-spectrum", "radial-spectrum", "radial-waveform", "radial-dots", "spectrum-arc", "filled-radial-spectrum", "triangle-spectrum", "x-spectrum", "side-burst-ring"]);
  const gl = args.gl || (visualStyle === "neon-strands" || visualStyle === "neon-orb" || visualStyle === "prism-chamber" || visualStyle === "wave-grid" || visualStyle === "signal-bloom" || visualStyle === "clay-atlas" || visualStyle === "pigment-tide" ? "angle" : "swiftshader");

  const configuredAudio = args.audio ? absolutePath(args.audio) : join(outputDir, "music.mp3");
  let audioPath = configuredAudio;
  let musicMeta = { source: "local-audio" };

  if (!args.audio && (args.forceMusic || !existsSync(audioPath))) {
    console.log(`Generating ${durationSec}s instrumental track with Eleven Music...`);
    musicMeta = await generateMusic({
      prompt: compositionPlan ? undefined : rawConfig.prompt || DEFAULT_PROMPT,
      compositionPlan,
      durationSec,
      outputPath: audioPath,
    });
    musicMeta.source = "eleven-music-api";
  }

  if (!existsSync(audioPath)) {
    throw new Error(`Audio file not found: ${audioPath}`);
  }

  const actualDuration = probeDuration(audioPath) || durationSec;
  const analysisPath = join(outputDir, "audio-analysis.json");
  let audioAnalysis;
  if (audioReactiveStyles.has(visualStyle)) {
    if (args.forceAnalysis || !existsSync(analysisPath)) {
      console.log(`Analyzing audio for audio-reactive motion → ${analysisPath}`);
      runAudioAnalysis({ audioPath, analysisPath });
    }
    audioAnalysis = readJson(analysisPath);
  }
  const config = {
    ...rawConfig,
    durationSec: actualDuration,
    audioFile: basename(audioPath),
    visualStyle,
  };
  const renderProps = audioAnalysis ? { ...config, audioAnalysis } : config;
  const propsPath = join(REMOTION_DIR, ".tmp-music-visualizer-props.json");
  const outputPath = args.output ? absolutePath(args.output) : join(outputDir, `${slug}.mp4`);
  const renderPath = `${outputPath}.render.mp4`;
  const manifestPath = join(outputDir, "generation-manifest.json");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(join(outputDir, "config.json"), JSON.stringify(config, null, 2));
  writeFileSync(propsPath, JSON.stringify(renderProps, null, 2));

  const manifest = {
    generatedAt: new Date().toISOString(),
    title: config.title,
    theme: config.theme || "paper-moon",
    visualStyle,
    prompt: compositionPlan ? null : rawConfig.prompt || DEFAULT_PROMPT,
    compositionPlan: compositionPlan || null,
    requestedDurationSec: durationSec,
    actualAudioDurationSec: actualDuration,
    model: musicMeta.model || null,
    songId: musicMeta.songId || null,
    source: musicMeta.source,
    audioPath,
    outputPath,
    resolution: resolution.name,
    width: resolution.width,
    height: resolution.height,
    renderScale,
    gl,
    audioAnalysisPath: audioReactiveStyles.has(visualStyle) ? analysisPath : null,
    audioAnalysisVersion: audioAnalysis?.analysisVersion || null,
    commercialUseNote: "Verify the active ElevenLabs paid-plan music terms before commercial publication.",
  };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  try {
    if (!args.noRender) {
      console.log(`Rendering MusicVisualizer → ${outputPath}`);
      runRender({ propsPath, outputPath: renderPath, gl, scale: renderScale });
      console.log(`Finalizing ${renderScale}x render with music → 1920×1080`);
      finalizeVideo({ inputPath: renderPath, outputPath, audioPath, width: resolution.width, height: resolution.height });
      if (existsSync(renderPath)) unlinkSync(renderPath);
    }
  } finally {
    if (existsSync(propsPath)) unlinkSync(propsPath);
    if (existsSync(renderPath)) unlinkSync(renderPath);
  }

  console.log(`Artifacts: ${outputDir}`);
  if (!args.noRender) console.log(`Video: ${outputPath}`);
}

main().catch((error) => {
  console.error(`\nMusic Visualizer failed: ${error.message}`);
  process.exitCode = 1;
});
