---
title: "Fable 5 改变了 AI 工作的最小单位"
date: 2026-06-15
slug: fable-5-managing-ai-autonomy
tags: [ai, agents, workflow, ai-governance]
category: ai-native-systems
cover: imgs/web/00-cover.webp
youtube: https://youtu.be/jPHR-73HJa8
---

![Fable 5 改变了 AI 工作的最小单位](imgs/web/00-cover.webp)

我给 Claude Fable 5 一个需要跑几个小时的任务。第一次，我感觉自己不是在 prompt 一个模型，而是在启动一次工作运行。

这个差别只有真正体验过才明显。普通 chat 模式里，我还在工作内部。我问一个问题，看结果，纠正它，补 context，再问一轮，几分钟就要 steer 一次。但 Fable 的感觉不一样。我给它一个目标，它开始规划、分发、研究、综合，最后交付了一组很漂亮的页面。表面结果是页面，更重要的结果是那次 run。

我觉得这才是关键。

Fable 5 不只是产出了更好的 output。它把 AI 工作的最小单位，从 response 变成了 run。

Anthropic 在 [2026 年 6 月 9 日发布 Fable 5 和 Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)，强调它们比之前的 Claude 更适合长时间自主工作。三天后，Anthropic [发布声明](https://www.anthropic.com/news/fable-mythos-access)，说美国政府发出 export-control directive，要求暂停 foreign nationals 对 Fable 5 和 Mythos 5 的访问。为了合规，实际结果是 Anthropic 暂时关闭了所有客户访问，并表示正在努力恢复。

发布和暂停访问，其实从两个方向说明了同一件事。发布说明：agent 可以跑得更久、更可靠地分发任务、更大范围地使用工具。暂停访问说明：一旦 agent 足够强，control、governance 和边界就不再是后置问题。

这篇文章真正想讲的，不是 Fable 很强。真正的启发是：当一个 agent 可以连续跑几个小时，稀缺能力就不再是写一个聪明 prompt，而是设计一个 operating contract，让这次 run 有边界、可检查、可回滚。

## 最小单位从 response 变成 run

Response 很小。它是一段文字，可能加一次 tool call，可能改一个文件。如果错了，我纠正它。如果不完整，我再问一次。错误成本通常是一轮对话。

Run 不一样。Run 有持续时间，有状态，会消耗 token，会调用工具，会读文件、写 artifacts、分发 subagents、形成中间假设，并且可能走很远之后我才检查结果。一个坏假设的成本，不再是一段坏答案，而可能是一整条错误工作分支。

所以更长的 autonomy 改变了注意力的经济学。在 prompt 模式里，我的注意力就是 control loop。在 run 模式里，我的注意力前移和后移。运行前，我要定义目标、context、约束、权限、checkpoint 和 stop condition。运行后，我要检查 evidence，再判断结果能不能用。

模型更强了，但工作系统反而更不能随便。如果目标模糊，autonomy 会放大模糊。如果约束不清楚，autonomy 会探索错误空间。如果 agent 能无边界地行动，autonomy 会把能力变成 operational risk。

所以 "管理 agent" 这个说法还不够准确。真正的工作是 run design。

![Response 和 run 是两种不同的 AI 工作单位](imgs/web/01-response-vs-run.webp)

## Fable 让 control surface 变得可见

Anthropic 自己的 [Fable prompting 文档](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5) 很有意思，因为它不只是讲 prompt。它讲 long runs、effort levels、progress claims、explicit boundaries、parallel subagents、memory systems 和 scaffolding changes。这已经是另一类指导。

如果一个模型可以跑几个小时，界面就不能只是一个 text box。界面需要 timeout behavior、progress indicators、asynchronous check-ins、基于 evidence 的状态报告，以及定义什么时候应该 pause 的机制。如果它可以分发 subagents，harness 就要决定什么时候 delegation 有用，subagents 如何沟通，它们的工作如何被 review。如果它可以维护 memory，系统就需要一个地方记录 lessons，同时避免坏假设污染后续工作。

换句话说，模型能力提升，会倒逼它周围的产品和 workflow 重构。

这也是我在 Fable 那次 run 里的真实感受。我不只是在看 "模型答了什么"。我其实在问另一组问题：它决定研究什么？它分发了什么？它带着哪些假设继续往前？它把 effort 花在哪里？什么 evidence 支撑最终结果？如果 run 跑偏，我应该在哪里介入？

这些不是 prompt 问题。这是 operating-system 问题。

![围绕 agent run 设计 operating contract](imgs/web/03-run-design.webp)

## Superpowers 是一种日常演练

这也是为什么 Fable 的体验立刻让我想到 [Superpowers](https://github.com/obra/superpowers)。

Superpowers 不是另一个模型。它是一个给 coding agents 用的开源 skills framework 和 software development methodology。它的价值不是让模型突然变聪明，而是在模型周围加上一套更有纪律的工作方式。

这个模式很简单：澄清目标，整理 spec，把 spec 变成 implementation plan，通过 subagents 或结构化阶段执行，review 工作，并在声明完成前验证。Skills 变成了 agent 的 reusable operating contract。

这会改变我日常使用 Opus 4.8 和 Codex 5.5 的方式。我可以给 agent 一个有意义的目标，让它工作一到两个小时，因为它不是在自由发挥。它有流程。它会读代码、写计划、按计划执行、检查自己的工作，再把 artifacts 交给我 review。

模型是 engine。Skills 是围绕 engine 的 operating discipline。

这个区别很重要，因为它防止我们得出错误结论。结论不是 "Fable 是未来，所以等更强模型就行。" 结论是：模型越强，周围的工作系统越重要。Superpowers 的价值在于，它让我们在每个模型都能跑半天之前，先练习这种习惯。它让 autonomy 变得可读、可控、可检查。

所以 "skill" 这个词比表面上更重要。一个好的 skill 不是 prompt template，而是一块可复用的 operating judgment：什么时候澄清，如何计划，什么叫 verification，什么时候用 subagents，什么时候要求 review，什么 evidence 足够支持 "done"。

![Superpowers 给模型加上一套 operating discipline](imgs/web/04-superpowers-discipline.webp)

## 这不只是 project management

一个自然的反驳是：这听起来不就是 project management 吗？

某种程度上，是的。这正是重点。AI agents 越强，工作就越不像聊天，越像委托。委托一直都需要目标、context、review 和 accountability。

但 agent delegation 有三个差别，让旧习惯不够用。

第一，agents 以机器速度行动。一个人误解任务，通常很快会产生 friction：提问、延迟、明显偏差。Agent 可以安静地把大量 compute 花在错误理解上，然后交付一个看起来很完整、但方向错了的 artifact。

第二，agents 通过工具行动。它们不只是思考，还会读、写、调用 API、修改文件、发送消息，未来甚至可能花钱或发布内容。风险从 "bad answer" 变成了 "bad action"。

第三，agents 是没有原生 accountability 的概率性 worker。人可以在组织和社会关系里承担决定。Agent 可以产出工作，但责任仍然留在设计这次 run 的人或团队身上。

所以这不只是普通管理。它是面对一种新 worker 的管理：快、不累、有用、不稳定、能使用工具，但并不真正负责。

Operating contract 就是让这种 worker 变得可用的东西。

## Governance 是同一个问题的放大版

Fable 暂停访问这件事，把这个问题放到了地缘政治层面。但同一个模式在每个尺度都存在。

Anthropic 的声明讨论了 safeguards、red-teaming、jailbreak resistance、monitoring、customer data retention 和 defense in depth。Databricks 介绍 Fable 5 时，也把它放在 [governance、audit logs、tool-call policies 和 cost controls](https://www.databricks.com/blog/claude-fable-5-now-available-databricks-fully-governed-through-unity-ai-gateway) 里讲。Gartner 在 [2026 年 5 月](https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-says-applying-uniform-governance-across-ai-agents-will-lead-to-enterprise-ai-agent-failure) 也提醒，不能对所有 AI agents 使用同一种 governance，因为组织必须区分 agent 的 autonomy level 和它被授予的 access scope。

这个区分非常关键。危险的组合不是 intelligence 本身，而是 autonomy 加 access，却没有相应的 control system。

一个只能 observe 的 agent，是一种风险。一个能 draft recommendation 的 agent，是另一种风险。一个可以在 approval 后行动的 agent，又是另一种风险。一个可以跨系统 autonomously act 的 agent，已经是完全不同的类别。

这同样适用于 individual builders。每次我让 agent 跑之前，都要知道自己授予了哪种 autonomy：

- 它只能读、总结和提建议吗？
- 它能改文件吗？
- 它能安装 dependencies 吗？
- 它能调用外部服务吗？
- 它能创建 branch、push code 或 publish content 吗？
- 它不确定时可以继续，还是必须在某些边界停下来？

这些问题不是 bureaucracy。它们就是工作的 control surface。

对每一次有意义的 agent run，我现在会问三个问题：

1. 它能做什么？
2. 我怎么知道它做了什么？
3. 如果它做错了，我怎么停止、回滚或修复？

如果答不上来，我就还没有设计这次 run。我只是启动了它。

![Agent governance 是 autonomy 和 access 的匹配问题](imgs/web/07-governance-pattern.webp)

## 真正的新能力是设计 operating contracts

我觉得 AI-native work 正在走向这里。

Prompt 仍然重要。好的 prompt 是 judgment 的接口。但当工作最小单位变成 run，prompt 就不够了。Run 需要 operating contract。

这个 contract 不一定复杂。我现在会从七个部分想：

**Objective:** 什么结果重要？什么算成功？

**Context:** 哪些文件、事实、docs、rules 或 examples 是 authoritative？

**Authority:** Agent 能读什么、写什么、调用什么、花费什么、发布什么？

**Checkpoints:** 它应该在哪里 pause、report 或 ask for approval？

**Evidence:** 什么 proof 足够支撑 progress claims 和 final claims？

**Budget:** 允许花多少时间、成本和探索空间？

**Rollback:** 如果 run 产出错误结果，怎么处理？

![Agent run 的 operating contract stack](imgs/web/08-operating-contract-stack.webp)

这比 "prompt engineering" 更有用。它更像设计一条小型工厂线。有些工作可以交出去，在后台运行。有些工作必须我深度参与。Leverage 来自知道这两者的区别。

这也是我最近更大的工作感受。AI 让我觉得自己更 powerful，因为更多项目可以同时动起来。我可以让一个 agent 起草，让另一个 agent research，让另一个 agent coding，让另一个 agent 把 plan 变成 distribution assets。但我的 focus 并没有变成无限。恰恰相反，focus 的价值更高了。

瓶颈从 "亲自做每件事"，变成了 "正确路由工作"。

这个环境里最强的 operator，不是盯着每一步的人，而是能把工作设计好的人：让该自动推进的部分自动推进，让重要判断仍然回到人这里。

## 真正留下来的东西

Fable 5 可能会回来。它可能会变化。也可能很快被另一个模型替代。具体产品周期不是最重要的。

真正重要的是：AI work 正在从 prompt-response loop，走向更长时间、更可委托、更可检查的 runs。一旦这个变化发生，优势就会从 access 转向 orchestration。

最强模型当然仍然重要。但最强模型放在一个弱 operating system 里，可能只会产出昂贵的混乱。稍弱一点的模型，放在一个有纪律的 workflow 里，反而可能产出可交付的工作。

这就是我想继续练习的能力：不是只学会要 output，而是学会设计 agent 做真实工作的条件。

未来不属于最会 prompt 的人。它属于那些能让 execution 跑在前面，同时不让 judgment 掉队的 builders。
