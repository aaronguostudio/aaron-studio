import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
for(const f of ['.env','.baoyu-skills/.env'])if(existsSync(f))for(const l of readFileSync(f,'utf8').split(/\r?\n/)){const m=l.trim().match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'');}
const p='src/content/videos/visual-sound-full-2026-09-10',segments=JSON.parse(readFileSync(p+'/script-segments.json','utf8')),voice='nPczCjzI2devNBz1zQrb';const manifest=[];
for(let i=0;i<segments.length;i++){
 const s=segments[i],body={text:s.text,model_id:'eleven_multilingual_v2',voice_settings:{stability:.55,similarity_boost:.75,style:0,use_speaker_boost:true,speed:1},...(i?{previous_text:segments[i-1].text}:{}),...(i<segments.length-1?{next_text:segments[i+1].text}:{})};
 const file=p+'/audio/'+s.id;
 if(!existsSync(file+'.json')){
  const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_192`,{method:'POST',headers:{'xi-api-key':process.env.ELEVENLABS_API_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok)throw new Error('TTS HTTP '+r.status+' for '+s.id);
  const d=await r.json();writeFileSync(file+'.mp3',Buffer.from(d.audio_base64,'base64'));delete d.audio_base64;writeFileSync(file+'.json',JSON.stringify(d));
 }
 manifest.push({id:s.id,voice_id:voice,author_approved_label:'F',request:body,file:'audio/'+s.id+'.mp3',sha256:createHash('sha256').update(readFileSync(file+'.mp3')).digest('hex')});console.log('Ready '+s.id);
 writeFileSync(p+'/audio-generation-manifest.json',JSON.stringify({provider:'ElevenLabs',voice_id:voice,voice_name:'Brian',language:'en-US',author_approved:true,segments:manifest},null,2));
}
