import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { describe, expect, test } from "bun:test";
import {
  WORKFLOW3_ARTIFACTS,
  createWorkflow3Artifacts,
} from "./workflow3-artifacts";

describe("workflow 3 artifact generator", () => {
  test("creates the editorial evidence and scorecard artifacts", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-workflow3-"));
    try {
      const result = createWorkflow3Artifacts(dir);
      expect(result.created.sort()).toEqual([...WORKFLOW3_ARTIFACTS].sort());
      expect(readFileSync(join(dir, "claim-ledger.md"), "utf-8")).toContain("Inference Boundaries");
      expect(readFileSync(join(dir, "editorial-scorecard.md"), "utf-8")).toContain("Revision Delta");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("preserves existing workflow 3 artifacts", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-workflow3-"));
    try {
      const path = join(dir, "claim-ledger.md");
      writeFileSync(path, "# Existing Ledger\n\nDo not overwrite.\n", "utf-8");
      const result = createWorkflow3Artifacts(dir);
      expect(result.skipped).toContain("claim-ledger.md");
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, "utf-8")).toContain("Do not overwrite");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
