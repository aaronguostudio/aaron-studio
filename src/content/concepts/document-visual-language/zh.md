---
title: '文档视觉语言'
fullName: 'Document Visual Language · 文档视觉语言'
shortName: '文档视觉语言'
description: '把“希望读者怎样感受、怎样阅读、怎样行动”翻译成可重复的版式、字体、颜色、密度与组件规则。'
mentalModel: '主题名帮助人选择；视觉语言帮助团队复现并评审这个选择。'
date: '2026-07-18'
updated: '2026-07-18'
domain: '文档设计'
domainKey: 'document-design'
tags: ['文档设计', '字体排印', '设计系统', '设计令牌']
maturity: 'growing'
published: true
featured: false
translationKey: 'document-visual-language'
interaction: 'document-visual-language'
neighbors:
  - name: 'Document Genre'
    fullName: 'Document Genre · 文档类型'
    category: '功能契约'
    summary: '定义读者要完成什么阅读任务；视觉语言决定设计怎样帮助这项任务。'
  - name: 'Design Lineage'
    fullName: 'Design Lineage · 设计谱系'
    category: '历史语法'
    summary: '提供 Swiss Style 或 New Typography 等可追溯传统，但不等于一键套用的主题。'
  - name: 'Style Archetype'
    fullName: 'Style Archetype · 风格原型'
    category: '工作词汇'
    summary: '给一组实用视觉关系命名，但不冒充行业通用标准。'
  - name: 'Design Theme'
    fullName: 'Design Theme · 设计主题'
    category: '命名实例'
    summary: '把一次具体实现包装成 Alder、Granite 这样的产品内部名称。'
  - name: 'Design Tokens'
    fullName: 'Design Tokens · 设计令牌'
    category: '实现数据'
    summary: '保存精确颜色、尺寸、字体角色和间距，但不会替团队决定文档策略。'
  - name: 'Template'
    fullName: 'Template · 模板'
    category: '内容骨架'
    summary: '保存可重复页面结构；一个模板可以接受多个主题，一个主题也可以覆盖多个模板。'
sources:
  - title: 'Design Tokens Community Group · Design Tokens Format Module 2025.10'
    url: 'https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/'
  - title: 'Cooper Hewitt · A Harmony of Contrasts'
    url: 'https://www.cooperhewitt.org/2018/08/05/aharmonyofcontrasts/'
  - title: 'Museum of Modern Art · The New Typography'
    url: 'https://www.moma.org/calendar/exhibitions/1013'
  - title: 'Bauhaus-Archiv · Bauhaus Typography'
    url: 'https://www.bauhaus.de/en/research/publications/bauhaus-typography/'
  - title: 'Victoria and Albert Museum · An introduction to Art Deco'
    url: 'https://www.vam.ac.uk/articles/an-introduction-to-art-deco'
  - title: 'Victoria and Albert Museum · Art Nouveau — an international style'
    url: 'https://www.vam.ac.uk/articles/art-nouveau-an-international-style'
  - title: 'World Wide Web Consortium · Web Content Accessibility Guidelines 2.2'
    url: 'https://www.w3.org/TR/WCAG22/'
  - title: 'PDF Association · ISO 14289-1 / PDF/UA-1'
    url: 'https://pdfa.org/resource/iso-14289-pdfua/'
---

# 文档视觉语言

Artificial Intelligence（AI，人工智能）已经可以在几秒内生成 Portable Document Format（PDF，便携式文档格式）报告、提案、手册和学习材料。真正困难的部分经常在生成之后才出现：

- 再专业一点。
- 保持温暖，但不要显得随意。
- 要有编辑感，又不能失去分析报告的清晰。

这些反馈包含判断，却没有包含指令。设计师、开发者或模型仍然要猜：到底应该改字体、网格、密度、颜色，还是某个组件？

**Document Visual Language（文档视觉语言）把“希望读者怎样感受、怎样阅读、怎样行动”翻译成可重复的版式、字体、颜色、密度与组件规则。**

## 房间名字不是施工图

室内设计师可以把两个房间方案叫作 Alder 和 Granite。

Alder 让人想到木材、自然光、柔软材料和温暖；Granite 让人想到石材、秩序、重量和冷静。这样的名字很适合选择：容易记，也能让人迅速表达偏好。

施工团队仍然需要平面图、尺寸、材料、灯光色温和验收标准。“再 Granite 一点”不足以把同一个房间做两次。

文档主题也是一样：

| 层级 | 房间类比 | 文档对应物 |
| --- | --- | --- |
| Theme name（主题名） | 容易记住的房间名字 | Alder 或 Granite |
| Style archetype（风格原型） | 共同认可的室内方向 | Organic Humanist 或 Institutional Modern |
| Layout system（版式系统） | 平面图 | 网格、页边距、分栏和页面区域 |
| Design tokens（设计令牌） | 材料清单 | 颜色、尺寸、字体角色和间距 |
| Component rules（组件规则） | 安装细节 | 表格、引用、警告、页眉和页脚 |

诗意命名负责形成意象；系统定义负责让意象稳定落地。

## 五层视觉语言栈

### 1. Document Genre · 文档类型：读者正在完成什么任务？

长篇文章支持连续阅读；分析报告支持扫描、比较和回查证据；操作手册支持在压力下准确行动；提案支持做出决定。

Genre（类型）必须先确定，因为审美偏好不能压过文档真正要完成的工作。

### 2. Design Lineage · 设计谱系：我们借用哪种成熟语法？

设计谱系指可以追溯的历史传统：

- Swiss Style / International Typographic Style（瑞士风格 / 国际字体排印风格）使用严格网格、无衬线字体、非对称布局与摄影；
- New Typography（新字体排印）把页面视为非对称文字与图像关系组成的场；
- Classical Book Typography（古典书籍排版）围绕连续阅读安排比例、页边距和安静的文字颜色。

谱系提供经过检验的关系，但不是模板按钮。

### 3. Style Archetype · 风格原型：今天希望它呈现什么性格？

Style Archetype 是团队声明的工作分类，例如 Organic Humanist（有机人文式）、Institutional Modern（机构现代式）、Technical Functional（技术功能式）或 Luxury Editorial（奢华编辑式）。

这些词很实用，因为团队可以明确它们的边界；但它们不能冒充拥有历史出处的设计运动。

### 4. Theme Preset · 主题预设：用什么名字识别这次实现？

主题预设把一次具体实现包装起来：

| 预设 | 这套系统里的明确映射 |
| --- | --- |
| Alder | Organic Humanist + Warm Editorial |
| Granite | Institutional Modern + Cool Technical |

这个映射是工作解释，不是行业标准。另一个产品完全可以用同样的名字得到不同结果。

### 5. Tokens + Component Rules · 参数与组件：怎样保证每一页仍然属于它？

Design Token 保存精确数值，例如主文字颜色、纸张色、标题字体、正文字号、章节间距或分隔线粗细。

Component Rule 保存关系：

- 表格什么时候允许使用底色？
- 引用和警告怎样区分？
- 图片是满版、裁切，还是进入网格？
- 数据页是否允许比叙事页更密？
- 来源、页码、页眉和页脚放在哪里？

Token 保存数值，组件规则保存行为。完整视觉语言两者都需要。

## 四条坐标轴让审美可以讨论

形容词加上方向和强度以后，才更容易执行：

| 坐标轴 | 左侧 | 右侧 | 常见控制项 |
| --- | --- | --- | --- |
| Temperature（温度） | Warm 温暖 | Cool 冷静 | 纸张色、配色、字体性格、图像光线 |
| Geometry（几何） | Soft 柔和 | Hard 硬朗 | 圆角、线条、字重、形状、边界 |
| Density（密度） | Sparse 疏朗 | Dense 紧凑 | 字号、行长、留白、分栏、表格节奏 |
| Expression（表现力） | Restrained 克制 | Expressive 强表达 | 字号跨度、颜色数量、图片比例、构图变化 |

与其说“做得更高级”，不如说：

> 保留冷静温度和硬朗几何，把密度从 70 降到 50，把表现力从 25 提到 40；拉开标题层级，但仍然只用一个强调色。

审美判断仍然存在，但下一版已经有了方向。

## 一套实用风格词汇

| 风格原型 | 身份 | 适合 | 常见失败 |
| --- | --- | --- | --- |
| Classical Bookish · 古典书籍式 | 排版惯例 | 长文、历史、政策、文学 | 小字和假古董装饰 |
| Swiss / International · 瑞士国际主义 | 历史运动 | 信息报告、机构、多语言材料 | 只换 Helvetica，没有网格纪律 |
| New Typography · 新字体排印 | 历史运动 | 海报、封面、展览、宣言 | 每一页都很戏剧化 |
| Bauhaus Typography · 包豪斯字体排印 | 机构设计遗产，不是单一固定风格 | 展览、文化出版、几何信息设计 | 把原色和圆形当成外观服装 |
| Art Deco · 装饰艺术 | 多源历史运动 | 酒店、建筑、高端封面、活动材料 | 装饰压过信息层级 |
| Art Nouveau · 新艺术 | 国际历史风格 | 文化、植物、手工艺与遗产叙事 | 装饰曲线损害可读性 |
| Editorial · 编辑式 | 工作方法与文档语言 | 杂志、年报、品牌叙事 | 把随机版式当成节奏 |
| Technical Functional · 技术功能式 | 工作型原型 | 规范、审计、手册、研究记录 | 把高密度当成专业 |
| Organic Humanist · 有机人文式 | 工作型原型 | 教育、健康、可持续、个人叙事 | 低对比和叶片装饰 |
| Institutional Modern · 机构现代式 | 工作型原型 | 金融、治理、咨询、法律报告 | 全部正确，却毫无记忆点 |
| Luxury Editorial · 奢华编辑式 | 工作型原型 | 时尚、酒店、建筑、作品集 | 用浅灰小字冒充高级 |
| Minimal Contemporary · 当代极简式 | 工作型原型 | 产品 brief、作品集、聚焦型报告 | 把空白误认为层级 |
| Brutalist / Raw · 粗野 / 原始式 | 借来的类比标签 | 文化与实验出版 | 把阅读困难当成态度 |

“身份”这一列很重要。历史运动、工作型原型与产品主题并不是同一级别的词。

## 把 Granite 编译成真正的设计 brief

假设任务是一份 24 页的季度运营报告。

### 沟通意图

- 读者感受：稳定、可信、已经过审查；
- 读者动作：先读执行摘要，再扫描指标，最后回查证据。

### 视觉语言栈

| 层级 | 决定 |
| --- | --- |
| Genre | Analytical report（分析报告） |
| Lineage | Swiss-inspired information design |
| Archetype | Institutional Modern + Technical Functional |
| Theme | Granite |

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

- **Document Genre 是功能契约。** 它说明读者正在完成什么工作。
- **Design Lineage 是历史语法。** 它提供可追溯的原则与关系。
- **Style Archetype 是工作词汇。** 它给一组声明过边界的实用关系命名。
- **Design Theme 是命名实例。** 它用容易记住的内部名称包装实现。
- **Design Tokens 是实现数据。** 它保存数值，却不决定策略。
- **Template 是内容骨架。** 它保存可复用结构，并且可以接受多个主题。

## 记住这六件事

1. 主题名帮助人选择；视觉语言帮助团队复现并评审这个选择。
2. 先确定文档类型，再选择谱系与原型，最后命名主题。
3. 用四条轴说明视觉性格的方向和强度。
4. Token 保存数值，组件规则保存关系。
5. 历史运动、工作型原型和产品主题必须说明自己的身份。
6. 风格永远不能代替内容结构、证据、语义与无障碍。

## 自测

1. 读者是在连续阅读、扫描证据、执行步骤，还是做决定？
2. 当前标签是有出处的谱系、工作型原型，还是产品内部主题？
3. 删除主题名以后，团队能否只凭坐标和规则重建它？
4. 当有人说“更专业”时，具体应该移动哪条轴、改变哪些组件？
5. 封面、叙事页和数据页之间，哪些规则必须稳定？
6. 设计在打印、长时间阅读、低质量屏幕和辅助技术中是否仍然成立？

## 延伸阅读

- [Design Tokens Community Group · Design Tokens Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/)
- [Cooper Hewitt · A Harmony of Contrasts](https://www.cooperhewitt.org/2018/08/05/aharmonyofcontrasts/)
- [Museum of Modern Art · The New Typography](https://www.moma.org/calendar/exhibitions/1013)
- [Bauhaus-Archiv · Bauhaus Typography](https://www.bauhaus.de/en/research/publications/bauhaus-typography/)
- [World Wide Web Consortium · Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [PDF Association · ISO 14289-1 / PDF/UA-1](https://pdfa.org/resource/iso-14289-pdfua/)
