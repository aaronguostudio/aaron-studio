# Prose Polish Review

## 修改目标

在不改变论点、事实、来源和结构的前提下，检查开头拉力、段落节奏、中英文自然度、术语密度与结尾力度。只做一轮限定语言修订。

## 英文润色重点

- 英文初稿与红队修订后已通过 100/100 style/story gate。
- 开头从两个交付物进入，六段内给出 `surface area vs scar tissue` 和 control-plane 判断，节奏自然。
- 保留短句与长段落交替，不进一步“抛光”，避免失去 operator 语气。
- 保留 `vendor analysis`、`visible demo`、`not a controlled benchmark` 等证据边界，不为追求流畅而删除限定语。

## 中文润色重点

- 删除扫描器标出的“其次/最后”机械连接词，改成更具体的动作顺序或自然承接。
- 把 `vendor` 翻译为“厂商”，并把 `synthetic data`、`evaluation sets`、`permission rules`、`audit history`、`runbooks` 改成更自然的中文表达。
- 把 `business operations` 与 `content creation` 分别改为“业务运营”与“内容生产”，减少无必要的中英混排。
- 保留 AI、agent、workflow、context、skills、pilot 等符合 Aaron 日常表达的技术词，不逐词汉化。

## 保留不改的地方

- 不改标题、四层框架、产品判断和选择建议。
- 不改截图、链接、时间点、数字和厂商声明的限定方式。
- 不把中文改成正式报告体；保留“伤疤”“把 run 弄坏”等直接表达。
- 不新增事实或案例。

## 风险与边界

- ChatGPT Work 的观察窗口仍只有一天，语言不能暗示长期稳定性。
- Cowork 的社区事故与配额抱怨仍是案例/摩擦，不升级为总体可靠性结论。
- 中英文是 sibling editions，句序和术语允许自然差异，但 claim set 保持一致。

## 验证结果

- English style/story gate: PASS, 100/100 before and after scoped polish.
- Chinese style gate: initial FAIL, 66/100 due to mechanical transitions and avoidable `vendor` code-switching.
- Chinese revision removed all flagged phrases; final style gate: PASS, 100/100.
