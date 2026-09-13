---
name: brain-ingest
description: Capture Aaron's ideas, knowledge, reading notes, and observations into Notion Brain when he says "帮我记下来", "存进 brain", "save this", or "remember this". Retrieve or organize those captures on request. Ordinary conversation is not automatic capture; actionable tasks use notion-task-intake.
---

# brain-ingest

Notion is the primary home for new personal knowledge. Use `brainCapture` in [shared config](../../config/aaron-studio.json) for destinations; fetch the live schema before writing. Existing `src/brain/` material is legacy evidence, not a second write target.

## Intent and routing

- An explicit capture request authorizes saving its content to the configured Notion Brain. Do not ask for a second generic confirmation. A pasted file or ordinary conversation without capture intent does not authorize storing it.
- A vague idea or learning goes to the knowledge inbox, even when it mentions a project. A request to add an actionable task/backlog item goes to [notion-task-intake](../notion-task-intake/SKILL.md); capture does not authorize executing it or scheduling reminders.
- Granola meeting change cards, project-state review, and cross-project context packs use [brain-context](../brain-context/SKILL.md). That workflow's evidence and promotion rules remain in force; this capture change does not migrate its local baseline.
- An explicit journal/work-log destination uses the existing Insights location, fetching its live schema first. Daily-log and weekly-review workflows have not been migrated by this skill.
- Respect an explicit destination, local-only restriction, or request to keep an original. Never silently fall back to local Brain when Notion is unavailable.

## Capture

1. Read only the supplied material and context necessary to understand it. Parse images with native in-session vision; mark uncertain words/numbers rather than guessing. Do not send source images to a separate OCR service. Save image originals only when requested; text capture does not authorize uploading attachments.
2. Fetch the configured knowledge data source and Notion enhanced Markdown specification. If the connection or target is unavailable, retain a draft in the response and report **not saved**. Do not create a replacement database or change sharing.
3. Look for an existing capture by source URL/ID and distinctive title within this knowledge data source. Fetch likely matches before deciding. Same source and same content: return the existing page. Same source with a new observation: append a dated addition while preserving the original. Similar topic alone is not a duplicate; create a related note. Do not overwrite a curated card with raw input.
4. Create a small readable page under the configured **data source**, using live property names. Default `类型=随手记`, `整理状态=收件箱`, `值得再看=__NO__`; the title can be one sentence. Add `一句话` only if useful. No mandatory classification questions.
5. Set `原始日期` only when known: today's date for a current thought, the actual source date for older material, otherwise leave blank. Record capture date separately in the body. Keep raw words separate from interpretation, particularly for observations about people or decisions. Do not turn a proposal into a confirmed decision.
6. Link an existing project only if the source or conversation makes the connection clear. Fetch the Projects Registry schema and matching record; do not infer the project merely from cwd or create a project to store a note. Add relevant knowledge relations only after reading the matched pages, explaining the connection in the body. Unknown relations stay empty and do not block saving. Preserve existing relation values when updating.
7. Create once and read back the page: check content, inbox status, source/date and intended relations. Return its clickable Notion URL. On an ambiguous write/timeout, query the intended source/title and inspect matches before retrying; never blindly create a second page. If read-back is unavailable, distinguish accepted write from verified save.

Use the current connector schema rather than copying stale argument shapes. Property changes use `update_properties`, not properties attached to a content command. Use native Notion mentions for existing pages. The migration-only `来源路径` field is not required for daily capture; keep source URL/identity in the body. Notion SQL text can be lossy: fetch pages or use faithful rows before repairing rich text.

A short capture can simply contain the original thought and a source/date line. For longer material, use:

```markdown
## 记下来的内容
<original words, or a clearly labeled faithful summary>

## 为什么留下它
<only if supplied or useful; identify agent interpretation>

## 来源
<source link/ID or "Aaron，本次对话"; source date when known; capture date>
```

Do not fabricate a source link. Quote only supplied material or a permitted short excerpt; external reading notes should summarize and link. Save authorized Brain content to Notion only, without automatically exporting it to other services or copying unrelated private context.

## Find and organize

For older journals, reviews, decisions, reading notes or detailed knowledge sources, search the configured `recordsPageId`; `recordsMigrationMap` maps original source paths to Notion pages. These are historical records; new journals/work logs still use Insights. Existing curated cards link to their full source texts.

For an explicit World/person lookup or update, use `brainCapture.worldPageId` and its category pages; the configured `worldMigrationMap` locates migrated records by source identity. Fetch the current Notion page, append a dated observation with source and interpretation separated, and preserve historical content. Do not write a second local World copy. Generic thoughts still enter the knowledge inbox. This does not change brain-context baseline promotion rules.

For “刚才那条记在哪里” or “找回我记的 X”, query Notion first, then fetch relevant matches and return the page plus the useful excerpt. If necessary, search the corresponding legacy source and identify it as not yet migrated; do not import it as a side effect of retrieval.

For “整理收件箱”, read candidates, merge true duplicates without losing sources, add clear titles and meaningful relations, and set `已整理` when the content is readable and attributable. This status is editorial, not factual verification. Do not delete or archive ambiguous material based solely on age or brevity; explain specific discard candidates when needed. Capture alone leaves records in the inbox.

## Examples

- “帮我记下来：AI 做得越快，我越需要判断什么值得做。” → one inbox note; add an existing attention-related knowledge relation only after checking its content. No task or reminder.
- “帮我记下这篇文章” + URL → source-backed reading note in the inbox; if the article cannot be read, save only the supplied URL/words and mark it unread.
- “给 Aaron Studio 加个任务：做一个沟通模板。” → task-intake, not a knowledge card.
- Same screenshot submitted again → fetch the existing source match; return it or append only genuinely new information.
- “只分析这段，不要保存。” → no write.
