'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/* ─── Pixel character (24×24 viewBox, rendered big) ─────────── */
function BigSprite({ frame, flip }: { frame: number; flip: boolean }) {
  // 6-frame walk cycle — leg/arm offsets
  const cycle = [
    { la: 0, ra: 0, ll: 0, rl: 0 },  // stand
    { la:-2, ra: 2, ll:-2, rl: 2 },  // stride A
    { la:-1, ra: 1, ll:-1, rl: 1 },
    { la: 0, ra: 0, ll: 0, rl: 0 },  // stand
    { la: 2, ra:-2, ll: 2, rl:-2 },  // stride B
    { la: 1, ra:-1, ll: 1, rl:-1 },
  ]
  const f = cycle[frame % 6]

  return (
    <svg
      viewBox="0 0 24 28"
      width="128"
      height="149"
      style={{ imageRendering: 'pixelated', display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="12" cy="27" rx="7" ry="1" fill="rgba(0,0,0,0.35)" />

      {/* Helmet outer */}
      <rect x="7"  y="1"  width="10" height="1"  fill="#7B2FBE" />
      <rect x="6"  y="2"  width="1"  height="8"  fill="#7B2FBE" />
      <rect x="17" y="2"  width="1"  height="8"  fill="#7B2FBE" />
      <rect x="7"  y="10" width="10" height="1"  fill="#7B2FBE" />

      {/* Face */}
      <rect x="7"  y="2"  width="10" height="8"  fill="#E8D5C0" />

      {/* Eyes */}
      <rect x="8"  y="4"  width="3"  height="2"  fill="#00F5FF" />
      <rect x="13" y="4"  width="3"  height="2"  fill="#00F5FF" />
      <rect x="8"  y="4"  width="1"  height="1"  fill="#003355" />
      <rect x="13" y="4"  width="1"  height="1"  fill="#003355" />
      {/* Eye shine */}
      <rect x="10" y="4"  width="1"  height="1"  fill="rgba(255,255,255,0.6)" />
      <rect x="15" y="4"  width="1"  height="1"  fill="rgba(255,255,255,0.6)" />

      {/* Nose */}
      <rect x="11" y="6"  width="2"  height="1"  fill="#c47a5a" />

      {/* Mouth / smile */}
      <rect x="9"  y="8"  width="1"  height="1"  fill="#c47a5a" />
      <rect x="10" y="9"  width="4"  height="1"  fill="#c47a5a" />
      <rect x="14" y="8"  width="1"  height="1"  fill="#c47a5a" />

      {/* Neck */}
      <rect x="10" y="11" width="4"  height="1"  fill="#E8D5C0" />

      {/* Body */}
      <rect x="6"  y="12" width="12" height="7"  fill="#7B2FBE" />

      {/* Chest code badge */}
      <rect x="9"  y="13" width="6"  height="1"  fill="#00F5FF" />
      <rect x="9"  y="14" width="3"  height="1"  fill="#FFD700" />
      <rect x="13" y="14" width="2"  height="1"  fill="#FFD700" />
      <rect x="9"  y="15" width="5"  height="1"  fill="#00F5FF" />

      {/* Collar detail */}
      <rect x="9"  y="12" width="6"  height="1"  fill="#9B4FDE" />

      {/* Left arm */}
      <rect x="3"  y={12 + f.la} width="3" height="5" fill="#7B2FBE" />
      <rect x="3"  y={17 + f.la} width="3" height="2" fill="#E8D5C0" />

      {/* Right arm */}
      <rect x="18" y={12 + f.ra} width="3" height="5" fill="#7B2FBE" />
      <rect x="18" y={17 + f.ra} width="3" height="2" fill="#E8D5C0" />

      {/* Belt */}
      <rect x="6"  y="19" width="12" height="1"  fill="#FFD700" />

      {/* Left leg */}
      <rect x="7"  y={20 + f.ll} width="4" height="4" fill="#1A1A3E" />
      {/* Left boot */}
      <rect x="6"  y={23 + f.ll} width="5" height="2" fill="#7B2FBE" />

      {/* Right leg */}
      <rect x="13" y={20 + f.rl} width="4" height="4" fill="#1A1A3E" />
      {/* Right boot */}
      <rect x="13" y={23 + f.rl} width="5" height="2" fill="#7B2FBE" />
    </svg>
  )
}

/* ─── Stat line that types itself in ────────────────────────── */
function StatLine({ label, value, color, delay }: { label: string; value: string; color: string; delay: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setStarted(true)
      const full = `${label}: ${value}`
      let i = 0
      const id = setInterval(() => {
        setDisplayed(full.slice(0, ++i))
        if (i >= full.length) clearInterval(id)
      }, 35)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(t)
  }, [label, value, delay])

  return (
    <div
      className="font-pixel"
      style={{
        fontSize: 'clamp(7px, 1.2vw, 11px)',
        color: started ? color : 'transparent',
        lineHeight: 2,
        minHeight: '2em',
        letterSpacing: '0.05em',
      }}
    >
      <span style={{ color: 'var(--px-text-dim)' }}>{'> '}</span>
      {displayed}
      {started && displayed.length < `${label}: ${value}`.length && (
        <span className="blink">_</span>
      )}
    </div>
  )
}

/* ─── Main intro overlay ─────────────────────────────────────── */
export default function PlayerIntro({ onDismiss }: { onDismiss: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const charRef    = useRef<HTMLDivElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState(0)
  const [running, setRunning] = useState(false)
  const dismissed = useRef(false)

  /* Walk cycle */
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % 6), 110)
    return () => clearInterval(id)
  }, [])

  /* Walk-in animation */
  useEffect(() => {
    const char  = charRef.current
    const panel = panelRef.current
    const cta   = ctaRef.current
    if (!char || !panel || !cta) return

    const tl = gsap.timeline()

    // Character walks in from left
    tl.fromTo(char,
      { x: -200, opacity: 1 },
      { x: 0, duration: 1.1, ease: 'power2.out', delay: 0.3 }
    )
    // Panel slides up
    .fromTo(panel,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    // CTA fades in
    .fromTo(cta,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '+=1.8'
    )
  }, [])

  /* Dismiss: run off + pixel wipe */
  const dismiss = () => {
    if (dismissed.current) return
    dismissed.current = true
    setRunning(true)

    const char    = charRef.current
    const overlay = overlayRef.current
    if (!char || !overlay) { onDismiss(); return }

    const tl = gsap.timeline({ onComplete: onDismiss })

    // Sprint off to the right
    tl.to(char, { x: window.innerWidth + 200, duration: 0.7, ease: 'power3.in' })
    // Pixel-wipe: overlay collapses to a horizontal bar then vanishes
    .to(overlay, { scaleY: 0.015, duration: 0.35, ease: 'power4.in', transformOrigin: 'center center' }, '-=0.1')
    .to(overlay, { opacity: 0, duration: 0.2 })
  }

  /* Scroll or key to dismiss */
  useEffect(() => {
    const onScroll = () => dismiss()
    const onKey    = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') dismiss() }
    window.addEventListener('wheel',    onScroll, { once: true, passive: true })
    window.addEventListener('touchmove', onScroll, { once: true, passive: true })
    window.addEventListener('keydown',  onKey,   { once: true })
    return () => {
      window.removeEventListener('wheel',     onScroll)
      window.removeEventListener('touchmove', onScroll)
      window.removeEventListener('keydown',   onKey)
    }
  }, [])

  const STATS = [
    { label: 'PLAYER',  value: 'SHREYANSH SANCHETI',          color: 'var(--px-cyan)',   delay: 1400 },
    { label: 'CLASS',   value: 'FULL STACK DEVELOPER',         color: 'var(--px-gold)',   delay: 2100 },
    { label: 'LVL',     value: '5 YRS  |  EXP: 9999',         color: 'var(--px-green)',  delay: 2800 },
    { label: 'STACK',   value: 'REACT · NODE · TYPESCRIPT',   color: 'var(--px-purple)', delay: 3500 },
    { label: 'SPECIAL', value: 'PIXEL-PERFECT UI OBSESSION',  color: 'var(--px-coral)',  delay: 4200 },
  ]

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99998] flex items-center justify-center"
      style={{ background: 'var(--px-bg)' }}
    >
      {/* Pixel grid */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(var(--px-border) 1px, transparent 1px), linear-gradient(90deg, var(--px-border) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} aria-hidden="true" />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 font-pixel text-px-dim" style={{ fontSize: 7 }}>◆ PIXEL QUEST v1.0</div>
      <div className="absolute top-6 right-6 font-pixel text-px-dim" style={{ fontSize: 7 }}>INSERT COIN ▮</div>
      <div className="absolute bottom-6 left-6 font-pixel text-px-dim" style={{ fontSize: 7 }}>© 2026</div>
      <div className="absolute bottom-6 right-6 font-pixel text-px-dim blink" style={{ fontSize: 7 }}>NEW GAME</div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16 px-6 max-w-4xl w-full">

        {/* Character */}
        <div ref={charRef} className="flex-shrink-0" style={{ transform: 'translateX(-200px)' }}>
          <div style={{ position: 'relative' }}>
            {/* Glow under character */}
            <div style={{
              position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
              width: 120, height: 20,
              background: 'radial-gradient(ellipse, rgba(123,47,190,0.5) 0%, transparent 70%)',
            }} aria-hidden="true" />
            <BigSprite frame={running ? frame : Math.floor(frame / 2)} flip={running} />
          </div>

          {/* Platform */}
          <div style={{
            marginTop: -4,
            width: 128,
            height: 8,
            background: 'linear-gradient(var(--px-purple), #4a1a7a)',
            boxShadow: '0 4px 0 #2a0a4a, 0 0 20px rgba(123,47,190,0.4)',
          }} />
          <div style={{
            width: 128, height: 4,
            background: '#2a0a4a',
          }} />
        </div>

        {/* Info panel */}
        <div ref={panelRef} className="flex-1" style={{ opacity: 0 }}>
          {/* Panel header */}
          <div className="pixel-border-cyan p-5" style={{ background: 'rgba(13,13,26,0.9)' }}>
            <div className="font-pixel text-px-cyan mb-4" style={{ fontSize: 8 }}>
              ╔══ PLAYER SELECT ══╗
            </div>

            {/* Stat lines */}
            <div className="space-y-0">
              {STATS.map(s => (
                <StatLine key={s.label} {...s} />
              ))}
            </div>

            {/* HP / MP bars */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-px-green" style={{ fontSize: 7, minWidth: 20 }}>HP</span>
                <div className="stat-bar-track flex-1">
                  <div className="stat-bar-fill" style={{ width: '100%', background: 'var(--px-green)', transition: 'width 2s 4.5s ease-out' }} />
                </div>
                <span className="font-pixel text-px-dim" style={{ fontSize: 7 }}>999/999</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-px-cyan" style={{ fontSize: 7, minWidth: 20 }}>MP</span>
                <div className="stat-bar-track flex-1">
                  <div className="stat-bar-fill" style={{ width: '92%', background: 'var(--px-cyan)', transition: 'width 2s 4.8s ease-out' }} />
                </div>
                <span className="font-pixel text-px-dim" style={{ fontSize: 7 }}>920/999</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-6 text-center" style={{ opacity: 0 }}>
            <button
              onClick={dismiss}
              className="px-btn"
              style={{ fontSize: 9, cursor: 'none' }}
            >
              ▶ START GAME
            </button>
            <p className="font-pixel text-px-dim blink mt-3" style={{ fontSize: 8 }}>
              OR SCROLL TO CONTINUE
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
