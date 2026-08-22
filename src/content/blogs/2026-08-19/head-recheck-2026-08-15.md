# 仓库侧 HEAD 复核报告(2026-08-15)

对 claim-ledger 全部仓库侧事实在 clone 上的独立重验。供下个 session 的 scorecard 重打分与 08-19 发布前复核直接使用。**本报告只记录发现,不改动任何已有产物**——文章与 ledger 的修改由后续阶段执行。

## 元信息

- **执行**:2026-08-15,deepseek-harness clone(`/Users/aaronguo/Work/lab/deepseek-harness`)session 内完成。
- **HEAD 状态**:`git pull --ff-only` 后 HEAD 仍为 `47f943859b` = **ledger pin 本身,0 个新 commit**。remote 为 `github.com/deepseek-ai/deepseek-harness`,最后一个 commit 时间 2026-08-13 19:38 +0800。
- **重要观察**:"日均约 200 commits"描述的是 2026-06-10→08-13 的开发期节奏;**公开仓库自发布起两天未动**。若 08-19 依旧,C7/C8/C25 的漂移风险为零,发布日仓库侧复核收敛为一次 `git pull` + 确认无新 commit。
- **方法**:22 个并行验证 agent(10 簇独立重验 + 12 个对抗复核),共 68 项子检查;每项要求引用实际 file:line 或完整命令输出;所有非 VERIFIED 项经第二轮从零独立复核裁决。
- **可重放**:workflow 脚本存于 `/Users/aaronguo/.claude/projects/-Users-aaronguo-Work-lab-deepseek-harness/7645aa55-738a-42ab-8fc2-d97e373b5fc4/workflows/scripts/dsh-head-recheck-wf_43638681-a0a.js`(run ID `wf_43638681-a0a`)。08-19 若上游有新 commit,可在该 clone pull 后重跑同脚本。

## 总裁决

68 项检查:**56 VERIFIED / 9 MISMATCH / 3 AMBIGUOUS(均已裁决)**。ledger 的核心结构完好——全部计数、全部代码摘录、全部行号引用逐字成立。MISMATCH 集中在**措辞越过证据边界**的地方:7 处需要文章修改(EN+ZH 同步),2 处仅需 ledger 校正。

## A. 需要文章修改的 7 处(按严重度排序)

### A1.「Bash commands have no timeout」——事实错误 ⚠ 最高优先

- **现文**:EN 「现状」段(约 :168)"Bash commands have no timeout.";ZH 对应句。
- **事实**:bash **有** timeout——`packages/shell/bash-local/src/index.ts:107` 默认 `timeoutMs: 120_000`(上限 600s),到期 SIGTERM→宽限→SIGKILL 整树硬杀;模型可见的 tool schema 也写明了这一点。README 的原始窄断言(`timeout-policy/README.md:57`)只是说 bash 未声明 `ToolDefinition.timeoutMs`、所以**守卫插件**不为它设 deadline。真正完全没有超时的是 `read`/`write`/`edit`(以及 bash 的 background 运行)。
- **建议**:改为「文件读写编辑工具没有任何超时;bash 的超时不在守卫插件的管辖内(由 shell 执行器自带 120 秒默认)」,或直接把该句限定到 read/write/edit。这句在「诚实成本」段,是审读者最会去核的一句。

### A2.「the design notes show they built their own format first, then deleted it」——无此事 ⚠ 最高优先

- **现文**:EN 战略节(:164)括号内;ZH 对应。
- **事实**:穷举 `.agents/notes/`(全部 skill 相关 note 13 份非中文 + 按日期扫 08-05→08-13 约 150 份)**不存在**记录"先造自有格式、后删除改用 Claude Code 格式"的 note。真实历史:`2026-07-05-skill-system.md` 显示从一开始就采用收敛的 SKILL.md 模式;`2026-07-28-skill-invocation-policy.md` 只是把**两个 frontmatter 字段**的内部 camelCase 拼写(`disableModelInvocation` 等)迁移为 Claude skills 的 kebab-case 键并拒绝兼容别名。ledger C7 所称 ~08-09 的 note(`2026-08-09-layered-skill-registry.md`)是关于 registry 分层的,与格式无关。
- **建议**:删掉括号,或改写为真实事实:「设计记录显示他们把自有的字段拼写迁移成了 Claude 的写法,并拒绝保留旧别名」。

### A3.「field-for-field SKILL.md compatibility」——过强 ⚠ 高

- **现文**:EN :164;ZH 对应。
- **事实**:是**子集 + 扩展**,非逐字段兼容。明确不解析/不执行 Claude Code 的 `context: fork`、`arguments`、`argument-hint`、`allowed-tools`、`disallowed-tools`(`2026-07-05-skill-system.md:57` Deferred 节);另读一个 Claude 没有的 `whenToUse` 字段(`skill-filesystem/src/index.ts:830`)。且 `grep -rli claude packages/skill/` 为零命中——兼容意图只存在于 Agent Notes,不在任何产品文档。
- **建议**:改为「reads the same SKILL.md format / 你现有的 SKILL.md 直接可用」量级的表述,去掉 field-for-field;「兼容」证据链改引 07-05 与 07-28 两份 note。

### A4.「the first 251 lines of the two files are identical」——字面为假 ⚠ 中

- **现文**:EN Finding 2(:95);ZH 对应。
- **事实**:standard 251 行、code 262 行,diff 有 **6 个 hunk**——前 5 个全是注释改写(文件头 gloss 重写、code 版 :8-18 插入 11 行注释块、standard:168-173 六行注释被删),第 6 个才是追加。**成立的一半很硬**:剥离注释与空行后 diff 恰为 `122a123,126`,即配置内容 = standard + 恰好一个追加 row;且该 row 精确位于 code:259-262(`id: tool-presentation` / `name: '@deepseek-ai/dsh-agent-tool-presentation'` / `config:` / `mode: code`)。
- **建议**:把「前 251 行完全一致」改为「两个文件的配置内容完全一致(只有注释不同),唯一的功能差异是文件末尾追加的一个 row」。文中引用的 YAML 块本身无需改动。

### A5.「time is an ordinary message, appended only when it changes」——机制误述 ⚠ 中

- **现文**:EN Finding 3 的 good/bad 示意块内(:127 "appended only when it changes");ZH 同块。
- **事实**:实现插件 `dsh-time-context` **没有变化检测**。唯一开关是可选的 `refreshIntervalMs` 间隔节流(缺省 0 = 每个 eligible step 都注入);且该插件**默认组合里根本不启用**——DSH 默认压根不给模型注入时钟。成立的一半:时间确实绝不进 system prompt,注入时是 append-only 的普通 user message,不破坏前缀缓存(`time-context/README.md:69`)。
- **建议**:示意块改为「good: no clock in the system prompt → time arrives as an ordinary appended message (DSH ships with the clock off by default)」量级——"默认不注入时钟"其实比原句更有力。

### A6.「a standing rule: future re-proposals must defeat the recorded argument」——规则出处不实 ⚠ 中

- **现文**:EN Finding 4(:150);ZH 对应。
- **事实**:notes README **没有**这条 standing rule。README 的真实规则(README.md:14, :38):rejected note 只在「其 rationale 还能拦住一个诱人的、有分量的错误」时保留,否则删除;:111 的 rationale 是「没记下打败了什么的决定会招来重新翻案」——针对的是 Alternatives-considered 节,不是 rejected 重提。「必须打败已记录的论证」的表述只出现在别的文件、且针对 implemented 记录。
- **建议**:改写为 README 实际规则:「rejected/ 目录冻结被否的提案并附论证,只要那份论证还拦得住一个诱人的错误就一直留着」。免疫系统的比喻仍然成立。

### A7.「every package README must carry a "KV Cache effect" section」——量词过强 ⚠ 低

- **现文**:EN Finding 3(:130);ZH 对应。
- **事实**:`verify-package-readme-model-experience.ts` 确为 gate(接进 `run-gates.ts:599`,违规 exit 1),但有 **4 个包的审计豁免名单**(`core/scope`、`util/brand`、`util/home-paths`、`util/launch-environment`,:32-37)——这 4 个包反而**必须没有**该节。
- **建议**:「every」→「除四个审计豁免包外的每个」或「package READMEs must…」弱化量词;也可保留原句接受为合理概称——但本文的卖点正是可核验,建议加限定。

## B. 文章可保留、仅 ledger 需校正的 2 处

### B1. C7「CLAUDE.md as fallback」

ledger 说 fallback,实际是**加载全部候选、内容相同才折叠**:`packages/context/agent-instructions/src/config.ts:12`(不在 skill-filesystem)`['AGENTS.md', 'CLAUDE.md']` 为数组顺序;两个文件都存在且内容不同时**都加载**,内容 trim 后一致才折叠为 AGENTS.md 一份。(07-22 的 commit `87899ae161` 之前确是 first-wins 的 fallback——ledger 记的是被取代的旧行为。)文章的措辞「AGENTS.md loaded first with CLAUDE.md accepted」恰好躲过了这个坑,**可不改**;ledger C7 应改写并更正代码出处。

### B2. C16 preset 名「creator」

四个 preset 目录 id 实为 `standard` / `code` / `minimal` / **`cordis`**(display 名:标准模式 / PTC 模式 / 极简模式 / 创造模式);"Creator mode" 是 Web client locale 表的英文显示名(`ui-agent-preset/src/client/locales.ts:46`),repo e2e 断言的 id 列表是 `['code','cordis','minimal','standard']`。文章说的是「The four "modes" **in the UI**」——按显示名成立,ZH 版「创造模式」更是原文,**可不改**(可选:加一句 "(preset id `cordis`)")。ledger C16 应记 id 与显示名的区分。

## C. AMBIGUOUS 三项的裁决(均无需改动)

1. **219 个包**(C6):三种独立方法收敛于 219——深度精确 find、`pnpm-workspace.yaml` 的 `packages/*/*` glob、pnpm workspace 成员表限定 packages/。天真全深度 find 得 226,多出的 7 个全是 `packages/typert/generator/tests/fixtures/` 下的 `@fixture/*` 测试夹具,不是包。**219 正确且不脆弱。**
2. **27 个检查**(文中 Finding 2):两种方法各自恰好 27——`ls scripts/verify-*` 去掉 `.spec.*` 后 27 个可执行脚本(26 .ts + 1 .mjs);`docSyncLeafGates()` 的**无条件** gate 恰 27 条(doc-typecheck 是唯一条件项,ci-static 路径下真实执行的正是这 27 条)。注意:`pnpm run doc-sync` 实际跑 28(含 doc-typecheck)——文章现句「27 of those checks」安全,但**不要**在任何修订里写成「doc-sync 跑 27 个」。
3. **ZH 版第 2 个代码块把伪代码标识符译成中文**:该块在两版文中都明确标注为示意(EN "stripped to its logic" / ZH "机制说白了就是"),C25 的 caveat 列明确将 Finding 1 的两个示意块排除在逐字要求之外。**一致,无需改。**

## D. VERIFIED 要点(56 项,择要)

- **计数全部精确**:12,293 commits;首尾 commit 2026-06-10 / 2026-08-13(64 天,按日期差惯例);merge 分支前缀 worktree/ 210、codex/ 209(203 `deepseek-harness/` + 6 `deepseek-ai/`)、agent/ 15、claude/ 3;作者名 37(注意:是 `%an` 字符串数,有同人双拼写);第一作者 Tianyi Cui 5,235 / 12,293 = 42.585% → 42.6% ✓。
- **C15 全链成立**:`invariant.ts:21-54` 正是断言(`:39 session.deriveMessages()` → `:40 JSON.stringify 比较` → `:41 fail`);persistence-catalog `####` 恰 44 且每条都是事件类型;model-visible 恰 3(`types.ts:343-346` SurfaceEventType 联合类型等四路独立证据);architecture.md:96 "Model-visible means logged" 逐字;compaction 遮蔽不删除 ✓;**拒绝内存态的设计记录存在**(`2026-06-11-event-sourced-sessions.md:21` 等两份 note 的 Alternatives considered)✓。
- **C25 五段摘录全部逐字、行号全部精确**:cordis.patch.yml 436-439 / 178-186 / 243-245;minimal 恰 62 行、persona row 在 :8-13;tool-presentation row 恰在 code:259-262;request-cache.e2e.ts:92-94 逐字 ✓(:13-21 为 with-key 证明的块注释)✓。
- **C8/C9/C21**:hooks README:89 逐字列出 23/30 不支持事件;:96 恰在 96 行;subagent-claude-code / subagent-codex 两包均在;repeat-tool-reminder README:85-90 恰六条 Known Limitations、:90 即「最高阈值之后沉默」✓。
- **C17**:排序就在 ledger 所指的 `system-prompt/src/index.ts:180-183`(code-unit、locale-independent,注释原话)✓;system prompt 无任何时钟(grep 零命中)✓;gate 接线 `run-gates.ts:599` ✓。
- **C19/C20**:notes 683 = 505/142/25/11(排除 `.zh.md` 方法精确复现;zh 是同目录三联件)✓;quality-gates note :11 两句引语逐字 ✓;postmortem 0001 "178 green unit tests and 100% line coverage" 逐字、guardrail 为 no-key 真 Loader e2e ✓;md 2,355 > ts 2,319 ✓;**第一次 config 崩溃有独立 postmortem**(`0002-js-expression-disabled-filesystem-tools.md`,与文章描述逐项吻合)✓。
- **EN/ZH 代码块奇偶校验**:8 块对 8 块、顺序一致、代码内容(含 `2026-08-19 09:32:07` 时间戳、两个路径头)全部一致,仅注释按规翻译;两版 prose 各恰一次引用 pin `47f9438` ✓。
- **时序备注(无需改文)**:文章「twice…Once…Once」未做先后断言;按 git 时间 postmortem 0001(06-18)在前、0002(07-14)在后,与文章叙述顺序相反——将来任何改写不要引入「first/second」。

## E. 08-19 发布日剩余动作

**仓库侧**(本报告已覆盖 08-15 时点):
1. `git pull --ff-only`。若 0 个新 commit(按当前趋势很可能):仓库侧完毕,直接引用本报告。
2. 若有新 commit:重跑上面的 workflow 脚本(或至少核 A/D 两节列出的全部 file:line),重点是 C25 五段摘录与 C8 的 23/30 计数(ledger 已注明该数随版本会变,文中用「拆解时点」限定)。

**非仓库侧(本次未覆盖,发布 session 处理)**:C5 官方公告措辞;C22/C23 两条引语链接可达性;C26 三家缓存文档 spot-check;检查 08-15 后 Anthropic/OpenAI 是否公开回应;定价「发布那周」限定语复核;站内两条链接由 publish gate 验证。

**给 scorecard 重打分 session 的输入**:A1-A7 是重打分前应落的修订(A1/A2/A3 属事实准确性维度,建议先改后打);B1/B2 改 ledger 即可;C 节三项在打分时可直接引用为已裁决。
