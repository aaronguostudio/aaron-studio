---
type: reading
date: 2026-08-22
tags: [knowledge-base, tech-learning]
status: active
---

# Tech Learning · 技术领域学习

这里不是新闻收藏夹，也不是纯粹的术语字典。

`tech-learning/` 用来把一次技术更新、论文、架构实践或工具变化，沉淀成以后仍可调用的判断：**它改变了什么、为何这样设计、适用于哪里、会影响哪些项目、下一步该验证什么。**

## 它与其他目录的分工

| 目录 | 保存什么 | 何时进入 |
| --- | --- | --- |
| `reading/` | 对一篇文章、书或论文的来源笔记 | 值得保留原始论证和摘要时 |
| `tech-learning/` | 一个技术主题的研究性学习笔记：变化、机制、取舍、采用边界与项目关联 | 需要形成可行动判断时 |
| `concepts/` | 跨事件仍成立的心智模型与术语 | 一个概念已经值得反复调用时 |
| `development-philosophy/` | 我们希望怎样造产品的稳定原则 | 已经形成长期工程立场时 |

一个主题可以自然流动：

```text
来源 / 事件
  → Tech Learning：读懂变化和采用边界
  → Concepts：提炼可跨项目复用的概念
  → 项目 / Decision：在真实工作中验证或采纳
  → 更新原笔记的结论与成熟度
```

## 文件约定

- 一篇主题一份 Markdown，文件名为 `YYYY-MM-DD-topic.md`；正文以中文为主，保留必要英文术语。
- 使用根目录既有的 frontmatter：`type: reading`、`date`、`tags`、`status` 与 `related`（如有）。
- 给外部结论附原始来源链接；将「已验证事实」与「我的判断 / 待验证问题」分开。
- 第一版可以是 `seedling`；经过项目验证或复读后，更新为 `growing` 或 `evergreen`。
- 出现三个以上相互关联的主题后，再创建一个领域地图（例如 `ai-systems.md` 或 `web-platform.md`）；不要过早建立空分类树。

## 每篇笔记的最小骨架

```markdown
# Topic · 中文名

## 一句话

## 为什么值得学

## 它实际改变了什么

## 底层机制 / 心智模型

## 采用边界与反例

## 对我现有项目的影响

## 最小验证或练习

## 可复习的记忆卡

## Sources
```

## 当前索引

| Topic | Domain | Maturity | 连接到什么 |
| --- | --- | --- | --- |
| [TypeScript 7.0 · Native Toolchain](2026-08-22-typescript-7-native-toolchain.md) | compiler / developer tooling | growing | 性能、并行、生态 API 边界 |
