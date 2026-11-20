import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Background } from '../components/Background.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Donut segments grow in sequence, the whole ring slowly rotates, and orbiting dots circle the center
const SEGMENTS = [
  { value: 42, color: '#38bdf8' },
  { value: 27, color: '#a78bfa' },
  { value: 19, color: '#f472b6' },
  { value: 12, color: '#64748b' },
];
const CX = DESIGN_W / 2;
const CY = DESIGN_H / 2;
const R = 300;

export const M05_DonutShare = () => {
  const frame = useCurrentFrame();
  const grow = clampTween(frame, [30, 180], [0, 1]);
  const spin = frame * 0.25;
  const pulse = 1 + 0.03 * Math.sin(frame / 18);
  const fade = clampTween(frame, [600, 720], [1, 0]);

  let cum = 0;
  return (
    <CameraStage background="#0b0f1c" zoom={[0.96, 1.04]} rotateY={[-4, 4]} perspective={2400}>
      <Background base="#0b0f1c" glowA="rgba(56,189,248,0.14)" glowB="rgba(244,114,182,0.12)" gridColor="rgba(148,163,184,0.04)" />

      <svg style={{ position: 'absolute', left: 0, top: 0, opacity: fade }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
        <g transform={`rotate(${spin} ${CX} ${CY}) translate(${CX} ${CY}) scale(${pulse}) translate(${-CX} ${-CY})`}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth={100} />
          <g transform={`rotate(-90 ${CX} ${CY})`}>
            {SEGMENTS.map((s, i) => {
              const offset = -cum;
              cum += s.value;
              return (
                <circle
                  key={i}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={100}
                  pathLength={100}
                  strokeDasharray={`${s.value * clampTween(grow, [i * 0.2, i * 0.2 + 0.6], [0, 1]) - 0.5} 100`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </g>
        </g>

        <circle cx={CX} cy={CY} r={170 + 10 * Math.sin(frame / 20)} fill="rgba(15,23,42,0.85)" />

        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2 + frame / 40;
          return <circle key={i} cx={CX + Math.cos(a) * (R + 150)} cy={CY + Math.sin(a) * (R + 150)} r={12} fill={SEGMENTS[i % 4].color} opacity={0.8} />;
        })}
      </svg>
    </CameraStage>
  );
};
