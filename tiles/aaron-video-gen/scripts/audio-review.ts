import { mkdirSync } from "fs";
import { dirname, extname } from "path";
import { spawnSync } from "child_process";

export interface LoudnessMeasurement {
  integratedLufs: number;
  truePeakDb: number;
  loudnessRange: number;
  threshold: number;
  targetOffset: number;
}

export interface AudioProbe {
  durationSeconds: number;
  sampleRate: number;
  channels: number;
  bitRate: number;
}

export interface AudioReviewResult extends AudioProbe {
  integratedLufs: number;
  truePeakDb: number;
  loudnessRange: number;
  longSilenceCount: number;
}

export function deriveAudioReviewPaths(finalPath: string): {
  rawPath: string;
  samplePath: string;
  middleSamplePath: string;
  lateSamplePath: string;
} {
  const extension = extname(finalPath) || ".mp3";
  const stem = finalPath.slice(0, finalPath.length - extension.length);
  return {
    rawPath: `${stem}-raw${extension}`,
    samplePath: `${stem}-sample-60s${extension}`,
    middleSamplePath: `${stem}-sample-middle-60s${extension}`,
    lateSamplePath: `${stem}-sample-late-60s${extension}`,
  };
}

export function parseLoudnormMeasurement(output: string): LoudnessMeasurement {
  const matches = output.match(/\{[\s\S]*?"target_offset"[\s\S]*?\}/g);
  const json = matches?.at(-1);
  if (!json) {
    throw new Error("FFmpeg loudnorm measurement was not found");
  }
  const data = JSON.parse(json) as Record<string, string>;
  return {
    integratedLufs: Number(data.input_i),
    truePeakDb: Number(data.input_tp),
    loudnessRange: Number(data.input_lra),
    threshold: Number(data.input_thresh),
    targetOffset: Number(data.target_offset),
  };
}

export function measureLoudness(audioPath: string): LoudnessMeasurement {
  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-nostats",
      "-i",
      audioPath,
      "-af",
      "loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json",
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf-8", timeout: 300_000 }
  );
  if (result.status !== 0) {
    throw new Error(`FFmpeg loudness analysis failed: ${result.stderr}`);
  }
  return parseLoudnormMeasurement(result.stderr);
}

export function normalizeAudioForReview(
  inputPath: string,
  outputPath: string
): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  const measured = measureLoudness(inputPath);
  const filter = [
    "loudnorm=I=-16:TP=-1.5:LRA=7",
    `measured_I=${measured.integratedLufs}`,
    `measured_TP=${measured.truePeakDb}`,
    `measured_LRA=${measured.loudnessRange}`,
    `measured_thresh=${measured.threshold}`,
    `offset=${measured.targetOffset}`,
    "linear=true",
  ].join(":");
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      inputPath,
      "-af",
      filter,
      "-ar",
      "44100",
      "-ac",
      "1",
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      outputPath,
    ],
    { encoding: "utf-8", timeout: 300_000 }
  );
  if (result.status !== 0) {
    throw new Error(`FFmpeg audio normalization failed: ${result.stderr}`);
  }
}

export function createAudioReviewSample(
  inputPath: string,
  outputPath: string,
  seconds = 60,
  startSeconds = 0
): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      inputPath,
      "-ss",
      String(Math.max(0, startSeconds)),
      "-t",
      String(seconds),
      "-ar",
      "44100",
      "-ac",
      "1",
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      outputPath,
    ],
    { encoding: "utf-8", timeout: 300_000 }
  );
  if (result.status !== 0) {
    throw new Error(`FFmpeg review sample failed: ${result.stderr}`);
  }
}

export interface AudioReviewSampleWindows {
  openingStartSeconds: number;
  middleStartSeconds: number;
  lateStartSeconds: number;
}

/**
 * A long-form clone can sound convincing for a cold open and flatten later.
 * Generate three comparable listening windows from the normalized delivery.
 */
export function createLongFormReviewSamples(
  inputPath: string,
  paths: Pick<
    ReturnType<typeof deriveAudioReviewPaths>,
    "samplePath" | "middleSamplePath" | "lateSamplePath"
  >,
  seconds = 60
): AudioReviewSampleWindows {
  const duration = probeAudio(inputPath).durationSeconds;
  const openingStartSeconds = 0;
  const middleStartSeconds = Math.max(0, duration / 2 - seconds / 2);
  const lateStartSeconds = Math.max(0, duration - seconds);

  createAudioReviewSample(
    inputPath,
    paths.samplePath,
    seconds,
    openingStartSeconds
  );
  createAudioReviewSample(
    inputPath,
    paths.middleSamplePath,
    seconds,
    middleStartSeconds
  );
  createAudioReviewSample(
    inputPath,
    paths.lateSamplePath,
    seconds,
    lateStartSeconds
  );

  return { openingStartSeconds, middleStartSeconds, lateStartSeconds };
}

export function probeAudio(audioPath: string): AudioProbe {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration,bit_rate:stream=sample_rate,channels",
      "-of",
      "json",
      audioPath,
    ],
    { encoding: "utf-8", timeout: 60_000 }
  );
  if (result.status !== 0) {
    throw new Error(`FFprobe failed: ${result.stderr}`);
  }
  const data = JSON.parse(result.stdout) as {
    streams: Array<{ sample_rate?: string; channels?: number }>;
    format: { duration?: string; bit_rate?: string };
  };
  const stream = data.streams[0] || {};
  return {
    durationSeconds: Number(data.format.duration || 0),
    sampleRate: Number(stream.sample_rate || 0),
    channels: Number(stream.channels || 0),
    bitRate: Number(data.format.bit_rate || 0),
  };
}

export function countLongSilences(audioPath: string): number {
  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-nostats",
      "-i",
      audioPath,
      "-af",
      "silencedetect=noise=-40dB:d=2",
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf-8", timeout: 300_000 }
  );
  if (result.status !== 0) {
    throw new Error(`FFmpeg silence detection failed: ${result.stderr}`);
  }
  return (result.stderr.match(/silence_duration:/g) || []).length;
}

export function prepareAudioReview(
  rawPath: string,
  finalPath: string,
  samplePath: string
): AudioReviewResult {
  normalizeAudioForReview(rawPath, finalPath);
  createAudioReviewSample(finalPath, samplePath);
  const probe = probeAudio(finalPath);
  const loudness = measureLoudness(finalPath);
  return {
    ...probe,
    integratedLufs: loudness.integratedLufs,
    truePeakDb: loudness.truePeakDb,
    loudnessRange: loudness.loudnessRange,
    longSilenceCount: countLongSilences(rawPath),
  };
}
