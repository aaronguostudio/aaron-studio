import {readFileSync,writeFileSync,existsSync} from 'node:fs';
for(const f of ['.env','.baoyu-skills/.env'])if(existsSync(f))for(const l of readFileSync(f,'utf8').split(/\r?\n/)){const m=l.trim().match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'');}
const headers={'xi-api-key':process.env.ELEVENLABS_API_KEY};
const r=await fetch('https://api.elevenlabs.io/v1/voices',{headers});
if(!r.ok)throw new Error('Voice listing HTTP '+r.status);
const d=await r.json();const v=d.voices.map(v=>({id:v.voice_id,name:v.name,category:v.category,labels:v.labels,description:v.description}));writeFileSync('src/content/videos/visual-sound-design-2026-09-09/audio/available-voices.json',JSON.stringify(v,null,2));console.log(JSON.stringify(v.filter(v=>v.category==='premade').map(v=>({id:v.id,name:v.name,labels:v.labels})),null,2));
const text="Listen to that low hum. It isn't wind, and it isn't an engine hidden behind the dunes. It's sand. On some slopes, an avalanche of dry grains produces a deep, sustained note. Researchers brought singing sand into a laboratory, and it still sang. That gave them a way to ask a better question: what turns countless tiny collisions into one clear sound? The answer takes us from moving grains to vibrating air, and eventually to a surprisingly useful idea: a soft bag of particles that can become a robot's grip.";
const picked=['JBFqnCBsd6RMkjVDRZzb','hpp4J3VqNfWAUOO0d1Us','onwK4e9ZLuTAKqWW03F9'];
const manifest=[];writeFileSync('src/content/videos/visual-sound-design-2026-09-09/audio/script.txt',text);
for(let i=0;i<picked.length;i++){
 const voice=v.find(x=>x.id===picked[i]);const body={text,model_id:'eleven_multilingual_v2',voice_settings:{stability:.5,similarity_boost:.75,style:.25,use_speaker_boost:true,speed:1}};
 const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.id}?output_format=mp3_44100_192`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('TTS HTTP '+r.status);const name='ABC'[i];writeFileSync(`src/content/videos/visual-sound-design-2026-09-09/audio/${name}-raw.mp3`,Buffer.from(await r.arrayBuffer()));manifest.push({label:name,voice,request:body});console.log('Generated candidate '+name);
}
writeFileSync('src/content/videos/visual-sound-design-2026-09-09/audio/manifest.json',JSON.stringify(manifest,null,2));
