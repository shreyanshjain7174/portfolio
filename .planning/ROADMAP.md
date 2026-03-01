# Roadmap: Shreyansh Sancheti Portfolio

**Created:** 2026-03-02
**Milestone:** v1.0 — Portfolio Launch
**Phases:** 5

---

## Phase 1: Foundation — Project Scaffolding & Design System

**Goal:** Next.js project running with complete design system — all tokens, fonts, layouts, and visual effects ready for content sections.

**Requirements:** INFRA-01, INFRA-02, INFRA-03, DS-01, DS-02, DS-03, DS-04, DS-05, DS-06

**Tasks:**
1. Scaffold Next.js 14 App Router project with TypeScript
2. Configure Tailwind CSS with custom design tokens (colors, fonts, spacing)
3. Install and configure anime.js + Framer Motion
4. Load Bangers + JetBrains Mono fonts
5. Build manga panel grid layout system with asymmetric ink borders
6. Implement halftone dot pattern texture overlay component
7. Implement CRT scanline overlay effect
8. Create base page layout with responsive structure

**Success Criteria:**
- `npm run dev` serves a styled page with design tokens applied
- Manga panel grid renders correctly on desktop and mobile viewports
- CRT scanline and halftone overlays visible
- All CSS custom properties defined and accessible

**Estimated Effort:** Medium

---

## Phase 2: Core Sections — Hero + About

**Goal:** Hero boot sequence and Character Sheet sections fully functional with content and basic animations.

**Requirements:** HERO-01, HERO-02, HERO-03, HERO-04, HERO-05, HERO-06, ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04

**Tasks:**
1. Build boot sequence component with typewriter animation (character-by-character)
2. Add boot lines: kernel load, mounting expertise, starting daemon, initializing contributions
3. Implement terminal login prompt after boot completes
4. Build manga hero panel with speed line entrance animation
5. Add navigation paths to projects, resume, LinkedIn, GitHub in hero
6. Display tagline with impact typography
7. Build character sheet / RPG stat card component
8. Implement animated terminal-style progress bars for skills
9. Add viewport-triggered stat bar fill animation
10. Apply hand-drawn ink border to character sheet

**Success Criteria:**
- Boot sequence plays on page load with realistic timing
- Hero panel slides in after boot with speed lines
- Navigation links to key sections and external profiles work
- Stat bars animate when scrolled into view
- Character sheet has ink border and manga portrait area

**Estimated Effort:** Large

---

## Phase 3: Content Sections — Experience + Projects

**Goal:** Story Arc experience timeline and Active Missions project dashboard built with manga panel styling.

**Requirements:** EXP-01, EXP-02, EXP-03, EXP-04, PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05

**Tasks:**
1. Build manga chapter panel component for experience entries
2. Populate panels for Microsoft, Arista Networks, IBM, Red Hat with role + achievements
3. Style panel headers as chapter titles
4. Add speed line transitions between experience panels
5. Build terminal window / mission briefing card component for projects
6. Create cards for Jobshot, Specwright, agentic-k8s-operator
7. Add tech stack tag components to project cards
8. Implement glowing green ACTIVE badge
9. Apply manga panel borders to project cards

**Success Criteria:**
- All 4 experience panels render with chapter-style headers
- Speed line transitions trigger on scroll between panels
- 3 active project cards display with tech tags and ACTIVE badge
- Cards have manga panel borders and terminal window styling

**Estimated Effort:** Large

---

## Phase 4: Remaining Sections — Open Source + Contact

**Goal:** Contribution Arc and Contact/End Screen sections complete the page content.

**Requirements:** OSS-01, OSS-02, OSS-03, CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04, CONTACT-05

**Tasks:**
1. Build contribution visualization styled as manga battle power chart
2. Highlight Ceph/Rook-Ceph contributions (15+ merged PRs)
3. Build terminal command aesthetic: `$ ceph status` stylized output
4. Build contact section with terminal prompt styling
5. Create glowing input fields for email and message
6. Add social links as terminal flags (`--github`, `--linkedin`, `--twitter`)
7. Build manga "fin" panel with END typography
8. Integrate contact form with Formspree or similar service

**Success Criteria:**
- Contribution section shows styled visualization
- Ceph contribution stats highlighted prominently
- Contact form submits successfully via external service
- Social links navigate to correct profiles
- Page ends with manga "fin" panel

**Estimated Effort:** Medium

---

## Phase 5: Polish — Animations, Responsive & Deploy

**Goal:** Full animation choreography, responsive breakpoints, and production deployment on Vercel.

**Requirements:** ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, INFRA-04, INFRA-05

**Tasks:**
1. Polish boot sequence typewriter timing and delays
2. Refine hero entrance speed lines + impact effect
3. Implement ink-draw reveal on scroll for all section panels
4. Add hover effects on project cards (shake + glow pulse)
5. Implement custom terminal cursor blink on inputs and hero
6. Test and fix responsive breakpoints — panel grid collapse on mobile
7. Performance audit — optimize animations, lazy load, bundle size
8. Deploy to Vercel with production configuration
9. Configure custom domain (if applicable)

**Success Criteria:**
- All 5 animation types working smoothly (no jank, 60fps target)
- Site renders correctly on mobile, tablet, and desktop
- Lighthouse performance score > 80
- Site live on Vercel with HTTPS
- All sections accessible and functional end-to-end

**Estimated Effort:** Large

---

## Phase Summary

| Phase | Name | Requirements | Effort |
|-------|------|-------------|--------|
| 1 | Foundation | 9 | Medium |
| 2 | Core Sections | 10 | Large |
| 3 | Content Sections | 9 | Large |
| 4 | Remaining Sections | 8 | Medium |
| 5 | Polish & Deploy | 7 | Large |

**Total v1 Requirements:** 38 (fully mapped, 0 gaps)

---
*Roadmap created: 2026-03-02*
*Last updated: 2026-03-02 after requirements definition*
