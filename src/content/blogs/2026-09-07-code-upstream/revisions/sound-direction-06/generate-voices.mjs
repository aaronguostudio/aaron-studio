import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=process.cwd();
for(const line of fs.readFileSync(path.join(root,'.env'),'utf8').split(/\r?\n/)) {
  const m=line.match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);
  if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'');
}
const key=process.env.ELEVENLABS_API_KEY;
if(!key)throw new Error('ElevenLabs key not configured');
const source=fs.readFileSync(path.join(dir,'../../youtube-script.md'),'utf8');
const paragraphs=source.split(/^## /m).slice(-2).map(s=>s.slice(s.indexOf('\n')).trim());
const plain=paragraphs.join('\n\n');
fs.writeFileSync(path.join(dir,'locked-script.txt'),plain+'\n');
const directed=plain.replace('real needs.','real needs. <break time="0.7s" />').replace('adopt the result.','adopt the result. <break time="1.0s" />').replace('by then.','by then. <break time="0.6s" />');
const guide='[thoughtful] '+paragraphs[0]+'\n\n[hopeful] '+paragraphs[1].replace('Stronger tools','[confident] Stronger tools');
const jobs=[
 {id:'pvc-directed',voice:'R2DWp7zZuWmGxk3r8GIA',body:{text:directed,model_id:'eleven_multilingual_v2',seed:607,voice_settings:{stability:0.4,similarity_boost:0.8,style:0.56,use_speaker_boost:true,speed:1}}},
 {id:'commercial-guide',voice:'JBFqnCBsd6RMkjVDRZzb',body:{text:guide,model_id:'eleven_v3',seed:607,voice_settings:{stability:0.5,similarity_boost:0.75,speed:1}}}
];
const strip=t=>t.replace(/<[^>]+>/g,'').replace(/\[[^\]]+\]/g,'').replace(/\s+/g,' ').trim();
for(const job of jobs){
 if(strip(job.body.text)!==strip(plain))throw new Error('Audition changed spoken words');
 const out=path.join(dir,job.id+'-raw.mp3');
 if(fs.existsSync(out)){console.log('Preserved existing',job.id);continue;}
 fs.writeFileSync(path.join(dir,job.id+'.request.json'),JSON.stringify(job,null,2));
 const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${job.voice}?output_format=mp3_44100_192`,{method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json'},body:JSON.stringify(job.body),signal:AbortSignal.timeout(180000)});
 if(!r.ok)throw new Error(`${job.id}: ${r.status} ${(await r.text()).slice(0,400)}`);
 fs.writeFileSync(out,Buffer.from(await r.arrayBuffer()));
 fs.writeFileSync(path.join(dir,job.id+'.generation.json'),JSON.stringify({id:job.id,generatedAt:new Date().toISOString(),requestId:r.headers.get('request-id'),voice:job.voice,model:job.body.model_id,output:out},null,2));
 console.log('Generated',job.id);
}
const out=path.join(dir,'aaron-performance-transfer-raw.mp3');
if(!fs.existsSync(out)){
 const form=new FormData();
 form.append('audio',new Blob([fs.readFileSync(path.join(dir,'commercial-guide-raw.mp3'))],{type:'audio/mpeg'}),'guide.mp3');
 form.append('model_id','eleven_multilingual_sts_v2');
 form.append('voice_settings',JSON.stringify({stability:0.5,similarity_boost:0.8,style:0,use_speaker_boost:true}));
 form.append('seed','607');
 const r=await fetch('https://api.elevenlabs.io/v1/speech-to-speech/R2DWp7zZuWmGxk3r8GIA?output_format=mp3_44100_192',{method:'POST',headers:{'xi-api-key':key},body:form,signal:AbortSignal.timeout(180000)});
 if(!r.ok)throw new Error(`Voice Changer: ${r.status} ${(await r.text()).slice(0,400)}`);
 fs.writeFileSync(out,Buffer.from(await r.arrayBuffer()));
 fs.writeFileSync(path.join(dir,'aaron-performance-transfer.generation.json'),JSON.stringify({generatedAt:new Date().toISOString(),provider:'ElevenLabs',model:'eleven_multilingual_sts_v2',voice:'R2DWp7zZuWmGxk3r8GIA',guide:'commercial-guide-raw.mp3',requestId:r.headers.get('request-id'),status:'candidate - author identity evaluation required'},null,2));
 console.log('Generated Aaron performance transfer');
}
