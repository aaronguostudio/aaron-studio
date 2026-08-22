# compare-critic

DeepSeek Harness 与 Claude Code、Codex CLI、opencode 的架构级横向对比。DSH 是建立在 vendored Cordis 插件框架上的约 226 包 monorepo，核心差异化在三处：扩展点深入到 agent loop 内部的 waterfall 事件（对手的 hooks/config 只是其扩展面的子集，DSH 自己的 CC/Codex hook 桥就是证明）；会话上下文是 append-only 事件日志的纯函数投影而非内存消息数组，压缩、fork、审计、keyless 快照测试全部由同一日志派生；以及系统性收编对手生态——桥接 CC/Codex 的 hooks、采纳 SKILL.md、实现 ACP、把 Claude Code 和 Codex 本体注册为自家 subagent provider。战略上这是模型公司用 MIT 开源 harness 商品化互补品、以 token 销售为收入端的打法，与 Anthropic 用闭源 harness 做模型护城河正好互为镜像。其最普适可抄的资产是日志派生上下文与 sandbox 的诚实执行报告接口；其插件框架粒度、continuable 子 agent 编排和重型文档治理则是 DeepSeek 处境（多产品复用、agent 维护仓库、生态野心）的特定产物，小团队不宜照搬。

## 维度a 扩展模型：插件树+patch 层 vs Claude Code hooks+MCP+skills vs Codex config

机制：DSH 的扩展点是最深的：agent loop 本身是一个可替换插件（packages/core/agent-loop），扩展者通过 Cordis waterfall 事件（agent/pre-step、agent/request、tools/pre-execute、llm/stream）直接进入请求装配路径，可以改写模型将看到的消息、否决 step、换掉 provider；部署侧用 profile→bundle→cordis.patch.yml 的有序层叠对任意插件行 id 做整体 config 替换或插入新行，且 `dsh --dump-config` 能打印机器真实启动的树。对比：Claude Code 的 hooks 是进程外 shell 协议（stdin JSON、exit code 语义），只能在预留的生命周期点 allow/deny/注入文本，无法改写循环本身；MCP 只增 tool，skills 只增 prompt 内容；Codex 的 config.toml 是参数层配置，几乎无行为扩展点。DSH 自己的 hooks-claude-code 桥就是这一深度差的活证据：它把 CC 的 7 个 hook 点全部映射为自家 waterfall 监听器（SessionStart→agent/session-start，UserPromptSubmit→agent/pre-step，PreToolUse→tools/pre-execute，Stop→agent/turn-stopping steer），并在 README 里直言'原生 cordis 插件能做得更强，桥只是兼容路径'——即 CC 的整个 hook 表面只是 DSH 扩展面的一个真子集。深的代价：扩展者必须理解 Cordis（waterfall 必须调 next()、effect 可逆、scope 语义），门槛远高于写一个 shell hook；且 waterfall 监听器跑在进程内，一个坏插件能挂掉整个循环，而 CC 的进程外 hook 天然故障隔离。

证据：docs/architecture.md:17-35（profile/bundle/patch 层叠）；packages/boot/app-boot/README.md（patch 整体替换 config、watchUserPatches 热更新、renderConfigDump）；packages/hooks/hooks-claude-code/src/index.ts:206-270（7 个 CC hook 点到 waterfall 的映射）；packages/hooks/hooks-claude-code/README.md（'bridge exists only as a compatibility path'）；docs/architecture.md:67-90（turn flow 中的 waterfall 点）

价值：该抄谁：大多数团队应抄 Claude Code 的进程外 hook 协议（隔离好、语言无关、用户学习成本低），只有当你的产品本体就是'可组合的 agent 平台'时才值得抄 DSH 的进程内深扩展。DSH 的 patch 层有一个独立可抄的点：'配置即可打印的最终真相'（--dump-config 输出的每一行都可被 patch 替换），这消灭了'配置合并后到底生效了什么'这类支持问题。

## 维度b 上下文管理：日志派生 deriveMessages vs 内存消息数组

机制：DSH 把 append-only SessionEvent 日志作为唯一事实源，模型历史不是存储的数组而是投影：agent-loop 每次请求前调 session.deriveMessages()（agent.ts:341），后者按 surfaceOp 标记折叠出 Message[]（index.ts:726-747，增量缓存、深冻结）。压缩不是改写数组，而是追加一个 surfaceOp:{op:'replace',start,end} 事件遮蔽旧区间——模型视图变小，但被遮蔽的原始事件仍在日志里，人类 transcript 读 append-origin 事件所以不丢历史（surface.ts:42-47 明确写了'model-visible surface 是人类 transcript 的错误来源'）。fork 因此变成纯数据操作：复制到某个 turn 边界的前缀即可（sessions.fork 拒绝在开放 turn 内切）。连 request header（system prompt+tool schemas）都作为 request/header 事件入日志，仓库不变量是'model-visible ⟺ logged'——任何到达模型的输入必须可从日志重建。对比：Claude Code 内部是内存消息数组+JSONL transcript，compaction 是有损改写，resume/fork 依赖 transcript 文件的约定格式；Codex/opencode 同为消息数组范式。DSH 范式的收益是可审计性（任何一次请求都能从日志逐字节重建）、确定性 replay（keyless snapshot 测试直接建立在这上面）、压缩与 fork 免费获得正确性。代价：每个新的模型可见输入都要先定义 SessionEvent 类型（声明合并+ignorable 语义+格式版本），写插件的摩擦显著变大；且日志永久保留 assistant/chunk 等原始流，存储持续膨胀。

证据：packages/core/agent-loop/src/agent.ts:341（每请求从日志派生）；packages/core/session/src/index.ts:726-747（deriveMessages 增量缓存实现）；packages/core/session/src/surface.ts:42-66（replace 遮蔽与双投影）；docs/subsystems/session.md（SurfaceOp、request/header 入日志、fork 边界、ignorable 标记）；docs/architecture.md:94-96（model-visible means logged 不变量）

价值：该抄谁：抄 DSH，这是全仓库最值得偷的一个设计。event-sourcing 上下文使压缩、fork、审计、快照回归测试从'各自实现的特性'退化为'同一日志的不同投影'，是消息数组范式做不到的。可以抄轻量版：不必抄它的全部封套（surfaceOp/sourceEventSeqs/ignorable），只抄'历史=日志的纯函数投影、压缩=追加遮蔽事件而非改写'这两条。

## 维度c 执行安全：sandbox seam + OS 后端 vs 各家内置 sandbox

机制：DSH 把 sandbox 拆成 seam：ctx.sandbox.confine(argv, policy) 返回包裹后的 argv + 结构化元数据，consumer（bash-sandbox）负责 spawn 和结果归因。三个设计点各家都没有：(1) enforcement: 'full'|'partial' 是被上报的事实——老 Landlock ABI、Windows ACL 的 Everyone/hardlink 缺口被诚实标记为 partial，而不是假装全覆盖；(2) denialSignatures 是按后端区分的'拒绝方言'（bwrap 报 EROFS、Landlock 报 EACCES、Seatbelt 报 EPERM），consumer 只按当前后端匹配 stderr，避免跨后端并集误判；(3) runnerFailureRules 把'sandbox 本身没跑起来'与'命令被正确拦截'区分为两类失败，且'confined policy 下静默降级为不受限执行'被写为非法。本地后端链是 Linux bwrap→Landlock（自研 native addon node-addon-landlock-run）、macOS Seatbelt、Windows ACL restricted token——Windows 覆盖是 CC/Codex 都没有的。policy 按调用携带而非固定在 provider 上，同一 provider 可同时服务 read-only 的 bash 和 workspace-write 的子 agent。对比：Codex 内置 seatbelt/landlock 但耦合在执行器里；Claude Code 的 bash sandbox 同样是产品内嵌不可换；两者都没有把'执行不完整'作为一级返回值。

证据：docs/subsystems/sandbox.md（SandboxEnforcement、denialSignatures、runnerFailureRules、per-call policy、'silent unconfined passthrough is never legal'）；packages/sandbox/sandbox-local/src/index.ts:2-80（bwrap 探测、seatbelt sandbox-exec 探测、runner 链）；native/（node-addon-landlock-run 自研 addon）

价值：该抄谁：机制上抄 Codex/DSH 共同的 OS 原语选型（seatbelt+landlock/bwrap 已是行业共识），但接口上抄 DSH 独有的三件事：partial enforcement 作为一级事实、按后端的 denial 方言、runner 失败与策略拒绝的区分。这三条直接决定 agent 收到'命令失败'时能否正确决策重试/升权/报错，是多数 harness 的盲区。

## 维度d 多 agent：命名 provider 注册表 vs Claude Code 的 Task 工具

机制：DSH 的 subagent 是 seam 而非工具：ctx.subagents 是命名 provider 注册表（spawn/fork/acp/codex/claude-code/dsh-sdk 六个 provider 共存），能力用静态 flags 声明（outputSchema/depthLimit/toolFilter/persona），请求需要而 provider 不支持则 UNSUPPORTED_CAPABILITY 拒绝，绝不接受后忽略。最激进的是产品级 provider：subagent-claude-code 直接通过官方 Agent SDK 把真实 Claude Code CLI 作为子 agent 跑在父会话工作区（index.ts:52-91），Codex 同理——竞争对手的产品被降格为自家编排图里的一个可插拔节点。子 agent 分两类：one-shot（返回 SubagentRun，含 structured output schema 强制捕获）和 continuable（持久子 Session + 进程内 Activation，FIFO inbox 唯一队列，父子所有权图管理 child-first 析构，report/interrupt/followup/list_agents 一套控制面）。对比：Claude Code 的 Task 工具是单一进程内实现，subagent 定义是 markdown 文件（persona+tool 白名单），无跨产品委托、无持久可续子会话（其 agent 会话相对短命且结果一次性返回）；opencode 亦然。代价：continuable 那套（Activation 状态机、所有权图、冷恢复、settled 通知）是仓库里最复杂的子系统之一，文档规格远超多数团队的需求。

证据：docs/subsystems/subagent.md（provider 注册表、SubagentCapabilities、one-shot vs continuable、Activation/ownership 图）；packages/subagent/subagent-claude-code/src/index.ts:52-91（CC 作为 provider）；packages/subagent/（subagent-codex、subagent-acp、subagent-fork-in-process 并列目录）；.agents/notes/implemented/feature/2026-08-04-claude-code-and-codex-subagent-backends.md（引用于 subagent.md:7）

价值：该抄谁：抄 DSH 的能力声明+fail-loud 校验（这是花十行代码就能抄到的正确性红利），以及'fork 型子 agent 继承父日志前缀'的实现方式（依赖维度b的日志范式，完成 turn 前缀即合法种子）。continuable 编排大多数场景不要抄——Claude Code 的一次性 Task 模型覆盖了 90% 需求且心智负担小一个数量级。

## 维度e 产品哲学：模型公司做开源 harness、拥抱对手生态的竞争逻辑

机制：DSH 与 Claude Code 同属'模型公司做 harness'，但战略相反。Anthropic 的 harness 是模型的分发护城河：闭源核心、扩展面收敛在受控协议（hooks/MCP/skills）上、harness 与 Claude 订阅绑定。DeepSeek 押注 MIT + everything-is-a-plugin + 系统性吸收对手事实标准：hooks-claude-code/hooks-codex 桥接两家 hook 配置（用户零迁移成本）、skill-filesystem 直接采用 SKILL.md 事实标准（src/index.ts:672-725 按 CC 的目录布局发现技能）、acp 实现 Zed 系 Agent Client Protocol、subagent 层把 CC/Codex 本体收编为 provider。这是典型的'商品化互补品'打法：模型按 token 计费是收入端，harness 越开放、越兼容，DeepSeek 模型的落地摩擦越低；同时把'harness 层的用户资产'（hooks 配置、skills、工作流）变成可携带的，反向削弱 Anthropic 用 harness 锁模型的能力。与独立 harness（opencode）的差别：opencode 中立于所有模型但无模型收入，必须自己找商业模式；DSH 可以永远免费，因为它是模型销售的获客渠道。llm seam 名义上 provider 无关，但 shipped provider 是 DeepSeek 自家（packages/llm 'DeepSeek providers'），且文档大量强调 KV-cache 命中——针对 DeepSeek 定价模型（cache 命中价差极大）的优化痕迹。

证据：README.md:53-55（MIT）；README.md:5-7（everything is a plugin）；packages/hooks/README.md（双方言桥）；packages/skill/skill-filesystem/src/index.ts:672-725（SKILL.md 布局）；packages/acp/README.md（ACP 服务器）；packages/subagent/subagent-claude-code/、subagent-codex/；CLAUDE.md 仓库布局注'llm/ … DeepSeek providers'；packages/boot/app-boot/README.md 的 KV Cache effect 小节（README 模板强制申报 KV-cache 影响）

价值：该抄谁：如果你不是模型公司，处境更接近 opencode 而非 DSH——'兼容对手生态'的打法只在你有别处的收入端（模型 token）补贴时才是纯收益，否则你在为竞争者的标准免费打工。可抄的是战术层：让用户的 hooks/skills 资产零成本迁入你的产品，是最便宜的获客手段之一，且 SKILL.md 这类事实标准的采纳成本极低。

## 维度f 汇总：如果自己造，各维度该抄谁

机制：扩展模型：抄 CC 的进程外 hook 协议做用户扩展面，内部可选抄 DSH 的 waterfall 拦截点（但不必上完整插件框架）。上下文管理：抄 DSH 的日志派生范式，这是六个维度里唯一'无条件抄'的项。执行安全：OS 原语抄 Codex/DSH 共识（seatbelt/landlock/bwrap），接口抄 DSH 的 enforcement/denial-dialect/runner-failure 三分类。多 agent：抄 CC 的一次性 Task 模型 + DSH 的能力声明校验，跳过 continuable 编排。产品哲学：模型公司抄 DSH（开源+兼容），独立团队抄 opencode（中立+自建商业模式），不要抄 Anthropic（闭源护城河需要你先有 Anthropic 的模型）。测试策略是隐藏的第七维度：DSH 的 keyless snapshot replay（pnpm run test:snapshot，录制一次真实 API、之后无 key 确定性回放整条 transcript）建立在日志范式之上，是所有 harness 里最强的回归形态，值得单独抄。

证据：CLAUDE.md Commands 小节（test:snapshot / test:snapshot:record）；docs/architecture.md:94-96；docs/subsystems/sandbox.md；packages/hooks/hooks-claude-code/README.md

价值：把六个维度的结论压缩成一张决策表，避免'整体崇拜或整体否定'——DSH 的价值分布极不均匀：会话日志范式和 sandbox 接口是普适资产，插件框架和 continuable 子 agent 是处境特定资产。

## tradeoffs
- 扩展深度换扩展门槛：waterfall/effect/scope 语义让插件作者的学习成本远高于写一个 CC shell hook，且进程内扩展点放弃了 CC 进程外 hook 的故障隔离。
- 日志范式换写入摩擦与存储成本：每个新的模型可见输入都要定义 SessionEvent 类型并处理 ignorable/格式版本语义；assistant/chunk 级原始流永久保留使日志随会话线性膨胀。
- seam 化换间接成本：sandbox/subagent/shell 全部三角色拆分（Definition/Provider/Consumer），一个能力至少三个包，理解任何行为都要跨包追踪；换来的是 provider 替换不 fork 消费者。
- 兼容桥换语义忠实度：CC hook 桥只支持 command 型 hook 子集，updatedInput/systemMessage 不生效，兼容是引流手段而非完整承诺。
- 治理体系换迭代速度：强制 invariant、双语文档、生成 catalog、Agent Note 制度保证了 agent 可维护性，但每个改动的固定成本显著高于普通仓库。

## learnables
- 会话历史做成 append-only 日志的纯函数投影（deriveMessages），压缩用追加 replace 事件遮蔽而非改写数组——审计、fork、确定性回放测试全部免费获得（packages/core/session/src/index.ts:726、surface.ts:42-66）。
- 'model-visible ⟺ logged' 不变量：任何到达模型请求的输入（含 system prompt 和 tool schemas，见 request/header 事件）必须可从日志重建，并用运行时不变量断言。这一条规则消灭了一整类'为什么模型看到了这个'的调试问题。
- sandbox 返回值三件套：enforcement full/partial 诚实上报、按后端的 denialSignatures 方言、runnerFailureRules 区分'沙箱没跑起来'与'命令被正确拦截'——直接决定 agent 对失败命令的后续决策质量（docs/subsystems/sandbox.md）。
- subagent provider 的能力声明 + fail-loud：请求需要 provider 不支持的能力时抛 UNSUPPORTED_CAPABILITY，绝不接受后静默忽略；可选方法的存在本身即能力（prepareContinuable），用 TS narrowing 做发现。十行代码级别的正确性红利。
- 兼容层是低成本获客：桥接对手的 hooks 配置格式、采纳 SKILL.md 事实标准、实现 ACP，让用户现有资产零迁移成本进入你的产品（packages/hooks、packages/skill/skill-filesystem、packages/acp）。
- keyless snapshot 测试：真实 API 录制一次，之后无 key 确定性回放整条 assembled-application transcript 作为回归门（test:snapshot），比 mock 单测和 e2e 都更接近'模型实际看到什么'。前提是上下文可从日志重建。
- 配置的最终真相可打印可替换：--dump-config 输出机器真实启动的每一行，且每一行都是 patch 的合法目标——层叠配置系统的可支持性（supportability）标杆。

## questionable
- 'everything is a plugin' 对 219 个包的粒度：session、tools、agent、agent-loop 拆成独立包对 DeepSeek 的多产品复用（web/headless/acp/sdk/python）成立，但小团队照搬会把 80% 精力花在 seam 设计和包边界维护上。Claude Code 用单体 + 三个受控扩展协议达到了用户可感知的等效扩展性。
- waterfall 进程内拦截点作为公开扩展面：一个不调 next() 或抛异常的第三方插件能破坏整条请求链，故障域远大于 CC 的进程外 hook。DSH 自己能承受是因为插件生态尚小且主要是第一方。
- continuable subagent 子系统（Activation 状态机、所有权图、child-first 析构、settled 通知、三档缓存的 listChildren）复杂度与其当前需求不成比例——docs/subsystems/subagent.md 的规格长度本身就是警报。CC 的一次性 Task 模型证明了 90% 场景不需要这些。
- 日志永久保留 assistant/chunk 原始流且 seq 必须连续（不可过滤），replay 保真的代价是存储和加载成本随会话长度线性膨胀，长会话/高频用户场景下需要仓库尚未展示的分层存储方案。
- patch 层'整体替换 config 不做 deep-merge'（app-boot README 明示 Known Limitation）：语义干净但用户覆盖一个字段就要重述整个 config，bundle 升级新增字段时用户 patch 会静默丢掉新默认值——这是把正确性成本转嫁给了用户。
- 拥抱对手生态的战略只在'模型 token 是收入端'时成立：hooks-claude-code 桥自己承认能力受限（http/mcp_tool/prompt/agent 型 hook 全部 parsed-and-skipped，updatedInput 不生效），兼容承诺实际是子集兼容，重度 CC 用户迁移后会遇到静默行为差异。
- 文档与不变量的治理成本极高（每包强制 invariant 清单、双语文档、生成式 catalog、Agent Note 制度）：这套体系明显为'agent 维护 agent 仓库'优化，人类小团队照搬会被流程压垮。