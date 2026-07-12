# FDE V5 成片 QA 报告

## Master

- 输出：`fde-full-film-v5.mp4`
- 规格：1920 x 1080、30 fps、H.264 + AAC
- 时长：451.67 秒（7:31.67）
- 叙述音频：`narration-v5-editorial-retimed.mp3`
- 音频规格：44.1 kHz、单声道、192 kbps、448.04 秒
- 音频测量：-17.21 LUFS、-2.03 dBTP、4.3 LU、长静音 0 段

## 针对 V4 反馈的验收

| 反馈 | V5 处理 | 编码后检查 |
|---|---|---|
| 首屏像模板、与博客脱节 | 以文章封面作为 `cover-hero` | 0.6 秒关键帧通过 |
| 首屏先出现空封面、标题与品牌滞后 | 标题、副标题和 vlog 品牌 lockup 在第 0 帧同时可读 | opening revision 已加入 V5 Identity master |
| “为什么为人投入”画面空 | 文章标题左侧 + 受控的概念运营团队镜头右侧 | 26 秒关键帧通过 |
| 字幕上方绿线干扰 | 移除装饰线，仅保留低对比字幕表面 | 多场景关键帧通过 |
| 两栏 header 让标题换行 | 标题使用全宽阅读轴，辅助信息置于下方 | scale / ownership 场景通过 |
| 流程卡片不均衡 | `decision-row` 固定四个 400px 节点与 32px gap | 110 秒关键帧通过 |
| 连接线和节点不同步 | 节点按路径到达阈值激活；端点和箭头延后 | 273-294 秒顺序帧通过 |
| `FDE` 被字幕拆开 | 字幕预处理合并连续拼读缩写 | 249.9 秒编码帧显示完整 `FDE` |
| ownership 画面突兀、不对称 | 使用注册的对称 map 和固定 asset/provider 版式 | 314 / 334 秒关键帧通过 |

## 视觉检查材料

- `qa-encoded/contact-sheet.png`：首屏、人物、数据、决策、循环、ownership、ACTOR、结尾。
- `qa-motion/contact-sheet.png`：人物引入、决策链、比较循环、ACTOR 回路的进入/峰值/结束状态。
- `qa-encoded/fde-caption-249-9.png`：缩写字幕回归检查。

抽帧均从已编码 MP4 顺序解码，而不是输入前 `-ss` 快速定位。

## 工程检查

- `bun test ../scripts`：62 passed，0 failed。
- `npm run validate`：TypeScript 与 Remotion 审计通过。
- 审计器仍提示三个既有静态组件没有时间 primitive；它们不参与 V5 的时间轴，也不是运行错误。

## Identity Master V3

- 当前输出：`fde-full-film-v5-identity-v3.mp4`
- V2 保留为历史版本；V3 将开场改为首帧完整品牌封面，不再让标题或品牌延迟进入。
- 规格：1920 x 1080、30 fps、H.264 + AAC、455.87 秒。
- 在约 7:30.47 之后，旧的结论先清空；随后进入约 5 秒的 `brand-end-card`。
- end card 使用 vlog 已有的浅蓝/浅紫标识、Aaron Guo、`AI-NATIVE BUILDER` 与 `Human-first thinker`；没有网址、文章名、Field Notes 或工程式 footer；frame chrome 与字幕均已隐藏。
- 已从编码后 master 顺序抽取结论、转场、品牌进入、稳定页和淡出页，检查没有旧标题或 metadata 残留。
- 首帧复检：frame 0 与 frame 30 均显示文章封面、大标题、`Forward deployed engineering` 副标题与左上 vlog 品牌 lockup；没有标题或品牌的延迟淡入。
- 结尾复检：编码后帧 450.0、452.5 与 454.8 秒均为干净的品牌定版，无旧页眉、网址、字幕或黑屏提前切入。

## YouTube 发布

- 视频：[`Expensive Tokens Won't Save Enterprise AI`](https://youtu.be/BhwSZpb6ag8)
- 频道：`Aaron - AI-native builder`
- 状态：`public`，YouTube processing `succeeded`
- 上传母版：`fde-full-film-v5-identity-v3.mp4`
- 缩略图：文章封面转码后的 `youtube-thumbnail-v3.jpg`；YouTube API 已确认缩略图可用。
- 描述中的全文链接带有 `youtube / video / fde-deployment-capacity / description` UTM 标记。

## 需要 Aaron 听感确认的项目

V5 使用 `aaron-pvc-editorial-v5-candidate`：同一 Professional Voice Clone，`eleven_multilingual_v2`，stability `0.4`、similarity `0.8`、style `0.56`、speed `1.04`。技术检查没有长静音或时间轴漂移，但“后半段是否仍有足够活力”只能由听感确认。因此它仍是候选配置，不会替换当前默认声音。

已生成三个 60 秒的复听样本：开头（0 秒）、中段（194.02 秒）和后段（388.04 秒）。它们位于 `FDE V5 Voice Review` iCloud 文件夹，供同一声音在整条片子不同位置的对照判断。
