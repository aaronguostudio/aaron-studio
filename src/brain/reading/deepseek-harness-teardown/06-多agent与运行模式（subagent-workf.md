# 多 agent 与运行模式（subagent / workflow / jobs / goal / plan / todo / code-runtime(PTC) / self-modification(extensions) / preset）

这个子系统回答的是\"一个 agent 如何长出手脚和分身而不改内核\"：agent-loop 保持极小，subagent（委托）、workflow（脚本编排）、jobs（后台账本）、goal（自动续轮）、plan（协作状态）、code-runtime（PTC）、self-modification（改自己）全部是可选 capability seam 插件，最终由四个 preset 目录（标准/PTC/极简/创造）以声明式组合拼出四种\"运行模式\"。多 agent 被摆在一等公民位置的方式不是造一个 orchestrator 框架，而是一个 provider 注册表：spawn/fork/acp/codex/claude-code 六种 transport 共用一个 seam 和一份模型侧工具，\"委托给竞品一个 turn\"与\"spawn 子 agent\"同构；可续聊后台子 agent 则复用 Session 持久化与 Agent inbox，不引入第二套执行状态机。贯穿全部设计的两条铁律是\"model-visible ⟺ logged\"（PTC 中间结果不进上下文但全落日志，省 token 与可回放兼得）和\"fail loud, no silent degradation\"（能力不匹配、配置写错一律响亮拒绝）。代价是极重的文档/门禁基建与细粒度包拆分——这套打法只在有生成器门禁养文档的团队里成立，但其中的机制级决策（否决式能力校验、blocked 的操作性定义、自动续轮三道闸、诚实的沙箱威胁模型）对任何自建 agent 系统都可单独摘取。

## Subagent seam：一个注册表统一六种 provider 谱系，能力校验"否决式"而非"降级式"

机制：ctx.subagents 是命名 provider 注册表（与只允许单实现的 bash executor seam 刻意不同），六个 provider 共存：spawn（全新子会话）、fork（用父日志的 balanced completed-turn 前缀作 seed，复用 ctx.sessions.prepare({seed}) 同一原语）、acp、dsh-sdk，以及 codex 和 claude-code——后两者把"一个 turn"整体委托给另一产品的 CLI（codex app-server --stdio / Claude Agent SDK），只取 final answer 回填。校验分两层：一次性 start 用静态 SubagentCapabilities flags（outputSchema/depthLimit/toolFilter/persona），请求需要而 provider 缺失的能力抛 SubagentError('UNSUPPORTED_CAPABILITY')，绝不接受后静默忽略；continuable 能力则由可选方法 prepareContinuable 的存在性本身表达，用 TS narrowing 做发现。模型侧只有一个 dsh-tool-subagent 消费者，按 config {provider, toolName} 实例化多份（subagent/subagent_fork/subagent_codex/subagent_claude_code），模型永远拿不到 provider 选择器。

证据：docs/subsystems/subagent.md:5-33,406-459; packages/subagent/subagent/src/index.ts:171,433-445; packages/subagent/subagent-codex/README.md; packages/subagent/subagent-claude-code/README.md; apps/cli/config/agent-presets/standard/agent.cordis.yml:174-233

价值："委托给另一个产品"和"spawn 自己的子 agent"被建模成同一 seam 的两个 provider，多 agent 谱系天然可扩展；"fail loud, no silent degradation"避免了 agent 系统最阴险的 bug——请求了 outputSchema 但 provider 悄悄忽略，父 agent 拿到没有 structured 字段的结果还以为是子 agent 没答好。

## Continuable subagent：durable Session + 至多一个 Activation，Agent inbox 是唯一队列

机制：一个可续聊的后台子 agent = 一个持久 Session + 进程内至多一个 Activation（子 Agent 驻留期）。followup() 的路由只看 Activation residency：running→入队同一 Activation，waiting→唤醒，无 Activation→从持久 Session 冷恢复。不引入第二条投递队列——每条续聊消息就是一次 Agent.followup() FIFO turn。授权模型：follow-up 必须来自 durable header 里记录的直接父 Agent 的活实例；MessageSource 只记录"谁发的"但不授予权限。子 agent 主动 report 时不能指定收件人（运行时从 parentSession 推导唯一收件人）；Activation 结算时运行时自己发一条 settlement notice，其 source kind（subagent-settled）与子 agent 自写的 report（subagent-report）刻意不同——"合并两者的 transcript 会把子 agent 没说过的话记在它头上"。

证据：docs/subsystems/subagent.md:114-241; packages/subagent/subagent/src/continuation.ts; packages/subagent/tool-subagent/README.md（backgroundMode: continuable，默认后台、inbox 接受即返回 childId）

价值：把"后台多 agent 协作"还原成已有原语（Session 持久化 + Agent inbox + scope 所有权），没有为多 agent 发明第二套执行状态机；"runtime 的账不能冒充 child 的话"这种 provenance 洁癖，是长会话多 agent 系统里防止上下文污染的真问题。

## PTC / Code Mode：中间结果落日志不进上下文，账单=固定 SDK 开销 + 近零边际

机制：三层拆分：code-runtime seam 只管"跑一个程序+一组 async bindings"（错误是结果字段不是异常，worker-thread 隔离但 isolation 明示"是诊断标签不是安全声明"）；run_code transport 在工具注册表内：把当前 agent 可见工具集枚举成 null-prototype 的 tools 命名空间（__proto__ 是普通 own key），每次 binding 调用重进完整工具管道（pre-execute→guards→execute→post-execute），并复用原生调度合同（parallel 重叠至 maxParallelSubCalls、exclusive 作 barrier、提交序 commit）。关键：每个子调用写 tool/code-dispatch-start / tool/code-dispatch 会话事件（含完整 content/isError，UI 按原生路径渲染），但 deriveMessages() 不把它们给模型——模型只收到程序 print 的行和 return 值。prompt 侧固定开销是生成的 tools:sdk TypeScript/Python 类型声明（字典序、byte-identical、prefix-cache 友好）+ run_code schema；mode: code 下直接调用其他工具在 executor 层解析为 UNKNOWN_TOOL 并附"从 run_code 程序里调它"的回路提示。preset 里切换 PTC 只需一行 tool-presentation {mode: code}。

证据：packages/core/tools/src/code-mode.ts:1-7,470,499-521,606-619,635-638; packages/core/tools/README.md:16,118-124,170（"Code Mode trades end-tool schemas for generated SDK text plus one transport schema rather than promising a universal reduction"）; docs/subsystems/code-runtime.md:161; apps/cli/config/agent-presets/code/agent.cordis.yml:259-262

价值：这是我见过对"model-visible ⟺ logged"不变式最认真的 PTC 实现：省上下文（N 次工具调用 1 次往返、中间结果零上下文占用）与可审计/可回放（每个子调用都有 durable 事件、确定性 id <parent>:code:<n>）兼得。README 直白承认账单结构是 trade 而非 free lunch，这种诚实很少见。

## Plan 模式=被记录的状态，明示"拦不住任何东西"

机制：plan/mode 是 log-only、整值替换的 session event；当前状态永远是 foldPlanMode(events) 的纯折叠，resume/fork/compaction 免费恢复，无 live mirror。激活时唯一的效果是往 system prompt 注入部署方配置的 plan:policy section（order 50）；sandbox 与 approval 独立执行且都不读 plan 状态。exit_plan_mode 工具在非 plan 模式下也保持注册（执行期才拒绝），所以进出 plan 模式不改工具目录、只改 prompt section——KV cache 只从 order 50 之后失效。用户 mid-turn 切换是 pending selection，由下一个被接受的 in-turn pre-step 原子落日志，且只在上一个 request header 描述了相反状态时才补一条 user/message 通知（"告诉模型上下文何时变了，且绝不冗余"）。

证据：docs/subsystems/plan.md:5,11-17,33; packages/plan/plan-mode/README.md:5,92-98（Known Limitations 第一条："guides rather than enforces"）; packages/bundle/base/cordis.patch.yml:265-279（部署方的 plan section 文本）

价值：把"模式"降级成"被记录的提示词状态"是一次清醒的职责切割：enforcement 属于 sandbox/approval 这些本来就存在的强制层，plan 模式不该重复造一个弱化版权限系统。工具常驻注册换 KV cache 稳定这一手（schema 稳定、执行期校验）值得直接抄。

## Goal："卡住"有严格定义、自动续轮有三道闸

机制：blocked 是唯一的 stopped-by-a-problem 持久相位，必须带 policy-owned 的 {code, message}。模型自报 blocked 被双重约束：工具在配置的最小轮数（默认 3）之前直接拒绝，prompt guidance 明文写"同一阻塞条件持续≥N 轮才算 blocked；difficulty、uncertainty、还有有用工作可做，都不是 blocked"。complete/blocked 还需要硬授权：从会话日志验证本 turn 里存在 source.kind==='user' 的根 agent 人类消息，或恰好是当前 goal 的 exact admitted round（goalId+revision+round 三元组匹配）。自动续轮由 goal-round-driver 完成：agent idle 时投递 <goal_round> 提示（followup），但 (1) durable phase 与 process-local activation 分离——重启后不自动续，需人类 resume 重新记录激活边；(2) 每轮前做 durability checkpoint（ctx.sessions.flush 失败→disarm 不续）；(3) pre-step waterfall fail-closed 校验 reservation（revision 变了、有竞争用户消息、round≠roundsStarted+1 都拒掉本轮）；max-tokens 结束的 turn 直接 disarm；轮次到顶自动 block('round-limit')。

证据：packages/goal/tool-goal/src/index.ts:113-122; packages/goal/tool-goal/src/authority.ts:70-83,101-108; packages/goal/goal-round-driver/src/index.ts:103-109,142-153,164-174,317-326,349-414; packages/goal/goal-round-driver/src/prompt.ts:12-26; docs/subsystems/goal.md:21-42

价值：长时自治 agent 的两大失败模式——轻易弃坑（假 blocked）和无脑空转（假 progress）——在这里都有机制化回答：前者靠最小轮数门槛+严格语义定义，后者靠 round cap+每轮 checkpoint。"重启后不自动续、人类重新授权"是对 runaway agent 最便宜的保险。

## Self-modification：沙箱是"给诚实代码的容器"，安全边界=不装、明说

机制：cordis preset 提供五个工具：cordis_inspect（活运行时的 service/plugin/tool/slot 报告，由与 docs 同一 AST walk 生成的 catalog 与 live service store 求交，"模型读的和文档不可能分叉"）、cordis_define/run/stop/undefine（记录→在 node:vm 沙箱中求值 host 半、向浏览器投递 client 半→处置）。沙箱设计是"教学型"而非"防御型"：require/fetch/setTimeout 等被 trap 成抛错并教路由到 ctx.fs/ctx.web/ctx.bash/cordis timer；但 README 和 preset 注释都明写"host-realm helpers 可逃逸，这不是安全边界，把这个工具集当 bash/shell 权限对待"；vmTimeoutMs 只约束同步段，async body 逃逸是接受的。动态包只活在进程内存：不落盘、不改 cordis.yml、重启即失、不能自动转正——要保留必须走正常 Plugin 开发流程。persona 里教两平面纪律（host composition vs agent preset）并禁止编辑 shipped preset。

证据：packages/extensions/cordis-host-runner/src/sandbox.ts:1-12,96-119,129-145,217-238; packages/extensions/tool-cordis/README.md:19-23,100-104; apps/cli/config/agent-presets/cordis/agent.cordis.yml:9-13（TRUST 注释）

价值：对"agent 改自己"这种高危能力，最大的价值不在沙箱技术而在诚实的威胁模型：不假装 vm 是隔离，把授权决策上移到"是否加载这个 preset"这一个粗粒度开关；同时用"内存态、会话可见、不可自动转正"把爆炸半径限制在时间维度。反例是很多框架用半吊子沙箱制造安全幻觉。

## 四种模式=四个 preset 目录：模式是组合差量，不是代码分支

机制：agent preset = 一个装着 agent.cordis.yml 的目录，挂到某 session 的 scope context 下，该 session 获得自己的工具与 prompt sections，同进程其他 session 各持己见。四种模式即 apps/cli/config/agent-presets/ 下四个目录：standard（全功能：bash/fs/jobs/skill/goal/plan/compaction/委托组/todo/web）；code（PTC 模式）= standard 逐字不变 + 末尾一行 tool-presentation {mode: code}；cordis（创造模式）= standard + tool-cordis + 一个教组合写作的 skill + 讲两平面纪律的 persona；minimal = 62 行双工具（bash + str_replace_editor）。组合纪律由 mount 期强制：registries/sandbox/审批/持久化/model route 属于 host composition；preset 里发布 service 的 row 必须带 isolate realm，否则 dsh-agent-presets 在 mount 时拒绝（防止两个 session 的实例互相碰撞或被 host 读者误解析）。

证据：packages/preset/README.md; apps/cli/config/agent-presets/{standard,code,cordis,minimal}/agent.cordis.yml（code 与 standard 的 diff 仅为注释+tool-presentation 行 259-262）; apps/cli/config/agent-presets/*/preset.yml（模式名与 order）

价值："运行模式"在多数 agent 框架里是散落在代码里的 if/flag，这里是可 diff、可复制、可被 agent 自己创作的声明式文件——创造模式的产出物恰好又是一个 preset 目录，形成闭环。mount 期拒绝错误组合比运行期崩溃早得多。

## Workflow 与 jobs：正交的编排层与后台账本，fatal 错误必须响

机制：workflow 是单实现 seam（非 provider 注册表）：模型写 JS 编排脚本在 worker thread + vm 里跑，脚本里 agent() 走 subagent seam（provider 与 maxTotalAgents 是引擎级策略，脚本不可观测/不可改）；parallel()/pipeline() 对 WorkflowError.fatal（写错选项、schema 越界、cap 触顶）re-throw 而不是折成 null——"typo 必须响亮地杀死脚本，绝不溶解成一次普通子失败"（普通子失败才映射为 null）。tool-ralph 证明专用编排策略（固定脚本的 fresh-agent 循环、结构化 handoff、workspace 即长期记忆）可以作为普通 plugin 落在这两个 seam 之上，不动 agent-loop。jobs 是独立的后台任务注册表：owner 授权而非 id 保密；start 在没有 attached controller 服务该 owner 时直接拒绝（不允许启动一个 owner 无法收割/停止的工作）；reported flag 保证终态只被通知一次，teardown 主动认领通知，理由写得很清楚——owner 都要销毁了没有读者，否则每层 teardown 要花一次模型请求。

证据：docs/subsystems/workflow.md:5,13,95,114-116; packages/workflow/tool-ralph/README.md; packages/workflow/workflow-worker-thread/README.md:30-41,79-86; docs/subsystems/jobs.md:100-138,171-178

价值："配置错误"与"子任务失败"的错误通道严格分离，是多 agent fan-out 里最容易糊掉的一条线；jobs 的"无人收割就不许启动"和"teardown 认领通知省一次模型请求"都是长期运行 agent 系统里真金白银的运维教训。

## tradeoffs
- PTC 的账单是显式 trade 不是白拿：tools:sdk 生成的类型声明 + run_code schema 常驻每个请求（固定开销上升），换 N 次工具调用一次往返、中间结果零上下文占用（边际成本下降）；官方 README 明写"不承诺普遍省 token"——工具少、调用少的会话反而更贵。
- "一切皆插件、不改 loop"的教条把复杂度推到了插件内部：goal-round-driver 为在公共 seam 上做自动续轮，写了 445 行竞态状态机（reservation/stale/cancel/checkpoint 四重防线）；换来的是 loop 零膨胀和每个行为可单独卸载。
- 可审计性的存储成本：每个 code-mode 子调用双写事件（dispatch-start + dispatch 完整 content），每个 workflow 运行四类投影事件，日志显著变大；换来的是任何模型可见输入可从日志重建、UI 可按原生路径渲染子调用。
- continuable subagent 的耐久性妥协：最终 flush 无法证明持久化 backend 真的存了（参与布尔值被有意忽略），失败只记日志仍释放所有权，冷恢复可能读到陈旧状态——用"接受罕见丢失"换"teardown 永不卡死"。
- 多 provider 委托的一致性上限被压到"只回 final answer"：codex/claude-code 子 agent 的推理、工具活动、diff 一概不进父会话，牺牲可观测性换取上下文与审批边界的干净。
- plan 模式零 enforcement：换来实现极简（一个 log 事件+一个 prompt section）与 KV cache 稳定，但把"只读保证"完全推给 sandbox/approval 的独立配置，部署者不配置就只有心理安慰。
- 四 preset 的组合式模式要求严格的 host/agent 两平面纪律（isolate realm、mount 期拒绝），写 preset 的心智门槛不低——创造模式配了整个 skill 和 persona 来教这件事，本身就说明该抽象不自明。

## learnables
- 能力校验用"否决式"：请求了 provider 不支持的能力就抛 typed error，绝不 accepted-then-ignored——这是多 provider agent 系统最廉价也最有效的防腐层；配套技巧是"可选方法的存在性即能力"，用 TS narrowing 做发现（SubagentProvider.prepareContinuable）。
- "Model-visible ⟺ logged"不变式值得整个抄走：任何进入模型请求的输入必须能从 session log 重建。PTC 的省上下文正是靠它才不牺牲可审计性——中间结果不给模型但全部落 tool/code-dispatch 事件，UI 与回放照常工作。
- 把"委托一个 turn 给另一个产品（Codex/Claude Code）"与"spawn 自己的子 agent"统一为同一 seam 的 provider：模型侧一份工具代码按 {provider, toolName} 配置多实例，模型永远拿不到 provider 选择器；产品 provider 一律 inheritsParentContext:false + 只回 final answer + 凭据剥离后显式 env 注入，把外部产品当纯函数。
- 自动续轮（auto-continue）的三道闸设计：durable phase 与 process-local activation 分离（进程重启不自动续，需人类 resume）；每轮前 durability checkpoint，flush 失败就 disarm；pre-step fail-closed 精确匹配 reservation（goalId+revision+round），任何竞争或陈旧都放弃本轮。
- "卡住"要给严格的、写进 prompt 的操作性定义："同一阻塞条件持续≥3 轮才算 blocked；困难、不确定、还有有用工作可做，都不是 blocked"，并配最小轮数的硬拒绝——这句 guidance 可以直接搬进任何自治 agent。
- 工具常驻注册+执行期校验（exit_plan_mode 在非 plan 模式也注册）：模式切换不改工具目录，只改一个 prompt section，KV cache 前缀失效面最小化。
- 运行时给子 agent 的结算通知与子 agent 自己写的 report 用不同的 message source kind——transcript 里永远分得清"孩子说的"和"系统替孩子说的"，防止上下文冒认。
- 运行模式做成可 diff 的声明式组合（preset 目录），并在 mount 期拒绝错误组合（preset 里发布全局 service 必须 isolate realm）；PTC 的开关就是一行 mode: code。
- 对危险能力（self-modification）诚实标注威胁模型比造半吊子沙箱更重要：明说"当 bash 权限对待"，把授权上移到"是否加载该 preset"，用"内存态、不落盘、不可自动转正"限制时间维度的爆炸半径。

## questionable
- 两条"模型写程序做编排"的路径并存：run_code（编排工具）与 workflow 脚本（编排 subagent）在机制上高度重叠（都是 vm/worker、都有并发合同、都有 JSON 边界），概念负担直接翻倍；连它自己的 guidance 都写"仅在用户明确要 workflow 时才用，一两个委托请直接用 subagent"。小团队应只保留一条（大概率是 PTC 那条），把 subagent 也做成 binding。
- 货粒度极细的包拆分（subagent 一族 11 个包，tool-subagent-control 和 tool-subagent-report 各自成包）+ 每包强制 README/JSDoc/invariant/双语文档/Model Experience 三段（token 与 KV cache 效应）——这套纪律靠十几个生成器门禁（gen-cordis-catalog、verify-package-invariants 等）撑着，是"用文档基建养文档"的大厂打法；没有等量 CI 投入的团队照搬只会得到过期文档。
- codex/claude-code provider 的价值要打折看：wire 行为证据 pin 在特定版本（codex 0.147.0），unattended 审批策略（偏好 cancel/decline）是对别家产品内部协议的脆弱适配，DeepSeek 有"演示互操作"的战略动机；普通团队维护这种产品间集成的成本大概率高于收益。
- plan 模式"纯软约束"在 harness-面向部署者的处境下成立（enforcement 归 sandbox/approval），但直接抄到 to-C 产品会出事：用户对 plan mode 的心智预期是"只读"，而这里 README 的 Known Limitations 明确承认 guides rather than enforces——抄设计前先确认你的强制层真的存在且默认开启。
- goal-round-driver 用 445 行处理 queue/claim/admit/stale/cancel 的竞态（还要在 pre-step waterfall 里 next() 前后各验一次），说明"复用 Agent inbox + pre-step 钩子做自动续轮"的抽象并不贴合，是为了守住"不改 agent-loop"的教条付出的复杂度；自己做时给调度器一个专用原语可能更简单。
- self-modification 沙箱的 Node API trap（拦 require/fetch/timer 并教路由到 ctx 服务）在"明示可逃逸"的前提下，安全价值≈0，剩余价值只是引导模型用 ctx 服务——这部分用 prompt/文档也能达到，vm 双 realm instanceof patch 之类的工程成本未必划算。
- continuable subagent 的最终 flush "忽略持久化参与布尔值"（无法证明 backend 真存了，失败只记日志仍释放所有权），文档承认后续冷恢复可能读到缺失/陈旧状态——这是一个被明说但真实存在的耐久性缺口，依赖后台子 agent 存活语义的场景要自己补。