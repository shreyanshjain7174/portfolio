'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { animate } from 'animejs'
import dynamic from 'next/dynamic'
import { MangaGrid, MangaPanel } from '@/components/MangaPanel'
import { useTypewriter } from '@/hooks/useTypewriter'

/* ── Remotion Player: lazy-loaded to avoid SSR issues ────────────────── */
const BootPlayer = dynamic(() => import('@/components/remotion/BootPlayer'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        aspectRatio: '16/9',
        maxHeight: '340px',
        backgroundColor: '#0d0d0d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono, monospace)',
        color: 'rgba(0,255,65,0.3)',
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
      }}
    >
      LOADING CINEMATIC...
    </div>
  ),
})

/* ── Framer Motion: staggered panel entrance ────────────────────────── */
const panelEntrance = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.55, ease: 'easeOut' as const },
  }),
}

export default function Home() {
  /* ── Typewriter for BOOT SEQUENCE terminal lines ───────────────────── */
  const { displayedLines, isComplete } = useTypewriter({
    lines: [
      '$ sudo hire_me --force --no-regrets',
      '[██████████] 100%  —  SYSTEMS ONLINE',
    ],
    speed: 35,
    lineDelay: 500,
    startDelay: 800,
  })

  /* ── anime.js: progress bar fill + counter ─────────────────────────── */
  const progressBarRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    if (animatedRef.current) return
    animatedRef.current = true

    // Animate progress bar width from 0% to 80% (anime.js v4)
    if (progressBarRef.current) {
      animate(progressBarRef.current, {
        width: ['0%', '80%'],
        duration: 1800,
        delay: 600,
        ease: 'outExpo',
      })
    }

    // Animate counter from 0 to 9500 (anime.js v4)
    if (counterRef.current) {
      const el = counterRef.current
      const counter = { value: 0 }
      animate(counter, {
        value: [0, 9500],
        duration: 2000,
        delay: 600,
        ease: 'outExpo',
        onUpdate: () => {
          el.textContent = Math.round(counter.value).toLocaleString()
        },
      })
    }
  }, [])

  return (
    <main className="min-h-screen p-4 md:p-8">
      <MangaGrid>

        {/* ── Panel 1: Hero / Boot Sequence ─────────────────────────────────── */}
        <MangaPanel colSpan={2} label="BOOT SEQUENCE" variant="hero">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={panelEntrance}
            className="p-6 flex flex-col justify-center gap-3"
          >
            <h1
              style={{
                fontFamily: 'var(--font-manga, Bangers, cursive)',
                color: '#00ff41',
                textShadow:
                  '0 0 10px #00ff41, 0 0 25px rgba(0,255,65,0.4), 0 0 50px rgba(0,255,65,0.15)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: 1.1,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              SHREYANSH SANCHETI
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: 'rgba(255,255,255,0.45)',
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              SOFTWARE ENGINEER · DISTRIBUTED SYSTEMS · OSS CONTRIBUTOR
            </p>

            {/* Social links */}
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.7rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '0.25rem',
              }}
            >
              <a
                href="https://github.com/shreyanshjain7174"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(0,255,65,0.7)', textDecoration: 'none' }}
              >
                {'>'} github
              </a>
              <a
                href="https://linkedin.com/in/shreyansh-sancheti"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(0,255,65,0.7)', textDecoration: 'none' }}
              >
                {'>'} linkedin
              </a>
              <a
                href="https://instagram.com/shrey_sancheti"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(0,255,65,0.7)', textDecoration: 'none' }}
              >
                {'>'} instagram
              </a>
              <a
                href="mailto:hire.ssancheti@gmail.com"
                style={{ color: 'rgba(0,255,65,0.7)', textDecoration: 'none' }}
              >
                {'>'} mail
              </a>
            </div>

            {/* Typewriter terminal lines */}
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.8rem',
                marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                minHeight: '3rem',
              }}
            >
              {displayedLines.map((line, idx) => (
                <p
                  key={idx}
                  style={{
                    color:
                      idx === 0
                        ? 'rgba(0,255,65,0.6)'
                        : 'rgba(255,255,255,0.7)',
                    letterSpacing: idx === 1 ? '0.05em' : undefined,
                  }}
                >
                  {line}
                  {/* Blinking cursor on the line currently being typed */}
                  {!isComplete &&
                    idx === displayedLines.length - 1 && (
                      <span className="inline-block animate-cursor-blink ml-0.5">
                        ▌
                      </span>
                    )}
                </p>
              ))}
              {/* Persistent cursor after all lines typed */}
              {isComplete && (
                <p style={{ color: 'rgba(0,255,65,0.6)' }}>
                  <span className="inline-block animate-cursor-blink">▌</span>
                </p>
              )}
            </div>
          </motion.div>
        </MangaPanel>

        {/* ── Panel 2: Power Level ──────────────────────────────────────────── */}
        <MangaPanel label="POWER LEVEL" variant="accent">
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={panelEntrance}
            className="p-5 flex flex-col gap-2"
            style={{ minHeight: '200px' }}
          >
            {/* Animated progress bar using anime.js */}
            <div
              style={{
                position: 'relative',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '1.6rem',
                letterSpacing: '0.05em',
                overflow: 'hidden',
              }}
            >
              {/* Background — dim blocks */}
              <div style={{ color: 'rgba(255,255,255,0.08)' }}>
                ██████████
              </div>
              {/* Foreground — animated fill */}
              <div
                ref={progressBarRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '0%',
                  overflow: 'hidden',
                  color: '#ff2d55',
                  textShadow: '0 0 10px rgba(255,45,85,0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                ██████████
              </div>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.85rem',
              }}
            >
              <span ref={counterRef}>0</span> / 10,000
            </p>

            <p
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: '#FFD700',
                fontSize: '0.75rem',
                textShadow: '0 0 8px rgba(255,215,0,0.5)',
                letterSpacing: '0.1em',
                marginTop: '0.25rem',
              }}
            >
              ⚡ BOSS MODE: APPROACHING
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
              <span
                className="inline-block animate-glow-pulse"
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  color: '#00ff41',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  border: '1px solid rgba(0,255,65,0.4)',
                  padding: '2px 8px',
                  textShadow: '0 0 6px rgba(0,255,65,0.5)',
                }}
              >
                [ACTIVE]
              </span>
            </div>
          </motion.div>
        </MangaPanel>

        {/* ── Panel 3: Active Side Quests ───────────────────────────────────── */}
        <MangaPanel colSpan={3} label="ACTIVE SIDE QUESTS" variant="default">
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={panelEntrance}
            className="p-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Quest 1 — Arista / Networking */}
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  borderLeft: '2px solid rgba(0,255,65,0.25)',
                  paddingLeft: '0.75rem',
                }}
              >
                <p
                  style={{
                    color: '#ff2d55',
                    fontSize: '0.7rem',
                    marginBottom: '0.4rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  [!] QUEST #001
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.8rem',
                    lineHeight: 1.45,
                  }}
                >
                  Eliminate packet loss at 400G+ throughput
                </p>
                <p
                  style={{
                    color: 'rgba(0,255,65,0.5)',
                    fontSize: '0.65rem',
                    marginTop: '0.5rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  STATUS: ZERO PACKET DROP ACHIEVED
                </p>
              </div>

              {/* Quest 2 — Ceph / Open Source */}
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  borderLeft: '2px solid rgba(0,255,65,0.25)',
                  paddingLeft: '0.75rem',
                }}
              >
                <p
                  style={{
                    color: '#ff2d55',
                    fontSize: '0.7rem',
                    marginBottom: '0.4rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  [!] QUEST #002
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.8rem',
                    lineHeight: 1.45,
                  }}
                >
                  Ship 15+ PRs to Ceph upstream
                </p>
                <p
                  style={{
                    color: 'rgba(0,255,65,0.5)',
                    fontSize: '0.65rem',
                    marginTop: '0.5rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  STATUS: MERGED & DEPLOYED
                </p>
              </div>

              {/* Quest 3 — K8s / Infrastructure */}
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  borderLeft: '2px solid rgba(0,255,65,0.25)',
                  paddingLeft: '0.75rem',
                }}
              >
                <p
                  style={{
                    color: '#ff2d55',
                    fontSize: '0.7rem',
                    marginBottom: '0.4rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  [!] QUEST #003
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.8rem',
                    lineHeight: 1.45,
                  }}
                >
                  Orchestrate 500+ VMs on Kubernetes
                </p>
                <p
                  style={{
                    color: 'rgba(0,255,65,0.5)',
                    fontSize: '0.65rem',
                    marginTop: '0.5rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  STATUS: 99.9% UPTIME (ง •̀_•́)ง
                </p>
              </div>

            </div>

            {/* Footer — current status line */}
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: '#FFD700',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                textShadow: '0 0 8px rgba(255,215,0,0.4)',
              }}
            >
              {'>'} current_status:{' '}
              <span style={{ color: '#00ff41', textShadow: '0 0 6px rgba(0,255,65,0.4)' }}>
                &quot;SHIPPING CODE AT ARISTA + BUILDING INFRA AT XBATTERY&quot;
              </span>
            </div>
          </motion.div>
        </MangaPanel>

        {/* ── Panel 4: Cinematic Intro (Remotion) ──────────────────────────── */}
        <MangaPanel colSpan={3} label="CINEMATIC INTRO" variant="featured">
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={panelEntrance}
            className="p-4"
          >
            <BootPlayer />
          </motion.div>
        </MangaPanel>

      </MangaGrid>
    </main>
  )
}
