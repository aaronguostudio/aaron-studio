---
name: blog-notes
description: Turn Aaron's rough spoken thoughts, voice-note transcripts, fragments, or early claims into concise, illustrated bilingual Builder Notes for aaronguo.com. Use when Aaron says to put an idea in blog Notes, asks for a Note rather than a full essay, wants a nuanced short-form claim shaped and saved under content/notes/{zh,en}, or asks to draft, illustrate, or publish a Builder Note.
---

# Blog Notes

Turn one live idea into a compact Chinese Note and a natural English adaptation. Preserve Aaron's uncertainty and point of view; sharpen the mechanism without inflating the claim.

## Resolve the destination

Read `config/aaron-studio.json` from Aaron Studio and use its `blogRepo` value. Do not hard-code a user path. In the blog repository, read these before drafting:

- `content/notes/README.md`
- the most recent paired files in `content/notes/zh/` and `content/notes/en/`
- `content.config.ts` when the frontmatter contract may have changed

Use `blog-write` or `blog-production` instead when the idea needs a full argument, extensive research, or a long content package. A Builder Note should hold one claim that is still taking shape.

## Shape the thought

Extract four things from the raw input:

1. Tension: what changed or feels newly important?
2. Claim: what does Aaron currently believe?
3. Mechanism: why might it be true?
4. Implication: what should a person or organization notice or practice?

When Aaron asks for an opinion, give a direct assessment before or alongside the draft. Identify the strongest part of the claim and the qualification that makes it more credible.

Do not turn a tentative thought into certainty. Avoid ranking people, declaring broad job extinction, or treating traits as fixed. Prefer shifts in leverage, work design, and learnable capabilities. For AI-and-work topics, distinguish idea generation from the complete loop of framing, experimenting, judging, learning, and improving a system.

## Draft the pair

Write the Chinese version first when the source is Chinese. Adapt the English version for natural rhythm rather than translating sentence by sentence.

Use this body shape without visible section headings:

- observation or tension
- mechanism
- implication or open question

Default to three short paragraphs with one move per paragraph. Keep the body roughly 120-300 Chinese characters or 70-150 English words. A Note should feel like a thought card, not a compressed essay: leave some interpretive space instead of explaining every qualification. Use a concrete declarative title and a hook that creates tension without clickbait.

Keep paired frontmatter aligned:

```yaml
---
title: '<localized title>'
description: '<localized page and social description>'
date: YYYY-MM-DD
summary: '<localized archive summary>'
hook: '<localized opening tension>'
topics: ['<localized topics>']
published: false
featured: false
number: <next shared positive integer>
translationKey: '<shared-slug>'
---
```

Use the same date, number, slug, publication state, and meaning in both languages. Set `published: false` unless Aaron explicitly asks to publish. Omit `image`, `socialImage`, and `alt` unless approved assets already exist or Aaron asks for imagery.

## Illustrate by default

Treat a finished or published Note as an illustrated artifact unless Aaron explicitly asks for text only. Before generating, read [references/visual-contract.md](references/visual-contract.md) completely and follow its Notes-specific adaptation of `blog-illustrate` and `imagegen`.

Do not publish a Note whose image fields are missing, point to missing files, or have not passed visual inspection. Keep draft Notes text-only until the thought is approved; generate the visual as part of the finish/publish pass.

## Write safely

If Aaron asks to put, save, add, or capture the thought in Blog Notes, write both files:

- `content/notes/zh/<slug>.md`
- `content/notes/en/<slug>.md`

If Aaron only asks what the idea means or whether it is good, return the proposed Note without writing.

Do not deploy or change a production alias. Publishing production must come from a committed `main` revision through the Git-triggered deployment path.

## Validate

From the blog repository, run:

```bash
pnpm exec prettier --check content/notes/zh/<slug>.md content/notes/en/<slug>.md
pnpm exec vitest run tests/notes.test.ts
```

Then verify:

- one central claim, with a visible mechanism and implication
- three compact moves rather than a complete essay argument
- no superiority framing or unsupported inevitability
- Chinese and English are natural in their own language
- paired frontmatter fields agree
- `published` remains false unless publication was explicit
- no image fields point to missing files
- a finished or published Note has an approved clean cover and social derivative

Report the two paths, draft status, validation result, and the main editorial qualification used.
