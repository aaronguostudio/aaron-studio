# _archive — Evidence Layer

原始证据层。Digital twin 的 ground truth。

## 目的
保存 raw context（截图 OCR、原文、meeting notes、重要对话），让解读层（`world/people|projects|themes`）的 observations 可以被回溯验证。

## 为什么这样分层
- **解读层可演化** — `world/people/alex.md` 里的 observation 可以随情况变化而重新判断
- **证据层不可变** — `_archive/` 里的原文和当时的 GG interpretation 永远保留
- **三个月后你问"Justin 当时原话是什么"时，GG 能直接给出原文**
- **防止 GG 的偏见被当作事实** — 每个结论都可以追溯

## 结构
```
_archive/
├── README.md
└── YYYY-MM-DD/
    ├── <source>-<slug>.md
    └── ...
```

文件名约定：`<source>-<brief-slug>.md`
- Source 示例：`justin`, `alex`, `nova-meeting`, `chintan`, `keri-1on1`
- Slug：简短描述性，kebab-case

## 文件格式
```markdown
# <Title>

**Date:** YYYY-MM-DD
**Source:** [Teams post / Screenshot from Aaron / Meeting notes / Direct message / 1:1 debrief]
**Captured by:** GG from Aaron's share
**Related:** [[people/X]], [[projects/Y]], [[themes/Z]]

## Raw Content
<原文 / OCR 结果 / meeting notes>

## Context
<为什么保存，发生时的情境，当时的政治/项目状态>

## GG's Interpretation (at time of capture)
<GG 当时的解读。固定下来作为 snapshot。未来重读可以对比认知演化。>

## Follow-up
<后续是否有相关事件，ref 到新的 archive 条目>
```

## 什么进 archive
- ✅ 截图里的实质内容（OCR 成 text，不存图片）
- ✅ 团队重要对话（Teams post、会议记录、Slack 讨论）
- ✅ 1:1 debrief（Aaron 告诉 GG 的会议后总结）
- ✅ 决策时刻的原始 context
- ✅ 关键人物的 direct message / 行为
- ✅ 公开发言、演讲、政策变化

## 什么不进
- ❌ 随手聊天 / 日常 standup
- ❌ 纯表情包 / 无实质内容
- ❌ Aaron 的情绪发泄（进 daily note）
- ❌ 重复内容

## OCR 约定
截图内容以 OCR 文本保存，不存原图。原因：
1. Token 效率 — GG 读 text 比 read image 便宜很多
2. Grep-able — 文本可搜索
3. Git-friendly — 不污染 diff
4. 隐私 — 图像可能包含周边 UI 信息

如果原图对 future context 必要，可在 metadata 里注明 `ImageAvailable: true` 并单独存到 `_archive/_images/` (gitignored)。

## 引用约定
解读层（world/people/*.md 等）的 Observations timeline 使用 ref 指向 archive 条目：

```markdown
## Observations Timeline
- 2026-04-09: Shared Bezos "squiggly lines" piece — narrative armor for execution failure
  ref: [[_archive/2026-04-09/alex-bezos-squiggly-lines]]
```

## 维护
- 过去 6 个月 + 低关联度的条目 → `_archive/old/YYYY/`
- 月度 review INDEX，必要时重新归类
- 永远不删除 — archive 是历史，历史不可擦除
