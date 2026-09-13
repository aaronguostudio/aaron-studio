# Aaron blog writing language

## Purpose

Aaron's blog should read like an operator with lived judgment, not like a generic AI essay generator. The goal is not to fool AI detectors. The goal is to publish work with concrete material, clear author judgment and natural rhythm. Commercial usefulness matters when it serves this article's purpose.

Default shape:

```text
Concrete work observation -> tension -> mechanism -> operator frame -> objection -> implication.
```

## External skill inputs

These outside skills were reviewed as references, not installed as controlling templates:

- `pr-pm/prpm@human-writing` - useful for concrete openings, specific evidence, anti-corporate language, and endings that move to action rather than summary.
- `hairyf/skills@writing-humanizer` - useful for detecting inflated significance, vague attribution, formulaic structure, and generic conclusions.
- `oakoss/agent-skills@de-slopify` - useful for compact scanner rules: slop vocabulary, formulaic contrast, rhythm, and read-aloud checks.
- `mike-coulbourn/claude-vibes@ai-writing-detection` - useful as a probabilistic reference only. Do not accuse or reject from one signal; use multiple signals and context.
- `wentorai/research-plugins@chinese-text-humanizer` - useful for Chinese version checks: avoid mechanical transitions, translation tone, and evenly balanced paragraph formulas.

## Anti-AI style gate

Reject or revise a draft when several of these appear together:

- AI slop phrases: "in today's fast-paced world", "ever-evolving landscape", "at its core", "it is important to note", "let's dive in".
- Inflated words without evidence: "robust", "seamless", "holistic", "paradigm", "game-changing", "cutting-edge", "pivotal", "underscore".
- Formulaic contrast: "not just X, it is Y" or repeated "it is not about X; it is about Y".
- Vague claims with no receipt: "teams will improve alignment", "AI unlocks potential", "this changes everything".
- Low rhythm variation: every sentence is similar length and every paragraph has the same shape.
- Generic ending: stock wrap-ups such as "In conclusion" or optimism such as "future looks bright" detached from the article's evidence and the author's experience. Grounded enthusiasm is welcome.
- Chinese mechanical tone: "首先/其次/最后", "综上所述", "具有重要意义", "一定程度上", "积极拥抱", "不断提升" clustered together.

Use the scanner:

```bash
npx -y bun tiles/blog-write/scripts/blog-style-quality.ts <article.md> --require-personal-anchor --require-story-craft
npx -y bun tiles/blog-write/scripts/blog-style-quality.ts <article-zh.md> --language zh
```

The scanner is a candidate detector, not a final judge. A clean score does not guarantee a good article; a flagged issue means the section needs editorial attention.

## Story craft gate

Aaron's blog is not fiction, but it still needs narrative force. A useful operator essay usually has a story problem:

```text
something changed -> the old process failed -> the real constraint appeared -> a new operating rule emerged.
```

Reject or revise when:

- the opening starts with a generic topic intro such as "AI is transforming..." or "In this article...";
- there is no tension: no constraint, bottleneck, tradeoff, failure, objection, risk, or before/after conflict;
- the article only explains a concept and never shows the moment where the concept became necessary;
- the ending says the topic matters but does not land a payoff;
- the conclusion leaves the central question unresolved without a clear author judgment, changed understanding, or earned reason to keep thinking about it.

Good blog hooks start with a concrete disturbance:

- a queue grew faster than review capacity;
- a meeting exposed a knowledge gap;
- a project shipped faster than the team could align;
- a metric moved in the wrong direction;
- a workflow worked until AI changed the cost structure.

Concrete does not mean autobiographical. Choose the opening with the strongest relevance and evidentiary weight:

- When a timely market event, product change, or company decision is the reason the reader should care now, name that subject immediately.
- Use a personal scene first only when it can carry the article's opening claim without a large analogy jump.
- A useful personal example can appear after the mechanism is established. Lived evidence does not have to occupy paragraph one.
- Do not make an anecdote prove more than it can. Label a small personal system as an illustration when it is not evidence at enterprise scale.

Good narrative tension is not fake drama. It is the real friction in the system: time, judgment, ownership, review, quality, customer risk, market timing, or execution cost.

Good payoff brings the article to a meaningful close. It can offer an operating rule, an implication, a changed belief, or a personal judgment earned by the preceding evidence. Brief synthesis is useful when it connects the parts into that judgment.

### 结尾要真正收住

- 回看开头提出的问题，再连读最后几段：读者应能明白，这些经历或证据放在一起，让作者得出了什么判断。
- 给收尾留出展开的空间。一个漂亮的末句、最后一个分点或一句行动建议，不能自动代替完整的结论；也不要把各节标题再列一遍。
- 可以写信任如何变化、哪些问题仍然存在，以及作者真实的期待或担忧。情绪必须来自正文和作者提供的感受，不编造个人体验，不把期待写成已经实现的能力。
- 新的取舍只承接正文已经建立的线索；需要另开一节论证的新观点，应移回正文或留到下一篇。
- 不强制 CTA、固定段数、操作清单或旧文呼应。结尾的任务是让读者带着清楚的判断和恰当的情绪离开。
- 人工检查“为什么到这里可以结束”，不能只靠扫描器关键词判定收尾合格。视频也检查最后的完整口播段落，给最终一句自然落下的时间。

### 自我提升不是自动发生

当文章讨论 AI workflow、feedback loop、memory 或 recursive improvement 时，不要因为流程图里有一个回环，就暗示系统已经能够自动提高质量。

- 区分“AI 能执行更多步骤”和“AI 能为整个系统负责质量”。
- 写清楚目前仍然需要哪些人的参与：设定标准、判断证据、解决取舍、拒绝结果、发现遗漏、决定哪些修正应成为长期规则。
- 不要把几句 prompt 描述成完整工作流。稳定运行、跨环节验证和持续升级是不同层次的问题。
- 人的参与不是终点。更有价值的方向，是把重复判断沉淀成评估、规则、运行手册、工具和可复用模式，让下一次运行从更高的基线开始。
- 使用 `self-improving`、`recursive` 或“自我提升”时，明确学习信号由谁发现、如何写回系统、下一次运行具体改变什么。

## Aaron voice craft gate

Use `tiles/blog-production/references/editorial-system.md` for form-specific editorial judgment. Shared voice qualities are concrete material, enough context for the reader, natural paragraph movement and an ending that completes the author's thought. Personal responses may be reflective; cases may be technical; explainers may rely on public evidence. Do not force all of them into an operating framework or a contrarian commercial thesis.

When a revision improves the prose, record the passage and why it works. Select examples for clarity and fidelity to the author's intent, not merely for dates, numbers or first-person keywords.

### 直接陈述优先于自造标签

(2026-08-15，来自 DSH harness 文修订反馈)

- 概括一组动作或模式时，优先用直接陈述句（「它直接采用了对手的标准」），不用文绉绉的自造标签（「格式投降」「诚实的子集」「收编对手」）。自造标签常携带事实不支持的评价色彩（投降/收编），且读者要先解码标签才能理解内容。英文同理：plain bolded statements beat coined labels ("It adopted its rival's standards" over "Format surrender").
- 反方观点和转折段必须有可见的过渡和来源：先说这个疑问从哪来（谁说的、什么数据、什么历史），再展开回应。不要凭空放一个抽象角色（「一个聪明的怀疑者」）进正文。
- 目标读者读不懂的方法学细节留在 claim ledger，正文的让步压成一句大白话（「Composio 自己也承认方法有局限，别当排行榜读」）。
- 对公司或人物的定性框架要过一道公平检验：即使引语属实，转述的定语（「常年被指控抄袭的公司」）可能带着文章并不主张的指控。删掉或中性化。

## English standard

Write native, crisp English. Use contractions when natural. Prefer plain words over formal synonyms: use "use", not "utilize"; "also", not "furthermore"; "important", not "pivotal" unless the sentence proves why.

Subheadings should be scannable claims, not generic labels:

- weak: `Introduction`, `Background`, `Conclusion`
- stronger: `The bottleneck moved to review`, `Ownership is the new interface`, `The team still matters`

### 方法论标签校准

Use the label that matches the reader's job:

- Use `lens` when the idea is mainly an interpretive perspective or way to notice something.
- Use `framework`, `checklist`, `method`, or `playbook` when the idea gives readers steps they can execute.
- Do not call ACTOR a `lens` in final copy. ACTOR is a deployment framework/checklist because the reader can use it to inspect a workflow.
- For acronym frameworks, keep labels at the same level of granularity. Prefer `Action, Context, Trust, Outcome, Recursive`; put clarifying phrases like ownership or learning loop in the explanation, not the label.

Example:

- weak: `The practical lens is ACTOR.`
- stronger: `The practical framework is ACTOR.`
- weak: `Action, Context, Trust, Outcome, Recursive ownership.`
- stronger: `Action, Context, Trust, Outcome, Recursive.`

## Chinese standard

The Chinese version is an adaptation, not a literal translation. It should preserve the operator judgment while sounding natural in Chinese.

Prefer direct phrasing:

- weak: `综上所述，我们应该积极拥抱这一趋势。`
- stronger: `真正要改的不是态度，而是工作流。AI 把执行成本打下来以后，人的判断必须更早进入系统。`

Keep natural technical terms such as `AI`, `prompt`, `workflow`, `context`, `QA`, and `UAT` when that is how Aaron would say them.

### 中文术语本地化

保留英文应该降低理解成本，而不是增加行业感。公司名、产品名、稳定缩写，以及没有自然中文对应的术语可以保留；普通商业和工程概念应优先写成中文。

- 可以保留：`AI`、`FDE`、`ACTOR`、`API`、`Token`、`FinOps`。
- 通常翻译：`vendor` -> `厂商`，`enterprise product` -> `企业级产品`，`people layer` -> `人员交付层` 或按语境重写，`consulting` -> `咨询`，`deployment test` -> `部署框架` 或 `部署检验`。
- `workflow`、`context`、`prompt` 等词可以在确实符合 Aaron 日常表达时保留，但同一段中大量中英切换时，优先改成自然中文。
- 专有名词第一次出现时可以中英并列，之后使用较短、自然的一种写法。

中文审校不应逐词消灭英文，也不应把可翻译的词留在句中来制造专业感。

### 中文词义校准

中文 prose review 要检查抽象词是否准确承载情绪方向和业务语境。不要只看词是否“高级”，要看它是否匹配句子的压力、风险、冲突或机会。

特别注意 `张力`：

- 可以用于标题、叙事、结构或观点之间的创造性拉扯，例如“这个标题更有张力”。
- 不适合随手用于负面业务语境，例如企业面对成本、质疑、压力、落差、风险、ROI 不确定性时。
- 当语义偏负面时，优先考虑 `落差`、`压力`、`困境`、`质疑`、`挑战`、`不匹配`、`错位`。

Example:

- weak: `很多企业感受到了同一种张力：token 消耗和漂亮 demo 并不会自动变成业务价值。`
- stronger: `很多企业感受到了同一种落差：token 消耗和漂亮 demo 并不会自动变成业务价值。`

## Feedback loop

When Aaron says a draft sounds too AI-like, too flat, or more natural than before:

1. Save the before/after excerpt.
2. Identify the exact pattern: phrase, structure, rhythm, missing evidence, weak ending, translation tone.
3. Add or update a scanner test when the pattern is repeatable.
4. Update this file only when the lesson is general enough to reuse.
