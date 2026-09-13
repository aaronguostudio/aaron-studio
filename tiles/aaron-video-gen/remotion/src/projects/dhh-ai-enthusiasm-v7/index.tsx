import React from 'react';
import {AbsoluteFill,Composition,Img,Sequence,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import {DhhFilm as Baseline} from './Baseline';
import {editorialLayouts,layoutStyle} from '../../editorial/EditorialLayoutEngine';
import {captions} from './captions';
const FPS=30;
const pauses=[{at:5916,frames:96,carry:5,image:'01-first-version-v1.png',title:'Give ideas\na chance.'},{at:8781,frames:84,carry:4,image:'v6-shared.png',title:'Look at it\ntogether.'},{at:14198,frames:108,carry:4,image:'03-maintenance-v1.png',title:'Something useful\ntomorrow.'}];
const total=15096+pauses.reduce((n,p)=>n+p.frames,0);
const Breath:React.FC<{image:string;title:string}>=({image,title})=>{
 const L=editorialLayouts['people-hero'].slots;
 // Stillness is deliberate: the thought has resolved, the voice rests, and the
 // already-established music phrase carries the approved image into the next idea.
 return <AbsoluteFill style={{background:'#f4f1e9'}}><div style={{position:'absolute',left:112,right:112,top:42,display:'flex',justifyContent:'space-between',fontFamily:"'SF Mono',Menlo,monospace",fontSize:19,letterSpacing:2,color:'#737a74'}}><span>AARON GUO</span><span>DHH / AI AT WORK</span></div><div style={{...layoutStyle(L.copy.rect),display:'flex',alignItems:'center',fontFamily:"Georgia,'Times New Roman',serif",fontSize:62,lineHeight:1.18,color:'#2b2e2c',whiteSpace:'pre-line'}}>{title}</div><div style={layoutStyle(L.media.rect)}><Img src={staticFile('dhh-ai-enthusiasm/'+image)} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div><div style={{position:'absolute',left:112,top:862,fontFamily:"'SF Mono',Menlo,monospace",fontSize:18,color:'#737a74'}}>EDITORIAL ILLUSTRATION</div></AbsoluteFill>;
};
const Timeline:React.FC=()=>{
 const f=useCurrentFrame();const caption=captions.find(c=>f/30>=c.start&&f/30<c.end);
 let source=0,cursor=0;const layers:React.ReactNode[]=[];const breaths:React.ReactNode[]=[];
 for(const p of [...pauses,{at:15096,frames:0,carry:0,image:'',title:''}]){
  const n=p.at-source;
  layers.push(<Sequence key={'body-'+source} from={cursor} durationInFrames={n}><Sequence from={-source}><Baseline includeAudio={false} includeCaptions={false}/></Sequence></Sequence>);
  cursor+=n;source=p.at;
  if(p.frames){breaths.push(<Sequence key={'breath-'+source} from={cursor} durationInFrames={p.frames+p.carry}><Breath image={p.image} title={p.title}/></Sequence>);cursor+=p.frames;}
 }
 return <AbsoluteFill>{layers}{caption&&<div style={{position:"absolute",left:112,right:112,bottom:43,textAlign:"center",fontFamily:"-apple-system, Helvetica Neue, Arial, sans-serif",fontSize:33,lineHeight:1.35,color:"#2b2e2c"}}>{caption.text}</div>}{breaths}</AbsoluteFill>;
};
const clips=[{from:5658,frames:810},{from:8511,frames:780},{from:14034,frames:1350}];
const Preview:React.FC=()=>{let cursor=0;return <>{clips.map((c,i)=>{const from=cursor;cursor+=c.frames;return <Sequence key={i} from={from} durationInFrames={c.frames}><Sequence from={-c.from}><Timeline/></Sequence></Sequence>;})}</>;};
const Root:React.FC=()=> <><Composition id="DhhFilmV7" component={Timeline} durationInFrames={total} fps={FPS} width={1920} height={1080}/><Composition id="DhhSoundPreviewV7" component={Preview} durationInFrames={2940} fps={FPS} width={1920} height={1080}/></>;
registerRoot(Root);
