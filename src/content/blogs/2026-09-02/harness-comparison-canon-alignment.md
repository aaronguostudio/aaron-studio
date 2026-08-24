# Canon Alignment — Your Prompt Is Not the Request

## 文章当前判断

Prompt 是进入 request 的最后一层。真正影响 agent 行为、成本和可审计性的，是 harness 如何默认携带能力、延后发现能力、维持可缓存 prefix，以及保存 session。

## 与旧文章的呼应

- 延续《What I Learned From DeepSeek's Harness》的 provider/harness 分工：provider 负责存 cache，harness 决定是否命中。
- 延续“harness 决定同一模型能否完成工作”的主张，但把角度从外部 benchmark 进一步收紧到本机可观察性和测试边界。
- 延续“skills、instructions、decision records 是可迁移资产”的判断：资产的价值不等于它必须在每个首轮 request 中出现。

## 观点升级

上一篇的重点是 DSH 把 agent 系统做成了可重放、可检验的设计。本篇把问题推到四类产品：透明度本身是产品能力。一个 operator 不一定需要自己控制每一项内部 prompt，但需要知道哪些字段可以读、哪些边界无法测、以及什么不能被一张数字表抹平。

## 需要避免的惯性

- 不把 DSH 当成其余产品的基准答案；DSH 只是最好的入口和最容易观察的样本。
- 不重复前文的源码导览、Composio 排名或旧的 17,606 数字。
- 不把 cache 机制写成单纯的成本技巧；它和 context footprint、tool selection、session persistence 是不同层。
- 不把“少带能力”写成通用建议。完成率、安全规则和延迟仍要进入判断。

## 可以加入的 Aaron 判断

“空项目，不等于空 agent。”这是一个在工作流层面可复用的判断：测试 prompt 前先盘点用户级、产品级、workspace 级的默认随身能力。

## 站内链接建议

- 主链接：`/blogs/deepseek-harness-teardown`，用于解释 DSH 的来源和 cache discipline。
- 后续可选：`/blogs/ai-became-my-operating-system`，用于把“agent 背包”接回个人工作系统，但不要在本稿强行插入。
- 后续可选：`/blogs/fable-5-managing-ai-autonomy`，用于引出 session persistence 与 autonomous run 的差别。

## Alignment Decision

保留 DSH 作为开篇引子，但让文章的中心从“DeepSeek 做得多好”转向“不同 harness 让能力进入 request 的方式不同，而可见性决定你能否做出公平判断”。
