import { expect, test } from "bun:test";
import type { AssetPlan } from "./content-evidence-audit";
import type { DirectorPlan } from "./director-plan-audit";
import { auditSemanticSpriteConsistency } from "./production-preflight";
import type { VideoStoryboard } from "./storyboard-audit";

const spriteId = "generated:ledger-v1";
const semanticJob = "Make system of record concrete for one beat.";
const styleFamilyId = "paper-indigo-editorial";

const plans = () => ({
  director: {
    beats: [
      {
        id: "s02",
        start_sec: 5,
        end_sec: 10,
        narrative_role: "explain",
        sound_cue: "Approved narration only.",
        semantic_sprite: {
          asset_id: spriteId,
          semantic_job: semanticJob,
          style_family_id: styleFamilyId,
          motion_recipe: "semantic-settle",
          single_use: true,
          fallback: "Remove it.",
        },
      },
    ],
  } as unknown as DirectorPlan,
  asset: {
    visual_spine_id: styleFamilyId,
    beats: [
      {
        id: "s02",
        start_sec: 5,
        end_sec: 10,
        visual_role: "explanation",
        usage_role: "semantic-accent",
        asset_id: spriteId,
        semantic_job: semanticJob,
        style_family_id: styleFamilyId,
      },
    ],
  } as unknown as AssetPlan,
  storyboard: {
    fps: 30,
    direction: { style_family_id: styleFamilyId },
    scenes: [
      {
        id: "s02",
        start_sec: 5,
        end_sec: 10,
        role: "explanation",
        motion_recipes: ["semantic-settle"],
        semantic_sprite_ids: [spriteId],
        beats: [
          {
            at_sec: 1.25,
            visual: "ledger",
            action: "reveal",
            target_asset_id: spriteId,
            motion: { recipe: "semantic-settle", exit_duration_sec: 0.3 },
          },
          { at_sec: 2, visual: "ledger", action: "clear", target_asset_id: spriteId },
        ],
        music_cue: "Approved narration only.",
      },
    ],
  } as unknown as VideoStoryboard,
});

test("semantic sprite records agree across all three planning lanes", () => {
  const { director, asset, storyboard } = plans();
  expect(auditSemanticSpriteConsistency(director, asset, storyboard)).toEqual([]);
});

test("preflight reports a semantic sprite omitted by any planning lane", () => {
  const { director, asset, storyboard } = plans();
  asset.beats = [];
  expect(auditSemanticSpriteConsistency(director, asset, storyboard)).toContain(
    `semantic sprite ${spriteId} is missing from asset plan`,
  );
});

test("maps semantic sprites by asset ID and rejects different beat or scene IDs", () => {
  const { director, asset, storyboard } = plans();
  storyboard.scenes[0].id = "s03";
  expect(auditSemanticSpriteConsistency(director, asset, storyboard)).toContain(
    `semantic sprite ${spriteId} maps to different beat/scene IDs (s02, s02, s03)`,
  );
});

test("rejects semantic sprite IDs on evidence scenes even when ID sets agree", () => {
  const { director, asset, storyboard } = plans();
  director.beats[0].narrative_role = "evidence";
  asset.beats[0].visual_role = "evidence";
  storyboard.scenes[0].role = "evidence";
  expect(auditSemanticSpriteConsistency(director, asset, storyboard)).toContain(
    `semantic sprite ${spriteId} cannot appear on an evidence beat or scene`,
  );
});

test("rejects a storyboard-only sprite ID on an evidence scene", () => {
  const { director, asset, storyboard } = plans();
  director.beats = [];
  asset.beats = [];
  storyboard.scenes[0].role = "evidence";
  expect(auditSemanticSpriteConsistency(director, asset, storyboard)).toContain(
    `semantic sprite ${spriteId} cannot appear on an evidence beat or scene`,
  );
});

test("rejects semantic role and style-family drift", () => {
  const { director, asset, storyboard } = plans();
  storyboard.scenes[0].role = "emphasis";
  asset.beats[0].style_family_id = "unrelated-style";
  const failures = auditSemanticSpriteConsistency(director, asset, storyboard);
  expect(failures).toContain(`semantic sprite ${spriteId} has inconsistent semantic role across plans`);
  expect(failures).toContain(`semantic sprite ${spriteId} has inconsistent style family across plans`);
});

test("requires an explicit storyboard style family for semantic sprites", () => {
  const { director, asset, storyboard } = plans();
  delete storyboard.direction.style_family_id;
  expect(auditSemanticSpriteConsistency(director, asset, storyboard)).toContain(
    `semantic sprite ${spriteId} storyboard is missing style_family_id`,
  );
});

test("requires storyboard fps and an explicit semantic-sprite exit beat", () => {
  const { director, asset, storyboard } = plans();
  delete storyboard.fps;
  storyboard.scenes[0].beats[1] = {
    at_sec: 2,
    visual: "scene title",
    action: "clear",
  } as never;
  const failures = auditSemanticSpriteConsistency(director, asset, storyboard);

  expect(failures).toContain(
    `semantic sprite ${spriteId} storyboard is missing a valid fps`,
  );
  expect(failures).toContain(
    `semantic sprite ${spriteId} is missing a clear/remove/exit/hide beat after its cue`,
  );
});

test("rejects scene timing and motion-cue drift", () => {
  const { director, asset, storyboard } = plans();
  storyboard.scenes[0].start_sec = 5.25;
  storyboard.scenes[0].motion_recipes = [];
  storyboard.scenes[0].beats = [];
  const failures = auditSemanticSpriteConsistency(director, asset, storyboard);
  expect(failures).toContain(`semantic sprite ${spriteId} has inconsistent timing across plans`);
  expect(failures).toContain(
    `semantic sprite ${spriteId} is missing its semantic-settle storyboard cue`,
  );
});
