# Canon Alignment

## 文章当前判断

Harness 而非模型决定 AI 工作能否完成（Composio 同模型 7 倍成本差为证）；DeepSeek 把 harness 以 MIT 开源并系统性采用对手格式，说明模型公司不再把这层留给别人；builder 的应对是三层资产测试——rent the model / expect the harness to churn / own your skills and evidence。文章收在框架上，不收在对 DeepSeek 的评价上。

## 与旧文章的呼应

- **2026-07-06《Expensive Tokens Won't Save Enterprise AI》**：本文是它的直接续集。7 月说"稀缺能力是 deployment 不是 model access"（当时的证据是四家砸 $7.5B 建 FDE 组织）；8 月 DeepSeek 用"把 deployment 层做成产品白送"再次确认。前判在先、证据在后，连续性是真实的，文中应明说而不是谦虚地埋掉。
- **2026-06-15《Fable 5 Changed the Unit of AI Work》**：那篇的结尾判断——"稀缺技能不再是写最聪明的 prompt，而是设计让 run 有边界、可检查、可逆的 operating contract"——本文 Part 2 定义 harness 时应直接续接：**harness 就是 operating contract 的产品化形态**。这个呼应比泛泛的"unit of work"更准，建议写进正文。
- **2026-07-01《The One-Person Project》**：AI 改变成本结构 → 团队协作单元重组，那篇的论证形状（成本结构变化倒逼组织形态变化）与本文同构（harness 商品化倒逼资产策略变化）。链接可选，不强求。
- **blog-memory canonical ideas**：#1（deployment capability > model access）被直接升级；#2（token 消耗不等于价值）在 Composio 的"每成功任务成本"指标里有天然呼应——他们量的就是 outcome 成本而不是 token 量，可一句带过。

## 观点升级

- **Deployment 论点从服务层升级到基础设施层**：7 月的证据是"AI 公司在买人"（FDE 服务），本文的证据是"AI 公司在送软件"（harness 产品）。两者不矛盾——同一层的两种形态——但要点名这层关系，否则读者会问"上个月你说答案是 FDE，这个月怎么变成 harness 了"。一句话即可：服务是 deployment 能力的人肉形态，harness 是它的产品形态，厂商两头都在下注。
- **"Workflow must belong to the customer" 升级为 "assets must belong to the builder"**：7 月文讲企业要持有 data contracts、evaluation sets、runbooks；本文把同一逻辑降到个人 builder 尺度——skills、指令文件、证据回路。这是同一价值观在新尺度上的应用，值得在 Part 6 用一句话点破，形成跨文章的一致立场。
- **依赖反转作为竞争武器**是全新增量：7 月文警告 vendor lock-in 的危险，本文展示了反向操作——DeepSeek 主动采用对手格式，让"锁定"失效。这是 canon 里没有的新观察，是本文对长期思想库的净贡献。

## 需要避免的惯性

- **不要硬塞 ACTOR**：ACTOR 是 deployment 检验框架，本文的框架是 rent/churn/own（资产配置视角）。两者不同 job，强行引用 ACTOR 会变成自我引用，稀释新框架。如果一定要提，最多在 Trust/Outcome 维度与 harness 质量的关系上一句带过，倾向于不提。
- **不要滑向 news summary**：kill criteria 已写明。英文世界已有 The New Stack 等 news 覆盖，"发生了什么"一节（Part 3）必须压在 150 词以内，重心永远在 Part 4 的仓库验证和 Part 6 的框架。
- **不要借花叔的热句**：中文圈"四注赌局"等表述传播很广，本文的战略解读必须用自己的三词概括（格式投降/诚实子集/本体收编，英文对应 format surrender / honest subsets / rival absorption），引用花叔只在他独有的实测事实上，并署名。
- **不要把"7x"讲成普适排名**：argument-memo 已定"只取分布宽、拒绝排名"，写作时警惕标题党惯性把 7x 绝对化——数字必须始终和 Composio 的自注缺口同框出现。
- **警惕"self-improving"惯性**（blog-writing-language.md 专门有戒条）：Part 6 讲 evidence loops 时不要暗示"有了回路就自动变好"——回路里谁发现学习信号、如何写回，一句话交代清楚。

## 可以加入的 Aaron 判断

- "我 7 月写下 deployment 论点时，证据是四家公司在买人；五周后 DeepSeek 给了产品形态的确认"——前判的自信陈述（第一人称、有日期、可验证）。
- "harness 是 operating contract 的产品化"——续接 Fable 5 文的原创衔接句。
- "当竞争对手采用你的文件格式，你用户的资产就变成了可携带的——可携带性是双向的刀"——依赖反转的 Aaron 式表述（已在 standalone tweet brief 里，正文也该有）。
- "盘点你的 AI 资产：可携带的一列，被锁定的一列——这份清单就是你在这场战争里的仓位"——可执行的收尾动作，符合"操作者框架"传统。

## 站内链接建议

1. **必加**：Part 1 或 Part 3 提及 deployment 论点处 → `/blogs/why-ai-companies-are-becoming-deployment-companies`（锚文本用论点本身，不用"我之前写过"式自指）。
2. **建议加**：Part 2 定义 harness / operating contract 处 → `/blogs/fable-5-managing-ai-autonomy`。
3. **可选**：Part 6 谈资产归属若引用"成本结构变化倒逼形态变化"的论证形状 → `/blogs/one-person-project-ai-coding-v2`；若行文不自然则舍弃，两条链接已足够。

## Alignment Decision

**PASS，带三条执行要求**：(1) Part 2 必须落"harness = operating contract 产品化"的衔接句，这是本文与 canon 最有价值的连接点；(2) Part 3/4 之间加一句服务形态 vs 产品形态的关系交代，消除与 7 月文的表面矛盾；(3) ACTOR 不进正文。文章的新框架（rent/churn/own）与新观察（依赖反转）是对 canon 的净增量，发布后按 memory update gate 更新 blog-memory.md 与 canon-note.md（canonical idea #1 升级 + 新增 reusable frame）。
