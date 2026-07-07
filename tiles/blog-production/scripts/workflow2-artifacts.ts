#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

export const WORKFLOW2_ARTIFACTS = [
  "idea.md",
  "memory-reflection.md",
  "editorial-brief.md",
  "research-dossier.md",
  "argument-memo.md",
  "red-team-review.md",
  "postmortem.md",
  "canon-note.md",
] as const;

export interface Workflow2ArtifactResult {
  blogDir: string;
  created: string[];
  skipped: string[];
}

function templateDir(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return resolve(dirname(currentFile), "..", "templates", "workflow2");
}

export function createWorkflow2Artifacts(blogDirInput: string): Workflow2ArtifactResult {
  const blogDir = resolve(blogDirInput);
  mkdirSync(blogDir, { recursive: true });

  const created: string[] = [];
  const skipped: string[] = [];
  const templates = templateDir();

  for (const artifact of WORKFLOW2_ARTIFACTS) {
    const targetPath = join(blogDir, artifact);

    if (existsSync(targetPath)) {
      skipped.push(artifact);
      continue;
    }

    const sourcePath = join(templates, artifact);
    const template = readFileSync(sourcePath, "utf-8");
    writeFileSync(targetPath, template, "utf-8");
    created.push(artifact);
  }

  return { blogDir, created, skipped };
}

function readCliBlogDir(argv: string[]): string {
  const dirIndex = argv.indexOf("--dir");

  if (dirIndex === -1 || !argv[dirIndex + 1]) {
    throw new Error("Usage: bun workflow2-artifacts.ts --dir src/content/blogs/YYYY-MM-DD");
  }

  return argv[dirIndex + 1];
}

if (import.meta.main) {
  const result = createWorkflow2Artifacts(readCliBlogDir(process.argv.slice(2)));

  console.log(`Blog directory: ${result.blogDir}`);
  console.log(`Created: ${result.created.length ? result.created.join(", ") : "none"}`);
  console.log(`Skipped: ${result.skipped.length ? result.skipped.join(", ") : "none"}`);
}
