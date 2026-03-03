'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { OceanCanvas } from './OceanCanvas'
import { ScrollIndicator } from './ScrollIndicator'

gsap.registerPlugin(ScrollTrigger)

export function VoyageHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      if (!titleRef.current || !subRef.current || !sectionRef.current) return

      // Entrance: title fades up on load
      gsap.fromTo(
        [titleRef.current, subRef.current],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.15 }
      )

      // Exit: parallax drift up as user scrolls away
      gsap.to([titleRef.current, subRef.current], {
        y: -120,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/ocean-panorama.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated wave canvas overlay */}
      <OceanCanvas />

      {/* Gradient tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(135,206,235,0.15) 0%, rgba(30,144,255,0.35) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{ zIndex: 3 }}
      >
        <h1
          ref={titleRef}
          className="font-display text-6xl md:text-8xl lg:text-[10rem] text-center leading-none tracking-wide"
          style={{
            color: 'var(--color-gold)',
            textShadow:
              '0 0 40px rgba(255,215,0,0.7), 0 0 80px rgba(255,215,0,0.3), 4px 4px 0 rgba(0,0,0,0.25)',
            WebkitTextStroke: '1px rgba(0,0,0,0.15)',
          }}
        >
          SUNNY GADE
        </h1>

        <p
          ref={subRef}
          className="font-mono text-sm md:text-base tracking-[0.5em] uppercase mt-6"
          style={{
            color: 'var(--color-sand)',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          The Infrastructure King
        </p>

        <div className="absolute bottom-8" style={{ zIndex: 4 }}>
          <ScrollIndicator />
        </div>
      </div>
    </section>
  )
}

export default VoyageHero
