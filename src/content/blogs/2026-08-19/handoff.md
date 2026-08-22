# DSH 博客系列 Handoff（2026-08-15）

给下一个 session 的历史交接文档。本文后续已完成评分、发行包、配图、视频和发布；当前状态以 `package-state.json` 为准，不应把本文件的“下一步”当作待办。

## 新 session 启动指令（直接粘贴）

> 你正在 `/Users/aaronguo/Work/ag/aaron-studio` 仓库中协作。请使用本仓库的 `blog-production` skill 作为总编排入口。开始前依次读：
> 1. `tiles/blog-production/SKILL.md`
> 2. `config/aaron-studio.json`
> 3. `src/content/strategy/x.md`
> 4. `src/content/strategy/blog-writing-language.md`（注意 2026-08-15 新增的「直接陈述优先于自造标签」一节——本文修订中沉淀的规则）
> 5. `src/content/blogs/2026-08-19/` 下所有文件，先读 `handoff.md` 和 `editorial-scorecard.md`
>
> 目标文章目录是 `src/content/blogs/2026-08-19`，按 blog-production 的 Detect-the-next-step 规则报告当前状态，然后一次只执行一个阶段。不覆盖已有产物；对外发布、推送、上传需 Aaron 明确授权。

## 当前状态

- **文章**：《我从 DeepSeek Harness 学到的》/ "What I Learned From DeepSeek's Harness"，slug `deepseek-harness-teardown`，v11 双语定稿，**Article Lock: PASS**（2026-08-15，Aaron 验收）。
- **结构**：Ronacher 注脚开场（Pi 背后公司 Earendil 联创的评价，与结尾呼应）→ 四个编号发现（日志唯一真相+请求前断言 / 主循环一行配置 / 缓存纪律 CI 强制 / AI 建造复杂系统的公开标本）→ 从代码里看 DSH 的战略 → 我学到了什么（三件直接用的 + 两栏资产清单动作）。
- **已完成产物**：idea → Workflow 3 全六件（memory-reflection / editorial-brief / research-dossier / claim-ledger / argument-memo / canon-alignment）→ content-plan / plan → 草稿 11 轮（历史在 `revisions/`：v3 市场框架、v4 被 Aaron 判"过于表面"、v5 拆解转向、v6-v10 逐节深化、v11 白话化）→ red-team（5 项必改已落）→ prose polish（三人审读 26 处）→ 双语 style gate（EN 88/100，一处 formulaic-contrast 审读后有意接受；ZH 100/100）。
- **claim-ledger.md**：C1-C26，Decision: PASS。所有仓库事实 pin 在 clone `/Users/aaronguo/Work/lab/deepseek-harness` 的 commit `47f9438`。

## 下一步（按顺序，一次一个阶段）

1. **editorial-scorecard 对 v11 正式重打分**——现有 89 分是 v4（重写前）的，不可沿用；过线要求 ≥85 且无维度低于权重 70%。
2. **blog-write 发行包**：distribution-plan.md → x-post.md / x-standalone-tweet.md / linkedin-brief.md / facebook-post.md / newsletter-teaser.md。注意：content-plan.md 里的发行 brief 是 v4 时代写的（hook 还是 Composio 7x + rent/churn/own），**需按 v11 的拆解重心重写**——现在最强的传播点是四个发现本身（候选：44 种事件只有 3 种模型可见 / 主循环一行配置可关 / "服务商存，harness 命中" / codex 分支 209 次）。CTA 轮换本篇是 **follow**。
3. **canon-note.md** + 按 memory update gate 回写 `src/content/strategy/blog-memory.md`（新增：rent/churn/own 框架、"服务商负责存 harness 负责命中"、依赖反转/可携带性双刃剑、"机器能查的交机器判断力留人"）。
4. **blog-illustrate 封面**——plan.md 的视觉构思同样是 v4 时代的（散点图/战略镜像图），按 v11 重议；候选新方向：44/3 事件可见性图、一行配置的 before/after、律师读合同的缓存比喻图。
5. video-brief → youtube-script → aaron-video-gen（走各自 audit gate）。
6. publish-to-blog（**Package Lock 前必须清掉下面的复核清单**）。

## 发布前复核清单（源自 claim-ledger）

- C5：对照 DeepSeek 官方公告原文，核"与 V4-Pro GA 同日"的表述。
- C7/C8/C25：仓库路径与三段代码摘录在发布时 HEAD 复核（仓库日均约 200 commits，clone 在 `/Users/aaronguo/Work/lab/deepseek-harness`）。
- C22/C23：Ronacher 引语（The Register 2026-08-14）与 Sawyer Hood 推文链接可达性。
- C26：三家缓存文档 spot-check（DeepSeek/OpenAI 自动前缀缓存、Anthropic 显式标记缓存点）。
- 检查 08-15 之后 Anthropic/OpenAI 是否公开回应 DSH——若有，「从代码里看 DSH 的战略」一节加一段。
- 定价表述：文中用"发布那周定价"限定 1/50-1/120 比例，DeepSeek 08-17 起分时定价——发布日 08-19，确认限定语仍准确。
- 站内链接两条（fable-5、deployment-companies）在目标 blog repo 的路由有效性由 publish gate 验证。

## 系列排期与待 Aaron 拍板

- **已排**：C 制度经济学篇（08-26，前置：在 aaron-studio 或 agents-system 真实落地 rejected/ 目录实验）；B 成本解剖篇（09-02，前置：实测自己 pipeline 的 token 入场费）；D 日志深潜篇（09-09，前置：在自己 pipeline 实现请求前断言）。三篇的 idea.md 已在各自日期目录。
- **待拍板的新增候选**（详见 08-19 目录这轮讨论）：E1 给 agent 立规矩篇（沙箱诚实接口+撞墙给梯子+卡住的定义，实用性最强）；E2 主循环深化篇（effect/disposer + 创造模式 agent 改自己）；E3 工具管线权力设计；E4 一个执行世界；F 八个小设计清单文。
- **研究底稿**：`src/brain/reading/deepseek-harness-teardown/`（14 份子系统分析 + 花书全文提取，含 provenance README）。B/C/D/E 各篇的 dossier 都从这里取料。

## 本轮沉淀的写作规则（已进 strategy 文件）

`blog-writing-language.md` 新增「直接陈述优先于自造标签」一节。另外本 session 反复出现、值得下个 session 直接遵守的修正模式：「抄」一律用「学习/拿来用」；比喻要么是圈内常用（Jupyter、律师读合同）要么当场配解释；小节里的反方观点必须先交代来源再回应；带数字的断言必须一手核验（分支前缀、作者数都是自己在 clone 里数的）；对公司/人物的定性描述过一道公平检验（HN"抄袭"framing 被删的原因）。
