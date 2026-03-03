'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Section quips ──────────────────────────────────────────── */
const QUIPS: Record<string, string> = {
  hero:     'READY PLAYER ONE!',
  about:    'LOADING STATS...',
  skills:   'CHECKING INVENTORY...',
  projects: 'REVIEWING QUESTS...',
  contact:  'SAVE POINT FOUND!',
}

/* ─── One frame of the pixel character ─────────────────────────
   We render 4 walk frames by shifting leg/arm positions via props.
   frame: 0 = stand, 1 = left step, 2 = stand, 3 = right step
   ─────────────────────────────────────────────────────────────── */
function CharFrame({ frame, flip }: { frame: number; flip: boolean }) {
  // Leg offsets per frame: [leftLegY, rightLegY, leftBootY, rightBootY]
  const legs: [number, number, number, number][] = [
    [12, 12, 14, 14], // stand
    [11, 13, 13, 15], // left stride
    [12, 12, 14, 14], // stand
    [13, 11, 15, 13], // right stride
  ]
  // Arm offsets: [leftArmY, rightArmY]
  const arms: [number, number][] = [
    [8, 8],
    [7, 9],
    [8, 8],
    [9, 7],
  ]

  const [llY, rlY, lbY, rbY] = legs[frame % 4]
  const [laY, raY] = arms[frame % 4]

  return (
    <svg
      viewBox="0 0 16 18"
      width="64"
      height="72"
      style={{ imageRendering: 'pixelated', display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="8" cy="17.5" rx="5" ry="0.7" fill="rgba(0,0,0,0.3)" />

      {/* Helmet/visor surround */}
      <rect x="5" y="1" width="6" height="1" fill="#7B2FBE" />
      <rect x="4" y="2" width="1" height="5" fill="#7B2FBE" />
      <rect x="11" y="2" width="1" height="5" fill="#7B2FBE" />
      <rect x="5" y="7" width="6" height="1" fill="#7B2FBE" />

      {/* Face */}
      <rect x="5" y="2" width="6" height="5" fill="#E8D5C0" />

      {/* Eyes — cyan with pupil */}
      <rect x="6" y="3" width="2" height="2" fill="#00F5FF" />
      <rect x="9" y="3" width="2" height="2" fill="#00F5FF" />
      <rect x="6" y="3" width="1" height="1" fill="#004466" />
      <rect x="9" y="3" width="1" height="1" fill="#004466" />

      {/* Smile */}
      <rect x="6" y="6" width="4" height="1" fill="#c47a5a" />
      <rect x="6" y="6" width="1" height="1" fill="transparent" />
      <rect x="9" y="6" width="1" height="1" fill="transparent" />

      {/* Body */}
      <rect x="4" y="8" width="8" height="4" fill="#7B2FBE" />
      {/* Chest code badge */}
      <rect x="6" y="9" width="4" height="1" fill="#00F5FF" />
      <rect x="6" y="10" width="2" height="1" fill="#FFD700" />
      <rect x="9" y="10" width="1" height="1" fill="#FFD700" />

      {/* Left arm */}
      <rect x="2" y={laY} width="2" height="3" fill="#7B2FBE" />
      <rect x="2" y={laY + 3} width="2" height="1" fill="#E8D5C0" />

      {/* Right arm */}
      <rect x="12" y={raY} width="2" height="3" fill="#7B2FBE" />
      <rect x="12" y={raY + 3} width="2" height="1" fill="#E8D5C0" />

      {/* Left leg */}
      <rect x="5" y={llY} width="2" height="3" fill="#1A1A3E" />
      {/* Left boot */}
      <rect x="4" y={lbY} width="3" height="1" fill="#7B2FBE" />

      {/* Right leg */}
      <rect x="9" y={rlY} width="2" height="3" fill="#1A1A3E" />
      {/* Right boot */}
      <rect x="9" y={rbY} width="3" height="1" fill="#7B2FBE" />
    </svg>
  )
}

/* ─── Speech bubble ──────────────────────────────────────────── */
function Bubble({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: 6,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Bubble body */}
      <div
        className="font-pixel"
        style={{
          fontSize: 6,
          padding: '5px 8px',
          background: 'var(--px-surface)',
          border: '2px solid var(--px-cyan)',
          color: 'var(--px-cyan)',
          boxShadow: '0 0 8px var(--px-cyan-dim)',
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
      {/* Tail */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '5px solid var(--px-cyan)',
        }} />
      </div>
    </div>
  )
}

/* ─── Main runner ────────────────────────────────────────────── */
export default function RunnerChar() {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const charRef   = useRef<HTMLDivElement>(null)
  const [frame, setFrame]   = useState(0)
  const [flip, setFlip]     = useState(false)
  const [airborne, setAirborne] = useState(false)
  const [quip, setQuip]     = useState('')
  const [showQuip, setShowQuip] = useState(false)
  const [visible, setVisible]   = useState(false)

  /* Walk-cycle ticker */
  useEffect(() => {
    const id = setInterval(() => {
      if (!airborne) setFrame(f => (f + 1) % 4)
    }, 120)
    return () => clearInterval(id)
  }, [airborne])

  /* GSAP: drive x position based on scroll, trigger jump on section change */
  useEffect(() => {
    const wrap = wrapRef.current
    const char = charRef.current
    if (!wrap || !char) return

    const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact']
    let currentSection = ''

    const showSection = (id: string) => {
      if (id === currentSection) return
      currentSection = id

      // Show runner when leaving hero
      if (id !== 'hero') setVisible(true)

      // Jump + new quip
      setFlip(false)
      setAirborne(true)
      setShowQuip(false)

      gsap.fromTo(char,
        { y: 0 },
        {
          y: -48,
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            setAirborne(false)
            setQuip(QUIPS[id] ?? '')
            setShowQuip(true)
            // Hide quip after 2.5 s
            setTimeout(() => setShowQuip(false), 2500)
          },
        }
      )

      // Run across screen
      const vw = window.innerWidth
      gsap.fromTo(wrap,
        { x: -80 },
        { x: vw + 20, duration: 3.5, ease: 'none',
          onStart: () => setFlip(false),
          onComplete: () => {
            // bounce back from right
            setFlip(true)
            gsap.fromTo(wrap,
              { x: vw + 20 },
              { x: vw * 0.5 - 32, duration: 1.2, ease: 'power2.out' }
            )
          },
        }
      )
    }

    SECTIONS.forEach(id => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 60%',
        onEnter: () => showSection(id),
        onEnterBack: () => showSection(id),
      })
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  if (!visible) return null

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        bottom: 20,
        left: 0,
        zIndex: 500,
        pointerEvents: 'none',
        width: 64,
      }}
    >
      <div ref={charRef} style={{ position: 'relative' }}>
        <Bubble text={quip} visible={showQuip} />
        <CharFrame frame={frame} flip={flip} />
      </div>
    </div>
  )
}
