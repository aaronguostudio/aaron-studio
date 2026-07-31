# 受监管金融 AI 职业升级战略（2026–2029）

**Status:** 🟢 Active strategy  
**Owner:** Aaron  
**Last updated:** 2026-07-29  
**Review cadence:** 每季度复盘；每年重做一次外部市场校准  
**Decision horizon:** 先执行 24 个月，第三年按证据分支

## 一句话战略

> 金融提供真实场景、稳定收入、复杂业务和组织信用；AI 与产品工程提供杠杆。Aaron 要成为能够把金融中的高后果流程，变成安全、可评估、可审计、可规模化 AI 系统的人。

这不是“金融主业 + 内容/接活副业”两套互相竞争的身份，而是一条复利曲线：

```text
金融业务与组织经验
        +
产品、全栈和 AI 工程
        +
治理、评估、审计与落地能力
        ↓
受监管金融工作流的生产级 AI 负责人
        ↓
Internal Accelerator
        ↓
Productized Service（有重复证据才做）
        ↓
Vertical Product / Platform（有付费证据才做）
```

## 核心判断

### 1. 不需要离开金融，应该重新选择自己在金融里的位置

Aaron 不必把自己训练成基金经理、选股研究员或理财顾问，才能在金融行业创造高附加值。金融价值链里至少有三种不同价值：

1. **资本判断**：研究、选股、资产配置和风险承担；
2. **客户判断**：理解客户、目标、约束、适当性与信任；
3. **决策基础设施**：让数据、证据、流程、权限、审批和行动可靠运行。

Aaron 当前最强、也最有复利潜力的位置是第三种，并逐渐补足第二种。它不是“给金融人员做普通系统”，而是负责金融判断如何被生产、验证、交付和治理。

### 2. “投资像讲故事”这个怀疑有一部分是正确的

短期市场预测和许多主动投资叙事确实很难验证，普通投资者也未必需要复杂产品。但这不等于金融没有真实问题。资产、账户、税务、约束、适当性、风险、合规、交易、数据质量和受托责任都不会因为 ETF 或大模型而消失。

更准确的结论是：

> 不要把职业护城河押在“比市场更会讲故事”；把它押在“让重要金融决定有证据、有约束、有责任人、能回溯”。

### 3. 40 岁不是从零转行，而是重新组合已有资本

Veeva 的 Peter Gassner 在约 41 岁创立公司，带入的是多年企业软件平台经验，并与拥有生命科学行业经验的合伙人合作；ServiceNow 的 Fred Luddy 在约 49 岁创业，带入的是近三十年的企业软件与 IT 工作流经验。它们都不是中年随机跳进陌生行业，而是把既有能力重新组合到一个窄而重要的问题上。  
参考：[Veeva 早期访谈](https://www.veeva.com/wp-content/uploads/2013/10/Veeva-CEO-Customer-Dissatisfaction-Is-My-Opportunity-Forbes.pdf)、[Veeva 联合创始人访谈](https://www.veeva.com/wp-content/uploads/2016/03/A-Conversation-with-Matt-Wallach-Veeva-Systems.pdf)、[ServiceNow 创业历史](https://www.servicenow.com/uk/workflow/platform-foundations/how-servicenow-was-born.html)。

Aaron 的重组材料已经存在：

- 约五年的金融组织和业务环境经验；
- 客户端、业务端、产品和系统视角；
- 全栈开发与 AI-native 构建能力；
- 把模糊问题转成产品和流程的能力；
- 对长期系统、复利和平台的天然兴趣。

缺口不是“没有任何金融背景”，而是领域知识还没有被系统化、案例化和验证。

## 为什么这个方向有真实市场

### 加拿大金融行业已经进入“从试验走向治理和生产”的阶段

加拿大统计局 2026 年第二季度调查显示，过去一年使用 AI 生产产品或提供服务的企业占比从 2024 年的 6.1% 上升到 19.2%；金融与保险业达到 40.4%，其中最常见的应用是文本分析和大语言模型。  
来源：[Statistics Canada, Q2 2026](https://www150.statcan.gc.ca/n1/pub/11-621-m/11-621-m2026010-eng.htm)。

加拿大央行 2026 年金融系统调查更接近 Aaron 的职业机会：

- 几乎所有受访金融机构都已使用 AI，但多数仍是有限或中等程度；
- 当前主要用途是信息收集、分析、文档和内部运营；
- 机构通常不让 AI 取代关键决策中的人类判断；
- 未来两年计划扩展到投资研究、运营后台、金融犯罪防范和客户服务；
- 最大阻力不是模型本身，而是现有系统和流程集成（58%）、人才与 AI 素养（56%）、安全隐私（33%）和成本（31%）。

来源：[Bank of Canada, Financial System Survey 2026](https://www.bankofcanada.ca/2026/05/financial-system-survey-highlights-2026/)。

这意味着最稀缺的角色不是“会调用模型的人”，而是能把模型接入真实流程，同时处理数据、权限、评估、人工审批、解释、故障和组织采用的人。

### 监管会增加这类能力的价值，而不只是增加负担

OSFI 的 E-23 模型风险管理指南将于 2027 年生效，要求机构对模型建立清单、风险评级、责任人、数据与依赖关系、独立审查、生产审批、变更控制、持续监测、异常处理和停用计划。  
来源：[OSFI Guideline E-23](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/guideline-e-23-model-risk-management-2027)。

这会让以下能力越来越值钱：

- model / agent inventory；
- golden dataset、rubric 和 regression eval；
- 权限、数据血缘和使用边界；
- human-in-the-loop 与责任分配；
- tracing、monitoring、fallback 和 incident management；
- 可解释、可复核、可审计的输出与行动。

### 当前岗位正在购买这组能力

2026 年的岗位样本不是用来追逐某个职位名称，而是验证市场正在购买什么：

- Paytm Toronto 的 Senior AI Engineer 要进入风险、欺诈、催收、支付和支持团队，端到端部署 agent workflow，同时建设权限、sandbox、人工审批、评估、追踪和复用蓝图。[岗位](https://jobs.lever.co/paytm/3e497903-1076-45f2-87f6-bf451644327a)
- Caseware Toronto 的 AI Product Manager 要与会计审计专家共建 golden dataset、任务 taxonomy、rubric、override/correction 指标，并以“专业人士愿意签字”为质量标准。[岗位](https://jobs.lever.co/caseware/3ad677ad-8245-4c54-ab08-1aa86c3107be)
- Addepar 的 Forward Deployed Engineer 明确要求把现场经验转化为可扩展、可重复、进入核心产品的能力，而不是按工时出售的服务。[岗位](https://job-boards.greenhouse.io/addepar1/jobs/7760220002?gh_src=31a4a9852)
- OpenAI 与 Palantir 的相关岗位也同时要求客户/业务发现、生产部署和将交付经验抽象回平台。[OpenAI](https://openai.com/careers/forward-deployed-software-engineer-sf-san-francisco/)、[Palantir](https://jobs.lever.co/palantir/636fc05c-d348-4a06-be51-597cb9e07488/)

岗位名称可能是 Applied AI、AI Product、Platform、Principal Architect 或 FDE；真正稳定的职业身份应是：

> **Owner of production, evaluable and auditable AI workflows in regulated domains.**

## 成功榜样：应该复制什么

### Clearwater Analytics：最接近的金融平台样本

Clearwater 没有从“打败市场”开始，而是从机构投资运营中每天都发生的数据聚合、标准化、对账、会计、报告、绩效、风险和合规问题开始。其 single-instance multi-tenant 架构和共同证券主数据，使新增数据源、证券和控制可以反哺整个平台。  
来源：[Clearwater S-1](https://www.sec.gov/Archives/edgar/data/1866368/000119312521272296/d179113ds1a.htm)。

**可复制：**

- 选择必须每天正确运行的事实和运营层；
- 建立 canonical data / semantic model；
- 把异常、修复和控制变成平台资产；
- 用准确性、时效、自动化和审计价值定价。

**不可直接复制：**

- 一开始就覆盖整个投资生命周期；
- 在没有客户和数据规模前建设庞大统一平台。

### Aladdin：先做内部关键系统，再外部化

BlackRock 的风险和投资系统最初服务自身业务，在真实资金和高后果环境中长期验证，之后才扩展为外部解决方案。  
来源：[BlackRock History](https://www.blackrock.com/corporate/about-us/blackrock-history)。

**可复制：** 把当前雇主当作 customer zero；先证明系统能处理真实例外、责任和控制。  
**不可复制：** 把公司内部代码、数据或流程资产带到外部。可以迁移方法、公开知识和独立重写的通用能力，但必须尊重雇佣合同、知识产权和利益冲突边界。

### ServiceNow：技术上平台优先，商业上应用优先

ServiceNow 早期拥有平台愿景，但客户首先需要回答“它具体解决什么”。公司先以 IT service management 这一清晰应用建立入口，再让平台逐渐显现。  
来源：[ServiceNow Platform-first history](https://www.servicenow.com/workflow/platform-foundations/servicenow-platform-first-forever.html)。

**关键原则：**

> 内部架构可以 platform-first；对用户的承诺必须 workflow-first、outcome-first。

不要向组织推销“金融 AI 平台”。推销“把 advisor meeting preparation 从 90 分钟降到 25 分钟，同时让每条关键事实有来源、审批和审计记录”。

### Veeva：技术创始人不必独自拥有全部领域知识

Veeva 的技术平台能力与生命科学业务经验来自互补团队。它先从受监管行业中一个明确的 CRM 入口开始，再扩展到内容与质量工作流。

**对 Aaron 的意义：**

- 不必等到“金融全部学完”才行动；
- 必须建立由 research、advisor、operations、compliance 和 risk 组成的 domain council；
- 领域知识可以是团队资产，但产品判断不能脱离从业者。

### Palantir：复制反馈循环，不复制高成本模式

Palantir 值得借鉴的是 Forward Deployed 团队把现场问题、数据语义和失败模式反馈到产品的循环。  
来源：[Palantir Foundry Architecture](https://www.palantir.com/docs/foundry/architecture-center/overview)。

不要复制的是每个客户长期驻场、大量定制、靠少数大型合同维持的经济模型。

## 失败榜样：必须避免什么

### GE Predix：过早成为“一切的平台”

Predix 的宏大定位跨越过多工业垂直，生态和平台叙事走在清晰 killer workflow 与采用证据之前。教训不是“平台没有价值”，而是：

- 行业太宽会让 ontology、buyer、workflow 和价值指标失去一致性；
- integration work 很容易被误认为 platform traction；
- 大量能力不等于用户愿意采用。

参考：[GE 的 Predix 发布](https://www.ge.com/news/press-releases/ge-expands-predix-platform-advance-industrial-internet-opportunities-customers)、[HBS Digital Initiative 复盘](https://aiinstitute.hbs.edu/platform-rctom/submission/ge-digital-one-size-fits-none/)。

### IBM Watson Health：高后果场景不能用演示代替验证

Watson Health 在高风险医疗决策上承诺过快，而真实数据、临床工作流、验证和从业者接受度没有同步成熟；IBM 后来出售相关数据与分析资产。  
参考：[IEEE Spectrum 复盘](https://spectrum.ieee.org/how-ibm-watson-overpromised-and-underdelivered-on-ai-health-care)、[IBM 资产出售公告](https://newsroom.ibm.com/2022-01-21-Francisco-Partners-to-Acquire-IBMs-Healthcare-Data-and-Analytics-Assets)。

对金融 AI 的直接教训：

- 先辅助证据整理、异常发现和建议草拟；
- 重要行动默认需要人工审批；
- 先测量 correction、override、failure 和 fallback；
- 不用“autonomous agent”作为价值主张。

## 社区信号与反方意见

近期工程社区对 Forward Deployed Engineering 的看法明显分裂：

- 正面：它让工程师接触完整业务结果、真实用户和生产约束；
- 负面：一些公司只是把售前、客户成功、咨询或救火工作重新命名为 FDE，容易产生旅行、碎片化和 burnout。

参考：[ExperiencedDevs：FDE 背景讨论](https://www.reddit.com/r/ExperiencedDevs/comments/1u1ytv7/i_keep_seeing_forward_deployed_engineer_openings/)、[ExperiencedDevs：FDE 工作体验](https://www.reddit.com/r/ExperiencedDevs/comments/1qxtynq/forward_deployed_engineer_role/)。

这些是从业者轶事，不是统计样本，但给出一个重要筛选标准：**不要为 title 买单，要看组织机制。**

一个好的 FDE / Applied AI Platform 岗位应满足多数条件：

1. 对生产部署和业务结果负责；
2. 能向核心产品提交并拥有代码或产品能力；
3. 与 PM / EM 有正式反馈循环；
4. 指标不以 billable hours 或 demo 数量为主；
5. 每个客户的定制比例应逐步下降；
6. 有 monitoring、on-call、rollback 和 incident 责任；
7. 有机会转入平台、产品或团队领导职位。

PagerDuty 的公开复盘很有代表性：其服务团队曾反复建设相似但孤立的集成；只有并入产品开发、建立代码标准、贡献边界和从现场信号到产品能力的循环后，现场工作才真正开始复利。  
来源：[PagerDuty FDE retrospective](https://www.pagerduty.com/eng/from-embedded-to-everywhere-how-forward-deployed-engineering-was-born-at-pagerduty/)。

Nango 对“咨询到产品”的复盘也说明：咨询能换来场景、案例和伤疤，但长期会受到低杠杆、打断、支持成本和责任错配的限制；服务必须被有意识地收敛为客户可以自行使用的基础设施。  
来源：[Nango: Using consulting to build a successful product](https://nango.dev/blog/using-consulting-to-build-a-successful-product)。

## 目标职业画像

### 推荐的对外定位

中文：

> 我专注于把财富管理和金融运营中的高后果流程，转化为安全、可评估、可审计的 AI 工作流和平台能力。

英文：

> I build production-grade, governed AI workflows for high-consequence financial operations—combining domain semantics, human judgment, evaluation, permissions and auditability.

### 未来可能的职位

- Head / Director of Applied AI
- AI Product & Platform Lead
- Principal AI Workflow Architect
- Private Wealth AI Platform Lead
- AI Deployment Lead
- Financial Services FDE Lead / Manager

### 明确不追逐的身份

- 初级 ML researcher；
- 只拼模型和论文的算法工程师；
- 纯前端或通用全栈外包者；
- 只做售前 demo、没有生产 ownership 的 FDE；
- 以 billable hours 为核心、项目结束即归零的普通咨询；
- 在没有真实 workflow 前建设的“万能 agent 平台”。

## 第一个垂直入口

### 推荐范围：Wealth / Financial Operations

不要从选股开始。第一阶段优先考虑：

- KYC / onboarding / document intake；
- advisor meeting preparation 与 evidence-backed follow-up；
- suitability / compliance review；
- client request triage 与服务运营；
- proposal / report 中的事实核验、风险解释和审批；
- data quality、permission、audit 与 exception management。

### 工作流选择评分

每个候选 workflow 按 0–2 分评分，低于 12/16 不做：

| 维度 | 0 分 | 1 分 | 2 分 |
|---|---|---|---|
| 痛点频率 | 偶发 | 每月 | 每周/每天 |
| 高后果性 | 错了影响小 | 有返工 | 有客户/合规/资金风险 |
| 可测量性 | 无 baseline | 可粗测 | 时间、错误、采用、风险均可测 |
| 真实 sponsor | 无 | 支持但不负责 | 有 owner、预算或 KPI |
| 数据可得性 | 无法获得 | 部分可得 | 合法、可控、可持续 |
| 生产路径 | demo | pilot 不明 | 有安全上线和运营路径 |
| 复用潜力 | 单一例外 | 同团队重复 | 跨团队/组织有相同语义 |
| 学习价值 | 只学工具 | 学业务或治理 | 同时积累领域、治理和平台 |

硬门槛：必须有真实 owner、合法数据、baseline KPI 和生产路径。缺一项就不是主项目。

## 应该积累的平台，而不是代码库

AI 会继续降低普通 UI、CRUD 和胶水代码的价值。长期资产不是某个框架，而是下面这些可迁移的结构：

### 领域语义层

候选核心对象：

`Client / Household / Entity / Account / Portfolio / Security / Goal / Constraint / Recommendation / Order / Policy / Evidence / Control / Exception / Approval`

### 工作流与决策契约

每个 workflow 明确：

- 输入和权威来源；
- 允许生成什么，不允许生成什么；
- 决策由谁负责；
- 哪些条件必须人工审批；
- 输出如何写回业务系统；
- 如何记录证据、版本和行动；
- 失败、超时、冲突和模型不可用时怎么办。

### 治理与运行层

- identity、tenant、permission、entitlement；
- data contracts、lineage、retention；
- retrieval、tool use、workflow orchestration；
- eval、trace、observability、cost / latency；
- human approval、rollback、audit；
- prompt injection、data leakage、third-party model risk；
- connector / adapter contract 与 failure isolation。

### 复用晋升规则：Rule of 3

1. 第一次出现：只为真实 workflow 做最小实现；
2. 第二次出现：定义 candidate contract，记录相同与不同；
3. 第三次出现：才晋升为 canonical platform capability。

代码相似不等于产品相同。只有 buyer、task、input/output、risk、acceptance 和 value metric 也相似，才算同一产品能力。

## 金融学习系统

目标不是“补完整个金融专业”，而是获得足以定义、验证和领导工作流的深度。

### T 型知识结构

**横向：金融机构如何运行**

- 财富管理的商业模式：AUM、fee、advisor capacity、retention；
- 客户、household、account、entity、advisor 的关系；
- 产品、账户、交易、报告与服务生命周期；
- KYC、suitability、privacy、记录保存和审批责任；
- research、advisor、operations、compliance、risk 各自的目标与冲突。

**纵向：围绕当前 workflow 深挖**

例如本季度做 suitability，就深入学习：

- 业务目标与责任；
- 监管和公司政策；
- 数据来源与语义；
- 正常流程、例外和失败模式；
- 专家如何判断质量；
- 错误的真实后果；
- 可接受的自动化边界。

### 每个季度的学习闭环

1. **Map**：画出真实流程、角色、数据和决策；
2. **Shadow**：观察 3–5 名从业者处理真实案例；
3. **Study**：只读与当前流程直接相关的监管、教材和公司资料；
4. **Case**：整理 10–20 个典型案例和 edge cases；
5. **Teach back**：向从业者复述理解，请其纠错；
6. **Encode**：把知识写成 ontology、rubric、policy、eval case 和 workflow contract；
7. **Operate**：上线后追踪 correction、override、incident 和新例外。

### Domain Council

至少建立以下 4–6 人的轻量顾问圈：

- research / portfolio professional；
- advisor / client-facing professional；
- operations；
- compliance / legal；
- risk / model governance；
- data / architecture。

每月一次 45 分钟 review；不是泛泛交流，而是审查具体 workflow、案例、rubric 和失败。

### 课程与证书原则

- 可先用 CFA Investment Foundations 或针对性的 CFA / FP 模块建立共同语言；
- 不因为“不安全感”立刻承诺完整 CFA 或 MBA；
- 每一段学习必须在 30 天内进入一份可复核产物；
- 证书只有在岗位门槛、组织信用或系统学习收益明确时才继续。

## 24 个月执行路线

| 阶段 | 时间 | 主目标 | 核心交付物 | Go / No-Go |
|---|---|---|---|---|
| Q1 | 2026.08–10 | 选定一个真正能进生产的金融 AI workflow | workflow map、baseline、risk/control matrix、sponsor、career thesis | 必须有 owner、数据权限、KPI、生产路径；只有 demo 就换题 |
| Q2 | 2026.11–2027.01 | Internal Accelerator v0 | 50–100 个 golden cases、权限/审计/人工审批、5–10 人受控 pilot | 周期时间改善 ≥25%，无关键质量倒退，高风险动作全可追溯 |
| Q3 | 2027.02–04 | 第一个有限生产部署 | monitoring、SLO、failure escalation、eval gate、8 周数据、sanitized case | ≥50% 合资格案例实际使用；连续 8 周稳定；无未审计高风险动作 |
| Q4 | 2027.05–07 | 第二个 workflow 证明复用 | capability registry、第二个 workflow、内部路线图、岗位 proposal | 复用 ≥3 个能力；投入 ≤第一个的 60%；否则仍是项目 |
| Q5 | 2027.08–10 | 将事实职责变成正式职位 | title、预算、2–4 人 squad 或正式 mandate、semantic model | 生产 KPI、团队/预算、架构决策权至少获得两项；否则启动外部求职 |
| Q6 | 2027.11–2028.01 | 只验证 productized service | 固定范围 assessment/deployment sprint、两家独立访谈、一次合规试点 | 两家确认同一痛点；一家愿意为固定结果付费或正式投入 |
| Q7 | 2028.02–04 | 重复第二、第三次 | 三次相似部署、标准 delivery kit、vertical pack v1 | 标准交付物 ≥70%；能力复用 ≥50%；每次有业务结果 |
| Q8 | 2028.05–07 | 24 个月职业决策 | casebook、外部反馈、内部/跳槽/继续验证三选一 | 只能选择一个主航道，不能同时经营三套业务 |

### 前 90 天的具体动作

**第 1–2 周**

- 写出 3 个候选 workflow；
- 分别找业务 owner、用户、compliance/risk 访谈；
- 取得 baseline：时间、错误、返工、等待、采用或风险事件；
- 完成 IP、数据、模型供应商和雇主政策边界检查。

**第 3–4 周**

- 用评分表选出一个；
- 定义 input/output、责任人、审批点和 fail-closed 条件；
- 建立首批 20–30 个 golden cases；
- 写一页 executive brief，争取正式 sponsor。

**第 2 个月**

- 建最小闭环：evidence input → structured output → human approval → action/writeback → audit；
- 每周让 2–3 名真实用户试用；
- 记录所有 correction、override 和不信任原因；
- 不扩展第二个 workflow。

**第 3 个月**

- 扩展到 50–100 个 eval cases；
- 加入权限、追踪、rollback、fallback；
- 做第一版 before/after 业务复盘；
- 决定进入受控 pilot，或明确停止。

## 第三年：只在证据允许时产品化

产品化不是默认目的地。只有 Q7 通过，才进入：

| 阶段 | 条件 |
|---|---|
| Product wedge | 5 个 design partners 中至少 3 个要求基本相同的能力，并愿意签 pilot / LOI |
| Paid beta | 2–3 个付费 design partners；部署 ≤2 周；有持续真实使用；不要求独立 fork |
| Repeatability | 3–5 个客户；客户专属代码 <20%；支持 <4 小时/客户/月 |
| 是否独立经营 | IP 清晰；家庭有 12–18 个月 runway；客户不过度集中；收入与 pipeline 已连续验证 |

任何 gate 不通过，就把成果保留为职业资产或 productized service。停止造产品不是失败，而是在避免为不存在的市场工作三年。

## 衡量复利，而不只衡量交付

### 每个 workflow 的业务指标

- cycle time；
- error / correction / override rate；
- 合资格案例采用率；
- 用户和业务 owner 的持续使用；
- 风险事件、漏报和审计完整性；
- 每个 validated outcome 的成本。

### 平台复利指标

- 第二个 workflow 复用了多少已验证能力；
- 新 workflow 达到生产所需时间是否下降；
- customer-specific / workflow-specific code 占比；
- 新失败转成 regression eval 的时间；
- golden cases 覆盖率；
- 每月维护与 support 时间；
- 同一能力是否被独立团队主动采用。

### 职业升级指标

- 是否对生产 KPI 负责；
- 是否拥有真实最终用户接触；
- 是否参与业务、risk、legal 和 technology 的共同决策；
- 是否获得预算、团队或架构决策权；
- 外部面试能否用 2–3 个 production case 证明能力；
- 市场是否开始以目标身份识别 Aaron。

## Portfolio：积累证据，不是 Demo Gallery

每个 workflow 留下以下脱敏产物：

- before / after 流程与 KPI；
- domain model / ontology；
- workflow and decision contract；
- risk and control matrix；
- evaluation card 与 golden dataset 方法；
- reference architecture；
- adoption、failure 和 incident 记录；
- capability reuse report；
- sanitized business case；
- 如何推动业务、risk、legal 和 engineering 达成一致。

公开内容控制在每季度一篇深度文章即可，例如：

- Regulated AI Workflow Reference Architecture；
- Human Approval 与 Action Governance；
- 如何建立 enterprise agent eval；
- 从一次部署提取 vertical capability；
- 金融 AI 中哪些操作必须 fail closed。

内容的作用是固化理解、建立可信度和吸引同行，不是建立另一个需要日更的主业。

## 项目与副业筛选

每个新项目必须回答：

1. 是否服务同一个职业 thesis？
2. 是否属于高后果、需要权限/审批/审计的 workflow？
3. 是否有真实 owner、用户和数据？
4. 是否能在 8–12 周测量结果？
5. 是否至少沉淀一个 ontology、connector、action、eval 或 control？
6. 是否可能在第二个组织重复？
7. IP、利益冲突与雇主政策是否书面清晰？

七项至少满足六项；第 3、4、7 项是硬门槛。

执行纪律：

- 同时只有一个内部核心 workflow；
- 同时最多一个外部相邻项目；
- 无关但高价的现金项目最多占副业时间 10%，并预设结束日期；
- 新项目进入前，旧项目必须完成或明确终止；
- 外部项目不能复用雇主代码、数据、客户信息或非公开流程。

## 每周节奏

### 主业内的可支配精力

- 65%：唯一的生产 workflow 与业务结果；
- 15%：用户、金融流程和监管理解；
- 15%：把已验证部分沉淀进 internal accelerator；
- 5%：指标、内部沟通与岗位建设。

### 工作外：长期 6 小时，上限 8 小时

- 2 小时：与当前 workflow 直接相关的金融学习；
- 2 小时：独立平台方法、eval 或相邻 side project；
- 1 小时：case study / 写作；
- 1 小时：行业关系与外部岗位校准。

有付费 side project 的季度，只能替换“平台与写作”时间，不能额外叠加。至少保留一个完整周末日和两个晚上不工作。

## 转岗与求职判断

未来 6–12 个月首先争取内部正式 mandate，因为现雇主最可能提供真实金融流程、可信关系和低转换风险。

内部升级需要的不是漂亮 title，而是以下五项中的至少三项：

- 对生产 KPI 负责；
- 有预算或团队；
- 能接触最终用户和业务流程；
- 对 architecture、evaluation 和 governance 有决策权；
- 工作不只是兼职 demo。

如果到 Q5 仍无正式 mandate，外部优先顺序：

1. 成熟金融机构或 fintech / RegTech 的 Applied AI Platform Lead；
2. 财富、风险、支付、身份或合规平台的 Principal AI Architect；
3. AI 平台公司的 Financial Services FDE Lead / Manager；
4. 其他受监管行业的 AI Workflow / Decision Systems Lead。

地理上要保持现实：当前高密度岗位更多集中在 Toronto、New York、San Francisco；许多“remote”岗位仍限定美国。Calgary 的最佳路线可能先是内部升级、加拿大远程/混合岗位，或明确评估迁居，而不是假设全球岗位都可远程获得。

## 停止规则

出现任一情况，应暂停“平台”叙事并重新选择 workflow：

- 连续三个项目没有重复的付费问题；
- 第二、第三次交付的定制比例没有下降；
- 维护消耗长期超过可用时间约 15%；
- 平台建设持续延迟用户价值；
- 每个客户都要求独立 fork；
- 没有独立团队主动采用；
- 没有真实 sponsor 或 production path；
- IP 或利益冲突边界无法书面确认。

## 每季度复盘问题

1. 本季度我对哪个金融判断或流程真正理解得更深？
2. 哪个 production outcome 可以用数字证明？
3. 哪个失败被转成了永久 eval、control 或 contract？
4. 第二个场景复用了什么，而不是只复用了代码？
5. 我的职责是否更接近目标身份？
6. 哪项活动虽然赚钱或有趣，却没有服务职业 thesis？
7. 下季度唯一的核心 workflow 是什么？
8. 当前证据支持 internal accelerator、productized service，还是只支持一个好项目？

## 最终判断

这个方向值得作为未来十年的主航道，但必须保持三个约束：

1. **Finance-first, not finance-forever**：先借金融建立难以复制的深度，未来能力可迁移到其他受监管、高后果行业；
2. **Workflow-first, platform-later**：先赢得一个真实结果，再抽象平台；
3. **Evidence before identity**：不要先自称平台创始人或金融专家，用生产案例让市场逐渐这样识别你。

前 12 个月最重要的成功标准不是副业收入、粉丝数或 SaaS 用户，而是：

> Aaron 已经能用一个真实、稳定、可审计的金融 AI 工作流证明：他不只是会做软件，而是能理解业务判断、组织约束和生产责任，并把它们变成可复利的系统。

## Related

- [[themes/career-trajectory]]
- [[themes/financial-freedom]]
- [[orgs/mawer]]
- [[orgs/orgnext]]

