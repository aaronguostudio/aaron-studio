# Case Study: Palantir × Cavanagh Construction — TOM (Total Operations Management)

> Source: https://blog.palantir.com/revolutionizing-construction-e37cba735796 (Dec 2025)

## Summary

Thomas Cavanagh Construction（加拿大70年家族建筑公司）与Palantir合作，用Foundry平台从零搭建统一运营系统 **TOM（Total Operations Management）**，替换所有legacy ERP和碎片化工具。Multi-year partnership，2025年1月开建，合约到2030年。

## Company Profile

- **Industry:** Construction（采石→建房全链条）
- **History:** 70年家族企业
- **Pain:** 纸质流程、Excel、孤岛系统、人工协调成本指数级增长
- **Culture:** "All in" — 不做pilot，直接全面上线

## Before: 典型的传统企业病

- 每个系统解决一个问题，但系统之间制造更多摩擦
- 一线工人（foreman）花大量时间做数据录入而非施工
- 部门之间互相blame（field怪office，office怪field）
- 收集了大量数据，但不服务于决策
- 软件在塑造（扭曲）人的行为，而非服务人

## Palantir Approach

### 启动方式
1. **Foundry Bootcamp**（5天）— 聚焦fleet + job costing
2. 发现核心问题：所有workflow依赖高质量源头数据，但数据质量不一致
3. Cavanagh内部deep dive：mapping实际工作流程 vs 文档化流程
4. 签署multi-year deal（到2030）

### 三个驱动问题
1. 调度实际上是怎么做的？crew开工需要什么？
2. 工程成本实际上是怎么算的？盲区在哪？
3. 每台设备在任何时刻的责任人是谁？怎么记录的？

> 答案不来自strategy deck或executive briefing，而来自白板讨论、现场观察、和对每个假设的质疑。

## Five Discoveries（核心设计原则）

### 1. 统一实时数据替代多系统
- 10人 = 45条协调线；100人 = ~5,000条
- Dispatcher花更多时间和同事对齐，而不是和field沟通
- **解法：** 单一数据源，所有人从同一份live data工作

### 2. 责任锚定到现实
- 传统系统把设备绑定到"工单"，不是绑定到"人"
- **解法：** 操作员对控制的资产负责，foreman对资产的使用负责
- 系统通过日常workflow（检出、检查、调配、归还）自动记录责任链

### 3. 有意义的摩擦（Purposeful Friction）
- 大多数系统："对的操作很难，错的操作很容易"
- **解法：** 翻转 — 正确操作零摩擦，有风险的决策才加确认
- 例：foreman关班次必须确认数量，但driver过磅不会因缺cost code被拦停

### 4. Field-Driven Data（一线驱动数据）
- 传统模式：一线给系统喂数据，系统不给一线任何回报
- **解法：** foreman排班、调度、确认完工 = 他们的本职工作，系统自动捕获数据
- 项目团队和财务实时收到信息，一线零额外负担

### 5. 挑战Legacy流程
- "一直这么做的"不是理由
- 大量流程存在只因为另一个系统需要它
- **解法：** 从第一性原理重建 — 工作是什么？什么阻碍效率？什么信息真正需要传递？

## The Build: TOM

### Ontology（本体论）— 四个基础对象
| Object | Description |
|--------|------------|
| **Contracts** | 合同/项目 |
| **Labor** | 人力/工时 |
| **Equipment** | 设备/资产 |
| **Materials** | 材料/物料 |

所有工作流挂在这四个对象上。每个对象在ontology中只存在一次，跨所有workflow共享。

### 运营模块
- **Dispatch** — 调度
- **Trucking** — 运输
- **Site 360** — 现场全景
- **Cavanagh Connect** — 协作平台

### 关键成果
- Legacy ERP逐步退出运营，只保留财务账本功能
- 原来需要数月集成的workflow，现在数周完成
- 瓶颈从技术转移到change management — **"人能多快适应系统的进化速度"**

## OrgNext Implications

### 直接可借鉴
1. **Ontology Layer** — Cavanagh用4个对象建模整个建筑公司；OrgNext可以用类似方式建模金融公司（Clients、Portfolios、People、Workflows）
2. **Bootcamp Go-to-Market** — 5天bootcamp → 发现核心问题 → multi-year deal。AIP Bootcamp模式已验证
3. **"All In" Strategy** — 不做pilot，直接替换。对的客户会选择这条路
4. **ERP → Ledger Only** — OrgNext的颠覆路径：传统firm management软件退化为纯记录，OrgNext成为运营核心
5. **Field-First Design** — 金融公司的"field"是portfolio manager和analyst，不是IT。为他们设计，而非为admin设计

### 与Nova的对比
| Dimension | Palantir/Cavanagh | Nova |
|-----------|-------------------|------|
| 起点 | 3个真实业务问题 | 技术架构（node, interaction, quest） |
| 核心抽象 | Ontology（4个业务对象） | Quest（开发者概念） |
| 用户 | Dispatcher, Foreman, PM | Developer |
| 成功指标 | 一线效率、实时数据 | 功能数量、demo效果 |
| 文化 | "Field is the core" | "Build cool tech" |

### Key Quotes

> "The challenge is no longer how to automate paperwork but how to rebuild the operating system of construction itself."

> "The speed of development has pushed the organization to its limits on change management rather than technology."

> "Software began to shape behavior in unproductive ways, reinforcing blame between departments instead of enabling shared understanding."

---

*Compiled by GG — March 25, 2026*
