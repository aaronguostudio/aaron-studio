import {readFileSync,writeFileSync,existsSync} from 'node:fs';
for(const f of ['.env','.baoyu-skills/.env'])if(existsSync(f))for(const l of readFileSync(f,'utf8').split(/\r?\n/)){const m=l.trim().match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'');}
const headers={'xi-api-key':process.env.ELEVENLABS_API_KEY};
const r=await fetch('https://api.elevenlabs.io/v1/voices',{headers});
if(!r.ok)throw new Error('Voice listing HTTP '+r.status);
const d=await r.json();const v=d.voices.map(v=>({id:v.voice_id,name:v.name,category:v.category,labels:v.labels,description:v.description}));writeFileSync('src/content/videos/visual-sound-refinement-2026-09-09/audio/available-voices.json',JSON.stringify(v,null,2));console.log(JSON.stringify(v.filter(v=>v.category==='premade').map(v=>({id:v.id,name:v.name,labels:v.labels})),null,2));
const text="Some sand dunes make a low, steady sound when dry sand slides down their slopes. If you were standing nearby, you might feel the vibration as well as hear it. Researchers have taken singing sand into the lab to find out what is happening. They can compare grain sizes, change the flow, and measure the sound. There is still more than one explanation for parts of the process. And that is what makes it interesting. Something as ordinary as sand can behave in ways we would never expect, once enough grains begin to move together.";
const picked=['cjVigY5qzO86Huf0OWal','CwhRBWXzGAHq8TQ4Fs17','nPczCjzI2devNBz1zQrb'];
const manifest=[];writeFileSync('src/content/videos/visual-sound-refinement-2026-09-09/audio/script.txt',text);
for(let i=0;i<picked.length;i++){
 const voice=v.find(x=>x.id===picked[i]);if(voice.labels.accent!=="american")throw new Error("Candidate must be American English");const body={text,model_id:'eleven_multilingual_v2',voice_settings:{stability:.55,similarity_boost:.75,style:0,use_speaker_boost:true,speed:1}};
 const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.id}?output_format=mp3_44100_192`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('TTS HTTP '+r.status);const name='DEF'[i];writeFileSync(`src/content/videos/visual-sound-refinement-2026-09-09/audio/${name}-raw.mp3`,Buffer.from(await r.arrayBuffer()));manifest.push({label:name,voice,request:body});console.log('Generated candidate '+name);
}
writeFileSync('src/content/videos/visual-sound-refinement-2026-09-09/audio/manifest.json',JSON.stringify(manifest,null,2));
