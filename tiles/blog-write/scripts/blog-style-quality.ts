import { existsSync, readFileSync } from "fs";

export type BlogStyleIssueKind =
  | "ai-slop-density"
  | "weak-hook"
  | "missing-narrative-tension"
  | "missing-story-payoff"
  | "formulaic-contrast"
  | "missing-lived-evidence"
  | "low-rhythm-variation"
  | "generic-ending"
  | "mechanical-chinese";

export type BlogStyleSeverity = "low" | "medium" | "high";

export interface BlogStyleIssue {
  kind: BlogStyleIssueKind;
  severity: BlogStyleSeverity;
  message: string;
  phrase?: string;
  count?: number;
  ratio?: number;
}

export interface BlogStyleQualityOptions {
  language?: "en" | "zh";
  requirePersonalAnchor?: boolean;
  requireStoryCraft?: boolean;
  passScore?: number;
}

export interface BlogStyleQualityReport {
  score: number;
  passed: boolean;
  issues: BlogStyleIssue[];
  stats: {
    words: number;
    sentences: number;
    aiSlopMarkers: number;
  };
}

interface PhraseRule {
  phrase: string;
  pattern: RegExp;
  severity: BlogStyleSeverity;
}

const AI_SLOP_PHRASES: PhraseRule[] = [
  { phrase: "in today's fast-paced world", pattern: /\bin today['’]?s fast[- ]paced world\b/gi, severity: "high" },
  { phrase: "ever-evolving landscape", pattern: /\bever[- ]evolving landscape\b/gi, severity: "high" },
  { phrase: "at its core", pattern: /\bat its core\b/gi, severity: "medium" },
  { phrase: "it is important to note", pattern: /\bit is important to note\b/gi, severity: "medium" },
  { phrase: "it is worth noting", pattern: /\bit is worth noting\b/gi, severity: "medium" },
  { phrase: "without further ado", pattern: /\bwithout further ado\b/gi, severity: "high" },
  { phrase: "let's dive", pattern: /\blet['’]?s dive\b/gi, severity: "medium" },
  { phrase: "delve", pattern: /\bdelv(?:e|es|ed|ing)\b/gi, severity: "medium" },
  { phrase: "tapestry", pattern: /\btapestry\b/gi, severity: "high" },
  { phrase: "landscape", pattern: /\blandscape\b/gi, severity: "medium" },
  { phrase: "robust", pattern: /\brobust\b/gi, severity: "medium" },
  { phrase: "seamless", pattern: /\bseamless(?:ly)?\b/gi, severity: "medium" },
  { phrase: "empower", pattern: /\bempower(?:s|ed|ing)?\b/gi, severity: "medium" },
  { phrase: "leverage", pattern: /\bleverag(?:e|es|ed|ing)\b/gi, severity: "medium" },
  { phrase: "unlock", pattern: /\bunlock(?:s|ed|ing)?\b/gi, severity: "medium" },
  { phrase: "holistic", pattern: /\bholistic\b/gi, severity: "medium" },
  { phrase: "paradigm", pattern: /\bparadigm\b/gi, severity: "high" },
  { phrase: "game-changing", pattern: /\bgame[- ]chang(?:er|ing)\b/gi, severity: "high" },
  { phrase: "cutting-edge", pattern: /\bcutting[- ]edge\b/gi, severity: "medium" },
  { phrase: "pivotal", pattern: /\bpivotal\b/gi, severity: "medium" },
  { phrase: "underscore", pattern: /\bunderscor(?:e|es|ed|ing)\b/gi, severity: "medium" },
];

const GENERIC_ENDING_PATTERNS: PhraseRule[] = [
  { phrase: "in conclusion", pattern: /\bin conclusion\b/gi, severity: "high" },
  { phrase: "to summarize", pattern: /\bto summar(?:ize|ise)\b/gi, severity: "high" },
  { phrase: "future looks bright", pattern: /\bfuture looks bright\b/gi, severity: "high" },
  { phrase: "exciting times lie ahead", pattern: /\bexciting times lie ahead\b/gi, severity: "high" },
  { phrase: "continue this journey", pattern: /\bcontinue (?:this|the|our) journey\b/gi, severity: "medium" },
  { phrase: "continue to transform", pattern: /\bcontinue(?:s)? to transform\b/gi, severity: "medium" },
];

const MECHANICAL_CHINESE_PATTERNS: PhraseRule[] = [
  { phrase: "首先", pattern: /首先/g, severity: "medium" },
  { phrase: "其次", pattern: /其次/g, severity: "medium" },
  { phrase: "最后", pattern: /最后/g, severity: "medium" },
  { phrase: "综上所述", pattern: /综上所述/g, severity: "high" },
  { phrase: "值得注意的是", pattern: /值得注意的是/g, severity: "medium" },
  { phrase: "具有重要意义", pattern: /具有重要意义/g, severity: "high" },
  { phrase: "一定程度上", pattern: /一定程度上/g, severity: "medium" },
  { phrase: "积极拥抱", pattern: /积极拥抱/g, severity: "medium" },
  { phrase: "不断提升", pattern: /不断提升/g, severity: "medium" },
  { phrase: "这一趋势", pattern: /这一趋势/g, severity: "medium" },
];

const WEAK_HOOK_PATTERNS: PhraseRule[] = [
  { phrase: "AI is transforming", pattern: /\bAI\s+(?:is|will be)\s+(?:transforming|changing|reshaping|revolutionizing)\b/gi, severity: "high" },
  { phrase: "In this article", pattern: /\bin this (?:article|post|essay)\b/gi, severity: "high" },
  { phrase: "we will explore", pattern: /\bwe (?:will|are going to) explore\b/gi, severity: "high" },
  { phrase: "this topic is important", pattern: /\bthis topic is important\b/gi, severity: "medium" },
  { phrase: "the future of", pattern: /^\s*the future of\b/gi, severity: "medium" },
  { phrase: "the rise of", pattern: /^\s*the rise of\b/gi, severity: "medium" },
];

const TENSION_PATTERN =
  /\b(but|however|yet|instead|constraint|bottleneck|broke|breaks?|failed|failure|harder|risk|trade[- ]off|cost|gap|problem|wrong|review queue|handoff|cannot|can't|not enough|collapse|tension|objection|friction|stuck|missed|slower)\b/i;

const PAYOFF_PATTERN =
  /\b(operating rule|rule is|lesson|means|what changes|implication|decision|from now on|has to|have to|must|should|the fix|next time|takeaway|so the|now the|this changes|that changes|who owns|what evidence|end to end|trust this enough to ship|shared boundary|single owner)\b/i;

function stripFrontmatter(text: string): string {
  return text.replace(/^---[\s\S]*?---\s*/m, "");
}

function proseParagraphs(text: string): string[] {
  return stripFrontmatter(text)
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => {
      if (!paragraph) return false;
      if (/^#{1,6}\s+/.test(paragraph)) return false;
      if (/^!\[[^\]]*]\(/.test(paragraph)) return false;
      if (/^[-*]\s+/.test(paragraph)) return false;
      return true;
    });
}

function countMatches(text: string, pattern: RegExp): number {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  return text.match(new RegExp(pattern.source, flags))?.length || 0;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function splitEnglishSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function countPhraseRules(text: string, rules: PhraseRule[]): Array<PhraseRule & { count: number }> {
  return rules
    .map((rule) => ({ ...rule, count: countMatches(text, rule.pattern) }))
    .filter((rule) => rule.count > 0);
}

function hasLivedEvidence(text: string): boolean {
  const firstPerson = /\b(I|I've|I'm|me|my|we|we've|we're|our|ours)\b/i.test(text);
  const datedOrMeasured = /\b(last|this|yesterday|today|month|week|year|quarter|in 20\d{2}|[0-9]+(?:\.[0-9]+)?%?|[0-9]+\s+(?:tickets|repos|days|hours|weeks|months|users|customers|prs|pull requests))\b/i.test(text);
  const operatorSpecific = /\b(QA|UAT|Codex|ticket|tickets|module|owner|review queue|deploy|shipping|production|customer|customers|repo|repos|PR|pull request|incident|migration|release)\b/i.test(text);
  const concreteWorkflow = /\b(process|workflow|handoff|review|test|tests|deploy|release|queue|module|integration)\b/i.test(text);

  return (firstPerson && (datedOrMeasured || operatorSpecific || concreteWorkflow)) ||
    (datedOrMeasured && operatorSpecific && concreteWorkflow);
}

function sentenceStats(text: string): { sentences: string[]; lengths: number[]; stdDev: number } {
  const sentences = splitEnglishSentences(text);
  const lengths = sentences.map(wordCount);
  return {
    sentences,
    lengths,
    stdDev: standardDeviation(lengths),
  };
}

function firstWords(text: string, maxWords: number): string {
  return text.trim().split(/\s+/).slice(0, maxWords).join(" ");
}

function storyCraftIssues(text: string): BlogStyleIssue[] {
  const issues: BlogStyleIssue[] = [];
  const paragraphs = proseParagraphs(text);
  const opening = firstWords(paragraphs[0] || text, 80);
  const ending = text.slice(-900);
  const weakHookMatches = countPhraseRules(opening, WEAK_HOOK_PATTERNS);

  if (weakHookMatches.length > 0) {
    issues.push({
      kind: "weak-hook",
      severity: "high",
      phrase: weakHookMatches[0].phrase,
      count: weakHookMatches.reduce((sum, rule) => sum + rule.count, 0),
      message: `Opening starts with a generic topic intro ("${weakHookMatches[0].phrase}"). Lead with a scene, contradiction, result, bottleneck, or decision.`,
    });
  }

  if (!TENSION_PATTERN.test(text)) {
    issues.push({
      kind: "missing-narrative-tension",
      severity: "high",
      message: "Article has no clear narrative tension. Add a constraint, bottleneck, tradeoff, failure, objection, or before/after conflict.",
    });
  }

  if (!PAYOFF_PATTERN.test(ending)) {
    issues.push({
      kind: "missing-story-payoff",
      severity: "high",
      message: "Ending does not land a story payoff. Close with an operating rule, implication, decision lens, or concrete change in behavior.",
    });
  }

  return issues;
}

export function findBlogStyleIssues(
  rawText: string,
  options: BlogStyleQualityOptions = {}
): BlogStyleIssue[] {
  const text = stripFrontmatter(rawText);
  const issues: BlogStyleIssue[] = [];
  const language = options.language ?? "en";

  const slopMatches = countPhraseRules(text, AI_SLOP_PHRASES);
  const slopCount = slopMatches.reduce((sum, rule) => sum + rule.count, 0);
  const words = Math.max(wordCount(text), 1);
  const slopPer500 = (slopCount / words) * 500;

  if (slopCount >= 8 || slopPer500 >= 6) {
    const examples = slopMatches.slice(0, 5).map((rule) => rule.phrase).join(", ");
    issues.push({
      kind: "ai-slop-density",
      severity: slopCount >= 12 || slopPer500 >= 12 ? "high" : "medium",
      count: slopCount,
      ratio: slopPer500,
      message: `AI-style vocabulary cluster detected (${slopCount} markers; ${slopPer500.toFixed(1)} per 500 words): ${examples}`,
    });
  }

  const formulaicContrastCount =
    countMatches(text, /\b(?:it|this|that)\s+(?:is|was|isn['’]?t|wasn['’]?t|does not|doesn['’]?t)\s+not\s+(?:just|only)?[^.!?]{0,120}\b(?:but|it|this|that)\b/gi) +
    countMatches(text, /\bnot\s+(?:just|only)?[^.!?]{0,120},\s*(?:it|this|that)\s+/gi);
  if (formulaicContrastCount > 0) {
    issues.push({
      kind: "formulaic-contrast",
      severity: "medium",
      count: formulaicContrastCount,
      message: `Formulaic contrast pattern detected (${formulaicContrastCount}). Recast the distinction without "not just X, it is Y" rhythm.`,
    });
  }

  if (options.requirePersonalAnchor && !hasLivedEvidence(text)) {
    issues.push({
      kind: "missing-lived-evidence",
      severity: "high",
      message: "Operator post lacks lived evidence: add a concrete project, workflow, number, date, customer, failure, or first-person observation.",
    });
  }

  if (language === "en" && options.requireStoryCraft) {
    issues.push(...storyCraftIssues(text));
  }

  if (language === "en") {
    const stats = sentenceStats(text);
    if (stats.sentences.length >= 4 && stats.stdDev < 2.4) {
      issues.push({
        kind: "low-rhythm-variation",
        severity: "low",
        ratio: stats.stdDev,
        message: `Sentence rhythm is too uniform (sentence length std dev ${stats.stdDev.toFixed(1)}). Mix short punch lines with longer explanations.`,
      });
    }
  }

  const ending = text.slice(-600);
  const genericEndingMatches = countPhraseRules(ending, GENERIC_ENDING_PATTERNS);
  if (genericEndingMatches.length > 0) {
    issues.push({
      kind: "generic-ending",
      severity: "high",
      count: genericEndingMatches.reduce((sum, rule) => sum + rule.count, 0),
      phrase: genericEndingMatches[0].phrase,
      message: `Ending uses generic summary language ("${genericEndingMatches[0].phrase}"). End by advancing the thesis or naming the practical implication.`,
    });
  }

  if (language === "zh") {
    const mechanicalMatches = countPhraseRules(text, MECHANICAL_CHINESE_PATTERNS);
    const count = mechanicalMatches.reduce((sum, rule) => sum + rule.count, 0);
    if (count >= 3) {
      issues.push({
        kind: "mechanical-chinese",
        severity: count >= 5 ? "high" : "medium",
        count,
        message: `Chinese version sounds mechanically translated or formulaic (${count} markers): ${mechanicalMatches.slice(0, 5).map((rule) => rule.phrase).join(", ")}`,
      });
    }
  }

  return issues;
}

function issuePenalty(issue: BlogStyleIssue): number {
  if (issue.severity === "high") return 22;
  if (issue.severity === "medium") return 12;
  return 6;
}

export function assessBlogStyleQuality(
  text: string,
  options: BlogStyleQualityOptions = {}
): BlogStyleQualityReport {
  const issues = findBlogStyleIssues(text, options);
  const score = Math.max(
    0,
    100 - issues.reduce((sum, issue) => sum + issuePenalty(issue), 0)
  );
  const passScore = options.passScore ?? 80;
  const hardFailKinds = new Set<BlogStyleIssueKind>([
    "ai-slop-density",
    "weak-hook",
    "missing-narrative-tension",
    "missing-story-payoff",
    "missing-lived-evidence",
    "generic-ending",
    "mechanical-chinese",
  ]);
  const hasHardFail = issues.some(
    (issue) => issue.severity === "high" && hardFailKinds.has(issue.kind)
  );
  const stats = sentenceStats(stripFrontmatter(text));
  return {
    score,
    passed: score >= passScore && !hasHardFail,
    issues,
    stats: {
      words: wordCount(stripFrontmatter(text)),
      sentences: stats.sentences.length,
      aiSlopMarkers: countPhraseRules(text, AI_SLOP_PHRASES).reduce(
        (sum, rule) => sum + rule.count,
        0
      ),
    },
  };
}

export function formatBlogStyleIssues(issues: BlogStyleIssue[]): string {
  if (issues.length === 0) return "- No blog style quality issues detected.";
  return issues
    .map((issue) => {
      const extra = issue.count != null ? ` (${issue.count})` : "";
      return `- [${issue.severity}] ${issue.kind}${extra}: ${issue.message}`;
    })
    .join("\n");
}

function parseArgs(argv: string[]): {
  filePath?: string;
  language?: "en" | "zh";
  requirePersonalAnchor: boolean;
  requireStoryCraft: boolean;
} {
  const args = {
    filePath: undefined as string | undefined,
    language: undefined as "en" | "zh" | undefined,
    requirePersonalAnchor: false,
    requireStoryCraft: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--language" || arg === "--lang") {
      const value = argv[++i];
      if (value !== "en" && value !== "zh") {
        throw new Error(`Unsupported language: ${value}`);
      }
      args.language = value;
    } else if (arg === "--zh") {
      args.language = "zh";
    } else if (arg === "--require-personal-anchor") {
      args.requirePersonalAnchor = true;
    } else if (arg === "--require-story-craft") {
      args.requireStoryCraft = true;
    } else if (!arg.startsWith("-") && !args.filePath) {
      args.filePath = arg;
    }
  }

  return args;
}

if (import.meta.main) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.filePath || !existsSync(args.filePath)) {
    console.error(
      "Usage: bun tiles/blog-write/scripts/blog-style-quality.ts <article.md> [--language en|zh] [--require-personal-anchor] [--require-story-craft]"
    );
    process.exit(2);
  }

  const text = readFileSync(args.filePath, "utf-8");
  const report = assessBlogStyleQuality(text, {
    language: args.language,
    requirePersonalAnchor: args.requirePersonalAnchor,
    requireStoryCraft: args.requireStoryCraft,
  });

  console.log(`Blog style score: ${report.score}/100`);
  console.log(`Passed: ${report.passed ? "yes" : "no"}`);
  console.log(
    `Stats: ${report.stats.words} words, ${report.stats.sentences} sentences, ${report.stats.aiSlopMarkers} slop markers`
  );
  console.log(formatBlogStyleIssues(report.issues));

  if (!report.passed) process.exit(1);
}
