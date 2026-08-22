# 生态兼容层（skill / MCP / hooks 桥 / extensions / preset）

这个子系统回答的问题是：一个后发 agent 框架如何让用户带着 Claude Code / Codex 生态的存量资产（SKILL.md 技能库、CLAUDE.md/AGENTS.md 指令文件、hooks.json、MCP server）零迁移地切换过来，同时不让兼容需求反向绑架自己的内核设计。它的答案是严格分层：本体扩展面完全自主（一切皆 Cordis 插件 + typed interception points），格式层对事实标准全盘采用（SKILL.md frontmatter、AGENTS.md、mcp__server__tool 命名），语义层则做"显式声明的不完整兼容"（hooks 桥明确列出 Claude Code 30 个事件里 23 个不支持）。preset 机制进一步把"agent 有哪些模式"从代码分支降格为四份可挂载的 cordis.yml 数据文件，skill/MCP/hooks 都只是这份组合文件里的普通插件行。整体是一套教科书级的"挑战者兼容策略"，但其维护税和 pre-release 特权（如 fail-closed 拒绝旧拼写）需要辨别后再借鉴。

## Skill 是三角色 seam 里的普通插件行，格式上彻底投降给 Claude Code 的 SKILL.md 事实标准

机制：skill 能力拆成 Service Definition（dsh-skill 的 ctx.skills 注册表）/ Provider（dsh-skill-filesystem 扫盘）/ Consumer（dsh-tool-skill 负责 <available_skills> 目录注入 + skill({name}) 加载工具）三角色。在 standard preset 的 cordis.yml 里，skill-filesystem 和 tool-skill 就是与 tool-bash、compaction 平级的两行——agent '是否有技能'不是内核开关，而是 preset 是否挂载 Consumer 这一行。格式采用 <name>/SKILL.md + YAML frontmatter（name/description/whenToUse/disable-model-invocation/user-invocable），与 Claude Code 技能格式逐字段对齐，甚至接受 Claude 实践中的 yes/no/on/off 布尔写法；他们自己早期的 camelCase 拼写被 parser 直接拒载（fail-closed 掉出目录并警告），明确拒绝保留 alias，理由是'外部格式就是 kebab-case 的 Claude skills contract，本仓库没有已发布的兼容义务'。同时对 Claude Code 的 context:fork、allowed-tools、arguments 等字段显式 defer——只实现有 consumer 和 enforcement contract 的字段，绝不解析后不执行。目录注入走 agent/pre-step 的 durable user-role <system-reminder>，只含 name+description，全文 body 由模型按需经 skill 工具加载（渐进披露）。

证据：packages/skill/README.md; docs/subsystems/skills.md:64-85,229-235; .agents/notes/implemented/feature/2026-07-05-skill-system.md（决策与 Deferred 节）; .agents/notes/implemented/feature/2026-07-28-skill-invocation-policy.md（'Treat camel-case frontmatter as an alias — Rejected'）; apps/cli/config/agent-presets/standard/agent.cordis.yml（skills 段注释：注册表在 host、这两行落进本 preset 的 layer）

价值：它清楚区分了'格式兼容'与'语义全兼容'：格式全抄（用户的技能库原样可用），语义只实现有执行契约的子集且宁缺毋滥——解析了却不执行的字段是最阴险的兼容谎言。skill 和主循环'并排站'则证明了插件架构的自洽：技能系统这种通常被做成内核特性的东西，在这里可以整体拆下来换 provider（本地/嵌入/远程）而不动模型侧契约。

## 零配置双读：中立标准（.agents、AGENTS.md）全采，竞品专有标准（CLAUDE.md）降为 fallback

机制：skill 扫描按 rank 一次排定六个根：project .dsh/skills(100) > project .agents/skills(200) > customSkillDirs(300) > ~/.dsh/skills(400) > ~/.agents/skills(500) > bundled(600)，其中 agentsHome 默认 $DSH_AGENTS_HOME ?? ~/.agents，无需任何配置即读中立技能目录。指令文件由 dsh-agent-instructions 处理：每目录候选列表默认 ['AGENTS.md','CLAUDE.md']，同目录只取第一个存在者（防转型期仓库双文件重复注入），从 git root 到 cwd 逐层加载，SHA-1 digest 做变更检测，byte budget 截断先弃宽层文件。用户全局文件固定 $DSH_HOME/AGENTS.md。注意兼容有明确的两档：Codex 系中立标准（AGENTS.md、~/.agents）当 native 首选；Claude 专有名（CLAUDE.md、CLAUDE.local.md）当兼容 fallback；而 .claude/CLAUDE.md、.claude/rules/*.md、import 指令显式 deferred。自家命名空间（.dsh、AGENTS.md at $DSH_HOME）始终 outrank 中立层，保留自己的演化权。

证据：packages/skill/skill-filesystem/src/index.ts:36-40（rank 常量）,163-164（agentsHome 解析）,246-258（六根装配）; .agents/notes/implemented/feature/2026-06-24-workspace-context.md（File Names And Precedence、'Load both — Rejected'、Deferred 节）; .agents/notes/implemented/architecture/2026-07-24-single-harness-home-resolver.md

价值：这是对 Claude Code 生态最省力也最聪明的姿态：不迁移、不转换、不要求用户表态，用户的 ~/.agents/skills 和仓库里的 CLAUDE.md 直接生效。同时'一目录一 winner'解决了转型期仓库同时存在 AGENTS.md 和 CLAUDE.md 时的重复/矛盾注入问题——这个小决策比看起来重要，因为重复注入的指令文件是真实世界最常见的脏数据。

## hooks 桥的纲领：'a bridge is a compatibility adapter, not a power tool'——共享协议库 + 方言桥 + 显式不完整清单

机制：本体扩展面是 typed interception points（agent/pre-step、tools/pre-execute 等 waterfall/serial/emit 事件），native hook 就是普通 Cordis 插件。dsh-hook-protocol 拥有方言无关部分：exit 0 携带结构化 JSON / exit 2 以 stderr 为 blocking reason 的 codec（codec.ts:59-89，total function，坏 JSON 降级为纯文本）、deny>ask>allow 的 most-restrictive 序无关合并（merge.ts:35-52,62-100）、detached run 的 abort+drain。dsh-hooks-claude-code 只拥有 CC 方言：hooks.json 解析、CC 形 stdin payload（session_id/transcript_path/cwd/hook_event_name）、${CLAUDE_PLUGIN_ROOT} 替换、CLAUDE_PROJECT_DIR 默认到 session cwd。7 个事件映射到 5 个扩展点：UserPromptSubmit deny→reject，context-only 则必须 next() 委托后再把 context 折进下游 enter 决策（避免 waterfall 短路后续 policy 插件，index.ts:219-235）；Stop 阻塞→agent.steer() 强制续步（index.ts:270-277）。每次 hook 调用写 hook/invoked / hook/result 成对 session 事件，串行执行就是为了让这对事件在日志中相邻。README 逐条列出 23/30 事件不支持、每个已支持事件的 partial 字段（updatedInput 记日志但不执行——因为 rewrite 牵动审计/历史/展示三处一致性，是设计单元不是字段），并引用 Claude Code 官方文档为对照基线。

证据：packages/hooks/hooks-claude-code/src/index.ts:206-296（七个事件映射）,322-361（CC payload 构造）; packages/hooks/hook-protocol/src/merge.ts:62-100; packages/hooks/hook-protocol/src/codec.ts:59-134; packages/hooks/hooks-claude-code/README.md:87-98（Known Limitations 清单）; .agents/notes/implemented/feature/2026-06-30-hook-bridges.md

价值：三点可直接搬走：(1) 兼容桥与本体扩展面解耦，桥永远只做翻译，'更强的需求写 native 插件'是明说的出口，防止外部协议的怪癖渗入内核事件设计；(2) 序无关的 most-restrictive fold 让 hook 执行顺序不影响安全决策，这是把并发问题从安全路径上拿掉的干净手法；(3) 把'不支持什么'当一等公民写进 README 并锚定上游官方文档——大多数兼容层死于假装全兼容后的静默错误，这里选择了诚实的部分兼容。

## preset 把'模式'降格为数据：四种模式就是四份 agent.cordis.yml，挂进 agent 的 scope context

机制：minimal/standard/code/cordis 四个 preset 各是一个目录一份组合文件；code = standard 原封不动 + 一行 tool-presentation(mode:code)，cordis = standard + 自我修改工具集 + 教学 skill。机制上 agent 本身是 registration scope，mountPreset 把整份 cordis.yml 作为 Include 子树 plug 进 agent 的 scope context（mount.ts:332-381），子树内所有 ctx.tools/systemPrompt 注册自动落进该 agent 的 layer 并随 agent 销毁 unwind——注册表不加任何'preset tier'。组合切成 host/agent 两平面：注册表与跨会话设施是 host 单例，preset 只贡献行。三重挂载期审计：leakedServices 扫描服务 store，发现子树把服务发布进 root realm（进程级、第二个会话必撞）即拒绝挂载（mount.ts:189-203,361-367）；inactiveRows 让等不到依赖的行 fail loud；PresetTree.write() 覆盖为空，防止 Loader 在 agent 销毁时把垂死子树写回 preset 文件、将 shipped preset 截断成 []（mount.ts:94-111）。import() 双基址：包名从 harness 安装处解析、相对路径从 preset 目录解析（mount.ts:81-92），让用户家目录里手写的 preset 能 import @deepseek-ai/dsh-*。preset id 记入 session header，resume 重建当时的组合而非今日默认；有 turn 后禁止切换。实测每会话挂载 ~3ms/~600KB（standard ~1.31MB/135ms），故选 per-session 隔离为默认。

证据：apps/cli/config/agent-presets/{minimal,standard,code,cordis}/agent.cordis.yml; packages/preset/agent-presets/src/mount.ts:57-111,189-203,332-381; .agents/notes/implemented/architecture/2026-08-03-per-session-agent-presets.md; .agents/notes/implemented/architecture/2026-08-09-layered-skill-registry.md（skill 注册表回迁 host 并按 scope 分层、nearest-wins 遮蔽）

价值：'模式'在多数 agent 产品里是散落在代码里的 if-else 和 feature flag，这里变成可 diff、可复制、可由用户乃至由 agent 本人（cordis preset）编辑的一份数据文件。更值得学的是安全边界的处理方式：不靠约定而靠挂载期机器审计（root-realm 服务泄漏、写回禁令），把'preset 作者会犯的错'变成 mount 时的确定性失败。附带教训也诚实记录：skill 注册表曾整个塞进 preset realm，导致 host 侧消费者永久挂起，最终回迁为 host 单例 + per-scope 分层——'哪一层拥有什么'要按'谁在会话之外读它'判定，不是按'感觉上属于 agent'。

## MCP 桥：命名与 Claude Code 同形，加确定性 hash 归一化与 generation 原子替换

机制：每个 MCP server 一个插件实例（cordis.yml 一行），发现的工具以 mcp__<serverName>__<rawName> 注册进 ctx.tools——与 Claude Code/Codex 的命名习惯逐字相同，模型侧提示词经验可直接迁移。名字超 64 字符或含非法字符时，截断并追加 (serverName,rawName) 的 12 位 SHA-256 hash，保证命名是纯函数、连接顺序与重连不改名（tools.ts:45,97-101）。工具集按 generation 管理：list_changed 重新同步时，抓取失败保留旧 generation，注册冲突则整代回滚绝不留半套；重连按 outage 预算退避，存活超过 maxDelayMs 才重置预算，防 crash-loop 服务器无限重启。只桥接 Tools，Resources/Prompts 因'无 harness 消费者'显式 deferred。

证据：packages/mcp/mcp-client/src/tools.ts:42-101,115,165; packages/mcp/mcp-client/README.md:53-71,109-115

价值：两个可复用的工程决策：(1) 工具名沿用竞品的事实约定不是懒惰而是资产迁移——用户积累的 CLAUDE.md 里写着 mcp__github__create_issue 的指令原文可用；(2) '一代工具集为原子单位'的替换/回滚语义解决了 MCP 动态工具列表最容易出的半更新状态，配合确定性命名保证了 KV-cache 前缀稳定（重连恢复同一列表时定义逐字节一致）。

## tradeoffs
- 兼容清单是持续腐烂的维护税：hooks 桥以 Claude Code 官方文档为基线维护 23/30 不支持清单，Claude Code 每次发版都可能新增事件/字段，这份清单需要人肉追赶；采用别人的事实标准也意味着格式演化权在 Anthropic/OpenAI 手里，己方只能跟随。
- hooks 串行执行牺牲延迟换取日志确定性：参考实现（Claude Code）并行跑同点位的多个 hook，这里为了 hook/invoked/result 事件对在 session log 中相邻而串行 await，hook N 等 hook N-1，超时也不重叠——他们自己标注'若真实配置扇出到墙钟时间可感再重新审视'。
- per-session preset 挂载换隔离，但 host 从不 dispose agent：设计记录自己测出 web host 每触过的会话在 standard preset 下驻留 ~1.31MB 且无 eviction（'nothing disposes an agent'），idle 驱逐还是 TODO——隔离默认值的成本被诚实量化了，但尚未付清。
- 配置错误的兼容层选择静默降级而非 fail loud：hooks configPath 打错字只 warn 一行然后零 hook 注册（理由是'typo 不能带崩 agent'），这与仓库自己的'Misconfiguration fails loud'公约相悖；用户可能长期不知道自己的 hooks 根本没跑。
- skill 六级 rank + host/preset 分层 + nearest-wins 静默遮蔽的合成优先级：单看每条规则都有理，叠加后'为什么这个技能没出现在目录里'的排障需要理解三套机制，且跨层遮蔽不打日志、注册表不暴露被遮蔽项的检查 API。
- 用户显式 /name 调用技能时无条件注入全文 body：他们的同行调研显示各家都付这个代价换确定性，但句中提到已知技能名也会触发加载（Codex mention 语义），token 成本是接受了的。

## learnables
- 兼容策略分三层设计：格式层全抄事实标准（SKILL.md、AGENTS.md、mcp__ 命名）让用户资产零迁移；语义层只实现有执行契约的子集并把'不支持什么'写成一等公民文档（锚定上游官方文档为对照基线）；本体扩展面完全自主，兼容桥永远只做翻译（'adapter, not a power tool'），复杂需求引导到 native 插件出口。
- 解析了就必须执行，执行不了就不解析：Claude Code 的 allowed-tools、updatedInput 等字段被显式 defer 或 logged-but-ignored 加警告，绝不静默吞掉——比'假装支持'诚实得多，值得任何做兼容层的团队照抄。
- 安全决策用序无关的 most-restrictive fold（deny>ask>allow），把 hook 执行顺序从安全语义里剔除；顺序只影响 context 拼接不影响放行结论。
- waterfall 扩展点上'加 context 不是否决'：只想附加上下文的 listener 必须 next() 委托后把自己的产出折进下游决策，否则会短路后面的 policy/sandbox 插件——这是可组合拦截链的关键纪律，配了回归测试。
- 把外部 hook 的每次调用写成 session log 里的 invoked/result 成对事件，'model-visible ⟺ logged'原则延伸到第三方 shell 代码，被 hook 阻断的 prompt 也留下了可审计的决策证据。
- '模式'做成数据不做成分支：四种 agent 模式 = 四份可 diff、可复制编辑的组合文件；差异化只需追加一行（code 模式）或一段（cordis 模式），而不是在循环里加 if。
- 把'preset 作者会犯的错'变成挂载期的确定性失败：root-realm 服务泄漏审计、依赖悬空行审计、组合文件写回禁令，三个 guard 都在 mount 返回前跑完，失败则整体回滚不留半个 agent。
- MCP 工具名做成 (server,rawName) 的纯函数并在截断时追加确定性 hash：连接顺序、重连、其它 server 都不能改名——这是 KV-cache 前缀稳定与模型侧经验可迁移的共同前提。
- 同目录 AGENTS.md/CLAUDE.md 只取一个 winner：转型期仓库常常两个文件都有且内容重复漂移，双读会重复注入矛盾指令，'ordered candidates、一目录一胜者'是被低估的实用决策。

## questionable
- hooks 桥的实际兼容度可能配不上'兼容 Claude Code hooks'的观感：configPath 是进程级一次性读取（无 per-session 项目发现、无 ~/.claude/settings 分层 precedence、无热重载），SubagentStart 的 agent_type 恒报 general-purpose 导致匹配特定 agent 类型的 hooks 静默不触发，串行执行与参考实现的并行+去重也不同——真实 Claude Code 用户的 hooks 配置直接搬来，行为差异可能不小。评估借鉴时要把它当'能跑常见简单 hooks'而非'兼容 Claude Code'。
- fail-closed 拒绝旧 camelCase 拼写、不留 alias，理由是'pre-release、无已发布兼容义务'——这是只有发布前才有的特权，不是可复制的通用做法；发布后同样的洁癖会变成用户的升级破坏。
- cordis preset + extensions（tool-cordis/cordis-host-runner）让模型在 node:vm 里对活运行时求值自写插件、写出的 preset 会被其它会话挂载，他们自己标注'视同 shell 访问'。作为研究哈尼斯的自举演示很精彩，但普通产品不应把'agent 修改自身运行时'当作生态扩展机制默认借鉴。
- 219 个 package、每包强制 invariant companion、双语文档、逐包 Model Experience 章节的工程体制，是 DeepSeek 这种有专职团队+以文档为产品的处境才养得起的；小团队照搬这套'一切皆插件'的粒度会先死于胶水与文档成本。三角色 capability seam 的思想可以学，一角色一包的物理拆分不必学。
- 指令文件跟随 symlink 到 tree 外目标（为覆盖 worktree/submodule 场景），设计记录自己承认扩大了 prompt injection 面、依赖 fs 沙箱兜底——借鉴 AGENTS.md 双读时应默认不跟 symlink，除非有同等的文件系统信任边界。
- skill 跨层 nearest-wins 遮蔽不打日志也无检查 API：composition 作者的技能悄悄压过部署级同名技能是设计意图（组合稳定性），但排障者没有任何工具看到'谁遮蔽了谁'，这个可观测性缺口是自找的。