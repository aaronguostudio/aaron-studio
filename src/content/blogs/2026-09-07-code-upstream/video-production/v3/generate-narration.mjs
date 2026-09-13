import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)),pkg=path.resolve(dir,'../..');
for(const line of fs.readFileSync('.env','utf8').split(/\r?\n/)){const m=line.match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'');}
const key=process.env.ELEVENLABS_API_KEY;if(!key)throw new Error('ElevenLabs API key is not configured');
const source=fs.readFileSync(path.join(pkg,'youtube-script.md'),'utf8');
const sections=source.split(/^## /m).slice(1).map((s,i)=>({id:i,title:s.slice(0,s.indexOf('\n')).trim(),text:s.slice(s.indexOf('\n')).trim()}));
if(sections.length!==16)throw new Error('Expected the approved sixteen sections');
const selection=JSON.parse(fs.readFileSync(path.join(pkg,'revisions/sound-direction-06/pvc-directed.request.json'),'utf8'));
const breaks={0:['That judgment stayed with me.',.6],1:['They cannot tell us what any individual contributed.',.7],2:['deciding which idea deserves the effort becomes more valuable.',.7],3:['a result they don\'t trust.',.65],4:['whether they can finish the original task.',.55],5:['worth that disruption.',.6],6:['progress depends on the connections across the work.',.7]};
const chunks=[];
for(let i=0;i<8;i++){
 const pair=sections.slice(i*2,i*2+2),text=pair.map(s=>s.text).join('\n\n'),id=`chunk-${String(i).padStart(2,'0')}`;
 let directed=text;if(breaks[i]){const [phrase,seconds]=breaks[i];if(!text.includes(phrase))throw new Error('Missing pause anchor '+phrase);directed=directed.replace(phrase,`${phrase} <break time="${seconds}s" />`);}
 const output=path.join(dir,id+'-raw.mp3');const spec={id,sections:pair.map(s=>s.id),text,voice:selection.voice,model:selection.body.model_id,settings:selection.body.voice_settings,source:'new-generation'};
 if(i===7){
  const approved=path.join(pkg,'revisions/sound-direction-06/pvc-directed-raw.mp3');fs.copyFileSync(approved,output);spec.source='exact-reuse-of-author-selected-voice-B';spec.request='../../revisions/sound-direction-06/pvc-directed.request.json';
 }else if(!fs.existsSync(output)){
  const body={...selection.body,text:directed,previous_text:sections.slice(Math.max(0,i*2-2),i*2).map(s=>s.text).join('\n\n'),next_text:sections.slice(i*2+2,i*2+4).map(s=>s.text).join('\n\n')};
  const strip=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();if(strip(body.text)!==strip(text))throw new Error('Spoken text changed');
  fs.writeFileSync(path.join(dir,id+'.request.json'),JSON.stringify({voice:selection.voice,...body},null,2));
  const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selection.voice}/with-timestamps?output_format=mp3_44100_192`,{method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(180000)});
  if(!r.ok)throw new Error(`TTS ${id}: ${r.status} ${(await r.text()).slice(0,400)}`);
  const j=await r.json();if(!j.audio_base64)throw new Error('No audio returned');fs.writeFileSync(output,Buffer.from(j.audio_base64,'base64'));delete j.audio_base64;
  fs.writeFileSync(path.join(dir,id+'.alignment.json'),JSON.stringify(j));console.log('Generated',id);
 }
 spec.sha256=crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex');chunks.push(spec);
}
fs.writeFileSync(path.join(dir,'voice-plan.json'),JSON.stringify({version:3,scope:'current-video; author-selected B',voiceProfile:'aaron-pvc-directed-code-upstream-v1',sections,chunks,scriptSha256:crypto.createHash('sha256').update(source).digest('hex'),createdAt:new Date().toISOString()},null,2));
console.log('All eight narration blocks ready; approved closing reused.');
