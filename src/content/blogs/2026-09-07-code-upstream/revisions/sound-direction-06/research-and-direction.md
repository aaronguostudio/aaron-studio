# 声音导演实验：把观点讲出起伏

## 诊断与实验范围

作者反馈：声音整体可用，但表达偏平；几篇视频重复使用同一批音乐；音乐与文章的兴奋、转折和停留缺少关系。当前完整视频仍为 `video-v2.mp4`，这次没有替换母版、生产声音配置或批准状态。

旧版配乐使用 Paper Moon / Turning Page / Common Ground，共 117 秒、四处铺入；这次生成两首新 Lyria 3 clip 候选。新音色不是“已经更好”的结论，先测试题材与音乐之间的关系。

## 研究带来的具体选择

1. [ElevenLabs TTS 官方指南](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices)：v2 可以使用少量 SSML break，v3 使用音频标签而非 SSML；不同声音对这些控制的响应不同。文档也提示 PVC 在 v3 上仍有适配限制。因此没有直接把 Aaron 的默认克隆升级到 v3，也不能凭“平”就判断训练失败。
2. [ElevenLabs Voice Changer](https://elevenlabs.io/docs/api-reference/speech-to-speech/convert)：允许用参考音频控制节奏、情绪和表现，再转换成目标声音。本次已生成 George v3 导读与 Aaron STS 转换版本。它们的语速和口音可能影响身份辨识；是候选，不是生产推荐。
3. [Remotion 官方 audio skill](https://github.com/remotion-dev/skills/blob/main/skills/remotion-best-practices/remotion-markup/audio.md) 与 [voiceover skill](https://github.com/remotion-dev/skills/blob/main/skills/remotion-best-practices/remotion-markup/voiceover.md)：可借鉴以实际音频时长决定画面、分别控制音轨与帧级包络。它们解决工程连接，不会替导演决定哪句话值得停。
4. [sound-design-film](https://github.com/guia-matthieu/clawfu-skills/blob/main/skills/audio/sound-design-film/SKILL.md)：参考其中声音层次、情绪转折、声音跨画面衔接的做法；没有采用其无法核实的效果百分比、名人引言或把层数当作定律。
5. [ai-music-and-sound / SCORE](https://github.com/social-media-skills/skills/blob/main/skills/ai-music-and-sound/references/the-score-framework.md)：借鉴先写 hook / build / payoff 的音乐任务。密集 whoosh、riser、stinger 不适合当前克制的长篇评论；其中商业权利概括也不作为许可证明。
6. [Google 音乐 API](https://ai.google.dev/gemini-api/docs/music-generation)：用已有生成入口制作独立短 cue，保存实际模型、prompt 和原始音频；不因文档出现较新模型就改掉本轮已验证可用的接口。

检索方式：skills.sh 榜单 + `npx skills find 'video sound design'`，然后读取作者仓库的具体技能文件。没有安装第三方 skill，也没有将搜索排名当成质量验证。

## 两组独立试听

### 画面 × 原声 × 新配乐

截取原片 06:51.8 起的结尾，原版 57.87 秒；实验版 59.57 秒。

| 段落 | 声音任务 | 画面任务 |
|---|---|---|
| 过去的判断仍然重要 | 先听到人，再让轻拨弦进入 | 保持“职位 / 能力”的对照可读 |
| 能力需要连接真实需求 | 完整句后多 1 秒，音乐轻抬再退 | 让判断留在屏幕上，不抢进下一条 |
| 每个项目教会什么 | 音乐退出，具体行动由人声承担 | 延续已有学习路径图 |
| 未来十年 | 新和声逐渐打开，音量温和进入 | 让问题单独占据画面 |
| 下一个项目 → 乐观 | 句后多 0.7 秒，再继续讲 | 给下一段图像进入一点空间 |
| 做自己在乎、别人需要的东西 | 最后一句音乐收一点；讲完再回应并衰减 | 结论图像与原有片尾完成收束 |

原旁白每一个保留片段的 PCM 与来源逐样本相同，增益始终为 1。音乐包络独立，未对影片总线做压缩或自动压低人声。字幕按句意重新分组，并使用同一个时间映射。

### 同稿干声

119 个词，三种主要候选 + 一个可展开的商业导读参考：

- A：原片 Aaron 配音，约 53 秒。
- B：同一个 PVC，少量停顿标记与候选参数组合，约 52 秒；这是组合试验，不能把效果归因于某个单独参数。
- C：George v3 导读经过 Voice Changer 转成 Aaron，约 44 秒。
- 导读参考：George v3，约 44 秒；展示节奏来源，不作为默认换声方案。

试听统一做约 -18 LUFS 的归一化、保持原速与音高；部分候选原始峰均比过高，使用两遍 loudnorm 的动态模式。它与影片中“保留原声增益”的实验分开。每个候选保留原始音频、请求、生成记录与转写，便于进一步定位问题。

## 检查与待评价

生成请求删除 SSML / 音频标签后与锁定文稿完全一致；Scribe v2 对三个新候选的转写均为 119 词，与锁定文稿逐词一致。自动转写不能证明音色保真、情绪自然或听感更好。

试听优先回答：停留是否自然；音乐是否跟着意思走；A/B/C 哪个既像 Aaron，又把重点讲出来。技术检查和作者偏好分别记录，不把一个实验自动升级成默认生产方案。

若 C 表现有价值但不像 Aaron，可进一步用 Aaron 亲自录的一段导读测试 Voice Changer；若 B 已足够好，继续在同一个克隆上改善稿件分句和局部生成。是否补录训练素材，要在这些差异被听清后再决定。
