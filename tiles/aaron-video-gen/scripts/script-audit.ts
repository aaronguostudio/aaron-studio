import { parseYoutubeScript } from "./parse-script";
import { parseVideoBrief } from "./video-brief";

export interface ScriptAuditInput {
  scriptMarkdown: string;
  videoBriefMarkdown: string;
  imageCount: number;
  estimatedDurationSec?: number;
  scriptPath?: string;
}

export interface ScriptAuditResult {
  passed: boolean;
  failures: string[];
  warnings: string[];
  summaryMarkdown: string;
}

const BANNED_HOOK_PATTERNS = [
  /\bin today's video\b/i,
  /\blet'?s dive in\b/i,
  /\bwelcome back\b/i,
];

const BANNED_FILLER_PATTERNS = [
  /\bright\b/gi,
  /\byou know\b/gi,
  /\bbasically\b/gi,
  /what'?s interesting is/gi,
  /the real shift is/gi,
];

function imageTargetForDuration(durationSec = 0): number {
  if (durationSec >= 300) return 20;
  if (durationSec >= 180) return 16;
  return 10;
}

export function countScriptImages(scriptMarkdown: string): number {
  const slideImages = scriptMarkdown.match(/^##\s*\[SLIDE:/gm) || [];
  const inlineImages = scriptMarkdown.match(/\[IMAGE:\s*[^\]]+\]/g) || [];
  return slideImages.length + inlineImages.length;
}

export function estimateDurationSecFromScript(scriptMarkdown: string): number {
  const parsed = parseYoutubeScript(scriptMarkdown);
  const parts = [
    parsed.hookNarration || "",
    ...parsed.slides.map((slide) => slide.narration),
  ];
  const wordCount = parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return (wordCount / 150) * 60;
}

export function auditYoutubeScript(input: ScriptAuditInput): ScriptAuditResult {
  const failures: string[] = [];
  const warnings: string[] = [];
  const brief = parseVideoBrief(input.videoBriefMarkdown);
  const parsed = parseYoutubeScript(input.scriptMarkdown);

  if (!brief.hasBrief) failures.push("video-brief.md is missing or empty");
  if (!parsed.hookNarration) failures.push("script is missing ## [HOOK]");
  if (
    parsed.hookNarration &&
    BANNED_HOOK_PATTERNS.some((pattern) => pattern.test(parsed.hookNarration!))
  ) {
    failures.push("hook uses banned meta-introduction language");
  }

  if (brief.hasBrief) {
    if (!brief.targetAudience) failures.push("video brief missing Target Audience");
    if (!brief.desiredEmotion) failures.push("video brief missing Desired Emotion");
    if (!brief.corePromise) failures.push("video brief missing Core Promise");
    if (!brief.titleExpectation) {
      failures.push("video brief missing Title/Thumbnail Expectation");
    }
    if (brief.highShockFacts.length < 2) {
      warnings.push("video brief has fewer than 2 high-shock facts");
    }
    if (!brief.hookType) failures.push("video brief missing Hook Type");
    if (!brief.storyStructure) {
      failures.push("video brief missing Story Structure");
    }
    if (brief.retentionBeats.length < 3) {
      warnings.push("video brief has fewer than 3 retention beats");
    }
    if (brief.whatVideoAdds.length === 0) {
      failures.push("video brief missing What The Video Adds");
    }
    if (brief.bannedPhrases.length === 0) {
      failures.push("video brief missing Banned Phrases");
    }
    if (!brief.ending) failures.push("video brief missing Ending");
    if (!brief.auditStatus) failures.push("video brief missing Audit Status");
  }

  for (const pattern of BANNED_FILLER_PATTERNS) {
    const matches = input.scriptMarkdown.match(pattern);
    if (matches && matches.length > 1) {
      failures.push(`repeated filler phrase: ${matches[0].toLowerCase()}`);
    }
  }

  const estimatedDurationSec =
    input.estimatedDurationSec ?? estimateDurationSecFromScript(input.scriptMarkdown);
  const minImages = imageTargetForDuration(estimatedDurationSec);
  if (input.imageCount < minImages) {
    failures.push(`image count ${input.imageCount} is below target ${minImages}`);
  }

  const passed = failures.length === 0;
  return {
    passed,
    failures,
    warnings,
    summaryMarkdown: [
      "# YouTube Script Audit",
      "",
      `Status: ${passed ? "PASS" : "FAIL"}`,
      input.scriptPath ? `Script: ${input.scriptPath}` : "",
      `Estimated duration: ${Math.round(estimatedDurationSec)}s`,
      `Image count: ${input.imageCount}`,
      "",
      "## Failures",
      failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "- none",
      "",
      "## Warnings",
      warnings.length ? warnings.map((warning) => `- ${warning}`).join("\n") : "- none",
      "",
      "## Source",
      "- YouTube scriptwriting playbook",
      "- Aaron YouTube video language",
      "",
    ].join("\n"),
  };
}
