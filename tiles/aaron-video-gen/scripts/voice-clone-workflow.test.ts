import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {
  buildEvaluationPlan,
  buildSampleJobs,
  buildRecordingKit,
  evaluateRecordingInventory,
  writeRecordingKit,
  type AudioInventoryItem,
} from "./voice-clone-workflow";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "voice-clone-workflow-"));
  tempDirs.push(dir);
  return dir;
}

describe("voice clone recording kit", () => {
  test("builds a recording kit for a polished Aaron English narrator voice", () => {
    const kit = buildRecordingKit({
      voiceName: "Aaron English Narrator v1",
      targetMinutes: 50,
    });

    expect(kit.manifest.voice_name).toBe("Aaron English Narrator v1");
    expect(kit.manifest.clone_type).toBe("professional_voice_clone");
    expect(kit.manifest.target_minutes).toBe(50);
    expect(kit.manifest.sections.map((section) => section.id)).toEqual([
      "technical-explainer",
      "conversational-reflection",
      "hooks-transitions-endings",
      "technical-terms",
    ]);
    expect(kit.recordingScript).toContain("AI/software/product explanatory English");
    expect(kit.recordingScript).toContain("Do not perform a perfect American accent");
    expect(kit.recordingScript).toContain("Leave natural pauses");
    expect(kit.readme).toContain("recordings/");
    expect(kit.scorecard).toContain("Identity");
  });

  test("writes the reusable recording kit files and keeps raw audio ignored", () => {
    const outputDir = makeTempDir();

    writeRecordingKit(outputDir, buildRecordingKit({ targetMinutes: 45 }));

    expect(existsSync(join(outputDir, "README.md"))).toBe(true);
    expect(existsSync(join(outputDir, "recording-script.md"))).toBe(true);
    expect(existsSync(join(outputDir, "manifest.json"))).toBe(true);
    expect(existsSync(join(outputDir, "eval-plan.json"))).toBe(true);
    expect(existsSync(join(outputDir, "scorecard.md"))).toBe(true);
    expect(readFileSync(join(outputDir, "recordings", ".gitignore"), "utf-8")).toContain("*");
    expect(readFileSync(join(outputDir, "samples", ".gitignore"), "utf-8")).toContain("*");
  });
});

describe("recording inventory audit", () => {
  test("passes a clean inventory with enough usable minutes", () => {
    const files: AudioInventoryItem[] = [
      { path: "take-01.wav", durationSec: 15 * 60, sampleRate: 48_000, channels: 1, codec: "pcm_s16le" },
      { path: "take-02.wav", durationSec: 15 * 60, sampleRate: 48_000, channels: 1, codec: "pcm_s16le" },
      { path: "take-03.wav", durationSec: 15 * 60, sampleRate: 48_000, channels: 1, codec: "pcm_s16le" },
    ];

    const audit = evaluateRecordingInventory(files, { targetMinutes: 45 });

    expect(audit.status).toBe("pass");
    expect(audit.totalMinutes).toBe(45);
    expect(audit.acceptedFiles).toHaveLength(3);
    expect(audit.issues).toHaveLength(0);
  });

  test("warns when audio is too short or likely inconsistent", () => {
    const files: AudioInventoryItem[] = [
      { path: "short.wav", durationSec: 20, sampleRate: 48_000, channels: 1, codec: "pcm_s16le" },
      { path: "phone.m4a", durationSec: 12 * 60, sampleRate: 44_100, channels: 2, codec: "aac" },
    ];

    const audit = evaluateRecordingInventory(files, { targetMinutes: 45 });

    expect(audit.status).toBe("needs-work");
    expect(audit.totalMinutes).toBeCloseTo(12.33, 1);
    expect(audit.issues.some((issue) => issue.includes("45 minutes"))).toBe(true);
    expect(audit.issues.some((issue) => issue.includes("short.wav"))).toBe(true);
    expect(audit.issues.some((issue) => issue.includes("stereo"))).toBe(true);
  });
});

describe("voice clone evaluation plan", () => {
  test("creates a repeatable ElevenLabs A/B matrix and scoring rubric", () => {
    const plan = buildEvaluationPlan({
      voiceId: "voice_123",
      modelId: "eleven_multilingual_v2",
    });

    expect(plan.voice_id).toBe("voice_123");
    expect(plan.model_id).toBe("eleven_multilingual_v2");
    expect(plan.output_format).toBe("mp3_44100_192");
    expect(plan.seed).toBe(20_260_711);
    expect(plan.samples).toHaveLength(6);
    expect(plan.samples.map((sample) => sample.id)).toContain("technical-explainer");
    expect(plan.settings_matrix).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "natural-baseline",
          stability: 0.55,
          similarity_boost: 0.82,
          style: 0,
          use_speaker_boost: false,
          speed: 0.98,
        }),
        expect.objectContaining({
          id: "identity-check",
          similarity_boost: 0.9,
          use_speaker_boost: true,
        }),
      ])
    );
    expect(plan.rubric.map((item) => item.name)).toEqual([
      "Identity",
      "Naturalness",
      "Clarity",
      "Pacing",
      "Listener fatigue",
    ]);
  });

  test("expands the plan into deterministic sample generation jobs", () => {
    const plan = buildEvaluationPlan({ voiceId: "voice_123" });

    const jobs = buildSampleJobs(plan, "samples");

    expect(jobs).toHaveLength(plan.samples.length * plan.settings_matrix.length);
    expect(jobs[0]).toMatchObject({
      sampleId: "cold-open",
      settingId: "natural-baseline",
      outputPath: "samples/cold-open__natural-baseline.mp3",
    });
    expect(jobs[0].request.voice_settings).toMatchObject({
      stability: 0.55,
      similarity_boost: 0.82,
      style: 0,
      use_speaker_boost: false,
      speed: 0.98,
    });
    expect(jobs[0].request.seed).toBe(20_260_711);
  });
});
