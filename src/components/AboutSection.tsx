'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { label: 'STR', name: 'Problem Solving', value: 92, color: 'var(--px-coral)' },
  { label: 'INT', name: 'Architecture',    value: 90, color: 'var(--px-cyan)' },
  { label: 'DEX', name: 'Frontend Craft',  value: 87, color: 'var(--px-green)' },
  { label: 'WIS', name: 'System Design',   value: 88, color: 'var(--px-gold)' },
  { label: 'CHA', name: 'Collaboration',   value: 95, color: 'var(--px-purple)' },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const barRefs = useRef<(HTMLDivElement | null)[]>([])
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      barRefs.current.forEach((bar, i) => {
        if (!bar) return
        const fill = bar.querySelector<HTMLElement>('.stat-bar-fill')
        if (!fill) return
        gsap.fromTo(
          fill,
          { width: '0%' },
          {
            width: `${STATS[i].value}%`,
            duration: 1.2,
            delay: i * 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              once: true,
            },
          }
        )
      })

      if (counterRef.current) {
        const obj = { val: 0 }
        gsap.to(obj, {
          val: 5,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          onUpdate() {
            if (counterRef.current) counterRef.current.textContent = String(Math.round(obj.val))
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center px-4 py-24"
      style={{ background: 'var(--px-surface)' }}
    >
      {/* Section label */}
      <div className="max-w-5xl mx-auto w-full mb-12">
        <div className="flex items-center gap-4">
          <span className="font-pixel text-px-cyan" style={{ fontSize: 8 }}>02.</span>
          <h2 className="font-pixel text-px-gold text-glow-gold" style={{ fontSize: 'clamp(14px, 2.5vw, 24px)' }}>
            CHARACTER STATS
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--px-border)' }} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-10 items-start">

        {/* Bio panel */}
        <div className="pixel-border-cyan p-6" style={{ background: 'var(--px-bg)' }}>
          {/* Pixel portrait */}
          <div className="flex justify-center mb-6">
            <div className="p-3" style={{ border: '2px solid var(--px-border)' }}>
              <svg viewBox="0 0 32 32" width="128" height="128" style={{ imageRendering: 'pixelated', display: 'block' }}
                aria-label="Pixel portrait of Sunny">
                <rect width="32" height="32" fill="#16213E" />
                <rect x="10" y="4" width="12" height="12" fill="#E8D5C0" />
                <rect x="10" y="4" width="12" height="3" fill="#2D1B00" />
                <rect x="10" y="4" width="2" height="6" fill="#2D1B00" />
                <rect x="12" y="9" width="2" height="2" fill="#1A1A2E" />
                <rect x="18" y="9" width="2" height="2" fill="#1A1A2E" />
                <rect x="13" y="12" width="6" height="1" fill="#c47a5a" />
                <rect x="8" y="16" width="16" height="10" fill="#7B2FBE" />
                <rect x="12" y="18" width="8" height="1" fill="#00F5FF" />
                <rect x="12" y="20" width="5" height="1" fill="#FFD700" />
                <rect x="4" y="16" width="4" height="8" fill="#7B2FBE" />
                <rect x="24" y="16" width="4" height="8" fill="#7B2FBE" />
                <rect x="3" y="24" width="5" height="4" fill="#E8D5C0" />
                <rect x="24" y="24" width="5" height="4" fill="#E8D5C0" />
              </svg>
            </div>
          </div>
          <div className="text-center font-pixel text-px-cyan mb-4" style={{ fontSize: 8 }}>SUNNY.EXE</div>

          <div className="space-y-2 font-terminal text-px-text" style={{ fontSize: 20 }}>
            <p><span className="text-px-gold">{'>'}</span> Full Stack Developer</p>
            <p><span className="text-px-gold">{'>'}</span> <span ref={counterRef}>0</span>+ yrs experience</p>
            <p><span className="text-px-gold">{'>'}</span> React · Node · TypeScript</p>
            <p><span className="text-px-gold">{'>'}</span> Cloud-native thinker</p>
            <p><span className="text-px-gold">{'>'}</span> Pixel-perfect UI lover<span className="blink">_</span></p>
          </div>
        </div>

        {/* Stats panel */}
        <div className="pixel-border p-6" style={{ background: 'var(--px-bg)' }}>
          <div className="font-pixel text-px-cyan mb-6" style={{ fontSize: 9 }}>
            ╔══ STAT SHEET ══╗
          </div>

          <div className="space-y-5">
            {STATS.map((stat, i) => (
              <div key={stat.label} ref={el => { barRefs.current[i] = el }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className="font-pixel" style={{ fontSize: 8, color: stat.color, minWidth: 28 }}>
                      {stat.label}
                    </span>
                    <span className="font-terminal text-px-dim" style={{ fontSize: 18 }}>
                      {stat.name}
                    </span>
                  </div>
                  <span className="font-pixel text-px-text" style={{ fontSize: 8 }}>{stat.value}</span>
                </div>
                <div className="stat-bar-track">
                  <div
                    className="stat-bar-fill"
                    style={{ background: `linear-gradient(90deg, ${stat.color}66, ${stat.color})` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 flex justify-between font-pixel text-px-dim" style={{ fontSize: 7, borderTop: '1px solid var(--px-border)' }}>
            <span>CLASS: FULL STACK</span>
            <span>RANK: S+</span>
          </div>
        </div>
      </div>
    </section>
  )
}
