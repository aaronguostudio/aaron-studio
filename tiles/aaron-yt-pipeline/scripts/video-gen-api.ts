#!/usr/bin/env bun
/**
 * AI Video Generation API abstraction layer.
 * Supports Kling and Google Veo with a unified interface.
 * Async polling pattern: POST to create task, poll until done, download result.
 *
 * Usage:
 *   npx -y bun video-gen-api.ts \
 *     --provider kling \
 *     --prompt "A sleek modern office..." \
 *     --duration 5 \
 *     --aspect-ratio 16:9 \
 *     --output scenes/scene-01.mp4
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";
import { createHmac } from "crypto";
import { loadAllEnvFiles } from "./shared/env";
import type { VideoProvider, VideoGenRequest, VideoGenResult } from "./shared/types";

loadAllEnvFiles();

// ---------------------------------------------------------------------------
// Provider: Kling (JWT auth with access_key + secret_key)
// ---------------------------------------------------------------------------

const KLING_BASE_URL = "https://api.klingai.com";

/**
 * Generate a JWT token for Kling API authentication.
 * Uses HMAC-SHA256 with the secret key to sign a short-lived token.
 */
function generateKlingJWT(accessKey: string, secretKey: string): string {
  // Header
  const header = { alg: "HS256", typ: "JWT" };

  // Payload
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: accessKey,
    iat: now,
    exp: now + 30 * 60, // 30 minutes
    nbf: now - 5,       // valid 5 seconds ago (clock skew tolerance)
  };

  // Base64url encode
  const b64url = (obj: object) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const headerB64 = b64url(header);
  const payloadB64 = b64url(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  // Sign with HMAC-SHA256
  const signature = createHmac("sha256", secretKey)
    .update(signingInput)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${signingInput}.${signature}`;
}

function getKlingToken(): string {
  const accessKey = process.env.KLING_ACCESS_KEY || process.env.KLING_API_KEY;
  const secretKey = process.env.KLING_SECRET_KEY;
  if (!accessKey || !secretKey) {
    throw new Error(
      "KLING_ACCESS_KEY (or KLING_API_KEY) and KLING_SECRET_KEY must be set in your .env file.\n" +
      "Get them from: https://app.klingai.com/global/dev/document-api"
    );
  }
  return generateKlingJWT(accessKey, secretKey);
}

interface KlingCreateResponse {
  code: number;
  message: string;
  data: {
    task_id: string;
    task_status: string;
  };
}

interface KlingStatusResponse {
  code: number;
  message: string;
  data: {
    task_id: string;
    task_status: string;
    task_result?: {
      videos?: Array<{
        url: string;
        duration: number;
      }>;
    };
  };
}

async function generateKling(req: VideoGenRequest): Promise<VideoGenResult> {
  const token = getKlingToken();

  const model = req.model || "kling-v1-6";
  console.log(`  [kling] Creating task: model=${model}, duration=${req.duration}s`);

  // Create task
  const createRes = await fetch(`${KLING_BASE_URL}/v1/videos/text2video`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_name: model,
      prompt: req.prompt,
      duration: String(req.duration),
      aspect_ratio: req.aspectRatio,
      ...(req.negativePrompt && { negative_prompt: req.negativePrompt }),
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Kling API error (${createRes.status}): ${errText}`);
  }

  const createData: KlingCreateResponse = await createRes.json();
  if (createData.code !== 0) {
    throw new Error(`Kling API error: ${createData.message}`);
  }

  const taskId = createData.data.task_id;
  console.log(`  [kling] Task created: ${taskId}`);

  // Poll for completion
  const maxWaitMs = 10 * 60 * 1000; // 10 minutes
  const pollIntervalMs = 10_000; // 10 seconds
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    await sleep(pollIntervalMs);

    const statusRes = await fetch(`${KLING_BASE_URL}/v1/videos/${taskId}`, {
      headers: { Authorization: `Bearer ${getKlingToken()}` },
    });

    if (!statusRes.ok) {
      console.warn(`  [kling] Poll error (${statusRes.status}), retrying...`);
      continue;
    }

    const statusData: KlingStatusResponse = await statusRes.json();
    const status = statusData.data.task_status;

    if (status === "completed" || status === "succeed") {
      const videoUrl = statusData.data.task_result?.videos?.[0]?.url;
      if (!videoUrl) {
        throw new Error("Kling task completed but no video URL in response");
      }

      console.log(`  [kling] Downloading video...`);
      await downloadFile(videoUrl, req.outputPath);

      return {
        videoPath: req.outputPath,
        duration: req.duration,
        provider: "kling",
        taskId,
      };
    } else if (status === "failed") {
      throw new Error(`Kling task failed: ${statusData.message}`);
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`  [kling] Status: ${status} (${elapsed}s elapsed)`);
  }

  throw new Error(`Kling task timed out after ${maxWaitMs / 1000}s`);
}

// ---------------------------------------------------------------------------
// Provider: Google Veo (via Generative AI API — uses GOOGLE_API_KEY)
// ---------------------------------------------------------------------------

const VEO_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

interface VeoCreateResponse {
  name: string; // operation name, e.g. "operations/generate-video-xxx"
}

interface VeoStatusResponse {
  name: string;
  done?: boolean;
  response?: {
    generateVideoResponse?: {
      generatedSamples?: Array<{
        video: {
          uri: string;
        };
      }>;
    };
  };
  error?: { code: number; message: string };
}

function getGoogleApiKey(): string {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error(
      "GOOGLE_API_KEY not set in your .env file.\n" +
      "Get one from: https://aistudio.google.com/app/apikey"
    );
  }
  return key;
}

async function generateVeo(req: VideoGenRequest): Promise<VideoGenResult> {
  const apiKey = getGoogleApiKey();
  const model = req.model || "veo-2.0-generate-001";
  const endpoint = `${VEO_BASE_URL}/models/${model}:predictLongRunning`;

  console.log(`  [veo] Creating task: model=${model}`);

  const createRes = await fetch(endpoint, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      instances: [{ prompt: req.prompt }],
      parameters: {
        aspectRatio: req.aspectRatio,
        ...(req.negativePrompt && { negativePrompt: req.negativePrompt }),
      },
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Veo API error (${createRes.status}): ${errText}`);
  }

  const createData: VeoCreateResponse = await createRes.json();
  const operationName = createData.name;
  console.log(`  [veo] Operation created: ${operationName}`);

  // Poll for completion
  const maxWaitMs = 10 * 60 * 1000;
  const pollIntervalMs = 15_000;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    await sleep(pollIntervalMs);

    const statusRes = await fetch(`${VEO_BASE_URL}/${operationName}`, {
      headers: { "x-goog-api-key": apiKey },
    });

    if (!statusRes.ok) {
      console.warn(`  [veo] Poll error (${statusRes.status}), retrying...`);
      continue;
    }

    const statusData: VeoStatusResponse = await statusRes.json();

    if (statusData.error) {
      throw new Error(`Veo task failed: ${statusData.error.message}`);
    }

    if (statusData.done) {
      const videoUri = statusData.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
      if (!videoUri) {
        throw new Error("Veo task completed but no video URI in response");
      }

      console.log(`  [veo] Downloading video...`);
      // Download with API key authentication
      const dlRes = await fetch(videoUri, {
        headers: { "x-goog-api-key": apiKey },
      });
      if (!dlRes.ok) {
        throw new Error(`Veo download failed (${dlRes.status}): ${videoUri}`);
      }
      const buffer = await dlRes.arrayBuffer();
      ensureDir(req.outputPath);
      writeFileSync(req.outputPath, Buffer.from(buffer));

      return {
        videoPath: req.outputPath,
        duration: req.duration,
        provider: "veo",
        taskId: operationName,
      };
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`  [veo] Pending... (${elapsed}s elapsed)`);
  }

  throw new Error(`Veo task timed out after ${maxWaitMs / 1000}s`);
}

// ---------------------------------------------------------------------------
// Unified Interface
// ---------------------------------------------------------------------------

const PROVIDERS: Record<VideoProvider, (req: VideoGenRequest) => Promise<VideoGenResult>> = {
  kling: generateKling,
  veo: generateVeo,
  runway: async () => { throw new Error("Runway provider not yet implemented"); },
  minimax: async () => { throw new Error("Minimax provider not yet implemented"); },
};

export async function generateVideo(req: VideoGenRequest): Promise<VideoGenResult> {
  const handler = PROVIDERS[req.provider];
  if (!handler) {
    throw new Error(`Unknown provider: ${req.provider}. Supported: ${Object.keys(PROVIDERS).join(", ")}`);
  }

  ensureDir(req.outputPath);
  return handler(req);
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function downloadFile(url: string, outputPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed (${res.status}): ${url}`);
  }
  const buffer = await res.arrayBuffer();
  ensureDir(outputPath);
  writeFileSync(outputPath, Buffer.from(buffer));
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--provider") args.provider = argv[++i];
    else if (arg === "--prompt") args.prompt = argv[++i];
    else if (arg === "--negative-prompt") args.negativePrompt = argv[++i];
    else if (arg === "--duration") args.duration = argv[++i];
    else if (arg === "--aspect-ratio") args.aspectRatio = argv[++i];
    else if (arg === "--reference-image") args.referenceImage = argv[++i];
    else if (arg === "--model") args.model = argv[++i];
    else if (arg === "--output") args.output = argv[++i];
  }
  return args;
}

async function main() {
  const args = parseArgs();

  if (!args.provider || !args.prompt || !args.output) {
    console.error("Usage: video-gen-api.ts --provider <kling|veo> --prompt <text> --output <path> [options]");
    console.error("Options: --duration <5|10> --aspect-ratio <16:9> --model <model-id> --negative-prompt <text>");
    process.exit(1);
  }

  console.log(`\n[video-gen] Provider: ${args.provider}`);
  console.log(`[video-gen] Prompt: "${args.prompt.slice(0, 80)}..."`);

  const result = await generateVideo({
    provider: args.provider as VideoProvider,
    prompt: args.prompt,
    negativePrompt: args.negativePrompt,
    duration: Number(args.duration || 5),
    aspectRatio: args.aspectRatio || "16:9",
    referenceImage: args.referenceImage,
    model: args.model,
    outputPath: args.output,
  });

  console.log(`\n[video-gen] Video saved: ${result.videoPath}`);
  console.log(`[video-gen] Provider: ${result.provider}, TaskID: ${result.taskId}`);
}

main().catch((err) => {
  console.error(`\n[video-gen] Error: ${err.message}`);
  process.exit(1);
});
