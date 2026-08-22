# 研究档案

## 这份材料要回答的问题

1. 一个 agent 的第一条请求，在用户 prompt 之外还加载了什么？
2. Aaron 自己的 Codex stack 首轮到底有多大，能否用差分实验分层？
3. context footprint 与实际增量账单为什么不是同一个数？
4. skill、tool schema、plugin、MCP 等能力目录，什么时候应该全量加载，什么时候应该按需发现？
5. “把工具变成 code mode / programmatic calling”是真的减少固定成本，还是只搬了位置？
6. 应该优化最小首轮，还是每个成功任务的总成本？

## 核心一手资料

每条材料记录发布日期、核验日期，以及它能支持什么、不能支持什么。

### Aaron 自测：Codex first-request ablation

- 日期：2026-08-16；核验：2026-08-16。
- 文件：`entry-fee-experiment.md`。
- 条件：Codex CLI `0.147.0-alpha.6.5`、`gpt-5.6-sol`、`xhigh`、ephemeral session、相同八词指令、只读 sandbox、无 tool call。
- 结果：core 12,867；加 Aaron Studio workspace 后 15,813（+2,946）；完整项目 stack 五次中位数 17,606（插件/app 层 +1,793）。完整五次范围 16,738–17,755。
- 可支持：本机 stack 的首轮是五位数；core harness 是最大层；workspace 与插件层有可测增量；gross input 与 cached input 必须分账。
- 不能支持：普适 Codex 数字、直接美元成本、模型质量结论、每个 core token 的精确内部归因。

### DeepSeek Harness 橙皮书 v260814

- 发布：2026-08-14；运行快照：2026-08-13；核验：2026-08-15/16。
- 来源：[alchaincyf/deepseek-harness-orange-book](https://github.com/alchaincyf/deepseek-harness-orange-book)，DSH `0.1.0-rc.6`，repo commit `47f9438`。
- 差值称重：首轮未命中输入 13,838；用户问题 29；所以“入场费”13,809。分项近似和 13,836，与日志真值差 2。
- 分项：25 tools 6,510（47.0%）；57-skill catalog 6,242（45.1%）；system 844；runtime 129；protocol 82；question 29。
- skills 让估算 baseline 从约 7,596/7,600 增至 13,838（+82%）；作者明确说明 baseline 是减法估算，不是 clean-machine run。
- 跨进程隔 2m21s 的新 session 命中 13,824/13,838；命中数符合 DeepSeek 64-token unit。
- 可支持：DSH 的具体运行时账单、差值方法、eager skill catalog 的成本、cache 命中与 footprint 的分离。
- 不能支持：其他 harness 的通用占比、当前发布版 DSH 数字、当前价格。正文必须带版本和日期。

### DeepSeek 官方 Context Caching

- 来源：[Context Caching](https://api-docs.deepseek.com/guides/kv_cache) 与 [launch note](https://api-docs.deepseek.com/news/news0802)；核验：2026-08-16。
- 事实：默认开启；usage 分 `prompt_cache_hit_tokens` 与 `prompt_cache_miss_tokens`；需要 prefix unit 完整匹配；best effort；闲置后通常数小时到数天清理；旧说明明确 64-token storage unit。
- 可支持：provider 管缓存、harness 决定前缀是否可复用；cache 读不会删除 gross context。
- 不能支持：100% 命中保证。

### OpenAI 官方 Prompt Caching / Codex loop

- 来源：[Prompt Caching in the API](https://openai.com/index/api-prompt-caching/)（2024-10-01）与 [Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)（2026）；核验：2026-08-16。
- 事实：cache hit 依赖 exact prefix；static instructions/examples 应放前，variable data 放后；tools 与 images 也必须一致；usage 报 `cached_tokens`。旧发布说明 1,024-token 起、128-token increments。
- 可支持：cache economics 是 request assembly 问题；本机相同请求出现不同 cache read 时不能假装 provider cache 是确定性存储。
- 不能支持：把 2024 的模型价格套到 2026 的 Codex model。

### Anthropic 官方 Tool Context 与 Tool Search

- 来源：[Manage tool context](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context)、[Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)、[Tool reference](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference)；核验：2026-08-16。
- 事实：tool definitions 与 tool results 消耗 context；典型 GitHub/Slack/Sentry/Grafana/Splunk 多 server 配置可在做事前消耗约 55k tokens；tool search 通常削减 85%+，只加载 3–5 tools；30–50 tools 后 selection accuracy 明显下降；`defer_loading` 会把 tool 从初始 system prompt 去掉，并且不破坏既有 prompt cache。
- 官方适用边界：10+ tools、definitions >10k tokens、200+ MCP tools；少于 10 tools、全部频繁使用、definitions 极小时传统 eager calling 更合适。
- 可支持：按需能力发现同时解决 context bloat 与选择准确率，不只是省钱技巧。
- 不能支持：85% 对每个 stack 都成立；这是 vendor 给出的 typical result。

### Anthropic 官方 Prompt Caching / Pricing

- 来源：[Pricing](https://docs.anthropic.com/en/docs/about-claude/pricing) 与 `Manage tool context`；核验：2026-08-16。
- 事实：5m write 为 base input 1.25x、1h write 2x、cache read 0.1x；官方明确说 prompt caching 不减少 context tokens，只减少后续请求所付价格；稳定 toolset 的 5m cache 在第二次命中时可回本。
- 可支持：cache 是价格层，不是 footprint 层。

### Google Gemini Context Caching（对照）

- 来源：[Context caching](https://ai.google.dev/gemini-api/docs/caching)；最后更新 2026-07-07；核验：2026-08-16。
- 事实：2.5+ implicit caching 默认开启；把大而稳定的内容放在前缀并在短时间复用可提高命中；implicit 不保证节省，legacy generateContent 的 explicit cache 可用 TTL 换保证的 reuse。
- 用途：只在需要说明“provider cache contract 不同”时使用；正文不做四家价格表。

## 可以使用但要谨慎的二手材料

- 橙皮书是用户实测而非 DeepSeek 官方 benchmark；其价值是可复现运行时账单。所有数字必须与 rc.6、commit、时间绑定。
- Anthropic 的 55k / 85%+ 是官方产品文档中的典型场景与产品主张，不是独立 benchmark。可用于说明数量级和设计方向，不可写成普遍保证。
- Aaron 当前 desktop thread 的 22,573 input / 11,008 cached 是真实 observation，但不是 clean control，只能作为旁证。

## 可用案例

1. **一词回答，17,606-token 首轮**：文章 opening 与核心原创证据。
2. **DSH 13,809 入场费**：完整 itemization，展示 tool/skill catalog 如何超过用户问题两个数量级。
3. **55k-token MCP menu**：将个人 stack 放到 production-scale tool surface，展示按需发现的必要性。
4. **PTC 搬家而非消失**：工具参数表缩短，但类型定义搬进 system prompt，首轮 +9%；小任务单次实验中 305.9s vs 21.9s、17,235 vs 1,416 output。必须带“小任务、三个小文件、单次实验”的边界。文章只取“固定定义没有消失”的机制，不把 14x 当普适结论。
5. **同一 logical footprint，不同 cash cost**：Aaron fresh-process cache read 为 0/5,888/9,984；DSH 可跨进程命中 13,824/13,838。说明 footprint 与 marginal bill 是两张账。

## 主要反方观点

- 更丰富的 context 可能提高成功率、减少后续轮次和 retry；只看首轮会诱导错误优化。
- 按需 tool search 增加一次发现 roundtrip 与 latency，小工具集全量加载反而更简单、更可靠。
- 订阅产品未必按 API token 直接计费，token footprint 不等于用户账单。
- cache 可让稳定前缀很便宜，因此 five-figure footprint 不一定是 five-figure cold cost。
- 不同 harness 的 subagent 会话继承方式不同，“每个 subagent 都完整重付”不能无条件外推。

## 关键事实与引用

已进入 `claim-ledger.md`。写作时优先使用 own measurement、官方 docs、带明确边界的 DSH 用户实验。

完成后把准备进入正文的事实、推断、判断和个人观察写入 `claim-ledger.md`。

## 开放问题

- 发布前重跑后，17,606 是否仍是 full-stack median？
- 能否从 Codex rendered request 进一步拆 core 12,867，而不接触私密 prompt 内容？当前不阻塞文章，但不能伪造归因。
- 文章是否需要 Gemini 对照？目前倾向不进正文，避免 pricing explainer 化。
- 标题用 exact `17,606` 还是更耐久的 `17,000+`？发布前根据重跑决定。

## 文章应保留的判断

- 第一条请求的 footprint 是 architecture choice，不是 prompt-writing choice。
- asset portability 与 asset carrying cost 同时成立。
- cache discount 不能修复 context bloat；tool search/deferred loading 才能减少 footprint。
- 最低 boot cost 不是目标。正确目标是每个成功完成任务的 uncached input 与总成本。
- 每一项 eager capability 都应回答：它提高了多少成功率，或减少了多少后续工作？答不出，就应按需加载或移出默认 surface。
