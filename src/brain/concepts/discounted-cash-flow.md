---
type: concept
date: 2026-07-23
updated: 2026-07-23
title: "Discounted Cash Flow"
aliases: [DCF, 折现现金流估值, 现金流折现法]
domain: [finance, valuation, decision-science]
tags: [intrinsic-value, present-value, free-cash-flow, cost-of-capital, terminal-value]
status: active
maturity: growing
related: [time-value-of-money, free-cash-flow, weighted-average-cost-of-capital, terminal-value, sensitivity-analysis, monte-carlo-simulation, margin-of-safety]
---

# Discounted Cash Flow · 折现现金流估值

> **一句话：** DCF（Discounted Cash Flow，折现现金流估值）把未来可分配现金流，按照与它们的时间、风险和计价方式一致的折现率折回今天，再把这些现值相加。

> **教育说明：** 这里解释的是通用估值机制，不是对任何证券、公司或交易的建议。页面中的数字来自虚构企业，目的只是展示因果关系。

## 它在解决什么问题？

一个会在五年后带来 `$100` 的承诺，和今天手里的 `$100` 不是同一件事。等待意味着放弃其他可获得的回报；未来现金流还可能低于预期、延迟，甚至消失。

估值因此需要回答三个问题：

1. 这项资产未来能向资本提供者分配多少现金？
2. 这些现金分别在什么时候出现，风险有多大？
3. 把不同年份的现金换成同一个“今天的单位”后，总和是多少？

DCF 不是凭公式发现一个隐藏的正确价格。它是一套翻译系统：把对经营、再投资、时间与风险的假设，翻译成今天的条件式价值。

## 先用一个生活类比

把一家企业想成一台每年会吐出现金的机器。卖家不会只告诉你“未来十年总共会吐出 `$1,000`”，因为第一年收到的 `$100` 和第十年收到的 `$100` 对你并不等价。

你会给每张未来现金券盖一个“等待与风险折扣”：

- 越晚收到，今天的价值越低；
- 越不确定，要求的回报越高，今天的价值也越低；
- 折完以后，再把所有现金券相加。

这个类比只解释折现的直觉。真实 DCF 还必须处理再投资、税、资本结构、终值和现金流口径的一致性。

## 它怎样工作？

### 1. 先决定你在估谁的价值

DCF 的第一步不是选增长率，而是选 claim（资本请求权）：

- **FCFF（Free Cash Flow to the Firm，企业自由现金流）**属于债权人与股东等全部资本提供者。它通常用 WACC（Weighted Average Cost of Capital，加权平均资本成本）折现，得到 Enterprise Value（企业价值）。
- **FCFE（Free Cash Flow to Equity，股权自由现金流）**只属于普通股股东。它用 Cost of Equity（股权资本成本）折现，直接得到 Equity Value（股权价值）。

现金流和折现率必须配对。把 FCFF 用股权资本成本折现，或把 FCFE 用 WACC 折现，都会混淆“谁承担风险、谁收到现金”。

### 2. 估计显性预测期的自由现金流

常见的 FCFF 桥梁以 EBIT（Earnings Before Interest and Taxes，息税前利润）为起点：

```text
FCFF
= EBIT × (1 − tax rate)
+ Depreciation & Amortization
− Capital Expenditure
− Change in Net Working Capital
```

这条桥梁提醒我们：增长不是免费的。更高收入往往需要更多营运资本、设备、研发或其他再投资。

### 3. 使用一致的折现率

第 `t` 年现金流的 Present Value（PV，现值）是：

```text
PV(FCFFₜ) = FCFFₜ / (1 + r)ᵗ
```

`r` 不只是“感觉风险高就调大一点”的旋钮。它必须与现金流口径保持一致：

- FCFF ↔ WACC；
- FCFE ↔ Cost of Equity；
- 名义现金流 ↔ 名义折现率；
- 实际现金流 ↔ 实际折现率；
- 使用同一币种和同一时间尺度。

### 4. 处理显性预测期之后的价值

企业不会因为模型只预测五年，就在第五年末消失。DCF 常用 Terminal Value（终值）概括显性预测期后的现金流。

稳定增长法写作：

```text
Terminal Valueₙ = FCFFₙ₊₁ / (r − g)
```

其中 `g` 是稳定增长率，并且必须满足 `r > g`。当 `g` 接近 `r` 时，分母趋近于零，终值会爆炸。这不是发现了巨大价值，而是模型在提醒你：长期假设已经失去经济约束。

### 5. 折现并相加

```text
Enterprise Value
= Σ PV(explicit-period FCFF)
+ PV(Terminal Value)
```

如果主线使用 FCFF，得到的是企业价值。一个简化的股权桥梁是：

```text
Equity Value = Enterprise Value − Net Debt
```

完整桥梁还可能需要加入非经营性现金和投资，再扣除优先股、少数股东权益、未计入资本成本的其他非股权请求权等。页面计算器为了突出机制，只使用净债务这一项。

## 一个具体的数字例子

假设一家虚构企业当前 FCFF 为 `$100m`：

- 显性预测期：5 年；
- 年增长率：7%；
- WACC：9%；
- 稳定增长率：3%；
- 净债务：`$250m`。

五年显性现金流的现值合计约为 `$473m`；终值折回今天约为 `$1,565m`。因此：

```text
Enterprise Value ≈ $2,038m
Equity Value     ≈ $1,788m
Terminal share  ≈ 77%
```

最后一行非常重要：约 77% 的企业价值来自终值。这并不自动说明模型错误，但说明结论主要由远期假设驱动。此时研究重点不应该只是把表格做得更精确，而应挑战稳定增长、竞争优势、再投资回报和折现率的一致性。

## DCF 真正有用的地方

### 把故事变成可检查的因果链

“这是一个优秀企业”不能直接进入模型。DCF 迫使叙事落到可检查的驱动因素：

```text
市场与竞争优势
→ 收入增长与利润率
→ 再投资需要
→ 自由现金流
→ 风险与折现率
→ 今天的价值
```

### 暴露分歧在哪里

两个人可能得到不同估值，但真正的分歧通常集中在少数问题：增长能持续多久、利润率能否达到稳定状态、增长需要多少再投资、风险是否与折现率一致。DCF 的价值之一，是把“我不同意这个价格”变成“我不同意哪一个经营或资本假设”。

### 比较决策，而不是制造确定感

DCF 可以比较收购、项目投资、资本配置或不同经营情景，但输出应理解为“在这组假设下的价值”。Sensitivity Analysis（敏感度分析）、Scenario Analysis（情景分析）、Stress Testing（压力测试）和 Monte Carlo Simulation（蒙特卡洛模拟）负责挑战这组条件。

## 什么时候适合 / 不适合？

### 更适合

- 资产的价值主要来自未来可分配现金流；
- 经营模式、单位经济性和再投资逻辑能够形成可解释的预测；
- 现金流口径、折现率与资本请求权可以一致配对；
- 目标是理解价值驱动因素，而不是只寻找一个市场倍数。

### 容易退化

- 早期企业长期没有正现金流，价值主要来自尚未验证的商业模式；
- 周期性企业正处于异常高点或低点，基准现金流没有正常化；
- 金融机构的债务更像经营原材料，传统 FCFF 与 WACC 桥梁需要改造；
- 资产价值主要来自可延迟、扩张或放弃的 Real Options（实物期权）；
- 终值占比极高，而稳定增长、回报率和再投资假设没有经济约束；
- 模型使用小数点制造精确感，却没有给关键变量做敏感度和压力测试。

这些情况不一定意味着“不能做 DCF”，而是意味着模型结构、现金流定义和不确定性处理必须改变。

## 容易混淆的概念

| 概念 | 类型 | 它回答什么？ | 与 DCF 的区别 |
|---|---|---|---|
| Present Value（现值） | 数学机制 | 一笔未来现金今天值多少？ | Present Value 是 DCF 的折现原子；DCF 把它应用到完整现金流序列与终值。 |
| NPV（Net Present Value，净现值） | 决策规则 | 项目现值减去初始投入后是否创造价值？ | DCF 是估值方法；NPV 常把 DCF 得到的价值与今天的成本相减。 |
| Relative Valuation（相对估值） | 市场比较方法 | 类似资产当前按什么倍数交易？ | 相对估值以市场价格为锚；DCF 以未来现金流假设为锚。 |
| DDM（Dividend Discount Model，股利折现模型） | 专门化模型 | 未来股利今天值多少？ | DDM 是 DCF 家族的一种，只折现支付给股东的股利。 |
| Residual Income（剩余收益模型） | 替代估值模型 | 账面资本之上的超额收益值多少？ | 在假设一致时可与 DCF 相容，但以账面价值和剩余收益组织模型。 |
| Sensitivity Analysis（敏感度分析） | 诊断方法 | 哪个假设最推动估值？ | 它挑战 DCF 输入，不是另一种价值定义。 |
| Monte Carlo Simulation（蒙特卡洛模拟） | 不确定性传播方法 | 多组相互关联的假设会形成什么价值分布？ | DCF 是价值函数 `f(·)`；Monte Carlo 反复给它不同输入。 |

## 概念邻居

- **[[time-value-of-money]] · 基础机制**：为什么等待和机会成本让未来金额不能直接相加。
- **[[free-cash-flow]] · 核心输入**：把利润、税、再投资与营运资本翻译成可分配现金。
- **[[weighted-average-cost-of-capital]] · 折现输入**：为 FCFF 提供与资本结构一致的要求回报。
- **[[terminal-value]] · 长期近似**：把显性预测期之后的现金流压缩成一个期末价值。
- **[[sensitivity-analysis]] · 诊断方法**：识别增长、利润率、折现率或终值中最值得研究的变量。
- **[[monte-carlo-simulation]] · 不确定性层**：把点估值升级为条件式价值分布。
- **[[margin-of-safety]] · 决策缓冲**：让价格与条件式价值之间保留应对模型错误和未知风险的空间。

## 常见误区

### “DCF 很主观，所以没有用”

输入当然包含判断，但主观不等于任意。好的 DCF 会让假设可见、相互一致、可被证伪，并允许别人指出具体分歧。隐藏在一个市场倍数里的判断并不会因为没有表格就消失。

### “折现率越高越保守”

只有其他假设不变时，折现率更高才会机械地降低现值。如果高风险同时伴随更高名义增长、通胀或不同现金流口径，随意提高折现率可能制造内部不一致，而不是保守。

### “终值就是模型剩下的垃圾桶”

终值往往占总价值的大部分，因此它更应该受到经营约束：稳定增长需要什么再投资？长期回报率是否会回落？增长率能否长期超过经济容量？风险是否已进入稳定状态？

### “模型算到小数点后两位，价值就很精确”

计算可以精确，输入却不一定准确。DCF 应输出范围、敏感度与关键假设，而不是把一个条件式估计伪装成事实。

### “企业价值就是股权价值”

FCFF 折现通常得到 Enterprise Value。只有经过现金、债务和其他资本请求权的桥梁，才能得到 Equity Value。把两者直接混用会造成系统性错误。

## 最小记忆卡

- **先选请求权，再选现金流与折现率：** FCFF ↔ WACC；FCFE ↔ Cost of Equity。
- **增长不是免费的：** 利润增长必须与再投资需要和资本回报相容。
- **终值不是附录：** 它常是估值主体，必须检查 `r > g` 与稳定状态。
- **DCF 输出的是条件句：** “如果这些假设成立，价值约为……”
- **精确计算不等于准确判断：** 用敏感度、情景、压力测试和 Monte Carlo 挑战模型。

## 自测

1. 为什么不能把 FCFF 用股权资本成本折现？
2. 如果 WACC 从 9% 上升到 10%，其他假设不变，价值为什么通常下降？
3. 当稳定增长率逐渐接近折现率时，终值发生什么？这说明了什么？
4. 一家公司收入增长很快，但需要更快地增加资本支出和营运资本，FCFF 一定同步增长吗？
5. 终值占企业价值的 85% 时，你最应该继续研究哪些假设？
6. DCF、Sensitivity Analysis 与 Monte Carlo Simulation 分别承担什么角色？

## Further reading

- [Aswath Damodaran, “Basics of Discounted Cash Flow Valuation”](https://pages.stern.nyu.edu/~adamodar/pdfiles/basics.pdf) — DCF 基本公式、FCFF / FCFE 与折现率配对，以及企业价值与股权价值的区别。
- [CFA Institute, “Free Cash Flow Valuation”](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/free-cash-flow-valuation) — FCFF、FCFE、多阶段模型与终值的系统框架。
- [Robert S. Harris, “Fundamentals of Discounted Cash Flow”](https://doi.org/10.2139/ssrn.909070) — 从时间价值、机会成本与风险解释 DCF 的基础直觉。
- [Myron J. Gordon, “Dividends, Earnings, and Stock Prices”](https://doi.org/10.2307/1927792) — 稳定增长折现模型的经典研究来源。
