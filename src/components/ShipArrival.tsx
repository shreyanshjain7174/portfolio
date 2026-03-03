'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export function ShipArrival() {
  const sectionRef = useRef<HTMLElement>(null)
  const shipRef    = useRef<HTMLDivElement>(null)
  const labelRef   = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current || !shipRef.current) return

      // Ship rises and scales in as section enters viewport
      gsap.fromTo(
        shipRef.current,
        { scale: 0.3, y: 160, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1.5,
          },
        }
      )

      // Label fades in after ship arrives
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'center 60%',
              end: 'center 40%',
              scrub: true,
            },
          }
        )
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #4A90D9 0%, #1E90FF 60%, #60BFF5 100%)',
      }}
    >
      {/* Ship */}
      <div ref={shipRef} className="relative w-[85vw] max-w-2xl">
        <Image
          src="/assets/thousand-sunny.png"
          alt="The Thousand Sunny"
          width={800}
          height={580}
          className="w-full h-auto object-contain"
          style={{
            filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.3)) drop-shadow(0 0 30px rgba(30,144,255,0.4))',
          }}
          priority
        />
      </div>

      {/* Ship name label */}
      <div ref={labelRef} className="mt-8 text-center" style={{ opacity: 0 }}>
        <div
          className="font-display text-2xl md:text-3xl tracking-[0.2em]"
          style={{ color: 'var(--color-sand)', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
        >
          THE THOUSAND SUNNY
        </div>
        <div
          className="font-mono text-[10px] tracking-[0.4em] uppercase mt-1"
          style={{ color: 'rgba(255,248,231,0.6)' }}
        >
          Setting sail on the Grand Line
        </div>
      </div>
    </section>
  )
}

export default ShipArrival
