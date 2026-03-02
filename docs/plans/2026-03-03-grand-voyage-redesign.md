# Grand Voyage — One Piece Themed Portfolio Redesign

## Context

Current portfolio has a dark terminal/hacker aesthetic (green on black, CRT scanlines, manga panels). User wants an anime-inspired portfolio using One Piece color palette — vibrant reds, ocean blues, golds — with fluid animations. NOT a fan site; professional portfolio with anime energy.

## Design Decision

**Approach:** "Grand Voyage" — full-viewport scrolling sections with cinematic transitions, scroll-triggered animations, and One Piece color vocabulary.

**Sections:** Hero, About, Projects, Contact

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `ocean-deep` | `#071120` | Page background |
| `ocean-dark` | `#0a192f` | Card/section bg |
| `luffy-red` | `#D70000` | Primary accent, CTAs |
| `gold` | `#FFCE00` | Headings, highlights |
| `sky-blue` | `#60BFF5` | Links, tags, secondary |
| `bronze` | `#DFC18A` | Poster cards, muted text |
| `white` | `#FEFEFE` | Body text |
| `glass` | `rgba(15,30,50,0.8)` | Glass-morphism bg |

## Typography

- **Display:** Bangers (already installed) — hero name, section titles
- **Body:** Poppins (Google Fonts) — clean sans-serif
- **Mono:** JetBrains Mono (already installed) — tech tags, code

## Sections

### Hero (100vh)
- Ocean gradient bg with subtle animated wave SVG at bottom
- Name in Bangers 4-6rem, gold, text-shadow glow
- Speed lines via CSS conic-gradient behind name (slow rotation)
- Subtitle + social links row
- Remotion cinematic as ambient background (low opacity)
- Bouncing scroll-down arrow

### About (100vh)
- Two columns: Character Card (left) + Bio (right)
- Character Card: glass-morphism, thick red border, skill power bars (animated on scroll), stats row
- Bio: paragraph with gold highlights, current role info

### Projects (100vh+)
- 2-column responsive grid of "bounty poster" cards
- Each card: cream/parchment bg, thick black border, slight rotation, Bangers title
- Tech tags in sky-blue, red CTA buttons
- Hover: lift + shadow + un-rotate

### Contact (100vh)
- Ocean wave SVG divider at top
- Gold heading, social link cards, or simple form with glass styling
- Large icon buttons with red hover glow

## Animation Stack
- **Framer Motion:** `whileInView` scroll-triggered reveals, staggered children, spring physics
- **Remotion:** Hero cinematic (ocean + name reveal), reuse BootSequence adapted to new palette
- **CSS:** Speed lines (conic-gradient rotation), wave animations, glow pulses

## Files to Modify/Create

### Delete/Replace
- `src/app/globals.css` — complete rewrite (new palette tokens)
- `src/app/page.tsx` — complete rewrite (4 sections)
- `src/app/layout.tsx` — add Poppins font
- `tailwind.config.ts` — new color tokens, shadows, animations

### Delete (no longer needed)
- `src/components/MangaPanel.tsx` — replaced by section-based layout
- `src/components/HalftoneOverlay.tsx` — wrong aesthetic
- `src/components/CRTOverlay.tsx` — wrong aesthetic
- `src/components/PageLayout.tsx` — replaced

### Create New
- `src/components/HeroSection.tsx` — hero with name, links, speed lines, Remotion bg
- `src/components/AboutSection.tsx` — character card + bio
- `src/components/ProjectsSection.tsx` — bounty poster grid
- `src/components/ContactSection.tsx` — social links / form
- `src/components/ProjectCard.tsx` — individual poster card
- `src/components/SkillBar.tsx` — animated power bar
- `src/components/WaveDivider.tsx` — ocean wave SVG
- `src/components/SpeedLines.tsx` — CSS animated speed lines
- `src/components/ScrollIndicator.tsx` — bouncing arrow
- `src/components/remotion/OceanIntro.tsx` — new Remotion composition with ocean palette

### Keep & Adapt
- `src/hooks/useTypewriter.ts` — still useful
- `src/components/remotion/BootPlayer.tsx` — adapt to new composition
