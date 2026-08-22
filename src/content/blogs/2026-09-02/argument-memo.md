# 论证备忘录

## 核心论点

Agent 的第一条请求不是“用户说了多少话”的账，而是“系统提前加载了多少操作能力”的架构账。Caching 只能改变重复读取的边际价格，不能缩小 context footprint。真正值得运营的指标，是每个成功完成任务消耗的未缓存输入，而不是最短 prompt 或最低首轮 token。

## 为什么现在值得写

- Agent 从 chat 走向长 run、MCP、多 plugin 和 subagent，固定层越来越大，但大多数产品只给总 usage。
- DSH 刚把自己的 request envelope 与 cache invariant 公开，橙皮书又给出可复现的 13,838-token 拆账。
- Anthropic 已经把 55k-token tool surface 与 deferred loading 写进 production docs，说明这不是小众 micro-optimization，而是工具生态扩张后的架构问题。
- Aaron 上一篇结尾明确承诺自测；这篇有系列连续性，也有自己的数据。

## 机制解释

首轮 request 可以拆成三层：core harness（system/protocol/core tools/runtime）、workspace context（项目规则、memory、workspace-specific capability）、capability surface（plugins/apps/MCP/tool schemas）。用户 prompt 只在最末端。

然后再拆第二张账：gross input = cached input + uncached input。Gross input 占 context、影响 latency 与 selection burden；provider pricing 决定 cached/uncached 各自多少钱。Exact-prefix stability 决定能不能复用，但只有 deferred loading/tool search 真正减少初始 footprint。

最后加入 workload denominator：一次任务可能创建多个 fresh sessions，也可能因为 context 太瘦导致 retry。于是正确优化对象不是一条 request，而是 successful completed task。

## 证据地图

1. Aaron 实验：17,606 median；12,867 core + 2,946 workspace + 1,793 plugin/app。
2. DSH/HuaShu：13,838 total、13,809 entry fee；tools 47%、skills 45.1%、question 0.2%。
3. DeepSeek/OpenAI official: exact/full prefix 与 cache usage fields，证明 cache 是 prefix assembly 的函数。
4. Anthropic official: prompt caching 不减 context；55k eager tools、tool search 通常减 85%+，证明 deferred discovery 才减 footprint。
5. PTC counterexample: schema 从 tools 字段搬到 system，不等于消失；优化必须看 rendered request，而不是 UI 上有几个 tool button。

## 需要承认的反方观点

- 大首轮可能换来更高成功率，尤其是 coding agent 需要规则、工具与 repo context。
- on-demand discovery 会增加 latency，并可能在小工具集上不划算。
- subscription 产品的 token usage 与 API invoice 不一一对应。
- cache hit 可显著降低重复 prefix 的价格。

## 对反方的回应

这些反方不是例外，而是把 thesis 校准到正确位置：不要追求最小首轮。每个 eager capability 都必须通过 completed-task economics 证明自己。必要能力应保留并稳定前缀；长尾能力应按需发现；没用且不提高成功率的能力才是纯税。

## 可复用框架

不造 acronym，直接量三件事：

1. boot footprint；
2. cache reuse / miss share；
3. fresh sessions per successful task。

如果要写成公式，只在正文保留一行：

`entry cost per successful task ≈ fresh sessions × effective first-request input / success rate`

其中 `effective first-request input` 必须按 provider 的 cache read/write/miss 单价折算；gross footprint 另行报告。

## 对读者的启发

- 先跑一次一词回答，保存 usage receipt。
- 关闭 workspace、plugin/MCP surface 做 ablation，不要猜哪一块贵。
- 同时报 gross、cached、uncached，不把 cache discount 冒充 token reduction。
- 当 tools 超过十几个或 definitions 进入五位数，测试 deferred loading/tool search。
- 最后用成功任务而不是 request 数量做分母。
