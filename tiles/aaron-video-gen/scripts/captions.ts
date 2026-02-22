/**
 * Caption generation using OpenAI Whisper.
 * Generates SRT subtitle files from narration audio.
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

/**
 * Generate an SRT subtitle file from audio using Whisper.
 * Returns the path to the generated .srt file.
 */
export function generateCaptions(
  audioPath: string,
  outputDir: string,
  language: string = "en"
): string {
  // Check if whisper is available
  try {
    execSync("which whisper", { stdio: "pipe" });
  } catch {
    throw new Error(
      "whisper not found. Install it with: pip install openai-whisper"
    );
  }

  console.log(`[captions] Generating subtitles from: ${audioPath}`);

  execSync(
    `whisper "${audioPath}" --model medium --output_format srt --language ${language} --output_dir "${outputDir}"`,
    { stdio: "inherit", timeout: 600_000 }
  );

  // Whisper outputs <filename_without_ext>.srt
  const baseName = audioPath
    .split("/")
    .pop()!
    .replace(/\.[^.]+$/, "");
  const srtPath = join(outputDir, `${baseName}.srt`);

  if (!existsSync(srtPath)) {
    throw new Error(`Expected SRT file not found: ${srtPath}`);
  }

  console.log(`[captions] Generated: ${srtPath}`);
  return srtPath;
}

/**
 * Build FFmpeg subtitle filter string for burning captions into video.
 * Uses the ASS subtitle renderer for styled output.
 */
export function buildSubtitleFilter(srtPath: string): string {
  // Escape special characters in path for FFmpeg filter
  const escapedPath = srtPath
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'");

  return (
    `subtitles='${escapedPath}':force_style='` +
    `FontName=Arial,FontSize=22,PrimaryColour=&H00FFFFFF,` +
    `OutlineColour=&H00000000,BackColour=&H80000000,` +
    `BorderStyle=4,Outline=1,Shadow=0,MarginV=30'`
  );
}
