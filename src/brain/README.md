# Brain — Aaron's Operating System

> 新的个人知识通过 [brain-ingest](../../tiles/brain-ingest/SKILL.md) 进入 [Notion Brain](https://app.notion.com/p/3d3b5667a0c681b08ef6d856eed210ee)。这里保留未迁移资料与原始快照；按任务读取，不需每次全量加载。

日常捕捉已切换到 Notion；会议 context、日记生成与复盘仍使用各自现有 workflow。下方目录与规范适用于尚未迁移或明确指定本地的内容。

## 子目录

会议沉淀和跨项目读取从 [Brain context 试点](processing/README.md) 进入；按任务读取相关项目与来源，不需要全量加载 Brain。

| Dir | Purpose | Update cadence |
|-----|---------|----------------|
| [world/](world/) | 数字孪生 / 关系图谱 — 人、组织、项目、主题 | event-driven |
| [goals/](goals/) | North star + 年度主题 + 当季 OKRs | quarterly review |
| [reviews/](reviews/) | weekly / monthly / quarterly 复盘 | scheduled |
| [decisions/](decisions/) | 重大决策的 ADR (Architecture Decision Record for life) | event-driven |
| [journal/](journal/) | 每日 journal entries | daily |
| [reading/](reading/) | 读书/文章笔记 | event-driven |
| [tech-learning/](tech-learning/) | 技术领域学习 — 把更新、原理、项目影响与复习连成一条知识链 | event-driven |
| [concepts/](concepts/) | 工作词典 — 术语、心智模型、边界与关联概念 | event-driven |
| [development-philosophy/](development-philosophy/) | 开发哲学 — 造产品时反复使用的原则与质量标准 | event-driven |
| [notes/](notes/) | 个人 cheatsheets, snippets, how-to | event-driven |
| [life/](life/) | routine, identity, lifestyle | quarterly |
| [logs/](logs/) | 工作时长记录 (cf, oc, etc.) | daily |

## Frontmatter 规范 (新文件 SHOULD use)

```yaml
---
type: journal | review | decision | node | reading | concept | philosophy | note | goal | log
date: 2026-04-13
tags: [career, mawer, orgnext]
status: draft | active | archived
related:
  - "[[world/people/keri]]"
  - "[[world/projects/orgnext-mvp]]"
---
```

- `type` is required — Claude uses this to know how to handle the file.
- `related` uses wikilink format consistent with [world/](world/).
- 不需要 backfill 老文件，但新文件请加。

## 增长循环 (Growth loop)

```
daily journal ─┐
               ├──► weekly review ──► world/ deltas + decisions/ ADRs
world/ ────────┤                            │
goals/ ────────┤                            ▼
inbox ─────────┘                       monthly → quarterly → goals/ update
```

每个 review 都应该问三个问题：
1. **What changed?** — world/ 节点 status 是否需要更新？
2. **What did I learn?** — 是否需要写 ADR 或新 reading note？
3. **What's next?** — 当季 OKR 是否仍然 valid？

## 隐私

用户明确要求保存的个人知识可以通过 `brain-ingest` 写入已配置的 Notion Brain；这不授权批量上传旧资料、扩大分享范围或转发到其他服务。

整个 brain/ 目录包含敏感的人际观察、政治分析和职业战略。**aaron-studio 必须 private repo。** Claude 在使用外部工具（图片生成、网页上传等）时，**不要**复制 brain/ 内容到外部 service。如需引用，先 redact 人名 / 项目名。
