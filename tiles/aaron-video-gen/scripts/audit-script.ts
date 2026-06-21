#!/usr/bin/env bun
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { auditYoutubeScript, countScriptImages } from "./script-audit";

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const scriptArg = readArg("--script") || readArg("-s");
if (!scriptArg) {
  console.error("Usage: bun audit-script.ts --script <youtube-script.md>");
  process.exit(1);
}

const scriptPath = resolve(scriptArg);
const postDir = dirname(scriptPath);
const briefPath = join(postDir, "video-brief.md");
const auditPath = join(postDir, "youtube-script-audit.md");

const scriptMarkdown = readFileSync(scriptPath, "utf-8");
const videoBriefMarkdown = existsSync(briefPath)
  ? readFileSync(briefPath, "utf-8")
  : "";
const imageCount = countScriptImages(scriptMarkdown);

const result = auditYoutubeScript({
  scriptMarkdown,
  videoBriefMarkdown,
  imageCount,
  scriptPath,
});

writeFileSync(auditPath, result.summaryMarkdown, "utf-8");
console.log(`[audit] ${result.passed ? "PASS" : "FAIL"} -> ${auditPath}`);
if (!result.passed) process.exit(2);
