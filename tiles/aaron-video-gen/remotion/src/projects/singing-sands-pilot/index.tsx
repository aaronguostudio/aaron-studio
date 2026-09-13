import React from 'react';
import {AbsoluteFill, Composition, Easing, Img, OffthreadVideo, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import {filmData} from './data';

const FPS=30;
const asset=(name:string)=>staticFile('singing-sands-pilot/'+name);
const smooth=(t:number,a:number,b:number)=>interpolate(t,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.45,0,.55,1)});
const sans="'PingFang SC','Helvetica Neue',Arial,sans-serif";
const small:React.CSSProperties={fontFamily:sans,fontSize:23,letterSpacing:1.2,color:'#fff3de',textShadow:'0 2px 12px #000'};

const Photo:React.FC<{src:string;close?:boolean}>=({src,close=false})=><AbsoluteFill style={{overflow:'hidden'}}><Img src={asset(src)} style={{width:'100%',height:'100%',objectFit:'cover',transform:close?'scale(1.3) translateY(-4%)':undefined}}/></AbsoluteFill>;
const Field:React.FC<{close?:boolean}>=({close=false})=><AbsoluteFill style={{overflow:'hidden'}}><OffthreadVideo src={asset('sand.mp4')} muted style={{width:'100%',height:'100%',objectFit:'cover',transform:close?'scale(1.22) translateX(-4%)':undefined}}/></AbsoluteFill>;

const Compare:React.FC=()=>{
 const t=useCurrentFrame()/FPS;
 const reveal=smooth(t,3.75,4.4);
 return <AbsoluteFill style={{background:'#271e16'}}>
  <Photo src="grains.png"/>
  <AbsoluteFill style={{background:'rgba(25,18,10,.22)'}}/>
  <div style={{position:'absolute',inset:0,clipPath:`inset(0 0 0 ${100-50*reveal}%)`,background:'rgba(32,44,43,.63)'}}/>
  <div style={{position:'absolute',left:960,top:205,bottom:220,width:2,background:'#eee0c5',opacity:reveal}}/>
  <div style={{position:'absolute',top:280,left:120,width:700,textAlign:'center',fontFamily:sans,color:'#fff3de'}}>
   <div style={{fontSize:60,fontWeight:600}}>干燥</div><div style={{fontSize:27,marginTop:20,letterSpacing:3}}>DRY SAND</div>
   <svg width="510" height="130" viewBox="0 0 510 130" style={{marginTop:95}} aria-label="Illustrative sound symbol">
    <path d="M10 65 L55 65 Q75 20 95 65 T135 65 T175 65 T215 65 T255 65 T295 65 T335 65 T375 65 T415 65 L500 65" fill="none" stroke="#fff0c5" strokeWidth="4"/>
   </svg><div style={{fontSize:32,marginTop:25}}>可能轰鸣</div>
  </div>
  <div style={{position:'absolute',top:280,right:120,width:700,textAlign:'center',fontFamily:sans,color:'#fff3de',opacity:reveal}}>
   <div style={{fontSize:60,fontWeight:600}}>潮湿</div><div style={{fontSize:27,marginTop:20,letterSpacing:3}}>DAMP SAND</div>
   <svg width="510" height="130" viewBox="0 0 510 130" style={{marginTop:95}} aria-label="Illustrative quiet symbol"><path d="M10 65 L500 65" fill="none" stroke="#fff0c5" strokeWidth="4"/></svg>
   <div style={{fontSize:32,marginTop:25}}>轰鸣停止</div>
  </div>
  <div style={{...small,position:'absolute',top:145,left:105}}>尤里卡沙丘的条件 · 条件示意，非声波测量</div>
 </AbsoluteFill>;
};

const Film:React.FC=()=>{
 const t=useCurrentFrame()/FPS;
 const cap=filmData.captions.find(c=>t>=c.start&&t<c.end);
 const field=t<18.4||t>=59.5&&t<72.5;
 const macro=t>=33.667&&t<49.233;
 const credit=field?'实景 / 录音 · NPS · Great Sand Dunes':macro?'AI 生成插画 · 非显微影像':'实景照片 · NPS · Eureka Dunes';
 return <AbsoluteFill style={{background:'#201b16',color:'#fff3de',fontFamily:sans}}>
  <Sequence from={0} durationInFrames={270}><Field/></Sequence>
  <Sequence from={270} durationInFrames={282}><Field close/></Sequence>
  <Sequence from={552} durationInFrames={171}><Photo src="eureka.jpg"/></Sequence>
  <Sequence from={723} durationInFrames={287}><Photo src="eureka.jpg" close/></Sequence>
  <Sequence from={1010} durationInFrames={126}><Photo src="grains.png"/></Sequence>
  <Sequence from={1136} durationInFrames={341}><Compare/></Sequence>
  <Sequence from={1477} durationInFrames={308}><Photo src="eureka.jpg"/></Sequence>
  <Sequence from={1785} durationInFrames={135}><Field close/></Sequence>
  <Sequence from={1920} durationInFrames={255}><Field/></Sequence>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(15,12,7,.44) 0%,transparent 24%,transparent 73%,rgba(15,12,7,.66) 100%)'}}/>
  {t<72.5&&<><div style={{...small,position:'absolute',left:104,top:54,fontSize:20,letterSpacing:4}}>AARON GUO <span style={{opacity:.55,letterSpacing:1}}> / FIELD NOTES 01</span></div><div style={{...small,position:'absolute',right:104,top:54,fontSize:20}}>{credit}</div></>}
  {t<8.5&&<div style={{position:'absolute',left:104,top:212,opacity:1-smooth(t,7.5,8.5),textShadow:'0 3px 26px #31220c'}}><div style={{fontSize:82,fontFamily:"Georgia,'Times New Roman',serif",lineHeight:1.12}}>The desert<br/>has a voice.</div><div style={{fontSize:32,marginTop:28,letterSpacing:6}}>沙丘真的会唱歌</div></div>}
  {t<5&&<div style={{...small,position:'absolute',left:104,bottom:87,fontSize:27}}>先听几秒 · 真实环境录音</div>}
  {cap&&<div style={{position:'absolute',left:160,right:160,bottom:64,textAlign:'center',fontSize:37,fontWeight:500,lineHeight:1.45,textShadow:'0 2px 7px #000,0 0 22px #000'}}>{cap.text}</div>}
  {t>=65.5&&t<71.5&&<div style={{...small,position:'absolute',left:104,bottom:86,fontSize:27,opacity:smooth(t,65.5,66)*(1-smooth(t,70.8,71.5))}}>此刻，只有沙丘的声音。</div>}
  <AbsoluteFill style={{background:'#201b16',opacity:smooth(t,71.3,73)}}/>
 </AbsoluteFill>;
};
const Root:React.FC=()=><Composition id="SingingSandsPilot" component={Film} durationInFrames={2220} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
