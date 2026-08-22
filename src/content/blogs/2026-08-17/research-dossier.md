# 研究档案

## 这份材料要回答的问题

1. 这篇文章怎样从“AI 旅行攻略”中区分出来，而不制造一个新的宏大理论？
2. 哪些旅行和登船陈述是 Aaron 的个人观察，哪些只能作为谨慎的背景？
3. DrumNext 的升级究竟可以具体到什么程度？
4. DeepSeek Harness / Claude Code 应当如何出现，才会服务于旅行叙事而非抢走主线？
5. 文章怎样承认 AI 在高风险旅行信息上的局限？

## 核心一手资料

每条材料记录发布日期、核验日期，以及它能支持什么、不能支持什么。

### Aaron 的旅行口述与本次对话

- 日期：2026-08-17；核验：2026-08-17。
- 可支持：同行旅客在登船时遇到监护相关文件问题；GPT 协助在已有移民/居留材料中定位证明线索；旅途中用 GPT 查询经典、餐厅、议价与写作；使用 Google Maps 但没有进行 Google Search；在船上 Starlink 网络中开发 DrumNext；欧洲时区支持晚间团队协作。
- 不能支持：具体证件是否最终被接受、任何法律结论、旅行伙伴或未成年人的身份、所有船上网络都可工作。

### DrumNext 代码库与提交 `8617609`

- 作者/日期：Aaron Guo，2026-08-17；核验：2026-08-17。
- 提交主题：`feat: refresh metronome practice experience`；194 个文件变更，11,264 行新增、3,901 行删除。
- 可见产品范围：Practice/Setup 界面、内部节拍训练、随机静音、速度模式、预设、练习历史与周目标、离线持久化和同步，以及相应测试与 E2E 覆盖。
- 可支持：这是一轮实际产品升级，而不是一段概念性代码实验。
- 不能支持：用户增长、留存、练习效果或 AI 对交付速度的因果贡献。

### DeepSeek Harness 本地项目与 Aaron 的阅读笔记

- 路径：`/Users/aaronguo/Work/lab/deepseek-harness`；核验：2026-08-17。
- 可见范围：CLI、profile boot、plugin surface、进程关闭、工具/安全/会话相关模块；Aaron Studio 内保留了 harness engineering 与 DeepSeek Harness teardown 的阅读材料。
- 可支持：Aaron 在旅行期间可借 GPT 快速进入陌生框架，再使用 Claude Code 在工程工作中应用这类理解。
- 不能支持：Aaron 创造了 DeepSeek Harness，或任何外部项目的真实性能/市场结论。

## 可以使用但要谨慎的二手材料

### OpenAI：ChatGPT for travel and exploration

- [OpenAI use case](https://chatgpt.com/use-cases/travel-and-exploration/)，2026 年 7 月抓取，核验 2026-08-17。
- 可支持：ChatGPT 官方将旅行规划与文件/签证相关准备列为使用场景。
- 限制：厂商页面不是安全性或准确性的独立证明；正文不必把它写成产品广告。

### Smartraveller：Travel planning with AI

- [澳大利亚 Smartraveller 官方提醒](https://www.smartraveller.gov.au/news-and-updates/travel-planning-ai)，更新 2026-07-15，核验 2026-08-17。
- 可支持：AI 可作为旅行信息的起点，但可能出错；涉及规则、法律与安全的信息要回到官方来源交叉核验。
- 用法：只用于登船文件段的边界，不展开安全科普。

### Starlink：Carnival Cruise case study

- [Starlink Cruise case study](https://starlink.com/ag/business/case-studies/carnival-cruise)，核验 2026-08-17。
- 可支持：Starlink 自称改善了邮轮上的吞吐量与延迟；海上连接变得更可用是一个行业背景。
- 限制：是供应商案例，不能代替 Aaron 所乘船只的实际网络质量证据。

### 旅行内容的竞争样本

- [Tom's Guide 的 2026 AI 行程案例](https://www.tomsguide.com/ai/i-gave-chatgpt-my-favorite-anime-and-manga-and-now-i-have-a-personalized-schedule-for-anime-nyc-so-i-wont-miss-a-thing)：典型角度是个性化行程节省时间。
- [OneLessHour 的三次旅行测试](https://onelesshour.com/chatgpt-for-travel-planning/)：有用但会过期，强调 AI 给出已关闭餐厅的风险。
- 可支持：市场上已经有大量“AI 规划行程”内容；本文应回避工具评测和推荐清单。

## 可用案例

1. **登船前的文件问题**：强开场；只叙述 Aaron 看见的压力和检索过程，不讲他人私密信息或最终裁决。
2. **Starlink 上的 DrumNext 升级**：船舱里的笔记本、有限时间与完整的产品变更，形成工作线。
3. **欧洲时区的夜间协作**：白天看城市，晚间与团队连接；不把它写成“旅行也应保持生产率”。
4. **没有 Google Search 的一天**：GPT 用于文化背景、餐厅、沟通与议价，Google Maps 用于空间判断；它是习惯变化，而非工具胜负宣言。
5. **DeepSeek Harness 到博客**：GPT 帮快速学习新框架，Claude Code 帮工程执行，blog-production 把经历整理为文章；作为后半段的轻量收束。

## 主要反方观点

- AI 可能给出过期、错误或不适用于个人情况的旅行/文件建议；它绝不能替代承运方、使领馆或官方信息。
- 假期中继续写代码可能意味着工作侵占生活，而不是“自由”。
- 一次产品提交不能证明 AI 让产品更好或让开发更快。
- “不用 Google Search”是个人习惯变化，不是对搜索引擎、地图或本地建议的普遍否定。

## 关键事实与引用

- 船上网络背景、AI 旅行使用与风险边界，见上述官方/厂商/竞争材料；正文只引用风险边界，避免数据化堆砌。
- DrumNext 的技术事实进入 `claim-ledger.md`，以本地 Git commit 为源。
- 旅程核心事件均按 personal observation 写入 claim ledger，不伪装成可外部验证的普遍事实。

完成后把准备进入正文的事实、推断、判断和个人观察写入 `claim-ledger.md`。

## 开放问题

- Aaron 是否愿意提供一张码头、船舱、Starlink 速度测试或 DrumNext 界面图？文章没有它们也可成立，但图片能增加现场感。
- 具体的餐厅、岛屿、经典或议价对话是否有可公开的、无隐私风险的小细节？有则补一两笔；没有则不编。
- DrumNext 本次最想让读者记住的一个新功能是什么？当前将以“从节拍器走向完整练习系统”概括，后续可由 Aaron 指定替换。

## 文章应保留的判断

一段旅行不需要被 AI 优化成效率展示。AI 真正改变的是它在事情偏离计划后，能否把资料、语言和工作上下文重新交到人手里；而人仍决定要不要工作、相信什么、以及这趟旅行要记住什么。
