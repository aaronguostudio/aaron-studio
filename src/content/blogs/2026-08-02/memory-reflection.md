# Memory Reflection

## Related Past Posts

### [The One-Person Project](/blogs/one-person-project-ai-coding)

这是最直接的前文。Aaron 已经写过：AI compresses work, but it does not compress responsibility；当 agent 能同时写实现、测试和文档时，人的 review speed 会成为瓶颈。新文章应把这个观察进一步精确化：review 不只是“更多或更少”，而是要在正确的抽象层发生。

### [I Gave Codex a Task From a Moving Tesla](/blogs/ai-became-my-operating-system)

这篇文章已经建立了必要的连续性：Aaron 不再亲手输入每一行代码，但仍需理解代码、review 输出、保持标准并拥有风险。新文章不能写成对这条原则的撤退，而应解释“理解”不总等于逐行阅读。

### [Fable 5 Changed the Unit of AI Work](/blogs/fable-5-managing-ai-autonomy)

这篇文章把 AI 工作单位从 response 提升为 run，并强调 operating contract、权限、证据、停止条件和回滚。新文可将同一思想落到代码审查：当人不再观察每一步时，边界与证据必须变得更强。

### [AI Made Me 10x More Productive. Then I Almost Burned Out.](/blogs/ai-two-work-modes)

Scatter / Laser 两种模式可作为背景逻辑：可逆、低耦合的工作适合放大并行度；架构、安全、权限与高依赖工作必须进入更深的审查。正文不必重复整个框架，但可以让“理解深度阶梯”与它保持一致。

## Ideas To Reuse

- AI 扩大执行半径，也扩大责任半径。
- 输出越多，理解、review 和证据越稀缺。
- 人不必观察 agent 的每个动作，但必须拥有目标、边界、风险和最终决定。
- 信任应来自可观察、可验证、可回滚的系统，而不是来自“我扫过了 diff”的感觉。
- 低风险、强证据的变更可快速通过；权限、迁移、删除、隐私、并发和核心架构需要更深的人类审查。

## Ideas To Update

- 从“human review is the bottleneck”推进到“human review 必须按风险分配”，避免把更慢的逐行审查当成唯一答案。
- 从“AI 不承担责任”推进到“责任具体要求人在哪个抽象层理解什么”。
- 从 review 一个 output / run，推进到 review 一条证据链：意图、行为、约束、系统不变量、失败路径与回滚。
- 加入“理解债”概念：测试可以降低某些故障概率，但不会自动把实现吸收进团队的心智模型。
- 加入“证据独立性”：同一个模型从同一上下文写实现、测试和检查器，可能在多层重复同一个误解。

## Internal Link Candidates

正文最多使用三个站内链接：

1. `one-person-project-ai-coding`：在“AI 生成速度超过 review 速度”处链接。
2. `ai-became-my-operating-system`：在“工程师角色从写每一行转向设计条件与承担结果”处链接。
3. `fable-5-managing-ai-autonomy`：在“边界、证据、停止条件与回滚”处链接。

`ai-two-work-modes` 作为写作记忆保留；除非正文真的需要 Scatter / Laser，否则不强行加入第四个链接。

## Continuity Thesis

This post extends Aaron's previous writing by:

把“AI 压缩执行但不压缩责任”推进成一个可操作判断：未来优秀工程师的能力，不是读完 AI 写出的每一行，而是确保每一个重要变化，都被某个人在正确的抽象层上真正理解。
