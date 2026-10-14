# Demo tools for macOS + Codex

This installs three user skills: `paste-ready-update`, `demo-capture`, and `walkthrough-video`. The video runtime is exported from the canonical Studio renderer. Blog workflows, personal Brain records, editorial media, credentials, and recorded customer screens are excluded from the installed bundle.

## 1. Prepare the Mac

Install Codex and sign in. You need Git and network access to GitHub and the dependency download services.

With [Homebrew](https://brew.sh/) already installed, run this in Terminal:

```bash
brew install node@22 python ffmpeg
export PATH="$(brew --prefix node@22)/bin:$(brew --prefix)/bin:$PATH"
node --version
python3 --version
```

Node must be at least 22; Python must be at least 3.11. FFmpeg includes `ffprobe`. Installation uses npm and PyPI, plus Playwright's and Remotion's browser downloads. If the company network blocks one of these downloads, use the company's approved network/proxy configuration and rerun the installer.

## 2. Fetch only the demo source

The distribution branch is `codex/demo-macos-distribution`. These commands use sparse checkout and a shallow, filtered clone so blog content and media are not checked out.

```bash
mkdir -p "$HOME/Tools"
git clone --filter=blob:none --depth 1 --no-checkout \
  --branch codex/demo-macos-distribution \
  https://github.com/aaronguostudio/aaron-studio.git \
  "$HOME/Tools/aaron-demo-source"
cd "$HOME/Tools/aaron-demo-source"
git sparse-checkout set --no-cone \
  /scripts/demo-tools/ \
  /tiles/demo-capture/ \
  /tiles/paste-ready-update/ \
  /tiles/walkthrough-video/ \
  /tiles/aaron-video-gen/config/voice-profiles.json \
  /tiles/aaron-video-gen/references/walkthrough-capture.md \
  /tiles/aaron-video-gen/scripts/walkthrough/ \
  /tiles/aaron-video-gen/remotion/src/projects/walkthrough-video/ \
  /tiles/aaron-video-gen/remotion/remotion.config.ts \
  /tiles/aaron-video-gen/remotion/tsconfig.json \
  /docs/demo-tools-macos.md
git checkout codex/demo-macos-distribution
python3 scripts/demo-tools/install.py
```

This public source checkout uses HTTPS and needs no GitHub token. If the company network blocks GitHub, use the company's approved network configuration. If the source directory already exists, use the update steps below instead of cloning over it.

The installer copies an explicit file allowlist to `~/.local/share/aaron-demo-tools/releases/<bundle-id>`, installs locked dependencies, installs the matching Playwright Chromium (headed and headless), prepares Remotion's browser, and verifies the result before activating it. It creates links under `~/.agents/skills` and the command `~/.local/bin/aaron-demo`. The source checkout can stay sparse; runtime commands use the installed copy.

Existing unrelated skills and commands are preserved. If a skill name already exists, the installer prints its path and stops before installing. Inspect that entry; move it to a backup location if you want this bundle to replace it, then rerun installation. Do not install both a legacy `~/.codex/skills` copy and a `~/.agents/skills` copy of the same skill.

## 3. Verify the complete chain

```bash
"$HOME/.local/bin/aaron-demo" doctor
"$HOME/.local/bin/aaron-demo" smoke
```

Expect `Demo tools ready` and `SMOKE PASSED`. The smoke check drives a real Chromium through a public, local example, renders a silent MP4 with captions and review stills, and builds a message page with an embedded screenshot. It contacts no client application and generates no paid narration. It prints the page, video, and report paths outside the source repository.

Open the printed `message.html` path in a browser and check the screenshot and video. This confirms installation; each real application's adapter, account, and environment still need their own validation.

## 4. Use the skills in Codex

Start a new Codex chat in the application project (for example your CF or ERP checkout). In the skill picker, confirm that `paste-ready-update`, `demo-capture`, and `walkthrough-video` appear. User skills and symlinked skill folders are supported by [Codex's local skill discovery](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills). If the picker has not refreshed, restart Codex and start a new chat.

Example request:

> Use $paste-ready-update to prepare an English update for Laura about the feature we just completed. Include screenshots and a short guided demo in Dev. Use the project's adapter, show the available walks, and film the changed behavior. Deliver the message page and MP4 for me to paste and attach in Teams.

To inspect or run the adapter from Terminal:

```bash
"$HOME/.local/bin/aaron-demo" capture --project "/absolute/path/to/app" --list
"$HOME/.local/bin/aaron-demo" capture sign-in --project "/absolute/path/to/app" --env dev
"$HOME/.local/bin/aaron-demo" capture --project "/absolute/path/to/app" --env dev --walk WALK_NAME
"$HOME/.local/bin/aaron-demo" render "/absolute/path/printed/by/capture" --stills
```

Replace the project path, environment, and walk with the values from that project's `--list`. A person signs in in the visible browser on this Mac; sign-in state is never transferred from another computer. Inspect every held-frame still and the end of each wait before delivering a real demo.

The shared engine expects `<project>/demo-capture/config.mjs` and `walks/*.mjs`. An existing `demo:capture` package script can still generate the same contract-1 folder for the renderer. Application adapters stay in their own repositories. CF and ERP adapters are not bundled here: fetch the reviewed project branch containing the intended walks. Replace machine-specific paths with `os.homedir()`, `os.tmpdir()`, or explicit project parameters before using an adapter on this Mac. The installer grants no permission to change project hosts, bypass read-only guards, or write to a production environment.

## 5. Optional narration

Silent videos require no API key. Narration uses the versioned ElevenLabs voice profile included in the bundle. Your ElevenLabs account must have access to that voice.

On macOS, store the key as a generic password named `elevenlabs-api-key` in Keychain Access. The renderer also accepts `ELEVENLABS_API_KEY` from the process environment. Enter the secret locally; do not put it in Git, screenshots, prompts, or installation logs. Keys and signed-in browser state are configured independently on each computer.

```bash
"$HOME/.local/bin/aaron-demo" render "/absolute/path/to/passed-run" --narrate --stills
"$HOME/.local/bin/aaron-demo" render "/absolute/path/to/passed-run" \
  --script "/absolute/path/to/passed-run/narration.json" --stills
```

Narration defaults to English and Aaron's approved voice at 1.15x speed. Existing included credits cover routine requested demo narration; a purchase, paid overage, or increased cap needs a budget decision. Narration clips are cached with the run. A language-only revision reuses the recording.

## 6. Update or roll back

Update the sparse source and rerun installation:

```bash
cd "$HOME/Tools/aaron-demo-source"
git pull --ff-only
python3 scripts/demo-tools/install.py
"$HOME/.local/bin/aaron-demo" smoke
```

The installer exports a new content-addressed release when bundled files change. It verifies the new release before switching the `current` link; previous releases stay on disk. Rerunning the same version rechecks it and does not reinstall its dependencies. A failed dependency download can be retried with the same command.

To roll back, choose a previous directory under `~/.local/share/aaron-demo-tools/releases` that contains a `READY` file, replace the `current` symlink with that directory, then run `doctor` and `smoke`. Existing skill and command links follow `current`. Keep the original installation directory stable; moving an installed release requires reinstalling because its Python virtual environment and launcher contain local executable paths.

## Troubleshooting

| Symptom | Action |
|---|---|
| Missing Node, Python, FFmpeg, or ffprobe | Complete step 1, then rerun installation. |
| Browser executable missing | Rerun installation. It uses the CLI from locked Playwright, as required by [Playwright's browser setup](https://playwright.dev/docs/browsers#install-browsers). |
| Skill not visible | Check `doctor`, inspect `~/.agents/skills`, then restart Codex. |
| No project adapter or walk | Fetch the appropriate application branch or have Codex create a project-scoped adapter. Installing tools does not create product-specific walks. |
| Guard refuses a host or request | Review the project's declared environment and approved rules; keep the guard enabled. |
| Login expired | Run `capture sign-in` locally and sign in yourself. |
| Narration has no key or voice access | Configure this Mac's key and confirm voice access in the intended ElevenLabs account. |
| Source file changed or installation incomplete | Rerun installation from the reviewed source revision; `doctor` names any mismatch. |
