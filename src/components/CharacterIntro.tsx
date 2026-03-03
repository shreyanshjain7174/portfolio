'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SkillBar } from './SkillBar'

gsap.registerPlugin(ScrollTrigger)

const skills = [
  { label: 'Systems / Networking',   percentage: 90, color: 'var(--color-luffy-red)' },
  { label: 'Infrastructure / K8s',    percentage: 88, color: 'var(--color-ocean)' },
  { label: 'React / TypeScript',      percentage: 82, color: 'var(--color-gold)' },
  { label: 'Go / Python',             percentage: 85, color: 'var(--color-sky-deep)' },
  { label: 'Open Source (15+ PRs)',   percentage: 92, color: 'var(--color-luffy-red)' },
]

export function CharacterIntro() {
  const sectionRef = useRef<HTMLElement>(null)
  const charRef    = useRef<HTMLDivElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current || !charRef.current || !panelRef.current) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'center center',
          scrub: 1.2,
        },
      })

      tl.fromTo(charRef.current, { x: '-80vw', opacity: 0 }, { x: 0, opacity: 1 }).fromTo(
        panelRef.current,
        { x: '80vw', opacity: 0 },
        { x: 0, opacity: 1 },
        '<' // start at same time as character
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center py-16 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #60BFF5 0%, #1E90FF 50%, #4A90D9 100%)',
      }}
    >
      {/* Subtle wave texture background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Character image — slides from left */}
        <div ref={charRef} className="flex justify-center md:justify-end" style={{ opacity: 0 }}>
          <Image
            src="/assets/character-v2.png"
            alt="Sunny Gade — Pirate King of Infrastructure"
            width={480}
            height={680}
            className="w-full max-w-xs md:max-w-sm h-auto object-contain"
            style={{
              filter: 'drop-shadow(4px 8px 24px rgba(0,0,0,0.25))',
            }}
          />
        </div>

        {/* Spec sheet panel — slides from right */}
        <div
          ref={panelRef}
          className="rounded-sm p-8 space-y-6"
          style={{
            background: 'rgba(255, 248, 231, 0.96)',
            border: '3px solid var(--color-luffy-red)',
            boxShadow: '8px 8px 0 rgba(0,0,0,0.15)',
            opacity: 0,
          }}
        >
          {/* Header */}
          <div>
            <div
              className="font-mono text-[10px] tracking-[0.4em] uppercase mb-1"
              style={{ color: 'var(--color-luffy-red)' }}
            >
              ── Character Sheet ──
            </div>
            <h2
              className="font-display text-4xl md:text-5xl leading-none"
              style={{ color: 'var(--color-text-dark)' }}
            >
              SUNNY GADE
            </h2>
          </div>

          {/* Stats */}
          <div
            className="space-y-2 font-mono text-sm"
            style={{ color: 'var(--color-text-dark)', borderTop: '1px solid rgba(215,0,0,0.15)', paddingTop: '1rem' }}
          >
            {[
              ['Epithet',    'The Infrastructure King'],
              ['Devil Fruit','Laptop-Laptop no Mi'],
              ['Bounty',     '¥400G+ Throughput'],
              ['Crew',       'Arista Networks · xBattery'],
              ['Wanted for', 'Engineering at Scale'],
            ].map(([label, value]) => (
              <div key={label}>
                <span style={{ color: 'var(--color-luffy-red)', fontWeight: 700 }}>
                  {label}:
                </span>{' '}
                {value}
              </div>
            ))}
          </div>

          {/* Skill bars */}
          <div
            className="space-y-3 pt-4"
            style={{ borderTop: '1px solid rgba(215,0,0,0.15)' }}
          >
            <div
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(215,0,0,0.6)' }}
            >
              Combat Stats
            </div>
            {skills.map((skill) => (
              <SkillBar key={skill.label} {...skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CharacterIntro
