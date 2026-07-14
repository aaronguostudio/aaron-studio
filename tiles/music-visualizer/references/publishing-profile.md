# Publishing Profile

## Visual And Sound

- Channel: `Visual And Sound`
- Handle: `@visual-and-sound`
- Use this channel for study music, ambient work sessions, lo-fi wave, coffee
  music, and authored music visualizers.

## Upload protocol

1. Check OAuth authentication.
2. Verify the authenticated channel title and handle before uploading.
3. Prepare the 4K MP4, thumbnail, YAML metadata, and local upload record.
4. Present the title, privacy, file size, duration, category, and thumbnail for
   confirmation.
5. Default to `unlisted`; only make public after an explicit request.
6. Do not schedule recurring uploads until the user explicitly chooses a
   cadence, timezone, start time, and whether each item should be unlisted or
   public.

Never store OAuth client secrets or tokens in the skill. Keep account selection
as a runtime authentication step because the user may maintain several YouTube
channels.
