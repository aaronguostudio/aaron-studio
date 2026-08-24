# Prose Polish Review — Your Prompt Is Not the Request

## 修改目标

让文章像一次真实的桌面实验，而不是一篇 API 价格说明或“AI agent 很复杂”的泛泛评论。语言层只增强 hook、节奏和边界提示，不改变 thesis、实验范围或证据强度。

## 英文润色重点

- 保留开头的一句 no-tool prompt 和三张 receipt，避免用抽象定义开篇。
- 在最早位置写出 `Even input_tokens was not a universal noun.`，把方法学限制变成读者能感到的惊讶。
- 用 backpack / menu / room 三个日常比喻承载 context、deferred discovery、default surface；每个比喻后都回到具体产品机制，避免文学化漂移。
- 将长的 telemetry 说明压进 “what I refuse to infer” 表，正文不堆字段或精确数值。
- 结尾保留强判断：不是追求最小 request，而是让默认能力为完成任务的收益证明自己。

## 中文润色重点

- 将 `vendor comparison` 改为“厂商横评”，去除不必要的英文 business 词。
- 去掉机械的“最后”式连接，改用更直接的句序。
- 保留 `prompt`、`request`、`cache`、`harness` 等在语境中更自然的技术词，但普通概念优先中文化。
- 让“空项目，不等于空 agent”“整张菜单先别端到桌上”等句子承担节奏，不新增夸张结论。

## 保留不改的地方

- DSH 没有 live model request 的限制被保留在开篇和结尾，不能为了更流畅而弱化。
- Claude bare mode 的 `not run` 结论被保留，不能将认证前失败改写成零 token 数据。
- 三家 CLI 的本机观察不公开私有 hooks、connector、session ID、路径或 credential。
- provider API 文档与本机 CLI 行为仍然分开写。

## 风险与边界

- 文章的可读性来自比喻和结构，不来自把四家产品的 usage 字段硬归一化。
- 这是一篇可发布的 field-note draft，不是可发布的数字 benchmark。五次串行 H1 和单独的 H2 stateful cohort 仍是后续研究条件。

## 验证结果

- English style gate: pass, 100/100, 0 slop markers.
- Chinese style gate: pass, 100/100, 0 slop markers.
- No new source claim or external link was added during this polish pass.
