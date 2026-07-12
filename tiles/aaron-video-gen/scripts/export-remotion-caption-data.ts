#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { mkdirSync } from "fs";

type TimingPayload = {
  wordTimings: Array<{
    word: string;
    start: number;
    end: number;
  }>;
};

function valueFor(flag: string): string {
  const index = process.argv.indexOf(flag);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value || value.startsWith("--")) throw new Error(`${flag} is required`);
  return value;
}

function main(): void {
  const inputPath = resolve(valueFor("--input"));
  const outputPath = resolve(valueFor("--output"));
  const exportName = valueFor("--export");
  const payload = JSON.parse(readFileSync(inputPath, "utf-8")) as TimingPayload;
  if (!Array.isArray(payload.wordTimings) || payload.wordTimings.length === 0) {
    throw new Error("input does not contain wordTimings");
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  const source = [
    'import type { WordTimingData } from "../components/WordCaption";',
    "",
    `export const ${exportName}: WordTimingData[] = ${JSON.stringify(payload.wordTimings, null, 2)};`,
    "",
  ].join("\n");
  writeFileSync(outputPath, source, "utf-8");
  console.log(`[export-remotion-caption-data] ${outputPath}`);
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    console.error(`[export-remotion-caption-data] ${(error as Error).message}`);
    process.exit(1);
  }
}
