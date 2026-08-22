# Prose Polish Review

## 修改目标

按 Aaron 的反馈做一次完整的叙事重写：从“AI 如何帮助我”的案例文章，改成一段有生活节奏的旅行随笔。保留全部事实边界，不补造岛名、风景、人物或对话；只用已有的时间、选择和停顿，让 AI 退到故事后面。

## 英文润色重点

- 开头从事实陈述改为 “Trips are supposed to begin with departure”，先给旅行的预期，再落到登船前的意外。
- 让 “Maps told us where. GPT helped with the rest.” 成为生活化的分界：不再讲工具替代，而是写陌生城市里不断出现的“未完成句子”。
- 将 DrumNext 段改成夜里回房、旅行出现第二个时钟；产品细节仍在，但落在“随身带着的一件还在生长的作品”上。
- 收束到 AI 最好用时几乎看不见：问题松开、文件可读、句子找到形状、功能回到焦点。删除了较像产品案例的解释句。

## 中文润色重点

- 中文不是英文的逐句翻译。开头以“行程表里从来没有写过的那一格”建立中文自己的节奏。
- 将“context recovery”等抽象词拆开，改写为“把那一堆文件重新理一遍”“把一个还没有完全成形的问题慢慢说清楚”“重新想起来”。
- 保留 `GPT`、`Google Maps`、`Google Search`、`Starlink`、`DrumNext`、`DeepSeek Harness` 和 `Claude Code` 等自然的专有名词，普通概念尽量用日常中文表达。
- 结尾保留一点余味，但不堆叠文学修辞：空间留给旅行，也留给值得带上船的工作。

## 保留不改的地方

- 不增加岛名、餐厅名、风景、对话、速度测试或同行者信息。缺少这些细节是证据边界，不是 prose 问题。
- 不增加 Starlink 厂商背景或 AI 旅行趋势数据；它们会打断旅行叙事。
- 不把 DeepSeek Harness 扩展成技术教程，也不写任何模型优劣比较。
- 不把“没有 Google Search”写成对搜索工具的结论。

## 风险与边界

- 登船情节只陈述 Aaron 的直接观察；最终处理结果、文件有效性和个人身份均不写。
- DrumNext 段的功能范围来自本地 commit，但正文不把它推导为用户结果或 AI 因果。
- 文章可以邀请读者把 AI 用于恢复上下文；不能暗示人们应在每次假期都保持工作状态。

## 验证结果

- English style/story gate: PASS, 100/100; 1,536 words, 108 sentences, 0 slop markers.
- Chinese style gate: PASS, 100/100; 2,489 Chinese characters, 93 sentences, 0 slop markers.
- 用户要求更生活化后，正文结构、句子节奏和段落重心均有实质变化；论点、事实、链接和 claim ledger 边界保持不变。
