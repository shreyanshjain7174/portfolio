# Shreyansh Sancheti — Portfolio

## What This Is

A personal portfolio website for Shreyansh Sancheti, a Software Engineer specializing in distributed systems, high-performance networking, and cloud infrastructure. The site fuses a **manga/anime aesthetic** with a **Linux terminal interface** — designed to feel like a hacker who reads manga built their own corner of the internet.

## Core Value

A portfolio that is immediately distinctive and memorable — the manga-terminal fusion should make visitors stop scrolling and explore, while clearly communicating deep technical expertise in distributed systems and infrastructure.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Boot sequence hero with typewriter terminal animation
- [ ] Manga panel grid layout system with ink borders
- [ ] Character sheet / stat card about section
- [ ] Story arc experience timeline (Microsoft, Arista, IBM/Red Hat)
- [ ] Active missions project dashboard (Jobshot, Specwright, agentic-k8s-operator)
- [ ] Open source contribution arc section
- [ ] Terminal-styled contact form
- [ ] CRT scanline overlay effect
- [ ] Responsive design with panel grid collapse on mobile
- [ ] anime.js + Framer Motion animation system

### Out of Scope

- Remotion video sequences — deferred to v2, CSS/JS animations sufficient for v1
- AnimeJS MCP server integration — package not publicly available, using anime.js directly
- Blog/writing section — not in initial spec
- CMS integration — static content for v1
- Backend/API — purely frontend, contact form can use a service like Formspree

## Context

### Identity

- **Name**: Shreyansh Sancheti
- **Current Role**: SDE 2 at Microsoft (Azure Compute)
- **Specialization**: Distributed systems, high-performance networking, cloud infrastructure
- **Open Source**: Contributor to Ceph, Rook-Ceph (15+ merged upstream PRs)
- **Founder**: Nine Rewards Solutions Pvt Ltd
- **Previous**: Arista Networks, IBM/Red Hat

### Active Projects

- **Jobshot** — [STATUS: ACTIVE]
- **Specwright** — AI specification engine [STATUS: ACTIVE]
- **agentic-k8s-operator** — [STATUS: ACTIVE]

### Archived Projects

- Clawdy, CRM, Meridian — shown in collapsed [ARCHIVED] drawer

### Design Direction

**Vibe**: "If Linus Torvalds grew up watching Akira and Ghost in the Shell"

**Visual Language**:
- Base: Black/dark background (#0d0d0d or #0a0a0a)
- Accents: Terminal green (#00ff41) + Manga red (#ff2d55)
- Manga panel grid layouts — asymmetric comic-book panels with bold ink borders
- Halftone dot patterns as texture overlays
- Speed lines (manga motion lines) for transitions and dividers
- Hand-drawn style ink borders (slightly rough, not perfect)
- CRT scanline overlay on entire site
- Avatar/mascot: Anime-style chibi developer in hoodie at terminal

**Typography**:
- Display: Bangers (manga-style bold)
- Code/Body: JetBrains Mono or Fira Code

**Color Tokens**:
- `--color-bg-dark`: #0d0d0d
- `--color-terminal-green`: #00ff41
- `--color-manga-red`: #ff2d55
- `--color-text`: #ffffff
- `--font-manga`: Bangers
- `--font-mono`: JetBrains Mono

### Sections

**1. Hero / Boot Screen**
- Simulated Linux boot sequence with typewriter animation
- Boot lines: kernel load, mounting expertise, starting daemon, initializing contributions
- Login prompt: `shreyansh@portfolio:~$`
- Manga hero panel slides in after boot with speed lines
- Tagline: "Building systems that don't sleep. Writing code that doesn't lie."

**2. About Me — "Character Sheet"**
- RPG stat card / anime character profile layout
- Terminal-style progress bars for skills:
  - Distributed Systems: 85
  - C++ / Golang / Python: 75
  - Open Source Contributions: 80
  - Infrastructure & K8s: 90
  - Startup Velocity: 70
- Hand-drawn ink border, manga portrait sketch

**3. Experience — "Story Arc" Timeline**
- Manga chapter-style panels (horizontal scroll or vertical flow)
- Companies: Microsoft, Arista Networks, IBM, Red Hat
- Panel headers: `[ CHAPTER 03 ] :: ARISTA NETWORKS — PI ROUTING`
- Terminal-style achievement commands in each panel
- Speed line transitions between panels

**4. Projects — "Active Missions" Dashboard**
- Terminal window / manga mission briefing cards
- Three active: Jobshot, Specwright, agentic-k8s-operator
- Manga panel borders, tech stack tags, glowing green ACTIVE badge
- Archived projects in collapsed [ARCHIVED] drawer with dimmed styling

**5. Open Source — "Contribution Arc"**
- GitHub contribution graph styled as manga battle power chart
- Highlight: 15+ merged PRs to upstream Ceph
- Terminal command aesthetic: `$ ceph status` renders stylized output

**6. Contact / End Screen**
- Terminal prompt: `shreyansh@portfolio:~$ ./contact.sh`
- Glowing input fields for email and message
- Social links as terminal flags: `--github`, `--linkedin`, `--twitter`
- Manga "fin" panel with END typography

### Animations (anime.js + Framer Motion)

- **Boot sequence**: Character-by-character typewriter with timing delays
- **Hero entrance**: Speed lines radiate outward, name slams in with impact effect
- **Panel reveals**: Ink-draw reveal on scroll — border draws itself, content fades in
- **Stat bars**: Animated fill from 0 to value when in viewport
- **Hover effects**: Project cards shake + glow pulse
- **Cursor**: Custom terminal cursor blink on inputs and hero section

## Constraints

- **Framework**: Next.js 14 (App Router) — chosen for SSR, file-based routing, Vercel deployment
- **Styling**: Tailwind CSS + CSS custom properties for design tokens
- **Animations**: anime.js + Framer Motion (no Remotion in v1)
- **Fonts**: Bangers (display) + JetBrains Mono (code/body)
- **Deployment**: Vercel
- **No Backend**: Static site with external contact form service
- **Commits**: Signed commits (`git commit -s -m`), branch-based workflow

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| anime.js + Framer Motion over AnimeJS MCP | MCP server package not publicly available on npm | — Pending |
| Remotion deferred to v2 | CSS/JS animations achieve 90% of effect with less complexity | — Pending |
| Next.js 14 App Router | SSR support, Vercel deployment, modern React patterns | — Pending |
| Tailwind CSS | Rapid prototyping, responsive utilities, custom property integration | — Pending |
| No backend for v1 | Portfolio is content-driven, contact form via external service | — Pending |

---
*Last updated: 2026-03-02 after initialization*
