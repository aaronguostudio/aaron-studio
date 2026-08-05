# Editorial Brief

## Reader Pain

AI 已经可以在一个人还没读完上一段 diff 时继续生成下一段。读者一边担心自己若不逐行看就不再是“真正的工程师”，一边又知道逐行扫过一个巨大 AI diff 很可能只是虚假的安全感。他们缺少的，是决定人类注意力应落在哪一层的风险模型。

## Reader Job To Be Done

读完后，读者应该能为一次 AI 代码变更选择合适的理解与验证深度，并能向团队解释为什么某些变更只需结果和证据，另一些则必须下潜到源码、架构和失败路径。

## One-Sentence Promise

这篇文章不会替你选“读”或“不读”，而会给出一套按边界、失败半径、可逆性和证据独立性分配审查注意力的方法。

## Sharp Thesis

逐行阅读不再是对所有 AI 生成代码都可扩展的质量机制；但理解和责任并没有因此消失。审查深度应取决于代码有权改变什么：越接近 critical system 或 system of record，人类理解越必须从结果与测试下沉到系统不变量、状态传播、恢复路径和关键源码。

## Concrete Opening

Name one scene, contradiction, bottleneck, result, or decision. Do not open with the topic in general.

先从 Aaron 的 operating boundary 开始：他没有一个戏剧化事故可以讲，因为顾虑发生在事故之前。任何触及 critical system 或 system of record（权威记录系统）的 AI 修改，都会让他从“结果是否能运行”切换到“它有权改变什么事实，我是否理解状态转换与恢复”。

紧接着引入 2026 年 7 月的公开矛盾：Mitchell Hashimoto 用 “I read the code” 回答质量问题；三周后，Uncle Bob 说自己不读智能体写的实现，而依靠极端验证关卡。开头 150 词内指出：两人不是在争论人是否负责，而是在争论人类理解应该落在哪一层。不要从“AI 正在改变世界”开始，也不要虚构具体事故。

## Original Contribution

State what this article adds beyond the source material and Aaron's prior posts.

1. 把读 / 不读从职业身份争论重写成风险分配与边界设计问题。
2. 证明 Mitchell 与 Uncle Bob 的共同原则比表面分歧更重要：不把未经验证的理解成本跨过 human boundary。
3. 提出四级“理解深度阶梯”：行为、证据、系统模型、源码关键路径。
4. 加入两个视频没有充分展开的限制：测试不能证明规格正确；同源模型生成的实现与验证可能共享盲点。
5. 提出“理解债”：系统可以暂时在黑箱状态下工作，但团队会在异常、维护和交接时支付没有形成心智模型的成本。
6. 区分两种常被混在一起的风险：critical system 由失败后果定义；system of record 由事实权威定义。前者可能造成巨大 blast radius，后者的错误会持久存在并向依赖该事实的系统传播。

## Why Aaron Can Write This

Aaron 已经把 agent 用在完整编码任务，而不仅是 autocomplete。他的既有文章持续记录了同一个迁移：从亲手完成每一步，转向设计任务、边界、证据、review 和回滚。他不是在替某一种 IDE 或测试产品辩护，而是在解决自己的 review bandwidth 与责任错配。

## Authority And Scope Boundary

State what Aaron knows directly, what is inferred, and what the article will not claim.

- Aaron 直接知道：自己的 AI 工作流如何产生代码、证据与 review bottleneck；他已明确确认，任何触及 critical system 或 system of record 的修改都会触发更深理解与审查。
- 文章可以推断：随着生成量提升，未改变的人工 review 流程会承压；但不能声称所有团队已经停止读代码。
- Mitchell 与 Uncle Bob 的帖子是个人工作方法与公开立场，不是缺陷率或长期维护成本的对照实验。
- OpenAI、Cloudflare、Sonar 和 CodeRabbit 的材料只能支持各自公开的内部案例、调查或产品观点，不能作为行业普遍效果证明。
- 不讨论安全关键、医疗、航空或监管软件的完整合规方法；只将它们列为必须提高审查深度的显然边界。
- 不声称测试可以替代架构理解，也不声称人工逐行 review 足以证明代码正确。

## Evidence Needed

1. Mitchell “I read the code” 的原始问答语境，以及他对跨越 OSS human boundary 的更完整立场。
2. Uncle Bob “不读实现 + 极端约束 + 我因承担责任而是工程师”的原始线程与后续限定。
3. 人工源码审查并非充分条件的反例，以及测试 / 约束同样存在规格与同源盲点的论证。
4. 至少一个 AI-native 团队把人的角色上移到规格、边界和验证系统的真实案例，并保留其样本与时间边界。
5. Aaron 已确认的 personal operating rule：critical system 与 system-of-record 变更是最低审查深度上升的触发器。正文需要解释为什么权威状态、级联影响、不可逆写入与恢复可信度使这条边界成立，不需要虚构具体事故。

## Counterargument

最强反方不是“人类应该手写所有代码”，而是：不读实现会逐渐摧毁团队的系统理论。测试只覆盖已经想到的问题；同一模型还可能在实现、测试与检查器里复制同一个误解。即使短期行为正确，没有人形成心智模型的系统也会在异常、维护、交接和事故解释时暴露理解债。对 junior 工程师而言，阅读还承担学习作用，不能只按交付风险计算。

文章的回答必须让这个反方改变结论：风险分层不是停止阅读的许可证。高风险、不可逆、跨团队或证据薄弱的工作必须下潜；团队还需要周期性的源码深读与明确的架构所有权。低风险工作上移 review 层级，是为了把有限的人类理解留给真正需要它的地方。

## Reusable Frame

### Review Depth Ladder / 理解深度阶梯

先问四个问题：

1. **Boundary**：变更是否跨过另一个人、团队、客户、数据或生产边界？
2. **Blast radius**：失败能影响多大范围？
3. **Reversibility**：能否快速发现并安全回滚？
4. **Evidence independence**：验证证据是否独立于写实现的同一模型、同一上下文和同一假设？

再选择最低可接受的审查层级；更深层级包含前面的检查，而不是替代它们：

- **L1 — Outcome / 行为层**：低风险、短寿命、完全可逆；验证用户可见结果。
- **L2 — Evidence / 证据层**：有边界但风险有限；检查测试、日志、CI、截图、静态检查与独立 agent review。
- **L3 — System Model / 系统层**：共享或生产变更；人必须能解释数据流、依赖、不变量、失败模式与回滚。
- **L4 — Source / 源码层**：权限、资金、隐私、删除、迁移、并发、安全与核心架构；阅读关键 diff 和关键路径，必要时逐段证明。

对 Aaron 而言，critical system 或 system of record 的修改最低从 L3 开始，并通常进入 L4。原因不是代码由 AI 写，而是这类系统定义组织所相信的“事实”；一旦错误状态被写入并向下游传播，单纯 rollback 代码未必能恢复数据与信任。

## Distribution Hook

> Mitchell Hashimoto 说他用 AI 写代码，因为他会读代码。Uncle Bob 说他用 AI 写代码，所以他不再读代码。奇怪的是，他们可能都对。

视觉锚点：一张“Review Depth Ladder”，横轴从 private / reversible 到 shared / irreversible，纵轴从 outcome 到 source。

## Success Hypothesis

延续 growth context 中的 `deep_reader_signal`：用一个具体、当前、可验证的工程矛盾开场，而不是泛泛谈 AI；把 Aaron 已有的“单人项目 / 共享边界”框架迁移到 code review。成功信号是读者能用这套阶梯描述自己的 review policy，并在评论中提供边界案例。数据判断需保留 `linkedin_manual_import_missing` 的测量 caveat。

## Kill Criteria

- 文章没有在前 150 词提出“谁承担不理解的后果”。
- 四级阶梯无法解释为什么一个普通工具变更与 system-of-record 写入应有不同最低审查层级。
- Aaron 的个人部分被写成虚构事故，而不是诚实呈现他对 critical system / system of record 的稳定边界。
- 正反双方没有被公平呈现：把 Uncle Bob 写成盲信 AI，或把 Mitchell 写成坚持每行代码都必须由人审。
- 使用厂商数据时删掉样本、内部案例或自报调查等边界。
- 结尾停在“责任不能外包”的口号，没有给读者一条可执行规则。
