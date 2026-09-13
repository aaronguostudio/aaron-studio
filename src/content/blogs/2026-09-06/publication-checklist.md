# Publication — 2026-09-06

- Author approved v7 and explicitly authorized publication.
- Canonical video: video-v7.mp4 (8:32.8, 1920×1080); existing approved thumbnail and v7 English SRT retained.
- Scoped bilingual link validation: pass, 20 links.
- Fresh static build: pass, 1250 routes.
- Blog PR: https://github.com/aaronguostudio/aaronguoblog/pull/15
- YouTube token refresh: invalid_grant; reauthorization opened and pending.
- Two new Lyria cues have generation manifests; reviewed Gemini API terms https://ai.google.dev/gemini-api/terms (generated-content section).
- Paper Moon has a local-audio manifest only; author source clarification pending.
- YouTube synthetic-music disclosure required: https://support.google.com/youtube/answer/14328491 ; set containsSyntheticMedia=true before making video public.
- No video uploaded yet.

## Blog release verified

Published both languages at 2026-09-06T19:33:43.717Z through Git-triggered main revision 0ca4093629634e20c3b712a473ef9b594bb79993. Production deployment READY; www.aaronguo.com alias belongs to that deployment. Both pages have the expected H1, canonical URL, one cover and four body images. All five image bytes match committed files. CI: 41 test files / 248 tests passed, lint and generate passed. See production-deployment.json and live-verification.json.

Growth database: content ingest succeeded (100 statements, 101 results); English and Chinese blog channel registrations succeeded (2 statements, 3 results). YouTube OAuth final check remains TOKEN_EXPIRED; callback listener remains open for user reauthorization.

## Cover update and video release confirmation

User requested DHH portrait as blog cover and confirmed YouTube publication is fine. The legacy music question is resolved by author attestation; do not ask it again or claim independent provider verification. Current upload blocker is account identity/login only. Chrome account aaronguostudio@gmail.com exposes Aaron - Drum / @drumnext (UCO_h81XNKntuUxUrem8gj1g), not a confirmed blog-video channel. A separate Google login is open in the YouTube Studio tab. No upload has been started.

Cover PR #16 merged at 2026-09-06T19:42:10Z, main eeec1a3ae1361e1632fa785f368c90e209e4ed8b. CI and preview passed; production verification pending.

Cover release verified: main eeec1a3a / Git deployment dpl_EG647onKcyUfSmsSN1pkLmZdNKfQ READY, www.aaronguo.com alias verified. Both article pages have four images with a single DHH portrait cover and correct OG image. Chinese homepage card also uses the portrait; browser page title and layout checked. Growth catalog refreshed successfully. See cover-live-verification.json.

## YouTube published

Video https://youtu.be/KUQ5cKVK8R8 published to verified channel UC00lw_bsmcXk7Dxuk_QqBTg / @ai-native-builder. Approved v7 SHA-256 matched. API reports public, processed, HD, embeddable and custom thumbnail present; unauthenticated oEmbed confirms title and channel. English audio language, chapters and synthetic-media disclosure submitted. Growth channel registration succeeded.

Closed-caption track upload failed with ACCESS_TOKEN_SCOPE_INSUFFICIENT: current OAuth includes youtube, youtube.upload and yt-analytics.readonly; captions API requires youtube.force-ssl. The approved video already contains burned-in English subtitles. Native Studio fallback reached the correct Arron Chrome profile and video Languages page, but exposed only the navigation menu; screenshot unavailable. No subtitle file was uploaded. Do not claim separate captions are present.

## Final release verification

Blog video links released through PR #17, base main, commit 71f91582911641b97a05036a331101019e85a985. Git-triggered deployment dpl_2ctsjVX1KH5TcAg6zNBuKaFNYnc7 is READY and serves www.aaronguo.com. Both language pages render links to KUQ5cKVK8R8. Content ingest refreshed successfully. Core blog and video publication completed; only the separate caption-track limitation remains.
