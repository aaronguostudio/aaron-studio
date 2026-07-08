# 研究档案：企业 AI 的部署层

## 这份材料要回答的问题

这篇文章不是简单复述几家公司发布了什么新闻，而是要证明一个更大的判断：

企业 AI 的瓶颈正在从“有没有模型能力”转向“有没有部署能力”。Anthropic、OpenAI、AWS、Microsoft 在短时间内都把资源投向 FDE、embedded engineering、enterprise AI services，不是巧合，而是同一个市场压力的不同表达。

## 核心一手资料

### Anthropic：企业 AI 服务公司

- 来源：[Building a new enterprise AI services company with Blackstone, Hellman & Friedman, and Goldman Sachs](https://www.anthropic.com/news/enterprise-ai-services-company)
- 时间：2026-05-04
- 关键信息：
  - Anthropic 与 Blackstone、Hellman & Friedman、Goldman Sachs 等成立企业 AI 服务公司。
  - 目标客户不是只盯最大型企业，而是包括 community banks、mid-sized manufacturers、regional health systems 这类中型机构。
  - Anthropic Applied AI engineers 会与新公司工程团队一起，帮助客户识别高价值场景、开发 Claude 系统，并提供长期支持。
- 对文章的作用：
  - 支持“中型企业有 AI opportunity，但缺少 implementation muscle”的判断。
  - 说明模型公司不再满足于卖 API，而是在进入客户 workflow 的改造层。

### OpenAI：OpenAI Deployment Company

- 来源：[OpenAI launches the OpenAI Deployment Company](https://openai.com/index/openai-launches-the-deployment-company/)
- 时间：2026-05-11
- 关键信息：
  - OpenAI 明确使用 forward deployed engineers，强调进入客户组织内部，与 business leaders、operators、frontline teams 一起工作。
  - 工作内容包括识别高价值 workflow、围绕 AI 重构基础设施、把模型接入数据、工具、控制机制和业务流程。
  - OpenAI 同意收购 Tomoro，从一开始带入约 150 名 FDE 和 deployment specialists。
  - 公告提到超过 40 亿美元初始投入和多家投资、咨询、系统集成伙伴。
- 对文章的作用：
  - 这是最直接支持“deployment capability 成为新战场”的材料。
  - Tomoro 收购说明 OpenAI 不只是建 partner ecosystem，而是在买真实企业实施能力。

### AWS：10 亿美元 FDE 组织

- 来源：[AWS invests $1 billion to embed AI forward deployed engineers with customers](https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers)
- 时间：2026-06-30
- 关键信息：
  - AWS 投入 10 亿美元，建立 FDE 组织，把 AI experts 嵌入客户的业务、工程和安全团队。
  - AWS 的判断是，客户已经过了“探索 AI 能做什么”的阶段，现在想让 AI 成为运营核心。
  - AWS 特别强调 business outcomes，而不是 billable hours。
  - 它提到 engagement 结束时，客户应该留下 deployed systems、knowledge graphs、runbooks、architecture documentation、trained internal champions。
- 对文章的作用：
  - 这是区分 FDE 和传统 consulting 的关键材料。
  - 也支持 ACTOR 里的 Recursive ownership：上线不是结束，客户内部能力和反馈循环才是重点。

### Microsoft：Frontier Company

- 来源：[Microsoft Frontier Company: AI engineering that amplifies and protects your intelligence](https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/)
- 时间：2026-07-02
- 关键信息：
  - Microsoft 推出 Frontier Company，投入 25 亿美元，配置 6000 名行业和工程专家。
  - 重点是 measurable business outcomes、ROI、continuous improvement、model choice、governance、FinOps、客户 IP 保护。
  - Microsoft 把 customer intelligence 描述成应该在客户内部复利增长的资产，而不是被供应商 commoditize 的东西。
- 对文章的作用：
  - 补上 trust、governance、model choice 和客户 IP 保护这一层。
  - 说明 enterprise AI deployment 不只是工程集成，也涉及长期治理和供应商锁定风险。

### Blackstone / Fractional AI：补实施团队

- 来源：[The AI-Native Enterprise Services Firm ... Announces Acquisition of Fractional AI](https://www.blackstone.com/news/press/the-ai-native-enterprise-services-firm-backed-by-anthropic-blackstone-and-hellman-friedman-announces-acquisition-of-fractional-ai/)
- 时间：2026-05-21
- 关键信息：
  - Anthropic/Blackstone-backed services firm 收购 Fractional AI。
  - Fractional AI 成为新公司的 founding operational centerpiece。
  - 公告强调把 frontier AI 带进企业需要的不只是模型，还需要工程判断和真实系统改造能力。
- 对文章的作用：
  - 证明这个方向不是品牌合作，而是在快速补 applied AI engineering talent。
  - 支持“模型访问是一种资产，但实施人才才是稀缺能力”的判断。

### Palantir：FDE 的历史参照

- 来源：[A Day in the Life of a Palantir Forward Deployed Software Engineer](https://blog.palantir.com/a-day-in-the-life-of-a-palantir-forward-deployed-software-engineer-45ef2de257b1)
- 相关来源：[Dev versus Delta: Demystifying engineering roles at Palantir](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87)
- 关键信息：
  - Palantir 把 FDSE 描述成嵌入客户、用平台解决客户最难问题的软件工程师。
  - 它区分 product engineer 和 FDSE：前者更像是为很多客户建设一个 capability，后者更像是围绕一个客户启用很多 capabilities。
  - Palantir 也强调 end-user collaboration、production system、monitoring，以及 field learning 反馈到产品。
- 对文章的作用：
  - 解释 FDE 不是突然冒出来的新概念。
  - 帮助区分“职位名称”和“deployment-native engineering 这个更深能力”。

## 可以使用但要谨慎的二手材料

Alex Karp 最近对 AI 行业的批评适合作为文章 tension，但不应该当成中立证据。

原因很简单：Palantir 卖的正是 deployment、ontology、enterprise operating layer 这一套能力，所以 Karp 对“只买模型/只烧 token”的批评有商业立场。这个立场不代表他说错了，但文章里最好把他作为冲突来源，而不是事实来源。

更稳妥的写法是：Karp 的不满之所以有力量，是因为很多企业确实有类似体验：token 消耗、模型访问和漂亮 demo，并不会自动变成 operating value。

## 可用案例

- Anthropic 医疗场景：医生和员工的痛点在 documentation、coding、prior authorization、compliance review 等流程里。适合说明 AI deployment 必须进入真实 workflow，而不是停在聊天界面。
- OpenAI / Tomoro：Tesco、Virgin Atlantic、Supercell 等客户环境强调 reliability、integration、governance、measurable impact。
- AWS：NFL Fantasy AI、NFL IQ 等例子说明 FDE 可以参与生产产品，而不是只做咨询建议。AWS 还提到 Allen Institute、Cox Automotive、NBA、Ricoh、Southwest Airlines、NFL 等客户。
- Microsoft：LSEG Workspace 例子说明 AI 可以嵌入金融专业人士 workflow，并通过用户反馈和测试不断改进。

## 主要反方观点

- 这可能只是 AI 平台向下游抢 services revenue。
- Enterprise AI deployment 仍然需要 consultants 和 system integrators；FDE 无法独自完成全球 change management。
- Vendor-led deployment 可能加深 lock-in，尤其是 workflow、connector、eval、prompt 和模型栈深度绑定以后。
- FDE 可能做出昂贵的一次性定制方案，如果没有把 pattern 反馈到产品，就很难规模化。

## 文章应保留的判断

- 不要把 PE 作为主题，只作为 Anthropic 这个案例里的客户入口和投资组合增值背景。
- 标题可以更冲突，但正文不要变成 Karp 文章。Karp 是 tension，不是主角。
- ACTOR 里的 R 建议使用 Recursive ownership，而不是 Responsibility。Responsibility 更清楚，但 Recursive ownership 更能表达 self-enhancement、feedback loop 和下一次 workflow 复用。
- 真正的读者价值不是“这些公司发布了什么”，而是“技术人和企业该如何判断 AI deployment 是否真的创造价值”。
