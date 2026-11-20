import React from 'react';
import { Composition } from 'remotion';
import { DURATION, FPS } from './components/Transitions.jsx';
import { M01_LogoMotion } from './projects/M01_LogoMotion.jsx';
import { M02_BarRise } from './projects/M02_BarRise.jsx';
import { M03_StepFlow } from './projects/M03_StepFlow.jsx';
import { M04_TimelineFlow } from './projects/M04_TimelineFlow.jsx';
import { M05_DonutShare } from './projects/M05_DonutShare.jsx';
import { M06_NetworkTree } from './projects/M06_NetworkTree.jsx';
import { M07_ClickButton } from './projects/M07_ClickButton.jsx';
import { M08_Waveform } from './projects/M08_Waveform.jsx';
import { M09_TargetHit } from './projects/M09_TargetHit.jsx';
import { M10_PhoneMotion } from './projects/M10_PhoneMotion.jsx';

// Final 4K composition. Preview mode overrides --width/--height at render time.
const WIDTH = 3840;
const HEIGHT = 2160;

// IDs may only contain a-z, A-Z, 0-9 and hyphens (-)
export const COMPOSITIONS = [
  { id: 'M01-LogoMotion', component: M01_LogoMotion },
  { id: 'M02-BarRise', component: M02_BarRise },
  { id: 'M03-StepFlow', component: M03_StepFlow },
  { id: 'M04-TimelineFlow', component: M04_TimelineFlow },
  { id: 'M05-DonutShare', component: M05_DonutShare },
  { id: 'M06-NetworkTree', component: M06_NetworkTree },
  { id: 'M07-ClickButton', component: M07_ClickButton },
  { id: 'M08-Waveform', component: M08_Waveform },
  { id: 'M09-TargetHit', component: M09_TargetHit },
  { id: 'M10-PhoneMotion', component: M10_PhoneMotion },
];

export const RemotionRoot = () => (
  <>
    {COMPOSITIONS.map(({ id, component }) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);
