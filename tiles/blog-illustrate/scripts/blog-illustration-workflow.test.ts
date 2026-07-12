import { existsSync, readFileSync } from "fs";
import { describe, expect, test } from "bun:test";

const visualSystemPath = "src/content/strategy/blog-visual-system.md";
const skillPath = "tiles/blog-illustrate/SKILL.md";
const deliveryReferencePath = "tiles/blog-illustrate/references/generation-and-delivery.md";

function read(path: string): string {
  return readFileSync(path, "utf-8");
}

describe("blog illustration workflow 2.0", () => {
  test("documents Aaron visual modes and pacing rules", () => {
    expect(existsSync(visualSystemPath)).toBe(true);

    const visualSystem = read(visualSystemPath);

    expect(visualSystem).toContain("Style is pacing, not skin");
    expect(visualSystem).toContain("Editorial Minimal");
    expect(visualSystem).toContain("Human-Scale Metaphor");
    expect(visualSystem).toContain("Operator Diagram");
    expect(visualSystem).toContain("Real Photo Collage");
    expect(visualSystem).toContain("Glass / Fluent Artifact");
    expect(visualSystem).toContain("FDE regression lessons");
    expect(visualSystem).toContain("one visual predicate");
    expect(visualSystem).toContain("Concept comes before style");
    expect(visualSystem).toContain("semantically correct");
  });

  test("provides templates for every new visual artifact", () => {
    const templatePaths = [
      "tiles/blog-illustrate/templates/visual-strategy.md",
      "tiles/blog-illustrate/templates/style-directions.md",
      "tiles/blog-illustrate/templates/mode-mix.md",
      "tiles/blog-illustrate/templates/generation-manifest.md",
      "tiles/blog-illustrate/templates/visual-critique.md",
      "tiles/blog-illustrate/templates/visual-postmortem.md",
    ];

    for (const path of templatePaths) {
      expect(existsSync(path)).toBe(true);
      expect(read(path).length).toBeGreaterThan(300);
    }

    expect(read("tiles/blog-illustrate/templates/visual-strategy.md")).toContain("## Recommended Mode Mix");
    expect(read("tiles/blog-illustrate/templates/style-directions.md")).toContain("## Style Cohesion Decision");
    expect(read("tiles/blog-illustrate/templates/mode-mix.md")).toContain("Visual weight");
    expect(read("tiles/blog-illustrate/templates/mode-mix.md")).toContain("Style family");
    expect(read("tiles/blog-illustrate/templates/generation-manifest.md")).toContain("## Provenance Notes");
    expect(read("tiles/blog-illustrate/templates/visual-critique.md")).toContain("## Regeneration Requests");
    expect(read("tiles/blog-illustrate/templates/visual-postmortem.md")).toContain("## Anti-Patterns To Add To Global System");
  });

  test("requires the visual strategy workflow in blog-illustrate skill", () => {
    const skill = read(skillPath);

    expect(skill).toContain("src/content/strategy/blog-visual-system.md");
    expect(skill).toContain("visual-strategy.md");
    expect(skill).toContain("style-directions.md");
    expect(skill).toContain("mode-mix.md");
    expect(skill).toContain("visual-critique.md");
    expect(skill).toContain("visual-postmortem.md");
    expect(skill).toContain("visual predicate");
    expect(skill).toContain("visual weight");
    expect(skill).toContain("Style is pacing, not skin");
  });

  test("requires an explicit style direction decision before prompts", () => {
    const skill = read(skillPath);

    expect(skill).toContain("Style Direction Menu");
    expect(skill).toContain("3-5 style directions");
    expect(skill).toContain("Unified");
    expect(skill).toContain("Controlled Mix");
    expect(skill).toContain("Experimental Mix");
    expect(skill).toContain("Do not write `style.md`, `outline.md`, or prompt files before this style decision is recorded");
    expect(skill).toContain("ask Aaron to choose");
  });

  test("supports style-library exploration and visibly different style probes", () => {
    const styleLibraryPath = "src/content/strategy/blog-visual-style-library.md";

    expect(existsSync(styleLibraryPath)).toBe(true);

    const skill = read(skillPath);
    const styleLibrary = read(styleLibraryPath);
    const styleDirections = read("tiles/blog-illustrate/templates/style-directions.md");

    expect(skill).toContain("blog-visual-style-library.md");
    expect(skill).toContain("Style Probe Mode");
    expect(skill).toContain("visibly different");
    expect(skill).toContain("do not treat visual mode as style family");

    expect(styleDirections).toContain("Style Library Candidates");
    expect(styleDirections).toContain("Style Probe Menu");

    expect(styleLibrary).toContain("Infographic Editorial");
    expect(styleLibrary).toContain("Field Signal Editorial");
    expect(styleLibrary).toContain("Cartoon Briefing");
    expect(styleLibrary).toContain("Executive Brief");
    expect(styleLibrary).toContain("Data Poster");
    expect(styleLibrary).toContain("Cutaway System Map");
  });

  test("locks concept before style and records image provenance", () => {
    const skill = read(skillPath);
    const strategy = read("tiles/blog-illustrate/templates/visual-strategy.md");

    expect(skill).toContain("Concept comes before style");
    expect(skill).toContain("three genuinely different concept routes");
    expect(skill).toContain("generation-manifest.md");
    expect(skill).toContain("built-in image generator by default");
    expect(strategy).toContain("## Concept Routes");
    expect(strategy).toContain("## Selected Concept Route");
  });

  test("keeps article detection and visual weight vocabulary deterministic", () => {
    const skill = read(skillPath);
    const deliveryReference = read(deliveryReferencePath);
    const visualSystem = read(visualSystemPath);
    const modeMix = read("tiles/blog-illustrate/templates/mode-mix.md");

    expect(skill).toContain("published article markdown file");
    expect(skill).toContain("Exclude `imgs/**`, `video/**`, `prompts/**`");
    expect(skill).toContain("research-dossier.md");
    expect(skill).toContain("If multiple candidates remain, ask the user");

    expect(skill).toContain("references/generation-and-delivery.md");
    expect(deliveryReference).toContain("visual weight: quiet / medium / loud");
    expect(deliveryReference).not.toContain("visual weight: low / medium / high");
    expect(visualSystem).toContain("quiet or medium");
    expect(visualSystem).toContain("loud");
    expect(modeMix).toContain("quiet / medium / loud");
    expect(visualSystem).not.toContain("Glass Artifact");
  });

  test("keeps images-stock integration optional in phase 1", () => {
    const skill = read(skillPath);
    const visualSystem = read(visualSystemPath);

    expect(skill).toContain("Phase 2");
    expect(skill).toContain("image stock");
    expect(skill).toContain("optional");
    expect(visualSystem).toContain("/Users/aaronguo/Work/lab/images-stock");
    expect(visualSystem).toContain("blog illustration should still run with local artifacts");
  });
});
