---
title: "一个人的项目"
date: 2026-07-01
slug: one-person-project-ai-coding-v2
category: ai-native-systems
tags: [ai-coding, software-teams, code-review, ownership]
draft: true
---

# 一个人的项目

最早的信号不是线上事故，而是 QA 队列开始变得不对劲。

去年我们开始调整 QA 策略。不是因为 QA 不重要了，恰恰相反，是因为 AI-assisted development 改变了团队的 clock speed。

过去的软件交付链路很熟悉：BA 理解需求，design 做方案，developer 开发，QA 测试，UAT 验收，然后 deploy。这个流程并不愚蠢。它是在“执行很贵”的时代里形成的。写代码慢，改代码慢，理解系统也慢，所以团队把工作拆给不同角色，用交接来分摊成本和风险。

AI 改掉的是成本结构。

现在，一个 developer 带着 AI，常常可以在同一个工作循环里完成过去几个角色之间来回交接的事情：让 AI 复述用户需求，列出方案，比较 edge cases，生成实现，补测试，写文档，解释 diff，甚至准备第一轮 review summary。

听起来像是生产力提升。落到真实团队里，它很快会变成一个协作问题。

代码、测试、文档、方案都出现得更快了。但 review、风险判断、产品上下文、系统理解没有同速增长。QA 需要验证更多变化，却拿到更少共享上下文。reviewer 需要读更大的 diff，而这些 diff 背后往往是一个人带着 AI 跑了很远。知识差距不但不会自动缩小，反而可能被拉大。

这就是为什么我最近一直在想一个听起来很朴素的说法：一个人的项目。

我说的不是一个人孤立工作，也不是取消 QA、削弱 review，或者把软件团队变成一群 solo operator。我的意思是，AI 时代的软件协作单位会变：一个 accountable owner 掌握某个项目或模块的完整上下文，带着 AI 完成需求澄清、方案设计、实现、测试、文档和迭代；团队则负责边界、接口、标准、证据和集成。

AI 没有让团队协作消失。它改变了团队协作应该发生的位置。

## 旧流程解决的是旧瓶颈

流水线式的软件流程曾经很合理，因为当时最稀缺的是执行能力。

如果写代码和改代码都慢，把责任拆给 BA、design、engineering、QA、UAT、release management 是有意义的。每个角色吃掉一段复杂度，每次交接也给团队一个降低风险的机会。这个过程成本很高，但在那个环境里，它是可以接受的成本。

AI 让这笔账变了。

当实现变便宜，交接成本就会变得刺眼。每一次 handoff 都需要有人重新建立上下文。每个角色只能看到一部分 intent。每一次等待，都会把最初的用户问题和最后的代码变化拉远。过去这些成本是 coordination 的一部分；现在它们可能变成主要的 tax。

更麻烦的是，AI 最先提升的是最容易被看见的东西：output。更多代码，更多测试，更多 summary，更多方案，更多 review comment，更多 artifact。但团队仍然要判断什么重要，什么安全，什么应该上线，什么必须停下来。

这就是新的压力点：AI 压缩了工作，但没有压缩责任。

## 能生成，不等于能负责

头部工具的方向已经很清楚。

[GitHub Copilot coding agent](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/) 可以接一个 issue，在后台环境里工作，开 PR，留下 logs，然后等待人类 review。[OpenAI Codex cloud](https://developers.openai.com/codex/cloud) 也是类似形态：读代码、改代码、跑代码、创建 pull request。[Codex code review](https://developers.openai.com/codex/integrations/github) 会根据 `AGENTS.md` 这样的仓库规则做 review，并且聚焦高优先级风险。[Claude Code Review](https://code.claude.com/docs/en/code-review) 可以分析 PR，但不会 approve，也不会 block。

这些产品设计本身就说明了一件事：agent 可以做更多工作，但 approval structure 仍然在人身上。

AI 可以开 PR，人要接受风险。AI 可以写测试，人要判断这些测试能不能算 evidence。AI 可以解释 diff，人要判断这个解释够不够真实。AI 可以遵守 repo instructions，但团队要先写出这些 instructions。

developer 的角色因此发生了变化。

过去 developer 很多时候是流程里的一个执行角色。需求已经被上游处理过，QA 会在下游接住一部分问题。developer 当然有责任，但流程会替他分担一部分认知负荷。

现在 AI 把更多工作压缩到 developer 身边。离代码最近的人，已经有足够的工具能力去理解需求、测试假设、实现方案、补测试、准备上线证据。这个人不再只是写代码的人，更像一个小型项目 owner。

这不是 title 的升级，而是责任半径的扩大。

## 新瓶颈是 review bandwidth

AI coding 最明显的能力是速度。它可以在几分钟内写出几百行代码、多个测试文件、一份设计说明、一个 migration plan 和一段 review summary。

人的 review 速度没有同步变快。

这会制造一个很危险的错觉：每个 developer 都生成更多，每个 reviewer 都 review 更多，然后团队把这个叫 productivity。短时间看起来很有效。很快，PR 会变大，上下文会变薄，review comment 会变浅。人们开始批准一些“看起来合理”的东西，因为每个人都忙。

瓶颈从“我们写得不够快”变成“我们理解变化的能力不够快”。

DORA 的研究很有价值，因为它把这个问题放回到系统层面。[2024 DORA 报告](https://dora.dev/research/2024/dora-report/)发现，AI adoption 和个人 productivity、flow、job satisfaction 正相关，但和 delivery throughput、stability 有负面关联。后来的 [generative AI report](https://dora.dev/ai/gen-ai-report/report/)把机制说得更清楚：代码生成变快以后，batch size 容易变大；batch 变大以后，review 更难，系统也更容易不稳定。[2025 DORA 报告](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)里，AI adoption 已经接近普遍，throughput 的关系有所改善，但 stability 仍然是下游弱点。

这里的教训不是“AI 对交付有害”。更准确的说法是：AI 会放大它进入的那个系统。一个有清晰 ownership、强 feedback loop、强 evidence 的团队会更快；一个边界模糊、review 已经超载的团队，只会生成更多自己消化不了的工作。

社区讨论也在讲同一件事。Hacker News 上一个 code review 工具的 [讨论](https://news.ycombinator.com/item?id=47796818)里，作者提到 coding agents 起来之后，PR backlog 变多，PR 更大，也更难理解。Reddit 的 ExperiencedDevs 里也有人问，AI-assisted output 上升后，团队怎么防止 [architectural drift](https://www.reddit.com/r/ExperiencedDevs/comments/1t1scp3/how_are_experienced_teams_preventing/)，因为 review capacity 不会线性扩容。

这句话就是问题本身：review capacity does not scale linearly。

如果团队只是让每个人生成更多代码，review system 会变成被压爆的 gate。如果团队把 AI 的速度硬塞回旧流程，真正的杠杆又会被浪费掉。更难的答案，是重新设计 ownership 的单位。

## 为什么一个 owner 会变得合理

如果上下文是稀缺资源，那让上下文尽量留在一个 owner 身上，就变得很有价值。

这才是“一个人的项目”真正值得讨论的地方。一个边界清楚的项目或模块，应该有一个人负责完整闭环：用户意图、系统约束、实现方案、测试策略、上线风险、后续迭代。其他人仍然参与，团队仍然 review 关键边界，但工作不必在一条长链路里移动，让每个角色都重新理解同一个 intent。

AI 扩大的是这个 owner 的执行半径。

没有 AI 的时候，一个强 owner 也会被很多具体劳动拖慢：boilerplate、test scaffolding、调用链调查、release notes、QA checklist、migration notes、方案比较、文档清理。现在这些事情都可以让 AI 参与。owner 的工作从“亲手做每一步”，变成“设计这个 loop，并判断 evidence 够不够”。

Shopify 的实践很值得看。First Round 对 [Shopify AI adoption](https://www.firstround.com/ai/shopify) 的报道里，Shopify 给员工广泛开放 AI tools，也把 reflexive AI usage 变成一种明确期待，甚至进入 performance conversation。但真正有意思的不是口号，而是它对流程的理解。Shopify 工程负责人 Farhan Thawar 提到，AI 的一个隐藏价值，是帮助团队发现流程本身应该换顺序、换假设。他把这个叫 process power。

Shopify 开源的 [Roast](https://shopify.engineering/introducing-roast) 也体现了同一个判断。它不是让 AI 在庞大代码库里自由 roaming，而是把复杂 AI workflow 拆成离散步骤，把非确定性的 AI 行为和确定性的代码执行、命令、检查结合起来。原则很直接：agent 需要结构，因为 nondeterminism 是 reliability 的敌人。

这也是一个人的项目背后的原则。重点不是一个人可以 prompt 一个 agent 做完所有事。重点是一个 owner 能把模糊的工作拆成可观察、可验证的小循环。AI 加速这些循环，owner 保证它们没有偏离真实目标。

## 这个模型也可能失败得很快

“一个人的项目”有一个很坏的版本，必须说清楚。

坏版本是：既然 AI 很强，那就让一个速度快的人少受约束地往前冲。减少 QA，减少 review，把 process 当成敌人，只优化看得见的速度。

这种做法短期可能有效，也会很快留下可预期的损伤。重复代码变多，API 语义漂移，安全和权限边界被绕开，测试只覆盖 happy path，因为那是 AI 最容易生成的测试。业务规则散落在 prompt、临时判断和半 review 的代码里。

风险已经有信号。[Stack Overflow 2025 Developer Survey](https://survey.stackoverflow.co/2025/ai)显示，开发者对 AI 工具准确性仍然很谨慎。[GitClear 2025 AI code quality research](https://www.gitclear.com/ai_assistant_code_quality_2025_research)也指出，AI-assisted work 里 duplicated code、short-term churn 上升，moved/reused code 下降。你不必把每个数字都当成最终结论，但这个信号足够明确：AI 让代码变多，并不会自动让代码变好。

所以，一个人的项目要成立，团队边界必须更强，而不是更弱。

团队仍然负责架构方向、跨模块接口、安全要求、隐私约束、observability、release policy、incident learning 和 product priority。AI 越快，这些共享约束越重要。没有边界，owner 的速度就会变成系统风险。

这也是最容易被误解的地方。AI 会削弱某些协作方式，尤其是慢的、角色之间反复交接的协作。但它会提高真正 alignment 的价值。过去团队靠会议、ticket、QA gate、review comment 维持一致。未来更多 alignment 要被写进系统：repo instructions、architecture decision records、design conventions、test contracts、risk scoring、CI gates、feature flags、rollback paths、production metrics。

团队不再主要是一条流水线。团队会更像一个 alignment system。

## QA 会变成风险和证据设计

QA 是最清楚的例子。

AI-assisted process 里，QA 不会消失。但如果 QA 仍然只是开发之后的手工 gate，它会越来越痛苦。AI-assisted development 可以产生比 QA 团队手工消化能力更多的变化，而且 QA 介入越晚，需要补的上下文越多。

更好的方向，是让 QA 变成 risk and evidence discipline。

这意味着 QA 更早参与 acceptance criteria，提前识别高风险路径，把 test strategy 转成可以生成、运行、review、追踪的 evidence。AI 可以根据需求和历史 bug 草拟测试，也可以对 PR 做第一轮风险扫描。人类 QA 把注意力放在业务关键路径、integration、异常流程、权限边界和用户体验上。production monitoring、feature flags、灰度、rollback、postmortem 再把质量闭环补完整。

这不是降低 QA 的价值，而是提高 QA 的杠杆。

传统 QA 经常被迫在末端替流程还债。AI 时代，这笔债会更快变大。有效的 QA 应该定义：什么证据能让团队相信这个变化可以上线，什么风险应该让这件事在变贵之前停下来。

developer 的责任也会因此变化。一个 owner 不能再假设“后面 QA 会看”。他应该带着 AI 先建立 evidence：测试、日志、截图、diff summary、risk note、migration plan、rollback path。这样 QA 和 reviewer 面对的就不是一团 AI-generated output，而是一个可以审查的 case。

## 一个实用模型：Owner, Agents, Boundary, Evidence

我现在会用四个词来描述 AI 时代的软件协作：Owner, Agents, Boundary, Evidence。

**Owner** 是对完整上下文负责的人。他不一定是唯一写代码的人，也不一定是唯一做决定的人，但他要持续理解目标、约束、风险和结果。没有 owner，AI output 会漂。

**Agents** 是执行半径。它们可以帮 owner 拆需求、比方案、写实现、补测试、写文档、做 review、debug、迁移、清理。agents 拥有任务，但不拥有责任。

**Boundary** 是团队提供的共享约束：架构边界、API contract、设计规则、安全策略、repo instructions、module ownership、feature flag policy、release policy。Boundary 的作用是让个人可以快，但不会快到撞坏系统。

**Evidence** 是让速度可以被信任的东西：test results、CI、coverage、screenshots、logs、traces、benchmarks、review notes、risk checklist、production metrics。AI output 越多，evidence 越重要，因为人类不可能手工重新理解每一个细节。

这个模型改变的是协作形态。

旧模型是 sequential：一个角色做完，交给下一个角色。

AI 时代更像 loop-based：一个 owner 带着 agents 在共享边界内快速推进，同时持续产生 evidence；团队在关键风险、关键边界、关键集成点介入。

不是每个变化都应该背同样重的流程。低风险、证据强的小变化，可以快速通过。跨边界变更、权限相关、数据迁移、架构方向变化，需要更重的 review。AI-generated tests 可以提高覆盖率，但不能替代 test strategy。AI review 可以做 first pass，但不能替代 accountable human review。

这就是我说“一个人的项目”时真正想表达的东西：一个人拥有完整闭环，团队拥有清晰边界。

## 真正变化的是 accountability architecture

软件团队过去像流水线，是因为执行成本高。每个角色拿一段，靠 handoff 管理复杂度。

一旦 AI 降低执行成本，这种结构里的隐藏成本就很难再忽略。每一次交接都会丢上下文。每一次等待都会放慢 iteration。每个角色如果只看到自己的局部，就很难理解 AI 生成的大量变化背后的真实意图。

过去提高效率的分工，可能变成限制效率的沟通成本。

所以更深的变化不是 headcount，而是 accountability architecture。

旧组织设计把复杂责任拆散到多个角色里，再用流程把它们重新拼起来。AI 时代，这种拼接会变得更贵，因为执行不再是最稀缺的资源，上下文和判断才是。一个需求如果不断在 BA、design、development、QA、UAT、release 之间移动，每一次移动都要重新解释意图、重新建立 mental model、重新判断风险。AI 让每个环节都更快产出，但它没有让这些重新解释免费。

一个人的项目，本质上是责任重新聚合。

一个 owner 把 product intent、technical context、quality evidence、release risk 聚合在自己身上。AI 扩大他的执行半径。团队把 boundary、interface、standard、auditability 做成共享系统。好的团队不需要靠不断打断 owner 来获得安全感，而是让 owner 的工作天然可见、可验证、可回滚。

所以 AI 时代的管理难点，不是简单要求大家“多用 AI”。那通常只会制造更多 output。它也不是把 AI 的速度压回旧流程。那会浪费真正的优势。真正有用的问题是责任颗粒度：什么工作应该由一个 owner end-to-end 负责，什么工作必须进入 team review，什么 evidence 足以支持 fast merge，碰到什么 boundary 必须立刻停下来。

我现在的答案是：single owner, shared boundary。

这套 operating rule 很简单：把完整 loop 交给一个人，把 boundary 交给团队，让每个重要决定都留下 evidence。没有 owner，AI output 会漂。没有 boundary，owner 的速度会变成系统风险。没有 evidence，信任就会退化成主观感觉。

这不是团队协作的退化，而是团队协作上升到更高一层。

流水线时代，团队的价值是把很多人组织成一个生产过程。AI 时代，团队的价值是让一个高 ownership 的人可以带着 AI 安全承担更大的责任。前者优化人力分工，后者优化判断、边界和信任。

未来更强的软件团队，不会只问：“这个流程里每个角色分别做什么？”

它们会问更尖锐的问题：

这件事由谁 end to end 负责？他可以调用哪些 agents？团队边界在哪里？什么 evidence 能让我们相信它可以上线？

谁能把这几个问题回答清楚，谁就能在 AI 时代保留个人速度，同时保留团队质量。
