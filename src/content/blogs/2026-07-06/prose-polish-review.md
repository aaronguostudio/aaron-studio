# Prose Polish Review

## 修改目标

这次不是重写文章，而是按 2.1 做一次表达层收口：

- 让标题“Expensive Tokens Won't Save Enterprise AI / 昂贵的 Token 救不了企业 AI”在开头更快兑现；
- 强化文章和 Aaron 旧文里的 owner、boundary、evidence、memory 这条线；
- 保留文章现在的论证结构和 source-backed claims，不新增事实；
- 避免把文章磨成通用 enterprise AI 评论。

## 英文润色重点

- 开头加入 “measurement trap”：token spend、model access、usage charts 都容易汇报，但不能证明 work changed。
- 在四家公司新闻之后加入一句判断：如果问题只是模型接入，公告会围绕 inference、context window、API tiers；但现在它们指向 deployment organizations。
- 在技术人段落里，把 `The One-Person Project` 的 owner/boundary/evidence 逻辑升级到企业语境：deployment-native engineering 是把客户现场的混乱转成 boundary、evidence 和 learning loop。
- 将 ACTOR 的 R 从 `Recursive ownership` 收口为 `Recursive`。框架标签保持单词级别一致，ownership 放进解释句里承载企业读者关心的责任边界。

## 中文润色重点

- 中文开头不做英文直译，而是用“衡量陷阱”直接承接标题。
- 保留 `token`、`usage chart`、`workflow`、`context` 等自然技术词，不强行翻译。
- 将略硬的 “API quota / deployment organization” 调整为“API 配额”和“deployment organization 这种能力”，让中文读起来更顺。
- 将负面业务语境里的“张力”改成“落差”。这里不是创造性拉扯，而是企业对 token 消耗、模型访问和 demo 无法转化成 operating value 的不匹配感。

## 保留不改的地方

- 没有改变 FDE 和 consulting 的关系判断，因为原稿已经足够平衡。
- 没有继续增加 Karp / Palantir 的比重，避免文章变成 Palantir 视角。
- 没有新增站内链接，现有三条已经覆盖 AI operating system、one-person project、return distance。
- 没有重写 ACTOR 的结构。只调整 R 的命名颗粒度，让它更像一个可传播、可执行的 framework，而不是管理学口号。

## 风险与边界

- 新开头更有冲突感，但不能变成“企业浪费钱买 token”的情绪化批判；正文仍然要回到 deployment capability。
- “deployment organization” 在中文里仍然是英文术语，但这里保留有意义，因为文章面对的是技术/企业运营读者。
- 这次 polish 没有新增事实、数字、案例或外链。

## 验证结果

- English style/story gate: passed, 100/100.
- Chinese style gate: passed, 100/100.
- 新增中文词义校准规则：负面业务语境里的“张力”会被 scanner 提醒。
- 新增方法论命名校准：ACTOR 这类 acronym framework 的标签要保持同一颗粒度。
- 后续最终验证会重新跑一次中英文质量门和 workflow 测试。
