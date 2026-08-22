# 论证备忘录

## 核心论点

使用 DeepSeek Harness + V4 Pro 的感觉不是"更聪明的聊天机器人"，而是"模型长出了身体"——一个可编程的工具面、可加载的技能、跨回合持有的状态、和一份只追加的日志。这个"感觉"是结构不是情绪，它的操作后果是：你不再读模型的答案，而是看它的状态。

## 为什么现在值得写

- DSH 开源（2026-08-13）刚一周，与 V4-Pro GA 同一天；repo 与模型都在剧烈变动中。
- 系列已覆盖 anatomy（teardown 08-19）与 economics（local-crossover 08-21），但没人回答操作者最直觉的问题：用它是什么感觉。
- 中文实测稿停在"能干活，但得盯着"，没把体感翻译成可复用结构。
- 自指收据是新鲜的：这篇正由 DSH + V4 Pro 生产。

## 机制解释

为什么"感觉"会变：不是模型变聪明，而是环境改变了模型与世界的关系。

1. 工具面从"菜单"变成"编程语言"（只有 run_code 可直接调，其余在程序体内编排）→ 模型不再逐次点工具，而是写程序编排工具 → 工作单位从 answer 变成 run。
2. 能力从"重敲 prompt"变成"加载文件"（SKILL.md + base dir）→ 能力可携带、可版本化。
3. 状态从"每轮丢失"变成"跨轮持有"（goal/todo/subagent/background job）→ 委托可以端到端。
4. 过程从"不可见"变成"可审计"（append-only log + claim ledger）→ 失败可回溯、可复盘。

四者共同把"委托"从逐轮风险变成结构化作业。

## 证据地图

- 一手（本次会话）：run_code 唯一直接工具（F6）、57 skill 目录（F7）、goal/todo/subagent/background 原语（F8）、正在跑 blog-production 管线（P1）。
- 二手背景：Composio 46.7%→66.7% / 7x（F2）、Ronacher（F3）、jiayuan_jy（F4）、"能干活但得盯着"（F5）。
- 系列内引用：teardown 的"harness 决定 completion/cost/audit"、fable-5 的"unit = run"、08-26 的"judgment still expensive"。

## 需要承认的反方观点

1. 日常体验仍落后于 Claude Code/Codex（jiayuan_jy、Ronacher "not perfect"）。
2. "能干活，但得盯着"——中文实测共识。
3. 失控面更大：loop-runaway 只提醒不强制停、file 工具无 timeout（DSH 自己文档）。
4. "变强"是错觉：V4 Pro 本来就 V4 Pro，harness 加结构不加 IQ；判断力不自动提升。

## 对反方的回应

- 不争"DSH 是否最好用"——它现在不是（诚实层照写）。
- 把反方吸收进论点：正因为"身体"让失败也规模化，所以"看状态"才从可选项变成必选项；这正是本文的框架，而不是软文的破绽。
- 判断力不自动提升：明确写人仍设标准、拒结果、定规则，把重复判断沉淀成评估/规则/工具。

## 可复用框架

**Watch the state, not the prose.** 交给 agent 一个任务后，不再问"这段话像不像样"，而检查三件事：有没有一份在推进的书面计划/todo；有没有把 fact 与 inference 分开的 claim ledger；以及它自己是否写清了"完成"与"失败"的定义。状态连贯，文章通常也连贯；只看文章，状态可能悄悄烂掉。

## 对读者的启发

- 委托的稀缺技能从写 prompt 移到握状态 + 判工作。
- 资产层（四件套）比模型更值得投资——模型可换，身体可携带。
- 判断力仍是人的活；harness 给结构，不给判断。
