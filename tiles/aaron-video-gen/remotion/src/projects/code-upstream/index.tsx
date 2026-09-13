import React from 'react';
import {AbsoluteFill,Composition,Easing,Img,Sequence,interpolate,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import {editorialLayouts,layoutStyle} from '../../editorial/EditorialLayoutEngine';
import {filmData} from './data';
const FPS=30;
type Scene=typeof filmData.scenes[number];
const C={paper:'#f4f1e9',surface:'#faf8f2',ink:'#2b2e2c',muted:'#737a74',line:'#d4d2c8',signal:'#388c98',tension:'#b85d48',sans:"-apple-system,'Helvetica Neue',Arial,sans-serif",serif:"Georgia,'Times New Roman',serif",mono:"'SF Mono',Menlo,monospace"};
const asset=(name:string)=>staticFile('code-upstream/'+name);
const ease=(f:number,a:number,b:number)=>interpolate(f,[a*FPS,b*FPS],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.45,0,.55,1)});
const Text:React.FC<{children:React.ReactNode;size?:number;serif?:boolean;color?:string;style?:React.CSSProperties}>=({children,size=30,serif=false,color=C.ink,style})=><div style={{fontFamily:serif?C.serif:C.sans,fontSize:size,lineHeight:1.25,color,whiteSpace:'pre-line',...style}}>{children}</div>;
const SceneFrame:React.FC<{scene:Scene}>=({scene:s})=>{
 const f=useCurrentFrame(),t=f/FPS,d=s.end-s.start;
 const a=s.tension?C.tension:C.signal;
 const detail=.5+.5*ease(f,s.detailCue,s.detailCue+.6);
 const focus=Math.min(Math.max(s.cues.filter(v=>t>=v).length-1,0),Math.max(0,s.nodes.length-1));
 const header=<div style={{position:'absolute',left:112,right:112,top:42,display:'flex',justifyContent:'space-between',fontFamily:C.mono,fontSize:19,letterSpacing:2,color:C.muted}}><span>AARON GUO</span><span>ENGINEERING / REAL NEEDS</span></div>;
 const rail=<div style={{position:'absolute',left:112,right:112,top:863,fontFamily:C.mono,fontSize:17,letterSpacing:.5,color:C.muted}}>{s.rail}</div>;
 const bg=(children:React.ReactNode)=><AbsoluteFill style={{background:C.paper}}>{header}{children}{rail}</AbsoluteFill>;
 if(s.kind==='cover')return <AbsoluteFill style={{background:C.paper}}><Img src={asset(s.media!)} style={{width:'100%',height:'100%',objectFit:'cover'}}/><div style={{position:'absolute',right:70,bottom:24,padding:'8px 14px',background:C.paper,fontFamily:C.mono,fontSize:20,color:C.ink}}>AARON GUO · AI-NATIVE BUILDER · HUMAN-FIRST THINKER</div><div style={{position:'absolute',left:70,bottom:24,width:260*ease(f,.25,.8),height:3,background:C.signal}}/></AbsoluteFill>;
 if(s.kind==='end')return <AbsoluteFill style={{background:C.paper,alignItems:'center',justifyContent:'center'}}><div style={{textAlign:'center',opacity:(.5+.5*ease(f,0,.6))*(1-ease(f,d-.9,d-.25))}}><Img src={asset('ag-logo.png')} style={{width:125,height:125,objectFit:'contain'}}/><Text size={42} style={{fontWeight:700,letterSpacing:5,marginTop:30}}>AARON GUO</Text><Text size={21} color={C.muted} style={{letterSpacing:3,marginTop:24}}>AI-NATIVE BUILDER</Text><Text size={24} color={C.muted} style={{marginTop:12}}>Human-first thinker</Text></div></AbsoluteFill>;
 if(s.kind==='statement'){
  const L=editorialLayouts.statement.slots;
  return bg(<><div style={{...layoutStyle(L.headline.rect),display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}><Text serif size={s.title.length>40?68:78}>{s.title}</Text></div><div style={{...layoutStyle(L.supporting.rect),display:'flex',justifyContent:'center',textAlign:'center',opacity:detail}}><Text size={31} color={a}>{s.sub}</Text></div></>);
 }
 if(s.kind==='media'){
  const L=editorialLayouts['people-hero'].slots;
  return bg(<><div style={{...layoutStyle(L.copy.rect),display:'flex',flexDirection:'column',justifyContent:'center'}}><Text serif size={59}>{s.title}</Text></div><div style={{...layoutStyle(L.media.rect),display:'flex',alignItems:'center'}}><Img src={asset(s.media!)} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div><div style={{...layoutStyle(L.roles.rect),opacity:detail}}><Text size={24} color={C.muted}>{s.sub}</Text></div></>);
 }
 if(s.kind==='compare'){
  const L=editorialLayouts['split-loop'].slots;const gap=48,w=(L.comparison.rect.width-gap)/2;
  return bg(<><div style={layoutStyle(L.stageLabel.rect)}><Text serif size={52}>{s.title}</Text></div><div style={{...layoutStyle(L.comparison.rect),display:'flex',gap}}>{s.nodes.map((node,i)=>{const [title,...rest]=node.split('\n');return <div key={node} style={{width:w,borderTop:`2px solid ${C.line}`,padding:'38px 30px',boxSizing:'border-box',background:i===focus?C.surface:'transparent'}}><Text size={22} color={i===0?C.muted:a}>{title}</Text><Text size={43} serif style={{marginTop:45}}>{rest.join('\n')}</Text><div style={{marginTop:34,height:3,width:(w-60)*ease(f,s.cues[i]??.5,(s.cues[i]??.5)+.6),background:i===0?C.line:a}}/></div>})}</div><div style={{...layoutStyle(L.outcome.rect),opacity:detail}}><Text size={28} color={C.muted}>{s.sub}</Text></div></>);
 }
 if(s.kind==='manuscript'){
  const L=editorialLayouts['media-split'].slots;
  return bg(<><div style={layoutStyle(L.header.rect)}><Text serif size={58}>{s.title}</Text></div><div style={{...layoutStyle(L.media.rect),background:C.surface,padding:32,boxSizing:'border-box'}}>{s.nodes.map((x,i)=><div key={x} style={{borderTop:`2px solid ${C.line}`,padding:'25px 0',color:i===focus?a:C.muted,fontFamily:C.sans,fontSize:29}}>{x}</div>)}</div><div style={{...layoutStyle(L.analysis.rect),padding:'32px 35px',boxSizing:'border-box'}}>{[0,1,2].map(i=><div key={i} style={{marginBottom:35,opacity:i===focus?1:.4}}>{[100,90,65].map((width,j)=><div key={j} style={{width:width+'%',height:6,background:i===focus?a:C.line,marginBottom:17}}/>)}</div>)}</div><div style={layoutStyle(L.outcome.rect)}><Text size={28} color={C.muted}>{s.sub}</Text></div></>);
 }
 if(s.kind==='flow'){
  const L=editorialLayouts['ownership-map'].slots;const n=s.nodes.length,gap=56,w=(L.diagram.rect.width-gap*(n-1))/n;
  return bg(<><div style={layoutStyle(L.header.rect)}><Text serif size={59}>{s.title}</Text></div><div style={{...layoutStyle(L.diagram.rect),display:'flex',alignItems:'center',gap}}>{s.nodes.map((node,i)=><div key={node} style={{position:'relative',width:w,height:176,borderTop:`2px solid ${i<=focus?a:C.line}`,borderBottom:`2px solid ${C.line}`,background:i===focus?C.surface:'transparent',display:'flex',alignItems:'center',justifyContent:'center',boxSizing:'border-box',padding:20}}><Text size={n===4?31:34} color={i<=focus?C.ink:C.muted} style={{textAlign:'center'}}>{node}</Text>{i<n-1&&<div style={{position:'absolute',left:w,top:86,width:gap,height:2,background:C.line}}><div style={{height:2,width:gap*ease(f,(s.cues[i+1]??4)-.6,s.cues[i+1]??4),background:a}}/></div>}</div>)}</div><div style={layoutStyle(L.outcome.rect)}><Text size={25} color={C.muted}>{s.sub}</Text></div></>);
 }
 const L=editorialLayouts['decision-row'].slots,n=s.nodes.length,gap=40,w=(L.nodes.rect.width-gap*(n-1))/n;
 return bg(<><div style={{...layoutStyle(L.header.rect),display:'flex',alignItems:'center'}}><Text serif size={60}>{s.title}</Text></div><div style={{...layoutStyle(L.nodes.rect),display:'flex',gap}}>{s.nodes.map((node,i)=><div key={node} style={{position:'relative',width:w,borderTop:`2px solid ${C.line}`,borderBottom:`2px solid ${C.line}`,padding:'22px 26px',boxSizing:'border-box',display:'flex',alignItems:'center',background:i===focus?C.surface:'transparent'}}><div style={{position:'absolute',top:-2,left:0,width:w*ease(f,s.cues[i]??.5,(s.cues[i]??.5)+.5),height:3,background:a}}/><Text size={n===2?39:32} color={i===focus?C.ink:C.muted}>{node}</Text></div>)}</div><div style={{...layoutStyle(L.detail.rect),display:'flex',alignItems:'center',textAlign:'center',opacity:detail}}><Text size={28} color={C.muted}>{s.sub}</Text></div></>);
};
export const UpstreamFilm:React.FC=()=>{
 const f=useCurrentFrame(),t=f/FPS;const active=filmData.scenes.find(s=>t>=s.start&&t<s.end);const caption=filmData.captions.find(c=>t>=c.start&&t<c.end);
 return <AbsoluteFill style={{background:C.paper}}>{filmData.scenes.map(s=><Sequence key={s.id} from={Math.round(s.start*FPS)} durationInFrames={Math.round(s.end*FPS)-Math.round(s.start*FPS)}><SceneFrame scene={s}/></Sequence>)}{caption&&active?.kind!=='end'&&active?.kind!=='cover'&&<div style={{position:'absolute',left:112,right:112,bottom:42,textAlign:'center',fontFamily:C.sans,fontSize:32,lineHeight:1.35,color:C.ink}}>{caption.text}</div>}</AbsoluteFill>;
};
const Root:React.FC=()=><Composition id="UpstreamFilm" component={UpstreamFilm} durationInFrames={Math.round(filmData.duration*FPS)} fps={FPS} width={1920} height={1080}/>;
registerRoot(Root);
