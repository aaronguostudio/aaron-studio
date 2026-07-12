import { describe, expect, test } from "bun:test";
import {
  loadVoiceProfileRegistry,
  resolveVoiceProfile,
} from "./voice-profile";

describe("Aaron voice profiles", () => {
  test("promotes the selected identity-first sample B as the default", () => {
    const registry = loadVoiceProfileRegistry();
    const profile = resolveVoiceProfile(undefined, registry);

    expect(registry.default_profile).toBe("aaron-pvc-identity-v1");
    expect(profile).toMatchObject({
      id: "aaron-pvc-identity-v1",
      provider: "elevenlabs",
      voice_id: "R2DWp7zZuWmGxk3r8GIA",
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_192",
      selected_sample: "B",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true,
        speed: 1,
      },
    });
  });

  test("rejects an unknown profile instead of silently changing voices", () => {
    expect(() => resolveVoiceProfile("missing-profile")).toThrow(
      'Unknown voice profile "missing-profile"'
    );
  });

  test("keeps an editorial-energy profile opt-in until a listening review approves it", () => {
    const candidate = resolveVoiceProfile("aaron-pvc-editorial-v5-candidate");

    expect(candidate).toMatchObject({
      id: "aaron-pvc-editorial-v5-candidate",
      voice_id: "R2DWp7zZuWmGxk3r8GIA",
      selected_sample: "pending V5 listening review",
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.8,
        style: 0.56,
        speed: 1.04,
      },
    });
  });
});
