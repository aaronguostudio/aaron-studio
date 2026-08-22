# Red-Team Review

Skeptical editorial review of the EN draft. 6 issues, 3 substantive fixes applied.

## Issues Found

1. **Brain/body 区分不 crisp（结构）** — 标题核心隐喻是"身体"，但正文始终没一句话把"V4 Pro = 大脑、harness = 身体"这个分工说清。读者可能读完不确定 V4 Pro 到底贡献了什么。→ 在 Part 1 点明。
2. **Part 3 只有一手证据，缺市场硬数据（证据）** — "what the body buys" 的利害完全靠第一人称，没有源支持的市场事实支撑"harness 决定结果"。→ 补 Composio 46.7%→66.7% / 7x（拆解文已核实）。
3. **"swap 模型后一切不变"过度声明（精确性）** — Part 6 说"skills, the state, the log… keep working unchanged"，但 append-only log 是会话特定的，不会整体迁移到新模型。→ 把"the log"改成"audit discipline"。
4. **缺"why now"时间锚（及时性）** — 文章跳进体感，没一句交代"为什么这周值得写"（DSH 刚开源一周）。→ 在自指收据句里加时间锚。
5. **continuity vs memory 边界靠读者自行推断（清晰度）** — "held state" 与 "audit log" 相近，容易混。正文已隐含区分（前者=模型握状态，后者=给人看记录），但可在 Part 2 收尾加半句显式区隔。→ 判断：现有区分已够，不改，避免冗余。
6. **结尾"what you're buying"与 local-crossover 同句回响（canon 重叠）** — 有意回调（"environment is what you buy"），保留；但确保不是逐字重复。→ 判断：措辞不同，保留。

## Required Revisions (applied)

- R1: Part 1 增加 brain/body 一句（V4 Pro = brain，harness = body，body 才是可构建层）。
- R2: Part 3 补 Composio 数字。
- R3: Part 6 "the log" → "audit discipline"。

## Revision Notes

- 三处均为实质性修订（结构清晰度 + 证据 + 精确性），非措辞润色。
- 未动的候选问题（#5 #6）经判断已达标，记录为"有意保留"而非遗漏。
- 反方处理已达标：Ronacher / jiayuan_jy / 中文实测 / DSH 文档 timeout 均为可溯源，无抽象怀疑者。
