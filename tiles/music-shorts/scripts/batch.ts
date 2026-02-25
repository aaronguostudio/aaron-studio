#!/usr/bin/env bun
/**
 * Batch generate multiple music shorts.
 * Usage: npx -y bun <this> --songs songs.json --output src/content/shorts/
 */

import { execSync } from "child_process";
import { readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { parseArgs } from "util";

const { values: args } = parseArgs({
  options: {
    songs: { type: "string" },
    output: { type: "string", short: "o", default: "./output/" },
  },
  strict: false,
});

if (!args.songs) { console.error("❌ --songs <file.json> required"); process.exit(1); }

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);
const generateScript = resolve(SCRIPT_DIR, "generate.ts");

interface SongEntry { song: string; hook?: string; musicStart?: string; }

const songs: SongEntry[] = JSON.parse(readFileSync(resolve(args.songs), "utf-8"));
const baseOutput = resolve(args.output!);

console.log(`🎵 Batch Music Shorts: ${songs.length} songs\n`);

let success = 0, failed = 0;

for (let i = 0; i < songs.length; i++) {
  const s = songs[i];
  const slug = s.song.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
  const outputDir = resolve(baseOutput, `music-${slug}`);
  mkdirSync(outputDir, { recursive: true });

  console.log(`\n${"=".repeat(60)}`);
  console.log(`[${i + 1}/${songs.length}] 🎵 ${s.song}`);
  console.log(`${"=".repeat(60)}\n`);

  const cmdArgs = [`--song`, `"${s.song}"`, `--output`, outputDir];
  if (s.hook) cmdArgs.push(`--hook`, `"${s.hook}"`);
  if (s.musicStart) cmdArgs.push(`--music-start`, s.musicStart);

  try {
    execSync(`npx -y bun ${generateScript} ${cmdArgs.join(" ")}`, {
      stdio: "inherit",
      timeout: 15 * 60 * 1000,
    });
    success++;
  } catch (e: any) {
    console.error(`  ❌ Failed: ${e.message}`);
    failed++;
  }

  if (i < songs.length - 1) {
    console.log("  ⏳ Cooling 15s...");
    execSync("sleep 15");
  }
}

console.log(`\n${"=".repeat(60)}`);
console.log(`🎵 BATCH COMPLETE: ${success}/${songs.length} succeeded, ${failed} failed`);
