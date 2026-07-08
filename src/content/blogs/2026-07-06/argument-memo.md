# 论证备忘录：昂贵的 Token 救不了企业 AI

## 核心论点

企业 AI 的主要瓶颈，正在从“能不能接触到足够强的模型”转向“能不能把模型能力部署成可信的业务闭环”。

换句话说，昂贵的 token 本身不会自动变成企业价值。真正的价值发生在 token 周围：workflow、context、权限、trust boundary、eval、fallback、owner、feedback loop，以及上线后能不能持续学习。

## 为什么现在值得写

最近几家大公司的动作非常集中：

- Anthropic 成立 enterprise AI services company。
- OpenAI 推出 OpenAI Deployment Company，并收购 Tomoro。
- AWS 投入 10 亿美元建立 Forward Deployed Engineering 组织。
- Microsoft 推出 Frontier Company，配置 6000 名行业和工程专家。

这些公司生态不同、商业模式不同，但动作高度相似。它们都在把工程能力推向客户现场，因为企业已经不缺 AI 演示，不缺 API access，也不缺“试点项目”。它们更缺的是：AI 能不能改变 cycle time、cost、quality、risk、revenue 或 decision-making，同时不破坏信任和责任边界。

## 文章的机制解释

模型提供潜在 intelligence，deployment 把它变成 operating capacity。

这个转换需要解决五个问题：

1. **Action**：到底哪个业务动作、决策、handoff 或重复任务会改变？
2. **Context**：系统需要知道什么？source of truth 在哪里？数据权限和治理边界是什么？
3. **Trust**：AI 是 drafting、recommending、deciding，还是 acting？不同自主权需要不同控制机制。
4. **Outcome**：什么能证明工作真的变好了？速度、质量、成本、风险、转化率、margin、决策质量，都要落到可观察指标。
5. **Recursive**：上线以后谁拥有 learning loop？系统如何从真实使用中学习？这次 deployment 留下了什么 runbook、champion、eval、failure mode 和可复用 pattern？

FDE 的价值，不在于这个 title 多新，而在于它把工程师放到了这些问题变得可见的位置：靠近真实用户、靠近生产约束、靠近旧系统、靠近安全和合规边界，也靠近产品团队可以学习并抽象 pattern 的地方。

## 证据地图

- **四家公司同时下注**：Anthropic、OpenAI、AWS、Microsoft 都把资源投向 embedded engineering / deployment layer。
- **Palantir 的历史参照**：FDSE 的核心不是“会写代码的顾问”，而是围绕一个客户启用多种能力，并把 field learning 反馈到产品。
- **AWS 的显性对比**：AWS 强调 business outcomes、customer self-sufficiency、runbooks、knowledge graphs、internal champions，而不是 billable hours。
- **Microsoft 的 trust layer**：Frontier Company 强调 customer IQ、IP protection、model choice、governance、FinOps、continuous improvement。
- **Fractional AI 收购**：Anthropic/Blackstone-backed services firm 很快补入 applied AI engineering talent，说明稀缺能力在实施和系统改造层。
- **Aaron 自己的 AI workflow 经验**：AI 只有在 intent、run、review、memory、evidence 连起来时，才像 operating system；否则只是能力很强但工作流很薄的工具。

## 需要承认的反方观点

第一，这可能只是模型公司往下游抢 services revenue。FDE 的话术再漂亮，也可能变成昂贵实施项目。

第二，FDE 不是传统 consulting 的替代品。大型企业仍然需要 program governance、change management、合规规划、培训、全球 rollout、系统集成和组织协调。

第三，vendor-led deployment 有 lock-in 风险。如果关键 workflow 深度绑定某个模型、connector、prompt、eval 和治理假设，未来切换成本会很高。

第四，FDE 可能做出很多一次性定制。如果没有 pattern capture 和 product feedback，deployment 就无法规模化。

## 对反方的回应

这些风险都成立，所以文章不应该把 FDE 写成万能答案。

更准确的判断是：重要的不是 FDE 这个职位名称，而是 deployment-native engineering 这组能力。

好的 FDE / deployment team 必须留下四样东西：

- 可运行的 production system；
- 客户内部可以继承的 operating capability；
- 下一次 workflow 可以复用的 pattern；
- 能持续改进的 feedback loop。

如果 engagement 结束后只留下 demo、deck、prompt 和一堆 token usage report，那它并没有解决企业 AI 的核心问题。

## 可复用框架

ACTOR：

- **Action**：what work changes?
- **Context**：what must the system know, and what are the boundaries?
- **Trust**：what can the system safely do?
- **Outcome**：what proves it improved the work?
- **Recursive**：who owns the learning loop, and how does the system improve?

这个框架的价值是把“AI use case”从一个想法，压成一组部署前必须回答的问题。它也能服务后续文章、视频和咨询式内容，因为读者可以拿它直接审视自己的 AI 项目。

## 对技术人的启发

对技术人来说，长期职业信号不是“学 prompt”。Prompt 是一个 interface，很重要，但不是全部。

更耐用的能力是 deployment-native：

- 能理解真实 workflow，而不是只等 clean ticket；
- 能把模型接入数据、工具、权限和业务流程；
- 能设计 eval、guardrail、monitoring 和 fallback path；
- 能和非技术用户一起工作，同时保留工程严谨性；
- 能用 outcome 判断系统是否真的改变了工作；
- 能让每一次 deployment 改善下一次 deployment。

这就是文章最后要落到的判断：昂贵的 token 救不了企业 AI。能把 intelligence 变成 operating capacity 的组织，才会真正拿到 AI 的价值。
