# Research Dossier — AI 时代的流程经济学

## 这份材料要回答的问题

1. 当 agent 将执行能力放大后，组织里真正稀缺的投入转移到了哪里？
2. 为什么 DeepSeek Harness 的高密度流程不是一个孤立、怪异的工程选择？
3. 什么样的规则、测试、文档和记忆会成为资产，什么样的只会成为流程通胀？
4. 这套结论对普通小团队有什么适用边界？

## 核心一手资料

### 1. DeepSeek Harness：流程成为 agent 可执行的环境

本地研究基于仓库 HEAD `47f943859bef60e4160492346772ded9b24f765a`（2026-08-13），由 14 个 agent 对 11 个子系统和 3 个批判视角进行拆解，并留下 378 处源文件/文档核验。

可用事实：

- 64 天、12,293 次提交、683 篇 Agent Notes。
- rejected notes 不只是保存结论，还要求未来重提者击败原有 reasoning。
- postmortem 的目标不是“吸取教训”，而是产出 verifier/test，并证明旧 bug 恢复后测试会变红。
- 一次真实 Loader 路径错误逃过 178 个绿色测试和 100% 行覆盖，说明 gate 只能验证它看得见的世界。
- 文档预算、归档检索隔离和双语 hash pairing 都在把组织记忆变成机器可检查对象。

资料：[`src/brain/reading/deepseek-harness-teardown/README.md`](../../../brain/reading/deepseek-harness-teardown/README.md) 与 [`09-工程过程资产`](../../../brain/reading/deepseek-harness-teardown/09-工程过程资产：AgentNotes制度、postmort.md)。发布前仍需对高频变动仓库重新核验。

### 2. OpenAI Harness Engineering：更便宜的执行要求更早的约束

[OpenAI, “Harness engineering: leveraging Codex in an agent-first world”](https://openai.com/index/harness-engineering/)（2026-02-11）自述：

- 一个最初三人的团队在五个月内产生约一百万行代码、约 1,500 个 PR，且没有人工直接写入代码；团队估计开发时间约为手写的十分之一。
- 团队把通常等到数百名工程师才会建立的架构约束视为 agent-first 项目的早期前提。
- 随着吞吐增加，瓶颈变成人类 QA；早期团队每周五花 20% 时间清理 “AI slop”，后来把清理原则编码成持续运行的 garbage collection。
- 官方文章同时承认：长期架构一致性、哪些判断最值得由人类保留，仍没有答案。

这是文章最强的“大规模反直觉”案例：执行便宜后，流程不是自动消失，而是被前移并资本化。

### 3. Anthropic：人决定 what，agent 决定 how

[Anthropic, “Agentic coding and persistent returns to expertise”](https://www.anthropic.com/research/claude-code-expertise)（2026-06-16）分析约 40 万次 Claude Code 会话：

- 人类平均做出约 70% 的 planning decisions，但只做出约 20% 的 execution decisions。
- 任务领域知识更强的人，成功率更高、每条指令触发的 agent 工作更多、遇到错误后也更容易恢复。
- 这是观察性、vendor-owned 数据；它支持“判断仍稀缺”的方向，不证明所有组织都遵循同一比例。

### 4. DORA：AI 是组织系统的放大器

[DORA, State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/) 的核心结论是：AI 主要放大组织已有的优点和弱点，回报来自底层组织系统，而不是工具本身。

它提供的是跨组织层面的方向性支撑，不承担文章里的具体机制解释。

### 5. 生产率 J 曲线：新通用技术需要无形互补资本

[Brynjolfsson, Rock, and Syverson, “The Productivity J-Curve”](https://www.aeaweb.org/articles?id=10.1257/mac.20180386)（2021）指出，AI 等通用技术需要流程、产品、商业模式和人力资本上的互补投资。这些无形资产在建设期可能看起来像成本，成熟后才释放生产率收益。

文章可以据此提出一个推论：harness 是 AI 时代的一种微观组织资本——它把可重复判断编码为 agent 能读取、执行、验证的环境。

## 可以使用但要谨慎的材料

- [Google Cloud, “When AI writes the code, who reviews it?”](https://cloud.google.com/transform/when-ai-writes-the-code-who-reviews-it-cto-google-cloud)（2026-04-28）：Google Office of the CTO 团队的大 PR、review gridlock、上下文碎片案例很具体，但属于单团队自述。
- [METR Task-Completion Time Horizons](https://metr.org/time-horizons/)（更新于 2026-05-08）：证明 agent 可独立完成的任务跨度正在扩大，但不能直接推出某个组织的商业收益。
- [OpenAI, “How agents are transforming work”](https://openai.com/index/how-agents-are-transforming-work/)（2026-06-25）：长任务和并行 agent 使用增长很快；其任务时间由模型估计，只应作为方向性规模信号。

## 可用案例结构

### 主案例 A：OpenAI + DeepSeek 的独立收敛

两个不同组织都发现：agent 能写更多代码，并不意味着可以省掉结构；相反，架构边界、反馈环和机器可见知识更早成为前提。

### 主案例 B：Anthropic 的劳动分层

40 万次会话把“判断贵、执行便宜”从一句漂亮话变成可观察的分工：what 主要在人，how 主要在 agent。

### 解释框架：生产率 J 曲线

模型能力不是完整生产函数。组织必须投资于无形互补资产，才会把模型能力转成稳定产出。

### 反例：DeepSeek 的 178 个绿色测试

流程资本并不等于真理。未知的入口路径仍可逃逸；更多 gate 也会带来维护、理解和退役成本。

## 主要反方观点

1. OpenAI、Anthropic、DeepSeek 都是极端样本，普通团队无法复制。
2. 这些资料大多来自模型提供商或 AI-first 团队，存在选择偏差和宣传动机。
3. 模型继续进步后，今天的 harness 可能变成临时脚手架。
4. AI 让流程文档也变得廉价，最可能出现的不是缺少流程，而是规则爆炸。

## 对反方的处理

- 不建议复制数量，只解释共同机制。
- 对所有 vendor 数字使用 “reports / estimates / in its data” 语言。
- 把 harness 定义为会折旧的组织资本，不是永恒制度。
- 将退役所有权纳入框架；没有退役机制的规则不算成熟资本。

## 开放问题

- 如何衡量一条规则节省了多少未来 human judgment？
- agent 是否能够可靠地参与规则退役，还是必须由人类承担？
- 当模型能力跨代提升时，哪些 harness 层会消失，哪些会因为吞吐提升反而更重要？

## 文章应保留的判断

最值得写的不是“AI 需要流程”，而是：**AI 正在把组织的生产函数从“人执行、流程协调”改成“agent 执行、判断配置、系统反馈”。Harness 是这种新组织资本的最早可见形态。**

