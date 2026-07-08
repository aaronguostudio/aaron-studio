import { existsSync, readFileSync } from "fs";
import { describe, expect, test } from "bun:test";

const visualSystemPath = "src/content/strategy/blog-visual-system.md";
const skillPath = "tiles/blog-illustrate/SKILL.md";

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
  });

  test("provides templates for every new visual artifact", () => {
    const templatePaths = [
      "tiles/blog-illustrate/templates/visual-strategy.md",
      "tiles/blog-illustrate/templates/mode-mix.md",
      "tiles/blog-illustrate/templates/visual-critique.md",
      "tiles/blog-illustrate/templates/visual-postmortem.md",
    ];

    for (const path of templatePaths) {
      expect(existsSync(path)).toBe(true);
      expect(read(path).length).toBeGreaterThan(300);
    }

    expect(read("tiles/blog-illustrate/templates/visual-strategy.md")).toContain("## Recommended Mode Mix");
    expect(read("tiles/blog-illustrate/templates/mode-mix.md")).toContain("Visual weight");
    expect(read("tiles/blog-illustrate/templates/visual-critique.md")).toContain("## Regeneration Requests");
    expect(read("tiles/blog-illustrate/templates/visual-postmortem.md")).toContain("## Anti-Patterns To Add To Global System");
  });

  test("requires the visual strategy workflow in blog-illustrate skill", () => {
    const skill = read(skillPath);

    expect(skill).toContain("src/content/strategy/blog-visual-system.md");
    expect(skill).toContain("visual-strategy.md");
    expect(skill).toContain("mode-mix.md");
    expect(skill).toContain("visual-critique.md");
    expect(skill).toContain("visual-postmortem.md");
    expect(skill).toContain("Visual predicate");
    expect(skill).toContain("visual weight");
    expect(skill).toContain("Style is pacing, not skin");
  });

  test("keeps article detection and visual weight vocabulary deterministic", () => {
    const skill = read(skillPath);
    const visualSystem = read(visualSystemPath);
    const modeMix = read("tiles/blog-illustrate/templates/mode-mix.md");

    expect(skill).toContain("published article markdown file");
    expect(skill).toContain("Exclude `imgs/**`, `video/**`, `prompts/**`");
    expect(skill).toContain("research-dossier.md");
    expect(skill).toContain("If multiple candidates remain, ask the user");

    expect(skill).toContain("Visual weight**: [quiet | medium | loud]");
    expect(skill).not.toContain("Visual weight**: [low | medium | high]");
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
