#!/usr/bin/env bun
/**
 * Music Shorts Generator — "If This Song Was a Painting"
 * Song → Kling v3 video + ffmpeg hook overlay → YouTube Short
 */

import { execSync, spawnSync } from "child_process";
import {
  existsSync, mkdirSync, readFileSync, writeFileSync, statSync, copyFileSync,
} from "fs";
import { resolve, dirname } from "path";
import { parseArgs } from "util";

const { values: args } = parseArgs({
  options: {
    song: { type: "string" },
    hook: { type: "string" },
    "video-prompt": { type: "string" },
    "music-start": { type: "string" },
    "music-note": { type: "string" },
    "yt-title": { type: "string" },
    "yt-desc": { type: "string" },
    output: { type: "string", short: "o", default: "./output/" },
    "skip-video": { type: "boolean", default: false },
  },
  strict: false,
});

if (!args.song) { console.error("❌ --song required"); process.exit(1); }

const SKILL_DIR = resolve(dirname(new URL(import.meta.url).pathname), "..");
const OUTPUT_DIR = resolve(args.output!);
mkdirSync(OUTPUT_DIR, { recursive: true });

// Load env
for (const envFile of [
  resolve(SKILL_DIR, "../../.baoyu-skills/.env"),
  resolve(SKILL_DIR, "../../src/content/shorts/prototype-01/.env"),
  resolve(SKILL_DIR, "../../.env"),
]) {
  if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, "utf-8").split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const KLING_ACCESS_KEY = process.env.KLING_ACCESS_KEY;
const KLING_SECRET_KEY = process.env.KLING_SECRET_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ─── Types ───────────────────────────────────────────────────────

interface MusicShortScript {
  song: string;
  hook: string;
  musicStart: string;
  musicNote: string;
  videoPrompt: string;
  ytTitle: string;
  ytDesc: string;
  lyrics: string;
}

// ─── Auto-generate script ────────────────────────────────────────

async function generateScript(song: string): Promise<MusicShortScript> {
  const scriptPath = resolve(OUTPUT_DIR, "music-short.json");
  if (existsSync(scriptPath)) {
    console.log("⏭️ Script cached");
    return JSON.parse(readFileSync(scriptPath, "utf-8"));
  }

  if (args.hook && args["video-prompt"]) {
    const script: MusicShortScript = {
      song,
      hook: args.hook.replace(/\\n/g, "\n"),
      musicStart: args["music-start"] || "0:00",
      musicNote: args["music-note"] || "",
      videoPrompt: args["video-prompt"],
      ytTitle: args["yt-title"] || args.hook.replace(/\\n/g, " "),
      ytDesc: args["yt-desc"] || "#shorts #aiart #music",
      lyrics: "",
    };
    writeFileSync(scriptPath, JSON.stringify(script, null, 2));
    return script;
  }

  console.log("🧠 Generating script from song...");
  if (!OPENAI_API_KEY) { console.error("❌ OPENAI_API_KEY required"); process.exit(1); }

  const prompt = `You are a viral YouTube Shorts creator specializing in "If This Song Was a Painting" content.

Create a 15-second cinematic short for: "${song}"

The concept: Kling AI generates a cinematic vertical video that captures the EMOTION of the song's most powerful moment. The video has no audio — the viewer adds the song on YouTube.

Return JSON (no markdown):
{
  "hook": "Two-line hook text (shown first 2.5s). Must create curiosity. Use \\n for line break. One emoji at end. Patterns: 'If this song was a painting...', 'POV: [scenario]', 'The sound of [feeling]', 'Play this at [moment]'",
  "musicStart": "Timestamp (M:SS) of the emotional peak — the best 15s of the song. This is where the viewer should start the music.",
  "musicNote": "Brief explanation of why this timestamp (what happens musically)",
  "lyrics": "Key lyrics at that moment (or '(instrumental)' if none)",
  "videoPrompt": "Cinematic vertical video prompt for Kling AI. EMOTION-FIRST. 4 scenes with build-up → payoff. Human stories > pure landscapes. Scene descriptions should match the song's emotional arc at the chosen timestamp. End with color palette + 'Photorealistic' + mood. Do NOT include any text/words in the video.",
  "ytTitle": "YouTube title (<60 chars, with emoji, catchy)",
  "ytDesc": "1-2 sentence description + 5 hashtags including #aiart #shorts and song-related tags"
}`;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
      response_format: { type: "json_object" },
    }),
  });

  const data = await resp.json() as any;
  const gen = JSON.parse(data.choices[0].message.content);
  const script: MusicShortScript = { song, ...gen };

  if (args.hook) script.hook = args.hook.replace(/\\n/g, "\n");
  if (args["music-start"]) script.musicStart = args["music-start"];
  if (args["yt-title"]) script.ytTitle = args["yt-title"];
  if (args["yt-desc"]) script.ytDesc = args["yt-desc"];

  writeFileSync(scriptPath, JSON.stringify(script, null, 2));
  console.log(`  🎵 Hook: ${script.hook.replace(/\n/g, " | ")}`);
  console.log(`  ⏱️  Start: ${script.musicStart} — ${script.musicNote}`);
  return script;
}

// ─── Kling Video Generation ──────────────────────────────────────

async function generateKlingVideo(prompt: string): Promise<string> {
  const videoPath = resolve(OUTPUT_DIR, "raw-video.mp4");
  if (existsSync(videoPath) && statSync(videoPath).size > 1000) {
    console.log("⏭️ Kling video exists");
    return videoPath;
  }

  console.log("🎬 Generating Kling v3 video (15s, pro, 9:16)...");

  const jwt = await import("jsonwebtoken");
  const now = Math.floor(Date.now() / 1000);
  const token = jwt.default.sign(
    { iss: KLING_ACCESS_KEY, exp: now + 1800, nbf: now - 5 },
    KLING_SECRET_KEY!, { algorithm: "HS256", header: { alg: "HS256", typ: "JWT" } }
  );

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const API = "https://api-beijing.klingai.com/v1";

  let taskId: string | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const resp = await fetch(`${API}/videos/text2video`, {
      method: "POST", headers,
      body: JSON.stringify({
        model_name: "kling-v3", prompt, cfg_scale: 0.5,
        mode: "pro", duration: "15", aspect_ratio: "9:16",
        multi_shot: "true", shot_type: "intelligence",
      }),
    });
    const data = await resp.json() as any;
    if (data.code === 0) { taskId = data.data.task_id; break; }
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

  let elapsed = 0;
  while (elapsed < 900) {
    await new Promise(r => setTimeout(r, 15000));
    elapsed += 15;
    const now2 = Math.floor(Date.now() / 1000);
    const token2 = jwt.default.sign(
      { iss: KLING_ACCESS_KEY, exp: now2 + 1800, nbf: now2 - 5 },
      KLING_SECRET_KEY!, { algorithm: "HS256", header: { alg: "HS256", typ: "JWT" } }
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
        const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
        writeFileSync(videoPath, buf);
        console.log(`  💾 ${(buf.length / 1024 / 1024).toFixed(1)} MB`);
        return videoPath;
      } else if (status === "failed") {
        console.error(`  ❌ Failed: ${d.data?.task_status_msg}`);
        process.exit(1);
      } else if (elapsed % 60 === 0) {
        console.log(`  ⏳ ${status} (${elapsed}s)`);
      }
    } catch (e: any) { console.log(`  ⚠️ ${e.message}`); }
  }
  console.error("  ⏰ Timeout");
  process.exit(1);
}

// ─── FFmpeg Hook Text Overlay ────────────────────────────────────

function addHookOverlay(videoPath: string, hook: string): string {
  const outputPath = resolve(OUTPUT_DIR, "short-final.mp4");
  console.log("🎨 Adding hook text overlay...");

  const lines = hook.split("\n");
  const font = "/System/Library/Fonts/Helvetica.ttc";
  const duration = 2.5;

  const filters = lines.map((line, i) => {
    const escaped = line.replace(/'/g, "'\\''").replace(/:/g, "\\:");
    const yOffset = `(h*0.12)+${i * 65}`;
    return [
      `drawtext=text='${escaped}'`,
      `fontfile=${font}`,
      `fontsize=52`,
      `fontcolor=white`,
      `borderw=3`,
      `bordercolor=black@0.6`,
      `x=(w-text_w)/2`,
      `y=${yOffset}`,
      `enable='between(t,0.2,${duration})'`,
      `alpha='if(lt(t,0.5),t/0.3,if(gt(t,${duration - 0.5}),((${duration}-t)/0.5),1))'`,
    ].join(":");
  });

  const result = spawnSync("ffmpeg", [
    "-y", "-i", videoPath,
    "-vf", filters.join(","),
    "-c:a", "copy", "-c:v", "libx264", "-crf", "18",
    outputPath,
  ], { stdio: "pipe", encoding: "utf-8" });

  if (result.status !== 0) {
    console.error(`  ❌ ffmpeg: ${result.stderr?.slice(-300)}`);
    process.exit(1);
  }

  const mb = statSync(outputPath).size / 1024 / 1024;
  console.log(`  ✅ ${mb.toFixed(1)} MB`);
  return outputPath;
}

// ─── Sync to iCloud ──────────────────────────────────────────────

function syncToICloud(filePath: string, fileName: string) {
  const dest = resolve(process.env.HOME || "~",
    "Library/Mobile Documents/com~apple~CloudDocs/Aaron-Studio/shorts-ready");
  mkdirSync(dest, { recursive: true });
  copyFileSync(filePath, resolve(dest, fileName));
  console.log(`☁️ Synced: ${fileName}`);
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  console.log("🎵 Music Shorts — 'If This Song Was a Painting'\n");

  const script = await generateScript(args.song!);
  console.log(`\n🎵 ${script.song}\n`);

  const videoPath = await generateKlingVideo(script.videoPrompt);

  const slug = args.song!.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);

  // Only sync raw video — Aaron adds text overlay in YouTube Shorts editor
  syncToICloud(videoPath, `music-${slug}.mp4`);

  console.log(`\n📋 YouTube Upload:`);
  console.log(`  📹 File: music-${slug}.mp4`);
  console.log(`  📝 Title: ${script.ytTitle}`);
  console.log(`  📄 Desc: ${script.ytDesc}`);
  console.log(`  🎵 Song: ${script.song}`);
  console.log(`  ⏱️  Start music at: ${script.musicStart}`);
  if (script.lyrics !== "(instrumental)") console.log(`  🎤 Lyrics: ${script.lyrics}`);
  console.log(`  💡 Note: ${script.musicNote}`);
}

main().catch(e => { console.error("❌", e); process.exit(1); });
