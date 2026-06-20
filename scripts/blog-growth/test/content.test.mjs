import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBlogMarkdown, shouldIncludeBlogMarkdown } from '../lib/content.mjs';

test('parseBlogMarkdown extracts frontmatter and canonical blog paths', () => {
  const parsed = parseBlogMarkdown({
    filePath: 'src/content/blogs/2026-06-15/fable-5-managing-ai-autonomy.md',
    text: `---
title: "Fable 5 Changed the Unit of AI Work"
date: 2026-06-15
slug: fable-5-managing-ai-autonomy
tags: [ai, agents]
youtube: https://youtu.be/example
---

Body text here.
`,
  });

  assert.equal(parsed.slug, 'fable-5-managing-ai-autonomy');
  assert.equal(parsed.title, 'Fable 5 Changed the Unit of AI Work');
  assert.equal(parsed.language, 'en');
  assert.equal(parsed.canonicalPath, '/blogs/fable-5-managing-ai-autonomy');
  assert.equal(parsed.wordCount, 3);
});

test('parseBlogMarkdown removes numeric filename prefixes and maps zh paths', () => {
  const parsed = parseBlogMarkdown({
    filePath: '/blog/content/blogs/zh/25.fable-5-managing-ai-autonomy.md',
    text: `---
title: 'Fable 5 改变了 AI 工作的最小单位'
date: 15th Jun 2026
published: true
---

正文。
`,
  });

  assert.equal(parsed.slug, 'fable-5-managing-ai-autonomy');
  assert.equal(parsed.language, 'zh');
  assert.equal(parsed.canonicalPath, '/zh/blogs/fable-5-managing-ai-autonomy');
});

test('parseBlogMarkdown normalizes common publication date formats', () => {
  const ordinal = parseBlogMarkdown({
    filePath: 'src/content/blogs/2026-06-15/fable.md',
    text: `---
title: Fable
date: 15th Jun 2026
---

Body.
`,
  });

  const long = parseBlogMarkdown({
    filePath: 'src/content/blogs/2026-06-16/example.md',
    text: `---
title: Example
date: June 16, 2026
---

Body.
`,
  });

  assert.equal(ordinal.date, '2026-06-15');
  assert.equal(ordinal.rawDate, '15th Jun 2026');
  assert.equal(long.date, '2026-06-16');
  assert.equal(long.rawDate, 'June 16, 2026');
});

test('parseBlogMarkdown keeps invalid raw date and returns null normalized date', () => {
  const parsed = parseBlogMarkdown({
    filePath: 'src/content/blogs/example.md',
    text: `---
title: Example
date: next someday
---

Body.
`,
  });

  assert.equal(parsed.date, null);
  assert.equal(parsed.rawDate, 'next someday');
});

test('shouldIncludeBlogMarkdown excludes workflow and image prompt files', () => {
  assert.equal(shouldIncludeBlogMarkdown('/repo/src/content/blogs/2026-06-15/fable.md'), true);
  assert.equal(shouldIncludeBlogMarkdown('/repo/src/content/blogs/2026-06-15/fable-zh.md'), true);
  assert.equal(shouldIncludeBlogMarkdown('/repo/src/content/blogs/2026-06-15/imgs/outline.md'), false);
  assert.equal(shouldIncludeBlogMarkdown('/repo/src/content/blogs/2026-06-15/imgs/prompts/00-cover.md'), false);
  assert.equal(shouldIncludeBlogMarkdown('/repo/src/content/blogs/2026-06-15/youtube-script.md'), false);
  assert.equal(shouldIncludeBlogMarkdown('/repo/src/content/blogs/2026-06-15/newsletter-teaser.md'), false);
  assert.equal(shouldIncludeBlogMarkdown('/repo/src/content/blogs/2026-02-12/linkedin-post.md'), false);
  assert.equal(shouldIncludeBlogMarkdown('/repo/src/content/blogs/2026-02-12/x-teaser.md'), false);
});
