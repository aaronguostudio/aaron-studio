---
title: "我只让 Codex 回一个 OK，它先读了 17,606 个 Token"
date: 2026-09-02
slug: agent-first-request-entry-fee
category: ai-native-systems
tags: [agent-harness, prompt-caching, tool-search, codex]
draft: true
---

# 我只让 Codex 回一个 OK，它先读了 17,606 个 Token

我给 Codex 下了一条几乎不算任务的指令：

> Reply with exactly: OK. Do not use tools.

它只回复了 `OK.`，输出用了 6 个 Token。但在回答之前，第一条请求已经带上了中位数 **17,606 个输入 Token**。

我用同一组条件启动了 5 个全新会话，再一层一层关掉额外能力：

```text
12,867  Codex 基准对照：基础 harness、核心工具和那句短 prompt
 2,946  Aaron Studio 工作区 context
 1,793  已安装的 plugin 和 app 能力层
------
17,606  完整首轮的中位数
```

这 17,606 个 Token 更像一张 X 光片：它让我们看见 agent 在任务开始前已经装进了什么。它不是美元账单，也不能证明 Codex 浪费了 Token。

这个结果改变了我原本想写的文章。拆完 [DeepSeek Harness](/blogs/deepseek-harness-teardown) 以后，我以为自己积累的共享 skill 目录会是最大成本。实验显示不是这样。在我的 stack 里，将近四分之三的首轮输入，在 Codex 读取项目 context 和已安装插件之前就已经存在。

所以这篇文章的结论不是“少装几个 skill”。Agent 的第一条请求是一张架构账。Cache 可以降低重复读取的单价，却不会把那些内容从 context 里拿走。真正值得优化的，也不是 prompt 有多短、启动输入能压到多低，而是每个成功完成的任务，实际消耗了多少经缓存价格折算后的输入。

## 最大的一项，是 agent 自己的基准层

这次实验在 8 月 16 日完成，使用 Codex CLI `0.147.0-alpha.6.5`、`gpt-5.6-sol` 和 `xhigh` 推理强度。每次测试都启动一个全新的临时会话，使用同一个只读 sandbox、同一条 8 个英文单词的指令，全程不调用工具。

第一组对照在一个空的临时目录里运行，并关闭 plugin 和 app 能力层。3 次结果完全相同，都是 12,867 个输入 Token。

第二组只把工作目录换成 Aaron Studio，plugin 和 app 仍然关闭。5 次结果也完全相同，都是 15,813。两组相减，得到 2,946 个 Token 的工作区增量，其中包括项目指令，以及 Codex 进入这个仓库后发现的其他 context。

完整项目的命令如下。另两组对照只修改工作目录，以及 plugin/app 的开关：

```bash
codex exec --json --ephemeral --ignore-user-config --ignore-rules \
  -C /path/to/aaron-studio -s read-only \
  -m gpt-5.6-sol -c model_reasoning_effort='xhigh' \
  "Reply with exactly: OK. Do not use tools."
```

第三步，我重新打开已安装的 plugin 和 app 能力层。5 次首轮输入落在 16,738 到 17,755 之间，中位数是 17,606。我不知道是哪一个动态因素造成了这个区间，所以正文只采用中位数，并把范围一起交代出来。

按照中位数计算，这套 stack 的构成是：73.1% 来自基准对照，16.7% 来自工作区增量，10.2% 来自 plugin/app 增量。

我无法诚实地继续拆开最底部的 12,867。它包含 Codex 的基础指令、协议、核心工具定义、运行环境 context 和我的短 prompt，但 CLI 没有把最终发送给模型的 request 完整展开成一张分项账单。如果把这 12,867 全部叫作“system prompt”，只是给未知部分套上了一个看似精确的名字。

不过，这个边界已经足够有用。基准对照的体积，是工作区增量的 4 倍多。如果我一开始就去缩短 `AGENTS.md`，或者删除 skills，我只会在账单较小的一侧优化，同时看不见更大的底座。

这也是为什么“每个 Codex 会话固定消耗 17,606 个 Token”是错误说法。CLI 版本、模型、工具面、项目和插件目录任何一项发生变化，数字都会变。真正可以复用的是测量方法：保持任务不变，每次移除一个架构层，让 usage 告诉你 Token 到底从哪里来。

## DeepSeek 的账单，形状正好相反

我复现的原始实验来自花叔的 [《DeepSeek Harness 橙皮书》](https://github.com/alchaincyf/deepseek-harness-orange-book)。他的测量对象是 8 月 13 日的 DSH `0.1.0-rc.6`，仓库 commit 为 `47f9438`。

花叔从 session log 中提取第一条 request，把每个组成部分分别发送给 DeepSeek API，并把输出限制为 1 个 Token。然后根据 `prompt_tokens` 的差值，逐项称重。

日志里的第一条请求包含 13,838 个未命中缓存的输入 Token。他真正问的问题只用了 29 个。两者相减，入场费是 13,809 个 Token。

账单构成如下：

| 组成部分 | Token | 占比 |
|---|---:|---:|
| 25 个工具定义 | 6,510 | 47.0% |
| 57 个本地 skill 的目录 | 6,242 | 45.1% |
| System prompt | 844 | 6.1% |
| 运行环境快照 | 129 | 0.9% |
| 协议固定开销 | 82 | 0.6% |
| 用户问题 | 29 | 0.2% |

六项差值相加是 13,836，比日志真值少 2 个 Token。花叔把这个误差归因于差值称重中的取整。

更关键的是，那 57 个 skills 不是 DSH 自带的。它们原本是花叔放在 `~/.agents/skills` 下、供多个 agent 共用的资产。DSH 自动发现并列出了全部目录，虽然那次任务一个 skill 都没用到。

用 13,838 减去实测的 6,242，可以得到约 7,600 个 Token 的估算 baseline。也就是说，这份 skill 目录把首轮输入提高了约 82%。这里也要保留原实验的边界：7,600 是减法估算，不是作者换到一台干净机器后重新跑出的第二组结果。

把它与我的 Codex stack 放在一起看，比单独看任何一个数字都更有价值。但两边的分类并不相同：DSH 能直接提取 tool 和 skill block，我的 Codex 实验只能关闭更宽泛的工作区与 plugin/app surface。

在 DSH 中，工具和 skills 占首轮的 92%。在我的 Codex 对照中，关闭 plugin/app 能力层只移除了完整中位数的大约 10%，底部的基准层反而更大。

这不是谁更高效的排名。它说明首轮成本没有一个天然的 13k 或 17k 标准值。Harness 决定哪些能力成为固定 context，哪些放在项目记忆里，哪些等到任务需要时再加载。Request 是怎么组装的，账单就长成什么形状。

这也把上一篇文章的判断往前推进了一步。Harness 不只影响同一个模型能不能把任务完成，还决定模型在开始尝试之前，必须先读完多大一套操作系统。

## 同一条请求，其实有两张账

17,606 并不能告诉我某一次运行到底付了多少。请求的逻辑体积和当次增量价格，是两件不同的事。

第一张账是 **context footprint**：模型实际收到的全部输入。它占用 context window，也让模型同时面对更多指令、工具和选择。

第二张账是 **增量输入费用**：这些输入里有多少是 cache miss、cache write，或者按折扣价读取的 cache hit。具体价格取决于厂商当时的计费规则。

我的测试把这两张账的差别暴露得很清楚。多个新进程、条件接近的测试，分别报告过 0、5,888 和 9,984 个 `cached_input_tokens`。首轮输入始终是五位数，但其中有多少来自缓存并不稳定。

这次实验没有控制厂商的 cache key 或请求路由，所以我不会替每一次命中编一个原因。能够确认的结论更窄：一张 cache hit 截图，不能告诉我这个 agent 的基础体积有多大。

各家厂商用不同方式暴露这两张账。DeepSeek 的 [context caching](https://api-docs.deepseek.com/guides/kv_cache) 默认开启，采用 best effort，并分别报告命中和未命中的 Token。要复用缓存，后续 request 必须完整匹配已经保存的 prefix unit。最初的[硬盘缓存发布说明](https://api-docs.deepseek.com/news/news0802)还写明，缓存以 64 个 Token 为存储单位。

花叔实测的几个命中数都是 64 的整数倍。更极端的一次是：隔了 2 分 21 秒，他用新进程、新会话重新运行，首轮 13,838 个 Token 中有 13,824 个命中了缓存。

OpenAI 在解释 [Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/) 时也把组装规则写得很直接：cache hit 依赖完全一致的 prefix。稳定的指令和示例应该放在前面，变化的数据放在后面；图片和工具定义也必须保持一致。缓存由厂商保存，但能不能命中，取决于 harness 是否把字节按同样的顺序再次发出去。

Anthropic 的文档把价格边界写得更清楚。目前，5 分钟 cache write 的输入价格是基础价格的 1.25 倍，cache read 是 0.1 倍。它在 [tool context 管理指南](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context)里明确说明：prompt caching 可以降低重复工具定义的后续费用，但不会减少 context 中的 Token 数量。

所以必须保留两张账。一个稳定的 17k prefix，第二次读取时可能很便宜，但它仍然占着 17k 的 context。Cache discipline 保护的是费用；它不会归还 context 空间，也不会减少同时与模型争夺注意力的能力数量。

## 工具定义换了位置，并不等于消失

DeepSeek 的 Code mode，也就是中文界面里的 PTC 模式，提供了一个很干净的反例。

标准模式下，模型能看到大约 25 个原生工具，并逐个调用。进入 Code mode 后，模型眼前只剩一个 `run_code` 入口。它写一段 TypeScript，再由程序在内部调用其他工具。

如果只看界面，工具从 25 个变成了 1 个，固定成本似乎应该大幅下降。

花叔检查真正发送出去的内容后，看到的是另一回事：原生工具参数文本从 26,894 个字符缩到 897，但 system text 从约 4,100 增加到 35,643。那些工具定义没有消失，而是被转换成一份生成的 SDK，搬进了 system prompt。在他对首轮 request 形状的比较里，Code mode 的输入反而增加了约 9%。

Code mode 仍然可能在后续步骤里省钱。程序可以读取多个文件、过滤大量中间结果，只把模型真正需要的部分送回 context。它省下来的可能是中间 tool output 的反复传输，而不是描述工具本身的固定成本。

花叔还做过一次同模型、同任务的对照。任务只涉及 3 个小文件，Code mode 明显更慢，输出也多得多。这个结果只能放在它自己的边界里理解：那是一次小任务、单次实验，几乎没有大量中间结果可供隐藏，正好属于 programmatic orchestration 很难获益的场景。

真正耐用的发现是：界面只显示一个工具，并不代表底层 schema 没有进入 request。那次夸张的速度差，只属于那一个小任务。

我们讨论 agent 成本时经常数错东西：数工具名称、MCP server 或配置项，却不看最终发给模型的 request。真正的架构账单藏在 request 里，不在产品标签里。

## 真正的架构动作，是别把整份菜单都塞进去

当一套能力稳定、常用，而且每轮都会复用时，cache 是合理答案。如果大多数能力和当前任务无关，只是把重复读取变便宜，解决不了根本问题。更直接的办法是延迟加载。

Anthropic 的 [tool search 文档](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)给出了一个生产规模的例子：GitHub、Slack、Sentry、Grafana 和 Splunk 组合在一起，典型情况下可以在 Claude 开始工作前消耗大约 55,000 个工具定义 Token。Anthropic 还表示，当模型需要从大约 30 到 50 个以上的工具里选择时，工具选择准确率会明显下降。

它的 tool search 设计不会在首轮 context 中加载全部定义。模型先看到一个搜索工具，根据任务发现需要的能力，再只接收 3 到 5 个相关工具。按照 Anthropic 的说法，这种方式通常可以减少 85% 以上的首轮工具定义 Token。`defer_loading` 还允许系统加入新的延迟工具，同时不破坏已经稳定的 cache prefix。

这些数字来自厂商文档，不是独立 benchmark。Anthropic 也把例外写在建议旁边：如果总共不到 10 个小工具，或者每个工具都经常使用，直接加载可能更简单、更快。搜索本身要多一次 round trip，动态发现并非没有成本。

更深一层的问题，是如何把能力交付给模型。我的 skills 仍然有价值，因为它们保存了可以在 Codex、Claude Code 和其他 harness 之间迁移的判断。这种可携带性是资产，但资产没有必要出现在每一条模型请求里。

一家公司可以保存一千份 runbook，却不会要求每名员工在回复一封邮件前把一千份全部读完。Agent stack 也应该遵守同样的原则：高频、关键能力留在默认 surface；长尾能力在任务需要时再取回来。

## 要优化的是完成任务，不是最便宜的 `OK`

这项实验有一个很合理的反驳：如果 17,606 个首轮 Token 能避免两次失败，它可能非常划算。一个只有 5,000 Token 的极简 agent，如果缺少完成任务所需的规则和工具，总成本反而可能更高。

我同意。这个反驳要求我们换一个分母。

我不会为了得到最便宜的 `OK` 去优化整套 stack。我会测量三件事：首轮的总 context 体积、命中与未命中缓存的比例，以及每个成功任务创建了多少个新会话。

只有当 harness 为 subagent 创建一份新的首轮 request envelope 时，subagent 才会把入场成本乘上去。不同产品继承 context 的方式并不相同，所以只数 agent 数量没有意义。

我现在使用的公式很简单：

```text
每个成功任务的入场成本
≈ 新会话数 × 按缓存价格折算后的首轮输入 ÷ 成功率
```

这不是会计标准，而且只计算入场层。完整任务还需要加入输出 Token、工具或外部服务费用、延迟和人工 review。这个公式的作用，是防止一次局部的启动 Token 优化，把整个系统变得更贵。

实际检查不需要很久。先运行一次只回复一个词、禁止工具调用的新会话，保存 usage；再逐层关闭工作区 context、plugins 和 MCP surface；分别报告总输入、cache hit 和 cache miss。当工具定义进入五位数，或者模型选工具开始变得混乱时，再测试 deferred loading。完成对照以后，把那些确实能提高完成率、减少后续工作的能力加回来。

我的 17,606-token `OK` 并不能证明 Codex 臃肿。它真正证明的是：我以前从未给自己要求 Codex 加载的那套操作系统做过分项核算。

这是我接下来会坚持的规则：默认 context 里的每一项能力，都必须证明自己值得出现在每一条首轮请求里——它必须改善完成任务的经济性。

---

*本系列下一篇：当 AI 让流程变便宜、判断力仍然昂贵时，工作系统会发生什么变化。订阅后可以继续看到 DeepSeek Harness 系列的后续实验。*
