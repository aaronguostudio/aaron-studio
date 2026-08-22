# Claim Ledger

> 约定：fact = 有可查来源；inference = 我对事实的解读；judgment = 操作者结论/建议；personal observation = 我本次会话直接经历。每条记录来源与核查日期。核实日：2026-08-22。

## 事实 / 引用

| # | 主张 | 类型 | 来源 | 来源日期 | 置信度 | 文章用途 |
|---|------|------|------|---------|--------|---------|
| F1 | DeepSeek Harness 于 2026-08-13 开源（MIT），与 V4-Pro GA 同一天 | fact | 拆解文 + api-docs.deepseek.com/news/news260813 | 2026-08-13 | 高 | 开场背景一句 |
| F2 | Composio 八 harness 实测：46.7%→66.7% 成功率、每完成任务成本差约 7x | fact | 拆解文（已核实 Composio） | 2026-08 | 高 | 背景一句（不再展开） |
| F3 | Armin Ronacher："not perfect… first time… inspired to revisit our choices" | fact | The Register（拆解文已引） | 2026-08-14 | 高 | 反方/诚实层 |
| F4 | jiayuan_jy："daily experience still trails Claude Code and Codex" | fact | X 帖（拆解文已引） | 2026-08 | 中高 | 反方 |
| F5 | 中文实测标题 "能干活，但得盯着" | fact | 澎湃/搜狐 | 2026-08 | 中 | 反方 |
| F6 | DSH 唯一直接可调工具是 run_code，其余工具在程序体内编排 | fact（一手核实） | 本次会话 | 2026-08-22 | 高 | 核心证据 |
| F7 | skill 以 SKILL.md + base directory 存在；本会话暴露 ~35、repo 内 29 个 SKILL.md（精确总数随环境变化） | fact（一手核实） | 本次会话 | 2026-08-22 | 高 | 核心证据（公开文不写精确数） |
| F8 | DSH 提供 goal / todo / subagent / background job 等持久状态原语 | fact（一手核实） | 本次会话 | 2026-08-22 | 高 | 核心证据 |

## 推断

| # | 主张 | 类型 | 依据 | 置信度 | 备注 |
|---|------|------|------|--------|------|
| I1 | "body" 的四件套（工具面/技能/状态/日志）是可携带的资产层 | inference | F6/F7/F8 + 拆解文"asset layer"结论 | 高 | 升级不推翻旧判断 |
| I2 | 工作单位从 answer 变成 run/job | inference | fable-5 命题 + F6/F8 体感 | 高 | 接旧文 |
| I3 | harness 让失败也规模化（工具+状态+自主 = 更大的失控面） | inference | F3/F4/F5 + 拆解文 timeout/reminder 事实 | 高 | 反方核心 |

## 判断

| # | 主张 | 类型 | 备注 |
|---|------|------|------|
| J1 | 操作界面从"读答案"变成"看状态" | judgment | 可复用框架，本文卖点 |
| J2 | 稀缺技能从写 prompt 移到握状态 + 判工作 | judgment | 呼应 08-26 judgment 昂贵 |
| J3 | 判断力不会自动提升；人仍设标准、拒结果、定规则 | judgment | 反"self-improving" |

## 个人观察

| # | 主张 | 类型 | 备注 |
|---|------|------|------|
| P1 | 本会话正在 DSH + V4 Pro 上完整跑 blog-production 管线 | personal observation | 自指收据 |
| P2 | 写程序编排工具（而非逐次点工具）改变了我的工作节奏 | personal observation | 体感证据 |

## 边界与剔除

- 剔除：任何"DSH 全面超越 Claude Code/Codex"的暗示（F3/F4 不支持）。
- 剔除：任何"harness 让模型更聪明"的表述（harness 加结构不加 IQ）。
- 剔除：把二手实测稿的逐条数据当结论；只取"能干活但得盯着"这个可溯源判断。

Decision: PASS —— 链接、日期、数字、推断边界均已核对；fact / inference / judgment / personal observation 分离。
