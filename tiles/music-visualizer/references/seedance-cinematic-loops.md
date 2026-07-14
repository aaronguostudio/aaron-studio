# Seedance Cinematic Loops

Use this path when the viewer needs to inhabit a real-feeling world rather than
watch a graphic system: a person working, a cabin, a garden, a lookout, weather,
clouds, smoke, water, or sunlight.

## Hard rejection rule

Do not replace this brief with code-drawn blobs, drifting circles, glow lines,
or a generic shader. If the world, material richness, or organic motion is the
reason the scene is compelling, generate the world first and use Remotion only
for assembly, captions, or a restrained title card.

## Seedance loop contract

- Use `doubao-seedance-2-0-260128` with `16:9`, provider audio disabled, and
  a 15-second duration for the quality prototype.
- Generate one original 16:9 anchor image. Submit it as both `first_frame` and
  `last_frame` for strict loop anchoring. Seedance 2.0 supports first/last-frame
  image-to-video and accepts the same image for both positions.
- Do not combine strict first/last-frame mode with unrelated reference images.
  If character or prop consistency needs more inputs, make a separate
  reference-mode prototype and accept that its loop is not frame-locked.
- Keep the camera locked, or permit only an imperceptibly slow optical drift.
  Do not request a dolly, orbit, crash zoom, cut, or scene transformation in a
  loop candidate.
- Give the figure one small action that can return to its resting pose: writing
  one line, moving a hand across a trackpad, turning a page, or pausing to look
  at the horizon. Environmental motion should be continuous and low-frequency.

Current API capability reference: [Seedance 2.0 video generation](https://docs.byteplus.com/en/docs/modelark/1520757).

## Anchor composition gate

Do not spend on a 15-second loop until the generated 16:9 anchor itself passes
visual inspection. A prompt that asks for the right scene is not evidence that
the model produced it.

For any scene with a person at a desk, reject the anchor if any of these are
true:

- the head, body, hands, or seated pose is cropped, obscured, or anatomically
  incomplete;
- the laptop keyboard or screen does not visibly face the person, or the viewer
  sees the active screen where the staging calls for its back/side;
- the camera is a close foreground portrait rather than a distant, elevated,
  three-quarter bird's-eye view;
- the subject dominates the frame instead of living inside a readable world;
- the intended green island, foliage, or surrounding cloud sea is replaced by
  bare canyon, anonymous mountains, or an unrelated foreground desk.

For a calm cloud-island study, use this spatial template: a small verdant,
grass-covered island entirely visible within a broad ocean of clouds; one whole
seated person seen from a distant three-quarter back view; a simple low desk
whose laptop and keyboard face that person; the island and cloud sea occupy the
visual hierarchy, while person and desk occupy roughly 5–12% of the frame.
Borrow only the spatial hierarchy and motion restraint from a reference—not its
specific architecture, props, or composition.

## Prompt construction

Write the Seedance prompt in Chinese. Describe only an original scene; use a
reference clip to learn restraint, visual hierarchy, and motion allocation, not
its subjects, layout, or individual assets.

Prompt order:

1. shot type and stable framing;
2. original setting and solitary subject;
3. repeatable character micro-action;
4. environmental motion hierarchy;
5. palette, material, and atmosphere;
6. explicit exclusions.

Example shape:

```text
15秒横向电影感循环镜头，固定远距离、略居高临下的广角构图。一座完整的
翠绿草地小岛漂浮在无边云海中央；一个完整的年轻人以三分之二背面盘腿坐在
低矮木桌前，头、肩、双臂和躯干始终完整留在画面内。打开的笔记本电脑与
键盘明确朝向人物，镜头只看见电脑背面或侧面。人物缓慢写一笔后回到读书
姿势，云海极慢流动、草叶与衣角轻轻起伏、暖金色光线缓慢扫过云顶并回到
起点。温暖自然、田园奇幻、细腻手绘与微缩实景融合、开阔有意境。不要人物
裁切、无头、反向电脑、前景特写、裸露山体、峡谷、木屋、电线杆、文字、
字幕、标志、水印、额外人物、突然动作或戏剧性天气变化。
```

Do not name a living director, a living composer, a studio, a franchise, or a
specific song. Translate the desired feeling into observable visual and musical
attributes instead.

## Production sequence

1. Make and inspect the original anchor image at final 16:9 framing.
2. Run one 15-second, 720p Seedance prototype with the same image as first and
   last frame.
3. Extract frame 0, 25%, 50%, 75%, and final frame. Make a contact sheet.
4. Make a seam preview: last 1.5 seconds + first 1.5 seconds. Watch it at
   normal speed and 0.5x; reject any visible jump.
5. Only then render a 1080p take. Keep the approved video loop and the selected
   music loop separate, then build the 10-minute master by repeating both on
   clean bar and visual boundaries with gentle chapter-level audio variation.

Store `anchor.png`, `request.json`, `task.json`, `final_response.json`,
`output.mp4`, `contact-sheet.jpg`, `loop-seam-preview.mp4`, the music prompt,
and a short QA decision in the same run folder.
