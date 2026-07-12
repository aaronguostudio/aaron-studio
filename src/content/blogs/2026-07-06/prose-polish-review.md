# Prose Polish Review: FDE Workflow 3 Rewrite

## 修改目标

论证已经稳定，这一轮只处理读者进入速度、句子节奏、中英文自然度和结尾回收，不新增事实或改变 claim boundary。

## 英文润色重点

- 第一段直接点出 FDE，并在前 150 词内交代四家公司共同押注的 deployment gap。
- 让 $7.5B caveat 紧跟数字，避免读者带着 apples-to-oranges 疑问继续阅读。
- 删除 customer / operating / product 三层表格，改用供应中断的具体场景解释 FDE 的日常工作。
- 将“模型公司为什么派人到现场”并入 75 亿美元章节；重复现场问题必须进入产品，否则组织只是在交付项目。
- 将 consulting 的区别写成 `where the learning goes and what remains`，避免职业 caricature。
- 把博客 workflow 移到机制解释之后，用 v1 到 v2 的变化展示反馈如何改造系统，同时明确它不是企业证据。
- 强调打通步骤不等于稳定高质量运行；至少当前仍需要人持续设定标准、作出取舍，并把局部修正升级成长期规则。
- 避免把 `Recursive` 写成自动发生的 self-improvement。人的参与应逐步沉淀成评估、规则和工具，而不是永久手工操作。
- 删除“四项产出”清单和对应正文配图。它与 ACTOR 竞争同一个解释任务；文章只保留 ACTOR 作为主要可执行框架。
- 结尾不再回放 404，而是区分职位名称与第一性原理，落在 FDE 能否解决落地缺口。

## 中文润色重点

- 中文开头直接使用 FDE、公司名称和“落地缺口”，不先绕入个人故事。
- 将 vendor、enterprise product、people layer、consulting、production、outcome 等可以自然翻译的词改成中文。
- 只保留 FDE、ACTOR、Token、API、FinOps 和组织名称等具有明确指代价值的英文。
- 将“FDE 和咨询的区别”收束到现场工作能否连接生产与核心产品，不再创造额外术语。
- `Recursive` 的解释落到事故、评估、权限、运行手册和产品功能，让自我提升可见。
- 将 75 亿美元的口径说明和落地判断压缩成一句过渡，不让会计口径抢走论点。
- 明确个人博客工作流是 FDE 工作方式的缩小版，而不是企业部署成效的证据。
- 重新组织中英文段落，让每段承载一个完整观点；保留少量短段落用于真正需要的强调，不再默认一句一段。

## 保留不改的地方

- 标题保留 `Expensive Tokens Won't Save Enterprise AI / 昂贵的 Token 救不了企业 AI`。
- 没有把 $7.5B 放进标题，避免整篇文章被一个口径不完全统一的数字绑住。
- 没有增加 Karp 或 Reddit 引用。Palantir 官方 backpropagation 定义已经提供更好的机制。
- 没有强行加入旧文链接。压缩后的文章不需要为了 canon continuity 打断主线。

## 风险与边界

- `human backpropagation` 是从 Palantir 方法论延伸出的 Aaron interpretation，正文已经说明来源和组织层含义。
- Vendor announcement 只能证明优先级和 operating intent，不能证明 ROI；正文保留了这一 caveat。
- 中文不追求消灭所有英文缩写，但普通商业和工程概念应优先使用自然中文，避免语言切换本身成为阅读成本。

## 验证结果

- English style/story gate: passed, 100/100.
- Chinese style gate: passed, 100/100.
- Package length: 1,592 English words across seven sections, with six local article images.
- No AI-slop markers, formulaic contrast, weak hook, generic ending, or mechanical Chinese flags remain.

Decision: PASS
