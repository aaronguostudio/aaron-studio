#!/usr/bin/env bun

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "fs";
import { createHash } from "crypto";
import { basename, dirname, join, resolve } from "path";

const CATEGORIES = new Set([
  "ai-native-systems",
  "product-execution",
  "business-strategy",
  "personal-operating-system",
  "creation-media",
]);

const SERIOUS_ARTIFACTS = [
  "memory-reflection.md",
  "editorial-brief.md",
  "research-dossier.md",
  "claim-ledger.md",
  "argument-memo.md",
  "canon-alignment.md",
  "red-team-review.md",
  "prose-polish-review.md",
  "editorial-scorecard.md",
  "canon-note.md",
];

const VISUAL_ARTIFACTS = [
  "imgs/visual-strategy.md",
  "imgs/style-directions.md",
  "imgs/mode-mix.md",
  "imgs/style.md",
  "imgs/outline.md",
  "imgs/generation-manifest.md",
  "imgs/visual-critique.md",
  "imgs/visual-postmortem.md",
];

const DISTRIBUTION_ARTIFACTS = [
  "distribution-plan.md",
  "x-post.md",
  "x-standalone-tweet.md",
  "linkedin-brief.md",
  "facebook-post.md",
  "newsletter-teaser.md",
];

export interface PackageQualityOptions {
  blogDir: string;
  slug?: string;
  serious?: boolean;
  requireImages?: boolean;
  requireDistribution?: boolean;
}

export interface PackageQualityReport {
  passed: boolean;
  blogDir: string;
  slug: string | null;
  errors: string[];
  warnings: string[];
  stats: {
    englishWords: number;
    englishSections: number;
    externalLinks: number;
    localImages: number;
  };
}

interface Frontmatter {
  [key: string]: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

function readUInt24LE(buffer: Buffer, offset: number): number {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

export function readImageDimensions(path: string): ImageDimensions | null {
  const buffer = readFileSync(path);

  if (buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (
    buffer.length >= 30 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    const chunk = buffer.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return {
        width: readUInt24LE(buffer, 24) + 1,
        height: readUInt24LE(buffer, 27) + 1,
      };
    }
    if (chunk === "VP8L" && buffer[20] === 0x2f) {
      return {
        width: 1 + buffer[21] + ((buffer[22] & 0x3f) << 8),
        height: 1 + (buffer[22] >> 6) + (buffer[23] << 2) + ((buffer[24] & 0x0f) << 10),
      };
    }
    if (
      chunk === "VP8 " &&
      buffer[23] === 0x9d &&
      buffer[24] === 0x01 &&
      buffer[25] === 0x2a
    ) {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }
  }

  return null;
}

function parseFrontmatter(markdown: string): Frontmatter {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return {};

  const result: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    result[key] = value;
  }
  return result;
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");
}

function wordCount(markdown: string): number {
  return stripFrontmatter(markdown)
    .replace(/!?(?:\[[^\]]*\])\([^)]*\)/g, " ")
    .replace(/[^A-Za-z0-9'-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function markdownLinks(markdown: string): string[] {
  return Array.from(markdown.matchAll(/(?<!!)\[[^\]]*\]\(([^)]+)\)/g)).map(
    (match) => match[1].trim().split(/\s+["']/)[0]
  );
}

function markdownImages(markdown: string): string[] {
  return Array.from(markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)).map(
    (match) => match[1].trim().split(/\s+["']/)[0]
  );
}

function isExternal(target: string): boolean {
  return /^(?:https?:\/\/|mailto:|tel:)/i.test(target);
}

function hasPlaceholder(markdown: string): boolean {
  return /\b(?:TBD|TODO)\b|\[\.\.\.\]|<insert\b/i.test(markdown);
}

function detectSlug(blogDir: string): string | null {
  const excluded = new Set([
    "idea.md",
    "memory-reflection.md",
    "editorial-brief.md",
    "research-dossier.md",
    "claim-ledger.md",
    "content-plan.md",
    "argument-memo.md",
    "canon-alignment.md",
    "plan.md",
    "red-team-review.md",
    "prose-polish-review.md",
    "editorial-scorecard.md",
    "postmortem.md",
    "canon-note.md",
    "x-post.md",
    "x-standalone-tweet.md",
    "newsletter-teaser.md",
    "linkedin-brief.md",
    "facebook-post.md",
    "distribution-plan.md",
    "video-brief.md",
    "youtube-script.md",
    "youtube-script-audit.md",
    "youtube-metadata.md",
  ]);

  const candidates = readdirSync(blogDir)
    .filter((name) => name.endsWith(".md") && !name.endsWith("-zh.md") && !excluded.has(name))
    .filter((name) => Object.keys(parseFrontmatter(readFileSync(join(blogDir, name), "utf-8"))).length > 0);

  if (candidates.length !== 1) return null;
  return basename(candidates[0], ".md");
}

function checkFrontmatter(
  label: string,
  frontmatter: Frontmatter,
  expectedSlug: string,
  errors: string[]
): void {
  for (const field of ["title", "date", "slug", "category", "tags"]) {
    if (!frontmatter[field]) errors.push(`${label}: missing frontmatter field '${field}'.`);
  }
  if (frontmatter.slug && frontmatter.slug !== expectedSlug) {
    errors.push(`${label}: frontmatter slug '${frontmatter.slug}' does not match '${expectedSlug}'.`);
  }
  if (frontmatter.category && !CATEGORIES.has(frontmatter.category)) {
    errors.push(`${label}: category '${frontmatter.category}' is outside the canonical taxonomy.`);
  }
}

function checkLocalImages(
  blogDir: string,
  label: string,
  images: string[],
  errors: string[]
): void {
  for (const target of images) {
    if (isExternal(target) || target.startsWith("data:")) continue;
    const clean = target.split(/[?#]/)[0];
    const imagePath = clean.startsWith("/") ? null : resolve(blogDir, clean);
    if (!imagePath || !existsSync(imagePath)) {
      errors.push(`${label}: missing local image '${target}'.`);
    }
  }
}

function checkManualGate(
  blogDir: string,
  relativePath: string,
  gateName: string,
  errors: string[]
): void {
  const path = join(blogDir, relativePath);
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf-8");
  if (!/Decision:\s*PASS\b/i.test(text)) {
    errors.push(`${gateName}: '${relativePath}' does not record 'Decision: PASS'.`);
  }
}

function checkDistributionPackage(blogDir: string, errors: string[]): void {
  for (const artifact of DISTRIBUTION_ARTIFACTS) {
    if (!existsSync(join(blogDir, artifact))) {
      errors.push(`Missing distribution artifact: ${artifact}`);
    }
  }

  const read = (name: string): string => {
    const path = join(blogDir, name);
    return existsSync(path) ? readFileSync(path, "utf-8") : "";
  };

  const plan = read("distribution-plan.md");
  for (const platform of ["X", "LinkedIn", "Facebook"]) {
    if (plan && !plan.includes(platform)) {
      errors.push(`Distribution plan does not define a ${platform} route.`);
    }
  }

  const channelFiles: Array<[string, string]> = [
    ["x", "x-post.md"],
    ["linkedin", "linkedin-brief.md"],
    ["facebook", "facebook-post.md"],
    ["newsletter", "newsletter-teaser.md"],
  ];
  for (const [channel, file] of channelFiles) {
    const text = read(file);
    if (text && text.includes("[blog URL]")) {
      errors.push(`${file} still contains a [blog URL] placeholder.`);
    }
    if (text && !text.includes(`utm_source=${channel}`)) {
      errors.push(`${file} does not contain a ${channel} UTM link.`);
    }
  }

  const xPost = read("x-post.md");
  const main = xPost.match(/## Main Post\s*\n+([\s\S]*?)\n+## Reply With Link/m)?.[1]?.trim();
  if (xPost && !main) {
    errors.push("x-post.md must include a Main Post and Reply With Link section.");
  } else if (main) {
    if ([...main].length > 280) {
      errors.push(`x-post.md main post is ${[...main].length} characters; maximum is 280.`);
    }
    if (/https?:\/\//i.test(main)) {
      errors.push("x-post.md main post includes a URL; place the initial launch link in the reply.");
    }
  }
}

export function assessBlogPackage(options: PackageQualityOptions): PackageQualityReport {
  const blogDir = resolve(options.blogDir);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!existsSync(blogDir)) {
    return {
      passed: false,
      blogDir,
      slug: options.slug ?? null,
      errors: [`Blog directory does not exist: ${blogDir}`],
      warnings,
      stats: { englishWords: 0, englishSections: 0, externalLinks: 0, localImages: 0 },
    };
  }

  const slug = options.slug ?? detectSlug(blogDir);
  if (!slug) {
    errors.push("Could not detect one English article. Pass --slug explicitly.");
    return {
      passed: false,
      blogDir,
      slug: null,
      errors,
      warnings,
      stats: { englishWords: 0, englishSections: 0, externalLinks: 0, localImages: 0 },
    };
  }

  const englishPath = join(blogDir, `${slug}.md`);
  const chinesePath = join(blogDir, `${slug}-zh.md`);
  if (!existsSync(englishPath)) errors.push(`Missing English article: ${basename(englishPath)}`);
  if (!existsSync(chinesePath)) errors.push(`Missing Chinese article: ${basename(chinesePath)}`);

  const english = existsSync(englishPath) ? readFileSync(englishPath, "utf-8") : "";
  const chinese = existsSync(chinesePath) ? readFileSync(chinesePath, "utf-8") : "";
  const englishFrontmatter = parseFrontmatter(english);
  const chineseFrontmatter = parseFrontmatter(chinese);

  checkFrontmatter("English", englishFrontmatter, slug, errors);
  checkFrontmatter("Chinese", chineseFrontmatter, slug, errors);

  for (const field of ["date", "slug", "category", "tags"]) {
    if (englishFrontmatter[field] && chineseFrontmatter[field] && englishFrontmatter[field] !== chineseFrontmatter[field]) {
      errors.push(`Bilingual frontmatter mismatch for '${field}'.`);
    }
  }

  for (const [label, markdown] of [["English", english], ["Chinese", chinese]] as const) {
    if (hasPlaceholder(markdown)) errors.push(`${label}: unresolved placeholder detected.`);
    const links = markdownLinks(markdown);
    for (const target of links) {
      if (/^(?:\.\.?\/).*\.md(?:[#?].*)?$/i.test(target)) {
        errors.push(`${label}: source-relative article link '${target}' must become a public route before publishing.`);
      }
    }
    checkLocalImages(blogDir, label, markdownImages(markdown), errors);
  }

  const englishWords = wordCount(english);
  const englishSections = (stripFrontmatter(english).match(/^##\s+/gm) ?? []).length;
  const externalLinks = markdownLinks(english).filter(isExternal).length;
  const localImages = markdownImages(english).filter((target) => !isExternal(target)).length;

  if (englishWords < 1400 || englishWords > 2800) {
    warnings.push(`English article is ${englishWords} words; serious operator essays normally target 1,400-2,800.`);
  }
  if (englishSections < 4 || englishSections > 8) {
    warnings.push(`English article has ${englishSections} H2 sections; check whether the structure is underdeveloped or fragmented.`);
  }
  if (options.serious && externalLinks < 3) {
    warnings.push(`English article has only ${externalLinks} external sources; confirm the claim ledger justifies this.`);
  }

  if (options.serious) {
    for (const artifact of SERIOUS_ARTIFACTS) {
      if (!existsSync(join(blogDir, artifact))) errors.push(`Missing serious-essay artifact: ${artifact}`);
    }
    checkManualGate(blogDir, "claim-ledger.md", "Evidence gate", errors);
    checkManualGate(blogDir, "editorial-scorecard.md", "Editorial gate", errors);

    const scorecardPath = join(blogDir, "editorial-scorecard.md");
    if (existsSync(scorecardPath)) {
      const scorecard = readFileSync(scorecardPath, "utf-8");
      const score = Number(scorecard.match(/Final score:\s*(\d+)\s*\/\s*100/i)?.[1] ?? 0);
      if (score < 85) errors.push(`Editorial gate: final score is ${score}/100; minimum is 85.`);
    }
  }

  if (options.requireImages) {
    for (const artifact of VISUAL_ARTIFACTS) {
      if (!existsSync(join(blogDir, artifact))) errors.push(`Missing visual artifact: ${artifact}`);
    }
    checkManualGate(blogDir, "imgs/visual-critique.md", "Visual gate", errors);
    if (localImages < 4) {
      warnings.push(`English article references ${localImages} local images; confirm this is enough visual support for its length.`);
    }
    for (const target of markdownImages(english).filter((value) => !isExternal(value))) {
      if (!target.startsWith("imgs/web/")) {
        errors.push(`English: final image '${target}' must use imgs/web/*.webp.`);
      }
    }

    const hashes = new Map<string, string>();
    for (const target of markdownImages(english).filter((value) => !isExternal(value))) {
      const clean = target.split(/[?#]/)[0];
      if (clean.startsWith("/")) continue;
      const path = resolve(blogDir, clean);
      if (!existsSync(path)) continue;

      const dimensions = readImageDimensions(path);
      if (!dimensions) {
        errors.push(`Could not read image dimensions for '${target}'.`);
      } else {
        if (dimensions.width < 1200) {
          errors.push(`Image '${target}' is ${dimensions.width}px wide; final blog images must be at least 1200px.`);
        }
        const ratio = dimensions.width / dimensions.height;
        if (Math.abs(ratio - 16 / 9) > 0.03) {
          errors.push(`Image '${target}' has aspect ratio ${ratio.toFixed(3)}; expected approximately 16:9.`);
        }
      }

      const hash = createHash("sha256").update(readFileSync(path)).digest("hex");
      const previous = hashes.get(hash);
      if (previous) errors.push(`Images '${previous}' and '${target}' are byte-identical duplicates.`);
      else hashes.set(hash, target);
    }
  }

  if (options.requireDistribution) {
    checkDistributionPackage(blogDir, errors);
  }

  const articleMtime = existsSync(englishPath) ? statSync(englishPath).mtimeMs : 0;
  for (const companion of ["youtube-script.md", "video.mp4"]) {
    const path = join(blogDir, companion);
    if (existsSync(path) && statSync(path).mtimeMs < articleMtime) {
      warnings.push(`${companion} is older than the English article and may need regeneration.`);
    }
  }

  return {
    passed: errors.length === 0,
    blogDir,
    slug,
    errors,
    warnings,
    stats: { englishWords, englishSections, externalLinks, localImages },
  };
}

function parseArgs(argv: string[]): PackageQualityOptions & { json?: boolean } {
  const value = (name: string): string | undefined => {
    const index = argv.indexOf(name);
    return index >= 0 ? argv[index + 1] : undefined;
  };
  const blogDir = value("--dir");
  if (!blogDir) {
    throw new Error("Usage: bun blog-package-quality.ts --dir <blog-dir> [--slug <slug>] [--serious] [--require-images] [--require-distribution] [--json]");
  }
  return {
    blogDir,
    slug: value("--slug"),
    serious: argv.includes("--serious"),
    requireImages: argv.includes("--require-images"),
    requireDistribution: argv.includes("--require-distribution"),
    json: argv.includes("--json"),
  };
}

function formatReport(report: PackageQualityReport): string {
  const lines = [
    `Blog package quality: ${report.passed ? "PASS" : "FAIL"}`,
    `Directory: ${report.blogDir}`,
    `Slug: ${report.slug ?? "unknown"}`,
    `Stats: ${report.stats.englishWords} words, ${report.stats.englishSections} sections, ${report.stats.externalLinks} external links, ${report.stats.localImages} local images`,
  ];
  if (report.errors.length) lines.push("Errors:", ...report.errors.map((item) => `- ${item}`));
  if (report.warnings.length) lines.push("Warnings:", ...report.warnings.map((item) => `- ${item}`));
  return lines.join("\n");
}

if (import.meta.main) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const report = assessBlogPackage(args);
    console.log(args.json ? JSON.stringify(report, null, 2) : formatReport(report));
    if (!report.passed) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
