/**
 * FFmpeg command builder for slideshow video generation.
 * Constructs filter_complex graphs for image slideshows with transitions.
 */

import { execSync } from "child_process";

export interface SlideInput {
  imagePath: string;
  duration: number; // seconds (from narration + padding)
}

export interface VideoOptions {
  resolution: string; // e.g. "1920x1080"
  transition: string; // e.g. "fade", "fadeblack", "wipeleft"
  transitionDuration: number; // seconds
  fps: number;
  narrationPath: string; // concatenated narration audio
  musicPath?: string; // optional background music
  musicVolume: number; // 0.0-1.0
  outputPath: string;
}

/**
 * Build and return the FFmpeg command array for a slideshow video.
 */
export function buildFFmpegCommand(
  slides: SlideInput[],
  options: VideoOptions
): string[] {
  const [width, height] = options.resolution.split("x").map(Number);
  const cmd: string[] = ["ffmpeg", "-y"];

  // Add image inputs
  for (const slide of slides) {
    cmd.push(
      "-loop",
      "1",
      "-t",
      String(slide.duration),
      "-i",
      slide.imagePath
    );
  }

  // Add narration audio input
  cmd.push("-i", options.narrationPath);
  const narrationInputIndex = slides.length;

  // Add background music input if provided
  let musicInputIndex: number | undefined;
  if (options.musicPath) {
    cmd.push("-stream_loop", "-1", "-i", options.musicPath);
    musicInputIndex = slides.length + 1;
  }

  // Build filter_complex
  const filters: string[] = [];

  // Scale each image to target resolution with padding (letterbox/pillarbox)
  for (let i = 0; i < slides.length; i++) {
    filters.push(
      `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
        `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black,` +
        `setsar=1,fps=${options.fps},format=yuv420p[v${i}]`
    );
  }

  // Chain xfade transitions between slides
  if (slides.length === 1) {
    // Single slide, no transitions needed
    filters.push(`[v0]null[vout]`);
  } else {
    let prevLabel = "[v0]";
    let cumulativeOffset = slides[0].duration - options.transitionDuration;

    for (let i = 1; i < slides.length; i++) {
      const isLast = i === slides.length - 1;
      const outLabel = isLast ? "[vout]" : `[vt${i}]`;

      filters.push(
        `${prevLabel}[v${i}]xfade=transition=${options.transition}:` +
          `duration=${options.transitionDuration}:` +
          `offset=${Math.max(0, cumulativeOffset)}${outLabel}`
      );

      prevLabel = outLabel;
      cumulativeOffset +=
        slides[i].duration - options.transitionDuration;
    }
  }

  // Audio mixing: narration + optional background music
  if (musicInputIndex !== undefined) {
    filters.push(
      `[${musicInputIndex}:a]volume=${options.musicVolume}[bgm]`,
      `[${narrationInputIndex}:a][bgm]amix=inputs=2:duration=first:dropout_transition=3[aout]`
    );
  } else {
    filters.push(`[${narrationInputIndex}:a]anull[aout]`);
  }

  cmd.push("-filter_complex", filters.join(";"));

  // Map outputs
  cmd.push("-map", "[vout]", "-map", "[aout]");

  // Encoding settings
  cmd.push(
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "23",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-pix_fmt",
    "yuv420p",
    "-shortest",
    options.outputPath
  );

  return cmd;
}

/**
 * Execute the FFmpeg command.
 */
export function executeFFmpeg(cmd: string[]): void {
  // Check if FFmpeg is available
  try {
    execSync("which ffmpeg", { stdio: "pipe" });
  } catch {
    throw new Error(
      "ffmpeg not found. Install it with: brew install ffmpeg"
    );
  }

  const cmdString = cmd
    .map((arg) => (arg.includes(" ") || arg.includes(";") ? `'${arg}'` : arg))
    .join(" ");

  console.log("\n[ffmpeg] Rendering video...");
  execSync(cmdString, { stdio: "inherit", timeout: 600_000 });
}

/**
 * Format the FFmpeg command for display (dry-run).
 */
export function formatCommand(cmd: string[]): string {
  // Pretty-print with line breaks for readability
  const parts: string[] = [];
  let i = 0;
  while (i < cmd.length) {
    const arg = cmd[i];
    if (arg === "-filter_complex") {
      parts.push(`  ${arg} \\\n    '${cmd[i + 1]}'`);
      i += 2;
    } else if (arg.startsWith("-")) {
      if (i + 1 < cmd.length && !cmd[i + 1].startsWith("-")) {
        parts.push(`  ${arg} ${cmd[i + 1]}`);
        i += 2;
      } else {
        parts.push(`  ${arg}`);
        i += 1;
      }
    } else if (i === 0) {
      parts.push(arg);
      i += 1;
    } else {
      parts.push(`  ${arg}`);
      i += 1;
    }
  }
  return parts.join(" \\\n");
}
