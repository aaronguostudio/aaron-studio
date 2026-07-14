#!/usr/bin/env node

import {createHash} from "node:crypto";
import {existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {basename, dirname, isAbsolute, resolve} from "node:path";

const ROOT = resolve(import.meta.dirname, "../../..");
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

function loadDotEnv(filePath) {
  if (!existsSync(filePath)) return;
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
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

function mimeType(filePath) {
  if (filePath.toLowerCase().endsWith(".jpg") || filePath.toLowerCase().endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (filePath.toLowerCase().endsWith(".webp")) return "image/webp";
  return "image/png";
}

function imagePart(filePath) {
  const bytes = readFileSync(filePath);
  return {
    // The Gemini Developer API's Veo endpoint uses its Image schema, which
    // serializes local bytes as `bytesBase64Encoded` (not a Content part).
    bytesBase64Encoded: bytes.toString("base64"),
    mimeType: mimeType(filePath),
  };
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function printHelp() {
  console.log(`Usage:
  node tiles/music-visualizer/scripts/generate-veo-loop.mjs \\
    --prompt-file <prompt.txt> \\
    --image <anchor.png> \\
    --output <output.mp4> \\
    [--last-frame <anchor.png>] \\
    [--model veo-3.1-lite-generate-preview] \\
    [--resolution 1080p] [--duration 8] [--seed 260714] [--negative-prompt <text>]

The same --image and --last-frame create a strict loop candidate. Veo 3.1 Lite
generates native audio; this tool preserves the source response, while final
assembly should explicitly remove that audio and use the project's music master.`);
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const result = await response.json();
  if (!response.ok) {
    const detail = result?.error?.message ?? JSON.stringify(result).slice(0, 1000);
    throw new Error(`Veo API request failed (${response.status}): ${detail}`);
  }
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.promptFile || !args.image || !args.output) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  loadDotEnv(resolve(ROOT, ".env"));
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY or GEMINI_API_KEY is required in .env.");

  const promptPath = absolutePath(args.promptFile);
  const imagePath = absolutePath(args.image);
  const lastFramePath = absolutePath(args.lastFrame ?? args.image);
  const outputPath = absolutePath(args.output);
  const model = args.model ?? "veo-3.1-lite-generate-preview";
  const duration = Number(args.duration ?? 8);
  const resolution = args.resolution ?? "1080p";
  const seed = args.seed == null ? null : Number(args.seed);
  const prompt = readFileSync(promptPath, "utf8").trim();
  const request = {
    instances: [{
      prompt,
      image: imagePart(imagePath),
      lastFrame: imagePart(lastFramePath),
    }],
    parameters: {
      aspectRatio: "16:9",
      durationSeconds: duration,
      resolution,
    },
  };
  // Veo 3.1 Lite currently rejects negativePrompt even though it is exposed
  // in the generic SDK schema. Preserve it for model variants that accept it,
  // and keep Lite's exclusions in the positive prompt instead.
  if (args.negativePrompt && !model.includes("lite")) {
    request.parameters.negativePrompt = args.negativePrompt;
  }

  mkdirSync(dirname(outputPath), {recursive: true});
  const base = outputPath.replace(/\.[^.]+$/, "");
  writeFileSync(`${base}.request.json`, `${JSON.stringify({
    provider: "Google Gemini API",
    model,
    mode: "strict-first-last-loop",
    promptFile: promptPath,
    image: {path: imagePath, sha256: sha256(imagePath)},
    lastFrame: {path: lastFramePath, sha256: sha256(lastFramePath)},
    output: outputPath,
    parameters: request.parameters,
    requestedSeed: seed,
    submittedAt: new Date().toISOString(),
  }, null, 2)}\n`);

  let operation = await fetchJson(`${BASE_URL}/models/${model}:predictLongRunning`, {
    method: "POST",
    headers: {"Content-Type": "application/json", "x-goog-api-key": apiKey},
    body: JSON.stringify(request),
  });
  writeFileSync(`${base}.operation.json`, `${JSON.stringify(operation, null, 2)}\n`);
  console.log(`Submitted Veo operation ${operation.name}`);

  for (;;) {
    if (operation.done) break;
    await new Promise((resolveSleep) => setTimeout(resolveSleep, 10000));
    operation = await fetchJson(`${BASE_URL}/${operation.name}`, {
      headers: {"x-goog-api-key": apiKey},
    });
    console.log(`Veo operation status: ${operation.done ? "complete" : "waiting"}`);
  }
  writeFileSync(`${base}.final-response.json`, `${JSON.stringify(operation, null, 2)}\n`);
  if (operation.error) throw new Error(`Veo generation failed: ${operation.error.message ?? JSON.stringify(operation.error)}`);

  const videoUri = operation?.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Veo response completed without a video URI.");
  const download = await fetch(videoUri, {headers: {"x-goog-api-key": apiKey}});
  if (!download.ok) throw new Error(`Veo video download failed (${download.status}).`);
  writeFileSync(outputPath, Buffer.from(await download.arrayBuffer()));
  writeFileSync(`${base}.manifest.json`, `${JSON.stringify({
    provider: "Google Gemini API",
    model,
    mode: "strict-first-last-loop",
    promptFile: promptPath,
    image: basename(imagePath),
    lastFrame: basename(lastFramePath),
    output: outputPath,
    durationSeconds: duration,
    resolution,
    requestedSeed: seed,
    nativeAudio: "generated by Veo; must be stripped before final music-video assembly",
    completedAt: new Date().toISOString(),
  }, null, 2)}\n`);
  console.log(`Generated ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
