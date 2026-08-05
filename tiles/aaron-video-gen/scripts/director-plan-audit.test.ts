import { describe, expect, test } from "bun:test";
import {
  auditDirectorPlan,
  type DirectorPlan,
} from "./director-plan-audit";

function makePlan(): DirectorPlan {
  return {
    schema_version: 1,
    title: "A directed editorial film",
    duration_sec: 20,
    product_promise: "Show why delivery changes the outcome.",
    visual_budget: {
      remotion_motion_target_ratio: 0.7,
      evidence_or_still_target_ratio: 0.25,
      max_generated_video_ratio: 0.15,
      max_generated_video_beats: 1,
      max_semantic_sprite_beats: 0,
    },
    beats: [
      {
        id: "s01",
        start_sec: 0,
        end_sec: 10,
        narrative_role: "hook",
        visual_mode: "motion",
        intensity: "structured",
        entry_mode: "meaningful",
        entry_visual: "A visible signal already in motion.",
        first_visual_change_sec: 0.25,
        visual_reason: "Establish the question before explaining it.",
        camera_or_motion: "Frame-driven rail convergence.",
        asset_provenance: "Remotion-native editorial geometry.",
        sound_cue: "Opening cue enters under narration.",
        transition_out: "Clean cut after the thesis lands.",
        fallback: "Static statement on the same grid.",
      },
      {
        id: "s02",
        start_sec: 10,
        end_sec: 20,
        narrative_role: "explain",
        visual_mode: "hybrid",
        intensity: "calm",
        entry_mode: "bridge",
        entry_visual: "A field insert resolves into a diagram.",
        first_visual_change_sec: 0.5,
        visual_reason: "Give a system explanation a physical setting.",
        camera_or_motion: "Short crop-in, then a flat handoff to the diagram.",
        asset_id: "factory-establishing",
        asset_provenance: "Generated illustration, labeled as an atmospheric insert.",
        generated_video_sec: 2,
        sound_cue: "Music falls back under explanation.",
        transition_out: "The diagram inherits the final image axis.",
        fallback: "Still image plus the same diagram.",
      },
    ],
  };
}

describe("director plan audit", () => {
  test("passes a bounded plan with a meaningful opening and an asset fallback", () => {
    const result = auditDirectorPlan(makePlan());
    expect(result.passed).toBe(true);
    expect(result.failures).toEqual([]);
  });

  test("rejects blank entries and timeline gaps", () => {
    const plan = makePlan();
    plan.beats[0].entry_mode = "blank" as never;
    plan.beats[1].start_sec = 12;

    const result = auditDirectorPlan(plan);
    expect(result.failures).toContain("s01 begins on a blank or invalid stage");
    expect(result.failures).toContain("s02 has a gap of 2.0s");
  });

  test("rejects an excessive generated-video budget", () => {
    const plan = makePlan();
    plan.beats[1].generated_video_sec = 5;
    plan.beats.push({
      ...plan.beats[1],
      id: "s03",
      start_sec: 20,
      end_sec: 30,
    });
    plan.duration_sec = 30;

    const result = auditDirectorPlan(plan);
    expect(result.failures).toContain(
      "generated video uses 2 beats, above the 1 beat budget",
    );
    expect(result.failures.some((item) => item.startsWith("generated video occupies"))).toBe(true);
  });

  test("keeps semantic sprites zero-default and accepts one explicit explanation accent", () => {
    const plan = makePlan();
    plan.beats[1].semantic_sprite = {
      asset_id: "generated:ledger-v1",
      semantic_job: "Make system of record concrete for one beat.",
      style_family_id: "paper-indigo-editorial",
      motion_recipe: "semantic-settle",
      single_use: true,
      fallback: "Remove the sprite; the structured explanation remains complete.",
    };

    const blocked = auditDirectorPlan(plan);
    expect(blocked.failures).toContain(
      "semantic sprites use 1 beats, above the 0 beat budget",
    );

    plan.visual_budget.max_semantic_sprite_beats = 1;
    const approved = auditDirectorPlan(plan);
    expect(approved.passed).toBe(true);
  });

  test("rejects semantic sprites used as evidence or reused across beats", () => {
    const plan = makePlan();
    plan.visual_budget.max_semantic_sprite_beats = 2;
    const sprite = {
      asset_id: "generated:ledger-v1",
      semantic_job: "Make a system of record concrete.",
      style_family_id: "paper-indigo-editorial",
      motion_recipe: "semantic-settle" as const,
      single_use: true as const,
      fallback: "Remove the sprite.",
    };
    plan.beats[0].narrative_role = "evidence";
    plan.beats[0].visual_mode = "hybrid";
    plan.beats[0].semantic_sprite = sprite;
    plan.beats[1].semantic_sprite = sprite;

    const result = auditDirectorPlan(plan);
    expect(result.failures).toContain(
      "visual_budget.max_semantic_sprite_beats cannot exceed 1",
    );
    expect(result.failures).toContain("s01 cannot use a semantic sprite as evidence");
    expect(result.failures).toContain(
      "s02 reuses semantic sprite asset generated:ledger-v1",
    );
  });
});
