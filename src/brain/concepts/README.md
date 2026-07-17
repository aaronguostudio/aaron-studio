---
type: concept
date: 2026-07-16
tags: [knowledge-base, software-engineering, glossary]
status: active
---

# Working Vocabulary · 工作词典

> 这里收藏的不是“名词释义”，而是可以反复调用的心智模型。

`concepts/` 用来积累技术、金融、心理、历史与生活中的重要概念和 Pattern。每篇概念笔记都应该回答：**它解决什么问题、怎样工作、什么时候适用、容易和什么混淆？**

## 浏览入口

- [打开工作词典](index.html)
- [Optimistic Concurrency · 乐观并发控制](optimistic-concurrency.md)
- [打开 Optimistic Concurrency 互动解释页](pages/optimistic-concurrency.html)
- [Single Source of Truth · 单一事实来源](single-source-of-truth.md)
- [打开 Single Source of Truth 互动解释页](pages/single-source-of-truth.html)

## 概念索引

| Concept | 中文 | Domain | 一句话心智模型 | Maturity |
|---|---|---|---|---|
| [Optimistic Concurrency](optimistic-concurrency.md) | 乐观并发控制 | 数据库 / 分布式系统 | 先让大家并行工作，提交时再检查有没有撞车 | growing |
| [Single Source of Truth](single-source-of-truth.md) | 单一事实来源 | 信息架构 / 数据系统 | 一个事实可以有很多副本，但只能有一个明确的裁决者 | growing |

## 每条概念的固定骨架

1. **一句话**：能不能用一句人话讲清楚？
2. **问题**：没有它会发生什么？
3. **机制**：系统如何一步步做？
4. **例子**：至少一个生活类比和一个技术例子。
5. **边界**：什么时候好用，什么时候会变糟？
6. **邻居**：相关概念是什么？哪些常被误认为同一件事？
7. **带走**：几条可以进入长期记忆的结论。

## 文件约定

- 一个核心概念一份 Markdown；Markdown 是可搜索、可链接的内容源。
- 值得“看见”的概念可以在 `pages/` 下增加一个自包含的互动解释页。
- 文件名使用英文 kebab-case，正文以中文为主，首次出现时保留英文原词。
- 使用 `related` 建立 wikilink；未来概念增加后，把纯文字邻居升级为真实链接。
- 新概念从 [_template.md](_template.md) 复制。

## 成熟度

- `seedling`：先捕捉，定义可能还不稳。
- `growing`：已有机制、例子和边界，可以实际使用。
- `evergreen`：经过多次修订，并连接到真实项目或决策。

这个成熟度不表示“概念本身是否正确”，只表示这份笔记被打磨到了什么程度。
