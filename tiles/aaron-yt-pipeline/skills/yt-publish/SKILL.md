---
name: yt-publish
description: Upload a finished video to YouTube with title, description, tags, and thumbnail. Supports resumable uploads and privacy control. Requires OAuth2 authentication for the intended channel. Use when user asks to "upload to YouTube", "publish video", "push to YouTube", "upload video", or "make video public".
---

# YouTube Publish

Upload a finished video to YouTube with metadata and thumbnail. Handles OAuth2 authentication, resumable upload, and privacy management.

## Output

| Result | Description |
|--------|-------------|
| YouTube URL | `https://youtu.be/{video-id}` |
| Upload status | Privacy setting (unlisted/public) |

## Prerequisites

- **YouTube OAuth2** must be set up (one-time). See Step 1.
- **YOUTUBE_CLIENT_ID** and **YOUTUBE_CLIENT_SECRET** in `.env`
- Scripts are at `${SKILL_DIR}/../../scripts/`

## Workflow

### Step 1: Check Authentication

```bash
npx -y bun ${SKILL_DIR}/../../scripts/youtube-auth.ts --check
```

| Result | Action |
|--------|--------|
| `AUTHENTICATED` | Verify the intended channel and required capabilities below |
| `TOKEN_EXPIRED` | Auto-refresh: `npx -y bun ${SKILL_DIR}/../../scripts/youtube-auth.ts --refresh`, then re-check channel identity |
| `NOT_AUTHENTICATED` | Guide user through setup (see Setup section below) |

**OAuth2 Setup (one-time):**

If not authenticated, explain to the user:

```
YouTube upload requires OAuth2 authentication (one-time setup):

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a project (or select existing)
3. Enable "YouTube Data API v3" in APIs & Services > Library
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Application type: Desktop application
6. Copy the Client ID and Client Secret
7. Add to your .env file:
   YOUTUBE_CLIENT_ID=your-client-id
   YOUTUBE_CLIENT_SECRET=your-client-secret
```

Then run the interactive setup:

```bash
npx -y bun ${SKILL_DIR}/../../scripts/youtube-auth.ts --setup
```

The script prints a Google consent URL and starts a local callback listener. The user completes consent in the correct browser profile; the browser returns to the loopback callback automatically. Keep the listener running. A callback page alone is not proof that token exchange succeeded: require CLI success and an authenticated channel read-back.

Before uploading:

- Read `channels.list(part=snippet,mine=true)` with the active token and compare channel ID and handle with the intended destination. Email, browser profile name, and `AUTHENTICATED` alone do not establish the channel.
- If automatic browser opening chooses the wrong profile, give the printed consent link to the user to open in the correct profile. Do not repeatedly open the wrong account. Never include tokens or client secrets in handoff text.
- On `invalid_grant`, stop retrying refresh and run consent again only when needed. Refresh does not add permissions.
- Decide whether selectable captions are part of delivery **before consent**. The current setup script does not request `youtube.force-ssl`; caption insertion requires that scope (or the applicable partner scope). Add the required scope to the setup request before reauthorization when captions are required; do not claim upload authentication proves caption access. Check the [official caption insertion requirements](https://developers.google.com/youtube/v3/docs/captions/insert). Burned-in subtitles and selectable caption tracks are separate deliverables.

### Step 2: Load Video and Metadata

**Find the video project directory.** If the user specifies a path, use it. Otherwise, read the package state and use its approved canonical video pointer. Never choose a version by modification time or assume `video.mp4` / `final.mp4` is the latest approved render. Record the selected path, duration, and SHA-256 before uploading.

Required files:
- `src/videos/YYYY-MM-DD-{slug}/final.mp4` — the video
- `src/videos/YYYY-MM-DD-{slug}/metadata.yaml` — title, description, tags

Optional files:
- `src/videos/YYYY-MM-DD-{slug}/assets/thumbnail.png` — custom thumbnail

Read `metadata.yaml` and display what will be uploaded.

If the description links back to a blog article, verify the URL is UTM-tagged.
Use the shared helper before upload when needed:

```bash
node scripts/blog-growth.mjs utm-url \
  --url <blog-url> \
  --channel youtube \
  --campaign <slug> \
  --content description
```

### Step 3: Preview and Approval Gate

Present the upload details:

```
YouTube Upload Preview:

Title: "[Video Title]"
Description: [First 2 lines of description]...
Tags: [comma-separated tags]
Category: Science & Technology
Privacy: unlisted
Thumbnail: [yes/no]

File: final.mp4 ([size] MB, [duration])
```

If the user has already approved publication of this package, continue within that authorization. Otherwise present the concrete preview and ask for approval. A request to draft social copy does not authorize posting it. Revisit approval only for a material change outside the approved scope.

### Step 4: Upload

```bash
npx -y bun ${SKILL_DIR}/../../scripts/youtube-upload.ts \
  --video src/videos/YYYY-MM-DD-{slug}/final.mp4 \
  --metadata src/videos/YYYY-MM-DD-{slug}/metadata.yaml \
  --thumbnail src/videos/YYYY-MM-DD-{slug}/assets/thumbnail.png \
  --privacy unlisted
```

Report progress: the upload script will print progress and the final YouTube URL.

### Step 5: Finalize and Verify

Persist the returned video ID and URL in package state immediately. After a timeout or ambiguous upload result, inspect that video or the channel before retrying; avoid creating a duplicate upload. The script uses the resumable protocol but does not persist a resumable checkpoint across restarts.

When public publication is already authorized, finalize without asking again:

```bash
npx -y bun ${SKILL_DIR}/../../scripts/youtube-upload.ts --make-public {video-id}
```

Read back the actual video through the API and check the public watch page. Verify channel ID, title, description links, processing status, privacy, and custom thumbnail. CLI success or a requested privacy value is not evidence of public availability. Report processing or access restrictions as pending rather than complete.

Verify caption delivery separately. If selectable captions were promised, confirm the track exists; if only burned-in captions are present, record that limitation explicitly. The upload CLI does not insert caption tracks. Resolve any applicable synthetic-media disclosure using the current platform requirements before finalizing metadata.

Record the canonical file/hash, channel ID, video ID, verified privacy/processing state, caption status, and URL in package state. Update the blog video link through the normal `main` publishing workflow when in scope.

### Step 6: Cross-Promotion (Optional)

Prepare requested LinkedIn or other social drafts from the approved article and actual published URL. Send or publish only when explicitly authorized. Keep drafts distinct from published channel posts in distribution records.

Report the URL and verified state, plus any remaining delivery limitation.

## Notes

- Always default to "unlisted" for initial upload — this lets the user review the video on YouTube before making it public.
- Thumbnail upload requires the YouTube account to be verified (phone verification).
- Category "28" is "Science & Technology" — can be changed in metadata.yaml.
- Blog links in YouTube descriptions should use `utm_source=youtube`,
  `utm_medium=video`, `utm_campaign=<slug>`, and
  `utm_content=description`.
- The OAuth2 tokens are stored at `~/.aaron-skills/aaron-yt-pipeline/youtube-tokens.json` and auto-refresh. Re-authentication should rarely be needed.
- If the user asks to "make a video public" without uploading, use the `--make-public` flag with the video ID.
