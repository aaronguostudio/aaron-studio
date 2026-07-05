#!/usr/bin/env bun
/**
 * Voice clone workflow automation for Aaron's narration voice.
 *
 * This script prepares the recording kit now, then supports the post-recording
 * audit and ElevenLabs sample generation later.
 */

import { execFileSync } from "child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs";
import { basename, dirname, extname, join } from "path";

export interface RecordingSection {
  id: string;
  title: string;
  target_minutes: number;
  purpose: string;
  guidance: string[];
  takes: RecordingTake[];
}

export interface RecordingTake {
  id: string;
  title: string;
  mode: "read" | "freestyle" | "terms";
  text: string;
}

export interface RecordingManifest {
  schema_version: 1;
  voice_name: string;
  clone_type: "professional_voice_clone";
  target_minutes: number;
  language: "en";
  persona: string;
  recording_rules: string[];
  sections: RecordingSection[];
  elevenlabs_notes: {
    preferred_path: string;
    fallback_path: string;
    sources: string[];
  };
}

export interface RecordingKit {
  manifest: RecordingManifest;
  readme: string;
  recordingScript: string;
  evalPlan: EvaluationPlan;
  scorecard: string;
}

export interface EvaluationSample {
  id: string;
  label: string;
  text: string;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  speed: number;
}

export interface EvaluationSetting extends VoiceSettings {
  id: string;
  notes: string;
}

export interface EvaluationRubricItem {
  name: string;
  max_score: number;
  passing_note: string;
}

export interface EvaluationPlan {
  schema_version: 1;
  voice_id: string;
  model_id: string;
  output_format: string;
  samples: EvaluationSample[];
  settings_matrix: EvaluationSetting[];
  rubric: EvaluationRubricItem[];
}

export interface AudioInventoryItem {
  path: string;
  durationSec: number;
  sampleRate?: number;
  channels?: number;
  codec?: string;
}

export interface RecordingAudit {
  status: "pass" | "needs-work";
  totalMinutes: number;
  acceptedFiles: AudioInventoryItem[];
  issues: string[];
}

export interface SampleJob {
  sampleId: string;
  settingId: string;
  outputPath: string;
  request: {
    text: string;
    model_id: string;
    voice_settings: VoiceSettings;
  };
}

interface RecordingKitOptions {
  voiceName?: string;
  targetMinutes?: number;
}

interface EvaluationPlanOptions {
  voiceId?: string;
  modelId?: string;
}

interface AuditOptions {
  targetMinutes?: number;
}

const DEFAULT_VOICE_NAME = "Aaron English Narrator v1";
const DEFAULT_TARGET_MINUTES = 50;
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";
const MIN_USEFUL_TAKE_SECONDS = 30;
const ACCEPTED_EXTENSIONS = new Set([".wav", ".mp3", ".m4a", ".flac"]);

const SECTION_BLUEPRINTS = [
  {
    id: "technical-explainer",
    title: "AI/software/product explanatory English",
    weight: 0.5,
    purpose:
      "Capture the voice Aaron actually needs for YouTube essays: concrete technical explanation, calm transitions, and clear product language.",
    guidance: [
      "Speak as if explaining a real architecture tradeoff to a smart friend.",
      "Keep the Chinese-English identity in the voice, but make the English easy to listen to.",
      "Slow down on nouns, numbers, product names, and contrasts.",
    ],
    takes: [
      {
        id: "tech-01",
        title: "From tool to operating loop",
        mode: "read",
        text:
          "AI coding changes the software loop in a very practical way. The old process separated requirements, design, implementation, testing, documentation, and release evidence into different queues. That separation made sense when each step was slow. But when an AI agent can draft a design, generate tests, implement the change, and summarize the risk in the same session, the bottleneck moves. The important question is no longer which role owns this step. The important question is who owns the outcome end to end, and what evidence makes the work safe to ship.",
      },
      {
        id: "tech-02",
        title: "Review becomes the scarce resource",
        mode: "read",
        text:
          "The surprising part is that AI does not remove review. It makes review more important. A model can produce hundreds of lines of code in a minute, but a human still needs time to understand the behavior, the integration boundary, and the failure mode. So the team has to design a new rhythm. Let the agent move fast inside a small module. Let the owner keep the context. Then use shared tests, clear pull requests, and production signals to align the rest of the team.",
      },
      {
        id: "tech-03",
        title: "Testing as evidence",
        mode: "read",
        text:
          "In this workflow, tests are not paperwork. They are the evidence trail. A good test says: this is the behavior I intended, this is the edge case I considered, and this is the contract I do not want to break next week. When AI writes code quickly, test quality becomes one of the strongest signals of human judgment. The test is where the owner explains the shape of the problem to the rest of the team.",
      },
      {
        id: "tech-04",
        title: "A small module owner",
        mode: "freestyle",
        text:
          "Explain, in your own words, why one person owning a module does not mean working alone. Talk about boundaries, shared standards, release evidence, and when to ask another engineer for review.",
      },
      {
        id: "tech-05",
        title: "When speed creates coordination debt",
        mode: "read",
        text:
          "Speed creates a hidden kind of coordination debt. If one developer and an AI agent can change a feature three times before lunch, everyone else can lose the thread. The fix is not to slow the developer down by default. The fix is to make the unit of alignment smaller and more explicit. What changed? Why did it change? What test proves it? What dashboard will tell us if we were wrong? Those questions let a fast loop stay connected to the team.",
      },
      {
        id: "tech-06",
        title: "Product intuition",
        mode: "freestyle",
        text:
          "Describe a feature request that looks simple at first, then explain how you would use AI to turn it into a design, a test plan, and a first implementation. Keep it concrete and practical.",
      },
    ],
  },
  {
    id: "conversational-reflection",
    title: "Conversational reflection",
    weight: 0.2,
    purpose:
      "Capture a warmer, more personal version of Aaron's voice, with hesitation, pauses, and reflective phrasing.",
    guidance: [
      "Talk like you are thinking with the audience, not presenting a finished memo.",
      "Leave natural pauses after a contrast or a surprising sentence.",
      "It is fine to restart a sentence. Keep the best take later.",
    ],
    takes: [
      {
        id: "reflection-01",
        title: "The feeling of a faster loop",
        mode: "read",
        text:
          "The first time this really hit me, it was not because the AI wrote perfect code. It was because the loop felt different. I could explain the problem, ask for a plan, push back on the plan, and then see an implementation almost immediately. That changes your relationship with the work. You start thinking less like a ticket executor, and more like someone steering a living system.",
      },
      {
        id: "reflection-02",
        title: "What still belongs to the human",
        mode: "read",
        text:
          "I do not think the human role becomes smaller. I think it becomes more compressed. Taste, judgment, sequencing, and responsibility all move closer together. The AI can help with the mechanical parts, but it does not know why this tradeoff matters for this team at this moment. That context is still human work.",
      },
      {
        id: "reflection-03",
        title: "Healthy discomfort",
        mode: "freestyle",
        text:
          "Talk about one part of AI coding that still makes you uncomfortable. Do not make it dramatic. Explain the concern, then explain what kind of process would make it safer.",
      },
      {
        id: "reflection-04",
        title: "Builder identity",
        mode: "freestyle",
        text:
          "Explain what AI-native builder means to you. Keep the tone grounded. Avoid slogans. Talk about curiosity, responsibility, and how you want to work.",
      },
    ],
  },
  {
    id: "hooks-transitions-endings",
    title: "Hooks, transitions, and endings",
    weight: 0.2,
    purpose:
      "Capture short high-importance lines where pacing, pause, and emphasis matter more than raw pronunciation.",
    guidance: [
      "Do not overact the hook. Make it feel like a thought worth leaning into.",
      "Pause before the final sentence of each ending.",
      "Vary the first word across takes so the model learns different openings.",
    ],
    takes: [
      {
        id: "hook-01",
        title: "Quiet contradiction",
        mode: "read",
        text:
          "AI coding is not just making developers faster. It is quietly changing what a software team is.",
      },
      {
        id: "hook-02",
        title: "Bottleneck shift",
        mode: "read",
        text:
          "The bottleneck used to be writing the code. Now the bottleneck is understanding whether the code should exist.",
      },
      {
        id: "transition-01",
        title: "From example to pattern",
        mode: "read",
        text:
          "That example is small, but the pattern is not. Once the loop becomes this fast, the whole workflow has to be redesigned around ownership.",
      },
      {
        id: "ending-01",
        title: "Human standard",
        mode: "read",
        text:
          "The future team may have fewer handoffs, but it needs better standards. The goal is not to remove collaboration. The goal is to make collaboration strong enough for the speed of one focused builder with AI.",
      },
      {
        id: "ending-02",
        title: "Open loop",
        mode: "freestyle",
        text:
          "End a short video in your own words. Invite the audience to rethink team design without sounding like you are selling a framework.",
      },
    ],
  },
  {
    id: "technical-terms",
    title: "Technical terms and proper nouns",
    weight: 0.1,
    purpose:
      "Teach the voice how Aaron says common English technical phrases without making pronunciation overcorrected or uncomfortable.",
    guidance: [
      "Read the list slowly first, then read it once in normal sentences.",
      "Do not perform a perfect American accent. Clear and comfortable is better.",
      "Keep a little of your natural sound so the voice still feels like you.",
    ],
    takes: [
      {
        id: "terms-01",
        title: "Core software terms",
        mode: "terms",
        text:
          "API, pull request, code review, regression test, production deploy, staging environment, product requirement, user acceptance testing, quality assurance, observability, incident review, rollback plan, feature flag, architecture boundary, integration test, prompt, context window, evaluation, benchmark, feedback loop.",
      },
      {
        id: "terms-02",
        title: "Terms in sentences",
        mode: "read",
        text:
          "Before I merge a pull request, I want the regression test to describe the behavior clearly. If the feature flag is enabled in production, observability should tell us whether the new path is healthy. If the benchmark looks worse, the owner should pause, review the context, and decide whether the implementation is still worth shipping.",
      },
      {
        id: "terms-03",
        title: "Names and common platforms",
        mode: "terms",
        text:
          "OpenAI, Anthropic, Google, Microsoft, GitHub, Vercel, ElevenLabs, LinkedIn, YouTube, TypeScript, Python, React, Nuxt, Remotion, Turso, SQLite, PostgreSQL.",
      },
    ],
  },
] as const;

export function buildRecordingKit(options: RecordingKitOptions = {}): RecordingKit {
  const voiceName = options.voiceName || DEFAULT_VOICE_NAME;
  const targetMinutes = options.targetMinutes || DEFAULT_TARGET_MINUTES;
  const sections = buildSections(targetMinutes);
  const evalPlan = buildEvaluationPlan({ voiceId: "TODO_ELEVENLABS_VOICE_ID" });
  const manifest: RecordingManifest = {
    schema_version: 1,
    voice_name: voiceName,
    clone_type: "professional_voice_clone",
    target_minutes: targetMinutes,
    language: "en",
    persona:
      "A warm, clear, reflective male tech narrator. Recognizably Aaron, but polished for English YouTube narration.",
    recording_rules: [
      "Record with the same microphone, room, distance, and gain for every take.",
      "Leave natural pauses between ideas; silence can be trimmed later.",
      "Do not perform a perfect American accent; aim for clear, relaxed English with Aaron's natural identity.",
      "Restart a sentence if needed, but do not chase a flawless performance.",
      "Keep background noise, keyboard sound, chair movement, and mouth clicks as low as possible.",
    ],
    sections,
    elevenlabs_notes: {
      preferred_path:
        "Use Professional Voice Clone for the final Aaron narration voice. Use Instant Voice Clone only for quick experiments.",
      fallback_path:
        "If Professional Voice Clone is not ready, use the existing Henry voice ID until the clone passes the scorecard.",
      sources: [
        "https://elevenlabs.io/docs/eleven-creative/voices/voice-cloning",
        "https://elevenlabs.io/docs/eleven-api/concepts/voice-cloning",
        "https://elevenlabs.io/docs/api-reference/text-to-speech/convert",
      ],
    },
  };

  return {
    manifest,
    readme: renderReadme(manifest),
    recordingScript: renderRecordingScript(manifest),
    evalPlan,
    scorecard: renderScorecard(evalPlan),
  };
}

export function buildEvaluationPlan(
  options: EvaluationPlanOptions = {}
): EvaluationPlan {
  return {
    schema_version: 1,
    voice_id: options.voiceId || "TODO_ELEVENLABS_VOICE_ID",
    model_id: options.modelId || DEFAULT_MODEL_ID,
    output_format: "mp3_44100_128",
    samples: [
      {
        id: "cold-open",
        label: "Cold open",
        text:
          "AI coding is not just making developers faster. It is quietly changing what a software team is.",
      },
      {
        id: "technical-explainer",
        label: "Technical explainer",
        text:
          "The old workflow separated requirements, design, implementation, testing, and deployment into different queues. AI compresses that loop. The owner still needs judgment, but the handoff cost changes dramatically.",
      },
      {
        id: "reflective",
        label: "Reflective passage",
        text:
          "The strange thing is that the work feels both faster and more personal. You are not waiting for the next handoff. You are deciding what matters, checking the evidence, and steering the system.",
      },
      {
        id: "terms",
        label: "Technical terms",
        text:
          "Pull request, regression test, feature flag, production deploy, observability, feedback loop, benchmark, user acceptance testing, and code review.",
      },
      {
        id: "pause-control",
        label: "Pause and emphasis",
        text:
          "The bottleneck used to be writing the code. Now the bottleneck is understanding whether the code should exist.",
      },
      {
        id: "ending",
        label: "Ending",
        text:
          "The goal is not to remove collaboration. The goal is to make collaboration strong enough for the speed of one focused builder with AI.",
      },
    ],
    settings_matrix: [
      {
        id: "natural-baseline",
        stability: 0.55,
        similarity_boost: 0.82,
        style: 0,
        use_speaker_boost: false,
        speed: 0.98,
        notes:
          "First candidate. Biases toward natural pacing and fewer overperformed artifacts.",
      },
      {
        id: "identity-check",
        stability: 0.52,
        similarity_boost: 0.9,
        style: 0,
        use_speaker_boost: true,
        speed: 0.98,
        notes:
          "Checks whether stronger similarity and speaker boost help identity without hurting comfort.",
      },
      {
        id: "calmer-pauses",
        stability: 0.62,
        similarity_boost: 0.8,
        style: 0,
        use_speaker_boost: false,
        speed: 0.95,
        notes:
          "Slower, calmer option for reflective essays and longer sections.",
      },
      {
        id: "light-expression",
        stability: 0.45,
        similarity_boost: 0.82,
        style: 0.15,
        use_speaker_boost: false,
        speed: 1,
        notes:
          "Tests slightly more expressive delivery without turning into synthetic hype.",
      },
    ],
    rubric: [
      {
        name: "Identity",
        max_score: 5,
        passing_note: "Sounds recognizably like Aaron without preserving uncomfortable pronunciation artifacts.",
      },
      {
        name: "Naturalness",
        max_score: 5,
        passing_note: "Feels like a person explaining an idea, not a synthetic read-through.",
      },
      {
        name: "Clarity",
        max_score: 5,
        passing_note: "Technical terms are easy to understand on laptop and phone speakers.",
      },
      {
        name: "Pacing",
        max_score: 5,
        passing_note: "Has useful pauses and does not rush dense passages.",
      },
      {
        name: "Listener fatigue",
        max_score: 5,
        passing_note: "Can be heard for five minutes without strain, harshness, or repetitive cadence.",
      },
    ],
  };
}

export function writeRecordingKit(outputDir: string, kit: RecordingKit): void {
  mkdirSync(outputDir, { recursive: true });
  mkdirSync(join(outputDir, "recordings"), { recursive: true });
  mkdirSync(join(outputDir, "samples"), { recursive: true });

  writeFileSync(join(outputDir, "README.md"), kit.readme, "utf-8");
  writeFileSync(join(outputDir, "recording-script.md"), kit.recordingScript, "utf-8");
  writeFileSync(
    join(outputDir, "manifest.json"),
    JSON.stringify(kit.manifest, null, 2) + "\n",
    "utf-8"
  );
  writeFileSync(
    join(outputDir, "eval-plan.json"),
    JSON.stringify(kit.evalPlan, null, 2) + "\n",
    "utf-8"
  );
  writeFileSync(join(outputDir, "scorecard.md"), kit.scorecard, "utf-8");
  writeFileSync(join(outputDir, "recordings", ".gitignore"), "*\n!.gitignore\n", "utf-8");
  writeFileSync(join(outputDir, "samples", ".gitignore"), "*\n!.gitignore\n", "utf-8");
}

export function evaluateRecordingInventory(
  files: AudioInventoryItem[],
  options: AuditOptions = {}
): RecordingAudit {
  const targetMinutes = options.targetMinutes || 45;
  const acceptedFiles = files.filter((file) =>
    ACCEPTED_EXTENSIONS.has(extname(file.path).toLowerCase())
  );
  const totalMinutes = roundMinutes(
    acceptedFiles.reduce((sum, file) => sum + Math.max(0, file.durationSec || 0), 0) / 60
  );
  const issues: string[] = [];

  if (acceptedFiles.length === 0) {
    issues.push("No accepted audio files found. Use wav, mp3, m4a, or flac.");
  }
  if (totalMinutes < targetMinutes) {
    issues.push(
      `Only ${totalMinutes} usable minutes recorded; target is ${targetMinutes} minutes for the first clone.`
    );
  }

  for (const file of acceptedFiles) {
    const name = basename(file.path);
    if (file.durationSec < MIN_USEFUL_TAKE_SECONDS) {
      issues.push(`${name} is shorter than ${MIN_USEFUL_TAKE_SECONDS} seconds; merge it into a longer take or re-record it.`);
    }
    if (file.channels && file.channels > 1) {
      issues.push(`${name} is stereo; mono is easier to keep consistent for cloning.`);
    }
    if (file.sampleRate && file.sampleRate < 44_100) {
      issues.push(`${name} has sample rate ${file.sampleRate}; record at 44100 Hz or 48000 Hz when possible.`);
    }
  }

  const sampleRates = new Set(acceptedFiles.map((file) => file.sampleRate).filter(Boolean));
  if (sampleRates.size > 1) {
    issues.push("Audio files use mixed sample rates. Re-export them consistently before upload.");
  }

  return {
    status: issues.length === 0 ? "pass" : "needs-work",
    totalMinutes,
    acceptedFiles,
    issues,
  };
}

export function buildSampleJobs(
  plan: EvaluationPlan,
  outputDir: string
): SampleJob[] {
  const jobs: SampleJob[] = [];
  for (const sample of plan.samples) {
    for (const setting of plan.settings_matrix) {
      jobs.push({
        sampleId: sample.id,
        settingId: setting.id,
        outputPath: `${outputDir}/${sample.id}__${setting.id}.mp3`,
        request: {
          text: sample.text,
          model_id: plan.model_id,
          voice_settings: {
            stability: setting.stability,
            similarity_boost: setting.similarity_boost,
            style: setting.style,
            use_speaker_boost: setting.use_speaker_boost,
            speed: setting.speed,
          },
        },
      });
    }
  }
  return jobs;
}

export function renderAuditMarkdown(audit: RecordingAudit): string {
  const lines = [
    "# Voice Clone Recording Audit",
    "",
    `Status: ${audit.status}`,
    `Usable duration: ${audit.totalMinutes} minutes`,
    `Accepted files: ${audit.acceptedFiles.length}`,
    "",
    "## Issues",
    "",
  ];

  if (audit.issues.length === 0) {
    lines.push("- None");
  } else {
    for (const issue of audit.issues) lines.push(`- ${issue}`);
  }

  lines.push("", "## Files", "");
  for (const file of audit.acceptedFiles) {
    lines.push(
      `- ${file.path}: ${roundMinutes(file.durationSec / 60)} min, ${file.sampleRate || "unknown"} Hz, ${file.channels || "unknown"} channel(s), ${file.codec || "unknown"}`
    );
  }

  return lines.join("\n") + "\n";
}

async function generateSamples(planPath: string, outputDir: string): Promise<void> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is required to generate evaluation samples.");
  }

  const plan = JSON.parse(readFileSync(planPath, "utf-8")) as EvaluationPlan;
  if (!plan.voice_id || plan.voice_id.startsWith("TODO_")) {
    throw new Error("Set voice_id in eval-plan.json before generating samples.");
  }

  mkdirSync(outputDir, { recursive: true });
  const jobs = buildSampleJobs(plan, outputDir);
  const manifest: Array<Record<string, unknown>> = [];

  for (const job of jobs) {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${plan.voice_id}/with-timestamps?output_format=${encodeURIComponent(plan.output_format)}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job.request),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `ElevenLabs sample failed for ${job.sampleId}/${job.settingId} (${response.status}): ${error}`
      );
    }

    const data = (await response.json()) as { audio_base64: string };
    writeFileSync(job.outputPath, Buffer.from(data.audio_base64, "base64"));
    manifest.push({
      sample_id: job.sampleId,
      setting_id: job.settingId,
      output_path: job.outputPath,
      request: job.request,
    });
  }

  writeFileSync(
    join(outputDir, "sample-manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf-8"
  );
}

function buildSections(targetMinutes: number): RecordingSection[] {
  const weights = SECTION_BLUEPRINTS.map((section) => section.weight);
  const minutes = distributeMinutes(targetMinutes, weights);
  return SECTION_BLUEPRINTS.map((section, index) => ({
    id: section.id,
    title: section.title,
    target_minutes: minutes[index],
    purpose: section.purpose,
    guidance: [...section.guidance],
    takes: section.takes.map((take) => ({ ...take })),
  }));
}

function distributeMinutes(total: number, weights: readonly number[]): number[] {
  const raw = weights.map((weight) => total * weight);
  const minutes = raw.map(Math.floor);
  let remainder = total - minutes.reduce((sum, minute) => sum + minute, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let i = 0; remainder > 0; i++, remainder--) {
    minutes[order[i % order.length].index] += 1;
  }
  return minutes;
}

function renderReadme(manifest: RecordingManifest): string {
  return [
    "# Aaron Voice Clone Recording Kit",
    "",
    `Voice: ${manifest.voice_name}`,
    `Target: ${manifest.target_minutes} minutes of clean, consistent English narration`,
    "",
    "## Folder Layout",
    "",
    "- `recording-script.md`: what to read or freestyle from.",
    "- `recordings/`: put raw exported audio here when you are ready. This folder is gitignored.",
    "- `eval-plan.json`: ElevenLabs A/B sample matrix for the cloned voice.",
    "- `samples/`: generated ElevenLabs test samples. This folder is gitignored.",
    "- `scorecard.md`: manual listening rubric.",
    "",
    "## Recording Standard",
    "",
    ...manifest.recording_rules.map((rule) => `- ${rule}`),
    "",
    "## Later Commands",
    "",
    "Create or refresh this kit:",
    "",
    "```bash",
    "npx -y bun tiles/aaron-video-gen/scripts/voice-clone-workflow.ts kit \\",
    "  --output src/content/voice-clones/aaron-english-narrator-v1",
    "```",
    "",
    "Audit recordings after you export audio:",
    "",
    "```bash",
    "npx -y bun tiles/aaron-video-gen/scripts/voice-clone-workflow.ts audit \\",
    "  --audio-dir src/content/voice-clones/aaron-english-narrator-v1/recordings \\",
    "  --output src/content/voice-clones/aaron-english-narrator-v1/recording-audit.md",
    "```",
    "",
    "Generate A/B samples after ElevenLabs gives you a voice ID:",
    "",
    "```bash",
    "ELEVENLABS_API_KEY=... npx -y bun tiles/aaron-video-gen/scripts/voice-clone-workflow.ts samples \\",
    "  --plan src/content/voice-clones/aaron-english-narrator-v1/eval-plan.json \\",
    "  --output src/content/voice-clones/aaron-english-narrator-v1/samples",
    "```",
    "",
    "## ElevenLabs Notes",
    "",
    `- Preferred path: ${manifest.elevenlabs_notes.preferred_path}`,
    `- Fallback path: ${manifest.elevenlabs_notes.fallback_path}`,
    "",
    "Sources:",
    ...manifest.elevenlabs_notes.sources.map((source) => `- ${source}`),
    "",
  ].join("\n");
}

function renderRecordingScript(manifest: RecordingManifest): string {
  const lines = [
    "# Recording Script",
    "",
    "Read this as Aaron, not as an announcer. The goal is a polished version of your normal English narration.",
    "",
    "Do not perform a perfect American accent. Keep the sound recognizable, but make the words clear and comfortable.",
    "Leave natural pauses. Silence is useful training signal and can be trimmed later.",
    "",
  ];

  for (const section of manifest.sections) {
    lines.push(
      `## ${section.title}`,
      "",
      `Target: ${section.target_minutes} minutes`,
      "",
      section.purpose,
      "",
      "Guidance:",
      ...section.guidance.map((item) => `- ${item}`),
      "",
      "How to fill the target time:",
      "- Read each read take slowly once, then repeat the strongest takes with slightly different emphasis.",
      "- For each freestyle take, speak from the prompt for 2 to 4 minutes. Do not only read the prompt text.",
      "- If a sentence feels awkward, pause, restart that sentence, and keep recording.",
      ""
    );

    for (const take of section.takes) {
      lines.push(
        `### ${take.id}: ${take.title}`,
        "",
        `Mode: ${take.mode}`,
        "",
        take.text,
        ""
      );
    }
  }

  return lines.join("\n");
}

function renderScorecard(plan: EvaluationPlan): string {
  const lines = [
    "# Voice Clone Scorecard",
    "",
    "Score each generated sample from 1 to 5. A voice is ready for production only when the best setting is consistently 4+ across the rubric.",
    "",
    "| Sample | Setting | Identity | Naturalness | Clarity | Pacing | Listener fatigue | Notes |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |",
  ];

  for (const sample of plan.samples) {
    for (const setting of plan.settings_matrix) {
      lines.push(
        `| ${sample.id} | ${setting.id} |  |  |  |  |  |  |`
      );
    }
  }

  lines.push("", "## Rubric", "");
  for (const item of plan.rubric) {
    lines.push(`- ${item.name} (${item.max_score}): ${item.passing_note}`);
  }

  return lines.join("\n") + "\n";
}

function scanAudioDirectory(audioDir: string): AudioInventoryItem[] {
  const files = listAudioFiles(audioDir);
  return files.map((file) => probeAudioFile(file));
}

function listAudioFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...listAudioFiles(fullPath));
    } else if (ACCEPTED_EXTENSIONS.has(extname(fullPath).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

function probeAudioFile(filePath: string): AudioInventoryItem {
  const output = execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "a:0",
      "-show_entries",
      "stream=codec_name,sample_rate,channels:format=duration",
      "-of",
      "json",
      filePath,
    ],
    { encoding: "utf-8" }
  );
  const data = JSON.parse(output) as {
    streams?: Array<{ codec_name?: string; sample_rate?: string; channels?: number }>;
    format?: { duration?: string };
  };
  const stream = data.streams?.[0] || {};
  return {
    path: filePath,
    durationSec: Number(data.format?.duration || 0),
    sampleRate: stream.sample_rate ? Number(stream.sample_rate) : undefined,
    channels: stream.channels,
    codec: stream.codec_name,
  };
}

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--output") args.output = argv[++i];
    else if (arg === "--voice-name") args.voiceName = argv[++i];
    else if (arg === "--target-minutes") args.targetMinutes = argv[++i];
    else if (arg === "--audio-dir") args.audioDir = argv[++i];
    else if (arg === "--plan") args.plan = argv[++i];
    else if (arg === "--voice-id") args.voiceId = argv[++i];
    else if (arg === "--model-id") args.modelId = argv[++i];
    else if (arg === "--help" || arg === "-h") args.help = true;
  }
  return args;
}

function usage(): string {
  return [
    "Usage:",
    "  voice-clone-workflow.ts kit --output <dir> [--voice-name <name>] [--target-minutes 50]",
    "  voice-clone-workflow.ts audit --audio-dir <dir> --output <markdown> [--target-minutes 45]",
    "  voice-clone-workflow.ts samples --plan <eval-plan.json> --output <dir>",
    "",
    "After creating the voice in ElevenLabs, set voice_id in eval-plan.json before running samples.",
  ].join("\n");
}

function roundMinutes(value: number): number {
  return Math.round(value * 100) / 100;
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  if (!command || args.help) {
    console.log(usage());
    return;
  }

  if (command === "kit") {
    const outputDir = String(args.output || "");
    if (!outputDir) throw new Error("--output is required for kit");
    const kit = buildRecordingKit({
      voiceName: args.voiceName ? String(args.voiceName) : undefined,
      targetMinutes: args.targetMinutes ? Number(args.targetMinutes) : undefined,
    });
    writeRecordingKit(outputDir, kit);
    console.log(`Wrote voice clone recording kit to ${outputDir}`);
    return;
  }

  if (command === "audit") {
    const audioDir = String(args.audioDir || "");
    const outputPath = String(args.output || "");
    if (!audioDir) throw new Error("--audio-dir is required for audit");
    if (!outputPath) throw new Error("--output is required for audit");
    const audit = evaluateRecordingInventory(scanAudioDirectory(audioDir), {
      targetMinutes: args.targetMinutes ? Number(args.targetMinutes) : undefined,
    });
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, renderAuditMarkdown(audit), "utf-8");
    console.log(`Wrote recording audit to ${outputPath}`);
    if (audit.status !== "pass") process.exitCode = 1;
    return;
  }

  if (command === "samples") {
    const planPath = String(args.plan || "");
    const outputDir = String(args.output || "");
    if (!planPath) throw new Error("--plan is required for samples");
    if (!outputDir) throw new Error("--output is required for samples");
    await generateSamples(planPath, outputDir);
    console.log(`Wrote ElevenLabs evaluation samples to ${outputDir}`);
    return;
  }

  throw new Error(`Unknown command: ${command}\n${usage()}`);
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
