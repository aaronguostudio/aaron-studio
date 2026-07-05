import { readFileSync } from "fs";
import { describe, expect, test } from "bun:test";

describe("social teaser workflow guidance", () => {
  test("blog-write defaults social distribution to teaser-first copy", () => {
    const skill = readFileSync("tiles/blog-write/SKILL.md", "utf-8");

    expect(skill).toContain("teaser-first");
    expect(skill).toContain("Cross-platform teaser");
    expect(skill).toContain("not a mini article");
    expect(skill).toContain("same core hook");
  });

  test("blog-production artifact contract does not call X long-form by default", () => {
    const skill = readFileSync("tiles/blog-production/SKILL.md", "utf-8");

    expect(skill).toContain("social teaser");
    expect(skill).not.toContain("long-form X post");
  });

  test("x-growth defines LinkedIn as an adapted teaser, not a separate essay", () => {
    const skill = readFileSync("tiles/x-growth/SKILL.md", "utf-8");

    expect(skill).toContain("Cross-Platform Teaser");
    expect(skill).toContain("LinkedIn should not expand into a mini article");
    expect(skill).toContain("X, LinkedIn, newsletter");
  });
});
