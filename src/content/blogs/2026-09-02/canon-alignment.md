# Canon Alignment

## 文章当前判断

每个 agent run 在接到任务前已经加载一套 operating system。它的固定 footprint 可以测量，cache 只能折价不能消除。读者应该用“每个成功任务的未缓存输入”评估 stack，而不是把 token usage 归因于 prompt 长短。

## 与旧文章的呼应

- 呼应 `Fable 5 Changed the Unit of AI Work`：unit 从 response 变成 run；本篇给 run 的启动成本一个可测数字。
- 呼应 `I Gave Codex a Task From a Moving Tesla`：AI operating system 不是比喻，它以 system instructions、workspace context、tools 和 plugins 的形式真正进入首轮 request。
- 呼应 `What I Learned From DeepSeek's Harness`：harness 决定 cache 是否命中；本篇把上一篇结尾承诺的 first-request bill 实测出来。
- 呼应 `Expensive Tokens Won't Save Enterprise AI`：token 是投入，不是价值；所以最终分母必须是 successful completed task。

## 观点升级

1. Portable asset 不等于 free asset。Skills、instructions、decision records 值得拥有，但 eager catalog 有持续 carrying cost。
2. Cache discipline 不等于 context efficiency。稳定前缀省钱，deferred loading 才缩小初始 footprint。
3. “budget a run”升级成“itemize boot, reuse, and fan-out”。成本控制从限制总 token 变成定位架构层。
4. 不再把 skills 当默认最大成本。Aaron 自测显示 core harness 约占 full median 的 73%；这纠正了 idea.md 受 DSH 个案影响的预设。

## 需要避免的惯性

- 不要再次大段解释 DSH 架构；上一篇已经做过。
- 不要把个人 blog workflow 当 enterprise 论据。个人 stack 只用于直接实测，行业价值由 provider 官方 tool-context 机制支撑。
- 不要把所有问题收束到 ACTOR；本篇已有一个更贴题的三项测量规则。
- 不要重复“not X but Y”句式，也不要创造“context tax triangle”之类标签。
- 不要把 portable skills 写成负资产；真正问题是 eager delivery mechanism。

## 可以加入的 Aaron 判断

- “我原本以为自己的 skill catalog 会是最大项。实验反而显示，四分之三的首轮已经在我加载任何项目能力之前发生。”这是自测带来的观点变化。
- “一个 capability 若默认出现在每个 session，就不只是功能；它是一项 recurring architecture expense。”
- “Cache hit 是账单优化，tool discovery 是产品架构。两者不能互相替代。”
- “我不会按 token 最小化我的 stack。我会要求每一块默认 context 证明它提高成功率或减少后续工作。”

## 站内链接建议

1. 必须链上一篇 `/blogs/deepseek-harness-teardown`，完成系列承诺。
2. 在 fresh sessions / run budget 处链 `/blogs/fable-5-managing-ai-autonomy`。
3. 在 workspace operating system 处链 `/blogs/ai-became-my-operating-system`。
4. 若结尾已有三条内链，不再强加 deployment article；避免 self-citation 过重。

## Alignment Decision

PASS FOR OUTLINE。文章推进了旧观点，并由 Aaron 自测纠正了原始预设。进入 outline 前必须保留两个边界：不把 gross tokens 写成 subscription dollar bill；不把最低 first-request footprint 写成最终目标。
