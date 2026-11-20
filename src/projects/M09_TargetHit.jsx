import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Three arrows fly into a bullseye; on impact the target pulses and a burst of rays radiates out
const TX = DESIGN_W / 2;
const TY = DESIGN_H / 2;
const RINGS = [340, 260, 180, 100, 40];
const ARROWS = [
  { sx: 300, sy: 200, delay: 20, color: '#94a3b8' },
  { sx: 260, sy: 880, delay: 60, color: '#94a3b8' },
  { sx: 1600, sy: 80, delay: 100, color: '#facc15' },
];
const RAYS = Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2);
const HIT = 150;

export const M09_TargetHit = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const impact = spring({ frame: Math.max(0, frame - HIT), fps, config: { damping: 10, stiffness: 200 } });
  const burst = clampTween(frame, [HIT, HIT + 60], [0, 1]);
  const fade = clampTween(frame, [600, 720], [1, 0]);

  return (
    <CameraStage background="#0a1020" zoom={[0.96, 1.04]} rotateX={[3, -2]} perspective={2400}>
      <Background base="#0a1020" glowA="rgba(250,204,21,0.14)" glowB="rgba(239,68,68,0.12)" gridColor="rgba(148,163,184,0.04)" />

      <svg style={{ position: 'absolute', left: 0, top: 0, opacity: fade }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
        {RINGS.map((r, i) => (
          <circle key={r} cx={TX} cy={TY} r={r * (1 + 0.04 * (1 - impact) * (frame >= HIT ? 1 : 0))} fill={i % 2 ? '#f8fafc' : '#ef4444'} opacity={0.9} />
        ))}

        {ARROWS.map((a, i) => {
          const p = clampTween(frame, [a.delay, a.delay + HIT - 20], [0, 1]);
          const x = a.sx + (TX - a.sx) * p;
          const y = a.sy + (TY - a.sy) * p;
          const ang = (Math.atan2(TY - a.sy, TX - a.sx) * 180) / Math.PI;
          return (
            <g key={i} opacity={clampTween(frame, [a.delay, a.delay + 5], [0, 1])}>
              <line x1={a.sx} y1={a.sy} x2={x} y2={y} stroke={a.color} strokeWidth={8} strokeLinecap="round" />
              <g transform={`translate(${x} ${y}) rotate(${ang})`}>
                <path d="M 0 0 L -30 -14 L -22 0 L -30 14 Z" fill={a.color} />
              </g>
            </g>
          );
        })}

        {frame >= HIT && RAYS.map((a, i) => (
          <line
            key={i}
            x1={TX + Math.cos(a) * (60 + burst * 120)}
            y1={TY + Math.sin(a) * (60 + burst * 120)}
            x2={TX + Math.cos(a) * (140 + burst * 360)}
            y2={TY + Math.sin(a) * (140 + burst * 360)}
            stroke="#fde68a"
            strokeWidth={8}
            strokeLinecap="round"
            opacity={1 - burst}
          />
        ))}
      </svg>
    </CameraStage>
  );
};
