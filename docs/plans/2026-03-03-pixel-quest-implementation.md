# PIXEL QUEST — Portfolio Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the One Piece portfolio with a pixel art / retro RPG portfolio called PIXEL QUEST — competition-winning, smooth, pure craft.

**Architecture:** Single-page Next.js 14 app. Each section is a "game screen". Global CRT scanline overlay + pixel cursor. Canvas star field on hero. GSAP handles scroll animations, anime.js handles micro-stagger/count-ups, Framer Motion handles transitions.

**Tech Stack:** Next.js 14, GSAP + ScrollTrigger, Anime.js (new — install), Framer Motion, Lenis, Tailwind CSS, Press Start 2P + VT323 (Google Fonts), Canvas API

---

## Task 0: Branch setup + install anime.js

**Files:**
- Modify: `package.json`

**Step 1: Install anime.js**

```bash
npm install animejs@latest
npm install --save-dev @types/animejs
```

**Step 2: Verify install**

```bash
node -e "require('animejs'); console.log('anime ok')"
```

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -s -m "chore: add animejs dependency"
```

---

## Task 1: Global CSS — Pixel Design System

**Files:**
- Modify: `src/app/globals.css`

**Replace entire globals.css with:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================================
   PIXEL QUEST — Design Tokens
   ============================================================ */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');

:root {
  --px-bg:         #0D0D1A;
  --px-surface:    #16213E;
  --px-surface-2:  #1A1A3E;
  --px-border:     #2A2A5A;
  --px-purple:     #7B2FBE;
  --px-purple-dim: rgba(123, 47, 190, 0.3);
  --px-cyan:       #00F5FF;
  --px-cyan-dim:   rgba(0, 245, 255, 0.2);
  --px-gold:       #FFD700;
  --px-gold-dim:   rgba(255, 215, 0, 0.2);
  --px-coral:      #FF6B6B;
  --px-green:      #39FF14;
  --px-text:       #E8E8F0;
  --px-text-dim:   #8888AA;
  --px-shadow:     0 0 20px rgba(123, 47, 190, 0.4);
  --px-glow-cyan:  0 0 10px var(--px-cyan), 0 0 30px rgba(0, 245, 255, 0.3);
  --px-glow-gold:  0 0 10px var(--px-gold), 0 0 30px rgba(255, 215, 0, 0.3);
}

/* ============================================================
   BASE
   ============================================================ */
@layer base {
  html {
    background: var(--px-bg);
    color: var(--px-text);
    scroll-behavior: auto; /* lenis handles this */
    cursor: none; /* custom pixel cursor */
  }

  body {
    min-height: 100vh;
    -webkit-font-smoothing: none; /* crisp pixel rendering */
    -moz-osx-font-smoothing: unset;
    image-rendering: pixelated;
  }

  ::selection {
    background-color: var(--px-gold);
    color: var(--px-bg);
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--px-surface); }
  ::-webkit-scrollbar-thumb { background: var(--px-purple); border-radius: 0px; }

  /* Reduce motion support */
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

/* ============================================================
   PIXEL GRID BACKGROUND
   ============================================================ */
.pixel-grid-bg {
  background-image:
    linear-gradient(var(--px-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--px-border) 1px, transparent 1px);
  background-size: 32px 32px;
  background-color: var(--px-bg);
  opacity: 0.3;
}

/* ============================================================
   SCANLINES
   ============================================================ */
.scanlines::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.08) 2px,
    rgba(0, 0, 0, 0.08) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

/* ============================================================
   PIXEL CURSOR
   ============================================================ */
.pixel-cursor {
  position: fixed;
  width: 16px;
  height: 16px;
  pointer-events: none;
  z-index: 10000;
  transform: translate(-50%, -50%);
  /* 16x16 crosshair via box-shadow */
  background: var(--px-cyan);
  box-shadow:
    /* crosshair lines */
    -8px 0 0 var(--px-cyan),
    8px 0 0 var(--px-cyan),
    0 -8px 0 var(--px-cyan),
    0 8px 0 var(--px-cyan),
    /* glow */
    0 0 8px var(--px-cyan-dim);
  image-rendering: pixelated;
}

/* ============================================================
   PIXEL BORDERS
   ============================================================ */
.pixel-border {
  border: 2px solid var(--px-border);
  box-shadow: 4px 4px 0 var(--px-purple-dim);
}

.pixel-border-cyan {
  border: 2px solid var(--px-cyan);
  box-shadow: 4px 4px 0 var(--px-cyan-dim), 0 0 10px var(--px-cyan-dim);
}

.pixel-border-gold {
  border: 2px solid var(--px-gold);
  box-shadow: 4px 4px 0 var(--px-gold-dim), 0 0 10px var(--px-gold-dim);
}

/* ============================================================
   PIXEL BUTTONS
   ============================================================ */
.px-btn {
  display: inline-block;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  padding: 12px 20px;
  background: var(--px-purple);
  color: var(--px-text);
  border: none;
  box-shadow: 0 4px 0 #4a1a7a, inset 0 1px 0 rgba(255,255,255,0.15);
  cursor: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: transform 0.1s, box-shadow 0.1s;
  image-rendering: pixelated;
}

.px-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #4a1a7a, 0 0 15px var(--px-purple-dim), inset 0 1px 0 rgba(255,255,255,0.15);
}

.px-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #4a1a7a, inset 0 1px 0 rgba(255,255,255,0.15);
}

.px-btn-cyan {
  background: transparent;
  color: var(--px-cyan);
  box-shadow: 0 4px 0 #007a80, inset 0 0 0 2px var(--px-cyan);
}
.px-btn-cyan:hover {
  background: var(--px-cyan-dim);
  box-shadow: 0 6px 0 #007a80, inset 0 0 0 2px var(--px-cyan), 0 0 15px var(--px-cyan-dim);
}

/* ============================================================
   STAT BARS
   ============================================================ */
.stat-bar-track {
  height: 12px;
  background: var(--px-surface);
  border: 1px solid var(--px-border);
  position: relative;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--px-purple), var(--px-cyan));
  box-shadow: 0 0 8px var(--px-cyan-dim);
  width: 0%;
  transition: none; /* animated by GSAP */
}

/* ============================================================
   BLINK ANIMATION
   ============================================================ */
@keyframes px-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.blink { animation: px-blink 1s step-end infinite; }

/* ============================================================
   PIXEL FLOAT ANIMATION
   ============================================================ */
@keyframes px-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
.px-float { animation: px-float 3s ease-in-out infinite; }

/* ============================================================
   GLITCH EFFECT
   ============================================================ */
@keyframes glitch-1 {
  0%, 95%, 100% { clip-path: none; transform: none; }
  96% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 0); }
  97% { clip-path: inset(50% 0 30% 0); transform: translate(3px, 0); }
  98% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 0); }
}

.glitch-text {
  position: relative;
  animation: glitch-1 6s infinite;
}

.glitch-text::before, .glitch-text::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
}

.glitch-text::before {
  color: var(--px-cyan);
  animation: glitch-1 6s 0.1s infinite;
  opacity: 0.7;
}

.glitch-text::after {
  color: var(--px-coral);
  animation: glitch-1 6s 0.2s infinite;
  opacity: 0.7;
}

/* ============================================================
   INVENTORY GRID
   ============================================================ */
.inventory-slot {
  width: 64px;
  height: 64px;
  background: var(--px-surface);
  border: 2px solid var(--px-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none;
  position: relative;
  transition: border-color 0.15s;
}

.inventory-slot:hover {
  border-color: var(--px-cyan);
  box-shadow: 0 0 12px var(--px-cyan-dim), inset 0 0 12px rgba(0, 245, 255, 0.05);
  z-index: 10;
}

.inventory-slot.selected {
  border-color: var(--px-gold);
  box-shadow: 0 0 12px var(--px-gold-dim);
}

/* ============================================================
   FONT UTILITIES
   ============================================================ */
@layer utilities {
  .font-pixel { font-family: 'Press Start 2P', monospace; }
  .font-terminal { font-family: 'VT323', monospace; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }

  .text-glow-cyan { text-shadow: var(--px-glow-cyan); }
  .text-glow-gold { text-shadow: var(--px-glow-gold); }

  .text-px-bg       { color: var(--px-bg); }
  .text-px-cyan     { color: var(--px-cyan); }
  .text-px-gold     { color: var(--px-gold); }
  .text-px-purple   { color: var(--px-purple); }
  .text-px-coral    { color: var(--px-coral); }
  .text-px-green    { color: var(--px-green); }
  .text-px-dim      { color: var(--px-text-dim); }

  .bg-px-bg         { background-color: var(--px-bg); }
  .bg-px-surface    { background-color: var(--px-surface); }
  .bg-px-surface-2  { background-color: var(--px-surface-2); }
}
```

**Step: Commit**

```bash
git add src/app/globals.css
git commit -s -m "feat: pixel quest global CSS design system"
```

---

## Task 2: Layout — Pixel Fonts + LenisProvider

**Files:**
- Modify: `src/app/layout.tsx`
- Keep: `src/components/LenisProvider.tsx` (no changes needed)

**Replace layout.tsx with:**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import ScanlineOverlay from '@/components/ScanlineOverlay'
import PixelCursor from '@/components/PixelCursor'

export const metadata: Metadata = {
  title: 'Sunny Gade — Full Stack Developer',
  description: 'Portfolio of Sunny Gade, full stack developer. Built with pixel art and passion.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-px-bg">
        <LenisProvider>
          <ScanlineOverlay />
          <PixelCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
```

**Step: Commit**

```bash
git add src/app/layout.tsx
git commit -s -m "feat: pixel quest layout with fonts and providers"
```

---

## Task 3: ScanlineOverlay + PixelCursor Components

**Files:**
- Create: `src/components/ScanlineOverlay.tsx`
- Create: `src/components/PixelCursor.tsx`

**ScanlineOverlay.tsx:**

```tsx
'use client'
export default function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
      }}
    />
  )
}
```

**PixelCursor.tsx:**

```tsx
'use client'
import { useEffect, useRef } from 'react'

export default function PixelCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={cursorRef}
      className="pixel-cursor"
      style={{ position: 'fixed', zIndex: 10000, pointerEvents: 'none' }}
    />
  )
}
```

**Step: Commit**

```bash
git add src/components/ScanlineOverlay.tsx src/components/PixelCursor.tsx
git commit -s -m "feat: scanline overlay and pixel cursor"
```

---

## Task 4: PixelNav — Game HUD Navigation

**Files:**
- Create: `src/components/PixelNav.tsx`

**PixelNav.tsx:**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = ['HERO', 'ABOUT', 'SKILLS', 'QUESTS', 'SAVE']

export default function PixelNav() {
  const navRef = useRef<HTMLElement>(null)
  const [scrollPct, setScrollPct] = useState(0)
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    // Slide in on load
    gsap.fromTo(nav,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.5 }
    )

    // Scroll progress
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const pct = Math.min(100, (window.scrollY / docH) * 100)
      setScrollPct(Math.round(pct))
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (idx: number) => {
    const id = ['hero', 'about', 'skills', 'projects', 'contact'][idx]
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-6 py-3"
      style={{
        background: 'rgba(13, 13, 26, 0.95)',
        borderBottom: '2px solid var(--px-border)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Logo */}
      <span className="font-pixel text-px-cyan text-[10px] tracking-wider text-glow-cyan">
        PIXEL QUEST
      </span>

      {/* Section dots */}
      <div className="flex gap-4">
        {SECTIONS.map((s, i) => (
          <button
            key={s}
            onClick={() => scrollToSection(i)}
            className="font-pixel text-[7px] transition-colors"
            style={{ cursor: 'none', color: activeSection === i ? 'var(--px-cyan)' : 'var(--px-text-dim)' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* HP bar = scroll progress */}
      <div className="flex items-center gap-2">
        <span className="font-pixel text-[7px] text-px-green">HP</span>
        <div className="w-24 stat-bar-track">
          <div
            className="stat-bar-fill"
            style={{
              width: `${scrollPct}%`,
              background: scrollPct > 75 ? 'var(--px-green)' : scrollPct > 40 ? 'var(--px-gold)' : 'var(--px-coral)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
        <span className="font-pixel text-[7px] text-px-dim">{scrollPct}%</span>
      </div>
    </nav>
  )
}
```

**Step: Commit**

```bash
git add src/components/PixelNav.tsx
git commit -s -m "feat: pixel HUD navigation with scroll progress"
```

---

## Task 5: HeroSection — Player Select Screen

**Files:**
- Create: `src/components/HeroSection.tsx`
- Create: `src/components/PixelCanvas.tsx` (star field)
- Create: `src/components/PixelChar.tsx` (CSS sprite character)

**PixelCanvas.tsx — Star field + floating particles:**

```tsx
'use client'
import { useEffect, useRef } from 'react'

interface Star { x: number; y: number; r: number; speed: number; alpha: number; alphaDir: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }

export default function PixelCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let raf: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Stars
    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() < 0.3 ? 2 : 1,
      speed: 0.1 + Math.random() * 0.2,
      alpha: 0.3 + Math.random() * 0.7,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
    }))

    // Particles
    const particles: Particle[] = []
    const spawnParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.5 - Math.random() * 0.5,
        life: 0,
        maxLife: 120 + Math.random() * 80,
        size: Math.random() < 0.5 ? 1 : 2,
      })
    }

    let tick = 0
    const draw = () => {
      tick++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Stars
      for (const s of stars) {
        s.alpha += s.alphaDir * 0.005
        if (s.alpha >= 1) s.alphaDir = -1
        if (s.alpha <= 0.2) s.alphaDir = 1
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
        ctx.fillRect(Math.round(s.x), Math.round(s.y), s.r, s.r)
      }

      // Pixel particles (cyan/gold sparkles)
      if (tick % 8 === 0) spawnParticle()
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        const progress = p.life / p.maxLife
        const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2
        const hue = tick % 60 < 30 ? '#00F5FF' : '#FFD700'
        ctx.fillStyle = hue
        ctx.globalAlpha = alpha * 0.8
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
        if (p.life >= p.maxLife) particles.splice(i, 1)
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
```

**PixelChar.tsx — CSS animated character:**

```tsx
'use client'

// 16×16 pixel art character using CSS box-shadow trick
// Each shadow is: x y 0 color (pixel at x,y relative to 1px div)
// Character: a simple astronaut/developer sprite

export default function PixelChar() {
  return (
    <div className="relative inline-block px-float" style={{ width: 128, height: 128 }}>
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(123,47,190,0.2) 0%, transparent 70%)',
        animation: 'px-float 3s ease-in-out infinite',
      }} />
      {/* SVG pixel art character */}
      <svg viewBox="0 0 16 16" width="128" height="128" style={{ imageRendering: 'pixelated' }}>
        {/* Head */}
        <rect x="5" y="1" width="6" height="6" fill="#E8E8F0" />
        {/* Eyes */}
        <rect x="6" y="3" width="1" height="1" fill="#00F5FF" />
        <rect x="9" y="3" width="1" height="1" fill="#00F5FF" />
        {/* Mouth */}
        <rect x="6" y="5" width="4" height="1" fill="#16213E" />
        <rect x="6" y="5" width="1" height="1" fill="#FF6B6B" />
        <rect x="9" y="5" width="1" height="1" fill="#FF6B6B" />
        {/* Body */}
        <rect x="4" y="7" width="8" height="5" fill="#7B2FBE" />
        {/* Code icon on shirt */}
        <rect x="6" y="8" width="1" height="1" fill="#00F5FF" />
        <rect x="8" y="8" width="2" height="1" fill="#00F5FF" />
        <rect x="6" y="9" width="4" height="1" fill="#FFD700" />
        {/* Arms */}
        <rect x="2" y="7" width="2" height="4" fill="#7B2FBE" />
        <rect x="12" y="7" width="2" height="4" fill="#7B2FBE" />
        {/* Hands */}
        <rect x="2" y="11" width="2" height="1" fill="#E8E8F0" />
        <rect x="12" y="11" width="2" height="1" fill="#E8E8F0" />
        {/* Legs */}
        <rect x="5" y="12" width="2" height="3" fill="#16213E" />
        <rect x="9" y="12" width="2" height="3" fill="#16213E" />
        {/* Boots */}
        <rect x="4" y="14" width="3" height="1" fill="#7B2FBE" />
        <rect x="9" y="14" width="3" height="1" fill="#7B2FBE" />
        {/* Helmet visor glow */}
        <rect x="5" y="1" width="6" height="1" fill="#2A2A5A" />
        <rect x="4" y="2" width="1" height="4" fill="#2A2A5A" />
        <rect x="11" y="2" width="1" height="4" fill="#2A2A5A" />
        <rect x="5" y="6" width="6" height="1" fill="#2A2A5A" />
      </svg>
    </div>
  )
}
```

**HeroSection.tsx:**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import PixelCanvas from './PixelCanvas'
import PixelChar from './PixelChar'

// Use dynamic import in page.tsx to avoid SSR issues with anime.js

export default function HeroSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const charRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadAnime = async () => {
      const anime = (await import('animejs')).default

      // Stagger title letters
      const titleEl = titleRef.current
      if (!titleEl) return

      const letters = titleEl.querySelectorAll('.letter')
      anime({
        targets: letters,
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(60, { start: 500 }),
        easing: 'easeOutExpo',
      })

      // Subtitle typewriter
      const sub = subtitleRef.current
      if (sub) {
        const text = 'FULL STACK DEVELOPER'
        sub.textContent = ''
        let i = 0
        const typeTimer = setInterval(() => {
          sub.textContent += text[i]
          i++
          if (i >= text.length) clearInterval(typeTimer)
        }, 80)
      }

      // Fade in CTA
      anime({
        targets: ctaRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: 2200,
        easing: 'easeOutQuad',
      })

      // Float in character
      anime({
        targets: charRef.current,
        translateY: [60, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 800,
        easing: 'easeOutBack',
      })
    }

    loadAnime()
  }, [])

  const titleText = 'SUNNY GADE'

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{ background: 'var(--px-bg)' }}
    >
      {/* Pixel grid overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(var(--px-border) 1px, transparent 1px), linear-gradient(90deg, var(--px-border) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Star field + particles */}
      <PixelCanvas />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-4">
        {/* Title */}
        <div ref={titleRef} className="flex flex-wrap justify-center gap-1" aria-label={titleText}>
          {titleText.split('').map((char, i) => (
            <span
              key={i}
              className="letter font-pixel text-px-cyan text-glow-cyan"
              style={{
                fontSize: 'clamp(20px, 4vw, 48px)',
                opacity: 0,
                display: 'inline-block',
                width: char === ' ' ? '1.5em' : 'auto',
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Subtitle with cursor */}
        <div className="flex items-center gap-1 font-pixel" style={{ fontSize: 'clamp(10px, 1.5vw, 16px)' }}>
          <span ref={subtitleRef} className="text-px-gold" />
          <span className="text-px-gold blink">▮</span>
        </div>

        {/* Character sprite */}
        <div ref={charRef} style={{ opacity: 0 }}>
          <PixelChar />
        </div>

        {/* CTA */}
        <div ref={ctaRef} style={{ opacity: 0 }} className="flex flex-col items-center gap-3 mt-4">
          <p className="font-pixel text-px-dim blink" style={{ fontSize: 10 }}>
            ▼ SCROLL TO START ▼
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-20 left-4 font-pixel text-[8px] text-px-dim">
        LVL.99<br />EXP.MAX
      </div>
      <div className="absolute top-20 right-4 font-pixel text-[8px] text-px-dim text-right">
        CLASS:<br />DEV
      </div>
    </section>
  )
}
```

**Step: Commit**

```bash
git add src/components/PixelCanvas.tsx src/components/PixelChar.tsx src/components/HeroSection.tsx
git commit -s -m "feat: hero section with star field, pixel character, stagger animations"
```

---

## Task 6: AboutSection — Character Stats Screen

**Files:**
- Create: `src/components/AboutSection.tsx`

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { label: 'STR', name: 'Problem Solving', value: 92, color: 'var(--px-coral)' },
  { label: 'INT', name: 'Architecture', value: 88, color: 'var(--px-cyan)' },
  { label: 'DEX', name: 'Frontend Craft', value: 85, color: 'var(--px-green)' },
  { label: 'WIS', name: 'System Design', value: 90, color: 'var(--px-gold)' },
  { label: 'CHA', name: 'Collaboration', value: 95, color: 'var(--px-purple)' },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const barsRef = useRef<HTMLDivElement[]>([])
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stat bars on scroll
      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        const fill = bar.querySelector('.stat-bar-fill') as HTMLElement
        const stat = STATS[i]
        gsap.fromTo(fill,
          { width: '0%' },
          {
            width: `${stat.value}%`,
            duration: 1.2,
            ease: 'power2.out',
            delay: i * 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              once: true,
            },
          }
        )
      })

      // Counter animation
      if (counterRef.current) {
        const obj = { val: 0 }
        gsap.to(obj, {
          val: 5,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          onUpdate: () => {
            if (counterRef.current) counterRef.current.textContent = Math.round(obj.val).toString()
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
      {/* Section header */}
      <div className="max-w-5xl mx-auto w-full mb-12">
        <div className="flex items-center gap-4">
          <span className="font-pixel text-px-cyan text-[8px]">02.</span>
          <h2 className="font-pixel text-px-gold text-glow-gold" style={{ fontSize: 'clamp(14px, 2.5vw, 24px)' }}>
            CHARACTER STATS
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--px-border)' }} />
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12 items-start">

        {/* Left: Bio panel */}
        <div className="pixel-border-cyan p-6" style={{ background: 'var(--px-bg)' }}>
          {/* Portrait placeholder */}
          <div className="mb-6 p-4 text-center" style={{ border: '2px solid var(--px-border)' }}>
            <div className="inline-block">
              {/* Pixel portrait SVG */}
              <svg viewBox="0 0 32 32" width="128" height="128" style={{ imageRendering: 'pixelated' }}>
                <rect width="32" height="32" fill="#16213E" />
                {/* Head */}
                <rect x="10" y="4" width="12" height="12" fill="#E8D5C0" />
                {/* Hair */}
                <rect x="10" y="4" width="12" height="3" fill="#2D1B00" />
                <rect x="10" y="4" width="2" height="5" fill="#2D1B00" />
                {/* Eyes */}
                <rect x="12" y="9" width="2" height="2" fill="#1A1A2E" />
                <rect x="18" y="9" width="2" height="2" fill="#1A1A2E" />
                {/* Smile */}
                <rect x="13" y="12" width="6" height="1" fill="#2D1B00" />
                <rect x="13" y="12" width="1" height="1" fill="#FF6B6B" />
                <rect x="18" y="12" width="1" height="1" fill="#FF6B6B" />
                {/* Body */}
                <rect x="8" y="16" width="16" height="10" fill="#7B2FBE" />
                {/* Shirt detail */}
                <rect x="12" y="18" width="8" height="1" fill="#00F5FF" />
                <rect x="12" y="20" width="5" height="1" fill="#00F5FF" />
                {/* Arms */}
                <rect x="4" y="16" width="4" height="8" fill="#7B2FBE" />
                <rect x="24" y="16" width="4" height="8" fill="#7B2FBE" />
              </svg>
            </div>
            <div className="mt-2 font-pixel text-px-cyan" style={{ fontSize: 8 }}>SUNNY.EXE</div>
          </div>

          {/* Bio text */}
          <div className="space-y-3 font-terminal text-px-text" style={{ fontSize: 20 }}>
            <p><span className="text-px-gold">{'>'}</span> Full Stack Developer</p>
            <p><span className="text-px-gold">{'>'}</span> <span ref={counterRef}>0</span>+ years of experience</p>
            <p><span className="text-px-gold">{'>'}</span> React · Node.js · TypeScript</p>
            <p><span className="text-px-gold">{'>'}</span> Loves pixel-perfect UI</p>
            <p><span className="text-px-gold">{'>'}</span> Turning ideas into code<span className="blink">_</span></p>
          </div>
        </div>

        {/* Right: Stats panel */}
        <div className="pixel-border p-6" style={{ background: 'var(--px-bg)' }}>
          <div className="font-pixel text-px-cyan mb-6" style={{ fontSize: 10 }}>
            ╔══ STAT SHEET ══╗
          </div>

          <div className="space-y-5">
            {STATS.map((stat, i) => (
              <div key={stat.label} ref={el => { if (el) barsRef.current[i] = el }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-3">
                    <span className="font-pixel text-[8px]" style={{ color: stat.color }}>{stat.label}</span>
                    <span className="font-terminal text-px-dim" style={{ fontSize: 18 }}>{stat.name}</span>
                  </div>
                  <span className="font-pixel text-[8px] text-px-text">{stat.value}</span>
                </div>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill" style={{ background: `linear-gradient(90deg, ${stat.color}88, ${stat.color})` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 font-pixel text-[8px]" style={{ borderTop: '1px solid var(--px-border)' }}>
            <div className="flex justify-between text-px-dim">
              <span>CLASS: FULL STACK</span>
              <span>RANK: S+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step: Commit**

```bash
git add src/components/AboutSection.tsx
git commit -s -m "feat: about section with character stats and animated bars"
```

---

## Task 7: SkillsSection — Inventory Grid

**Files:**
- Create: `src/components/SkillsSection.tsx`

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

type Category = 'WEAPONS' | 'ARMOR' | 'TOOLS'

interface Skill {
  name: string
  level: number
  desc: string
  category: Category
  color: string
  icon: string
}

const SKILLS: Skill[] = [
  { name: 'TypeScript', level: 95, desc: 'Primary language. Type-safe code at scale.', category: 'WEAPONS', color: '#3178C6', icon: 'TS' },
  { name: 'JavaScript', level: 92, desc: 'The language of the web.', category: 'WEAPONS', color: '#F7DF1E', icon: 'JS' },
  { name: 'Python',     level: 80, desc: 'Scripts, automation, data pipelines.', category: 'WEAPONS', color: '#3776AB', icon: 'PY' },
  { name: 'Go',         level: 70, desc: 'High-performance services.', category: 'WEAPONS', color: '#00ADD8', icon: 'GO' },
  { name: 'SQL',        level: 88, desc: 'Complex queries, optimization.', category: 'WEAPONS', color: '#336791', icon: 'SQL' },
  { name: 'React',      level: 94, desc: 'Component-driven UIs.', category: 'ARMOR', color: '#61DAFB', icon: 'RE' },
  { name: 'Next.js',    level: 90, desc: 'SSR, SSG, full-stack React.', category: 'ARMOR', color: '#E8E8F0', icon: 'NX' },
  { name: 'Node.js',    level: 88, desc: 'Event-driven backend services.', category: 'ARMOR', color: '#339933', icon: 'ND' },
  { name: 'Tailwind',   level: 92, desc: 'Utility-first styling.', category: 'ARMOR', color: '#06B6D4', icon: 'TW' },
  { name: 'PostgreSQL', level: 85, desc: 'Relational DB of choice.', category: 'ARMOR', color: '#336791', icon: 'PG' },
  { name: 'Docker',     level: 80, desc: 'Containerization.', category: 'TOOLS', color: '#2496ED', icon: 'DK' },
  { name: 'AWS',        level: 75, desc: 'Cloud infrastructure.', category: 'TOOLS', color: '#FF9900', icon: 'AW' },
  { name: 'Git',        level: 95, desc: 'Version control master.', category: 'TOOLS', color: '#F05032', icon: 'GT' },
  { name: 'Figma',      level: 72, desc: 'Design to code pipeline.', category: 'TOOLS', color: '#F24E1E', icon: 'FG' },
  { name: 'GraphQL',    level: 78, desc: 'API query language.', category: 'TOOLS', color: '#E535AB', icon: 'GQ' },
]

const CATEGORIES: Category[] = ['WEAPONS', 'ARMOR', 'TOOLS']

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const slotsRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<Skill | null>(SKILLS[0])
  const [activeCategory, setActiveCategory] = useState<Category>('WEAPONS')

  useEffect(() => {
    const slots = slotsRef.current?.querySelectorAll('.inventory-slot')
    if (!slots) return

    gsap.fromTo(slots,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: { amount: 0.8, from: 'random' },
        ease: 'back.out(2)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true },
      }
    )
  }, [])

  const filtered = SKILLS.filter(s => s.category === activeCategory)

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center px-4 py-24"
      style={{ background: 'var(--px-bg)' }}
    >
      {/* Section header */}
      <div className="max-w-4xl mx-auto w-full mb-12">
        <div className="flex items-center gap-4">
          <span className="font-pixel text-px-cyan text-[8px]">03.</span>
          <h2 className="font-pixel text-px-gold text-glow-gold" style={{ fontSize: 'clamp(14px, 2.5vw, 24px)' }}>
            INVENTORY
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--px-border)' }} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        {/* Inventory panel */}
        <div className="pixel-border" style={{ background: 'var(--px-surface)' }}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '2px solid var(--px-border)' }}>
            <span className="font-pixel text-px-cyan" style={{ fontSize: 9 }}>INVENTORY</span>
            <span className="font-pixel text-px-dim" style={{ fontSize: 7 }}>{SKILLS.length}/64 SLOTS</span>
          </div>

          {/* Category tabs */}
          <div className="flex" style={{ borderBottom: '2px solid var(--px-border)' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-1 py-2 font-pixel transition-colors"
                style={{
                  fontSize: 8,
                  cursor: 'none',
                  color: activeCategory === cat ? 'var(--px-cyan)' : 'var(--px-text-dim)',
                  background: activeCategory === cat ? 'var(--px-bg)' : 'transparent',
                  borderRight: '1px solid var(--px-border)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-0" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            {/* Grid */}
            <div ref={slotsRef} className="col-span-2 grid p-4 gap-2"
              style={{ gridTemplateColumns: 'repeat(5, 64px)', alignContent: 'start' }}>
              {filtered.map(skill => (
                <div
                  key={skill.name}
                  className={`inventory-slot ${selected?.name === skill.name ? 'selected' : ''}`}
                  onClick={() => setSelected(skill)}
                  title={skill.name}
                >
                  <div className="font-pixel flex flex-col items-center gap-1">
                    <span style={{ fontSize: 8, color: skill.color }}>{skill.icon}</span>
                    <div className="w-8 h-1" style={{ background: 'var(--px-border)' }}>
                      <div style={{ width: `${skill.level}%`, height: '100%', background: skill.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            <div className="p-4" style={{ borderLeft: '2px solid var(--px-border)', minHeight: 200 }}>
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div
                    key={selected.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-3"
                  >
                    <div className="font-pixel" style={{ fontSize: 9, color: selected.color }}>
                      {selected.name}
                    </div>
                    <div className="font-terminal text-px-dim" style={{ fontSize: 16 }}>
                      {selected.desc}
                    </div>
                    <div>
                      <div className="font-pixel text-[7px] text-px-dim mb-1">PROFICIENCY</div>
                      <div className="stat-bar-track">
                        <motion.div
                          className="stat-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${selected.level}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ background: `linear-gradient(90deg, ${selected.color}88, ${selected.color})` }}
                        />
                      </div>
                      <div className="font-pixel text-[7px] text-px-dim mt-1 text-right">{selected.level}/100</div>
                    </div>
                    <div className="font-pixel text-[7px]" style={{ color: 'var(--px-border)' }}>
                      CAT: {selected.category}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step: Commit**

```bash
git add src/components/SkillsSection.tsx
git commit -s -m "feat: inventory grid skills section with animated detail panel"
```

---

## Task 8: ProjectsSection — Quest Log

**Files:**
- Create: `src/components/ProjectsSection.tsx`

```tsx
'use client'
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Project {
  id: number
  title: string
  rank: 'LEGENDARY' | 'EPIC' | 'RARE'
  stars: number
  objective: string
  stack: string[]
  description: string
  link?: string
  github?: string
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'PROJECT ALPHA',
    rank: 'LEGENDARY',
    stars: 5,
    objective: 'A full-stack SaaS platform with real-time collaboration',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'WebSockets'],
    description: 'Built from scratch — auth, billing, real-time sync. Scales to 10k+ concurrent users with edge caching.',
    github: '#',
    link: '#',
  },
  {
    id: 2,
    title: 'PROJECT BETA',
    rank: 'EPIC',
    stars: 4,
    objective: 'High-performance REST API serving 1M+ requests/day',
    stack: ['Node.js', 'Go', 'Redis', 'Docker'],
    description: 'Microservices architecture with circuit breakers, distributed tracing, and zero-downtime deploys.',
    github: '#',
    link: '#',
  },
  {
    id: 3,
    title: 'PROJECT GAMMA',
    rank: 'RARE',
    stars: 4,
    objective: 'Open-source developer tool with 2k+ GitHub stars',
    stack: ['React', 'Electron', 'TypeScript'],
    description: 'A cross-platform desktop app for API testing. Plugin system, theme engine, keyboard-first UX.',
    github: '#',
    link: '#',
  },
]

const RANK_COLORS = {
  LEGENDARY: 'var(--px-gold)',
  EPIC:      'var(--px-purple)',
  RARE:      '#4FC3F7',
}

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="font-pixel" style={{ fontSize: 8 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < stars ? 'var(--px-gold)' : 'var(--px-border)' }}>★</span>
      ))}
    </span>
  )
}

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <section
      id="projects"
      className="relative min-h-screen flex flex-col justify-center px-4 py-24"
      style={{ background: 'var(--px-surface)' }}
    >
      {/* Section header */}
      <div className="max-w-4xl mx-auto w-full mb-12">
        <div className="flex items-center gap-4">
          <span className="font-pixel text-px-cyan text-[8px]">04.</span>
          <h2 className="font-pixel text-px-gold text-glow-gold" style={{ fontSize: 'clamp(14px, 2.5vw, 24px)' }}>
            QUEST LOG
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--px-border)' }} />
          <span className="font-pixel text-px-dim" style={{ fontSize: 7 }}>
            {PROJECTS.length} COMPLETED
          </span>
        </div>
      </div>

      {/* Quest cards */}
      <div className="max-w-4xl mx-auto w-full space-y-4">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="pixel-border p-6 group"
            style={{ background: 'var(--px-bg)', cursor: 'none' }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                {/* Rank badge */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-pixel px-2 py-1" style={{
                    fontSize: 7,
                    color: RANK_COLORS[project.rank],
                    border: `1px solid ${RANK_COLORS[project.rank]}`,
                  }}>
                    ◆ {project.rank}
                  </span>
                  <StarRating stars={project.stars} />
                </div>

                {/* Title */}
                <h3 className="font-pixel text-px-text mb-2 group-hover:text-px-cyan transition-colors"
                  style={{ fontSize: 'clamp(10px, 1.5vw, 14px)' }}>
                  {project.title}
                </h3>

                {/* Objective */}
                <p className="font-terminal text-px-dim mb-3" style={{ fontSize: 20 }}>
                  <span className="text-px-gold">OBJECTIVE:</span> {project.objective}
                </p>

                {/* Stack tags */}
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(tech => (
                    <span key={tech} className="font-pixel px-2 py-1"
                      style={{ fontSize: 7, background: 'var(--px-surface)', border: '1px solid var(--px-border)', color: 'var(--px-cyan)' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveProject(project)}
                  className="px-btn"
                  style={{ fontSize: 7, padding: '8px 14px' }}
                >
                  VIEW QUEST
                </button>
                {project.github && (
                  <a href={project.github} className="px-btn px-btn-cyan" style={{ fontSize: 7, padding: '8px 14px', textDecoration: 'none', textAlign: 'center' }}>
                    SOURCE
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="pixel-border-cyan p-8 max-w-lg w-full"
              style={{ background: 'var(--px-bg)', cursor: 'none' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="font-pixel text-[7px] text-px-dim mb-4">╔══ QUEST DETAILS ══╗</div>
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize: 7, color: RANK_COLORS[activeProject.rank], fontFamily: "'Press Start 2P'" }}>
                  ◆ {activeProject.rank}
                </span>
                <StarRating stars={activeProject.stars} />
              </div>
              <h3 className="font-pixel text-px-cyan text-glow-cyan mb-4"
                style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}>
                {activeProject.title}
              </h3>
              <p className="font-terminal text-px-text mb-4" style={{ fontSize: 20 }}>
                {activeProject.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {activeProject.stack.map(t => (
                  <span key={t} className="font-pixel" style={{ fontSize: 7, padding: '4px 8px', background: 'var(--px-surface)', border: '1px solid var(--px-cyan)', color: 'var(--px-cyan)' }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {activeProject.link && (
                  <a href={activeProject.link} className="px-btn" style={{ fontSize: 7, padding: '8px 14px', textDecoration: 'none' }}>
                    LIVE DEMO
                  </a>
                )}
                {activeProject.github && (
                  <a href={activeProject.github} className="px-btn px-btn-cyan" style={{ fontSize: 7, padding: '8px 14px', textDecoration: 'none' }}>
                    GITHUB
                  </a>
                )}
                <button onClick={() => setActiveProject(null)} className="px-btn-cyan ml-auto"
                  style={{ fontFamily: "'Press Start 2P'", fontSize: 7, padding: '8px 14px', cursor: 'none', background: 'transparent', color: 'var(--px-coral)', boxShadow: 'inset 0 0 0 1px var(--px-coral)' }}>
                  CLOSE ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
```

**Step: Commit**

```bash
git add src/components/ProjectsSection.tsx
git commit -s -m "feat: quest log projects section with modal detail view"
```

---

## Task 9: ContactSection — Save Point

**Files:**
- Create: `src/components/ContactSection.tsx`

```tsx
'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function ContactSection() {
  const [cursor, setCursor] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const LINKS = [
    { label: 'Email',    value: 'sunny@example.com',          href: 'mailto:sunny@example.com' },
    { label: 'GitHub',   value: 'github.com/sunnygade',        href: 'https://github.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/sunnygade',   href: 'https://linkedin.com' },
  ]

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true) }, 1800)
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24"
      style={{ background: 'var(--px-bg)' }}
    >
      {/* Section header */}
      <div className="max-w-4xl mx-auto w-full mb-16">
        <div className="flex items-center gap-4">
          <span className="font-pixel text-px-cyan text-[8px]">05.</span>
          <h2 className="font-pixel text-px-gold text-glow-gold" style={{ fontSize: 'clamp(14px, 2.5vw, 24px)' }}>
            SAVE POINT
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--px-border)' }} />
        </div>
      </div>

      {/* Save crystal */}
      <div className="mb-12 text-center">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
          style={{ fontSize: 64 }}
        >
          ✦
        </motion.div>
        <div className="font-pixel text-px-cyan text-glow-cyan blink mt-2" style={{ fontSize: 10 }}>
          SAVE POINT REACHED
        </div>
      </div>

      {/* Main panel */}
      <div className="pixel-border-gold p-8 w-full max-w-md" style={{ background: 'var(--px-surface)' }}>
        <div className="font-pixel text-px-gold mb-6" style={{ fontSize: 9 }}>╔══ CONTACT ══╗</div>

        {/* RPG menu options */}
        <div className="space-y-3 mb-8">
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-4 p-3 group transition-colors block"
              style={{
                cursor: 'none',
                border: '1px solid var(--px-border)',
                textDecoration: 'none',
              }}
              onMouseEnter={() => setCursor(i)}
            >
              <span className="font-pixel text-px-cyan" style={{ fontSize: 10, opacity: cursor === i ? 1 : 0 }}>▶</span>
              <div>
                <div className="font-pixel text-px-text group-hover:text-px-cyan transition-colors" style={{ fontSize: 8 }}>
                  {link.label}
                </div>
                <div className="font-terminal text-px-dim" style={{ fontSize: 16 }}>
                  {link.value}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Save button */}
        <button
          className="px-btn w-full text-center"
          onClick={handleSave}
          disabled={saving || saved}
          style={{ cursor: 'none', fontSize: 9 }}
        >
          {saved ? '✓ PROGRESS SAVED!' : saving ? 'SAVING...' : 'CONNECT WITH ME'}
        </button>

        {saving && (
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
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <div className="font-pixel text-px-dim" style={{ fontSize: 7 }}>
          BUILT WITH PIXELS & PASSION
        </div>
        <div className="font-pixel text-px-border mt-2" style={{ fontSize: 6 }}>
          © 2026 SUNNY GADE · ALL RIGHTS RESERVED
        </div>
      </div>
    </section>
  )
}
```

**Step: Commit**

```bash
git add src/components/ContactSection.tsx
git commit -s -m "feat: contact section as RPG save point"
```

---

## Task 10: Main Page — Compose All Sections

**Files:**
- Modify: `src/app/page.tsx`

```tsx
'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PixelNav from '@/components/PixelNav'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import ProjectsSection from '@/components/ProjectsSection'
import ContactSection from '@/components/ContactSection'

gsap.registerPlugin(ScrollTrigger)

export default function Page() {
  useEffect(() => {
    // TV-on intro effect
    const overlay = document.getElementById('tv-overlay')
    if (!overlay) return
    const tl = gsap.timeline()
    tl.fromTo(overlay,
      { scaleY: 1, opacity: 1 },
      { scaleY: 0.02, opacity: 1, duration: 0.3, ease: 'power4.out', delay: 0.2 }
    )
    .to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.out' })
    .set(overlay, { display: 'none' })
  }, [])

  return (
    <>
      {/* TV turn-on overlay */}
      <div
        id="tv-overlay"
        className="fixed inset-0 z-[99999] bg-white"
        style={{ transformOrigin: 'center center' }}
      />

      <PixelNav />

      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  )
}
```

**Step: Commit**

```bash
git add src/app/page.tsx
git commit -s -m "feat: compose main page with TV-on intro effect"
```

---

## Task 11: Delete Old Components

**Files to delete:**
- `src/components/CharacterIntro.tsx`
- `src/components/OceanCanvas.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/ScrollIndicator.tsx`
- `src/components/ShipArrival.tsx`
- `src/components/SkillBar.tsx`
- `src/components/VoyageHero.tsx`
- `src/components/WantedPoster.tsx`
- `src/components/WaveDivider.tsx`

```bash
git rm src/components/CharacterIntro.tsx \
       src/components/OceanCanvas.tsx \
       src/components/ProjectCard.tsx \
       src/components/ScrollIndicator.tsx \
       src/components/ShipArrival.tsx \
       src/components/SkillBar.tsx \
       src/components/VoyageHero.tsx \
       src/components/WantedPoster.tsx \
       src/components/WaveDivider.tsx
git commit -s -m "chore: remove old One Piece voyage components"
```

---

## Task 12: Build Verification

```bash
npm run build 2>&1
```

**Expected:** Clean build, zero errors. If ESLint errors:
- `@typescript-eslint/no-unused-vars` — remove unused imports
- `react/display-name` — add displayName or use named functions

Fix any errors, then:

```bash
git add -A
git commit -s -m "fix: build errors from pixel quest redesign"
```

---

## Task 13: Deploy to Vercel

```bash
vercel --prod 2>&1
```

Report the production URL.
