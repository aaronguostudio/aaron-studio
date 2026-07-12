#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

export type DirectorNarrativeRole =
  | "hook"
  | "evidence"
  | "explain"
  | "challenge"
  | "framework"
  | "resolve";

export type DirectorVisualMode =
  | "motion"
  | "source-evidence"
  | "screen-capture"
  | "generated-still"
  | "generated-video"
  | "hybrid";

export type DirectorIntensity = "calm" | "structured" | "signature";
export type DirectorEntryMode = "meaningful" | "bridge";

export interface DirectorBeat {
  id: string;
  start_sec: number;
  end_sec: number;
  narrative_role: DirectorNarrativeRole;
  visual_mode: DirectorVisualMode;
  intensity: DirectorIntensity;
  entry_mode: DirectorEntryMode;
  entry_visual: string;
  first_visual_change_sec: number;
  visual_reason: string;
  camera_or_motion: string;
  asset_id?: string;
  asset_provenance: string;
  generated_video_sec?: number;
  sound_cue: string;
  transition_out: string;
  fallback: string;
}

export interface DirectorPlan {
  schema_version: number;
  title: string;
  duration_sec: number;
  product_promise: string;
  visual_budget: {
    remotion_motion_target_ratio: number;
    evidence_or_still_target_ratio: number;
    max_generated_video_ratio: number;
    max_generated_video_beats: number;
  };
  beats: DirectorBeat[];
}

export interface DirectorPlanAuditResult {
  passed: boolean;
  failures: string[];
  warnings: string[];
  summaryMarkdown: string;
}

const allowedNarrativeRoles: DirectorNarrativeRole[] = [
  "hook",
  "evidence",
  "explain",
  "challenge",
  "framework",
  "resolve",
];
const allowedVisualModes: DirectorVisualMode[] = [
  "motion",
  "source-evidence",
  "screen-capture",
  "generated-still",
  "generated-video",
  "hybrid",
];
const allowedIntensities: DirectorIntensity[] = [
  "calm",
  "structured",
  "signature",
];
const allowedEntryModes: DirectorEntryMode[] = ["meaningful", "bridge"];

export function parseDirectorPlan(text: string): DirectorPlan {
  return JSON.parse(text) as DirectorPlan;
}

function labelFor(beat: DirectorBeat, index: number): string {
  return beat?.id || `beat-${index + 1}`;
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function auditDirectorPlan(plan: DirectorPlan): DirectorPlanAuditResult {
  const failures: string[] = [];
  const warnings: string[] = [];
  const beats = Array.isArray(plan?.beats) ? plan.beats : [];
  const seen = new Set<string>();

  if (plan?.schema_version !== 1) {
    failures.push("director plan schema_version must be 1");
  }
  if (!hasText(plan?.title)) failures.push("director plan title is missing");
  if (!(plan?.duration_sec > 0)) {
    failures.push("director plan duration_sec must be positive");
  }
  if (!hasText(plan?.product_promise)) {
    failures.push("director plan product_promise is missing");
  }
  if (!plan?.visual_budget) {
    failures.push("director plan visual_budget is missing");
  } else {
    const budget = plan.visual_budget;
    if (!(budget.remotion_motion_target_ratio >= 0 && budget.remotion_motion_target_ratio <= 1)) {
      failures.push("visual_budget.remotion_motion_target_ratio must be between 0 and 1");
    }
    if (!(budget.evidence_or_still_target_ratio >= 0 && budget.evidence_or_still_target_ratio <= 1)) {
      failures.push("visual_budget.evidence_or_still_target_ratio must be between 0 and 1");
    }
    if (!(budget.max_generated_video_ratio >= 0 && budget.max_generated_video_ratio <= 0.2)) {
      failures.push("visual_budget.max_generated_video_ratio must be between 0 and 0.2");
    }
    if (!(budget.max_generated_video_beats >= 0 && Number.isInteger(budget.max_generated_video_beats))) {
      failures.push("visual_budget.max_generated_video_beats must be a non-negative integer");
    }
  }
  if (beats.length === 0) failures.push("director plan has no beats");

  let generatedVideoDuration = 0;
  let generatedVideoBeats = 0;
  let signatureDuration = 0;

  beats.forEach((beat, index) => {
    const label = labelFor(beat, index);
    const duration = beat.end_sec - beat.start_sec;

    if (!hasText(beat?.id)) {
      failures.push(`beat ${index + 1} is missing id`);
    } else if (seen.has(beat.id)) {
      failures.push(`duplicate director beat id ${beat.id}`);
    } else {
      seen.add(beat.id);
    }
    if (!(beat.start_sec >= 0) || !(beat.end_sec > beat.start_sec)) {
      failures.push(`${label} has an invalid time range`);
    }
    if (index === 0 && Math.abs(beat.start_sec) > 0.25) {
      failures.push(`${label} must begin at 0 seconds`);
    }
    if (index > 0) {
      const delta = beat.start_sec - beats[index - 1].end_sec;
      if (Math.abs(delta) > 0.5) {
        failures.push(
          `${label} has a ${delta > 0 ? "gap" : "overlap"} of ${Math.abs(delta).toFixed(1)}s`,
        );
      }
    }
    if (!allowedNarrativeRoles.includes(beat.narrative_role)) {
      failures.push(`${label} has an invalid narrative_role`);
    }
    if (!allowedVisualModes.includes(beat.visual_mode)) {
      failures.push(`${label} has an invalid visual_mode`);
    }
    if (!allowedIntensities.includes(beat.intensity)) {
      failures.push(`${label} has an invalid intensity`);
    }
    if (!allowedEntryModes.includes(beat.entry_mode)) {
      failures.push(`${label} begins on a blank or invalid stage`);
    }
    if (!hasText(beat.entry_visual)) {
      failures.push(`${label} is missing entry_visual`);
    }
    if (
      !(beat.first_visual_change_sec >= 0) ||
      beat.first_visual_change_sec > duration
    ) {
      failures.push(`${label} has an invalid first_visual_change_sec`);
    } else if (beat.entry_mode === "bridge" && beat.first_visual_change_sec > 1) {
      failures.push(`${label} bridge waits more than 1s for its first visual change`);
    } else if (
      beat.entry_mode === "meaningful" &&
      beat.first_visual_change_sec > 8
    ) {
      warnings.push(`${label} holds its opening visual for more than 8s`);
    }
    for (const field of [
      "visual_reason",
      "camera_or_motion",
      "asset_provenance",
      "sound_cue",
      "transition_out",
      "fallback",
    ] as const) {
      if (!hasText(beat[field])) failures.push(`${label} is missing ${field}`);
    }

    const generatedVideoSec = beat.generated_video_sec ?? 0;
    if (!(generatedVideoSec >= 0) || generatedVideoSec > duration) {
      failures.push(`${label} has invalid generated_video_sec`);
    }
    if (generatedVideoSec > 0) {
      generatedVideoDuration += generatedVideoSec;
      generatedVideoBeats += 1;
      if (!hasText(beat.asset_id)) {
        failures.push(`${label} needs asset_id for generated video`);
      }
    }
    if (beat.visual_mode === "generated-video" && generatedVideoSec === 0) {
      failures.push(`${label} must declare generated_video_sec`);
    }
    if (beat.narrative_role === "evidence" && /generated/i.test(beat.asset_provenance)) {
      failures.push(`${label} cannot use generated media as factual evidence`);
    }
    if (beat.intensity === "signature") signatureDuration += duration;
    if (
      index > 0 &&
      beat.intensity === "signature" &&
      beats[index - 1].intensity === "signature"
    ) {
      failures.push(`${label} follows another signature beat without a recovery beat`);
    }
  });

  const last = beats[beats.length - 1];
  if (last && plan?.duration_sec > 0 && Math.abs(last.end_sec - plan.duration_sec) > 2) {
    failures.push("director plan duration_sec does not match the final beat");
  }
  if (plan?.duration_sec > 0 && plan?.visual_budget) {
    const generatedVideoRatio = generatedVideoDuration / plan.duration_sec;
    if (generatedVideoRatio > plan.visual_budget.max_generated_video_ratio) {
      failures.push(
        `generated video occupies ${(generatedVideoRatio * 100).toFixed(1)}%, above the ${(plan.visual_budget.max_generated_video_ratio * 100).toFixed(0)}% budget`,
      );
    }
    if (generatedVideoBeats > plan.visual_budget.max_generated_video_beats) {
      failures.push(
        `generated video uses ${generatedVideoBeats} beats, above the ${plan.visual_budget.max_generated_video_beats} beat budget`,
      );
    }
    if (signatureDuration / plan.duration_sec > 0.2) {
      warnings.push("signature beats occupy more than 20% of the video");
    }
  }

  const passed = failures.length === 0;
  return {
    passed,
    failures,
    warnings,
    summaryMarkdown: [
      "# Director Plan Audit",
      "",
      `Status: ${passed ? "PASS" : "FAIL"}`,
      `Beats: ${beats.length}`,
      `Generated video: ${generatedVideoDuration.toFixed(1)}s across ${generatedVideoBeats} beat(s)`,
      "",
      "## Failures",
      failures.length ? failures.map((item) => `- ${item}`).join("\n") : "- none",
      "",
      "## Warnings",
      warnings.length ? warnings.map((item) => `- ${item}`).join("\n") : "- none",
      "",
    ].join("\n"),
  };
}

function readArg(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const planPath = readArg(args, "--plan") || args.find((arg) => !arg.startsWith("--"));
  if (!planPath) {
    console.error("Usage: bun director-plan-audit.ts --plan <director-plan.json> [--output <report.md>]");
    process.exit(1);
  }
  const absolutePath = resolve(planPath);
  if (!existsSync(absolutePath)) {
    console.error(`[director-plan-audit] missing ${absolutePath}`);
    process.exit(1);
  }

  try {
    const result = auditDirectorPlan(parseDirectorPlan(readFileSync(absolutePath, "utf-8")));
    const output = readArg(args, "--output");
    if (output) {
      const absoluteOutput = resolve(output);
      mkdirSync(dirname(absoluteOutput), { recursive: true });
      writeFileSync(absoluteOutput, `${result.summaryMarkdown}\n`, "utf-8");
      console.log(`[director-plan-audit] ${absoluteOutput}`);
    } else {
      console.log(result.summaryMarkdown);
    }
    process.exit(result.passed ? 0 : 2);
  } catch (error) {
    console.error(
      `[director-plan-audit] ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}
