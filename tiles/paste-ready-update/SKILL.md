---
name: paste-ready-update
description: Use when someone wants a message, status update, release note, handoff or how-to with screenshots that they will paste into Teams, Slack, Outlook, Gmail, WeChat, WeCom or a document for another person (a manager, client or colleague). Typical requests are "an easy copy-paste message with screenshots", "write Sam an update with these screenshots" or "容易 copy paste 的英语+截图 message". It also applies when they only ask for "a message for X", the screenshots are already in the conversation, and the message will be pasted somewhere.
---

# Paste-ready update

A paste-ready update is one self-contained HTML page holding two things:

- a message for someone else, with its screenshots inlined;
- buttons to copy the text, the text with its screenshots, or one screenshot at a time.

The person you are working for pastes the message and sends it. You never send it yourself.

## Workflow

1. **Pin down the brief.** Settle these points; ask only for what the conversation and the files don't already tell you:
   - who reads it;
   - what the reader can now do, or what changed;
   - the message's language (write in the reader's language; reply to the user in theirs);
   - where it will be pasted;
   - whose name signs it.
2. **Look at every screenshot before using it.**
   - Leave out or crop anything the reader shouldn't see: other customers' data, personal details, tokens, unrelated tabs, notifications.
   - Check every number and label the message repeats against what the screenshot shows. If they disagree, tell the user; don't silently pick one.
   - If you can capture the real screen yourself (a browser tool), take the screenshots. Otherwise ask for them, or write the message without pictures.
   - A full-window screenshot is unreadable at chat width. When the reader is not technical, crop each screenshot to the part that matters and mark what to click, numbered like the steps. Leave the originals untouched:

     ```bash
     python3 <skill-dir>/scripts/mark_screenshot.py shot.png --info
     python3 <skill-dir>/scripts/mark_screenshot.py shot.png shot-marked.png --crop x0,y0,x1,y1 --box x0,y0,x1,y1:1
     ```

     - Running it with `--info` prints the image size.
     - Coordinates are pixels of the original image.
     - Look at the output and adjust the coordinates once if a box misses its target.
     - The script needs Pillow. Without it, use the screenshot unmarked.
3. **Write `message.md`** in the shape and format below.
4. **Build the page:**

   ```bash
   python3 <skill-dir>/scripts/build_page.py message.md --out <short-name>.html
   ```

   The script embeds the screenshots, so the page works anywhere. A missing screenshot stops the build; fix it, don't drop it. The script prints the page size, screenshot count and word count. The copy buttons come from a tested template, so check the text and the screenshots rather than clicking the buttons.
5. **Deliver it** (see Delivering).
6. **Reply to the user** with:
   - where the page is;
   - how to paste it for their destination (one row of the pasting guide);
   - any sentence you added that they didn't say;
   - anything in the screenshots you were unsure of;
   - what you checked and what you didn't.

## Message shape

1. Greet the reader by name.
2. In one or two sentences, say what the reader can now do or what changed, and where it is live. Lead with the outcome, not the work behind it.
3. Add a short heading such as "How to try it", then numbered steps:
   - one action per step;
   - on-screen labels in **bold**, spelled exactly as the screen spells them;
   - each screenshot on its own line, directly under the step it shows;
   - keep numbering after a screenshot (`2.`, `3.` …); the page keeps the count.
4. Optionally add short bullet sections: what's included, up to three tips, known limits.
5. Say what you would like from them (try it, reply, approve), then sign off with the user's name.

Use the reader's own words: no ticket numbers, branch or PR talk, or internal code names they don't use.

Include only what the reader needs to act: usually 150 to 400 words, with at most eight screenshots.

Claim only what the user told you or what you verified.

## `message.md` format

```markdown
---
title: Update for Priya: invoice export fix
hint: Paste the text into Teams, then each screenshot under its step.
lang: en
---
Hi Priya,

Invoices now export to PDF with every line and the page subtotal, including long ones.

## How to check

1. Open any invoice and click **Export PDF**.

![Page 2 before the fix: rows cut off, no subtotal](shots/before.png)

![Page 2 now: every row and the subtotal carried to page 3](shots/after.png)

2. Re-export any PDF you saved before today; old files don't update themselves.

Let me know if any invoice still looks wrong.

Thanks,
Aaron
```

- `title` heads the page and is for the sender, not part of the message. `hint` and `lang` are optional.
- Supported Markdown:
  - `##` and `###` headings, and paragraphs. A single line break stays a line break, as in a chat message.
  - `-` bullets, nested by two spaces, and `1.` steps.
  - `**bold**`, `*italic*`, `` `code` ``, `[links](https://…)`, `> quotes`.
  - `![caption](path)` on its own line, with the path relative to `message.md`.
- **Copy text** copies the message without the screenshots and without placeholders, so nothing stray gets sent. The page shows where each screenshot goes.
- `video: <path>` in the front matter adds a walkthrough video to the page. It is shown on the page but not copied; the user attaches it.

## Walkthrough video (optional)

Offer a short walkthrough video only when both are true:

- the change is visible in the UI;
- the current project's `package.json` has a `demo:capture` script.

Backend and infrastructure updates stay text-only.

Before running anything, read [references/walkthrough.md](references/walkthrough.md). A capture drives the real app and can write data, so some environments need the user's go-ahead for every run.

## Delivering

- **If the harness can publish a private web page** (for example Claude's Artifact tool), build with `--fragment` and publish the page privately.
  - The page is for the sender. Don't share its link unless asked.
- **Otherwise, give the local file path** and open the file if you can: `open` on macOS, `xdg-open` on Linux, `start` on Windows.
  - The copy buttons work from a local file in current Chrome, Edge, Safari and Firefox.
- **Never send, post or email the message yourself**, even when a messaging tool is connected, unless the user explicitly asks you to send it.

## Pasting guide

| Destination | How |
|---|---|
| Outlook, Gmail, Apple Mail, Word, Google Docs, Notion | Paste once with **Copy text + screenshots**. If a screenshot is missing after the paste, paste it with its **Copy image** button. |
| Teams | Paste **Copy text**. Then, for each screenshot, press its **Copy image** button and paste it under the step it belongs to; the page shows where. |
| Slack, WeChat, WeCom, WhatsApp, iMessage | Send **Copy text** first. Then send each screenshot with its **Copy image** button, in order. These apps send pictures as separate attachments. |

## Common mistakes

| Mistake | Instead |
|---|---|
| Markdown or a chat reply with local image paths | Build the page; the reader can't open your files. |
| The message in the conversation's language | Write it in the reader's language; reply to the user in theirs. |
| All screenshots at the end | Put each one under the step it shows. |
| A screenshot used unseen, or one showing someone else's data | Look first; crop or leave it out. |
| "It's live and tested" when nobody checked | State only what the user said or what you verified. |
| Sending the message for the user | Deliver the page; the user sends it. |
