# 研究档案：FDE 是企业 AI 的 human backpropagation layer

核验日期：2026-07-10

## 这份材料要回答的问题

这篇文章要回答的不是“FDE 是什么职位”，而是三个更重要的问题：

1. 为什么 Anthropic、OpenAI、AWS、Microsoft 在很短时间内都把大量资金和工程人才推向客户现场？
2. FDE 和传统 consulting 真正不同的地方，是交付方式、人才标签，还是 learning loop？
3. 对企业和技术人来说，怎样判断 deployment 是在创造 operating capacity，还是只在消耗更多 token？

## 核心一手资料

### Anthropic：delivery capacity 已经成为瓶颈

- 来源：[Anthropic enterprise AI services company](https://www.anthropic.com/news/enterprise-ai-services-company)
- 发布：2026-05-04
- 能支持：Anthropic 与 Blackstone、H&F、Goldman Sachs 等成立面向中型企业的 AI services company；Applied AI engineers 会与新公司团队共同识别场景、开发系统、长期支持；Anthropic 明确表示 Claude 的企业需求超过任何单一 delivery model 的承载能力。
- 不能支持：不能据此证明所有中型企业都缺 AI 人才，也不能证明该模式已经产生 ROI。
- 文章价值：这是“模型需求强，但 delivery capacity 不足”的直接信号。

### OpenAI：deployment 同时是交付、学习和分发

- 来源：[OpenAI Deployment Company](https://openai.com/index/openai-launches-the-deployment-company/)
- 发布：2026-05-11
- 能支持：新公司由 OpenAI 控制，初始投资超过 40 亿美元；同意收购 Tomoro，带入约 150 名 FDE 和 deployment specialists；典型 engagement 会从少量高价值 workflow 开始，把模型连接到客户数据、工具、control 和业务流程；OpenAI 也强调从不同客户中 generalize repeatable patterns。
- 不能支持：不能把计划中的 operating model 当作已经实现的客户效果；收购在公告时仍需完成交割条件。
- 文章价值：FDE 不只是安装模型，也是在收集产品必须看到的 field feedback。

### AWS：customer self-sufficiency 是检验标准

- 来源：[AWS $1B FDE organization](https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers)
- 发布：2026-06-30
- 能支持：AWS 投入 10 亿美元建立 FDE 组织，计划嵌入数千名专家；强调 business outcome 而非 billable hours；客户应留下 deployed system、knowledge graph、runbook、architecture documentation、internal champion 和可复用 pattern。
- 不能支持：AWS 的客户案例和速度数据属于 vendor-authored marketing evidence，不能当作独立 benchmark。
- 文章价值：给“好的 deployment 最后留下什么”提供了一套可检验标准。

### Microsoft：deployment 也包括 trust、model choice 和 economics

- 来源：[Microsoft Frontier Company](https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/)
- 发布：2026-07-02
- 能支持：Microsoft 投入 25 亿美元，配置 6000 名行业和工程专家；强调 measurable outcomes、continuous improvement、FinOps、customer IP protection 和 model-diverse architecture。
- 不能支持：Microsoft 宣称该组织“beyond FDE”属于定位，不是中立的职位分类。
- 文章价值：把 deployment 从集成问题扩展到 trust boundary、ROI 和 lock-in。

### Palantir：FDE 是 human equivalent of backpropagation

- 来源：[Palantir Architecture Center](https://www.palantir.com/docs/foundry/architecture-center/overview)
- 核验：2026-07-10
- 能支持：Palantir 明确写道，其产品通过 Forward Deployed Engineering 持续发展；FDE 是 human equivalent of backpropagation，工程师进入工厂、运营中心等真实环境，与客户共同建设，再和核心工程团队协作发布产品改进。
- 具体工作语言：在供应链场景中，Palantir 用 ERP、MES、CRM、客户和边缘系统等分散数据源说明现场复杂度；系统需要把工厂、生产线、供应商、订单等业务对象，与更新采购单、调整配送策略、模拟供应中断等实际动作连接起来。
- 治理含义：数据、业务逻辑、动作和安全策略必须同时进入工作流。FDE 的价值不只是接入数据，而是让真实决策可以在权限和运行约束下执行。
- 不能支持：Palantir 描述的是自己的方法论，不能自动外推为所有公司的 FDE 实践。
- 文章价值：用供应中断的例子解释 FDE 每天到底做什么，再把现场异常如何回到产品讲清楚。避免使用抽象的三层 loop 表格。

### Fractional AI：新公司快速补入真实交付能力

- 来源：[Blackstone / Fractional AI acquisition](https://www.blackstone.com/news/press/the-ai-native-enterprise-services-firm-backed-by-anthropic-blackstone-and-hellman-friedman-announces-acquisition-of-fractional-ai/)
- 发布：2026-05-21
- 能支持：Anthropic-backed firm 在最初公告 17 天后收购 Fractional AI，并把它定义为 founding operational centerpiece；工程团队会与 Anthropic Applied AI 合作。
- 不能支持：交易本身不能证明 applied AI engineers 是市场上唯一或最稀缺的资产。
- 文章价值：资本和模型不是充分条件，组织马上购买了 delivery muscle。

## 关键事实与计算

- Anthropic 5 月 4 日到 Microsoft 7 月 2 日，相隔 59 天。
- OpenAI 超过 40 亿美元、AWS 10 亿美元、Microsoft 25 亿美元，披露金额合计至少 75 亿美元。
- 这个 75 亿美元不是统一口径：OpenAI 是新公司的 initial investment，AWS 和 Microsoft 是各自组织投资；正文必须写成“disclosed commitments around these organizations”，不能暗示全部是即时工程 payroll。
- Fractional AI 收购发生在 Anthropic 初始公告 17 天后。

## 从材料里浮现出的机制

### 1. Deployment 是 integration layer

模型必须进入真实的数据权限、工具、审批、fallback、审计和业务流程。API access 只能提供 capability，不能提供 operating reliability。

### 2. Deployment 是 learning system

FDE 把生产失败、用户行为、exception、eval 和 workflow constraint 带回产品团队。这个 loop 越短，平台越快知道模型能力应该如何被包装、治理和复用。

### 3. Deployment 是 distribution channel

嵌入客户核心 workflow 会带来更多 usage、更高 switching cost、更深客户关系，也让 vendor 更靠近 transformation budget。这个商业动机需要明确写成推断，而不是伪装成客户价值。

### 4. Deployment 是 customer capability test

真正好的 engagement 不只是让 vendor 学习，也要让客户获得 ownership、runbook、champion、architecture 和可持续的 improvement loop。否则 FDE 很容易退化成高价定制服务。

## 读者的真实痛点与好奇心

- 为什么 POC 看起来成功，上线以后却没有改变 cycle time、quality 或 margin？
- 为什么模型公司不继续只卖 API，反而开始养庞大的“人力密集型”组织？
- FDE 是不是 consulting 换了新名字？
- 工程师未来应该更深地做基础设施，还是更靠近客户？
- 企业如何避免 vendor-led deployment 变成 lock-in？
- 什么指标能证明 AI 改变了工作，而不只是增加 token consumption？

## 主要反方观点

### FDE 只是 services revenue

成立。模型公司有动力扩大可服务预算并提高 stickiness。文章不应该把 vendor 动机浪漫化。

### FDE 是 consulting with hoodies

有时成立。区别不能建立在“consultant 只写 deck”这种 caricature 上。更可靠的区别是 learning topology：现场经验有没有反馈到产品？客户有没有获得可继承能力？结果有没有由 operating outcome 衡量？

### Custom work 无法 scale

成立。如果每个 engagement 都是一次性代码，FDE 会伤害产品聚焦和 margins。只有 pattern capture、platform feedback 和 customer self-sufficiency 同时存在，模式才可能 compound。

### Vendor lock-in 会变深

成立。数据 contract、connector、eval、prompt、tool permission 和 governance 一旦围绕单一模型构建，切换成本可能被隐藏。ACTOR 的 Context、Trust、Recursive 必须把 portability、ownership 和 feedback ownership 纳入问题。

## Aaron 的个人证据

这次 FDE 内容生产本身就是一个小型案例：AI 能完成 research、draft、translation、images、audio、video，却仍然留下 broken internal link 和视觉/视频 workflow 的质量问题。它不能证明企业市场，但能真实说明一个系统性区别：task completion 不等于 workflow completion。

相关旧文：

- `I Gave Codex a Task From a Moving Tesla`：intent、skill、run、review、memory 连起来以后，AI 才像 operating system。
- `The One-Person Project`：AI 扩大 execution radius，同时放大 owner、boundary、evidence 的重要性。

## 开放问题

- 这些新组织两年后会更像 software company、consultancy，还是一种新的 hybrid？
- 哪些 field learnings 能真正 generalize，哪些永远是行业/客户特定？
- 客户如何在吸收 vendor expertise 的同时保留 model portability？
- FDE 的 economics 是否会迫使平台把更多重复工作产品化？

## 文章应保留的判断

- FDE 的核心不是“离客户近”，而是把客户现场变成双向 learning loop。
- 不要用 Karp 的情绪做主线；Palantir 官方的 backpropagation 方法论更准确、更耐用。
- 不要宣称 consulting 被替代。用“what compounds after the engagement”作为区别。
- ACTOR 保持五个单词：Action、Context、Trust、Outcome、Recursive。
- 结尾必须区分 token consumption 与 enterprise value：token 是 input，changed work 才接近 value。
