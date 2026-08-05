# Canon Alignment

## 文章当前判断

这篇文章不是在决定“AI 写的代码是否都要逐行读”，而是在重新定义审查深度的决定变量：

> AI 代码的审查深度，不应由代码是谁写的或 diff 有多少行决定，而应由它有权改变什么决定。越接近 critical system 或 system of record，人类理解越必须从结果与测试下沉到系统不变量、状态传播、恢复路径和关键源码。

它对读者承诺的实用价值，是一套可执行的 Review Depth Ladder。读者离开时应该能够为不同变更设定最低理解层级，而不是只获得“责任不能外包”的正确口号。

Aaron 的个人锚点已经足够具体：没有戏剧化事故，因为顾虑发生在事故之前；任何触及 critical system 或 system of record 的修改都会改变他的 review 模式。正文必须把这写成稳定的 decision rule，不能补造案例。

## 与旧文章的呼应

### 1. 延续《The One-Person Project》的责任判断

旧文已经建立：AI compresses work, but it does not compress responsibility；AI 生成量提高后，review bandwidth 与系统理解成为瓶颈。它还提出 owner、agents、boundary、evidence 四个组成部分，并明确低风险强证据变更可快速通过，权限、迁移、架构等需要重审。

新文不需要再证明这套背景。它应该向前推进一步：当 review 已经成为稀缺资源，如何判断人类理解应该落在哪一层？答案是看变更的 authority、blast radius、reversibility 与 evidence independence。

### 2. 延续《I Gave Codex a Task From a Moving Tesla》的角色变化

旧文的立场不是“我不再写每一行，所以代码不必理解”，而是执行可以分布给 agent，人仍要理解代码、review 输出、维护标准并拥有风险。

新文要解释这里的“理解”不总等于逐行阅读。低风险工作可以通过行为和证据建立足够信心；一旦代码能改写权威状态，理解必须回到系统模型和关键源码。这是对旧观点的精确化，不是撤退。

### 3. 延续《Fable 5 Changed the Unit of AI Work》的 operating contract

旧文把 AI 工作单位从 response 改为 run，并把人类控制放在权限、证据、停止条件、回滚与责任人上。

新文把同一判断落到代码审查：review 的单位也不应只是一段 diff，而应是修改成为系统事实的整条责任链——意图、spec、不变量、实现、独立证据、权威写入、下游传播与恢复能力。

### 4. 与《AI Made Me 10x More Productive. Then I Almost Burned Out》的风险节奏一致

Scatter / Laser 已经表达了可逆、低耦合工作与高依赖、高判断工作需要不同节奏。Review Depth Ladder 与之兼容，但正文不必再次介绍 Scatter / Laser；否则会出现两个竞争框架。

### 5. 与 Blog Memory 的长期 canon 一致

Blog Memory 强调，模型访问与 token spend 不是价值证明；价值来自 intent、run、review、memory 以及 Action、Context、Trust、Outcome、Recursive 的部署系统。

这篇文章位于其中的 Context / Trust / Outcome 交界：代码可以执行什么、它知道哪些边界、什么证据足以信任、结果如何成为组织事实。正文可以体现这些原则，但不要显式套用 ACTOR，以免把一篇聚焦 code review 的文章变成总框架复述。

## 观点升级

### 从责任半径升级为 authority radius

旧文已经反复说 AI 扩大执行半径，也扩大责任半径。这篇文章新增的不是另一遍“人仍负责”，而是：责任深度取决于代码有权改变的现实。五行状态迁移、权限或 ledger 更新，可能比五千行界面代码更值得深读。

### 从 review bottleneck 升级为 review allocation

“人类 review 跟不上 AI 生成”只是问题描述。新文章给出资源配置原则：并非所有代码获得相同人类注意力；review 必须按 boundary、blast radius、reversibility 和 evidence independence 分配。

### 从 evidence 升级为 independent evidence

旧文强调测试、CI、截图、日志等 evidence。新文补上关键限制：若实现、测试和 reviewer 来自同一模型、同一上下文和同一假设，证据可能共享盲点。更多验证代码不自动等于更多独立信心。

### 从 rollback 代码升级为恢复事实

旧文把可回滚作为可信 agent 系统的基本条件。System-of-record 视角进一步说明：回滚代码可能停止新增错误，却未必恢复已被改变的数据、审计轨迹、下游副本和客户信任。对权威状态，恢复往往还需要 reconciliation 或 compensation。

### 区分 critical system 与 system of record

这是当前文章最值得保留的新判断之一：critical system 由失败后果定义；system of record 由事实权威定义。两者经常重合，但不是同义词。这个区别让“高风险代码需要多看”从泛泛常识变成可解释的审查机制。

## 需要避免的惯性

1. **不要再次花大篇幅证明 AI 让执行变便宜。** 《The One-Person Project》已经完成这项工作；正文用一段建立 review bottleneck 即可。
2. **不要把文章写成视频或 X 帖子的摘要。** Mitchell 与 Uncle Bob 只负责制造开场矛盾；Aaron 的 authority / system-of-record 判断必须在前 15% 出现。
3. **不要把 owner、agents、boundary、evidence 全套框架搬回来。** 最多用一句站内链接承接，主框架只保留 Review Depth Ladder。
4. **不要让“理解债”“review 的四种产品”“责任链”和四级阶梯同时争夺中心。** 理解债与 review 的多重功能各用一段服务机制；责任链用于解释；只有阶梯作为读者带走的框架。
5. **不要把“风险分层”写成停止读代码的许可证。** L3 / L4 是累积层级；源码阅读与运行证据相互补充。
6. **不要把 senior 的工作方式包装成 junior 的学习方式。** 资深工程师可能因既有 mental model 而安全地黑箱化常规实现；新人仍需要通过源码形成判断。正文一句承认即可。
7. **不要混淆 critical system 与 system of record。** 前者是后果，后者是权威；无状态权限系统也可能 critical，低流量 ledger 也可能因权威性要求深审。
8. **不要用过多公司或研究数字制造权威感。** 正文优先 Mitchell、Uncle Bob、Aaron，再选 Godot 或 OpenAI 一个简短外部 receipt；Sonar、METR、Cloudflare 与 benchmark 数字留在 ledger。
9. **不要链接草稿。** `one-person-project-ai-coding-v2` 和 `why-ai-companies-are-becoming-deployment-companies` 当前不是合适的公开站内链接。
10. **不要自我引用过多。** 旧文负责承接背景，不应替代本篇的现场论证。
11. **不要让 Review Depth Ladder 看起来只是 Scatter / Laser 换名。** 它的独立价值必须来自 authority、状态传播与“回滚代码不等于恢复事实”的机制。

## 可以加入的 Aaron 判断

正文至少应出现一个明确的第一人称判断，建议以此为中心：

> I do not need to understand every line an AI writes. But if that code can rewrite what the business treats as true, I need to understand the state transition.

中文判断可以更完整地同时覆盖两类边界：

> 我可以不读完 AI 写出的每一行；但只要一项修改能改写组织认定的事实，或造成不可接受的后果，我就必须能解释它如何生效、如何传播，以及出错后如何恢复。

可自然展开为三句，而不是口号堆叠：

- I am not outsourcing judgment. I am deciding where judgment has to sit.
- A green test suite can tell me the implementation satisfied encoded expectations. It cannot tell me that we encoded the right reality.
- For a system of record, rolling back the code is not the same as restoring the truth.

结尾应把身份判断收束成操作规则：工程师不必亲自观察每个实现步骤，但必须确保每个重要变化由某个承担责任的人在正确抽象层真正理解。

## 站内链接建议

最多三个，并且各自只承担一个明确叙事工作：

1. **`/blogs/one-person-project-ai-coding`** — 放在“AI 生成吞吐超过 accountable review”处。它负责提供 review bottleneck 与 owner / boundary / evidence 的背景，不再复述全文。
2. **`/blogs/ai-became-my-operating-system`** — 放在“没有亲手写每一行不等于放弃理解与风险所有权”处。
3. **`/blogs/fable-5-managing-ai-autonomy`** — 放在“review 单位从 diff 扩展到 operating contract 与责任链”处。

不建议链接：

- `ai-two-work-modes`：思想相关，但会引入第二套 Scatter / Laser 框架。
- `one-person-project-ai-coding-v2`：当前是 draft。
- `why-ai-companies-are-becoming-deployment-companies`：当前源文件不是稳定公开锚点。

## Alignment Decision

**PASS — 可以进入正文写作。**

写作时必须守住四项：

1. 在前 15% 给出 “what the code is allowed to change” 的 Aaron 判断，而不是先做外部争论综述。
2. 只让 Review Depth Ladder 成为主框架。
3. 将 critical system / system of record 写成可解释的最低审查边界，并保持两者区别。
4. 诚实使用“事故之前的 operating rule”作为个人锚点，不虚构具体失败故事。

## V2 用户指定的结构例外

Aaron 在 2026-08-02 明确要求改用以下顺序：

`近期争论 → 两人观点与社区分歧 → 工作中的实际挑战 → Aaron 的观点`

因此，显式 thesis 不再强制出现在正文前 15%。标题从开头已经给出 authority 判断，正文先让争论和工作处境把观点“挣出来”，再进入框架。这一例外来自作者的明确叙事选择，不改变核心 canon。

V2 同时删除 Godot 支线、集中自引、senior / junior 分支和重复总结。Review Depth Ladder 仍是唯一主框架，critical system / system of record 的区别、恢复事实的机制和证据独立性均保留。
