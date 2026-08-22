# Prose Polish Review

## 修改目标

在不改变论点、证据和框架的前提下，让文章保持 operator voice：开头快速兑现标题，章节标题直接表达因果关系，段落既有节奏又不滑向演示稿式短句。

## 英文润色重点

- 将 “what the team did around the code” 改为更具体的 “how the team organized the work around it”。
- 把第一节标题从描述性的 “more structure, earlier” 收紧为因果判断 “Cheap execution pulled structure forward”。
- 把结尾章节从泛化的 “new management surface” 改成明确判断 “Management moves to the judgment layer”。
- 为 DeepSeek 第一篇增加自然站内链接，不增加新的事实主张。
- 保留开篇短句与后续长段落的节奏差异，不把全文切成卡片式单句。

## 中文润色重点

- 中文版应围绕“执行变便宜、判断向上移动”自然重写，不逐句复制英文语序。
- `harness` 首次解释为 agent 周围的运行与约束系统，之后保留英文，避免反复翻译。
- `process capital` 使用“流程资本”，同时用直接句解释其含义，避免自造术语压过论点。
- 普通商业与工程词优先中文；保留 AI、prompt、workflow、QA 等 Aaron 日常会使用的表达。

## 保留不改的地方

- 保留 OpenAI 的大规模反直觉开头；它的证据重量足以承担主题。
- 保留极端样本与 vendor-owned 数据的边界声明。
- 保留一个主框架 `Process Capital Test`，不新增第二个模型。
- 保留最后一句“把正确流程变成资本，删除其余流程”的收束。

## 风险与边界

- 语言润色没有新增来源、数字或外部案例。
- OpenAI 与 Anthropic 的材料仍应以其自述/自有数据表述。
- 中文完成后需单独检查翻译腔与中英混杂。

## 验证结果

- English style gate: PASS, 100/100; 2,507 words, 185 sentences, one candidate slop marker reviewed with no actionable issue.
- Chinese style gate: PASS, 100/100; 4,387 Chinese characters, 151 sentences, zero slop markers.
