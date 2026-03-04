# PIXEL QUEST — Sunny Gade Developer Portfolio
## Design Document · 2026-03-03

---

## 1. Concept

**"PIXEL QUEST"** — The portfolio is a retro RPG game. Visitors are the player.
Every section is a game screen. The story is Sunny Gade's developer journey.

No anime. No references. Pure craftsmanship. Competition-winning pixel art UI.

---

## 2. Visual Language

### Color Palette
```
--px-bg:         #0D0D1A   /* deep dark space */
--px-surface:    #16213E   /* card / panel bg */
--px-border:     #2A2A5A   /* subtle grid lines */
--px-purple:     #7B2FBE   /* primary brand */
--px-cyan:       #00F5FF   /* neon accent 1 */
--px-gold:       #FFD700   /* neon accent 2 */
--px-coral:      #FF6B6B   /* accent 3 */
--px-green:      #39FF14   /* success / HP */
--px-text:       #E8E8F0   /* body text */
--px-text-dim:   #8888AA   /* muted text */
```

### Typography
- **Display:** `Press Start 2P` — pixel font for headings (Google Fonts)
- **Body:** `VT323` — terminal-style pixel body text
- **Code/Mono:** `JetBrains Mono` — already installed

### Global Texture
- Subtle `4px × 4px` pixel grid overlay on all backgrounds
- CSS scanline effect (1px repeating horizontal lines, 3% opacity)
- Custom pixel cursor (8×8 CSS pixel art crosshair)

---

## 3. Sections

### Section 1 — HERO: "PLAYER SELECT"
**Screen:** Full-viewport dark space with animated star field (Canvas, 200 stars)

**Layout:**
```
┌──────────────────────────────────────────────┐
│  ★ PIXEL QUEST          [HP ████████] LVL 99 │  ← pixel nav
├──────────────────────────────────────────────┤
│                                              │
│         SUNNY GADE                           │  ← Press Start 2P, types in
│         ───────────────────                  │
│         FULL STACK DEVELOPER ▮               │  ← blinking cursor
│                                              │
│    [▓▓ PIXEL ART CHARACTER ▓▓]               │  ← CSS sprite, idle anim
│                                              │
│         ▼ PRESS SCROLL TO START ▼            │  ← blink animation
└──────────────────────────────────────────────┘
```

**Animations:**
- Canvas star field (twinkle + drift)
- Title letter-stagger with anime.js (each char drops from above)
- Subtitle typewriter
- Pixel character: 4-frame idle CSS sprite (breathing/bouncing)
- "PRESS SCROLL" blinks at 1Hz
- Floating pixel sparkles (canvas particles)

---

### Section 2 — ABOUT: "CHARACTER STATS"
**Screen:** Split-panel RPG character sheet

**Layout:**
```
┌─────────────────┬───────────────────────────┐
│  ┌───────────┐  │  ╔═══════════════════════╗ │
│  │           │  │  ║  SUNNY GADE           ║ │
│  │  [PIXEL   │  │  ║  CLASS: Full Stack    ║ │
│  │  PORTRAIT]│  │  ║  LVL: 5 YRS EXP      ║ │
│  │           │  │  ╠═══════════════════════╣ │
│  └───────────┘  │  ║ STR ████████░░  80   ║ │
│                 │  ║ INT █████████░  90   ║ │
│  [GOLD BORDER]  │  ║ DEX ████████░░  85   ║ │
│                 │  ║ CHA ██████████ 100   ║ │
│                 │  ╚═══════════════════════╝ │
│                 │  > Based in [City]         │
│                 │  > Loves clean code        │
└─────────────────┴───────────────────────────┘
```

**Animations:**
- Stat bars fill left→right on scroll (GSAP ScrollTrigger)
- EXP number counts up (anime.js)
- Portrait "breathing" subtle scale pulse
- Bio text types in line by line

---

### Section 3 — SKILLS: "INVENTORY"
**Screen:** Grid inventory à la Minecraft / RPG

**Layout:**
```
╔═════════════════════════════════════════════╗
║  INVENTORY                    [16/64 SLOTS] ║
╠═════════════════════════════════════════════╣
║  WEAPONS        ARMOR          ACCESSORIES  ║
║  [TS] [PY] [Go] [React][Next] [Git][Docker] ║
║  [Rust][SQL][JS] [Node][AWS]  [K8s][Figma]  ║
╠═════════════════════════════════════════════╣
║  SELECTED: TypeScript ► "Primary language"  ║
╚═════════════════════════════════════════════╝
```

**Interactions:**
- Hover: item tooltip flies up (anime.js)
- Click: item details appear in bottom panel with bounce-in
- Grid cells appear with pixel-flip reveal on scroll (staggered)
- Pixel art icon per skill (CSS box-shadow pixel art, 8×8)

---

### Section 4 — PROJECTS: "QUEST LOG"
**Screen:** Scroll-through quest book

**Layout:**
```
╔═══════════════════════════════════════════════╗
║  📜 QUEST LOG                   3 COMPLETED  ║
╠═══════════════════════════════════════════════╣
║  ◆ PROJECT NAME              [★★★★★] EPIC    ║
║    OBJECTIVE: What it does...                 ║
║    STACK: React · Node · PostgreSQL           ║
║    [VIEW QUEST] [SOURCE CODE]                 ║
╠═══════════════════════════════════════════════╣
║  ◆ PROJECT NAME              [★★★★☆] RARE    ║
│    ...                                        ║
╚═══════════════════════════════════════════════╝
```

**Animations:**
- Cards slide in from right with Framer Motion (stagger)
- Difficulty stars fill gold on hover
- "VIEW QUEST" button pulses on hover with pixel glow
- Modal opens with pixel dissolve effect
- Each project card has category color accent

---

### Section 5 — CONTACT: "SAVE POINT"
**Screen:** Classic RPG save point

**Layout:**
```
                ✦ SAVE POINT ✦
          ╔═══════════════════════╗
          ║   SUNNY GADE          ║
          ║   > Email             ║
          ║   > GitHub            ║
          ║   > LinkedIn          ║
          ║                       ║
          ║  [  SEND MESSAGE  ]   ║
          ╚═══════════════════════╝
         "Progress has been saved!"
```

**Animations:**
- Save crystal: animated rotating pixel crystal (CSS)
- Menu options highlight on hover (classic RPG cursor)
- Form fields have pixel-border focus state
- On submit: "SAVING..." pixel progress animation

---

## 4. Global Effects

### Navigation (Pixel HUD)
- Fixed top bar styled as game HUD
- Left: `[PIXEL QUEST]` logo
- Center: section dots (current section highlighted)
- Right: "HP" bar (scroll progress) + level counter
- Slides down from top with GSAP on load

### Page Transitions
- Section-to-section: GSAP custom pixel wipe (dark blocks sweep across, clear to new section)
- Site load: TV-on effect (white line from center expanding to fill, then content)

### Ambient Effects
- Floating pixel particles on hero (canvas)
- Cursor: custom 8×8 crosshair pixel cursor
- Selection: gold highlight
- Scrollbar: styled in pixel/game aesthetic

---

## 5. Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 14 |
| Scroll smoothing | Lenis |
| Scroll animations | GSAP + ScrollTrigger |
| Micro-animations | Anime.js |
| Transitions | Framer Motion |
| Pixel particles | Canvas API |
| Styling | Tailwind CSS 3 + CSS custom |
| Fonts | Press Start 2P + VT323 (Google) |

---

## 6. Component Architecture

```
src/
  app/
    globals.css          — pixel design tokens, scanlines, cursor
    layout.tsx           — fonts (Press Start 2P, VT323), LenisProvider
    page.tsx             — compose all sections
  components/
    PixelNav.tsx          — HUD-style nav with scroll progress HP bar
    HeroSection.tsx       — player select: star field, title, sprite
    AboutSection.tsx      — character stats sheet
    SkillsSection.tsx     — inventory grid with tooltips
    ProjectsSection.tsx   — quest log with modal
    ContactSection.tsx    — save point
    PixelCanvas.tsx       — star field + floating particles
    PixelChar.tsx         — CSS animated sprite character
    PixelTransition.tsx   — wipe transition overlay (GSAP)
    ScanlineOverlay.tsx   — fixed CRT scanline effect
    SkillItem.tsx         — individual inventory slot
    ProjectCard.tsx       — quest log entry
    PixelModal.tsx        — project detail modal
```

---

## 7. Content (Sunny Gade)

### About
- Class: Full Stack Developer
- Level: [X] years experience
- Location: [to populate]
- Specialties: React, Node.js, TypeScript, Cloud

### Skills
- **Weapons (Languages):** TypeScript, JavaScript, Python, Go, SQL
- **Armor (Frameworks):** React, Next.js, Node.js, Express, Tailwind
- **Accessories (Tools):** Git, Docker, AWS, PostgreSQL, Figma

### Projects (3 to showcase)
- [User to provide — placeholders used]

---

## 8. What Makes This Competition-Winning

1. **Cohesion** — every element speaks the same visual language
2. **Delight** — micro-interactions at every touch point
3. **Performance** — canvas particles, CSS animations, no jank
4. **Originality** — no template feel, pure craft
5. **Story** — visitor goes on a journey, not just scrolls a page
6. **Accessibility** — `prefers-reduced-motion` respected
