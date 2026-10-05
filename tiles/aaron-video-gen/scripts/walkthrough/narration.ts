// AI narration for WalkthroughVideo (phase 2), in Aaron's ElevenLabs professional voice clone
// (config/voice-profiles.json). Each clip's length becomes the least time its step (or card) stays
// on screen, so voice and picture line up without editing; the video says "AI narration" on screen.
//
// Two styles:
// - concise (default): each step's `narration`, else its caption, one clip per step;
// - conversational: a script written for the run (loadScript), with an opening line over the title
//   card, lines for the steps it chooses (a step without one stays silent) and a closing line.
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
// Walkthroughs speak a little faster than the profile's long-form pace (Aaron, 2026-10-05: the
// cloned voice is slow for a demo). ElevenLabs takes speeds from 0.7 to 1.2.
export const WALKTHROUGH_SPEED = 1.15;
const SPEED_MIN = 0.7;
const SPEED_MAX = 1.2;
const PROFILES = resolve(import.meta.dir, "..", "..", "config", "voice-profiles.json");

export type VoiceProfile = {
  voice_id: string;
  model_id: string;
  output_format: string;
  voice_settings: Record<string, number | boolean>;
};

// Where a clip plays: a step's index, or over the title or end card.
export type ClipAt = number | "intro" | "outro";
export type NarrationClip = { at: ClipAt; file: string; ms: number; text: string };

// A conversational script: lines keyed by step id. Run material, so it lives in the run folder.
export type NarrationScript = { intro?: string; steps: Record<string, string>; outro?: string };

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

// The profile with another speaking speed; the profile itself is left as it is.
export function withSpeed<P extends VoiceProfile>(profile: P, speed: number): P {
  if (!(speed >= SPEED_MIN && speed <= SPEED_MAX)) {
    throw new Error(`Speaking speed must be between ${SPEED_MIN} and ${SPEED_MAX} (got ${speed})`);
  }
  return { ...profile, voice_settings: { ...profile.voice_settings, speed } };
}

export function narrationText(step: Step): string {
  return (step.narration ?? "").trim() || step.caption.trim();
}

export function loadScript(path: string, steps: Step[]): NarrationScript {
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const text = (value: unknown, name: string): string | undefined => {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") throw new Error(`${path}: ${name} must be text`);
    return value.trim() || undefined;
  };
  if (!raw || typeof raw.steps !== "object" || raw.steps === null || Array.isArray(raw.steps)) {
    throw new Error(`${path}: steps must map step ids to lines`);
  }
  const ids = new Set(steps.map((s) => s.id));
  const unknown = Object.keys(raw.steps).filter((id) => !ids.has(id));
  if (unknown.length) {
    throw new Error(`${path}: the capture has no step ${unknown.map((id) => `"${id}"`).join(", ")}`);
  }
  const lines: Record<string, string> = {};
  for (const [id, value] of Object.entries(raw.steps)) {
    const line = text(value, `steps.${id}`);
    if (line) lines[id] = line;
  }
  const script: NarrationScript = { steps: lines };
  const intro = text(raw.intro, "intro");
  const outro = text(raw.outro, "outro");
  if (intro) script.intro = intro;
  if (outro) script.outro = outro;
  return script;
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

// The clips, cached in <run>/narration by text and voice, so a re-render costs nothing. Without a
// script, one per step; with one, its lines only.
export async function narrate(
  run: string,
  steps: Step[],
  profile: VoiceProfile,
  synthesize: Synthesize,
  probe: ProbeMs = ffprobeMs,
  script?: NarrationScript,
): Promise<NarrationClip[]> {
  const stepName = (i: number) => String(i + 1).padStart(2, "0");
  const lines: Array<{ at: ClipAt; name: string; text: string }> = script
    ? [
        ...(script.intro ? [{ at: "intro" as const, name: "intro", text: script.intro }] : []),
        ...steps.flatMap((step, i) => {
          const line = script.steps[step.id];
          return line ? [{ at: i, name: stepName(i), text: line }] : [];
        }),
        ...(script.outro ? [{ at: "outro" as const, name: "outro", text: script.outro }] : []),
      ]
    : steps.map((step, i) => ({ at: i, name: stepName(i), text: narrationText(step) }));
  const clips: NarrationClip[] = [];
  for (const { at, name, text } of lines) {
    const key = createHash("sha256")
      .update(JSON.stringify([profile.voice_id, profile.model_id, profile.voice_settings, text]))
      .digest("hex")
      .slice(0, 12);
    const file = `narration/${name}-${key}.mp3`;
    const path = join(run, file);
    if (!existsSync(path)) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, await synthesize(text, profile));
    }
    clips.push({ at, file, ms: probe(path), text });
  }
  return clips;
}

// The least time each step stays on screen: its caption's reading time, and long enough for the
// voice. A line plays on over the silent steps after it, as a person keeps talking while clicking,
// so its time (clip and a pause) is shared across that run of steps by their reading times.
export function stepMinMs(steps: Step[], clips: NarrationClip[] = []): number[] {
  const mins = steps.map((step) => readingMs(step.caption));
  const starts = clips.filter((c): c is NarrationClip & { at: number } => typeof c.at === "number");
  for (const clip of starts) {
    let end = clip.at + 1;
    while (end < steps.length && !starts.some((c) => c.at === end)) end++;
    const group = mins.slice(clip.at, end);
    const reading = group.reduce((sum, ms) => sum + ms, 0);
    const voice = clip.ms + NARRATION_PAD_MS;
    group.forEach((ms, k) => {
      mins[clip.at + k] = Math.max(ms, Math.ceil((voice * ms) / reading));
    });
  }
  return mins;
}

// The least time the title and end cards stay up: their line and a pause (0 without one).
export function cardMinMs(clips: NarrationClip[]): { titleMs: number; endMs: number } {
  const card = (at: "intro" | "outro") => {
    const clip = clips.find((c) => c.at === at);
    return clip ? clip.ms + NARRATION_PAD_MS : 0;
  };
  return { titleMs: card("intro"), endMs: card("outro") };
}
