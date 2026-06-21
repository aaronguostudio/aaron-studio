import { afterEach, beforeEach, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { spawnSync } from "child_process";

let tempDir = "";

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), "aaron-video-main-audit-"));
});

afterEach(() => {
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
});

test("main --audit-only writes audit and exits before image resolution", () => {
  const scriptPath = join(tempDir, "youtube-script.md");
  writeFileSync(
    scriptPath,
    "# Title\n\n## [HOOK]\nTesla scene.\n\n## [SLIDE: One — missing.png]\nBody.",
    "utf-8"
  );

  const result = spawnSync(
    process.execPath,
    [join(import.meta.dir, "main.ts"), "--script", scriptPath, "--audit-only"],
    { encoding: "utf-8" }
  );

  const auditPath = join(tempDir, "youtube-script-audit.md");
  expect(result.status).toBe(2);
  expect(existsSync(auditPath)).toBe(true);
  expect(readFileSync(auditPath, "utf-8")).toContain(
    "video-brief.md is missing or empty"
  );
});
