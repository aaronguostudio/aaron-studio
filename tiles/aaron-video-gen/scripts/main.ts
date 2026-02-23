#!/usr/bin/env bun
/**
 * aaron-video-gen: Generate YouTube videos from script + slide images.
 *
 * Usage:
 *   npx -y bun scripts/main.ts --script <path> [options]
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync, copyFileSync } from "fs";
import { createHash } from "crypto";
import { resolve, dirname, join, basename } from "path";
import {
  parseYoutubeScript,
  resolveImagePaths,
  type SlideSection,
  type NarrationSegment,
} from "./parse-script";
import type { ImageChangeTiming, WordTiming } from "../remotion/src/types";
import { generateTTS, concatenateAudio, type TTSProvider } from "./tts";
import {
  buildFFmpegCommand,
  executeFFmpeg,
  formatCommand,
  type SlideInput,
} from "./ffmpeg";
import { generateCaptions } from "./captions";
import {
  renderWithRemotion,
  type RemotionSlideInput,
} from "./remotion-render";
import { rewriteAllNarrations } from "./rewrite-narration";

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
  renderer?: string;
  conversational?: boolean;
  speed?: number;
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
    } else if (arg === "--renderer") {
      args.renderer = argv[++i];
    } else if (arg === "--conversational") {
      args.conversational = "true";
    } else if (arg === "--no-conversational") {
      args.conversational = "false";
    } else if (arg === "--speed") {
      args.speed = argv[++i];
    } else if (arg === "--logo") {
      args.logo = argv[++i];
    } else if (arg === "--slogan") {
      args.slogan = argv[++i];
    } else if (arg === "--website") {
      args.website = argv[++i];
    } else if (arg === "--skip-tts") {
      args.skipTts = "true";
    }
  }

  return args;
}

// ---------------------------------------------------------------------------
// Image change timing computation for progressive builds
// ---------------------------------------------------------------------------

function computeImageChangeTimings(
  segments: NarrationSegment[],
  wordTimings?: WordTiming[],
  totalDuration?: number
): ImageChangeTiming[] {
  if (segments.length <= 1) return [];

  // Use word timings for precise sync (ElevenLabs)
  if (wordTimings && wordTimings.length > 0) {
    const results: ImageChangeTiming[] = [];
    let wordCursor = 0;

    for (let segIdx = 0; segIdx < segments.length; segIdx++) {
      if (segIdx === 0) {
        results.push({ imageFile: "", startAtSec: 0 }); // imageFile filled later
        wordCursor += segments[segIdx].text.trim().split(/\s+/).filter(Boolean).length;
        continue;
      }

      // Clamp cursor to valid range
      const targetIdx = Math.min(wordCursor, wordTimings.length - 1);
      const startTime = Math.max(0, wordTimings[targetIdx].start - 0.3);
      results.push({ imageFile: "", startAtSec: startTime });

      wordCursor += segments[segIdx].text.trim().split(/\s+/).filter(Boolean).length;
    }

    return results;
  }

  // Fallback: proportional split by text length
  if (totalDuration) {
    const totalChars = segments.reduce((sum, s) => sum + s.text.length, 0);
    let charOffset = 0;
    return segments.map((seg, i) => {
      const startAtSec = i === 0 ? 0 : (charOffset / totalChars) * totalDuration;
      charOffset += seg.text.length;
      return { imageFile: "", startAtSec };
    });
  }

  return [];
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
    args.transitionDuration || prefs.transition_duration || 1.2
  );
  const padding = Number(args.padding || prefs.padding || 1);
  const fps = Number(args.fps || prefs.fps || 24);
  const musicVolume = Number(
    args.musicVolume || prefs.music_volume || 0.1
  );

  // Default voice based on provider
  const defaultVoice =
    ttsProvider === "openai"
      ? "nova"
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
  const renderer = String(args.renderer || prefs.renderer || "remotion"); // "remotion" or "ffmpeg"
  const conversational =
    args.conversational !== undefined
      ? args.conversational !== "false"
      : prefs.conversational !== false; // default true
  const speed = Number(args.speed || prefs.speed || 1.1);

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
  // Step 2.5: Rewrite narration conversationally (optional, cached)
  // ---------------------------------------------------------------------------
  const rewriteCacheDir = join(scriptDir, ".video-gen-cache");
  if (!existsSync(rewriteCacheDir)) {
    mkdirSync(rewriteCacheDir, { recursive: true });
  }

  // Cache rewritten narration so subsequent runs with the same input text
  // produce the same output (and therefore the same TTS cache key)
  function rewriteCacheKey(originalText: string, slideIndex: number): string {
    const hash = createHash("md5")
      .update(originalText)
      .digest("hex")
      .slice(0, 12);
    return `rewrite-${String(slideIndex).padStart(2, "0")}-${hash}`;
  }

  function loadRewriteCache(key: string): string | null {
    const path = join(rewriteCacheDir, `${key}.txt`);
    if (!existsSync(path)) return null;
    return readFileSync(path, "utf-8");
  }

  function saveRewriteCache(key: string, text: string): void {
    writeFileSync(join(rewriteCacheDir, `${key}.txt`), text, "utf-8");
  }

  if (conversational && !dryRun) {
    console.log(`\n[rewrite] Making narration conversational...`);

    // For multi-image slides, rewrite each segment individually to preserve
    // marker boundaries. For single-image slides, rewrite the full narration.
    const multiImageSlides = slides.filter(
      (s) => s.narrationSegments && s.narrationSegments.length > 1
    );
    const singleImageSlides = slides.filter(
      (s) => !s.narrationSegments || s.narrationSegments.length <= 1
    );

    // Rewrite single-image slides (with rewrite cache)
    if (singleImageSlides.length > 0) {
      const uncachedSlides: SlideSection[] = [];
      for (const slide of singleImageSlides) {
        const cKey = rewriteCacheKey(slide.narration, slide.index);
        const cached = loadRewriteCache(cKey);
        if (cached) {
          console.log(`  Slide ${slide.index}: "${slide.title}" → rewrite cached`);
          slide.narration = cached;
        } else {
          uncachedSlides.push(slide);
        }
      }
      if (uncachedSlides.length > 0) {
        const rewritten = await rewriteAllNarrations(uncachedSlides);
        for (const slide of uncachedSlides) {
          const originalText = slide.narration;
          const newText = rewritten.get(slide.index);
          if (newText) {
            slide.narration = newText;
            saveRewriteCache(rewriteCacheKey(originalText, slide.index), newText);
          }
        }
      }
    }

    // Rewrite multi-image slides segment by segment (with rewrite cache)
    const { rewriteNarration } = await import("./rewrite-narration");
    for (const slide of multiImageSlides) {
      // Check if full slide rewrite is cached (keyed on original full narration)
      const originalNarration = slide.narration;
      const cKey = rewriteCacheKey(originalNarration, slide.index);
      const cached = loadRewriteCache(cKey);
      if (cached) {
        console.log(`  Slide ${slide.index}: "${slide.title}" (${slide.narrationSegments!.length} segments) → rewrite cached`);
        // Parse cached segments back (stored as double-newline separated)
        const cachedSegments = cached.split("\n\n---SEGMENT---\n\n");
        for (let segIdx = 0; segIdx < slide.narrationSegments!.length; segIdx++) {
          if (cachedSegments[segIdx]) {
            slide.narrationSegments![segIdx].text = cachedSegments[segIdx];
          }
        }
        slide.narration = slide.narrationSegments!
          .map((s) => s.text)
          .filter(Boolean)
          .join("\n\n");
        console.log(`    ${slide.narration.length} chars total`);
        continue;
      }

      console.log(`  Slide ${slide.index}: "${slide.title}" (${slide.narrationSegments!.length} segments)`);
      for (let segIdx = 0; segIdx < slide.narrationSegments!.length; segIdx++) {
        const seg = slide.narrationSegments![segIdx];
        if (!seg.text.trim()) continue;
        seg.text = await rewriteNarration(seg.text, slide.title);
      }
      // Rebuild full narration from rewritten segments
      slide.narration = slide.narrationSegments!
        .map((s) => s.text)
        .filter(Boolean)
        .join("\n\n");
      console.log(`    ${slide.narration.length} chars total`);
      // Cache the rewritten segments
      const segmentsCacheValue = slide.narrationSegments!
        .map((s) => s.text)
        .join("\n\n---SEGMENT---\n\n");
      saveRewriteCache(cKey, segmentsCacheValue);
    }
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
  const ttsCacheDir = join(scriptDir, ".video-gen-cache");
  if (!existsSync(ttsOutputDir)) {
    mkdirSync(ttsOutputDir, { recursive: true });
  }
  if (!existsSync(ttsCacheDir)) {
    mkdirSync(ttsCacheDir, { recursive: true });
  }

  const skipTts = args.skipTts === "true";

  // Helper: compute a content hash for TTS cache keying
  function ttsCacheKey(text: string, slideIndex: number): string {
    const hash = createHash("md5")
      .update(`${ttsProvider}|${voice}|${speed}|${text}`)
      .digest("hex")
      .slice(0, 12);
    return `narration-${String(slideIndex).padStart(2, "0")}-${hash}`;
  }

  interface CachedTTSResult {
    audioPath: string;
    duration: number;
    wordTimings?: WordTiming[];
  }

  // Try to load cached TTS result
  function loadTTSCache(key: string): CachedTTSResult | null {
    const metaPath = join(ttsCacheDir, `${key}.json`);
    const audioPath = join(ttsCacheDir, `${key}.mp3`);
    if (!existsSync(metaPath) || !existsSync(audioPath)) return null;
    try {
      const meta = JSON.parse(readFileSync(metaPath, "utf-8"));
      return { audioPath, duration: meta.duration, wordTimings: meta.wordTimings };
    } catch {
      return null;
    }
  }

  // Save TTS result to cache
  function saveTTSCache(key: string, result: CachedTTSResult): void {
    const metaPath = join(ttsCacheDir, `${key}.json`);
    const cachedAudioPath = join(ttsCacheDir, `${key}.mp3`);
    if (result.audioPath !== cachedAudioPath) {
      copyFileSync(result.audioPath, cachedAudioPath);
    }
    writeFileSync(
      metaPath,
      JSON.stringify({ duration: result.duration, wordTimings: result.wordTimings }),
      "utf-8"
    );
  }

  console.log(`\n[tts] Generating narration with ${ttsProvider} (voice: ${voice})`);
  if (skipTts) {
    console.log(`  (--skip-tts: reusing cached audio)`);
  }

  const ttsResults: CachedTTSResult[] = [];
  for (const slide of slides) {
    if (!slide.narration.trim()) {
      console.log(`  Slide ${slide.index}: (no narration, skipping TTS)`);
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

    const cacheKey = ttsCacheKey(slide.narration, slide.index);
    const cached = loadTTSCache(cacheKey);

    if (cached && (skipTts || true)) {
      // Always use cache if available — narration text + voice + speed match
      console.log(
        `  Slide ${slide.index}: "${slide.title}" → cached (${cached.duration.toFixed(1)}s)`
      );
      ttsResults.push(cached);
      continue;
    }

    if (skipTts) {
      throw new Error(
        `--skip-tts specified but no cached audio for slide ${slide.index} ("${slide.title}"). ` +
        `Run without --skip-tts first to generate audio.`
      );
    }

    console.log(
      `  Slide ${slide.index}: "${slide.title}" (${slide.narration.length} chars)`
    );
    const result = await generateTTS(slide.narration, slide.index, {
      provider: ttsProvider,
      voice,
      outputDir: ttsOutputDir,
      speed,
    });
    console.log(`    → ${result.duration.toFixed(1)}s`);

    // Save to cache for future runs
    saveTTSCache(cacheKey, result);
    ttsResults.push({ ...result, audioPath: join(ttsCacheDir, `${cacheKey}.mp3`) });
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
  console.log(`[video] Renderer: ${renderer}`);

  // ---------------------------------------------------------------------------
  // Step 7: Render video
  // ---------------------------------------------------------------------------
  if (renderer === "remotion") {
    const KB_PATTERNS = [
      "slowZoomIn",
      "panRight",
      "slowZoomOut",
      "panLeft",
    ] as const;

    await renderWithRemotion({
      slides: slides.map((s, i) => {
        const slideInput: RemotionSlideInput = {
          title: s.title,
          narration: s.narration,
          imagePath: s.imagePath!,
          audioPath: ttsResults[i].audioPath,
          audioDuration: ttsResults[i].duration,
          animation: KB_PATTERNS[i % KB_PATTERNS.length],
          wordTimings: ttsResults[i].wordTimings,
        };

        // Progressive build: compute image change timings
        if (s.narrationSegments && s.narrationSegments.length > 1 && s.allImagePaths) {
          slideInput.additionalImagePaths = s.allImagePaths.slice(1);
          const timings = computeImageChangeTimings(
            s.narrationSegments,
            ttsResults[i].wordTimings,
            ttsResults[i].duration
          );
          // Fill in imageFile paths (relative to Remotion public/)
          if (timings.length > 0) {
            for (let t = 0; t < timings.length; t++) {
              timings[t].imageFile = `slides/${basename(s.allImagePaths[t])}`;
            }
            slideInput.imageChangeTimings = timings;
            console.log(
              `  [progressive] Slide ${s.index}: ${timings.length} images, changes at ${timings.map((t) => t.startAtSec.toFixed(1) + "s").join(", ")}`
            );
          }
        }

        return slideInput;
      }),
      videoTitle: parsed.title.replace(/^YouTube Script:\s*/i, ""),
      outputPath,
      fps,
      transitionDuration,
      padding,
      musicPath,
      musicVolume,
      logoPath: args.logo ? resolve(String(args.logo)) : undefined,
      slogan: args.slogan ? String(args.slogan) : undefined,
      website: args.website ? String(args.website) : undefined,
    });
  } else {
    // FFmpeg renderer (legacy)
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
  }

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
