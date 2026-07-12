#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import {
  WORKFLOW2_ARTIFACTS,
  createWorkflow2Artifacts,
  type Workflow2ArtifactResult,
} from "./workflow2-artifacts";

export const WORKFLOW3_ADDITIONAL_ARTIFACTS = [
  "claim-ledger.md",
  "editorial-scorecard.md",
] as const;

export const WORKFLOW3_ARTIFACTS = [
  ...WORKFLOW2_ARTIFACTS,
  ...WORKFLOW3_ADDITIONAL_ARTIFACTS,
] as const;

export type Workflow3ArtifactResult = Workflow2ArtifactResult;

function templateDir(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return resolve(dirname(currentFile), "..", "templates", "workflow3");
}

export function createWorkflow3Artifacts(blogDirInput: string): Workflow3ArtifactResult {
  const base = createWorkflow2Artifacts(blogDirInput);
  const blogDir = resolve(blogDirInput);
  mkdirSync(blogDir, { recursive: true });

  const created = [...base.created];
  const skipped = [...base.skipped];

  for (const artifact of WORKFLOW3_ADDITIONAL_ARTIFACTS) {
    const targetPath = join(blogDir, artifact);
    if (existsSync(targetPath)) {
      skipped.push(artifact);
      continue;
    }

    const template = readFileSync(join(templateDir(), artifact), "utf-8");
    writeFileSync(targetPath, template, "utf-8");
    created.push(artifact);
  }

  return { blogDir, created, skipped };
}

function readCliBlogDir(argv: string[]): string {
  const dirIndex = argv.indexOf("--dir");
  if (dirIndex === -1 || !argv[dirIndex + 1]) {
    throw new Error("Usage: bun workflow3-artifacts.ts --dir src/content/blogs/YYYY-MM-DD");
  }
  return argv[dirIndex + 1];
}

if (import.meta.main) {
  const result = createWorkflow3Artifacts(readCliBlogDir(process.argv.slice(2)));
  console.log(`Blog directory: ${result.blogDir}`);
  console.log(`Created: ${result.created.length ? result.created.join(", ") : "none"}`);
  console.log(`Skipped: ${result.skipped.length ? result.skipped.join(", ") : "none"}`);
}
