'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import PixelChar from './PixelChar'

const PixelCanvas = dynamic(() => import('./PixelCanvas'), { ssr: false })

const TITLE = 'SHREYANSH SANCHETI'
const SUBTITLE = 'FULL STACK DEVELOPER'

export default function HeroSection() {
  const lettersRef = useRef<HTMLSpanElement[]>([])
  const subtitleRef = useRef<HTMLSpanElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const charRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let destroyed = false

    const run = async () => {
      const { animate, stagger } = await import('animejs')
      if (destroyed) return

      // Letters stagger in
      animate(lettersRef.current.filter(Boolean), {
        translateY: [32, 0],
        opacity: [0, 1],
        duration: 500,
        delay: stagger(50, { start: 600 }),
        ease: 'easeOutExpo',
      })

      // Character slides up
      if (charRef.current) {
        animate(charRef.current, {
          translateY: [48, 0],
          opacity: [0, 1],
          duration: 900,
          delay: 900,
          ease: 'easeOutBack',
        })
      }

      // Typewriter subtitle
      const subEl = subtitleRef.current
      if (subEl) {
        subEl.textContent = ''
        let i = 0
        const delay = 1200
        setTimeout(() => {
          const id = setInterval(() => {
            if (destroyed) { clearInterval(id); return }
            if (i < SUBTITLE.length) {
              subEl.textContent += SUBTITLE[i]
              i++
            } else {
              clearInterval(id)
              // CTA fades in after typing done
              if (ctaRef.current) {
                animate(ctaRef.current, {
                  opacity: [0, 1],
                  translateY: [16, 0],
                  duration: 600,
                  ease: 'easeOutQuad',
                })
              }
            }
          }, 70)
        }, delay)
      }
    }

    run()
    return () => { destroyed = true }
  }, [])

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-center px-4"
      style={{ background: 'var(--px-bg)' }}
    >
      {/* Pixel grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(var(--px-border) 1px, transparent 1px), linear-gradient(90deg, var(--px-border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.15,
        }}
        aria-hidden="true"
      />

      <PixelCanvas />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Title */}
        <h1
          className="flex flex-wrap justify-center"
          aria-label={TITLE}
          style={{ gap: '0.15em' }}
        >
          {TITLE.split('').map((ch, i) =>
            ch === ' ' ? (
              <span key={i} style={{ width: '0.6em', display: 'inline-block' }} />
            ) : (
              <span
                key={i}
                ref={el => { if (el) lettersRef.current[i] = el }}
                className="font-pixel text-px-cyan text-glow-cyan"
                style={{
                  fontSize: 'clamp(22px, 4.5vw, 52px)',
                  opacity: 0,
                  display: 'inline-block',
                  lineHeight: 1.3,
                }}
              >
                {ch}
              </span>
            )
          )}
        </h1>

        {/* Subtitle */}
        <div className="flex items-center gap-1 font-pixel text-px-gold" style={{ fontSize: 'clamp(8px, 1.5vw, 14px)' }}>
          <span ref={subtitleRef} />
          <span className="blink">▮</span>
        </div>

        {/* Pixel character */}
        <div ref={charRef} style={{ opacity: 0 }}>
          <PixelChar />
        </div>

        {/* CTA */}
        <div ref={ctaRef} style={{ opacity: 0 }} className="flex flex-col items-center gap-4 mt-2">
          <p className="font-pixel text-px-dim blink" style={{ fontSize: 9 }}>
            ▼ SCROLL TO BEGIN ▼
          </p>
        </div>
      </div>

      {/* Corner HUD decorations */}
      <div className="absolute bottom-8 left-6 font-pixel text-px-dim text-left" style={{ fontSize: 7 }}>
        LVL 99<br />CLASS: DEV
      </div>
      <div className="absolute bottom-8 right-6 font-pixel text-px-dim text-right" style={{ fontSize: 7 }}>
        EXP: MAX<br />RANK: S+
      </div>
    </section>
  )
}
