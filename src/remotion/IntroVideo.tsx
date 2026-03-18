import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, spring } from 'remotion';
import React from 'react';

export const IntroVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp' });
  
  const scale = spring({
    fps,
    frame: frame - 15,
    config: { damping: 100, mass: 0.5 },
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
      <div style={{ opacity, transform: `translateY(${translateY}px) scale(${scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '120px', fontWeight: 'bold', margin: 0, color: 'white', textShadow: '0 0 40px rgba(139, 92, 246, 0.5)' }}>
          innovate.
        </h1>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '40px', color: '#8b5cf6', margin: 0, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Build The Future
        </h2>
        <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
          {[...Array(3)].map((_, i) => {
            const dotScale = spring({
              fps,
              frame: frame - 30 - i * 10,
              config: { damping: 10, mass: 1 },
            });
            return (
              <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#06b6d4', transform: `scale(${dotScale})`, boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)' }} />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
