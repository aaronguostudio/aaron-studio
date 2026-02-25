#!/usr/bin/env bun
/**
 * Knowledge Shorts Generator
 * Topic → Kling v3 video + ElevenLabs TTS + Remotion render → YouTube Short
 */

import { execSync, spawnSync } from "child_process";
import {
  existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, statSync,
} from "fs";
import { resolve, dirname } from "path";
import { parseArgs } from "util";

// ─── Args ────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    topic: { type: "string" },
    title: { type: "string" },
    narration: { type: "string" },
    "video-prompt": { type: "string" },
    "yt-title": { type: "string" },
    "yt-desc": { type: "string" },
    output: { type: "string", short: "o", default: "./output/" },
    voice: { type: "string", default: "991lF4hc0xxfec4Y6B0i" },
    speed: { type: "string", default: "1.2" },
    "skip-video": { type: "boolean", default: false },
    "skip-tts": { type: "boolean", default: false },
  },
  strict: false,
});

if (!args.topic) {
  console.error("❌ --topic is required");
  process.exit(1);
}

const SKILL_DIR = resolve(dirname(new URL(import.meta.url).pathname), "..");
const REMOTION_DIR = resolve(SKILL_DIR, "../aaron-video-gen/remotion");
const PUBLIC_DIR = resolve(REMOTION_DIR, "public");
const OUTPUT_DIR = resolve(args.output!);
mkdirSync(OUTPUT_DIR, { recursive: true });

// Load env
const envFiles = [
  resolve(SKILL_DIR, "../../.baoyu-skills/.env"),
  resolve(SKILL_DIR, "../../src/content/shorts/prototype-01/.env"),
  resolve(SKILL_DIR, "../../.env"),
];

for (const envFile of envFiles) {
  if (existsSync(envFile)) {
    const lines = readFileSync(envFile, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match && !process.env[match[1].trim()]) {
        process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  }
}

const KLING_ACCESS_KEY = process.env.KLING_ACCESS_KEY;
const KLING_SECRET_KEY = process.env.KLING_SECRET_KEY;
const ELEVENLABS_KEY = process.env.ELEVEN_LABS || process.env.ELEVENLABS_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ─── Auto-generate script from topic ─────────────────────────────

interface ShortScript {
  topic: string;
  title: string;
  narration: string;
  videoPrompt: string;
  ytTitle: string;
  ytDesc: string;
  source: string;
  voice: string;
  speed: number;
}

async function generateScript(topic: string): Promise<ShortScript> {
  const scriptPath = resolve(OUTPUT_DIR, "knowledge-short.json");

  // Return cached if exists
  if (existsSync(scriptPath)) {
    console.log("⏭️ Script cached");
    return JSON.parse(readFileSync(scriptPath, "utf-8"));
  }

  // If all fields provided via CLI, skip LLM
  if (args.title && args.narration && args["video-prompt"]) {
    const script: ShortScript = {
      topic,
      title: args.title,
      narration: args.narration,
      videoPrompt: args["video-prompt"],
      ytTitle: args["yt-title"] || args.title,
      ytDesc: args["yt-desc"] || `#shorts #funfact`,
      source: "",
      voice: args.voice!,
      speed: parseFloat(args.speed!),
    };
    writeFileSync(scriptPath, JSON.stringify(script, null, 2));
    return script;
  }

  // Use OpenAI to generate
  console.log("🧠 Generating script from topic...");
  if (!OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY required for auto-generation");
    process.exit(1);
  }

  const prompt = `You are a YouTube Shorts script writer. Create a 15-second knowledge short about: "${topic}"

Return JSON (no markdown):
{
  "title": "Short title for top banner (2-6 words, English, can have 1 emoji)",
  "narration": "Narration text, ~40-45 words. Structure: Hook (surprising fact) → Context (scale it) → Punchline (memorable closer). Conversational tone. Every claim must be factual.",
  "videoPrompt": "Cinematic vertical video prompt for Kling AI. 3-4 scenes with multi-scene transitions. Describe visuals that match the narration. End with 'Photorealistic' + mood/color palette. Do NOT include any text or words in the video.",
  "ytTitle": "YouTube title (catchy, <60 chars, with emoji)",
  "ytDesc": "YouTube description (1-2 sentences + 5 hashtags)",
  "source": "Source of the key fact (study, organization, year)"
}`;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      response_format: { type: "json_object" },
    }),
  });

  const data = await resp.json() as any;
  const generated = JSON.parse(data.choices[0].message.content);

  const script: ShortScript = {
    topic,
    ...generated,
    voice: args.voice!,
    speed: parseFloat(args.speed!),
  };

  // Apply CLI overrides
  if (args.title) script.title = args.title;
  if (args.narration) script.narration = args.narration;
  if (args["video-prompt"]) script.videoPrompt = args["video-prompt"];
  if (args["yt-title"]) script.ytTitle = args["yt-title"];
  if (args["yt-desc"]) script.ytDesc = args["yt-desc"];

  writeFileSync(scriptPath, JSON.stringify(script, null, 2));
  console.log(`  📝 Title: ${script.title}`);
  console.log(`  🎙️ Narration: ${script.narration.substring(0, 80)}...`);
  console.log(`  📖 Source: ${script.source}`);
  return script;
}

// ─── Kling Video Generation ──────────────────────────────────────

async function generateKlingVideo(prompt: string): Promise<string> {
  const videoPath = resolve(OUTPUT_DIR, "kling-video.mp4");
  if (existsSync(videoPath) && args["skip-video"]) {
    console.log("⏭️ Kling video cached");
    return videoPath;
  }
  if (existsSync(videoPath) && statSync(videoPath).size > 1000) {
    console.log("⏭️ Kling video exists");
    return videoPath;
  }

  console.log("🎬 Generating Kling v3 video (15s, pro, 9:16)...");

  // JWT token
  const jwt = await import("jsonwebtoken");
  const now = Math.floor(Date.now() / 1000);
  const token = jwt.default.sign(
    { iss: KLING_ACCESS_KEY, exp: now + 1800, nbf: now - 5 },
    KLING_SECRET_KEY!,
    { algorithm: "HS256", header: { alg: "HS256", typ: "JWT" } }
  );

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const API = "https://api-beijing.klingai.com/v1";

  // Submit
  let taskId: string | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const resp = await fetch(`${API}/videos/text2video`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model_name: "kling-v3",
        prompt,
        cfg_scale: 0.5,
        mode: "pro",
        duration: "15",
        aspect_ratio: "9:16",
        multi_shot: "true",
        shot_type: "intelligence",
      }),
    });
    const data = await resp.json() as any;
    if (data.code === 0) {
      taskId = data.data.task_id;
      break;
    }
    if (data.code === 1303) {
      const wait = 30 * (attempt + 1);
      console.log(`  ⏳ Queue full, waiting ${wait}s...`);
      await new Promise(r => setTimeout(r, wait * 1000));
      continue;
    }
    console.error(`  ❌ Error: ${JSON.stringify(data)}`);
    process.exit(1);
  }

  if (!taskId) { console.error("❌ Failed to submit"); process.exit(1); }
  console.log(`  ✅ Task: ${taskId}`);

  // Poll
  const maxWait = 900;
  let elapsed = 0;
  while (elapsed < maxWait) {
    await new Promise(r => setTimeout(r, 15000));
    elapsed += 15;

    // Refresh token
    const now2 = Math.floor(Date.now() / 1000);
    const token2 = jwt.default.sign(
      { iss: KLING_ACCESS_KEY, exp: now2 + 1800, nbf: now2 - 5 },
      KLING_SECRET_KEY!,
      { algorithm: "HS256", header: { alg: "HS256", typ: "JWT" } }
    );

    try {
      const resp = await fetch(`${API}/videos/text2video/${taskId}`, {
        headers: { ...headers, Authorization: `Bearer ${token2}` },
      });
      const d = await resp.json() as any;
      if (d.code !== 0) continue;

      const status = d.data?.task_status;
      if (status === "succeed") {
        const url = d.data.task_result.videos[0].url;
        const vidResp = await fetch(url);
        const buf = Buffer.from(await vidResp.arrayBuffer());
        writeFileSync(videoPath, buf);
        const mb = buf.length / 1024 / 1024;
        console.log(`  💾 ${mb.toFixed(1)} MB`);
        return videoPath;
      } else if (status === "failed") {
        console.error(`  ❌ Failed: ${d.data?.task_status_msg}`);
        process.exit(1);
      } else if (elapsed % 60 === 0) {
        console.log(`  ⏳ ${status} (${elapsed}s)`);
      }
    } catch (e: any) {
      console.log(`  ⚠️ ${e.message}`);
    }
  }
  console.error("  ⏰ Timeout");
  process.exit(1);
}

// ─── ElevenLabs TTS ──────────────────────────────────────────────

interface WordTiming { word: string; start: number; end: number; }

async function generateTTS(narration: string, voice: string, speed: number): Promise<{ audioPath: string; timings: WordTiming[] }> {
  const audioPath = resolve(OUTPUT_DIR, "narration.mp3");
  const timingsPath = resolve(OUTPUT_DIR, "timings.json");

  if (existsSync(audioPath) && existsSync(timingsPath) && args["skip-tts"]) {
    console.log("⏭️ TTS cached");
    return { audioPath, timings: JSON.parse(readFileSync(timingsPath, "utf-8")) };
  }
  if (existsSync(audioPath) && existsSync(timingsPath) && statSync(audioPath).size > 1000) {
    console.log("⏭️ TTS exists");
    return { audioPath, timings: JSON.parse(readFileSync(timingsPath, "utf-8")) };
  }

  console.log("🎙️ Generating TTS...");

  const resp = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps`,
    {
      method: "POST",
      headers: { "xi-api-key": ELEVENLABS_KEY!, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: narration,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, speed },
        output_format: "mp3_44100_128",
      }),
    }
  );

  const data = await resp.json() as any;

  if (!data.audio_base64) {
    console.error(`  ❌ ElevenLabs error: ${JSON.stringify(data.detail || data)}`);
    process.exit(1);
  }

  // Save audio
  const audioBuf = Buffer.from(data.audio_base64, "base64");
  writeFileSync(audioPath, audioBuf);
  console.log(`  💾 Audio: ${(audioBuf.length / 1024).toFixed(0)} KB`);

  // Extract word timings from character alignment
  const chars: string[] = data.alignment?.characters || [];
  const charStarts: number[] = data.alignment?.character_start_times_seconds || [];
  const charEnds: number[] = data.alignment?.character_end_times_seconds || [];

  const timings: WordTiming[] = [];
  let currentWord = "";
  let wordStart: number | null = null;
  let wordEnd = 0;

  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === " ") {
      if (currentWord) {
        timings.push({ word: currentWord, start: wordStart!, end: wordEnd });
        currentWord = "";
        wordStart = null;
      }
    } else {
      if (wordStart === null) wordStart = charStarts[i];
      wordEnd = charEnds[i];
      currentWord += chars[i];
    }
  }
  if (currentWord) timings.push({ word: currentWord, start: wordStart!, end: wordEnd });

  writeFileSync(timingsPath, JSON.stringify(timings, null, 2));
  const audioDur = timings.length > 0 ? timings[timings.length - 1].end : 0;
  console.log(`  📝 ${timings.length} words, ${audioDur.toFixed(1)}s`);

  return { audioPath, timings };
}

// ─── Remotion Render ─────────────────────────────────────────────

function renderWithRemotion(videoPath: string, audioPath: string, timings: WordTiming[], title: string): string {
  console.log("🎬 Rendering with Remotion...");

  // Get video fps
  const probeResult = spawnSync("ffprobe", [
    "-v", "quiet", "-show_entries", "stream=r_frame_rate",
    "-of", "csv=p=0", videoPath,
  ], { encoding: "utf-8" });
  const fpsStr = probeResult.stdout.trim().split("/");
  const fps = fpsStr.length === 2 ? Math.round(parseInt(fpsStr[0]) / parseInt(fpsStr[1])) : 24;

  // Get audio duration
  const probeAudio = spawnSync("ffprobe", [
    "-v", "quiet", "-show_entries", "format=duration",
    "-of", "csv=p=0", audioPath,
  ], { encoding: "utf-8" });
  const audioDur = parseFloat(probeAudio.stdout.trim());
  const durationSec = audioDur + 0.5;

  console.log(`  📐 ${fps}fps, ${durationSec.toFixed(1)}s duration`);

  // Copy assets to Remotion public
  mkdirSync(PUBLIC_DIR, { recursive: true });
  copyFileSync(videoPath, resolve(PUBLIC_DIR, "ks-video.mp4"));
  copyFileSync(audioPath, resolve(PUBLIC_DIR, "ks-narration.mp3"));

  // Write props
  const props = { title, videoFile: "ks-video.mp4", audioFile: "ks-narration.mp3", wordTimings: timings, fps, durationSec };
  const propsFile = resolve(PUBLIC_DIR, "ks-props.json");
  writeFileSync(propsFile, JSON.stringify(props));

  // Install deps if needed
  if (!existsSync(resolve(REMOTION_DIR, "node_modules"))) {
    console.log("  📦 Installing Remotion deps...");
    execSync("npm install", { cwd: REMOTION_DIR, stdio: "inherit" });
  }

  const outputPath = resolve(OUTPUT_DIR, "short-final.mp4");

  execSync([
    "npx", "remotion", "render", "src/index.ts", "KnowledgeShort",
    outputPath,
    `--props=${propsFile}`,
    "--codec=h264", "--crf=18", "--concurrency=50%",
  ].join(" "), { cwd: REMOTION_DIR, stdio: "inherit" });

  const mb = statSync(outputPath).size / 1024 / 1024;
  console.log(`✅ Output: short-final.mp4 (${mb.toFixed(1)} MB)`);
  return outputPath;
}

// ─── Sync to iCloud ──────────────────────────────────────────────

function syncToICloud(filePath: string, fileName: string) {
  const dest = resolve(
    process.env.HOME || "~",
    "Library/Mobile Documents/com~apple~CloudDocs/Aaron-Studio/shorts-ready"
  );
  mkdirSync(dest, { recursive: true });
  copyFileSync(filePath, resolve(dest, fileName));
  console.log(`☁️ Synced to iCloud: ${fileName}`);
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  console.log("🧠 Knowledge Shorts Generator\n");

  // 1. Generate or load script
  const script = await generateScript(args.topic!);
  console.log(`\n📋 Script: "${script.title}"\n`);

  // 2. Generate Kling video (15s)
  const videoPath = await generateKlingVideo(script.videoPrompt);

  // 3. Generate TTS
  const { audioPath, timings } = await generateTTS(script.narration, script.voice, script.speed);

  // 4. Render with Remotion
  const outputPath = renderWithRemotion(videoPath, audioPath, timings, script.title);

  // 5. Sync to iCloud
  const shortName = `short-${args.topic!.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}.mp4`;
  syncToICloud(outputPath, shortName);

  // 6. Print upload info
  console.log(`\n📋 YouTube Upload:`);
  console.log(`  📹 File: ${shortName}`);
  console.log(`  📝 Title: ${script.ytTitle}`);
  console.log(`  📄 Desc: ${script.ytDesc}`);
  if (script.source) console.log(`  📖 Source: ${script.source}`);
}

main().catch((e) => {
  console.error("❌", e);
  process.exit(1);
});
