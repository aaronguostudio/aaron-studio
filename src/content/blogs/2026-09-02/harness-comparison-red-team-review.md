# Red-Team Review — Your Prompt Is Not the Request

## Findings

1. **“四家比较”可能被读成完整 benchmark。** DSH 没有 live request，三家只有各一条 calibration。文章必须从标题、表格和结尾持续写清 field note / non-ranking 边界。
2. **原始 telemetry 容易让人误以为字段可以相加。** 不能只在方法部分提醒；开头就要有“可见什么、拒绝推断什么”的表。
3. **DSH 的 source-level visibility 容易被写成性能优势。** 需要明确：默认 config 的可读性不是实际 token 或模型质量的证据。
4. **“空目录仍有 global surface”容易滑向未公开的私有环境细节。** 只保留观察结论，不公开 hooks、connector、filesystem 细节或精确数量。
5. **文章可能过于方法论，读者得不到行动。** 末尾必须有一个不造术语、能马上执行的四问 audit。
6. **“更少 context”容易被误解为“更好 agent”。** 必须给出强反方：默认规则与常用工具可能提高安全、完成率和速度。

## Required Revisions

- 在开头增加一张 raw-observability 表，分别列出可见项与不可推断项。
- 把 DSH 段改成“inspectable assembly”，并直接写出没有 live request。
- 将 Claude bare-mode failure 标作 `not run`，而不是将零 usage 作为 minimal 结果。
- 以四问 audit 结尾，并明确完成任务的效果是能力默认加载的判断标准。

## Revision Notes

- 已完成实质改稿：在开头加入四产品的 `What the calibration made visible / What I refuse to infer` 表，改变了文章呈现机制与证据边界的方式。
- DSH、Claude bare mode、Grok restricted mode 的边界均已在正文保留。
- 文章不包含私有 trace 名称、session ID、文件路径、credential 或原始 event。

## Verdict

Draft can proceed as a **field note**. It must not be published as a numerical four-harness benchmark until replicated H1 and separately labelled H2 cohorts exist.
