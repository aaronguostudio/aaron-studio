# YouTube Metadata

## Title Options

1. **What I Learned From DeepSeek's Harness** (recommended — matches article and thumbnail; accurate, no bait)
2. Same AI, 47% vs 67%: The Layer That Decides
3. Inside DeepSeek's Open Harness: Four Designs Worth Stealing

## Description

The same AI model ran thirty real work tasks through eight different harnesses — task success swung from 46.7% to 66.7%, and cost per finished task varied 7x. Nothing about the model changed. Then DeepSeek open-sourced its harness, and for the first time this layer can be read end to end.

I spent a few days inside the repo, every claim pinned to one commit. This video walks the four designs worth learning: the cache discipline that protects your bill, the 44/3 event log the model cannot escape, the agent loop that hangs from one config row, and the process operating system behind 12,293 commits in 64 days — most of them not typed by humans.

Full teardown with the real config excerpts:
https://www.aaronguo.com/blogs/deepseek-harness-teardown?utm_source=youtube&utm_medium=video&utm_campaign=deepseek-harness-teardown&utm_content=description

Chapters (v3 ledger-editorial film, 10:06 — includes the 3s cover card):
0:03 Same model, 47% vs 67%
0:55 The winner blinked
1:48 Follow the money first
2:56 The test that refuses to lose money
3:39 44 kinds of events. The model sees 3.
5:02 The whole agent hangs from one row
6:20 Who actually built this
7:45 The catch, and the play
8:46 The hour you should spend

(v3 timestamps derive directly from the verified narration timing table — the film timeline IS the narration timeline. The superseded v1 slide-render chapters: 0:00/0:58/2:13/3:25/4:11/6:38/7:58/9:28/11:03 at 12:42.)

## Tags

deepseek, ai agent, agent harness, claude code, codex, llm caching, prompt caching, ai coding, ai engineering, open source ai, deepseek harness, ai infrastructure

## Publishing Notes

- Thumbnail: `imgs/00-cover-thumbnail.png` (already generated; passed exact-text inspection).
- Upload requires Aaron's explicit authorization (yt-publish phase); this file is a local draft.
- Description link uses the youtube/video UTM pair, distinct from all social links.
