import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function parseBlogMarkdown({ filePath, text }) {
  const { frontmatter, body } = splitFrontmatter(text);
  const meta = parseFrontmatter(frontmatter);
  const slug = meta.slug || slugFromFilePath(filePath);
  const language = inferLanguage(filePath);

  return {
    filePath,
    slug,
    title: meta.title || slug,
    date: meta.date || null,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    youtube: meta.youtube || null,
    language,
    canonicalPath: language === 'zh' ? `/zh/blogs/${slug}` : `/blogs/${slug}`,
    wordCount: countWords(body),
    rawMetadata: meta,
  };
}

export function scanBlogMarkdown(rootDir) {
  return walk(rootDir)
    .filter((filePath) => filePath.endsWith('.md'))
    .filter(shouldIncludeBlogMarkdown)
    .map((filePath) => parseBlogMarkdown({
      filePath,
      text: readFileSync(filePath, 'utf8'),
    }));
}

export function shouldIncludeBlogMarkdown(filePath) {
  if (!filePath.endsWith('.md')) return false;
  if (filePath.includes('/imgs/')) return false;

  const file = filePath.split('/').pop() || '';
  const excluded = new Set([
    'idea.md',
    'plan.md',
    'content-plan.md',
    'newsletter-teaser.md',
    'linkedin-post.md',
    'x-post.md',
    'x-standalone-tweet.md',
    'x-teaser.md',
    'youtube-script.md',
    'youtube-metadata.md',
    'linkedin-brief.md',
  ]);

  return !excluded.has(file);
}

function splitFrontmatter(text) {
  if (!text.startsWith('---\n')) return { frontmatter: '', body: text };
  const end = text.indexOf('\n---', 4);
  if (end === -1) return { frontmatter: '', body: text };
  return {
    frontmatter: text.slice(4, end),
    body: text.slice(end + 4),
  };
}

function parseFrontmatter(frontmatter) {
  const meta = {};

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colon = trimmed.indexOf(':');
    if (colon === -1) continue;

    const key = trimmed.slice(0, colon).trim();
    const raw = trimmed.slice(colon + 1).trim();
    meta[key] = parseFrontmatterValue(raw);
  }

  return meta;
}

function parseFrontmatterValue(raw) {
  if (raw.startsWith('[') && raw.endsWith(']')) {
    return raw
      .slice(1, -1)
      .split(',')
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }

  return stripQuotes(raw);
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function slugFromFilePath(filePath) {
  const file = filePath.split('/').pop() || '';
  return file
    .replace(/-zh\.md$/, '')
    .replace(/\.md$/, '')
    .replace(/^\d+\./, '');
}

function inferLanguage(filePath) {
  if (filePath.includes('/zh/') || filePath.endsWith('-zh.md')) return 'zh';
  return 'en';
}

function countWords(text) {
  const withoutMarkdown = text
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[`*_>#:-]/g, ' ');
  const matches = withoutMarkdown.match(/[A-Za-z0-9]+|[\u4e00-\u9fff]/g);
  return matches ? matches.length : 0;
}

function walk(dir) {
  const entries = [];

  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      entries.push(...walk(path));
    } else {
      entries.push(path);
    }
  }

  return entries;
}
