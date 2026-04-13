# Reviews — Reflection Cadence

复盘是 brain/ 中**唯一周期性**的部分。其他一切都是 event-driven，但 review 必须 scheduled。

## Cadence

| Cadence | Day | Template | Reads from |
|---------|-----|----------|------------|
| Weekly | Friday evening | [weekly/.template.md](weekly/.template.md) | 本周 journal/, world/ deltas, inbox/ |
| Monthly | 月底最后一个周日 | [monthly/.template.md](monthly/.template.md) | 4 weekly reviews + decisions/ |
| Quarterly | 季度末 | [quarterly/.template.md](quarterly/.template.md) | 3 monthly reviews + goals/current-quarter.md |

## 命名规范

- `weekly/2026-W15.md` (ISO 周数)
- `monthly/2026-04.md`
- `quarterly/2026-Q2.md`

## Claude 的角色

Aaron 不会每次 review 都从头写。Claude 应该：
1. 读相关时间窗口的 journal/, logs/, world/ 改动 (`git log --since=...`)
2. 用 template draft 一份草稿
3. 让 Aaron 修改、补充、确认
4. 根据 review 结论自动 propose 更新 world/ 节点的 Observations

## Review 三问

每个 review 都必须回答：
1. **What changed?** (state)
2. **What did I learn?** (insight)
3. **What's next?** (intent)

如果 review 没有产生至少 1 个 world/ 节点更新或 1 个 decisions/ ADR，那这次 review 是浅的。
