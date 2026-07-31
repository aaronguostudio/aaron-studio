---
type: concept
date: 2026-07-24
updated: 2026-07-24
title: "Harness Engineering"
aliases: [Agent Harness Engineering, 智能体运行支架工程, 智能体护航系统工程]
domain: [artificial-intelligence, software-engineering, agent-systems]
tags: [agents, context, tools, state, evals, permissions, recovery]
status: active
maturity: growing
related:
  [
    prompt-engineering,
    context-engineering,
    agent-harness,
    agent-framework,
    model-context-protocol,
    evaluation-harness,
    durable-execution,
    capability-security,
  ]
---

# Harness Engineering · 智能体运行支架工程

> **一句话：** 模型提供能力；Harness Engineering 把任务契约、上下文、工具、状态、验证、权限与恢复组织成一个可运行、可检查、可替换的系统。

> **术语说明：** Harness Engineering 是 2026 年正在成形的工程术语，还不是边界完全稳定的标准学科。不同团队会把其中一部分称为 agent infrastructure、scaffolding、runtime、orchestration 或 context engineering。本页使用它来指：**围绕可替换模型，设计使智能体可靠完成真实任务的运行系统。**

这里讨论的智能体，主要指由人工智能（Artificial Intelligence，AI）模型驱动、能够通过工具观察和改变环境的软件系统。

## 它在解决什么问题？

为什么同一个模型，在一个环境里能连续工作六小时、验证修改并安全交付；换到另一个环境，却会猜错仓库结构、忘记做到哪里、把“看起来完成”当成“已经通过”？

差别经常不只在模型能力，而在模型周围的系统。

一个裸模型可以生成下一段文字。一个能完成真实工作的智能体还必须知道：

- 任务到底要达到什么可观察结果；
- 当前项目中哪些信息可信、从哪里继续寻找；
- 可以调用哪些工具，工具能做什么、不能做什么；
- 工作进度与外部副作用怎样被持久记录；
- 什么证据才足以宣布完成；
- 哪些动作可以自动执行，哪些必须得到批准；
- 中断、工具失败或上下文丢失以后如何恢复。

如果这些问题只存在于一条越来越长的提示词中，系统通常会变得脆弱：提示会腐烂，状态会丢失，权限会过宽，验证会被自我报告替代。Harness Engineering 把需要稳定、可执行、可审计的部分移到提示之外。

## 先用一个生活例子：机床与工装

一台高性能数控机床有很强的加工能力，但工厂不会只把一块金属和一句“做成合格零件”交给它。

可靠生产还依赖：

- **图纸与公差**：定义什么叫做合格结果；
- **夹具与定位销**：让材料每次处在正确位置；
- **刀具与行程限制**：限定机器怎样作用于环境；
- **工序卡与批次记录**：知道当前做到哪一步；
- **量规与抽检**：测量零件，而不是听机器说“完成了”；
- **防护门与授权**：危险动作需要边界和批准；
- **停机与复位程序**：断电或撞刀后能安全恢复。

机床像模型；这一整套工装、量规、记录和安全流程像 harness。

一个更好的模型，可能让加工策略更聪明，却不会自动替你定义公差、保管批次记录或决定谁可以解除防护门。反过来，优秀的工装也不能把能力不足的机床变成万能机器。可靠结果来自 **model × harness × environment** 的组合。

## 一个技术例子：修复结账 Bug 并创建 Pull Request

任务是：

> 修复“优惠券与礼品卡同时使用时，订单总额会变成负数”的问题，补上回归测试，并创建一个 Pull Request（拉取请求）。

### 只有模型

模型可能：

1. 根据文件名猜测结账逻辑的位置；
2. 修改一个看起来相关的函数；
3. 写一条没有覆盖真实故障路径的测试；
4. 在未运行应用的情况下总结“修复完成”。

输出可能语气自信，但没有足够证据把“补丁存在”升级成“任务完成”。

### 加上 Harness

同一任务可以被组织成一条有证据的运行链：

```text
任务契约
→ 上下文地图
→ 隔离工具环境
→ 可持久状态
→ 验证与评审
→ 权限闸门
→ 交付或恢复
```

#### 1. 任务契约

把模糊意图改写为可验证的完成条件：

- 能复现优惠券与礼品卡组合导致的负数总额；
- 修复后总额不低于零；
- 现有折扣规则不回归；
- 新回归测试先失败、修复后通过；
- 只有验证通过后才允许创建 Pull Request。

任务契约不是把实现步骤全部写死。它固定的是结果边界与证据要求。

#### 2. 上下文地图

智能体先读取短入口，再按需深入：

```text
AGENTS.md
→ 架构地图
→ checkout 领域说明
→ 相关测试与运行命令
→ 当前任务的历史与约束
```

这比把全部文档塞进一个巨型提示词更有效。入口告诉它“去哪里找”，权威文档负责“什么是真的”，可执行代码与测试负责“现在是否仍然是真的”。

#### 3. 隔离工具环境

智能体在独立工作树或 sandbox（沙箱）中读取代码、编辑文件、运行测试、启动应用并操作浏览器。工具权限按任务最小化；生产凭证不进入生成代码可以访问的执行环境。

#### 4. 可持久状态

计划、已完成步骤、验证结果、关键决策与外部副作用写入模型上下文之外的持久记录。上下文压缩、进程崩溃或下一次会话开始时，新运行可以从最后一个可确认事件恢复，而不是靠模型“记住”。

#### 5. 验证与评审

系统不只检查最终文字，而是检查环境结果：

- 回归测试是否从失败变为通过；
- 全部既有测试是否仍然通过；
- 浏览器中的真实结账路径是否正确；
- 日志中是否出现新的错误；
- 静态检查和安全规则是否满足；
- 补丁是否真正覆盖任务契约。

验证最好由确定性检查、模型评审与必要的人类判断组合完成。让同一个生成过程独自判断自己的成功，通常过于宽松。

#### 6. 权限闸门

读取仓库、运行本地测试可以自动执行；推送分支、创建 Pull Request 或触碰真实客户数据则进入更高权限边界。权限应基于能力和资源授予，而不是让智能体持有一个无边界的万能凭证。

#### 7. 交付或恢复

如果浏览器验证失败，运行回到“观察 → 归因 → 修改 → 再验证”。如果沙箱崩溃，新的沙箱根据配方重建，并从外部会话记录继续。如果创建 Pull Request 的响应丢失，系统先查询是否已创建，避免重复副作用。

## Harness 的七个核心责任

### 1. Task Contract · 任务契约

把“做点什么”变成可观察的结果、限制与完成证据。好的契约约束边界，不微观管理每一步推理。

### 2. Context · 上下文

选择此刻需要进入上下文的信息，并提供继续发现信息的地图。关键不是“越多越好”，而是权威、相关、可定位、能保持新鲜。

### 3. Tools & Environment · 工具与环境

把模型的意图翻译成对代码、浏览器、数据库或外部服务的动作。工具接口要有明确参数、错误语义、超时和隔离边界。

### 4. State · 状态

在上下文窗口之外保存任务进度、事件、产物与副作用。**Session（会话记录）不等于 Context Window（上下文窗口）**：前者可以持久、追加和重放；后者只是模型这一次能看到的有限工作集。

### 5. Verification · 验证

用环境状态与可复现证据判断结果，而不是只检查最终回答是否听起来合理。代码任务可以运行测试；研究任务可以检查来源与覆盖；业务流程可以查询真实对象状态。

### 6. Permissions · 权限

限制智能体能看见什么、能调用什么、能影响谁。高风险或不可逆动作需要更窄的凭证、明确的确认点和可追踪的责任边界。

### 7. Recovery & Trace · 恢复与轨迹

记录发生了什么、为什么失败、从哪里继续。重试需要理解外部副作用；恢复不只是“再跑一次”，而是避免重复扣款、重复发信或覆盖已经完成的工作。

## 从 Prompt 到 Contract

Prompt Engineering（提示工程）仍然重要，但它承担的是**这一轮如何表达意图**。Harness Engineering 关心的是**整个任务生命周期怎样可靠运行**。

一个实用的分配原则是：

| 放在哪里        | 更适合承载什么               |
| --------------- | ---------------------------- |
| Prompt          | 任务语境、语言风格、当次判断 |
| Repository docs | 架构、产品原则、长期知识     |
| Tool schema     | 可执行动作与参数边界         |
| Code / policy   | 硬约束、权限、路由、状态转移 |
| Evaluator       | 完成证据、质量门槛、回归检查 |
| Session log     | 事件、决定、结果、恢复位置   |

当一条规则必须稳定执行、可以机械检查、影响安全或需要审计时，它通常不应该只存在于自然语言提示中。

## 一条最小闭环

Harness 不等于组件清单。组件只有形成闭环才产生可靠性：

```text
Specify → Observe → Act → Verify
    ↑                     ↓
    └──── Recover / Escalate
```

- **Specify**：定义任务和完成条件；
- **Observe**：获得与当前状态相符的上下文；
- **Act**：通过受控工具改变环境；
- **Verify**：检查真实结果；
- **Recover**：从失败中继续，或把需要判断的部分升级给人。

缺少反馈回路时，更多工具只会放大错误；缺少任务契约时，更多上下文只会让模型更有材料去优化错误目标。

## 深度不是越多越好

Harness 应与任务风险和持续时间匹配。

| 场景                           | 合理深度                               |
| ------------------------------ | -------------------------------------- |
| 一次性改写一段无敏感信息的文案 | 清晰 Prompt + 人工阅读                 |
| 在熟悉仓库中修改一个低风险组件 | Context map + 隔离环境 + 测试          |
| 连续数小时完成跨文件功能       | 再加入持久状态、进度产物、恢复         |
| 操作账户、付款、邮件或生产数据 | 再加入最小权限、确认、幂等与审计       |
| 高频重复的企业工作流           | 再加入契约化输出、持续评估、回归与监控 |

最常见的两种错误是：

- **欠设计**：把长时间、有副作用的任务当成一条聊天提示；
- **过度设计**：为一次无风险草稿搭建复杂的分布式运行平台。

## 典型失败与恢复

### 上下文陈旧

**症状：** 智能体遵循已失效的架构说明。

**恢复：** 权威文档版本化；让结构测试、链接检查与文档园艺持续发现漂移；让运行先验证当前环境。

### 工具返回成功，但结果没有发生

**症状：** 工具调用响应正常，外部对象却不存在或状态不对。

**恢复：** 把“调用成功”和“业务结果成功”分开；再次查询环境状态；以结果验证作为完成条件。

### 自我宣布完成

**症状：** 智能体写出漂亮总结，却没有运行测试或覆盖失败路径。

**恢复：** 把验收条件绑定到可执行检查；生成者与评估者分离；保留未通过证据。

### 上下文压缩后丢失关键决定

**症状：** 后续会话重复调查，或推翻已经确认的约束。

**恢复：** 把决定、进度和事件写入上下文之外的持久 session log（会话记录）；上下文只选择当前必要片段。

### 沙箱或 Harness 崩溃

**症状：** 运行中断，进度与产物无法确定。

**恢复：** 让沙箱、harness 进程和 session 解耦；用标准配方重建执行环境；从最后一个持久事件恢复。

### 重试复制副作用

**症状：** 重复创建 Pull Request、发送邮件或执行付款。

**恢复：** 为外部意图设置 idempotency key（幂等键）或业务唯一键；重试前查询结果；把副作用事件持久化。

### Prompt Injection · 提示注入

**症状：** 不可信网页或文件中的文字诱导智能体泄露信息、扩大权限或改变目标。

**恢复：** 把不可信内容视为数据；使用最小权限、工具代理和独立凭证库；危险动作需要结构化确认；生产秘密永远不进入生成代码可读的沙箱。

### Harness 自己变成负担

**症状：** 为旧模型弱点写的提示补丁、复杂路由和重复防护，在模型升级后仍不断叠加。

**恢复：** Harness 也要版本化和评估；定期删除不再产生增量价值的规则；用 trace（运行轨迹）识别真正的失败归因。

## 什么时候适合 / 不适合？

### 更适合投资 Harness Engineering

- 任务跨越多个步骤、工具或上下文窗口；
- 输出会改变代码、账户、数据或外部世界；
- 失败成本高，必须能够解释与复现；
- 同一类任务会被频繁重复；
- 模型、工具或执行环境需要可以独立替换；
- “完成”可以被环境状态或评估器验证。

### 不要期待它解决

- 模型根本没有完成任务所需的基础能力；
- 目标本身矛盾、不可测量或持续变化；
- 权威知识从未被记录；
- 组织不愿定义谁可以批准高风险动作；
- 评估器只测代理指标，却和真实用户结果脱节。

Harness 可以约束、暴露、恢复和验证能力，但不能凭空创造缺失的领域知识，也不能替代产品判断。

## 容易混淆的概念

| 概念                                                                           | 关系类型   | 与 Harness Engineering 的区别                                                                      |
| ------------------------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------- |
| Prompt Engineering（提示工程）                                                 | 指令技术   | 优化模型这一轮收到的表达；Harness Engineering 设计跨步骤、跨工具和跨失败的运行生命周期。           |
| Context Engineering（上下文工程）                                              | 子系统实践 | 管理选择、组织、压缩与更新模型所见信息；它是 Harness 的核心层，但不涵盖全部权限、执行和恢复。      |
| Agent Harness（智能体运行支架）                                                | 运行产物   | Harness 是实际调用模型、路由工具和维护循环的系统；Harness Engineering 是设计、构建和改进它的实践。 |
| Agent Framework / Software Development Kit（SDK，智能体框架 / 软件开发工具包） | 工具包     | 提供循环、工具调用或 tracing（轨迹记录）原语；团队仍需为具体任务设计契约、状态、验证和权限。       |
| Model Context Protocol（模型上下文协议）                                       | 集成协议   | 标准化工具与上下文的连接方式；不替你决定任务何时完成、如何恢复或谁有权限。                         |
| Evaluation Harness（评估支架）                                                 | 测量设施   | 在受控任务上运行并评分模型或智能体；生产 Agent Harness 负责真实工作，二者应共享契约但目标不同。    |
| Durable Execution（持久执行）                                                  | 运行保证   | 提供 checkpoint（检查点）、重试与恢复语义；它支撑 Harness 的状态层，但不定义智能体的上下文和评估。 |
| Capability Security（能力安全）                                                | 权限模型   | 以最小可用能力授予权限；它是 Harness 权限层的安全基础。                                            |

## 概念邻居

- **[[prompt-engineering]] · 指令技术**：表达当次任务与行为偏好。
- **[[context-engineering]] · 子系统实践**：决定模型此刻看见什么，以及怎样从持久知识中继续发现。
- **[[agent-harness]] · 运行产物**：实际承载模型循环、工具路由、状态和反馈。
- **[[agent-framework]] · 工具包**：提供构建 Harness 的通用原语，不等于完成的业务运行系统。
- **[[model-context-protocol]] · 集成协议**：连接工具和上下文的标准接口。
- **[[evaluation-harness]] · 测量设施**：以可复现任务、环境和 grader（评分器）评估结果。
- **[[durable-execution]] · 运行保证**：让长任务可以 checkpoint、重试和恢复。
- **[[capability-security]] · 权限机制**：把模型可调用的能力限制在任务所需的最小范围。

## 常见误区

### “Harness 就是一个更长、更好的 system prompt”

Prompt 只是输入层。持久状态、隔离环境、权限、验证、重试语义和审计轨迹不能可靠地只靠提示词实现。

### “用了 Agent Framework，就已经有 Harness”

Framework 提供零件；Harness 是为具体任务装配并验证过的运行系统。就像买了 Web 框架不等于已经拥有安全、可观测、可恢复的产品。

### “更强模型会让 Harness 消失”

模型变强会删除一部分补丁式脚手架，但真实系统仍需要任务契约、权限边界、外部状态和完成证据。更强能力甚至会提高不受控动作的潜在影响。

### “更多自主性就是更少人类”

成熟 Harness 不是取消人，而是把人放在更有价值的位置：定义目标、处理歧义、批准高风险动作、校准评估，并把重复判断编码成系统。

### “只要最终答案正确，过程不重要”

在无副作用的小任务中，结果优先通常合理；在账户、代码或生产系统中，权限使用、来源、失败归因和副作用同样是结果的一部分。

## 最小记忆卡

- **同一模型，不同 Harness，可能是不同产品。**
- **Prompt 表达意图；Contract 定义可验证结果。**
- **Session 是持久事件史；Context 是此刻选入模型的工作集。**
- **工具扩大行动力，验证与权限决定这种行动力是否可靠。**
- **“调用成功”不等于“业务结果成功”。**
- **恢复必须理解副作用，不能只是盲目重跑。**
- **Harness 也会腐烂：版本化、评估、删掉过时假设。**

## 自测

1. 同一个模型为什么会在两个团队中表现得像两个不同产品？
2. Task Contract 与一条更详细的 Prompt 有什么区别？
3. 为什么 session log 不能只放在模型的 context window 里？
4. 工具调用返回成功状态时，为什么任务仍可能没有完成？
5. 一个智能体能够创建 Pull Request 时，最少需要哪些验证与权限边界？
6. Context Engineering、Agent Framework 与 Evaluation Harness 分别属于什么关系？
7. 哪类一次性任务不值得搭建完整 Harness？
8. 模型升级后，为什么应该重新评估并删除部分 Harness 规则？

## Further reading

- [OpenAI, “Harness engineering: leveraging Codex in an agent-first world”](https://openai.com/index/harness-engineering/) — 从真实 agent-first 软件团队解释可读环境、仓库知识、机械约束、反馈回路与持续清理。
- [OpenAI, “Running Codex safely at OpenAI”](https://openai.com/index/running-codex-safely/) — 说明 OpenAI 的 Codex 部署如何用文件系统与网络边界、受限审批、命令规则、凭证隔离和审计轨迹约束行动。
- [OpenAI, “The next evolution of the Agents SDK”](https://openai.com/index/the-next-evolution-of-the-agents-sdk/) — 说明如何把状态外置，通过 snapshot、rehydration 与新沙箱继续运行。
- [Anthropic, “Effective harnesses for long-running agents”](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — 通过进度产物、功能清单、测试工具和跨会话交接支持长时间任务。
- [Anthropic, “Harness design for long-running application development”](https://www.anthropic.com/engineering/harness-design-long-running-apps) — 说明 planner–generator–evaluator 分工、Sprint Contract、Playwright 检查与反馈闭环。
- [Anthropic, “Beyond permission prompts: Claude Code sandboxing”](https://www.anthropic.com/engineering/claude-code-sandboxing) — 说明文件系统与网络隔离、沙箱外凭证及受限 Git 访问。
- [Anthropic, “Demystifying evals for AI agents”](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — 解释 outcome、trajectory、不同 grader 与回归评估如何共同判断智能体。
- [Anthropic, “Scaling Managed Agents: Decoupling the brain from the hands”](https://www.anthropic.com/engineering/managed-agents) — 将 model、harness、session 与 sandbox 分离，以支持恢复、替换和凭证隔离。
- [Hailin Zhong and Shengxin Zhu, “AI Harness Engineering: A Runtime Substrate for Foundation-Model Software Agents”](https://arxiv.org/abs/2605.13357) — 2026 年预印本，提出 model–harness–environment 系统与十一项运行责任。
- [Joongho Ahn and Moonsoo Kim, “From Prompts to Contracts”](https://arxiv.org/abs/2607.08028) — 2026 年预印本，讨论将确定性保证移入代码、manifest、schema 与 validator。
