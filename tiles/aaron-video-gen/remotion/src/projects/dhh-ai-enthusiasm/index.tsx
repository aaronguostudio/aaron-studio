import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {DhhFilm,DhhPrototype,FPS,FRAMES} from './DhhFilm';
const Root:React.FC=()=> <><Composition id="DhhFilm" component={DhhFilm} durationInFrames={FRAMES} fps={FPS} width={1920} height={1080}/><Composition id="DhhPrototype" component={DhhPrototype} durationInFrames={90*FPS} fps={FPS} width={1920} height={1080}/></>;
registerRoot(Root);
