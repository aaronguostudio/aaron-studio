# Idea: Fable 5, Superpowers, and Managing AI Autonomy

我想写一篇关于最近 Claude Fable 5 带来的震撼感的文章。

前几天 Fable 5 发布之后，社区反应很强。它的能力确实很强，尤其是在长时间任务、规划、多 agent 协作、deep research 和页面生成方面。我自己也用它跑过几个小时的任务，它一次调度了一百多个 agents 去工作，最后给了我一些很漂亮的页面和研究结果。那一刻让我突然感觉到 AI 作为执行系统的力量。

但是 Fable 5 又很快因为美国政府的 export-control directive 被暂停访问，导致大家暂时没法继续使用。这个事件本身也很值得写：当 AI agent 变得足够强，它不再只是产品能力问题，也会变成治理、安全、出口管制、风险边界的问题。

我想把这个体验和我平时使用 Opus 4.8 / Codex 5.5 + Superpowers 的感受连接起来。其实在用 Superpowers 的时候，我已经体验到类似方向：AI 可以把项目 spec 出来、plan 出来，并且执行一到两个小时，显著减少我的介入。虽然它不像 Fable 5 那样可以跑那么久、调度那么多 agents，但它已经让我看到 agent 可以独立运行复杂任务的能力。

这篇文章想表达的观点是：未来几年做 agent，重点不只是模型更聪明，而是怎么做好 agent workflow management。包括任务分解、计划、长期执行、并行 agent 调度、review gate、权限控制、成本控制、失败恢复、人类监督，以及 harmful AI / safety / governance。

核心感觉：

- Fable 5 让我看到未来。
- Superpowers 让我开始练习未来。
- Agent 越强，workflow 管理越重要。
- 未来的 AI-native skill 不是只会 prompt，而是会管理 autonomy。

