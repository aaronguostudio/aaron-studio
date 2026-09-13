import React from 'react';
import {AbsoluteFill,Composition,Easing,Img,interpolate,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import {editorialLayouts,layoutStyle} from '../../editorial/EditorialLayoutEngine';
import {filmData} from './data-v4';

const FPS=30;
type Scene=typeof filmData.scenes[number];
type Chapter=typeof filmData.chapters[number];
const C={paper:'#f4f1e9',ink:'#2b2e2c',muted:'#747971',line:'#d4d2c8',green:'#355e58',ochre:'#a16c20',sans:"-apple-system,'Helvetica Neue',Arial,sans-serif",serif:"Georgia,'Times New Roman',serif",mono:"'SF Mono',Menlo,monospace"};
const asset=(name:string)=>staticFile('code-upstream/'+name);
const ease=(t:number,a:number,b:number)=>interpolate(t,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)});
const T:React.FC<{children:React.ReactNode;size?:number;serif?:boolean;color?:string;style?:React.CSSProperties}>=({children,size=30,serif=false,color=C.ink,style})=><div style={{fontFamily:serif?C.serif:C.sans,fontSize:size,lineHeight:1.25,color,whiteSpace:'pre-line',...style}}>{children}</div>;
const L=editorialLayouts['chapter-page'].slots;

const Agenda:React.FC<{chapter:Chapter;active:number;time:number;bridge:boolean}>=({chapter,active,time,bridge})=><div style={layoutStyle(L.agenda.rect)}>
  <T size={17} color={C.muted} style={{letterSpacing:2,marginBottom:27}}>IN THIS CHAPTER</T>
  {chapter.agenda.map((item,i)=>{
    const on=!bridge&&i===active;const passed=!bridge&&i<active;
    return <div key={item} style={{position:'relative',padding:'0 12px 0 31px',height:94,opacity:bridge?.66+.34*ease(time,.18+i*.12,.7+i*.12):on?1:passed?.65:.45}}>
      <div style={{position:'absolute',left:0,top:9,width:8,height:8,borderRadius:8,background:on||passed?C.green:C.line}}/>
      <T size={27} color={on?C.green:C.ink} style={{fontWeight:on?600:400}}>{item}</T>
    </div>;
  })}
</div>;

const Body:React.FC<{s:Scene;c:Chapter;t:number}>=({s,c,t})=>{
 const focus=Math.max(0,Math.min(s.nodes.length-1,s.cues.filter(x=>t>=x).length-1));
 if(s.kind==='chapter')return <div style={{...layoutStyle(L.body.rect),display:'flex',alignItems:'center',gap:56}}>
  <T serif size={186} color={C.green} style={{minWidth:225,opacity:.8}}>{c.number?String(c.number).padStart(2,'0'):'→'}</T>
  <div style={{maxWidth:850,clipPath:`inset(0 ${(1-ease(t,.12,.75))*100}% 0 0)`}}><T serif size={57}>{c.purpose}</T><T size={20} color={C.muted} style={{marginTop:32,letterSpacing:2}}> {c.number?'ONE OF FIVE INVESTMENTS':'LOOKING AHEAD'}</T></div>
 </div>;
 if(s.id==='s09')return <div style={{...layoutStyle(L.body.rect),display:'flex',gap:52}}>
   <Img src={asset('cover.png')} style={{width:500,height:394,objectFit:'contain'}}/>
   <div style={{flex:1,paddingTop:8}}>{filmData.chapters.filter(x=>x.number).map((x,i)=><div key={x.id} style={{display:'flex',gap:21,marginBottom:21,opacity:.55+.45*ease(t,1+i*2,1.5+i*2)}}><T size={24} color={C.ochre}>{String(x.number).padStart(2,'0')}</T><T size={26}>{x.short}</T></div>)}</div>
 </div>;
 if(s.kind==='media')return <div style={{...layoutStyle(L.body.rect),display:'flex',justifyContent:'center',alignItems:'center'}}><Img src={asset(s.media!)} style={{height:'100%',width:'100%',objectFit:'contain'}}/></div>;
 if(s.kind==='compare')return <div style={{...layoutStyle(L.body.rect),display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,alignItems:'center'}}>{s.nodes.map((n,i)=>{
   const [label,...rest]=n.split('\n');return <div key={n} style={{alignSelf:'stretch',paddingTop:35,borderTop:`2px solid ${C.line}`}}><T size={24} color={C.green}>{label}</T><T serif size={45} style={{marginTop:33}}>{rest.join('\n')}</T><div style={{width:74*ease(t,s.cues[i]??.3,(s.cues[i]??.3)+.55),height:3,marginTop:32,background:C.ochre}}/></div>;
  })}</div>;
 if(s.kind==='flow')return <div style={{...layoutStyle(L.body.rect),display:'flex',alignItems:'center',gap:0}}>{s.nodes.map((n,i)=>{
   const w=1288/s.nodes.length;const progress= ease(t,(s.cues[i+1]??99)-.65,s.cues[i+1]??99);
   return <div key={n} style={{position:'relative',width:w,alignSelf:'stretch',paddingTop:76,paddingRight:35}}>
    <div style={{height:28,marginBottom:25,position:'relative'}}><div style={{width:13,height:13,borderRadius:20,background:i<=focus?C.green:C.line}}/>{i<s.nodes.length-1&&<><div style={{position:'absolute',left:13,top:6,width:w-13,height:2,background:C.line}}/><div style={{position:'absolute',left:13,top:6,width:(w-13)*progress,height:2,background:C.green}}/></>}</div>
    <T size={31} color={i<=focus?C.ink:C.muted}>{n}</T>
   </div>;
  })}</div>;
 if(s.nodes.length)return <div style={{...layoutStyle(L.body.rect),display:'flex',flexDirection:'column',justifyContent:'center'}}>{s.nodes.map((n,i)=><div key={n} style={{display:'flex',gap:27,alignItems:'baseline',padding:'15px 0',opacity:i===focus?1:.56}}>
   <T size={23} color={C.ochre} style={{width:30}}>{String(i+1).padStart(2,'0')}</T><T size={s.nodes.length>3?37:41} color={i===focus?C.ink:C.muted}>{n}</T>
  </div>)}</div>;
 return <div style={{...layoutStyle(L.body.rect),display:'flex',alignItems:'center'}}><T serif size={s.sub.length>95?48:57} color={C.green} style={{maxWidth:1120}}>{s.sub}</T></div>;
};

export const UpstreamChapterFilm:React.FC=()=>{
 const frame=useCurrentFrame(),global=frame/FPS;
 const s=filmData.scenes.find(x=>global>=x.start&&global<x.end)??filmData.scenes[filmData.scenes.length-1];
 const t=global-s.start,d=s.end-s.start;
 const caption=filmData.captions.find(x=>global>=x.start&&global<x.end);
 if(s.kind==='cover')return <AbsoluteFill style={{background:C.paper}}><Img src={asset(s.media!)} style={{width:'100%',height:'100%',objectFit:'cover'}}/><div style={{position:'absolute',right:70,bottom:24,padding:'8px 14px',background:C.paper,fontFamily:C.mono,fontSize:20}}>AARON GUO · AI-NATIVE BUILDER · HUMAN-FIRST THINKER</div><div style={{position:'absolute',left:70,bottom:24,width:260*ease(t,.25,.8),height:3,background:C.green}}/></AbsoluteFill>;
 if(s.kind==='end')return <AbsoluteFill style={{background:C.paper,alignItems:'center',justifyContent:'center'}}><div style={{textAlign:'center',opacity:(.5+.5*ease(t,0,.6))*(1-ease(t,d-.9,d-.25))}}><Img src={asset('ag-logo.png')} style={{width:125,height:125,objectFit:'contain'}}/><T size={42} style={{fontWeight:700,letterSpacing:5,marginTop:30}}>AARON GUO</T><T size={21} color={C.muted} style={{letterSpacing:3,marginTop:24}}>AI-NATIVE BUILDER</T><T size={24} color={C.muted} style={{marginTop:12}}>Human-first thinker</T></div></AbsoluteFill>;
 const c=filmData.chapters.find(x=>x.id===s.chapterId)!;
 const bridge=s.kind==='chapter';
 const isFirst=s.id===c.first;
 const heading=bridge?'':isFirst?c.purpose:s.title;
 const active=s.subsection??0;
 const pageLabel=c.number?`CHAPTER ${String(c.number).padStart(2,'0')} / 05`:c.id==='opening'?'THE ARGUMENT':'LOOKING AHEAD';
 const bodyReveal=bridge?1:.86+.14*ease(t,0,.35);
 return <AbsoluteFill style={{background:C.paper,color:C.ink}}>
   <div style={{position:'absolute',left:112,right:112,top:44,display:'flex',justifyContent:'space-between',fontFamily:C.mono,fontSize:18,letterSpacing:2,color:C.muted}}><span>AARON GUO</span><span>{pageLabel}</span></div>
   <div style={{...layoutStyle(L.chapter.rect),display:'flex',alignItems:'baseline',gap:26}}>{c.number&&<T size={49} color={C.ochre} style={{fontWeight:400}}>{String(c.number).padStart(2,'0')}</T>}<T size={61} serif>{c.title}</T></div>
   <div style={{...layoutStyle(L.headline.rect),display:'flex',alignItems:'center'}}><T size={42} style={{maxWidth:1610}}>{heading}</T></div>
   <Agenda chapter={c} active={active} time={t} bridge={bridge}/>
   <div style={{opacity:bodyReveal}}><Body s={s} c={c} t={t}/></div>
   {s.nodes.length>0&&!bridge&&<div style={layoutStyle(L.outcome.rect)}><T size={25} color={C.muted}>{s.sub}</T></div>}
   {s.kind==='media'&&<div style={layoutStyle(L.outcome.rect)}><T size={24} color={C.muted}>{s.sub}</T></div>}
   <div style={{position:'absolute',left:112,right:112,top:887,fontFamily:C.mono,fontSize:16,color:C.muted}}>{bridge?'NEXT CHAPTER · '+c.agenda.join(' / '):s.rail}</div>
   {caption&&!bridge&&<div style={{position:'absolute',left:112,right:112,bottom:42,textAlign:'center',fontFamily:C.sans,fontSize:32,lineHeight:1.35,color:C.ink}}>{caption.text}</div>}
 </AbsoluteFill>;
};
const Root:React.FC=()=><Composition id="UpstreamChapterFilm" component={UpstreamChapterFilm} durationInFrames={Math.round(filmData.duration*FPS)} fps={FPS} width={1920} height={1080}/>;
registerRoot(Root);
