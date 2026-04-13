# Palantir 深度研究汇总报告

> 研究日期：2026-03-20
> 基于 6 份子报告的交叉分析汇总

---

## 1. Executive Summary

Palantir 的本质不是一家 SaaS 公司，不是一家咨询公司，也不是一家 AI 公司——它是一个 **Enterprise Operating System**，其核心资产是 Ontology（本体层）。Ontology 将企业的数据、实体关系和可执行操作统一映射为一个语义模型，让 AI 不仅能"理解"业务，还能在业务上"行动"。这是 Palantir 区别于所有竞争对手的根本架构差异。

Palantir 赢在三个层面：**时间**——20 年在最严苛环境（战场、情报社区）中锤炼的平台成熟度；**深度**——Ontology 将客户的核心运营数字孪生化，形成极高的迁移成本；**节奏**——AIP Bootcamp 将企业 AI 销售周期从 6-12 个月压缩到 5 天，70-75% 的转化率重新定义了 enterprise GTM。

财务数据验证了这套模型的爆发力：FY2025 收入 $4.48B（+56% YoY），GAAP net income $1.63B，Rule of 40 达到 127%，NRR 从 107% 飙升至 134%。商业收入首次超过政府收入（53% vs 47%），标志着 Palantir 完成了从政府 contractor 到商业平台公司的历史性转型。

OrgNext 应学习 Palantir 的 **Ontology 思维**（为组织建立语义模型而非数据库表结构）、**Bootcamp GTM**（用真实数据在数天内证明价值）和 **消费驱动定价**（摆脱 per-seat 模式）。但必须避免其早期错误：过度依赖大客户、FDE 重人力模式、17 年才 125 个客户的规模化困境。OrgNext 的差异化在于将 AI Agent 作为 first-class 组织成员纳入 Ontology，而非仅将 AI 作为工具层叠加。

---

## 2. Top 10 关键洞察

### 洞察 1：Ontology 是 Palantir 最深的护城河，而非 AI 模型

**一句话总结**：Palantir 的不可替代性来自其将企业运营映射为语义模型的 Ontology 层，而非任何具体的 AI 能力。

**交叉证据**：
- 报告 02（技术架构）：Ontology 由 Semantic Layer + Kinetic Layer + Dynamic Layer 三层架构组成，实现"数据+操作+治理"闭环
- 报告 03（客户案例）：从 CIA 到 Cleveland Clinic，所有成功案例的核心都是"统一数据视图 + 可操作性"
- 报告 04（竞争格局）：Knowledge Graph 只能查询，Data Mesh 只管治理，唯有 Ontology 同时是语义层和操作层

**对 OrgNext 的意义**：OrgNext 必须从 Day 1 就构建 Organization Ontology（Person、Team、Role、Objective、Decision 等核心 Object Types），而非先做数据库再补语义层。

**信心水平**：高

---

### 洞察 2：AIP Bootcamp 是企业 AI 销售的范式革命

**一句话总结**：5 天 Bootcamp 用真实数据交付可运行 MVP，将"销售过程"转化为"价值交付过程"，实现 70-75% 转化率。

**交叉证据**：
- 报告 01（商业模式）：Bootcamp 将 POC 从 6 个月压缩到 5 天，消除采购流程中最大的阻力
- 报告 03（客户案例）：截至 Q4 2024 累计完成 1,300+ 场 Bootcamp
- 报告 05（GTM 与文化）：CAC 约 $67K-$133K per closed deal，对六到七位数 ACV 极为高效

**对 OrgNext 的意义**：设计 "OrgNext Sprint"（3 天轻量版 Bootcamp），连接客户 Slack + Calendar + Jira 数据，自动构建初始 Org Ontology 并生成组织健康报告。

**信心水平**：高

---

### 洞察 3：从"咨询+软件"到纯平台的转型是盈利拐点的根本驱动力

**一句话总结**：毛利率从 67.7%（2020）提升至 80.2%（2024），证明产品化策略成功。

**交叉证据**：
- 报告 01（商业模式）：Revenue per employee ~$727K，是 ServiceNow 的 1.7 倍
- 报告 05（GTM 与文化）：Acquire-Expand-Scale 模型中 Scale 阶段 adjusted operating margin 达 51%
- 报告 02（技术架构）：Apollo 自动化运维 + Workshop 低代码构建器降低了服务成本

**对 OrgNext 的意义**：从 Day 1 追求产品化，每一次定制需求都评估"是否可以变成产品功能"。目标在 $10M ARR 时达到 Rule of 40。

**信心水平**：高

---

### 洞察 4：Per-seat 定价正在终结，消费模式是未来

**一句话总结**：AI 让更少的人完成更多工作，按人头收费的逻辑被根本瓦解。

**交叉证据**：
- 报告 06（未来展望）：Seat-based pricing 采用率 12 个月内从 21% 降至 15%，85% 软件公司已采用某种 usage-based pricing
- 报告 01（商业模式）：Palantir 的 NRR 从 107% 飙升至 134%，消费模式驱动存量客户大幅扩展
- 报告 04（竞争格局）：2026 年初 "SaaSpocalypse" 导致 SaaS 公司市值蒸发约 $285B

**对 OrgNext 的意义**：采用 Platform Fee + Consumption Hybrid 模式，按 AI Agent action 计费而非按 seat 计费。AI Agent 不该算一个"seat"。

**信心水平**：高

---

### 洞察 5：Forward Deployed Engineer 模式是竞争壁垒也是规模化瓶颈

**一句话总结**：FDE 是 Palantir 深度嵌入客户的核心武器，但也是其 17 年仅 125 个客户的根因。

**交叉证据**：
- 报告 05（GTM 与文化）：FDE 模型只在七位数以上合同中具有财务可行性；每客户需多名 FDE 驻场
- 报告 03（客户案例）：JPMorgan 曾有 120 名 FDE 驻场，暴露了权力滥用和治理风险
- 报告 01（商业模式）：AIP Bootcamp 正在部分替代 FDE 的获客功能，但 Expand 阶段仍依赖 FDE

**对 OrgNext 的意义**：不应模仿 FDE 模式。用 self-serve + 引导式 onboarding 替代，用 template marketplace 和 community-driven expansion 替代 FDE 的 Expand 功能。

**信心水平**：高

---

### 洞察 6：军事/政府验证为商业扩张提供了独特的信任基底

**一句话总结**：先在最严苛环境验证，再 trickle-down 到商业市场——这是 Palantir 独有的信任飞轮。

**交叉证据**：
- 报告 03（客户案例）：乌克兰战场实战验证、TITAN 按时按预算交付、SOCOM 合同超 $7 亿
- 报告 06（未来展望）：NATO 采用 Maven Smart System 作为联盟级 AI 作战平台
- 报告 01（商业模式）：政府合同的高续约率提供盈利安全垫

**对 OrgNext 的意义**：虽无法复制军事路径，但可借鉴"在高要求垂直领域验证后向外扩展"的策略——先从合规要求最严格的金融服务切入，建立信任后再扩展。

**信心水平**：高

---

### 洞察 7：传统 SaaS 巨头的 AI 策略是"AI as feature"，Palantir 的是"AI as OS"

**一句话总结**：Salesforce、SAP、Oracle 在已有产品上叠加 AI 功能，而 Palantir 提供跨系统的 AI 操作层——这是功能升级与平台变革的根本区别。

**交叉证据**：
- 报告 04（竞争格局）：Salesforce 局限于 front-office，SAP 是 ERP-centric，Oracle 是模块级 AI
- 报告 02（技术架构）：Palantir 不拥有底层存储和计算，而是在 Databricks/Snowflake 之上叠加语义层+应用层+AI 层
- 报告 06（未来展望）：Workday 收购 Sana 等仍是"记录系统加 AI 层"

**对 OrgNext 的意义**：定位为 "Organization Operating System" 而非 HR Tool，坐在 Workday/Rippling 等记录系统之上，提供组织智能层。

**信心水平**：中（市场接受度待验证）

---

### 洞察 8：C3.ai 的失败证明了"产品可复制，嵌入度不可复制"

**一句话总结**：C3.ai 89% bookings 依赖 partner，缺少 Ontology 级技术护城河，创始人退出后营收崩塌 46%。

**交叉证据**：
- 报告 04（竞争格局）：C3.ai 的 pre-built AI apps 容易被 cloud providers 原生 AI 服务替代
- 报告 01（商业模式）：Palantir NRR 134% vs C3 续约率下滑严重
- 报告 05（GTM 与文化）：Palantir 自有销售+Bootcamp vs C3 的 partner-dependent 模式

**对 OrgNext 的意义**：必须拥有客户关系，不能依赖 partner 分发。构建深度嵌入的 Ontology 层才是真正的护城河，而非 pre-built AI apps。

**信心水平**：高

---

### 洞察 9：数据隐私和 Vendor Lock-in 是 Palantir 最持久的风险

**一句话总结**：从 JPMorgan 监控事件到德国违宪裁决再到 NHS 隐私争议，数据治理问题始终是 Palantir 的阿喀琉斯之踵。

**交叉证据**：
- 报告 03（客户案例）：德国宪法法院裁定 Palantir 使用违宪；Hesse 和 NRW 80% 功能未使用
- 报告 05（GTM 与文化）：450+ 科技员工联名要求取消 ICE 合同
- 报告 03（客户案例）：数据以 Palantir 专有格式存储，迁移极其困难，不存在正式迁移路径

**对 OrgNext 的意义**：将开放数据导出和标准 API 集成作为核心差异化。组织数据极其敏感（薪资、绩效、人际关系），必须从架构层面保证隐私和透明度。

**信心水平**：高

---

### 洞察 10：AI Agent 作为 first-class 组织成员是 OrgNext 的核心差异化机会

**一句话总结**：Palantir 的 AI 运行在 Ontology "之上"，OrgNext 应将 AI Agent 纳入 Ontology "之内"——作为与 Person 平行的 first-class 实体。

**交叉证据**：
- 报告 06（未来展望）：Harvard 研究显示 AI 作为 "Cybernetic Teammate" 实现近 40% 绩效提升
- 报告 02（技术架构）：Palantir Agent 分 4 个 Tier，但均是"工具"定位而非"成员"定位
- 报告 04（竞争格局）：Workday 和 Rippling 均不支持 AI Agent 作为 first-class 组织成员

**对 OrgNext 的意义**：这是一个全新品类定义的机会——Agent Domain（Agent、Task、AgentPolicy）作为 Ontology 的核心组成部分，AI Agent 拥有角色、权限、任务和产出。

**信心水平**：中（概念领先，但落地验证不足）

---

## 3. 矛盾与争议点

### 3.1 报告间的张力

**关于 FDE 模式的评价存在内在矛盾**：
- 报告 05 高度评价 FDE 是"其他公司学不会"的竞争壁垒
- 报告 03 显示 FDE 模式导致 17 年仅 125 客户，且 JPMorgan 120 名 FDE 驻场引发权力滥用
- 报告 01 指出 AIP Bootcamp 正在部分替代 FDE 功能

**判断**：FDE 在 Acquire 阶段正在被 Bootcamp 替代，但在 Expand 阶段仍不可或缺。Palantir 自身正在解决这个矛盾，但过程尚未完成。

**关于国际化前景的分歧**：
- 报告 01 将国际收入仅占 23% 视为"巨大的未开发市场空间"
- 报告 03 显示德国违宪裁决、Europol 合作终止，欧洲市场存在结构性障碍
- 报告 05 记录了 Palantir 从 Denver 迁往 Miami 的决定，部分原因是 Colorado AI 监管法案

**判断**：国际市场（尤其是欧洲）对 Palantir 而言可能是一个长期受限的市场，而非简单的"未开发机会"。

### 3.2 需要进一步验证的数据点

1. **Bootcamp 转化率 70-75%**：这是 Palantir 管理层引用的数字，但缺乏第三方审计。考虑到 Bootcamp 本身存在 selection bias（只有足够有意向的客户才会参加），实际"冷启动到付费"的全漏斗转化率可能显著低于此。

2. **NRR 134%**：Q3 2025 数据。需要观察这一指标是否可持续，还是受 AIP 初期 adoption wave 的一次性拉升。

3. **Revenue per employee $727K**：该指标可能因大量使用 contractor 和 partner 而失真（contractor 不计入员工数但贡献收入）。

4. **$10B 陆军合同的实际执行**：这是 10 年期 IDIQ 合同的 ceiling value，实际每年拨付金额可能远低于 $1B/年。

### 3.3 Palantir 叙事中可能被高估的部分

1. **"AI Operating System" 定位的普适性**：Palantir 在国防、能源、制造等"重运营"行业表现突出，但在轻资产、知识密集型行业（咨询、创意、教育）的验证较少。"Enterprise OS"叙事可能过度泛化。

2. **商业增长的可持续性**：FY2025 U.S. commercial 增长 109% 包含大量从零起步的新客户一次性签约效应。当客户基数扩大后，这种增速必然回落，问题是回落到什么水平。

3. **估值隐含的增长预期**：51x forward P/S 要求 Palantir 在未来 5-10 年保持 30%+ 增速。如果 AI 热度降温或竞争加剧，估值压缩风险极大。当前市场定价更多反映"信仰"而非"基本面"。

---

## 4. Palantir 模式的核心公式

### 4.1 五个核心要素

**要素一：Ontology（语义操作层）**
将企业数据从"表和列"提升为"对象+关系+操作"的语义模型。这是所有其他要素的基础——没有 Ontology，AI 只是聊天机器人，部署只是 ETL，GTM 只是卖工具。

**要素二：Apollo（全环境部署引擎）**
让 300+ 微服务安全部署到从公有云到气隔网络的所有环境。这是政府和国防客户的必要条件，也是商业客户数据主权需求的解决方案。

**要素三：AIP Bootcamp（价值前置 GTM）**
5 天内用客户真实数据交付可运行 MVP，将销售转化为价值交付。这消除了企业 AI 采购的最大阻力——"我不知道这东西到底有没有用"。

**要素四：FDE（嵌入式工程驱动的客户成功）**
Forward Deployed Engineers 驻场理解业务、构建方案、反馈产品。这是 Land-and-Expand 中 Expand 阶段的核心引擎。

**要素五：Military-Grade Trust（军事级信任背书）**
20 年政府/国防验证提供的安全性、可靠性和极端环境适应性信誉。商业客户选择 Palantir 时，这份信任是无形但巨大的购买因素。

### 4.2 要素间的相互强化

```
Military Trust → 赢得政府合同 → 为 Ontology 提供最复杂的验证场景
     ↓
Ontology 成熟 → 降低 FDE 的定制工作量 → 毛利率提升
     ↓
Apollo 全环境部署 → 覆盖更多客户场景 → 扩大 TAM
     ↓
Bootcamp 加速获客 → 更多客户数据训练 Ontology → 平台越用越强
     ↓
FDE 嵌入扩展 → 更深的客户锁定 → NRR 134%
```

这是一个自我强化的飞轮：每个成功的 deployment 都让 Ontology 更丰富、Apollo 更成熟、Bootcamp 案例更充分、FDE 效率更高。

### 4.3 可复制性分析

| 要素 | 可复制性 | 说明 |
|------|---------|------|
| Ontology 思维 | **高** | 核心是设计哲学，不是技术壁垒。OrgNext 可以为组织管理领域构建专属 Ontology |
| Apollo 全环境部署 | **低** | 需要数年工程投入和政府安全认证，startup 不可复制 |
| Bootcamp GTM | **高** | 核心原则（真实数据+压缩时间+价值前置）完全可迁移，OrgNext 可设计轻量版 |
| FDE 模式 | **低** | 需要稀缺人才+七位数合同支撑，startup 应走 self-serve 路线 |
| Military Trust | **不可复制** | 20 年积累，与 Palantir 的创始基因绑定 |

---

## 5. OrgNext 战略建议备忘录

### 5.1 产品定位

**一句话定位**：OrgNext 是 AI-native 的 Organization Operating System——不是记录员工信息的 HR 工具，而是理解、优化、演化组织结构的智能平台。

**详细解释**：
当前所有 HR Tech（Workday、Rippling、BambooHR）都是 System of Record——它们存储数据、管理流程、确保合规。OrgNext 的定位是 System of Intelligence——它理解组织的结构性健康、预测组织风险、推荐结构性调整、将 AI Agent 作为 first-class 团队成员管理。这不是在 HR 系统上加 AI 功能，而是从 AI-first 原则重新设计组织管理软件。

### 5.2 核心技术方向

**Ontology 设计**：
- 四大 Domain：People（Person、Role、Skill）、Team（Team、Project、OKR）、Process（Workflow、Decision、Meeting）、AI Agent（Agent、Task、AgentPolicy）
- 核心创新：AI Agent 作为 first-class 实体，与 Person 平行存在于 Ontology 中
- 借鉴 Palantir 的 Branching 模型：AI 提出组织变更方案在"分支"上，管理者审核后"合并"

**AI 架构**：
- Model-agnostic：不绑定单一 LLM 提供商，支持 OpenAI/Anthropic/开源模型
- AI 在 Ontology 上推理：理解 Person-Team-Objective-Skill 的语义关系，而非读取数据库行
- AI 提出结构化 Action（如 ReorganizeTeam、ProposePromotion），而非只输出文本建议

**数据集成**：
- Phase 1（MVP）：Slack + Google Calendar + GitHub + Jira/Linear
- Phase 2：Salesforce/HubSpot + Notion/Confluence + HRIS（Workday/BambooHR/Rippling）
- Phase 3：财务系统 + 学习平台 + 高级通讯分析

### 5.3 GTM 策略

**目标客户**：
- Primary ICP：Tech-forward mid-market（50-500 人），SaaS 公司、金融科技，已使用 Slack+Jira+GitHub
- Secondary ICP：金融服务（100-1000 人），资管/PE/VC/fintech/保险科技

**获客方式**：
- 核心引擎：**OrgNext Sprint**（3 天 AI 组织诊断工作坊）
  - Day 1：连接客户 Slack + Calendar + PM 工具，自动构建初始 Org Ontology
  - Day 2：AI 分析生成 Org Intelligence Report（协作模式、瓶颈、过载人员）
  - Day 3：与管理层 workshop，展示 AI Agent 作为 team member 的角色
  - 目标转化率 > 50%
- 内容驱动：利用 X/Twitter 建立 "AI + organizational design" 思想领导力
- 社区驱动：Sprint alumni 形成用户社区，peer learning 驱动扩展

**定价模式**：
- Platform Fee + AI Agent Consumption 混合模式
- Explorer（免费/$49/月）→ Growth（$499-999/月）→ Scale（$1,999-4,999/月）→ Enterprise（Custom）
- 核心原则：不按 seat 收费，按 AI Agent action 消耗计费

### 5.4 护城河构建

1. **Organization Ontology 锁定**：当客户的组织结构、协作网络、决策流都在 OrgNext 的 Ontology 中时，迁移成本极高
2. **数据飞轮**：更多组织数据 → 更精准的 AI 洞察 → 更高的客户依赖 → 更多数据
3. **金融服务合规壁垒**：满足数据驻留、审计追踪、权限控制等要求后，合规认证本身成为竞争壁垒
4. **AI Agent 生态**：Agent SDK 允许客户和第三方构建自定义 Agent，形成平台生态效应
5. **先发优势+品类定义**："AI-native Organization OS" 是一个全新品类，先定义品类者有命名权和认知优势

### 5.5 需要避免的陷阱

**从 Palantir 学到的教训**：
1. **不要重蹈"17 年 125 客户"覆辙**：避免过度定制，每次定制需求都必须评估产品化可能性。走 self-serve 路线而非 FDE 模式
2. **不要制造 Vendor Lock-in 恶名**：开放数据导出和标准 API 应作为核心卖点，而非 Palantir 式的专有格式锁定
3. **控制 SBC**：Palantir 的 24% SBC/Revenue 一直是投资者痛点。早期就建立健康的现金 vs 股权补偿比例
4. **国际化从 Day 1 考虑**：Palantir 国际收入仅 23%。多语言、多文化适配应从产品设计阶段就纳入

**从 C3.ai 学到的教训**：
5. **必须拥有客户关系**：C3 的 89% bookings 依赖 partner 导致一旦 partner 策略变化即失去分发渠道
6. **创始人不可依赖症**：C3 创始人退出后营收崩塌 46%，说明 deal flow 不能依赖个人关系，必须建立可复制的销售机器

**通用风险**：
7. **AI 可靠性**：AI Agent 的错误决策（如错误的团队重组建议）会直接损害客户信任。必须实现 Branching 模型——所有 AI 提案在分支上，人类审核后合并
8. **数据隐私**：组织数据极其敏感。任何数据泄露都是致命的。安全审计（SOC 2）准备应从 Day 1 开始

---

## 6. 三个值得深入研究的方向

### 6.1 Ontology-Driven Product Design 的通用方法论

**为什么重要**：本次研究揭示了 Ontology 是 Palantir 成功的核心，但如何将 Ontology 思维系统性地应用于新产品设计（不限于组织管理）尚缺乏通用框架。Palantir 的 Ontology 是从 20 年实践中"长出来的"，OrgNext 没有 20 年时间。

**建议研究方法**：
- 深度分析 Palantir 公开文档中的 Ontology 设计模式和最佳实践
- 对比其他 Ontology/Knowledge Graph 框架（如 schema.org、FIBO for finance）
- 构建一个"从零到可用 Ontology"的 90 天方法论

### 6.2 AI Agent 在组织中的治理框架

**为什么重要**：将 AI Agent 作为 first-class 组织成员是 OrgNext 的核心差异化，但目前缺乏成熟的治理框架。当 AI Agent 拥有执行权限时，谁负责其错误？如何设定权限边界？如何审计其决策？

**建议研究方法**：
- 分析 Palantir 的 Agent Tier Framework 和 Branching 治理模型
- 研究 EU AI Act 对 high-risk AI 系统的治理要求
- 参考 Harvard "Cybernetic Teammate" 研究中的协作框架
- 设计 OrgNext 的 AgentPolicy 标准模板

### 6.3 Seat-Based 到 Consumption-Based 定价转型的最佳实践

**为什么重要**：6 份报告一致指向 per-seat 定价的终结，但从 seat-based 到 consumption-based 的转型在实操中充满挑战——如何定义"consumption unit"？如何避免客户预算不可预测的焦虑？如何保持收入的可预测性？

**建议研究方法**：
- 深度案例分析：Snowflake（成功的 consumption 模式）、Datadog（hybrid 模式）、Twilio（credits 模式）
- 分析 Bain/McKinsey 关于 AI 时代 SaaS 定价的最新研究
- 设计 OrgNext 的定价实验框架（A/B test 不同 consumption metric）

---

## 7. 数据附录

### 7.1 Palantir 财务关键数据

| 指标 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 |
|------|------|------|------|------|------|------|
| 收入（$B） | 1.09 | 1.54 | 1.91 | 2.23 | 2.87 | 4.48 |
| YoY 增长 | 47.2% | 41.1% | 23.6% | 16.8% | 28.8% | 56.2% |
| GAAP Net Income（$B） | -1.17 | -0.52 | -0.37 | +0.22 | +0.46 | +1.63 |
| 毛利率 | 67.7% | — | — | 80.6% | 80.2% | — |
| Adj. Operating Margin | — | — | — | — | 39% | 50% |
| 员工数 | — | — | — | — | 3,936 | ~4,100* |

*来源：报告 01（Palantir 10-K、Q4 2025 Earnings）*

### 7.2 客户与增长指标

| 指标 | 时间点 | 数值 |
|------|--------|------|
| 总客户数 | Q4 2025 | ~820+ |
| U.S. 商业客户数 | Q4 2025 | 571 |
| NRR | Q3 2025 | 134% |
| Rule of 40 | Q4 2025 | 127% |
| Revenue per employee | FY2024 | ~$727K |
| SBC/Revenue | FY2024 | ~24% |
| Revenue backlog | 2026 年初 | $11.2B |

*来源：报告 01、05*

### 7.3 估值数据（截至 2026 年 3 月）

| 指标 | 数值 |
|------|------|
| 市值 | ~$365B |
| Trailing P/E | ~217-246x |
| Forward P/E | ~103x |
| P/S（TTM） | ~82x |
| P/S（Forward，FY2026E $7.2B） | ~51x |
| EV/FCF（TTM） | ~161x |

*来源：报告 01（Yahoo Finance、CompaniesMarketCap）*

### 7.4 竞品对比数据（FY2024）

| 指标 | Palantir | Salesforce | ServiceNow | Datadog | CrowdStrike | Snowflake |
|------|----------|------------|------------|---------|-------------|-----------|
| 收入（$B） | 2.87 | ~34.9 | ~10.5 | 2.68 | ~3.06 | ~3.4 |
| 收入增速 | 29% | ~11% | ~23% | 26% | ~33% | ~28% |
| 毛利率 | 80.2% | ~76% | ~79% | ~81% | ~78% | ~67% |
| Rule of 40 | 68% | ~44% | ~53% | ~53% | ~55% | ~33% |

*来源：报告 01（MacroTrends、ValueSense）*

### 7.5 AIP Bootcamp 关键数据

| 指标 | 数值 | 时间点 |
|------|------|--------|
| 转化率 | 70-75% | 2024-2025 |
| 累计完成场次 | 1,300+ | Q4 2024 |
| 单场成本（估算） | $50K-$100K | — |
| CAC per closed deal（估算） | $67K-$133K | — |
| 销售周期压缩 | 从~12 个月到数天 | 2023-2025 |

*来源：报告 03、05（Palantir Blog、GTM Foundry、Yahoo Finance）*

### 7.6 关键客户合同数据

| 客户 | 合同价值 | 时间 | 场景 |
|------|---------|------|------|
| 美国陆军（综合） | $10B（10 年期） | 2025 | 企业 AI 平台 |
| 美国陆军 Vantage | $6.19 亿 | 四年期 | 数据分析平台 |
| SOCOM | 累计 $7 亿+ | 2016 至今 | 任务指挥平台 |
| TITAN | $1.784 亿（初始） | 2024 | 目标瞄准系统 |
| NHS FDP | £3.3 亿（$4.15 亿） | 2024 | 联邦数据平台 |
| Airbus Skywise | 未公开 | 2015 至今 | 航空数据平台 |
| Tyson Foods | 两年节省 $2 亿 | 2020 至今 | 供应链优化 |
| BP | 五年期企业协议 | 2024 续签 | 能源数字孪生 |
| SOMPO | $5,000 万扩展 | 2023 | 保险+护理 |
| Cleveland Clinic | 10 年期协议 | — | 医疗运营优化 |

*来源：报告 03（Palantir 官方、Breaking Defense、SEC 财报）*

---

*本报告基于 6 份 Palantir 深度研究子报告的交叉分析。所有数据截止日期为 2026 年 3 月 20 日。*
