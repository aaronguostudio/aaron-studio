export type SpokenTranscriptIssueKind =
  | "generic-hype"
  | "repeated-phrase"
  | "question-density"
  | "formal-language"
  | "length-expansion";

export interface SpokenTranscriptIssue {
  kind: SpokenTranscriptIssueKind;
  phrase?: string;
  count?: number;
  ratio?: number;
  message: string;
}

export interface TranscriptPhraseRule {
  phrase: string;
  pattern: RegExp;
  kind: "generic-hype" | "stock-transition" | "formal-language";
}

export interface SpokenTranscriptQualityOptions {
  sourceText?: string;
  maxExpansionRatio?: number;
}

export const SPOKEN_TRANSCRIPT_PHRASES: TranscriptPhraseRule[] = [
  { phrase: "crazy, right", pattern: /\bcrazy,\s*right\??/gi, kind: "generic-hype" },
  { phrase: "game changer", pattern: /\bgame[- ]changer\b/gi, kind: "generic-hype" },
  { phrase: "supercharged", pattern: /\bsupercharged\b/gi, kind: "generic-hype" },
  { phrase: "power-up", pattern: /\bpower[- ]up\b/gi, kind: "generic-hype" },
  { phrase: "trusty sidekick", pattern: /\btrusty sidekick\b/gi, kind: "generic-hype" },
  { phrase: "sounds like a dream", pattern: /\bsounds like a dream\b/gi, kind: "generic-hype" },
  { phrase: "makes you think", pattern: /\bmakes you think\??/gi, kind: "generic-hype" },
  { phrase: "here's the kicker", pattern: /\bhere['’]?s the kicker\b/gi, kind: "generic-hype" },
  { phrase: "here's the thing", pattern: /\bhere['’]?s the thing\b/gi, kind: "stock-transition" },
  { phrase: "here is the thing", pattern: /\bhere is the thing\b/gi, kind: "stock-transition" },
  { phrase: "let me tell you", pattern: /\blet me tell you\b/gi, kind: "stock-transition" },
  { phrase: "picture this", pattern: /\bpicture this\b/gi, kind: "stock-transition" },
  { phrase: "you know what's interesting", pattern: /\byou know what['’]?s interesting\b/gi, kind: "stock-transition" },
  { phrase: "consequently", pattern: /\bconsequently\b/gi, kind: "formal-language" },
  { phrase: "furthermore", pattern: /\bfurthermore\b/gi, kind: "formal-language" },
  { phrase: "moreover", pattern: /\bmoreover\b/gi, kind: "formal-language" },
  { phrase: "conversely", pattern: /\bconversely\b/gi, kind: "formal-language" },
  { phrase: "when it comes to", pattern: /\bwhen it comes to\b/gi, kind: "formal-language" },
  { phrase: "critical point", pattern: /\bcritical point\b/gi, kind: "formal-language" },
  { phrase: "crucial point", pattern: /\bcrucial point\b/gi, kind: "formal-language" },
  { phrase: "appreciate the term", pattern: /\bappreciate the term\b/gi, kind: "formal-language" },
  { phrase: "robust", pattern: /\brobust\b/gi, kind: "formal-language" },
  { phrase: "enhance", pattern: /\benhanc(?:e|es|ed|ing)\b/gi, kind: "formal-language" },
];

function countMatches(text: string, pattern: RegExp): number {
  const matches = text.match(new RegExp(pattern.source, pattern.flags));
  return matches?.length || 0;
}

export function genericYoutubeFillerPhrases(): string[] {
  return SPOKEN_TRANSCRIPT_PHRASES.filter((rule) => rule.kind !== "formal-language").map(
    (rule) => rule.phrase
  );
}

export function formalTranscriptPhrases(): string[] {
  return SPOKEN_TRANSCRIPT_PHRASES.filter((rule) => rule.kind === "formal-language").map(
    (rule) => rule.phrase
  );
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function findSpokenTranscriptIssues(
  text: string,
  options: SpokenTranscriptQualityOptions = {}
): SpokenTranscriptIssue[] {
  const issues: SpokenTranscriptIssue[] = [];

  for (const rule of SPOKEN_TRANSCRIPT_PHRASES) {
    const count = countMatches(text, rule.pattern);
    if (rule.kind === "generic-hype" && count > 0) {
      issues.push({
        kind: "generic-hype",
        phrase: rule.phrase,
        count,
        message: `Avoid generic YouTube filler: "${rule.phrase}"`,
      });
    }
    if (rule.kind === "stock-transition" && count > 1) {
      issues.push({
        kind: "repeated-phrase",
        phrase: rule.phrase,
        count,
        message: `Stock transition repeats ${count} times: "${rule.phrase}"`,
      });
    }
    if (rule.kind === "formal-language" && count > 0) {
      issues.push({
        kind: "formal-language",
        phrase: rule.phrase,
        count,
        message: `Avoid formalized transcript language: "${rule.phrase}"`,
      });
    }
  }

  const questionCount = countMatches(text, /\?/g);
  const outputWordCount = wordCount(text) || 1;
  if (questionCount >= 3 && questionCount / outputWordCount > 0.04) {
    issues.push({
      kind: "question-density",
      count: questionCount,
      message: `Rhetorical question density is too high: ${questionCount} questions in ${outputWordCount} words`,
    });
  }

  if (options.sourceText) {
    const sourceWordCount = wordCount(options.sourceText);
    const maxExpansionRatio = options.maxExpansionRatio ?? 1.15;
    if (sourceWordCount > 0) {
      const ratio = outputWordCount / sourceWordCount;
      if (ratio > maxExpansionRatio) {
        issues.push({
          kind: "length-expansion",
          ratio,
          message: `Rewrite expanded too much: ${outputWordCount} words vs ${sourceWordCount} source words (${ratio.toFixed(2)}x)`,
        });
      }
    }
  }

  return issues;
}

export function formatSpokenTranscriptIssues(issues: SpokenTranscriptIssue[]): string {
  return issues.map((issue) => `- ${issue.message}`).join("\n");
}
