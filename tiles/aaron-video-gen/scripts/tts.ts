/**
 * TTS generation module.
 * Supports edge-tts (free, via Python CLI) and OpenAI TTS API.
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

export type TTSProvider = "edge-tts" | "openai" | "elevenlabs";

export interface TTSOptions {
  provider: TTSProvider;
  voice: string;
  outputDir: string;
  speed?: number; // ElevenLabs: 0.7-1.2, default 1.0
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
    await generateOpenAITTS(text, outputPath, options.voice);
  } else if (options.provider === "elevenlabs") {
    wordTimings = await generateElevenLabsTTS(text, outputPath, options.voice, options.speed);
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
 */
async function generateOpenAITTS(
  text: string,
  outputPath: string,
  voice: string
): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY not set. Set it in your environment or .baoyu-skills/.env"
    );
  }

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1-hd",
      input: text,
      voice: voice,
      response_format: "mp3",
    }),
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
  speed?: number
): Promise<WordTiming[]> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ELEVENLABS_API_KEY not set. Set it in your environment or .env file. " +
        "Get a key at https://elevenlabs.io/"
    );
  }

  // ElevenLabs has a 5000 char limit per request for most models.
  // Split long text into chunks and concatenate.
  const MAX_CHARS = 4500;
  if (text.length > MAX_CHARS) {
    const chunks = splitTextIntoChunks(text, MAX_CHARS);
    const chunkPaths: string[] = [];
    const allTimings: WordTiming[] = [];
    let timeOffset = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunkPath = outputPath.replace(/\.mp3$/, `-chunk${i}.mp3`);
      const timings = await elevenLabsRequest(chunks[i], chunkPath, voice, apiKey, speed);
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

  return await elevenLabsRequest(text, outputPath, voice, apiKey, speed);
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
  speed?: number
): Promise<WordTiming[]> {
  // Use /with-timestamps endpoint for word-level timing
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
          ...(speed != null && { speed }),
        },
      }),
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
function splitTextIntoChunks(text: string, maxChars: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
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
      `ffmpeg -y -f concat -safe 0 -i "${listPath}" -c copy "${outputPath}"`,
      { stdio: "pipe", timeout: 120_000 }
    );
  } finally {
    try {
      const { unlinkSync } = require("fs");
      unlinkSync(listPath);
    } catch {}
  }
}
