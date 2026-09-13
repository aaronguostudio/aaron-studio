import React from 'react';
import {AbsoluteFill, Composition, Easing, Img, interpolate, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import {editorialLayouts, layoutStyle} from '../../editorial/EditorialLayoutEngine';
import {filmData} from './data-v5';

const FPS = 30;
type Scene = typeof filmData.scenes[number];
type Chapter = typeof filmData.chapters[number];
const C = {paper:'#f4f1e9', ink:'#242923', muted:'#576158', line:'#d4d2c8', green:'#355e58', ochre:'#a16c20', sans:"-apple-system,'Helvetica Neue',Arial,sans-serif", serif:"Georgia,'Times New Roman',serif", mono:"'SF Mono',Menlo,monospace"};
const asset = (name:string) => staticFile('code-upstream/'+name);
const ease = (t:number,a:number,b:number) => interpolate(t,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)});
const T:React.FC<{children:React.ReactNode;size?:number;serif?:boolean;color?:string;style?:React.CSSProperties}> = ({children,size=58,serif=false,color=C.ink,style}) => <div style={{fontFamily:serif?C.serif:C.sans,fontSize:size,lineHeight:1.22,color,whiteSpace:'pre-line',...style}}>{children}</div>;
const page = editorialLayouts['minimal-page'].slots;
const statement = editorialLayouts['minimal-statement'].slots;
const media = editorialLayouts['people-hero'].slots;

const Context:React.FC<{s:Scene;c:Chapter}> = ({s,c}) => {
 const label = s.displayContext || (c.number ? `${String(c.number).padStart(2,'0')} / ${c.short.toUpperCase()}` : c.id==='opening' ? 'THE OPPORTUNITY AROUND THE CODE' : 'BUILD WHAT MATTERS');
 return <div style={layoutStyle(page.context.rect)}><T size={29} color={C.muted} style={{letterSpacing:1.7}}>{label}</T></div>;
};
const Accent:React.FC<{t:number;at?:number}> = ({t,at=.15}) => <div style={{height:4,width:100*ease(t,at,at+.48),background:C.ochre,marginTop:38}}/>;

const Group:React.FC<{s:Scene;t:number}> = ({s,t}) => {
 const focus = Math.max(0,Math.min(s.nodes.length-1,s.cues.filter(x=>t>=x).length-1));
 if (s.kind==='compare') return <div style={{...layoutStyle(page.body.rect),display:'grid',gridTemplateColumns:'1fr 1fr',gap:100,alignItems:'center'}}>{s.nodes.map((n,i)=>{
  const lines=n.split('\n');
  return <div key={n} style={{paddingRight:12}}>{lines.length>1&&<T size={34} color={C.green} style={{marginBottom:30}}>{lines[0]}</T>}<T serif size={60}>{lines.length>1?lines.slice(1).join('\n'):n}</T><Accent t={t} at={s.cues[i]??.3}/></div>;
 })}</div>;
 if (s.kind==='flow') return <div style={{...layoutStyle(page.body.rect),display:'flex',alignItems:'center'}}>{s.nodes.map((n,i)=>{
  const w=page.body.rect.width/s.nodes.length;
  const arrival=s.cues[i]??0;
  const progress=ease(t,(s.cues[i+1]??99)-.65,s.cues[i+1]??99);
  return <div key={n} style={{position:'relative',width:w,height:240,paddingTop:28,paddingRight:48}}>
   <div style={{height:35,position:'relative',marginBottom:32}}><div style={{width:14,height:14,borderRadius:14,background:i===0||t>=arrival?C.green:C.line}}/>{i<s.nodes.length-1&&<><div style={{position:'absolute',left:14,top:6,width:w-14,height:2,background:C.line}}/><div style={{position:'absolute',left:14,top:6,width:(w-14)*progress,height:3,background:C.green}}/></>}</div>
   <T size={48}>{n}</T>
  </div>;
 })}</div>;
 return <div style={{...layoutStyle(page.body.rect),display:'flex',flexDirection:'column',justifyContent:'center',gap:s.nodes.length>3?30:38}}>{s.nodes.map((n,i)=><div key={n} style={{position:'relative',paddingLeft:50}}>
  <div style={{position:'absolute',left:0,top:25,width:12,height:12,borderRadius:12,background:i===focus?C.ochre:C.line}}/>
  <T size={s.nodes.length>3?52:58}>{n}</T>
 </div>)}</div>;
};

export const UpstreamMinimalFilm:React.FC = () => {
 const frame=useCurrentFrame(),global=frame/FPS;
 const s=filmData.scenes.find(x=>global>=x.start&&global<x.end)??filmData.scenes[filmData.scenes.length-1];
 const t=global-s.start,d=s.end-s.start;
 const caption=filmData.captions.find(x=>global>=x.start&&global<x.end);
 if(s.kind==='cover')return <AbsoluteFill style={{background:C.paper}}><Img src={asset(s.media!)} style={{width:'100%',height:'100%',objectFit:'cover'}}/><div style={{position:'absolute',right:70,bottom:24,padding:'8px 14px',background:C.paper,fontFamily:C.mono,fontSize:20}}>AARON GUO · AI-NATIVE BUILDER · HUMAN-FIRST THINKER</div><div style={{position:'absolute',left:70,bottom:24,width:260*ease(t,.25,.8),height:3,background:C.green}}/></AbsoluteFill>;
 if(s.kind==='end')return <AbsoluteFill style={{background:C.paper,alignItems:'center',justifyContent:'center'}}><div style={{textAlign:'center',opacity:(.5+.5*ease(t,0,.6))*(1-ease(t,d-.9,d-.25))}}><Img src={asset('ag-logo.png')} style={{width:125,height:125,objectFit:'contain'}}/><T size={42} style={{fontWeight:700,letterSpacing:5,marginTop:30}}>AARON GUO</T><T size={21} color={C.muted} style={{letterSpacing:3,marginTop:24}}>AI-NATIVE BUILDER</T><T size={24} color={C.muted} style={{marginTop:12}}>Human-first thinker</T></div></AbsoluteFill>;
 const c=filmData.chapters.find(x=>x.id===s.chapterId)!;
 const bridge=s.kind==='chapter';
 return <AbsoluteFill style={{background:C.paper,color:C.ink}}>
  {!bridge&&<Context s={s} c={c}/>}
  {bridge ? <div style={{...layoutStyle(statement.claim.rect),display:'flex',flexDirection:'column',justifyContent:'center'}}>
    {c.number&&<T size={58} color={C.ochre} style={{marginBottom:30}}>{String(c.number).padStart(2,'0')}</T>}
    <T serif size={102}>{c.title}</T><Accent t={t}/>
   </div> : s.kind==='statement' ? <div style={{...layoutStyle(statement.claim.rect),display:'flex',flexDirection:'column',justifyContent:'center'}}><T serif size={92}>{s.title}</T><Accent t={t}/></div>
   : s.kind==='media' ? <><div style={{...layoutStyle(media.copy.rect),display:'flex',flexDirection:'column',justifyContent:'center'}}><T serif size={72}>{s.title}</T><Accent t={t}/></div><div style={layoutStyle(media.media.rect)}><Img src={asset(s.media!)} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div></>
   : <><div style={layoutStyle(page.headline.rect)}><T serif size={72}>{s.title}</T></div><Group s={s} t={t}/></>}
  {caption&&!bridge&&<div style={{position:'absolute',left:112,right:112,bottom:42,textAlign:'center',fontFamily:C.sans,fontSize:34,lineHeight:1.35,color:C.ink}}>{caption.text}</div>}
 </AbsoluteFill>;
};
const Root:React.FC=()=><Composition id="UpstreamMinimalFilm" component={UpstreamMinimalFilm} durationInFrames={Math.round(filmData.duration*FPS)} fps={FPS} width={1920} height={1080}/>;
registerRoot(Root);
