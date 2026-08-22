# 工具注册表、执行管线与系统提示词组装（packages/core/tools + packages/core/system-prompt）

这个子系统是 DeepSeek Harness 的"产品 API 脊柱"：ToolRuntime 是一个按 scope 分层的工具注册表，把每次工具调用推过 pre-execute（allow/deny/ask 策略门）→ 单调 guard → execute（around 包装）→ post-execute（结果改写/拦截）→ finalizeContent → 只读 tools/result 的五段管线；SystemPrompt 是一个平行的注册表，插件贡献带 order 的 prompt section、工具 schema provider、变量与动态 context，每个 model step 组装一次。它解决的核心问题是：在"一切皆插件"的架构下，让审批、超时、沙箱、hook 桥接等部署策略以插件形式注入而完全不侵入工具实现；同时让"模型看到什么"（schema 顺序、prompt 文本）成为确定性的、KV-cache 友好的、可从 session log 完整重放的产物。UI 渲染意图（generic/terminal/diff 等 card）被当作工具设计的一部分，声明为 args 的纯函数，从而 UI 无需 special-case 工具名且能离线重放。MCP 工具和 skill 工具都只是普通 ToolDefinition，自动获得全部策略管线和 Code Mode 绑定。

## 三段 waterfall + 单调 guard：可扩展策略与不可推翻否决分离

机制：tools/pre-execute 是可重排的 waterfall，返回 allow/deny/ask（PreToolDecision）；ask 通过可选的 ctx.approval seam 解决（serviceAsk），无审批服务或无 agent 时降级为 deny（fail-closed），且四种审批结果映射为可区分的拒绝理由，让模型能分辨"人说不"和"没有审批通道"。其后是 ctx.tools.guard() 注册的单调 guard：ToolGuard 类型只能返回 denial reason 或 undefined，根本没有 allow 返回值，所以后注册的 listener 在类型层面就无法把否决翻回允许——策略安全性不再依赖插件加载顺序。tools/execute 是 around-dispatch waterfall，wrapper 唯一可变的字段是 exec.signal（ToolDispatchExecution 单独放开 signal 的 readonly），且 registry 在进 body 前用 fuseToolSignals 把 caller 原始 signal 重新熔接回来，wrapper 换 signal 加 deadline 但物理上无法切断 caller 取消。tools/post-execute 可 accept（替换 content 或 value 但 Object.hasOwn 检查禁止同时替换两者）、block（feedback 变 isError）、附加 additionalContexts；value 替换会重新走 schema 校验和 render。最后 definition 私有的 finalizeContent 在调用开始时就被快照捕获（防止 arguments getter 在快照期间偷换回调），对每个归一化结果恰好执行一次。实际策略消费者：timeout-policy 插件在 tools/execute 里读 tool 声明的 timeoutMs 换 signal 并用 code-scoped timeoutOf 归因超时；hooks-claude-code/hooks-codex 把外部 hook 协议桥到 tools/pre-execute。

证据：packages/core/tools/src/index.ts:1475-1478（pre-execute waterfall）、:711（ToolGuard 无 allow）、:1119-1128（guardReason）、:1689-1729（serviceAsk 降级）、:1573-1576 与 :1532-1560（execute waterfall + signal 重熔）、:1889-1916（fuseToolSignals）、:1742-1781（postExecute）、:1408-1418（finalizeContent 提前快照）；packages/guard/timeout-policy/src/index.ts:56-80；packages/hooks/hooks-claude-code/src/index.ts:238

价值：大多数 agent 框架的策略钩子是一条扁平中间件链，"谁最后注册谁说了算"。这里把策略分成三种代数性质不同的层：可协商的（waterfall，可 ask）、单调的（guard，只能收紧）、包装的（execute，只碰 signal），每层的能力边界由类型系统而非约定保证。副产物是工具实现完全无策略代码——tool-bash 里只有一行 TODO 注明"deployment policy belongs in tools/pre-execute"。

## 策略禁止改写参数：用功能牺牲换 model-visible ⟺ logged 不变量

机制：execute() 入口先把模型给的 arguments 做一次 lossless JSON 快照并 deepFreeze，然后才进任何策略阶段；PreToolDecision 有意不提供 input-rewrite 变体，JSDoc 直接写明"Input rewriting is excluded because arguments are already logged and presented"。session log 里的 tool/call 事件在执行前就已落盘，UI 的 pending card（presentCall）也从同一份 args 渲染，若允许策略改写参数，日志、UI、实际执行三方会立即失配。改写需求被放进 proposed Agent Note 等待专门设计而不是偷偷开口子。

证据：packages/core/tools/src/index.ts:1412-1416（快照+冻结）、:583-587（PreToolDecision JSDoc）；packages/core/tools/README.md Known Limitations（tools/pre-execute deliberately cannot rewrite exec.arguments）；docs/tool-execution-pipeline.md:11（tool/call logged before execution）

价值：这是一个罕见的"明确拒绝一个有用功能"的设计决策，理由不是做不到而是会破坏可审计性不变量（任何到达模型的输入必须可从 session log 重建）。自建 agent 系统的人几乎都会遇到"策略层想自动改参数"的诱惑（如自动加沙箱前缀），这里给出了一个想清楚了的反面立场和代价陈述。

## UI 渲染意图是工具设计的一部分：card 词汇表 + 纯函数 presenter + presentationMeta 投影

机制：每个 ToolDefinition 可声明 presentCall(args) 和 presentResult(args, result)，返回 card-tagged 联合类型（call: generic/terminal/diff；result 另加 search/read/web），词汇表定义在 dsh-tools 自己的 presentation.ts 里，工具永不 import UI 或传输类型，host/client 各自把 card 映射成自己的视图。硬约束：presenter 必须是 args(+durable result) 的纯函数——禁 I/O、禁读 session 状态、禁时钟/随机——因为 UI 在 live streaming 和 session-log 重放两个时刻都会调用它，重放时没有运行环境（write 的 diff 用 oldText:null 正是因为 call-time presenter 拿不到旧文件内容）。需要结果时刻事实的卡片（如 edit 的 applied hunks、grep 的分组匹配）通过 output.presentationMeta(args, value) 从 canonical value 投影出可重放的 JSON，随 tool/result 事件持久化并在重放时喂回 presentResult——canonical value 本身保持 execution-local 永不落盘。defineTool 对展示路径做软校验：旧日志里格式过时的参数让 presenter 返回 undefined 降级为 generic card 而不是 crash 重放。

证据：packages/core/tools/src/presentation.ts:46、:140（两个联合类型）；packages/core/tools/src/index.ts:269-287（presentCall/presentResult JSDoc 纯性约束）、:1806-1814（presentationMeta 仅 top-level 调用计算并快照）、:558（value execution-local）；docs/cookbook/adding-a-tool.md:84-90（硬规则）；.agents/notes/implemented/architecture/2026-07-02-tool-render-intent-union.md（设计理由）

价值：解决的是三个纠缠的问题：UI 对工具名的 special-case 蔓延、"UI 格式污染模型结果"（console fence、相对路径混进 model content）、以及重放崩溃。把"人看什么"和"模型看什么"从同一 canonical value 正交派生，且用纯函数约束让重放在架构上不可能依赖运行时状态——这比"重放时小心点"的约定强得多。presentationMeta 的设计尤其精巧：既不用持久化大 value，又让 result card 拿到必需事实。

## Scoped registry：一个可见性 resolver 同时喂 presentation、lookup 和 dispatch

机制：ScopedLayers 按 scope 链（global → preset → agent）维护 ToolLayer；register() 根据调用 context 决定层——plain ctx 注册全局，agent.ctx 注册到该 agent 层并 shadow 同名全局。restrict() 编译 allow/deny Set，多个 mask 取交集，且只过滤 inherited surface（global + 祖先层），不过滤 scope 自己的注册——view() 的注释记录了这个教训：子 agent 的能力过滤器不能剥掉 delegation runtime 塞进它自己层的 reporting 工具。未知名字 fail loud 并列出已知工具。view(scope) 单次遍历派生 {visible, knownNames, restrictableNames}，get()/schemas()/executionMode()/dispatch 全部经过它，保证"模型被告知能用的"和"实际能执行的"永不分叉。presentAs() 让单个 agent 覆盖 native/code/both 呈现；mode 沿 scope 链最近者胜。code 模式的 collapse（模型只能直呼 run_code）由 collapses() 一个谓词同时驱动 prompt 里的规则 section 和 executor 的拒绝路径——注释明言"The SAME predicate the executor denies by, so the prompt cannot state a rule the registry does not enforce"；且拒绝消息带路由提示（call X from inside a run_code program），因为裸 UNKNOWN_TOOL 会让模型把 prompt 刚声明过的工具的失败理解成部署坏了。

证据：packages/core/tools/src/index.ts:1037-1062（register 分层）、:1071-1098（restrict）、:1152-1193（view 及继承豁免注释）、:900-911（modeFor 链解析）、:1324-1326（collapses）、:855-863（collapseSection 同谓词注释）、:1436-1443（带路由的拒绝）；README :22 明示这是可见性组合而非安全边界

价值：per-agent 工具集是多 agent 系统的普遍需求，常见做法是在发 prompt 前过滤 schema 列表——但那只是表面过滤，模型仍可能调用被隐藏的工具。这里"schema 省略不是 enforcement"被上升为仓库级规则（Enforce a decision in the operation that makes it），可见性收敛到唯一 resolver、code collapse 在 executor 处强制。同时诚实声明这不是安全/权限边界（scope security non-goal），避免使用者误用。

## 系统提示词：order band + 中心化 toolOrder + 严格插值，确定性作为缓存策略

机制：插件贡献 PromptSection{name, order, text|provider, complete?}，按 order 升序拼接：-100 harness identity、0 deployment persona、99 code-only 规则、100-199 各工具自己的 guidance、150 Code Mode SDK。scoped section/variable shadow 同名全局；complete section 在 waterfall 之后被恢复为唯一 section（兼容部署整体接管 prompt）。工具顺序被 canonicalize：默认 code-unit 字典序（注释明确选它是为了 locale 无关、跨机器逐字节一致），或配置中心化 toolOrder 列表——必须恰好含一个 '<unlisted-tools>' rest 条目，未列出工具按字典序落在 rest 处；选中心化列表而非 per-plugin weight 有专门 Agent Note。理由：注册顺序是 plugin 加载顺序的 artifact，不 canonicalize 则每次部署重排 schema、打碎 KV-cache 前缀。变量插值严格 fail-loud：未注册名、无值、残缺 {{}} 组全部 throw（Object.hasOwn 防 {{constructor}} 走原型链），"fail loud beats shipping a malformed prompt"。动态内容（PromptContext）不进 system prompt，渲染成 user-role 的 runtime-context snapshot 追加在消息流里——易变事实被移出 system prefix。每个 model step 由 agent-loop 调一次 assemble()，renderPrompt 在 step 内执行；每个 package README 强制含 Model Experience 小节，逐项记录 token 成本与 KV-cache 失效范围。

证据：packages/core/system-prompt/src/index.ts:53-75（section 契约与 band）、:140-178（TOOL_ORDER_REST 与 orderTools）、:181-183（code-unit 比较及注释）、:258-295（严格插值）、:467-542（assemble）、:504-517 与 :536-541（complete section 恢复）；packages/core/agent-loop/src/agent.ts:230-233、:337；packages/core/tools/src/index.ts:832（ToolRuntime 构造时自注册 tools provider）；README :122（SDK section byte-identical、prefix-cache-friendly）

价值：把"prompt 组装的确定性"当作 KV-cache 成本工程来做，而不是当作代码整洁问题：字典序、中心化顺序表、动态内容出前缀、README 里的 KV Cache effect 小节，形成一条从设计到文档的完整链路。严格插值的 fail-loud 立场也值得学——prompt 模板错误静默通过是 agent 系统最难察觉的一类 bug。

## MCP 与 skill 的接合：外部工具归一为普通 ToolDefinition，一切策略免费复用

机制：MCP：一个 server 一个插件。公共名是 (serverName, rawName) 的确定性纯函数 mcp__<server>__<raw>，超 64 字符或含非法字符时截断并追加 12-hex SHA-256 防止不同身份坍缩为同名；raw name 只上 wire，从不从公共名反解析。同步用两阶段：先全量拉取构建下一代 ToolDefinition（任何失败不动旧一代），再 dispose 旧一代注册新一代，注册冲突则整代回滚到零工具——模型只会看到完整一代或空。MCP isError:true 被转成 throw，走 registry 统一的 isError 归一化路径；outputSchema 不在支持子集内则降级为无约束 JsonValue，canonical value 固定为 {content, structuredContent?}，Code Mode 程序因此能拿到结构化内容。skill：tool-skill 用 defineTool 注册一个通用 skill loader 工具，skill 目录不是 prompt section 而是持久化的 session context 事件（'skill-catalog' source），贴合 model-visible ⟺ logged。注册进来后，MCP/skill 工具与一等工具在管线、审批、guard、restrict、Code Mode SDK 生成上完全无差别。

证据：packages/mcp/mcp-client/src/tools.ts:96-102（命名+hash）、:128-174（两阶段 sync 与回滚）、:266-269（isError→throw）、:189-216（schema 降级与 canonical 输出）；packages/skill/tool-skill/src/index.ts:81-161；packages/core/tools/README.md:61（MCP 集成方式一句话：discover tools, call ctx.tools.register()）

价值：很多框架为 MCP 单开一条执行路径，导致审批/超时/日志对 MCP 工具失效。这里 MCP 桥只做三件事：命名归一、代际交换、错误路径归一，其余全部继承。两阶段 sync 的"整代或零"语义和 hash 防碰撞命名都是能直接抄的工程细节。

## tradeoffs
- 深防御的运行时成本：一次工具调用的数据要经历 arguments 快照+冻结、value 快照+schema 校验+冻结、render 快照、presentationMeta 快照、materializeFinalResult 的再次物化（finish 阶段甚至物化两次：candidate 一次、finalizeContent 之后一次），大结果（如长文件读取）意味着多轮深拷贝的 CPU 与内存开销。
- 为维持 execution 对象的 readonly 公共视图，registry 用了 5 个 WeakMap/WeakSet 侧表（deferredContexts、concludingExecutions、cancellationStates、contentFinalizers、canonicalResults，index.ts:803-810、:1784）。不可变性没有免费午餐——状态被移到了对象之外，调试时数据流更难追。
- 策略不许改写参数是真实的功能牺牲：自动改写型策略（参数消毒、自动加沙箱标志）在这个架构里做不了，只能 deny 后让模型重试，多花一轮模型调用。
- timeoutMs 是纯声明：registry 永不执行 deadline，必须另装 timeout-policy 插件才生效（README 明列 Known Limitation）。"声明了但没人执行"是一个静默失效面，靠文档而非机制兜底。
- 取消是协作式的：同进程工具 body 无法 hard-kill，取消只能替换结果并等 body 自己到达 quiescence，一个不理会 exec.signal 的工具会拖住整个 turn。
- 确定性与纯函数约束限制了 presenter 的表达力：presentCall 拿不到文件旧内容、工作目录等 session 事实，凡是需要的都必须提前设计进 presentationMeta 或推给 UI adapter，工具作者的心智负担前移。
- 同 order 的 section 靠注册顺序 tie-break（README 自认是 plugin-load artifact），确定性靠 band 约定而非机制，与 toolOrder 的彻底 canonicalize 形成不对称。
- 复杂度总量：仅 tools 包核心就近 2000 行且注释密度极高，管线有 5 个扩展点 + 调度器内部三态（dispatch/post-result/final-result），理解门槛显著高于一个 for 循环加 try/catch 的朴素工具执行器。

## learnables
- 把策略扩展点按代数性质分层，而不是一条扁平中间件链：可协商层（waterfall，可 allow/deny/ask）、单调层（guard 类型上没有 allow 返回值，后注册者无法翻案）、包装层（只允许触碰 signal 一个字段）。"插件顺序不影响安全结论"可以用类型设计而非纪律保证。
- 尽早对模型参数做一次快照+冻结，并明确立场：策略层能不能改写参数？这里选择不能，换取 log/UI/执行三方一致（model-visible ⟺ logged）。无论选哪边，这个决定应该显式做出并写下代价，而不是默认留口子。
- 工具的 UI 呈现设计成 args 的纯函数 + 少量 card 词汇表：UI 不 special-case 工具名，session log 重放天然可行，"UI 格式污染模型结果"被架构性禁止。需要结果时刻事实的卡片用一个显式投影（presentationMeta）持久化，而不是持久化整个结果值。
- 可见性收敛到唯一 resolver：模型看到的 schema、get() 查到的定义、实际 dispatch 的定义必须出自同一个函数；prompt 里声明的调用规则必须与 executor 的拒绝谓词是同一个谓词。"从 prompt 里删掉"不等于"禁止"。
- 拒绝消息要给模型指路：当一个 prompt 声明过的工具被拒绝时，错误文本带上正确路径（如"从 run_code 程序里调用它"），否则模型会把拒绝理解为部署损坏并停止自我纠正。
- 把 prompt 确定性当 KV-cache 成本工程：canonical 工具排序用 code-unit 字典序（locale 无关）、易变内容移出 system prefix 改为消息流里的 context snapshot、模板插值 fail-loud、为每个会影响 prompt 的模块写清楚它的缓存失效范围。
- 可选服务的 fail-closed 降级：审批 seam 用 ctx.get('approval') 机会式消费，缺席时 ask→deny 且理由可区分（人拒绝 vs 无通道），系统在任何组合下语义明确。
- 外部工具源（MCP）归一为一等工具而不是旁路：桥接层只负责命名归一（确定性 + hash 防碰撞）、代际原子交换（整代或零）、错误路径归一（isError→throw），策略、审批、日志、Code Mode 全部免费继承。

## questionable
- 防御深度与自家规则的张力：仓库 CLAUDE.md 写着"Trust TypeScript at typed same-process boundaries"，但 registry 防 arguments getter 偷换 finalizeContent 回调（:1399-1410）、防 hostile thrown value 劫持 instanceof/字符串化（errorMessage 的 try/catch，:608-622）。对 DeepSeek 这种要承接第三方插件生态的开源框架或许成立，自用 agent 系统里这些是纯开销，不必照搬。
- 包粒度只在他们的处境下成立：工具注册表、系统提示词、超时执行、重复调用提醒各自是独立 npm 包，219 个包配套 per-file 100% 覆盖率门、每包 invariant 文件、每包双语 README + Model Experience 小节。这套制度成本由"用 agent 开发 agent"的工作流（Agent Notes、doc-sync 门）摊薄；小团队照抄会被制度压垮，取其设计原则、弃其包结构即可。
- Code Mode 的全部机械（executor collapse、per-run 调度池、dispatch log spill waterfall、双语言 SDK codegen，约 673 行 code-mode.ts + 1100 行类型渲染）只有在工具数量大、schema token 成本敏感、且愿意承担"中间值不可从日志重建"的审计缺口时才回本——他们自己也把后者列为 Known Limitation。
- 五个 weak 侧表 + 调度器三态联合类型是为并行工具调用与 readonly 视图服务的精密机械；如果你的系统串行执行工具，一个带内部可变字段的 execution 对象能省掉大半复杂度。
- presentationMeta 的"канonical value 永不落盘"立场值得质疑一次：它省了存储并强化了投影纪律，但也意味着任何未预先投影的结果事实在重放时永久丢失，UI 需求变化时旧 session 无法补渲染——这是把灵活性换确定性的单向门。
- 严格插值无转义语法（想在 prompt 里写字面 {{name}} 做不到，README 承认 deferred）体现了"YAGNI 到需要为止"的纪律，但也说明 fail-loud 策略的边角会先于功能完整性暴露给用户。