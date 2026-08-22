# Prose Polish Review

## 修改目标
- EN: 在审计段收紧一处绕句（"the visibility is the product" -> "the log is the vendor's product"），意思不变，只提清晰度。
- ZH: 去掉"全宇宙"的过度夸张，改成与 EN 对齐的"唯一存在的收据"。
- 不做结构性改动；不加事实、不加链接、不改变论点。

## 英文润色重点（已执行）
- Audit 段落末句重写：原句把"visibility is the product"说得像抽象口号；改写后主语落到 log 上，"vendor's product"承接住商业含义。
- 其余保持不变：开头瓶颈句、No cloud tokens. No meter. 断句、section 2 的数据列举节奏、Part 6 的三问 + one-hour 验证，均已在深度/红队阶段达到 Aaron 节奏，不再改。

## 中文润色重点（已执行）
- "全宇宙唯一的收据" -> "唯一存在的收据"（夸张度与 EN 对齐，避免标题党口吻进入正文）。
- 保留自然术语：agent、harness、meter、token、gate、skill、memory、log、append-only、GGUF、benchmark、per work class、slop、crossover —— 符合 Aaron 日常中文表达习惯。
- "绿的测试" 保留（中文 dev 语境自然）。
- 不逐词消灭英文；长句节奏符合中文 operator 文体。

## 保留不改的地方
- 标题 "I Stopped Renting Intelligence" / "我停止租用智能"：直接陈述，无自造标签。
- Part 4 自指段的对抗性语气（"I will not argue against it" / "我不打算反驳"）。
- 结尾规则句与前段 CTA 的顺序（扫描器 payoff 依赖结尾 900 字窗口，结构已锁定）。
- 所有带源归因句（per the coverage in pingwest and pandaily / 按品玩和 Pandaily 的报道）。

## 风险与边界
- "no cloud vendor gives you" 是普遍化表述，但语境限定在"逐行可读的生产日志"，且 claim ledger 已记录该判断为 authorial framing；不在润色中扩大也不收窄。
- ZH 保留 "meter" 不译：与 EN 对齐，且 Aaron 词库中该词自然。

## 验证结果
- EN gate: 100/100 pass（red-team 修订后，本 pass 前后各跑一次）。
- ZH gate: 100/100 pass（zh language 模式）。
- 无新增事实、无论点变化、无新链接。
