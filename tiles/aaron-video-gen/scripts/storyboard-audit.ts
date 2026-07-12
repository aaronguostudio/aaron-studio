#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";

export type SceneRole = "evidence" | "explanation" | "emphasis";
export type SceneIntensity = "calm" | "structured" | "signature";
export type CapabilityStatus = "available" | "prototype" | "experimental";

export interface SceneTemplateDefinition {
  id: string;
  status: CapabilityStatus;
  description: string;
  roles: SceneRole[];
  intensities: SceneIntensity[];
  motion_recipes: string[];
  max_duration_sec: number;
  max_content_items: number;
}

export interface MotionRecipeDefinition {
  id: string;
  status: CapabilityStatus;
}

export interface SceneRegistry {
  schema_version: number;
  roles: SceneRole[];
  intensities: SceneIntensity[];
  templates: SceneTemplateDefinition[];
  motion_recipes: MotionRecipeDefinition[];
}

export interface StoryboardReference {
  id: string;
  url: string;
  borrow: string;
  avoid: string;
}

export interface StoryboardBeat {
  at_sec: number;
  visual: string;
  action: string;
}

export interface StoryboardScene {
  id: string;
  title: string;
  start_sec: number;
  end_sec: number;
  role: SceneRole;
  template: string;
  intensity: SceneIntensity;
  purpose: string;
  entry_mode: "meaningful" | "bridge" | "blank";
  entry_visual: string;
  first_change_sec: number;
  motion_recipes: string[];
  content: string[];
  beats: StoryboardBeat[];
  prototype_required?: boolean;
  fallback_template?: string;
  music_cue?: string;
}

export interface VideoStoryboard {
  schema_version: number;
  title: string;
  duration_sec: number;
  direction: {
    name: string;
    visual_spine: string;
    motion_density: "restrained" | "balanced" | "expressive";
    music_strategy: "none" | "bookended" | "chaptered" | "continuous";
    references: StoryboardReference[];
  };
  scenes: StoryboardScene[];
}

export interface StoryboardAuditOptions {
  production?: boolean;
}

export interface StoryboardAuditResult {
  passed: boolean;
  failures: string[];
  warnings: string[];
  prototypeScenes: string[];
  summaryMarkdown: string;
}

export function loadSceneRegistry(
  registryPath = join(import.meta.dir, "..", "config", "scene-registry.json"),
): SceneRegistry {
  return JSON.parse(readFileSync(registryPath, "utf-8")) as SceneRegistry;
}

export function parseVideoStoryboard(markdown: string): VideoStoryboard {
  return JSON.parse(markdown) as VideoStoryboard;
}

function describeScene(scene: StoryboardScene, index: number): string {
  return scene?.id || `scene-${index + 1}`;
}

export function auditVideoStoryboard(
  storyboard: VideoStoryboard,
  registry: SceneRegistry = loadSceneRegistry(),
  options: StoryboardAuditOptions = {},
): StoryboardAuditResult {
  const failures: string[] = [];
  const warnings: string[] = [];
  const prototypeScenes = new Set<string>();
  const templates = new Map(registry.templates.map((item) => [item.id, item]));
  const recipes = new Map(
    registry.motion_recipes.map((item) => [item.id, item]),
  );
  const scenes = Array.isArray(storyboard?.scenes) ? storyboard.scenes : [];
  const seenSceneIds = new Set<string>();
  const allowedMotionDensities = ["restrained", "balanced", "expressive"];
  const allowedMusicStrategies = [
    "none",
    "bookended",
    "chaptered",
    "continuous",
  ];

  if (storyboard?.schema_version !== registry.schema_version) {
    failures.push(
      `storyboard schema_version must be ${registry.schema_version}`,
    );
  }
  if (!storyboard?.title?.trim()) failures.push("storyboard title is missing");
  if (!(storyboard?.duration_sec > 0)) {
    failures.push("storyboard duration_sec must be positive");
  }
  if (!storyboard?.direction?.name?.trim()) {
    failures.push("storyboard direction.name is missing");
  }
  if (!storyboard?.direction?.visual_spine?.trim()) {
    failures.push("storyboard direction.visual_spine is missing");
  }
  if (!allowedMotionDensities.includes(storyboard?.direction?.motion_density)) {
    failures.push("storyboard direction.motion_density is invalid");
  }
  if (!allowedMusicStrategies.includes(storyboard?.direction?.music_strategy)) {
    failures.push("storyboard direction.music_strategy is invalid");
  }
  if (!Array.isArray(storyboard?.direction?.references)) {
    failures.push("storyboard direction.references must be an array");
  } else if (storyboard.direction.references.length === 0) {
    warnings.push("no visual references were deconstructed for this treatment");
  } else {
    storyboard.direction.references.forEach((reference, index) => {
      if (
        !reference?.id?.trim() ||
        !reference?.url?.trim() ||
        !reference?.borrow?.trim() ||
        !reference?.avoid?.trim()
      ) {
        failures.push(`visual reference ${index + 1} is incomplete`);
      }
    });
  }
  if (scenes.length === 0) failures.push("storyboard has no scenes");

  let signatureDuration = 0;
  let repeatedTemplateCount = 0;
  let previousTemplate = "";

  scenes.forEach((scene, index) => {
    const label = describeScene(scene, index);
    const duration = scene.end_sec - scene.start_sec;
    const template = templates.get(scene.template);

    if (!scene.id?.trim()) {
      failures.push(`scene ${index + 1} is missing id`);
    } else if (seenSceneIds.has(scene.id)) {
      failures.push(`duplicate scene id ${scene.id}`);
    } else {
      seenSceneIds.add(scene.id);
    }
    if (!scene.title?.trim()) failures.push(`${label} is missing title`);
    if (!scene.purpose?.trim()) failures.push(`${label} is missing purpose`);
    if (!(scene.start_sec >= 0) || !(scene.end_sec > scene.start_sec)) {
      failures.push(`${label} has an invalid time range`);
    }
    if (index === 0 && Math.abs(scene.start_sec) > 0.25) {
      failures.push(`${label} must begin at 0 seconds`);
    }
    if (index > 0) {
      const delta = scene.start_sec - scenes[index - 1].end_sec;
      if (Math.abs(delta) > 0.5) {
        failures.push(
          `${label} has a ${delta > 0 ? "gap" : "overlap"} of ${Math.abs(delta).toFixed(1)}s`,
        );
      }
    }

    if (!registry.roles.includes(scene.role)) {
      failures.push(`${label} uses unknown role ${scene.role}`);
    }
    if (!registry.intensities.includes(scene.intensity)) {
      failures.push(`${label} uses unknown intensity ${scene.intensity}`);
    }
    if (!template) {
      failures.push(`${label} uses unknown template ${scene.template}`);
      return;
    }
    if (!template.roles.includes(scene.role)) {
      failures.push(
        `${label} role ${scene.role} is incompatible with ${scene.template}`,
      );
    }
    if (!template.intensities.includes(scene.intensity)) {
      failures.push(
        `${label} intensity ${scene.intensity} is incompatible with ${scene.template}`,
      );
    }
    if (duration > template.max_duration_sec) {
      warnings.push(
        `${label} lasts ${duration.toFixed(1)}s; ${scene.template} is designed for at most ${template.max_duration_sec}s`,
      );
    }
    if (!Array.isArray(scene.content)) {
      failures.push(`${label} content must be an array`);
    } else if (scene.content.length > template.max_content_items) {
      failures.push(
        `${label} has ${scene.content.length} content items; ${scene.template} allows ${template.max_content_items}`,
      );
    }

    if (template.status !== "available") {
      prototypeScenes.add(label);
      if (options.production) {
        failures.push(
          `${label} uses ${template.status} template ${scene.template} in production mode`,
        );
      } else {
        warnings.push(
          `${label} requires a prototype before full rendering (${scene.template})`,
        );
      }
      if (!scene.prototype_required) {
        failures.push(
          `${label} must set prototype_required for ${scene.template}`,
        );
      }
      const fallback = scene.fallback_template
        ? templates.get(scene.fallback_template)
        : undefined;
      if (!fallback || fallback.status !== "available") {
        failures.push(`${label} needs an available fallback_template`);
      }
    }

    if (scene.entry_mode === "blank") {
      failures.push(`${label} begins on a blank stage`);
    }
    if (!scene.entry_visual?.trim()) {
      failures.push(`${label} is missing entry_visual`);
    }
    if (!(scene.first_change_sec >= 0) || scene.first_change_sec > duration) {
      failures.push(`${label} has invalid first_change_sec`);
    } else if (scene.entry_mode === "bridge" && scene.first_change_sec > 1) {
      failures.push(`${label} bridge waits more than 1s for its first change`);
    } else if (
      scene.entry_mode === "meaningful" &&
      scene.first_change_sec > 10
    ) {
      warnings.push(`${label} holds its entry visual for more than 10s`);
    }

    const sceneRecipes = Array.isArray(scene.motion_recipes)
      ? scene.motion_recipes
      : [];
    for (const recipeId of sceneRecipes) {
      const recipe = recipes.get(recipeId);
      if (!recipe) {
        failures.push(`${label} uses unknown motion recipe ${recipeId}`);
        continue;
      }
      if (!template.motion_recipes.includes(recipeId)) {
        failures.push(
          `${label} motion recipe ${recipeId} is not allowed for ${scene.template}`,
        );
      }
      if (recipe.status !== "available") {
        prototypeScenes.add(label);
        if (options.production) {
          failures.push(
            `${label} uses ${recipe.status} motion recipe ${recipeId} in production mode`,
          );
        } else if (!scene.prototype_required) {
          failures.push(`${label} must prototype motion recipe ${recipeId}`);
        }
      }
    }

    if (!Array.isArray(scene.beats) || scene.beats.length === 0) {
      failures.push(`${label} has no visual beats`);
    } else {
      const maxBeatGap = scene.intensity === "calm" ? 12 : 8;
      let priorBeat = 0;
      for (const beat of scene.beats) {
        if (!(beat.at_sec >= 0) || beat.at_sec > duration) {
          failures.push(`${label} has a beat outside its time range`);
        }
        if (beat.at_sec < priorBeat) {
          failures.push(`${label} visual beats are not chronological`);
        }
        const gap = beat.at_sec - priorBeat;
        if (gap > maxBeatGap) {
          warnings.push(
            `${label} has ${gap.toFixed(1)}s without a meaningful visual beat`,
          );
        }
        if (!beat.visual?.trim() || !beat.action?.trim()) {
          failures.push(`${label} has an incomplete visual beat`);
        }
        priorBeat = beat.at_sec;
      }
      const tailGap = duration - priorBeat;
      if (tailGap > maxBeatGap) {
        warnings.push(
          `${label} ends with ${tailGap.toFixed(1)}s without a meaningful visual beat`,
        );
      }
    }

    if (scene.intensity === "signature") signatureDuration += duration;
    if (scene.template === previousTemplate) {
      repeatedTemplateCount += 1;
      if (repeatedTemplateCount >= 2) {
        warnings.push(
          `${label} is the third consecutive ${scene.template} scene`,
        );
      }
    } else {
      previousTemplate = scene.template;
      repeatedTemplateCount = 0;
    }
  });

  const lastScene = scenes[scenes.length - 1];
  if (
    lastScene &&
    storyboard.duration_sec > 0 &&
    Math.abs(lastScene.end_sec - storyboard.duration_sec) > 2
  ) {
    failures.push("storyboard duration_sec does not match the final scene");
  }

  const roleCount = new Set(scenes.map((scene) => scene.role)).size;
  if (storyboard.duration_sec > 60 && roleCount < 2) {
    warnings.push("long storyboard uses fewer than two visual roles");
  }
  if (storyboard.duration_sec > 180 && roleCount < 3) {
    warnings.push(
      "essay-length storyboard does not use all three visual roles",
    );
  }
  if (
    storyboard.duration_sec > 0 &&
    signatureDuration / storyboard.duration_sec > 0.2
  ) {
    warnings.push("signature motion occupies more than 20% of the video");
  }
  if (
    signatureDuration > 0 &&
    (storyboard?.direction?.references?.length ?? 0) === 0
  ) {
    failures.push(
      "signature motion requires at least one deconstructed reference",
    );
  }
  if (
    storyboard?.direction?.music_strategy &&
    storyboard.direction.music_strategy !== "none" &&
    !scenes.some((scene) => scene.music_cue?.trim())
  ) {
    warnings.push(
      `music strategy ${storyboard.direction.music_strategy} has no scene-level music_cue`,
    );
  }

  const passed = failures.length === 0;
  const prototypeList = [...prototypeScenes];
  return {
    passed,
    failures,
    warnings,
    prototypeScenes: prototypeList,
    summaryMarkdown: [
      "# Video Storyboard Audit",
      "",
      `Status: ${passed ? "PASS" : "FAIL"}`,
      `Mode: ${options.production ? "production" : "planning"}`,
      `Scenes: ${scenes.length}`,
      `Duration: ${Math.round(storyboard?.duration_sec || 0)}s`,
      `Prototype scenes: ${prototypeList.length ? prototypeList.join(", ") : "none"}`,
      "",
      "## Failures",
      failures.length
        ? failures.map((item) => `- ${item}`).join("\n")
        : "- none",
      "",
      "## Warnings",
      warnings.length
        ? warnings.map((item) => `- ${item}`).join("\n")
        : "- none",
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
  const storyboardPath =
    readArg(args, "--storyboard") || args.find((arg) => !arg.startsWith("--"));
  if (!storyboardPath) {
    console.error(
      "Usage: bun storyboard-audit.ts --storyboard <video-storyboard.json> [--production] [--output <report.md>]",
    );
    process.exit(1);
  }

  const absolutePath = resolve(storyboardPath);
  if (!existsSync(absolutePath)) {
    console.error(`[storyboard-audit] missing ${absolutePath}`);
    process.exit(1);
  }

  try {
    const storyboard = parseVideoStoryboard(
      readFileSync(absolutePath, "utf-8"),
    );
    const result = auditVideoStoryboard(storyboard, loadSceneRegistry(), {
      production: args.includes("--production"),
    });
    const outputPath = readArg(args, "--output");
    if (outputPath) {
      const absoluteOutput = resolve(outputPath);
      mkdirSync(dirname(absoluteOutput), { recursive: true });
      writeFileSync(absoluteOutput, `${result.summaryMarkdown}\n`, "utf-8");
      console.log(`[storyboard-audit] ${absoluteOutput}`);
    } else {
      console.log(result.summaryMarkdown);
    }
    process.exit(result.passed ? 0 : 2);
  } catch (error) {
    console.error(
      `[storyboard-audit] ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}
