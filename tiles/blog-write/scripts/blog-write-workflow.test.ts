import { existsSync, readFileSync } from "fs";
import { describe, expect, test } from "bun:test";

describe("blog-write workflow quality gate", () => {
  test("documents the blog writing language strategy", () => {
    const strategyPath = "src/content/strategy/blog-writing-language.md";

    expect(existsSync(strategyPath)).toBe(true);

    const strategy = readFileSync(strategyPath, "utf-8");
    expect(strategy).toContain("Aaron blog writing language");
    expect(strategy).toContain("External skill inputs");
    expect(strategy).toContain("Anti-AI style gate");
    expect(strategy).toContain("Story craft gate");
    expect(strategy).toContain("Aaron voice craft gate");
  });

  test("requires blog-style-quality in the blog-write skill", () => {
    const skill = readFileSync("tiles/blog-write/SKILL.md", "utf-8");

    expect(skill).toContain("src/content/strategy/blog-writing-language.md");
    expect(skill).toContain("blog-style-quality.ts");
    expect(skill).toContain("--require-story-craft");
    expect(skill).toContain("Anti-AI style gate");
    expect(skill).toContain("Story craft gate");
  });

  test("requires blog-style-quality in the production orchestrator", () => {
    const skill = readFileSync("tiles/blog-production/SKILL.md", "utf-8");

    expect(skill).toContain("blog-style-quality.ts");
    expect(skill).toContain("--require-story-craft");
    expect(skill).toContain("Anti-AI style gate");
    expect(skill).toContain("Story craft gate");
  });

  test("requires feedback-loop context and pre-publish evaluation", () => {
    const writeSkill = readFileSync("tiles/blog-write/SKILL.md", "utf-8");
    const productionSkill = readFileSync("tiles/blog-production/SKILL.md", "utf-8");

    expect(writeSkill).toContain("next-brief-context");
    expect(writeSkill).toContain("evaluate-content");
    expect(writeSkill).toContain("use or reject");
    expect(productionSkill).toContain("next-brief-context");
    expect(productionSkill).toContain("evaluate-content");
    expect(productionSkill).toContain("Pre-publish evaluation gate");
  });

  test("requires workflow 2 editorial artifacts in the writing skill", () => {
    const writeSkill = readFileSync("tiles/blog-write/SKILL.md", "utf-8");
    const productionSkill = readFileSync("tiles/blog-production/SKILL.md", "utf-8");

    expect(writeSkill).toContain("memory-reflection.md");
    expect(writeSkill).toContain("editorial-brief.md");
    expect(writeSkill).toContain("research-dossier.md");
    expect(writeSkill).toContain("argument-memo.md");
    expect(writeSkill).toContain("red-team-review.md");
    expect(writeSkill).toContain("canon-note.md");
    expect(productionSkill).toContain("Workflow 2 editorial gates");
    expect(productionSkill).toContain("Red-team gate");
    expect(productionSkill).toContain("Memory update gate");
  });
});
