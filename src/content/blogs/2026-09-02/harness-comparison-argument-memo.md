# 论证备忘录：四个 coding harness，到底把什么带进了 prompt

## 核心论点

用户写下的一句 prompt 从来不是 agent 实际收到的 request。DSH、Codex CLI、Claude Code 和 Grok Build 的真正差别，不在于谁把“系统 prompt”写得更长，而在于谁把能力预装进首轮、谁把它延后发现、谁让稳定前缀获得缓存、以及谁让这些选择仍然可见。

## 为什么现在值得写

- DeepSeek Harness 的热度提供了入口，但上一文已经说明它不是一个孤立的 DeepSeek 故事，而是整个 harness 层的设计问题。
- Aaron 的本机预检已看到同一个无工具 `OK` 请求在三家 CLI 中产生不相同的 usage receipt；连 `input_tokens` 都不能不加解释地并列。
- 这给读者一个比“哪个 agent 更强”更实用的问题：你的 agent 在工作开始前已经替你作了哪些架构选择？

## 机制解释

一份 agent request 至少有四种可能的携带方式：

1. **预装**：核心规则、工具定义、技能、连接器和工作区说明在首轮进入 context；
2. **发现**：先只带一个搜索或选择入口，任务需要时才装入具体能力；
3. **复用**：内容仍在 context 中，但稳定前缀可以由 provider cache 低成本重读；
4. **留存**：同会话怎样继续，以及新进程是否仍可能命中 cache。

它们不是同一件事。缓存降低边际读取成本，不自动缩小 context；把工具藏到 generated SDK 或 UI 之外，也不等于它没有进入 prompt；session resume 更不等于跨进程缓存。文章用四张 receipt 先呈现原始字段，再只在有官方语义和可复现实验支撑时做归一化。

## 证据地图

- **DSH**：本地 pinned source 的 headless 默认 config 能直接展示可组合的 agent、tool、skill、instruction、session/persistence 层；官方 DeepSeek 文档支持 prefix cache 的 best-effort 与 hit/miss 字段。当前无 live request，不能把源码默认值说成真实 token bill。
- **Codex CLI**：本机 personal-default 和 minimal H1 都输出 JSON usage；OpenAI Responses 文档表明 cached tokens 是 input usage breakdown，而不是另一份可相加的总 request。
- **Claude Code**：本机 personal-default trace 表明空工作目录仍会初始化全局 surface；它输出 `input`、cache creation、cache read 三类字段。Anthropic API 文档定义这三类字段对输入用量的关系，但仍要保留“CLI event 是否覆盖全部内部步骤”的边界。
- **Grok Build**：本机 restricted-default 输出不同形状的 cache usage，且 startup 仍含全球 capability surface；xAI 官方缓存文档说明 prefix reuse 与稳定 conversation ID 的关系，但不证明 CLI 是否设置它。
- **可复现边界**：当前只有各一条 read-only calibration sample，正文不能排名，也不能声称“平均首轮 token”。后续需要每个可用 cohort 五次串行 H1，H2 则另列为 stateful-product cohort。

## 需要承认的反方观点

- 更大的首轮常常换来更高完成率，尤其是 coding agent。
- 只有源码和 debug trace 可见的系统会显得更“可解释”，但这并不表示其他产品一定做得差。
- 使用相同名字的 cache 字段也不能使四个产品的 request、模型、账户路由或计费规则相同。

## 对反方的回应

文章不评选最小 prompt，更不评选最强模型。它评估的是可见的设计选择：能力在哪里进入、是否可以延后、什么 prefix 可以复用、什么无法由产品对账。真正的判断标准仍是 successful completed work；“少带一点”只有在不伤害完成率、延迟与安全边界时才有价值。

## 可复用框架

让读者把自己的 agent 当作随身行李来检查，而不是把它当成一条用户消息：

1. **随身带了什么？** 首轮默认进入的规则、工具、技能、连接器、工作区上下文。
2. **哪些能晚点拿？** 任务无关的能力能否以搜索/发现方式按需加入。
3. **哪些能便宜地重读？** 固定 prefix 的 cache hit、失效条件与 session 边界。
4. **哪一项看不见？** 没有 telemetry 或无安全 minimal cohort 时，把它当作产品边界，而不是猜一个数字。

## 对读者的启发

- 先保存自己的 no-tool receipt；不要把不同产品的 `input_tokens` 直接拿来排榜。
- 把默认 capability surface 与按需 discovery 分开讨论。
- 分别问 context footprint、cache reuse、session persistence 三个问题。
- 只有当一个默认能力提高完成任务的经济性时，才让它每轮都随身带着。
