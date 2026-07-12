import { describe, expect, test } from "bun:test";
import {
  buildElevenLabsRequestPayload,
  getElevenLabsCharacterLimit,
  resolveElevenLabsConfig,
  splitTextIntoChunks,
} from "./tts";

describe("ElevenLabs request configuration", () => {
  test("uses the identity-first B settings as the safe request fallback", () => {
    expect(resolveElevenLabsConfig({})).toEqual({
      modelId: "eleven_multilingual_v2",
      outputFormat: "mp3_44100_192",
      voiceSettings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true,
        speed: 1,
      },
    });
  });

  test("builds an auditable payload with continuity and an optional seed", () => {
    const config = resolveElevenLabsConfig({
      speed: 1.03,
      elevenLabs: {
        modelId: "eleven_v3",
        outputFormat: "mp3_44100_192",
        stability: 0.5,
        similarityBoost: 0.8,
        style: 0,
        useSpeakerBoost: true,
        seed: 42,
      },
    });

    expect(
      buildElevenLabsRequestPayload("Current section.", config, {
        previousText: "Previous section.",
        nextText: "Next section.",
      })
    ).toEqual({
      text: "Current section.",
      model_id: "eleven_v3",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0,
        use_speaker_boost: true,
        speed: 1.03,
      },
      seed: 42,
      previous_text: "Previous section.",
      next_text: "Next section.",
    });
  });

  test("rejects settings that the ElevenLabs API cannot safely use", () => {
    expect(() =>
      resolveElevenLabsConfig({ speed: 1.3 })
    ).toThrow("ElevenLabs speed must be between 0.7 and 1.2");
    expect(() =>
      resolveElevenLabsConfig({
        elevenLabs: { outputFormat: "wav_44100" },
      })
    ).toThrow("requires an MP3 ElevenLabs output format");
  });
});

describe("ElevenLabs long-form chunking", () => {
  test("uses model-specific character limits", () => {
    expect(getElevenLabsCharacterLimit("eleven_v3")).toBe(5_000);
    expect(getElevenLabsCharacterLimit("eleven_multilingual_v2")).toBe(10_000);
    expect(getElevenLabsCharacterLimit("eleven_flash_v2_5")).toBe(40_000);
    expect(getElevenLabsCharacterLimit("unknown-model")).toBe(5_000);
  });

  test("preserves a final fragment without punctuation", () => {
    const chunks = splitTextIntoChunks(
      "The first sentence ends. The final fragment does not",
      30
    );

    expect(chunks).toEqual([
      "The first sentence ends.",
      "The final fragment does not",
    ]);
  });

  test("never emits a chunk above the model limit", () => {
    const chunks = splitTextIntoChunks("a".repeat(25), 10);

    expect(chunks.map((chunk) => chunk.length)).toEqual([10, 10, 5]);
  });
});
