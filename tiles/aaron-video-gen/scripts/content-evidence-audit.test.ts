import { describe, expect, test } from "bun:test";
import {
  auditContentEvidence,
  type AssetPlan,
  type FactPack,
} from "./content-evidence-audit";

function makeFactPack(): FactPack {
  return {
    schema_version: 1,
    topic: "Reviewable content automation",
    thesis: "Automation should stop at editorial judgment.",
    sources: [
      {
        id: "official-doc",
        url: "https://example.com/docs",
        publisher: "Example",
        source_type: "official",
        verification_status: "verified",
        rights: "public-source",
        notes: "Product documentation verified on the production date.",
      },
    ],
    facts: [
      {
        id: "fact-1",
        claim: "The workflow supports an explicit review step.",
        source_ids: ["official-doc"],
        confidence: "high",
        usable_in_script: true,
      },
    ],
  };
}

function makeAssetPlan(): AssetPlan {
  return {
    schema_version: 1,
    title: "A reviewable workflow",
    duration_sec: 10,
    aspect_ratio: "9:16",
    asset_library: {
      queries: ["calm low-energy background music"],
      selected_asset_ids: ["music:0123456789abcdef"],
    },
    beats: [
      {
        id: "s01",
        start_sec: 0,
        end_sec: 5,
        copy: "Show the source.",
        visual_role: "evidence",
        asset_type: "source-screenshot",
        fact_ids: ["fact-1"],
        source_ids: ["official-doc"],
        asset_path: "source.png",
        status: "planned",
        provenance: "Official product documentation screenshot.",
        rights: "public-source",
        fallback: "Source title and URL on a plain evidence card.",
      },
      {
        id: "s02",
        start_sec: 5,
        end_sec: 10,
        copy: "Keep judgment human.",
        visual_role: "emphasis",
        asset_type: "generated-layout",
        fact_ids: [],
        source_ids: [],
        library_asset_id: "music:0123456789abcdef",
        status: "ready",
        provenance: "Remotion-native typography.",
        rights: "owned",
        fallback: "Static title card.",
      },
    ],
  };
}

describe("content evidence audit", () => {
  test("passes a sourced prototype plan", () => {
    const result = auditContentEvidence(makeFactPack(), makeAssetPlan());
    expect(result.passed).toBe(true);
    expect(result.failures).toEqual([]);
  });

  test("rejects generated evidence and unknown source links", () => {
    const plan = makeAssetPlan();
    plan.beats[0].asset_type = "generated-still";
    plan.beats[0].source_ids = ["missing"];
    const result = auditContentEvidence(makeFactPack(), plan);
    expect(result.failures).toContain("s01 references unknown sources: missing");
    expect(result.failures).toContain("s01 cannot use generated media as factual evidence");
  });

  test("production mode rejects unready and prototype-only assets", () => {
    const plan = makeAssetPlan();
    plan.beats[0].rights = "prototype-only";
    const result = auditContentEvidence(makeFactPack(), plan, { production: true });
    expect(result.failures).toContain("s01 is not ready for production");
    expect(result.failures).toContain("s01 has prototype-only rights");
  });

  test("licensed footage requires provenance metadata", () => {
    const plan = makeAssetPlan();
    plan.beats[0].asset_type = "stock";
    plan.beats[0].rights = "licensed";
    const result = auditContentEvidence(makeFactPack(), plan);
    expect(result.failures).toContain("s01 licensed asset is missing a valid license_url");
    expect(result.failures).toContain("s01 licensed asset is missing creator");
    expect(result.failures).toContain("s01 licensed asset is missing retrieved_at");
  });

  test("public URLs do not automatically clear source video", () => {
    const plan = makeAssetPlan();
    plan.beats[0].asset_type = "source-video";
    plan.beats[0].rights = "public-source";
    const result = auditContentEvidence(makeFactPack(), plan);
    expect(result.failures).toContain("s01 source-video cannot treat a public URL as media permission");
  });

  test("commentary excerpts stop production until approved", () => {
    const plan = makeAssetPlan();
    plan.beats[0].asset_type = "source-video";
    plan.beats[0].rights = "commentary-review";
    plan.beats[0].source_start_sec = 3;
    plan.beats[0].source_end_sec = 6;
    plan.beats[0].editorial_approval = "pending";
    const result = auditContentEvidence(makeFactPack(), plan, { production: true });
    expect(result.failures).toContain("s01 commentary excerpt needs explicit editorial approval");
  });

  test("rejects malformed asset-library IDs and warns about unlisted selections", () => {
    const plan = makeAssetPlan();
    plan.beats[1].library_asset_id = "not an asset id";
    let result = auditContentEvidence(makeFactPack(), plan);
    expect(result.failures).toContain("s02 has an invalid library_asset_id");

    plan.beats[1].library_asset_id = "visualizer:spectrum-bars:v1";
    result = auditContentEvidence(makeFactPack(), plan);
    expect(result.warnings).toContain("s02 library_asset_id is not listed in asset_library.selected_asset_ids");
  });
});
