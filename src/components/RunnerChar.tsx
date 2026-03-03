'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Section info cards ─────────────────────────────────────── */
const SECTION_INFO: Record<string, { title: string; lines: string[] }> = {
  about: {
    title: 'ABOUT LOADED',
    lines: ['SHREYANSH SANCHETI', 'FULL STACK DEV · LVL 5', 'RANK: S+'],
  },
  skills: {
    title: 'INVENTORY',
    lines: ['15 SKILLS EQUIPPED', 'TOP: TYPESCRIPT 95/100', 'ALL SLOTS ACTIVE'],
  },
  projects: {
    title: 'QUEST LOG',
    lines: ['3 QUESTS COMPLETED', '1 LEGENDARY · 1 EPIC', '1 RARE QUEST'],
  },
  contact: {
    title: 'SAVE POINT',
    lines: ['PROGRESS SAVED!', 'CONNECT: GITHUB · LINKEDIN', 'READY TO COLLAB'],
  },
}

/* ─── Upgraded sprite — 20×26 viewBox ───────────────────────── */
function RunSprite({ frame, squish, flip }: { frame: number; squish: boolean; flip: boolean }) {
  const cycle = [
    { la: 0, ra: 0, ll: 0, rl: 0 },
    { la:-2, ra: 2, ll:-3, rl: 3 },
    { la:-1, ra: 1, ll:-1, rl: 1 },
    { la: 0, ra: 0, ll: 0, rl: 0 },
    { la: 2, ra:-2, ll: 3, rl:-3 },
    { la: 1, ra:-1, ll: 1, rl:-1 },
  ]
  const f = cycle[frame % 6]
  const sy = squish ? 1.15 : 1
  const sx = squish ? 0.88 : 1

  return (
    <svg
      viewBox="0 0 20 28"
      width="80"
      height="112"
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        transform: `scaleX(${flip ? -sx : sx}) scaleY(${sy})`,
        transformOrigin: 'bottom center',
        transition: 'transform 0.08s',
      }}
      aria-hidden="true"
    >
      {/* Helmet */}
      <rect x="6"  y="1"  width="8"  height="1"  fill="#7B2FBE" />
      <rect x="5"  y="2"  width="1"  height="6"  fill="#7B2FBE" />
      <rect x="14" y="2"  width="1"  height="6"  fill="#7B2FBE" />
      <rect x="6"  y="8"  width="8"  height="1"  fill="#7B2FBE" />
      {/* Face */}
      <rect x="6"  y="2"  width="8"  height="6"  fill="#E8D5C0" />
      {/* Eyes */}
      <rect x="7"  y="3"  width="2"  height="2"  fill="#00F5FF" />
      <rect x="11" y="3"  width="2"  height="2"  fill="#00F5FF" />
      <rect x="7"  y="3"  width="1"  height="1"  fill="#003355" />
      <rect x="11" y="3"  width="1"  height="1"  fill="#003355" />
      <rect x="8"  y="3"  width="1"  height="1"  fill="rgba(255,255,255,0.5)" />
      <rect x="12" y="3"  width="1"  height="1"  fill="rgba(255,255,255,0.5)" />
      {/* Mouth */}
      <rect x="8"  y="7"  width="4"  height="1"  fill="#c47a5a" />
      {/* Neck */}
      <rect x="8"  y="9"  width="4"  height="1"  fill="#E8D5C0" />
      {/* Body */}
      <rect x="5"  y="10" width="10" height="6"  fill="#7B2FBE" />
      <rect x="7"  y="11" width="6"  height="1"  fill="#00F5FF" />
      <rect x="7"  y="12" width="3"  height="1"  fill="#FFD700" />
      {/* Belt */}
      <rect x="5"  y="16" width="10" height="1"  fill="#FFD700" />
      {/* Left arm */}
      <rect x="2"  y={10 + f.la} width="3" height="4" fill="#7B2FBE" />
      <rect x="2"  y={14 + f.la} width="3" height="2" fill="#E8D5C0" />
      {/* Right arm */}
      <rect x="15" y={10 + f.ra} width="3" height="4" fill="#7B2FBE" />
      <rect x="15" y={14 + f.ra} width="3" height="2" fill="#E8D5C0" />
      {/* Left leg */}
      <rect x="6"  y={17 + f.ll} width="3" height="4" fill="#1A1A3E" />
      <rect x="5"  y={20 + f.ll} width="4" height="2" fill="#7B2FBE" />
      {/* Right leg */}
      <rect x="11" y={17 + f.rl} width="3" height="4" fill="#1A1A3E" />
      <rect x="11" y={20 + f.rl} width="4" height="2" fill="#7B2FBE" />
    </svg>
  )
}

/* ─── Dust particles on landing ─────────────────────────────── */
function DustPuff({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
      {[-16, -8, 8, 16].map((x, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 4, height: 4,
          background: 'var(--px-purple-dim)',
          bottom: 0,
          left: x,
          animation: `dustPuff 0.4s ${i * 0.04}s ease-out forwards`,
        }} />
      ))}
      <style>{`
        @keyframes dustPuff {
          0%   { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-12px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

/* ─── Info panel beside the character ───────────────────────── */
function InfoPanel({ data, show, flip }: { data: { title: string; lines: string[] } | null; show: boolean; flip: boolean }) {
  if (!data) return null
  return (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      [flip ? 'right' : 'left']: 0,
      marginBottom: 10,
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.25s, transform 0.25s',
      pointerEvents: 'none',
      minWidth: 160,
    }}>
      <div className="pixel-border-cyan" style={{ background: 'rgba(13,13,26,0.95)', padding: '8px 12px' }}>
        <div className="font-pixel text-px-gold" style={{ fontSize: 7, marginBottom: 4 }}>
          ◆ {data.title}
        </div>
        {data.lines.map((line, i) => (
          <div key={i} className="font-terminal text-px-text" style={{ fontSize: 16, lineHeight: 1.3 }}>
            <span className="text-px-cyan">{'> '}</span>{line}
          </div>
        ))}
      </div>
      {/* Arrow pointing down to character */}
      <div style={{ display: 'flex', justifyContent: flip ? 'flex-end' : 'flex-start', paddingLeft: flip ? 0 : 16, paddingRight: flip ? 16 : 0 }}>
        <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid var(--px-cyan)' }} />
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────── */
export default function RunnerChar() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const charRef  = useRef<HTMLDivElement>(null)
  const [frame, setFrame]     = useState(0)
  const [flip, setFlip]       = useState(false)
  const [squish, setSquish]   = useState(false)
  const [dust, setDust]       = useState(false)
  const [visible, setVisible] = useState(false)
  const [info, setInfo]       = useState<{ title: string; lines: string[] } | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const current = useRef('')
  const animating = useRef(false)

  /* Walk-cycle ticker */
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % 6), 100)
    return () => clearInterval(id)
  }, [])

  /* Section runner logic */
  useEffect(() => {
    const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact']

    const enter = (id: string) => {
      if (id === current.current || animating.current) return
      current.current = id
      if (id === 'hero') return

      setVisible(true)
      animating.current = true
      setShowInfo(false)

      const vw = window.innerWidth
      const wrap = wrapRef.current
      const char = charRef.current
      if (!wrap || !char) return

      // Direction — alternate left/right for variety
      const fromLeft = SECTIONS.indexOf(id) % 2 === 1
      setFlip(!fromLeft)

      const startX = fromLeft ? -100 : vw + 100
      const endX   = fromLeft ? vw * 0.45 : vw * 0.55 - 80

      const tl = gsap.timeline({
        onComplete: () => { animating.current = false }
      })

      // Run in
      tl.fromTo(wrap,
        { x: startX },
        {
          x: endX,
          duration: 1.4,
          ease: 'power2.out',
          onStart: () => { setFlip(!fromLeft) },
        }
      )
      // Jump
      .to(char,
        { y: -52, duration: 0.28, ease: 'power2.out' },
        '-=0.4'
      )
      .to(char,
        {
          y: 0,
          duration: 0.22,
          ease: 'bounce.out',
          onComplete: () => {
            // Land squish + dust
            setSquish(true)
            setDust(true)
            setTimeout(() => { setSquish(false); setDust(false) }, 300)

            // Show info panel
            const sectionInfo = SECTION_INFO[id]
            if (sectionInfo) {
              setInfo(sectionInfo)
              setShowInfo(true)
              setFlip(fromLeft) // face inward
              setTimeout(() => {
                setShowInfo(false)
                // Run off after showing info
                setTimeout(() => {
                  const exitX = fromLeft ? vw + 100 : -100
                  setFlip(fromLeft)
                  gsap.to(wrap, { x: exitX, duration: 0.9, ease: 'power2.in' })
                }, 200)
              }, 2400)
            }
          },
        }
      )
    }

    SECTIONS.forEach(id => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 55%',
        onEnter:     () => enter(id),
        onEnterBack: () => enter(id),
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
        bottom: 16,
        left: 0,
        zIndex: 500,
        pointerEvents: 'none',
        width: 80,
      }}
    >
      <div ref={charRef} style={{ position: 'relative' }}>
        <InfoPanel data={info} show={showInfo} flip={flip} />
        <DustPuff show={dust} />
        <RunSprite frame={frame} squish={squish} flip={flip} />
      </div>
    </div>
  )
}
