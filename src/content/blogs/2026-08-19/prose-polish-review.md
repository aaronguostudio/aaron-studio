# Prose Polish Review

Polish 执行：2026-08-15，基于三人独立审读（英文母语语感 / 中文自然度 / AI 痕迹 + 双语一致性），共 26 处修改，一次 deep pass 完成。论点、证据、链接、数字零改动（Argument Lock 未受影响）。

## 修改目标

- 消除英文的比喻自冲突与朗读绊点（集中在最可能被引用的框架段）。
- 清除中文的直译残留——七八处英文句式骨架恰好落在关键论证句和收束句上。
- 降低"不是A，是B"对照句与金句收口的密度（AI 打磨指纹），重点拆掉两版各自最密的一簇（反驳二段）。
- 双语互借强侧：中文"双向的刀"句借给英文；中文"逗号化解三连鼓点"的节奏借给英文。

## 英文润色重点

- **比喻自冲突（high）**："Rent the model" 作为正面建议，两句后 "paying rent" 变负面后果——改为 "hostage to someone else's pricing power"。这是全文被引用概率最高的段落。
- "a donation to someone else's sunk cost" 逻辑不通 → "turns into sunk cost"。
- "two of them are half right" 与正文三条全部分让步不符 → "I half-agree with all of them"。
- 删除 "as the next move shows" 式导游解说（meta-signposting）；R1 的范围修正（skill 和指令文件）保留。
- 反驳二段三句两个 "not X" 收尾的最密簇重写为 "You don't anchor assets to moving ground."。
- 借中文强侧："Portability is a knife that cuts both ways, and DeepSeek just paid to sharpen it."；"Models emit tokens; harnesses complete tasks."（分号化解三连鼓点）。
- 小修：graded by checking（删副词叠动名词）、V4-Pro went GA（消歧义停顿）、funnel for the thing it actually sells: tokens（重音落在 punch 词上）。

## 中文润色重点

- **直译清除（high 三处）**：「对……诚实一段」→「把……的局限老实交代一遍」；「那个扛得住他们自己标注缺口的'分布宽'」长定语拆为破折号补语；「专有表面上盖深楼」→「把楼盖在……私有地基上」。
- 「缺口」承载不了 caveat → 统一改「局限」（§4「沉默的缺口」是真 gap，保留不动）。
- 「兼容性会破坏」×2 →「兼容性说破就破」。
- 术语一致性：孤立的 bare「contract」→「合同」（与同段「八份不同合同」「合同条款」统一）。
- 「字面事实」→「坐实了」；「被连接应用」→「各个应用里」；「完成的工作」→「干完的活」（回收反驳二"这周就要干活"的口语锚点，结尾闭环）。
- payoff 段首句双重长定语拆分：「下面这套资产检验，我现在就用在自己的技术栈上；读到同一条新闻的 builder，可以直接拿走。」
- 反驳二段与英文同步重写：「还在动的地面，不适合下锚。」

## 保留不改的地方

- 标题「Harness 才是产品」/ "The Harness Is the Product Now"——审读一致认为成立；中文备选（「产品不是模型，是 Harness」「模型出 token，Harness 交活」）记录于此供分发场景选用，正文不动。
- 机制节前的一行过渡段（「那么问题来了」）——朗读节奏成立，intentionally kept。
- "Same worker, different manager" / 「同一个工人，不同的管理者」——red-team 修正后的地基是诚实的，金句保留。
- 排名拒用立场（只用分布宽）——牺牲传播性换准确性，维持。
- 其余金句收口（引言、§4、结尾）——各自成立，只拆了最密的一簇，不做全文抹平。

## 风险与边界

- 本 pass 未新增任何事实、例子、引语、链接；未改动任何数字。双语一致性审读已核对全部关键数字与六个链接一致。
- 英文 "hostage" 语气比原句重半档，属表达层选择，不改变主张强度边界。
- 中文「坐实」「认一半」是口语化选择，与全文 operator 语域一致。

## 验证结果

- EN scanner（--require-personal-anchor --require-story-craft）：见下方运行记录，polish 后复跑通过。
- ZH scanner（--language zh）：polish 后复跑通过。
- 交回 editorial scorecard pass 打分；scanner 通过不等于 scorecard 通过。
