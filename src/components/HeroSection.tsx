'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { SpeedLines } from './SpeedLines'
import { ScrollIndicator } from './ScrollIndicator'
import { FloatingStrawHat, MangaImpact, CompassRose, FloatingKanji, Anchor } from './OnePieceDecorations'

const BootPlayer = dynamic(() => import('@/components/remotion/BootPlayer'), {
  ssr: false,
  loading: () => null,
})

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/shreyanshjain7174',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/shreyansh-sancheti',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/shrey_sancheti',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:hire.ssancheti@gmail.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a192f 0%, #071120 60%, #071120 100%)',
      }}
    >
      {/* Remotion ambient background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <BootPlayer />
      </div>

      {/* Speed lines behind content */}
      <SpeedLines />

      {/* Floating kanji background */}
      <FloatingKanji />

      {/* Manga impact burst behind name */}
      <MangaImpact className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]" />

      {/* Compass rose decorations */}
      <CompassRose className="absolute top-12 right-12 opacity-20 hidden md:block" size={90} />
      <Anchor className="absolute bottom-32 left-12 opacity-15 hidden md:block" size={50} />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Floating straw hat above name */}
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <FloatingStrawHat size={140} />
        </motion.div>

        {/* Name with dramatic manga styling */}
        <motion.h1
          className="font-display leading-none mb-2"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            color: 'var(--color-gold)',
            textShadow: `
              0 0 40px rgba(255,206,0,0.3),
              0 0 80px rgba(255,206,0,0.15),
              3px 3px 0 rgba(0,0,0,0.6),
              -1px -1px 0 rgba(0,0,0,0.3)
            `,
            WebkitTextStroke: '2px rgba(0,0,0,0.4)',
            letterSpacing: '0.08em',
          }}
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          SHREYANSH
          <br />
          <span style={{ color: 'var(--color-luffy-red)', textShadow: '0 0 40px rgba(215,0,0,0.4), 3px 3px 0 rgba(0,0,0,0.6)' }}>
            SANCHETI
          </span>
        </motion.h1>

        {/* Subtitle with One Piece flair */}
        <motion.div
          className="mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <p className="font-body text-white/50 tracking-[0.2em] uppercase text-sm md:text-base">
            Software Engineer · Distributed Systems · OSS
          </p>
        </motion.div>

        {/* Crew tagline */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-sky-blue/40">
            ── Setting Sail on the Grand Line of Infrastructure ──
          </span>
        </motion.div>

        {/* Social links with icons */}
        <motion.div
          className="flex items-center justify-center gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 font-mono text-xs tracking-wider uppercase px-4 py-2.5
                border-2 border-white/10 text-white/60 rounded
                hover:border-luffy-red hover:text-white hover:shadow-red-glow
                hover:bg-luffy-red/10 transition-all duration-300"
            >
              <span className="group-hover:text-luffy-red transition-colors duration-300">
                {link.icon}
              </span>
              <span className="relative z-10 hidden sm:inline">{link.label}</span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--color-ocean-deep))',
        }}
      />
    </section>
  )
}

export default HeroSection
