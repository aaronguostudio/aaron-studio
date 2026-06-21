import { afterEach, beforeEach, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { spawnSync } from "child_process";

let tempDir = "";

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), "aaron-video-audit-"));
});

afterEach(() => {
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
});

test("audit CLI writes an audit report and exits non-zero on failures", () => {
  const scriptPath = join(tempDir, "youtube-script.md");
  writeFileSync(
    scriptPath,
    "# Title\n\n## [HOOK]\nIn today's video, let's dive in.\n\n## [SLIDE: One — 01.png]\nBody.",
    "utf-8"
  );

  const result = spawnSync(
    process.execPath,
    [join(import.meta.dir, "audit-script.ts"), "--script", scriptPath],
    { encoding: "utf-8" }
  );

  const auditPath = join(tempDir, "youtube-script-audit.md");
  expect(result.status).toBe(2);
  expect(existsSync(auditPath)).toBe(true);
  expect(readFileSync(auditPath, "utf-8")).toContain("Status: FAIL");
});
