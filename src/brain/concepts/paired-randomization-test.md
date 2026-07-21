---
type: concept
date: 2026-07-18
updated: 2026-07-18
title: "Paired Randomization Test"
aliases: [配对随机化检验, Paired Permutation Test, 配对置换检验, Sign-flip Test, 符号翻转检验]
domain: [statistics, machine-learning-evaluation, experimental-design]
tags: [paired-comparison, permutation-test, sign-flip, multimodality, uncertainty, evaluation]
status: active
maturity: growing
related:
  - "[[concepts/bimodal-distribution]]"
  - "[[concepts/effect-size]]"
  - "[[concepts/statistical-power]]"
  - "[[concepts/exchangeability]]"
  - "[[concepts/multiple-comparisons]]"
  - "[[concepts/calibrated-abstention]]"
---

# Paired Randomization Test · 配对随机化检验

> **一句话：判断新版本是否真的更好，不看两次总分谁更高；让新旧版本在同一批案例上逐案对照，再问这些差值的方向与大小是否可能只是随机翻牌。**

[打开互动解释页](pages/paired-randomization-test.html)

## 它在解决什么问题？

“总分从 82 涨到 84”混在一起的，至少有三种东西：

1. **版本效应**：改动本身真的让结果变好；
2. **案例构成**：新旧两次测到的案例难度不同；
3. **运行噪声**：随机种子、采样、评审或某些案例的状态跳变。

只比较两个 aggregate score（汇总分数），无法把它们拆开。尤其当某个案例的输出不是围绕一个中心轻微抖动，而是在两个稳定区域之间跳转时，`mean ± standard deviation`（均值 ± 标准差）甚至会描述一个几乎从不出现的“中间世界”。

例如，一个案例近似只会落在 64 或 100 两个 basin（盆地）：

```text
64  ● ● ● ●                         ● ● ● ●  100
                    mean ≈ 82
```

此时接近 `82 ± 18` 的摘要不代表“通常在 82 附近波动 18 分”，更像是在压缩一个 mixture distribution（混合分布）。一次运行落到 64、另一次落到 100，就能制造约 36 分的表面变化；平均总分涨 2 分并不自动构成改进证据。

Paired Randomization Test（配对随机化检验）把问题改写为：

> 在同一个案例上，新版相对旧版的变化是否足够一致，以至于“改动其实没有方向性作用”很难解释当前结果？

## 从原始描述里可以提炼出的三个模式

### 1. Bimodal Score Trap · 双峰分数陷阱

如果数据生成过程有两个状态，单一均值与标准差会隐藏状态结构。先画逐次分布、直方图或轨迹，再决定用什么摘要；不要把 mixture（混合）误读成 ordinary noise（普通噪声）。

### 2. Pair Before You Aggregate · 先配对，再汇总

同一个案例往往同时影响新旧两版：难例对两版都难，易例对两版都易。先计算逐案差值，可以消去大量共同难度；先各自求平均再相减，则丢掉了这层对应关系。

### 3. Inconclusive Is a Result · 无结论也是结论

证据不足时输出 `INCONCLUSIVE`，不是检测失败，而是拒绝把不确定性伪装成进步。它把“没有足够证据证明有差异”和“证明没有差异”明确分开。

## 先用一个生活类比：试鞋不要换脚比较

要比较两双跑鞋，如果让甲穿旧鞋、乙穿新鞋，再比较完成时间，脚力差异会盖过鞋的差异。

更好的做法是让每位跑者都试两双鞋，在相近条件下记录：

```text
每位跑者的差值 = 新鞋成绩 - 旧鞋成绩
```

跑者之间快慢悬殊没有关系；我们关心的是同一个人换鞋以后怎样变化。然后假设鞋其实没有稳定作用：对每位跑者来说，“新鞋更好”与“旧鞋更好”的标签应当可以互换。把每个人的差值随机翻成正或负，看看能否经常拼出观察到的整体优势。

案例就是跑者，版本就是鞋，paired delta（配对差值）就是同一个人换鞋后的变化。

## 它怎样工作？

### 1. 固定配对单位与运行条件

让旧版与新版运行同一批案例，并尽可能共享可配对的条件：

- 相同输入、评分规则与评审版本；
- 对随机系统，使用成对的 seed（随机种子）或 matched replicate（匹配重复）；
- 在看结果之前固定案例排除规则、主指标、统计量和阈值；
- 如果案例来自同一模板或文档家族，记录 cluster（簇），不要假装它们彼此独立。

### 2. 逐案求差值

对第 `i` 个案例：

```text
dᵢ = score_new,i − score_old,i
```

`dᵢ > 0` 表示新版在该案例上更好，`dᵢ < 0` 表示更差。最简单的总体统计量是平均差：

```text
T_obs = mean(d₁, d₂, …, dₙ)
```

也可以预先选择 median delta（差值中位数）、trimmed mean（截尾均值）或任务专用统计量。置换检验并不免除“选对指标”的责任。

### 3. 建立“没有方向性效应”的零分布

在 sign-flip test（符号翻转检验）里，零假设要求每个差值的正负号在允许的设计下可交换。对每个 `dᵢ` 独立乘以 `+1` 或 `−1`：

```text
T* = mean(s₁d₁, s₂d₂, …, sₙdₙ),  sᵢ ∈ {−1, +1}
```

`n` 对配对单位共有 `2ⁿ` 种符号组合。样本小时可以全部枚举，得到离散的 exact null distribution（精确零分布）；样本大时可以随机抽取很多种组合，但必须把原观察组合计入，随机置换得到的 p-value（p 值）不能报告为 0。

### 4. 计算双侧 p 值

对双侧检验：

```text
p = count(|T*| ≥ |T_obs|) / 2ⁿ
```

它回答的是：**如果零假设与符号可交换条件成立，至少这么极端的统计量会有多常见？**

它不回答“改进为真的概率是多少”，也不衡量这次改动有多重要。

### 5. 把证据映射为三态输出

若预先约定 `α = 0.05`，一个简单的发布闸门可以是：

```text
p < α and T_obs > 0  → IMPROVED
p < α and T_obs < 0  → REGRESSED
otherwise            → INCONCLUSIVE
```

更完整的生产规则还应加入 practical threshold（实际意义阈值）`δ_min`、关键案例的 guardrail（护栏）以及多重比较修正：

```text
统计证据足够 ∧ 效应至少有用 ∧ 没撞坏关键护栏 → 才允许声称改进
```

## 一个具体的技术例子：同样是“平均 +2”

假设八个案例的新旧配对差值为：

| Case | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Delta | +20 | −15 | +10 | −8 | +12 | −5 | +4 | −2 |

平均差刚好是 `+2.0`。但正负交错，大幅增益与大幅退步互相抵消。枚举全部 `2⁸ = 256` 种符号翻转，以平均差为统计量做双侧检验：

```text
T_obs = +2.0
p = 168 / 256 = 0.65625
decision = INCONCLUSIVE
```

再看另一组：

| Case | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Delta | +3 | +2 | +4 | +1 | +2 | +3 | +2 | +4 |

它的平均差是 `+2.625`，幅度并没有夸张，但方向一致：

```text
T_obs = +2.625
p = 2 / 256 = 0.0078125
decision = IMPROVED
```

真正的区别不是“多涨了 0.625 分”，而是 **逐案证据的结构完全不同**。

## 为什么样本少时必须诚实地说 INCONCLUSIVE？

精确置换检验的 p 值是离散的，不是任意精度的小数。

如果只有五个非零配对差值，而且五个全部为正，以平均差做双侧符号翻转检验，只有“全部为正”和“全部为负”两种排列同样极端：

```text
minimum two-sided p = 2 / 2⁵ = 0.0625
```

即使五个案例全赢，也不可能跨过严格的 `p < 0.05` 门槛。第六个同向案例加入后，理论最小值才变成：

```text
2 / 2⁶ = 0.03125
```

这不是算法“过于保守”，而是证据分辨率真的只有这么粗。若业务必须在小样本下行动，应当显式使用先验、损失函数、序贯设计或更丰富的重复测量，而不是伪造更精细的 p 值。

## 什么时候适合？

- 新旧系统能在同一批独立或可分簇的案例上运行；
- 指标能在案例级计算，而不是只能得到一个全局黑盒分数；
- 样本不大、参数分布假设不可靠，但配对标签在零假设下可交换；
- 改动前已经固定主指标、统计量、方向与决策阈值；
- 需要把“证据不足”作为明确输出，而不是强迫每次实验分胜负。

## 什么时候会退化或失效？

### 配对不真实

新旧版本没有运行同一批案例，评分器版本不同，或随机 seed 没有对应。此时差值混入了额外变化，paired（配对）只是表面标签。

### 案例不独立

一百个案例其实来自十个模板家族，却逐案独立翻转，会夸大有效样本量。应按 cluster 做整体翻转、先在簇内汇总，或使用层级模型。

### 符号不可交换

对差值直接做 sign flip 需要零假设下的符号对称 / 可交换结构。若差值分布高度偏斜、处理顺序系统性影响结果，或新版与旧版的变异机制不同，普通符号翻转可能不再校准。此时需要重新定义随机化单位、换用 studentized statistic（学生化统计量）、bootstrap（自助法）、sign test（符号检验）或模型化分析。

### 随机系统只有一次运行

每个版本每个案例只跑一次时，版本效应与 seed 效应可能纠缠。对高度随机或双稳态案例，应使用 paired seeds（配对种子）、每案例多次重复，并把“案例 × seed”结构纳入设计；否则一次 basin 跳转仍可能支配结论。

### 反复试到显著为止

同时尝试很多 prompt、指标、切片、排除规则，再只报告最小 p 值，会破坏 `0.05` 的含义。需要预注册主比较，或使用 family-wise error rate（族错误率）/ false discovery rate（错误发现率）控制。

### p 值代替了效应大小

大量样本可能让 `+0.05` 分也显著；少量样本可能让真正有用的 `+5` 分仍无结论。始终同时报告 paired effect size（配对效应大小）、区间、胜率、最坏退步与业务阈值。

## 它和相邻概念是什么关系？

### Paired Delta · 数据变换

逐案计算 `new − old`，保留对应关系并消去共同案例难度。它是输入结构，不是显著性检验本身。

### Permutation / Randomization Test · 推断机制

通过设计允许的标签重排构造零分布。paired sign flip（配对符号翻转）是其中一个特例；不是所有 permutation test（置换检验）都可以任意打乱所有观测。

### Paired t-test · 参数化替代

对配对差值的均值做 t 检验，依赖均值、方差与近似正态等条件。符号翻转可以使用同样的均值统计量，但用重排生成零分布；二者的假设并非“一个有、一个完全没有”。

### Wilcoxon Signed-Rank Test · 秩检验替代

同时使用差值的方向与绝对值秩，通常假设差值分布围绕共同位置对称。它不是“完全无假设”的 paired t-test。

### Sign Test · 更弱信息的替代

只数正差和负差，不使用幅度；对重尾或异质差值更稳健，但通常损失功效。它回答“赢的概率是否偏离一半”，不直接回答平均能涨多少。

### Effect Size · 实际意义

描述改动有多大，例如 mean paired delta（平均配对差）、median paired delta（中位配对差）或标准化差值。p 值与效应大小互补，不能互相替代。

### Statistical Power · 检测能力

在真实效应存在时发现它的概率。样本太少、噪声太大或测试统计量不匹配都会降低功效；`INCONCLUSIVE` 常是设计信息不足的结果。

### Exchangeability · 有效性前提

规定零假设下哪些重排仍代表同一个数据生成过程。置换检验的可信度来自这个结构，而不是来自“非参数”三个字。

### Multiple Comparisons · 决策层约束

一次实验比较多个版本、指标或切片时，偶然过线的机会增加。它约束整组结论，单个配对检验无法自动解决。

### Calibrated Abstention · 决策策略

当证据不足时主动不下结论。`INCONCLUSIVE` 是这种策略在评估闸门中的具体应用，不等于证明两版等价。

## 常见误区

### “新版总分高，所以每个案例都在变好”

总分只给净结果。少数大幅提升可以掩盖大量小幅退步，或反过来；必须看 paired delta 的分布与关键切片。

### “非参数检验不需要任何假设”

错误。它少依赖某些分布参数，却仍依赖配对、独立 / 分簇结构和零假设下的 exchangeability（可交换性）。

### “p = 0.03 表示改进有 97% 概率是真的”

错误。p 值是在特定零假设与检验程序下，得到至少同样极端数据的概率，不是对假设真假的后验概率。

### “INCONCLUSIVE 表示两版一样”

错误。它只表示当前设计没有提供足够证据跨过预设判定门槛。证明“足够等价”需要 equivalence test（等价性检验）与预设等价界限。

### “有 p < 0.05 就可以上线”

错误。还要看效应是否有用、关键案例是否退步、成本与风险、是否做了多重尝试，以及结果能否在独立复现实验中站住。

## 最小记忆卡

- **先配对，再汇总。** 比较同一个案例上的 `new − old`，不要只看两个总分。
- **双峰不是大噪声。** 两个 basin 应先被看见，均值 ± 标准差可能掩盖状态跳转。
- **翻的是允许交换的单位。** 置换方案必须复刻实验设计；相关案例要按簇处理。
- **p 值不是效果大小。** 同时报 paired delta、区间、胜率与业务阈值。
- **INCONCLUSIVE 是诚实输出。** 它表示证据不够，不等于改进，也不等于等价。

## 自测

1. 为什么“旧版 82，新版 84”不足以证明改进？还缺哪两层信息？
2. 若五个配对差值全部为正，为什么精确双侧符号翻转检验仍可能无法达到 `p < 0.05`？
3. 一百个案例来自十个共同模板时，逐案例独立翻转会产生什么问题？
4. `INCONCLUSIVE` 与“两个版本等价”有什么不同？
5. 如果某个案例在 64 和 100 两个 basin 之间跳，下一轮实验设计应该怎样处理 seed 与重复运行？

## Further reading

- [SciPy `permutation_test` documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.permutation_test.html) — 配对样本重排、`2ⁿ` 精确枚举与单样本符号翻转的官方实现说明。
- [Dror et al. (2018), *The Hitchhiker’s Guide to Testing Statistical Significance in Natural Language Processing*](https://aclanthology.org/P18-1128/) — Natural Language Processing（NLP，自然语言处理）评估中如何按任务与指标选择显著性检验。
- [Peyrard et al. (2021), *Better than Average: Paired Evaluation of NLP Systems*](https://aclanthology.org/2021.acl-long.179/) — 说明只比较独立平均值会丢失逐实例配对结构。
- [Phipson & Smyth (2010), *Permutation P-values Should Never Be Zero*](https://gksmyth.github.io/pubs/PermPValuesPreprint.pdf) — 随机抽取置换时如何正确计算离散 p 值。
- [Wasserstein & Lazar (2016), *The ASA Statement on p-Values*](https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf) — American Statistical Association（ASA，美国统计协会）说明 p 值不等于效应大小，也不应成为孤立的机械决策阈值。
