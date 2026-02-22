#!/usr/bin/env bun
/**
 * Post-production: TTS narration generation and final video assembly.
 *
 * Subcommands:
 *   tts      — Generate TTS narration for each scene
 *   assemble — Concat video clips + narration + music into final.mp4
 *
 * Usage:
 *   npx -y bun post-production.ts tts \
 *     --script video-script.md --tts edge-tts --voice en-US-AndrewMultilingualNeural \
 *     --output-dir narration/
 *
 *   npx -y bun post-production.ts assemble \
 *     --scenes-dir scenes/ --narration-dir narration/ \
 *     --script video-script.md --output final.mp4 \
 *     [--music bg.mp3] [--music-volume 0.08] [--resolution 1920x1080] [--fps 30]
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, mkdirSync, writeFileSync, readdirSync, statSync } from "fs";
import { resolve, join, basename, dirname } from "path";
import { loadAllEnvFiles, loadPreferences } from "./shared/env";
import { parseVideoScript } from "./parse-video-script";

loadAllEnvFiles();

// ---------------------------------------------------------------------------
// TTS (reused from aaron-video-gen/scripts/tts.ts)
// ---------------------------------------------------------------------------

type TTSProvider = "edge-tts" | "openai";

async function generateTTS(
  text: string,
  index: number,
  outputDir: string,
  provider: TTSProvider,
  voice: string
): Promise<{ audioPath: string; duration: number }> {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = join(outputDir, `narration-${String(index).padStart(2, "0")}.mp3`);

  if (provider === "edge-tts") {
    try {
      execSync("which edge-tts", { stdio: "pipe" });
    } catch {
      throw new Error("edge-tts not found. Install it with: pip install edge-tts");
    }
    const tempTextPath = outputPath + ".txt";
    writeFileSync(tempTextPath, text, "utf-8");
    try {
      execSync(
        `edge-tts --voice "${voice}" --file "${tempTextPath}" --write-media "${outputPath}"`,
        { stdio: "pipe", timeout: 120_000 }
      );
    } finally {
      try { const { unlinkSync } = require("fs"); unlinkSync(tempTextPath); } catch {}
    }
  } else if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not set.");
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "tts-1-hd", input: text, voice, response_format: "mp3" }),
    });
    if (!response.ok) throw new Error(`OpenAI TTS error (${response.status}): ${await response.text()}`);
    writeFileSync(outputPath, Buffer.from(await response.arrayBuffer()));
  }

  const duration = getAudioDuration(outputPath);
  return { audioPath: outputPath, duration };
}

function getAudioDuration(audioPath: string): number {
  try {
    const result = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${audioPath}"`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    );
    return parseFloat(result.trim());
  } catch {
    throw new Error(`Failed to get audio duration for ${audioPath}. Is ffprobe/ffmpeg installed?`);
  }
}

function getVideoDuration(videoPath: string): number {
  try {
    const result = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${videoPath}"`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    );
    return parseFloat(result.trim());
  } catch {
    throw new Error(`Failed to get video duration for ${videoPath}. Is ffprobe/ffmpeg installed?`);
  }
}

// ---------------------------------------------------------------------------
// TTS subcommand
// ---------------------------------------------------------------------------

async function runTTS(args: Record<string, string>) {
  const scriptPath = resolve(args.script);
  const outputDir = resolve(args.outputDir || "narration");
  const prefs = loadPreferences();
  const provider = (args.tts || prefs.tts_provider || "edge-tts") as TTSProvider;
  const voice = args.voice || prefs.voice ||
    (provider === "openai" ? "alloy" : "en-US-AndrewMultilingualNeural");

  const content = readFileSync(scriptPath, "utf-8");
  const script = parseVideoScript(content);

  console.log(`\n[tts] Generating narration for ${script.scenes.length} scenes`);
  console.log(`[tts] Provider: ${provider}, Voice: ${voice}\n`);

  const results: { audioPath: string; duration: number }[] = [];

  for (const scene of script.scenes) {
    if (!scene.narration.trim()) {
      console.log(`  Scene ${scene.index + 1}: (no narration, creating 3s silence)`);
      const silentPath = join(outputDir, `narration-${String(scene.index).padStart(2, "0")}.mp3`);
      if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
      execSync(`ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t 3 -q:a 9 "${silentPath}"`, { stdio: "pipe" });
      results.push({ audioPath: silentPath, duration: 3 });
      continue;
    }

    console.log(`  Scene ${scene.index + 1}: "${scene.title}" (${scene.narration.length} chars)`);
    const result = await generateTTS(scene.narration, scene.index, outputDir, provider, voice);
    console.log(`    -> ${result.duration.toFixed(1)}s`);
    results.push(result);
  }

  // Concatenate all narration
  const fullPath = join(outputDir, "narration-full.mp3");
  const listPath = fullPath + ".list.txt";
  writeFileSync(listPath, results.map((r) => `file '${r.audioPath}'`).join("\n"), "utf-8");
  try {
    execSync(`ffmpeg -y -f concat -safe 0 -i "${listPath}" -c copy "${fullPath}"`, { stdio: "pipe", timeout: 120_000 });
  } finally {
    try { require("fs").unlinkSync(listPath); } catch {}
  }

  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  console.log(`\n[tts] Total narration: ${totalDuration.toFixed(1)}s`);
  console.log(`[tts] Full narration: ${fullPath}`);

  // Write duration manifest for assemble step
  const manifest = results.map((r, i) => ({
    scene: i,
    audioPath: r.audioPath,
    duration: r.duration,
  }));
  writeFileSync(join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2));
}

// ---------------------------------------------------------------------------
// Assemble subcommand
// ---------------------------------------------------------------------------

async function runAssemble(args: Record<string, string>) {
  const scenesDir = resolve(args.scenesDir || "scenes");
  const narrationDir = resolve(args.narrationDir || "narration");
  const scriptPath = args.script ? resolve(args.script) : undefined;
  const outputPath = resolve(args.output || "final.mp4");
  const prefs = loadPreferences();

  const resolution = args.resolution || prefs.resolution || "1920x1080";
  const [width, height] = resolution.split("x").map(Number);
  const fps = Number(args.fps || prefs.fps || 30);
  const musicPath = args.music ? resolve(args.music) : undefined;
  const musicVolume = Number(args.musicVolume || prefs.music_volume || 0.08);
  const transitionDuration = Number(args.transitionDuration || prefs.transition_duration || 1);

  // Find scene video files (sorted by name)
  const sceneFiles = readdirSync(scenesDir)
    .filter((f) => /\.mp4$/i.test(f))
    .sort()
    .map((f) => join(scenesDir, f));

  if (sceneFiles.length === 0) {
    throw new Error(`No .mp4 files found in ${scenesDir}`);
  }

  // Find narration audio
  const narrationFull = join(narrationDir, "narration-full.mp3");
  if (!existsSync(narrationFull)) {
    throw new Error(`Narration not found: ${narrationFull}. Run the tts subcommand first.`);
  }

  console.log(`\n[assemble] ${sceneFiles.length} scene clips`);
  console.log(`[assemble] Resolution: ${resolution}, FPS: ${fps}`);
  console.log(`[assemble] Transition: crossfade ${transitionDuration}s`);
  if (musicPath) console.log(`[assemble] Music: ${musicPath} (volume: ${musicVolume})`);

  // Build FFmpeg command using concat demuxer for video clips
  // First, scale all clips to target resolution and concat them
  const cmd: string[] = ["ffmpeg", "-y"];

  // Add scene video inputs
  for (const scene of sceneFiles) {
    cmd.push("-i", scene);
  }

  // Add narration audio
  cmd.push("-i", narrationFull);
  const narrationIdx = sceneFiles.length;

  // Add music if provided
  let musicIdx: number | undefined;
  if (musicPath) {
    cmd.push("-stream_loop", "-1", "-i", musicPath);
    musicIdx = sceneFiles.length + 1;
  }

  // Build filter_complex
  const filters: string[] = [];

  // Scale each video clip to target resolution
  for (let i = 0; i < sceneFiles.length; i++) {
    filters.push(
      `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
      `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black,` +
      `setsar=1,fps=${fps},format=yuv420p[v${i}]`
    );
  }

  // Chain xfade transitions between clips
  if (sceneFiles.length === 1) {
    filters.push(`[v0]null[vout]`);
  } else {
    let prevLabel = "[v0]";
    // Get duration of first clip
    let cumulativeOffset = getVideoDuration(sceneFiles[0]) - transitionDuration;

    for (let i = 1; i < sceneFiles.length; i++) {
      const isLast = i === sceneFiles.length - 1;
      const outLabel = isLast ? "[vout]" : `[vt${i}]`;

      filters.push(
        `${prevLabel}[v${i}]xfade=transition=fade:` +
        `duration=${transitionDuration}:` +
        `offset=${Math.max(0, cumulativeOffset)}${outLabel}`
      );

      prevLabel = outLabel;
      cumulativeOffset += getVideoDuration(sceneFiles[i]) - transitionDuration;
    }
  }

  // Audio mixing
  if (musicIdx !== undefined) {
    filters.push(
      `[${musicIdx}:a]volume=${musicVolume}[bgm]`,
      `[${narrationIdx}:a][bgm]amix=inputs=2:duration=first:dropout_transition=3[aout]`
    );
  } else {
    filters.push(`[${narrationIdx}:a]anull[aout]`);
  }

  cmd.push("-filter_complex", filters.join(";"));
  cmd.push("-map", "[vout]", "-map", "[aout]");

  // Encoding settings (YouTube-optimized)
  cmd.push(
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "20", // slightly higher quality than aaron-video-gen's 23
    "-c:a", "aac",
    "-b:a", "192k",
    "-pix_fmt", "yuv420p",
    "-shortest",
    outputPath
  );

  // Execute
  try {
    execSync("which ffmpeg", { stdio: "pipe" });
  } catch {
    throw new Error("ffmpeg not found. Install with: brew install ffmpeg");
  }

  const cmdString = cmd
    .map((arg) => (arg.includes(" ") || arg.includes(";") ? `'${arg}'` : arg))
    .join(" ");

  console.log("\n[assemble] Rendering final video...");
  execSync(cmdString, { stdio: "inherit", timeout: 600_000 });

  const fileSizeMB = (statSync(outputPath).size / 1024 / 1024).toFixed(1);
  const totalDuration = getVideoDuration(outputPath);

  console.log(`\n[assemble] Video saved: ${outputPath}`);
  console.log(`[assemble] Duration: ${totalDuration.toFixed(1)}s (${(totalDuration / 60).toFixed(1)} min)`);
  console.log(`[assemble] Size: ${fileSizeMB} MB`);
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

function parseSubcommandArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      args[key] = argv[++i] || "";
    }
  }
  return args;
}

async function main() {
  const subcommand = process.argv[2];
  const args = parseSubcommandArgs(process.argv.slice(3));

  if (subcommand === "tts") {
    if (!args.script) {
      console.error("Usage: post-production.ts tts --script <video-script.md> [--tts edge-tts] [--voice ...] [--output-dir narration/]");
      process.exit(1);
    }
    await runTTS(args);
  } else if (subcommand === "assemble") {
    await runAssemble(args);
  } else {
    console.error("Usage: post-production.ts <tts|assemble> [options]");
    console.error("  tts      — Generate TTS narration for each scene");
    console.error("  assemble — Concat video clips + narration + music into final.mp4");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
});
