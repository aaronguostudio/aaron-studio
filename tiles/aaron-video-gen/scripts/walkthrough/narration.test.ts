import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { readingMs, type Step } from "../../remotion/src/projects/walkthrough-video/timeline";
import {
  NARRATION_PAD_MS,
  loadApiKey,
  loadVoiceProfile,
  narrate,
  narrationText,
  stepMinMs,
  type VoiceProfile,
} from "./narration";

const step = (caption: string, extra: Partial<Step> = {}): Step => ({
  id: caption,
  caption,
  kind: "action",
  startMs: 0,
  endMs: 1000,
  clicks: [],
  shot: null,
  ...extra,
});

const profile: VoiceProfile = {
  voice_id: "voice",
  model_id: "model",
  output_format: "mp3_44100_192",
  voice_settings: { stability: 0.5 },
};

const tmp = () => mkdtempSync(join(tmpdir(), "narration-test-"));

describe("narrationText", () => {
  test("says the caption unless the step has its own words", () => {
    expect(narrationText(step("Open the form"))).toBe("Open the form");
    expect(narrationText(step("Open the form", { narration: "  Now open the form.  " }))).toBe("Now open the form.");
    expect(narrationText(step("Open the form", { narration: "  " }))).toBe("Open the form");
  });
});

describe("loadApiKey", () => {
  test("prefers the Keychain", () => {
    const dir = tmp();
    writeFileSync(join(dir, ".env"), "ELEVENLABS_API_KEY=from-env\n");
    expect(loadApiKey([join(dir, ".env")], () => "from-keychain")).toBe("from-keychain");
  });

  test("falls back to the first .env that has the key, quotes removed", () => {
    const dir = tmp();
    writeFileSync(join(dir, "a.env"), "OTHER=1\n");
    writeFileSync(join(dir, "b.env"), 'OTHER=1\nELEVENLABS_API_KEY="from-env"\n');
    expect(loadApiKey([join(dir, "missing.env"), join(dir, "a.env"), join(dir, "b.env")], () => null)).toBe("from-env");
  });

  test("says how to add the key when there is none, without guessing one", () => {
    expect(() => loadApiKey([], () => null)).toThrow(/security add-generic-password -s elevenlabs-api-key/);
  });
});

describe("loadVoiceProfile", () => {
  test("reads the default profile, and refuses an unknown or non-ElevenLabs one", () => {
    const dir = tmp();
    const path = join(dir, "profiles.json");
    writeFileSync(
      path,
      JSON.stringify({
        default_profile: "me",
        profiles: { me: { provider: "elevenlabs", ...profile }, other: { provider: "say", voice_id: "x" } },
      }),
    );
    expect(loadVoiceProfile(undefined, path)).toMatchObject({ name: "me", voice_id: "voice" });
    expect(() => loadVoiceProfile("nope", path)).toThrow(/No voice profile "nope"/);
    expect(() => loadVoiceProfile("other", path)).toThrow(/not an ElevenLabs voice/);
  });
});

describe("narrate", () => {
  test("writes one clip per step and reuses it on the next render", async () => {
    const run = tmp();
    const said: string[] = [];
    const synthesize = async (text: string) => {
      said.push(text);
      return new TextEncoder().encode(text);
    };
    const probe = (path: string) => (path.includes("/01-") ? 1500 : 4200);
    const steps = [step("Open the form"), step("Save it", { narration: "Then save it." })];

    const first = await narrate(run, steps, profile, synthesize, probe);
    expect(said).toEqual(["Open the form", "Then save it."]);
    expect(first.map((c) => [c.step, c.ms, c.text])).toEqual([
      [0, 1500, "Open the form"],
      [1, 4200, "Then save it."],
    ]);
    expect(first[0].file).toMatch(/^narration\/01-[0-9a-f]{12}\.mp3$/);
    expect(existsSync(join(run, first[1].file))).toBe(true);

    const again = await narrate(run, steps, profile, synthesize, probe);
    expect(said).toHaveLength(2);
    expect(again).toEqual(first);
  });

  test("new words or another voice make a new clip", async () => {
    const run = tmp();
    const synthesize = async (text: string) => new TextEncoder().encode(text);
    const probe = () => 1000;
    const [a] = await narrate(run, [step("Open the form")], profile, synthesize, probe);
    const [b] = await narrate(run, [step("Open the new form")], profile, synthesize, probe);
    const [c] = await narrate(run, [step("Open the form")], { ...profile, voice_id: "other" }, synthesize, probe);
    expect(new Set([a.file, b.file, c.file]).size).toBe(3);
  });
});

describe("stepMinMs", () => {
  test("a step stays up for its reading time or its clip and a pause, whichever is longer", () => {
    const steps = [step("Open the form"), step("Save it")];
    const clips = [{ step: 1, file: "narration/02-x.mp3", ms: 5000, text: "Save it" }];
    expect(stepMinMs(steps, clips)).toEqual([readingMs("Open the form"), 5000 + NARRATION_PAD_MS]);
    expect(stepMinMs(steps)).toEqual([readingMs("Open the form"), readingMs("Save it")]);
  });
});
