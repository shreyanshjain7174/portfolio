import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
} from 'remotion'

/* ── Ambient floating orb ──────────────────────────────────────────── */
function FloatingOrb({
  x,
  y,
  size,
  color,
  delay,
  speed,
}: {
  x: number
  y: number
  size: number
  color: string
  delay: number
  speed: number
}) {
  const frame = useCurrentFrame()
  const t = (frame + delay) * speed

  const floatX = x + Math.sin(t * 0.02) * 40
  const floatY = y + Math.cos(t * 0.015) * 30
  const pulse = 0.7 + Math.sin(t * 0.03) * 0.3

  return (
    <div
      style={{
        position: 'absolute',
        left: `${floatX}%`,
        top: `${floatY}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: pulse * 0.6,
        filter: `blur(${size * 0.3}px)`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

/* ── Rising bubbles ────────────────────────────────────────────────── */
function Bubbles() {
  const frame = useCurrentFrame()
  const { height } = useVideoConfig()

  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    x: (i * 37 + 13) % 100,
    size: 3 + (i % 5) * 2,
    speed: 0.4 + (i % 4) * 0.15,
    delay: i * 30,
    wobble: (i % 3) * 0.5 + 0.5,
  }))

  return (
    <>
      {bubbles.map((b, i) => {
        const t = (frame + b.delay) * b.speed
        const y = height - (t % (height + 100))
        const x = b.x + Math.sin(t * 0.02 * b.wobble) * 15
        const opacity = interpolate(y, [height, height * 0.7, height * 0.2, 0], [0, 0.4, 0.3, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: y,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              border: '1px solid rgba(96,191,245,0.3)',
              background: 'radial-gradient(circle, rgba(96,191,245,0.15) 0%, transparent 70%)',
              opacity,
            }}
          />
        )
      })}
    </>
  )
}

/* ── Ocean wave layer ──────────────────────────────────────────────── */
function OceanWaves() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const t = frame / fps

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Wave 1 — bottom, dark blue */}
      <svg
        viewBox="0 0 1440 200"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: 120,
          transform: `translateX(${-Math.sin(t * 0.3) * 100}px)`,
          opacity: 0.4,
        }}
        preserveAspectRatio="none"
      >
        <path
          d={`M0,100 C${240 + Math.sin(t * 0.5) * 30},${60 + Math.sin(t * 0.7) * 20} ${480 + Math.cos(t * 0.4) * 30},${140 + Math.cos(t * 0.6) * 20} 720,100 C${960 + Math.sin(t * 0.3) * 30},${60 + Math.sin(t * 0.5) * 20} ${1200 + Math.cos(t * 0.6) * 30},${140 + Math.cos(t * 0.4) * 20} 1440,100 L1440,200 L0,200 Z`}
          fill="rgba(96,191,245,0.08)"
        />
      </svg>

      {/* Wave 2 — mid, lighter */}
      <svg
        viewBox="0 0 1440 200"
        style={{
          position: 'absolute',
          bottom: -10,
          left: 0,
          width: '200%',
          height: 100,
          transform: `translateX(${-Math.cos(t * 0.25) * 80 - 200}px)`,
          opacity: 0.3,
        }}
        preserveAspectRatio="none"
      >
        <path
          d={`M0,120 C${300 + Math.cos(t * 0.6) * 40},${80 + Math.cos(t * 0.8) * 25} ${600 + Math.sin(t * 0.5) * 40},${150 + Math.sin(t * 0.7) * 25} 900,110 C${1100 + Math.cos(t * 0.4) * 40},${70 + Math.cos(t * 0.6) * 25} 1300,160 1440,100 L1440,200 L0,200 Z`}
          fill="rgba(96,191,245,0.05)"
        />
      </svg>
    </AbsoluteFill>
  )
}

/* ── Light rays from above ─────────────────────────────────────────── */
function LightRays() {
  const frame = useCurrentFrame()

  const rays = [
    { x: 20, width: 80, angle: -8, delay: 0 },
    { x: 45, width: 120, angle: -3, delay: 40 },
    { x: 70, width: 60, angle: 5, delay: 20 },
    { x: 85, width: 90, angle: 8, delay: 60 },
  ]

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {rays.map((ray, i) => {
        const opacity = 0.02 + Math.sin((frame + ray.delay) * 0.02) * 0.015

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${ray.x}%`,
              top: '-20%',
              width: ray.width,
              height: '140%',
              background: `linear-gradient(180deg, rgba(255,206,0,${opacity * 2}) 0%, rgba(96,191,245,${opacity}) 50%, transparent 100%)`,
              transform: `rotate(${ray.angle}deg)`,
              transformOrigin: 'top center',
              filter: 'blur(30px)',
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

/* ── Main composition: Ambient Ocean ─────────────────────────────── */
export const OceanIntro: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #071120 0%, #0a1930 40%, #0d2240 70%, #071120 100%)',
      }}
    >
      {/* Underwater light rays */}
      <LightRays />

      {/* Floating ambient orbs */}
      <FloatingOrb x={15} y={30} size={120} color="rgba(96,191,245,0.15)" delay={0} speed={1} />
      <FloatingOrb x={75} y={60} size={80} color="rgba(255,206,0,0.08)" delay={50} speed={0.8} />
      <FloatingOrb x={50} y={20} size={150} color="rgba(96,191,245,0.1)" delay={100} speed={0.6} />
      <FloatingOrb x={85} y={15} size={60} color="rgba(215,0,0,0.08)" delay={30} speed={1.2} />
      <FloatingOrb x={30} y={70} size={100} color="rgba(96,191,245,0.1)" delay={70} speed={0.9} />

      {/* Rising bubbles */}
      <Bubbles />

      {/* Ocean waves at bottom */}
      <OceanWaves />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(7,17,32,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}

export default OceanIntro
