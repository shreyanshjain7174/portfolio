# Requirements: Shreyansh Sancheti Portfolio

**Defined:** 2026-03-02
**Core Value:** A portfolio that is immediately distinctive and memorable — the manga-terminal fusion should make visitors stop scrolling and explore, while clearly communicating deep technical expertise in distributed systems and infrastructure.

## v1 Requirements

### Hero / Boot Screen

- [ ] **HERO-01**: Site displays a simulated Linux boot sequence with typewriter animation on load
- [ ] **HERO-02**: Boot lines include: kernel load, mounting expertise, starting daemon, initializing contributions
- [ ] **HERO-03**: Terminal login prompt appears after boot: `shreyansh@portfolio:~$`
- [ ] **HERO-04**: Manga hero panel slides in after boot with speed lines radiating from center
- [ ] **HERO-05**: Hero section provides clear navigation paths to projects, resume, LinkedIn, and GitHub
- [ ] **HERO-06**: Tagline displayed: "Building systems that don't sleep. Writing code that doesn't lie."

### About — Character Sheet

- [ ] **ABOUT-01**: RPG stat card / anime character profile layout with manga portrait sketch
- [ ] **ABOUT-02**: Terminal-style animated progress bars for skills (Distributed Systems, C++/Go/Python, OSS, K8s, Startup Velocity)
- [ ] **ABOUT-03**: Stat bars animate from 0 to value when scrolled into viewport
- [ ] **ABOUT-04**: Hand-drawn ink border around the character sheet card

### Experience — Story Arc

- [ ] **EXP-01**: Manga chapter-style panels for each company (Microsoft, Arista, IBM, Red Hat)
- [ ] **EXP-02**: Panel headers styled as chapter titles: `[ CHAPTER 0X ] :: COMPANY — FOCUS`
- [ ] **EXP-03**: Speed line transitions between experience panels
- [ ] **EXP-04**: Key achievements displayed in each panel with role and impact

### Projects — Active Missions

- [ ] **PROJ-01**: Terminal window / manga mission briefing cards for active projects
- [ ] **PROJ-02**: Three active project cards: Jobshot, Specwright, agentic-k8s-operator
- [ ] **PROJ-03**: Each card shows tech stack as styled tags
- [ ] **PROJ-04**: Glowing green ACTIVE badge on each project card
- [ ] **PROJ-05**: Manga panel borders on project cards

### Open Source — Contribution Arc

- [ ] **OSS-01**: GitHub contribution visualization styled as manga battle power chart
- [ ] **OSS-02**: Highlight: 15+ merged PRs to upstream Ceph, Rook-Ceph
- [ ] **OSS-03**: Terminal command aesthetic: `$ ceph status` renders stylized output panel

### Contact — End Screen

- [ ] **CONTACT-01**: Terminal prompt styled contact section: `shreyansh@portfolio:~$ ./contact.sh`
- [ ] **CONTACT-02**: Glowing input fields for email and message
- [ ] **CONTACT-03**: Social links as terminal flags: `--github`, `--linkedin`, `--twitter`
- [ ] **CONTACT-04**: Manga "fin" panel with END typography at page bottom
- [ ] **CONTACT-05**: Contact form integration via external service (Formspree or similar)

### Design System

- [ ] **DS-01**: Dark background base (#0d0d0d) with terminal green (#00ff41) + manga red (#ff2d55) accents
- [ ] **DS-02**: CSS custom properties for all design tokens (colors, fonts, spacing)
- [ ] **DS-03**: Bangers font for display headings, JetBrains Mono for code/body text
- [ ] **DS-04**: Manga panel grid layout system with asymmetric ink borders
- [ ] **DS-05**: Halftone dot pattern texture overlays
- [ ] **DS-06**: CRT scanline overlay effect on entire site

### Animation System

- [ ] **ANIM-01**: Boot sequence typewriter animation with character-by-character timing
- [ ] **ANIM-02**: Hero entrance with speed lines + manga impact effect
- [ ] **ANIM-03**: Ink-draw reveal on scroll — border draws itself, content fades in
- [ ] **ANIM-04**: Hover effects on project cards (shake + glow pulse)
- [ ] **ANIM-05**: Custom terminal cursor blink on inputs and hero section

### Infrastructure

- [ ] **INFRA-01**: Next.js 14 App Router project scaffolding
- [ ] **INFRA-02**: Tailwind CSS configured with custom design tokens
- [ ] **INFRA-03**: anime.js + Framer Motion animation libraries integrated
- [ ] **INFRA-04**: Responsive design with manga panel grid collapse on mobile
- [ ] **INFRA-05**: Deployment on Vercel with production configuration

## v2 Requirements

### Enhanced Animations (Remotion)

- **V2-ANIM-01**: Hero background loop — animated manga speed lines (3-5s cycle video)
- **V2-ANIM-02**: Section transition videos (0.5s manga panel whoosh)
- **V2-ANIM-03**: Project card hover micro-animation videos
- **V2-ANIM-04**: Polished boot sequence cinematic (3-4s pre-rendered)

### Content Expansion

- **V2-CONT-01**: Blog / writing section
- **V2-CONT-02**: CMS integration for dynamic content
- **V2-CONT-03**: Archived projects drawer (Clawdy, CRM, Meridian)

### Advanced Features

- **V2-ADV-01**: Anime-style chibi avatar/mascot illustration
- **V2-ADV-02**: Manga speech bubble tooltips
- **V2-ADV-03**: Dark/light theme toggle

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend/API | Static site for v1, contact form via external service |
| CMS integration | Static content sufficient for v1 |
| Mobile native app | Web-only |
| AnimeJS MCP server | Package not publicly accessible, using anime.js directly |
| Real-time features | No need for WebSocket/SSE in a portfolio |
| User authentication | Public portfolio, no login needed |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| DS-01 | Phase 1 | Pending |
| DS-02 | Phase 1 | Pending |
| DS-03 | Phase 1 | Pending |
| DS-04 | Phase 1 | Pending |
| DS-05 | Phase 1 | Pending |
| DS-06 | Phase 1 | Pending |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| HERO-04 | Phase 2 | Pending |
| HERO-05 | Phase 2 | Pending |
| HERO-06 | Phase 2 | Pending |
| ABOUT-01 | Phase 2 | Pending |
| ABOUT-02 | Phase 2 | Pending |
| ABOUT-03 | Phase 2 | Pending |
| ABOUT-04 | Phase 2 | Pending |
| EXP-01 | Phase 3 | Pending |
| EXP-02 | Phase 3 | Pending |
| EXP-03 | Phase 3 | Pending |
| EXP-04 | Phase 3 | Pending |
| PROJ-01 | Phase 3 | Pending |
| PROJ-02 | Phase 3 | Pending |
| PROJ-03 | Phase 3 | Pending |
| PROJ-04 | Phase 3 | Pending |
| PROJ-05 | Phase 3 | Pending |
| OSS-01 | Phase 4 | Pending |
| OSS-02 | Phase 4 | Pending |
| OSS-03 | Phase 4 | Pending |
| CONTACT-01 | Phase 4 | Pending |
| CONTACT-02 | Phase 4 | Pending |
| CONTACT-03 | Phase 4 | Pending |
| CONTACT-04 | Phase 4 | Pending |
| CONTACT-05 | Phase 4 | Pending |
| ANIM-01 | Phase 5 | Pending |
| ANIM-02 | Phase 5 | Pending |
| ANIM-03 | Phase 5 | Pending |
| ANIM-04 | Phase 5 | Pending |
| ANIM-05 | Phase 5 | Pending |
| INFRA-04 | Phase 5 | Pending |
| INFRA-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 38
- Unmapped: 0

---
*Requirements defined: 2026-03-02*
*Last updated: 2026-03-02 after user scoping*
