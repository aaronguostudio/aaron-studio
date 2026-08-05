import {createHash} from "node:crypto";
import {existsSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");
const REPO_ROOT = resolve(PROJECT_DIR, "../../../..");
const PROFILE_PATH = resolve(REPO_ROOT, "tiles/aaron-video-gen/config/voice-profiles.json");
const PROFILE_ID = "aaron-pvc-identity-v1";

function loadDotEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function wordTimings(alignment) {
  const characters = alignment?.characters ?? [];
  const starts = alignment?.character_start_times_seconds ?? [];
  const ends = alignment?.character_end_times_seconds ?? [];
  const words = [];
  let text = "";
  let start = null;
  let end = 0;

  const flush = () => {
    if (!text) return;
    words.push({word: text, start, end});
    text = "";
    start = null;
  };

  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index];
    if (/\s/.test(character)) {
      flush();
      continue;
    }
    if (start === null) start = starts[index] ?? 0;
    end = ends[index] ?? start;
    text += character;
  }
  flush();
  return words;
}

async function main() {
  loadDotEnv(resolve(REPO_ROOT, ".env"));
  loadDotEnv(resolve(REPO_ROOT, ".baoyu-skills/.env"));
  const apiKey = process.env.ELEVENLABS_API_KEY ?? process.env.ELEVEN_LABS;
  if (!apiKey) throw new Error("ElevenLabs API key is required.");

  const registry = JSON.parse(readFileSync(PROFILE_PATH, "utf8"));
  const definition = registry.profiles?.[PROFILE_ID];
  if (!definition) throw new Error(`Voice profile not found: ${PROFILE_ID}`);

  const narration = readFileSync(resolve(PROJECT_DIR, "narration.txt"), "utf8").trim();
  const settings = definition.voice_settings;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${definition.voice_id}/with-timestamps?output_format=${definition.output_format}`,
    {
      method: "POST",
      headers: {"xi-api-key": apiKey, "Content-Type": "application/json"},
      body: JSON.stringify({
        text: narration,
        model_id: definition.model_id,
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarity_boost,
          style: settings.style,
          use_speaker_boost: settings.use_speaker_boost,
          speed: settings.speed,
        },
      }),
    },
  );
  const payload = await response.json();
  if (!response.ok || !payload.audio_base64) {
    throw new Error(`ElevenLabs narration request failed (${response.status}): ${JSON.stringify(payload).slice(0, 800)}`);
  }

  const audio = Buffer.from(payload.audio_base64, "base64");
  const rawPath = resolve(SCRIPT_DIR, "narration-raw.mp3");
  const timingsPath = resolve(SCRIPT_DIR, "timings.json");
  const manifestPath = resolve(SCRIPT_DIR, "audio-generation-manifest.json");
  const timings = wordTimings(payload.alignment);
  writeFileSync(rawPath, audio);
  writeFileSync(timingsPath, `${JSON.stringify(timings, null, 2)}\n`);
  writeFileSync(
    manifestPath,
    `${JSON.stringify({
      generated_at: new Date().toISOString(),
      provider: "ElevenLabs",
      profile_id: PROFILE_ID,
      voice_id: definition.voice_id,
      model_id: definition.model_id,
      output_format: definition.output_format,
      settings,
      narration,
      narration_sha256: sha256(Buffer.from(narration)),
      raw_audio_path: rawPath,
      raw_audio_sha256: sha256(audio),
      timings_path: timingsPath,
      measured_last_word_end_sec: timings.at(-1)?.end ?? null,
    }, null, 2)}\n`,
  );
  process.stdout.write(`${JSON.stringify({rawPath, timingsPath, manifestPath, words: timings.length, lastWordEnd: timings.at(-1)?.end ?? null})}\n`);
}

await main();
