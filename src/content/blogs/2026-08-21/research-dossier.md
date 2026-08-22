# 研究档案

## 这份材料要回答的问题

1. 在本地 27B 模型 + 开源 harness 上跑真实生产流程，瓶颈到底留在了哪里？
2. "local" 从 homelab 话题变成 operator 决策的交叉点是什么，边界在哪？
3. 这篇自指的帖子（生产机器 = 论文对象）怎么把利益冲突变成正文资产而不是公关瑕疵？

## 核心一手资料

### 本生产会话（本次会话，2026-08-21，本机实测）
- Harness: DeepSeek Harness 0.1.0-rc.8（本地 clone 47f9438 之后的 rc.8：release commit f1f7dc36fa, 2026-08-19 23:00 +0800；HEAD 141eb6fef8）。repo 自 2026-06-10 起共 12,940 commits（rc.8 时点核算）。
- Model: hf.co/unsloth/Qwen3.8-27B-GGUF:Q8_0，经由 Ollama（baseURL http://127.0.0.1:11434/v1，settings.yaml 中 agent-default-model 配置直查）。
- 机器: MacBook Pro, Apple M5 Max, 18 核, 128GB 统一内存（system_profiler 直查）。
- 流程: blog-production 全链路（idea -> workflow3 产物 -> 双语文稿 -> 风格/质量 gate -> 图片 -> 社媒包）。会话事件日志（zstd 事件日志，session.jsonl.zstd）是 harness 44 事件类型系统的直接物证，本会话已累计 9,000+ 行事件。
- 无计费面: 本地 Ollama 无 meter，settings.yaml 中无 billing 表面；agent 工作 marginal cost ≈ 0（电费忽略不计）。
- Gate 实弹: 本会话中 web_search 对 Kimi 17 岁一作论断的核验（claim ledger 排除项）、fxtwitter API 核验推文内容、风格扫描器 gate、package quality 脚本 gate 全部在本地栈上跑通。

### DSH 仓库（本地 clone 核对，2026-08-21）
- 版本 0.1.0-rc.8，12,940 commits，MIT。
- 事件日志、skill 目录、gate 系统为本系列已拆解内容，本文不重复拆解，只引用其存在作为"harness 层即环境"的实证。

## 可以使用但要谨慎的二手材料

### Qwen3.8-27B 发布与市场反应（2026-08，多源交叉）
- 品玩「Qwen3.8-27B就是新的模型斩杀线」（2026-08-20 前后，12h 内发布时点）：8/14 发布口径、开源两天下载破百万、登顶 HF 全球趋势榜、Cline 开发者 4 天内成为被选择最多的本地模型、Artificial Analysis Intelligence Index 52 分（进入 GPT-5.6 Luna / DeepSeek V4 Flash 同档）、社区外号"本地 Opus 4.6"。**注意**：文中明确"接近不等于追平"（Terminal-Bench、HLE 高难任务仍有差距）；Simon Willison 实测默认推理档画自行车鹈鹕 SVG 想了 21 分钟（"想太多"特质，用时间换能力）；4-bit 量化石权重 ~17GB，24GB 级显卡可部署，长上下文吃内存；128GB 级 Apple Silicon 可运行。
- Pandaily 英文口径（2026-08，与品玩互洽）：同一组数字的英文版本。
- Orca Router 博客（2026-08-17）：GGUF 量化分档（Q4_K_M 16.8GB / IQ4_XS 15.3GB / Q3_K_M 13.5GB）、Ollama 三命令导入、abliterated 变体说明。**仅用于说明本地部署的现实路径，不要引用其评测立场（该站是 API gateway 厂商，有立场冲突）。**
- 网易科技（2026-08）：阿里开源 27B、编程能力超 Qwen3.7-Plus 口径；海外下载超 300 万次、槽点"想太多"。**仅作趋势佐证，不作为关键论据。**

### 云端 token 通胀背景（2026-08）
- DeepSeek 8 月中完成成立以来最大幅度提价：V4-Pro 高峰时段输出 6 元 -> 27 元/百万 token，同步引入峰谷计费（品玩，2026-08）；智谱、Kimi 此前相继调价。
- 国内日均 token 调用量站上 140 万亿，较 2024 年初增长超 1000 倍（品玩，2026-08）。
- 一个 coding agent 单任务几十万 token 已常见（品玩，2026-08）。

### 模型经济学背景
- "斩杀线"概念迁移：DeepSeek（R1 起，云端性价比）-> Qwen3.8-27B（27B 尺寸压进旗舰能力区间）。行业新指标：智能密度（每十亿参数装多少能力）。
- MoE 路线在个人设备上的困境：专家不工作不代表专家不存在，总权重仍需驻留（品玩技术段）。

### 前文（系列内证据，非外部源）
- 2026-08-19 teardown：harness 决定 completion/cost/audit；44 事件类型 3 可见；own your skills。
- 2026-08-26：178 绿测试未捕获 loader 故障 -> 模型 margin 越小，gate 密度越要高的论证支点。
- 2026-09-02：首轮 envelope 92% 是 tools/skills -> 本地栈中 envelope 的"账单"消失但"纪律"仍在。

## 可用案例

1. 本会话 = 案例本体（自指）。gate 拦截、claim ledger 排除错误论断、事实核验修正日期 —— 都是 27B 模型 + gate 系统的直接产物。
2. Cline 开发者选择数据（二手）：本地模型第一次成为"默认被选选项"而非实验项 —— 交叉点从观点变成行为数据。
3. DeepSeek 提价 + 峰谷计费（二手）：云端价格的结构性上涨证明"线画在报价单上就会跟着报价单移动"——本地是第二条定价曲线。

## 主要反方观点

1. **自指偏差（最硬）**：我评的是我自己的栈写的稿子。应对：利益冲突写进正文；收据全部版本锁定（rc.8 commit、model id、机器 spec）；gate 是敌对性的（扫描器会骂，ledger 会排除，fact-check 会改）。
2. **工作类别挑选**：我挑了 27B 已经够用的类别。应对：接受——交叉点是 per work class 的，不是 per model 的；正文给三问决策表 + 不迁移类别清单（高难推理、长时程代码库级重构、需要最高 ceiling 的一次性任务）。
3. **硬件成本不是零**：128GB 统一内存有购置价。应对：这正是论点本身——摊销 vs 经常性。决策是成本结构对比，不是"免费 vs 收费"。
4. **27B ≠ 追平前沿**：HLE/Terminal-Bench 差距是真的（品玩自认）。应对：正文不 claim 追平，claim 的是"日均可执行工作类别"已越线。

## 关键事实与引用（进入正文的）

- F1 本机栈: DSH 0.1.0-rc.8 + Ollama + hf.co/unsloth/Qwen3.8-27B-GGUF:Q8_0, M5 Max 128GB（一手，2026-08-21 核验）
- F2 DSH rc.8 发布 2026-08-19，repo 12,940 commits（2026-06-10 起）（一手核对）
- F3 Qwen3.8-27B 2026-08-14/15 开源；两天破百万下载；#1 HF trending；Cline 4 天成 top local；AA Index 52（品玩/Pandaily，2026-08，带日期）
- F4 DeepSeek V4-Pro 峰值输出 6->27 元/MTok + 峰谷计费（品玩，2026-08）
- F5 Qwen3.8-27B 高难任务差距与"想太多"特质（品玩 + orcarouter，2026-08）
- F6 单任务几十万 token 为 coding agent 常态（品玩，2026-08）
- F7 本会话流程收据：57-skill 目录、事件日志、gate 行为（一手，本次会话）

## 开放问题

- Qwen3.8-27B 发布时间 8/14 vs 8/15 各源口径不一（品玩: 8/14；orcarouter 列表: 08-13 free 版 / 08-15）。正文用"8 月中旬"或明确标注口径，不当精确事实用。
- "Cline top local model" 无第一手 API 数据，口径来自二手；置信 medium。
- 本会话 token 总量（本地栈无 meter，无法直接出账单；可参考 envelope 结构但不宣称"X token 免费"）。

## 文章应保留的判断

- 本地 vs 云端不是能力之争，是成本结构之争：经常性（invoice 永远来）vs 摊销（purchase 只来一次）。
- 27B 越线改变的不是"能跑多聪明"，是"什么钱不再是钱了"——agent 工作的边际成本归零后，harness 的 gate/memory/audit 从"工程细节"变成"质量来源"。
- 自指不是瑕疵：生产机器 = 文章对象，是把利益冲突做成证据的唯一诚实方式。
- 交叉点 per work class：给读者可执行的三问表，不给"一切皆可本地"的结论。
