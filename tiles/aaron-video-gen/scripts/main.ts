#!/usr/bin/env bun
/**
 * aaron-video-gen: Generate YouTube videos from script + slide images.
 *
 * Usage:
 *   npx -y bun scripts/main.ts --script <path> [options]
 */

import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync, copyFileSync } from "fs";
import { createHash } from "crypto";
import { resolve, dirname, join, basename, relative } from "path";
import {
  parseYoutubeScript,
  resolveImagePaths,
  type SlideSection,
  type NarrationSegment,
} from "./parse-script";
import type { Animation, ImageChangeTiming, WordTiming } from "../remotion/src/types";
import {
  generateTTS,
  concatenateAudio,
  resolveElevenLabsConfig,
  type ElevenLabsTTSConfig,
  type TTSProvider,
  type WordTiming as TTSWordTiming,
} from "./tts";
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
import { rememberRewriteOpenings, rewriteAllNarrations } from "./rewrite-narration";
import { rewriteCacheKey } from "./rewrite-cache";
import { resolveVoiceProfile } from "./voice-profile";
import {
  createLongFormReviewSamples,
  deriveAudioReviewPaths,
  prepareAudioReview,
} from "./audio-review";

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
    let value = trimmed.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
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
  voice_profile?: string;
  voice?: string;
  tts_model?: string;
  tts_output_format?: string;
  tts_stability?: number;
  tts_similarity?: number;
  tts_style?: number;
  tts_speaker_boost?: boolean | string;
  tts_seed?: number;
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
    } else if (arg === "--audio-only") {
      args.audioOnly = "true";
    } else if (arg === "--audio-output") {
      args.audioOutput = argv[++i];
    } else if (arg === "--transcript-output") {
      args.transcriptOutput = argv[++i];
    } else if (arg === "--audio-manifest-output") {
      args.audioManifestOutput = argv[++i];
    } else if (arg === "--images-dir") {
      args.imagesDir = argv[++i];
    } else if (arg === "--tts") {
      args.tts = argv[++i];
    } else if (arg === "--voice-profile") {
      args.voiceProfile = argv[++i];
    } else if (arg === "--voice") {
      args.voice = argv[++i];
    } else if (arg === "--tts-model") {
      args.ttsModel = argv[++i];
    } else if (arg === "--tts-output-format") {
      args.ttsOutputFormat = argv[++i];
    } else if (arg === "--tts-stability") {
      args.ttsStability = argv[++i];
    } else if (arg === "--tts-similarity") {
      args.ttsSimilarity = argv[++i];
    } else if (arg === "--tts-style") {
      args.ttsStyle = argv[++i];
    } else if (arg === "--tts-seed") {
      args.ttsSeed = argv[++i];
    } else if (arg === "--tts-speaker-boost") {
      args.ttsSpeakerBoost = "true";
    } else if (arg === "--no-tts-speaker-boost") {
      args.ttsSpeakerBoost = "false";
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
    } else if (arg === "--cover") {
      args.cover = argv[++i];
    } else if (arg === "--audit-only") {
      args.auditOnly = "true";
    } else if (arg === "--skip-script-audit") {
      args.skipScriptAudit = "true";
    } else if (arg === "--audit-output") {
      args.auditOutput = argv[++i];
    }
  }

  return args;
}

export interface AudioTimelineSegment {
  id: string;
  title: string;
  start: number;
  end: number;
  duration: number;
}

export interface AudioTimeline {
  duration: number;
  segments: AudioTimelineSegment[];
  wordTimings: TTSWordTiming[];
}

/**
 * Keep narration boundaries and word timings together. Long-form film
 * timelines can only be retimed safely when the audio artifact carries both.
 */
export function buildAudioTimeline(
  entries: Array<{
    id: string;
    title: string;
    duration: number;
    wordTimings?: TTSWordTiming[];
  }>,
): AudioTimeline {
  let offset = 0;
  const segments = entries.map((entry) => {
    const start = offset;
    const end = start + entry.duration;
    offset = end;
    return {
      id: entry.id,
      title: entry.title,
      start,
      end,
      duration: entry.duration,
    };
  });
  let wordOffset = 0;
  const wordTimings = entries.flatMap((entry) => {
    const shifted = (entry.wordTimings || []).map((timing) => ({
      word: timing.word,
      start: timing.start + wordOffset,
      end: timing.end + wordOffset,
    }));
    wordOffset += entry.duration;
    return shifted;
  });
  return { duration: offset, segments, wordTimings };
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

function slideMotionToAnimation(value?: string): Animation | null {
  if (!value) return null;
  if (value === "actorFramework") return "actorFramework";
  return null;
}

function inferSlideAnimation(slide: SlideSection): Animation | null {
  const title = slide.title.toLowerCase();
  const narration = slide.narration.toLowerCase();
  if (
    title.includes("workflow engineering") ||
    narration.includes("the practical version is actor")
  ) {
    return "actorFramework";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs();
  const prefs = loadPreferences();
  const voiceProfile = resolveVoiceProfile(
    String(args.voiceProfile || prefs.voice_profile || "") || undefined
  );

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
  const audioOnly = args.audioOnly === "true";
  const audioOutputPath = resolve(
    String(args.audioOutput || join(scriptDir, "audio.mp3"))
  );
  const transcriptOutputPath = resolve(
    String(args.transcriptOutput || join(scriptDir, "audio-transcript.md"))
  );
  const audioManifestOutputPath = resolve(
    String(
      args.audioManifestOutput || join(scriptDir, "audio-generation-manifest.json")
    )
  );
  const ttsProvider = (args.tts ||
    prefs.tts_provider ||
    voiceProfile.provider ||
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
        ? voiceProfile.voice_id
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
  const kenBurns = args.kenBurns === "true"; // default false; use --ken-burns to opt in
  const captions = args.captions === "true"; // default false (requires whisper)
  const renderer = String(args.renderer || prefs.renderer || "remotion"); // "remotion" or "ffmpeg"
  const conversational =
    args.conversational !== undefined
      ? args.conversational !== "false"
      : prefs.conversational !== false; // default true
  const speed = Number(
    args.speed ||
      prefs.speed ||
      (ttsProvider === "elevenlabs"
        ? voiceProfile.voice_settings.speed
        : 1.1)
  );
  const speakerBoostSource =
    args.ttsSpeakerBoost ??
    prefs.tts_speaker_boost ??
    voiceProfile.voice_settings.use_speaker_boost;
  const useSpeakerBoost = String(speakerBoostSource).toLowerCase() !== "false";
  const seedSource = args.ttsSeed ?? prefs.tts_seed ?? voiceProfile.seed;
  const elevenLabsOptions: ElevenLabsTTSConfig = {
    modelId: String(
      args.ttsModel ||
        prefs.tts_model ||
        voiceProfile.model_id ||
        "eleven_multilingual_v2"
    ),
    outputFormat: String(
      args.ttsOutputFormat ||
        prefs.tts_output_format ||
        voiceProfile.output_format ||
        "mp3_44100_192"
    ),
    stability: Number(
      args.ttsStability ??
        prefs.tts_stability ??
        voiceProfile.voice_settings.stability
    ),
    similarityBoost: Number(
      args.ttsSimilarity ??
        prefs.tts_similarity ??
        voiceProfile.voice_settings.similarity_boost
    ),
    style: Number(
      args.ttsStyle ?? prefs.tts_style ?? voiceProfile.voice_settings.style
    ),
    useSpeakerBoost,
    ...(seedSource != null && { seed: Number(seedSource) }),
  };
  const resolvedElevenLabsConfig =
    ttsProvider === "elevenlabs"
      ? resolveElevenLabsConfig({
          speed,
          elevenLabs: elevenLabsOptions,
        })
      : undefined;
  const ttsIdentity = {
    provider: ttsProvider,
    voiceProfile: ttsProvider === "elevenlabs" ? voiceProfile.id : undefined,
    voice,
    speed,
    ...(ttsProvider === "elevenlabs" && {
      modelId: resolvedElevenLabsConfig!.modelId,
      outputFormat: resolvedElevenLabsConfig!.outputFormat,
      voiceSettings: resolvedElevenLabsConfig!.voiceSettings,
      seed: resolvedElevenLabsConfig!.seed,
    }),
  };

  // ---------------------------------------------------------------------------
  // Step 1: Parse the script
  // ---------------------------------------------------------------------------
  console.log(`\n[parse] Reading script: ${scriptPath}`);
  const scriptContent = readFileSync(scriptPath, "utf-8");
  const parsed = parseYoutubeScript(scriptContent);
  console.log(
    `[parse] Found ${parsed.slides.length} slides in "${parsed.title}"`
  );
  if (parsed.hookNarration) {
    console.log(`[parse] Found [HOOK] section (${parsed.hookNarration.length} chars)`);
  }

  const { parseVideoBrief } = await import("./video-brief");
  const videoBriefPath = join(scriptDir, "video-brief.md");
  const videoBriefMarkdown = existsSync(videoBriefPath)
    ? readFileSync(videoBriefPath, "utf-8")
    : "";
  const videoBrief = parseVideoBrief(videoBriefMarkdown);

  if (args.skipScriptAudit !== "true") {
    const { auditYoutubeScript, countScriptImages } = await import("./script-audit");
    const imageCount = countScriptImages(scriptContent);
    const audit = auditYoutubeScript({
      scriptMarkdown: scriptContent,
      videoBriefMarkdown,
      imageCount,
      scriptPath,
    });
    const auditPath = resolve(
      String(args.auditOutput || join(scriptDir, "youtube-script-audit.md"))
    );
    writeFileSync(auditPath, audit.summaryMarkdown, "utf-8");
    console.log(`[audit] ${audit.passed ? "PASS" : "FAIL"} -> ${auditPath}`);

    if (args.auditOnly === "true") {
      process.exit(audit.passed ? 0 : 2);
    }
    if (!audit.passed) {
      throw new Error(
        "YouTube script audit failed. Fix youtube-script.md or run with --skip-script-audit for an explicit override."
      );
    }
  } else if (args.auditOnly === "true") {
    console.log("[audit] skipped by --skip-script-audit");
    process.exit(0);
  }

  // ---------------------------------------------------------------------------
  // Step 2: Resolve image paths
  // ---------------------------------------------------------------------------
  let slides: SlideSection[];
  if (audioOnly) {
    slides = parsed.slides;
    console.log("[images] Skipped for --audio-only");
  } else {
    console.log(`[images] Resolving images from: ${imagesDir}`);
    slides = await resolveImagePaths(parsed.slides, imagesDir);
    for (const slide of slides) {
      console.log(
        `  Slide ${slide.index}: ${basename(slide.imagePath!)} — "${slide.title}"`
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Step 2.5: Rewrite narration conversationally (optional, cached)
  // ---------------------------------------------------------------------------
  const rewriteCacheDir = join(scriptDir, ".video-gen-cache");
  if (!existsSync(rewriteCacheDir)) {
    mkdirSync(rewriteCacheDir, { recursive: true });
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
    const rewriteContext = {
      corePromise: videoBrief.corePromise,
      hookType: videoBrief.hookType,
      storyStructure: videoBrief.storyStructure,
      desiredEmotion: videoBrief.desiredEmotion,
      bannedPhrases: [
        "right",
        "you know",
        "basically",
        "let's dive in",
        "in today's video",
      ],
      retentionBeats: videoBrief.retentionBeats,
    };
    const previousOpenings: string[] = [];

    if (parsed.hookNarration) {
      const originalHook = parsed.hookNarration;
      const hookRewriteKey = rewriteCacheKey(originalHook, 99, rewriteContext);
      const cachedHookRewrite = loadRewriteCache(hookRewriteKey);
      if (cachedHookRewrite) {
        console.log("  Hook → rewrite cached");
        parsed.hookNarration = cachedHookRewrite;
      } else {
        const { rewriteNarration } = await import("./rewrite-narration");
        parsed.hookNarration = await rewriteNarration(
          originalHook,
          "Hook",
          previousOpenings,
          rewriteContext
        );
        saveRewriteCache(hookRewriteKey, parsed.hookNarration);
      }
      rememberRewriteOpenings(parsed.hookNarration, previousOpenings);
    }

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
        const cKey = rewriteCacheKey(slide.narration, slide.index, rewriteContext);
        const cached = loadRewriteCache(cKey);
        if (cached) {
          console.log(`  Slide ${slide.index}: "${slide.title}" → rewrite cached`);
          slide.narration = cached;
          rememberRewriteOpenings(cached, previousOpenings);
        } else {
          uncachedSlides.push(slide);
        }
      }
      if (uncachedSlides.length > 0) {
        const rewritten = await rewriteAllNarrations(
          uncachedSlides,
          rewriteContext,
          previousOpenings
        );
        for (const slide of uncachedSlides) {
          const originalText = slide.narration;
          const newText = rewritten.get(slide.index);
          if (newText) {
            slide.narration = newText;
            saveRewriteCache(
              rewriteCacheKey(originalText, slide.index, rewriteContext),
              newText
            );
          }
        }
      }
    }

    // Rewrite multi-image slides segment by segment (with rewrite cache)
    const { rewriteNarration } = await import("./rewrite-narration");
    for (const slide of multiImageSlides) {
      // Check if full slide rewrite is cached (keyed on original full narration)
      const originalNarration = slide.narration;
      const cKey = rewriteCacheKey(originalNarration, slide.index, rewriteContext);
      const cached = loadRewriteCache(cKey);
      if (cached) {
        console.log(`  Slide ${slide.index}: "${slide.title}" (${slide.narrationSegments!.length} segments) → rewrite cached`);
        // Parse cached segments back (stored as double-newline separated)
        const cachedSegments = cached.split("\n\n---SEGMENT---\n\n");
        for (let segIdx = 0; segIdx < slide.narrationSegments!.length; segIdx++) {
          if (cachedSegments[segIdx]) {
            slide.narrationSegments![segIdx].text = cachedSegments[segIdx];
            rememberRewriteOpenings(cachedSegments[segIdx], previousOpenings);
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
        seg.text = await rewriteNarration(
          seg.text,
          slide.title,
          previousOpenings,
          rewriteContext
        );
        rememberRewriteOpenings(seg.text, previousOpenings);
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

  if (audioOnly) {
    const ttsMetadata = [
      `Provider: ${ttsProvider}`,
      ...(ttsProvider === "elevenlabs"
        ? [
            `Voice profile: ${voiceProfile.id}`,
            `Voice ID: ${voice}`,
            `Model: ${resolvedElevenLabsConfig!.modelId}`,
            `Output format: ${resolvedElevenLabsConfig!.outputFormat}`,
            `Stability: ${resolvedElevenLabsConfig!.voiceSettings.stability}`,
            `Similarity boost: ${resolvedElevenLabsConfig!.voiceSettings.similarity_boost}`,
            `Style: ${resolvedElevenLabsConfig!.voiceSettings.style}`,
            `Speaker boost: ${resolvedElevenLabsConfig!.voiceSettings.use_speaker_boost}`,
          ]
        : [`Voice: ${voice}`]),
      `Speed: ${speed}`,
    ];
    const transcript = [
      `# Audio Transcript: ${parsed.title.replace(/^YouTube Script:\s*/i, "")}`,
      "",
      ...ttsMetadata,
      "",
      ...(parsed.hookNarration
        ? ["## Hook", "", parsed.hookNarration, ""]
        : []),
      ...slides.flatMap((slide) => [
        `## ${slide.title}`,
        "",
        slide.narration,
        "",
      ]),
    ].join("\n");
    mkdirSync(dirname(transcriptOutputPath), { recursive: true });
    writeFileSync(transcriptOutputPath, `${transcript.trim()}\n`, "utf-8");
    console.log(`[audio] Final spoken transcript → ${transcriptOutputPath}`);
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
    const hookWordCount = parsed.hookNarration?.trim().split(/\s+/).length || 0;
    const hookDuration = hookWordCount > 0 ? (hookWordCount / 150) * 60 : 0;
    const estimatedTotalDuration = totalDuration + hookDuration;
    if (audioOnly) {
      console.log(
        `\n[audio] Estimated duration: ${estimatedTotalDuration.toFixed(1)}s`
      );
      process.exit(0);
    }
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

  function ttsContentHash(
    text: string,
    context: { previousText?: string; nextText?: string } = {}
  ): string {
    return createHash("md5")
      .update(JSON.stringify({ ttsIdentity, text, context }))
      .digest("hex")
      .slice(0, 12);
  }

  function ttsCacheKey(
    text: string,
    slideIndex: number,
    context: { previousText?: string; nextText?: string } = {}
  ): string {
    return `narration-${String(slideIndex).padStart(2, "0")}-${ttsContentHash(text, context)}`;
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
      JSON.stringify({
        duration: result.duration,
        wordTimings: result.wordTimings,
        ttsIdentity,
      }),
      "utf-8"
    );
  }

  console.log(
    `\n[tts] Generating narration with ${ttsProvider} (voice: ${voice}, profile: ${voiceProfile.id})`
  );
  if (skipTts) {
    console.log(`  (--skip-tts: reusing cached audio)`);
  }

  const ttsResults: CachedTTSResult[] = [];
  for (let slidePosition = 0; slidePosition < slides.length; slidePosition++) {
    const slide = slides[slidePosition];
    const previousText =
      slidePosition > 0
        ? slides[slidePosition - 1].narration
        : parsed.hookNarration;
    const nextText = slides[slidePosition + 1]?.narration;
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

    const cacheKey = ttsCacheKey(slide.narration, slide.index, {
      previousText,
      nextText,
    });
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
      previousText,
      nextText,
      elevenLabs: elevenLabsOptions,
    });
    console.log(`    → ${result.duration.toFixed(1)}s`);

    // Save to cache for future runs
    saveTTSCache(cacheKey, result);
    ttsResults.push({ ...result, audioPath: join(ttsCacheDir, `${cacheKey}.mp3`) });
  }

  // ---------------------------------------------------------------------------
  // Step 3.5: Generate TTS for content hook (if present)
  // ---------------------------------------------------------------------------
  interface HookTTSResult {
    audioPath: string;
    duration: number;
    wordTimings?: WordTiming[];
    imagePath?: string;
  }
  let hookTTS: HookTTSResult | undefined;

  if (parsed.hookNarration && !dryRun) {
    console.log(`\n[tts] Generating hook narration...`);
    const hookCacheKey = `narration-hook-${ttsContentHash(
      parsed.hookNarration,
      { nextText: slides[0]?.narration }
    )}`;

    const cachedHook = loadTTSCache(hookCacheKey);
    if (cachedHook) {
      console.log(`  Hook → cached (${cachedHook.duration.toFixed(1)}s)`);
      hookTTS = cachedHook;
    } else if (skipTts) {
      throw new Error(
        `--skip-tts specified but no cached audio for hook. Run without --skip-tts first.`
      );
    } else {
      console.log(`  Hook (${parsed.hookNarration.length} chars)`);
      const result = await generateTTS(parsed.hookNarration, 99, {
        provider: ttsProvider,
        voice,
        outputDir: ttsOutputDir,
        speed,
        nextText: slides[0]?.narration,
        elevenLabs: elevenLabsOptions,
      });
      console.log(`    → ${result.duration.toFixed(1)}s`);
      saveTTSCache(hookCacheKey, result);
      hookTTS = { ...result, audioPath: join(ttsCacheDir, `${hookCacheKey}.mp3`) };
    }

    // Resolve hook image: use hookImageRef if specified, otherwise first slide's image
    if (!audioOnly && parsed.hookImageRef && slides.length > 0) {
      const imageFiles = (readdirSync(imagesDir) as string[])
        .filter((f) => /\.(png|jpe?g|webp|gif|bmp|tiff?)$/i.test(f))
        .sort();
      const ref = parsed.hookImageRef;
      let resolved: string | undefined;
      if (imageFiles.includes(ref)) resolved = join(imagesDir, ref);
      if (!resolved) {
        const match = imageFiles.find((f) => f.toLowerCase().includes(ref.toLowerCase()));
        if (match) resolved = join(imagesDir, match);
      }
      if (resolved) hookTTS.imagePath = resolved;
    }
    if (!audioOnly && !hookTTS.imagePath && slides.length > 0) {
      hookTTS.imagePath = slides[0].imagePath!;
    }
  }

  // ---------------------------------------------------------------------------
  // Step 4: Concatenate narration audio
  // ---------------------------------------------------------------------------
  const narrationPath = join(ttsOutputDir, "narration-full.mp3");
  const narrationResults =
    (audioOnly || renderer === "ffmpeg") && hookTTS
      ? [hookTTS, ...ttsResults]
      : ttsResults;
  console.log(`\n[audio] Concatenating narration → ${narrationPath}`);
  concatenateAudio(
    narrationResults.map((r) => r.audioPath),
    narrationPath
  );

  if (audioOnly) {
    mkdirSync(dirname(audioOutputPath), { recursive: true });
    const reviewPaths = deriveAudioReviewPaths(audioOutputPath);
    const { rawPath, samplePath, middleSamplePath, lateSamplePath } = reviewPaths;
    copyFileSync(narrationPath, rawPath);
    console.log(`[audio] Preserved raw narration -> ${rawPath}`);
    console.log(`[audio] Normalizing review copy and running QA...`);
    const review = prepareAudioReview(rawPath, audioOutputPath, samplePath);
    const sampleWindows = createLongFormReviewSamples(audioOutputPath, reviewPaths);
    const relativeToScript = (path: string) =>
      relative(scriptDir, path) || basename(path);
    const transcriptHash = createHash("sha256")
      .update(readFileSync(transcriptOutputPath, "utf-8"))
      .digest("hex");
    const audioTimeline = buildAudioTimeline([
      ...(hookTTS
        ? [
            {
              id: "hook",
              title: "Hook",
              duration: hookTTS.duration,
              wordTimings: hookTTS.wordTimings,
            },
          ]
        : []),
      ...ttsResults.map((result, index) => ({
        id: `slide-${String(index + 1).padStart(2, "0")}`,
        title: slides[index]?.title || `Slide ${index + 1}`,
        duration: result.duration,
        wordTimings: result.wordTimings,
      })),
    ]);
    const generationManifest = {
      schema_version: 1,
      generated_at: new Date().toISOString(),
      source: {
        script: relativeToScript(scriptPath),
        script_sha256: createHash("sha256").update(scriptContent).digest("hex"),
        transcript: relativeToScript(transcriptOutputPath),
        transcript_sha256: transcriptHash,
      },
      tts: ttsIdentity,
      voice_profile_selection:
        ttsProvider === "elevenlabs"
          ? {
              id: voiceProfile.id,
              selected_sample: voiceProfile.selected_sample,
              selected_at: voiceProfile.selected_at,
              selection_reason: voiceProfile.selection_reason,
            }
          : undefined,
      outputs: {
        final: relativeToScript(audioOutputPath),
        raw: relativeToScript(rawPath),
        sample_60s: relativeToScript(samplePath),
        sample_middle_60s: relativeToScript(middleSamplePath),
        sample_late_60s: relativeToScript(lateSamplePath),
      },
      qa: review,
      sample_windows: sampleWindows,
      timeline: audioTimeline,
    };
    mkdirSync(dirname(audioManifestOutputPath), { recursive: true });
    writeFileSync(
      audioManifestOutputPath,
      `${JSON.stringify(generationManifest, null, 2)}\n`,
      "utf-8"
    );
    const { rmSync, statSync } = await import("fs");
    try {
      rmSync(ttsOutputDir, { recursive: true, force: true });
    } catch {}
    const fileSizeMB = (statSync(audioOutputPath).size / 1024 / 1024).toFixed(1);
    console.log(`\n✅ Audio generated: ${audioOutputPath}`);
    console.log(`   Raw: ${rawPath}`);
    console.log(`   Opening 60s sample: ${samplePath}`);
    console.log(`   Middle 60s sample: ${middleSamplePath}`);
    console.log(`   Late 60s sample: ${lateSamplePath}`);
    console.log(`   Transcript: ${transcriptOutputPath}`);
    console.log(`   Manifest: ${audioManifestOutputPath}`);
    console.log(`   Voice profile: ${voiceProfile.id}`);
    console.log(`   Voice ID: ${voice}`);
    if (ttsProvider === "elevenlabs") {
      console.log(`   Model: ${resolvedElevenLabsConfig!.modelId}`);
    }
    console.log(`   Size: ${fileSizeMB} MB`);
    console.log(`   Duration: ~${review.durationSeconds.toFixed(0)}s`);
    console.log(
      `   Loudness: ${review.integratedLufs.toFixed(2)} LUFS, ${review.truePeakDb.toFixed(2)} dBTP`
    );
    console.log(`   Long silences: ${review.longSilenceCount}`);
    return;
  }

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
  if (renderer === "ffmpeg" && hookTTS?.imagePath) {
    slideInputs.unshift({
      imagePath: hookTTS.imagePath,
      duration: hookTTS.duration + padding,
    });
  }

  const totalDuration = slideInputs.reduce((sum, s) => sum + s.duration, 0);
  const estimatedOutputDuration =
    renderer === "remotion"
      ? (() => {
          const numSlides = slides.length;
          const lastIndex = numSlides - 1;
          const coverFrames = args.cover ? Math.round(2.5 * fps) : 0;
          const hookFrames = hookTTS
            ? Math.ceil((hookTTS.duration + 1) * fps)
            : 0;
          const introFrames =
            numSlides > 0 ? Math.round((args.cover ? 2 : 3.5) * fps) : 0;
          const slideSeconds = slides.reduce((sum, _slide, i) => {
            const audioDelay = i === 0 ? 0 : transitionDuration;
            const endBuffer = i === lastIndex ? 0 : transitionDuration;
            return (
              sum + audioDelay + ttsResults[i].duration + padding + endBuffer
            );
          }, 0);
          const transitionOverlap =
            Math.max(0, numSlides - 1) * transitionDuration;
          const mainFrames = Math.ceil(
            Math.max(1, slideSeconds - transitionOverlap) * fps
          );
          const outroExtraFrames =
            args.logo || args.slogan ? Math.round(4 * fps * 0.5) : 0;
          return (
            coverFrames +
            hookFrames +
            introFrames +
            mainFrames +
            outroExtraFrames
          ) / fps;
        })()
      : totalDuration;

  console.log(
    `\n[video] Total duration: ${estimatedOutputDuration.toFixed(1)}s`
  );
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
        const motionAnimation =
          slideMotionToAnimation(s.motion) ?? inferSlideAnimation(s);
        const slideInput: RemotionSlideInput = {
          title: s.title,
          narration: s.narration,
          imagePath: s.imagePath!,
          audioPath: ttsResults[i].audioPath,
          audioDuration: ttsResults[i].duration,
          animation:
            motionAnimation ??
            (kenBurns ? KB_PATTERNS[i % KB_PATTERNS.length] : "none"),
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
      hookAudioPath: hookTTS?.audioPath,
      hookAudioDuration: hookTTS?.duration,
      hookImagePath: hookTTS?.imagePath,
      hookWordTimings: hookTTS?.wordTimings,
      coverImagePath: args.cover ? resolve(String(args.cover)) : undefined,
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
  console.log(`   Duration: ~${estimatedOutputDuration.toFixed(0)}s`);
  console.log(`   Resolution: ${resolution}`);
}

main().catch((err) => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
