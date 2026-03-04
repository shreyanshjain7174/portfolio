'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from './SectionHeading'

interface Project {
  id: number
  title: string
  description: string
  longDesc: string
  stack: string[]
  github: string
  featured: boolean
  color: string
  category: string
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Ceph Storage Platform',
    description: 'Distributed object, block, and file storage platform. Contributed to core storage engine and RGW (RADOS Gateway) components.',
    longDesc: 'Contributed to the Ceph open-source distributed storage platform, working on core storage engine optimizations, RADOS Gateway improvements, and performance testing infrastructure. Developed benchmarking tools and automated testing pipelines for large-scale storage clusters.',
    stack: ['C++', 'Python', 'RADOS', 'S3 API', 'Distributed Systems'],
    github: 'https://github.com/shreyanshjain7174/ceph',
    featured: true,
    color: '#f43f5e',
    category: 'Open Source',
  },
  {
    id: 2,
    title: 'Infra Scheduler',
    description: 'Infrastructure scheduling system built in Go for automated resource management and workload distribution.',
    longDesc: 'Built a Go-based infrastructure scheduler for automated workload distribution and resource management across cloud environments. Implements intelligent scheduling algorithms for optimal resource utilization.',
    stack: ['Go', 'Docker', 'Kubernetes', 'REST API'],
    github: 'https://github.com/shreyanshjain7174/Infra-scheduler',
    featured: true,
    color: '#3b82f6',
    category: 'Infrastructure',
  },
  {
    id: 3,
    title: 'Stocky — Stock Rewards API',
    description: 'Users earn shares of Indian stocks as incentives. Full rewards API with real-time stock data integration.',
    longDesc: 'Stock Rewards API platform where users earn shares of Indian stocks as incentives. Built with Go, featuring real-time stock data integration, rewards tracking, and portfolio management capabilities.',
    stack: ['Go', 'REST API', 'PostgreSQL', 'Stock Data API'],
    github: 'https://github.com/shreyanshjain7174/stocky',
    featured: true,
    color: '#f59e0b',
    category: 'Fintech',
  },
  {
    id: 4,
    title: 'OpenTelemetry Metrics Demo',
    description: 'Go application demonstrating OpenTelemetry metrics (Counter, Histogram, Gauge) with SigNoz Cloud observability.',
    longDesc: 'Demonstrates production-grade observability patterns using OpenTelemetry in Go. Covers Counter, Histogram, and Gauge metric types with SigNoz Cloud integration for monitoring and alerting.',
    stack: ['Go', 'OpenTelemetry', 'SigNoz', 'Prometheus'],
    github: 'https://github.com/shreyanshjain7174/otel-metrics-demo',
    featured: false,
    color: '#06b6d4',
    category: 'Observability',
  },
  {
    id: 5,
    title: 'RGWtest Warp',
    description: 'S3 benchmarking automation for RADOS Gateway. Automated performance testing and reporting pipeline.',
    longDesc: 'Warp automation suite for S3 benchmarking in RADOS Gateway environments. Automates performance testing, generates comprehensive reports, and enables CI-driven benchmark comparisons across storage configurations.',
    stack: ['Shell', 'Go', 'S3', 'Warp', 'CI/CD'],
    github: 'https://github.com/shreyanshjain7174/RGWtest-warp',
    featured: false,
    color: '#8b5cf6',
    category: 'Testing',
  },
  {
    id: 6,
    title: 'Specwright',
    description: 'System of Reasoning for Product Managers — AI-powered specification analysis and decision support platform.',
    longDesc: 'Specwright is an AI-powered reasoning system for Product Managers. Analyzes product specifications, surfaces decision points, and provides structured reasoning frameworks for product decisions.',
    stack: ['Next.js', 'TypeScript', 'Neon PostgreSQL', 'AI/ML'],
    github: 'https://github.com/shreyanshjain7174/specwright',
    featured: false,
    color: '#10b981',
    category: 'AI/ML',
  },
]

export default function ProjectsSection() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section
      id="projects"
      className="relative min-h-screen flex flex-col justify-center px-6 py-24"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="mesh-gradient" aria-hidden="true" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <SectionHeading
          number="03"
          title="Projects"
          subtitle="Systems and tools I've built — from distributed storage to fintech APIs."
        />

        {/* Featured projects (larger cards) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {PROJECTS.filter(p => p.featured).map((p, i) => (
            <motion.article
              key={p.id}
              className="glass-card overflow-hidden group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Color accent bar */}
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}80)` }} />

              <div className="p-6">
                {/* Category badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-mono px-2.5 py-1 rounded-full"
                    style={{
                      background: `${p.color}15`,
                      color: p.color,
                      border: `1px solid ${p.color}30`,
                    }}
                  >
                    {p.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                    Featured
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-lg mb-3 group-hover:text-accent-violet transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {p.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {p.description}
                </p>

                {/* Stack */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.stack.map(t => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    style={{ padding: '6px 14px', fontSize: 12 }}
                  >
                    GitHub →
                  </a>
                  <button
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    className="text-xs font-medium transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--accent-violet)'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text-muted)'}
                  >
                    {expanded === p.id ? 'Less ↑' : 'More ↓'}
                  </button>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expanded === p.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm leading-relaxed pt-4 mt-4" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
                        {p.longDesc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Other projects (smaller, grid) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-display font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
            Other Projects
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {PROJECTS.filter(p => !p.featured).map((p, i) => (
              <motion.a
                key={p.id}
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{ background: `${p.color}15`, color: p.color }}
                  >
                    {p.category}
                  </span>
                  <span className="text-sm transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }}>→</span>
                </div>
                <h4 className="font-semibold text-sm mb-2 group-hover:text-accent-violet transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {p.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.stack.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
