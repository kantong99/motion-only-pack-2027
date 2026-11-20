import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Bars rise and breathe, a line graph draws across, and three rings fill: dashboard motion without numbers
const BARS = [34, 52, 41, 63, 58, 77, 71, 90, 66, 84];
const LINE = [18, 30, 24, 40, 36, 52, 46, 61, 57, 72];
const RINGS = [
  { r: 90, color: '#38bdf8', target: 0.78 },
  { r: 66, color: '#34d399', target: 0.62 },
  { r: 42, color: '#a78bfa', target: 0.9 },
];

export const M02_BarRise = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drawLine = clampTween(frame, [120, 300], [0, 1]);
  const fade = clampTween(frame, [600, 720], [1, 0]);

  const lineX = (i) => 1060 + (i / (LINE.length - 1)) * 700;
  const lineY = (v) => 780 - v * 6.5;
  const pts = LINE.map((v, i) => `${lineX(i)},${lineY(v)}`).join(' ');

  return (
    <CameraStage background="#070d1a" zoom={[0.97, 1.04]} rotateY={[-3, 3]} perspective={2400}>
      <Background base="#070d1a" glowA="rgba(56,189,248,0.14)" glowB="rgba(167,139,250,0.12)" gridColor="rgba(56,189,248,0.04)" />

      <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
        {BARS.map((v, i) => {
          const grow = spring({ frame: Math.max(0, frame - 20 - i * 8), fps, config: { damping: 16, stiffness: 120 } });
          const breathe = 1 + 0.04 * Math.sin(frame / 20 + i);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 160 + i * 150,
                top: 820 - 4.6 * v * grow * breathe,
                width: 96,
                height: 4.6 * v * grow * breathe,
                borderRadius: 14,
                background: `linear-gradient(180deg, ${i % 2 ? '#a78bfa' : '#38bdf8'}, #1d4ed8)`,
              }}
            />
          );
        })}

        <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
          <polyline points={pts} fill="none" stroke="#34d399" strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" pathLength={100} strokeDasharray={`${drawLine * 100} 100`} />
          {LINE.map((v, i) => (
            <circle key={i} cx={lineX(i)} cy={lineY(v)} r={9} fill="#d1fae5" opacity={clampTween(drawLine, [i / 10, i / 10 + 0.05], [0, 1])} />
          ))}
        </svg>

        {RINGS.map((ring, i) => {
          const p = clampTween(frame, [60 + i * 30, 200 + i * 30], [0, ring.target]);
          const cx = 380 + i * 0;
          return (
            <svg key={i} style={{ position: 'absolute', left: cx - 120, top: 360 + i * 0, width: 240, height: 240 }} viewBox="0 0 240 240">
              <g transform="rotate(-90 120 120)">
                <circle cx={120} cy={120} r={ring.r} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth={18} />
                <circle cx={120} cy={120} r={ring.r} fill="none" stroke={ring.color} strokeWidth={18} strokeLinecap="round" pathLength={100} strokeDasharray={`${p * 100} 100`} />
              </g>
            </svg>
          );
        })}
      </div>
    </CameraStage>
  );
};
