# 研究档案

核验日期：2026-07-10

## 这份材料要回答的问题

1. ChatGPT Work 与 Claude Cowork 现在各自能做什么，能力边界在哪里？
2. 哪些只是厂商宣布，哪些已经出现可见的真实产物、失败和长期反馈？
3. 对金融团队而言，表格、幻灯片、数据来源、审批和审计如何改变选择？
4. 这场竞争真正争夺的是什么：模型、插件、应用入口，还是整个工作控制层？

## 研究方法与局限

- 使用官方产品页、帮助文档和金融产品公告作为能力与发布日期的一手来源。
- 运行 `last30days` 近 30 天研究，修复证书问题后获得 22 个 Reddit 讨论、9 个 YouTube 视频、24 个 Hacker News 讨论、10 个 GitHub 条目；X 未授权，因此不把 X 缺失误写成“没有讨论”。
- ChatGPT Work 于 7 月 9 日刚发布，只有约一天的公开观察窗口；Claude Cowork 自 1 月发布，存在明显的成熟度与样本不对称。
- 厂商页面只能证明“厂商宣布或展示了什么”，不能单独证明客户结果。

## 核心一手资料

### OpenAI

1. [ChatGPT for your most ambitious work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/) — 2026-07-09。支持：ChatGPT Work 的定位、插件、Sites、定时任务、内置浏览器、桌面本地文件/应用、金融关账与预测用例、可用性和治理声明。不能支持：独立客户生产效果。
2. [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) — 2026-07-10 核验。支持：Chat/Work/Codex 分工、web/mobile 云端运行、desktop 可用本地文件和应用、发布时云端 Work 会话与桌面 Work 不互通。
3. [Introducing ChatGPT for Excel and new financial data integrations](https://openai.com/index/chatgpt-for-excel/) — 2026-02，2026-05-05 更新。支持：ChatGPT for Excel/Sheets 已 GA、金融建模和数据集成方向。不能把合作伙伴引言当作审计后的普遍收益。
4. [Get started with ChatGPT Work](https://www.youtube.com/watch?v=GphgJjaKKhw) — 官方产品演示。支持：插件、本地文件、Sites dashboard、浏览器和任务流程的可见界面。

### Anthropic / Claude

5. [Claude Cowork on web and mobile](https://claude.com/blog/cowork-web-mobile/) — 2026-07-07。支持：web/mobile beta、云端后台运行、离线定时任务、超过 90% 的 Cowork 使用不是软件开发、business operations 与 content creation 约占一半。均为厂商对自有会话的分析。
6. [Cowork and plugins for finance](https://claude.com/blog/cowork-plugins-finance) — 2026-02-24。支持：Excel 与 PowerPoint 跨应用工作、五个金融插件、FactSet/MSCI/LSEG/S&P Global 连接器。
7. [Let Claude use your computer in Cowork](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork) — 2026-04-24。支持：连接器 → 浏览器 → 屏幕交互的工具优先级、应用逐个授权、截屏可能看到敏感数据和防护并非完美。
8. [Customize Cowork with plugins](https://claude.com/blog/cowork-plugins) — 2026-01-30。支持：插件由 skills、connectors、commands、sub-agents 组成，文件化、可编辑、可分享。
9. [How Anthropic's finance team uses Claude](https://claude.com/blog/how-anthropics-finance-team-uses-claude-to-shape-the-narrative-behind-the-numbers) — 2026-05-22。支持：Anthropic 财务团队把 Cowork 用于叙事/材料综合，把 Claude for Excel 用于模型内编辑。属于厂商内部案例，不是外部客户对照实验。

## 可以使用但要谨慎的二手材料

1. [ChatGPT Work vs Claude Cowork launch-window comparison](https://findskill.ai/blog/chatgpt-work-vs-claude-cowork/) — 适合产品表面和时间线，不作为性能基准。
2. [Tom's Guide hands-on Cowork review](https://www.tomsguide.com/ai/i-tested-claude-cowork-anthropics-new-ai-feels-more-like-a-coworker-than-a-chatbot) — 有计划审批、文件清理和 Office 产物的实测描述；仍是单人媒体评测。
3. [WorkBench Revisited](https://arxiv.org/abs/2606.13715) — 工作场景 agent benchmark 可用于提醒“高完成率仍可能伴随非预期有害操作”，但论文中的最佳模型不是这两个具体产品的端到端评测，不能直接宣布产品胜负。

## 可用社区与视频案例

### ChatGPT Work

- [Skill Leap AI launch-day walkthrough](https://www.youtube.com/watch?v=TUu5SuFcf44)，约 04:08：同一提示生成 10 页 `.pptx`，界面显示约 15 分钟、来源核验链接和可下载文件。可证明“生成真实可编辑交付物”的可见案例，不能证明稳定性或与 Cowork 的公平胜负。
- [OpenAI launch video](https://www.youtube.com/watch?v=Wq45rvPGNHs)：截至采集时约 31 万观看；主要是发布热度，不是独立结果。
- [Hacker News launch discussion](https://news.ycombinator.com/) 在研究窗口内对应条目约 348 points / 184 comments；可证明关注度，不等于正面评价。

### Claude Cowork

- [Jeff Su: Learn 80% of Claude Cowork](https://www.youtube.com/watch?v=z9rdrNrkvDY)，约 04:22-04:58：100+ 张收据输入，输出 84 行、两张表、公式、币种汇总，并把不确定行标为 VERIFY。该视频被 r/ClaudeCowork 高赞评论明确推荐，可作为可见的金融/运营工作案例。
- 同一视频约 05:55-06:10：把 NotebookLM 的图片式幻灯片重建为带真实文本框的可编辑 PowerPoint。
- [Cowork coming to mobile and web](https://www.youtube.com/watch?v=XNbc2HhL7J4)，约 00:22：显示离线运行的定时 QBR prep 任务。
- [r/ClaudeCowork: update just stole all my data and work](https://www.reddit.com/r/ClaudeCowork/comments/1us1c97/claude_cowork_update_just_stole_all_my_data_and/) — 63 points / 39 comments。高赞建议把 memory/context 放在文件或 git/cloud 中，而不是只放在聊天历史。单个事故，不可泛化为系统性丢失。
- [r/ClaudeCowork: whose tutorials should I consume?](https://www.reddit.com/r/ClaudeCowork/comments/1uqu6x9/i_want_to_start_using_claude_cowork_whose_videos/) — 69 points / 37 comments。高赞评论推荐 Jeff Su，同时批评大量 YouTube 教程只是复述官方文章。
- [r/ClaudeAI: doubled Cowork usage](https://www.reddit.com/r/ClaudeAI/comments/1txyx3j/your_claude_cowork_usage_limits_just_doubled_for/) — 250 points。核心抱怨是 5 小时窗口翻倍但 weekly limit 未同步上升。说明成本/配额是成熟使用中的真实摩擦。

## 主要反方观点

1. **ChatGPT Work 刚发布，任何“Claude 领先”的结论都可能在数周内过时。** 回应：文章不做永久赢家预测，比较的是当下证据与选择方法。
2. **功能最终会趋同，用户只需要选更好的模型。** 回应：金融价值来自数据位置、工具权限、可编辑交付物、审批、审计和恢复；同一模型放在不同工作架构里，结果完全不同。
3. **最现实的答案是两者都用。** 回应：个人可以多工具，但机构需要定义系统边界、数据流和责任。混合栈仍然必须回答四个工作平面由谁拥有。
4. **视频演示不是生产证据。** 同意。视频只证明特定任务和可见产物；文章必须把它标为 demo/case，而不是稳定性或 ROI 结论。

## 开放问题

- ChatGPT Work 的云端与桌面 Work 会话何时真正互通？
- ChatGPT Work 的插件是否会像 Claude 插件一样提供可版本控制的组织级 skills/commands 资产？
- 两者对 Excel 公式 lineage、引用来源、模型变更审计和审批证据的输出格式有何差异？
- 企业配额、credits 和并发任务在大规模金融部署时的真实成本如何？
- 在同一套合成金融材料上进行盲测，哪个产品的错误更容易被发现和恢复？

## 文章应保留的判断

- ChatGPT Work 的强项是“更大的表面积”：Chat、Work、Codex、浏览器、Sites、插件和跨设备入口被拉进同一产品。
- Claude Cowork 的强项是“更多的伤疤”：半年真实使用带来了 Office 产物、文件工作、插件和定时任务的证据，也暴露了用量、历史、记忆和恢复问题。
- 金融团队不应问“哪个 agent 更聪明”，而应问“哪个工作台能把来源、执行、可编辑产物和控制证据连成一条可复核的链”。
- 真正的护城河会从模型迁移到工作控制层，以及组织自己拥有的 skills、评估集、权限、审计历史和运行手册。
