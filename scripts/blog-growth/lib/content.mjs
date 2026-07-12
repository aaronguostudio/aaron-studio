import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function parseBlogMarkdown({ filePath, text }) {
  const { frontmatter, body } = splitFrontmatter(text);
  const meta = parseFrontmatter(frontmatter);
  const slug = meta.slug || slugFromFilePath(filePath);
  const language = inferLanguage(filePath);
  const rawDate = meta.date || null;

  return {
    filePath,
    slug,
    title: meta.title || slug,
    date: normalizeBlogDate(rawDate),
    rawDate,
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
    'facebook-post.md',
    'distribution-plan.md',
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

export function normalizeBlogDate(raw) {
  if (!raw) return null;
  const value = String(raw).trim();
  if (!value) return null;

  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return isValidDateParts(iso[1], iso[2], iso[3]) ? value : null;

  const dayMonthYear = value.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,9})\s+(\d{4})$/i);
  if (dayMonthYear) {
    return formatDateParts(dayMonthYear[3], monthNumber(dayMonthYear[2]), dayMonthYear[1]);
  }

  const monthDayYear = value.match(/^([A-Za-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?,\s*(\d{4})$/i);
  if (monthDayYear) {
    return formatDateParts(monthDayYear[3], monthNumber(monthDayYear[1]), monthDayYear[2]);
  }

  return null;
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

function formatDateParts(year, month, day) {
  if (!month) return null;
  const paddedMonth = String(month).padStart(2, '0');
  const paddedDay = String(Number(day)).padStart(2, '0');
  return isValidDateParts(year, paddedMonth, paddedDay) ? `${year}-${paddedMonth}-${paddedDay}` : null;
}

function isValidDateParts(year, month, day) {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d;
}

function monthNumber(month) {
  const key = String(month || '').slice(0, 3).toLowerCase();
  const months = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };
  return months[key] || null;
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
