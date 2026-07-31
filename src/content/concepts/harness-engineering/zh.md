---
title: "Harness Engineering"
fullName: "Artificial Intelligence Harness Engineering · 智能体运行支架工程"
shortName: "Harness Engineering"
description: "设计任务契约、上下文、工具、状态、验证、权限与恢复，把模型能力变成可靠工作。"
mentalModel: "模型提供能力；Harness 把能力变成可靠工作。"
date: "2026-07-24"
updated: "2026-07-24"
domain: "人工智能系统与软件工程"
domainKey: "ai-systems"
tags: ["智能体", "上下文", "工具", "状态", "评估", "权限", "恢复"]
maturity: "持续生长"
published: true
featured: true
translationKey: "harness-engineering"
interaction: "harness-engineering"
socialImage: "/learn-img/harness-engineering/og-1200x627.jpg"
socialImageAlt: "纯英文编辑图：MODEL 核心外环绕 context、tools、state、evals、permissions 与 recovery 六层，并通向可验证工作。"
cardImage: "/learn-img/harness-engineering/card-4x5.jpg"
cardImageAlt: "纯英文编辑风分享卡，标题为 Harness Engineering，模型核心外环绕上下文、工具、状态、评估、权限和恢复。"
neighbors:
  - name: "提示工程"
    fullName: "Prompt Engineering · 提示工程"
    category: "指令技术"
    summary: "改善当次运行怎样向模型表达意图；Harness Engineering 设计完整任务生命周期。"
  - name: "上下文工程"
    fullName: "Context Engineering · 上下文工程"
    category: "子系统实践"
    summary: "选择、组织和更新模型所见信息；它是更大 Harness 中的一层。"
  - name: "Agent Harness"
    fullName: "Agent Harness · 智能体运行支架"
    category: "运行产物"
    summary: "实际运行的循环与基础设施；Harness Engineering 是设计和改进它的实践。"
  - name: "Agent Framework"
    fullName: "Agent Framework / Software Development Kit · 智能体框架 / 软件开发工具包"
    category: "工具包"
    summary: "提供通用零件，但不包含任务特定的契约、证据、权限与恢复策略。"
  - name: "MCP"
    fullName: "Model Context Protocol · 模型上下文协议"
    category: "集成协议"
    summary: "标准化工具与上下文连接；不定义完成条件、权限或恢复。"
  - name: "评估支架"
    fullName: "Evaluation Harness · 评估支架"
    category: "测量设施"
    summary: "运行并评分受控任务；生产 Agent Harness 负责真实工作。"
  - name: "持久执行"
    fullName: "Durable Execution · 持久执行"
    category: "运行保证"
    summary: "为 Harness 的状态层提供检查点、重试与恢复。"
  - name: "能力安全"
    fullName: "Capability-Based Security · 基于能力的安全"
    category: "权限模型"
    summary: "只授予任务需要的狭窄能力，限制错误的影响范围。"
sources:
  - title: "OpenAI · Harness engineering: leveraging Codex in an agent-first world"
    url: "https://openai.com/index/harness-engineering/"
  - title: "OpenAI · Running Codex safely at OpenAI"
    url: "https://openai.com/index/running-codex-safely/"
  - title: "OpenAI · The next evolution of the Agents SDK"
    url: "https://openai.com/index/the-next-evolution-of-the-agents-sdk/"
  - title: "Anthropic · Effective harnesses for long-running agents"
    url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
  - title: "Anthropic · Harness design for long-running application development"
    url: "https://www.anthropic.com/engineering/harness-design-long-running-apps"
  - title: "Anthropic · Beyond permission prompts: Claude Code sandboxing"
    url: "https://www.anthropic.com/engineering/claude-code-sandboxing"
  - title: "Anthropic · Demystifying evals for AI agents"
    url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
  - title: "Anthropic · Scaling Managed Agents: Decoupling the brain from the hands"
    url: "https://www.anthropic.com/engineering/managed-agents"
  - title: "Zhong and Zhu · AI Harness Engineering"
    url: "https://arxiv.org/abs/2605.13357"
  - title: "Ahn and Kim · From Prompts to Contracts"
    url: "https://arxiv.org/abs/2607.08028"
---

# Harness Engineering

为什么同一个模型，在一个环境里能连续工作数小时、验证修改并从失败中恢复；换到另一个环境，却会猜错仓库结构、忘记进度、过早宣布完成？

差别经常不只在模型，而在模型周围的系统。

**Harness Engineering 设计的正是这套系统：**任务契约、上下文、工具、状态、验证、权限与恢复。它们共同把模型能力变成可靠工作。

这里的智能体，主要指由人工智能（Artificial Intelligence，AI）模型驱动、能够通过工具观察和改变环境的软件系统。

这个术语仍在形成，并不是边界完全稳定的标准学科。不同团队可能用 agent infrastructure、scaffolding、runtime、orchestration 或 context engineering 描述其中重叠的部分。本页把 Harness Engineering 定义为：**围绕一个可替换模型，设计使智能体可靠完成真实任务的运行系统。**

## 一个生活类比：机床与工装

一台高性能数控机床有很强的加工能力，但工厂不会只把一块金属交给它，然后说“做成合格零件”。

可靠生产还需要：

- 图纸和公差，定义什么叫合格；
- 夹具和定位销，让材料每次处于正确位置；
- 刀具和行程限制，约束机器怎样行动；
- 工序与批次记录，保存进度；
- 量规和抽检，测量零件而不是相信“完成了”；
- 防护门和授权，控制危险动作；
- 断电或撞刀之后的复位程序。

机床像模型；工装、量规、记录与安全流程像 Harness。

更强的模型也许能选择更聪明的加工策略，却不会自动替你定义公差、保存批次记录或决定谁能解除防护。反过来，优秀工装也不能把能力不足的机床变成万能机器。可靠结果来自 **model × harness × environment** 这个整体。

## 一个技术例子：修复结账 Bug 并创建 Pull Request

任务是：

> 修复“优惠券与礼品卡同时使用时，订单总额变成负数”的问题，补上回归测试，并创建一个 Pull Request（拉取请求）。

如果只有模型，智能体可能根据文件名猜测位置、修改一段看似相关的代码、写一条没有覆盖真实故障路径的测试，然后在没有运行结账流程时报告成功。

Harness 会把同一请求组织成一条带证据的运行链。

### 1. 任务契约

先把意图翻译成可观察的验收条件：

- 能够复现负数总额；
- 修复后总额不低于零；
- 既有折扣规则没有回归；
- 新回归测试在修复前失败、修复后通过；
- 验证通过后才允许创建 Pull Request。

契约固定的是结果边界和证据要求，而不是写死每一步实现。

### 2. 上下文地图

智能体从一个短入口开始，只在相关时继续取更深的资料：

```text
智能体入口
→ 架构地图
→ checkout 领域说明
→ 相关测试与运行命令
→ 任务历史和约束
```

这与把所有文档塞进一个巨型提示不同。入口告诉它去哪里找；版本化来源说明什么有权威；可执行代码与测试说明什么现在仍然为真。

### 3. 工具与隔离环境

智能体在独立工作树或 sandbox（沙箱）中读写文件、运行测试、启动应用并操作浏览器。工具有明确参数、错误语义、超时和任务范围内的权限。生产凭证不会进入生成代码能够读取的环境。

### 4. 持久状态

计划、已完成步骤、证据、决定和外部副作用保存在模型上下文之外。即使上下文被压缩、运行进程崩溃或下一次会话继续，系统也能从最后一个持久事件恢复。

**Session（会话记录）不等于 Context Window（上下文窗口）。** Session 可以是持久、只追加的事件史；Context 是每次模型调用临时选入的较小工作集。

### 5. 验证

Harness 检查环境，而不是只检查最终文字：

- 回归测试是否从失败变成通过；
- 现有测试是否仍然通过；
- 浏览器中的真实结账路径是否正确；
- 日志是否出现新错误；
- 静态与安全检查是否满足；
- 补丁是否真正达到任务契约。

好的验证会组合确定性检查、校准过的模型评审和必要的人类判断。生成答案的同一过程不应该是成功与否的唯一裁判。

### 6. 权限闸门

读取仓库和运行本地测试可以自动执行；推送分支、创建 Pull Request 或接触真实客户数据则跨越更高边界。智能体只获得任务需要的能力，后果重大的动作必须经过明确闸门。

### 7. 交付或恢复

如果浏览器验证失败，循环回到观察、归因、修改、再验证。如果沙箱崩溃，系统重建干净环境并从持久状态继续。如果创建 Pull Request 的响应丢失，Harness 会先查询外部系统再重试，避免复制副作用。

## 七个核心责任

### Task Contract · 任务契约

定义可观察结果、约束和完成证据。它约束边界，但不微观管理推理路径。

### Context · 上下文

选择模型现在需要的信息，并提供通往权威知识的地图。更多不一定更好；相关、可导航、保持新鲜才重要。

### Tools & Environment · 工具与环境

把模型意图翻译成对代码、浏览器、数据库或外部服务的动作。清晰接口和隔离使故障更容易归因。

### State · 状态

在上下文窗口之外保存进度、事件、产物和副作用，让长任务可以恢复。

### Verification · 验证

用可复现证据判断环境结果。“工具调用成功”和“业务结果存在”是两个不同主张。

### Permissions · 权限

限制智能体能看见和改变什么。凭证、权限范围、确认和人工闸门共同定义它的权力。

### Recovery & Trace · 恢复与轨迹

记录发生了什么，以及应该从哪里继续。恢复必须理解副作用；盲目重跑可能重复付款、发信或部署。

## 从 Prompt 到 Contract

Prompt Engineering（提示工程）仍然重要，它决定这一轮如何表达意图。Harness Engineering 关心整个任务生命周期怎样运行。

| 层            | 更适合承载什么               |
| ------------- | ---------------------------- |
| Prompt        | 任务语境、语气、当次判断     |
| 版本化文档    | 架构、产品规则、长期知识     |
| Tool schema   | 可执行动作与参数边界         |
| Code / policy | 硬约束、权限、路由、状态转移 |
| Evaluator     | 完成证据、质量门槛、回归检查 |
| Session log   | 事件、决定、产物、恢复位置   |

当一条规则必须稳定执行、可以机械检查、影响安全或需要审计时，它通常不应该只存在于自然语言提示中。

## Harness 是闭环，不是清单

```text
Specify → Observe → Act → Verify
    ↑                     ↓
    └──── Recover / Escalate
```

没有反馈的工具会放大错误；没有契约的上下文只会给模型更多材料去优化错误目标。组件形成闭环以后，才真正产生可靠性。

## 深度要和风险匹配

不是所有任务都需要生产级 Harness。

| 场景                           | 合理深度                             |
| ------------------------------ | ------------------------------------ |
| 一次性改写无敏感信息的段落     | 清晰 Prompt + 人工阅读               |
| 在熟悉仓库修改低风险组件       | 上下文地图 + 隔离环境 + 测试         |
| 连续数小时实现跨文件功能       | 再加入持久状态、进度产物与恢复       |
| 操作账户、付款、邮件或生产数据 | 再加入最小权限、确认、幂等和审计     |
| 高频重复的企业工作流           | 再加入输出契约、持续评估、回归和监控 |

常见错误有两种：把长期、有副作用的工作低估成一条聊天提示；或为一次无风险草稿搭建复杂的分布式运行系统。

## 失败与恢复

### 上下文陈旧

智能体遵循过时的架构文档。解决办法是版本化权威来源，机械检查结构、链接和新鲜度，并在行动前验证当前环境。

### 工具成功，业务结果失败

应用程序接口返回成功，但外部对象不存在或状态不对。必须把“调用成功”和“结果成功”拆开，再次查询环境。

### 过早宣布完成

智能体写出自信总结，却没有复现故障或运行正确测试。应该把验收条件绑定到可执行检查，并保留未通过证据。

### 上下文压缩后丢失状态

后续运行重复调查，或推翻已确认决定。把决定与事件持久化在上下文之外，每次只选入相关片段。

### 沙箱或 Harness 崩溃

让沙箱、Harness 进程和 Session log 解耦；用标准配方重建可丢弃环境，从最后一个持久事件继续。

### 重试复制副作用

重试创建第二个 Pull Request、重复发邮件或重复扣款。使用 idempotency key（幂等键）或业务唯一标识，记录副作用，并在重试前检查外部状态。

### Prompt Injection · 提示注入

不可信内容试图改变目标或窃取秘密。把内容当成数据，让凭证远离沙箱，只授予狭窄工具，并为重要动作要求结构化确认。

### Harness 债务

为旧模型弱点添加的规则，在模型升级后不断累积。Harness 本身也要版本化和评估；利用运行轨迹删除不再产生价值的控制。

## 它与邻居的区别

- **Prompt Engineering 是指令技术**：改善当次运行如何表达意图。
- **Context Engineering 是子系统实践**：管理模型看见什么。
- **Agent Harness 是运行产物**：Harness Engineering 是设计它的实践。
- **Agent Framework 是工具包**：提供零件，不是任务专用运行系统。
- **Model Context Protocol 是集成协议**：连接工具与上下文，不定义完成和权限。
- **Evaluation Harness 是测量设施**：运行并评分受控任务。
- **Durable Execution 是运行保证**：支持检查点、重试和恢复。
- **Capability-Based Security 是权限模型**：只授予最小必要能力。

## 记住这七件事

1. 同一个模型，换一个 Harness，可能就像换了一个产品。
2. Prompt 表达意图；Contract 定义可验证结果。
3. Session 是持久历史；Context 是此刻选入的工作集。
4. 工具提高行动力；验证与权限让行动力变得可靠。
5. 调用成功不等于结果成功。
6. 恢复必须理解副作用，而不是只重跑步骤。
7. Harness 也会腐烂：要版本化、评估和简化。

## 自测

1. 为什么同一个模型在两个团队里可能表现得完全不同？
2. Task Contract 与更详细的 Prompt 有什么区别？
3. 为什么 Session log 应该放在 Context Window 之外？
4. 为什么工具返回成功时，任务仍可能未完成？
5. 能创建 Pull Request 的智能体至少需要哪些验证与权限边界？
6. 哪些无风险的一次性任务不需要完整 Harness？
7. 模型升级以后，为什么要重新评估 Harness 规则？

## Further reading

- [OpenAI, “Harness engineering: leveraging Codex in an agent-first world”](https://openai.com/index/harness-engineering/)
- [OpenAI, “Running Codex safely at OpenAI”](https://openai.com/index/running-codex-safely/) — 说明 OpenAI 的 Codex 部署如何用文件系统与网络边界、受限审批、命令规则、凭证隔离和审计轨迹约束行动。
- [OpenAI, “The next evolution of the Agents SDK”](https://openai.com/index/the-next-evolution-of-the-agents-sdk/) — 说明如何把状态外置，通过 snapshot、rehydration 与新沙箱继续运行。
- [Anthropic, “Effective harnesses for long-running agents”](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic, “Harness design for long-running application development”](https://www.anthropic.com/engineering/harness-design-long-running-apps) — 说明 planner–generator–evaluator 分工、Sprint Contract、Playwright 检查与反馈闭环。
- [Anthropic, “Beyond permission prompts: Claude Code sandboxing”](https://www.anthropic.com/engineering/claude-code-sandboxing) — 说明文件系统与网络隔离、沙箱外凭证及受限 Git 访问。
- [Anthropic, “Demystifying evals for AI agents”](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Anthropic, “Scaling Managed Agents: Decoupling the brain from the hands”](https://www.anthropic.com/engineering/managed-agents)
- [Zhong and Zhu, “AI Harness Engineering”](https://arxiv.org/abs/2605.13357) — 2026 年预印本，提出 model–harness–environment 框架。
- [Ahn and Kim, “From Prompts to Contracts”](https://arxiv.org/abs/2607.08028) — 2026 年预印本，讨论把确定性保证移入代码与验证产物。
