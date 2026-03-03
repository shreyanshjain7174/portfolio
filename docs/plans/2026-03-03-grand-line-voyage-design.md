# Grand Line Voyage — Cinematic Scroll Portfolio
**Design Doc** · 2026-03-03

---

## Overview

A One Piece–themed personal portfolio built as a single cinematic scroll experience. Replaces the current dark, section-based layout with a bright, daytime ocean aesthetic driven by GSAP ScrollTrigger and Lenis smooth scroll. Five narrative "Acts" unfold as the user scrolls, using static assets animated with GSAP transforms and a lightweight canvas wave layer.

---

## Goals

- Visually distinctive: anime-inspired bright palette, pirate voyage narrative
- Performant: static images + GSAP transforms, no heavy video, no Remotion in bundle
- Clean code: remove dead dependencies (animejs, remotion, replicate)
- Responsive: mobile-friendly fallback for scroll-pinned acts

---

## Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--sky` | `#87CEEB` | Background top |
| `--sky-deep` | `#4A90D9` | Background mid |
| `--ocean` | `#1E90FF` | Background bottom, accents |
| `--ocean-light` | `#60BFF5` | Turquoise highlights |
| `--sand` | `#FFF8E7` | Card backgrounds, cream panels |
| `--luffy-red` | `#D70000` | Primary accent, bounty trim |
| `--gold` | `#FFD700` | Title text, glow, stars |
| `--text-dark` | `#1a1a2e` | Body text on light backgrounds |

**Background**: `linear-gradient(180deg, #87CEEB 0%, #4A90D9 40%, #1E90FF 100%)` — fixed to viewport, acts layer above it.

---

## Tech Stack

### Add
- `gsap` — scroll-scrubbed animations, pin management
- `@gsap/react` — React hooks (`useGSAP`) for cleanup-safe registration
- `lenis` — smooth inertia scroll, integrates with GSAP via `lenis.on('scroll', ScrollTrigger.update)`

### Keep
- `framer-motion` — hover micro-interactions, card stagger reveals (Acts 4–5)
- `next` 14, `react` 18, `tailwindcss` 3, `typescript`

### Remove
- `animejs` + `@types/animejs` — replaced by GSAP entirely
- `remotion` + `@remotion/player` — removed from bundle; GSAP + Canvas covers all animation
- `replicate` — build-time asset generation only, not imported by any page component

---

## Architecture

```
app/
  layout.tsx         — Lenis provider wrapping <html>, font setup
  page.tsx           — scroll orchestrator, 500vh+ main, ScrollTrigger context
  globals.css        — bright palette tokens, remove all dark tokens

components/
  OceanCanvas.tsx    — <canvas> sine-wave overlay, 60fps rAF loop
  VoyageHero.tsx     — Act 1: panorama + title
  ShipArrival.tsx    — Act 2: ship scale/translate scrub
  CharacterIntro.tsx — Act 3: split-screen character + spec sheet
  ProjectsSection.tsx — Act 4: bounty board wanted posters
  ContactSection.tsx  — Act 5: den den mushi contact

  [DELETE] SpeedLines.tsx
  [DELETE] HeroSection.tsx
  [DELETE] AboutSection.tsx
  [DELETE] remotion/OceanIntro.tsx
  [DELETE] remotion/BootPlayer.tsx
  [KEEP]   WaveDivider.tsx — reuse in Act 5 transition
  [KEEP]   WantedPoster.tsx — reuse in Act 4
  [KEEP]   SkillBar.tsx — reuse in Act 3 spec sheet
  [KEEP]   ScrollIndicator.tsx — reuse in Act 1
```

---

## Five Acts

### Act 1 — Ocean Panorama (0–20% scroll)

**Layout**: Full-bleed `ocean-panorama.png` as background-image, fixed position.

**Animations**:
- CSS `@keyframes` gentle pan/zoom on image (subtle, no GSAP needed)
- `OceanCanvas` overlay: translucent sine-wave curves, white/cyan, 60fps
- Title `"SUNNY GADE"` — Bangers font, gold, text-shadow glow — fades in on load
- Subtitle epithet fades in 300ms after title
- `ScrollIndicator` bounces below title

**GSAP**: Title parallax (slow upward drift as user scrolls out of Act 1)

---

### Act 2 — Ship Arrival (20–40% scroll)

**Layout**: `thousand-sunny.png` centered, absolute positioned.

**Animations (all GSAP ScrollTrigger scrub)**:
- Ship `scale`: `0.3 → 1.0`
- Ship `translateY`: `120vh → 0` (rises from bottom)
- Ship `opacity`: `0 → 1` (fade in as it rises)
- Parallax: background position shifts slower than ship (clouds effect)
- Section pins when ship reaches center; unpins at 40%

**No framer-motion here** — pure GSAP scrub for scroll-locked feel.

---

### Act 3 — Character Introduction (40–60% scroll)

**Layout**: Split-screen — character PNG left, spec sheet panel right.

**Animations (GSAP ScrollTrigger scrub)**:
- `character-v2.png` slides in from left: `translateX(-100vw → 0)`
- Spec sheet panel slides in from right: `translateX(100vw → 0)`
- Both triggered simultaneously on entering Act 3 scroll zone
- `SkillBar` power bars: animate width 0→100% with spring easing once panel is visible

**Spec sheet content**:
```
Name:        SUNNY GADE
Epithet:     The Infrastructure King
Devil Fruit: Laptop-Laptop no Mi
Bounty:      ¥400G+ Throughput
Skills:      React · TypeScript · Go · K8s · Python
```

---

### Act 4 — Bounty Board / Projects (60–80% scroll)

**Layout**: 2-column grid (1-column on mobile), `WantedPoster` cards.

**Animations**:
- Cards stagger-reveal with Framer Motion `variants` + `whileInView`
- Each card: scale `0.9 → 1.0`, opacity `0 → 1`, stagger 120ms
- Hover: slight rotate + shadow lift (Framer `whileHover`)

**Card content** (WANTED poster style, cream `--sand` background):
- Project name as "WANTED" subject
- Bounty value (e.g., `¥∞ BOUNTY — DEAD OR ALIVE`)
- 1-2 line description
- Tech stack tags
- Links: GitHub / Live

---

### Act 5 — Den Den Mushi / Contact (80–100% scroll)

**Layout**: `WaveDivider` SVG transition, then contact section on `--sand` background.

**Animations**:
- Framer Motion fade-in for heading and cards
- Social cards: GitHub, LinkedIn, Instagram, Email
- Glass-morphism cards: `backdrop-filter: blur(8px)`, red glow `box-shadow` on hover

---

## Scroll Setup

```
Lenis init → integrates with GSAP:
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(time => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

Page total height: ~500vh
  Act 1: 0–100vh  (pinned 100vh)
  Act 2: 100–200vh (pinned 100vh)
  Act 3: 200–300vh (pinned 100vh)
  Act 4: 300–400vh (natural scroll)
  Act 5: 400–500vh (natural scroll)
```

### Mobile Consideration
GSAP ScrollTrigger pin + scrub has known issues on iOS Safari with momentum scroll. Mitigation: detect `(pointer: coarse)` and reduce pinned acts to simple fade-in-on-scroll (no scrub), letting Lenis handle smooth feel. Acts 4–5 (Framer `whileInView`) work identically on mobile.

---

## Files Delta

| Action | Path |
|--------|------|
| Rewrite | `src/app/globals.css` |
| Rewrite | `tailwind.config.ts` |
| Rewrite | `src/app/layout.tsx` |
| Rewrite | `src/app/page.tsx` |
| Create | `src/components/OceanCanvas.tsx` |
| Create | `src/components/VoyageHero.tsx` |
| Create | `src/components/ShipArrival.tsx` |
| Create | `src/components/CharacterIntro.tsx` |
| Rewrite | `src/components/ProjectsSection.tsx` |
| Rewrite | `src/components/ContactSection.tsx` |
| Delete | `src/components/SpeedLines.tsx` |
| Delete | `src/components/HeroSection.tsx` |
| Delete | `src/components/AboutSection.tsx` |
| Delete | `src/components/OnePieceDecorations.tsx` |
| Delete | `src/components/remotion/OceanIntro.tsx` |
| Delete | `src/components/remotion/BootPlayer.tsx` |
| Keep | `src/components/WaveDivider.tsx` |
| Keep | `src/components/WantedPoster.tsx` |
| Keep | `src/components/SkillBar.tsx` |
| Keep | `src/components/ScrollIndicator.tsx` |
| Keep | `src/hooks/useTypewriter.ts` |

---

## Assets (Already Generated)

| File | Usage |
|------|-------|
| `public/assets/ocean-panorama.png` | Act 1 background |
| `public/assets/thousand-sunny.png` | Act 2 ship |
| `public/assets/character-v2.png` | Act 3 character (bright) |
| `public/assets/character-v1.png` | Backup dark variant |

---

## Dependencies to Add/Remove

```bash
# Add
npm install gsap @gsap/react lenis

# Remove
npm uninstall animejs @types/animejs remotion @remotion/player replicate
```
