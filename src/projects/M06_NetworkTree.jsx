import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Tree of nodes: lines draw from the top down, and signal pulses flow along every link
const ROOT = { x: 960, y: 260 };
const MID = [
  { x: 420, y: 520, color: '#38bdf8' },
  { x: 960, y: 520, color: '#a78bfa' },
  { x: 1500, y: 520, color: '#34d399' },
];
const LEAF = [
  [{ x: 300, y: 760 }, { x: 540, y: 760 }],
  [{ x: 840, y: 760 }, { x: 1080, y: 760 }],
  [{ x: 1380, y: 760 }, { x: 1620, y: 760 }],
];

const links = [];
MID.forEach((m, mi) => {
  links.push({ a: ROOT, b: m, key: `r-${mi}` });
  LEAF[mi].forEach((l, li) => links.push({ a: m, b: l, key: `m-${mi}-${li}` }));
});

export const M06_NetworkTree = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineP = clampTween(frame, [40, 200], [0, 1]);
  const fade = clampTween(frame, [600, 720], [1, 0]);
  const rootPop = spring({ frame, fps, config: { damping: 14 } });

  return (
    <CameraStage background="#080c18" zoom={[0.97, 1.03]} rotateX={[2, -2]} perspective={2400}>
      <Background base="#080c18" glowA="rgba(251,191,36,0.12)" glowB="rgba(56,189,248,0.12)" gridColor="rgba(148,163,184,0.04)" />

      <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
        <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
          {links.map((l, i) => {
            const p = clampTween(lineP, [i * 0.08, i * 0.08 + 0.4], [0, 1]);
            const t = ((frame * 0.012 + i * 0.17) % 1);
            const px = l.a.x + (l.b.x - l.a.x) * t;
            const py = l.a.y + (l.b.y - l.a.y) * t;
            return (
              <g key={l.key}>
                <line x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} stroke="rgba(148,163,184,0.3)" strokeWidth={5} pathLength={100} strokeDasharray={`${p * 100} 100`} />
                {p >= 1 && <circle cx={px} cy={py} r={11} fill="#fde68a" />}
              </g>
            );
          })}
        </svg>

        <div style={{ position: 'absolute', left: ROOT.x - 90, top: ROOT.y - 90, width: 180, height: 180, borderRadius: '50%', background: 'linear-gradient(135deg,#fbbf24,#b45309)', boxShadow: '0 20px 60px rgba(251,191,36,0.4)', transform: `scale(${rootPop})` }} />

        {MID.map((m, i) => {
          const pop = spring({ frame: Math.max(0, frame - 120 - i * 15), fps, config: { damping: 14 } });
          return <div key={i} style={{ position: 'absolute', left: m.x - 80, top: m.y - 80, width: 160, height: 160, borderRadius: 40, background: m.color, opacity: 0.9, transform: `scale(${pop}) rotate(${(1 - pop) * 90}deg)` }} />;
        })}

        {LEAF.flat().map((l, i) => {
          const pop = spring({ frame: Math.max(0, frame - 210 + i * 8), fps, config: { damping: 16 } });
          return <div key={i} style={{ position: 'absolute', left: l.x - 60, top: l.y - 60, width: 120, height: 120, borderRadius: '50%', background: 'rgba(148,163,184,0.5)', border: '3px solid rgba(203,213,225,0.7)', transform: `scale(${pop})` }} />;
        })}
      </div>
    </CameraStage>
  );
};
