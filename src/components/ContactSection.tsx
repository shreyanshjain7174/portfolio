'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Link {
  label: string
  display: string
  href: string
}

const LINKS: Link[] = [
  { label: 'Email',    display: 'shreyansh@sancheti.dev',            href: 'mailto:shreyansh@sancheti.dev' },
  { label: 'GitHub',   display: 'github.com/007ssancheti',           href: 'https://github.com/007ssancheti' },
  { label: 'LinkedIn', display: 'linkedin.com/in/shreyanshsancheti', href: 'https://linkedin.com/in/shreyanshsancheti' },
]

export default function ContactSection() {
  const [cursor, setCursor] = useState<number | null>(null)
  const [phase, setPhase] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleSave = () => {
    if (phase !== 'idle') return
    setPhase('saving')
    setTimeout(() => setPhase('saved'), 1800)
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24"
      style={{ background: 'var(--px-bg)' }}
    >
      {/* Section label */}
      <div className="max-w-4xl mx-auto w-full mb-16">
        <div className="flex items-center gap-4">
          <span className="font-pixel text-px-cyan" style={{ fontSize: 8 }}>05.</span>
          <h2 className="font-pixel text-px-gold text-glow-gold" style={{ fontSize: 'clamp(14px, 2.5vw, 24px)' }}>
            SAVE POINT
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--px-border)' }} />
        </div>
      </div>

      {/* Crystal */}
      <div className="mb-10 text-center select-none" aria-hidden="true">
        <motion.div
          className="font-pixel"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: 'clamp(40px, 8vw, 72px)', color: 'var(--px-cyan)', display: 'inline-block' }}
        >
          ✦
        </motion.div>
        <p className="font-pixel text-px-cyan text-glow-cyan blink mt-3" style={{ fontSize: 9 }}>
          SAVE POINT REACHED
        </p>
      </div>

      {/* Panel */}
      <div className="pixel-border-gold p-8 w-full max-w-sm" style={{ background: 'var(--px-surface)' }}>
        <div className="font-pixel text-px-gold mb-6" style={{ fontSize: 9 }}>╔══ CONTACT ══╗</div>

        {/* RPG link menu */}
        <div className="space-y-2 mb-8">
          {LINKS.map((lk, i) => (
            <a
              key={lk.label}
              href={lk.href}
              className="flex items-center gap-3 p-3 group transition-colors no-underline"
              style={{ border: '1px solid var(--px-border)', cursor: 'none', display: 'flex' }}
              onMouseEnter={() => setCursor(i)}
              onMouseLeave={() => setCursor(null)}
            >
              <span
                className="font-pixel text-px-cyan"
                style={{ fontSize: 10, visibility: cursor === i ? 'visible' : 'hidden', flexShrink: 0 }}
              >
                ▶
              </span>
              <div>
                <div
                  className="font-pixel transition-colors"
                  style={{ fontSize: 8, color: cursor === i ? 'var(--px-cyan)' : 'var(--px-text)' }}
                >
                  {lk.label}
                </div>
                <div className="font-terminal text-px-dim" style={{ fontSize: 16 }}>
                  {lk.display}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Save button */}
        <button
          className="px-btn w-full"
          style={{ fontSize: 9, cursor: phase !== 'idle' ? 'default' : 'none' }}
          onClick={handleSave}
          disabled={phase !== 'idle'}
          aria-live="polite"
        >
          {phase === 'saved' ? '✓ SAVED!' : phase === 'saving' ? 'SAVING...' : "LET'S CONNECT"}
        </button>

        {/* Saving progress bar */}
        <AnimatedSavingBar visible={phase === 'saving'} />
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center">
        <div className="font-pixel text-px-dim" style={{ fontSize: 7 }}>BUILT WITH PIXELS &amp; PASSION</div>
        <div className="font-pixel mt-2" style={{ fontSize: 6, color: 'var(--px-border)' }}>
          © 2026 SHREYANSH SANCHETI · ALL RIGHTS RESERVED
        </div>
      </footer>
    </section>
  )
}

function AnimatedSavingBar({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="mt-4">
      <div className="font-pixel text-px-dim mb-1" style={{ fontSize: 7 }}>SAVING PROGRESS...</div>
      <div className="stat-bar-track">
        <motion.div
          className="stat-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.6, ease: 'linear' }}
          style={{ background: 'var(--px-gold)' }}
        />
      </div>
    </div>
  )
}
