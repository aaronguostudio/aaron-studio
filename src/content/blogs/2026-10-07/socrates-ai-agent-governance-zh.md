---
title: "更聪明，不等于更有权做决定"
date: 2026-10-07
slug: socrates-ai-agent-governance
category: ai-native-systems
tags: [agent-governance, democracy, decision-systems, socrates]
cover: imgs/web/00-cover-v3-clean.webp
---

![明亮的公民制度静物：柱、敞开的门、决策碑、陶罐与橄榄枝](imgs/web/00-cover-v3-clean.webp)

公元前 399 年，Socrates 在 Athens 被审判。

细节很重要。这不是 referendum，也不是一群职业法官组成的法庭。陪审团来自符合资格的男性公民，通常被描述为 501 人。[Stanford Encyclopedia of Philosophy 对这段历史有清晰说明](https://plato.stanford.edu/entries/socrates/)。

这场审判已经被争论了两千多年，很容易被压成一句口号。但它留下了一个很不舒服的问题。

如果负责做决定的人，其实并不理解自己要决定的事，怎么办？

Plato 对这个问题足够认真，才会把它发展成一个政治挑战。如果治理需要知识、判断和德性，为什么政治权力应该不顾这些条件地分配？现代读者很容易把它听成对 one-person-one-vote 的直接攻击。更有用的读法，是把它看成一个 competence 问题：为什么缺少专业能力，似乎不影响一个人的决策权？[这段哲学背景可参考 SEP](https://plato.stanford.edu/entries/democracy/)。

这不是死掉的问题。它正在变成工程问题。

AI 正在从 answering 走向 deciding，再走向 acting。它能调用工具、改数据、发消息、花钱、合并代码，最终还能 deploy production change。当软件开始代表我们行动时，“它够不够聪明”只是第一个问题。

更难的问题其实很古老：

谁给了它 authority？它该优化什么？错了以后怎么办？谁能挑战它？后果由谁承担？

## Plato 对问题的判断是对的

Plato 不需要现代民调、universal suffrage 或 machine learning，也能看到这种冲突。群体可能被误导。多数人可能恐惧、被操纵、不耐烦，甚至残酷。很多专业问题确实需要专业知识。

任何看过技术事故最后由“说得最有把握的人”拍板的人，都能感到这个问题的力量。

如果一次 database migration 能伤到整家公司，是否该让所有员工投票决定 rollback plan？如果一场跨国货币危机爆发，每一个操作选择是否都该交给公众 ballot？如果一个 AI system 能做高风险推荐，是不是每个 output 都要等委员会？

显然不是。

Expertise 很重要。真正的错误，是让这句正确的话悄悄变成另一句：有专业能力，所以就拥有无限 authority。

专家也会错。他们会被制度 incentive 影响。他们会把自己的专业语言优化到普通人无法检查。他们也会把一个 model 当成现实本身——这正是系列第一篇里希腊 metric 问题的另一种版本。

面对一个不够可靠的群体，答案不能是一个不受约束的专家。

## 现代民主给出了一个更克制的回答

现代民主并不建立在“每个公民的 expertise 相同”这个信念上。

它依赖的是另一个主张：每个人都应该拥有同等的政治 standing。Expertise 应该影响权力，但不能单靠 expertise 决定谁可以无限制地拥有权力。

这个区别很容易被复杂的民主机器遮住。一个简单的看法是把它拆成四层：

- **People** 提供 legitimacy：谁的利益被代表，谁能够撤换领导者？
- **Representatives** 提供 delegation 和 scale：不是每一件事都能每天由所有人决定。
- **Experts and institutions** 提供 competence：专业工作可以交给真正理解它的人。
- **Constitutions, courts, and rules** 提供 constraints：即使是受欢迎的领导者或受尊敬的机构，也没有无限 permission。

这几层在任何国家都不会完全干净。它们一直互相拉扯。这种摩擦不是设计失败，它本来就是设计的一部分。

India 是一个能提醒我们“这是选择而不是自然结果”的例子。独立时的印度面对贫困、低识字率、种姓等级、宗教分裂和极端复杂的语言多样性。它没有选择等到所有人受教育程度相同再投票。Universal adult suffrage 是一个刻意的宪法承诺。与此同时，B. R. Ambedkar 也提醒，政治平等可以与尖锐的社会和经济不平等同时存在。[他的 1949 年演讲](https://www.constitutionofindia.net/debates/25-nov-1949/)和[宪法 Article 326](https://www.indiacode.nic.in/bitstream/123456789/19151/1/constitution_of_india.pdf)放在一起读很有意思。

这个选择从来不是说每一个 voter 都懂一切。它是说，一个人在政治共同体里的 standing，不应该取决于由既有权力者设计的一场 expertise 考试。

![四层公民结构共同支撑一张公共决策桌](imgs/web/01-civic-layers.webp)

## Agent 是一种新的 expert layer

系列在这里回到了 software。

Agent 不是 philosopher king。它是一层高速 expert，有很奇怪的优势和弱点。它能读远比一个人更多的文档，比匆忙的会议保留更多局部 context，可以不疲倦地调用工具、重复同一流程。它也会 hallucinate、继承错误数据、跟错 proxy、模糊权限边界，并且比人察觉问题的速度更快地行动。

前三篇里，我借希腊连续问了三个问题：

1. **Measurement：** 我们在优化什么？
2. **Architecture：** 系统出错时会发生什么？
3. **Authority：** 谁可以做决定？

它们不是三种不同的 agent 问题。放在一起，它们构成一个 decision-system stack。

目标错了的 agent，会很稳定地优化错的东西。没有 failure handling 的 agent，会把一个小错误变成更大的错误。Authority 模糊的 agent，要么越界，要么毫无用处。更强的模型不会自动解决这些设计问题，只会让后果更快到来。

![一个有能力的小工具在受限工作盘内操作，决策圆片则留在珊瑚色边界之外](imgs/web/02-capability-boundary.webp)

## “Human in the loop”不是治理模型

这句话通常是为了让人放心，但它把真正的设计几乎都留白了。

哪个 human？在哪个点介入？他看到什么信息？他有权 stop action，还是只被要求 rubber-stamp？被影响的客户能不能 appeal？动作能不能 reverse？有没有 audit trail？错误决定发生后谁拥有 repair？

对一个有后果的 agent，我希望六个属性是可见的：

1. **Delegated。** 它的 authority 来自明确的人或机构，而不是从目标里自行推断 mandate。
2. **Bounded。** 它的 permission、spending limit、tools、data access 和 stop condition 是明确的。
3. **Visible。** 重要行动留下 evidence：输入、与推理有关的 context、tool calls、approval 和 outcome。
4. **Challengeable。** 用户、reviewer 或负责团队能在前后质疑、appeal 或 override 一项行动。
5. **Reversible。** 系统错了时能 pause、rollback、repair、compensate 或 contain harm。
6. **Accountable。** 某个人或机构拥有后果，包括解释和 remediation。

![六件实体保障器具围绕一块空白决策碑，放在公民工作台上](imgs/web/03-visible-safeguards.webp)

这比“human reviewed”的 checkbox 强得多。一个 human 可以在场，却没有 authority。一个 log 可以存在，却没人看得懂。一个 rollback 可以技术上可行，却没有人被授权使用。

治理的重量应和后果相称。让低风险 research agent 快速浏览和起草。对资金流动、不可逆数据修改、招聘决定、医疗分诊、法律结论或 production deploy，设置重得多的控制。目的不是拖慢每一次 run，而是让 autonomy 和它可能造成的伤害相称。

## 我们在软件里设计制度

这是希腊一路带给我的 reveal。

我最初只是好奇：一笔债务怎么能看起来更小，却没有真的更轻？这个问题带我走到 proxy problem：系统到底在优化什么？债务危机又带到 failure problem：一个共享系统坏掉时会发生什么？公投带到 authority problem：当所有选项都糟糕时，谁有权决定？

AI agents 把这三个问题放进了同一个 product surface。

它们不只是生成文本。它们在目标内做选择，以不完全一致的方式遵守规则，通过 tools 采取行动，留下 evidence 或没有留下，并把困难案例交回给人——或者不交。它们的行为会变成把它们放进工作里的那个机构的行为。

我们不只是在造更聪明的 agents。我们在软件里设计 decision-making institutions。

这句话听起来比一次家庭旅行该承受的分量更大。但那次旅行给了我合适的距离。希腊在我们身边是历史、食物、天气、渡轮路线、废墟和普通生活。后来我读到一段金融故事，它没有停在金融里。

它不断指回我桌上的工作。

工程任务不是造一个 ruler。工程任务是设计一个制度，让一个有能力的系统可以在其中被允许行动。

---

*这篇完成了 Decision Systems 系列：measurement、failure、authority 和 governance。每一个 agent team 现在都可以问一个很简单、但不容易回答的问题：我们到底在这项决策周围建造了什么制度？*
