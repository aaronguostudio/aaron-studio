import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
for(const line of fs.readFileSync('.env','utf8').split(/\r?\n/)){const m=line.match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'');}
for(const id of ['pvc-directed','commercial-guide','aaron-performance-transfer']){
 const out=path.join(dir,id+'.transcript.json');if(fs.existsSync(out))continue;
 const form=new FormData();form.append('file',new Blob([fs.readFileSync(path.join(dir,id+'-raw.mp3'))],{type:'audio/mpeg'}),id+'.mp3');form.append('model_id','scribe_v2');form.append('language_code','en');form.append('tag_audio_events','false');
 const r=await fetch('https://api.elevenlabs.io/v1/speech-to-text',{method:'POST',headers:{'xi-api-key':process.env.ELEVENLABS_API_KEY},body:form,signal:AbortSignal.timeout(180000)});
 if(!r.ok)throw new Error(`${id} ASR ${r.status}`);const result=await r.json();fs.writeFileSync(out,JSON.stringify(result,null,2));console.log(id,result.text);
}
