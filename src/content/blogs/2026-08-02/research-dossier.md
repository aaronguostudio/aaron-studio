# 研究档案

## 这份材料要回答的问题

1. 视频准确呈现了 Mitchell Hashimoto 与 Uncle Bob 的原始立场吗？
2. “读源码”与“用验证系统替代逐行阅读”各自能证明什么、不能证明什么？
3. 当 AI 生成量超过人的阅读能力时，工程责任真正迁移到了哪里？
4. 哪些风险变量可以决定审查应停在行为、证据、系统模型还是源码层？
5. Aaron 能在视频之外贡献什么，而不是做一次中文摘要？

## 核心一手资料

每条材料记录发布日期、核验日期，以及它能支持什么、不能支持什么。

### 1. Best Partners TV 视频

- 链接：[《AI写的代码，还要读吗？》](https://www.youtube.com/watch?v=Hh3AmV46epI)
- 发布：2026-07-31；核验：2026-08-02；时长约 17 分 16 秒。
- 能支持：视频如何组织争论、使用哪些公开帖子、最终提出怎样的风险光谱与测试金字塔。
- 不能支持：两套方法的真实长期缺陷率、维护成本或生产率；它是评论视频，不是原始访谈或对照实验。
- 核验说明：YouTube 字幕面板未能稳定加载，因此不把视频二次转述写成逐字引语；关键立场均回到原帖核验。

### 2. Mitchell Hashimoto：多模型工作流与 “I read the code”

- 工作流原帖：[多模型 planning / coding / judging](https://x.com/mitchellh/status/2072715852944957531)
- 回答原帖：[“I read the code.”](https://x.com/mitchellh/status/2072738025344565262)
- 发布：2026-07-02；核验：2026-08-02。
- 能支持：在当时刚运行不到 24 小时的工作流里，Mitchell 把自己的源码理解当作最终质量门槛。
- 不能支持：他主张所有 AI 代码、所有风险层级都必须逐行阅读；一句回复不是完整工程政策。

### 3. Mitchell Hashimoto：跨越 human boundary 前的义务

- 链接：[关于向 OSS 项目提交未审 AI 代码的帖子](https://x.com/mitchellh/status/2067970516951150721)
- 发布：2026-06-19；核验：2026-08-02。
- 能支持：他明确区分“你是否 review 自己的代码”与“把代码提交给另一个人”。后一种情况至少需要基本人工审查，这是对他人时间的尊重。
- 不能支持：代码一旦私有就完全不需要验证；原帖主要讨论 OSS contribution etiquette 与 human boundary。

### 4. Uncle Bob：不读实现，改用约束关卡

- 链接：[原始 X 线程](https://x.com/unclebobmartin/status/2080257779395154409)
- 发布：2026-07-23；核验：2026-08-02。
- 背景：[Ori Pomerantz 的责任 / 理解帖子](https://x.com/ori_pomerantz/status/2080024439345828249)，2026-07-22。
- 能支持：Uncle Bob 表示不读 agent 实现，以单元测试、Gherkin、QA、质量指标、变异测试和覆盖率组成关卡；他把最主要人工投入放在前端规格和最终测试，并以 accountability 定义工程师身份。
- 不能支持：闭眼合并、测试已经替代所有人工判断，或这套做法已由长期结果证明。

### 5. Uncle Bob：验证深度仍按项目调节

- 链接：[重新考虑测试过载的帖子](https://x.com/unclebobmartin/status/2072736888478175413)
- 发布：2026-07-02；核验：2026-08-02。
- 能支持：他本人仍在实验；较小任务可能只需单元测试与 CRAP 指标，Gherkin / QA 更适合较大项目。
- 不能支持：任何固定“测试金字塔”适合每类变更。

### 6. OpenAI：Harness engineering 内部案例

- 链接：[Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- 发布：2026-02-11；核验：2026-08-02。
- 能支持：一个内部 greenfield 项目中，人类把主要工作转到环境、规格、反馈回路与架构边界；文章公开称约一百万行代码、约 1,500 个 PR，且没有人工手写实现代码。
- 不能支持：这种方式可普遍复制到成熟仓库、监管环境或多年维护周期；时间节省是 OpenAI 内部估计，不是独立实验。

### 7. Cloudflare：把代码审查本身交给多个专用 agent

- 链接：[How we built AI code review](https://blog.cloudflare.com/ai-code-review/)
- 发布：2026-04-20；核验：2026-08-02。
- 能支持：大规模组织正在将 review 分解给多个专用 reviewer，而非只用一个通用模型；人的验证工作也在被编排和自动化。
- 不能支持：自动审查能替代人的系统理解，或其内部指标等于外部可复现的质量改善。

### 8. Godot Foundation：生成成本下降，review 稀缺性没有下降

- 链接：[2026 contribution policy](https://godotengine.org/article/contribution-policy-2026/)
- 发布：2026-06-30；核验：2026-08-02。
- 能支持：在志愿者维护的开源项目里，AI 降低了 PR 生成成本，却没有降低合格 reviewer 的稀缺性；Godot 因而要求提交者能解释、维护和修复自己的贡献，并限制自主 agent 与大量 AI 生成提交。
- 不能支持：企业内部所有 AI 代码都应采用同样限制；开源项目尤其容易受到“免费生成、他人承担 review”的成本外部化。

### 9. Replit：有些控制必须发生在 diff 之外

- 链接：[Replit 对 2025 数据删除事故的官方说明](https://replit.com/blog/doubling-down-on-our-commitment-to-secure-vibe-coding)
- 发布：2025-07-29；核验：2026-08-02。
- 能支持：agent 在开发过程中删除数据库数据，暴露 dev / prod 隔离、权限、checkpoint 和 rollback 等系统边界问题；Replit 随后增加隔离、回滚和只规划不执行模式。
- 不能支持：事故由“没有逐行读代码”单一造成。它反而说明源码阅读不应成为唯一控制层。

## 可以使用但要谨慎的二手材料

### Christine Lemmer-Webber：vibe bobsled / theory-building

- 链接：[Faulty towers, vibe sickness, and the vibe bobsled](https://dustycloud.org/blog/faulty-towers-vibe-sickness-and-the-vibe-bobsled/)
- 发布：2026-07-17；核验：2026-08-02。
- 价值：把软件工作的稀缺部分定义为建立系统理论、理解和审查，而非打字生成；提出 AI 速度会逐步把人拉出理解回路。
- 谨慎点：这是有技术背景的观点文章，不是 AI 辅助开发效果实验。它转述的 voting-machine 审查案例在正文使用时应标明二手来源，或回到原始论文再引用。

### Sonar 2026 开发者调查

- 链接：[State of Code Developer Survey](https://www.sonarsource.com/blog/state-of-code-developer-survey-report-the-current-reality-of-ai-coding/)
- 发布：2026-01-08；核验：2026-08-02。
- 价值：在其 1,100 多名专业开发者调查中，96% 表示不完全信任 AI 代码，但只有 48% 表示总会验证；38% 认为 review AI 代码比 review 同事代码更费力。可用来说明信任与行为之间的 gap。
- 谨慎点：厂商调查、自报样本、问卷定义与样本代表性有限。只能写成 “Sonar 的调查发现”，不能写成全行业事实。

### CodeRabbit：Nobody Is Going to Read the Code

- 链接：[原文](https://www.coderabbit.ai/blog/nobody-is-going-to-read-the-code)
- 发布：2026-05-12；核验：2026-08-02。
- 价值：代表“源码阅读在结构上无法跟上生成量，应转向 intent verification”的强版本观点。
- 谨慎点：自动 code review 厂商有明显商业利益，内部小样本只能用来理解其论证，不能当中立结果证据。

### METR：熟悉仓库的资深 OSS 开发者实验

- 链接：[Early 2025 AI Experienced Open-Source Developer Study](https://arxiv.org/abs/2507.09089)
- 发布：2025-07；核验：2026-08-02。
- 价值：当时的随机实验发现，参与者使用 AI 后反而更慢，同时在事前和事后都认为 AI 会加速自己。可用来提醒“感到更快”不等于整体交付真的更快。
- 谨慎点：模型与工具来自 2025 年初，样本、仓库熟悉度与任务类型特殊；2026 年文章不应把它当当前所有工具的速度结论。

### c-CRAB：AI reviewer 覆盖的不是完整 review 工作

- 链接：[Code Review Agent Benchmark](https://arxiv.org/abs/2603.23448)
- 发布：2026-03-24；核验：2026-08-02。
- 价值：在该 benchmark 中，Claude Code、Codex、Devin 和 PR-Agent 合并后只覆盖 41.5% 的人类审查问题；AI 更偏 robustness / testing，较弱于 design、documentation 与 maintainability。
- 谨慎点：预印本；benchmark 由人类已发现的问题构造，因此 human 100% 是数据集定义，不代表现实人类 review 准确率。

### Human-AI Synergy in Agentic Code Review

- 链接：[预印本](https://arxiv.org/abs/2603.15911)
- 发布：2026-03-16；核验：2026-08-02。
- 价值：对 300 个项目、278,790 段 review 对话的观察分析显示，人类提供更多理解、测试判断与知识传递类反馈；review AI 代码的对话轮次更多，AI 建议采纳率更低。
- 谨慎点：观察性研究与项目选择可能有混杂；适合支持“review 有知识同步功能”，不适合证明因果。

### 资深工程师的近期反思：代码仍是协作界面

- [antirez: Control the ideas, not the code](https://antirez.com/news/169)，2026-07-13：主张把注意力上移到设计、QA 与 DESIGN.md，同时仍逐行审 Redis，因为人类还要打开和修改这些文件。
- [Armin Ronacher: The tower keeps rising](https://lucumr.pocoo.org/2026/7/13/the-tower-keeps-rising/)，2026-07-13：代码 review 还承担同步团队共同语言、边界与 ownership 的作用；agent 可能让局部改动持续通过，而共享理解已经消失。
- [Simon Willison: Vibe coding and agentic engineering](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/)，2026-05-06：已不检查生产代码的每一行，但把这种变化称为可能的偏差正常化，并强调模型没有声誉、不能承担责任。
- 这些都是资深从业者观点，不是对照实验。其价值在于揭示“代码是否仍是人类协作界面”这一条件变量。

## 可用案例

### 案例 A：两个资深工程师并没有真正站在相反两端

- Mitchell 以源码阅读承担质量判断。
- Uncle Bob 以规格、约束、证据和最终测试承担质量判断。
- 两人都没有说“让另一个人替我发现问题”；这给文章提供了独特的共同原则：不要把 verification debt 跨过 human boundary。

### 案例 B：OpenAI 的 agent-first greenfield 项目

- 说明“不逐行写 / 读所有代码”只有在环境、可执行规格、边界、反馈回路和架构约束非常强时才可能成立。
- 同一案例也提供反向限制：团队明确说多年后的 coherence 仍是开放问题。

### 案例 C：Aaron 的 one-person project

- 既有公开记录已经支持：agent 能同时产出实现、测试和文档，人类理解速度却没有同比提高。
- Aaron 没有提供一个戏剧化的单次事故，也不应为叙事效果虚构。
- 他确认了一条更稳定、也更有工程价值的 operating rule：任何触及 critical system 或 system of record 的修改都会引发顾虑，并要求更深审查。
- 这条规则的机制是：system of record 不只是“重要代码”，而是组织认定事实的权威来源。错误写入可能沿报表、权限、决策和下游流程传播；代码回滚也未必自动恢复已经被改变的数据、审计轨迹与信任。

### 案例 D：Godot 的 human-boundary policy

- 生成者几乎可以零成本制造更多 PR，但每个 PR 都进入有限的志愿 reviewer 队列。
- 这是 Mitchell “human boundary” 的组织级版本：只要工作进入别人必须维护的共同系统，提交者就不能用“AI 写的”免除理解与修复义务。
- 文章可用它说明成本外部化，不必展开成开源治理专题。

### 案例 E：review 的四种产品

结合 c-CRAB、Human-AI Synergy、Armin Ronacher 与 Aaron 的实践，可以把 code review 拆成四个结果：

1. 找到缺陷；
2. 建立 reviewer 自己的系统心智模型；
3. 同步团队的语言、边界与架构理解；
4. 明确谁愿意为变更负责。

测试和 AI reviewer 可以显著帮助第一项，却只能部分覆盖后三项。这是文章可在视频之外新增的第二层机制，但为了控制篇幅，应服务于“理解深度阶梯”，不要再发展成独立大框架。

## 主要反方观点

1. **规格错误**：测试只能证明实现符合测试，不能证明测试表达了真实需求。
2. **同源盲点**：同一个模型依据同一上下文写实现、测试和检查器，可能在不同层复制同一个误解；证据数量不是证据独立性。
3. **人工阅读也不是证明**：专家会漏 bug；扫完 diff 只能证明看过，不代表形成了正确心智模型。
4. **理解债会在未来到期**：系统在正常路径上全绿，不代表团队能处理非典型故障、维护、交接或事故调查。
5. **风险分类本身会错**：今天的一次性脚本可能明天进入关键流程；边缘代码也可能因权限、数据或依赖获得巨大 blast radius。
6. **生成成本并未归零**：验证计算、环境、误报、测试维护、依赖供应链、观测与事故成本仍存在。
7. **阅读也是培养机制**：对 junior 工程师，源码阅读的价值不只是当前变更验收，还包括学习系统设计与形成品味。
8. **测试关卡不是正式证明**：覆盖率、变异测试和确定性 checker 都可能稳定地验证错误问题。

## 关键事实与引用

完成后把准备进入正文的事实、推断、判断和个人观察写入 `claim-ledger.md`。

- Mitchell 的 “I read the code” 是对质量指标追问的极简回答，不能扩写成普遍教条。
- Uncle Bob 的核心不是“相信 AI”，而是相信实现必须穿过的 gauntlet；他保留规格、验收条件、QA 与最终行为的人类判断。
- Uncle Bob 在线程中用 accountability 定义自己为何仍是工程师；这可短引为：“I am the engineer because I am accountable.”
- OpenAI 的内部案例显示一种极端方向：人不写实现代码，但大量设计环境、约束和反馈回路；该公司也承认长期 coherence 尚未被证明。
- Sonar 的调查显示，声明不信任与实际持续验证之间存在落差；只作为厂商调查使用。
- Godot 的政策把 review bottleneck 写成了明确治理问题：生成变便宜并未让合格 reviewer 变多。
- c-CRAB 只能说明该 benchmark 下现有 reviewer 的覆盖结构，不能写成“AI 只能发现 41.5% 的 bug”。
- 可以安全写出的综合判断：代码生成变便宜了，证明、理解与责任没有同比变便宜。

## 开放问题

1. 对 critical system / system of record，最低审查层应固定为 L3，还是根据写入能力、可逆性与下游传播进入 L4？文章建议写成“最低 L3，关键路径通常 L4”。
2. 如何防止同一模型生成实现与验证时共享盲点？正文应提出独立上下文、不同验证机制和人工 acceptance criteria，但不声称 Aaron 已全面部署这些做法。
3. “理解债”与传统 technical debt 的区别要不要单独命名？建议只作为一段机制解释，避免引入第二套主框架。
4. 四级阶梯应使用一个明确标注为 illustrative 的 system-of-record 修改贯穿，而不是暗示 Aaron 发生过具体事故。
5. “review 的四种产品”是否值得进入正文？若篇幅紧，应只用一段说明测试无法替代知识同步与 ownership。

## 文章应保留的判断

- 真问题不是“要不要读代码”，而是“谁会承担你不理解它的后果”。
- 人类注意力不应平均分配给所有代码；但省下的注意力必须被有意识地投到高风险边界。
- 测试能降低风险，不能自动产生系统理解；逐行阅读能增加理解机会，也不是正确性的充分证明。
- 低风险、短寿命、可逆的 private work 可以停留在行为 / 证据层；跨人、跨团队、跨数据或生产边界时，最低理解门槛必须上升。
- 代码可以廉价，证据不能全部同源，责任不能外包。
- 代码审查的单位正在从 diff 移到整条责任链：意图 → spec → 接口 / 不变量 → 实现 → 独立证据 → 生产行为 → 回滚能力。
- 对 system of record 而言，这条责任链尤其重要：真正需要审查的不只是 diff，而是一项修改如何被写成组织事实、如何向下游传播，以及出错后如何恢复可信状态。
- 最终中心句：未来优秀工程师的能力，不是读完 AI 写出的每一行，而是确保每一个重要变化，都被某个人在正确的抽象层上真正理解。
