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
  kenBurns?: boolean; // enable Ken Burns effect (zoom/pan on images), default true
  subtitlesPath?: string; // path to .srt file for burned-in captions
}

/**
 * Ken Burns effect patterns that cycle across slides.
 */
type KenBurnsPattern = "zoom-in" | "zoom-out" | "pan-right" | "pan-left";
const KB_PATTERNS: KenBurnsPattern[] = [
  "zoom-in",
  "zoom-out",
  "pan-right",
  "pan-left",
];

/**
 * Curated transitions that work well for YouTube explainer videos.
 * Used when transition is set to "varied".
 */
const VARIED_TRANSITIONS = [
  "fade",
  "fadeblack",
  "slideleft",
  "smoothleft",
  "circleopen",
  "dissolve",
];

function buildKenBurnsFilter(
  inputIndex: number,
  pattern: KenBurnsPattern,
  durationFrames: number,
  width: number,
  height: number,
  fps: number
): string {
  // Pre-scale to 1.2x output so zoom/pan has room without quality loss
  const scaleW = Math.round(width * 1.2);
  const scaleH = Math.round(height * 1.2);

  let zExpr: string, xExpr: string, yExpr: string;

  // Note: commas in expressions must be escaped as \, for FFmpeg filter parsing
  switch (pattern) {
    case "zoom-in":
      zExpr = `min(1+0.15*on/${durationFrames}\\,1.15)`;
      xExpr = "iw/2-(iw/zoom/2)";
      yExpr = "ih/2-(ih/zoom/2)";
      break;
    case "zoom-out":
      zExpr = `max(1.15-0.15*on/${durationFrames}\\,1)`;
      xExpr = "iw/2-(iw/zoom/2)";
      yExpr = "ih/2-(ih/zoom/2)";
      break;
    case "pan-right":
      zExpr = "1.1";
      xExpr = `(iw-iw/zoom)*on/${durationFrames}`;
      yExpr = "ih/2-(ih/zoom/2)";
      break;
    case "pan-left":
      zExpr = "1.1";
      xExpr = `(iw-iw/zoom)*(1-on/${durationFrames})`;
      yExpr = "ih/2-(ih/zoom/2)";
      break;
  }

  return (
    `[${inputIndex}:v]scale=${scaleW}:${scaleH}:force_original_aspect_ratio=decrease,` +
    `pad=${scaleW}:${scaleH}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,` +
    `zoompan=z=${zExpr}:x=${xExpr}:y=${yExpr}:d=${durationFrames}:s=${width}x${height}:fps=${fps},` +
    `format=yuv420p[v${inputIndex}]`
  );
}

/**
 * Build and return the FFmpeg command array for a slideshow video.
 */
export function buildFFmpegCommand(
  slides: SlideInput[],
  options: VideoOptions
): string[] {
  const [width, height] = options.resolution.split("x").map(Number);
  const useKenBurns = options.kenBurns !== false; // default true
  const cmd: string[] = ["ffmpeg", "-y"];

  // Add image inputs
  if (useKenBurns) {
    // Single image inputs — zoompan generates video frames
    for (const slide of slides) {
      cmd.push("-i", slide.imagePath);
    }
  } else {
    // Loop images as video streams (original approach)
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

  // Process each image into a video stream
  if (useKenBurns) {
    // Ken Burns: zoompan generates animated video from single images
    for (let i = 0; i < slides.length; i++) {
      const durationFrames = Math.ceil(slides[i].duration * options.fps);
      const pattern = KB_PATTERNS[i % KB_PATTERNS.length];
      filters.push(
        buildKenBurnsFilter(
          i,
          pattern,
          durationFrames,
          width,
          height,
          options.fps
        )
      );
    }
  } else {
    // Original: scale each looped image to target resolution
    for (let i = 0; i < slides.length; i++) {
      filters.push(
        `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
          `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black,` +
          `setsar=1,fps=${options.fps},format=yuv420p[v${i}]`
      );
    }
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

      // Pick transition: cycle through curated list if "varied", otherwise use fixed
      const trans =
        options.transition === "varied"
          ? VARIED_TRANSITIONS[(i - 1) % VARIED_TRANSITIONS.length]
          : options.transition;

      filters.push(
        `${prevLabel}[v${i}]xfade=transition=${trans}:` +
          `duration=${options.transitionDuration}:` +
          `offset=${Math.max(0, cumulativeOffset)}${outLabel}`
      );

      prevLabel = outLabel;
      cumulativeOffset +=
        slides[i].duration - options.transitionDuration;
    }
  }

  // Burn in subtitles if provided (rename video output to allow chaining)
  if (options.subtitlesPath) {
    // Rename [vout] -> [vpre] in the last xfade/null filter, then apply subtitles
    const lastFilterIdx = filters.length - 1;
    filters[lastFilterIdx] = filters[lastFilterIdx].replace("[vout]", "[vpre]");
    const escapedPath = options.subtitlesPath
      .replace(/\\/g, "\\\\")
      .replace(/:/g, "\\:")
      .replace(/'/g, "\\'");
    filters.push(
      `[vpre]subtitles='${escapedPath}':force_style='` +
        `FontName=Arial,FontSize=22,PrimaryColour=&H00FFFFFF,` +
        `OutlineColour=&H00000000,BackColour=&H80000000,` +
        `BorderStyle=4,Outline=1,Shadow=0,MarginV=30'[vout]`
    );
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
