import { afterEach, expect, test } from "bun:test";
import { spawnSync } from "child_process";
import { createHash } from "crypto";
import {
  appendFileSync,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import {
  analyzeRgbaPixels,
  auditSemanticSpriteAsset,
  type SpriteAssetPlanBinding,
} from "./sprite-asset-audit";

const tempDirs: string[] = [];

afterEach(() => {
  for (const path of tempDirs.splice(0)) rmSync(path, { recursive: true, force: true });
});

const sha256 = (path: string): string =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

function makeSpriteFixture(options: { opaqueGreenEdge?: boolean } = {}) {
  const baseDir = mkdtempSync(join(tmpdir(), "sprite-audit-"));
  tempDirs.push(baseDir);
  const width = 7;
  const height = 7;
  const rgba = new Uint8Array(width * height * 4);
  for (let y = 2; y <= 4; y += 1) {
    for (let x = 2; x <= 4; x += 1) {
      const offset = (y * width + x) * 4;
      const useGreen = options.opaqueGreenEdge && x === 2 && y === 2;
      rgba[offset] = useGreen ? 0 : 10;
      rgba[offset + 1] = useGreen ? 255 : 35;
      rgba[offset + 2] = useGreen ? 0 : 70;
      rgba[offset + 3] = x === 3 && y === 2 ? 128 : 255;
    }
  }

  const sourcePath = join(baseDir, "source", "ledger.rgba");
  const assetPath = join(baseDir, "assets", "ledger.png");
  const renderAssetPath = join(baseDir, "runtime", "ledger.png");
  const manifestPath = join(baseDir, "manifests", "ledger.json");
  mkdirSync(dirname(sourcePath), { recursive: true });
  mkdirSync(dirname(assetPath), { recursive: true });
  mkdirSync(dirname(renderAssetPath), { recursive: true });
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(sourcePath, rgba);
  const encoded = spawnSync(
    "ffmpeg",
    [
      "-v",
      "error",
      "-f",
      "rawvideo",
      "-pix_fmt",
      "rgba",
      "-s",
      `${width}x${height}`,
      "-i",
      sourcePath,
      "-frames:v",
      "1",
      "-y",
      assetPath,
    ],
    { encoding: "utf8" },
  );
  if (encoded.status !== 0) throw new Error(encoded.stderr);
  copyFileSync(assetPath, renderAssetPath);

  const metrics = analyzeRgbaPixels(rgba, width, height);
  const manifest = {
    schema_version: 1,
    asset_id: "generated:ledger-v1",
    title: "Ledger",
    created_for: "Test film",
    narrative_job: "Make system of record concrete for one beat.",
    selection_rationale: "The cue has real negative space and benefits from one mnemonic.",
    style_family_id: "paper-indigo-editorial",
    generation: {
      provider: "Test provider",
      model: "test-model-v1",
      prompt: "One indigo ledger on a flat chroma background.",
      source_path: "source/ledger.rgba",
      source_sha256: sha256(sourcePath),
    },
    postprocess: {
      method: "Decode source RGBA and encode a transparent PNG.",
      output_path: "assets/ledger.png",
      output_sha256: sha256(assetPath),
      dimensions: [width, height],
      mode: "RGBA",
    },
    alpha_qa: {
      transparent_pixels: metrics.transparentPixels,
      partially_transparent_pixels: metrics.partiallyTransparentPixels,
      total_pixels: metrics.totalPixels,
      alpha_min: metrics.alphaMin,
      alpha_average: Number(metrics.alphaAverage.toFixed(2)),
      alpha_max: metrics.alphaMax,
      top_left_alpha: metrics.cornerAlpha[0],
      top_right_alpha: metrics.cornerAlpha[1],
      bottom_left_alpha: metrics.cornerAlpha[2],
      bottom_right_alpha: metrics.cornerAlpha[3],
      status: "pass",
    },
    usage: {
      composition: "TestComposition",
      scene_id: "s02",
      fps: 30,
      render_path: "runtime/ledger.png",
      render_sha256: sha256(renderAssetPath),
      visible_from_sec: 6.25,
      visible_until_sec: 8,
      motion: "semantic-settle: opacity plus a 10px settle; no loop",
      semantic_status: "Illustrative mnemonic, not evidence",
    },
    rights: "owned-generated",
    asset_library: {
      policy: "ignore",
      scope: "project-specific",
      reason: "Project-specific test fixture.",
    },
  };
  const binding: SpriteAssetPlanBinding = {
    beatId: "s02",
    assetId: "generated:ledger-v1",
    assetPath: "assets/ledger.png",
    renderAssetPath: "runtime/ledger.png",
    compositionId: "TestComposition",
    manifestPath: "manifests/ledger.json",
    semanticJob: "Make system of record concrete for one beat.",
    styleFamilyId: "paper-indigo-editorial",
    visualRole: "explanation",
    rights: "generated",
    alphaQaStatus: "pass",
    startSec: 5,
    endSec: 10,
    fps: 30,
    cueSec: 6.25,
    expectedVisibleUntilSec: 8,
    enterDurationSec: 0.4,
    exitDurationSec: 0.3,
    translatePx: 10,
    motionRecipe: "semantic-settle",
  };
  const runtimeRegistry = {
    TestComposition: {
      compositionId: "TestComposition",
      fps: 30,
      assets: {
        "generated:ledger-v1": {
          assetId: "generated:ledger-v1",
          staticFilePath: "runtime/ledger.png",
          sha256: sha256(renderAssetPath),
          visibleFromSec: 6.25,
          visibleUntilSec: 8,
          enterDurationSec: 0.4,
          exitDurationSec: 0.3,
          translateY: 10,
          exitTranslateY: 6,
          maxOpacity: 0.95,
        },
      },
    },
  };
  const writeManifest = () => writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  writeManifest();
  const audit = () => auditSemanticSpriteAsset({
    assetPath: "assets/ledger.png",
    manifestPath: "manifests/ledger.json",
    planBaseDir: baseDir,
    binding,
    runtimePublicDir: baseDir,
    runtimeRegistry,
  });
  return {
    assetPath,
    baseDir,
    binding,
    manifest,
    manifestPath,
    renderAssetPath,
    runtimeRegistry,
    writeManifest,
    audit,
  };
}

test("measures transparent padding and opaque content", () => {
  const width = 5;
  const height = 5;
  const rgba = new Uint8Array(width * height * 4);
  for (let y = 1; y < 4; y += 1) {
    for (let x = 1; x < 4; x += 1) {
      const offset = (y * width + x) * 4;
      rgba[offset] = 10;
      rgba[offset + 1] = 35;
      rgba[offset + 2] = 70;
      rgba[offset + 3] = 255;
    }
  }

  const metrics = analyzeRgbaPixels(rgba, width, height);
  expect(metrics.alphaMin).toBe(0);
  expect(metrics.alphaMax).toBe(255);
  expect(metrics.totalPixels).toBe(25);
  expect(metrics.cornerAlpha).toEqual([0, 0, 0, 0]);
  expect(metrics.contentBounds).toEqual({ left: 1, top: 1, right: 3, bottom: 3 });
});

test("detects chroma-green pixels on a partially transparent edge", () => {
  const rgba = new Uint8Array([
    0, 255, 0, 100,
    10, 35, 70, 255,
  ]);
  const metrics = analyzeRgbaPixels(rgba, 2, 1);
  expect(metrics.greenFringePixels).toBe(1);
});

test("detects opaque chroma-green edge pixels but not opaque interior green", () => {
  const edge = new Uint8Array([
    0, 255, 0, 255,
    0, 0, 0, 0,
  ]);
  expect(analyzeRgbaPixels(edge, 2, 1).opaqueGreenEdgePixels).toBe(1);

  const interior = new Uint8Array(3 * 3 * 4);
  for (let index = 0; index < 9; index += 1) {
    interior[index * 4] = 10;
    interior[index * 4 + 1] = 35;
    interior[index * 4 + 2] = 70;
    interior[index * 4 + 3] = 255;
  }
  interior[(1 * 3 + 1) * 4] = 0;
  interior[(1 * 3 + 1) * 4 + 1] = 255;
  interior[(1 * 3 + 1) * 4 + 2] = 0;
  expect(analyzeRgbaPixels(interior, 3, 3).opaqueGreenEdgePixels).toBe(0);
});

test("validates a complete manifest using paths relative to the asset-plan base", () => {
  const fixture = makeSpriteFixture();
  const result = fixture.audit();
  expect(result.passed).toBe(true);
  expect(result.failures).toEqual([]);
});

test("rejects a renderer copy that has drifted from the canonical audited asset", () => {
  const fixture = makeSpriteFixture();
  appendFileSync(fixture.renderAssetPath, Buffer.from([0]));
  fixture.manifest.usage.render_sha256 = sha256(fixture.renderAssetPath);
  fixture.writeManifest();

  expect(fixture.audit().failures).toContain(
    "sprite render asset does not match the canonical audited asset",
  );
});

test("binds sprite exit timing to the storyboard within one rendered frame", () => {
  const fixture = makeSpriteFixture();
  fixture.manifest.usage.visible_until_sec = 8.2;
  fixture.writeManifest();

  expect(fixture.audit().failures).toContain(
    "s02 sprite manifest visible_until_sec does not match storyboard exit",
  );
});

test("rejects declarative FPS drift from the renderer composition registry", () => {
  const fixture = makeSpriteFixture();
  fixture.manifest.usage.fps = 24;
  fixture.binding.fps = 24;
  fixture.writeManifest();

  expect(fixture.audit().failures).toContain(
    "sprite manifest fps does not match the runtime composition fps",
  );
});

test("rejects plan and manifest path drift from the renderer staticFile registry", () => {
  const fixture = makeSpriteFixture();
  fixture.manifest.usage.render_path = "assets/ledger.png";
  fixture.manifest.usage.render_sha256 = sha256(fixture.assetPath);
  fixture.binding.renderAssetPath = "assets/ledger.png";
  fixture.writeManifest();

  expect(fixture.audit().failures).toContain(
    "sprite manifest render path does not match the runtime registry",
  );
});

test("rejects renderer timing and motion drift from storyboard and manifest", () => {
  const fixture = makeSpriteFixture();
  const runtimeAsset =
    fixture.runtimeRegistry.TestComposition.assets["generated:ledger-v1"];
  runtimeAsset.visibleUntilSec = 8.2;
  runtimeAsset.enterDurationSec = 0.5;
  runtimeAsset.translateY = 12;

  const failures = fixture.audit().failures;
  expect(failures).toContain(
    "sprite manifest visible_until_sec does not match the runtime registry",
  );
  expect(failures).toContain(
    "s02 runtime entrance duration does not match storyboard motion",
  );
  expect(failures).toContain(
    "s02 runtime translation does not match storyboard motion",
  );
});

test("fails the asset audit for opaque chroma-green pixels on a transparent edge", () => {
  const fixture = makeSpriteFixture({ opaqueGreenEdge: true });
  expect(fixture.audit().failures).toContain(
    "sprite has opaque green edge pixels adjacent to transparency",
  );
});

test("rejects missing provenance fields and invalid rights or library enums", () => {
  const fixture = makeSpriteFixture();
  const manifest = fixture.manifest as any;
  delete manifest.generation.provider;
  delete manifest.generation.model;
  delete manifest.generation.prompt;
  delete manifest.postprocess.method;
  delete manifest.alpha_qa.bottom_right_alpha;
  manifest.rights = "unknown";
  manifest.asset_library.policy = "maybe";
  fixture.writeManifest();

  const failures = fixture.audit().failures;
  expect(failures).toContain("sprite manifest is missing generation.provider");
  expect(failures).toContain("sprite manifest is missing generation.model");
  expect(failures).toContain("sprite manifest is missing generation.prompt");
  expect(failures).toContain("sprite manifest is missing postprocess.method");
  expect(failures).toContain(
    "sprite manifest alpha_qa.bottom_right_alpha must be an integer from 0 to 255",
  );
  expect(failures).toContain("sprite manifest rights is invalid");
  expect(failures).toContain("sprite manifest asset_library.policy is invalid");
});

test("rejects tampered hashes, dimensions, and recorded alpha metrics", () => {
  const fixture = makeSpriteFixture();
  fixture.manifest.generation.source_sha256 = "0".repeat(64);
  fixture.manifest.postprocess.output_sha256 = "not-a-hash";
  fixture.manifest.postprocess.dimensions = [8, 7];
  fixture.manifest.alpha_qa.transparent_pixels += 1;
  fixture.manifest.alpha_qa.alpha_average += 1;
  fixture.manifest.alpha_qa.top_left_alpha = 1;
  fixture.writeManifest();

  const failures = fixture.audit().failures;
  expect(failures).toContain("sprite source SHA-256 does not match the manifest");
  expect(failures).toContain(
    "sprite manifest postprocess.output_sha256 must be a lowercase SHA-256",
  );
  expect(failures).toContain("sprite asset SHA-256 does not match the manifest");
  expect(failures).toContain("sprite decoded dimensions do not match the manifest");
  expect(failures).toContain("sprite decoded transparent_pixels does not match the manifest");
  expect(failures).toContain("sprite decoded alpha_average does not match the manifest");
  expect(failures).toContain("sprite decoded top_left_alpha does not match the manifest");
});

test("rejects missing manifest source and output files", () => {
  const fixture = makeSpriteFixture();
  fixture.manifest.generation.source_path = "source/missing.rgba";
  fixture.manifest.postprocess.output_path = "assets/missing.png";
  fixture.writeManifest();

  const failures = fixture.audit().failures;
  expect(failures.some((failure) => failure.includes("sprite source does not exist"))).toBe(true);
  expect(failures).toContain(
    "sprite manifest postprocess.output_path does not match the audited asset path",
  );
  expect(failures.some((failure) => failure.includes("sprite manifest output does not exist"))).toBe(true);
});

test("rejects manifest identity, scene, style, visibility, and cue drift from the plan", () => {
  const fixture = makeSpriteFixture();
  fixture.manifest.asset_id = "generated:other-v1";
  fixture.manifest.narrative_job = "Different job.";
  fixture.manifest.style_family_id = "unrelated-style";
  fixture.manifest.usage.scene_id = "s03";
  fixture.manifest.usage.composition = "OtherComposition";
  fixture.manifest.usage.visible_from_sec = 6.5;
  fixture.manifest.usage.visible_until_sec = 11;
  fixture.manifest.usage.motion = "fade only";
  fixture.writeManifest();

  const failures = fixture.audit().failures;
  expect(failures).toContain("s02 sprite manifest asset_id does not match asset plan");
  expect(failures).toContain("s02 sprite manifest narrative_job does not match asset plan semantic_job");
  expect(failures).toContain("s02 sprite manifest style_family_id does not match asset plan");
  expect(failures).toContain("s02 sprite manifest usage.scene_id does not match asset plan beat id");
  expect(failures).toContain("s02 sprite manifest composition does not match asset plan composition_id");
  expect(failures).toContain("s02 sprite visibility ends outside the asset-plan beat");
  expect(failures).toContain("s02 sprite manifest visible_from_sec does not match storyboard cue");
  expect(failures).toContain("s02 sprite manifest motion does not match the storyboard recipe");
});
