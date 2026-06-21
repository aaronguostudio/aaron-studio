---
title: "在去加州的特斯拉上，我把工作交给了 Codex"
date: 2026-06-20
slug: ai-became-my-operating-system
category: personal-operating-system
tags: [ai-agents, codex, claude-code, ai-workflow]
cover: imgs/web/00-cover-v2.webp
---

![一个从车内手机启动的个人 AI 操作系统，任务在去加州的路上继续运行](imgs/web/00-cover-v2.webp)

特斯拉自动驾驶载着我们一家去加州的路上，我打开手机上的 Codex，对着它说了一句话：

去我的 Notion task tracker 里，处理那个博客分析 task，用 Superpowers skill 执行。

我不在书桌前，也不在 IDE 里。我和家人在路上，看着车窗外的风景往后退。与此同时，另一个 thread 里，Claude Code 刚刚完成了我最新的开发任务，前后大概跑了 1.5 小时。

有些工作在我的机器上跑。有些工作在云端环境里跑。有些 agent 在读本地文件，有些在查 docs、API 和网页。有些在写 plan、改代码、生成内容，或者把前一次运行的结果沉淀成下一次 workflow 的反馈。

这听起来像未来工作的 demo。

但不是。这已经是我现在工作的样子。

过去两个月，Claude Code 和 Codex 改变的不只是我的编程方式。它们改变了我和“工作”之间的接口。最开始我还是主要用它们写代码，因为编程是最自然的入口。但很快，同样的模式从 IDE 里跑了出来，进入写作、图片生成、视频制作、数据分析、行政任务、Notion task、scheduled jobs，以及我管理日常的方式。

最大的生产力变化，不是 AI 让我把每个任务做快一点。

更大的变化是：工作的基本单位变了。过去是“我完成一个任务”。现在越来越像是“我设计一个可以执行、汇报、学习的工作系统”。

这就是 AI 从工具变成个人操作系统的那个时刻。

![从单一 AI 工具到分层 AI 操作系统的对比图](imgs/web/01-metaphor-tool-to-environment-v2.webp)

## 编程是第一个入口

编程最先让我感受到这个变化，因为软件开发天然适合 agent 工作：有文件、有 spec、有测试、有 diff、有 branch、有日志、有可以 review 的 artifact。

现在我用 Claude Code 或 Codex，很少只是让它写一小段代码。我更常做的是给它一个工作目标：读这个 repo，理解现有模式，写 plan，实现改动，跑检查，告诉我改了什么。如果任务变得模糊或者风险太高，就停下来。

最近一个例子是 Excel add-in 的 UI 升级。这个任务不是简单的“把界面弄漂亮一点”。它涉及把 web app 的设计系统迁移到 add-in panel，port design tokens，重做 chat panel 的视觉，改善 first-run state，整理 settings，统一 login，调整 ribbon 分组，打包资产，还要保留 benchmark gate。

这不是一个 prompt 能解决的任务。

它是一次 run。

![一次长时间编程任务被展示成带有 review gates 的 agent 执行轨道](imgs/web/02-scene-coding-run-continues-v2.webp)

一次 run 有持续时间，有上下文，会接触文件，会产生中间假设。它可能先阅读，再计划，再编辑，再测试，再修正。等它完成时，我关心的不只是最后回答听起来好不好。我关心它改了什么、有什么证据、跳过了什么、哪里还需要我的判断。

这也是为什么 [Claude Code 文档](https://docs.anthropic.com/en/docs/claude-code/overview) 会强调 long-running tasks、parallel work、browser 和 iOS 访问，以及“任务完成后再回来检查”。Anthropic 也写过 [subagents、hooks、background tasks](https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously) 如何让 Claude Code 更自主地工作。OpenAI 也把 Codex 描述成一个 agentic coding 的 command center，并且支持通过 [mobile app 监控、引导、批准跨设备任务](https://openai.com/index/work-with-codex-from-anywhere/)。

产品方向和我的实际体验是一致的：接口正在从“和模型聊天”转向“管理 agent 工作”。

我的角色也因此变了。我仍然需要懂代码，仍然需要 review，仍然需要审美、标准和风险判断。但我不再总是那个敲下每一行代码的人。更多时候，我是在设计工作可以在什么条件下离开我继续往前走。

## 然后这个模式跑出了 IDE

当这个模式在编程里跑通之后，我开始在所有地方看到同样的结构。

我的博客 workflow 已经不只是“写一篇文章”。它是一条 pipeline。一个粗糙想法先变成 `idea.md`，再变成 researched content plan，再变成写作 outline。然后生成英文文章、中文版本、X post、standalone tweet、newsletter teaser、YouTube script 和 metadata。后面还可以继续进入配图和视频流程。

![AI 工作从编程扩展到写作、视频、数据分析、行政任务和日常管理](imgs/web/03-metaphor-work-leaves-desk-v2.webp)

这表面上是内容生产，但更深层是 workflow design。每一步都有自己的 contract。brainstorm skill 应该输出 content plan，而不是正文。outline skill 应该输出文章结构，而不是社交媒体文案。writing skill 应该产出完整 package，并且在交给下游之前做 depth check。publishing skill 应该检查 taxonomy 和 growth tracking。

视频也是一样。

我最近做了一个 Seedance video lab。第一步很克制：验证火山方舟 Ark 中国区 endpoint 能不能提交 Seedance 2.0 任务，异步轮询，下载 MP4，并估算成本。那个 smoke test 是 4 秒、480p、9:16、无音频、无水印，大概 1.85 RMB。

然后 workflow 开始长大。我们生成 storyboard-grid 首帧，把它们交给 Seedance，产出 15 秒竖屏有声视频，同步到 iCloud，检查媒体参数，生成 contact sheet，再写 critique 和 lessons。后来其中一个方向又变成了一分钟的 prototype。

重点不是 AI 生成了视频。重点是视频系统开始“记住发生了什么”。它保存 prompt、request、summary、output、critique、next variations。这个差别很大：一个是在玩模型，一个是在搭创作机器。

![一个创作视频实验室的 contact sheet，展示 prompt、生成画面、critique 和下一轮变化](imgs/web/07-scene-creative-lab-memory-v2.webp)

Notion 里也是同样的模式。

Notion 很适合作为任务入口。我有一个 task tracker，里面有 blog、Aaron Studio、VGPT、self-improvement 等 project。里面有像“video lab 的搭建”、“aaronguo.com 的 self-enhancement 学习”、“Excel UI 升级”、“如何构架一个可以自我学习的系统”这样的任务。

但真实情况是，Notion 不是整个系统。很多 Notion 页面只是任务外壳。真正的执行记忆分布在 repo、docs、spec、plan、metrics、生成资产和 agent sessions 里。Notion 是 dispatch layer，工作记忆是分布式的。

![Notion 作为任务外壳，下方连接分布式工作记忆的分层架构图](imgs/web/04-light-architecture-dispatch-memory-v2.webp)

所以我觉得“个人操作系统”比“任务管理器”更准确。

任务管理器保存要做什么。操作系统把意图路由到执行，给 process 分配资源，维护状态，记录发生过什么，并决定下一步谁获得控制权。

这更接近我现在的 AI 工作方式。

## 新的循环：intent、skill、run、review、memory

我现在的工作模型可以简化成五个部分。

第一，intent。我定义结果，而不是每一步。“改善这个 UI。”“分析博客。”“写这篇文章。”“生成一个视频概念。”“把这个想法变成内容 package。”intent 的质量很重要，因为模糊的 delegation 会更快地产生模糊的结果。

第二，skill。我把任务路由进一个可复用 workflow。Superpowers 的价值在于规范工作流程：先澄清，再规划，必要时 dispatch subagents，完成前验证证据，并且留下下一次 run 可以复用的 artifact。

第三，run。agent 开始读、查、改、生成、调用工具，或者回来要更多上下文。有些 run 几分钟，有些一两个小时。有些会涉及 background process、dev server、外部 API，甚至多个 agent 并行工作。

第四，review。我检查输出，也检查证据。它改了什么？用了哪些来源？碰了哪些文件？跑了哪些测试？做了哪些假设？它有没有在应该停下来的地方停下来？

第五，memory。结果应该让系统学到东西。博客文章应该产生指标。视频实验应该留下 critique。失败的 scheduled job 应该变成 setup lesson。好的 workflow 应该变成更好的 skill。

![intent、skill、agent run、review gate 和 memory 组成的五段循环](imgs/web/05-clean-framework-intent-skill-run-review-memory-v2.webp)

这就是“AI 帮了我一下”和“AI 改变了我的工作方式”的区别。

一次性的帮助当然有用，但很难复利。工作系统会复利，因为每一次 run 都能留下结构：更好的 prompt、更好的测试、更好的 checklist、更好的指标、更好的默认设置、更清楚的下一步。

## Self-enhancement 是下一层

这是我现在最感兴趣的部分。

我不想要一个只会帮我生成更多东西的 AI 系统。我想要一个能从生成结果里学习的系统。

博客是第一个真实例子。我们现在有了 blog growth model，把网站当成一个 content product，而不是一堆 markdown 文件。这个循环很简单：

发布内容。分发内容。抓取指标。计算质量加权的 reward score。做 postmortem 和 weekly review。把学习结果反馈到选题、写作、视觉、视频和分发 workflow 里。

第一版刻意没有做成完整的 reinforcement learning 系统。它更实际：扫描 content，写入 Turso，读取 Rybbit 指标，跟踪 pageviews、unique visitors、scroll depth、outbound clicks 和 UTM 分发链接。它让每篇文章发布后都可以回答更好的问题：

读者真的读了吗？

他们有没有 scroll？

哪个渠道把他们带过来？

哪些 topic 带来的不是浅层流量，而是 engaged audience？

哪个 hook 把注意力转成了阅读深度？

价值不在 dashboard 本身。价值在于下一篇文章不必完全凭感觉开始。

![博客增长反馈循环，把分发指标转化成下一篇内容计划](imgs/web/06-metaphor-feedback-garden-v2.webp)

这才是 AI 对个人生产力真正有意思的地方。大多数 productivity tools 帮你 capture tasks。有些帮你 automate tasks。但很少有工具能帮你从工作结果中学习，并改变下一次 run。

AI agents 可以补这个空缺。

系统可以读指标，可以比较文章，可以更新 content plan，可以提出更锋利的 hook，可以发现实用 AI explainer 比空泛反思更有效，可以记住某次视频实验里 storyboard-grid 更容易筛出 winner，然后把这些记忆变成下一次 workflow 的默认动作。

这不是魔法，也不是科幻意义上的“AI 自我进化”。它只是一个有更好记忆力的人类-agent feedback loop。

但这已经足够重要。

## 人的角色变得更重要了

一个很合理的反对意见是：这听起来像更多工具、更多 dashboard、更多自动化，也可能只是另一种逃避真正工作的方式。

这个风险是真的。

AI operating system 也可能变成迷宫。它可能制造一种“事情都在推进”的感觉，但其实没有方向。它可能产生比任何人有时间 review 的 artifact 还多。它可能让薄弱判断变得更危险，因为薄弱判断现在有了更大的杠杆。

所以我不认为 AI 会降低人的重要性。它会提高人的重要性。

当执行很贵的时候，瓶颈通常是把事情做完。当执行变便宜，瓶颈就会上移：决定什么重要、设定标准、选择不做什么、知道什么时候停止，以及有足够的 taste 去拒绝那些看起来 polished 但其实错误的输出。

过去，错误 delegation 可能浪费一个下午。现在，错误 delegation 可以浪费算力，产生错误 branch，发布平庸内容，或者把 noisy memory 塞进系统。

所以 operator skill 变了。

最好的 AI 用户不是最会写 clever prompt 的人，而是能设计工作系统的人：让低判断力部分离开自己也能推进，让高判断力部分必须回到自己这里 review。

这意味着 constraints、permissions、checkpoints、evidence、rollback paths、quality gates。也意味着 taste。

agent 越强，我越不想把它当成魔法盒子。我希望它在一个行为足够可观察、边界足够清晰、结果可以修复的系统里工作。

## 目的不是永远工作

这里还有另一个陷阱。

如果 AI 帮我省出了时间，最糟糕的用法就是立刻把每一分钟都填满更多低质量工作。

杠杆的目的不是把人变成机器，而是让生活变大。

![一个安静的家庭公路旅行场景，AI 任务路线退到背景里](imgs/web/08-closing-life-foreground-v2.webp)

如果 agent 可以在我旅行时 research，我就可以陪家人。如果 background job 可以抓取博客指标，我就可以去运动。如果写作 workflow 可以把一个粗糙想法变成结构化 plan，我就可以把更多时间花在阅读、思考和与人交流上。如果视频 workflow 降低了实验成本，我就能探索以前不现实的创作方向。

这才是我真正想守住的部分。

AI productivity 经常被讲成一场竞赛：做更多、发布更多、自动化更多、超过别人。这里面有一部分是真的。杠杆当然重要。但更人性的理解是：AI 可以降低足够多的摩擦，让个人和小团队去尝试以前只有组织才能尝试的事。

这个世界还有太多问题没有被解决。太多想法没有被做出来，只是因为执行成本太高。太多人把最好的时间花在协调、格式调整、搜索、复制和行政摩擦上。

AI agents 不会替我们解决 judgment，不会替我们解决 taste，不会替我们解决 courage，也不会替我们定义什么是好生活。

但它们可以给我们更多空间去练习这些东西。

这就是我乐观的原因。不是因为 AI 会取代人类 operator，而是因为它能让更多人以更高的层级运作。

长期优势不会只属于拿到最强模型的人。模型会变，界面会变，今天的工具会被明天的平台替代。

更持久的优势，是学会搭建更好的 human-agent operating system：一个可以执行、汇报、学习，同时仍然把最值得人投入的工作留给人的系统。

特斯拉里的那个瞬间对我重要，不是因为它让我在路上也能工作。

而是因为我第一次很清楚地感到，我不再需要用旧方式在工作和生活之间做选择。

工作还在推进。

而我仍然在路上，和家人在一起，看着加州越来越近。
