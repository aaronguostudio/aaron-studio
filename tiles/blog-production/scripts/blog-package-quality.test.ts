import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { describe, expect, test } from "bun:test";
import { assessBlogPackage, readImageDimensions } from "./blog-package-quality";

const slug = "deployment-is-the-product";

function article(title: string, body: string): string {
  return `---\ntitle: "${title}"\ndate: 2026-07-10\nslug: ${slug}\ncategory: ai-native-systems\ntags: [enterprise-ai, fde]\n---\n\n# ${title}\n\n${body}\n`;
}

describe("blog package quality", () => {
  test("reads real PNG dimensions from the file header", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-image-"));
    try {
      const path = join(dir, "fixture.png");
      const buffer = Buffer.alloc(24);
      buffer.write("PNG", 1, "ascii");
      buffer.writeUInt32BE(1600, 16);
      buffer.writeUInt32BE(900, 20);
      writeFileSync(path, buffer);
      expect(readImageDimensions(path)).toEqual({ width: 1600, height: 900 });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("catches source-relative links and bilingual metadata drift", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-package-"));
    try {
      writeFileSync(join(dir, `${slug}.md`), article("English", "[Old](../2026-01-01/old.md)"));
      writeFileSync(
        join(dir, `${slug}-zh.md`),
        article("中文", "正文").replace("category: ai-native-systems", "category: business-strategy")
      );
      const report = assessBlogPackage({ blogDir: dir, slug });
      expect(report.passed).toBe(false);
      expect(report.errors.join("\n")).toContain("source-relative article link");
      expect(report.errors.join("\n")).toContain("Bilingual frontmatter mismatch");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("passes a complete serious package with recorded gates", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-package-"));
    try {
      const body = `${"A concrete operating bottleneck explains the mechanism and the decision. ".repeat(220)}\n\n## Mechanism\n\n[Source](https://example.com/a) [Source](https://example.com/b) [Source](https://example.com/c)\n\n## Proof\n\nEvidence.\n\n## Objection\n\nTradeoff.\n\n## Framework\n\nAction.\n\n## Implication\n\nDecision.`;
      writeFileSync(join(dir, `${slug}.md`), article("English", body));
      writeFileSync(join(dir, `${slug}-zh.md`), article("中文", "这是自然的中文版本。"));
      const artifacts = [
        "memory-reflection.md",
        "editorial-brief.md",
        "research-dossier.md",
        "argument-memo.md",
        "canon-alignment.md",
        "red-team-review.md",
        "prose-polish-review.md",
        "canon-note.md",
      ];
      for (const name of artifacts) writeFileSync(join(dir, name), `# ${name}\n\nComplete.\n`);
      writeFileSync(join(dir, "claim-ledger.md"), "# Claim Ledger\n\nDecision: PASS\n");
      writeFileSync(join(dir, "editorial-scorecard.md"), "# Scorecard\n\nFinal score: 90/100\n\nDecision: PASS\n");

      const report = assessBlogPackage({ blogDir: dir, slug, serious: true });
      expect(report.passed).toBe(true);
      expect(report.errors).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("requires final web images when visual validation is enabled", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-package-"));
    try {
      mkdirSync(join(dir, "imgs", "web"), { recursive: true });
      writeFileSync(join(dir, `${slug}.md`), article("English", "![Draft](imgs/draft.png)"));
      writeFileSync(join(dir, `${slug}-zh.md`), article("中文", "正文"));
      const report = assessBlogPackage({ blogDir: dir, slug, requireImages: true });
      expect(report.passed).toBe(false);
      expect(report.errors.join("\n")).toContain("imgs/web/*.webp");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("requires a complete, tracked cross-platform distribution package when requested", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-package-"));
    try {
      writeFileSync(join(dir, `${slug}.md`), article("English", "A concrete article."));
      writeFileSync(join(dir, `${slug}-zh.md`), article("中文", "自然中文。"));
      writeFileSync(join(dir, "distribution-plan.md"), "# Plan\n\nX\nLinkedIn\nFacebook\n");
      writeFileSync(
        join(dir, "x-post.md"),
        "## Main Post\n\nA useful operational claim.\n\n## Reply With Link\n\nhttps://example.com/?utm_source=x\n"
      );
      writeFileSync(join(dir, "x-standalone-tweet.md"), "A standalone insight.\n");
      writeFileSync(join(dir, "linkedin-brief.md"), "https://example.com/?utm_source=linkedin\n");
      writeFileSync(join(dir, "facebook-post.md"), "https://example.com/?utm_source=facebook\n");
      writeFileSync(join(dir, "newsletter-teaser.md"), "https://example.com/?utm_source=newsletter\n");

      expect(assessBlogPackage({ blogDir: dir, slug, requireDistribution: true }).passed).toBe(true);

      rmSync(join(dir, "facebook-post.md"));
      const report = assessBlogPackage({ blogDir: dir, slug, requireDistribution: true });
      expect(report.passed).toBe(false);
      expect(report.errors.join("\n")).toContain("Missing distribution artifact: facebook-post.md");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
