// AI narration for WalkthroughVideo (phase 2): one voice clip per step, in Aaron's ElevenLabs
// professional voice clone (config/voice-profiles.json). Each clip's length becomes the least time
// its step stays on screen, so voice and picture line up without editing; the video says "AI
// narration" on screen.
//
// The key is read from the macOS Keychain (service KEYCHAIN_SERVICE), else from this repo's
// gitignored .env (ELEVENLABS_API_KEY, as the other tiles do). It is never printed or written.
import { execFileSync } from "child_process";
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { readingMs, type Step } from "../../remotion/src/projects/walkthrough-video/timeline";

export const KEYCHAIN_SERVICE = "elevenlabs-api-key";
export const NARRATION_PAD_MS = 400;
const PROFILES = resolve(import.meta.dir, "..", "..", "config", "voice-profiles.json");

export type VoiceProfile = {
  voice_id: string;
  model_id: string;
  output_format: string;
  voice_settings: Record<string, number | boolean>;
};

export type NarrationClip = { step: number; file: string; ms: number; text: string };

export type Synthesize = (text: string, profile: VoiceProfile) => Promise<Uint8Array>;
export type ProbeMs = (path: string) => number;

export function loadVoiceProfile(name?: string, path = PROFILES): VoiceProfile & { name: string } {
  const config = JSON.parse(readFileSync(path, "utf8"));
  const id = name ?? config.default_profile;
  const profile = config.profiles?.[id];
  if (!profile) throw new Error(`No voice profile "${id}" in ${path}`);
  if (profile.provider !== "elevenlabs") throw new Error(`Voice profile "${id}" is not an ElevenLabs voice`);
  return { name: id, ...profile };
}

export function narrationText(step: Step): string {
  return (step.narration ?? "").trim() || step.caption.trim();
}

// The key never leaves this function except into the request header.
export function loadApiKey(envFiles: string[], keychain: () => string | null = readKeychain): string {
  const fromKeychain = keychain();
  if (fromKeychain) return fromKeychain;
  for (const file of envFiles) {
    if (!existsSync(file)) continue;
    const line = readFileSync(file, "utf8")
      .split("\n")
      .find((l) => l.startsWith("ELEVENLABS_API_KEY="));
    const value = line?.slice("ELEVENLABS_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
    if (value) return value;
  }
  throw new Error(
    `No ElevenLabs key: add it to the Keychain (security add-generic-password -s ${KEYCHAIN_SERVICE} -a $USER -w) or set ELEVENLABS_API_KEY in this repo's .env.`,
  );
}

function readKeychain(): string | null {
  try {
    return execFileSync("security", ["find-generic-password", "-s", KEYCHAIN_SERVICE, "-w"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim() || null;
  } catch {
    return null;
  }
}

export function elevenLabs(apiKey: string): Synthesize {
  return async (text, profile) => {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${profile.voice_id}?output_format=${profile.output_format}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: profile.model_id, voice_settings: profile.voice_settings }),
    });
    if (!response.ok) {
      throw new Error(`ElevenLabs answered ${response.status}: ${(await response.text()).slice(0, 200)}`);
    }
    return new Uint8Array(await response.arrayBuffer());
  };
}

export const ffprobeMs: ProbeMs = (path) => {
  const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], {
    encoding: "utf8",
  });
  const seconds = Number(out.trim());
  if (!Number.isFinite(seconds) || seconds <= 0) throw new Error(`Could not measure ${path}`);
  return Math.round(seconds * 1000);
};

// One clip per step, cached in <run>/narration by text and voice, so a re-render costs nothing.
export async function narrate(
  run: string,
  steps: Step[],
  profile: VoiceProfile,
  synthesize: Synthesize,
  probe: ProbeMs = ffprobeMs,
): Promise<NarrationClip[]> {
  const clips: NarrationClip[] = [];
  for (const [i, step] of steps.entries()) {
    const text = narrationText(step);
    const key = createHash("sha256")
      .update(JSON.stringify([profile.voice_id, profile.model_id, profile.voice_settings, text]))
      .digest("hex")
      .slice(0, 12);
    const file = `narration/${String(i + 1).padStart(2, "0")}-${key}.mp3`;
    const path = join(run, file);
    if (!existsSync(path)) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, await synthesize(text, profile));
    }
    clips.push({ step: i, file, ms: probe(path), text });
  }
  return clips;
}

// The least time each step stays on screen: its caption's reading time, or its clip and a pause.
export function stepMinMs(steps: Step[], clips: NarrationClip[] = []): number[] {
  return steps.map((step, i) => {
    const clip = clips.find((c) => c.step === i);
    return Math.max(readingMs(step.caption), clip ? clip.ms + NARRATION_PAD_MS : 0);
  });
}
