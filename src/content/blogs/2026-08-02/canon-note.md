# Canon Note

## Canonical Idea

AI 代码的最低审查深度，不应由代码是谁写的或 diff 有多少行决定，而应由它有权改变什么决定。越接近关键系统或 system of record，人类理解越必须从结果与测试下沉到系统模型、恢复路径和关键源码。

这篇文章为 Aaron canon 新增了一个明确区分：

- **Critical system** 由失败后果定义。
- **System of record** 由事实权威定义。

两者经常重合，但要求深入审查的机制不同。对权威状态，回滚代码未必能恢复已经传播的数据、审计轨迹、下游行为与信任。

## Reusable Frame

### Review Depth Ladder

先用四个问题路由：

1. **Authority**：代码可以改变什么？谁会把输出当成事实？
2. **Exposure**：谁继承后果？错误能传播多远？
3. **Recovery**：能否恢复状态，而不只是回滚代码？
4. **Independence**：证据是否带来不同的方法、数据、系统或人类 owner？

再决定最低层级：

- **L1 Outcome**：私有、隔离、可丢弃、非权威。
- **L2 Evidence**：已有他人或流程依赖，但影响有限且可恢复。
- **L3 System Model**：能够改变重要共享行为、生产状态或 system of record。
- **L4 Critical Source Path**：能够制造权威事实或不可接受后果的关键路径。

层级累积，分类会过期。临时工具一旦共享、持久、提权或成为权威来源，最低审查层级自动上升。

## Claims Added

- 审查的单位不再只是 diff，而是一项修改如何成为事实的整条路径。
- 证据数量不等于证据独立性；同一 context 生成的实现、测试和审查可能共享盲点。
- 不同 prompt 本身不构成独立证据。更强证据来自不同方法、数据集、系统观测、业务不变量或具名人类 owner。
- 对 Aaron 的工作，关键系统和 system-of-record 修改最低进入 L3，关键写路径通常进入 L4。
- 权威写入需要明确 release rule：具名领域负责人、已审关键路径、明确业务不变量、可信的数据核对与恢复方案。

## Claims Updated

- **旧判断：** AI compresses work, but it does not compress responsibility。  
  **更新：** 当 review 成为稀缺资源，责任必须进一步变成可执行的 review allocation。
- **旧判断：** boundary 和 evidence 让 agent speed 可信。  
  **更新：** boundary 还需要拆成 authority / exposure，evidence 还需要检查 independence。
- **旧判断：** rollback 是 agent operating contract 的基本要素。  
  **更新：** 对权威状态，rollback 代码可能不够，还需要 reconciliation、compensation 和下游修复。
- **旧判断：** 不亲手写每一行仍需理解代码。  
  **更新：** 理解不等于平均逐行阅读；低风险工作可以停在更高抽象层，关键路径必须下沉。

## Internal Link Map

- `/blogs/one-person-project-ai-coding` → generation throughput、review bandwidth、AI 不压缩责任。
- `/blogs/ai-became-my-operating-system` → 执行可以分布，高判断力工作必须回来。
- `/blogs/fable-5-managing-ai-autonomy` → authority、evidence、checkpoints、stopping conditions、rollback 的 operating contract。

不链接 draft 版本 `one-person-project-ai-coding-v2`，也不强行加入 Scatter / Laser，避免让 Review Depth Ladder 看起来只是旧框架改名。

## Future Branches

- 如何为 AI agent 设计 system-of-record write policy。
- 什么才算 agent workflow 的独立证据。
- AI 时代的 release policy：按 change class，而不是按作者身份。
- 为什么资深工程师可以少读部分代码，但 junior 培养不能复制同一黑箱策略。
- Rollback、reconciliation 与 compensation 在 agentic systems 中的区别。
