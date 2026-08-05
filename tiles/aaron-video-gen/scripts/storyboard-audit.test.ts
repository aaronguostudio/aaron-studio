import { describe, expect, test } from "bun:test";
import {
  auditVideoStoryboard,
  loadSceneRegistry,
  type StoryboardBeat,
  type VideoStoryboard,
} from "./storyboard-audit";

function makeStoryboard(): VideoStoryboard {
  return {
    schema_version: 1,
    title: "A directed essay",
    duration_sec: 24,
    direction: {
      name: "Editorial systems film",
      visual_spine:
        "One grid, restrained color, evidence alternating with explanation.",
      motion_density: "balanced",
      music_strategy: "bookended",
      references: [
        {
          id: "reference-one",
          url: "https://example.com/reference",
          borrow: "Sound-led opening and authored scene changes.",
          avoid: "Constant spectacle.",
        },
      ],
    },
    scenes: [
      {
        id: "s01",
        title: "Evidence opens the argument",
        start_sec: 0,
        end_sec: 12,
        role: "evidence",
        template: "image-sequence",
        intensity: "calm",
        purpose: "Establish the concrete event.",
        entry_mode: "meaningful",
        entry_visual: "Full-frame source image with visible subject.",
        first_change_sec: 4,
        motion_recipes: ["crossfade"],
        content: ["source image", "supporting image"],
        beats: [
          { at_sec: 0, visual: "source image", action: "hold" },
          { at_sec: 6, visual: "supporting image", action: "crossfade" },
        ],
      },
      {
        id: "s02",
        title: "ACTOR builds",
        start_sec: 12,
        end_sec: 24,
        role: "explanation",
        template: "actor-framework",
        intensity: "structured",
        purpose: "Explain the operating framework.",
        entry_mode: "bridge",
        entry_visual:
          "Existing evidence remains while the framework scaffold appears.",
        first_change_sec: 0.6,
        motion_recipes: ["bridge-reveal", "card-build", "connector-draw"],
        content: ["Action", "Context", "Trust", "Outcome", "Recursive"],
        beats: [
          { at_sec: 0, visual: "bridge", action: "hold" },
          { at_sec: 4, visual: "first cards", action: "reveal" },
          { at_sec: 8, visual: "recursive connector", action: "draw" },
        ],
      },
    ],
  };
}

type StoryboardMotion = NonNullable<StoryboardBeat["motion"]>;

function makeSemanticSpriteStoryboard(
  motionOverrides: Partial<StoryboardMotion> = {},
): VideoStoryboard {
  const storyboard = makeStoryboard();
  storyboard.fps = 30;
  storyboard.scenes[1] = {
    ...storyboard.scenes[1],
    template: "system-map",
    motion_recipes: ["connector-draw", "semantic-settle"],
    semantic_sprite_ids: ["generated:ledger-v1"],
    prototype_required: true,
    fallback_template: "image-sequence",
    beats: storyboard.scenes[1].beats.map((beat, index) =>
      index === 1
        ? {
            ...beat,
            target_asset_id: "generated:ledger-v1",
            motion: {
              recipe: "semantic-settle",
              purpose: "explain",
              continuity_anchor: "The shared authority axis remains fixed.",
              why_not_static: "The cue benefits from one brief concrete mnemonic.",
              duration_sec: 0.4,
              exit_duration_sec: 0.3,
              easing: "ease-out",
              loop: false,
              translate_px: 10,
              rotation_deg: 0,
              ...motionOverrides,
            },
          }
        : index === 2
          ? {
              ...beat,
              action: "clear",
              target_asset_id: "generated:ledger-v1",
            }
          : beat,
    ),
  };
  return storyboard;
}

describe("video storyboard audit", () => {
  test("passes a storyboard made from available templates", () => {
    const result = auditVideoStoryboard(makeStoryboard(), loadSceneRegistry());

    expect(result.passed).toBe(true);
    expect(result.failures).toEqual([]);
    expect(result.prototypeScenes).toEqual([]);
  });

  test("rejects unknown templates and incompatible motion recipes", () => {
    const storyboard = makeStoryboard();
    storyboard.scenes[0].template = "imaginary-layout";
    storyboard.scenes[1].motion_recipes = ["count-up"];

    const result = auditVideoStoryboard(storyboard, loadSceneRegistry());

    expect(result.failures).toContain(
      "s01 uses unknown template imaginary-layout",
    );
    expect(result.failures).toContain(
      "s02 motion recipe count-up is not allowed for actor-framework",
    );
  });

  test("requires prototype flags and an available fallback for planned scenes", () => {
    const storyboard = makeStoryboard();
    storyboard.scenes[1] = {
      ...storyboard.scenes[1],
      template: "data-hero",
      role: "emphasis",
      intensity: "signature",
      motion_recipes: ["count-up", "stagger"],
      content: ["59 days", "four companies", "$7.5B"],
    };

    const failed = auditVideoStoryboard(storyboard, loadSceneRegistry());
    expect(failed.failures).toContain(
      "s02 must set prototype_required for data-hero",
    );
    expect(failed.failures).toContain(
      "s02 needs an available fallback_template",
    );

    storyboard.scenes[1].prototype_required = true;
    storyboard.scenes[1].fallback_template = "image-sequence";
    const planned = auditVideoStoryboard(storyboard, loadSceneRegistry());
    expect(planned.passed).toBe(true);
    expect(planned.prototypeScenes).toContain("s02");
    expect(planned.warnings).toContain(
      "s02 requires a prototype before full rendering (data-hero)",
    );

    const production = auditVideoStoryboard(storyboard, loadSceneRegistry(), {
      production: true,
    });
    expect(production.passed).toBe(false);
    expect(production.failures).toContain(
      "s02 uses prototype template data-hero in production mode",
    );
  });

  test("rejects blank entries and slow bridge reveals", () => {
    const storyboard = makeStoryboard();
    storyboard.scenes[0].entry_mode = "blank";
    storyboard.scenes[1].first_change_sec = 2;

    const result = auditVideoStoryboard(storyboard, loadSceneRegistry());

    expect(result.failures).toContain("s01 begins on a blank stage");
    expect(result.failures).toContain(
      "s02 bridge waits more than 1s for its first change",
    );
  });

  test("rejects timeline gaps before a full render", () => {
    const storyboard = makeStoryboard();
    storyboard.scenes[1].start_sec = 14;

    const result = auditVideoStoryboard(storyboard, loadSceneRegistry());

    expect(result.failures).toContain("s02 has a gap of 2.0s");
  });

  test("rejects duplicate scene ids and incomplete visual references", () => {
    const storyboard = makeStoryboard();
    storyboard.scenes[1].id = "s01";
    storyboard.direction.references[0].borrow = "";

    const result = auditVideoStoryboard(storyboard, loadSceneRegistry());

    expect(result.failures).toContain("duplicate scene id s01");
    expect(result.failures).toContain("visual reference 1 is incomplete");
  });

  test("accepts one audited semantic-settle accent on the promoted system map", () => {
    const storyboard = makeSemanticSpriteStoryboard();
    const registry = loadSceneRegistry();
    const result = auditVideoStoryboard(storyboard, registry, {
      production: true,
    });

    expect(registry.templates.find((item) => item.id === "system-map")?.status).toBe(
      "available",
    );
    expect(registry.motion_recipes.find((item) => item.id === "semantic-settle")?.status).toBe(
      "available",
    );
    expect(result.passed).toBe(true);
    expect(result.prototypeScenes).toEqual([]);
  });

  test("requires a valid frame rate when semantic sprites are present", () => {
    const storyboard = makeSemanticSpriteStoryboard();
    delete storyboard.fps;

    expect(auditVideoStoryboard(storyboard, loadSceneRegistry()).failures).toContain(
      "storyboard fps is required when semantic sprites are present",
    );
  });

  test("does not accept an unrelated clear beat as a semantic-sprite exit", () => {
    const storyboard = makeSemanticSpriteStoryboard();
    delete storyboard.scenes[1].beats[2].target_asset_id;
    storyboard.scenes[1].beats[2].visual = "scene title";

    expect(auditVideoStoryboard(storyboard, loadSceneRegistry()).failures).toContain(
      "s02 semantic sprite generated:ledger-v1 requires exactly one targeted clear/remove/exit/hide beat",
    );
  });

  test("rejects semantic-settle motion that breaks the restrained contract", () => {
    const storyboard = makeSemanticSpriteStoryboard({
      purpose: "decorate" as never,
      continuity_anchor: "",
      why_not_static: "",
      duration_sec: 0.8,
      exit_duration_sec: 0.2,
      easing: "ease-in-out",
      loop: true,
      translate_px: 18,
      rotation_deg: 2,
    });

    const result = auditVideoStoryboard(storyboard, loadSceneRegistry());
    expect(result.failures).toContain(
      "s02 beat motion semantic-settle duration is outside 0.3-0.5s",
    );
    expect(result.failures).toContain(
      "s02 beat motion semantic-settle uses invalid easing ease-in-out",
    );
    expect(result.failures).toContain(
      "s02 beat motion semantic-settle has invalid loop setting",
    );
    expect(result.failures).toContain(
      "s02 beat motion semantic-settle exceeds translation limit",
    );
    expect(result.failures).toContain(
      "s02 beat motion semantic-settle exceeds rotation limit",
    );
    expect(result.failures).toContain("s02 beat motion has invalid purpose");
    expect(result.failures).toContain(
      "s02 beat motion is missing continuity_anchor",
    );
    expect(result.failures).toContain("s02 beat motion is missing why_not_static");
  });

  test("rejects a semantic-settle exit equal to its entrance", () => {
    const storyboard = makeSemanticSpriteStoryboard({
      duration_sec: 0.4,
      exit_duration_sec: 0.4,
    });

    const result = auditVideoStoryboard(storyboard, loadSceneRegistry());
    expect(result.failures).toContain(
      "s02 beat motion semantic-settle exit duration must be shorter than entrance duration",
    );
  });

  test("rejects semantic-settle translations below eight pixels", () => {
    for (const translate_px of [-10, 0, 1]) {
      const storyboard = makeSemanticSpriteStoryboard({ translate_px });
      const result = auditVideoStoryboard(storyboard, loadSceneRegistry());

      expect(result.failures).toContain(
        "s02 beat motion semantic-settle is below translation minimum",
      );
    }
  });

  test("records portable semantic-settle timing metadata", () => {
    const recipe = loadSceneRegistry().motion_recipes.find(
      (item) => item.id === "semantic-settle",
    );

    expect(recipe?.duration_sec).toEqual([0.3, 0.5]);
    expect(recipe?.reference_frames_at_30_fps).toEqual([9, 15]);
    expect(recipe?.exit_must_be_shorter_than_enter).toBe(true);
    expect(recipe?.min_translate_px).toBe(8);
  });

  test("rejects repeated semantic sprite IDs across scenes", () => {
    const storyboard = makeStoryboard();
    storyboard.scenes[0].semantic_sprite_ids = ["generated:ledger-v1"];
    storyboard.scenes[1].semantic_sprite_ids = ["generated:ledger-v1"];

    const result = auditVideoStoryboard(storyboard, loadSceneRegistry());
    expect(result.failures).toContain(
      "s02 reuses semantic sprite generated:ledger-v1",
    );
  });
});
