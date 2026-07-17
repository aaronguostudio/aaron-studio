---
title: '渐进披露'
fullName: 'Progressive Disclosure · 渐进披露'
shortName: '渐进披露'
description: '先给用户完成当前目标所需的最小完整界面，再随着意图与上下文逐层显露复杂度。'
mentalModel: '复杂度不要被删除，而要按用户意图分期支付。'
date: '2026-07-17'
updated: '2026-07-17'
domain: '交互设计'
domainKey: 'interaction-design'
tags: ['交互设计', '复杂度', '信息架构', '可发现性']
maturity: 'growing'
published: true
featured: false
translationKey: 'progressive-disclosure'
interaction: 'progressive-disclosure'
neighbors:
  - name: 'Disclosure Widget'
    fullName: 'Disclosure Widget · 披露控件'
    category: '实现机制'
    summary: '负责显示或隐藏内容；渐进披露则决定什么内容应该在什么时候出现。'
  - name: 'Contextual Disclosure'
    fullName: 'Contextual Disclosure · 情境披露'
    category: '触发变体'
    summary: '当用户选择或环境变化使某项内容相关时，才在原地显露它。'
  - name: 'Staged Disclosure'
    fullName: 'Staged Disclosure · 分阶段披露'
    category: '流程变体'
    summary: '把信息分布在连续步骤或页面中，更强调顺序和阶段转换。'
  - name: 'Information Architecture'
    fullName: 'Information Architecture · 信息架构'
    category: '结构基础'
    summary: '决定信息怎样分类与连接；渐进披露决定一次交互中哪一层先出现。'
  - name: 'Defaults'
    fullName: 'Defaults · 默认值'
    category: '决策捷径'
    summary: '预先选择常见答案，让第一层可以完整工作；隐藏默认值也可能制造意外。'
  - name: 'Feature Gating'
    fullName: 'Feature Gating · 功能门控'
    category: '访问策略'
    summary: '决定用户是否有权使用功能；渐进披露通常只改变功能何时可见。'
sources:
  - title: 'Apple Human Interface Guidelines · Disclosure controls'
    url: 'https://developer.apple.com/design/human-interface-guidelines/disclosure-controls'
  - title: 'IBM Documentation · Progressive Disclosure'
    url: 'https://www.ibm.com/docs/en/technical-content?topic=practices-progressive-disclosure'
  - title: 'W3C WAI-ARIA Authoring Practices Guide · Disclosure Pattern'
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/'
  - title: 'Carbon Design System · Accordion usage'
    url: 'https://carbondesignsystem.com/components/accordion/usage/'
  - title: 'Carroll & Carrithers (1984) · Blocking learner error states in a training-wheels system'
    url: 'https://doi.org/10.1177/001872088402600402'
---

# 渐进披露

一个功能丰富的产品很容易把所有能力同时倒在用户面前。每一项设置都可能合理，但它们一起出现时，最常见的任务反而更难开始。

Progressive Disclosure（渐进披露）提供了另一种安排复杂度的方法：**先给用户完成当前目标所需的最小完整界面，再随着意图和上下文逐层显露次要或高级选项。**

它不是删除复杂度，而是决定复杂度什么时候出现。

## 相机的 Auto 与 Pro

拿起相机时，大多数人只需要构图和按快门。Auto 模式先替用户处理曝光、对焦和白平衡，因此第一秒就能完成拍照。

需要控制运动模糊时，可以进入更深一层调整快门速度；需要精确掌控时，再进入 Pro 模式控制光圈、快门与感光度。

专业能力没有消失，只是没有在第一次拍照之前向所有人收费。

但“这张照片会被永久删除”不能被藏进高级层。**低频不等于低重要性；风险和后果必须参与分层。**

## 第一层要最小，但必须完整

假设用户只想导出一份报告。第一层可以是：

```text
文件名       quarterly-report
格式         PDF（Portable Document Format，便携式文档格式）
保存到       Downloads
             [ 高级选项 ] [ 导出 ]
```

用户不展开任何内容，也能完成最常见任务，并且知道结果是什么。第二层再放页面范围、图像质量与元数据；第三层放颜色配置、字体嵌入与压缩算法。

这三层分别回答：

1. 我要完成什么？
2. 结果需要怎样调整？
3. 我要怎样控制底层实现？

如果第一层只有一个模糊按钮，而重要默认值全藏在后面，那不是渐进披露，而是隐藏决策。

## 怎样决定什么先出现？

不要从“哪些控件可以折叠”开始。先为每项信息判断四个维度：

| 维度   | 要问的问题                                     |
| ------ | ---------------------------------------------- |
| 必要性 | 没有它，当前任务还能完成吗？                   |
| 频率   | 有多少用户、多少次任务会用到？                 |
| 风险   | 隐藏它会不会改变费用、权限、安全或不可逆后果？ |
| 依赖   | 它是否只有在另一个选择出现后才有意义？         |

频繁、必需或高风险的信息通常留在第一层；低频、低风险且依赖特定意图的信息适合后置。

## 一个 Artificial Intelligence（AI，人工智能）Agent 例子

AI Agent 的设置很容易堆满模型、工具、上下文、预算、记忆、运行环境和审批策略。

一个合理起点可能是：

- 第一层：目标、输入和输出；
- 第二层：受众、语气、长度和允许使用的来源；
- 第三层：模型、重试、预算和工具配置。

但 Tool access（工具权限）、外部写入、费用上限和破坏性操作属于高风险后果。即使低频，也应该在执行前明确显示或确认，不能因为“这是高级设置”就藏起来。

所以真实的分层不只是新手对专家，而是：

```text
披露层级 = 任务相关性 × 使用频率 × 选项依赖 × 行为后果
```

## 入口本身也是设计

“显示格式设置”比孤立的 `+` 或三点图标更容易形成正确预期。披露入口应该靠近它控制的内容，并说明将出现什么。

在网页里，Disclosure（披露控件）通常由一个按钮和一块受控内容组成。WAI-ARIA（Web Accessibility Initiative – Accessible Rich Internet Applications，Web 无障碍倡议—无障碍富互联网应用）Authoring Practices Guide 建议使用真正的按钮，用 `aria-expanded` 暴露状态，让 Enter 与 Space 都能切换，并且不要只靠 hover。

## 什么时候适合？

- 功能很多，但常见任务只需要一个稳定子集；
- 选项有自然依赖，例如打开“自定义压缩”后才需要压缩率；
- 新手需要快速进入，专家仍需要完整控制；
- 移动端、侧栏或属性面板的空间有限；
- 详细信息有价值，但不是每个人每次都要读。

## 什么时候会变坏？

- 用户需要同时比较价格、权限或方案，却必须逐个展开；
- 总价、自动续费、删除后果或公开范围被藏起来；
- 两行说明也做成折叠区，白白增加一次操作；
- 专家每次都要打开相同区域；
- 隐藏内容无法被快速扫描、查找或打印；
- 入口标签含糊，用户根本不知道功能存在。

常见失败包括：

- **点击隧道：** `More → Advanced → Customize → Details` 才找到常用设置；
- **神秘入口：** 只有一个不知道会打开什么的图标；
- **隐藏风险：** 用视觉简洁掩盖费用、权限或不可逆后果；
- **状态失忆：** 每次都忘记专家的展开选择，或折叠时清空输入；
- **隐藏依赖：** 第一层结果受隐藏默认值影响，却没有任何摘要。

## 看清概念邻居

- **Disclosure Widget（披露控件）是实现机制。** 按钮、三角形、`details/summary` 或 Accordion（手风琴）负责显示和隐藏；渐进披露是决定为什么、何时、披露什么的策略。
- **Contextual Disclosure（情境披露）是触发变体。** 勾选 “Schedule” 后出现日期与时区，内容随着状态变得相关。
- **Staged Disclosure（分阶段披露）是流程变体。** 把内容放进连续步骤或 Wizard（向导），更强调任务顺序。
- **Information Architecture（信息架构）是结构基础。** 它负责分类、命名与连接；错误分类不会因为折叠动画而变好。
- **Defaults（默认值）是决策捷径。** 它让第一层可以直接工作，但隐藏默认值也可能制造意外。
- **Feature Gating（功能门控）是访问策略。** 它决定能不能用；渐进披露通常只改变什么时候看见。

## 记住这六件事

1. 复杂度不要被删除，而要按用户意图分期支付。
2. 第一层必须最小但完整：任务能完成，结果看得见。
3. 分层同时考虑必要性、频率、依赖与后果。
4. 低频风险不能为了简洁被藏起来。
5. 披露控件是机制，渐进披露是策略。
6. 如果用户总在找、总在展开或总被隐藏默认值惊讶，分层就失败了。

## 自测

1. 用户不展开任何内容，能否完成最常见任务并预测结果？
2. 哪些信息虽然低频，却因为费用、权限或不可逆性必须一直可见？
3. 触发器是否说明将出现什么？
4. 第二层是否增加新的决策价值？
5. 键盘和辅助技术能否感知展开状态？
6. 专家是否总在重复打开同一层？

## Further reading

- [Apple Human Interface Guidelines · Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls)
- [IBM Documentation · Progressive Disclosure](https://www.ibm.com/docs/en/technical-content?topic=practices-progressive-disclosure)
- [W3C WAI-ARIA Authoring Practices Guide · Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [Carbon Design System · Accordion usage](https://carbondesignsystem.com/components/accordion/usage/)
- [Carroll & Carrithers (1984) · Blocking learner error states in a training-wheels system](https://doi.org/10.1177/001872088402600402)
