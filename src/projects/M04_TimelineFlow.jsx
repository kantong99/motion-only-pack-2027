import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// A glowing line draws across, milestone cards slide in alternately, and a light travels the path
const LINE_Y = 540;
const X0 = 220;
const X1 = 1700;
const COUNT = 6;
const STEP = (X1 - X0) / (COUNT - 1);

export const M04_TimelineFlow = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = clampTween(frame, [20, 140], [0, 1]);
  const travel = X0 + ((Math.max(0, frame - 140) % 200) / 200) * (X1 - X0);
  const fade = clampTween(frame, [600, 720], [1, 0]);

  return (
    <CameraStage background="#0a0f1f" zoom={[0.96, 1.04]} panX={[-30, 30]} perspective={2400}>
      <Background base="#0a0f1f" glowA="rgba(251,191,36,0.12)" glowB="rgba(59,130,246,0.14)" gridColor="rgba(148,163,184,0.04)" />

      <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
        <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
          <line x1={X0 - 80} y1={LINE_Y} x2={X1 + 80} y2={LINE_Y} stroke="#fbbf24" strokeWidth={6} strokeLinecap="round" pathLength={100} strokeDasharray={`${draw * 100} 100`} />
          {frame > 140 && <circle cx={travel} cy={LINE_Y} r={18} fill="#fef3c7" />}
        </svg>

        {Array.from({ length: COUNT }, (_, i) => {
          const x = X0 + i * STEP;
          const up = i % 2 === 0;
          const pop = spring({ frame: Math.max(0, frame - 50 - i * 22), fps, config: { damping: 14, stiffness: 140 } });
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: x - 18,
                  top: LINE_Y - 18,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#fbbf24',
                  boxShadow: '0 0 30px rgba(251,191,36,0.6)',
                  transform: `scale(${pop})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: x - 130,
                  top: up ? LINE_Y - 230 : LINE_Y + 70,
                  width: 260,
                  height: 160,
                  borderRadius: 24,
                  background: 'linear-gradient(160deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))',
                  border: '2px solid rgba(251,191,36,0.25)',
                  padding: 26,
                  boxSizing: 'border-box',
                  opacity: pop,
                  transform: `translateY(${(1 - pop) * (up ? 30 : -30)}px)`,
                }}
              >
                {[0, 1, 2].map((k) => (
                  <div key={k} style={{ height: 14, borderRadius: 7, marginBottom: 14, width: `${100 - k * 22}%`, background: k === 0 ? '#fde68a' : 'rgba(148,163,184,0.35)' }} />
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </CameraStage>
  );
};
