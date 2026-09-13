---
type: project
date: 2026-09-10
tags: [skilldev, orgnext, strategy, skills, agent-skills]
status: draft
related:
  - "[[brain/world/people/thiago]]"
  - "[[brain/world/projects/orgnext-mvp]]"
  - "[[brain/world/themes/regulated-financial-ai-career-strategy]]"
  - "[[projects/blog-production-v2/roadmap]]"
---

# Skill IDE 命题的批判性评估（2026-09-10）

> 背景：Aaron 与 Thiago 计划以 50/50 合伙成立第三家公司，做 Skill IDE（开发、eval、自我迭代、可观测），提供工具和云服务，前提判断是"未来很多软件基于 skill"。SkillDev POC 已存在（~5.9k 行 TS，2026-08-25 与 09-07 两次提交）。
>
> 方法：两轮共 47 个并行 agent。第一轮 9 个市场角度 + 完整性 critic + 6 个补漏；第二轮 1 多头、2 空头、5 个替代方向生成器（共 18 个候选）、9 条承重事实各两个视角的反驳验证（其中 `claude plugin eval` 在本机实际运行并计分）、3 个 judge（投资人、bootstrap 工具创始人、加拿大中型资管 CTO 买方）、critic、综合。证据文件见文末索引，引用格式 `[角度:F#]` 对应 `evidence/w1-digest.md`，`[verify:C#]` 对应 `evidence/w2-digest.md`。

> **状态注记（2026-09-10 晚）**：本备忘录写完后 Aaron 补充三条约束：OrgNext 已暂停（台湾客户兴趣低，产品太大不易卖）；合规不作为当前约束；目标改为短平快。因此第 6、7 节里"并入 OrgNext"的前两名（#11、#4）作废，服务类选项（#8、#9）的合规前置条件移除。第 1 到 5 节的市场判断和平台吸收证据仍然有效。短平快候选的新一轮评估见同目录 `memo-quick-wins.md`。

## 0. 一句话

**"skill 是未来软件"作为格式判断已经是事实，作为公司命题是错的。** 三个 judge 把"Skill IDE + 云服务作为第三家公司"在 19 个候选里一致排最后（9、10、10 / 35 分）。你们真正的差异化资产不是 POC，而是 Aaron 的受监管资管运营经验、OrgNext 已有的法律实体加锚定客户加大理团队、以及加拿大财富平台今年刚开的 MCP 门。建议不成立第三家公司，把 SkillDev 并入 OrgNext 当"认证过的流程"的工厂，用固定范围的实施包做付费客户发现。这和你 8 月 22 日 roadmap 第 5 节自己的结论一致："不追 registry，Aaron-only 两个季度"。

## 1. 命题拆三层看

| 层 | 判断 | 关键证据 |
|---|---|---|
| 格式：skills 会成为软件的单位 | **对，且已经商品化** | agentskills.io 46 个客户端，spec repo 25.2k 星；Agent Plugins 1.0 由 Amazon、Cursor、Microsoft、OpenAI、Vercel 组 TSC（无 Anthropic）；GitLab、AWS AgentCore、JFrog 全部按 SKILL.md 读。格式上没人能差异化 [platform-vendors:F1,F9][gapfill-6:F11] |
| 产品：开发 / eval / 自我迭代 / 可观测 | **错，Claude 侧已被吸收，不是"将要"** | 见第 2 节 |
| 公司：两个兼职创始人的第三家 50/50 实体 | **错，且结构上有害** | 见第 4 节 |

你自己 7 月写的受监管金融 AI 战略里有一句："明确不追逐的身份：在没有真实 workflow 前建设的'万能 agent 平台'"。Skill IDE 正是这个。

## 2. 平台吸收：已发生，不是风险

验证 agent 在本机（Claude Code 2.1.267）做了这些事 [verify:C1]：
- `claude plugin eval --help` 完整选项公开：`--ablation with-without`（默认）、regex / tool_order / tool_used / file_exists 确定性 grader 加 llm / baseline、`--threshold` 退出码 1、`--max-cost-usd` 退出码 2、MCP mocks、scaffold 脚本、HTML 报告默认发布到 claude.ai。
- 门控是 `CLAUDE_CODE_WALNUT_SPIRE=1` 环境变量，任何人可开。用一个 stub plugin 实际跑通：真实 agent 运行、计分、aggregate-result.json、report.html、trace.jsonl，花了约 0.03 美元。
- 已有团队拿它当 40 个 case 的发布门（issue #91643）。CHANGELOG 零提及。

POC 七项能力逐项对照 [platform-absorption:F12]：

| POC 能力 | Anthropic 侧 | 其他厂商 | 结论 |
|---|---|---|---|
| inspect / 成本清单 | plugin details、validate --json、/skill-doctor（09-04） | 无 | 已吸收；多 skill 工作流图无人做但也无人付费 |
| fixture 运行 | plugin eval case dirs + scaffold + mocks | Codex 只有 DIY 教程 | 单厂商已吸收；跨 harness 协议未吸收 |
| 隐藏确定性 rubric | plugin eval 四种 grader | 无 | 已吸收 |
| baseline vs candidate | ablation 默认开；skill-creator 盲评 | 无 | 已吸收；Git 钉住的历史回归趋势未吸收 |
| suite 判定 | threshold / cost 退出码 | 无 | 机制已吸收 |
| 事件 trace | OTel `skill.name`、hooks、Agent SDK Skill block | Codex JSONL | 采集已吸收；跨厂商归一化未吸收 |
| 编辑审阅 | skill-creator viewer + feedback.json | 无 | 单轮已吸收；跨版本产物 diff 给非工程师未吸收 |

其他已落地的吸收 [gapfill-6][verify:C3,C6]：
- AWS AgentCore 8 月上线 SkillSelectionAccuracy / SkillInstructionFollowing 两个 skill 级 judge，按 token 计费；同一套 judge 以 Apache-2.0 开源在 strands-agents/evals，能直接读 Claude Code、Codex、Gemini CLI、OpenHands 的 transcript。
- JFrog Agent Skills Registry（扫描、签名、审批、allow/deny、跨 harness 安装，open beta）；9 月 2 日 swampUP 又加 AI Asset Scanning、Agent Guard、APM registry。Snyk Evo 给 SKILL.md 打 0 到 1000 风险分。
- Google Skill Registry preview，9 月 1 日起计费，存储按 GiB 收钱。
- Anthropic Enterprise Analytics API 有 `/v1/organizations/analytics/skills`（只有用量和成本）。
- "自我迭代"是 Anthropic 明说的长期路线（agents create, edit, and evaluate Skills on their own）；SkillsBench 显示自动生成的 skill 平均无收益 [platform-absorption:F4][open-source:F13]。

**唯一没人做的**：把 eval 结果和 skill 版本绑在 registry 里、跨 harness 的证据归一化、给受监管审阅人的产物级 diff。但验证的结论是这些都是 feature-sized，JFrog / Google / AWS 一个季度能补 [gapfill-6:F13][verify:C6]。多头的"Sentry for skills"改写也过不了：可观测性诚实覆盖是 Claude Code 第一、Gemini 第二、Codex 只有显式调用、Copilot 和 Cursor 没有 [gapfill-3]；Claude Code 的 hooks 面未文档化且在 2.1.112 到 2.1.126 之间静默改过语义 [verify:C2]。

## 3. 需求：谁付钱

| 人群 | 发现 | 来源 |
|---|---|---|
| 个人开发者 | HN "How do you manage skills files?"（09-06，312 分 291 评论）零条"我愿意付费"；最热子树开头是"Skills are mostly snake oil"；r/codex 12 个回复里 11 个已弃用 superpowers | [verify:C8] |
| 团队 | 自建：PostHog Context Mill、Postgres 存版本的 skills factory、双周 drift bot；唯一定价的竞品 SkillRepo 8 美元/席位无人问津 | [practitioner:F6,F9][gapfill-4:F8,F11] |
| 认真的 skill 作者规模 | 全球约 6k 到 18k 人、1k 到 3k 团队（三比率链式推断，低置信） | [business-model:F4] |
| 受监管金融买方 | 存在，但是大机构的一线 AI 治理 / 控制角色（JPMorgan AI Control Manager、Western Alliance 的 Copilot Studio agent certification、NYL 的 golden datasets + regression suites、Rockefeller 要求 Claude Skills 熟练度），且 JD 里列的是 Arize、Langfuse、LangSmith、Braintrust、Splunk。中型机构证据只有 3 条 | [verify:C9][gapfill-1:F4-F8] |
| 监管拉力 | 美国 SR 26-2（2026-04-17）把 GenAI 和 agentic AI 明确排除出银行模型风险范围；FINRA 2026 对经纪商要求 prompt/output 日志、模型版本追踪；加拿大 OSFI E-23（2027-05-01 生效）把 AI/ML 含 GenAI 纳入模型范围，但只管联邦监管机构，**不管省级注册的独立资管**。你们所在的细分市场是所有细分里 mandate 最弱的 | [verify:C4][gapfill-1:F1,F10] |

Tessl 是这个命题被资助的版本：1.25 亿美元（2024-11 后无新轮），CLI 71 星，Show HN 7 分，评测只在云端跑、不留 transcript、taxonomy 只有编码类，2026 年 6 到 8 月转向 Tessl Agent、Code Review、Academy。收入未披露 [verify:C5]。

同类 eval / 观测层在 2025 到 2026 年整体被并购：Humanloop 被 Anthropic 收购后产品关闭，Helicone 在 1.6 万组织时进入维护模式，Promptfoo 进 OpenAI Frontier，Langfuse 进 ClickHouse，Galileo 进 Cisco。中间层被折叠，赢家都是全职多年加财富 500 强渗透 [startups:F1,F2]。

## 4. 历史类比：Salesforce DevOps 已验证，但结论对你们不利

Salesforce 2022 年 12 月免费发 DevOps Center，三年后开发者使用率 8.0%，第三方厂商 30.8%，开源 CI 管线 37.8%。独立厂商没被吸收。但 [verify:C7]：
- Gearset 不是车库创业：Redgate 孵化，7 年全职，融资前已 2500 万美元以上 ARR 且现金流为正，客户 ACV 约 1.5 万美元。
- Copado（合规优先，融资 2.57 亿）按收入是 Gearset 的 2 到 3 倍，"Copado 增长更慢"是错的。
- 两个幸存者都比原生工具早 3 年进场、全职、有资本、坐在有 3 年支持承诺的稳定 Metadata API 上。晚进场或小规模的（Salto 2025 年裁员 50%、Blue Canvas、Prodly）不论哪种形态都萎缩了。
- 这些前提对 agent skills 一个都不成立：SKILL.md frontmatter 每月在变，厂商几周就发 eval 功能，没有装机基础。

**这个类比不支持任何形态的独立兼职 skills 工具公司。** 多头和几个替代方案都引用了"Gearset 模式"，验证后被撤回。

## 5. 创始人约束：这是真正的约束

- CEO 时段每周 5 到 7 小时，已经属于 OrgNext。每一个 SkillDev 小时都是 OrgNext 小时。
- Thiago 同时是你在 Mawer 的直接下属、OrgNext CTO，再加 50/50 第三家公司，是三层叠加的权力结构，任何一层的摩擦（绩效、薪酬、离职、雇主询问）会传到另外两层。
- 买方 judge 的视角最尖锐：作为一家加拿大同业资管的 CTO，他的 CCO 会要求你雇主的书面外部活动批准和信息隔离墙，如果你仍在同业竞争者那里负责产品，大概率直接拒绝。**利益冲突不是 HR 手续，是客户端的拒绝理由**，它在书面批准之前砍掉约一半的加拿大独立资管市场。
- POC 的灯塔是博客生产管线，一个从不付费的人群。在错的买方上 dogfood 会把产品优化到错的方向 [vertical:F13][historical:F6]。
- 空头（创始人视角）的话我同意：建工具是"不做更难的客户工作"的一种伪装。你们一起创业的热情是全局里最强的资产，所以更应该用在有买方的对象上。

## 6. 十九个候选方向的 judge 汇总

评分 7 项各 1 到 5 分，满分 35。三列分别是投资人、bootstrap 工具创始人、买方 CTO。

| # | 候选 | 投资人 | 创始人 | 买方 | 结论 |
|---|---|---|---|---|---|
| 11 | OrgNext 内"认证过的流程"：skill 作为公司流程的交付格式，带 fixture、证据、签字，向锚定客户定价 | 25 | **27** | 26 | 三方一致前二 |
| 4 | OrgNext 内"AI use-case register + certification"模块（同 11，监管框架版） | 24 | 23 | **26** | 锚定客户是台湾集团而非加拿大注册商，用 11 的框架 |
| 8 | 固定范围"认证工作流包"，每个 use case 4.5 到 9 万加元，卖给非竞争加拿大机构 | **26** | 25 | 23 | 三方一致前三，前提是雇主书面批准 |
| 9 | AI use-case 认证与再验证 retainer（每月 4 到 8 千加元） | 25 | 26 | 23 | 8 的转化目标，服务变产品的机制 |
| 2 | 按产出计价的运营工作流服务（在 Conquest / d1g1t / OneVest MCP 之上） | 23 | 23 | 22 | 是 8 加 10 压缩版，顺序更冒险 |
| 10 | 按产出计价的报告台 | 20 | 22 | 21 | 终局形态，先过 parallel run 再说 |
| 15 | 面向加拿大 FRFI 的 E-23 agent 认证包 | 21 | 19 | 20 | 买方在雇主冲突圈内，需要 SOC 2，只接 inbound |
| 19 | 什么都不新做：SkillDev 当 OrgNext 内部工厂 | 19 | 24 | 21 | 正确的地板，但从不把价格放到任何人面前 |
| 13 | POC 只做内部工厂 | 19 | 19 | 20 | 无论选哪条都该这么处置 POC |
| 7 | Skill 认证包（面向非工程师审批人的治理层） | 18 | 17 | 19 | 词汇最对，但 OTel 屏蔽差距一个开关就关 |
| 3 | 面向 AI 治理负责人的认证与证据包 | 17 | 15 | 18 | 三个签字方、SOC 2、6 到 12 个月周期 |
| 17 | 证据 schema 上游到 agentskills.io，12 个月不卖东西 | 17 | 16 | 14 | 周末做，预期 0 收入 |
| 18 | 开源运营 skill pack 换付费支持 | 18 | 15 | 15 | 以你的名义发金融运营 skill 是最高的雇主合规暴露 |
| 12 | OrgNext 内面向受监管客户的 register 模块 | 16 | 15 | 16 | 自我标注"不要建" |
| 14 | 面向运营人员的 skill 审阅 | 16 | 15 | 17 | Anthropic 一个版本就能在 Customize 里加 |
| 6 | 证据 schema 上游 + JFrog / Google attestation 适配器 | 15 | 15 | 14 | 参考位置，非产品线 |
| 16 | 模型发布日回归订阅 | 15 | 13 | 14 | 48 小时 SLA 与两份日班工作不兼容 |
| 5 | skillproof 开源回归 CLI | 14 | 13 | 13 | Claude 侧今天已免费，同类工具 1 到 50 星 |
| 1 | **原命题：Skill IDE + 云，第三家公司** | **9** | **10** | **10** | 三方一致最后 |

三个 judge 的分歧只在前四名的顺序：投资人把服务包放第一（它是唯一能在兼职第一年产生现金并测试外部付费意愿的动作），创始人和买方把 OrgNext 内的认证流程放第一（零新冲突面、零新实体、买方已经在付费）。三方都把治理优先的产品（3、7、12、15）排在 10 到 15 名，把证据层开源工具（5、6、16）排在底部。

## 7. 建议

**周一做的事**（三个 judge 都把这条放第一）：
1. 两人向 Mawer 合规提交书面外部活动披露，覆盖 OrgNext 本身和"面向非竞争加拿大机构的证据型工作流实施"；同时写一页协议说明经理 / 下属 + CEO / CTO 的关系怎么处理（谁在公司评 Thiago 的绩效，任一方离开时股权怎么算）。批准回来之前，任何对外销售动作不开始。
2. 不成立第三家公司，不为 skill 工具签 50/50。合伙关系先在 OrgNext 这个已披露、已有客户的实体里测试。
3. POC 冻结产品面：删 React Flow 图、Ollama 适配器、自我迭代支柱、编辑审阅 React 工作台；采用 `claude plugin eval` 和 skill-creator 做 runner；只保留证据包（manifest 仅作 provenance、run.json、events.jsonl、evaluation.json、comparison.json、Git 钉住的 suite-report）、fixture 协议、跨版本回归趋势、给非工程师的静态 HTML/PDF 审阅包。Thiago 投入上限 20% 时间。
4. 把灯塔从博客管线换成 OrgNext 锚定客户的真实流程。

**选项 1，OrgNext 内认证流程（大理团队时间，不占 CEO 时段）**
- 第 1 到 15 天：和锚定客户的运营负责人选 5 个高频管理流程，每个从真实历史案例造 3 个以上 fixture。
- 第 15 到 75 天：与人工流程并行跑 6 周（Anthropic 自己财务团队对约 150 个 skill 用的就是这个模式）；产品内显示认证卡（版本哈希、fixture 通过率、最近签字、drift）加一键证据导出。
- 第 30 天把价格放到赞助人面前：每个认证流程 2 千美元一次性，每流程每月 250 美元再认证，下 10 个流程 2 万美元。
- PASS：5 个里至少 4 个在钉住版本上 fixture 通过率 90% 以上，运营负责人在每条认证记录上签字，fixture 维护每流程每月 2 小时以内，书面同意为下 10 个付 2 万美元以上（或合同上浮 15%）。FAIL：不足 3 个认证、无签字、或维护超 2 小时（POC 自己的"rubric 太脆"退出门）。
- 对 OrgNext 定位的含义：只有当 OrgNext 停止自称"公司的操作系统"、改为拥有系统之上的跨系统流程 / 判断 / 审批 / 证据层时，这一步才加强而不是稀释它。Ridgeline、OneVest、Envestnet 这些记录系统正在自带 agent 和拖拽工作流，正面碰是输的。

**选项 2，认证工作流包（CEO 时段，仅在书面批准后）**
- 第 15 到 90 天：12 次 COO / CCO 级对话，全部在排除名单（雇主、关联方、机构委托的同业名单）之外：2 家独立 PM、4 家 CIRO 经纪 / 顾问公司、3 家多家族办公室、3 家基金管理人。
- 报价：一个工作流（先做投资建议书包），4.5 到 9 万加元固定价，8 到 10 周，交付物是 skill 包、10 到 25 个从该公司历史案例钉住的 fixture、确定性 rubric、并行运行日志、一页 CSA 11-348 词汇写的 use-case 记录。不按小时计费。
- PASS：2 份 4 万加元以上的签约（或 1 签约 + 1 带开始日期的 LOI），至少一个买方说并行记录是购买理由。FAIL：12 次对话 0 签约，或每个客户都要求去掉证据交付物改按小时。
- 转化目标是选项 3 的再认证 retainer（每月 4 到 8 千加元，走客户已有的外包合规预算线）。三家接受同一格式之前不做独立 SKU。

**第 90 天的决策规则**：锚定客户不签认证记录且外部零签约，则证据层退回内部工厂，第三家公司的问题关闭，诚实的下一个决定是有没有一人全职做 OrgNext，而不是做 skill 工具。

**第 9 到 12 个月的产品化触发**：3 个 engagement 复用超过一半的 fixture / rubric / 控制映射，retainer MRR 超过 1.5 万加元，且有平台、外包合规公司或锚定客户提出授权或转售，则在 OrgNext 内打包"AI use-case register + certification"模块。

**真正被回避的决定**：所有路径在每周 5 到 7 小时下都到不了 100 万美元 ARR 这个种子轮门槛。如果这里有一家可融资的公司，它是面向加拿大财富 / 资管的 AI 原生运营公司，按产出计价（Vise 20 到 30 bps、EvenUp 按信计费），需要一人在第 12 个月前全职。现在就决定这是否在桌面上；如果不在，停止用"公司"这个词，把它当一门有工具的盈利副业。

## 8. 只有你们能回答的事实（改变排序）

1. OrgNext 是否已向 Mawer 书面披露并批准？你或 Thiago 是否是 NI 33-109 意义上的注册 / 许可个人（Item 10 外部活动申报）？雇佣合同关于业余时间 IP 归属怎么写？POC 是否在自己的时间和设备上建的？
2. 锚定客户：brain 记录是台湾客户。它是否有受金融监管的子公司（台湾金管会 2024 年 AI 指引要求 AI 系统清单）？付费还是试点？合同额？是否与 Mawer 竞争？
3. OrgNext 现状：付费客户数、MRR、runway、cap table、大理团队规模与可用小时、能否合法处理加拿大客户组合数据。50/50 是给新实体还是 OrgNext？
4. Thiago：实际能给的小时、财务 runway、是否愿意先离开日班工作、是否接受 OrgNext 作为载体而不是承诺的新公司。critic 指出没人分析过"Thiago 先全职"这个唯一能同时消除经理 / 下属冲突并增加小时数的配置。
5. 你：合伙人股权 vesting、最早可能全职的日期。"第 12 个月一人全职"是否可能。
6. Mawer 内部业务用户对 skill 工作流的需求，有没有一个可以赞助"经批准、IP 干净"内部项目的预算负责人？你愿不愿意问？这条从未被当作可谈判的结构探索过。
7. 你们网络里在雇主同业圈之外的加拿大经纪商、家族办公室、基金管理人、信用社有哪些？12 次对话假设这些名字可及。
8. POC 自己的停止门"报告把真实审阅时间减少 30%"量过吗？数字是多少？
9. 锚定客户和 Mawer 业务用户实际跑的是 Claude Cowork / Code 还是 Copilot Studio？这决定所有证据选项的底层。
10. "一家真正的公司"对你们意味着什么：一年 20 万加元、没有种子轮的服务型业务可接受吗？acqui-hire 可接受吗？

## 9. 被低估的选项（critic 提出，未被打分）

- Thiago 先全职（做 OrgNext 或新方向），Aaron 留任。
- 与雇主谈一个经批准的内部项目或 intrapreneurship 安排（雇主作为已披露的第一客户，书面 IP 条款）。
- 通过外包 CCO / 合规咨询公司或加拿大四大做白标渠道；直接问 Conquest / d1g1t / OneVest 有没有合作伙伴计划，而不是因为没验证就放弃。
- 把 POC 的 schema 和适配器授权或卖给 Tessl、JFrog、Braintrust、AWS strands，换小额现金或合同。
- 从卡尔加里可及的非金融、无冲突垂直：能源 / ESG 报告、工程公司、会计事务所、加拿大公共部门（Treasury Board AI 指令）。
- 小额资本解决约束：天使、Alberta Innovates、IRAP、SR&ED、CDL 类项目，让一人全职。
- 有意识的"build to be hired"路径，当作选择而非失败。
- 明确等待并复盘：等 plugin eval GA 和 2026 Q4 的 E-23 预算信号，带日期的观察清单。
- Microsoft Copilot Studio / Power Platform ISV 渠道（中型机构的真实底层）。
- 若锚定客户真是台湾集团：Asia-first，在台湾金管会 AI 指引下，无加拿大冲突。
- 两家一起收或合并的分支只出现在 kill 条件里，从未被打分。

## 10. 证据可信度

已修正的承重事实 [verify]：
- "plugin eval 1 到 3 个季度后 GA"改为"今天即可用"，门控可绕过。
- Enterprise Analytics API 的"07-02 发布"日期无来源，改为"2026-05 前已被第三方记录"；API 本身也对私有 skill 隐藏名字。
- Gearset "bootstrapped and profitable" 改为厂商原话"首次外部融资"、"ARR 近翻倍且现金流为正"，且 Redgate 孵化、7 年全职。
- Snyk "1 in 4 developers, avg 18 skills" 来自早期设计伙伴环境，非全量遥测，不能推出"广泛采用"。
- HN "约 800 条评论零付费意愿"只有 291 条 HN 评论可复核；关键词计数随编码规则变动。
- SR 26-2 不是"反驳"受监管金融需求，而是把 agent 测试义务从二线推到一线且无模板，是需求加速器；但买方在大机构且在你们冲突圈内。
- Tessl SOC 2 是"进行中"（A-LIGN 委托函 2026-07），非"未验证"。

仍是推断、勿当事实：认真作者人口 6k 到 18k；第一年各路径收入区间；Tessl 收入；并购价格（均为编辑估计）；"每 6 个月删掉 skills"来自二手引用；37% 到 77% 触发失败率来自 2026 年 1 到 4 月旧模型；中文生态（Alibaba skill-up 已免费跨引擎 CI 评测、SkillNet 60 万 skill）只做了抽查。

## 11. 证据索引

- `evidence/context-pack.md`：给 agent 的匿名化背景（创始人写作 Founder A / B）。
- `evidence/w1-brief.md`：第一轮执行摘要，`[角度:F#]` 引用的锚点。
- `evidence/w1-digest.md`：第一轮 15 个 agent 全部发现，约 37 万字符，含 981 条来源 URL。
- `evidence/w1-sources.txt`：第一轮 URL 清单。
- `evidence/w2-digest.md`：第二轮验证、judge 打分、综合、critic、多空头、18 个候选完整记录，约 40 万字符。
- 原始 JSON：`evidence/w1-raw.json`、`evidence/w2-raw.json`。
