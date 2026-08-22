# Research Dossier（内部调研笔记）

## 这份材料要回答的问题

1. "使用 DSH + V4 Pro 的感觉"能不能拆成可复用的结构，而不是停在"好用/不好用"？
2. 哪些是二手可查证事实，哪些是我（本次生产会话）的一手观察？
3. 反方观点有哪些，来源是谁？怎么诚实处理而不变成软文？

## 核心一手资料（本次会话，first-hand）

- **工具面**：DSH 中唯一能直接调用的工具是 `run_code`（执行一个 TypeScript 函数体，erasable syntax，类型被 strip）；其余工具（read/write/edit/bash/grep/glob/web_search/skill/subagent/goal/todo 等）都在 `run_code` 的程序体内以 `await tools.*` 形式调用。→ 这是"body 的双手"最硬的证据。
- **技能层**：skill 以 SKILL.md 文件存在，带 base directory 与 resourceBase；本会话目录载入 57 个 skill。加载 skill = 获得能力，而不是重敲 prompt。→ "body 的能力是文件"。
- **状态层**：create_goal / get_goal / update_goal（跨轮持久目标）、todo_write（结构化任务态）、subagent / subagent_fork（可 fork 上下文）、background job（异步执行）。→ "body 能跨回合握住状态"。
- **审计层**：日志/claim ledger 把 fact/inference/judgment 分开；本会话正在维护 claim-ledger + editorial-scorecard 作为可审计的生产记录。
- **工作流**：blog-production 是 11 步编排器 + 十余道质量门禁；本会话正在完整跑它。

## 可以使用但要谨慎的二手材料

- 中文实测稿「上线12小时5万星，DeepSeek Harness实测：能干活，但得盯着」（澎湃/搜狐转载）——标题即反方：能干活但要人盯。用作"反方有可见来源"，不逐条采信其数据。
- 「DeepSeek Harness 使用感受」（CSDN grapecity 转载）——体验类二手，谨慎用于"他人也在谈体验，但止于好用不好用"。
- 「DeepSeek Harness vs Claude Code vs Codex」（mindstudio.ai）——三强对比，仅作背景，不引为结论。
- 「花了一整夜实测 DeepSeek Harness：它比 Claude Code 强在哪？」（阿里云开发者）——正面体验稿，作为对照。

## 可用案例

- **本生产会话**：一手，最重。我正在 DSH + V4 Pro 上跑这篇博客的完整管线。
- Composio 八 harness 实测（拆解文已核实）：46.7% → 66.7% 成功率、每完成任务的成本差 7x —— 佐证"harness 层决定结果"，作为背景引用，不再展开。
- DeepSeek Harness 自建过程（拆解文）：64 天、12,293 commits、`codex/` 分支 209 次 —— 佐证"harness 正在造 harness"，可作一句背景。

## 主要反方观点

1. **日常体验仍落后**：jiayuan_jy（有仓库权限的早期用户）"daily experience still trails Claude Code and Codex"；Armin Ronacher "not perfect"（拆解文已引）。
2. **能干活但得盯着**：中文实测稿标题本身就是这个判断。
3. **失控面更大**：DSH 自己文档承认 loop-runaway 只发提醒不强制停、file read/write/edit 无 timeout（拆解文已核实）。
4. **"变强"是错觉**：V4 Pro 本来就 V4 Pro；harness 加的是结构不是 IQ。判断力仍需人来设标准、拒结果（呼应 08-26 "judgment is still expensive"）。

## 关键事实与引用

| 事实 | 来源 | 日期 |
|------|------|------|
| DSH 开源（MIT），与 V4-Pro GA 同一天 | 拆解文 + DeepSeek API news260813 | 2026-08-13 |
| Composio：46.7%→66.7%、7x 成本差 | 拆解文（已核实） | 2026-08 |
| Ronacher "not perfect… inspired to revisit" | The Register 报道（拆解文已引） | 2026-08-14 |
| jiayuan_jy "daily experience still trails" | X 帖（拆解文已引） | 2026-08 |
| 中文实测 "能干活，但得盯着" | 澎湃/搜狐 | 2026-08 |

## 开放问题

- 无阻塞性开放问题。体验类命题以一手观察为主，二手仅作背景与反方。

## 文章应保留的判断

- "感觉"是结构不是情绪；四件套（工具面/技能/状态/日志）是它的可复用结构。
- 诚实层必须写：harness 让失败也规模化；判断力不自动提升。
- 自指利益冲突在正文点明，用收据（本会话一手事实 + claim ledger）应对，而不是辩白。
