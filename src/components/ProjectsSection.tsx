'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Rank = 'LEGENDARY' | 'EPIC' | 'RARE'

interface Project {
  id: number
  title: string
  rank: Rank
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
    objective: 'Full-stack SaaS platform with real-time collaboration',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'WebSockets'],
    description: 'Built from scratch — auth, billing, real-time sync. Scales to 10 k+ concurrent users with edge caching and optimistic UI.',
    github: '#',
    link: '#',
  },
  {
    id: 2,
    title: 'PROJECT BETA',
    rank: 'EPIC',
    stars: 4,
    objective: 'High-performance REST API serving 1 M+ requests / day',
    stack: ['Node.js', 'Go', 'Redis', 'Docker'],
    description: 'Microservices architecture with circuit breakers, distributed tracing, and zero-downtime deploys via Kubernetes rolling updates.',
    github: '#',
    link: '#',
  },
  {
    id: 3,
    title: 'PROJECT GAMMA',
    rank: 'RARE',
    stars: 4,
    objective: 'Open-source dev tool — 2 k+ GitHub stars',
    stack: ['React', 'Electron', 'TypeScript'],
    description: 'Cross-platform desktop app for API testing. Plugin system, live theme engine, and a keyboard-first UX that cuts testing time in half.',
    github: '#',
    link: '#',
  },
]

const RANK_COLOR: Record<Rank, string> = {
  LEGENDARY: 'var(--px-gold)',
  EPIC:      'var(--px-purple)',
  RARE:      '#4FC3F7',
}

function StarRow({ count, total = 5 }: { count: number; total?: number }) {
  return (
    <span className="font-pixel" style={{ fontSize: 9 }}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{ color: i < count ? 'var(--px-gold)' : 'var(--px-border)' }}>★</span>
      ))}
    </span>
  )
}

export default function ProjectsSection() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <section
      id="projects"
      className="relative min-h-screen flex flex-col justify-center px-4 py-24"
      style={{ background: 'var(--px-surface)' }}
    >
      {/* Section label */}
      <div className="max-w-4xl mx-auto w-full mb-12">
        <div className="flex items-center gap-4">
          <span className="font-pixel text-px-cyan" style={{ fontSize: 8 }}>04.</span>
          <h2 className="font-pixel text-px-gold text-glow-gold" style={{ fontSize: 'clamp(14px, 2.5vw, 24px)' }}>
            QUEST LOG
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--px-border)' }} />
          <span className="font-pixel text-px-dim" style={{ fontSize: 7 }}>{PROJECTS.length} COMPLETED</span>
        </div>
      </div>

      {/* Quest cards */}
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-4">
        {PROJECTS.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="pixel-border p-6 group"
            style={{ background: 'var(--px-bg)' }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Rank + stars */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span
                    className="font-pixel px-2 py-1"
                    style={{ fontSize: 7, color: RANK_COLOR[p.rank], border: `1px solid ${RANK_COLOR[p.rank]}` }}
                  >
                    ◆ {p.rank}
                  </span>
                  <StarRow count={p.stars} />
                </div>
                {/* Title */}
                <h3
                  className="font-pixel text-px-text group-hover:text-px-cyan transition-colors mb-2"
                  style={{ fontSize: 'clamp(10px, 1.5vw, 13px)' }}
                >
                  {p.title}
                </h3>
                {/* Objective */}
                <p className="font-terminal text-px-dim mb-3" style={{ fontSize: 19 }}>
                  <span className="text-px-gold">OBJECTIVE:</span> {p.objective}
                </p>
                {/* Stack tags */}
                <div className="flex flex-wrap gap-2">
                  {p.stack.map(t => (
                    <span
                      key={t}
                      className="font-pixel"
                      style={{
                        fontSize: 7,
                        padding: '4px 8px',
                        background: 'var(--px-surface)',
                        border: '1px solid var(--px-border)',
                        color: 'var(--px-cyan)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  className="px-btn"
                  style={{ fontSize: 7, padding: '8px 12px' }}
                  onClick={() => setActive(p)}
                >
                  VIEW QUEST
                </button>
                {p.github && (
                  <a
                    href={p.github}
                    className="px-btn-cyan"
                    style={{ fontSize: 7, padding: '8px 12px', textAlign: 'center' }}
                  >
                    SOURCE
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.75, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="pixel-border-cyan p-8 max-w-lg w-full"
              style={{ background: 'var(--px-bg)', cursor: 'default' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="font-pixel text-px-dim mb-4" style={{ fontSize: 7 }}>╔══ QUEST DETAILS ══╗</div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-pixel" style={{ fontSize: 7, color: RANK_COLOR[active.rank] }}>
                  ◆ {active.rank}
                </span>
                <StarRow count={active.stars} />
              </div>
              <h3 className="font-pixel text-px-cyan text-glow-cyan mb-4" style={{ fontSize: 'clamp(11px, 2vw, 16px)' }}>
                {active.title}
              </h3>
              <p className="font-terminal text-px-text mb-4" style={{ fontSize: 19, lineHeight: 1.4 }}>
                {active.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {active.stack.map(t => (
                  <span
                    key={t}
                    className="font-pixel"
                    style={{ fontSize: 7, padding: '4px 8px', background: 'var(--px-surface)', border: '1px solid var(--px-cyan)', color: 'var(--px-cyan)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {active.link && (
                  <a href={active.link} className="px-btn" style={{ fontSize: 7, padding: '8px 12px' }}>LIVE DEMO</a>
                )}
                {active.github && (
                  <a href={active.github} className="px-btn-cyan" style={{ fontSize: 7, padding: '8px 12px' }}>GITHUB</a>
                )}
                <button
                  onClick={() => setActive(null)}
                  className="font-pixel ml-auto"
                  style={{
                    fontSize: 7, padding: '8px 12px', cursor: 'none',
                    background: 'transparent', color: 'var(--px-coral)',
                    border: '1px solid var(--px-coral)',
                  }}
                >
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
