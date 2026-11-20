import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { Particles } from '../components/Particles.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// A speech bubble morphs in, and an audio waveform of bars pulses with layered sine waves
const BARS = 48;
const CX = DESIGN_W / 2;

export const M08_Waveform = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bubble = spring({ frame, fps, config: { damping: 16 } });
  const fade = clampTween(frame, [600, 720], [1, 0]);
  const energy = clampTween(frame, [60, 200], [0.2, 1]);

  return (
    <CameraStage background="#0b1020" zoom={[0.96, 1.04]} rotateY={[-4, 4]} perspective={2400}>
      <Background base="#0b1020" glowA="rgba(99,102,241,0.2)" glowB="rgba(236,72,153,0.12)" grid={false} />

      <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
        <div
          style={{
            position: 'absolute',
            left: CX - 300,
            top: 260,
            width: 600,
            height: 400,
            borderRadius: 200,
            background: 'linear-gradient(160deg,#4f46e5,#7c3aed)',
            boxShadow: '0 40px 100px rgba(99,102,241,0.45)',
            transform: `scale(${0.7 + 0.3 * bubble}) rotate(${(1 - bubble) * -20}deg)`,
            opacity: bubble,
          }}
        />

        {Array.from({ length: BARS }, (_, i) => {
          const x = CX - 900 + i * (1800 / (BARS - 1));
          const w =
            Math.sin(frame / 9 + i * 0.5) * 0.5 +
            Math.sin(frame / 17 + i * 0.25) * 0.3 +
            Math.sin(frame / 5 + i * 1.3) * 0.2;
          const h = 40 + energy * (120 + 110 * Math.abs(w));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 9,
                top: 860 - h / 2,
                width: 18,
                height: h,
                borderRadius: 9,
                background: i % 2 ? '#c4b5fd' : '#818cf8',
                opacity: 0.6 + 0.4 * energy,
              }}
            />
          );
        })}
      </div>

      <Particles color="#c7d2fe" count={60} seed={303} speed={0.6} minSize={2} maxSize={6} />
    </CameraStage>
  );
};
