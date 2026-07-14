#!/usr/bin/env node

import {spawnSync} from "node:child_process";
import {mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, isAbsolute, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

function usage() {
  console.log(`Usage:
  node tiles/music-visualizer/scripts/render-photo-essay.mjs \\
    --config <photo-essay.json> --audio <music.mp3> --output <video.mp4> \\
    [--manifest <render.json>] [--description <youtube-description.md>]

The config contains an ordered slide list. Each image is rendered as a slow,
deterministic Ken Burns move and joined with long dissolve transitions.`);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    if (key === "help") args.help = true;
    else args[key] = argv[i + 1];
    if (key !== "help") i += 1;
  }
  return args;
}

function resolveFrom(base, value) {
  return isAbsolute(value) ? value : resolve(base, value);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function creditLine(credit) {
  return [credit.photographer, credit.location, credit.camera].filter(Boolean).join(" · ");
}

function captionTimings({slide, index, config}) {
  const style = config.captionStyle ?? {};
  const start = (index === 0 ? 0 : config.transitionSec) + (style.initialDelaySec ?? 0.8);
  const fadeSec = style.fadeSec ?? 0.7;
  const fadeInEnd = start + fadeSec;
  const outgoingBoundary = index === config.slides.length - 1
    ? slide.durationSec
    : slide.durationSec - config.transitionSec;
  const fadeOutEnd = Math.max(fadeInEnd, outgoingBoundary - (style.exitLeadSec ?? 0.3));
  const holdEnd = Math.max(fadeInEnd, fadeOutEnd - fadeSec);
  return {start, fadeInEnd, holdEnd, fadeOutEnd, fadeSec};
}

function createCaptionAssets({config, outputPath}) {
  const outputDir = resolve(dirname(outputPath), "caption-assets");
  mkdirSync(outputDir, {recursive: true});
  const renderer = resolve(SCRIPT_DIR, "render-photo-caption.swift");
  const style = config.captionStyle ?? {};

  return config.slides.map((slide, index) => {
    if (!slide.credit || !creditLine(slide.credit)) return null;
    const output = resolve(outputDir, `caption-${String(index + 1).padStart(2, "0")}.png`);
    const title = `${slide.credit.caption ?? slide.credit.title ?? "UNTITLED"}  /  ${String(index + 1).padStart(2, "0")}`.toUpperCase();
    const result = spawnSync("swift", [
      renderer,
      "--output", output,
      "--width", String(config.width),
      "--height", String(config.height),
      "--title", title,
      "--detail", creditLine(slide.credit),
      "--font", style.fontName ?? "Avenir Next",
      "--title-size", String(style.titleSize ?? 23),
      "--detail-size", String(style.detailSize ?? 15),
      "--left", String(style.left ?? 72),
      "--title-bottom", String(style.titleBottom ?? 112),
      "--detail-bottom", String(style.detailBottom ?? 84),
    ], {encoding: "utf8"});
    if (result.status !== 0) {
      throw new Error(`Caption renderer failed: ${result.stderr || result.stdout}`);
    }
    return output;
  });
}

function buildYoutubeDescription(config) {
  const title = config.title ?? "Original music-led landscape study";
  const credits = config.slides
    .map((slide, index) => {
      if (!slide.credit) return null;
      const credit = slide.credit;
      const heading = `${String(index + 1).padStart(2, "0")}. ${credit.caption ?? credit.title ?? "Untitled"}`;
      const details = creditLine(credit);
      return [heading, details, credit.sourcePage].filter(Boolean).join("\n");
    })
    .filter(Boolean)
    .join("\n\n");

  return `${title}\n\nOriginal instrumental music and a slow landscape photo essay for reading, quiet work, and reflection.\n\nVISUAL CREDITS\n${credits}\n\nPhotos are used under the Unsplash License. Credits are included in appreciation of the photographers.\n\nMUSIC\nOriginal instrumental music created for Visual And Sound.\n`;
}

function mediaDuration(path) {
  const result = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", path],
    {encoding: "utf8"}
  );
  if (result.status !== 0) throw new Error(`ffprobe failed for ${path}: ${result.stderr}`);
  const duration = Number(result.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(`Invalid media duration for ${path}`);
  return duration;
}

function motionExpressions(motion = "static", frames, amount) {
  const requestedAmount = Number(amount);
  const zoomAmount = Number.isFinite(requestedAmount)
    ? Math.max(0.01, Math.min(requestedAmount, 0.05))
    : 0.03;
  const centerX = "iw/2-(iw/zoom/2)";
  const centerY = "ih/2-(ih/zoom/2)";
  switch (motion) {
    case "static":
      return {z: "1", x: centerX, y: centerY};
    case "zoom-out":
      return {z: `1+${zoomAmount}-${zoomAmount}*on/${frames}`, x: centerX, y: centerY};
    case "pan-left":
      return {z: "1.04", x: `(iw-iw/zoom)*(1-on/${frames})`, y: centerY};
    case "pan-right":
      return {z: "1.04", x: `(iw-iw/zoom)*on/${frames}`, y: centerY};
    case "zoom-in":
    default:
      return {z: `1+${zoomAmount}*on/${frames}`, x: centerX, y: centerY};
  }
}

function assertPhotoEssay(config) {
  if (!Array.isArray(config.slides) || config.slides.length < 2) {
    throw new Error("Photo essay requires at least two slides.");
  }
  if (!Number.isFinite(config.width) || !Number.isFinite(config.height) || !Number.isFinite(config.fps)) {
    throw new Error("Config requires numeric width, height, and fps.");
  }
  if (!Number.isFinite(config.transitionSec) || config.transitionSec <= 0) {
    throw new Error("Config requires a positive transitionSec.");
  }
  for (const slide of config.slides) {
    if (!slide.image || !Number.isFinite(slide.durationSec) || slide.durationSec <= config.transitionSec) {
      throw new Error("Every slide needs image and durationSec greater than transitionSec.");
    }
    if (["static", "zoom-in", "zoom-out", "pan-left", "pan-right"].includes(slide.motion ?? "static") === false) {
      throw new Error(`Unsupported photo motion: ${slide.motion}`);
    }
    if (["pan-left", "pan-right"].includes(slide.motion) && config.allowPanning !== true) {
      throw new Error("Panning is opt-in. Set allowPanning=true only after visual review.");
    }
    if (slide.motionAmount !== undefined && (!Number.isFinite(slide.motionAmount) || slide.motionAmount < 0.01 || slide.motionAmount > 0.05)) {
      throw new Error("motionAmount must be between 0.01 and 0.05.");
    }
  }
}

function buildCommand({config, configDir, audioPath, outputPath, captionPaths}) {
  const command = ["ffmpeg", "-y"];
  const width = config.width;
  const height = config.height;
  const fps = config.fps;
  const transition = config.transitionSec;
  const frames = config.slides.map((slide) => Math.round(slide.durationSec * fps));
  const timelineSec = config.slides.reduce((sum, slide) => sum + slide.durationSec, 0) - transition * (config.slides.length - 1);

  for (const slide of config.slides) command.push("-i", resolveFrom(configDir, slide.image));
  const captionInputIndexes = [];
  for (const captionPath of captionPaths) {
    if (!captionPath) {
      captionInputIndexes.push(null);
      continue;
    }
    captionInputIndexes.push(config.slides.length + captionInputIndexes.filter((entry) => entry !== null).length);
    command.push("-loop", "1", "-framerate", String(fps), "-t", String(config.slides[captionInputIndexes.length - 1].durationSec), "-i", captionPath);
  }
  command.push("-i", audioPath);

  const filters = [];
  config.slides.forEach((slide, index) => {
    const motion = motionExpressions(slide.motion, frames[index], slide.motionAmount);
    const overscanFactor = slide.motion === "static" ? 1 : 1.06;
    const overscanWidth = Math.ceil(width * overscanFactor / 2) * 2;
    const overscanHeight = Math.ceil(height * overscanFactor / 2) * 2;
    const baseLabel = `[b${index}]`;
    filters.push(
      `[${index}:v]scale=${overscanWidth}:${overscanHeight}:force_original_aspect_ratio=increase,` +
      `crop=${overscanWidth}:${overscanHeight},setsar=1,` +
      `zoompan=z='${motion.z}':x='${motion.x}':y='${motion.y}':d=${frames[index]}:s=${width}x${height}:fps=${fps},` +
      `format=yuv420p,setsar=1${baseLabel}`
    );
    const captionIndex = captionInputIndexes[index];
    if (captionIndex === null) {
      filters.push(`${baseLabel}null[v${index}]`);
    } else {
      const timing = captionTimings({slide, index, config});
      filters.push(
        `[${captionIndex}:v]format=rgba,fade=t=in:st=${timing.start.toFixed(3)}:d=${timing.fadeSec.toFixed(3)}:alpha=1,` +
        `fade=t=out:st=${timing.holdEnd.toFixed(3)}:d=${timing.fadeSec.toFixed(3)}:alpha=1[c${index}]`,
        `${baseLabel}[c${index}]overlay=shortest=1:format=auto[v${index}]`
      );
    }
  });

  let previous = "[v0]";
  let offset = config.slides[0].durationSec - transition;
  for (let index = 1; index < config.slides.length; index += 1) {
    const label = index === config.slides.length - 1 ? "[vout]" : `[xf${index}]`;
    filters.push(`${previous}[v${index}]xfade=transition=fade:duration=${transition}:offset=${offset.toFixed(3)}${label}`);
    previous = label;
    offset += config.slides[index].durationSec - transition;
  }

  const audioIndex = config.slides.length + captionPaths.filter(Boolean).length;
  const fadeSec = Math.min(1.5, timelineSec / 4);
  const fadeOutStart = Math.max(0, timelineSec - fadeSec);
  filters.push(`[vout]fade=t=out:st=${fadeOutStart.toFixed(3)}:d=${fadeSec.toFixed(3)}[vfinal]`);
  filters.push(
    `[${audioIndex}:a]atrim=duration=${timelineSec.toFixed(3)},asetpts=N/SR/TB,` +
    `afade=t=in:st=0:d=${fadeSec.toFixed(3)},afade=t=out:st=${fadeOutStart.toFixed(3)}:d=${fadeSec.toFixed(3)}[aout]`
  );

  command.push(
    "-filter_complex", filters.join(";"),
    "-map", "[vfinal]",
    "-map", "[aout]",
    "-t", timelineSec.toFixed(3),
    "-r", String(fps),
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", String(config.crf ?? 18),
    "-c:a", "aac",
    "-b:a", "256k",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    outputPath
  );

  return {command, timelineSec, inputAudioDurationSec: mediaDuration(audioPath)};
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return usage();
  if (!args.config || !args.audio || !args.output) {
    usage();
    process.exitCode = 1;
    return;
  }

  const configPath = resolve(args.config);
  const configDir = dirname(configPath);
  const config = readJson(configPath);
  assertPhotoEssay(config);
  const audioPath = resolve(args.audio);
  const outputPath = resolve(args.output);
  mkdirSync(dirname(outputPath), {recursive: true});

  const captionPaths = createCaptionAssets({config, outputPath});
  const {command, timelineSec, inputAudioDurationSec} = buildCommand({config, configDir, audioPath, outputPath, captionPaths});
  const result = spawnSync(command[0], command.slice(1), {stdio: "inherit"});
  if (result.status !== 0) throw new Error(`FFmpeg failed with exit code ${result.status ?? "unknown"}`);

  const manifestPath = args.manifest
    ? resolve(args.manifest)
    : resolve(dirname(outputPath), "photo-essay-render.json");
  const descriptionPath = args.description
    ? resolve(args.description)
    : resolve(dirname(outputPath), "youtube-description.md");
  writeFileSync(descriptionPath, buildYoutubeDescription(config));
  writeFileSync(manifestPath, JSON.stringify({
    renderedAt: new Date().toISOString(),
    configPath,
    audioPath,
    outputPath,
    timelineSec,
    inputAudioDurationSec,
    slides: config.slides,
    transition: "fade",
    descriptionPath,
  }, null, 2));
  console.log(`Rendered ${timelineSec.toFixed(3)}s photo essay → ${outputPath}`);
}

main();
