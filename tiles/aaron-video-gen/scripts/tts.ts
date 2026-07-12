/**
 * TTS generation module.
 * Supports edge-tts (free, via Python CLI) and OpenAI TTS API.
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

export type TTSProvider = "edge-tts" | "openai" | "elevenlabs";

export interface ElevenLabsTTSConfig {
  modelId?: string;
  outputFormat?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
  seed?: number;
}

export interface TTSOptions {
  provider: TTSProvider;
  voice: string;
  outputDir: string;
  speed?: number; // ElevenLabs: 0.7-1.2, default 1.0
  previousText?: string;
  nextText?: string;
  elevenLabs?: ElevenLabsTTSConfig;
}

export interface ResolvedElevenLabsConfig {
  modelId: string;
  outputFormat: string;
  voiceSettings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
    speed: number;
  };
  seed?: number;
}

export interface ElevenLabsRequestPayload {
  text: string;
  model_id: string;
  voice_settings: ResolvedElevenLabsConfig["voiceSettings"];
  seed?: number;
  previous_text?: string;
  next_text?: string;
}

const DEFAULT_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_ELEVENLABS_OUTPUT_FORMAT = "mp3_44100_192";
const ELEVENLABS_CONTEXT_CHARS = 2_000;

export function resolveElevenLabsConfig(
  options: Pick<TTSOptions, "speed" | "elevenLabs">
): ResolvedElevenLabsConfig {
  const config = options.elevenLabs || {};
  const resolved: ResolvedElevenLabsConfig = {
    modelId: config.modelId || DEFAULT_ELEVENLABS_MODEL_ID,
    outputFormat: config.outputFormat || DEFAULT_ELEVENLABS_OUTPUT_FORMAT,
    voiceSettings: {
      stability: config.stability ?? 0.5,
      similarity_boost: config.similarityBoost ?? 0.75,
      style: config.style ?? 0.5,
      use_speaker_boost: config.useSpeakerBoost ?? true,
      speed: options.speed ?? 1,
    },
    ...(config.seed != null && { seed: config.seed }),
  };
  for (const [name, value] of Object.entries({
    stability: resolved.voiceSettings.stability,
    similarityBoost: resolved.voiceSettings.similarity_boost,
    style: resolved.voiceSettings.style,
  })) {
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw new Error(`ElevenLabs ${name} must be between 0 and 1`);
    }
  }
  if (
    !Number.isFinite(resolved.voiceSettings.speed) ||
    resolved.voiceSettings.speed < 0.7 ||
    resolved.voiceSettings.speed > 1.2
  ) {
    throw new Error("ElevenLabs speed must be between 0.7 and 1.2");
  }
  if (!resolved.outputFormat.startsWith("mp3_")) {
    throw new Error(
      "aaron-video-gen currently requires an MP3 ElevenLabs output format"
    );
  }
  if (
    resolved.seed != null &&
    (!Number.isInteger(resolved.seed) ||
      resolved.seed < 0 ||
      resolved.seed > 4_294_967_295)
  ) {
    throw new Error("ElevenLabs seed must be an unsigned 32-bit integer");
  }
  return resolved;
}

export function buildElevenLabsRequestPayload(
  text: string,
  config: ResolvedElevenLabsConfig,
  context: { previousText?: string; nextText?: string } = {}
): ElevenLabsRequestPayload {
  return {
    text,
    model_id: config.modelId,
    voice_settings: config.voiceSettings,
    ...(config.seed != null && { seed: config.seed }),
    ...(context.previousText && { previous_text: context.previousText }),
    ...(context.nextText && { next_text: context.nextText }),
  };
}

export interface WordTiming {
  word: string;
  start: number; // seconds
  end: number;   // seconds
}

export interface TTSResult {
  audioPath: string;
  duration: number; // seconds
  wordTimings?: WordTiming[];
}

/**
 * Generate TTS audio for a text segment.
 */
export async function generateTTS(
  text: string,
  index: number,
  options: TTSOptions
): Promise<TTSResult> {
  if (!existsSync(options.outputDir)) {
    mkdirSync(options.outputDir, { recursive: true });
  }

  const outputPath = join(
    options.outputDir,
    `narration-${String(index).padStart(2, "0")}.mp3`
  );

  let wordTimings: WordTiming[] | undefined;

  if (options.provider === "edge-tts") {
    await generateEdgeTTS(text, outputPath, options.voice);
  } else if (options.provider === "openai") {
    await generateOpenAITTS(text, outputPath, options.voice, options.speed);
  } else if (options.provider === "elevenlabs") {
    wordTimings = await generateElevenLabsTTS(
      text,
      outputPath,
      options.voice,
      options
    );
  } else {
    throw new Error(`Unknown TTS provider: ${options.provider}`);
  }

  const duration = getAudioDuration(outputPath);
  return { audioPath: outputPath, duration, wordTimings };
}

/**
 * Generate TTS using edge-tts (free Microsoft TTS via Python).
 */
async function generateEdgeTTS(
  text: string,
  outputPath: string,
  voice: string
): Promise<void> {
  // Check if edge-tts is available
  try {
    execSync("which edge-tts", { stdio: "pipe" });
  } catch {
    throw new Error(
      "edge-tts not found. Install it with: pip install edge-tts"
    );
  }

  // Write text to a temp file to avoid shell escaping issues
  const tempTextPath = outputPath + ".txt";
  writeFileSync(tempTextPath, text, "utf-8");

  try {
    execSync(
      `edge-tts --voice "${voice}" --file "${tempTextPath}" --write-media "${outputPath}"`,
      { stdio: "pipe", timeout: 120_000 }
    );
  } finally {
    try {
      const { unlinkSync } = await import("fs");
      unlinkSync(tempTextPath);
    } catch {}
  }
}

/**
 * Generate TTS using OpenAI TTS API.
 * Uses gpt-4o-mini-tts for best quality + style control.
 * Falls back to tts-1-hd if OPENAI_TTS_MODEL is set.
 */
async function generateOpenAITTS(
  text: string,
  outputPath: string,
  voice: string,
  speed?: number
): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY not set. Set it in your environment or .baoyu-skills/.env"
    );
  }

  const model = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";

  // gpt-4o-mini-tts supports an instructions parameter for voice style control
  const body: Record<string, unknown> = {
    model,
    input: text,
    voice: voice,
    response_format: "mp3",
  };

  if (speed != null) {
    body.speed = speed;
  }

  if (model === "gpt-4o-mini-tts") {
    body.instructions =
      "You are a popular tech YouTuber narrating a video essay. " +
      "Speak with energy and personality — like you're genuinely excited to share an insight with a friend. " +
      "Vary your pace: speed up slightly during exciting parts, slow down for key takeaways. " +
      "Use natural emphasis on important words. Keep it warm and engaging, never monotone.";
  }

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI TTS API error (${response.status}): ${error}`);
  }

  const buffer = await response.arrayBuffer();
  writeFileSync(outputPath, Buffer.from(buffer));
}

/**
 * Generate TTS using ElevenLabs API.
 * Supports voice cloning — pass a cloned voice ID as the voice parameter.
 */
async function generateElevenLabsTTS(
  text: string,
  outputPath: string,
  voice: string,
  options: TTSOptions
): Promise<WordTiming[]> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ELEVENLABS_API_KEY not set. Set it in your environment or .env file. " +
        "Get a key at https://elevenlabs.io/"
    );
  }

  const config = resolveElevenLabsConfig(options);
  const maxChars = getElevenLabsCharacterLimit(config.modelId);
  if (text.length > maxChars) {
    const chunks = splitTextIntoChunks(text, maxChars);
    const chunkPaths: string[] = [];
    const allTimings: WordTiming[] = [];
    let timeOffset = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunkPath = outputPath.replace(/\.mp3$/, `-chunk${i}.mp3`);
      const previousText = compactElevenLabsContext(
        [options.previousText, chunks[i - 1]].filter(Boolean).join("\n\n"),
        "end"
      );
      const nextText = compactElevenLabsContext(
        [chunks[i + 1], options.nextText].filter(Boolean).join("\n\n"),
        "start"
      );
      const timings = await elevenLabsRequest(
        chunks[i],
        chunkPath,
        voice,
        apiKey,
        config,
        { previousText, nextText }
      );
      // Offset timestamps by cumulative duration of previous chunks
      for (const t of timings) {
        allTimings.push({
          word: t.word,
          start: t.start + timeOffset,
          end: t.end + timeOffset,
        });
      }
      const chunkDuration = getAudioDuration(chunkPath);
      timeOffset += chunkDuration;
      chunkPaths.push(chunkPath);
    }

    // Concatenate chunks
    const { concatenateAudio } = await import("./tts");
    concatenateAudio(chunkPaths, outputPath);

    // Clean up chunk files
    const { unlinkSync } = await import("fs");
    for (const p of chunkPaths) {
      try { unlinkSync(p); } catch {}
    }
    return allTimings;
  }

  return await elevenLabsRequest(text, outputPath, voice, apiKey, config, {
    previousText: compactElevenLabsContext(options.previousText, "end"),
    nextText: compactElevenLabsContext(options.nextText, "start"),
  });
}

/**
 * Extract word timings from ElevenLabs character-level alignment data.
 */
function extractWordTimings(alignment: {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}): WordTiming[] {
  const words: WordTiming[] = [];
  let currentWord = "";
  let wordStart = -1;
  let wordEnd = 0;

  for (let i = 0; i < alignment.characters.length; i++) {
    const char = alignment.characters[i];
    const charStart = alignment.character_start_times_seconds[i];
    const charEnd = alignment.character_end_times_seconds[i];

    if (char === " " || char === "\n" || char === "\t") {
      if (currentWord.length > 0) {
        words.push({ word: currentWord, start: wordStart, end: wordEnd });
        currentWord = "";
        wordStart = -1;
      }
    } else {
      if (wordStart < 0) wordStart = charStart;
      wordEnd = charEnd;
      currentWord += char;
    }
  }
  // Push last word
  if (currentWord.length > 0) {
    words.push({ word: currentWord, start: wordStart, end: wordEnd });
  }

  return words;
}

async function elevenLabsRequest(
  text: string,
  outputPath: string,
  voice: string,
  apiKey: string,
  config: ResolvedElevenLabsConfig,
  context: { previousText?: string; nextText?: string }
): Promise<WordTiming[]> {
  // Use /with-timestamps endpoint for word-level timing
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=${encodeURIComponent(config.outputFormat)}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        buildElevenLabsRequestPayload(text, config, context)
      ),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${error}`);
  }

  const data = (await response.json()) as {
    audio_base64: string;
    alignment: {
      characters: string[];
      character_start_times_seconds: number[];
      character_end_times_seconds: number[];
    };
  };

  // Write audio from base64
  const audioBuffer = Buffer.from(data.audio_base64, "base64");
  writeFileSync(outputPath, audioBuffer);

  // Extract word timings from character alignment
  return extractWordTimings(data.alignment);
}

/**
 * Split text at sentence boundaries to stay under maxChars per chunk.
 */
export function getElevenLabsCharacterLimit(modelId: string): number {
  switch (modelId) {
    case "eleven_v3":
      return 5_000;
    case "eleven_multilingual_v2":
      return 10_000;
    case "eleven_flash_v2_5":
      return 40_000;
    case "eleven_flash_v2":
      return 30_000;
    default:
      return 5_000;
  }
}

export function splitTextIntoChunks(text: string, maxChars: number): string[] {
  if (maxChars < 1) {
    throw new Error("maxChars must be positive");
  }

  const sentences = text.match(/[^.!?]+(?:[.!?]+|$)/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (sentence.length > maxChars) {
      if (current.trim()) {
        chunks.push(current.trim());
        current = "";
      }
      for (let offset = 0; offset < sentence.length; offset += maxChars) {
        const part = sentence.slice(offset, offset + maxChars).trim();
        if (part) chunks.push(part);
      }
      continue;
    }
    if (current.length + sentence.length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = "";
    }
    current += sentence;
  }
  if (current.trim()) {
    chunks.push(current.trim());
  }
  return chunks;
}

function compactElevenLabsContext(
  text: string | undefined,
  side: "start" | "end"
): string | undefined {
  const value = text?.trim();
  if (!value) return undefined;
  if (value.length <= ELEVENLABS_CONTEXT_CHARS) return value;
  return side === "start"
    ? value.slice(0, ELEVENLABS_CONTEXT_CHARS)
    : value.slice(-ELEVENLABS_CONTEXT_CHARS);
}

/**
 * Get audio duration in seconds using ffprobe.
 */
function getAudioDuration(audioPath: string): number {
  try {
    const result = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${audioPath}"`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    );
    return parseFloat(result.trim());
  } catch {
    throw new Error(
      `Failed to get audio duration for ${audioPath}. Is ffprobe/ffmpeg installed?`
    );
  }
}

/**
 * Concatenate multiple audio files into one using FFmpeg.
 */
export function concatenateAudio(
  audioPaths: string[],
  outputPath: string
): void {
  // Create a concat list file
  const listPath = outputPath + ".list.txt";
  const listContent = audioPaths.map((p) => `file '${p}'`).join("\n");
  writeFileSync(listPath, listContent, "utf-8");

  try {
    execSync(
      // Re-encode after concatenation. Stream-copying many MP3 segments
      // preserves encoder padding at every boundary, which accumulates into
      // audible gaps and makes caption timing drift on long-form narration.
      `ffmpeg -y -f concat -safe 0 -i "${listPath}" -c:a libmp3lame -b:a 192k "${outputPath}"`,
      { stdio: "pipe", timeout: 120_000 }
    );
  } finally {
    try {
      const { unlinkSync } = require("fs");
      unlinkSync(listPath);
    } catch {}
  }
}
