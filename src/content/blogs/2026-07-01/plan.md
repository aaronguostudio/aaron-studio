# Blog Plan: 一个人的项目：AI 时代的软件协作会怎样重组

## Meta

- **Author:** Aaron Guo
- **Target:** aaronguo.com blog (ZH canonical, EN adaptation)
- **Tone:** Entrepreneurial, crisp, insight-led, commercially useful; grounded in product/engineering operating reality
- **Length:** 2200-3000 words Chinese; 1800-2400 words English if adapted
- **Audience:** Product leaders, engineering managers, senior developers, AI-native builders
- **CTA:** reply

## Hook

去年我们开始调整 QA 策略，不是因为 QA 不重要，而是因为 AI-assisted development 把原来的软件交付节奏打穿了。过去一个需求要经过 BA、design、developer、QA、UAT、deploy。现在一个 developer 带着 AI，常常可以在同一个工作循环里澄清需求、提出方案、实现、补测试、写文档。流程没有消失，但它开始压缩到一个更小的责任单元里。

## Thesis

AI 时代的软件协作会从多角色串行交接，转向单 owner 带 AI 执行、团队负责边界和证据的模式。

## Personal Anchor

过去一年 QA 策略的变化：开发侧 AI 加速以后，QA 的问题不再只是测试资源不够，而是知识同步、review bandwidth、上下文理解和风险判断跟不上同一速度；因此质量控制必须从末端 gate，转成更早的 acceptance criteria、测试生成、风险分层、证据审查和生产反馈。

## Outline

### Part 1: 旧流程不是错了，而是单位变了

- Point: BA -> design -> development -> QA -> UAT -> deploy 的流程，是在执行昂贵时代形成的。
- Evidence/example: 每个角色接力是为了降低专业成本和责任风险。
- Personal beat: 现在 AI 让需求理解、实现、测试、文档都可以被一个 owner 快速串起来，QA 的 clock speed mismatch 被放大。

### Part 2: AI 压缩角色，但没有压缩责任

- Point: AI 可以扮演 BA assistant、pair programmer、test generator、documentation assistant、reviewer，但最终责任仍在人。
- Evidence/example: GitHub Copilot coding agent、OpenAI Codex、Claude Code Review 都通过 PR、branch protections、human approval、repo instructions 来把 AI 放进流程。
- Personal beat: 真正变化的是 developer 不再只是写代码的人，而更像一个小型项目 owner。

### Part 3: 新瓶颈是 review bandwidth

- Point: AI 生成速度远大于人类 review 速度。
- Evidence/example: DORA 把 AI 描述为 amplifier；社区讨论集中在 PR backlog、large diffs、architectural drift、review 不线性扩容。
- Personal beat: 多人共同维护时，每个人都要 review 其他人的 AI 输出，沟通成本反而会上升。

### Part 4: 为什么“一个人的项目”会变得合理

- Point: 当上下文能留在一个 owner 身上，AI 的速度才不会被沟通成本吃掉。
- Evidence/example: Shopify 的 AI adoption 和 Roast 显示头部公司在把 AI 工作流结构化，重排 process power。
- Personal beat: 一个 owner 可以让 AI 参与需求澄清、方案比较、实现、测试、文档、回归检查，形成完整闭环。

### Part 5: 反对意见：这不是个人英雄主义

- Point: 一个项目的 owner 不等于一个人孤岛。
- Evidence/example: DORA 2025 强调平台、工作流清晰、team alignment；GitClear/Stack Overflow 提醒信任和代码质量问题。
- Personal beat: AI 时代团队更重要，只是团队协作从过程交接转向 boundary、contract、architecture、risk review。

### Part 6: 新模型：single owner, shared boundary

- Point: 用 Owner, Agents, Boundary, Evidence 框架重建团队协作。
- Evidence/example: Acceptance criteria、generated tests、AGENTS.md/CLAUDE.md、risk-based review、small PRs、observability、production feedback。
- Personal beat: QA 从最后验收变成风险建模和证据系统；developer 从任务执行者变成 agent loop 的 owner。

### Part 7: 结尾：团队不再是流水线

- Point: 旧团队像 assembly line，新团队像 alignment system。
- Evidence/example: 执行成本下降后，稀缺资源变成 judgment、ownership、integration。
- Personal beat: 我不是想削弱团队，而是想让个人能力不被旧流程放慢，同时让团队用更清晰的边界保持一致。

## Visual Ideas

- Cover idea: one accountable builder at the center of a clean workflow loop, surrounded by AI agents and team boundary lines.
- Inline image idea: old pipeline vs new owner loop.
- Inline image idea: Owner / Agents / Boundary / Evidence model.

## Distribution Plan

- Blog: Chinese canonical article with source-backed references and operator frame.
- X: Long-form native post. No main-post link. Use "AI coding 没有让团队协作消失" hook.
- Newsletter / LinkedIn: Short operator teaser from QA strategy shift.
- YouTube: Optional later adaptation focused on "review became the bottleneck."

## Open Questions

None blocking drafting. The article can draft from the supplied personal context and research.

