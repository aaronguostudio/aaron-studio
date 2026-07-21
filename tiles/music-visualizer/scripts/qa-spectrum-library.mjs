#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const libraryRoot = resolve(process.argv[2] || join(ROOT, "src/content/music-visualizer/spectrum-demos-v1"));
const catalog = JSON.parse(readFileSync(join(libraryRoot, "catalog.json"), "utf8"));

const hashFile = (filePath) => createHash("sha256").update(readFileSync(filePath)).digest("hex");
const probe = (filePath) => {
  const result = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "stream=codec_name,codec_type,width,height,r_frame_rate,nb_frames,duration",
    "-show_entries", "format=duration,size",
    "-of", "json",
    filePath,
  ], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`ffprobe failed: ${filePath}`);
  return JSON.parse(result.stdout);
};

const decode = (filePath) => spawnSync("ffmpeg", ["-v", "error", "-i", filePath, "-f", "null", "-"], { encoding: "utf8" });
const walk = (directory) => readdirSync(directory).flatMap((name) => {
  const filePath = join(directory, name);
  return statSync(filePath).isDirectory() ? walk(filePath) : [filePath];
});

const styles = catalog.styles.map((style) => {
  const directory = join(libraryRoot, style.slug);
  const videoPath = join(directory, `${style.slug}.mp4`);
  const analysisPath = join(directory, "audio-analysis.json");
  const audioPath = join(directory, "music.mp3");
  const contactSheetPath = join(directory, "contact-sheet.jpg");
  const previewPath = join(directory, "preview.png");
  for (const filePath of [videoPath, analysisPath, audioPath, contactSheetPath, previewPath]) {
    if (!existsSync(filePath)) throw new Error(`Missing library artifact: ${filePath}`);
  }
  const media = probe(videoPath);
  const video = media.streams.find((stream) => stream.codec_type === "video");
  const audio = media.streams.find((stream) => stream.codec_type === "audio");
  const decoded = decode(videoPath);
  const checks = {
    decoded: decoded.status === 0,
    resolution: video?.width === 1920 && video?.height === 1080,
    frameRate: video?.r_frame_rate === "30/1",
    frameCount: Number(video?.nb_frames) === 1260,
    audioCodec: audio?.codec_name === "aac",
    durationDeltaMs: Number(((Number(audio?.duration) - Number(video?.duration)) * 1000).toFixed(3)),
  };
  if (!checks.decoded || !checks.resolution || !checks.frameRate || !checks.frameCount || !checks.audioCodec || Math.abs(checks.durationDeltaMs) > 33.4) {
    throw new Error(`QA failed for ${style.id}: ${JSON.stringify(checks)}`);
  }
  return {
    ...style,
    videoPath,
    analysisSha256: hashFile(analysisPath),
    audioSha256: hashFile(audioPath),
    checks,
  };
});

const temporaryRenders = walk(libraryRoot).filter((filePath) => filePath.endsWith(".render.mp4"));
if (temporaryRenders.length) throw new Error(`Temporary render files remain: ${temporaryRenders.join(", ")}`);
const analysisHashes = [...new Set(styles.map((style) => style.analysisSha256))];
const audioHashes = [...new Set(styles.map((style) => style.audioSha256))];
if (analysisHashes.length !== 1 || audioHashes.length !== 1) throw new Error("Library styles do not share identical audio and analysis inputs.");

const showcasePath = join(libraryRoot, "spectrum-library-showcase.mp4");
const showcaseDecode = decode(showcasePath);
const showcaseProbe = probe(showcasePath);
if (showcaseDecode.status !== 0) throw new Error("Showcase decode failed.");

const report = {
  generatedAt: new Date().toISOString(),
  status: "pass",
  styleCount: styles.length,
  sharedAnalysisSha256: analysisHashes[0],
  sharedAudioSha256: audioHashes[0],
  temporaryRenderCount: temporaryRenders.length,
  styles,
  showcase: {
    path: showcasePath,
    decoded: true,
    media: showcaseProbe,
  },
};
writeFileSync(join(libraryRoot, "qa-report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Spectrum library QA: PASS (${styles.length} styles)`);
