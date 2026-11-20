import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// A cursor glides to a pill button, clicks it, a ripple expands, and a checkmark draws in
const BTN = { x: DESIGN_W / 2, y: DESIGN_H / 2, w: 520, h: 170 };

export const M07_ClickButton = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 18 } });
  const moveP = clampTween(frame, [60, 140], [0, 1]);
  const curX = 1500 + (BTN.x + 120 - 1500) * moveP;
  const curY = 200 + (BTN.y + 30 - 200) * moveP;
  const pressed = frame >= 150 && frame < 165;
  const done = frame >= 165;
  const ripple = clampTween(frame, [160, 210], [0, 1]);
  const check = clampTween(frame, [170, 200], [0, 1]);
  const fade = clampTween(frame, [600, 720], [1, 0]);

  return (
    <CameraStage background="#0a0816" zoom={[0.97, 1.03]} perspective={2200}>
      <Background base="#0a0816" glowA="rgba(168,85,247,0.2)" glowB="rgba(236,72,153,0.14)" gridColor="rgba(168,85,247,0.04)" />

      <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
        <div
          style={{
            position: 'absolute',
            left: BTN.x - BTN.w / 2 - 30,
            top: BTN.y - BTN.h / 2 - 30,
            width: BTN.w + 60,
            height: BTN.h + 60,
            borderRadius: 120,
            border: '4px solid rgba(232,121,249,0.8)',
            transform: `scale(${1 + ripple * 0.35})`,
            opacity: 1 - ripple,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: BTN.x - BTN.w / 2,
            top: BTN.y - BTN.h / 2,
            width: BTN.w,
            height: BTN.h,
            borderRadius: 90,
            background: done ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#a855f7,#ec4899)',
            boxShadow: '0 30px 80px rgba(236,72,153,0.4)',
            transform: `scale(${pressed ? 0.94 : 1}) scale(${pop})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={120} height={120} viewBox="0 0 120 120" style={{ opacity: done ? 1 : 0 }}>
            <path d="M 28 62 L 52 86 L 94 38" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={`${check * 100} 100`} />
          </svg>
        </div>

        <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
          <g transform={`translate(${curX} ${curY}) scale(${pressed ? 0.9 : 1})`} opacity={clampTween(frame, [40, 60], [0, 1])}>
            <path d="M 0 0 L 0 58 L 16 44 L 28 70 L 40 64 L 28 40 L 50 40 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={3} />
          </g>
        </svg>
      </div>
    </CameraStage>
  );
};
