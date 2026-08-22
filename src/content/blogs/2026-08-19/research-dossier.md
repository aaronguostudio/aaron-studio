# 研究档案

## 这份材料要回答的问题

1. "同一个模型、不同 harness，结果差多少"有没有可引用的一手实验数据？边界在哪里？
2. DeepSeek 开源 harness 的战略事实有哪些是仓库里可验证的（而不是转述的）？
3. Anthropic 与 DeepSeek 在 harness 层的策略镜像，具体镜在哪几个可观察的选择上？
4. 英文世界现有覆盖到什么深度，本文的差异化空间是否真实存在？
5. 对个人 builder 的可迁移结论（rent / churn / own）能被哪些事实支撑？

## 核心一手资料

- **Composio 实验报告**《Finding the Best Harness for DeepSeek V4 Flash》，发布 2026-08-11，核验 2026-08-15（WebFetch 原文）。能支持：同一 V4-Flash 模型、8 个 harness、30 个跨 SaaS 长任务、900 秒上限、程序化验证器核对应用真实状态、共 240 次运行；成功率 46.7%（OpenCode）→66.7%（Pi Agent）；每成功任务成本 $0.028（Pi）→$0.195（Claude Code）≈7 倍；作者结论"Harnesses can matter as much as the models they run"。不能支持：普适的 harness 优劣排名（作者自注：Pi 用了不同 reasoning 设置和双 provider；Prime 有 6 次运行因计分困难被剔除；单一模型家族、单一任务集）。
- **Composio X 线程**（status/2085330850300797394，2026-08 中旬）："Seven tasks passed or failed depending only on which harness we used"——引用这句时注明是官方推文表述。
- **deepseek-harness 仓库本地 clone**（HEAD 47f9438，核验 2026-08-15，仓库日均约 200 commits，发布前需复核）：MIT LICENSE；219 个 package；12,293 commits / 64 天（git rev-list 实数）；`packages/skill` 采用 Claude Code 的 SKILL.md 事实标准且 8 月 9 日删除了自有 skill 格式（.agents/notes 有决策记录）；`~/.agents/skills` 零配置扫描、AGENTS.md 优先 + CLAUDE.md fallback（skill-filesystem 源码 rank 常量）；`packages/hooks` 桥接 Claude Code hooks.json 并在 README 列明 30 事件中 23 个不支持；`packages/subagent` 把 Claude Code 与 Codex 本体注册为 subagent provider；`packages/acp` 实现 Agent Client Protocol。这些是"收编对手生态"论断的全部实物证据。
- **Aaron 的全项目拆解**（2026-08-15，14 agent / 378 次查证，artifact 568d98c8）：作为方法论出处引用，具体论断以仓库路径为准。研究底稿在 `src/brain/reading/deepseek-harness-teardown/`。
- **HN 主贴**（news.ycombinator.com/item?id=49285244，发布当天）："这个他们又是抄谁的？"→"这次它看起来相当原创"——接受度的颜色料。同站 49274600 证实 V4-Pro 0813 与 harness 同日发布。

## 可以使用但要谨慎的二手材料

- **花叔《橙皮书》v260814**：锚定 rc.6 快照与 8 月 17 日前定价；他的实测（首轮 13,809 token 账单、44 事件 3 可见等）本文最多点到，主战场留给 2026-09-02 的成本篇；引用一律标"花叔实测（rc.6）"。内测开发者 JY 的"体验不如 Claude Code / Codex 完善"引语出处是其 X 帖（2087911060154314963），可直接引。
- **英文媒体覆盖**（The New Stack、BigDATAwire、Medium 等，2026-08-13/14）：用于证明"已有 news 级覆盖"，不作为事实来源；star 数各家口径混乱（13k 首日 / 33k 数小时 / 花叔 3 小时两万多），文中避免给精确 star 数，只说"数小时内数万星"或干脆不用。
- **arXiv 2605.23950**《Stop Comparing LLM Agents Without Disclosing the Harness》：学术侧呼应"评测必须披露 harness"，可作一句支撑引用（核验其摘要后再用）。

## 可用案例

- Composio 240 次运行的"七个任务只因 harness 翻盘"——开篇钩子。
- DSH 仓库里"删掉自有 skill 格式、全面采用对手事实标准"的决策记录——"格式投降、语义自主"策略的最硬单证。
- Aaron 自己的多 harness 日常（Claude Code + Codex + 自建 pipeline）与 7 月 deployment 文的前判——个人锚。
- Anthropic 3 月 Claude Code 泄漏事件 vs DeepSeek 5 月公开招 harness 团队、6 月 10 日首 commit（时间线为公开事实；因果连线是花叔的推断，本文不采用因果版本，只并列时间线，或整段不用）。

## 主要反方观点

1. **"harness 差异是 benchmark 噪声"**：Composio 自己列了方法学缺口（Pi 双 provider、Prime 剔分）。应对：不给排名结论，只取"分布宽"这一稳健信号，并引 arXiv 的独立呼应。
2. **"DSH 本身还很糙，说明 harness 层未定型"**：JY 引语 + README 全大写破坏性变更警告。应对：正面承认——这恰是"churn 层"判断的证据，不是反例。
3. **"开源 harness = 亏本赚吆喝，谈不上战略"**：应对：token 是收入端、harness 是获客渠道的结构（模型公司 vs opencode 类独立 harness 的商业模式差异）；加上极简模式作为模型基准环境的自用价值。此段有推断成分，标注为 Aaron 的读法。
4. **"个人 builder 根本不该关心这层"**：应对：rent/churn/own 的落点恰恰是"你可以不换 harness，但你必须知道哪层是你的资产"。

## 关键事实与引用

进入 claim-ledger.md 的核心清单：Composio 五个数字（8/30/240、46.7%→66.7%、$0.028→$0.195、7 任务翻盘、发布日 08-11）；仓库五个事实（MIT、219 包、12293/64、SKILL.md 采用+自有格式删除、CC/Codex 收编为 provider）；两条引语（JY、HN）；一条时间事实（08-13 与 V4-Pro GA 同日）。

## 开放问题

- DSH 发布后 48 小时内是否有 Anthropic/OpenAI 的公开回应？（截至 2026-08-15 检索未见；发布前再查一次。）
- Composio 是否会跑 DSH 本身的 harness 对比？（若发布前出现，是天然的 update 钩子。）
- V4-Pro GA 与 harness 同日发布的官方表述是什么？（发布前核对 DeepSeek 官方公告原文，避免转述失真。）

## 文章应保留的判断

- 层的移动方向判断（deployment 能力产品化）是 7 月 thesis 的延续，不因单一 benchmark 而立、也不因其缺口而废。
- "格式投降、语义自主、本体收编"是对 DSH 生态策略的 Aaron 式概括——三个词各有仓库实证，这是本文超出所有现有覆盖的核心增量。
- rent / churn / own 是给读者的可复用决策框架，结尾必须落在它上面，而不是落在对 DeepSeek 的评价上。
