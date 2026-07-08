---
title: "为什么 Anthropic、OpenAI、AWS、Microsoft 都在做同一件事"
date: 2026-07-06
slug: why-ai-companies-are-becoming-deployment-companies
category: ai-native-systems
tags: [forward-deployed-engineering, enterprise-ai, ai-deployment, workflow-engineering]
draft: true
cover: imgs/web/00-cover.webp
---

# 为什么 Anthropic、OpenAI、AWS、Microsoft 都在做同一件事

![企业 AI 的部署层](imgs/web/00-cover.webp)

最近的 AI 新闻有一种很奇怪的节奏。

[Anthropic](https://www.anthropic.com/news/enterprise-ai-services-company) 和 Blackstone、Hellman & Friedman、Goldman Sachs 等投资方成立了一家企业 AI 服务公司。[OpenAI](https://openai.com/index/openai-launches-the-deployment-company/) 推出了 OpenAI Deployment Company，并同意收购 Tomoro。[AWS](https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers) 投入 10 亿美元建立 Forward Deployed Engineering 组织。[Microsoft](https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/) 推出 Frontier Company，投入 25 亿美元，把 6000 名行业和工程专家嵌入客户组织。

公司不同，生态不同，动作却很像。

它们都在把工程能力推到离客户更近的地方。原因并不复杂：企业 AI 进入了一个新阶段。前一阶段的核心是获得 intelligence：模型、API、copilot、context window、agent、benchmark。下一阶段的核心是 deployment capability：企业能不能把这层 intelligence 接进真实 workflow，同时不破坏信任、合规、责任边界和经济账。

这就是为什么 forward deployed engineering 又变得显眼。

FDE 是职位名称。更深的信号是：企业 AI 的瓶颈已经不只是模型能不能完成任务，而是组织能不能把这个任务变成一套可靠的工作闭环。

这个问题离发布会 demo 很远。它藏在数据权限、workflow 缺口、旧系统、安全审查、采购、审计、员工习惯、预算归属，以及每个企业买家迟早会问的那句话里：

这件事到底让业务发生了什么变化？

## 真正的模式是 deployment

Anthropic 的公告是一个很好的入口，因为它直接说出了市场缺口。新公司要帮助中型企业把 Claude 用进核心运营。Anthropic 提到的客户类型包括 community banks、mid-sized manufacturers、regional health systems。这些不是小公司，它们有真实的运营复杂度，但未必有足够强的内部 AI 工程能力，能够独立建设和维护 frontier AI deployment。

这个细节很关键。最大型企业可以请大型系统集成商，可以搭平台团队，也可以用几年时间跑转型项目。但中型企业同样有碎片化数据、监管流程、昂贵的人工操作和结果压力，只是实施资源更少。它们有 AI opportunity，却缺少 implementation muscle。

OpenAI 的 Deployment Company 从另一个方向讲了同一件事。OpenAI 说，FDE 会和 business leaders、operators、frontline teams 一起工作，识别高价值 workflow，围绕 AI 重构基础设施，并把模型接入客户的数据、工具、控制机制和业务流程。它还同意收购 Tomoro，从第一天就带入大约 150 名 FDE 和 deployment specialists。

AWS 的动作更直接。它投入 10 亿美元建立 FDE 组织，让 AWS 工程师进入客户的业务、工程和安全团队，共同建设 agentic AI 系统。AWS 的判断是，客户已经过了“探索 AI 能做什么”的阶段，他们想让 AI 成为运营核心。

Microsoft 的语言更宽，但结构相同。Frontier Company 关注 measurable business outcomes、ROI、continuous improvement、model choice 和客户 IP 保护。它的 pitch 已经不只是“多用一点 Copilot”，而是一套企业 AI operating model。

表面看，这是 AI vendor 在扩展服务。

更准确地说，是瓶颈移动到了下游。

![不同 AI 平台汇聚到部署层](imgs/web/01-scene-platforms-converge.webp)

## Demo 和 deployment 之间隔着一套组织能力

我在自己的 AI workflow 里反复看到这个问题，只是规模小很多。

我用 agent 做 code、writing、analytics、video、publishing 的时候，模型本身通常不会长期是最难的部分。模型可以起草、读文件、写代码、总结文档、生成测试、批判 outline、写视频脚本，也能留下可用的 artifact。

真正难的是把这些能力变成一个我能信任的工作系统。

agent 从哪里拿 context？哪些文件可以动？什么算 evidence？什么必须先 review？结果放在哪里？谁检查？错了怎么办？下一次 run 会不会从这一次学到东西？

我在 [I Gave Codex a Task From a Moving Tesla](../2026-06-20/ai-became-my-operating-system.md) 里写过这个问题：AI 只有在 intent、skill、run、review、memory 连起来的时候，才开始像 operating system。在那之前，它只是一个能力很强、但 workflow 很薄的工具。

企业 AI 也是同一个结构，只是钱更多，后果更重。

让模型总结合同、起草销售邮件、回答客服问题、review 文档、写代码，都可以做出漂亮 demo。真正难的是把它放进组织的真实系统里。企业场景里有 role-based access、data residency、安全审批、合规审查、采购、现有工具、change management、员工信任、异常处理和业务 KPI。

Demo 证明模型可以 perform。

Deployment 证明组织可以 operate。

这才是几家公司同时下场的原因。AI adoption 越来越不像安装一个软件产品，而更像围绕一种新 intelligence 重构 workflow。模型只是其中一层。deployment 决定这层 intelligence 在哪里进入业务、能做什么、如何被评估，以及碰到真实工作以后谁负责。

![从模型 demo 到可信的工作闭环](imgs/web/02-metaphor-demo-to-operating-loop.webp)

## FDE 是一种 lens，不只是职位

Forward deployed engineering 不是新概念。Palantir 很早就把它变成了自己的核心模式。

按照 Palantir 自己的解释，Forward Deployed Software Engineer 会直接嵌入客户，用 Palantir 平台解决客户最难的问题。它给出的区分到今天仍然有用：传统 product engineer 往往是为很多客户建设一种 capability；FDE 更像是围绕一个客户启用很多 capabilities。

这解释了为什么这个角色适合 AI。

普通 software engineer 可以离客户很远，也能做出优秀工程。sales engineer 可以离客户很近，帮助完成技术验证。consultant 可以理解业务、设计 roadmap、协调 transformation。

FDE 工作在这些角色的交界处。他需要足够懂业务，避免建错东西；也要足够懂工程，把东西真正建出来；还要有 product judgment，知道哪些客户痛点值得变成可复用 pattern；同时还要有运营纪律，留下一个别人能维护的系统。

AI 让这件事更重要。

AI 系统里有很多听起来无聊、但失败时很致命的落地细节。权限规则错了。source citation 丢了。data connector 过期了。fallback path 不清楚。eval 奖励了错误行为。人工审批放在 workflow 里太晚。模型更新以后系统行为变了。团队说不清 agent 为什么给出某个 recommendation。

这些问题通常不会出现在 demo 里。它们只会在系统碰到真实工作时暴露。

FDE 的价值，就是把工程能力放到这些细节变得可见的位置。

## Consultant 不是反派

有一种偷懒的说法：FDE 只是 consulting 换了一个更时髦的名字。

这个判断太粗。

传统 consulting 和 system integration 仍然重要。大型企业需要 program governance、change management、合规规划、培训、全球 rollout、operating model design 和跨系统协调。一个很强的工程团队就算嵌入客户，如果组织无法 adoption，项目一样会失败。

区别在于重心。

传统 consulting 往往从 diagnosis 开始，再走向 recommendation、roadmap、operating model 或 transformation program。implementation 当然可能发生，但链条经常会被拆成不同团队、vendor、阶段和 handoff。

Forward deployed engineering 试图压缩这条链。

| 传统 consulting 的重心 | FDE 的重心 |
|---|---|
| 诊断和建议 | 理解并建设 |
| roadmap 和项目 artifact | production system 和 operating capability |
| stakeholder coordination | embedded workflow redesign |
| billable project delivery | measurable business outcomes |
| handoff 给实施团队 | 和用户、系统一起迭代 |
| 外部专家经验 | 反馈到产品的 field learning |

AWS 几乎直接讲出了这个差别。它说 FDE 模式围绕 business results，而不是 billable hours；客户离开 engagement 时，应该带走 deployed systems、knowledge graphs、runbooks、architecture documentation 和 trained internal champions。

Microsoft 补上了 trust 这一层。Frontier Company 强调客户 IP 保护、model choice、governance、FinOps 和 continuous improvement。AI 越深入企业 workflow，客户就越不能把 lock-in、data ownership、model flexibility 和 auditability 当作采购细节。

所以 FDE 的重点不是“工程师替代 consultant”。

更准确的读法是：企业 AI deployment 横跨多个学科。它太技术，不能只当战略做；它也太组织化，不能只当工程做。

![FDE 把重心从 handoff 推向 embedded building](imgs/web/03-comparison-fde-center-of-gravity.webp)

## 为什么 AI 平台都想要这一层

模型公司往下游走，还有很现实的商业原因。

Frontier model 很贵。只靠 benchmark 拉开差距也越来越难。客户也许关心这个月哪个模型最好，但真正签预算的人更关心另一件事：系统有没有提高收入、降低成本、减少风险、加快 workflow，或者创造产品优势。

这些价值大多发生在 API call 周围，而不是 API call 本身。

这也是为什么 Alex Karp 最近对 AI 行业的批评值得参考，尽管要带着一点警惕去读。Palantir 不是中立观察者，它卖的正是 deployment 和 ontology 这一层。但 Karp 的不满之所以有力量，是因为很多企业确实感受到了同一种张力：token 消耗、模型访问和漂亮 demo，并不会自动变成 operating value。

如果 AI 平台只停在模型层，它可能变成被别人包装、集成和商业化的基础设施。进入 deployment 以后，它离客户最高价值的 workflow 更近。它能看到模型在哪里失败，哪些 pattern 会重复，哪些用例真的带来 usage，哪些关系会变得更 sticky，也可能拿到更大的 transformation budget。

这就是为什么 Blackstone 和 Fractional AI 的后续动作很有意思。Anthropic-backed services firm 宣布后不久，新公司就收购了 Fractional AI，让它成为 founding operational centerpiece。信号很直接：model access 只是一种资产，applied AI engineering talent 才是把模型变成系统的稀缺能力。

OpenAI 收购 Tomoro 也是同一个形状。OpenAI 没有只宣布 partner ecosystem，它买下了一支在复杂企业环境里建设和运行 AI 系统的团队。

客户侧的风险也很清楚。

更多 deployment help 可以加速 adoption，也可能加深 dependency。如果一个关键 workflow 被重构在某个 vendor 的模型、connector、eval、prompt 和默认假设之上，switching cost 可能直到出问题时才显现。Microsoft 强调 model-diverse systems 和客户 intelligence 保护，正是因为这个问题迟早会变成采购和治理的核心。

客户真正该问的，不是哪个 vendor 能做出最惊艳的 AI demo。

更好的问题是：

谁能帮助我们更快建立内部能力，而不是把判断力也外包掉？

## 给技术人的信号

这部分是我最关心的。

FDE 不只是企业销售动作。它也是给技术人的 career signal。

下一阶段有价值的工程师，会懂代码，也会懂模型。但这还不够。他还需要 deployment-native。

一个 deployment-native engineer 能走进混乱 workflow，找到真正的 constraint。他能区分哪些任务应该自动化，哪些决策必须保留人的判断，哪些流程其实应该被取消。他能把模型接入数据、工具、权限和业务流程。他能设计 eval、guardrail、monitoring 和 fallback path。他能和非技术用户一起工作，同时不丢掉工程严谨性。他还能衡量系统到底有没有改变结果。

这比 prompt engineering 宽得多。

Prompt 很重要，它是 intelligence 的一个 interface。但更耐用的能力是 workflow engineering：理解工作如何在系统里移动，AI 改变了哪里的成本结构，以及如何重构这个 loop，让输出变得有用、安全、可衡量。

这和我在 [The One-Person Project](../2026-07-01/one-person-project-ai-coding-v2.md) 里写的东西是一条线。AI 扩大了一个 owner 的 execution radius，但也让 ownership、boundary、evidence 变得更重要。企业版本也是一样。AI 可以加速工作，但前提是工作周围的系统能承载 context 和 responsibility。

过去很长一段时间，强工程能力往往意味着把客户的运营混乱挡在产品边界之外。这有道理。好的平台会创造 reusable primitives。好的基础设施会隐藏复杂度。好的产品团队也不会把每一个客户请求都变成定制开发。

AI 改变了这个边界。

Generic code 变便宜了。Context 变贵了。能把技术可能性接到业务 workflow 上的人，会比只等 clean ticket 的人更有杠杆。

Product leader 也一样。工作不再是抽象地“找 AI use case”。更好的问题是：哪些 workflow 值得引入 intelligence？什么 evidence 能证明价值？trust boundary 在哪里？系统上线后如何继续变好？

## ACTOR 这个 lens

我会用 ACTOR 来看企业 AI deployment。

它不是 prompt trick，而是 deployment-native checklist。

**Action.** 到底哪个业务动作、决策、handoff 或重复任务会改变？如果这里很模糊，项目就会变成一个 demo 在寻找 use case。

**Context.** 系统需要知道什么？source of truth 在哪里？数据访问边界、权限规则、治理约束是什么？很多企业 AI 失败，不是 model failure，而是 context failure。

**Trust.** AI 应该有多大自主权？它是在 drafting、recommending、deciding，还是 acting？每个动词都需要不同的权限模型、审批路径、fallback 和 audit trail。

**Outcome.** 什么能证明工作真的变好了？cycle time 更短、escalation 更少、error rate 更低、conversion 更高、margin 更好、documentation 更干净、onboarding 更快。如果没有 outcome layer，AI adoption 很容易变成 activity reporting。

**Recursive ownership.** 上线以后谁负责？系统如何学习？什么 feedback 能说明它真的改善了工作？留下什么 runbook？内部有没有 champion 能维护？哪些 pattern 被沉淀下来，让下一个 workflow 不从零开始？

这一点我不想弱化。

Responsibility 很重要，但只有 responsibility 仍然可能变成静态 handoff。Recursive ownership 要求系统有 improvement loop。每次 deployment 都应该留下更清晰的 eval、更干净的数据 contract、更好的 prompt、更明确的 failure mode、更强的 runbook 和可复用 pattern。不能从真实使用中学习的系统，最终会慢慢变成另一个被遗忘的企业工具。

这里也能接上我在 [The Farthest Humans Ever Went Started as a Failure](../2026-06-27/farthest-humans-started-as-failure.md) 里写过的区别。Demo 测的是 aspiration distance：一切顺利时系统能走多远。Deployment 测的是 return distance：系统偏离计划以后，还能不能恢复。

ACTOR 就是提前问这个问题的一种方式。

![ACTOR framework for deployment-native enterprise AI](imgs/web/04-framework-actor-loop.webp)

## 更大的变化

模型时代让 intelligence 看起来变得充裕。deployment 时代会检验这层 intelligence 能不能真正改变工作。

这是理解这些公告最干净的方式。Anthropic、OpenAI、AWS、Microsoft 都在增加服务团队，因为它们面对的是同一个企业现实：AI 的价值取决于模型周围的系统。

数据。

Workflow。

控制机制。

Trust boundary。

激励。

Owner。

Feedback loop。

我不认为每个工程师都应该成为 FDE。有人应该继续深挖 infrastructure、model research、security、developer tools、product platform、distributed systems。但每个技术人都应该理解，为什么这个角色现在变得可见。它说明 frontier 已经更靠近客户。

在我自己的工作里，现在最值得信任的问题是：

在允许模型输出改变下一步之前，模型周围必须先具备什么？

能回答这个问题的公司，不只是部署了 AI。它们会把 intelligence 变成 operating capacity。

回答不了这个问题的公司，会继续购买昂贵的 token，把 usage report 当成 progress，然后困惑为什么这一切没有变成 margin、speed 或更好的决策。
