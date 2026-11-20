import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { Particles } from '../components/Particles.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Four tiles fly in from the corners, lock into a square, then morph into a circle and back
const TILES = [
  { fx: -1, fy: -1, color: '#60a5fa' },
  { fx: 1, fy: -1, color: '#3b82f6' },
  { fx: -1, fy: 1, color: '#2563eb' },
  { fx: 1, fy: 1, color: '#1d4ed8' },
];

export const M01_LogoMotion = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lock = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 18, stiffness: 80 } });
  const breathe = 0.5 + 0.5 * Math.sin(Math.max(0, frame - 200) / 36);
  const sweep = clampTween(frame, [240, 320], [-40, 140]);
  const fade = clampTween(frame, [600, 720], [1, 0]);
  const ringA = (frame * 2.2) % 360;

  return (
    <CameraStage background="#050b1a" zoom={[0.96, 1.05]} rotateY={[-3, 3]} perspective={2200}>
      <Background base="#050b1a" glowA="rgba(59,130,246,0.22)" glowB="rgba(37,99,235,0.14)" gridColor="rgba(59,130,246,0.04)" />

      <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
        <div
          style={{
            position: 'absolute',
            left: DESIGN_W / 2 - 260,
            top: DESIGN_H / 2 - 260,
            width: 520,
            height: 520,
            borderRadius: '50%',
            border: '3px dashed rgba(96,165,250,0.35)',
            transform: `rotate(${ringA}deg)`,
            opacity: clampTween(frame, [260, 300], [0, 1]),
          }}
        />

        {TILES.map((t, i) => {
          const offX = t.fx * 600 * (1 - lock);
          const offY = t.fy * 500 * (1 - lock);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: DESIGN_W / 2 - 150 + t.fx * 78 + offX,
                top: DESIGN_H / 2 - 150 + t.fy * 78 + offY,
                width: 146,
                height: 146,
                borderRadius: 26 + breathe * 47,
                background: t.color,
                boxShadow: `0 20px 60px ${t.color}66`,
                opacity: clampTween(lock, [0, 0.2], [0, 1]),
                transform: `rotate(${(1 - lock) * 180}deg)`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${sweep}%`,
                  width: '18%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
                }}
              />
            </div>
          );
        })}
      </div>

      <Particles color="#93c5fd" count={60} seed={5} speed={0.6} minSize={2} maxSize={6} />
    </CameraStage>
  );
};
