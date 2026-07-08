import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { describe, expect, test } from "bun:test";
import {
  WORKFLOW2_ARTIFACTS,
  createWorkflow2Artifacts,
} from "./workflow2-artifacts";

describe("workflow2 artifact generator", () => {
  test("includes workflow 2.1 alignment and prose artifacts", () => {
    expect(WORKFLOW2_ARTIFACTS).toContain("canon-alignment.md");
    expect(WORKFLOW2_ARTIFACTS).toContain("prose-polish-review.md");
  });

  test("creates every workflow 2 artifact when missing", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-workflow2-"));

    try {
      const result = createWorkflow2Artifacts(dir);

      expect(result.created.sort()).toEqual([...WORKFLOW2_ARTIFACTS].sort());
      expect(result.skipped).toEqual([]);

      for (const artifact of WORKFLOW2_ARTIFACTS) {
        const path = join(dir, artifact);
        expect(existsSync(path)).toBe(true);
        const content = readFileSync(path, "utf-8");
        expect(content.length).toBeGreaterThan(80);
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("does not overwrite existing editorial artifacts", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-workflow2-"));

    try {
      const memoryPath = join(dir, "memory-reflection.md");
      writeFileSync(memoryPath, "# Existing Memory\n\nKeep this note.\n", "utf-8");

      const result = createWorkflow2Artifacts(dir);

      expect(result.skipped).toContain("memory-reflection.md");
      expect(readFileSync(memoryPath, "utf-8")).toContain("Keep this note.");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
