#!/usr/bin/env bun
import { spawnSync } from "child_process";
import { createHash } from "crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { basename, dirname, extname, join, resolve } from "path";
import {
  semanticSpriteRuntimeRegistry,
  type SemanticSpriteRuntimeRegistry,
} from "../remotion/src/editorial/SemanticSpriteRuntimeRegistry";

export interface SpriteAssetAuditResult {
  passed: boolean;
  failures: string[];
  warnings: string[];
  metrics?: SpriteAlphaMetrics;
  previewPaths: string[];
  summaryMarkdown: string;
}

export interface SpriteAlphaMetrics {
  width: number;
  height: number;
  totalPixels: number;
  alphaMin: number;
  alphaAverage: number;
  alphaMax: number;
  transparentPixels: number;
  partiallyTransparentPixels: number;
  opaquePixels: number;
  cornerAlpha: [number, number, number, number];
  contentBounds: { left: number; top: number; right: number; bottom: number };
  greenFringePixels: number;
  opaqueGreenEdgePixels: number;
  blackFringePixels: number;
  whiteFringePixels: number;
}

type SpriteManifest = {
  schema_version?: number;
  asset_id?: string;
  title?: string;
  created_for?: string;
  narrative_job?: string;
  selection_rationale?: string;
  style_family_id?: string;
  generation?: {
    provider?: string;
    model?: string;
    prompt?: string;
    source_path?: string;
    source_sha256?: string;
  };
  postprocess?: {
    method?: string;
    output_path?: string;
    output_sha256?: string;
    dimensions?: [number, number];
    mode?: string;
  };
  alpha_qa?: {
    transparent_pixels?: number;
    partially_transparent_pixels?: number;
    total_pixels?: number;
    alpha_min?: number;
    alpha_average?: number;
    alpha_max?: number;
    top_left_alpha?: number;
    top_right_alpha?: number;
    bottom_left_alpha?: number;
    bottom_right_alpha?: number;
    status?: string;
  };
  usage?: {
    composition?: string;
    scene_id?: string;
    fps?: number;
    render_path?: string;
    render_sha256?: string;
    visible_from_sec?: number;
    visible_until_sec?: number;
    motion?: string;
    semantic_status?: string;
  };
  rights?: string;
  asset_library?: {
    policy?: string;
    scope?: string;
    reason?: string;
  };
};

export interface SpriteAssetPlanBinding {
  beatId: string;
  assetId: string;
  assetPath: string;
  renderAssetPath: string;
  compositionId: string;
  manifestPath: string;
  semanticJob: string;
  styleFamilyId: string;
  visualRole: string;
  rights: string;
  alphaQaStatus: string;
  startSec: number;
  endSec: number;
  fps: number;
  cueSec?: number;
  expectedVisibleUntilSec?: number;
  enterDurationSec: number;
  exitDurationSec: number;
  translatePx: number;
  motionRecipe?: string;
}

export interface SpriteAssetAuditOptions {
  assetPath: string;
  manifestPath: string;
  planBaseDir?: string;
  binding?: SpriteAssetPlanBinding;
  previewDir?: string;
  runtimePublicDir?: string;
  runtimeRegistry?: SemanticSpriteRuntimeRegistry;
}

const manifestRights = ["owned-generated", "owned", "licensed"] as const;
const assetLibraryPolicies = ["auto", "suggest", "ignore"] as const;
const assetLibraryScopes = ["generic", "project-specific"] as const;
const alphaQaStatuses = ["pending", "pass", "fail"] as const;
const sha256Pattern = /^[a-f0-9]{64}$/;
const timeToleranceSec = 0.01;

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const sha256 = (path: string): string =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isByte = (value: unknown): value is number =>
  isFiniteNumber(value) && Number.isInteger(value) && value >= 0 && value <= 255;

const isNonNegativeInteger = (value: unknown): value is number =>
  isFiniteNumber(value) && Number.isInteger(value) && value >= 0;

const nearlyEqual = (left: number, right: number, tolerance = timeToleranceSec): boolean =>
  Math.abs(left - right) <= tolerance;

const run = (command: string, args: string[]) => {
  const result = spawnSync(command, args, {
    encoding: null,
    maxBuffer: 1024 * 1024 * 256,
  });
  if (result.status !== 0) {
    const detail = result.stderr?.toString("utf8").trim() || "unknown error";
    throw new Error(`${command} failed: ${detail}`);
  }
  return result;
};

const probeImage = (assetPath: string): { width: number; height: number; pixFmt: string } => {
  const result = run("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,pix_fmt",
    "-of",
    "json",
    assetPath,
  ]);
  const parsed = JSON.parse(result.stdout.toString("utf8")) as {
    streams?: Array<{ width?: number; height?: number; pix_fmt?: string }>;
  };
  const stream = parsed.streams?.[0];
  if (!(stream?.width && stream?.height && stream.pix_fmt)) {
    throw new Error("ffprobe did not return image dimensions and pixel format");
  }
  return { width: stream.width, height: stream.height, pixFmt: stream.pix_fmt };
};

export function analyzeRgbaPixels(
  rgba: Uint8Array,
  width: number,
  height: number,
): SpriteAlphaMetrics {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error(`RGBA dimensions must be positive integers, received ${width}x${height}`);
  }
  if (rgba.length !== width * height * 4) {
    throw new Error(`RGBA buffer length ${rgba.length} does not match ${width}x${height}`);
  }

  const totalPixels = width * height;
  let alphaMin = 255;
  let alphaTotal = 0;
  let alphaMax = 0;
  let transparentPixels = 0;
  let partiallyTransparentPixels = 0;
  let opaquePixels = 0;
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  let greenFringePixels = 0;
  let opaqueGreenEdgePixels = 0;
  let blackFringePixels = 0;
  let whiteFringePixels = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const r = rgba[offset];
      const g = rgba[offset + 1];
      const b = rgba[offset + 2];
      const a = rgba[offset + 3];
      alphaMin = Math.min(alphaMin, a);
      alphaTotal += a;
      alphaMax = Math.max(alphaMax, a);
      if (a === 0) transparentPixels += 1;
      else if (a === 255) opaquePixels += 1;
      else partiallyTransparentPixels += 1;

      if (a > 0) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
      if (a > 0 && a < 255) {
        if (g > r + 35 && g > b + 35 && g > 100) greenFringePixels += 1;
        if (r < 12 && g < 12 && b < 12) blackFringePixels += 1;
        if (r > 248 && g > 248 && b > 248) whiteFringePixels += 1;
      }
      if (a === 255 && g > r + 35 && g > b + 35 && g > 100) {
        let adjacentToTransparency = false;
        for (let deltaY = -1; deltaY <= 1 && !adjacentToTransparency; deltaY += 1) {
          for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
            if (deltaX === 0 && deltaY === 0) continue;
            const neighborX = x + deltaX;
            const neighborY = y + deltaY;
            if (
              neighborX < 0 ||
              neighborY < 0 ||
              neighborX >= width ||
              neighborY >= height
            ) {
              continue;
            }
            if (rgba[(neighborY * width + neighborX) * 4 + 3] < 255) {
              adjacentToTransparency = true;
              break;
            }
          }
        }
        if (adjacentToTransparency) opaqueGreenEdgePixels += 1;
      }
    }
  }

  const alphaAt = (x: number, y: number): number =>
    rgba[(y * width + x) * 4 + 3];

  return {
    width,
    height,
    totalPixels,
    alphaMin,
    alphaAverage: alphaTotal / totalPixels,
    alphaMax,
    transparentPixels,
    partiallyTransparentPixels,
    opaquePixels,
    cornerAlpha: [
      alphaAt(0, 0),
      alphaAt(width - 1, 0),
      alphaAt(0, height - 1),
      alphaAt(width - 1, height - 1),
    ],
    contentBounds: { left, top, right, bottom },
    greenFringePixels,
    opaqueGreenEdgePixels,
    blackFringePixels,
    whiteFringePixels,
  };
}

const renderComposite = (
  assetPath: string,
  width: number,
  height: number,
  color: string,
  outputPath: string,
): void => {
  run("ffmpeg", [
    "-v",
    "error",
    "-f",
    "lavfi",
    "-i",
    `color=c=${color}:s=${width}x${height}:d=1`,
    "-i",
    assetPath,
    "-filter_complex",
    "[0:v][1:v]overlay=0:0:format=auto",
    "-frames:v",
    "1",
    "-y",
    outputPath,
  ]);
};

export function auditSemanticSpriteAsset(
  options: SpriteAssetAuditOptions,
): SpriteAssetAuditResult {
  const failures: string[] = [];
  const warnings: string[] = [];
  const previewPaths: string[] = [];
  const planBaseDir = resolve(options.planBaseDir ?? process.cwd());
  const runtimePublicDir = resolve(
    options.runtimePublicDir ?? join(import.meta.dir, "..", "remotion", "public"),
  );
  const runtimeRegistry =
    options.runtimeRegistry ?? semanticSpriteRuntimeRegistry;
  const assetPath = resolve(planBaseDir, options.assetPath);
  const manifestPath = resolve(planBaseDir, options.manifestPath);
  let metrics: SpriteAlphaMetrics | undefined;

  if (!existsSync(assetPath)) failures.push(`sprite asset does not exist: ${assetPath}`);
  if (!existsSync(manifestPath)) failures.push(`sprite manifest does not exist: ${manifestPath}`);
  if (![".png", ".webp"].includes(extname(assetPath).toLowerCase())) {
    failures.push("sprite asset must be PNG or WebP");
  }

  let manifest: SpriteManifest | undefined;
  if (existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as SpriteManifest;
    } catch {
      failures.push("sprite manifest is not valid JSON");
    }
  }

  if (manifest) {
    if (manifest.schema_version !== 1) failures.push("sprite manifest schema_version must be 1");
    for (const [label, value] of [
      ["asset_id", manifest.asset_id],
      ["title", manifest.title],
      ["created_for", manifest.created_for],
      ["narrative_job", manifest.narrative_job],
      ["selection_rationale", manifest.selection_rationale],
      ["style_family_id", manifest.style_family_id],
      ["rights", manifest.rights],
      ["generation.provider", manifest.generation?.provider],
      ["generation.model", manifest.generation?.model],
      ["generation.prompt", manifest.generation?.prompt],
      ["generation.source_path", manifest.generation?.source_path],
      ["generation.source_sha256", manifest.generation?.source_sha256],
      ["postprocess.method", manifest.postprocess?.method],
      ["postprocess.output_path", manifest.postprocess?.output_path],
      ["postprocess.output_sha256", manifest.postprocess?.output_sha256],
      ["usage.composition", manifest.usage?.composition],
      ["usage.scene_id", manifest.usage?.scene_id],
      ["usage.render_path", manifest.usage?.render_path],
      ["usage.render_sha256", manifest.usage?.render_sha256],
      ["usage.motion", manifest.usage?.motion],
      ["usage.semantic_status", manifest.usage?.semantic_status],
      ["asset_library.reason", manifest.asset_library?.reason],
      ["asset_library.policy", manifest.asset_library?.policy],
      ["asset_library.scope", manifest.asset_library?.scope],
    ] as const) {
      if (!hasText(value)) failures.push(`sprite manifest is missing ${label}`);
    }

    if (!manifestRights.includes(manifest.rights as (typeof manifestRights)[number])) {
      failures.push("sprite manifest rights is invalid");
    }
    if (
      !assetLibraryPolicies.includes(
        manifest.asset_library?.policy as (typeof assetLibraryPolicies)[number],
      )
    ) {
      failures.push("sprite manifest asset_library.policy is invalid");
    }
    if (
      !assetLibraryScopes.includes(
        manifest.asset_library?.scope as (typeof assetLibraryScopes)[number],
      )
    ) {
      failures.push("sprite manifest asset_library.scope is invalid");
    }

    const dimensions = manifest.postprocess?.dimensions;
    if (
      !Array.isArray(dimensions) ||
      dimensions.length !== 2 ||
      !Number.isInteger(dimensions[0]) ||
      !Number.isInteger(dimensions[1]) ||
      dimensions[0] <= 0 ||
      dimensions[1] <= 0
    ) {
      failures.push("sprite manifest postprocess.dimensions must contain positive integer width and height");
    }
    if (manifest.postprocess?.mode !== "RGBA") {
      failures.push("sprite manifest postprocess.mode must be RGBA");
    }

    for (const [label, value] of [
      ["alpha_qa.transparent_pixels", manifest.alpha_qa?.transparent_pixels],
      ["alpha_qa.partially_transparent_pixels", manifest.alpha_qa?.partially_transparent_pixels],
      ["alpha_qa.total_pixels", manifest.alpha_qa?.total_pixels],
    ] as const) {
      if (!isNonNegativeInteger(value)) {
        failures.push(`sprite manifest ${label} must be a non-negative integer`);
      }
    }
    for (const [label, value] of [
      ["alpha_qa.alpha_min", manifest.alpha_qa?.alpha_min],
      ["alpha_qa.alpha_max", manifest.alpha_qa?.alpha_max],
      ["alpha_qa.top_left_alpha", manifest.alpha_qa?.top_left_alpha],
      ["alpha_qa.top_right_alpha", manifest.alpha_qa?.top_right_alpha],
      ["alpha_qa.bottom_left_alpha", manifest.alpha_qa?.bottom_left_alpha],
      ["alpha_qa.bottom_right_alpha", manifest.alpha_qa?.bottom_right_alpha],
    ] as const) {
      if (!isByte(value)) failures.push(`sprite manifest ${label} must be an integer from 0 to 255`);
    }
    if (
      !isFiniteNumber(manifest.alpha_qa?.alpha_average) ||
      manifest.alpha_qa.alpha_average < 0 ||
      manifest.alpha_qa.alpha_average > 255
    ) {
      failures.push("sprite manifest alpha_qa.alpha_average must be between 0 and 255");
    }
    if (
      !alphaQaStatuses.includes(
        manifest.alpha_qa?.status as (typeof alphaQaStatuses)[number],
      )
    ) {
      failures.push("sprite manifest alpha_qa.status is invalid");
    } else if (manifest.alpha_qa?.status !== "pass") {
      failures.push("sprite manifest alpha_qa.status must be pass");
    }

    const visibleFromSec = manifest.usage?.visible_from_sec;
    const visibleUntilSec = manifest.usage?.visible_until_sec;
    const manifestFps = manifest.usage?.fps;
    if (!isFiniteNumber(manifestFps) || manifestFps <= 0) {
      failures.push("sprite manifest usage.fps must be a positive number");
    }
    if (!isFiniteNumber(visibleFromSec) || visibleFromSec < 0) {
      failures.push("sprite manifest usage.visible_from_sec must be a non-negative number");
    }
    if (
      !isFiniteNumber(visibleUntilSec) ||
      !isFiniteNumber(visibleFromSec) ||
      visibleUntilSec <= visibleFromSec
    ) {
      failures.push("sprite manifest usage.visible_until_sec must be after visible_from_sec");
    }
    if (
      hasText(manifest.usage?.semantic_status) &&
      !/\bnot evidence\b/i.test(manifest.usage.semantic_status)
    ) {
      failures.push("sprite manifest usage.semantic_status must explicitly mark the sprite as not evidence");
    }
    if (
      hasText(manifest.usage?.motion) &&
      !/\bsemantic-settle\b/i.test(manifest.usage.motion)
    ) {
      failures.push("sprite manifest usage.motion must name semantic-settle");
    }

    const sourcePath = hasText(manifest.generation?.source_path)
      ? resolve(planBaseDir, manifest.generation.source_path)
      : undefined;
    const outputPath = hasText(manifest.postprocess?.output_path)
      ? resolve(planBaseDir, manifest.postprocess.output_path)
      : undefined;
    const renderPath = hasText(manifest.usage?.render_path)
      ? resolve(planBaseDir, manifest.usage.render_path)
      : undefined;
    const runtimeComposition = hasText(manifest.usage?.composition)
      ? runtimeRegistry[manifest.usage.composition]
      : undefined;
    const runtimeAsset =
      runtimeComposition && hasText(manifest.asset_id)
        ? runtimeComposition.assets[manifest.asset_id]
        : undefined;

    for (const [label, hash] of [
      ["generation.source_sha256", manifest.generation?.source_sha256],
      ["postprocess.output_sha256", manifest.postprocess?.output_sha256],
      ["usage.render_sha256", manifest.usage?.render_sha256],
    ] as const) {
      if (hasText(hash) && !sha256Pattern.test(hash)) {
        failures.push(`sprite manifest ${label} must be a lowercase SHA-256`);
      }
    }

    if (sourcePath) {
      if (!existsSync(sourcePath)) {
        failures.push(`sprite source does not exist: ${sourcePath}`);
      } else if (
        hasText(manifest.generation?.source_sha256) &&
        sha256(sourcePath) !== manifest.generation.source_sha256
      ) {
        failures.push("sprite source SHA-256 does not match the manifest");
      }
    }
    if (outputPath) {
      if (outputPath !== assetPath) {
        failures.push("sprite manifest postprocess.output_path does not match the audited asset path");
      }
      if (!existsSync(outputPath)) {
        failures.push(`sprite manifest output does not exist: ${outputPath}`);
      } else if (
        hasText(manifest.postprocess?.output_sha256) &&
        sha256(outputPath) !== manifest.postprocess.output_sha256
      ) {
        failures.push("sprite asset SHA-256 does not match the manifest");
      }
    }
    if (renderPath) {
      if (!existsSync(renderPath)) {
        failures.push(`sprite render asset does not exist: ${renderPath}`);
      } else {
        const renderHash = sha256(renderPath);
        if (
          hasText(manifest.usage?.render_sha256) &&
          renderHash !== manifest.usage.render_sha256
        ) {
          failures.push("sprite render asset SHA-256 does not match the manifest");
        }
        if (
          hasText(manifest.postprocess?.output_sha256) &&
          renderHash !== manifest.postprocess.output_sha256
        ) {
          failures.push("sprite render asset does not match the canonical audited asset");
        }
      }
    }
    if (!runtimeComposition) {
      if (hasText(manifest.usage?.composition)) {
        failures.push(
          `sprite runtime registry has no composition ${manifest.usage.composition}`,
        );
      }
    } else {
      if (runtimeComposition.compositionId !== manifest.usage?.composition) {
        failures.push("sprite runtime registry composition ID is inconsistent");
      }
      if (!isFiniteNumber(runtimeComposition.fps) || runtimeComposition.fps <= 0) {
        failures.push("sprite runtime registry composition fps must be positive");
      } else if (
        isFiniteNumber(manifestFps) &&
        manifestFps !== runtimeComposition.fps
      ) {
        failures.push("sprite manifest fps does not match the runtime composition fps");
      }
      if (!runtimeAsset) {
        if (hasText(manifest.asset_id)) {
          failures.push(
            `sprite runtime registry has no asset ${manifest.asset_id} for ${runtimeComposition.compositionId}`,
          );
        }
      } else {
        if (runtimeAsset.assetId !== manifest.asset_id) {
          failures.push("sprite runtime registry asset ID is inconsistent");
        }
        if (!hasText(runtimeAsset.staticFilePath)) {
          failures.push("sprite runtime registry asset is missing staticFilePath");
        }
        if (!sha256Pattern.test(runtimeAsset.sha256)) {
          failures.push("sprite runtime registry asset sha256 must be a lowercase SHA-256");
        }
        const runtimeFrameTolerance =
          isFiniteNumber(runtimeComposition.fps) && runtimeComposition.fps > 0
            ? 1 / runtimeComposition.fps + 1e-6
            : timeToleranceSec;
        if (
          !isFiniteNumber(runtimeAsset.visibleFromSec) ||
          runtimeAsset.visibleFromSec < 0
        ) {
          failures.push("sprite runtime registry visibleFromSec must be non-negative");
        }
        if (
          !isFiniteNumber(runtimeAsset.visibleUntilSec) ||
          !isFiniteNumber(runtimeAsset.visibleFromSec) ||
          runtimeAsset.visibleUntilSec <= runtimeAsset.visibleFromSec
        ) {
          failures.push("sprite runtime registry visibleUntilSec must follow visibleFromSec");
        }
        if (!isFiniteNumber(runtimeAsset.enterDurationSec) || runtimeAsset.enterDurationSec <= 0) {
          failures.push("sprite runtime registry enterDurationSec must be positive");
        }
        if (
          !isFiniteNumber(runtimeAsset.exitDurationSec) ||
          runtimeAsset.exitDurationSec <= 0 ||
          (isFiniteNumber(runtimeAsset.enterDurationSec) &&
            runtimeAsset.exitDurationSec >= runtimeAsset.enterDurationSec)
        ) {
          failures.push("sprite runtime registry exitDurationSec must be positive and shorter than entrance");
        }
        if (!isFiniteNumber(runtimeAsset.translateY)) {
          failures.push("sprite runtime registry translateY must be finite");
        }
        if (!isFiniteNumber(runtimeAsset.exitTranslateY)) {
          failures.push("sprite runtime registry exitTranslateY must be finite");
        }
        if (
          !isFiniteNumber(runtimeAsset.maxOpacity) ||
          runtimeAsset.maxOpacity <= 0 ||
          runtimeAsset.maxOpacity > 1
        ) {
          failures.push("sprite runtime registry maxOpacity must be in (0, 1]");
        }
        if (
          isFiniteNumber(visibleFromSec) &&
          isFiniteNumber(runtimeAsset.visibleFromSec) &&
          !nearlyEqual(visibleFromSec, runtimeAsset.visibleFromSec, runtimeFrameTolerance)
        ) {
          failures.push("sprite manifest visible_from_sec does not match the runtime registry");
        }
        if (
          isFiniteNumber(visibleUntilSec) &&
          isFiniteNumber(runtimeAsset.visibleUntilSec) &&
          !nearlyEqual(visibleUntilSec, runtimeAsset.visibleUntilSec, runtimeFrameTolerance)
        ) {
          failures.push("sprite manifest visible_until_sec does not match the runtime registry");
        }
        const registeredRenderPath = resolve(
          runtimePublicDir,
          runtimeAsset.staticFilePath,
        );
        if (renderPath !== registeredRenderPath) {
          failures.push("sprite manifest render path does not match the runtime registry");
        }
        if (
          hasText(manifest.usage?.render_sha256) &&
          manifest.usage.render_sha256 !== runtimeAsset.sha256
        ) {
          failures.push("sprite manifest render SHA-256 does not match the runtime registry");
        }
        if (!existsSync(registeredRenderPath)) {
          failures.push(`sprite runtime registry asset does not exist: ${registeredRenderPath}`);
        } else if (sha256(registeredRenderPath) !== runtimeAsset.sha256) {
          failures.push("sprite runtime registry SHA-256 does not match its static file");
        }
      }
    }

    const binding = options.binding;
    if (binding) {
      const expectedAssetPath = resolve(planBaseDir, binding.assetPath);
      const expectedRenderAssetPath = resolve(planBaseDir, binding.renderAssetPath);
      const expectedManifestPath = resolve(planBaseDir, binding.manifestPath);
      if (assetPath !== expectedAssetPath) {
        failures.push(`${binding.beatId} audited sprite path does not match asset plan asset_path`);
      }
      if (manifestPath !== expectedManifestPath) {
        failures.push(`${binding.beatId} audited manifest path does not match asset plan manifest_path`);
      }
      if (renderPath !== expectedRenderAssetPath) {
        failures.push(`${binding.beatId} sprite manifest render path does not match asset plan render_asset_path`);
      }
      if (manifest.usage?.composition !== binding.compositionId) {
        failures.push(`${binding.beatId} sprite manifest composition does not match asset plan composition_id`);
      }
      if (manifest.asset_id !== binding.assetId) {
        failures.push(`${binding.beatId} sprite manifest asset_id does not match asset plan`);
      }
      if (manifest.style_family_id !== binding.styleFamilyId) {
        failures.push(`${binding.beatId} sprite manifest style_family_id does not match asset plan`);
      }
      if (manifest.narrative_job?.trim() !== binding.semanticJob.trim()) {
        failures.push(`${binding.beatId} sprite manifest narrative_job does not match asset plan semantic_job`);
      }
      if (manifest.usage?.scene_id !== binding.beatId) {
        failures.push(`${binding.beatId} sprite manifest usage.scene_id does not match asset plan beat id`);
      }
      if (binding.visualRole === "evidence") {
        failures.push(`${binding.beatId} cannot bind a semantic sprite to evidence`);
      }
      const rightsByAssetPlanValue: Record<string, readonly string[]> = {
        generated: ["owned-generated"],
        owned: ["owned"],
        licensed: ["licensed"],
      };
      const expectedRights = rightsByAssetPlanValue[binding.rights] ?? [];
      if (!expectedRights.includes(manifest.rights ?? "")) {
        failures.push(`${binding.beatId} sprite manifest rights does not match asset plan rights`);
      }
      if (manifest.alpha_qa?.status !== binding.alphaQaStatus) {
        failures.push(`${binding.beatId} sprite manifest alpha QA status does not match asset plan`);
      }
      if (!isFiniteNumber(binding.fps) || binding.fps <= 0) {
        failures.push(`${binding.beatId} storyboard fps must be positive for a semantic sprite`);
      } else if (isFiniteNumber(manifestFps) && manifestFps !== binding.fps) {
        failures.push(`${binding.beatId} sprite manifest fps does not match storyboard fps`);
      }
      if (runtimeAsset) {
        const frameTolerance =
          isFiniteNumber(binding.fps) && binding.fps > 0
            ? 1 / binding.fps + 1e-6
            : timeToleranceSec;
        if (
          !isFiniteNumber(binding.enterDurationSec) ||
          !nearlyEqual(
            runtimeAsset.enterDurationSec,
            binding.enterDurationSec,
            frameTolerance,
          )
        ) {
          failures.push(`${binding.beatId} runtime entrance duration does not match storyboard motion`);
        }
        if (
          !isFiniteNumber(binding.exitDurationSec) ||
          !nearlyEqual(
            runtimeAsset.exitDurationSec,
            binding.exitDurationSec,
            frameTolerance,
          )
        ) {
          failures.push(`${binding.beatId} runtime exit duration does not match storyboard motion`);
        }
        if (
          !isFiniteNumber(binding.translatePx) ||
          runtimeAsset.translateY !== binding.translatePx
        ) {
          failures.push(`${binding.beatId} runtime translation does not match storyboard motion`);
        }
      }
      if (
        isFiniteNumber(visibleFromSec) &&
        (visibleFromSec < binding.startSec - timeToleranceSec ||
          visibleFromSec > binding.endSec + timeToleranceSec)
      ) {
        failures.push(`${binding.beatId} sprite visibility starts outside the asset-plan beat`);
      }
      if (
        isFiniteNumber(visibleUntilSec) &&
        (visibleUntilSec < binding.startSec - timeToleranceSec ||
          visibleUntilSec > binding.endSec + timeToleranceSec)
      ) {
        failures.push(`${binding.beatId} sprite visibility ends outside the asset-plan beat`);
      }
      if (
        isFiniteNumber(binding.cueSec) &&
        isFiniteNumber(visibleFromSec) &&
        !nearlyEqual(visibleFromSec, binding.cueSec)
      ) {
        failures.push(`${binding.beatId} sprite manifest visible_from_sec does not match storyboard cue`);
      }
      if (
        isFiniteNumber(binding.expectedVisibleUntilSec) &&
        isFiniteNumber(visibleUntilSec) &&
        isFiniteNumber(binding.fps) &&
        binding.fps > 0 &&
        !nearlyEqual(visibleUntilSec, binding.expectedVisibleUntilSec, 1 / binding.fps + 1e-6)
      ) {
        failures.push(`${binding.beatId} sprite manifest visible_until_sec does not match storyboard exit`);
      }
      if (
        hasText(binding.motionRecipe) &&
        hasText(manifest.usage?.motion) &&
        !manifest.usage.motion.toLowerCase().includes(binding.motionRecipe.toLowerCase())
      ) {
        failures.push(`${binding.beatId} sprite manifest motion does not match the storyboard recipe`);
      }
    }
  }

  if (existsSync(assetPath)) {
    try {
      const { width, height, pixFmt } = probeImage(assetPath);
      if (!pixFmt.includes("a")) failures.push(`sprite has no alpha channel (${pixFmt})`);
      const decoded = run("ffmpeg", [
        "-v",
        "error",
        "-i",
        assetPath,
        "-frames:v",
        "1",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgba",
        "pipe:1",
      ]).stdout;
      metrics = analyzeRgbaPixels(new Uint8Array(decoded), width, height);
      const total = metrics.totalPixels;
      if (
        manifest &&
        Array.isArray(manifest.postprocess?.dimensions) &&
        (manifest.postprocess.dimensions[0] !== width ||
          manifest.postprocess.dimensions[1] !== height)
      ) {
        failures.push("sprite decoded dimensions do not match the manifest");
      }
      if (manifest?.alpha_qa) {
        for (const [label, recorded, actual] of [
          ["transparent_pixels", manifest.alpha_qa.transparent_pixels, metrics.transparentPixels],
          [
            "partially_transparent_pixels",
            manifest.alpha_qa.partially_transparent_pixels,
            metrics.partiallyTransparentPixels,
          ],
          ["total_pixels", manifest.alpha_qa.total_pixels, metrics.totalPixels],
          ["alpha_min", manifest.alpha_qa.alpha_min, metrics.alphaMin],
          ["alpha_max", manifest.alpha_qa.alpha_max, metrics.alphaMax],
          ["top_left_alpha", manifest.alpha_qa.top_left_alpha, metrics.cornerAlpha[0]],
          ["top_right_alpha", manifest.alpha_qa.top_right_alpha, metrics.cornerAlpha[1]],
          ["bottom_left_alpha", manifest.alpha_qa.bottom_left_alpha, metrics.cornerAlpha[2]],
          ["bottom_right_alpha", manifest.alpha_qa.bottom_right_alpha, metrics.cornerAlpha[3]],
        ] as const) {
          if (recorded !== actual) {
            failures.push(`sprite decoded ${label} does not match the manifest`);
          }
        }
        if (
          isFiniteNumber(manifest.alpha_qa.alpha_average) &&
          Math.abs(manifest.alpha_qa.alpha_average - metrics.alphaAverage) > 0.01
        ) {
          failures.push("sprite decoded alpha_average does not match the manifest");
        }
      }
      if (metrics.alphaMin !== 0 || metrics.transparentPixels === 0) {
        failures.push("sprite background is not transparent");
      }
      if (metrics.alphaMax === 0 || metrics.opaquePixels === 0) {
        failures.push("sprite contains no visible opaque content");
      }
      if (metrics.cornerAlpha.some((alpha) => alpha !== 0)) {
        failures.push("sprite corners must be fully transparent");
      }
      const bounds = metrics.contentBounds;
      if (
        bounds.left <= 1 ||
        bounds.top <= 1 ||
        bounds.right >= width - 2 ||
        bounds.bottom >= height - 2
      ) {
        failures.push("sprite content touches the image edge; preserve transparent padding");
      }
      const partial = Math.max(1, metrics.partiallyTransparentPixels);
      if (metrics.greenFringePixels / partial > 0.02 || metrics.greenFringePixels > total * 0.0005) {
        failures.push("sprite has a likely green matte fringe");
      }
      if (metrics.opaqueGreenEdgePixels > 0) {
        failures.push("sprite has opaque green edge pixels adjacent to transparency");
      }
      if (metrics.blackFringePixels / partial > 0.2) {
        warnings.push("sprite has a possible black matte fringe; inspect the dark composite");
      }
      if (metrics.whiteFringePixels / partial > 0.2) {
        warnings.push("sprite has a possible white matte fringe; inspect the light composite");
      }

      if (options.previewDir) {
        const previewDir = resolve(planBaseDir, options.previewDir);
        mkdirSync(previewDir, { recursive: true });
        const stem = basename(assetPath, extname(assetPath));
        const light = join(previewDir, `${stem}-on-light.png`);
        const dark = join(previewDir, `${stem}-on-dark.png`);
        renderComposite(assetPath, width, height, "0xf4f3ef", light);
        renderComposite(assetPath, width, height, "0x0a2346", dark);
        previewPaths.push(light, dark);
      }
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }

  const passed = failures.length === 0;
  const summaryMarkdown = [
    "# Semantic Sprite Asset Audit",
    "",
    `Status: ${passed ? "PASS" : "FAIL"}`,
    `Asset: ${assetPath}`,
    `Manifest: ${manifestPath}`,
    metrics
      ? `Alpha: ${metrics.alphaMin}-${metrics.alphaMax}; average ${metrics.alphaAverage.toFixed(2)}; transparent ${metrics.transparentPixels}; partial ${metrics.partiallyTransparentPixels}; opaque-green edge ${metrics.opaqueGreenEdgePixels}`
      : "Alpha: not measured",
    "",
    "## Failures",
    failures.length ? failures.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Warnings",
    warnings.length ? warnings.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Composite previews",
    previewPaths.length ? previewPaths.map((item) => `- ${item}`).join("\n") : "- not generated",
    "",
  ].join("\n");

  return { passed, failures, warnings, metrics, previewPaths, summaryMarkdown };
}

const argValue = (args: string[], name: string): string | undefined => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

if (import.meta.main) {
  const args = process.argv.slice(2);
  const assetPath = argValue(args, "--asset");
  const manifestPath = argValue(args, "--manifest");
  if (!assetPath || !manifestPath) {
    console.error(
      "Usage: bun sprite-asset-audit.ts --asset <sprite.png> --manifest <manifest.json> [--base-dir <asset-plan-dir>] [--preview-dir <dir>] [--output <report.md>]",
    );
    process.exit(2);
  }
  const result = auditSemanticSpriteAsset({
    assetPath,
    manifestPath,
    planBaseDir: argValue(args, "--base-dir"),
    previewDir: argValue(args, "--preview-dir"),
  });
  const output = argValue(args, "--output");
  if (output) {
    const target = resolve(output);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${result.summaryMarkdown}\n`, "utf8");
  }
  console.log(result.summaryMarkdown);
  process.exit(result.passed ? 0 : 1);
}
