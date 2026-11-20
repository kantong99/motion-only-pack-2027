import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { Particles } from '../components/Particles.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// A phone rises with a rotating tilt, cards slide up inside it, and floating notification pills pop around it
const PHONE = { x: DESIGN_W / 2 - 260, y: 110, w: 520, h: 860 };
const CARDS = [
  { color: '#38bdf8', w: 0.85 },
  { color: '#34d399', w: 0.6 },
  { color: '#a78bfa', w: 0.75 },
];
const PILLS = [
  { x: 250, y: 260, delay: 150, color: '#38bdf8' },
  { x: 1380, y: 620, delay: 200, color: '#34d399' },
  { x: 300, y: 760, delay: 250, color: '#a78bfa' },
];

export const M10_PhoneMotion = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneIn = spring({ frame, fps, config: { damping: 18 } });
  const tilt = Math.sin(frame / 60) * 4;
  const fade = clampTween(frame, [600, 720], [1, 0]);

  return (
    <CameraStage background="#07101f" zoom={[0.97, 1.04]} rotateY={[-6, 4]} perspective={2400}>
      <Background base="#07101f" glowA="rgba(56,189,248,0.18)" glowB="rgba(167,139,250,0.14)" gridColor="rgba(56,189,248,0.04)" />

      <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
        <div
          style={{
            position: 'absolute',
            left: PHONE.x,
            top: PHONE.y + (1 - phoneIn) * 160,
            width: PHONE.w,
            height: PHONE.h,
            borderRadius: 64,
            background: '#0f172a',
            border: '14px solid #1e293b',
            boxShadow: '0 50px 120px rgba(0,0,0,0.6)',
            opacity: phoneIn,
            overflow: 'hidden',
            transform: `rotate(${tilt}deg) scale(${0.9 + 0.1 * phoneIn})`,
          }}
        >
          {CARDS.map((c, i) => {
            const s = spring({ frame: Math.max(0, frame - 60 - i * 18), fps, config: { damping: 16 } });
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 36,
                  right: 36,
                  top: 140 + i * 200 + (1 - s) * 220,
                  height: 160,
                  borderRadius: 26,
                  background: 'rgba(30,41,59,0.9)',
                  borderLeft: `8px solid ${c.color}`,
                  padding: 26,
                  boxSizing: 'border-box',
                  opacity: s,
                }}
              >
                <div style={{ height: 26, width: '40%', borderRadius: 13, background: c.color, opacity: 0.8 }} />
                <div style={{ height: 40, width: `${c.w * 100}%`, borderRadius: 20, background: 'rgba(148,163,184,0.25)', marginTop: 26 }} />
              </div>
            );
          })}
        </div>

        {PILLS.map((p, i) => {
          const s = spring({ frame: Math.max(0, frame - p.delay), fps, config: { damping: 10 } });
          const bob = Math.sin(frame / 30 + i) * 12;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y + bob,
                width: 260,
                height: 90,
                borderRadius: 45,
                background: 'rgba(15,23,42,0.85)',
                border: `3px solid ${p.color}`,
                boxShadow: `0 20px 50px ${p.color}44`,
                transform: `scale(${s})`,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '0 28px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: p.color }} />
              <div style={{ flex: 1, height: 14, borderRadius: 7, background: 'rgba(148,163,184,0.35)' }} />
            </div>
          );
        })}
      </div>

      <Particles color="#7dd3fc" count={50} seed={131} speed={0.5} minSize={2} maxSize={6} />
    </CameraStage>
  );
};
