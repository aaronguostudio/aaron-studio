# Prose Polish Review

## 修改目标

- 按 Aaron 的明确反馈重排文章：近期争论 → 两人观点与社区分歧 → 工作中的 critical-system / system-of-record 挑战 → Aaron 的判断。
- 拒绝重复解释。保留机制、反方和操作规则，把篇幅压到观点能够成立的最短长度。
- 中英文分别自然表达，不做逐句翻译。

## 英文润色重点

1. 开头直接进入 Mitchell Hashimoto 与 Uncle Bob 的相反做法，不再从 Aaron 的规则起笔。
2. 将两人的共同点与真实分歧各说一次，不在结尾重复总结。
3. 把工作处境压缩为低风险任务与权威写入两类，用最短路径解释“回滚代码不等于恢复事实”。
4. 保留阅读与测试的不同失效方式、同源证据盲点，以及减少源码阅读会削弱团队系统模型的反方。
5. 将四级审查框架压缩为四条，每一层只保留分流条件与最低要求。
6. 删除 Godot 支线、三篇站内自引、senior / junior 分支、Newsletter CTA 和重复结论。

## 中文润色重点

1. 第一行直接采用 Aaron 建议的开场：“最近，一场关于 AI 写的代码到底要不要读的争论，引起了我的好奇。”
2. 用“讨论很快呈现出两种主张”代替过度二元、证据不足的“社区分成两派”。
3. 将“每天面对”收紧为“工作中面对的实际取舍”，避免夸大频率。
4. 普通工程表达优先使用中文；保留 AI、agent、system of record、Gherkin、QA、CI、context 等自然术语。
5. 结尾只保留 ownership 判断和一个最终问题。

## 保留不改的地方

- 核心判断仍是：审查深度取决于代码有权改变什么，而不是作者身份或 diff 大小。
- Critical system 由失败后果定义；system of record 由事实权威定义。
- 不虚构事故。Aaron 的个人证据仍是一条设在事故之前的工作边界。
- System-of-record 修改最低需要系统模型，关键写入路径通常需要源码理解。
- 权威写入继续保留明确发布规则：负责人、关键路径、业务不变量、对账与恢复方案缺一不可。

## 风险与边界

- 本轮没有增加新的事实、数字或个人案例。
- 显式 thesis 有意放在工作处境之后，遵循 Aaron 指定的叙事顺序；标题从开头即给出文章答案。
- 大幅压缩后，文章不再承担行业综述任务。它是一篇有来源、有机制、有个人判断的 operator essay。
- 完整 v1 已保存在 `revisions/v1/`，便于比较或恢复。

## 验证结果

- English style + personal anchor + story craft: **100/100, PASS**
- Chinese style: **100/100, PASS**
- Frontmatter alignment: **PASS**
- English: **约 900 词**，v1 约 2,350 词
- Chinese: **约 2,470 字符**，v1 约 6,360 字符
- Placeholder scan: no blocking placeholders
- Decision: **PASS — hand off to revised editorial scorecard**
