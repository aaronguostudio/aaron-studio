# Claim Ledger

Verified on: 2026-08-02

## Claims

| ID | Claim | Type | Source | Source date | Confidence | Article use | Freshness / caveat |
|---|---|---|---|---|---|---|---|
| C1 | Best Partners TV 的视频把 Mitchell Hashimoto 的 “I read the code” 与 Uncle Bob 的“不读 agent 实现、改用测试关卡”组织成一场读 / 不读争论。 | fact | [YouTube 视频](https://www.youtube.com/watch?v=Hh3AmV46epI) | 2026-07-31 | high | 开场语境 | 评论视频，不是两人的原始访谈；关键立场必须回到原帖。 |
| C2 | Mitchell 在介绍一个运行不到 24 小时的多模型工作流后，被问到如何处理错误与不一致，回答 “I read the code.” | fact | [工作流](https://x.com/mitchellh/status/2072715852944957531)；[原回复](https://x.com/mitchellh/status/2072738025344565262) | 2026-07-02 | high | 开场第一极 | 一句话只说明当时的质量门槛，不能扩写为所有代码必须逐行 review。 |
| C3 | Mitchell 明确区分“不 review 自己的代码”与“把代码提交给 OSS 项目、跨过 human boundary”；后者至少应有基本人工审查。 | fact | [Mitchell 原帖](https://x.com/mitchellh/status/2067970516951150721) | 2026-06-19 | high | human boundary 论点 | 原帖重点是 OSS 礼仪与他人时间，不是完整生产安全政策。 |
| C4 | Uncle Bob 表示不读 agent 写的实现，而用单元测试、Gherkin、QA、质量指标、变异测试和覆盖率组成极端约束；他把主要人工工作放在规格与最终测试。 | fact | [Uncle Bob 原线程](https://x.com/unclebobmartin/status/2080257779395154409) | 2026-07-23 | high | 开场第二极 / gauntlet | 个人实验与方法陈述，不是长期效果数据；不要简化成盲信 AI。 |
| C5 | Uncle Bob 以 accountability 解释自己为何仍是工程师，并承认更重的 Gherkin / QA 关卡未必适用于每个小任务。 | fact | [责任线程](https://x.com/unclebobmartin/status/2080257779395154409)；[测试过载限定](https://x.com/unclebobmartin/status/2072736888478175413) | 2026-07-23 / 2026-07-02 | high | 责任与风险调节 | 方法仍在演化，不应把某一套完整关卡写成固定最佳实践。 |
| C6 | OpenAI 公开称一个 agent-first 内部项目由小团队构建约一百万行代码、约 1,500 个 PR，且没有人工手写实现代码；人的工作转向环境、规格、反馈回路和架构边界。 | fact (company-reported) | [OpenAI Harness Engineering](https://openai.com/index/harness-engineering/) | 2026-02-11 | high | 可行性案例 | 内部 greenfield 案例、公司自报、短观察期；不能普遍外推。文中明确说长期 coherence 仍未知。 |
| C7 | Cloudflare 公开了一套最多由七个专用 reviewer 组成的 AI code review 系统，说明验证工作本身也正在被分解和编排。 | fact (company-reported) | [Cloudflare AI code review](https://blog.cloudflare.com/ai-code-review/) | 2026-04-20 | high | 验证自动化趋势 | 只能支持 Cloudflare 的系统与公开主张，不等于独立证明质量改善或人类 review 可删除。 |
| C8 | Sonar 的 1,100 多名专业开发者调查中，96% 表示不完全信任 AI 代码，48% 表示总会验证，38% 表示 review AI 代码比 review 同事代码更费力。 | fact (vendor survey) | [Sonar 2026 survey](https://www.sonarsource.com/blog/state-of-code-developer-survey-report-the-current-reality-of-ai-coding/) | 2026-01-08 | medium-high | 信任 / 行为 gap | 自报、厂商发布、样本代表性有限；数字必须归于 Sonar，不能称全行业。 |
| C9 | Christine Lemmer-Webber 认为代码生成不是软件最慢的部分，形成系统理论、理解与审查才是；AI 速度会把人逐步拉出理解回路。 | fact (attributed opinion) | [Vibe bobsled essay](https://dustycloud.org/blog/faulty-towers-vibe-sickness-and-the-vibe-bobsled/) | 2026-07-17 | high | 最强“必须理解”论证 | 观点文章，不是效果实验；明确归于作者。 |
| C10 | 在熟悉大型 OSS 仓库的资深开发者随机实验中，2025 年初的 AI 工具让参与者平均更慢，即使参与者仍认为自己被加速。 | fact (study result) | [METR study](https://arxiv.org/abs/2507.09089) | 2025-07 | high | 自我感觉并非验证 | 工具代际较旧、样本与任务特殊；只用来挑战主观速度判断，不用于判断 2026 工具的总体效果。 |
| C11 | 当代码生成量提高而人工理解能力没有同步提高时，review bandwidth 会成为瓶颈。 | inference | C6–C10 + [Aaron 的 one-person project](/blogs/one-person-project-ai-coding) | 2026-08-02 synthesis | high | 全文机制 | 是跨来源推断，不是任何单一来源直接证明的普遍定律。 |
| C12 | Mitchell 与 Uncle Bob 表面分歧背后共享一条原则：不要把自己没有完成的验证工作和不理解的后果跨过 human boundary。 | inference | C2–C5 | 2026-08-02 synthesis | high | 原创转折 | 两人没有使用 “verification debt” 这一共同表述；这是 Aaron 的解释。 |
| C13 | 测试能证明实现满足被编码的条件，但不能单独证明规格正确、风险完整或团队形成了系统心智模型。 | inference | C4–C5、C9；软件测试的一般逻辑 | 2026-08-02 synthesis | high | 对 gauntlet 的限制 | 避免绝对化；不同验证技术能提高信心，但都不是一般正确性证明。 |
| C14 | 同一模型从同一上下文生成实现、测试与检查器时，可能在多层复制同一个误解；证据数量不等于证据独立性。 | inference | 由生成过程与共同输入推出 | 2026-08-02 synthesis | medium-high | 原创机制 / 反方 | 需要写成风险机制，不写成每次都会发生的实证频率。 |
| C15 | 逐行阅读不是对巨大 AI diff 可扩展的普遍质量机制，也不是正确性的充分证明。 | judgment supported by evidence | C8–C11 + 人工审查局限 | 2026-08-02 synthesis | high | 核心论点前半 | 不等于源码阅读无用；对关键路径和高风险改动仍必要。 |
| C16 | Review 深度应由 boundary crossing、blast radius、reversibility 和 evidence independence 决定。 | judgment | Aaron's synthesis | 2026-08-02 | high | 核心框架 | 规范性框架，不冒充行业标准；成稿需用真实案例检验。 |
| C17 | Aaron 的 agent 工作流已经让生成速度超过部分任务的 review / understanding speed；任何触及 critical system 或 system of record 的修改都会触发他的顾虑与更深审查。 | personal observation | [The One-Person Project](/blogs/one-person-project-ai-coding)；Aaron 在本次讨论中的明确说明 | 2026-07-01 / 2026-08-02 | high | 个人锚点 / 风险边界 | 前半有既有公开文章支持，后半是本人确认的 operating rule；没有具体事故，不得虚构时间、故障或结果。 |
| C23 | System of record 定义组织所依赖的权威状态；错误修改可能向下游流程传播，且回滚代码不必然恢复已改变的数据、审计轨迹或信任。 | inference / judgment | System-of-record 定义 + Aaron 的 operating rule | 2026-08-02 synthesis | high | 解释个人边界的机制 | 不写成 Aaron 已发生过数据事故；不同系统的恢复能力不同，使用“可能”“未必”。 |
| C18 | Godot Foundation 表示，AI 降低 PR 生成成本，却没有降低合格 reviewer 的稀缺性；其 2026 policy 要求提交者能理解、维护和修复自己的贡献。 | fact (organization policy) | [Godot contribution policy](https://godotengine.org/article/contribution-policy-2026/) | 2026-06-30 | high | 成本外部化 / human boundary 案例 | 开源志愿维护场景，不直接代表公司内部开发；支持的是 Godot 的瓶颈与政策。 |
| C19 | 在 c-CRAB benchmark 中，四种 AI code-review agent 的合并覆盖率为 41.5%，更偏 robustness / testing，较弱于 design、documentation 和 maintainability。 | fact (preprint result) | [c-CRAB](https://arxiv.org/abs/2603.23448) | 2026-03-24 | medium-high | AI review 能力边界 | 预印本；人类问题定义了 benchmark，不能改写成普遍人类 100% 或“AI 只找出 41.5% bug”。 |
| C20 | 对 300 个项目、278,790 段 review 对话的观察研究发现，人类提供更多理解、测试判断与知识传递类反馈。 | fact (observational preprint) | [Human-AI Synergy in Agentic Code Review](https://arxiv.org/abs/2603.15911) | 2026-03-16 | medium-high | review 不只是找 bug | 观察性预印本；有选择偏差与混杂风险，不写因果。 |
| C21 | Code review 同时产生缺陷发现、个人 mental model、团队共同理解和责任归属四类结果；自动测试与 reviewer 主要替代其中一部分。 | inference | C13–C14、C19–C20；[Armin Ronacher](https://lucumr.pocoo.org/2026/7/13/the-tower-keeps-rising/) | 2026-08-02 synthesis | medium-high | 对“测试能否替代 review”的机制解释 | 四分法是 Aaron 的整理，不是来源中的统一 taxonomy；正文应保持紧凑。 |
| C22 | 当变更仍是多人维护的协作界面时，代码可读性和源码 review 的价值高于完全私有、短寿命的黑箱实现。 | inference / judgment | C3、C18–C21；[antirez](https://antirez.com/news/169) | 2026-08-02 synthesis | high | boundary 框架 | 不表示共享代码每行都必须由每个人阅读；强调共同维护义务。 |

## Unsupported Or Excluded Claims

Record claims considered but removed because the evidence was weak, stale, circular, or too promotional.

- “未来没有人会读代码”：过度普遍化，且主要由自动 review 厂商推动，不使用。
- “AI 代码普遍比人类代码更差 / 更好”：现有材料没有统一任务、模型、团队与质量口径，不使用。
- “测试可以替代人类理解”：来源不能支持，且忽略规格与同源盲点，不使用。
- “人工逐行 review 可以保证正确”：阅读不是充分证明，不使用。
- “OpenAI 的方法让所有团队获得 10 倍生产率”：内部估计不可普遍外推，不使用。
- “AI 已写了全行业 42% 的代码”：Sonar 调查的题目与样本不能支撑全行业市场份额，不在正文使用。
- “AI reviewer 只能找出 41.5% 的 bug”：错误解释 c-CRAB benchmark，不使用。
- 视频中无法回到原帖的二次引语，包括对 Cindy Sridharan 的概括，不使用引号。

## Inference Boundaries

State which conclusions are Aaron's interpretation rather than direct claims made by the sources.

- “读 / 不读争论本质上是风险分配问题”是 Aaron 的综合判断。
- “两人都反对跨 human boundary 转嫁 verification debt”是对 Mitchell boundary 帖子和 Uncle Bob accountability 线程的联合解释，不是两人的共同宣言。
- “理解债”是文章拟提出的概念，用来描述未形成系统心智模型带来的未来维护、异常处理与交接成本；当前来源支持机制，不支持可量化债务模型。
- 四级理解深度阶梯是规范性框架，不是学术共识或行业标准。
- “证据不能同源”是审慎原则；文章会把它写成风险控制建议，不写成已经测得的效果量。
- “review 有四种产品”是 Aaron 基于实证研究、从业者观点和自身实践的整理；只把来源支持的各部分写成事实，把四分法本身标为框架。

## Verification Summary

- Primary-source claims checked against the linked page: yes
- Numbers and dates checked: yes
- Promotional sources labeled and balanced: yes
- Article distinguishes fact, inference, and judgment: yes

Aaron's personal anchor is confirmed as a standing decision boundary, not a single incident. The draft must not invent an anecdote.

Decision: PASS
