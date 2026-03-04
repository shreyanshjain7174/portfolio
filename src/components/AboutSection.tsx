'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'


const STATS = [
  { label: 'Years Experience', value: '5+', icon: '⏱' },
  { label: 'Companies', value: '3', icon: '🏢' },
  { label: 'Open Source Contributions', value: '50+', icon: '⟁' },
  { label: 'Systems Built', value: '20+', icon: '⚙' },
]

const EXPERIENCE = [
  {
    role: 'Software Development Engineer',
    company: 'Arista Networks',
    period: 'Current',
    color: '#3b82f6',
  },
  {
    role: 'Software Development Engineer II',
    company: 'IBM ISDL',
    period: 'Previous',
    color: '#8b5cf6',
  },
  {
    role: 'Ceph Storage Developer',
    company: 'Open Source Contributor',
    period: 'Ongoing',
    color: '#06b6d4',
  },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="mesh-gradient" aria-hidden="true" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <SectionHeading
          number="01"
          title="About Me"
          subtitle="Software Engineer passionate about building scalable distributed systems and infrastructure."
        />

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display font-bold text-3xl md:text-4xl gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Two column: Bio + Experience */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Bio */}
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-display font-semibold text-xl mb-4" style={{ color: 'var(--text-primary)' }}>
              Who I Am
            </h3>
            <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
                I&apos;m a Software Engineer with a specialized focus on{' '}
                <span style={{ color: 'var(--accent-cyan)' }}>networking</span>,{' '}
                <span style={{ color: 'var(--accent-violet)' }}>distributed systems</span>, and{' '}
                <span style={{ color: 'var(--accent-blue)' }}>system programming</span>.
              </p>
              <p>
                Currently at <strong style={{ color: 'var(--text-primary)' }}>Arista Networks</strong>, I work on building high-performance systems. Previously, I was an SDE-II at{' '}
                <strong style={{ color: 'var(--text-primary)' }}>IBM ISDL</strong>, where I developed Ceph storage solutions.
              </p>
              <p>
                I&apos;m proficient in <span className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent-violet)' }}>C++</span>{' '}
                <span className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }}>Rust</span>{' '}
                <span className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent-cyan)' }}>Go</span>{' '}
                <span className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent-gold)' }}>Python</span>
              </p>
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                ⚡ Fun fact: I&apos;ve hacked into my own Wi-Fi network (legally!) just to test its security and strengthen it.
              </p>
            </div>
          </motion.div>

          {/* Experience timeline */}
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-display font-semibold text-xl mb-6" style={{ color: 'var(--text-primary)' }}>
              Experience
            </h3>
            <div className="space-y-6">
              {EXPERIENCE.map((exp, i) => (
                <motion.div
                  key={exp.company}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: exp.color, boxShadow: `0 0 10px ${exp.color}40` }}
                    />
                    {i < EXPERIENCE.length - 1 && (
                      <div className="w-px flex-1 mt-2" style={{ background: 'var(--border-subtle)' }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {exp.role}
                    </div>
                    <div className="text-sm" style={{ color: exp.color }}>
                      {exp.company}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {exp.period}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Interests */}
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Currently learning</div>
              <div className="flex flex-wrap gap-2">
                {['Rook', 'Terraform', 'OpenShift'].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.2)',
                      color: 'var(--accent-violet)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
