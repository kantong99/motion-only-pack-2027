import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { Particles } from '../components/Particles.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Four nodes on a line; a light pulse travels along it and lights each node as it passes
const LINE_Y = 540;
const XS = [380, 800, 1120, 1540];
const X0 = XS[0];
const X1 = XS[3];

export const M03_StepFlow = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = clampTween(frame, [30, 150], [0, 1]);
  const cycle = Math.max(0, frame - 150);
  const pulseP = (cycle % 150) / 150;
  const pulseX = X0 + (X1 - X0) * pulseP;
  const fade = clampTween(frame, [600, 720], [1, 0]);

  return (
    <CameraStage background="#081226" zoom={[0.97, 1.03]} rotateX={[2, -2]} perspective={2400}>
      <Background base="#081226" glowA="rgba(45,212,191,0.14)" glowB="rgba(99,102,241,0.14)" gridColor="rgba(45,212,191,0.04)" />

      <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
        <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
          <line x1={X0} y1={LINE_Y} x2={X1} y2={LINE_Y} stroke="rgba(148,163,184,0.2)" strokeWidth={6} />
          <line x1={X0} y1={LINE_Y} x2={X1} y2={LINE_Y} stroke="#2dd4bf" strokeWidth={8} strokeLinecap="round" pathLength={100} strokeDasharray={`${line * 100} 100`} />
          {frame > 150 && <circle cx={pulseX} cy={LINE_Y} r={22} fill="#ccfbf1" opacity={0.9} />}
          {frame > 150 && <circle cx={pulseX} cy={LINE_Y} r={44} fill="none" stroke="rgba(204,251,241,0.4)" strokeWidth={4} />}
        </svg>

        {XS.map((x, i) => {
          const pop = spring({ frame: Math.max(0, frame - 60 - i * 30), fps, config: { damping: 12, stiffness: 140 } });
          const lit = frame > 150 && Math.abs(pulseX - x) < 60 ? 1 : 0;
          const glow = 0.5 + 0.5 * Math.sin(frame / 10 + i);
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: x - 80,
                  top: LINE_Y - 80,
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  background: 'rgba(45,212,191,0.12)',
                  transform: `scale(${pop * (1 + 0.1 * glow)})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: x - 70,
                  top: LINE_Y - 70,
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: lit ? 'linear-gradient(135deg,#5eead4,#818cf8)' : 'linear-gradient(135deg,#2dd4bf,#4f46e5)',
                  boxShadow: `0 20px 60px rgba(45,212,191,${lit ? 0.7 : 0.35})`,
                  transform: `scale(${pop})`,
                }}
              />
            </React.Fragment>
          );
        })}
      </div>

      <Particles color="#5eead4" count={40} seed={21} speed={0.5} minSize={2} maxSize={5} />
    </CameraStage>
  );
};
