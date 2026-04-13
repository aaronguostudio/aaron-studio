# Decisions — Life ADRs

> Architecture Decision Records, but for life. 记录**为什么**做了某个决策，而不是**做了什么**。

## 何时写 ADR

写 ADR 当一个决策满足以下任一条件：
- 不可逆 / 高 switching cost (e.g. 接受新职位、退出 project)
- 影响多个 world/ 节点 (e.g. 与某人关系策略变化)
- 反直觉 — 6 个月后的我可能会忘记为什么这样选
- 多个合理选项之间的取舍

不要为日常 todo / micro-decision 写 ADR。

## 命名规范
`YYYY-MM-DD-slug.md` — 例如 `2026-04-13-stay-at-mawer-q2.md`

## Frontmatter
```yaml
---
type: decision
date: 2026-04-13
status: proposed | accepted | superseded | reversed
tags: [career, mawer]
related:
  - "[[../world/orgs/mawer]]"
  - "[[../world/projects/nova]]"
supersedes: 2026-01-15-leave-mawer-q1.md  # optional
---
```

## Body 模板

```markdown
# Title (动词起头：Stay, Leave, Pursue, Decline)

## Context
What's the situation that forced this decision? Constraints, deadline, stakeholders.

## Options considered
1. **Option A** — pros / cons
2. **Option B** — pros / cons
3. **Option C** — pros / cons

## Decision
What I chose, in one sentence.

## Why (the real reason)
Beyond rationalization. What's the actual driver — fear, opportunity cost, identity, money?

## What would change my mind
2-3 specific signals that should trigger reversing this decision.

## Review date
When should I revisit this? Add to [reviews/](../reviews/).
```

## Index

(Add new ADRs here as `- [YYYY-MM-DD-slug](YYYY-MM-DD-slug.md) — one-line summary`)
