/**
 * TTS generation module.
 * Supports edge-tts (free, via Python CLI) and OpenAI TTS API.
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

export type TTSProvider = "edge-tts" | "openai";

export interface TTSOptions {
  provider: TTSProvider;
  voice: string;
  outputDir: string;
}

export interface TTSResult {
  audioPath: string;
  duration: number; // seconds
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

  if (options.provider === "edge-tts") {
    await generateEdgeTTS(text, outputPath, options.voice);
  } else if (options.provider === "openai") {
    await generateOpenAITTS(text, outputPath, options.voice);
  } else {
    throw new Error(`Unknown TTS provider: ${options.provider}`);
  }

  const duration = getAudioDuration(outputPath);
  return { audioPath: outputPath, duration };
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
