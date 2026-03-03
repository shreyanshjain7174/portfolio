'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const SECTIONS = [
  { label: 'HERO',   id: 'hero' },
  { label: 'ABOUT',  id: 'about' },
  { label: 'SKILLS', id: 'skills' },
  { label: 'QUESTS', id: 'projects' },
  { label: 'SAVE',   id: 'contact' },
]

export default function PixelNav() {
  const navRef = useRef<HTMLElement>(null)
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    gsap.fromTo(nav,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.8 }
    )

    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight
      if (docH <= 0) return
      const pct = Math.min(100, Math.round((window.scrollY / docH) * 100))
      setScrollPct(pct)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const hpColor = scrollPct > 70 ? 'var(--px-green)' : scrollPct > 35 ? 'var(--px-gold)' : 'var(--px-coral)'

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-6 py-3"
      style={{
        background: 'rgba(13, 13, 26, 0.95)',
        borderBottom: '2px solid var(--px-border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Logo */}
      <span className="font-pixel text-px-cyan text-glow-cyan hidden sm:block" style={{ fontSize: 9 }}>
        ◆ PQ
      </span>

      {/* Nav links */}
      <div className="flex gap-3 sm:gap-5">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="font-pixel text-px-dim hover:text-px-cyan transition-colors"
            style={{ fontSize: 7, cursor: 'none' }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* HP scroll bar */}
      <div className="flex items-center gap-2">
        <span className="font-pixel text-px-green hidden sm:block" style={{ fontSize: 7 }}>HP</span>
        <div className="w-20 stat-bar-track">
          <div
            className="stat-bar-fill"
            style={{ width: `${scrollPct}%`, background: hpColor, transition: 'width 0.15s linear, background 0.3s' }}
          />
        </div>
      </div>
    </nav>
  )
}
