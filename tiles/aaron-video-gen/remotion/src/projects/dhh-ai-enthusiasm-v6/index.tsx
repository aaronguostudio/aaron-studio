import React from 'react';
import {Composition,Sequence,registerRoot} from 'remotion';
import {DhhFilm,FPS,FRAMES} from './DhhFilm';
const clips=[{"from": 0, "source": 3071, "frames": 715}, {"from": 715, "source": 6445, "frames": 555}, {"from": 1270, "source": 8429, "frames": 356}, {"from": 1626, "source": 10331, "frames": 558}, {"from": 2184, "source": 10889, "frames": 425}, {"from": 2609, "source": 12356, "frames": 458}];
const VisualPreview:React.FC=()=> <>{clips.map(c=><Sequence key={c.from} from={c.from} durationInFrames={c.frames}><Sequence from={-c.source}><DhhFilm/></Sequence></Sequence>)}</>;
const Root:React.FC=()=> <><Composition id="DhhFilm" component={DhhFilm} durationInFrames={FRAMES} fps={FPS} width={1920} height={1080}/><Composition id="DhhVisualPreview" component={VisualPreview} durationInFrames={3067} fps={FPS} width={1920} height={1080}/></>;
registerRoot(Root);
