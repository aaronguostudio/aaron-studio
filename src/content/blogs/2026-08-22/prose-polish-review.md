# Prose Polish Review

## 修改目标

在论点和事实已锁定的前提下，做一轮 scoped 语言润色：修正精确性错误、消除一处语法笨拙、微调开场与结尾的节奏。不改论点、不加新事实。

## 英文润色重点

1. **修正时间事实错误**：原稿"Last August I argued…"把本周的拆解文写成"去年八月"，且 fable-5 实为 6 月。改为"In the teardown I argued… and in June that…"，同时消掉"before that that"的语法笨拙。
2. **修正字数错误**：原文写"能干活，但得盯着"为"five characters"（实际 7 字）。改为不数字数、"put it plainly"。
3. **修正无法核实的数字**：skill 数量写成"fifty-seven"，本会话实际可核实为 29（repo SKILL.md）/ 35（会话暴露）。公开文章改为"runs to dozens"，避免精确数无法溯源。
4. **时间精度**："a week after"→"a little over a week after"（开源 8/13，今天 8/22，实为 9 天）。
5. **节奏检查**：开场三段从短句→长句→短句，有变化；各节段首均有推进句；结尾落在操作规则而非总结。整体通过。

## 中文润色重点

- 待中文版完成后单独评审（translation tone、机械连接词、段落均衡）。

## 保留不改的地方

- 论点、四件套结构、"watch the state, not the prose" 框架、反方来源、结尾规则、站内链接。
- 有意保留的 canon 回调："what you're really buying"（呼应 local-crossover "environment is what you buy"），措辞不同，非逐字重复。

## 风险与边界

- 未新增任何事实、引语、链接或数字。
- 数字修正属于"删减不可溯源精确度"，非改写事实。
- skill 数量在内部 artifact（idea/plan/ledger）仍记为"57"来自 Aaron 既有口径；公开文章不再依赖该数字。claim-ledger F7 需同步降为"several dozen, environment-dependent"。

## 验证结果

- 英文风格扫描（修后）见后续 scorecard 阶段复跑；本轮为纯语言层，预期 100/100 保持。
- 中文版完成后跑 `--language zh` 门禁。
