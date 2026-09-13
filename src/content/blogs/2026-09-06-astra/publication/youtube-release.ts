import { getAccessToken } from '../../../../../tiles/aaron-yt-pipeline/scripts/youtube-auth.ts';
import { writeFileSync } from 'node:fs';

const id = '_12kx0AFhCM';
const expectedChannel = 'UC00lw_bsmcXk7Dxuk_QqBTg';
const token = await getAccessToken();
const mode = process.argv[2] || 'inspect';
async function api(path: string, body?: unknown) {
  const r = await fetch(`https://www.googleapis.com/youtube/v3/${path}`, {
    method: body ? 'PUT' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await r.json();
  if (!r.ok) throw new Error(JSON.stringify({ status: r.status, error: result.error }));
  return result;
}
const channels = await api('channels?part=snippet&mine=true');
if (!channels.items?.some((c: any) => c.id === expectedChannel)) throw new Error('Authenticated channel mismatch');
const query = `videos?part=snippet,status,contentDetails,processingDetails&id=${id}`;
let video = (await api(query)).items?.[0];
if (video?.snippet.channelId !== expectedChannel) throw new Error('Video channel mismatch');
if (mode === 'configure' || mode === 'publish') {
  if (mode === 'publish' && video.processingDetails?.processingStatus !== 'succeeded') throw new Error('Processing is not complete');
  const snippet = Object.fromEntries(['title', 'description', 'tags', 'categoryId'].map(k => [k, video.snippet[k]]));
  const updated = await api('videos?part=snippet,status', {
    id,
    snippet: { ...snippet, defaultLanguage: 'en', defaultAudioLanguage: 'en' },
    status: {
      privacyStatus: mode === 'publish' ? 'public' : 'unlisted',
      selfDeclaredMadeForKids: false,
      containsSyntheticMedia: true,
      embeddable: true,
      publicStatsViewable: true,
      license: 'youtube',
    },
  });
  writeFileSync(new URL(`youtube-${mode}-update-response.json`, import.meta.url), JSON.stringify(updated, null, 2) + '\n');
  video = (await api(query)).items[0];
}
writeFileSync(new URL(`youtube-${mode}.json`, import.meta.url), JSON.stringify({ checkedAt: new Date().toISOString(), video }, null, 2) + '\n');
console.log(JSON.stringify({ id: video.id, channel: video.snippet.channelTitle, title: video.snippet.title, language: video.snippet.defaultLanguage, audioLanguage: video.snippet.defaultAudioLanguage, status: video.status, duration: video.contentDetails.duration, definition: video.contentDetails.definition, processing: video.processingDetails?.processingStatus, thumbnail: video.snippet.thumbnails?.maxres || video.snippet.thumbnails?.high }, null, 2));
