---
title: '蒙特卡洛模拟'
fullName: 'Monte Carlo Simulation · 蒙特卡洛模拟'
shortName: 'Monte Carlo'
description: '生成许多条件式未来，看见范围、尾部与失败路径，而不是把模型误当成预测。'
mentalModel: '不要押注一个未来。抽取许多内部一致的未来，让完整模型逐一运行，再阅读结果分布。'
date: '2026-07-22'
updated: '2026-07-22'
domain: '金融与决策科学'
domainKey: 'finance-decision-science'
tags: ['不确定性', '概率', '模拟', '决策', '模型风险']
maturity: '持续生长'
published: true
featured: true
translationKey: 'monte-carlo-simulation'
interaction: 'monte-carlo-simulation'
socialImage: '/learn-img/monte-carlo-simulation/og-1200x627.jpg'
socialImageAlt: '纯英文横版图：许多可能路径从一个起点向外展开，位于 Monte Carlo Simulation 标题旁，表示一个模型产生许多条件式未来。'
cardImage: '/learn-img/monte-carlo-simulation/card-4x5.jpg'
cardImageAlt: '纯英文分享卡：一条橙色预测线展开成许多可能路径，标题为 Monte Carlo Simulation，并配有 one forecast to many conditional futures。'
neighbors:
  - name: '情景分析'
    fullName: 'Scenario Analysis · 情景分析'
    category: '叙事方法'
    summary: '比较少量内部一致、容易解释的未来，而不是系统抽取一个大分布。'
  - name: '压力测试'
    fullName: 'Stress Testing · 压力测试'
    category: '补充证据'
    summary: '强迫模型进入分布可能极少或从不生成的指定极端环境。'
  - name: '敏感度分析'
    fullName: 'Sensitivity Analysis · 敏感度分析'
    category: '诊断方法'
    summary: '识别哪些假设最能推动答案；蒙特卡洛负责传播它们的联合不确定性。'
  - name: '收益顺序风险'
    fullName: 'Sequence-of-Returns Risk · 收益顺序风险'
    category: '路径依赖风险'
    summary: '解释当提款或其他路径依赖现金流存在时，结果顺序为何会改变结局。'
  - name: '自助抽样'
    fullName: 'Bootstrap Resampling · 自助抽样'
    category: '抽样机制'
    summary: '对观测数据重复抽样，可为蒙特卡洛模型提供路径并保留选定的经验特征。'
  - name: '模型风险'
    fullName: 'Model Risk · 模型风险'
    category: '上位风险'
    summary: '涵盖模型结构、输入、数据、假设或使用方式不当造成的损失。'
sources:
  - title: 'Metropolis & Ulam (1949) · The Monte Carlo Method'
    url: 'https://doi.org/10.1080/01621459.1949.10483310'
  - title: 'NIST · New Tool to Account for Uncertainty'
    url: 'https://www.nist.gov/news-events/news/2020/01/new-tool-account-uncertainty'
  - title: 'FINRA Rule 2214 · Investment Analysis Tools'
    url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/2214'
  - title: 'CFP Board · Core Financial Planning Technologies Questionnaire'
    url: 'https://www.cfp.net/-/media/files/cfp-board/standards-and-ethics/compliance-resources/cfp-board-tech-guide-questionnaires-checklist.pdf'
---

# 蒙特卡洛模拟

一条预测线会把不确定性伪装成确定性。Monte Carlo Simulation（蒙特卡洛模拟）把它重新展开成一个分布。

方法很直接：反复抽取不确定输入，让每组输入通过同一个完整模型，再记录结果。一次运行代表一个内部一致的可能世界；数千次运行则揭示范围、中位数、尾部、阈值与失败路径。

最关键的词是**条件式**。结果只描述模型允许生成的世界，不代表模型发现了真实未来的客观概率。

## 一场户外活动

假设你要举办户外活动。“平均气温 22°C”并不足以决定是否需要租帐篷。

更有用的做法，是根据合理的气温、降雨和风速，把当天重播数千次，同时保留它们之间的关系。有些版本晴朗温暖，有些又冷、又湿、又刮风。然后你可以问：

- 有多少版本越过失败阈值？
- 下行尾部究竟有多糟？
- 哪一项准备最能减少脆弱结果？

蒙特卡洛模拟把同一逻辑应用到任何含不确定输入的模型。赌场只是名称来源；真正的核心是有纪律的抽样。

## 工作机制

先把结果写成模型：

```text
Y = f(X₁, X₂, …, Xₖ)
```

`Y` 是关心的结果，`X` 是不确定输入。一套有用的模拟通常包含七步：

1. **明确决策与成功条件。** “资产在 30 年内没有耗尽”可以检验；“方案看起来不错”不行。
2. **表达输入不确定性。** 为回报、需求、价格、增长、成本、通胀、工期或故障率定义范围或分布。
3. **表达依赖关系。** 相关性与因果约束让抽出的世界保持一致。每个输入单独合理，组合起来仍可能不可能。
4. **联合抽样一次。** 得到一个可能世界。
5. **跑完整模型。** 保留复利、时点、提款、再投资、排队等真正造成路径依赖的机制。
6. **反复运行。** 所有结果组成经验分布。
7. **阅读并挑战分布。** 报告范围、分位数、越线频率和失败路径，再改变假设并增加压力测试。

更多运行次数只会减少所选模型里的**抽样噪音**。它不会修复错误模型、遗漏风险、陈旧数据或不现实的分布。

## 一个长期资金模型

设模型从资产 `B₀` 开始，每年年初提款且提款随通胀增长，随后应用当年的净组合回报：

```text
Bₜ = max(0, [Bₜ₋₁ − W₀(1 + π)ᵗ⁻¹] × [1 + Rₜ − f])
```

- `Bₜ`：第 `t` 年末资产。
- `W₀`：第一次提款。
- `π`：通胀率。
- `Rₜ`：抽样得到的组合回报。
- `f`：年度费用率。

每次运行都会抽取不同的股票与债券回报顺序，同时保留假设中的相互关系，然后走完整条路径。若资产不足以支付某次提款，这条路径就被标为耗尽。

假设 2,000 条路径中有 1,640 条撑完整个期间。准确的表达是：

> 在这组回报、波动、相关性、通胀、费用、时点与提款规则之下，82% 的合成路径没有耗尽。

它不是“某个人客观上有 82% 的成功概率”。这个数字更适合在同一组假设下比较规则变化：降低支出、改变配置、降低成本、增加时间，或采用弹性提款策略。

本页只用于概念学习，不提供个性化投资建议。互动结果均为假设性结果，完全取决于页面上可见的模型假设。

## 为什么顺序会改变结局？

如果没有存入或取出现金，同一组年度回报无论怎样换序，最终复利结果都相同，因为乘法不在乎顺序。

一旦存在提款，顺序就重要了。早期亏损发生时，现金仍持续流出，本金会更快缩小；后来的反弹只能作用在更少的资产上。因此，两条平均回报相同的路径可能走向完全不同的结局。

这也是“平均路径”经常误导的原因。它可能不是任何一条真实路径，会隐藏中途耗尽，还会抹掉真正造成失败的机制。

## 应该读什么输出？

平均数通常不够。支持决策的读法一般包括：

- **中位数：** 模拟结果的中点，可以描述中心，但不是承诺。
- **分位数范围：** 例如第 10 至第 90 百分位区间。
- **越线频率：** 抽样世界中穿过指定失败线或目标线的比例。
- **失败时点：** 问题集中在早期、后期，还是某个特殊条件附近。
- **尾部严重度：** 越过阈值之后，结果还能坏到什么程度。
- **敏感度：** 哪些假设改变时，结果移动最大。

不说明条件的概率，会制造虚假精确。好的表达会把假设与输出放在一起。

## 什么时候有用？

蒙特卡洛模拟适合这些问题：

- 多个不确定输入会联合影响结果；
- 事件顺序与时点重要；
- 决策关注范围、尾部或阈值，而不只是平均数；
- 需要在同一套假设下比较不同规则；
- 没有简洁解析解，或解析解会隐藏完整路径。

应用并不限于金融模型，也包括项目工期、库存、可靠性、排队、能源需求、保险损失与测量不确定性。

## 失败长什么样？

### 垃圾输入，分布输出

专业外观的直方图不会让缺乏依据的输入变可信。最难的工作通常是定义可信世界，而不是生成随机数。

### 虚假精确

`84.7%` 可能只是把同一模型的答案算得更稳定。假设误差往往远大于蒙特卡洛抽样误差。

### 尾部失明

如果薄尾分布从不生成流动性冻结、跳跃、制度切换或相关性飙升，模拟当然看不到这些风险。需要额外加入明确的压力测试。

### 独立性幻想

把每个变量独立抽样会生成不可能的世界。增长、利润率、利率、违约与资产回报常常一起变化。

### 策略遗漏

现实中的个人与组织会调整支出、价格、人员、融资、库存或项目范围。固定策略模型可能高估或低估韧性。

### 目标错误

模型可能优化了错误的成功定义。期末余额刚好大于零，仍可能在途中违反流动性、服务、安全或质量约束。

## 容易混淆的邻近方法

- **情景分析**讲述少量内部一致的未来，容易解释，但覆盖的世界更少。
- **压力测试**强迫模型进入指定极端环境，适合补足分布没有覆盖的尾部。
- **敏感度分析**识别最值得研究或监控的假设，比单独一张分布图更直接地解释驱动因素。
- **历史模拟**保留真实历史组合，却无法展示样本中从未发生的环境。
- **自助抽样**从观测数据重复抽取；区块方法还能保留一部分时间结构。
- **预测**试图识别更可能发生的未来路径；蒙特卡洛通常更擅长条件式范围与稳健性，而不是指出哪条路径会成真。

## 记住五件事

1. 蒙特卡洛生成许多条件式路径，不提供一条特权预测。
2. 模型、输入分布、依赖关系与策略规则共同决定哪些世界可以存在。
3. 阅读范围、尾部、越线频率与失败路径，不要只看平均数。
4. 更多迭代减少的是抽样噪音，不是模型风险。
5. 在一致假设下比较决策，并把模拟与敏感度分析、压力测试配合使用。

## 自测

1. 为什么“每年固定 6%”与“平均回报 6% 的随机路径”可能产生不同结果？
2. 报告“82%”时，必须同时说明哪些假设？
3. 哪一种错误无法靠增加模拟次数修复？
4. 即使模拟已经有第 5 百分位，什么情况仍应加入指定压力测试？
5. 你的模型中，哪些输入不应该独立抽样？

## 延伸阅读

- [Metropolis & Ulam (1949), “The Monte Carlo Method”](https://doi.org/10.1080/01621459.1949.10483310)
- [National Institute of Standards and Technology · New Tool to Account for Uncertainty](https://www.nist.gov/news-events/news/2020/01/new-tool-account-uncertainty)
- [Financial Industry Regulatory Authority Rule 2214 · Requirements for Investment Analysis Tools](https://www.finra.org/rules-guidance/rulebooks/finra-rules/2214)
- [Certified Financial Planner Board · Core Financial Planning Technologies questionnaire](https://www.cfp.net/-/media/files/cfp-board/standards-and-ethics/compliance-resources/cfp-board-tech-guide-questionnaires-checklist.pdf)
