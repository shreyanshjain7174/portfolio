'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'


const SOCIALS = [
  {
    label: 'GitHub',
    display: 'shreyanshjain7174',
    href: 'https://github.com/shreyanshjain7174',
    color: '#f1f1f4',
  },
  {
    label: 'LinkedIn',
    display: 'shreyansh-sancheti',
    href: 'https://linkedin.com/in/shreyansh-sancheti',
    color: '#3b82f6',
  },
  {
    label: 'Twitter / X',
    display: '@shrey_sancheti',
    href: 'https://twitter.com/shrey_sancheti',
    color: '#06b6d4',
  },
  {
    label: 'Email',
    display: '007ssancheti@gmail.com',
    href: 'mailto:007ssancheti@gmail.com',
    color: '#f59e0b',
  },
]

export default function ContactSection() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="absolute inset-0 dot-grid pointer-events-none opacity-15" aria-hidden="true" />
      <div className="mesh-gradient" aria-hidden="true" />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--accent-violet)' }}>04</span>
              <div className="section-divider" />
            </div>
            <h2
              className="font-display font-bold leading-tight mb-4"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--text-primary)' }}
            >
              Let&apos;s build{' '}
              <span className="gradient-text">something great</span>
              <br />
              together.
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Looking to collaborate on distributed systems, open-source infrastructure, or interesting engineering challenges? Let&apos;s connect.
            </p>
          </motion.div>
        </div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          {SOCIALS.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="glass-card p-5 flex items-center gap-4 no-underline group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300 flex-shrink-0"
                style={{
                  background: hovered === i ? `${s.color}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${hovered === i ? `${s.color}40` : 'rgba(255,255,255,0.06)'}`,
                  color: hovered === i ? s.color : 'var(--text-muted)',
                }}
              >
                {s.label[0]}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold group-hover:text-accent-violet transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {s.label}
                </div>
                <div className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>
                  {s.display}
                </div>
              </div>
              <span className="ml-auto text-lg transition-transform group-hover:translate-x-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                →
              </span>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <a href="mailto:007ssancheti@gmail.com" className="btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>
            Send me an email
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>

        {/* Footer */}
        <footer className="mt-24 pt-8 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Designed &amp; built by Shreyansh Sancheti
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
            © {new Date().getFullYear()} · All rights reserved
          </p>
        </footer>
      </div>
    </section>
  )
}
