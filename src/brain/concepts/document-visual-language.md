---
type: concept
date: 2026-07-18
updated: 2026-07-18
title: "Document Visual Language"
aliases: [文档视觉语言, Document Theme System, 文档主题系统, Document Style System]
domain: [design, editorial-design, information-design, design-systems]
tags: [document-design, typography, visual-style, themes, design-tokens]
status: active
maturity: growing
related:
  - "[[concepts/visual-style]]"
  - "[[concepts/document-genre]]"
  - "[[concepts/layout-system]]"
  - "[[concepts/typography-system]]"
  - "[[concepts/design-tokens]]"
  - "[[concepts/brand-identity]]"
  - "[[concepts/template]]"
  - "[[concepts/progressive-disclosure]]"
---

# Document Visual Language · 文档视觉语言

> **一句话：文档视觉语言把“希望读者怎样感受、怎样阅读、怎样行动”翻译成可重复的版式、字体、颜色、密度与组件规则。**

[打开互动解释页](pages/document-visual-language.html)

## 它在解决什么问题？

Artificial Intelligence（AI，人工智能）已经可以在几秒内生成 Portable Document Format（PDF，便携式文档格式）、报告、提案和演示文稿。生成不再是最难的部分；真正昂贵的是反复说：

> “再专业一点。”
>
> “不要那么冷。”
>
> “看起来像咨询报告，但别太企业。”

这些反馈表达了感受，却没有说明应该改变什么。于是一次设计评审变成不断抽卡：换一套字体、调一组颜色、再随机增加一点留白，直到某个人说“差不多”。

`Alder`、`Granite` 这样的名字很有价值，因为它们容易记，也能快速唤起温暖木材或冷静岩石的联想。但它们不是行业标准。只凭名字，我们不知道：

- 它服务的是长篇阅读、数据比较，还是品牌展示？
- 它继承了 Swiss Style（瑞士国际主义排版）、古典书籍排版，还是编辑式杂志语言？
- 它的“温暖”来自字体、纸张色、圆角、图片，还是较低的信息密度？
- 两个人实现 `Granite` 时，怎样判断他们做的是同一套主题？

Document Visual Language（文档视觉语言）解决的不是“哪种风格最好看”，而是 **怎样把模糊气质变成可以选择、实现、评审和复用的设计系统**。

## 先用一个生活类比：给房间起名字，还要给施工队图纸

室内设计师可以把两个房间方案叫作 `Alder` 和 `Granite`。

- `Alder` 让人想到木材、自然光、柔软织物和暖色；
- `Granite` 让人想到石材、秩序、重量和冷静灰色。

这个名字非常适合帮助客户选择方向。但施工队不能只收到一句“把房间做得更 Granite”。他们还需要平面图、材料表、尺寸、灯光色温、收口方式和验收标准。

文档主题也是一样：

```text
主题名      = 便于人记忆和选择的房间名字
风格原型    = 共同认可的室内方向
版式系统    = 平面图和空间关系
Design Token = 材料、尺寸与颜色清单
组件规则    = 门、窗、灯具怎样反复安装
```

诗意命名负责形成意象；系统定义负责让意象稳定落地。

## 它怎样工作？五层视觉语言栈

### 1. Document Genre · 文档类型：它首先要完成什么工作？

文档类型是内容与读者之间的功能契约。研究报告、操作手册、品牌杂志和投资提案都可以使用同一种蓝色，却不能共享同一种阅读结构。

| Genre（类型） | 读者的主要任务 | 首要设计要求 |
|---|---|---|
| Long-form essay（长篇文章） | 连续阅读与理解论点 | 舒适行长、稳定节奏、低干扰 |
| Analytical report（分析报告） | 扫描、比较、回查证据 | 强层级、表格纪律、页码与引用 |
| Operating manual（操作手册） | 找到步骤并避免错误 | 编号、警告、状态和动作清晰 |
| Proposal（提案） | 快速判断价值与风险 | 叙事推进、证据突出、明确行动 |
| Editorial feature（编辑专题） | 沉浸、探索、记住观点 | 图文节奏、展示字体、构图变化 |

先选类型，是为了防止“喜欢某种外观”压过文档真正要完成的任务。

### 2. Design Lineage · 设计谱系：它从哪种设计传统借来规则？

有些名称有相对稳定的历史边界：

- **New Typography（新字体排印）**反对传统对称栏，使用非对称构图、文字块、摄影与强烈对比；
- **Swiss Style / International Typographic Style（瑞士风格 / 国际字体排印风格）**强调无衬线字体、网格、非对称布局与摄影；
- **Classical Book Typography（古典书籍排版）**围绕连续阅读、比例、页边距和安静的文字颜色组织页面。

谱系不是可直接套用的模板。它提供经过历史检验的关系：怎样建立秩序、怎样处理图文、怎样分配注意力。

### 3. Style Archetype · 风格原型：今天我们希望它呈现什么性格？

风格原型是实用工作词汇，例如：

- Organic Humanist（有机人文式）
- Institutional Modern（机构现代式）
- Technical Functional（技术功能式）
- Luxury Editorial（奢华编辑式）

这些名称不像 Swiss Style 那样拥有严格历史出处。它们是 **working archetype（工作型原型）**：通过一组反复出现的视觉关系，让团队有共同起点。

### 4. Theme Preset · 主题预设：给这次实现一个可记住的名字

主题预设是某个风格原型的具体实例。

```text
Alder  = Organic Humanist + Warm Editorial
Granite = Institutional Modern + Cool Technical
```

等号右边不是永久真理，而是这套产品对名字的明确定义。另一个工具完全可以让 `Granite` 长得不同，因此主题必须附带说明，不能只靠名字传播。

### 5. Tokens + Component Rules · 参数与组件：怎样让它每页都还是它？

Design Token（设计令牌）把设计决定保存为有名字的值。例如：

```text
color.text.primary      #202226
color.surface.paper     #F3F1EC
type.heading.family     Source Serif 4
type.body.size          10.5pt
type.body.line-height   1.52
space.section           28pt
rule.table              0.75pt solid
```

但只有 token 仍然不够。系统还要说明：

- 一级标题是否总是占两行以内？
- 表格何时使用底色，何时只用细线？
- 引用、警告、图注、页眉页脚如何表现？
- 图片是满版、裁切，还是进入网格？
- 数据页是否允许比叙事页更高密度？

所以完整公式是：

```text
Document Visual Language
= communication intent
+ document genre
+ design lineage
+ style archetype
+ named theme
+ tokens
+ component rules
+ accessibility constraints
```

## 四条坐标轴：不要只用形容词，要说明方向与强度

同一个原型内部仍然有变化。可以用四条连续轴记录视觉性格：

| 轴 | 左侧 | 右侧 | 主要由什么控制 |
|---|---|---|---|
| Temperature（温度） | Warm 温暖 | Cool 冷静 | 纸张色、主色、字体性格、图片光线 |
| Geometry（几何） | Soft 柔和 | Hard 硬朗 | 圆角、线条、字重、形状、边界 |
| Density（密度） | Sparse 疏朗 | Dense 紧凑 | 行长、字号、留白、分栏、表格压缩 |
| Expression（表现力） | Restrained 克制 | Expressive 强表达 | 字号跨度、颜色数量、图片比例、构图变化 |

例如，与其说“做得更高级”，不如说：

> 保留 cool 与 hard，把 density 从 70 降到 50，把 expression 从 25 提到 40；标题字号跨度加大，但颜色仍限制在一个强调色。

这种反馈仍保留审美判断，却已经可以执行和比较。

## 一套可扩展的文档风格词典

### 1. Classical Bookish · 古典书籍式

**身份：传统排版惯例，不是单一历史运动。**

- 视觉特征：衬线正文、稳定比例、较宽页边距、安静层级、少量装饰；
- 适合：长篇文章、文学、历史、政策与需要耐心阅读的材料；
- 不适合：频繁扫视的大型数据表、实时状态面板；
- 失败样子：为了“经典”使用过小字号、过长行宽或假古董装饰。

### 2. Swiss / International · 瑞士国际主义

**身份：有历史记录的设计运动。**

- 视觉特征：严格网格、无衬线字体、非对称布局、清楚层级、客观摄影；
- 适合：信息报告、手册、公共机构、文化活动、多语言内容；
- 不适合：必须传递私密、柔软或手工触感的叙事；
- 失败样子：只换 Helvetica，却没有网格、比例与信息纪律。

### 3. New Typography · 新字体排印

**身份：有明确历史出处的现代主义运动。**

- 视觉特征：文字块、照片、标准化形式、非对称和强烈的颜色 / 尺寸 / 位置对比；
- 适合：海报、展览、宣言、专题封面和需要强烈进入感的页面；
- 不适合：数十页连续正文；
- 失败样子：每页都制造戏剧性，导致信息没有安静层级。

### 4. Bauhaus Typography · 包豪斯字体排印

**身份：学校、教师与作品共同形成的设计遗产，不是一套固定模板。**

- 视觉特征：无衬线字体、标准化格式、清楚文字块、图文混合，以及颜色、尺寸和位置的强对比；
- 适合：展览、文化出版、教育材料与需要几何秩序的专题页面；
- 不适合：只需要安静连续阅读、不能承受强烈构图变化的长文；
- 失败样子：只加入红黄蓝、圆形与三角形，把复杂历史缩成外观服装。

### 5. Art Deco · 装饰艺术

**身份：吸收多种来源的历史运动，不是唯一统一风格。**

- 视觉特征：对称、线性几何、阶梯与放射图案、深色表面、金属感和现代奢华；
- 适合：酒店、建筑、活动、文化封面与需要仪式感的品牌材料；
- 不适合：高密度技术规范和需要极低印刷成本的日常文件；
- 失败样子：装饰和金色压过信息层级，把“华丽”误当成“清楚”。

### 6. Art Nouveau · 新艺术

**身份：有国际传播与地域变体的历史风格。**

- 视觉特征：有机曲线、植物与自然形态、手工字体感、流动边框和整体构图；
- 适合：文化、植物、手工艺、遗产与需要自然叙事的材料；
- 不适合：数字密集、快速扫描和严格模块化的运营文件；
- 失败样子：把装饰曲线覆盖到正文阅读路径，或者直接贴上叶片图案。

### 7. Editorial · 编辑式

**身份：文档类型与设计方法的混合工作词。**

- 视觉特征：展示字体、图像主导、动态分栏、引语、图注和节奏变化；
- 适合：杂志、人物故事、年度报告、品牌叙事；
- 不适合：规则必须高度一致的合规表单与操作手册；
- 失败样子：把“每页不同”误当成编辑感，失去可预测性。

### 8. Technical Functional · 技术功能式

**身份：工作型原型。**

- 视觉特征：模块化网格、高信息密度、编号、细线、表格、少量等宽字体；
- 适合：技术规范、审计、研究记录、操作手册；
- 不适合：需要情感进入和品牌想象的故事；
- 失败样子：把信息塞满当成专业，让读者无法找到主次。

### 9. Organic Humanist · 有机人文式

**身份：工作型原型。**

- 视觉特征：暖中性色、人文衬线或人文无衬线、柔和边界、自然材料感、舒展节奏；
- 适合：教育、健康、可持续、个人叙事、生活方式；
- 不适合：需要即时表现权威和精确比较的高风险材料；
- 失败样子：低对比、过度柔化，或者用叶片装饰假装“自然”。

### 10. Institutional Modern · 机构现代式

**身份：工作型原型，常借用 Swiss 与企业设计系统语言。**

- 视觉特征：冷灰、稳定网格、克制无衬线、明确重复、有限强调色；
- 适合：金融、法律、咨询、治理与企业报告；
- 不适合：个人品牌、儿童教育或需要强烈文化个性的内容；
- 失败样子：所有页面都正确，却没有任何可记住的判断。

### 11. Luxury Editorial · 奢华编辑式

**身份：工作型原型。**

- 视觉特征：高对比展示衬线、大量留白、细线、少量颜色、精细图像；
- 适合：时尚、酒店、建筑、房地产与作品集；
- 不适合：小尺寸屏幕、复杂表格、高频打印复印；
- 失败样子：用浅灰小字和极细线追求“高级”，牺牲可读性。

### 12. Minimal Contemporary · 当代极简式

**身份：工作型原型，借用现代主义与极简艺术的减法观念。**

- 视觉特征：单色或极少颜色、明确层级、大量留白、极少装饰和稳定重复；
- 适合：产品 brief、作品集、聚焦型报告与单一主张的说明材料；
- 不适合：内容层级很多、信息量很大或必须在有限页数中容纳大量证据的文件；
- 失败样子：删除所有视觉线索后只剩空白，却没有建立清晰层级。

### 13. Brutalist / Raw · 粗野 / 原始式

**身份：从建筑与文化设计借来的类比标签，不是统一文档标准。**

- 视觉特征：巨大字体、硬边框、裸露网格、强烈反差、故意不精致；
- 适合：文化、音乐、实验出版和反常规传播；
- 不适合：长期阅读、严肃服务说明和广泛无障碍要求；
- 失败样子：把阅读困难误认为态度鲜明。

## 一个具体例子：把 Granite 从感觉变成规格

假设要生成一份 24 页的季度运营报告。只给模型一句“使用 Granite 风格”，输出很可能每次不同。把它展开以后：

### Communication intent · 沟通意图

```text
读者感受：稳定、可信、已经经过审查
读者动作：先读执行摘要，再扫描指标，最后回查证据
```

### Stack · 视觉语言栈

```text
Genre       Analytical report
Lineage     Swiss-inspired information design
Archetype   Institutional Modern + Technical Functional
Theme       Granite
```

### Coordinate · 风格坐标

```text
Temperature  78% cool
Geometry     72% hard
Density      64% dense
Expression   24% expressive
```

### Token recipe · 参数配方

```text
paper              cool white #F4F5F3
primary ink        graphite #22262A
accent             slate blue #4C667A
heading            neutral sans, 600 weight
body               readable serif or humanist sans, 10.5–11pt
body leading       1.45–1.55
grid               12 columns with fixed table rhythm
corner radius      0–4pt
rules              thin, high enough contrast to survive printing
```

### Component rules · 组件规则

- 执行摘要允许一个大数字和一个强调色，其余数据页不重复制造封面效果；
- 表格靠对齐、间距与有限横线建立结构，不给每个单元格画框；
- 风险使用文字标签、图标和颜色共同表达，不能只依赖红色；
- 页眉页脚固定位置，章节切换保持可预测；
- 引用与数据来源不能被“简洁风格”隐藏。

这时 `Granite` 才从一个 mood word（情绪词）变成可以交付、测试和迭代的主题。

`Alder` 可以沿同一套结构定义为 Organic Humanist + Warm Editorial：暖纸色、较柔和几何、较低密度、人文衬线标题和自然但克制的强调色。名字不同不是关键；**两套主题使用同一个描述协议**才是关键。

## 什么时候适合使用这套模型？

- AI 或模板系统要反复生成报告、提案、PDF、简报或学习材料；
- 团队需要在设计师、作者、开发者和模型之间传递视觉意图；
- 同一品牌有多个文档类型，不希望每种都长成同一个模板；
- 评审经常停留在“高级一点”“活泼一点”等不可执行反馈；
- 需要建立可搜索、可比较、可版本化的主题库；
- 希望保留诗意命名，同时避免名字漂移。

## 什么时候不值得做得这么重？

- 一张一次性的内部通知，默认模板已经能清楚完成任务；
- 内容尚未稳定，却开始为每个小变化创建新主题；
- 团队没有复用场景，token 与分类的维护成本高于收益；
- 文档主要问题是内容错误、结构混乱或缺少证据，换风格不能修复这些问题；
- 只是需要遵循一个成熟品牌系统，不需要重新发明风格分类。

## 失败长什么样？

### Poetry without specification · 只有诗意，没有规格

主题名很美，但没有 archetype、坐标和参数。每次实现都靠猜。

### Style soup · 风格浓汤

同时要求 Swiss、奢华、温暖、粗野、极简和高密度。每个词都喜欢，组合后没有优先级。

### Fashion before function · 风格先于任务

因为喜欢杂志版式，把操作手册做成每页构图不同；因为喜欢极简，把关键风险与来源隐藏掉。

### Token theater · 参数表演

系统有几百个 token，却说不清读者任务和组件行为。数值一致，沟通仍然失败。

### Alias drift · 名称漂移

不同团队都使用 `Granite`，但一个指金融报告，一个指深色技术手册。名字看似统一，实际增加误解。

### Accessibility laundering · 用风格掩盖可访问性问题

低对比、小字、错误阅读顺序或没有语义标签，被解释成“高级”“实验”或“极简”。视觉风格不能替代 Portable Document Format / Universal Accessibility（PDF/UA，通用无障碍 PDF）所要求的语义结构，也不能替代真实阅读测试。

## 它和相邻概念是什么关系？

### Visual Style · 感知模式

Visual Style（视觉风格）是读者从一组反复视觉关系中感受到的性格，例如冷静、编辑感或技术感。Document Visual Language 是更大的系统：它还包含任务、结构、组件与实现规则。

### Document Genre · 功能契约

Document Genre（文档类型）说明读者来完成什么工作；视觉语言决定怎样帮助这项工作。Genre 不是 style，同一种报告可以有多种风格，同一种风格也可以跨多个类型。

### Design Theme · 命名实例

Design Theme（设计主题）是一套已经打包好的视觉决定，例如 Alder 或 Granite。它是视觉语言的具体实例，不是行业通用分类。

### Layout System · 空间结构

Layout System（版式系统）规定网格、页边距、分栏、基线与页面区域。它是视觉语言的骨架，但不单独决定颜色、字体性格与品牌语气。

### Typography System · 文字子系统

Typography System（字体排印系统）规定字体角色、字号层级、字重、行长、行高与强调方式。字体非常显眼，却只是完整视觉语言的一部分。

### Design Tokens · 实现数据

Design Tokens（设计令牌）以有名字的值保存颜色、尺寸、字体和间距，便于工具之间交换和复用。Token 可以准确表达 `#22262A`，但不会自己判断金融报告是否应该使用这种冷灰。

### Brand Identity · 跨媒介身份

Brand Identity（品牌识别）覆盖标志、语气、图像、声音和多种接触点；文档视觉语言是品牌在文档媒介中的一种具体表达。品牌一致不等于所有文档布局相同。

### Template · 内容骨架

Template（模板）保存可重复的页面和占位结构。一个模板可以应用多个主题；一个主题也可以覆盖多种模板。把二者绑定死，会让内容类型稍变就必须复制整个系统。

### Progressive Disclosure · 信息策略

Progressive Disclosure（渐进披露）决定复杂度何时出现；Document Visual Language 决定显露后的层级、密度和视觉关系。前者是信息与交互策略，后者是文档设计系统。

## 常见误区

### “只要列出更多风格名，设计词典就完整了”

词典的价值不在数量，而在边界。每个词条都必须说明身份、视觉特征、适用任务、反例与失败模式。

### “Minimalism、Editorial、Bauhaus 都是同一种级别的标签”

不是。Minimalism 是宽泛描述，Editorial 常同时表示文档类型和设计方法，Bauhaus 是学校与历史运动，不能当作一个固定模板按钮。

### “Design token 已经是设计系统”

Token 是实现层的单一事实来源之一。没有任务、关系和组件规则，token 只是一张有组织的数值表。

### “Alder、Granite 这种名字不专业，应该删除”

恰恰相反。诗意名字是很好的选择界面。问题只出现在名字没有映射到专业分类与可执行规格时。

### “可访问性会破坏风格”

真正稳定的风格应该能在足够对比、清晰阅读顺序、可辨认层级和语义结构下成立。需要靠难读才能成立的风格，本身就不够成熟。

## 最小记忆卡

- **主题名负责让人记住，视觉语言负责让团队做对。**
- 先确定文档类型，再选择谱系和风格原型，最后命名主题。
- 用 Warm–Cool、Soft–Hard、Sparse–Dense、Restrained–Expressive 四条轴描述强度。
- Design token 保存数值；组件规则保存关系；两者都不能代替沟通意图。
- 历史运动、工作型原型、产品主题名必须标明身份，不能装成同一级别的标准。
- 风格不能替代内容结构、证据、语义标签与可访问性。

## 自测

1. 这份文档的读者主要是在连续阅读、扫描比较、执行步骤，还是做决策？
2. 当前使用的是有历史边界的 design lineage、工作型 archetype，还是产品自己的 theme name？
3. 如果删除主题名，团队能否仅凭坐标、token 和组件规则重建它？
4. “更专业”“更温暖”“更高级”具体应该移动哪条轴、改变哪些组件？
5. 同一主题在长文页、数据页和封面上，哪些规则必须相同，哪些允许变化？
6. 设计在黑白打印、低质量屏幕、长时间阅读和辅助技术中是否仍然成立？
7. 主题库里是否存在名字不同但参数相同，或名字相同但实现已经漂移的条目？

## Further reading

- [Design Tokens Community Group · Design Tokens Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/) — 设计令牌的稳定社区格式、类型、别名、分组与 typography composite（字体排印复合令牌）。
- [Cooper Hewitt · A Harmony of Contrasts](https://www.cooperhewitt.org/2018/08/05/aharmonyofcontrasts/) — Swiss Style / International Typographic Style 的无衬线字体、非对称、网格与摄影特征。
- [Museum of Modern Art · The New Typography](https://www.moma.org/calendar/exhibitions/1013) — New Typography 的历史边界、非对称页面与图文关系。
- [Bauhaus-Archiv · Bauhaus.Typography](https://www.bauhaus.de/en/research/publications/bauhaus-typography/) — Bauhaus 字体排印的多样性，以及文字块、标准格式、图文混合和对比等特征。
- [Victoria and Albert Museum · An introduction to Art Deco](https://www.vam.ac.uk/articles/an-introduction-to-art-deco) — Art Deco 的多源历史、几何形式，以及传统、现代、奢华与功能的结合。
- [Victoria and Albert Museum · Art Nouveau — an international style](https://www.vam.ac.uk/articles/art-nouveau-an-international-style) — Art Nouveau 的国际传播、有机形态与地域变体。
- [Adobe InDesign · Do's and don'ts of great print design](https://www.adobe.com/learn/indesign/web/standard-design-practices) — 留白、内容层级、网格、重复元素与 master page（母版页）的实用说明。
- [World Wide Web Consortium · Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/) — Web Content Accessibility Guidelines（WCAG，网页内容无障碍指南）的对比度与视觉呈现要求，可作为数字文档视觉质量的参考边界。
- [PDF Association · International Organization for Standardization（ISO，国际标准化组织）14289-1 / PDF/UA-1](https://pdfa.org/resource/iso-14289-pdfua/) — 可访问 PDF 除视觉外还依赖章节、段落、列表、表格等语义结构。
