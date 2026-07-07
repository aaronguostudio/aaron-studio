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

如果只看最近几条 AI 新闻，它们像是几家公司各自的战略动作。

[Anthropic](https://www.anthropic.com/news/enterprise-ai-services-company) 和 Blackstone、Hellman & Friedman、Goldman Sachs 一起成立企业 AI 服务公司。[OpenAI](https://openai.com/index/openai-launches-the-deployment-company/) 推出了 OpenAI Deployment Company。[AWS](https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers) 投入 10 亿美元建立 Forward Deployed Engineering 组织。[Microsoft](https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/) 推出 Frontier Company，把 6000 名行业和工程专家嵌入客户组织。

但把它们放在一起看，方向就很清楚：Anthropic、OpenAI、AWS、Microsoft 都在把工程师推到离客户更近的地方，因为企业 AI 的下一阶段，不只是模型更强，而是能不能把模型变成真实业务里的工作系统。

它们共同指向同一个判断：企业 AI 已经过了只问“模型能不能做”的阶段。更难的问题变成了：“企业能不能把它真正用起来？”

这个问题没有 benchmark 那么清晰，也不容易出现在发布会里。它藏在数据权限、workflow、合规、安全、旧系统、员工习惯、预算归属和 ROI 里。它是一个漂亮 demo 和一个每天都有人依赖的生产系统之间的距离。

这个距离，就是 forward deployed engineering 变得重要的地方。

## 这个模式已经很明显

Anthropic 的公告把这个缺口说得很清楚。新公司要帮助中型企业把 Claude 用进核心运营。Anthropic 提到的客户类型包括 community banks、mid-sized manufacturers、regional health systems。这些公司不是小公司，但也不一定有足够强的内部 AI 工程团队，可以自己建设和维护 frontier AI deployment。

这个细节很重要。最大型企业可以请咨询公司，可以建平台团队，也可以花几年做转型项目。中型企业往往有同样复杂的运营痛点，却没有同样充足的 AI 人才。它们复杂到需要定制 AI 系统，但又不一定有能力独立把系统建起来并长期跑下去。

OpenAI 的 Deployment Company 从另一个角度说明了同一件事。OpenAI 描述 FDE 会进入客户组织，识别高价值 workflow，围绕 AI 重构基础设施，并把模型接入客户的数据、工具、控制机制和业务流程。这个表述很关键。客户拿到的不是一个 API key 和一句“你们 IT 自己研究”。这是一种围绕真实工作方式改造的交付模式。

AWS 的动作更直接。新的 FDE 组织投入 10 亿美元，目标是把 AWS 工程师嵌入客户团队，共同建设 agentic AI 系统。AWS 说，客户已经不满足于探索 AI 能做什么，他们想让 AI 成为运营核心。

Microsoft 的说法不同，但方向一样。Frontier Company 关注 measurable outcomes、ROI、客户 intelligence 的保护、模型选择和持续改进。它的 pitch 已经超出了“多用一点 Copilot”，而是一套企业 AI 的 operating model。

不同公司，不同生态，同一个动作。

AI 公司正在向下游移动，因为瓶颈也移动到了下游。

![不同 AI 平台汇聚到部署层](imgs/web/01-scene-platforms-converge.webp)

## Demo 证明模型会做，部署证明组织能用起来

我在自己的 AI workflow 里也反复看到这个模式，只是规模更小。

我用 agent 做 code、writing、analytics、video、publishing 的时候，模型本身通常不会长期是最难的部分。模型可以写，可以推理，可以总结，可以读文件，可以生成测试，可以起草计划，可以查文档，也可以产出各种 artifact。真正难的是把这些能力变成一个我能信任的工作系统。

agent 从哪里拿 context？哪些文件可以改？什么算证据？谁来 review？结果存在哪里？如果错了怎么办？下一次 run 会不会从这次结果里学到东西？我怎么避免系统生成一堆我根本看不过来的 artifact？

企业 AI 里是同样的问题，只是风险更高。

让模型回答客服问题、总结合同、起草销售邮件、review 文档、生成代码，都可以做出很漂亮的 demo。但要让这些能力进入真实组织，就会碰到权限、审计、数据驻留、采购、法务、角色访问控制、现有工具、员工培训、异常处理和业务 KPI。

Demo 证明模型可以完成一个任务。部署证明企业可以把这个任务变成一套可信、可运行、可持续改进的工作闭环。

所以这波 deployment 很重要。它说明 AI adoption 越来越不像安装一个软件，而更像围绕一种新型 worker 重构 workflow。模型是 intelligence layer。deployment 决定这层 intelligence 进入业务的哪个位置，可以做什么，如何被评估，以及最后谁负责。

![从模型 demo 到可信的工作闭环](imgs/web/02-metaphor-demo-to-operating-loop.webp)

## Forward Deployed Engineer 到底做什么

Forward deployed engineering 并不是新东西。Palantir 很早就围绕这个模式构建了自己的交付方式。在 Palantir 的解释里，forward deployed software engineer 会嵌入客户现场，帮助一个客户启用多种能力；传统产品工程师则更多是为很多客户构建同一种能力。

这个区别很有用。

一个普通软件工程师可以离客户很远，但仍然做出很好的工程。一个 sales engineer 可以离客户很近，但主要优化的是 demo 和技术验证。一个 consultant 可以理解业务，也能设计 roadmap，但未必是把系统建出来并跑进 production 的人。

FDE 正好工作在这些角色的交界处。

他必须足够理解业务问题，避免做错东西；也必须足够理解技术系统，能把东西真正建出来。他要离用户足够近，看到 workflow 真实断在哪里。他要足够务实，能在约束下 ship；也要足够克制，避免做出一堆无法维护的一次性定制。

这就是为什么这个角色在 AI 时代突然重要。

AI 系统充满最后一公里细节。一个系统是“有用”还是“危险”，可能差在一条权限规则、一个缺失的来源引用、一个薄弱的 eval、一条 fallback path、一个过期的数据 connector，或者一个放错位置的人工审批步骤。这些细节不会在产品 demo 里自动出现。它们只有在系统碰到真实工作时才会暴露。

FDE 的价值就在这里：他们工作在这些细节变得可见的位置。

## FDE 改变的是交付重心

有一种偷懒的说法是：FDE 只是 consulting 换了个更酷的名字。我觉得这个说法没抓住重点。

传统咨询和系统集成仍然重要。大型企业需要 change management、program governance、training、合规、全球 rollout、operating model design 和跨系统协调。这些都是实打实的能力。再强的工程师，如果不了解监管企业里的组织变化，也可能失败。

区别在于重心。

传统 consulting 往往从分析开始，以 recommendation、roadmap、operating model 或 transformation program 结束。实施当然也可能发生，但它常常被拆到不同团队、供应商和阶段里。整个链条会变成：诊断、建议、审批、实施、培训、维护。

FDE 会压缩这条链。

| 传统 consulting 的重心 | Forward deployed engineering 的重心 |
|---|---|
| 诊断和建议 | 理解并构建 |
| roadmap 和项目 artifact | production system 和运营能力 |
| stakeholder coordination | 嵌入 workflow 重构 |
| billable project delivery | 可衡量的业务结果 |
| 交接给实施团队 | 和用户、系统一起迭代 |
| 外部 expertise | 现场经验反哺产品 |

AWS 基本上直接说出了这个区别。它的 FDE 公告强调，这个模式围绕业务结果和客户自给能力设计，而不是围绕 billable hours。AWS 还提到会留下系统、runbook、architecture documentation、knowledge graph 和受过训练的内部 champion。

更准确地说，它的承诺接近于：我们和你一起建，直到系统和能力在我们离开后仍然留下来。

Microsoft 又补上了另一个关键层面：trust。Frontier Company 强调保护客户数据、IP 和竞争优势，同时支持客户在 OpenAI、Anthropic、Microsoft、open source 和 specialized models 之间做模型选择。这是所有企业买家最终都会关心的事。如果 AI deployment 要重塑核心 workflow，lock-in、数据归属、governance 和模型可替换性就不能只是脚注。

更好的理解是：FDE 是 engineering、product judgment、implementation 和 operating change 的融合体。

这个融合出现，是因为 AI deployment 本身会横跨多个学科。它太技术，不能只靠 strategy；它也太组织化，不能只靠 engineering。

![FDE 把交付重心从交接推向嵌入式构建](imgs/web/03-comparison-fde-center-of-gravity.webp)

## 为什么 AI 公司突然都关心部署

这里也有很现实的商业逻辑。

frontier model 很贵，而且越来越难只靠 benchmark 的提升来区分。客户当然会关心今天哪个模型最好，但他们更关心系统能不能增加收入、降低成本、减少风险、加快决策，或者创造产品优势。

这些价值主要发生在 API call 周围的 workflow 里。

这也是为什么 Alex Karp 最近对 AI 行业的批评值得放进来，即使不必完全接受他所有表达。根据 [Moneycontrol 对 CNBC 采访的整理](https://www.moneycontrol.com/artificial-intelligence/why-palantir-ceo-alex-karp-is-angry-with-ai-industry-models-completely-oversold-article-13964154.html)，这位 Palantir CEO 认为很多企业已经对 AI 投入和实际回报之间的落差感到不满。他批评的不是企业拿不到模型，而是企业花钱买了 token、暴露了数据和 IP，却没有看到对应的业务价值。

这当然是一个很 Palantir、也很自利的说法。但它背后的判断和这篇文章的主线一致：企业要买的不是更多 token，而是能把模型、数据、权限、业务对象和运营流程接在一起的能力。Palantir 很早就把价值押在这一层。现在，大模型公司也开始往同一层移动。

如果 AI 公司只停留在模型层，它就有可能变成别人包装、集成、变现的基础设施。如果它往 deployment 走，就会更接近客户最高价值的问题。它会知道哪些 workflow 真重要，哪里模型会失败，哪些 pattern 可以复用，也会带来更多模型使用量、更深客户关系，甚至拿到一部分 transformation budget。

这也是为什么 Blackstone 和 Fractional AI 的后续动作很有意思。Anthropic 支持的新服务公司宣布不久后，Blackstone 又宣布这家公司收购 Fractional AI，作为 founding operational centerpiece。这个动作把话说得很明白：模型 access 只是资产之一。真正稀缺的是能把模型变成工作系统的 applied AI engineering talent。

OpenAI Deployment Company 也是类似结构。OpenAI 同意收购 Tomoro，让新公司一开始就拥有有经验的 FDE。它还引入了投资机构、咨询公司和系统集成商作为伙伴。这个商业结构很有意思：平台希望贴近 research 和 product，同时借助 partner 与 deployed engineer 把真实世界 adoption 扩大。

这会带来张力。

咨询公司和系统集成商不会消失，但它们高价值的部分会越来越靠近 AI-native implementation capability。客户会得到更多帮助，但也要问更尖锐的问题。系统是否支持替换模型？workflow asset 归谁？公司数据在哪里？模型变化后怎么办？内部团队能不能在供应商离开后维护系统？

企业不应该把 judgment 外包出去。更好的做法，是用外部 expertise 更快地建立内部 capability。

## 对技术人员的启发

这是我最关心的一段。

FDE 的上升，对技术人员来说是一个职业信号。code-native 的工程师能把系统建出来，model-native 的工程师能使用新的 intelligence。下一个杠杆点，属于能把这层 intelligence 带进生产 workflow 的工程师。

我会把这种能力叫作 deployment-native。

deployment-native 的工程师可以走进一个混乱的 workflow，找到真正的约束。他能区分哪些任务应该自动化，哪些决策需要人的判断，哪些流程根本不应该继续存在。他能把模型接入数据、工具、权限和业务流程。他能设计 eval、guardrail、monitoring 和 fallback path。他能和非技术用户一起工作，同时不丢掉技术严谨性。他能衡量系统有没有真的改变结果。

这比 prompt engineering 宽得多。

prompt 很重要。它是和 intelligence 交互的一种界面。但当问题变成把 AI 放进生产 workflow 时，prompt 就不够了。更长期的能力是 workflow engineering：理解工作在系统里如何流动，AI 如何改变成本结构，以及怎样重新设计这个 loop，让输出变得有用、安全、可衡量。

这会改变工程工作的形状。

过去很长一段时间，好的工程往往意味着把客户现场的复杂性隔离在产品边界之外。这不是坏事。好的平台会创造可复用 primitive。好的 infrastructure 会隐藏复杂性。好的产品团队也不会把每一个客户需求都变成定制开发。

但 AI 改变了边界。generic code 变便宜了。理解 context 的能力变贵了。能把技术可能性接到业务 workflow 的工程师，会比只等干净 ticket 的工程师有更高杠杆。

产品经理和 leader 也是一样。现在的工作不是抽象地“找 AI use case”。真正的工作是判断哪些 workflow 值得引入 intelligence，什么证据可以证明价值，风险在哪里，以及怎样让 adoption 足够安全，可以扩展。

所以我喜欢 deployment-native 这个词。它描述的与其说是职位，不如说是一种工作姿态。

deployment-native 的人不能只问“有什么 AI use case”。我会用一个更好记的框架：ACTOR。

**Action。** 真正被卡住的是哪个业务动作、decision、handoff 或 repetitive task？如果这个问题说不清，项目很容易变成“先做一个 demo，再到处找 use case”。

**Context。** 系统到底需要知道什么？source of truth 在哪里？数据访问边界、权限规则和治理要求是什么？很多企业 AI 的失败不是模型失败，而是 context 失败。

**Trust。** AI 应该被信任到什么程度？它是在 draft、recommend、decide，还是 act？这几个动词背后需要完全不同的权限、审批、fallback 和 audit trail。

**Outcome。** 什么证据可以证明这个系统真的改善了工作？cycle time 变短、升级工单减少、错误率下降、conversion 提高、margin 改善、文档更干净、onboarding 更快。没有 outcome layer，AI adoption 很容易变成表演。

**Responsibility。** 上线以后谁负责？谁负责让它持续变好？什么 feedback loop 能告诉团队它是否真的改善了工作？留下什么 runbook？内部有没有 champion 能维护？这次沉淀下来的 pattern，能不能让下一个 workflow 起点更高？

Responsibility 不只是责任归属，也是 recursive improvement 的前提。如果 deployment 到上线就结束，系统会慢慢退化。如果每一次使用都留下证据、更好的 eval、更清晰的数据契约、更好的 prompt、postmortem 和可复用 pattern，系统才会复利。好的企业 AI deployment 不只是经得起真实使用，而是能从真实使用里学习。

我喜欢 ACTOR 这个词，是因为企业 AI 真正有价值的时刻，不是它停留在旁边当一个 chatbot，而是它成为 workflow 里的 actor。这不等于完全自动化，而是它有清晰的角色、上下文、信任边界、结果指标、责任人和学习循环。

![面向 deployment-native 企业 AI 的 ACTOR 框架](imgs/web/04-framework-actor-loop.webp)

这才是 FDE 对从业者真正有用的地方。它不是简单地“离客户更近”，而是知道如何把客户现场的复杂性，转化成一套能经受真实工作检验的系统。

## 更大的变化

模型时代让 intelligence 看起来变得充足。deployment 时代会检验这些 intelligence 能不能真正改变工作。

这才是理解这些公告的关键。Anthropic、OpenAI、AWS、Microsoft 不只是多建几个服务团队。它们是在承认一个现实：企业 AI 的价值取决于模型周围的系统，包括数据、workflow、权限、信任、激励和责任归属。

我不认为每个工程师都应该变成 FDE。有人应该深入 infrastructure、model、security、product platform、research 和 developer tools。但每个技术人员都应该理解为什么这个角色现在变得可见。它说明 frontier 正在向客户现场移动。

我在自己的工作里，现在最信任的问题也变成了这个：模型输出要能改变下一步行动，周围必须先满足什么条件？

能回答这个问题的公司，不只是部署了 AI。它们会把 intelligence 变成一种运营能力。回答不了这个问题的公司，会继续购买昂贵的 token，把调用量当成进展，然后疑惑为什么这些成本没有转换成利润、速度或更好的决策。
