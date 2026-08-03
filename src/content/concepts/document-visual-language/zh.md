---
title: "文档视觉语言"
fullName: "Document Visual Language · 文档视觉语言"
shortName: "文档视觉语言"
description: "一套把文档意图翻译成主题、设计 Token、组件、模式与无障碍准则的工作模型。"
mentalModel: "工作模型：主题为共享 Token 指定值；组件与模式把这些设计决策一致地应用出来。"
date: "2026-07-18"
updated: "2026-08-03"
domain: "文档设计"
domainKey: "document-design"
tags: ["文档设计", "字体排印", "设计系统", "设计令牌"]
maturity: "growing"
published: true
featured: false
translationKey: "document-visual-language"
interaction: "document-visual-language"
socialImage: "/learn-img/document-visual-language/og-1200x627.jpg"
socialImageAlt: "横版现代编辑图，标题为 Document Design System，展示主题怎样进入 Token、组件与最终文档。"
cardImage: "/learn-img/document-visual-language/card-4x5.jpg"
cardImageAlt: "竖版现代编辑图，标题为 Document Design System，展示主题怎样进入 Token、组件与最终文档。"
neighbors:
  - name: "Document Purpose"
    fullName: "Document Purpose / Information Type · 文档目的 / 信息类型"
    category: "内容意图"
    summary: "描述读者要得到的结果。DITA 的 concept、task、reference 是正式信息类型；模拟器使用的是更宽泛的实用示例。"
  - name: "Design Tradition"
    fullName: "Historical Design Tradition · 历史设计传统"
    category: "历史来源"
    summary: "指向 International Typographic Style、New Typography 等有文献记录的运动或字体排印传统。"
  - name: "Design Practice"
    fullName: "Design Practice · 设计实践"
    category: "专业领域"
    summary: "使用 Editorial design、Information design、Technical communication 等已有专业领域。"
  - name: "Theme"
    fullName: "Design Theme · 设计主题"
    category: "命名实现"
    summary: "为某个产品或情境中的共享设计角色指定一组协调数值。"
  - name: "Design Tokens"
    fullName: "Design Tokens · 设计令牌"
    category: "实现数据"
    summary: "保存精确颜色、尺寸、字体角色和间距，但不会替团队决定文档策略。"
  - name: "Components and Patterns"
    fullName: "Components and Patterns · 组件与模式"
    category: "可复用行为"
    summary: "组件封装可复用部分；模式说明怎样为反复出现的用户需要组合组件。"
sources:
  - title: "Design Tokens Community Group · Design Tokens Format Module 2025.10"
    url: "https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/"
  - title: "GOV.UK Design System · Styles, components and patterns"
    url: "https://design-system.service.gov.uk/"
  - title: "Material Web · Theming"
    url: "https://material-web.dev/theming/material-theming/"
  - title: "OASIS DITA 1.3 · Information typing"
    url: "https://docs.oasis-open.org/dita/dita/v1.3/os/part1-base/archSpec/base/information-typing.html"
  - title: "Cooper Hewitt · A Harmony of Contrasts"
    url: "https://www.cooperhewitt.org/2018/08/05/aharmonyofcontrasts/"
  - title: "Museum of Modern Art · The New Typography"
    url: "https://www.moma.org/calendar/exhibitions/1013"
  - title: "Bauhaus-Archiv · Bauhaus Typography"
    url: "https://www.bauhaus.de/en/research/publications/bauhaus-typography/"
  - title: "Victoria and Albert Museum · An introduction to Art Deco"
    url: "https://www.vam.ac.uk/articles/an-introduction-to-art-deco"
  - title: "Victoria and Albert Museum · Art Nouveau — an international style"
    url: "https://www.vam.ac.uk/articles/art-nouveau-an-international-style"
  - title: "World Wide Web Consortium · Web Content Accessibility Guidelines 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - title: "PDF Association · ISO 14289-1 / PDF/UA-1"
    url: "https://pdfa.org/resource/iso-14289-pdfua/"
---

Artificial Intelligence（AI，人工智能）已经可以在几秒内生成 Portable Document Format（PDF，便携式文档格式）报告、提案、手册和学习材料。真正困难的部分经常在生成之后才出现：

- 再专业一点。
- 保持温暖，但不要显得随意。
- 要有编辑感，又不能失去分析报告的清晰。

这些反馈包含判断，却没有包含指令。设计师、开发者或模型仍然要猜：到底应该改字体、网格、密度、颜色，还是某个组件？

> **术语说明：** “Document Visual Language（文档视觉语言）”是本文使用的工作性总称，并非正式标准。下面的模型采用设计系统中已有的概念——主题、设计 Token、样式、组件、模式与无障碍准则——并明确标注所有本站教学工具。Design Tokens Community Group 的 2025.10 格式已经稳定并面向实现，但其状态页明确说明它不是 W3C Standard。

这篇文章真正要回答的是：怎样把文档意图翻译成可重复的主题、Token、组件、模式与评审准则？

## 房间名字不是施工图

室内设计师可以把两个房间方案叫作 Alder 和 Granite。

Alder 让人想到木材、自然光、柔软材料和温暖；Granite 让人想到石材、秩序、重量和冷静。这样的名字很适合选择：容易记，也能让人迅速表达偏好。

施工团队仍然需要平面图、尺寸、材料、灯光色温和验收标准。“再 Granite 一点”不足以把同一个房间做两次。

文档主题也是一样：

| 层级                                | 房间类比           | 文档对应物                                        |
| ----------------------------------- | ------------------ | ------------------------------------------------- |
| Theme（主题）                       | 容易记住的房间名字 | Alder 或 Granite                                  |
| Design tradition（设计传统）        | 历史参考           | International Typographic Style 或 New Typography |
| Design practice（设计实践）         | 专业领域           | Editorial design 或 Information design            |
| Design tokens（设计 Token）         | 材料清单           | 命名过的颜色、尺寸、字体角色和间距                |
| Components + patterns（组件与模式） | 安装细节           | 表格、引用、警告、页眉和页脚                      |

诗意命名负责形成意象；系统定义负责让意象稳定落地。

## 一套五步教学顺序

这套顺序是本文的工作模型，并非正式分类标准。

### 1. Document purpose · 文档目的：读者需要得到什么结果？

长篇文章支持连续阅读；分析报告支持扫描、比较和回查证据；操作手册支持在压力下准确行动；提案支持做出决定。

目的必须先确定，因为审美偏好不能压过文档真正要完成的工作。OASIS DITA 为技术内容定义了 concept、task、reference 等信息类型；报告、提案、手册与长文只是本模拟器更宽泛的实用示例，并不是 DITA 分类。

### 2. Historical design tradition · 历史设计传统：我们借用哪个有记录的来源？

历史设计传统指可以追溯的来源：

- Swiss Style / International Typographic Style（瑞士风格 / 国际字体排印风格）使用严格网格、无衬线字体、非对称布局与摄影；
- New Typography（新字体排印）把页面视为非对称文字与图像关系组成的场；
- Classical Book Typography（古典书籍排版）围绕连续阅读安排比例、页边距和安静的文字颜色。

传统提供参考与关系，但不是模板按钮；模拟器里的结果也不是权威历史复刻。

### 3. Design practice · 设计实践：由哪个已有专业领域指导工作？

Editorial design（编辑设计）、Information design（信息设计）、Technical communication（技术传播）、Book design（书籍设计）与 Minimalist graphic design（极简平面设计）都是可以识别的领域或实践。它们比主题更宽泛，也不构成一套全球统一分类法。

### 4. Theme · 主题：用什么名字识别这次实现？

主题预设把一次具体实现包装起来：

| 主题    | 这套系统里的明确映射                                 |
| ------- | ---------------------------------------------------- |
| Alder   | Classical book typography + Editorial design         |
| Granite | International Typographic Style + Information design |

这个映射是工作解释，不是行业标准。另一个产品完全可以用同样的名字得到不同结果。

### 5. Design tokens、components 与 patterns：怎样保持一致？

Design Token 保存精确数值，例如主文字颜色、纸张色、标题字体、正文字号、章节间距或分隔线粗细。

组件封装可复用部分；模式说明怎样为反复出现的需要组合这些部分。本站的组件规则保存文档特有的关系：

- 表格什么时候允许使用底色？
- 引用和警告怎样区分？
- 图片是满版、裁切，还是进入网格？
- 数据页是否允许比叙事页更密？
- 来源、页码、页眉和页脚放在哪里？

Token 保存命名过的数值，组件与模式保存可重复行为。一套工作中的文档系统两者都需要。

## 四条坐标轴让审美可以讨论

Temperature、Geometry、Density、Expression 是本文的评审控制，并不是标准化的设计系统坐标轴；0–100 也不是测量值。它们只用于明确方向与相对强度。

形容词加上方向和强度以后，才更容易执行：

| 坐标轴               | 左侧            | 右侧              | 常见控制项                             |
| -------------------- | --------------- | ----------------- | -------------------------------------- |
| Temperature（温度）  | Warm 温暖       | Cool 冷静         | 纸张色、配色、字体性格、图像光线       |
| Geometry（几何）     | Soft 柔和       | Hard 硬朗         | 圆角、线条、字重、形状、边界           |
| Density（密度）      | Sparse 疏朗     | Dense 紧凑        | 字号、行长、留白、分栏、表格节奏       |
| Expression（表现力） | Restrained 克制 | Expressive 强表达 | 字号跨度、颜色数量、图片比例、构图变化 |

与其说“做得更高级”，不如说：

> 保留冷静温度和硬朗几何，把密度从 70 降到 50，把表现力从 25 提到 40；拉开标题层级，但仍然只用一个强调色。

审美判断仍然存在，但下一版已经有了方向。

## 一套标明证据身份的词汇

| 名称                            | 证据标签     | 常见语境                       | 常见失败                     |
| ------------------------------- | ------------ | ------------------------------ | ---------------------------- |
| International Typographic Style | 历史传统     | 信息报告、机构、多语言材料     | 只换 Helvetica，没有网格纪律 |
| New Typography                  | 历史传统     | 海报、封面、展览、宣言         | 每一页都很戏剧化             |
| Bauhaus typography              | 机构设计遗产 | 展览、文化出版、几何信息设计   | 把原色和圆形当成外观服装     |
| Art Deco                        | 历史运动     | 酒店、建筑、封面、活动材料     | 装饰压过信息层级             |
| Art Nouveau                     | 国际历史风格 | 文化、植物、手工艺与遗产叙事   | 装饰曲线损害可读性           |
| Classical book typography       | 字体排印传统 | 长文、历史、政策、文学         | 小字和假古董装饰             |
| Editorial design                | 专业实践     | 杂志、年报、品牌叙事           | 把随机版式当成节奏           |
| Information design              | 专业实践     | 报告、公共信息、复杂比较       | 全部正确，却毫无记忆点       |
| Technical communication         | 专业领域     | 规范、审计、手册、研究记录     | 把高密度当成专业             |
| Minimalist graphic design       | 专业实践     | 产品 brief、作品集、聚焦型报告 | 把空白误认为层级             |

这些词仍然在做不同的事情：历史传统提供来源，专业实践描述工作领域，Alder 与 Granite 则始终是产品内部主题名。

## 把 Granite 编译成真正的设计 brief

假设任务是一份 24 页的季度运营报告。

### 沟通意图

- 读者感受：稳定、可信、已经过审查；
- 读者动作：先读执行摘要，再扫描指标，最后回查证据。

### 设计上下文

| 层级      | 决定                            |
| --------- | ------------------------------- |
| Purpose   | Analytical report（分析报告）   |
| Tradition | International Typographic Style |
| Practice  | Information design              |
| Theme     | Granite                         |

### 风格坐标

- Temperature：78% cool
- Geometry：72% hard
- Density：64% dense
- Expression：24% expressive

### 参数配方

- 冷白纸张与石墨色正文；
- 一个 slate blue（板岩蓝）强调色；
- 中性无衬线标题；
- 10.5–11 点、适合长时间阅读的衬线或人文无衬线正文；
- 十二栏网格和稳定表格节奏；
- 0–4 点圆角；
- 足以承受打印损耗的细线对比度。

### 组件规则

- 执行摘要允许一个大数字，数据页不重复制造封面效果；
- 表格依靠对齐、间距与有限横线建立结构，不给每个单元格画框；
- 风险同时使用文字、符号和颜色，不能只依赖颜色；
- 页眉、页脚、章节和来源保持可预测。

Granite 现在已经可以测试。名字仍然容易记，却不再独自承担规格。

## 什么时候有用？

- 模板或 AI 系统要反复生成报告、提案、手册或学习材料；
- 设计师、作者、开发者和模型之间需要传递视觉意图；
- 同一品牌有多个文档类型；
- 评审经常使用“专业一点”“活泼一点”“高级一点”等模糊反馈；
- 主题需要被搜索、比较、版本化和测试。

## 什么时候太重？

- 一次性内部通知已经可以由默认模板清楚完成；
- 内容和证据尚未稳定，视觉分类为时过早；
- 没有人会复用或维护主题；
- 主要问题是内容错误或信息结构混乱；
- 成熟品牌系统已经定义了必要决定。

## 失败信号

- **只有诗意，没有规格：** 名字很好记，每次实现仍然靠猜。
- **风格浓汤：** Swiss、温暖、粗野、奢华、极简和高密度同时出现，却没有优先级。
- **风格先于任务：** 操作手册使用不可预测的杂志版式。
- **参数表演：** 有数百个 token，却说不清读者任务和组件行为。
- **名称漂移：** 不同团队用 Granite 指代完全不同的设计。
- **用风格掩盖无障碍问题：** 低对比、小字或错误阅读顺序被辩护为某种美学。

视觉风格不能代替语义结构。可访问 PDF 还依赖标题、段落、列表、表格、阅读顺序和真实辅助技术测试。

## 看清概念邻居

- **Document purpose 描述读者需要的结果。** 特定系统中存在正式信息类型；模拟器里的四种目的只是示例。
- **Historical design tradition 指向历史来源。** 它提供可追溯参考，却不是可以直接套用的主题。
- **Design practice 描述专业领域。** Editorial design、Information design 与 Technical communication 属于这一层。
- **Theme 是命名实现。** 它为某个产品或情境协调 Token 数值。
- **Design token 是命名过的实现数据。** 它用跨平台格式表达设计决策，却不会替团队选择策略。
- **Components 与 patterns 把决策带入使用。** 组件封装可复用部分，模式描述反复出现的解决方案与情境。

## 记住这六件事

1. “文档视觉语言”是本文的工作性总称，并非正式标准。
2. 先确定文档目的，再识别历史传统或设计实践，最后命名产品内主题。
3. 把四条轴当作本站评审控制，不要当作标准化测量。
4. 主题协调数值；设计 Token 命名并交换这些决策。
5. 组件与模式让设计决策在反复出现的文档需要中保持一致。
6. 风格永远不能代替内容结构、证据、语义与无障碍。

## 自测

1. 读者是在连续阅读、扫描证据、执行步骤，还是做决定？
2. 当前标签是有出处的传统、已有设计实践，还是产品内部主题？
3. 删除主题名以后，团队能否只凭 Token、组件、模式与规则重建它？
4. 当有人说“更专业”时，具体应该移动哪条轴、改变哪些组件？
5. 封面、叙事页和数据页之间，哪些规则必须稳定？
6. 设计在打印、长时间阅读、低质量屏幕和辅助技术中是否仍然成立？

## 延伸阅读

- [Design Tokens Community Group · Design Tokens Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/)
- [GOV.UK Design System · Styles, components and patterns](https://design-system.service.gov.uk/)
- [Material Web · Theming](https://material-web.dev/theming/material-theming/)
- [OASIS DITA 1.3 · Information typing](https://docs.oasis-open.org/dita/dita/v1.3/os/part1-base/archSpec/base/information-typing.html)
- [Cooper Hewitt · A Harmony of Contrasts](https://www.cooperhewitt.org/2018/08/05/aharmonyofcontrasts/)
- [Museum of Modern Art · The New Typography](https://www.moma.org/calendar/exhibitions/1013)
- [Bauhaus-Archiv · Bauhaus Typography](https://www.bauhaus.de/en/research/publications/bauhaus-typography/)
- [World Wide Web Consortium · Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [PDF Association · ISO 14289-1 / PDF/UA-1](https://pdfa.org/resource/iso-14289-pdfua/)
