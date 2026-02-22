#!/usr/bin/env bun
/**
 * aaron-video-gen: Generate YouTube videos from script + slide images.
 *
 * Usage:
 *   npx -y bun scripts/main.ts --script <path> [options]
 */

import { existsSync, readFileSync, mkdirSync } from "fs";
import { resolve, dirname, join, basename } from "path";
import {
  parseYoutubeScript,
  resolveImagePaths,
  type SlideSection,
} from "./parse-script";
import { generateTTS, concatenateAudio, type TTSProvider } from "./tts";
import {
  buildFFmpegCommand,
  executeFFmpeg,
  formatCommand,
  type SlideInput,
} from "./ffmpeg";
import { generateCaptions } from "./captions";

// ---------------------------------------------------------------------------
// Environment loading (matching baoyu-skills pattern)
// ---------------------------------------------------------------------------

function loadEnvFile(filePath: string): void {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// Load env files (lower priority first, higher priority overwrites)
const homeDir = process.env.HOME || process.env.USERPROFILE || "";
loadEnvFile(join(homeDir, ".baoyu-skills", ".env"));
loadEnvFile(join(homeDir, ".aaron-skills", ".env"));
loadEnvFile(join(process.cwd(), ".baoyu-skills", ".env"));
loadEnvFile(join(process.cwd(), ".aaron-skills", ".env"));
loadEnvFile(join(process.cwd(), ".env"));

// ---------------------------------------------------------------------------
// Preferences loading (EXTEND.md)
// ---------------------------------------------------------------------------

interface Preferences {
  tts_provider?: string;
  voice?: string;
  resolution?: string;
  transition?: string;
  transition_duration?: number;
  music_volume?: number;
  padding?: number;
  fps?: number;
}

function loadPreferences(): Preferences {
  const paths = [
    join(homeDir, ".aaron-skills", "aaron-video-gen", "EXTEND.md"),
    join(process.cwd(), ".aaron-skills", "aaron-video-gen", "EXTEND.md"),
  ];

  let prefs: Preferences = {};
  for (const p of paths) {
    if (!existsSync(p)) continue;
    const content = readFileSync(p, "utf-8");
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      // Simple YAML parsing for flat key-value
      for (const line of match[1].split("\n")) {
        const [key, ...rest] = line.split(":");
        if (key && rest.length) {
          const val = rest.join(":").trim();
          (prefs as any)[key.trim()] = isNaN(Number(val)) ? val : Number(val);
        }
      }
    }
  }
  return prefs;
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--script" || arg === "-s") {
      args.script = argv[++i];
    } else if (arg === "--output" || arg === "-o") {
      args.output = argv[++i];
    } else if (arg === "--images-dir") {
      args.imagesDir = argv[++i];
    } else if (arg === "--tts") {
      args.tts = argv[++i];
    } else if (arg === "--voice") {
      args.voice = argv[++i];
    } else if (arg === "--resolution") {
      args.resolution = argv[++i];
    } else if (arg === "--transition") {
      args.transition = argv[++i];
    } else if (arg === "--transition-duration") {
      args.transitionDuration = argv[++i];
    } else if (arg === "--music") {
      args.music = argv[++i];
    } else if (arg === "--music-volume") {
      args.musicVolume = argv[++i];
    } else if (arg === "--padding") {
      args.padding = argv[++i];
    } else if (arg === "--fps") {
      args.fps = argv[++i];
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--no-ken-burns") {
      args.kenBurns = "false";
    } else if (arg === "--ken-burns") {
      args.kenBurns = "true";
    } else if (arg === "--captions") {
      args.captions = "true";
    } else if (arg === "--no-captions") {
      args.captions = "false";
    }
  }

  return args;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs();
  const prefs = loadPreferences();

  // Validate required args
  if (!args.script) {
    console.error("Error: --script is required");
    console.error(
      "Usage: npx -y bun main.ts --script <path-to-youtube-script.md>"
    );
    process.exit(1);
  }

  const scriptPath = resolve(String(args.script));
  if (!existsSync(scriptPath)) {
    console.error(`Error: Script file not found: ${scriptPath}`);
    process.exit(1);
  }

  const scriptDir = dirname(scriptPath);
  const imagesDir = resolve(
    String(args.imagesDir || join(scriptDir, "imgs"))
  );
  const outputPath = resolve(
    String(args.output || join(scriptDir, "video.mp4"))
  );
  const ttsProvider = (args.tts ||
    prefs.tts_provider ||
    "edge-tts") as TTSProvider;
  const transitionDuration = Number(
    args.transitionDuration || prefs.transition_duration || 2
  );
  const padding = Number(args.padding || prefs.padding || 1);
  const fps = Number(args.fps || prefs.fps || 24);
  const musicVolume = Number(
    args.musicVolume || prefs.music_volume || 0.1
  );

  // Default voice based on provider
  const defaultVoice =
    ttsProvider === "openai"
      ? "alloy"
      : ttsProvider === "elevenlabs"
        ? "21m00Tcm4TlvDq8ikWAM" // ElevenLabs "Rachel" pre-built voice
        : "en-US-AndrewMultilingualNeural";
  let voice = String(args.voice || prefs.voice || defaultVoice);

  const resolution = String(
    args.resolution || prefs.resolution || "1920x1080"
  );
  const transition = String(
    args.transition || prefs.transition || "fade"
  );
  const musicPath = args.music ? resolve(String(args.music)) : undefined;
  const dryRun = Boolean(args.dryRun);
  const kenBurns = args.kenBurns !== "false"; // default true
  const captions = args.captions === "true"; // default false (requires whisper)

  // ---------------------------------------------------------------------------
  // Step 1: Parse the script
  // ---------------------------------------------------------------------------
  console.log(`\n[parse] Reading script: ${scriptPath}`);
  const scriptContent = readFileSync(scriptPath, "utf-8");
  const parsed = parseYoutubeScript(scriptContent);
  console.log(
    `[parse] Found ${parsed.slides.length} slides in "${parsed.title}"`
  );

  // ---------------------------------------------------------------------------
  // Step 2: Resolve image paths
  // ---------------------------------------------------------------------------
  console.log(`[images] Resolving images from: ${imagesDir}`);
  const slides = await resolveImagePaths(parsed.slides, imagesDir);
  for (const slide of slides) {
    console.log(
      `  Slide ${slide.index}: ${basename(slide.imagePath!)} — "${slide.title}"`
    );
  }

  // ---------------------------------------------------------------------------
  // Step 3: Generate TTS narration for each slide (or estimate for dry-run)
  // ---------------------------------------------------------------------------

  if (dryRun) {
    // Estimate durations based on narration text length (~150 words/min, ~5 chars/word)
    console.log(`\n[dry-run] Estimating slide durations from text length...`);
    const slideInputs: SlideInput[] = slides.map((slide) => {
      const wordCount = slide.narration.trim().split(/\s+/).length;
      const estimatedDuration = Math.max(3, (wordCount / 150) * 60) + padding;
      console.log(
        `  Slide ${slide.index}: ~${estimatedDuration.toFixed(1)}s (${wordCount} words)`
      );
      return {
        imagePath: slide.imagePath!,
        duration: estimatedDuration,
      };
    });

    const totalDuration = slideInputs.reduce((sum, s) => sum + s.duration, 0);
    console.log(`\n[video] Estimated total duration: ${totalDuration.toFixed(1)}s`);

    const ffmpegCmd = buildFFmpegCommand(slideInputs, {
      resolution,
      transition,
      transitionDuration,
      fps,
      narrationPath: "<narration-full.mp3>",
      musicPath,
      musicVolume,
      outputPath,
      kenBurns,
    });

    console.log("\n[dry-run] FFmpeg command:\n");
    console.log(formatCommand(ffmpegCmd));
    console.log();
    process.exit(0);
  }

  const ttsOutputDir = join(scriptDir, ".video-gen-tmp");
  if (!existsSync(ttsOutputDir)) {
    mkdirSync(ttsOutputDir, { recursive: true });
  }

  console.log(`\n[tts] Generating narration with ${ttsProvider} (voice: ${voice})`);

  const ttsResults: { audioPath: string; duration: number }[] = [];
  for (const slide of slides) {
    if (!slide.narration.trim()) {
      console.log(`  Slide ${slide.index}: (no narration, skipping TTS)`);
      // Create a silent audio segment using FFmpeg
      const silentPath = join(
        ttsOutputDir,
        `narration-${String(slide.index).padStart(2, "0")}.mp3`
      );
      const { execSync } = await import("child_process");
      execSync(
        `ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t 3 -q:a 9 "${silentPath}"`,
        { stdio: "pipe" }
      );
      ttsResults.push({ audioPath: silentPath, duration: 3 });
      continue;
    }

    console.log(
      `  Slide ${slide.index}: "${slide.title}" (${slide.narration.length} chars)`
    );
    const result = await generateTTS(slide.narration, slide.index, {
      provider: ttsProvider,
      voice,
      outputDir: ttsOutputDir,
    });
    console.log(`    → ${result.duration.toFixed(1)}s`);
    ttsResults.push(result);
  }

  // ---------------------------------------------------------------------------
  // Step 4: Concatenate narration audio
  // ---------------------------------------------------------------------------
  const narrationPath = join(ttsOutputDir, "narration-full.mp3");
  console.log(`\n[audio] Concatenating narration → ${narrationPath}`);
  concatenateAudio(
    ttsResults.map((r) => r.audioPath),
    narrationPath
  );

  // ---------------------------------------------------------------------------
  // Step 5: Generate captions (optional)
  // ---------------------------------------------------------------------------
  let subtitlesPath: string | undefined;
  if (captions) {
    subtitlesPath = generateCaptions(narrationPath, ttsOutputDir);
  }

  // ---------------------------------------------------------------------------
  // Step 6: Build slide inputs with durations
  // ---------------------------------------------------------------------------
  const slideInputs: SlideInput[] = slides.map((slide, i) => ({
    imagePath: slide.imagePath!,
    duration: ttsResults[i].duration + padding,
  }));

  const totalDuration = slideInputs.reduce((sum, s) => sum + s.duration, 0);
  console.log(`\n[video] Total duration: ${totalDuration.toFixed(1)}s`);

  // ---------------------------------------------------------------------------
  // Step 7: Build and execute FFmpeg command
  // ---------------------------------------------------------------------------
  const ffmpegCmd = buildFFmpegCommand(slideInputs, {
    resolution,
    transition,
    transitionDuration,
    fps,
    narrationPath,
    musicPath,
    musicVolume,
    outputPath,
    kenBurns,
    subtitlesPath,
  });

  executeFFmpeg(ffmpegCmd);

  // ---------------------------------------------------------------------------
  // Step 8: Cleanup temp files
  // ---------------------------------------------------------------------------
  console.log("\n[cleanup] Removing temp files...");
  const { rmSync } = await import("fs");
  try {
    rmSync(ttsOutputDir, { recursive: true, force: true });
  } catch {}

  // ---------------------------------------------------------------------------
  // Done
  // ---------------------------------------------------------------------------
  console.log(`\n✅ Video generated: ${outputPath}`);
  const fileSizeMB = (
    (await import("fs")).statSync(outputPath).size /
    1024 /
    1024
  ).toFixed(1);
  console.log(`   Size: ${fileSizeMB} MB`);
  console.log(`   Duration: ~${totalDuration.toFixed(0)}s`);
  console.log(`   Resolution: ${resolution}`);
}

main().catch((err) => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
