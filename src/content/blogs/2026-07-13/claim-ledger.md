# Claim Ledger — The AI Revolution Has Not Reached the Organization Yet

**审计日期：** 2026-07-13  
**规则：** `事实`只在来源直接支持时使用；`推论`必须显示推理链；`判断`明确归于作者；`个人观察`不能被包装成普遍证据。所有历史数字在排版前再回到一手表核对口径。

| ID | 拟使用的主张 | 类型 | 来源与日期 | 置信度 | 计划用途 | 边界与核验状态 |
| --- | --- | --- | --- | --- | --- | --- |
| E1 | 美国制造业中电动机提供的机械动力占比由 1899 年约 4.8% 升至 1929 年约 82.3%。 | 事实 | [U.S. Census 历史制造业表](https://www2.census.gov/prod2/decennial/documents/03450419v1ch06.pdf)，历史统计表 | 高 | 电气化时间轴 | 这是动力马力占比，不是工厂数量、产出或生产率；正文须写清口径。已核。 |
| E2 | 早期 factory electrification 常是 electric line-shaft drive：替换中央动力但保留轴、皮带与滑轮；后来才有 group/unit drive。 | 事实 | [Devine, *Journal of Economic History*, 1983](https://gwern.net/doc/economics/automation/1983-devine.pdf) | 高 | “一根旧皮带”段 | 历史综述/学术论文，不应从一个厂外推全部工厂。已核。 |
| E3 | 电气化的关键收益常来自布局、物料搬运、局部停机、扩产与控制，而非仅直接能源节省。 | 推论（有机制证据） | [Devine, 1983](https://gwern.net/doc/economics/automation/1983-devine.pdf) | 高 | 电气化机制 | 不能说所有工厂或所有收益皆来自同一机制。已核。 |
| E4 | 电气化收益并非普遍等待数十年：利用水电站距离识别的研究发现其生产率影响可迅速且持久出现。 | 事实 | [Fiszbein et al., NBER 28076, 2020；2024 修订](https://www.nber.org/papers/w28076) | 高 | 反例 / 三种时间 | 行业×县层面的因果识别；不测所有组织机制。已核。 |
| E5 | 福特系统化整合可互换件、专机、输送线、物料流与电动机灵活性；不能写成“福特单独发明流水线”。 | 事实 | [NPS/HAER Ford 记录](https://tile.loc.gov/storage-services/master/pnp/habshaer/ca/ca3300/ca3339/data/ca3339data.pdf) | 高 | 福特段 | 叙事需注明有肉类加工、制粉、酿造等先例。已核。 |
| E6 | 1920 年全美住宅/农场通电率约 34.7%/1.6%，1940 年约 78.7%/32.6%。 | 事实 | [U.S. Census Bureau, 2025 历史汇总](https://www.census.gov/about/history/stories/monthly/2025/september-2025.html) | 高 | 家庭/农村扩散 | 住宅接入不等于拥有每种电器或女性劳动时间立即下降。已核。 |
| E7 | 电气化与资本—技能互补相关；同时教育供给影响技术变革的工资分配。 | 事实（研究结论） | [Goldin & Katz, NBER 5657, 1996 / QJE 1998](https://www.nber.org/papers/w5657) | 高 | 劳动段 | 观察性历史研究，避免单因果归因。已核。 |
| E8 | 电网扩散依赖制度、融资与公共组织，农村电气化比城市和工厂慢。 | 事实 + 推论 | [Census 2025](https://www.census.gov/about/history/stories/monthly/2025/september-2025.html)；[NARA RG 221](https://www.archives.gov/research/guide-fed-records/groups/221.html) | 高 | 家庭段 / AI 最后一公里 | NARA 证明档案与 REA 活动，具体因果需借社会史来源表述。已核。 |
| E9 | Paul David 在 1990 年把计算机生产率悖论与电气化比较，同时警告 computers are not dynamos。 | 事实 | [David, AER 1990 书目](https://ideas.repec.org/a/aea/aecrev/v80y1990i2p355-61.html)；[全文副本](https://gwern.net/doc/economics/automation/1990-david.pdf) | 高 | 计算机段开场 | 只做思想史来源，不把他的时序视为预言。已核。 |
| C1 | IT 的经济价值受组织投资影响，且无形收益难测；已积累的无形资本可能解释随后宏观生产率回升。 | 事实（论文结论） | [Brynjolfsson & Hitt, JEP 2000](https://www.aeaweb.org/articles?id=10.1257/jep.14.4.23) | 高 | 计算机机制 | 企业观察与案例综合，不能当作所有 IT 项目的因果保证。已核。 |
| C2 | IT、去中心化的工作组织、技能/培训和新服务之间存在互补性。 | 事实（研究结论） | [Bresnahan, Brynjolfsson & Hitt, NBER 7136, 1999 / QJE 2002](https://www.nber.org/papers/w7136) | 高 | 计算机劳动段 | 企业样本与观察设计；语言用“互补/相关”。已核。 |
| C3 | 美国 1990 年代后半生产率加速，但其普遍性和持续性存在争议。 | 事实 | [Federal Reserve 资料](https://www.federalreserve.gov/monetarypolicy/files/FOMC20010627material.htm)；[Gordon, JEP 2000](https://www.aeaweb.org/articles?id=10.1257/jep.14.4.49) | 高 | 计算机反方 | 不将宏观时间序列解释为某项技术的单一因果结果。已核。 |
| C4 | 计算机化更易替代例行任务、互补于非例行问题解决和复杂沟通，且与职业极化有关。 | 事实（研究结论） | [Autor, Levy & Murnane, 2003](https://economics.mit.edu/sites/default/files/publications/the%20skill%20content%202003.pdf)；[Autor et al., NBER 11986, 2006](https://www.nber.org/papers/w11986) | 高 | 职业段历史对照 | 不从历史任务框架直接推断具体 AI 职位。已核。 |
| A1 | 2025-11 至 2026-01，美国 18% 企业在至少一个业务功能使用 AI（就业加权 32%）。 | 事实 | [Hartley et al., NBER 35141, 2026](https://www.nber.org/papers/w35141) | 高 | AI 当前阶段 | “使用”定义和调查期有限；不要同员工使用率混用。已核。 |
| A2 | AI 使用企业中，57% 使用不超过三项功能，65% 用于不超过三项任务；66% 是增强用途，报告就业减少的为 2%。 | 事实 | [NBER 35141, 2026](https://www.nber.org/papers/w35141) | 高 | “使用≠重构”图表 | 自报、短期、非生产率因果结论。已核。 |
| A3 | 客服准实验中，AI 助手使每小时解决量平均 +14%，新手/低技能约 +34%。 | 事实 | [Brynjolfsson, Li & Raymond, NBER 31161, 2023](https://www.nber.org/papers/w31161) | 高 | AI 微观收益 | 单一客服企业；不能外推公司利润/宏观。已核。 |
| A4 | 多公司知识工作者 RCT 发现邮件时间减少，但未发现任务数量/构成改变。 | 事实 | [NBER 33795, 2025](https://www.nber.org/papers/w33795) | 中高 | AI 微观/组织断层 | 有工具提供商关联披露；正文应说明是所研究环境。已核。 |
| A5 | AI 开发效率存在方向相反的 RCT 证据：企业环境的任务数增加 vs. 熟悉大型 OSS 仓库中时间增加。 | 事实 | [Management Science, 2026](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.2025.00535)；[METR, 2025](https://arxiv.org/abs/2507.09089) | 高 | 现代反例 | 衡量指标不同、工具时期不同、样本不同；不能做“AI 无用”的结论。已核。 |
| A6 | OECD SME 调查中，核心活动使用少于总体使用，采纳障碍集中在适配性、法律/监管、数据处理与技能。 | 事实 | [OECD, 2025，核心活动](https://www.oecd.org/en/publications/generative-ai-and-the-sme-workforce_2d08b99d-en/full-report/component-4.html)；[障碍](https://www.oecd.org/en/publications/generative-ai-and-the-sme-workforce_2d08b99d-en/full-report/component-6.html) | 高 | AI 组织瓶颈 | 跨国 SME 自报，不替代大企业/中国证据。已核。 |
| A7 | AI 任务链可能造成非线性生产率提升，是一项理论/代理证据主张。 | 推论（理论） | [Demirer et al., NBER 34859, 2026](https://www.nber.org/papers/w34859) | 中 | 乐观派机制 | 不写成已验证企业事实。已核。 |
| A8 | 若 AI 主要节省既有任务成本，十年 TFP 增量可能不超过约 0.66%。 | 事实（模型结果） | [Acemoglu, NBER 32487, 2024](https://www.nber.org/papers/w32487) | 高 | 谨慎派机制 | 模型校准，不是对技术上限或未来的确定预测。已核。 |
| A9 | 约四分之一全球就业处于某种 GenAI 暴露；更可能是转型而非必然替代。 | 事实（风险指数结论） | [ILO, 2025](https://www.ilo.org/resource/news/one-four-jobs-risk-being-transformed-genai-new-ilo%E2%80%93nask-global-index-shows) | 高 | 职业段 | “暴露”绝不能改写为“失业率”。已核。 |
| A10 | 2026 ILO 综述称，少量工时节省尚未广泛转化为可测产出、收入或就业效果。 | 事实（综述结论） | [ILO, 2026](https://www.ilo.org/publications/impact-genai-jobs-productivity-and-work-organization-review-empirical) | 高 | 当前证据边界 | 早期实证综述；不否定长期变化。已核。 |
| A11 | IEA 基准情景预计数据中心用电到 2030 年约 945 TWh、接近全球 3%。 | 事实（情景预测） | [IEA, *Energy and AI*, 2025](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai) | 高 | 投资/基础设施段 | 场景预测，不是营收、利润或股价预测。已核。 |
| J1 | “AI 革命尚未抵达组织”是当前最有用的总框架。 | 判断 | 上述跨时代证据综合 | 中高 | 全文论点 | 必须包含反例和条件，不能当作事实。 |
| J2 | 现在仍是进入机会的早期，条件是进入真实工作流、互补资产和责任结构，而不只是试用工具。 | 判断 | 上述证据 + Aaron 的经验 | 中 | 结尾希望 | 不承诺平等回报或职业安全。 |
| P1 | Aaron 已将部分工作从单次任务转为带执行、审查和记忆的 agent 系统。 | 个人观察 | [相关旧文](../2026-06-20/ai-became-my-operating-system.md) | 高（个人事实） | 个人锚点 | 不能作为宏观采纳或生产率证据。 |

## Decision: PASS

核心论点有跨时代的原始研究、反例和当前实证支持；数字、来源日期与推论边界已标注。下一阶段可写作，但每个数字/图表在发表前必须二次打开原始来源复核，并删除任何无法保持其限定语的表述。
