---
title: "ChatGPT Work vs Claude Cowork：金融需要的不是更聪明的聊天机器人"
date: 2026-07-10
slug: chatgpt-work-vs-claude-cowork-finance
category: ai-native-systems
tags: [chatgpt-work, claude-cowork, finance-ai, ai-agents]
draft: true
---

# ChatGPT Work vs Claude Cowork：金融需要的不是更聪明的聊天机器人

一个屏幕上，ChatGPT Work 花了大约 15 分钟，做出一份带来源的 10 页 PowerPoint。交付的是可以继续修改的 `.pptx`，不是一段等着人工粘贴进 PowerPoint 的大纲。

另一个屏幕上，Claude Cowork 读取一个装有 100 多张收据图片的文件夹，返回了一份费用报表：两张工作表、84 行明细、汇总公式、币种分类，并把来源看不清的行标成了 `VERIFY`。

第二个结果没那么适合做发布会 demo，却更接近金融团队真正需要的东西。一个有用的金融 agent 不能只给答案。它要留下可编辑的工作底稿，保留数字和来源之间的关系，还要让不确定性更容易被复核。

先说清楚限制：这不是一次公平的长期对测。[OpenAI 在 7 月 9 日刚发布 ChatGPT Work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)，Claude Cowork 从 1 月就已经进入用户手里。一个产品只有一天的公开证据，另一个已经积累了半年的真实工作、变通方法、抱怨和故障。

正因为样本不对称，现在最诚实的结论不是宣布赢家，而是：ChatGPT Work 有更大的产品表面积，Claude Cowork 有更多真实使用留下的“伤疤”。两者真正争夺的，也不是哪个模型说话更聪明，而是谁能掌握知识工作的上下文、执行、交付物和控制这四个层面。

对金融团队来说，这个控制层比聊天机器人更重要。

我在意这个区别，是因为我已经在 workspace 的下一层看过它如何产生价值。今年早些时候，我用 Claude 的金融插件跑过 DCF、客户报告和投资建议。最有价值的不是一个完美答案，而是把空白文件变成结构正确、可以修改、能由专业人员复核的起点。Work 和 Cowork 现在争夺的，是这个文件前后整条工作链。

![ChatGPT Work 完成一份带来源的 10 页 PowerPoint，界面显示任务约运行 15 分钟](imgs/source/01-chatgpt-work-pptx.png)

*ChatGPT Work 在发布日演示中生成了一份带来源的 10 页 `.pptx`。来源：[Skill Leap AI](https://www.youtube.com/watch?v=TUu5SuFcf44)，04:08。这是可见的单次演示，不是控制变量的性能对测。*

![Claude Cowork 从收据图片生成费用报表，并列出需要人工核验的例外](imgs/source/02-cowork-expense-workbook.png)

*Claude Cowork 把 100 多张收据图片转成 84 行费用明细，并把不确定的行交给人复核。来源：[Jeff Su](https://www.youtube.com/watch?v=z9rdrNrkvDY)，04:53。*

## 产品能力已经趋同，证据还没有

只看发布文案，ChatGPT Work 和 Claude Cowork 几乎是同一个产品：给 agent 一个目标，连接文件和应用，等它在后台跑完，再拿回文档、表格、幻灯片或报告。

这个描述没有错，但它漏掉了最重要的区别。两款产品在功能层趋同得很快，围绕真实工作的证据却远没有同步。

| 维度 | ChatGPT Work | Claude Cowork |
|---|---|---|
| 使用入口 | web/mobile 云端运行；desktop 可使用本地文件与应用 | web/mobile 云端 beta；desktop 可使用本地文件与应用 |
| 应用操作 | 插件、内置浏览器、桌面应用访问 | 优先连接器；连接器不可用时进入浏览器；屏幕操作兜底 |
| 交付物 | 文档、表格、幻灯片、报告、Sites | 文档、表格、幻灯片、报告、本地文件 |
| 定制方式 | ChatGPT 产品内的统一插件目录 | 由 skills、connectors、commands、sub-agents 组成的文件化插件 |
| 周期性工作 | 定时、事件触发、持续监控 | 定时任务现在可在设备离线时继续 |
| 金融层 | ChatGPT for Excel/Sheets 与金融数据集成 | 金融插件，加 Claude for Excel/PowerPoint |
| 公开成熟度 | 2026 年 7 月 9 日发布 | 1 月发布，7 月 7 日扩展云端 |

OpenAI 正在把更多入口拉进同一款产品。Chat、Work、Codex 分别处理对话、知识工作和软件开发。Work 可以调用插件、内置浏览器、连接的应用，还能用 Sites 把分析变成可分享的 dashboard 或 web app。Desktop 上，它还可以操作本地文件和应用。不过发布时仍有一个很能说明成熟度的限制：[云端 Work 会话还不会出现在 desktop Work 中](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex)。产品目标是统一的，状态还没有完全统一。

Anthropic 走的是另一条路。Cowork 从 Claude Code 处理文件和工具的能力长出来，随后加入插件、定时任务、computer use 和 Office 工作流。它的 computer use 设计暴露了一个很重要的执行选择：[Claude 会按连接器、浏览器、屏幕操作的顺序选择工具](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork)。直接集成通常比在屏幕上移动鼠标更快，也更可靠。

两套架构都还在快速变化。今天真正的区别，是 Cowork 已经有更长时间遇到混乱、例外和边界条件。

两者的成本也暂时无法公平比较。OpenAI 表示 Work 沿用 Codex 的用量结构，任务越复杂，消耗的额度越多。Cowork 用户已经开始强烈抱怨 5 小时窗口和每周上限。在团队还不知道每个方案能支撑多少次真实工作 run 之前，一张静态价格表只会制造虚假的精确感。

## 表面积与“伤疤”

ChatGPT Work 发布时最强的优势是广度。OpenAI 可以把 web research、表格、幻灯片、可分享的 Site 和编码工作拉进同一条链路，不需要用户先拼出另一套工具栈。分发优势也很现实：大量用户已经熟悉 ChatGPT，Work 直接出现在他们知道的产品里。

发布日的 PowerPoint 演示说明了这种广度为什么有吸引力。agent 完成研究，引用来源，生成 deck，并交付可以继续编辑的文件。第一版并不完美：视觉偏普通、字也偏多，创作者马上要求它继续修改。这不是失败，而是更现实的分工。agent 消灭空白页，人负责质量标准。

Cowork 的文件工作证据更密集。在收据案例里，它不只是 OCR。它建立了费用汇总结构，还把来源不足以支持确定答案的行明确标出来。另一个任务中，它把只能当图片看的 slides 重建成真正带文本框、可以继续编辑的 PowerPoint。

Anthropic 自己对使用情况的分析称，超过 90% 的 Cowork session 不是软件开发，业务运营加内容生产约占一半。这不是独立审计，但和社区里已经出现的工作很一致：报告、入职材料、表格核对、客户资料和周期性准备工作。

![Claude Cowork 把图片式幻灯片重建成可以继续编辑的演示文稿](imgs/source/03-cowork-editable-powerpoint.png)

*Cowork 把图片式 slides 重建成可编辑演示文稿。来源：[Jeff Su](https://www.youtube.com/watch?v=z9rdrNrkvDY)，06:07。*

这就是我说的“伤疤”。成熟产品不只会积累功能，也会积累工作在哪些地方会坏掉的证据。

Cowork 用户会抱怨每周用量上限，即使短期窗口临时翻倍也没有解决问题。还有一位用户报告，更新后重要的历史和工作消失了；也有其他评论者表示自己的历史完全正常。这个单一事故不能证明系统性丢失，但高赞回应给出了一条很有价值的操作规则：memory 和 context 应该放进文件、Git 或云存储，而不是把聊天历史当成唯一记录。

这条规则对两款产品都成立。agent 一旦跨越数小时、多个应用和设备，状态本身就成了产品。丢失一段对话不再只是聊天记录不方便，它可能意味着工作底稿、关键假设或审批痕迹一起丢失。

ChatGPT Work 以后也会积累自己的伤疤，只是现在还没有足够时间。

## 金融把差异放大了

金融工作很少是一条 prompt。一次月结可能从多个系统的数据开始，经过 reconciliation 和模型更新，变成 commentary 和 deck，再进入复核与审批。每一次转换，都可能让 context 丢失，也可能让数字和来源脱钩。

OpenAI 和 Anthropic 都看到了这个机会。OpenAI 把 Work 描述成可以帮助金融团队定位来源数据，把数据放进 Excel 或 Sheets，完成 reconciliation，制作 slides 并核验结果。[ChatGPT for Excel 和 Google Sheets](https://openai.com/index/chatgpt-for-excel/) 已经 GA，并加入了金融数据集成、建模、情景分析和研究工作流。

Anthropic 在“打包好的金融工作流”上走得更深。[它的金融插件集合](https://claude.com/blog/cowork-plugins-finance)覆盖 financial analysis、investment banking、equity research、private equity 和 wealth management，并连接多家机构数据提供商。Claude 也可以在 Excel 和 PowerPoint 之间带着 context 继续工作。Anthropic 自己的财务团队说，他们用 Cowork 做综合与叙事，用 Claude for Excel 直接在模型里修改。

在我之前的金融插件测试里，最有价值的变化是：工作从空白 workbook，变成已经带 formulas、assumptions 和 sensitivity table 的正确结构。我在[那篇 Anthropic 金融栈实测](/zh/blogs/anthropic-finance-plugins-insider-take)里展示了真实输出。

ChatGPT Work 和 Cowork 把问题提高了一层。好的 skill 可以编码如何做 DCF 或 IC memo；workspace 决定它能不能拿到正确数据、操作正确应用、生成正确交付物、暴露例外，再把工作送回人手里复核。

在金融里，暴露不确定性往往比表演自信更有价值。一个来源模糊、看起来很漂亮的数字是风险；一个被高亮、带清楚来源的例外，才是 reviewer 能继续完成的工作。

## 四层测试

比较这两个产品最干净的方法，是停止问“哪个更好”，转而检查一个 AI workspace 真正运行起来需要的四层结构。

### 1. 上下文层

来源数据、项目规则、模板、历史决策和机构知识放在哪里？agent 能否在不把敏感材料复制进失控聊天的前提下读取它们？组织以后能否版本化、迁移这些 context？

Cowork 的文件化插件在这里很强，因为 skills、connectors、commands 和 sub-agents 都可以检查和修改。ChatGPT Work 的优势是连接面更广，而且 Chat、Work、Codex 离得更近。两者共同的开放问题，是最有价值的 context 能否保持足够可迁移，最终仍由客户拥有。

### 2. 执行层

工作在哪里运行，可以操作哪些工具？云端执行能让任务在电脑关闭后继续，本地执行可以触达不适合上传的文件和桌面应用。浏览器和屏幕操作能补上集成缺口，却通常比直接连接器更慢、更容易出错。

两款产品现在都横跨 cloud 与 desktop，也都支持周期性任务。真正要测的不是有没有 schedule 按钮，而是定时任务能否进入正确系统，在需要判断的地方停下来，并留下足够证据说明它做过什么。

![Claude Cowork 设置一个跨 email 与 Slack 的 QBR 准备定时任务](imgs/source/04-cowork-scheduled-qbr.png)

*Anthropic 的云端 Cowork 演示设置了一个跨 email 与 Slack 的 QBR 准备任务。来源：[Claude](https://www.youtube.com/watch?v=XNbc2HhL7J4)，00:22。*

### 3. 交付物层

agent 返回的是不是工作真正需要的格式？财务模型要有 formulas 和 linked cells；deck 要有可编辑文本、layout 和来源说明；reconciliation 要有 exception log；报告要把 evidence 和 interpretation 分开。

Cowork 目前在这一层有更强的公开证据，因为用户测得更久。ChatGPT Work 早期的 deck 与 Sites 演示很有潜力，接下来要看的不是它能不能做一次，而是能否在重复运行和公司模板里保持一致。

### 4. 控制层

谁能授权访问？哪些动作需要批准？来源 lineage、logs、成本和任务历史记在哪里？错误更新或 session 丢失后怎么办？团队能否恢复，而不是靠截图和记忆重建整个 workflow？

OpenAI 与 Anthropic 都提供企业控制，也都承认 computer use 有风险。Anthropic 明确提醒：computer use 依靠截图理解屏幕，因此可能看到获准应用里所有可见信息，防护也不是完美的。对金融机构来说，这些不是 edge case，而是部署前提。

| 层面 | 要测试的问题 | 必须留下的证据 |
|---|---|---|
| 上下文 | 能否找到正确来源并应用公司规则？ | 来源、版本、假设 |
| 执行 | 能否跨系统工作并在判断点停下？ | 工具历史、批准、中间状态 |
| 交付物 | 输出是否可编辑、有关联、能显示例外？ | 公式、引用、变更说明、例外清单 |
| 控制 | 访问、成本、错误和恢复能否治理？ | 权限、审计记录、回滚、运行手册 |

一个有用的金融 pilot 应该强迫四层一起工作。给两个产品同一套合成月结资料，让它们完成来源核对、模型更新、variance commentary、管理层 deck 和 exception log。可以测速度，但不能停在速度。每个数字能否追溯？文件能否继续编辑？不确定性是否可见？审批是否发生在正确位置？

然后故意把 run 弄坏。把其中一份来源文件换成旧版本，或加入 mapping error。看 agent 会不会发现，证据链能不能解释变化，reviewer 能否不用从头开始就恢复工作。评估 workbench，要看它的返回路径，不只看 happy path。

这个测试比模型排行榜更有价值。

## 诚实的答案可能是一条边界，而不是一个赢家

最明显的反方意见是：成熟用户两个都用。我自己也会同时使用多个 agent，因为不同工具擅长不同工作。混合栈完全可能是合理答案。

对个人来说，边界可以存在习惯里：一个工具做 research，一个处理 files，另一个写 code。对机构来说，这不够。必须有人决定敏感数据能去哪里，哪个系统拥有任务历史，审批怎样记录，一个 agent 把工作交给另一个时责任如何转移。

以今天的证据，我会在本地文件、公司定制插件以及 Excel/PowerPoint 可编辑交付物占主导时，先从 Cowork 开始；如果工作横跨大量 SaaS 应用、web research、可分享 Sites，而且希望 Chat、知识工作和 code 处于统一入口，我会先试 ChatGPT Work。

我不会因为一个通用 pilot，就把任何一款产品铺到整个金融团队。先选一个边界清楚的工作流，一个对结果负责的 owner，一套合成或已批准数据，再定义证据门槛。尽量把长期资产留在厂商之外：skills、templates、评估集、权限规则、审计历史和运行手册。

这和我在 [Expensive Tokens Won't Save Enterprise AI](/zh/blogs/why-ai-companies-are-becoming-deployment-companies) 里提出的原则相同：一次部署应该让客户自己的能力变强，而不只是更依赖一个很有能力的厂商。

## Workspace 正在成为产品

我之前的判断是 skills 正在成为产品。我仍然相信这一点。一家公司的投资流程、风险规则、报告标准和客户语言，一旦可以编码、复核和复用，就会变得更有价值。

ChatGPT Work 与 Claude Cowork 展示了围绕 skills 正在形成的下一层。Workspace 决定哪些 context 能到达它们、任务能运行多久、可以操作哪些应用、最终生成什么文件，以及组织如何复核和恢复这次工作。

因此，赢家不会由最惊艳的第一条回答决定。真正的胜负在于：谁能把机构知识变成受控制、可编辑的工作，又不让组织忘记这份工作是怎样完成的。

对金融来说，标准很简单：来源无法追溯、例外无法看见、workbook 无法复核，任务就还没有完成。

聊天机器人可以很聪明。工作台仍然必须值得信任。

*我会持续写金融服务与产品交叉位置上的 AI-native systems。如果你也在把 agent 放进真实工作，欢迎关注后续研究。*
