# agent 主循环与事件模型（turn/step、inbox、三事件域、waterfall、取消恢复、"一切皆插件"的守护机制）

这个子系统是 DeepSeek Harness 的驱动核心：packages/core/agent 声明公共 Agent 契约（handle、inbox、agent/* 事件词汇表），packages/core/agent-loop 提供唯一具体实现 ReactLoopAgent（约 500 行驱动 + 300 行工具调度 + 700 行生命周期）。它解决的问题是：如何在"一切皆插件、loop 本身可替换"的前提下，让压缩、plan mode、hooks 桥、subagent、上下文注入等十几种扩展都不用改循环代码。答案是三件事的组合：一个持久化的双队列 inbox 统一所有输入路径；一个 agent/pre-step waterfall 作为"模型看什么"的唯一裁决点；以及"model-visible ⟺ logged"这条用运行时断言强制执行的事件溯源不变式——每个模型请求都必须能从 session log 逐字重建。turn/step 的切分（turn = 零或多个 step，step = 一次模型请求 + 其工具调用）让 turn 成为纯粹的会话边界记账，step 成为扩展点挂载的节奏单位。

## 双队列 inbox：用 (target, wakeup) 两个正交维度统一三种输入原语

机制：Agent 只有一个底层入口 send(message, target, wakeup)（agent.ts:113-120）。target 是两个有序队列之一：next-turn（每条消息独占一个 turn）或 next-step（在最近的 step 边界被批量消费）。wakeup 决定是否唤醒空闲 driver。三个公开原语是固定组合的别名（agent.ts:122-132）：followup = next-turn + 唤醒（普通追问）；steer = next-step + 唤醒（转向：running 时在下个 step 边界插入，idle 时开新 turn）；inject = next-step + 不唤醒（注入上下文：躺在 inbox 里等别的消息唤醒 driver，自己不触发模型调用）。claim 语义（inbox.ts:71-78）：每次 step 边界取走全部 next-step 消息，仅在 turn 边界额外取一条 next-turn 消息——这保证'一条 followup 一个 turn'，而 steering/注入搭乘当前 turn 的顺风车。更关键的是 inbox 是持久投影：每次插入/删除/claim 都先落 agent/inbox/spliced 会话事件再改内存（inbox.ts:186-192 明确 durable event 先于 live mutation 提交），构造函数从日志重放恢复（inbox.ts:32-40），所以未消费的输入能跨进程重启存活。

证据：/Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/agent.ts:113-132; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent/src/inbox.ts:32-40,71-78,186-192; /Users/aaronguo/Work/lab/deepseek-harness/docs/architecture.md:86

价值：大多数 agent 框架把'用户追问'、'mid-run 转向'、'系统注入上下文'做成三条互不相干的代码路径，各自和取消/持久化打架。这里用一个 2x2 矩阵（去哪个队列 × 是否唤醒）把三者压成同一条 claim 路径，让 steering 和注入自动经过同一个 pre-step 裁决点。'inject 不唤醒'是精确的产品语义：上下文本身不值得花一次模型调用，等有真正的工作时捎带上——文档还诚实地写明竞态语义：'它可能错过一个 pre-step 已经 claim 过批次的请求'（core.md:137），把竞态定义成契约而不是假装不存在。

## turn/step 切分：turn 是记账边界，step 是扩展节奏；空 turn 也落日志

机制：step = 一次模型请求加上它调用的工具；turn = 零或多个 step，'在第一份输入被 claim 之前打开，在不再欠任何东西时关闭'（architecture.md:65）。turn 循环（agent.ts:246-330）：turn/start 落盘 → claim → pre-step waterfall → 若 enter 则 step/start、追加 user/message、请求模型、执行工具、step/end → 若工具还欠响应或 next-step 队列非空则以 target='next-step' 继续 claim 下一个 step（agent.ts:300）→ 否则触发 agent/turn-stopping 后关闭。两个刻意的边角：pre-step 被 reject、或首次 enter 被改写为空，turn 仍然完整落盘（turnEnds = blocked / completed，agent.ts:266-277）——一个花费零 step 的 turn 记录了'尝试发生过'；被 claim 后遭 reject 的消息'既不算 discarded 也不会变成 user/message'（runtime-types.ts:197 的 agent/inbox/claimed 文档），审计链完备。max-tokens 结局是粘性的：turn 内任一 step 触顶，后续正常完成的 step 不能降级 turn 结局（agent.ts:287-290）。

证据：/Users/aaronguo/Work/lab/deepseek-harness/docs/architecture.md:65-88; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/agent.ts:246-330

价值：为什么这样切：turn 对应'用户视角的一次交互'（durable、可回放、UI 分组），step 对应'模型视角的一次请求'（扩展点的挂载节奏——压缩、hooks、注入都以 step 为单位介入）。把两者分开后，'工具连环调用'和'mid-turn steering'都只是'再来一个 step'，不需要嵌套 turn 或特殊状态。空 turn 落日志这个细节说明设计者把 session log 当审计账本而非聊天记录——被策略拒绝的输入也留下痕迹。

## agent/pre-step 是'模型看什么'的唯一裁决点，且被运行时断言封死后门

机制：preStep（agent.ts:225-243）顺序固定：claim 批次 → 组装 system prompt sections → 把动态运行时上下文（时间、tmux 等）与上次快照 diff、仅在变化时生成一条候选 user message（runtime-context.ts:64-75）→ 跑 agent/pre-step waterfall，默认 enter([claimed..., context])。返回的决定是权威的：最终 messages 数组整体替换，被省略的已 claim 消息就地消失。全仓有 13 个包挂在这一个事件上（event-producer-consumer.md:18）：compaction-basic（压力触发压缩）、plan-mode、两个 hooks 桥、subagent driver、time-context、tool-skill 等。配套的封锁：agent/request waterfall 的 payload 根本不携带 messages 字段（runtime-types.ts:909，'Model-visible content must use logged channels; this waterfall cannot mutate messages'）——想改模型可见内容，唯一通道是落日志的 pre-step/inject。最后由运行时不变式收口：agent-loop 的 invariant companion 以 prepend:true 挂在 llm/stream 上（invariant.ts:20-21，注释明言 prepend 是防止短路的 replay listener 静默吞掉检查），在每次真实请求发出时重新执行 session.deriveMessages() 并与请求里的 messages 做 JSON 全等比对，不一致即报'log-reconstruction desync'（invariant.ts:39-42）。

证据：/Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/agent.ts:225-243; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/invariant.ts:20-54; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent/src/runtime-types.ts:894-909; /Users/aaronguo/Work/lab/deepseek-harness/docs/event-producer-consumer.md:18

价值：这是整个架构最硬核的一手：'model-visible ⟺ logged'不是文档口号，而是一条每次请求都执行的可运行断言。它的连锁效应是：fork/resume/回放/telemetry 全部免费正确（都从同一日志导出）；任何插件想给模型塞私货，要么走 pre-step（被记录），要么在 llm/stream 上被当场抓获。'裁决点唯一'还意味着扩展之间的冲突有确定的仲裁场所——而不是散落在十个中间件里互相覆盖。代价见 tradeoffs。

## 三事件域 + 按'权力大小'选派发模式，而不是一律用中间件

机制：事件分三域（architecture.md:55-61）：session 事件是持久事实（turn/*、step/*、user/message、assistant/*、tool/*——必须跨重启存活的才配）；agent/* 是携带活 Agent 引用的运行时协调（inbox、status、pre-step、request-error）；capability 事件把策略挂到能力接缝（fs/*、tools/*）而不 import loop。派发模式按听者权力选：单决策拦截用 waterfall（pre-step、request、request-error、tools/*——不调 next() 即短路，cordis-primer.md:28-34 明说'对单决策事件，短路就是设计'）；纯通知用 emit，且 agent 的 emit 是手工包裹的：Cordis 原生 emit 经 Array.map 派发，一个同步 throw 会饿死后续 listener，所以 agentEvents.emit 自己遍历回调、逐个吞掉同步异常和 promise 拒绝（dispatch.ts:120-137）——通知永远无权否决生命周期。最微妙的是 agent/turn-stopping 刻意不用 waterfall 而用 serial 且无 next()：想阻止 turn 结束的 listener 不返回'继续'指令，而是调 agent.steer() 塞入数据，循环随后重读 inbox——'数据裁决，因此 listener 顺序无法改变结果'（runtime-types.ts:996-1009）；反向控制（工具提前结束 turn）同样走数据：tool result 携带 concludesTurn 标志（tool-calls.ts:157）。

证据：/Users/aaronguo/Work/lab/deepseek-harness/docs/architecture.md:55-61,84; /Users/aaronguo/Work/lab/deepseek-harness/docs/cordis-primer.md:28-34; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent/src/dispatch.ts:113-137; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent/src/runtime-types.ts:996-1017

价值：waterfall 的短路风险（一个 listener 忘调 next() 就吞掉下游）是这类中间件模型的固有病。这里的应对不是禁用 waterfall，而是把'谁有权决定什么'编码进派发模式的选择里：可短路的地方短路是特性（policy 拥有决定权），不可被顺序影响的地方改用数据裁决（turn-stopping），不可否决的地方用被包裹的 emit。这套'事件模式即权力声明'的分类法，比'所有钩子都是 async 中间件'的常见做法可推理得多。

## 取消与错误恢复：类型化 cause 只活在运行时，durable log 只记粗粒度结局

机制：cancel(cause, {keepInbox})（agent.ts:134-140）：默认清空 inbox 并 abort 当前活动，keepInbox 保留未启动的工作；首个 cause 获胜。cause 是四元类型联合（user/parent/hook/disposed），只被塞进 AbortSignal.reason 供协作方参考，durable turn/end 只记 {kind:'aborted'}——文档明言：记录'谁取消的'需要单独的持久事件，不许把归因语义超载进终局字段（core.md:203）。取消期间到达的唤醒输入被改道 next-turn 并 latch（agent.ts:116-119, 172-181）：aborted driver 无法送达唤醒，把 wakeRequested 记在 phase 上，收敛到 idle 后重放；唯独 disposed 永不 latch——teardown 绝不等待新的模型 turn。错误路径：turn() 的 finally 无条件补 turn/end（agent.ts:316-323），结构化错误保留 LlmFailure、其余压成 errorChain + UNKNOWN；工具层面 abort 时给所有未启动的 call 补合成 error result（tool-calls.ts:248-259），保证日志里每个 tool/call 都有配对 result、回放永远合法。请求失败走 agent/request-error waterfall（在 step/end 之后、turn/end 之前）：llm-retry 处理瞬时错误，compaction-basic 只认上下文溢出、剪枝/摘要推进了 surface 代际才开重试 turn（agent-lifecycle.md:76）。销毁是备忘录化的逆序 teardown（agent-loop/index.ts:497-520）：disposed-cause cancel → whenIdle() 静默 → scope 解绕 → 出注册表；teardown 在发布之前就注册好（index.ts:453-458），setup 中途 unload 能整体回滚。AgentHandle 的 disposer 是能力凭证——只有创建者能拆（core.md:29-47）。

证据：/Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/agent.ts:113-140,172-200,302-330; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/index.ts:453-578; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/tool-calls.ts:237-259; /Users/aaronguo/Work/lab/deepseek-harness/docs/subsystems/core.md:180-203

价值：两个决定特别值得抄：(1) 取消归因不进持久格式——runtime 的丰富语义（hook reason、parent 级联）和 durable 的粗粒度结局分层，避免持久 schema 被权限/归因概念污染；(2) 'abort 时补合成工具结果'——很多框架取消后日志里留下孤儿 tool/call，导致回放/续跑时模型看到不配对的调用而错乱，这里把'日志永远可回放'贯彻到了取消路径。wake latch 的处理也诚实：取消和新输入的竞态不是靠锁消掉的，而是定义了确定语义（改道 next-turn + 收敛后重放）并写进 JSDoc。

## '改行为=挂插件、改 loop=改文档'的守护：小循环 + 生成式文档门禁 + 运行时断言

机制：三层防线。第一层是把 loop 做小做穷：驱动本体 496 行，所有可变性外推——模型选择走 agent/request waterfall，消息内容走 pre-step，重试走 request-error，turn 终止走数据（steer / concludesTurn），并发上限是实时读取的用户设置（index.ts:328-334 的 getter 注释：每个工具组开始时重读，改动作用于下一组不打扰在飞的）。第二层是生成物门禁：agent-lifecycle.md 和 event-producer-consumer.md 由 scripts/gen-doc-graphs.ts 从 TypeScript Program 解析派发/监听边生成（两文件头部标注 'Generated — do not edit by hand'）；core.md 里的 Cordis API 目录由 gen-cordis-catalog.ts 生成并由 doc-sync 里的 verify-cordis-catalog 校验新鲜度；文档中的 ts type-equiv 代码块参与 doc-typecheck。因此给 loop 增删事件或改签名而不更新文档，CI 直接红——'改 loop 必须改文档'一半是机械强制的。第三层是前述 llm/stream 运行时不变式：想绕过插件机制直接在 loop 里改模型可见内容，请求与日志导出比对当场失败。

证据：/Users/aaronguo/Work/lab/deepseek-harness/docs/agent-lifecycle.md:1-2; /Users/aaronguo/Work/lab/deepseek-harness/docs/event-producer-consumer.md:1-6,76; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/index.ts:328-334; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/invariant.ts:19-54; /Users/aaronguo/Work/lab/deepseek-harness/scripts/gen-doc-graphs.ts; /Users/aaronguo/Work/lab/deepseek-harness/docs/architecture.md:104-106

价值：值得注意的是这条铁律不全是机械的：'新行为必须挂扩展点'本身仍靠 review 和 AGENTS.md 约定。但他们把能机械化的部分全机械化了——事件图谱、API 目录、类型等价块都是从源码生成再验证新鲜度，让'文档漂移'从 review 负担变成编译错误。这对'仓库主要由 agent 维护'的处境（repo 里到处是 Agent Notes 和给 agent 读的 gate）是刚需：agent 不会自觉更新文档，只会响应红色的 CI。

## tradeoffs
- 写放大与日志膨胀：inbox 的每次插入/替换/claim、动态上下文快照的每次变化、每个 assistant/chunk 都是持久 session 事件。换来的是崩溃安全的待处理输入和逐字节可回放，付出的是日志体积和每条消息两次落盘（入队一次、成为 user/message 一次）。
- pre-step 是每次模型请求前的串行 async 链（先 assemble prompt、再过 13 个包的 listener），全部排在首 token 延迟的关键路径上；listener 越多，交互延迟越不可控，且顺序耦合（compaction 必须在 hooks 前后哪个位置）只能靠注册顺序和 prepend 约定管理。
- 运行时不变式在每次 llm/stream 上对全量消息历史做 JSON.stringify 比对（invariant.ts:40），代价是 O(上下文长度) 的序列化——作为 companion 插件可以按组合选择性挂载，但挂上就是每请求实打实的开销。
- 'authoritative replacement' 的 pre-step 决定是类型系统管不住的约定：一个 listener 返回自己的 messages 而忘记展开 await next() 的下游结果，别人注入的上下文就静默蒸发。文档反复警告（agent-lifecycle.md:78），但没有机械防护。
- 抽象税：理解一次'用户发消息到模型收到'要跨 Cordis 派发、scope 过滤、fused dispatcher 类型体操（dispatch.ts 的 AgentSubjectEvent 条件类型）、durable splice 投影四层。500 行的循环本体读起来像 2000 行。
- turn 语义的完备性（空 turn、blocked turn、粘性 max-tokens、claimed-but-rejected 消息的'三不'状态）把复杂度推给了所有日志消费者：UI、telemetry、fork 都必须正确处理这些边角。

## learnables
- 双队列 inbox 直接可抄：用 (next-turn | next-step) × (唤醒 | 不唤醒) 两个正交维度统一 followup/steer/inject 三种输入，让所有输入走同一个 claim 点、同一个裁决 waterfall、同一套取消语义。这是本仓库性价比最高的单个设计。
- '模型可见 ⟺ 已落日志' + 一条可执行断言：请求发出前从日志重导出消息并比对。哪怕你不做全套事件溯源，在自己的 harness 里加这一条 debug 断言，也能抓住绝大多数'上下文从哪来的'类 bug。
- 按权力选事件模式：可短路中间件（waterfall）给拥有决定权的 policy；顺序无关的终止判定用'数据裁决'（listener 想续命就塞数据，循环重读队列，而不是返回控制指令）；纯通知用逐 listener 包裹异常的 emit。把'谁能否决什么'写进派发机制而非文档。
- 用 payload 形状做静态封锁：agent/request 不携带 messages 字段，改内容的后门在类型层面不存在。'不该做的事让它无法表达'优于'文档禁止'。
- 取消归因分层：丰富的类型化 cause（user/parent/hook/disposed）只进运行时 AbortSignal.reason，持久日志只记粗粒度结局——持久 schema 不为运行时语义买单。
- abort 时为未启动的工具调用补合成 error result，保证日志中 tool/call 与 tool/result 永远配对——取消路径的回放完整性是大多数框架的盲区。
- 动态上下文（时间、环境状态）不塞 system prompt 而是 diff 后作为持久 user message 注入、无变化不注入（RuntimeContextProjection）：既守住 model-visible=logged，又不因 system prompt 抖动打爆 KV cache。
- 竞态定义成契约：inject 'may miss a request whose pre-step already claimed its batch'、取消期间的唤醒'改道 next-turn 并 latch 到收敛后重放'——把并发边角写成确定语义并进 JSDoc，比加锁假装原子更可维护。

## questionable
- '一切皆插件'的彻底性只在 DeepSeek 的处境下成立：219 个包、生成式文档门禁、per-file 100% 覆盖率闸、包级 invariant 制度，全套基础设施是为'多 agent 并行维护一个平台级产品'设计的。小团队照搬会把全部精力花在喂 gate 上；你需要的可能只是 inbox + pre-step + 日志断言这三样，而不是 Cordis 全家桶。
- 13 个包共挂一个 pre-step waterfall 且决定是整体替换语义——这个扩展点的杠杆和风险成正比。listener 数量增长后，顺序依赖和'谁吞了谁的注入'类 bug 只会靠约定和 review 兜底；自建系统时值得考虑把'追加型注入'和'替换/否决型 policy'拆成两个不同权力的钩子，而不是共用一个 authoritative waterfall。
- inbox 持久化到会话日志对'长驻多会话服务器'是刚需（崩溃恢复排队输入），对一次性 CLI agent 是纯开销——这属于'DeepSeek 要做产品平台'的决定，不是 agent loop 的普适需求。
- dispatch.ts 的 fused dispatcher 为'热路径零分配'付出了大量条件类型和三处受控 cast；事件派发在一次 LLM 请求（秒级）面前的分配成本可忽略，这个优化的动机更像类型安全洁癖（scope key 与 payload.agent 不可分叉）而非性能，自建时用普通 emitter + 一行 assert 即可。
- '改 loop=改文档'的机械守护只覆盖事件签名和目录新鲜度，'新行为必须挂扩展点而非改循环'这半句仍是纯约定——宣传中的铁律和实际的 CI 强制之间有缺口，评估这套方法论时不要高估其机械化程度。
- 空 turn、blocked turn 等审计完备性设计以所有下游消费者的复杂度为代价；若你的日志消费者只有一个 UI，'被拒输入也落一个 turn'可能是你不需要的会计精度。