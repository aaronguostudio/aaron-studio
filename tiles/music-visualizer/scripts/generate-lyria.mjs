#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../../..");

function loadDotEnv(filePath) {
  if (!existsSync(filePath)) return;
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    args[key] = inlineValue ?? argv[index + 1];
    if (inlineValue === undefined) index += 1;
  }
  return args;
}

function absolutePath(filePath) {
  return isAbsolute(filePath) ? filePath : resolve(ROOT, filePath);
}

function printHelp() {
  console.log(`Usage:
  node tiles/music-visualizer/scripts/generate-lyria.mjs \\
    --prompt-file <prompt.txt> \\
    --output <sample.mp3> \\
    [--model lyria-3-clip-preview]`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.promptFile || !args.output) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  loadDotEnv(resolve(ROOT, ".env"));
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY or GEMINI_API_KEY is required in .env.");
  }

  const promptPath = absolutePath(args.promptFile);
  const outputPath = absolutePath(args.output);
  const prompt = readFileSync(promptPath, "utf8").trim();
  const model = args.model ?? "lyria-3-clip-preview";

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({ model, input: prompt }),
  });
  const result = await response.json();
  if (!response.ok) {
    const detail = result?.error?.message ?? JSON.stringify(result).slice(0, 800);
    throw new Error(`Lyria request failed (${response.status}): ${detail}`);
  }

  const audio = (result.steps ?? [])
    .filter((step) => step.type === "model_output")
    .flatMap((step) => step.content ?? [])
    .find((block) => block.type === "audio" && block.data);
  if (!audio) {
    throw new Error("Lyria returned no audio block.");
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, Buffer.from(audio.data, "base64"));
  const manifestPath = outputPath.replace(/\.[^.]+$/, ".generation-manifest.json");
  writeFileSync(manifestPath, `${JSON.stringify({
    provider: "Google Gemini API",
    model,
    promptFile: promptPath,
    output: outputPath,
    outputMimeType: audio.mime_type ?? "audio/mpeg",
    generatedAt: new Date().toISOString(),
  }, null, 2)}\n`);

  console.log(`Generated ${outputPath}`);
  console.log(`Manifest ${manifestPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
