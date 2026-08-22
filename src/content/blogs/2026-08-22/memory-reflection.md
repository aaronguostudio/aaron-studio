# Memory Reflection

## 相关旧文（及为何相关）

1. **deepseek-harness-teardown**（08-19）— 拆解文，建立了"harness 决定 completion/cost/audit"的判断，结论是"keep models swappable, invest in the asset layer"。本篇是其体验层补充：拆解文读规则手册，本篇坐进机器。**必须内链**。
2. **local-crossover-point**（08-21）— "the environment is what you buy" + 自指式生产收据。本篇接它的"machine around the model"命题，但换一个切面：本地文讲"机器如何补偿弱模型"，本篇讲"机器如何改变工作单位（即使配强模型）"。
3. **fable-5-managing-ai-autonomy**（06-15）— "unit of AI work shifted from response to run"。本篇把这个判断从分析命题变成体感命题。
4. **ai-became-my-operating-system**（06-20，"I Gave Codex a Task From a Moving Tesla"）— 委托一个任务、看状态推进的早期版本；本篇是其 harness-native 形态。
5. **ai-made-process-cheaper-judgment-is-still-expensive**（08-26）— "process cheap, judgment expensive" + 178 green tests。本篇的反方/诚实层直接引用它。
6. **one-person-project-ai-coding**（07-01）— owner 持有 context、agents 执行。本篇的"watch the state, not the prose"是它的操作口诀。

## 可复用的想法

- "unit of work = run" → 转译为"unit of work = a job you hand off end-to-end"。
- "harness is the product" → 转译为"the model's body is the product you interact with"。
- 自指收据手法（local-crossover 用过）→ 复用但换证据：这次是"我只能直接调 run_code"这一手事实。

## 需要更新的想法

- 无推翻项。但把"asset layer"从"技能/指令文件"扩为"body 的四件套"：工具面、技能、状态、日志——四者都可携带。

## 内部链接候选

1. /blogs/deepseek-harness-teardown（必须，系列锚点）
2. /blogs/local-crossover-point（环境/购买命题）
3. /blogs/fable-5-managing-ai-autonomy（run 单位）
4. /blogs/ai-made-process-cheaper-judgment-is-still-expensive（判断力诚实层）
5. /blogs/ai-became-my-operating-system（委托/看状态，轻）

## 连续性论点

DSH 系列已经回答了"harness 决定什么"（teardown）和"你买的是什么"（local）。本篇回答第三个、也是最直觉的问题："用它是什么感觉"——并把"感觉"拆成可复用的结构，把"harness is the product"从分析结论变成可操作的工作方式。生产机器 == 讨论对象，自指收据贯穿全文。
