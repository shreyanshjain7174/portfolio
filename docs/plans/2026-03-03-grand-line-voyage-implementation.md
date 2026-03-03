# Grand Line Voyage — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current dark, section-based portfolio with a bright cinematic One Piece voyage scroll experience across 5 acts.

**Architecture:** Each act is a full-screen `h-screen` section; GSAP ScrollTrigger drives entrance animations as sections enter the viewport, Lenis provides smooth inertia scroll. Framer Motion handles hover/whileInView for Acts 4–5.

**Tech Stack:** Next.js 14, React 18, GSAP + @gsap/react, Lenis, Framer Motion, Tailwind CSS 3, TypeScript

---

## Task 1: Install New Dependencies and Remove Old Ones

**Files:**
- Modify: `package.json` (via npm commands)

**Step 1: Remove dead dependencies**

```bash
npm uninstall animejs @types/animejs remotion @remotion/player replicate
```

Expected: packages removed, no errors.

**Step 2: Install new packages**

```bash
npm install gsap @gsap/react lenis
```

Expected: packages installed, no peer dependency errors.

**Step 3: Verify build still starts**

```bash
npm run dev
```

Expected: dev server starts (it will error on missing imports from deleted packages — that is expected and will be fixed in subsequent tasks).

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -s -m "deps: add gsap, @gsap/react, lenis; remove animejs, remotion, replicate"
```

---

## Task 2: Rewrite globals.css — Bright Palette

**Files:**
- Rewrite: `src/app/globals.css`

**Step 1: Replace the entire file**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================================
   DESIGN TOKENS — Grand Line Voyage (Bright)
   ============================================================ */

:root {
  --color-sky: #87CEEB;
  --color-sky-deep: #4A90D9;
  --color-ocean: #1E90FF;
  --color-ocean-light: #60BFF5;
  --color-sand: #FFF8E7;
  --color-luffy-red: #D70000;
  --color-luffy-red-dim: rgba(215, 0, 0, 0.35);
  --color-gold: #FFD700;
  --color-gold-dim: rgba(255, 215, 0, 0.35);
  --color-text-dark: #1a1a2e;

  --font-display: var(--font-bangers), 'Bangers', cursive;
  --font-body: var(--font-poppins), 'Poppins', sans-serif;
  --font-mono: var(--font-jetbrains-mono), 'JetBrains Mono', monospace;

  --glow-gold: 0 0 12px var(--color-gold-dim), 0 0 24px rgba(255, 215, 0, 0.15);
  --glow-red: 0 0 12px var(--color-luffy-red-dim), 0 0 24px rgba(215, 0, 0, 0.15);
}

/* ============================================================
   BASE
   ============================================================ */

@layer base {
  html {
    background: linear-gradient(180deg, #87CEEB 0%, #4A90D9 40%, #1E90FF 100%);
    background-attachment: fixed;
    color: var(--color-text-dark);
    font-family: var(--font-body);
  }

  body {
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background-color: var(--color-gold);
    color: var(--color-text-dark);
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--color-sky-deep); }
  ::-webkit-scrollbar-thumb { background: var(--color-luffy-red); border-radius: 3px; }
}

/* ============================================================
   UTILITIES
   ============================================================ */

@layer utilities {
  .font-display { font-family: var(--font-display); }
  .font-body    { font-family: var(--font-body); }
  .font-mono    { font-family: var(--font-mono); }

  .text-glow-gold {
    text-shadow: 0 0 10px var(--color-gold-dim), 0 0 30px rgba(255,215,0,0.15);
  }

  .text-glow-red {
    text-shadow: 0 0 10px var(--color-luffy-red-dim), 0 0 30px rgba(215,0,0,0.15);
  }

  .text-impact {
    font-family: var(--font-display);
    color: var(--color-gold);
    -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.4);
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
    letter-spacing: 0.05em;
  }

  .glass-card {
    background: rgba(255, 248, 231, 0.15);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .manga-panel {
    position: relative;
    border: 3px solid rgba(215, 0, 0, 0.4);
    box-shadow: 6px 6px 0px rgba(0,0,0,0.2), inset 0 0 40px rgba(255,248,231,0.1);
  }

  .manga-panel::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px;
    width: 12px; height: 12px;
    border-top: 4px solid rgba(215,0,0,0.7);
    border-left: 4px solid rgba(215,0,0,0.7);
    pointer-events: none;
  }

  .manga-panel::after {
    content: '';
    position: absolute;
    bottom: -1px; right: -1px;
    width: 12px; height: 12px;
    border-bottom: 4px solid rgba(215,0,0,0.7);
    border-right: 4px solid rgba(215,0,0,0.7);
    pointer-events: none;
  }
}
```

**Step 2: Verify it compiles**

```bash
npm run build 2>&1 | head -30
```

Expected: may have import errors from old components (OK at this stage), CSS compiles.

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -s -m "style: bright palette — sky/ocean/sand tokens, remove dark theme"
```

---

## Task 3: Rewrite tailwind.config.ts — New Color Tokens

**Files:**
- Rewrite: `tailwind.config.ts`

**Step 1: Replace the entire file**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sky':          'var(--color-sky)',
        'sky-deep':     'var(--color-sky-deep)',
        'ocean':        'var(--color-ocean)',
        'ocean-light':  'var(--color-ocean-light)',
        'sand':         'var(--color-sand)',
        'luffy-red':    'var(--color-luffy-red)',
        'gold':         'var(--color-gold)',
        'text-dark':    'var(--color-text-dark)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Bangers', 'cursive'],
        body:    ['var(--font-body)', 'Poppins', 'sans-serif'],
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderWidth: { '3': '3px', '4': '4px' },
      boxShadow: {
        'red-glow':    '0 0 12px rgba(215,0,0,0.35), 0 0 24px rgba(215,0,0,0.15)',
        'gold-glow':   '0 0 12px rgba(255,215,0,0.35), 0 0 24px rgba(255,215,0,0.15)',
        'poster':      '6px 6px 0px rgba(0,0,0,0.15), 8px 8px 20px rgba(0,0,0,0.1)',
        'poster-hover':'8px 8px 0px rgba(0,0,0,0.2), 12px 12px 30px rgba(0,0,0,0.15)',
      },
      keyframes: {
        'bounce-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(12px)' },
        },
        'wave-pan': {
          '0%':   { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'bounce-down': 'bounce-down 2s ease-in-out infinite',
        'wave-pan':    'wave-pan 20s linear infinite alternate',
        'float':       'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

**Step 2: Commit**

```bash
git add tailwind.config.ts
git commit -s -m "style: update tailwind tokens for bright One Piece palette"
```

---

## Task 4: Update layout.tsx — Lenis Provider

**Files:**
- Create: `src/components/LenisProvider.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create `src/components/LenisProvider.tsx`**

```tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis()

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return <>{children}</>
}
```

**Step 2: Update `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Bangers, JetBrains_Mono, Poppins } from 'next/font/google'
import { LenisProvider } from '@/components/LenisProvider'
import './globals.css'

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bangers',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sunny Gade — Infrastructure Engineer',
  description: 'Software Engineer specializing in Distributed Systems, Infrastructure & Open Source.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bangers.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
    >
      <body style={{ margin: 0, padding: 0 }}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
```

**Step 3: Commit**

```bash
git add src/components/LenisProvider.tsx src/app/layout.tsx
git commit -s -m "feat: add Lenis smooth scroll provider with GSAP ScrollTrigger integration"
```

---

## Task 5: Create OceanCanvas.tsx — Animated Wave Canvas

**Files:**
- Create: `src/components/OceanCanvas.tsx`

**Step 1: Create the file**

```tsx
'use client'

import { useEffect, useRef } from 'react'

/**
 * OceanCanvas — lightweight sine-wave animation at 60fps.
 * Renders 3 layered translucent wave curves over the hero.
 */
export function OceanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const waves = [
        { alpha: 0.12, amplitude: 18, frequency: 0.009, speed: 0.4, yFactor: 0.62 },
        { alpha: 0.08, amplitude: 28, frequency: 0.006, speed: 0.25, yFactor: 0.72 },
        { alpha: 0.05, amplitude: 40, frequency: 0.004, speed: 0.15, yFactor: 0.82 },
      ]

      waves.forEach(({ alpha, amplitude, frequency, speed, yFactor }) => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.lineWidth = 2

        const yBase = canvas.height * yFactor
        ctx.moveTo(0, yBase)
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = yBase + Math.sin(x * frequency + t * speed) * amplitude
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      })

      t += 0.02
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  )
}

export default OceanCanvas
```

**Step 2: Commit**

```bash
git add src/components/OceanCanvas.tsx
git commit -s -m "feat: OceanCanvas — 60fps sine wave overlay for hero section"
```

---

## Task 6: Create VoyageHero.tsx — Act 1

**Files:**
- Create: `src/components/VoyageHero.tsx`

> Note: `ScrollIndicator` already exists at `src/components/ScrollIndicator.tsx` — reuse as-is.

**Step 1: Create the file**

```tsx
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
```

**Step 2: Commit**

```bash
git add src/components/VoyageHero.tsx
git commit -s -m "feat: VoyageHero — Act 1 ocean panorama with GSAP parallax title"
```

---

## Task 7: Create ShipArrival.tsx — Act 2

**Files:**
- Create: `src/components/ShipArrival.tsx`

**Step 1: Create the file**

```tsx
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
```

**Step 2: Commit**

```bash
git add src/components/ShipArrival.tsx
git commit -s -m "feat: ShipArrival — Act 2 ship scale/rise scroll animation"
```

---

## Task 8: Create CharacterIntro.tsx — Act 3

**Files:**
- Create: `src/components/CharacterIntro.tsx`

> Note: Reuses existing `SkillBar` component. SkillBar text colors will be updated in Task 9.

**Step 1: Create the file**

```tsx
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
```

**Step 2: Commit**

```bash
git add src/components/CharacterIntro.tsx
git commit -s -m "feat: CharacterIntro — Act 3 split-screen character + spec sheet"
```

---

## Task 9: Update SkillBar.tsx and WaveDivider.tsx for Bright Theme

**Files:**
- Modify: `src/components/SkillBar.tsx`
- Modify: `src/components/WaveDivider.tsx`

**Step 1: Rewrite `src/components/SkillBar.tsx`**

The current component uses `text-white/70` which is invisible on the sand/cream spec sheet. Switch to dark text:

```tsx
'use client'

import { motion } from 'framer-motion'

interface SkillBarProps {
  label: string
  percentage: number
  color?: string
}

export function SkillBar({ label, percentage, color = 'var(--color-luffy-red)' }: SkillBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span
          className="font-mono text-xs tracking-wider uppercase"
          style={{ color: 'var(--color-text-dark)', opacity: 0.7 }}
        >
          {label}
        </span>
        <span className="font-mono text-xs" style={{ color: 'var(--color-text-dark)', opacity: 0.5 }}>
          {percentage}%
        </span>
      </div>
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(26,26,46,0.1)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

export default SkillBar
```

**Step 2: Rewrite `src/components/WaveDivider.tsx`**

Update CSS variable references from dark to bright theme colors:

```tsx
/**
 * WaveDivider — SVG ocean wave for section transitions.
 */
export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
          fill="var(--color-sand)"
        />
        <path
          d="M0,80 C360,20 720,100 1080,40 C1260,20 1380,60 1440,80 L1440,120 L0,120 Z"
          fill="var(--color-ocean-light)"
          opacity="0.3"
        />
      </svg>
    </div>
  )
}

export default WaveDivider
```

**Step 3: Commit**

```bash
git add src/components/SkillBar.tsx src/components/WaveDivider.tsx
git commit -s -m "style: update SkillBar and WaveDivider for bright theme"
```

---

## Task 10: Rewrite WantedPoster.tsx — Bright Cream Style

**Files:**
- Rewrite: `src/components/WantedPoster.tsx`

The current component has dark backgrounds hardcoded. Rewrite to cream/sand parchment aesthetic that works in the bright theme.

**Step 1: Rewrite the file**

```tsx
'use client'

import { motion } from 'framer-motion'

interface WantedPosterProps {
  title: string
  description: string
  tags: string[]
  stat?: string
  link?: string
}

export function WantedPoster({ title, description, tags, stat, link }: WantedPosterProps) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 50, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative overflow-hidden transition-all duration-500
          group-hover:-translate-y-3"
        style={{
          background: 'linear-gradient(170deg, #FFF8E7 0%, #FFF0C8 40%, #FFEAA0 100%)',
          border: '3px solid rgba(215,0,0,0.5)',
          borderRadius: '2px',
          boxShadow: '6px 6px 0px rgba(0,0,0,0.12), 8px 8px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* Aged paper texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23D4A042' opacity='0.08'/%3E%3C/svg%3E\")",
            opacity: 0.4,
          }}
        />

        {/* WANTED header */}
        <div
          className="relative px-6 pt-5 pb-2 text-center"
          style={{ borderBottom: '2px solid rgba(215,0,0,0.2)' }}
        >
          <div
            className="font-display text-3xl md:text-4xl tracking-[0.15em] leading-none"
            style={{
              color: 'var(--color-luffy-red)',
              textShadow: '0 0 20px rgba(215,0,0,0.2), 2px 2px 0 rgba(0,0,0,0.1)',
            }}
          >
            WANTED
          </div>
          <div
            className="font-mono text-[9px] tracking-[0.3em] mt-1 uppercase"
            style={{ color: 'rgba(215,0,0,0.5)' }}
          >
            Dead or Alive
          </div>
        </div>

        {/* Content */}
        <div className="relative px-6 py-5">
          <h3
            className="font-display text-xl md:text-2xl text-center mb-3 leading-tight"
            style={{
              color: 'var(--color-text-dark)',
              textShadow: '1px 1px 0 rgba(0,0,0,0.1)',
            }}
          >
            {title}
          </h3>

          <p
            className="font-body text-sm leading-relaxed mb-4 text-center"
            style={{ color: 'rgba(26,26,46,0.65)' }}
          >
            {description}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider"
                style={{
                  border: '1px solid rgba(215,0,0,0.3)',
                  color: 'rgba(215,0,0,0.7)',
                  background: 'rgba(215,0,0,0.05)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bounty */}
        <div
          className="relative px-6 pb-5 pt-2"
          style={{ borderTop: '2px solid rgba(215,0,0,0.2)' }}
        >
          <div className="text-center">
            <div
              className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1"
              style={{ color: 'rgba(215,0,0,0.5)' }}
            >
              Bounty
            </div>
            <div
              className="font-display text-3xl md:text-4xl"
              style={{
                color: 'var(--color-luffy-red)',
                textShadow: '0 0 20px rgba(215,0,0,0.3), 2px 2px 0 rgba(0,0,0,0.1)',
              }}
            >
              {stat || '???'}
            </div>
          </div>
        </div>

        {/* Link */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3 font-mono text-xs tracking-[0.2em] uppercase
              transition-all duration-300"
            style={{
              color: 'rgba(215,0,0,0.5)',
              borderTop: '1px solid rgba(215,0,0,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-luffy-red)'
              e.currentTarget.style.background = 'rgba(215,0,0,0.04)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(215,0,0,0.5)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            View Bounty Details →
          </a>
        )}

        {/* Red glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 40px rgba(215,0,0,0.06)',
          }}
        />
      </div>
    </motion.div>
  )
}

export default WantedPoster
```

**Step 2: Commit**

```bash
git add src/components/WantedPoster.tsx
git commit -s -m "style: WantedPoster — bright cream/sand parchment aesthetic"
```

---

## Task 11: Rewrite ProjectsSection.tsx — Act 4 Bounty Board

**Files:**
- Rewrite: `src/components/ProjectsSection.tsx`

Remove `OnePieceDecorations` import (component will be deleted). Use bright background.

**Step 1: Rewrite the file**

```tsx
'use client'

import { motion } from 'framer-motion'
import { WantedPoster } from './WantedPoster'

const projects = [
  {
    title: 'DPDK PACKET PROCESSING',
    description:
      'High-performance packet processing engine at Arista Networks achieving 400G+ throughput with zero packet loss. Built with DPDK for kernel-bypass networking.',
    tags: ['C', 'DPDK', 'Networking', 'Performance'],
    stat: '400G+',
    link: 'https://github.com/shreyanshjain7174',
  },
  {
    title: 'CEPH STORAGE CONTRIBUTIONS',
    description:
      '15+ merged pull requests to the Ceph distributed storage project. Improved monitoring, fixed edge cases in OSD operations, and enhanced cluster reliability.',
    tags: ['C++', 'Python', 'Ceph', 'Open Source'],
    stat: '15+ PRs',
    link: 'https://github.com/ceph/ceph',
  },
  {
    title: 'KUBERNETES VM ORCHESTRATION',
    description:
      'Infrastructure platform at xBattery orchestrating 500+ VMs on Kubernetes with 99.9% uptime. Automated provisioning, monitoring, and self-healing capabilities.',
    tags: ['Go', 'Kubernetes', 'Terraform', 'Infrastructure'],
    stat: '500+ VMs',
    link: 'https://github.com/shreyanshjain7174',
  },
  {
    title: 'XBATTERY INFRASTRUCTURE',
    description:
      'End-to-end infrastructure for battery analytics platform. Built CI/CD pipelines, monitoring dashboards, and automated deployment workflows.',
    tags: ['Python', 'Docker', 'AWS', 'CI/CD'],
    stat: '99.9%',
    link: 'https://github.com/shreyanshjain7174',
  },
]

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1E90FF 0%, #4A90D9 50%, #87CEEB 100%)' }}
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: 'rgba(255,248,231,0.7)' }}
          >
            ── Bounty Board ──
          </div>
          <h2
            className="font-display text-4xl md:text-6xl tracking-wide"
            style={{
              color: 'var(--color-gold)',
              textShadow: '0 0 30px rgba(255,215,0,0.4), 3px 3px 0 rgba(0,0,0,0.2)',
            }}
          >
            PROJECTS
          </h2>
        </motion.div>

        {/* Poster grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project) => (
            <WantedPoster key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
```

**Step 2: Commit**

```bash
git add src/components/ProjectsSection.tsx
git commit -s -m "feat: ProjectsSection — Act 4 bounty board, bright theme, remove OnePieceDecorations"
```

---

## Task 12: Rewrite ContactSection.tsx — Act 5 Den Den Mushi

**Files:**
- Rewrite: `src/components/ContactSection.tsx`

Remove `OnePieceDecorations` import, update to bright sand background, glass-morphism cards with red glow.

**Step 1: Rewrite the file**

```tsx
'use client'

import { motion } from 'framer-motion'
import { WaveDivider } from './WaveDivider'

const contactLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/shreyanshjain7174',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/shreyansh-sancheti',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/shrey_sancheti',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:hire.ssancheti@gmail.com',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

export function ContactSection() {
  return (
    <section id="contact" className="relative">
      <WaveDivider />

      <div
        className="relative py-24 px-6 overflow-hidden"
        style={{ backgroundColor: 'var(--color-sand)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: 'rgba(215,0,0,0.6)' }}
            >
              ── Den Den Mushi ──
            </div>
            <h2
              className="font-display text-4xl md:text-5xl tracking-wide mb-4"
              style={{
                color: 'var(--color-text-dark)',
                textShadow: '2px 2px 0 rgba(0,0,0,0.1)',
              }}
            >
              CONTACT THE CREW
            </h2>
          </motion.div>

          <motion.p
            className="font-body mb-12 max-w-lg mx-auto"
            style={{ color: 'rgba(26,26,46,0.55)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to set sail on the next adventure? Let&apos;s connect.
          </motion.p>

          {/* Contact cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {contactLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                variants={itemVariants}
                className="relative rounded-sm p-6 flex flex-col items-center gap-3 cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '2px solid rgba(30,144,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--color-text-dark)',
                }}
                whileHover={{
                  y: -4,
                  borderColor: 'rgba(215,0,0,0.4)',
                  boxShadow: '0 0 20px rgba(215,0,0,0.15), 4px 4px 0 rgba(0,0,0,0.08)',
                }}
                transition={{ duration: 0.2 }}
              >
                {link.icon}
                <span className="font-mono text-xs tracking-wider uppercase">{link.label}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-20 pt-8"
            style={{ borderTop: '1px solid rgba(26,26,46,0.08)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-mono text-xs tracking-wider" style={{ color: 'rgba(26,26,46,0.3)' }}>
              Built with Next.js, GSAP & Framer Motion
            </p>
            <p className="font-mono text-[10px] tracking-wider mt-1" style={{ color: 'rgba(26,26,46,0.2)' }}>
              &copy; {new Date().getFullYear()} Shreyansh Sancheti
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
```

**Step 2: Commit**

```bash
git add src/components/ContactSection.tsx
git commit -s -m "feat: ContactSection — Act 5 bright sand theme, glass cards, remove OnePieceDecorations"
```

---

## Task 13: Rewrite page.tsx — Scroll Orchestrator

**Files:**
- Rewrite: `src/app/page.tsx`

**Step 1: Rewrite the file**

```tsx
import { VoyageHero }      from '@/components/VoyageHero'
import { ShipArrival }     from '@/components/ShipArrival'
import { CharacterIntro }  from '@/components/CharacterIntro'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ContactSection }  from '@/components/ContactSection'

export default function Home() {
  return (
    <main>
      <VoyageHero />
      <ShipArrival />
      <CharacterIntro />
      <ProjectsSection />
      <ContactSection />
    </main>
  )
}
```

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -s -m "feat: page.tsx — assemble 5-act voyage scroll orchestrator"
```

---

## Task 14: Delete Old Components

**Files to delete:**
- `src/components/SpeedLines.tsx`
- `src/components/HeroSection.tsx`
- `src/components/AboutSection.tsx`
- `src/components/OnePieceDecorations.tsx`
- `src/components/remotion/OceanIntro.tsx`
- `src/components/remotion/BootPlayer.tsx`
- `src/hooks/useTypewriter.ts` (no longer used)
- `src/components/ScrollIndicator.tsx` (keep only if used by VoyageHero — it IS used, keep it)

**Step 1: Delete files**

```bash
rm src/components/SpeedLines.tsx
rm src/components/HeroSection.tsx
rm src/components/AboutSection.tsx
rm src/components/OnePieceDecorations.tsx
rm src/components/remotion/OceanIntro.tsx
rm src/components/remotion/BootPlayer.tsx
rm src/hooks/useTypewriter.ts
rmdir src/components/remotion 2>/dev/null || true
```

**Step 2: Verify no dangling imports**

```bash
grep -r "OnePieceDecorations\|SpeedLines\|HeroSection\|AboutSection\|OceanIntro\|BootPlayer\|useTypewriter" src/ --include="*.tsx" --include="*.ts"
```

Expected: no output (no remaining imports).

**Step 3: Commit**

```bash
git add -A
git commit -s -m "chore: delete old dark-theme components and remotion files"
```

---

## Task 15: Build Verification and Fix Any Errors

**Step 1: Run production build**

```bash
npm run build 2>&1
```

Expected: `✓ Compiled successfully`.

**Common errors and fixes:**

- `Module not found: animejs` → already removed in Task 1; if seen, check for stray imports with `grep -r "animejs" src/`
- `Module not found: remotion` → already removed; check with `grep -r "remotion" src/`
- TypeScript error on GSAP: ensure `gsap` types are included (they ship with the package, no `@types/gsap` needed)
- `lenis` type errors: lenis ships its own types; if error, add `"moduleResolution": "bundler"` to tsconfig.json compilerOptions or ensure `"moduleResolution": "node16"` is set

**Step 2: Check tsconfig if needed**

```bash
cat tsconfig.json
```

If `lenis` has import issues, add to `tsconfig.json` compilerOptions:
```json
"moduleResolution": "bundler"
```

**Step 3: Commit fixes**

```bash
git add -A
git commit -s -m "fix: resolve build errors post-migration"
```

---

## Task 16: Create Pull Request

**Step 1: Push branch**

```bash
git push -u origin phase/01-foundation
```

**Step 2: Create PR**

```bash
gh pr create \
  --title "feat: Grand Line Voyage — cinematic scroll portfolio redesign" \
  --body "$(cat <<'EOF'
## Summary
- Replaces dark One Piece theme with bright daytime ocean aesthetic (sky blue → turquoise → ocean)
- 5-act scroll narrative: Ocean Panorama → Ship Arrival → Character Intro → Bounty Board → Contact
- GSAP ScrollTrigger drives all scroll-linked animations; Lenis provides smooth inertia
- Animated canvas wave layer (60fps sine curves) in Act 1 hero
- Cream/sand WantedPoster cards for projects; glass-morphism contact cards
- Removes dead deps: animejs, remotion, replicate

## Test plan
- [ ] `npm run build` passes with no errors
- [ ] Dev server loads at localhost:3000 — all 5 acts visible on scroll
- [ ] Act 1: ocean panorama background, gold title, wave canvas animates
- [ ] Act 2: ship rises and scales in on scroll
- [ ] Act 3: character slides from left, spec panel from right
- [ ] Act 4: wanted poster cards stagger-reveal on scroll
- [ ] Act 5: sand background, glass cards with red hover glow
- [ ] Mobile: all sections readable at 375px width
EOF
)"
```

---

## Quick Reference

| Task | What |
|------|------|
| 1 | npm install/uninstall deps |
| 2 | globals.css bright palette |
| 3 | tailwind.config.ts new tokens |
| 4 | layout.tsx + LenisProvider |
| 5 | OceanCanvas.tsx |
| 6 | VoyageHero.tsx (Act 1) |
| 7 | ShipArrival.tsx (Act 2) |
| 8 | CharacterIntro.tsx (Act 3) |
| 9 | SkillBar.tsx + WaveDivider.tsx |
| 10 | WantedPoster.tsx bright rewrite |
| 11 | ProjectsSection.tsx (Act 4) |
| 12 | ContactSection.tsx (Act 5) |
| 13 | page.tsx orchestrator |
| 14 | Delete old files |
| 15 | Build verification |
| 16 | PR |
