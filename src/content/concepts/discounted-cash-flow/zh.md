---
title: '折现现金流估值'
fullName: 'Discounted Cash Flow Valuation · 折现现金流估值'
shortName: 'DCF'
description: '把未来现金流、时间与风险翻译成今天的条件式价值。'
mentalModel: 'DCF 是一台翻译器：未来现金流 + 时间 + 风险 → 今天的价值。'
date: '2026-07-23'
updated: '2026-07-23'
domain: '金融与估值'
domainKey: 'finance-valuation'
tags: ['估值', '现值', '自由现金流', '资本成本', '终值']
maturity: '持续生长'
published: true
featured: true
translationKey: 'discounted-cash-flow'
interaction: 'discounted-cash-flow'
socialImage: '/learn-img/discounted-cash-flow/og-1200x627.jpg'
socialImageAlt: '纯英文横版编辑图：未来现金流柱经过时间与风险折现，变成更小的现值方块，旁边是 Discounted Cash Flow 标题。'
cardImage: '/learn-img/discounted-cash-flow/card-4x5.jpg'
cardImageAlt: '纯英文编辑风分享卡：标题为 Discounted Cash Flow，未来现金流柱经过时间与风险被翻译成今天的现值。'
neighbors:
  - name: '现值'
    fullName: 'Present Value · 现值'
    category: '数学机制'
    summary: '把一笔未来金额换算成今天的单位；DCF 把这个机制应用于完整现金流序列。'
  - name: '自由现金流'
    fullName: 'Free Cash Flow · 自由现金流'
    category: '核心输入'
    summary: '把经营利润、税、再投资与营运资本连接到可供资本提供者分配的现金。'
  - name: 'WACC'
    fullName: 'Weighted Average Cost of Capital · 加权平均资本成本'
    category: '折现率输入'
    summary: '提供与企业自由现金流相匹配的综合要求回报。'
  - name: '终值'
    fullName: 'Terminal Value · 终值'
    category: '长期近似'
    summary: '把显性预测期后的全部现金流压缩成预测期末的一项价值。'
  - name: '敏感度分析'
    fullName: 'Sensitivity Analysis · 敏感度分析'
    category: '诊断方法'
    summary: '显示哪些假设最能推动条件式估值。'
  - name: '蒙特卡洛模拟'
    fullName: 'Monte Carlo Simulation · 蒙特卡洛模拟'
    category: '不确定性层'
    summary: '让 DCF 价值函数在许多内部一致的输入组合上运行，形成条件式分布。'
sources:
  - title: 'Aswath Damodaran · Basics of Discounted Cash Flow Valuation'
    url: 'https://pages.stern.nyu.edu/~adamodar/pdfiles/basics.pdf'
  - title: 'CFA Institute · Free Cash Flow Valuation'
    url: 'https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/free-cash-flow-valuation'
  - title: 'Robert S. Harris · Fundamentals of Discounted Cash Flow'
    url: 'https://doi.org/10.2139/ssrn.909070'
  - title: 'Myron J. Gordon · Dividends, Earnings, and Stock Prices'
    url: 'https://doi.org/10.2307/1927792'
---

# 折现现金流估值

DCF（Discounted Cash Flow，折现现金流估值）问的是一个简单但要求很高的问题：**未来可分配现金流，在考虑收到时间与承担风险所要求的回报后，今天值多少？**

答案并不是隐藏在公式里的“正确价格”，而是一句条件句：

> 如果这些经营、再投资、时间与风险假设成立，估计价值大约是这个数。

这是理解 DCF 的核心。表格可以计算得非常精确，但输入假设仍然可能高度不确定。

## 一台会吐出现金券的机器

想象你要买一台每年吐出一张现金券的机器。

卖家可能说，它未来十年总共会产生 `$1,000`。但直接把现金券相加，相当于认为明年的 `$100` 和十年后的 `$100` 完全相同。

你会给每张未来现金券盖上“等待与风险折扣”：

- 越晚收到，今天的价值越低；
- 越不确定，要求的回报越高，今天的价值也越低；
- 把每张现金券都折成同一个“今天单位”后，再把它们相加。

这就是折现的直觉。真实 DCF 还要处理税、再投资、资本结构、终值，以及定义之间的一致性。

## 先决定你在估谁的现金流

第一步不是挑增长率，而是确定资本请求权。

- **FCFF（Free Cash Flow to the Firm，企业自由现金流）**属于债权人和股东等全部资本提供者。它通常使用 WACC（Weighted Average Cost of Capital，加权平均资本成本）折现，得到 Enterprise Value（企业价值）。
- **FCFE（Free Cash Flow to Equity，股权自由现金流）**只属于普通股股东。它使用 Cost of Equity（股权资本成本）折现，直接得到 Equity Value（股权价值）。

现金流定义与折现率必须配对。把 FCFF 用股权资本成本折现，或把 FCFE 用 WACC 折现，会混淆谁收到现金、谁承担风险。

本页互动模型使用 FCFF、WACC 和一条简化的净债务桥梁。

## 建立显性预测期

常见的 FCFF 桥梁以 EBIT（Earnings Before Interest and Taxes，息税前利润）为起点：

```text
FCFF
= EBIT × (1 − tax rate)
+ Depreciation & Amortization
− Capital Expenditure
− Change in Net Working Capital
```

这条桥梁暴露出乐观叙事常常隐藏的约束：**增长不是免费的。** 更多收入可能先要求更多存货、应收账款、设备、研发、渠道或其他再投资，之后才可能变成可分配现金。

第 `t` 年现金流的现值是：

```text
FCFFₜ 的现值 = FCFFₜ / (1 + r)ᵗ
```

折现率 `r` 必须与现金流使用相同的币种、通胀口径、时间尺度和资本请求权。

## 处理预测期之后的现金流

企业不会因为模型只预测五年，就在第五年末消失。DCF 因此使用 Terminal Value（终值）概括显性预测期后的现金流。

常见的稳定增长公式是：

```text
Terminal Valueₙ = FCFFₙ₊₁ / (r − g)
```

其中 `g` 是稳定增长率，模型要求 `r > g`。

当 `g` 接近 `r` 时，分母趋近于零，终值会爆炸。这不是发现了巨大的价值，而是长期假设已经失去经济约束的警报。

把终值折回今天，再与显性期现金流相加：

```text
Enterprise Value
= Σ 显性期 FCFF 的现值
+ 终值的现值
```

简化的股权桥梁是：

```text
Equity Value = Enterprise Value − Net Debt
```

完整桥梁还可能加入非经营性现金和投资，并扣除其他非股权请求权。互动模型只使用净债务，让核心机制保持清晰。

## 一个数字例子

假设一家虚构企业从 `$100m` 的 FCFF 开始：

- 五年显性预测期；
- FCFF 每年增长 7%；
- WACC 为 9%；
- 稳定增长率为 3%；
- 净债务为 `$250m`。

五年显性现金流的现值约为 `$473m`，终值折回今天约为 `$1,565m`。

```text
Enterprise Value ≈ $2,038m
Equity Value     ≈ $1,788m
Terminal share  ≈ 77%
```

最后一行通常最值得关注。77% 的终值占比并不自动说明模型错误，但它说明大部分答案都由远期假设控制。接下来更值得研究的是可持续增长、再投资、竞争优势与折现率，而不是多算一个小数位。

## DCF 真正有用的地方

### 把故事变成因果链

“这是一家优秀企业”无法直接进入模型。DCF 迫使叙事落到可以观察和挑战的驱动因素：

```text
市场与竞争优势
→ 收入增长与利润率
→ 再投资
→ 自由现金流
→ 风险与要求回报
→ 今天的价值
```

### 找到分歧的位置

两个人可能算出不同价值，但分歧通常集中在少数假设：增长能持续多久、稳定利润率是多少、增长需要多少再投资、风险是否被一致地反映。

DCF 把“我不同意这个价格”转化成“我不同意这个经营或资本假设”。

### 比较决策，而不是假装知道未来

DCF 可以在统一框架下比较项目、收购、资本配置或经营情景。Sensitivity Analysis（敏感度分析）、Scenario Analysis（情景分析）、Stress Testing（压力测试）与 Monte Carlo Simulation（蒙特卡洛模拟）再负责挑战这个条件式答案。

## 什么时候有效，什么时候会退化

DCF 通常更适合以下情况：

- 价值主要来自未来可分配现金流；
- 经营模式与再投资逻辑能够解释；
- 现金流与折现率能够一致配对；
- 目的是理解价值驱动因素，而不只是复刻一个市场倍数。

它在以下情况容易变得脆弱：

- 早期企业还没有可信的正常化现金流路径；
- 周期性企业正处于异常高点或低点；
- 债务更像经营原材料，例如许多金融机构；
- 价值主要来自延迟、扩张或放弃的选择权；
- 终值占比很高，但稳定状态经济性没有约束；
- 模型用精确感做装饰，却没有测试关键输入。

这些情况不一定完全禁止 DCF，但往往要求改变模型结构、现金流定义或不确定性处理。

## 常见误区

### “DCF 很主观，所以没有用”

判断不可避免，但判断不必隐藏。好的 DCF 会让假设可见、内部一致、可以证伪，也方便别人挑战。市场倍数同样包含假设，只是它们没有被明确写出。

### “提高折现率一定更保守”

在其他条件不变时，提高折现率会降低现值。但如果风险、通胀、增长与现金流口径被不一致地调整，得到的不是保守，而是一个不匹配的模型。

### “终值只是剩余项”

终值经常构成大部分估值，因此更需要经营约束：稳定增长需要多少再投资？资本回报会不会回落？增长率能否低于折现率，并与经济容量相容？

### “精确计算等于准确估值”

算术可以完全正确，假设却可能错误。负责的输出是带有可见驱动因素的范围，而不是伪装成事实的小数。

### “企业价值就是股权价值”

FCFF 用 WACC 折现通常得到企业价值。只有经过现金、债务与其他请求权的桥梁，才能得到股权价值。

## 记住这五件事

1. 匹配请求权、现金流与折现率：FCFF ↔ WACC；FCFE ↔ 股权资本成本。
2. 增长要先消耗再投资，之后才可能变成可分配现金。
3. 终值往往是估值主体，而不是附录。
4. DCF 输出的是条件句，不是客观价格。
5. 用敏感度、情景、压力测试和模拟挑战结果。

## 自测

1. 为什么不能把 FCFF 用股权资本成本折现？
2. 在其他条件不变时，WACC 上升为什么通常会让价值下降？
3. 稳定增长率接近折现率时会发生什么？
4. 收入上升而 FCFF 下降是否可能？哪些再投资会造成这种结果？
5. 如果终值占企业价值的 85%，哪些假设最值得继续研究？

本页只提供通用、假设性的概念学习，不构成投资建议，也不估计任何真实证券或公司的价值。

## Further reading

- [Aswath Damodaran, “Basics of Discounted Cash Flow Valuation”](https://pages.stern.nyu.edu/~adamodar/pdfiles/basics.pdf)
- [CFA Institute, “Free Cash Flow Valuation”](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/free-cash-flow-valuation)
- [Robert S. Harris, “Fundamentals of Discounted Cash Flow”](https://doi.org/10.2139/ssrn.909070)
- [Myron J. Gordon, “Dividends, Earnings, and Stock Prices”](https://doi.org/10.2307/1927792)
