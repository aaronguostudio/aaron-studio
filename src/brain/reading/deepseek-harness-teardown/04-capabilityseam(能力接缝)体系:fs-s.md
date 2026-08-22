# capability seam(能力接缝)体系:fs / shell / subprocess / terminal / lsp / sandbox / web / e2b

DeepSeek Harness 把每个执行能力(文件、bash、子进程、PTY、LSP、沙箱、web)都拆成一条"seam":一个拥有 ctx key 的抽象类 Service Definition、一到多个可互换的 Service Provider、以及只依赖抽象的 Consumer(通常是模型工具)。这套体系解决的核心问题是:agent 的执行基底(本地机器 vs 远程沙箱 vs 受限沙箱)必须可整体替换,而工具层、审批层、prompt 层完全不动。验证结论是它确实做到了——E2B 远程沙箱只用 3 个包(sandbox 生命周期 owner + fs 适配器 + subprocess 适配器)就把 Bash、持久 PTY、LSP 三类工具整体搬进远程 Linux,零 fork;OS 级沙箱(bwrap/Landlock/Seatbelt/Windows ACL)与模型可见的 escalation 审批协议也全部横切在 seam 层完成。代价是约 30 个包、2.3 万行源码、极宽的接口 JSDoc 合同,以及一套必须靠 CI gate 和 Agent Note 纪律才能维持的治理体系。

## 三角色缺一不可:Service Definition / Provider / Consumer 才构成一条 seam

机制：Service Definition 是一个注册 ctx.<key> 的抽象类(明确规定不能是 TypeScript interface,因为要携带运行时注册、构造校验和词汇类型),例如 ShellExecutor extends Service 注册 ctx.shell;Provider 是子类插件(bash-local/bash-sandbox/pwsh-local),同一 context 只允许一个实现,装第二个直接抛异常(fail-loud 而非优先级仲裁);Consumer(tool-bash、hooks 桥)只 inject 抽象。'一个角色不算 seam'的深层理由:可替换性是被三角齐备**证明**出来的,不是声明出来的——只有 Definition 没有第二个 Provider 是投机抽象,只有 Provider 没有中立 Consumer 说明工具已耦合实现。包级规则还要求'为所有当前 Consumer 设计 Definition',工具 schema、UI、传输细节严禁泄入服务合同;反向坏味道是'只有一个内部调用者的公共服务方法'。角色通常各占一包,但允许合并(dsh-llm 同时拥有 Definition 和 Consumer)——判据是'是否独立演化',不是仪式。

证据：docs/glossary.md:9;packages/shell/shell/src/index.ts:46-101(abstract ShellExecutor、duplicate-service throws);packages/CLAUDE.md 'Design Service Definitions for all current Consumers';.agents/notes/implemented/architecture/2026-06-13-capability-seams.md(被 packages/CLAUDE.md 引用)

价值：给'什么时候该抽象'一个可操作的判定标准,直接对抗 agent 框架里最常见的两种病:为想象中的第二实现提前抽象,和工具直接 import 具体执行代码导致换基底要改每个工具。'装第二个 provider 就抛'比注册表+优先级简单且组装错误立刻暴露。

## '一个执行世界':fs + subprocess 两条 seam 共同定义执行基底,PTY 被下沉为 subprocess 的深原语

机制：关键洞察是:想让工具整体迁移,接缝必须切在 OS 原语层而非工具层。ctx.fs 除了读写还提供另一能力所需的路径事实——processPath(target)、fileUrl(target)、contains(parent,child)(fs/src/index.ts:126-144),使 LSP 能把 provider 拥有的 file: URI 贯穿协议而不解析后端身份;ctx.subprocess 拥有 resolveExecutable(可执行解析属于执行世界,不属于宿主 PATH)、spawn(全显式 spec,'this seam applies no defaults')、以及 spawnTerminal——PTY 分配、前台进程组检查/发信号、整会话树清理被承认为'无法用普通管道重建'的一个深原语(subprocess/src/index.ts:118-139, types.ts:204-264)。于是 bash-local(inject=['subprocess'])、terminal-bash(inject 含 'subprocess',经 ctx.subprocess.spawnTerminal)、lsp-stdio(inject=['fs','lsp','subprocess'])全部只碰这两条 seam;E2B 侧仅 3 个包:ctx.e2b 持有唯一 SDK 句柄和远程 cwd(e2b/e2b/src/index.ts:74-137),fs-e2b、subprocess-e2b 各实现一条 seam(subprocess-e2b/src/index.ts:52-206 完整实现 spawn/spawnTerminal/resolveExecutable)。README 明言三个消费者 'need no E2B-specific forks'。什么不迁移也被显式圈定:模型调用、session 状态、PTY readiness 策略、LSP 协议状态都留在宿主——只有可变的 coding world 出海。

证据：packages/e2b/README.md:13;packages/subprocess/subprocess/src/index.ts:102-140;packages/subprocess/subprocess/src/types.ts:204-264;packages/fs/fs/src/index.ts:116-144;packages/terminal/terminal-bash/src/index.ts:25,108-110;packages/lsp/lsp-stdio/src/index.ts:47,146,157;packages/shell/bash-local/src/index.ts:103,226;.agents/notes/implemented/architecture/2026-07-28-portable-execution-world-consumers.md

价值：这是本子系统最值得学的一手:它用'deletion test'(删掉某适配器包,领域行为是否会散落进 provider?)判定接缝位置,并明确拒绝了'每个远程 provider 一套 PTY/LSP 包'和'把整个 harness 搬进沙箱'两个更省事的方案。Agent Note 里连远程实现的语义妥协(无同步 PID、PTY stdin-wait 事实不可得)都被记录为 provider constraints 而非加兼容层——诚实的接口比宽容的接口更可维护。

## shell 的 request/spec 拆分:默认值是显式 resolve() 步骤,不是隐式 ?? fallback

机制：ShellExecRequest 是调用方视角(command 必填,workdir/timeoutMs/stdoutMaxBytes 全可选);ShellExecutor.resolve(request): ShellExecSpec 是唯一的默认填充+封顶点(timeout 被 cap、stdout 预算落定);run()/start() 只接受 resolved spec,'never a raw request'。这被全仓奉为包边界模板:下游 subprocess seam 走到极端——SubprocessSpawnSpec 每个 stdio disposition、graceMs、cwd 全必填,seam 自身零默认,JSDoc 直接引用'the dsh-shell request/spec split is the owning template'。组合力在 bash-sandbox 体现:它 override resolve() 一行,把 per-call sandboxPolicy(request 携带的 ?? ctx.sandboxPolicy.resolve())stamp 进 spec,run/start 逻辑完全复用父类。环境变量合并顺序也在 spec 层被定死:scrub 后的父环境 → 显式 env → dshEnv(DSH_* 受管事实),保证调用方 env 永远压不过受管 fact。

证据：packages/shell/shell/src/types.ts:33-110;packages/shell/shell/src/index.ts:79-100;packages/subprocess/subprocess/src/types.ts:62-74;packages/shell/bash-sandbox/src/index.ts:79-86

价值：解决 agent 系统里默认值的经典腐坏路径:默认散落在执行函数内部的 ?? 里,导致'实际跑的超时是多少'无法回答、测试无法穷举。把 resolve 做成抽象方法意味着每个 provider 的默认策略有唯一属主、可单测、可被子类组合覆写——比'config 对象一路透传'纪律性强得多。

## OS 沙箱平台链 + denial 方言分类:把内核拒绝翻译成模型可读的结构化事实

机制：ctx.sandbox 的唯一动词是 confine(argv, policy) → ConfinedArgv:包裹后的 argv、enforcement('full'/'partial')、denialSignatures(该 backend 自己的 stderr 方言:bwrap 是 'read-only file system',Landlock 是 'permission denied',Seatbelt 是 'operation not permitted')、runnerFailureRules(区分'runner 自己没起来=命令从未执行'vs'确实被策略拒绝',带 exit-code 门控防止命令输出里恰好包含签名被误判)。sandbox-local 按平台选链:Linux bwrap→Landlock(native addon 自约束启动器,老内核 ABI 自报 partial)、macOS 唯一候选 sandbox-exec(功能性 probe:真的用 read-only profile 跑一次 true)、Windows ACL 受限令牌;多候选才 probe,probe 一次缓存终身;无可用 runner 时抛 SANDBOX_UNAVAILABLE fail-closed——绝不静默降级为不受限执行。bash-sandbox 消费时严格排序:runner failure 优先于 denial 分类(因为 runner 诊断可能含 denial 词)。

证据：packages/sandbox/sandbox/src/index.ts:90-144,152-176;packages/sandbox/sandbox-local/src/index.ts:159-166(PLATFORM_CHAINS),201-240(DENIAL_SIGNATURES/RUNNER_FAILURE_RULES),492-539(probe 链);packages/shell/bash-sandbox/src/index.ts:88-113;native/README.md

价值：'consumer 交出即将 spawn 的精确 argv,provider 返回替换 argv'是极小且正确的接口——沙箱不需要知道 shell 语义,shell 不需要知道 bwrap 参数。denial 方言按 backend 携带(而非跨 backend 并集)体现了少见的严谨:并集会声称某 backend 从不产生的拒绝。fail-closed 加 enforcement 诚实上报 partial,是安全能力该有的姿态。

## 策略、执行、审批三分离:一个 policy home + per-call 策略 + 模型可见的一次性 escalation 协议

机制：ctx.sandboxPolicy 是部署默认 mode + workspace root 的唯一家,bash-sandbox 和 fs-sandbox 两个 enforcing family 都读它——文档明言'so bash and fs cannot confine to different roots';fs-sandbox 甚至与 Seatbelt profile 共用同一个 writableRoots 函数推导可写根,防 bash/fs 漂移。策略是 per-call 而非 per-provider:SandboxPolicy 随每次调用携带(同一瞬间 bash 可在 read-only 而子 agent 的状态目录可写)。拒绝发生后,tool 层给模型渲染两行固定 marker:'[sandbox: file access denied under X mode]' + '[sandbox: escalation available — retry this exact command once with sandbox_permissions + justification]'——提示放在决策点而非依赖模型记住工具描述。模型带 sandbox_permissions+justification 重试时,approveEscalation 在任何执行前按序判定:strict widening(对照该调用的 effective mode,是执行期检查而非 schema 约束,因为 schema 是全局的而 mode 是 per-call 真值)→ ctx.approval.request 弹人审 → 'allowed-once' 只授权这一次调用。escalation 模块用结构化泛型 EscalationApprover 避免依赖 approval 包,bash 与 fs 两族共享同一份措辞与顺序。fs 侧的 fence 注释异常坦诚:进程内 canonicalize-then-contain 是'containment, not a security boundary',内核级隔离归 bash-sandbox——两层各自的威胁模型被写清而非混淆。

证据：packages/sandbox/sandbox/src/escalation.ts:28-31,71-86,157-189;packages/shell/tool-bash/src/index.ts:194-226,334-347;packages/shell/tool-bash/src/render.ts:46-49;packages/fs/fs-sandbox/src/index.ts:1-33;docs/capability-seams.md:452(ctx.sandboxPolicy 行)

价值：这是'默认最小权限 + 人在环'的完整闭环工程化样板:模型不会被永久卡死(有官方重试通道),人不会被反复打扰(一次批准只覆盖一条命令一次),审计自包含(justification 逐字进审批记录)。'strict widening 在执行期而非 schema 期检查'这个细节,反映了对'schema 是注册表全局、真值是 per-call'的准确区分——多数框架会在这里犯错。

## 凭证 scrub 是 spawn seam 的单点职责

机制：subprocess seam 导出唯一的 scrubbedParentEnv():剔除 /KEY|PASSWORD|SECRET|TOKEN/i 命名的环境变量和全部 DSH_* 名字(大小写不敏感,针对 Windows env 大小写折叠),PATH/HOME/locale/代理存活;显式 spec.env 在 scrub **之后** merge,所以有意转发某个凭证是一个显式 opt-in 而非漏洞。无法走 service 的 spawner(node-pty、SDK 托管传输)也 import 同一个函数,全仓一份 scrub 定义。

证据：packages/subprocess/subprocess/src/index.ts:37-66

价值：agent harness 自己持有 DEEPSEEK_API_KEY 等密钥,而它的核心业务就是替模型跑任意子进程——'父进程凭证默认不进子进程'必须是基底层不变量,不能指望每个工具记得处理。merge 顺序设计(scrub 先、显式后)同时保住了安全默认和逃生通道。

## tradeoffs
- 抽象税以接口宽度支付:为让最弱 provider 也能实现,subprocess 的 spawnTerminal 一个方法背后是 60 行 JSDoc 合同加一整篇 Agent Note 的取舍论证;fs 拒绝为 LSP 单独加 bounded-read 原语(让 LSP 自己在流上限长),说明每加一个原语都要向所有 provider 收税——他们守住了,但守住本身就是持续成本。
- 组合正确性从编译期转移到组装期:fs+subprocess '必须描述同一个执行世界'是文档约定,类型系统抓不住 fs-local 配 subprocess-e2b 这种错装;缓解手段是 fail-loud、per-package invariant 和真实组装测试,但这要求组合者读文档。
- 正确性大量依赖散文合同:'Implementations must honor these semantics'式的义务清单(done 何时 settle、readOutput 不重复投递、teardown 达到 quiescence)靠 provider 作者自觉和测试覆盖,而非类型;换一个不读 JSDoc 的贡献者,seam 的可替换性承诺会静默腐坏。
- 规模成本可量化:仅本子系统 7 个 family 约 2.27 万行 src 分布在 30+ 个包,每包固定携带 README(双语)、invariant 模块、tsconfig、独立测试;shell 一个 family 就是 9 个包。
- E2B 远程实现的运行时代价:进程状态靠 20ms/tick 的 control-plane 轮询,沙箱刻意 ephemeral(无 reconnect、无持久化、超时即删),POC 语义妥协(无同步 PID、PTY 前台事实不精确)被接受而非修补——这是'诚实边界'路线的直接账单。
- 一个 context 一个 provider(装第二个即抛)换来了组装清晰,也意味着运行时不能混用两个 shell 执行器或按 session 路由到不同基底;按会话选基底必须走 per-agent scope 组合,复杂度上移。

## learnables
- 定义抽象前先凑齐三角:至少一个真实 Provider + 一个不知道实现的 Consumer,才配得上一条 seam;工具代码里出现对具体实现包的 import 就是接缝失败的信号。'装第二个实现直接抛异常'比注册表+优先级机制更适合大多数团队。
- 想让整套工具可迁移到远程/容器沙箱,接缝要切在 OS 原语层(文件系统 + 子进程 + PTY 原语 + 可执行解析 + 路径事实),绝不切在每个工具层;检验标准是 deletion test——删掉某个适配器,领域逻辑是否会散进 provider。承认 PTY 是管道无法重建的'深原语'并将其纳入 subprocess 接口,是让终端类工具免 fork 的关键一步。
- request/spec + 抽象 resolve() 模板值得直接抄:调用方视角的可选字段请求,经唯一的 resolve 步骤变成全必填、已封顶的 spec,执行函数只收 spec。默认值从此有唯一属主、可测、可被子类组合覆写。
- 沙箱做三分离:policy home 唯一(所有 enforcing 能力共读,防 bash/fs 各自圈地)、enforcement 按 OS 成链并功能性 probe(fail-closed,无 runner 绝不裸跑)、tool 层 escalation 协议(拒绝时在结果里就地给出重试通道,strict-widening 在执行期校验,审批 allowed-once 只覆盖一次调用)。denial 与 runner-failure 必须区分且 runner-failure 优先。
- 凭证 scrub 放在 spawn 单点:模式匹配剔除凭证形名字 + 框架命名空间变量,显式 env 在 scrub 后合并作为唯一逃生口——这条对任何会替模型跑子进程的系统都是底线不变量。
- 策略随调用携带而非固定在 provider 上:同一时刻不同调用可在不同 mode 下受限,批准的 escalation 是'带更宽策略的新调用'而非全局状态翻转——极大简化审计与并发推理。
- 非平凡设计决策写成含'被拒绝方案'的决策记录(Agent Note)与代码同 PR 落库:2026-07-28 那篇让'为什么 PTY 不在 terminal 包里实现'三年后仍可回答,这比架构图更保值。

## questionable
- 三角色包拆分的仪式性成本对小团队不成立:DeepSeek 处在 pre-release、无外部消费者、可自由重命名重打包,且明显用 agent 自动化维护双语 README、invariant gate、生成式 seam 目录——离开这套 CI 纪律和自动化投入,30 包的治理开销会压垮 3-5 人团队。合并到'一个 capability 一个包、内部分层'能拿到 80% 的好处。
- 每包强制 invariant 模块、README Known Limitations 段、Model Experience 段等仓库级仪式,是用 gate 换一致性的极端路线;它假设贡献者主要是 agent(便宜、服从 gate),人类团队照搬会把精力烧在喂 gate 上。
- denial 分类依赖 stderr 子串匹配内核方言('read-only file system'/'permission denied'),backend 或 locale 升级即可能静默失准;他们用 per-backend 签名和 exit-code 门控尽力加固,但这本质是把不可观测的 OS 行为翻译成模型事实的脆弱桥——照搬前应评估你的场景能否改用结构化信号(如 fs-sandbox 的进程内 fence 就能抛结构化错误)。
- E2B 集成明确是 POC:轮询式进程管理、无 reconnect、沙箱即抛,不能当生产远程执行方案参考;它的价值在证明接缝位置正确,而非提供可用的远程 runtime。
- subprocess seam '零默认、全显式'(每次 spawn 写全 stdio disposition/graceMs/cwd)在他们的语境里由 request/spec 模板消化,但若没有配套的 resolve 层,直接照搬会把样板代码摊到每个调用点。
- macOS 依赖 Apple 已标记 deprecated 的 sandbox-exec CLI,靠功能性 probe fail-closed 兜底——姿势正确,但等于把平台风险推迟到某次 macOS 升级当天;依赖此路线的团队需要预案(如迁到 Endpoint Security 或容器)。