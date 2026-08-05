#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import {
  auditContentEvidence,
  type AssetPlan,
  type FactPack,
} from "./content-evidence-audit";
import { auditDirectorPlan, type DirectorPlan } from "./director-plan-audit";
import {
  auditVideoStoryboard,
  loadSceneRegistry,
  type VideoStoryboard,
} from "./storyboard-audit";
import { auditSemanticSpriteAsset } from "./sprite-asset-audit";

type PreflightOptions = {
  videoDir: string;
  factPackPath?: string;
  assetPlanPath?: string;
  directorPlanPath?: string;
  storyboardPath?: string;
  production?: boolean;
  previewDir?: string;
};

export type ProductionPreflightResult = {
  passed: boolean;
  failures: string[];
  warnings: string[];
  summaryMarkdown: string;
};

const sameTime = (left: number, right: number): boolean =>
  Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) <= 0.01;

const mappedDirectorRole = (role: string): "evidence" | "explanation" | "emphasis" => {
  if (role === "evidence") return "evidence";
  if (role === "explain" || role === "framework") return "explanation";
  return "emphasis";
};

const semanticSettleBeat = (
  scene: VideoStoryboard["scenes"][number] | undefined,
  assetId: string,
) => scene?.beats?.find(
  (beat) =>
    beat.motion?.recipe === "semantic-settle" &&
    beat.target_asset_id === assetId,
);

const semanticSpriteExitBeat = (
  scene: VideoStoryboard["scenes"][number] | undefined,
  assetId: string,
  cueBeat: VideoStoryboard["scenes"][number]["beats"][number] | undefined,
) => scene?.beats?.find(
  (beat) =>
    cueBeat &&
    beat.target_asset_id === assetId &&
    beat.at_sec > cueBeat.at_sec &&
    /\b(clear|remove|exit|hide)\b/i.test(beat.action),
);

export function auditSemanticSpriteConsistency(
  directorPlan: DirectorPlan,
  assetPlan: AssetPlan,
  storyboard: VideoStoryboard,
): string[] {
  const directorEntries = (directorPlan.beats ?? []).flatMap((beat) =>
    beat.semantic_sprite?.asset_id ? [{ id: beat.semantic_sprite.asset_id, beat }] : [],
  );
  const assetEntries = (assetPlan.beats ?? []).flatMap((beat) =>
    beat.usage_role === "semantic-accent" && beat.asset_id
      ? [{ id: beat.asset_id, beat }]
      : [],
  );
  const storyboardEntries = (storyboard.scenes ?? []).flatMap((scene) =>
    (scene.semantic_sprite_ids ?? []).map((id) => ({ id, scene })),
  );
  const allIds = new Set([
    ...directorEntries.map((entry) => entry.id),
    ...assetEntries.map((entry) => entry.id),
    ...storyboardEntries.map((entry) => entry.id),
  ]);
  const failures: string[] = [];

  for (const id of allIds) {
    const directors = directorEntries.filter((entry) => entry.id === id);
    const assets = assetEntries.filter((entry) => entry.id === id);
    const scenes = storyboardEntries.filter((entry) => entry.id === id);
    const missingFrom = [
      directors.length > 0 ? "" : "director plan",
      assets.length > 0 ? "" : "asset plan",
      scenes.length > 0 ? "" : "storyboard",
    ].filter(Boolean);
    if (missingFrom.length > 0) {
      failures.push(`semantic sprite ${id} is missing from ${missingFrom.join(" and ")}`);
    }
    if (directors.length > 1) failures.push(`semantic sprite ${id} is duplicated in director plan`);
    if (assets.length > 1) failures.push(`semantic sprite ${id} is duplicated in asset plan`);
    if (scenes.length > 1) failures.push(`semantic sprite ${id} is duplicated in storyboard`);

    const appearsOnEvidence =
      directors.some((entry) => entry.beat.narrative_role === "evidence") ||
      assets.some((entry) => entry.beat.visual_role === "evidence") ||
      scenes.some((entry) => entry.scene.role === "evidence");
    if (appearsOnEvidence) {
      failures.push(`semantic sprite ${id} cannot appear on an evidence beat or scene`);
    }

    const directorBeat = directors[0]?.beat;
    const assetBeat = assets[0]?.beat;
    const scene = scenes[0]?.scene;
    if (!directorBeat || !assetBeat || !scene) continue;

    if (directorBeat.id !== assetBeat.id || assetBeat.id !== scene.id) {
      failures.push(
        `semantic sprite ${id} maps to different beat/scene IDs (${directorBeat.id}, ${assetBeat.id}, ${scene.id})`,
      );
    }

    const directorRole = mappedDirectorRole(directorBeat.narrative_role);
    if (directorRole !== assetBeat.visual_role || assetBeat.visual_role !== scene.role) {
      failures.push(`semantic sprite ${id} has inconsistent semantic role across plans`);
    }

    const directorSprite = directorBeat.semantic_sprite!;
    const storyboardStyle = storyboard.direction?.style_family_id;
    if (!storyboardStyle) {
      failures.push(`semantic sprite ${id} storyboard is missing style_family_id`);
    } else if (
      directorSprite.style_family_id !== assetBeat.style_family_id ||
      directorSprite.style_family_id !== assetPlan.visual_spine_id ||
      directorSprite.style_family_id !== storyboardStyle
    ) {
      failures.push(`semantic sprite ${id} has inconsistent style family across plans`);
    }
    if ((directorSprite.semantic_job ?? "").trim() !== (assetBeat.semantic_job ?? "").trim()) {
      failures.push(`semantic sprite ${id} has inconsistent semantic job across plans`);
    }

    if (
      !sameTime(directorBeat.start_sec, assetBeat.start_sec) ||
      !sameTime(assetBeat.start_sec, scene.start_sec) ||
      !sameTime(directorBeat.end_sec, assetBeat.end_sec) ||
      !sameTime(assetBeat.end_sec, scene.end_sec)
    ) {
      failures.push(`semantic sprite ${id} has inconsistent timing across plans`);
    }

    const motionRecipe = directorSprite.motion_recipe ?? "";
    const cueBeats = scene.beats?.filter(
      (beat) =>
        beat.motion?.recipe === motionRecipe &&
        beat.target_asset_id === id,
    ) ?? [];
    if (!motionRecipe || !scene.motion_recipes?.includes(motionRecipe) || cueBeats.length === 0) {
      failures.push(`semantic sprite ${id} is missing its ${motionRecipe || "motion"} storyboard cue`);
    } else if (cueBeats.length > 1) {
      failures.push(`semantic sprite ${id} has ambiguous storyboard cues`);
    } else if (!semanticSpriteExitBeat(scene, id, cueBeats[0])) {
      failures.push(`semantic sprite ${id} is missing a clear/remove/exit/hide beat after its cue`);
    }
    if (!(storyboard.fps && storyboard.fps > 0) || !Number.isFinite(storyboard.fps)) {
      failures.push(`semantic sprite ${id} storyboard is missing a valid fps`);
    }
  }
  return failures;
}

const readJson = <T>(path: string): T =>
  JSON.parse(readFileSync(path, "utf8")) as T;

export function runProductionPreflight(
  options: PreflightOptions,
): ProductionPreflightResult {
  const videoDir = resolve(options.videoDir);
  const production = options.production ?? false;
  const factPackPath = resolve(options.factPackPath ?? join(videoDir, "fact-pack.json"));
  const assetPlanPath = resolve(options.assetPlanPath ?? join(videoDir, "asset-plan.json"));
  const directorPlanPath = resolve(
    options.directorPlanPath ?? join(videoDir, "director-plan.json"),
  );
  const storyboardPath = resolve(
    options.storyboardPath ?? join(videoDir, "video-storyboard.json"),
  );
  const required = [factPackPath, assetPlanPath, directorPlanPath, storyboardPath];
  const missing = required.filter((path) => !existsSync(path));
  if (missing.length > 0) {
    const failures = missing.map((path) => `missing preflight input: ${path}`);
    return {
      passed: false,
      failures,
      warnings: [],
      summaryMarkdown: [
        "# Video Production Preflight",
        "",
        "Status: FAIL",
        `Mode: ${production ? "production" : "prototype"}`,
        "",
        "## Failures",
        ...failures.map((item) => `- ${item}`),
        "",
      ].join("\n"),
    };
  }

  const factPack = readJson<FactPack>(factPackPath);
  const assetPlan = readJson<AssetPlan>(assetPlanPath);
  const directorPlan = readJson<DirectorPlan>(directorPlanPath);
  const storyboard = readJson<VideoStoryboard>(storyboardPath);
  const director = auditDirectorPlan(directorPlan);
  const evidence = auditContentEvidence(factPack, assetPlan, {
    production,
    baseDir: dirname(assetPlanPath),
  });
  const story = auditVideoStoryboard(storyboard, loadSceneRegistry(), {
    production,
  });

  const failures = [
    ...director.failures.map((item) => `director: ${item}`),
    ...evidence.failures.map((item) => `assets: ${item}`),
    ...story.failures.map((item) => `storyboard: ${item}`),
    ...auditSemanticSpriteConsistency(directorPlan, assetPlan, storyboard).map(
      (item) => `cross-plan: ${item}`,
    ),
  ];
  const warnings = [
    ...director.warnings.map((item) => `director: ${item}`),
    ...evidence.warnings.map((item) => `assets: ${item}`),
    ...story.warnings.map((item) => `storyboard: ${item}`),
  ];
  const spriteReports: string[] = [];
  const previewDir = resolve(options.previewDir ?? join(videoDir, "sprite-qa"));

  for (const beat of assetPlan.beats ?? []) {
    if (beat.usage_role !== "semantic-accent") continue;
    if (!beat.asset_path || !beat.manifest_path) continue;
    const directorBeat = (directorPlan.beats ?? []).find(
      (candidate) => candidate.semantic_sprite?.asset_id === beat.asset_id,
    );
    const scene = (storyboard.scenes ?? []).find((candidate) =>
      (candidate.semantic_sprite_ids ?? []).includes(beat.asset_id ?? ""),
    );
    const cueBeat = semanticSettleBeat(scene, beat.asset_id ?? "");
    const exitBeat = semanticSpriteExitBeat(scene, beat.asset_id ?? "", cueBeat);
    const expectedVisibleUntilSec =
      scene &&
      exitBeat &&
      cueBeat?.motion?.exit_duration_sec !== undefined
        ? scene.start_sec + exitBeat.at_sec + cueBeat.motion.exit_duration_sec
        : undefined;
    const spriteResult = auditSemanticSpriteAsset({
      assetPath: beat.asset_path,
      manifestPath: beat.manifest_path,
      planBaseDir: dirname(assetPlanPath),
      binding: {
        beatId: beat.id,
        assetId: beat.asset_id ?? "",
        assetPath: beat.asset_path,
        renderAssetPath: beat.render_asset_path ?? "",
        compositionId: beat.composition_id ?? "",
        manifestPath: beat.manifest_path,
        semanticJob: beat.semantic_job ?? "",
        styleFamilyId: beat.style_family_id ?? "",
        visualRole: beat.visual_role,
        rights: beat.rights,
        alphaQaStatus: beat.alpha_qa_status ?? "",
        startSec: beat.start_sec,
        endSec: beat.end_sec,
        fps: storyboard.fps ?? Number.NaN,
        cueSec: scene && cueBeat ? scene.start_sec + cueBeat.at_sec : undefined,
        expectedVisibleUntilSec,
        enterDurationSec: cueBeat?.motion?.duration_sec ?? Number.NaN,
        exitDurationSec: cueBeat?.motion?.exit_duration_sec ?? Number.NaN,
        translatePx: cueBeat?.motion?.translate_px ?? Number.NaN,
        motionRecipe: directorBeat?.semantic_sprite?.motion_recipe ?? cueBeat?.motion?.recipe,
      },
      previewDir,
    });
    failures.push(...spriteResult.failures.map((item) => `sprite ${beat.id}: ${item}`));
    warnings.push(...spriteResult.warnings.map((item) => `sprite ${beat.id}: ${item}`));
    spriteReports.push(
      `- ${beat.id}: ${spriteResult.passed ? "PASS" : "FAIL"} (${spriteResult.previewPaths.length} composites)`,
    );
  }

  const passed = failures.length === 0;
  const summaryMarkdown = [
    "# Video Production Preflight",
    "",
    `Status: ${passed ? "PASS" : "FAIL"}`,
    `Mode: ${production ? "production" : "prototype"}`,
    `Director plan: ${director.passed ? "PASS" : "FAIL"}`,
    `Content and evidence: ${evidence.passed ? "PASS" : "FAIL"}`,
    `Storyboard: ${story.passed ? "PASS" : "FAIL"}`,
    "",
    "## Semantic sprites",
    spriteReports.length ? spriteReports.join("\n") : "- none approved",
    "",
    "## Failures",
    failures.length ? failures.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Warnings",
    warnings.length ? warnings.map((item) => `- ${item}`).join("\n") : "- none",
    "",
  ].join("\n");

  return { passed, failures, warnings, summaryMarkdown };
}

const argValue = (args: string[], flag: string): string | undefined => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};

if (import.meta.main) {
  const args = process.argv.slice(2);
  const videoDir = argValue(args, "--video-dir");
  if (!videoDir) {
    console.error(
      "Usage: bun production-preflight.ts --video-dir <dir> [--fact-pack <file>] [--asset-plan <file>] [--director-plan <file>] [--storyboard <file>] [--production] [--output <report.md>]",
    );
    process.exit(2);
  }
  const result = runProductionPreflight({
    videoDir,
    factPackPath: argValue(args, "--fact-pack"),
    assetPlanPath: argValue(args, "--asset-plan"),
    directorPlanPath: argValue(args, "--director-plan"),
    storyboardPath: argValue(args, "--storyboard"),
    production: args.includes("--production"),
    previewDir: argValue(args, "--preview-dir"),
  });
  const output = argValue(args, "--output") ?? join(resolve(videoDir), "production-preflight-report.md");
  mkdirSync(dirname(resolve(output)), { recursive: true });
  writeFileSync(resolve(output), `${result.summaryMarkdown}\n`, "utf8");
  console.log(result.summaryMarkdown);
  process.exit(result.passed ? 0 : 1);
}
