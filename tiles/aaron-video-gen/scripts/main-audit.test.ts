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

test("main --audio-only dry run skips image resolution and writes spoken transcript", () => {
  const scriptPath = join(tempDir, "youtube-script.md");
  const transcriptPath = join(tempDir, "spoken.md");
  writeFileSync(
    scriptPath,
    "# YouTube Script: Audio Gate\n\n## [HOOK]\nA concrete opening.\n\n## [SLIDE: The Point — missing.png]\nA clear spoken explanation.",
    "utf-8"
  );

  const result = spawnSync(
    process.execPath,
    [
      join(import.meta.dir, "main.ts"),
      "--script",
      scriptPath,
      "--audio-only",
      "--dry-run",
      "--no-conversational",
      "--skip-script-audit",
      "--transcript-output",
      transcriptPath,
    ],
    { encoding: "utf-8" }
  );

  expect(result.status).toBe(0);
  expect(result.stdout).toContain("Skipped for --audio-only");
  expect(result.stdout).toContain("Estimated duration");
  expect(existsSync(transcriptPath)).toBe(true);
  const transcript = readFileSync(transcriptPath, "utf-8");
  expect(transcript).toContain("A clear spoken explanation.");
  expect(transcript).toContain("Provider: elevenlabs");
  expect(transcript).toContain("Voice profile: aaron-pvc-identity-v1");
  expect(transcript).toContain("Voice ID: R2DWp7zZuWmGxk3r8GIA");
  expect(transcript).toContain("Model: eleven_multilingual_v2");
  expect(transcript).toContain("Speed: 1");
});

test("an explicit OpenAI provider keeps its own speed range", () => {
  const scriptPath = join(tempDir, "youtube-script.md");
  writeFileSync(
    scriptPath,
    "# YouTube Script: Provider Override\n\n## [SLIDE: Point — missing.png]\nA short explanation.",
    "utf-8"
  );

  const result = spawnSync(
    process.execPath,
    [
      join(import.meta.dir, "main.ts"),
      "--script",
      scriptPath,
      "--audio-only",
      "--dry-run",
      "--no-conversational",
      "--skip-script-audit",
      "--tts",
      "openai",
      "--speed",
      "2",
    ],
    { encoding: "utf-8" }
  );

  expect(result.status).toBe(0);
  expect(result.stderr).not.toContain("ElevenLabs speed");
});
