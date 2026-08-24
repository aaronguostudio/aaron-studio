---
title: "你写的 Prompt，不是模型实际收到的 Request"
date: 2026-09-02
slug: your-prompt-is-not-the-request
category: ai-native-systems
tags: [agent-harness, prompt-caching, coding-agents, tool-context]
draft: true
---

# 你写的 Prompt，不是模型实际收到的 Request

我让三个 coding agent 做了一件最无聊的事：

> Reply with exactly: OK. Do not use tools.

Codex CLI、Claude Code 和 Grok Build 都照做了。没有出现 tool call，答案也都只有一个很小的 `OK.`。

然后我看了它们的 receipt。

Codex 给出的是 `input_tokens`、`cached_input_tokens` 和 `cache_write_input_tokens`。Claude Code 则同时给出 `input_tokens`、`cache_creation_input_tokens`、`cache_read_input_tokens`。Grok Build 也有 cache 相关字段，但它来自另一条产品路径和另一种模型运行方式。

这看似只是记账格式。其实不是。

我本来是想接着上一篇 [DeepSeek Harness 拆解](/zh/blogs/deepseek-harness-teardown)，测一测几个主流 coding agent 的“首轮入场费”：谁在任务开始前背的包最重。结果第一个真正有价值的发现反而有点尴尬——这三张 receipt 不能诚实地排进一张排行榜。

连 `input_tokens` 都不是一个通用名词。

这不是实验失败，反而正是实验本身。人写进去的 prompt 一样，但产品在模型看到它之前装配出来的 request 不一样。你打下第一行字之前，harness 已经替你做了很多架构决定。

到目前为止，这份 calibration 只配得上一张这样的对照表：

| 产品 | 本机 calibration 让我们看见什么 | 我拒绝从中推出什么 |
|---|---|---|
| DSH | agent、instructions、tools、skills、persistence 与安全策略组成的默认装配 | 真实首轮 token 总数；尚未发送 model request |
| Codex CLI | JSON receipt 里的 input、cached-input 与 cache-write 字段 | 把 cached 与 cache-write 当成额外 prompt 大小相加 |
| Claude Code | input、cache creation、cache read 字段；空目录里 personal-default surface 仍可能存在 | 把这一个 event 当作整个产品的成本总账 |
| Grok Build | 受限 no-tool run 后，input 与 cache 字段仍然可见 | 关闭 web search 和 subagents 就得到真正 minimal agent |

这不是排行榜，而是每个产品向 operator 开放了什么可见性的地图。

## DSH 把背包打开给你看

DeepSeek Harness 是这个话题很好的入口，因为它把装配过程做得异常清楚。

我检查了本机的 headless 默认配置。它不是一个不可见的黑箱，而是一组可组合的部件：model route、session persistence、安全策略、tools、文件搜索、instructions、skills、compaction、goals……配置文件会写出这些部件和它们的挂载顺序，也会写清 session 存在哪里、权限模式是什么。

这当然**不等于**真实 token 账单。我没有发出 live DSH request：机器上没有 headless profile，我也不会为了填满一张对比表就创建、复制或查看凭证。但隔离的 config dump 至少把一件事钉住了：DSH 在回答任务前，必须先决定这是什么 agent、它能碰什么、它记住什么，以及模型能看到什么。

所有严肃的 harness 都要做这件事。DSH 的价值是，它让这只背包更容易被看见。

市场上常把 prompt 讲得像是从人手里直接进模型。实际上，它加入的是一个已经装好的信封：policy、instructions、tool definitions、skills、workspace knowledge、history，有时还有整套 connectors。

模型不是只在回答你的那一句话。它在回答随这句话一起到达的操作环境。

## 空目录，不等于空 agent

为了把这件事做得更具体，我跑了一个很窄的 calibration：每个已安装产品都在一个新的空临时目录里收到同一条 no-tool 指令，并使用 CLI 能提供的最严格安全模式。它不测智能、速度或价格，只看当目录里没有项目时，agent 还会带着什么。

答案是：不少东西依然会跟着来。

Codex 有一条很有用的 minimal 路径：忽略用户 config 与 rules，然后关闭 plugin 和 app surface。在当前的一次 calibration 里，这确实比我日常的 personal-default 配置轻。但它仍然是一个能工作的 coding agent，带着 read-only policy，也带着并不小的 request envelope。剩下的 token 不能草率地叫作“system prompt”：里面混着 harness protocol、内建能力、runtime context 和那条很短的用户请求。

Claude Code 让边界更明显。它的 personal-default probe 在空目录里启动，但 startup trace 仍初始化了全局 hooks、skills、plugins 和 tool/connector surface。我不会公开这份私有列表，也不会把它的数量说成普遍事实。公开的结论更简单：换一个文件夹，并不一定会让 agent 把从家里带来的东西卸下。

我接着试了 Claude 的真正 bare mode。它按设计不使用已有 OAuth/keychain，而要求 API key 路径。这里最诚实的结果只能是 `not run`。一个还没通过认证就失败的零 token 进程，不是 minimal agent 的测试结果；悄悄换一套凭证，也只会让实验更不干净。

Grok Build 属于同一个大类。我关闭 web search 和 subagents，设为 plan permission，并将其限制为一轮。任务完成时没有 tool call，但 startup 仍显示默认的全局 capability surface。关掉一个看得见的能力，不代表背包里其他东西已经消失。

这是我从实验里拿走的第一条规则：

> 空项目，不等于空 agent。

事后看这很显然。但当一个产品的定制分散在用户 config、extensions、shared skills、connectors、桌面状态和 repo 里时，很容易忘掉。大多数所谓 prompt test，改动的只是系统中最小的一块。

## Cache hit 是更便宜地重读，不是背包变小

这些 receipt 带来第二个陷阱。看到 cached tokens，很容易以为 agent 已经变小了。它没有。

以 OpenAI 的 Responses API 为例，`cached_tokens` 出现在 input-token breakdown 内：它说明 input 里有多少被复用了，并不表示这些内容不再存在。OpenAI 还单列 cache-write tokens，这也是为什么不能把所有 cache 字段相加，然后称它为 prompt 大小。[官方 reference 清楚列出了 usage fields 和 cache controls。](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)

Anthropic 从另一面说明了这件事。它的 API 会把 uncached input、cache creation、cache read 作为 caching 情况下 input 的不同部分。这能解释 Claude Code 为什么可能同时吐出三类数字。但这仍不等于某一个 CLI event 已经覆盖了产品全部内部操作，因此本机结果只能算 calibration，不能变成排行榜。[Anthropic 的定价文档定义了这套输入记账关系。](https://docs.anthropic.com/en/docs/about-claude/pricing)

核心结论不受这个边界影响：cache reuse 改变的是稳定 prefix 被重读时的边际成本，不是让 prefix 从模型 context 里消失。工具、instructions 和 history 仍然是模型工作环境的一部分。

DeepSeek 用自己的方式说了同一件事。它的 context caching 默认开启，按完整 prefix units 匹配，会报告 hit/miss usage，而且是 best effort——entry 随时可能被淘汰。[官方文档把这四点说得很直白。](https://api-docs.deepseek.com/guides/kv_cache) provider 保管 cache；harness 决定自己是否持续送出足够一致的 prefix。

xAI 也是同样的逻辑：cache 从 messages 的开头开始匹配，稳定的 conversation ID 或 prompt cache key 会提高命中可能。修改、删除或重排前面的消息，复用边界就会移动。[这是一条 prefix 规则，不是一个魔法折扣开关。](https://docs.x.ai/developers/advanced-api-usage/prompt-caching/multi-turn)

所以真正的问题有两个：

- agent 带了多少能力进 request？
- 这次其中多少能力可以被便宜地重读？

前者是 context 和选择问题，后者是经济问题。把它们混在一起，很容易得到听起来专业、实际很空的结论。

## 真正的优化，有时是别把整张菜单端上来

如果 caching 不等于缩小 context，什么才会真正缩小首轮 request？

有时答案就是：先别加载。

Anthropic 的 tool search 文档给了一个清晰的公开例子。多 server 环境可能在任务开始前就把约 55,000 tokens 的 tool definitions 放进 context。Tool search 先提供一个小的搜索入口，任务需要时才带入匹配的少数 tools。Anthropic 说，在其典型案例中，这能把首轮定义负担降低超过 85%。[同一份文档也讲清楚了代价：discovery 多一步，小而且经常使用的 toolset 反而可能更适合 eager loading。](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context)

这和 prompt caching 是两种不同的架构动作。

Caching 的意思是：“菜单你还会读，但厨房可能记得它。”

Deferred discovery 的意思是：“整张菜单先别端到桌上。”

这也是为什么 UI 上有多少 tool，是 model context 的一个很差的代理指标。一个 harness 可能只显示一个 tool，却在别处注入一个很长的 generated interface；也可能安装了五十个 tools，却只在任务相关时加载其中三个；也可能很擅长缓存一个巨大的固定 catalog，但仍让 tool selection 变得嘈杂。

正确的设计不是“永远最小”。一个看不到关键 repo rule 的 coding agent，不是高效，而是缺装备。一个团队把最常用的五个内部工具默认加载，也可能是在换取合理的速度。

真正需要判断的是：这项能力是否稳定地提升了完成任务的效果，值得它每次都跟着进场。否则，它就应该是 discovery 的候选。

## 公平的对比，要拆成四个测试

最难的地方，是抵抗过早做一张漂亮表格的冲动。

我起初设想的是一列“first prompt tokens”，每个 harness 一行，再挑出赢家。calibration 直接否定了这个格式。产品暴露的原始字段不同、模型路径不同、边界画在不同位置。一个单数字表看起来科学，却正好抹掉了我们真正想理解的机制。

现在的测试台只问四件事：

1. **什么默认跟着新任务进来？** 在专用空 workspace 里跑一次 no-tool 首轮，保留产品自己的字段名。
2. **什么可以晚点进来？** 尽量使用产品有文档的 minimal、bare 或 extension-disabled 模式；如果它改变认证或无法隔离，就直接写出来。
3. **什么可以复用？** 分开测 continued session 和 fresh process。两者的 cache reuse 不是同一个结论。
4. **什么无法诚实观察？** 标为 opaque。没有 counter，不等于可以从一次运行里反推出完整故事。

第三条尤其重要。Codex 的 ephemeral run 和 Claude 的 no-session-persistence run 之所以适合干净的首轮测试，正是因为它们不能 resume。continued-session 测试需要产品自己的 persistence 和明确选择的 session ID，因此应放到单独的 stateful cohort，不能悄悄混进“临时、可丢弃”的 benchmark。DSH 在这里很特别：它的 headless session store 可以指向临时 home；其他产品的 resumable state 则留在各自产品目录中。

完整 benchmark 会要求每个合格 cohort 做五次串行首轮采样，并另列 continuation 测试。它比今天填表更慢，但这正是 field note 和不负责任的厂商横评之间的区别。

## 在重写 prompt 前，先审计房间

这项工作并不是为了判定 Codex、Claude、Grok 或 DSH 谁“更好”。我每天会因为不同工作用不同的工具。它只给了我一个在讨论 prompt 质量之前更想先问的清单：

1. 哪些 rules、tools、skills、connectors 和 workspace instructions 会默认跟着每个任务进房间？
2. 哪些能力可以等到任务真正需要时才被找到？
3. 稳定 prefix 的哪一部分真的被复用了，什么会打断它？
4. 哪些东西不透明到我应该停止假装自己测到了它？

当然，更大的默认 envelope 可能减少错误、避免重试、提高完成率。完全同意。目标不是最小的 request，而是一笔看得见的取舍：足够能力让任务安全完成，但没有任何永远带着、又无法证明价值的行李。

DeepSeek Harness 仍然是我开始研究这件事的原因。它让隐藏的装配过程变得可检查，而不是神秘。但更广的结论适用于每个 agent：在比较 prompt 之前，先比较你的 agent 已经决定带了什么。

你写的 prompt，是最后一个走进房间的东西。

---

*这是 DeepSeek Harness 系列的一篇工作笔记。四家 harness 的可复现 receipt 表，会等到原始字段与 cohort 边界经得起公平比较后再发布。*
