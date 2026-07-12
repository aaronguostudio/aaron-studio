import { readFileSync } from "fs";
import { describe, expect, test } from "bun:test";

describe("publish-to-blog quality contract", () => {
  const skill = readFileSync("tiles/publish-to-blog/SKILL.md", "utf-8");

  test("preserves stable routes when updating an existing article", () => {
    expect(skill).toContain("If the slug already exists");
    expect(skill).toContain("preserve its current post number");
    expect(skill).toContain("stable public route");
  });

  test("copies only accepted and referenced public images", () => {
    expect(skill).toContain("images actually referenced");
    expect(skill).toContain("rejected candidates");
    expect(skill).toContain("unreferenced historical images");
  });

  test("requires content-repo link validation and browser-rendered QA", () => {
    expect(skill).toContain("from the aaron-studio content repo");
    expect(skill).toContain("browser-rendered QA");
    expect(skill).toContain("lazy-loading scroll");
    expect(skill).toContain("non-zero natural dimensions");
    expect(skill).toContain("no browser console error");
  });
});
