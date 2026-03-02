import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  AbsoluteFill,
} from 'remotion'

/* ── Scene 1: Glitch name reveal ────────────────────────────────────── */
function GlitchNameReveal() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Name fades in over 0.8s with spring scale
  const nameSpring = spring({ frame, fps, config: { damping: 15, stiffness: 120 } })
  const nameOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: 'clamp',
  })

  // Glitch offset — rapid jitter for first 0.4s then settle
  const glitchX =
    frame < 0.4 * fps
      ? Math.sin(frame * 17) * interpolate(frame, [0, 0.4 * fps], [12, 0], { extrapolateRight: 'clamp' })
      : 0
  const glitchY =
    frame < 0.4 * fps
      ? Math.cos(frame * 23) * interpolate(frame, [0, 0.4 * fps], [8, 0], { extrapolateRight: 'clamp' })
      : 0

  // Scanline distortion — horizontal slice offset
  const scanlineOffset = frame < 0.3 * fps ? Math.sin(frame * 31) * 3 : 0

  // Subtitle fade in after name
  const subtitleOpacity = interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const subtitleY = interpolate(frame, [0.6 * fps, 1.2 * fps], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      {/* Glitch name */}
      <div
        style={{
          opacity: nameOpacity,
          transform: `scale(${nameSpring}) translate(${glitchX}px, ${glitchY}px)`,
          fontFamily: 'Bangers, cursive',
          fontSize: 72,
          color: '#00ff41',
          textShadow:
            `0 0 10px #00ff41, 0 0 30px rgba(0,255,65,0.4), ${scanlineOffset}px 0 rgba(255,45,85,0.3), ${-scanlineOffset}px 0 rgba(0,100,255,0.3)`,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          lineHeight: 1.1,
          textAlign: 'center' as const,
        }}
      >
        SHREYANSH
        <br />
        SANCHETI
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase' as const,
          marginTop: 16,
        }}
      >
        SOFTWARE ENGINEER · SYSTEMS · OSS
      </div>
    </AbsoluteFill>
  )
}

/* ── Scene 2: Terminal boot lines ────────────────────────────────────── */
function TerminalBoot() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const lines = [
    { text: '> initializing_portfolio.exe', color: 'rgba(0,255,65,0.6)' },
    { text: '[OK] loading distributed systems ...', color: 'rgba(255,255,255,0.7)' },
    { text: '[OK] loading open source contributions ...', color: 'rgba(255,255,255,0.7)' },
    { text: '[OK] loading infrastructure ...', color: 'rgba(255,255,255,0.7)' },
    { text: '█████████████████ 100% — SYSTEMS ONLINE', color: '#00ff41' },
  ]

  const charsPerSecond = 40

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 40px',
        backgroundColor: 'transparent',
      }}
    >
      {lines.map((line, idx) => {
        // Each line starts after the previous finishes
        const lineStartFrame = idx * 0.5 * fps
        const localFrame = frame - lineStartFrame

        if (localFrame < 0) return null

        // Typewriter: slice string based on frame
        const totalChars = line.text.length
        const charsToShow = Math.min(
          totalChars,
          Math.floor((localFrame / fps) * charsPerSecond)
        )
        const displayText = line.text.slice(0, charsToShow)

        // Blinking cursor on current line
        const showCursor = charsToShow < totalChars && Math.floor(localFrame / (fps * 0.3)) % 2 === 0

        return (
          <div
            key={idx}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 15,
              color: line.color,
              marginBottom: 6,
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap' as const,
              overflow: 'hidden',
            }}
          >
            {displayText}
            {showCursor && (
              <span style={{ color: '#00ff41' }}>▌</span>
            )}
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

/* ── Scene 3: Power stats reveal ────────────────────────────────────── */
function PowerStats() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const stats = [
    { label: 'THROUGHPUT', value: '400G+', delay: 0 },
    { label: 'CEPH PRs', value: '15+', delay: 0.2 },
    { label: 'K8S VMs', value: '500+', delay: 0.4 },
    { label: 'UPTIME', value: '99.9%', delay: 0.6 },
  ]

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        backgroundColor: 'transparent',
      }}
    >
      {stats.map((stat, idx) => {
        const entrySpring = spring({
          frame,
          fps,
          delay: stat.delay * fps,
          config: { damping: 12, stiffness: 100 },
        })

        const valueOpacity = interpolate(
          frame,
          [stat.delay * fps, (stat.delay + 0.5) * fps],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: `scale(${entrySpring}) translateY(${(1 - entrySpring) * 30}px)`,
            }}
          >
            <div
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: 42,
                color: '#ff2d55',
                textShadow: '0 0 15px rgba(255,45,85,0.5)',
                opacity: valueOpacity,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.15em',
                marginTop: 4,
                opacity: valueOpacity,
              }}
            >
              {stat.label}
            </div>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

/* ── Main composition: BootSequence ──────────────────────────────────── */
export const BootSequence: React.FC = () => {
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0d0d' }}>
      {/* Subtle grid overlay */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scene 1: Glitch name reveal (0-2.5s) */}
      <Sequence from={0} durationInFrames={Math.round(2.5 * fps)} premountFor={Math.round(0.5 * fps)}>
        <GlitchNameReveal />
      </Sequence>

      {/* Scene 2: Terminal boot (2s-5.5s) */}
      <Sequence from={Math.round(2 * fps)} durationInFrames={Math.round(3.5 * fps)} premountFor={Math.round(0.5 * fps)}>
        <TerminalBoot />
      </Sequence>

      {/* Scene 3: Power stats (5s-8s) */}
      <Sequence from={Math.round(5 * fps)} durationInFrames={Math.round(3 * fps)} premountFor={Math.round(0.5 * fps)}>
        <PowerStats />
      </Sequence>

      {/* Vignette overlay — always visible */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}

export default BootSequence
