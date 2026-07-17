---
type: concept
date: 2026-07-17
updated: 2026-07-17
title: "Progressive Disclosure"
aliases: [渐进披露, 渐进式披露, Progressive Reveal]
domain: [interaction-design, information-architecture, human-computer-interaction]
tags: [complexity, hierarchy, discoverability, accessibility, product-design]
status: active
maturity: growing
related:
  - "[[concepts/contextual-disclosure]]"
  - "[[concepts/staged-disclosure]]"
  - "[[concepts/information-architecture]]"
  - "[[concepts/defaults]]"
  - "[[concepts/onboarding]]"
  - "[[concepts/feature-gating]]"
---

# Progressive Disclosure · 渐进披露

> **一句话：先给用户完成当前目标所需的最小完整界面，再随着意图与上下文逐层显露次要或高级选项。**

[打开互动解释页](pages/progressive-disclosure.html)

## 它在解决什么问题？

功能会不断增加，但人的注意力、工作记忆和判断速度不会跟着扩容。

假设一个导出窗口同时放出 18 项设置：文件名、格式、保存位置、分辨率、压缩率、色彩空间、字体嵌入、元数据、页面范围、出血、裁切标记……每一项都可能合理，但它们一起出现时，最常见的任务——“把当前文档导出成 PDF（Portable Document Format，便携式文档格式）”——反而变得困难。

Progressive Disclosure（渐进披露）不删除这些能力，而是改变复杂度出现的时间：

```text
第一层：完成当前任务必需的信息
          ↓ 用户表达更深意图
第二层：不常用但容易理解的选项
          ↓ 用户主动进入专业控制
第三层：高级、低频或领域专用设置
```

它的核心不是“少”，而是 **relevance over time（相关性随时间出现）**。

## 先用一个生活类比：相机的 Auto 与 Pro

大多数时候，拿起相机的人只需要构图和按快门。Auto 模式让曝光、对焦和白平衡先由系统处理，因此第一秒就能拍到照片。

需要控制运动模糊时，用户可以进入更深一层调整快门速度；需要精确掌控画面时，再进入 Pro 模式同时控制 aperture（光圈）、shutter speed（快门速度）和 ISO（International Organization for Standardization 感光度标尺）。

专业能力没有消失，只是没有在第一次拍照之前向所有人收费。

但如果相机把“照片会被永久删除”也藏进高级菜单，就是错误的渐进披露。**低频不等于低重要性；风险和后果必须参与分层。**

## 它怎样工作？

### 1. 先按任务划分，而不是按组件划分

不要先问“哪些控件可以折叠”，要先问：用户此刻来完成什么？

对每个元素至少标记四件事：

| 维度 | 问题 |
|---|---|
| Necessity（必要性） | 没有它，当前任务还能完成吗？ |
| Frequency（频率） | 有多少用户、多少次任务会用到？ |
| Risk（风险） | 隐藏它会不会改变费用、权限、安全或不可逆后果？ |
| Dependency（依赖） | 它是否只有在另一个选择出现后才有意义？ |

频繁、必需或高风险的信息通常留在第一层；低频、低风险且依赖特定意图的信息适合后置。

### 2. 第一层必须“最小但完整”

第一层不是残缺预告。用户应该能在不展开高级选项的情况下完成最常见任务，并且知道结果是什么。

一个好的导出窗口第一层可能包含：

```text
File name     quarterly-report
Format        PDF
Save to       Downloads
              [ Advanced options ] [ Export ]
```

如果默认值会影响结果，界面应该把当前默认状态说出来，而不是让用户猜。

### 3. 触发器要描述将出现什么

“Advanced options（高级选项）”“Show formatting（显示格式设置）”比孤立的 `+`、三点图标或“More”更容易形成正确预期。

显露入口应该：

- 放在它控制的内容附近；
- 有清楚、稳定的标签；
- 用方向、状态或摘要提示还有内容；
- 展开后保留用户的空间与任务上下文。

### 4. 每一层都要增加新的决策价值

第二层不能只是重复第一层。它应该回答更具体的问题，例如：

```text
第一层：我要导出什么？
第二层：质量、页面范围和元数据怎样处理？
第三层：颜色配置、字体嵌入和压缩算法怎样控制？
```

International Business Machines（IBM，国际商业机器公司）的内容设计指导把这种关系描述为 guided journey（被引导的旅程），而不是 scavenger hunt（寻宝游戏）：用户每深入一步，都应该获得与当前意图相关的新信息。

### 5. 让展开状态可感知、可操作、可恢复

在网页里，Disclosure（披露控件）通常由一个按钮和一块被它控制的内容组成。WAI-ARIA（Web Accessibility Initiative – Accessible Rich Internet Applications，Web 无障碍倡议—无障碍富互联网应用）Authoring Practices Guide 建议：

- 使用真正的 `button`；
- 用 `aria-expanded` 暴露展开或折叠状态；
- 可用 `aria-controls` 指向被控制区域；
- 键盘的 Enter 与 Space 都能切换；
- 不依赖 hover 才能看到关键内容。

如果专家反复使用高级层，可以考虑记住展开状态或提供可配置默认视图。

### 6. 用行为验证分层，而不是凭审美决定

检查至少四类信号：

- 常见任务的完成时间和错误率是否下降？
- 用户能否发现第二层能力？
- 用户是否频繁展开后立即收起，说明分组或标签不对？
- 专家是否每次都要重复打开同一层，说明默认层级过浅？

渐进披露是一种关于任务分布的假设，需要被真实行为验证。

## 一个具体例子：Artificial Intelligence（AI，人工智能）Agent 设置

AI Agent 的设置很容易堆满模型、工具、温度、上下文窗口、预算、记忆、运行环境与审批策略。

可以这样分层：

### 第一层：任务与结果

```text
Goal           Summarize customer feedback
Input          feedback-july.csv
Output         A one-page brief
               [ Run ]
```

### 第二层：质量与范围

```text
Audience       Product leadership
Tone           Direct
Sources        Uploaded file only
Length         About 500 words
```

### 第三层：执行控制

```text
Model          ...
Tool access    ...
Budget limit   ...
Retry policy   ...
```

但这不是固定答案。Tool access（工具权限）、费用上限、外部写入和 destructive action（破坏性操作）是否允许，属于高风险后果；即使使用频率低，也应该在执行前显式确认，而不能被“高级设置”吞掉。

所以真正的分层公式更接近：

```text
disclosure layer = task relevance × frequency × dependency × consequence
```

它不是单纯按“新手 / 专家”排序。

## 什么时候适合？

- 产品功能多，但大多数任务只需要其中一个稳定子集；
- 选项有自然依赖，例如选择“自定义压缩”后才需要压缩率；
- 新手需要快速进入，专家仍需要完整控制；
- 屏幕空间有限，例如移动端、侧栏、属性面板；
- 详细信息有价值，但不是每个人每次都要读。

## 什么时候不适合？

- **必须比较的选项。** 如果用户需要同时比较价格、权限或方案，把它们折叠起来会破坏判断。
- **关键风险与后果。** 总价、自动续费、数据删除、公开范围、AI Agent 的外部写入权限不能靠“更多”才看见。
- **很短的内容。** 两行说明做成折叠区，只会增加一次点击。
- **搜索与扫描任务。** 隐藏内容可能无法被浏览器页面内查找，或让用户无法快速扫视全局。
- **专家高频控制台。** 每次操作都展开相同区域，会把认知负担换成机械负担。
- **入口本身不易发现。** 如果触发器不清楚，复杂度不是被管理，而是变成丢失的能力。

## 失败长什么样？

### Click tunnel（点击隧道）

用户需要连续打开“More → Advanced → Customize → Details”才能找到一个常用设置。层级存在，但没有贴合任务。

### Mystery meat disclosure（不可辨认的披露入口）

界面只放一个没有标签的图标，用户不知道它可点击，也不知道点击会出现什么。

### Safety laundering（以简洁掩盖风险）

费用、数据用途或不可逆结果被放进折叠区。视觉更干净，但知情决策更差。

### State amnesia（状态失忆）

界面每次都忘记专家的展开选择，或者折叠时悄悄清空输入。

### Hidden dependency（隐藏依赖）

第一层选项的结果依赖第二层默认值，但界面没有暴露摘要。用户以为自己做了完整决定，实际还有看不见的变量。

## 它和相邻概念是什么关系？

### Disclosure Widget（披露控件）· 实现机制

按钮、三角形、`details/summary` 或 Accordion（手风琴）负责显示与隐藏一块内容。它们是机制；Progressive Disclosure 是决定何时隐藏、隐藏什么、为何显露的设计策略。一个页面用了 Accordion，不代表它就拥有合理的渐进披露。

### Contextual Disclosure（情境披露）· 触发变体

当上下文使某个选项相关时自动或就地显露。例如勾选“Schedule”后出现日期与时区。它是按状态触发的渐进披露。

### Staged Disclosure（分阶段披露）· 流程变体

把内容分散在多个连续步骤或页面，例如结账 Wizard（向导）。Progressive Disclosure 可以发生在同一视图；Staged Disclosure 更强调任务顺序和阶段转换。

### Information Architecture（信息架构）· 结构基础

信息架构决定内容怎样分类、命名和连接；渐进披露决定在一次交互中哪一部分先出现。错误的分类不会因为加上折叠动画而变好。

### Defaults（默认值）· 决策捷径

默认值替用户预先选择常见答案，渐进披露控制何时让其他答案进入视野。好的默认值能让第一层完整；坏的隐藏默认值会让结果不可预测。

### Onboarding（首次引导）· 教学模式

Onboarding 介绍产品或帮助第一次成功；渐进披露管理日常界面的持续复杂度。Tour（产品导览）结束后，产品仍然需要合理层级。

### Feature Gating（功能门控）· 访问策略

Feature Gating 根据权限、套餐、地区或发布阶段决定用户能不能使用功能；渐进披露通常只改变功能何时可见，不应假装用户无权访问它。

## 常见误区

### “渐进披露就是隐藏高级功能”

不够准确。它也可以显示详细解释、依赖字段、下一步行动或与当前情境有关的信息。关键是相关性随意图增加。

### “越少越好”

少不是目标。第一层必须足以完成任务，并暴露结果、关键状态与风险。

### “新手用简单版，专家用复杂版”

用户不是固定身份。同一个专家在陌生领域也是新手；同一个普通用户在某项高频任务上可能需要专业控制。按任务与情境分层，通常比按人格标签分层更稳。

### “用 hover tooltip 就能放所有说明”

Hover 在触摸设备上不存在，也可能对键盘与辅助技术不可达。关键说明需要可聚焦、可感知、可持久查看。

### “折叠内容不影响搜索和理解”

隐藏会降低可扫描性，也可能妨碍页面内查找、打印、比较和形成全局心智模型。必要时提供“展开全部”、摘要或独立完整视图。

## 最小记忆卡

- **复杂度不要被删除，而要按用户意图分期支付。**
- 第一层必须最小但完整：常见任务能完成，关键结果看得见。
- 分层同时考虑必要性、频率、依赖与后果；低频风险不能被藏起来。
- Disclosure widget 是机制，Progressive Disclosure 是策略。
- 入口要可发现、可描述、可用键盘操作，并暴露展开状态。
- 如果用户总在找、总在展开或总被隐藏默认值惊讶，分层就失败了。

## 自测

1. 用户不展开任何内容，能否完成最常见任务并预测结果？
2. 哪些信息虽然低频，却因为费用、权限或不可逆性必须一直可见？
3. 触发器是否说清楚将出现什么，还是只有一个神秘图标？
4. 第二层是否增加新决策价值，而不是重复第一层？
5. 键盘与辅助技术能否感知并切换展开状态？
6. 专家是否每次都在重复打开同一层？
7. 折叠是否破坏了搜索、比较、打印或全局理解？

## Further reading

- [Apple Human Interface Guidelines · Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls) — 把高级功能放在清晰、邻近、可预测的披露层级中。
- [IBM Documentation · Progressive Disclosure](https://www.ibm.com/docs/en/technical-content?topic=practices-progressive-disclosure) — 从内容与任务角度解释有序显露、清晰路径与 guided journey。
- [W3C WAI-ARIA Authoring Practices Guide · Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) — 披露控件的键盘行为、`aria-expanded` 与 `aria-controls`。
- [Carbon Design System · Accordion usage](https://carbondesignsystem.com/components/accordion/usage/) — Accordion 何时有助于处理大量相关内容，以及隐藏内容带来的发现风险。
- [Carroll & Carrithers (1984) · Blocking learner error states in a training-wheels system](https://doi.org/10.1177/001872088402600402) — 与渐进披露相邻的早期 Human–Computer Interaction（HCI，人机交互）研究：暂时限制新手不需要的功能如何改善入门学习；它是历史前驱，不等于今天所有披露模式。
