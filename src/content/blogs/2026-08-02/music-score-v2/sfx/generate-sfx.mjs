import {existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(currentDir, "../../../../../..");

for (const envPath of [join(repoRoot, ".env"), join(repoRoot, ".baoyu-skills/.env")]) {
  if (!existsSync(envPath)) continue;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error("ELEVENLABS_API_KEY is required");
}

const jobs = [
  {
    id: "soft-node-settle",
    duration_seconds: 1.1,
    prompt_influence: 0.62,
    text: "One isolated refined editorial motion accent: a single soft felt-covered wooden mallet tap with a faint warm airy harmonic tail. Light, tactile, restrained, and acoustic. No bell melody, no sparkle shower, no UI beep, no sharp click, no bass impact, no whoosh, and no background ambience."
  },
  {
    id: "muted-pizz-confirm",
    duration_seconds: 1.2,
    prompt_influence: 0.62,
    text: "One isolated restrained warm pizzicato confirmation: a muted viola and low cello pluck together, soft rounded attack, elegant editorial feel, and a short natural room tail. No melody, no cartoon boing, no bright high string, no bass impact, no percussion, and no background ambience."
  },
  {
    id: "air-thread-transition",
    duration_seconds: 2.6,
    prompt_influence: 0.58,
    text: "One very subtle isolated airy bowed-harmonic transition: breath-like viola harmonics gently open upward and dissolve into a soft paper-texture tail. Light, calm, refined, and almost weightless. No whoosh, no riser, no impact, no suspense sting, no melody, no sparkle, and no background ambience."
  }
];

mkdirSync(currentDir, {recursive: true});
const manifest = {generated_at: new Date().toISOString(), provider: "ElevenLabs", model_id: "eleven_text_to_sound_v2", jobs: []};

for (const job of jobs) {
  const response = await fetch("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY
    },
    body: JSON.stringify({...job, loop: false, model_id: "eleven_text_to_sound_v2"})
  });
  if (!response.ok) {
    throw new Error(`${job.id} failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
  }
  const outputPath = join(currentDir, `${job.id}.mp3`);
  writeFileSync(outputPath, Buffer.from(await response.arrayBuffer()));
  manifest.jobs.push({
    ...job,
    output_path: outputPath,
    character_cost: response.headers.get("character-cost"),
    request_id: response.headers.get("request-id")
  });
}

writeFileSync(join(currentDir, "generation-manifest.json"), JSON.stringify(manifest, null, 2));
