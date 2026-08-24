---
title: "在你写 Prompt 前，Coding Agent 已经替你做了四个决定"
date: 2026-09-02
slug: coding-agent-default-decisions
category: ai-native-systems
tags: [agent-harness, coding-agents, prompt-caching, deepseek-harness]
draft: true
---

# 在你写 Prompt 前，Coding Agent 已经替你做了四个决定

我让四个 coding agent 做同一件事：在一个只有十一行的文件里找一个 bug，跑一次测试，不要修改代码。

这个 bug 小得有点好笑。`finalPrice(10_000, 20)` 返回了 `2_000`，因为函数算的是“折扣金额”，不是“打折后的价格”。四个 agent 都找到了它，也都给出了同一行修复。

所以这不是一篇“谁更聪明”的文章。

它关心的是答案出现之前发生了什么：一个 agent 先摸向 code graph；一个带着一整套全局运行环境和 plan-mode 合约进场；一个先快速看清目录，再并行取证；DeepSeek Harness（DSH）则留下了一条可回放的轨迹：列目录、定位、测试、读取、下结论。

答案一样，围绕答案的操作系统不一样。

我们一直把 coding agent 讲得太像“模型加工具”，把 Prompt 讲得太像直接送进一个空房间。事实不是这样。你还没写任何任务之前，harness 已经替你做了四个决定：

1. 这次任务开始时，它会**带着什么**？
2. 什么能力应该等到需要时再**发现**？
3. 什么内容下一次可以更便宜地**复用**？
4. 任务结束后，什么会被**保留**下来？

这四个决定，比你第一句话怎么措辞，更能决定使用体验。

## 小 bug 是一台很好的 X 光机

大项目会把 harness 藏起来。文件多、依赖多，搜索、子 agent、外部服务都可能有正当理由。小 bug 则没那么客气：当几乎没有事可做时，agent 到底先做什么？

我的 fixture 只有一个 `package.json`、一个源码文件和一个测试文件。提示也刻意收得很窄：只跑一次测试，只看必要文件，不编辑，90 个英文词以内说明结论。我使用了本机安装的 Codex CLI、Claude Code、Grok Build 和 DSH。

四个答案都对。真正值得看的是它们的起手式。

| Harness | 一次受控本地运行里看到的路径 | 它暴露出的默认选择 |
|---|---|---|
| Codex | 在落到这个小失败前，先触及已配置的 code discovery 能力。 | 先带上一个随时可理解真实仓库的工程环境。 |
| Claude Code | 已配置的 runtime 与 plan-mode 规则，本身就是这次三文件任务路径的一部分。 | 把运行环境和治理一起带进场。 |
| Grok Build | 先快速定位，再一边跑测试，一边并行读取两个相关文件。 | 定位要短，独立证据可以并发收集。 |
| DSH | tool contract 与 session steps 都能看见：定位、测试、检查、结论。 | 让组装出来的 agent 及其历史可以被检查。 |

这是一组画像，不是排行榜。版本、模型、权限和个人默认配置都不同；它不说明通用质量、速度或价格。但它足以说明一件实用的事：agent 不只是模型和工具，它还是一套关于**何时提交 context、capability 与 state**的策略。

## 1. 带着什么：任务开始前，房间里已经有什么？

Codex 给了我一个很直观的画面。面对一个三文件 bug，它先碰到了已配置的 code-discovery surface。这并不蠢。日常工程环境本来就应该随时准备理解大仓库、追踪归属、把一个任务放回系统上下文。真实工作里，这种准备很有价值。

但它仍是一种选择。通用的就绪状态意味着：用户问一个小问题时，system instruction、tools、project knowledge、rules 与 safety policy 已经有一部分在房间里了。

Claude 从另一个角度把同一件事照亮了。Coding agent 可以进入一个空文件夹，却仍然从“家里”带来东西：全局 hooks、skills、plugins、connector policy、interaction mode。在我的运行里，plan mode 不是一个好看的开关；即便任务只要求诊断，它也参与了 session 如何理解“完成”。

这不是批评。飞行距离很短，不意味着飞行员的 checklist 就是杂物。问题只在于：它是否能被看见、被限定、被改掉。

所以 operator 不该问“为什么这个 agent 带了这么多东西”，而应该问：

> 哪些东西是它安全开工前必须有的，哪些只是已经变成习惯的行李？

DSH 是这个问题很好的入口，因为它的答案非常具体。一个 agent 是组装出来的 profile：model route、instructions、tools、session storage、safety policy、plugins。你能看到部件。在一次本地只读运行里，我也能看到这些部件生成的工作节奏：先定位，再找文件，再测试，再读两个相关文件。

可见不等于轻。它更好的一点是：你终于有地方可以和这份重量争论。

## 2. 何时发现：什么应该先留在门外？

Grok 的路径最利落：列目录、读 manifest，然后在跑测试的同时读源码和测试。对这个小任务，这就足够了。它不需要一张复杂的项目地图来知道往哪里看。

这就是 lazy capability loading 的直觉：不要因为某项能力“可能有用”，就在 opening context 里塞入所有工具、skills 或仓库摘要；让 agent 在任务证明确实需要时，再找到对的东西。

这听起来只是小小的优化，实际上是两种架构。

Prompt caching 说的是：**这份菜单以后还会读，请让重复阅读更便宜。**

Deferred discovery 说的是：**菜单先别整本端上来。**

Anthropic 的 tool-search 文档把第二种做法讲得很清楚：先给一个小型搜索入口，只有任务需要时才加载命中的 tool definitions，而不是在初始 context 中塞入一整个多服务器工具目录。它能实质降低前置 tool-definition 负担，但也要多走一步 discovery。[官方指南同时写清了收益与代价。](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context)

这个结论不只属于 Claude。UI 里显示几个工具，不能告诉你模型收到了多少。五十个已安装 integrations，可能意味着混乱的首轮 request，也可能是干净、可搜索的 catalog；一个看起来很简单的“工具”，也可能藏着巨大的生成式接口。要问的不是 sidebar 里有没有 logo，而是定义在什么时候进入 context。

## 3. 怎样复用：Cache hit 不等于背包变小

这里最容易把比较做成假科学。

同一组本地观察中，Codex、Claude 和 Grok 都展示了 cache 相关的 usage 字段，但名称不同，记账边界也未必一致。所以我不会发布一张假装精确的 token 排行榜。一个带有 `cache` 字样的计数器，不会自动成为通用的 prompt 大小、成本或质量单位。

可靠的结论更朴素：prompt cache 让稳定 prefix 的再次处理更便宜，它不会让这个 prefix 从模型的工作环境中消失。

DeepSeek 把 context caching 描述为默认开启、按 prefix 匹配、best effort 复用，并报告独立的 hit/miss usage。[它的文档对这些边界说得很直接。](https://api-docs.deepseek.com/guides/kv_cache) xAI 也说明 cache 从 message list 的开头开始匹配：前面的消息一旦改动，可复用的边界就会移动。[这是一条明确的 prefix 规则。](https://docs.x.ai/developers/advanced-api-usage/prompt-caching/multi-turn)

所以 cache 的实用规则并不性感，但很有用：真正稳定的东西就让它稳定。别随意重排 system prefix，别每轮重建巨大 tool schema，也别把频繁变化的杂讯放在所有内容之前，如果你希望重复任务得到复用。

但这不等于 context design 已经赢了。一个被很好缓存的六万 token 工具箱，重读也许便宜，但面对一行 bug 时仍可能是错误的工具箱。Caching 改善“带着它”的经济性；Discovery 决定“要不要带着它”。

## 4. 留下什么：下一次任务会继承怎样的过去？

第四个决定最不显眼，实践中却常常最重要。

任务结束后会留下什么？Transcript？压缩后的 summary？仓库 index？持久的 approval？学到的偏好？还是彻底归零？

DSH 很难让你忽略这个问题，因为 session record 本来就是产品形状的一部分。我的运行记录保存了 model route、permission preset、tool calls、results 和最终回答。你要回放奇怪行为、审计一条命令为何执行，或区分模型失败和 harness 失败时，这很有价值。

其他产品会做不同的赌注。一个 fresh ephemeral run 很适合窄小诊断；一个可持续的 working session 很适合长期维护代码库。两者没有普遍正确答案。危险在于：我们常常忘了 persistence 首先是产品决定，其次才是用户偏好。

这也是 safety 出现的地方。一个 harness 记住了一条宽泛 approval、一个 connector 或一段 instruction，明天可能流畅得惊人，也可能在新上下文里显得过强。干净的 agent 不一定是记得最少的 agent；它应该让你看清什么被留下，并能明确地撤销。

## 比较 harness，更有用的问法

我们总想问一个消费者问题：哪个 coding agent 赢？

对 operator 来说，更好的问题其实只有四个：

| 在广泛启用前先问 | 它为什么会改变体验 |
|---|---|
| 默认带着什么？ | 它决定首轮 request、safety posture，以及多少无关能力会来争夺注意力。 |
| 什么可以按需发现？ | 它决定巨大工具与知识表面是否只在任务真正需要时出现。 |
| 什么可以稳定复用？ | 它决定重复任务的成本和延迟——前提是 prefix 真的保持稳定。 |
| 什么会被保留，而且我能检查吗？ | 它决定 debugging、governance、continuity 和意外。 |

这不是四列评分表，而是设计自己 operating model 的四个入口。

在大型、受监管的代码库里，你可能很愿意支付一个“带着治理进场、留下可审计轨迹”的 harness。排查小问题时，你可能更想要一个很小、可丢弃的起点。团队工具生态很大时，lazy discovery 可能比 heroic caching 更关键。工作跨越几天时，persistence 可以是优势——前提是状态有清楚边界。

重点不是让所有 agent 都变得最小，而是让重量变得有意图。

## 我从 DSH 这个入口带走的东西

DeepSeek Harness 仍然是这场讨论最好的引子，不是因为它偷偷赢了，而是因为它把问题说得最直白：一个 harness 是一组组合。你选择什么被挂载、什么被保留、什么被允许、什么能够回放。

其他产品也做同样的选择，而且常常为特定工作提供更好的默认值。把这些默认值当成中性的 plumbing，才是错误。

你的 Prompt 只是 request 露在水面上的尖角。真正的 Prompt 更早就开始了——在 harness 已经替你做出的四个决定里：**带着什么、何时发现、怎样复用、留下什么。**

下一代 coding-agent 的手艺，不会只存在于更花哨的 instructions 里；它会存在于我们对“工作开始前，什么值得在场”所做的更好判断里。

---

*方法说明：本文基于 2026-08-23 在同一台机器、同一个极小 fixture 上，对每个已安装 harness 各进行一次只读运行。它刻意不对产品、模型、延迟、成本或 token 总量排名。源仓库中保留了一份私有 field note，记录边界明确且已脱敏的观察。*
