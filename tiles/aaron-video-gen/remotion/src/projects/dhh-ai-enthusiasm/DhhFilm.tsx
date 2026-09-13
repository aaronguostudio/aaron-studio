import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {editorialLayouts,layoutStyle} from '../../editorial/EditorialLayoutEngine';
import {filmData} from './data';
export const FPS=30;
export const FRAMES=Math.round(filmData.duration*FPS);
type Scene=typeof filmData.scenes[number];
const C={paper:'#f4f1e9',surface:'#faf8f2',ink:'#2b2e2c',muted:'#737a74',line:'#d4d2c8',signal:'#388c98',tension:'#b85d48',sans:"-apple-system, 'Helvetica Neue', Arial, sans-serif",serif:"Georgia, 'Times New Roman', serif",mono:"'SF Mono', Menlo, monospace"};
const asset=(name:string)=>staticFile('dhh-ai-enthusiasm/'+name);
const progress=(f:number,a:number,b:number)=>interpolate(f,[a*FPS,b*FPS],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.45,0,.55,1)});
const Frame:React.FC<{scene:Scene}>=({scene:s})=>{
 const f=useCurrentFrame();const secs=f/FPS;const duration=s.end-s.start;
 const focus=s.focus_cues ? Math.min(Math.max(0,s.focus_cues.filter(x=>secs>=x).length-1),Math.max(s.nodes.length-1,1)):0;
 const detail=progress(f,s.detail_cue??.5,(s.detail_cue??.5)+.6);
 const isConcern=s.title.includes('Everyone')||s.title.includes('bottleneck');const accent=isConcern?C.tension:C.signal;
 const header=<div style={{position:'absolute',left:112,right:112,top:42,display:'flex',justifyContent:'space-between',fontFamily:C.mono,fontSize:19,letterSpacing:2,color:C.muted}}><span>AARON GUO</span><span>DHH / AI AT WORK</span></div>;
 const rail=<div style={{position:'absolute',left:112,right:112,top:862,fontFamily:C.mono,fontSize:18,color:C.muted}}>{s.fact ? `LEX FRIDMAN × DHH · TRANSCRIPT ${s.fact==='f1'?'00:05:54':s.fact==='f2'?'00:53:16':'01:10:51'} · PARAPHRASE` : s.media ? 'EDITORIAL ILLUSTRATION' : 'AARON’S NOTES · '+s.id.toUpperCase()}</div>;
 if(s.kind==='cover')return <AbsoluteFill style={{background:C.paper}}><Img src={asset(s.media!)} style={{width:'100%',height:'100%',objectFit:'cover'}}/><div style={{position:'absolute',left:112,bottom:65,fontFamily:C.mono,fontSize:20,color:C.ink}}>AARON GUO · WHY I SHARE DHH’S ENTHUSIASM FOR AI</div><div style={{position:'absolute',left:112,bottom:30,fontFamily:C.mono,fontSize:16,color:C.muted,opacity:.4+.6*progress(f,.35,.9)}}>THREE IDEAS · ONE TEAM’S EXPERIENCE</div></AbsoluteFill>;
 if(s.kind==='end')return <AbsoluteFill style={{background:C.paper,justifyContent:'center',alignItems:'center'}}><div style={{textAlign:'center',opacity:(.45+.55*progress(f,0,.6))*(1-progress(f,duration-.7,duration-.1))}}><Img src={asset('ag-logo.png')} style={{width:128,height:128,objectFit:'contain'}}/><div style={{fontFamily:C.sans,fontSize:42,fontWeight:700,letterSpacing:6,marginTop:28,color:C.ink}}>AARON GUO</div><div style={{fontFamily:C.mono,fontSize:21,letterSpacing:3,color:C.muted,marginTop:24}}>AI-NATIVE BUILDER</div><div style={{fontFamily:C.sans,fontSize:24,color:C.muted,marginTop:12}}>Human-first thinker</div></div></AbsoluteFill>;
 if(s.kind==='portrait'||s.kind==='image'){
 const L=editorialLayouts['people-hero'].slots;
 return <AbsoluteFill style={{background:C.paper}}>{header}<div style={{...layoutStyle(L.copy.rect),display:'flex',flexDirection:'column',justifyContent:'center'}}><div style={{fontFamily:C.mono,fontSize:20,color:C.signal,letterSpacing:2,marginBottom:24}}>{s.kind==='portrait'?'DHH × LEX FRIDMAN':'THE WORK / THE PRODUCT'}</div><div style={{fontFamily:C.serif,fontSize:59,lineHeight:1.12,color:C.ink,whiteSpace:'pre-line'}}>{s.title}</div></div><div style={{...layoutStyle(L.media.rect),overflow:'hidden'}}><Img src={asset(s.media!)} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div><div style={{...layoutStyle(L.roles.rect),fontFamily:C.sans,fontSize:24,lineHeight:1.4,color:C.muted,opacity:.5+.5*detail}}>{s.sub}</div>{rail}</AbsoluteFill>;
 }
 if(s.kind==='statement'){
 const L=editorialLayouts.statement.slots;
 return <AbsoluteFill style={{background:C.paper}}>{header}<div style={{...layoutStyle(L.headline.rect),display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:C.serif,fontSize:76,lineHeight:1.15,color:C.ink}}>{s.title}</div><div style={{...layoutStyle(L.supporting.rect),textAlign:'center',fontFamily:C.sans,fontSize:30,lineHeight:1.35,color:accent,opacity:.45+.55*progress(f,.5,1.1)}}>{s.sub}</div>{rail}</AbsoluteFill>;
 }
 const L=editorialLayouts['decision-row'].slots;const n=s.nodes.length;const gap=40;const w=(L.nodes.rect.width-gap*(n-1))/n;
 return <AbsoluteFill style={{background:C.paper}}>{header}<div style={{...layoutStyle(L.header.rect),display:'flex',alignItems:'center',fontFamily:C.serif,fontSize:62,lineHeight:1.15,color:C.ink}}>{s.title}</div><div style={{...layoutStyle(L.nodes.rect),display:'flex',gap}}>{s.nodes.map((node,i)=>{
 const active=i===focus;const cue=s.focus_cues?.[i]??.5;const p=progress(f,cue,cue+.5);
 return <div key={node} style={{position:'relative',width:w,height:144,borderTop:`2px solid ${C.line}`,borderBottom:`2px solid ${C.line}`,display:'flex',alignItems:'center',padding:'18px 24px',boxSizing:'border-box',background:active?C.surface:'transparent'}}><div style={{position:'absolute',top:-2,left:0,width:w*p,height:3,background:accent}}/><div style={{fontFamily:C.sans,fontSize:n===2?34:31,fontWeight:active?650:500,lineHeight:1.2,color:active?C.ink:C.muted}}>{node}</div></div>;
 })}</div><div style={{...layoutStyle(L.detail.rect),display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:C.sans,fontSize:28,lineHeight:1.45,color:C.muted,opacity:.45+.55*detail}}>{s.sub}</div>{rail}</AbsoluteFill>;
};
export const DhhFilm:React.FC<{includeAudio?:boolean}>=({includeAudio=true})=>{
 const f=useCurrentFrame();const t=f/FPS;const caption=filmData.captions.find(c=>t>=c.start&&t<c.end+.12);const active=filmData.scenes.find(s=>t>=s.start&&t<s.end);
 return <AbsoluteFill style={{background:C.paper}}>{filmData.scenes.map(s=><Sequence key={s.id} from={Math.round(s.start*FPS)} durationInFrames={Math.round(s.end*FPS)-Math.round(s.start*FPS)}><Frame scene={s}/></Sequence>)}{includeAudio&&<Sequence from={90}><Audio src={asset('audio.mp3')}/></Sequence>}{caption&&active?.kind!=='end'&&active?.kind!=='cover'&&<div style={{position:'absolute',left:112,right:112,bottom:43,textAlign:'center',fontFamily:C.sans,fontSize:33,lineHeight:1.35,color:C.ink}}>{caption.text}</div>}</AbsoluteFill>;
};
export const DhhPrototype:React.FC=()=> <Sequence from={-Math.round(150*FPS)}><DhhFilm/></Sequence>;
