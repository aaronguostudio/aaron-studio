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

  test("documents Chinese lexical precision review", () => {
    const strategy = readFileSync("src/content/strategy/blog-writing-language.md", "utf-8");

    expect(strategy).toContain("中文词义校准");
    expect(strategy).toContain("张力");
    expect(strategy).toContain("负面业务语境");
    expect(strategy).toContain("中文术语本地化");
    expect(strategy).toContain("vendor");
    expect(strategy).toContain("企业级产品");
  });

  test("does not force a personal anecdote to carry the opening", () => {
    const strategy = readFileSync("src/content/strategy/blog-writing-language.md", "utf-8");
    const skill = readFileSync("tiles/blog-write/SKILL.md", "utf-8");

    expect(strategy).toContain("Concrete does not mean autobiographical");
    expect(strategy).toContain("Lived evidence does not have to occupy paragraph one");
    expect(skill).toContain("Concrete does not mean autobiographical");
    expect(skill).toContain("name the subject first");
  });

  test("requires participation and write-back for self-improving workflow claims", () => {
    const strategy = readFileSync("src/content/strategy/blog-writing-language.md", "utf-8");
    const skill = readFileSync("tiles/blog-write/SKILL.md", "utf-8");

    expect(strategy).toContain("自我提升不是自动发生");
    expect(strategy).toContain("几句 prompt");
    expect(strategy).toContain("学习信号由谁发现");
    expect(skill).toContain("A loop in a diagram is not evidence of self-improvement");
  });

  test("limits serious essays to one primary executable framework", () => {
    const skill = readFileSync("tiles/blog-write/SKILL.md", "utf-8");
    const editorialSystem = readFileSync("tiles/blog-production/references/editorial-system.md", "utf-8");

    expect(skill).toContain("Framework economy");
    expect(skill).toContain("one primary executable framework");
    expect(editorialSystem).toContain("one reusable frame at most");
  });

  test("documents methodology label precision review", () => {
    const strategy = readFileSync("src/content/strategy/blog-writing-language.md", "utf-8");

    expect(strategy).toContain("方法论标签校准");
    expect(strategy).toContain("lens");
    expect(strategy).toContain("framework");
    expect(strategy).toContain("same level of granularity");
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
    expect(productionSkill).toContain("Workflow 3 editorial gates");
    expect(productionSkill).toContain("Red-team gate");
    expect(productionSkill).toContain("Memory update gate");
  });

  test("requires workflow 2.1 canon alignment and prose polish gates", () => {
    const writeSkill = readFileSync("tiles/blog-write/SKILL.md", "utf-8");
    const productionSkill = readFileSync("tiles/blog-production/SKILL.md", "utf-8");
    const syncScript = readFileSync("scripts/sync-agent-skills.sh", "utf-8");

    expect(existsSync("tiles/blog-canon-alignment/SKILL.md")).toBe(true);
    expect(existsSync("tiles/blog-prose-editor/SKILL.md")).toBe(true);
    expect(writeSkill).toContain("canon-alignment.md");
    expect(writeSkill).toContain("prose-polish-review.md");
    expect(productionSkill).toContain("Canon alignment gate");
    expect(productionSkill).toContain("Prose polish gate");
    expect(productionSkill).toContain("blog-canon-alignment");
    expect(productionSkill).toContain("blog-prose-editor");
    expect(syncScript).toContain("blog-canon-alignment:tiles/blog-canon-alignment");
    expect(syncScript).toContain("blog-prose-editor:tiles/blog-prose-editor");
  });

  test("requires workflow 3 evidence, scorecard, and package integrity gates", () => {
    const writeSkill = readFileSync("tiles/blog-write/SKILL.md", "utf-8");
    const productionSkill = readFileSync("tiles/blog-production/SKILL.md", "utf-8");

    expect(existsSync("tiles/blog-production/templates/workflow3/claim-ledger.md")).toBe(true);
    expect(existsSync("tiles/blog-production/templates/workflow3/editorial-scorecard.md")).toBe(true);
    expect(existsSync("tiles/blog-production/scripts/blog-package-quality.ts")).toBe(true);
    expect(writeSkill).toContain("claim-ledger.md");
    expect(writeSkill).toContain("editorial-scorecard.md");
    expect(writeSkill).toContain("structural redraft");
    expect(productionSkill).toContain("Workflow 3 editorial gates");
    expect(productionSkill).toContain("Package integrity gate");
  });

  test("uses explicit production locks and promotes feedback deliberately", () => {
    const productionSkill = readFileSync("tiles/blog-production/SKILL.md", "utf-8");
    const editorialSystem = readFileSync("tiles/blog-production/references/editorial-system.md", "utf-8");

    expect(productionSkill).toContain("Production lock gate");
    expect(productionSkill).toContain("Argument Lock");
    expect(productionSkill).toContain("Article Lock");
    expect(productionSkill).toContain("Package Lock");
    expect(editorialSystem).toContain("Three Production Locks");
    expect(editorialSystem).toContain("Feedback Promotion");
    expect(editorialSystem).toContain("acceptable false-positive cost");
  });
});
