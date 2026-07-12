---
title: "昂贵的 Token 救不了企业 AI"
date: 2026-07-06
slug: why-ai-companies-are-becoming-deployment-companies
category: ai-native-systems
tags: [forward-deployed-engineering, enterprise-ai, ai-deployment, workflow-engineering]
draft: true
cover: imgs/web/00-cover-v7-human-backpropagation.webp
---

# 昂贵的 Token 救不了企业 AI

*Anthropic、OpenAI、AWS、Microsoft 正在模型周围建设一层 human backpropagation。这件事揭示了企业 AI 的价值究竟发生在哪里。*

![Human feedback 修复从模型消耗到 operating value 的断点](imgs/web/00-cover-v7-human-backpropagation.webp)

上周，我的 AI workflow 完成了一项看起来相当完整的工作：调研、英文文章、中文版、配图、配音，连视频也生成了。

然后我在本地预览里点了一条站内链接。

404。

每一项 task 看起来都完成了，整个 workflow 却没有完成目标。

在我的规模里，这个问题修起来并不贵。我改对了 route，检查了实际页面，又把 link validator 加进发布流程，确保同一类 broken link 以后不能悄悄过关。放到企业里，对应的故障可能是权限配错、数据源过期、审批环节放错位置、agent 在没有 audit trail 的情况下采取行动，或者模型给出了结果，却没有人对后果负责。

模型会不会做这项任务，已经不是全部问题。真正难的是让结果经得住组织的真实环境。

再看最近 AI 平台把钱投向了哪里。5 月 4 日到 7 月 2 日，Anthropic、OpenAI、AWS、Microsoft 先后宣布建设以 deployment 为核心的新组织。仅 OpenAI、AWS、Microsoft 披露的相关投入，合计就至少 75 亿美元。

这些投资不能证明新组织一定成功，却足以说明 vendor 认为缺口在哪里。

我的判断是：模型还不是完整的 enterprise product。模型提供 intelligence；deployment layer 把它变成 operating capacity，再把客户现场学到的东西送回产品。

这就是 Forward Deployed Engineering 突然变得显眼的原因。

![文章、翻译、音频和视频都完成以后，仍被一条 broken route 打断](imgs/web/01-task-passed-workflow-failed-v7.webp)

## 75 亿美元指向的缺口

四家公司用词不同，解决的却是同一个转换问题。

[Anthropic](https://www.anthropic.com/news/enterprise-ai-services-company) 成立了一家服务中型企业的 AI services company，Anthropic Applied AI engineers 会和新公司的工程团队共同工作。它给出的原因很直接：Claude 的企业需求已经超过任何一种 delivery model 能独自承载的规模，而不少 community bank、制造商和区域医疗系统没有足够的内部资源建设 frontier deployment。

[OpenAI](https://openai.com/index/openai-launches-the-deployment-company/) 推出由自己控股的 Deployment Company，初始投入超过 40 亿美元，并同意收购 Tomoro，带入大约 150 名 FDE 和 deployment specialists。[AWS](https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers) 投入 10 亿美元建立 FDE 组织，计划把数千名专家嵌入客户团队。[Microsoft](https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/) 则为 Frontier Company 投入 25 亿美元，配置 6000 名行业和工程专家。

这几笔数字不是同一种会计口径。OpenAI 说的是新公司的 initial investment，AWS 和 Microsoft 描述的是各自组织的投入。我把总数当作规模信号，而不是逐项可比的 spending table。

这些都是 vendor announcement，只能证明战略和意图，不能当作客户 ROI。可是，公司通常不会为一个不存在的瓶颈投入这么多资本。

如果缺的是 access，更便宜的 inference 就能缓解问题。它们现在派工程师进入客户 workflow，说明难点已经变成 conversion：intelligence 怎样可靠地转化成收入、成本、速度、质量、风险或决策的变化。

Token usage 只能告诉我们有多少模型能力进入系统，不能告诉我们有没有价值从另一端出来。

## FDE 是 human backpropagation

Palantir 对 FDE 有一个很准确的解释。它在官方 [Architecture Center](https://www.palantir.com/docs/foundry/architecture-center/overview) 里把 Forward Deployed Engineering 称为 human equivalent of backpropagation：工程师尽可能靠近客户最难的问题，再和 core engineering 一起综合 feedback、发布产品改进。

这里当然不是每开一次客户会议就更新模型参数。发生 backpropagation 的，是组织。

一个好的 FDE 系统要闭合三层 loop：

| Loop | 核心问题 | 返回什么 |
|---|---|---|
| Customer loop | 工作实际上怎么发生？ | context、constraint、exception、用户行为 |
| Operating loop | 系统能不能在 production 可靠运行？ | eval、incident、approval、cost、outcome |
| Product loop | 哪些经验值得复用？ | feature、abstraction、guardrail、deployment pattern |

第一层防止团队解决一个想象出来的问题。第二层暴露 demo 里看不见的失败。第三层决定现场工作会不会 compound，还是永远停留在一次性定制。

这才是 FDE 适合当前 AI 阶段的深层原因。模型能力变化很快，企业 workflow 却仍然穿过旧系统、权限、政策、激励和人的习惯。离现场很远的 product team 看到的是 API call 和 support ticket；嵌入客户的工程团队看到的是 intelligence 在哪里撞上现实。

客户现场同时成了 delivery endpoint 和 learning sensor。

![客户现场的 evidence 经过 operating review，变成可复用的 product learning](imgs/web/02-human-backpropagation-v7.webp)

## 为什么模型公司需要一层“人”

Frontier AI 公司大规模招聘偏 services 的工程师，表面上很像在背离 software economics。软件之所以能 scale，正是因为每多一个客户，不需要再塞进一屋子专家。

这个担忧合理，也正因为如此，product loop 才是关键。

People layer 同时承担了几种工作：把模型接进高价值 workflow；发现哪些 production failure 真正重要；找出哪些 pattern 会在不同客户重复；推动模型进入难以替换的核心系统；也让 vendor 接触远大于 API bill 的 transformation budget。

Anthropic-backed firm 的下一步很说明问题。公司成立 17 天后，它就[收购 Fractional AI](https://www.blackstone.com/news/press/the-ai-native-enterprise-services-firm-backed-by-anthropic-blackstone-and-hellman-friedman-announces-acquisition-of-fractional-ai/)，并把这支团队称为 founding operational centerpiece。资本和模型都已经有了，组织仍然需要一支真正懂得围绕模型改造系统的工程团队。

OpenAI 也把学习目标写进了 operating model：从少数高价值 workflow 开始，建设连接客户数据、工具、control 和业务流程的 production system，再从广泛客户网络中抽象可复用的 deployment pattern。

这里存在一个战略 flywheel：

```text
更强模型 -> 更深 deployment -> 更好的 field signal
-> 更好的 product pattern -> 更快的下一次 deployment
```

真正可 scale 的版本，不会让人数永远跟着客户数量一起增长，而是把反复出现的现场发现变成产品。如果每支团队都在手工解决同一种 connector、permission、eval 或 workflow failure，这个组织只是在不断交付项目，并没有从项目里学习。

这个 flywheel 可能让双方受益，也可能制造利益冲突。Vendor 希望 usage 更高、产品学习更快、客户关系更 sticky；客户希望拿到 measurable outcome、内部能力，以及未来更换模型或伙伴的自由。

专业的 deployment 模式必须同时处理这两面。

## FDE 和 consulting 的区别，在于什么会 compound

把 FDE 说成“换了一个好听名字的 consulting”，很痛快，却不够准确。

好的 consultant 和 system integrator 本来就在分析 workflow、建设技术、推动 change、处理监管和协调 transformation。大型企业仍然需要这些能力。会不会写代码、离客户有多近，都不足以划出清晰边界。

更可靠的区别是：现场学到的东西去了哪里，engagement 结束以后留下了什么。

AWS 提供了一套有用的标准。它说客户最终应该获得 deployed system、knowledge graph、runbook、architecture documentation、trained internal champion 和可复用 pattern。目标既包括系统上线，也包括 customer self-sufficiency。

我会把检验再收紧一点。一次 deployment 至少应该留下四样东西：

1. **Production loop：**系统真的进入 workflow，exception 和 fallback 也能处理。
2. **Customer capability：**内部人员可以运行、检查、质疑和扩展它。
3. **Product learning：**现场发现能改进平台或下一次 deployment，而不是埋进项目文件夹。
4. **Outcome evidence：**组织知道 cycle time、cost、quality、risk、revenue 或 decision speed 到底发生了什么变化。

![一次可信 deployment 应该留下的四类 output](imgs/web/03-four-outputs-compound-v7.webp)

这四样东西能够 compound，FDE 才构成一种独特 operating model。什么都没留下，它就是 custom services，不管职位叫什么。

这也解释了为什么 FDE 不会简单替代 consulting。Deployment 横跨 engineering、product、governance、security、change management 和 operations。真正有效的模式，是把这些学科之间漫长的 handoff 压缩掉。

## 成功 deployment 也可能隐藏风险

Vendor 越靠近核心 workflow，越可能创造价值，也越可能加深 dependency。

一个关键流程可能逐渐绑在某家厂商的 connector、prompt、eval、permission model、agent runtime 和默认假设上。系统顺利运行时，switching cost 很难看见；等到价格、模型质量、监管、战略或信任发生变化，代价才会突然显现。

Microsoft 在公告里强调 model choice、customer IP、governance、observability 和 FinOps，正面回应了这个风险。客户还应该更进一步，自己掌握 data contract、evaluation set、audit history、runbook、failure mode，以及 workflow 与模型之间的 interface。

好的 deployment 会让客户能力更强、信息更充分，也应该留下一条可以离开的路。

所以，真正值得问的不是公司用了多少 AI，而是随着 AI 使用增加，组织保留了多少 control 和 learning。

## 给技术人的信号：deployment-native

我不认为每个工程师都应该成为 FDE。模型、infrastructure、security、developer tool、distributed system 和 product platform 仍然需要长期深挖。

FDE 释放的是另一个 career signal：deployment-native engineering 正在变得更有价值。

Deployment-native engineer 能进入混乱 workflow，找到真正的 constraint。他能区分哪些 task 适合自动化，哪些 decision 必须保留人的判断，哪些 process 其实应该取消。他能把模型接入数据、工具、权限和业务系统，设计 eval、monitoring、approval 和 recovery，也能在不牺牲工程严谨性的前提下和用户共同工作。他还要判断哪些局部经验值得抽象成 reusable product pattern。

这比 prompt engineering 宽得多。Prompt 是 intelligence 的一种 interface；deployment-native engineering 关心的是 intelligence 如何在一套工作系统里可靠运行。

这和我在 [The One-Person Project](/zh/blogs/one-person-project-ai-coding) 里写过的 ownership model 是同一条线。AI 扩大 owner 的 execution radius，也放大 boundary 和 evidence 的重要性。企业场景只是规模更大：必须有人对 outcome 负责，系统必须遵守共享边界，evidence 也必须活过 demo。

Generic code 正在变便宜。Context、judgment，以及闭合 learning loop 的能力，正在变贵。

## ACTOR：一套 deployment test

我会用 ACTOR 检查这条 loop。每一步都应该留下一个真实 artifact 或 decision，而不是多一页 slide。

| Step | Deployment 问题 | 应该留下什么 |
|---|---|---|
| **Action** | 哪个 decision、handoff 或 task 会改变？ | workflow boundary、baseline、named owner |
| **Context** | 系统必须知道什么，可以访问什么？ | source-of-truth map、data contract、permission rule |
| **Trust** | AI 是 draft、recommend、decide，还是 act？ | autonomy level、approval path、audit trail、fallback |
| **Outcome** | 什么能证明工作真的改善？ | evaluation plan、business metric、review cadence |
| **Recursive** | 这次 deployment 如何改进自己和下一次？ | feedback loop、runbook、champion、pattern log |

![ACTOR deployment framework 让 Recursive 把 learning 带回 Action](imgs/web/04-actor-deployment-test-v7.webp)

前四步可以做出一个可靠 deployment，`Recursive` 决定这项能力能不能 compound。

Responsibility 当然在里面，但只有 ownership，结果仍可能是一次静态 handoff。Recursive 继续追问：incident 有没有让 eval 更准确？用户行为有没有暴露缺失的 permission？团队有没有更新 runbook？客户定制的 workaround 有没有变成 product feature？下一个 workflow 能不能站在这次积累的 primitive 上开始？

这就是客户一侧的 human backpropagation。

ACTOR 也能帮助企业抵抗 lock-in 和 activity reporting。Context 让数据边界变清楚，Trust 要求团队主动设计 autonomy，Outcome 把 value 和 usage 分开，Recursive 则追问 learning 归谁、能不能带走。

## Token 是 input，不是 outcome

那个 404 出现以后，我当然可以只修好一条链接，然后继续往前走。这样解决的是 incident。

现在，发布流程会在本地文章被判定 ready 之前检查所有站内 route。修好链接只有一次价值；改好 workflow，才可能在后面的每篇文章里继续产生价值。

![一个经过验证的 changed action，比很长的模型活动记录更接近价值](imgs/web/05-input-to-operating-capacity-v7.webp)

这个差别放在个人系统里很小、很容易看清，放到企业 AI 里却足以重塑整个市场。

Anthropic、OpenAI、AWS、Microsoft 建设 deployment organization，是因为模型能力本身不会自动完成工作。它们需要工程师靠近 production，把 failure 变成 system，再把 system 变成 product learning。

Token 是 consumption unit。一个被可靠改变的 decision 或 workflow，才更接近 value unit。能从结果里继续学习的 deployment，最终会成为 operating capability。

现在，在允许模型输出改变下一步之前，我会先问三个问题：什么来验证这次改变？谁对后果负责？这一次 run 会怎样让整个系统变得更好？

这些问题有了答案，enterprise AI 才真正开始。
