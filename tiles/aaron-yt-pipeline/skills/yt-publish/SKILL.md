---
name: yt-publish
description: Upload a finished video to YouTube with title, description, tags, and thumbnail. Supports resumable uploads and privacy control. Requires OAuth2 authentication (one-time setup). Use when user asks to "upload to YouTube", "publish video", "push to YouTube", "upload video", or "make video public".
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
| `AUTHENTICATED` | Proceed to Step 2 |
| `TOKEN_EXPIRED` | Auto-refresh: `npx -y bun ${SKILL_DIR}/../../scripts/youtube-auth.ts --refresh`, then proceed |
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

This opens a browser URL for Google consent. The user pastes the authorization code back into the terminal.

### Step 2: Load Video and Metadata

**Find the video project directory.** If the user specifies a path, use it. Otherwise, look for the most recent `src/videos/*/final.mp4` file.

Required files:
- `src/videos/YYYY-MM-DD-{slug}/final.mp4` — the video
- `src/videos/YYYY-MM-DD-{slug}/metadata.yaml` — title, description, tags

Optional files:
- `src/videos/YYYY-MM-DD-{slug}/assets/thumbnail.png` — custom thumbnail

Read `metadata.yaml` and display what will be uploaded.

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

Use `AskUserQuestion`:

| Q | Question | Options |
|---|----------|---------|
| Q1 | Ready to upload? | Upload as unlisted (recommended — review before making public), Upload as public (immediately visible), Edit metadata first, Cancel |

If "Edit metadata first", let the user describe what to change, update `metadata.yaml`, and re-confirm.

### Step 4: Upload

```bash
npx -y bun ${SKILL_DIR}/../../scripts/youtube-upload.ts \
  --video src/videos/YYYY-MM-DD-{slug}/final.mp4 \
  --metadata src/videos/YYYY-MM-DD-{slug}/metadata.yaml \
  --thumbnail src/videos/YYYY-MM-DD-{slug}/assets/thumbnail.png \
  --privacy unlisted
```

Report progress: the upload script will print progress and the final YouTube URL.

### Step 5: Post-Upload

Report the result:

```
Upload Complete!

URL: https://youtu.be/{video-id}
Status: unlisted
Title: "[Video Title]"

The video is processing on YouTube. It may take a few minutes before it's fully available.
```

If the video was uploaded as unlisted, ask:

Use `AskUserQuestion`:

| Q | Question | Options |
|---|----------|---------|
| Q1 | Make the video public now? | Make public now, Keep unlisted for now — I'll review first |

If making public:

```bash
npx -y bun ${SKILL_DIR}/../../scripts/youtube-upload.ts --make-public {video-id}
```

### Step 6: Cross-Promotion (Optional)

After successful upload, suggest cross-promotion:

```
Video published! You can now promote it:

- /baoyu-post-to-x — Share on X/Twitter with the YouTube link
- Manually share on LinkedIn, newsletter, etc.
```

**Print final summary:**

```
YouTube Publish Complete!

URL: https://youtu.be/{video-id}
Status: [public/unlisted]
Title: "[Video Title]"
```

## Notes

- Always default to "unlisted" for initial upload — this lets the user review the video on YouTube before making it public.
- The upload uses YouTube's resumable upload protocol, which handles large files and can resume interrupted uploads.
- Thumbnail upload requires the YouTube account to be verified (phone verification).
- Category "28" is "Science & Technology" — can be changed in metadata.yaml.
- The OAuth2 tokens are stored at `~/.aaron-skills/aaron-yt-pipeline/youtube-tokens.json` and auto-refresh. Re-authentication should rarely be needed.
- If the user asks to "make a video public" without uploading, use the `--make-public` flag with the video ID.
