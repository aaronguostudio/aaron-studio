# Walkthrough video

The project's own capture command drives the app, records the screen and writes a capture folder.
The renderer that ships beside this skill turns that folder into a captioned mp4 plus chapters,
silent unless the user asks for narration. The message stays the main thing; the video is an attachment.

## 1. Find the capture command

- Look for a `demo:capture` script in the current project's root `package.json`.
  - If there is none, there is no video. Don't build one.
- Run it with the project's package manager (`pnpm`, `npm` or `yarn`, going by the lockfile): `pnpm demo:capture --list`.
  - Show the user the walks it lists.
  - Ask which walk and which environment.
  - The command's `--help` tells you its options and guards. Follow them.
- An environment that writes to shared or production systems needs the user's go-ahead in chat for that run.
  - Get it every run, even if they approved an earlier one.
  - Never add a confirmation flag on your own.
- The first run of an environment may open a browser for the user to sign in. Never type credentials.

## 2. Run it and read the result

The command prints its run folder. Read `capture.json` there:

- **`status: "passed"`:** go on.
- **`status: "failed"`:** there is no video. Tell the user which step failed (`failedStep`, `failure`) in plain words. Then either write the message without the video (say the walkthrough will follow) or ask them which they want.

Never move a run folder into a repo.

## 3. Render

The renderer lives beside this skill's real directory. The skill is usually reached through a symlink, so resolve that first:

```bash
SKILL=$(python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' <skill-dir>)
npx -y bun "$SKILL/../aaron-video-gen/scripts/walkthrough/render-walkthrough.ts" <run>
```

- It writes `walkthrough.mp4` and `chapters.txt` into the run folder.
- It refuses a capture that did not pass.
- Add a voice-over only when the user asks for one. It speaks in the user's own cloned voice (ElevenLabs), costs API credits, and labels the video "AI narration". Its key setup is in `aaron-video-gen/references/walkthrough-capture.md`. Two styles:
  - **Concise** (`--narrate`): the voice reads the captions. Short and official.
  - **Conversational** (`--script <run>/narration.conversational.json`): it sounds like a person giving the demo. Write the script as below, show it to the user, and render only after they approve it.

### Writing a conversational script

The format is in `aaron-video-gen/references/walkthrough-capture.md` (Narration). Write it the way the user would talk while sharing their screen with this reader:

- **Open with who and what, in one line:** "Hi Sam, here's the new order screen, start to finish."
- **Say why, and point at the screen:** "Notice the address is already filled in, so there's nothing to type here." Explain what a step achieves, not only which button it is.
- **Tie the steps together:** "Now that the order is saved, let's open it." Use first person and "let's".
- **Group quick clicks:** give one line to a run of small steps and leave the rest silent. A person never narrates every click.
- **Keep each line to one or two sentences, about 30 words at most.** A step stays on screen until its line ends, so long lines make a long video.
- **Waits are a chance to explain:** a fast-forwarded wait can carry a slightly longer line about what the system is doing.
- **Say only what the screen shows or the update says.** No numbers or claims the reader cannot see, and no names the message itself would not use.
- **Close with the result and an offer:** "And that's the order shipped, with nothing left to do. Happy to walk through it live."

Check every step id against `steps.json`; the renderer refuses an unknown one.
- If the renderer is not there (this skill was installed on its own), skip the video and say so. The screenshots still work.

## 4. Put it in the message

- **Screenshots.** Each step's `shots/NN-<id>.png` shows the screen just before the step's first click. Mark that click from the recorded box instead of guessing coordinates; a step's later clicks happen in dialogs the shot does not show. Write the marked copies next to `message.md`:

  ```bash
  python3 <skill-dir>/scripts/mark_screenshot.py <run>/shots/03-save.png shots/03-save.png \
    --steps <run>/steps.json --step save --label 3 --crop auto
  ```

- **Steps.** The captions in `steps.json` are a ready draft of the numbered steps; tighten them for the reader.
- **Chapters.** Add a short section after the steps, for example "Walkthrough video (1:42, attached)", with the lines of `chapters.txt` as a list.
- **Front matter.** Add `video: <path to walkthrough.mp4>`.
  - The page shows the player and reminds the user to attach the file. A browser cannot copy a video, so the copy buttons leave it out.
  - When publishing with `--fragment`, publish the mp4 beside the page under its file name.
- **Reply.** Give the mp4's path, and tell the user to attach it to the message in Teams, Outlook or Slack after pasting the text.
