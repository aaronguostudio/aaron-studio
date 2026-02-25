#!/usr/bin/env bun
/**
 * Batch generate multiple knowledge shorts from a topics file.
 *
 * Usage:
 *   npx -y bun <this-file> --topics topics.json --output src/content/shorts/
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { parseArgs } from "util";

const { values: args } = parseArgs({
  options: {
    topics: { type: "string" },
    output: { type: "string", short: "o", default: "./output/" },
  },
  strict: false,
});

if (!args.topics) {
  console.error("❌ --topics <file.json> required");
  process.exit(1);
}

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);
const generateScript = resolve(SCRIPT_DIR, "generate.ts");

interface TopicEntry {
  topic: string;
  title?: string;
  narration?: string;
  videoPrompt?: string;
}

const topics: TopicEntry[] = JSON.parse(readFileSync(resolve(args.topics), "utf-8"));
const baseOutput = resolve(args.output!);

console.log(`🧠 Batch Knowledge Shorts: ${topics.length} topics\n`);

let success = 0;
let failed = 0;

for (let i = 0; i < topics.length; i++) {
  const t = topics[i];
  const slug = t.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
  const outputDir = resolve(baseOutput, slug);
  mkdirSync(outputDir, { recursive: true });

  console.log(`\n${"=".repeat(60)}`);
  console.log(`[${i + 1}/${topics.length}] ${t.topic}`);
  console.log(`${"=".repeat(60)}\n`);

  const cmdArgs = [`--topic`, `"${t.topic}"`, `--output`, outputDir];
  if (t.title) cmdArgs.push(`--title`, `"${t.title}"`);
  if (t.narration) cmdArgs.push(`--narration`, `"${t.narration}"`);
  if (t.videoPrompt) cmdArgs.push(`--video-prompt`, `"${t.videoPrompt}"`);

  try {
    execSync(`npx -y bun ${generateScript} ${cmdArgs.join(" ")}`, {
      stdio: "inherit",
      timeout: 15 * 60 * 1000, // 15 min per short
    });
    success++;
  } catch (e: any) {
    console.error(`  ❌ Failed: ${e.message}`);
    failed++;
  }

  // Cool down between generations
  if (i < topics.length - 1) {
    console.log("  ⏳ Cooling 15s...");
    execSync("sleep 15");
  }
}

console.log(`\n${"=".repeat(60)}`);
console.log(`🎬 BATCH COMPLETE: ${success}/${topics.length} succeeded, ${failed} failed`);
