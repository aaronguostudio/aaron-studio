#!/usr/bin/env bun
import { execFileSync } from "child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { basename, dirname, join, resolve } from "path";

type WordTiming = {
  word: string;
  start: number;
  end: number;
};

type SourceSegment = {
  id: string;
  title: string;
  start: number;
  end: number;
  duration: number;
};

type SourceManifest = {
  timeline: {
    duration: number;
    segments: SourceSegment[];
    wordTimings: WordTiming[];
  };
};

type TargetTimeline = {
  narrationOffsetSec: number;
  segments: Array<{
    id: string;
    start: number;
    end: number;
    duration: number;
  }>;
};

export type RetimePlanEntry = {
  source: SourceSegment;
  target: TargetTimeline["segments"][number];
  outputDuration: number;
  sourceToOutputScale: number;
  atempo: number;
  outputAudioStart: number;
  outputVisualStart: number;
};

const targetIds = [
  "hook",
  "deployment",
  "factory",
  "backprop",
  "workflow",
  "comparison",
  "ownership",
  "actor",
  "tokens",
] as const;

const sourceIdForIndex = (index: number): string =>
  index === 0 ? "hook" : `slide-${String(index).padStart(2, "0")}`;

export function buildRetimePlan(
  sourceTimeline: SourceManifest["timeline"],
  targetTimeline: TargetTimeline,
  speechRate: number,
): RetimePlanEntry[] {
  if (!Number.isFinite(speechRate) || speechRate <= 0) {
    throw new Error("speechRate must be a positive number");
  }
  if (sourceTimeline.segments.length !== targetIds.length) {
    throw new Error(
      `Expected ${targetIds.length} source segments, received ${sourceTimeline.segments.length}`,
    );
  }

  return targetIds.map((targetId, index) => {
    const sourceId = sourceIdForIndex(index);
    const source = sourceTimeline.segments.find((segment) => segment.id === sourceId);
    const target = targetTimeline.segments.find((segment) => segment.id === targetId);
    if (!source || !target) {
      throw new Error(`Missing segment mapping: ${sourceId} -> ${targetId}`);
    }
    const outputDuration = target.duration / speechRate;
    const sourceToOutputScale = outputDuration / source.duration;
    return {
      source,
      target,
      outputDuration,
      sourceToOutputScale,
      atempo: 1 / sourceToOutputScale,
      outputAudioStart: (target.start - targetTimeline.narrationOffsetSec) / speechRate,
      outputVisualStart:
        targetTimeline.narrationOffsetSec +
        (target.start - targetTimeline.narrationOffsetSec) / speechRate,
    };
  });
}

export function retimeWordTimings(
  wordTimings: WordTiming[],
  plan: RetimePlanEntry[],
): WordTiming[] {
  return plan.flatMap((entry, index) =>
    wordTimings
      .filter(
        (word) =>
          word.start >= entry.source.start - 0.002 &&
          (index === plan.length - 1
            ? word.start <= entry.source.end + 0.002
            : word.start < entry.source.end - 0.002),
      )
      .map((word) => ({
        word: word.word,
        start:
          entry.outputVisualStart +
          (word.start - entry.source.start) * entry.sourceToOutputScale,
        end:
          entry.outputVisualStart +
          (word.end - entry.source.start) * entry.sourceToOutputScale,
      })),
  );
}

export function atempoFilter(rate: number): string {
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("atempo rate must be positive");
  }
  const filters: string[] = [];
  let remainder = rate;
  while (remainder > 2) {
    filters.push("atempo=2");
    remainder /= 2;
  }
  while (remainder < 0.5) {
    filters.push("atempo=0.5");
    remainder /= 0.5;
  }
  filters.push(`atempo=${remainder.toFixed(8)}`);
  return filters.join(",");
}

function parseArgs(): Record<string, string> {
  const values: Record<string, string> = {};
  for (let index = 2; index < process.argv.length; index += 1) {
    const key = process.argv[index];
    if (!key.startsWith("--")) continue;
    const value = process.argv[index + 1];
    if (value && !value.startsWith("--")) {
      values[key.slice(2)] = value;
      index += 1;
    }
  }
  return values;
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function mediaDuration(path: string): number {
  return Number(
    execFileSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
      { encoding: "utf-8" },
    ).trim(),
  );
}

function main(): void {
  const args = parseArgs();
  const required = ["source-manifest", "source-audio", "target-timeline", "speech-rate", "output-audio", "output-timings"];
  for (const key of required) {
    if (!args[key]) throw new Error(`--${key} is required`);
  }

  const sourceManifestPath = resolve(args["source-manifest"]);
  const sourceAudioPath = resolve(args["source-audio"]);
  const targetTimelinePath = resolve(args["target-timeline"]);
  const outputAudioPath = resolve(args["output-audio"]);
  const outputTimingsPath = resolve(args["output-timings"]);
  const reportPath = resolve(args.report || `${outputTimingsPath}.md`);
  const speechRate = Number(args["speech-rate"]);

  for (const path of [sourceManifestPath, sourceAudioPath, targetTimelinePath]) {
    if (!existsSync(path)) throw new Error(`Missing input: ${path}`);
  }

  const sourceManifest = readJson<SourceManifest>(sourceManifestPath);
  const targetTimeline = readJson<TargetTimeline>(targetTimelinePath);
  const plan = buildRetimePlan(sourceManifest.timeline, targetTimeline, speechRate);
  const wordTimings = retimeWordTimings(sourceManifest.timeline.wordTimings, plan);
  const tempDir = `${outputAudioPath}.segments`;
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir, { recursive: true });
  mkdirSync(dirname(outputAudioPath), { recursive: true });
  mkdirSync(dirname(outputTimingsPath), { recursive: true });

  const segmentPaths = plan.map((entry, index) => {
    const segmentPath = join(tempDir, `${String(index).padStart(2, "0")}-${entry.target.id}.mp3`);
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-ss",
        String(entry.source.start),
        "-t",
        String(entry.source.duration),
        "-i",
        sourceAudioPath,
        "-af",
        atempoFilter(entry.atempo),
        "-ar",
        "44100",
        "-ac",
        "1",
        "-c:a",
        "libmp3lame",
        "-b:a",
        "192k",
        segmentPath,
      ],
      { stdio: "pipe" },
    );
    return segmentPath;
  });

  const concatListPath = join(tempDir, "concat.txt");
  writeFileSync(
    concatListPath,
    segmentPaths.map((path) => `file '${path.replace(/'/g, "'\\''")}'`).join("\n"),
    "utf-8",
  );
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatListPath,
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      outputAudioPath,
    ],
    { stdio: "pipe" },
  );

  const targetDuration = plan.reduce((total, entry) => total + entry.outputDuration, 0);
  const outputDuration = mediaDuration(outputAudioPath);
  const payload = {
    schema_version: 1,
    source_manifest: sourceManifestPath,
    source_audio: sourceAudioPath,
    target_timeline: targetTimelinePath,
    speech_rate: speechRate,
    output_audio: outputAudioPath,
    target_audio_duration_sec: targetDuration,
    output_audio_duration_sec: outputDuration,
    plan,
    wordTimings,
  };
  writeFileSync(outputTimingsPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  writeFileSync(
    reportPath,
    [
      "# FDE Audio Retime Report",
      "",
      `- Source: \`${basename(sourceAudioPath)}\``,
      `- Output: \`${basename(outputAudioPath)}\``,
      `- Source chapters: ${plan.length}`,
      `- Caption words: ${wordTimings.length}`,
      `- Target duration: ${targetDuration.toFixed(3)}s`,
      `- Output duration: ${outputDuration.toFixed(3)}s`,
      "",
      "| Chapter | Source duration | Target duration | atempo |",
      "| --- | ---: | ---: | ---: |",
      ...plan.map(
        (entry) =>
          `| ${entry.target.id} | ${entry.source.duration.toFixed(3)}s | ${entry.outputDuration.toFixed(3)}s | ${entry.atempo.toFixed(4)} |`,
      ),
      "",
    ].join("\n"),
    "utf-8",
  );
  rmSync(tempDir, { recursive: true, force: true });
  console.log(`[retime-fde-audio] ${outputAudioPath}`);
  console.log(`[retime-fde-audio] ${outputTimingsPath}`);
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    console.error(
      `[retime-fde-audio] ${(error as Error).message}`,
    );
    process.exit(1);
  }
}
