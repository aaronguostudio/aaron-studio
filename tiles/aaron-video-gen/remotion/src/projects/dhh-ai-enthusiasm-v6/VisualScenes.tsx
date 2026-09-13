import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {editorialLayouts, layoutStyle} from '../../editorial/EditorialLayoutEngine';

type Beat={id:string; title:string; nodes:readonly string[]; sub:string; focus_cues?:readonly number[]};
const C={paper:'#f4f1e9',surface:'#faf8f2',ink:'#2b2e2c',muted:'#737a74',line:'#d4d2c8',signal:'#388c98',coral:'#b85d48'};
const serif="Georgia, 'Times New Roman', serif";
const sans="-apple-system, 'Helvetica Neue', Arial, sans-serif";
const mono="'SF Mono', Menlo, monospace";
const label:React.CSSProperties={fontFamily:mono,fontSize:19,letterSpacing:2,color:C.muted};
const ink:React.CSSProperties={fontFamily:serif,fontSize:43,lineHeight:1.25,color:C.ink};
export const enrichedIds=new Set(['s07','s13','s17','s19','s22','s23','s24','s28','s29','s31']);
export const VisualScene:React.FC<{scene:Beat}>=({scene:s})=>{
 const f=useCurrentFrame(); const t=f/30;
 const p=(cue:number)=>interpolate(t,[cue,cue+.65],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const focus=Math.max(0,(s.focus_cues??[.5]).filter(c=>t>=c).length-1);
 const line=(cue:number,color=C.signal)=><div style={{height:3,width:`${100*p(cue)}%`,background:color}}/>;
 const title=(rect:Parameters<typeof layoutStyle>[0])=><div style={{...layoutStyle(rect),fontFamily:serif,fontSize:59,lineHeight:1.13,color:C.ink,display:'flex',alignItems:'center'}}>{s.title}</div>;
 const foot=(rect:Parameters<typeof layoutStyle>[0])=><div style={{...layoutStyle(rect),fontFamily:sans,fontSize:24,color:C.muted}}>{s.sub}</div>;
 const illustration=(file:string)=><Img src={staticFile('dhh-ai-enthusiasm/v6-'+file+'.png')} style={{width:'100%',height:'100%',objectFit:'contain',mixBlendMode:'multiply'}}/>;
 if(s.id==='s13'){
  const L=editorialLayouts['media-split'].slots;
  return <>{title(L.header.rect)}<div style={{...layoutStyle(L.media.rect),boxSizing:'border-box',padding:'36px 44px',background:C.surface,border:`1px solid ${C.line}`,boxShadow:'8px 10px 0 #e6e1d6'}}><div style={label}>ARTICLE / REVISION NOTES</div><div style={{...ink,marginTop:35,color:C.muted}}>An interest in Linux</div><div style={{marginTop:10}}>{line(1.2,C.coral)}</div><div style={{...ink,fontSize:42,marginTop:32,opacity:.38+.62*p(10.83)}}>Why I share DHH’s<br/>enthusiasm for AI</div><div style={{marginTop:14}}>{line(10.83)}</div></div><div style={{...layoutStyle(L.analysis.rect),padding:'35px 45px',boxSizing:'border-box',display:'flex',flexDirection:'column',justifyContent:'center'}}><div style={{...label,color:C.coral}}>MY FEEDBACK</div><div style={{...ink,marginTop:25,fontSize:46,opacity:.55+.45*p(5.66)}}>Bring the argument back<br/>to AI and trust at work.</div><div style={{fontFamily:sans,fontSize:24,color:C.muted,marginTop:30}}>Summary of my actual revision request</div></div>{foot(L.outcome.rect)}</>;
 }
 if(s.id==='s22'||s.id==='s23'){
  const L=editorialLayouts['split-loop'].slots;const leap=s.id==='s23';
  const cards=leap?[['SPECIFIC EXPERIENCE','Agents do useful work',C.signal],['UNSUPPORTED GENERALIZATION','Everyone is more productive now.',C.coral]]:[['SOURCE / PARAPHRASE','Agents do useful work',C.signal],['MY INTERPRETATION','More ideas are worth trying',C.signal]];
  return <>{title(L.stageLabel.rect)}<div style={{...layoutStyle(L.comparison.rect),display:'grid',gridTemplateColumns:'1fr 1fr',gap:68}}>{cards.map(([tag,body,color],i)=><div key={tag} style={{background:C.surface,border:`1px solid ${C.line}`,padding:'42px 44px',boxSizing:'border-box',boxShadow:'7px 9px 0 #e6e1d6'}}><div style={{...label,color}}>{tag}</div><div style={{...ink,fontSize:48,marginTop:42,opacity:i===0||focus>=i||leap?1:.55}}>{body}</div><div style={{marginTop:23}}>{line(leap?2:(s.focus_cues?.[i]??.5),color)}</div><div style={{fontFamily:sans,fontSize:24,color:C.muted,marginTop:28}}>{leap?(i===0?'What the example can support':'“Everyone” exceeds the evidence'):(i===0?'What DHH describes':'What I take from it')}</div></div>)}</div>{foot(L.outcome.rect)}</>;
 }
 if(s.id==='s19'){
  const L=editorialLayouts['ownership-map'].slots;
  return <>{title(L.header.rect)}<div style={{...layoutStyle(L.diagram.rect),display:'flex',gap:90}}><div style={{width:950,boxSizing:'border-box',padding:'30px 42px',background:C.surface,border:`1px solid ${C.line}`,boxShadow:'7px 9px 0 #e6e1d6'}}><div style={label}>ONE PARAGRAPH / READING NOTES</div>{s.nodes.map((node,i)=><div key={node} style={{display:'flex',gap:30,alignItems:'center',marginTop:27}}><div style={{width:28,height:28,border:`2px solid ${focus===i?C.signal:C.line}`,flexShrink:0,background:focus===i?'#e4eeea':'transparent'}}/><div style={{flex:1}}><div style={{fontFamily:sans,fontSize:34,color:focus===i?C.ink:C.muted}}>{node}</div><div style={{marginTop:9}}>{line(s.focus_cues?.[i]??.5)}</div></div></div>)}</div><div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}><div style={{...label,color:C.signal}}>BEFORE WE COMPARE</div><div style={{...ink,fontSize:46,marginTop:26}}>Make the standard<br/>visible to both of us.</div></div></div>{foot(L.outcome.rect)}</>;
 }
 if(s.id==='s29'||s.id==='s31'){
  const L=editorialLayouts['workflow-gates'].slots;
  return <>{title(L.header.rect)}<div style={{...layoutStyle(L.gates.rect),display:'flex',gap:48}}>{s.nodes.map((node,i)=><div key={node} style={{flex:1,position:'relative',padding:'30px 36px',boxSizing:'border-box',background:C.surface,border:`1px solid ${C.line}`,boxShadow:'5px 7px 0 #e6e1d6'}}><div style={{...label,color:focus===i?C.signal:C.muted}}>0{i+1} / {s.id==='s19'?'READING CHECK':s.id==='s29'?'DELIVERY CHECK':'SHARED PRACTICE'}</div><div style={{...ink,fontSize:40,marginTop:36}}>{node}</div><div style={{position:'absolute',left:36,right:36,bottom:28}}>{line(s.focus_cues?.[i]??.5)}</div></div>)}</div><div style={{...layoutStyle(L.workflowRail.rect),display:'flex',alignItems:'center',gap:30}}><div style={{width:90,height:2,background:C.signal}}/><div style={{fontFamily:sans,fontSize:28,color:C.muted}}>{s.sub}</div></div></>;
 }
 const L=editorialLayouts['media-split'].slots;
 const forms=s.id==='s07',queue=s.id==='s28';const file=forms?'forms':queue?'queue':'shared';
 return <>{title(L.header.rect)}<div style={{...layoutStyle(L.media.rect)}}>{illustration(file)}</div><div style={{...layoutStyle(L.analysis.rect),display:'flex',flexDirection:'column',justifyContent:'center',gap:25,padding:'0 40px',boxSizing:'border-box'}}><div style={{...label,color:queue?C.coral:C.signal}}>{forms?'ORDINARY WORK / REAL FRICTION':queue?'THE WORK STILL TO DO':'ONE DRAFT / SHARED ATTENTION'}</div>{s.nodes.map((node,i)=><div key={node} style={{display:'flex',alignItems:'flex-start',gap:22,opacity:focus===i?1:.52}}><div style={{fontFamily:mono,fontSize:20,color:queue?C.coral:C.signal,paddingTop:10}}>0{i+1}</div><div style={{flex:1}}><div style={{fontFamily:sans,fontSize:37,lineHeight:1.23,color:C.ink}}>{node}</div><div style={{marginTop:12}}>{line(s.focus_cues?.[i]??.5,queue?C.coral:C.signal)}</div></div></div>)}</div>{foot(L.outcome.rect)}</>;
};
