---
name: demo-capture
description: Use when someone wants a walkthrough video, or step-by-step screenshots, of a web app recorded by driving it in a real browser, and the project has (or should get) a demo-capture/config.mjs. It records one of the project's scripted walks into a capture folder that the aaron-video-gen walkthrough renderer turns into an mp4. paste-ready-update calls it to attach a video to a message.
---

# Demo capture

The engine drives a real browser through one of a project's scripted walks and writes a capture folder (contract 1, `../aaron-video-gen/references/walkthrough-capture.md`). The renderer beside this tile turns a passed capture into a captioned mp4.

Nothing app-specific lives here. A project joins with a `demo-capture/` folder holding `config.mjs` and `walks/*.mjs`, with no `package.json` and no dependencies of its own.

## Run it

This skill is usually reached through a symlink, so resolve its real directory first:

```bash
ENGINE=$(python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' <skill-dir>)
node "$ENGINE/scripts/cli.mjs" --project <dir> --list                  # walks, environments, params
node "$ENGINE/scripts/cli.mjs" sign-in --project <dir> --env <env>     # a person signs in; nothing is recorded
node "$ENGINE/scripts/cli.mjs" --project <dir> --env <env> --walk <walk> [--set key=value] [--out <dir>] [--headed]
node "$ENGINE/scripts/cli.mjs" --project <dir> --env <env> --walk <walk> --learn-hosts
npx -y bun "$ENGINE/../aaron-video-gen/scripts/walkthrough/render-walkthrough.ts" <run folder>
```

| Flag | Meaning |
|---|---|
| `--project <dir>` | the folder that holds `demo-capture/config.mjs`; default: the current folder |
| `--list` | print the walks (read-only or writes), the environments and the gate each one has, and the params. Needs no `--env` and opens no browser. |
| `--env <env>` | required, no default: an environment the config declares |
| `--walk <walk>` | required to run: a file in `demo-capture/walks/`, without `.mjs`. `sign-in` takes none. |
| `--set key=value` | a param the config declares; repeat it for several. Split at the first `=`; a key given twice, or one the config does not declare, is refused. |
| `--out <dir>` | the run folder, instead of the default below. It must be empty or new, may not be inside a git repo, and may not overlap the session folder. |
| `--headed` | show the browser while recording |
| `--learn-hosts` | see Hosts |
| `--prod-go-ahead`, `--write-go-ahead` | see Go-ahead |
| `--help`, `-h` | print the usage |

- A run prints its folder, `~/.demo-capture/<project>/runs/<yyyymmdd-hhmmss>-<walk>/` unless `--out` set another (`<project>` is the config's `name`): `Captured: <folder>` when it passed, `FAILED: <folder>` with the step and the reason when it did not. Read `capture.json` there:
  - `status: "passed"`: render it.
  - `status: "failed"`: the renderer refuses any capture that is not passed, so there is no video to send, though the folder may still hold a raw `video.webm`. Say which step failed (`failedStep`, null when it failed before the first step) and why (`failure`), in plain words.
- Exit codes:
  - 0: captured. A `--learn-hosts` run that reached the end of its walk also exits 0, even though its `capture.json` says `failed`.
  - 1: the walk failed. A `--learn-hosts` run that stopped early also exits 1, and its lists may be incomplete.
  - 2: refused. Nothing was captured, and the reason is one plain sentence on stderr: bad arguments, a missing go-ahead, a held run lock, a browser that will not start, a sign-in that did not finish.
- If the CLI says its dependency is missing, ask the user before running `npm ci` in `$ENGINE`. Chromium comes from the machine's Playwright cache; never run `npx playwright install`.

## Rules

- **Sign-in is always the person's.** The first run of an environment, `sign-in`, and a run that finds the saved session signed out each open a visible browser at the app's sign-in page, and the person signs in there. Never type credentials and never ask for them. Signed in means the page is back on the app's own origin and `isSignedOut` has been false for 3 seconds; it gives up after 10 minutes. After a signed-out run the engine deletes the old session, empties the run folder, and records the walk again from the start. The session is kept in `~/.demo-capture/<project>/<env>/state.json` (folder 0700, file 0600), outside every repo. Never print, copy or upload it.
- **Go-ahead.** Add a go-ahead flag only after the person's go-ahead in chat for that run, every run, even if they approved an earlier one.
  - A production environment needs `--prod-go-ahead` on every walk run. That one flag also covers a walk that writes: there is no second flag in production. When you ask for it, say whether the walk writes (`--list` shows it).
  - In another environment whose config sets `writeGoAhead: true`, a walk that writes needs `--write-go-ahead`.
  - `sign-in` needs no go-ahead, even in production: nothing is recorded, and a person drives it.
  - `--learn-hosts` is refused on a production environment and for a walk that writes.
- **Hosts.** Every request must go to a host in the environment's `hosts`; any other request fails the run.
  - Outside learning runs, the browser's resolver refuses every name that is not in `hosts`. That includes IP literals such as `127.0.0.1` and `localhost`. List every host the app uses, exactly as it appears in URLs: the app's own, its API, its asset and font hosts, its identity provider.
  - In contract 1, `hosts` entries are bare host names with no port. A bare name matches any port.
  - A redirect to an unlisted identity-provider host fails the run as a host-lock violation. List the provider's host; `--learn-hosts` finds it. The sign-in window itself is not host-locked, so a sign-in that works does not show that the provider is listed.
  - `--learn-hosts` runs a read-only walk with the lock lifted for reads. It lists the hosts the walk used that are not in `hosts`, and the requests it refused because the walk is read-only. Its `capture.json` says `failed` ("Learning run, no video."), so there is nothing to render. For its exit code, see Exit codes.
  - Add a host to the config only after the person approves it.
- **Read-only walks** (`writes: false`, the default) may only read: GET, HEAD and OPTIONS. Any other method fails the run, and so does a read the project lists in `readOnlyForbidden`. This covers the whole run, `setup` and `beforeStep` included.
- **One run at a time** per project and environment; `sign-in` takes the same lock. A second run is refused (exit 2) and told which lock file to delete if no run is going: `~/.demo-capture/<project>/<env>/lock`. Wait for the other run, or check that none is going and then delete that file. A lock left by a run that died is cleared by the next run.
- **Run folders stay outside every repo.** They show real screens: never move one into a repo.

## Add a project

`<project>/demo-capture/config.mjs`. A field this table does not name is refused.

| Field | Required | Meaning |
|---|---|---|
| `contract` | yes | `1` |
| `name` | yes | `[a-z0-9-]+`; names the session and run folders |
| `environments.<env>` | yes | `{ url, production, hosts, writeGoAhead? }`. `<env>` is `[a-z0-9-]+` and not `runs`. `url` is http(s) with no credentials, query or fragment. `production` is `true` or `false`, with no default. `hosts` follows the Hosts rule, its own host included. `writeGoAhead: true` makes a write walk there need `--write-go-ahead`. |
| `signInPath` | yes | where the person signs in, starting with `/` and not `//`, for example `/login` |
| `isSignedOut(url)` | yes | true when the page URL means signed out |
| `params` | no | `{ <name>: { default, describe } }`, both strings, set per run with `--set <name>=<value>` |
| `readOnlyForbidden` | no | `[{ method, url: RegExp }]`: reads that write. `method` is GET, HEAD, OPTIONS, POST, PUT, PATCH or DELETE; `url` is searched for in the full request URL. |
| `sameTabLinks` | no | `true`: links that would open a new tab open in this one while recording. Without it, a second tab fails the run. |
| `setup({ page, params, baseUrl })` | no | runs after the start page loads, before the first step; not in the rendered video |
| `beforeStep({ page, params, stepId })` | no | runs before every step; throw to stop the run |
| `revision({ baseUrl })` | no | the app's build, stored as `appRevision`; `unknown` when it is missing, throws, or takes over 10 seconds |

`<project>/demo-capture/walks/<name>.mjs`:

```js
export default {
  title: 'Short title for the title card',
  description: 'Optional subtitle; --list shows it',
  writes: false,
  startPath: '/path',
  async run({ page, rec, params, baseUrl }) {
    await rec.step('open', 'Caption shown in the video', 'action', async () => {
      await rec.click(page.getByRole('button', { name: 'Open' }))
    })
  },
}
```

- `title` and `run` are required. `writes` defaults to `false` and `startPath` to `/`. A field not shown above is refused.
- `rec.step(id, caption, 'action' | 'wait', fn)` defines a step. Ids are unique within a walk. A `wait` step is fast-forwarded in the video.
- `rec.click(locator)` and `rec.type(locator, text)` log the click for the drawn cursor and work only inside a step. `rec.type` refuses a password field.
- Find elements by their visible labels (`getByRole`, `getByText`). Set data up through the app's own UI, inside steps.
- Every top-level `walks/*.mjs` is a walk, named in lowercase letters, digits and dashes, and `--list` loads them all, so a helper left there breaks `--list` too. Put shared helpers in a subfolder such as `walks/lib/`, or outside `walks/`.

## Develop

In this tile: `npm ci`, then `npm run test:unit`, `npm run test:e2e` (needs ffprobe and npx) or `npm test` for both, and `npm run mutation-check`. `DEMO_CAPTURE_HOME` replaces `~/.demo-capture`; the tests use it.
