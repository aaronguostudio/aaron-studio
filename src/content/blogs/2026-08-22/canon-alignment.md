# Canon Alignment

## 文章当前判断

"感觉"不是情绪而是结构：DSH + V4 Pro 让模型"长出身体"（可编程工具面 / 可加载技能 / 跨轮状态 / 只追加日志），工作单位从 answer 变成 job；操作者从"读答案"转向"看状态"，稀缺技能从写 prompt 移到握状态 + 判工作。

## 与旧文章的呼应

- **deepseek-harness-teardown**（08-19）：harness 决定 completion/cost/audit；"keep models swappable, invest in the asset layer"。本篇是它的体验层：拆解文读规则手册，本篇坐进机器。**必须内链。**
- **local-crossover-point**（08-21）："the environment is what you buy" + 自指收据。本篇接"machine around the model"，但切面不同：本地文讲机器如何补偿弱模型，本篇讲机器如何改变工作单位（即使配强模型）。
- **fable-5-managing-ai-autonomy**（06-15）："unit of AI work = run"。本篇把它从分析命题变成体感命题。
- **ai-made-process-cheaper-judgment-is-still-expensive**（08-26）：process cheap / judgment expensive。本篇诚实层直接引用。
- **ai-became-my-operating-system**（06-20）：委托一个任务、看状态推进的早期形态。

## 观点升级

- "asset layer"从"技能/指令文件"扩为"身体四件套"：工具面、技能、状态、日志——四者都可携带、都随模型替换而保留。
- "harness is the product"从分析结论变成操作方式：不是"你要买 harness"，而是"你要学会看它的状态"。
- 升级但不推翻：模型仍可换（rent/churn/own 不动），本篇只新增"身体是资产"这一层。

## 需要避免的惯性

- 不重复 DSH 架构拆解（teardown 已做）——只引用其存在与结论。
- 不变成 benchmark 评测 / 部署教程（orcarouter、ai-indeed 的地盘）。
- "身体"不能停在隐喻——必须拆成四件套并各自给出"它买到了什么"。
- 不自指过度：系列内链最多 3-4 条，且服务于读者任务。
- 不暗示"harness 让模型更聪明"或"系统自我提升"（反 self-improving 规则）。
- 反方段落必须有可见来源（Ronacher / jiayuan_jy / 中文实测 / DSH 自己文档的 timeout 事实），不放抽象怀疑者。
- 直接陈述优先，不自造标签（2026-08-15 修订教训）。

## 可以加入的 Aaron 判断

- 操作规则："交给 agent 一个任务后，看它的状态，别只看它的文章。"
- 投资顺序："模型可换，身体可携带；资产层（四件套）比模型更值得投资。"
- 诚实层："harness 让失败也规模化——正因如此，看状态才从可选项变成必选项。"
- 利益冲突声明放正文（Part 4 或邻近），不是 footnote。

## 站内链接建议

1. /blogs/deepseek-harness-teardown（必须，系列锚点）
2. /blogs/local-crossover-point（环境/购买命题，轻）
3. /blogs/fable-5-managing-ai-autonomy（run 单位，轻）
4. /blogs/ai-made-process-cheaper-judgment-is-still-expensive（判断力诚实层，轻）

## Alignment Decision

PASS —— 承接 DSH 系列"模型外面决定一切"的判断，并把它从 anatomy/economics 推到 phenomenology/operations；不推翻任何既有框架；"身体四件套"是 asset-layer 的自然扩展而非新造标签；自指角度是新贡献且已在正文处理。
