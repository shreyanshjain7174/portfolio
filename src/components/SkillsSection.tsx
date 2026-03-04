'use client'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'

interface Skill {
  name: string
  level: number
  color: string
}

interface SkillCategory {
  title: string
  icon: string
  skills: Skill[]
  accent: string
}

const CATEGORIES: SkillCategory[] = [
  {
    title: 'Languages',
    icon: '⟨/⟩',
    accent: '#3b82f6',
    skills: [
      { name: 'C++', level: 95, color: '#3b82f6' },
      { name: 'Rust', level: 85, color: '#f97316' },
      { name: 'Go', level: 92, color: '#06b6d4' },
      { name: 'Python', level: 88, color: '#f59e0b' },
      { name: 'JavaScript', level: 80, color: '#eab308' },
      { name: 'SQL', level: 85, color: '#8b5cf6' },
    ],
  },
  {
    title: 'Systems & Infrastructure',
    icon: '⚙',
    accent: '#8b5cf6',
    skills: [
      { name: 'Distributed Systems', level: 94, color: '#8b5cf6' },
      { name: 'Ceph Storage', level: 92, color: '#f43f5e' },
      { name: 'Networking', level: 90, color: '#3b82f6' },
      { name: 'System Programming', level: 93, color: '#06b6d4' },
      { name: 'Linux/Unix', level: 90, color: '#f59e0b' },
      { name: 'Cybersecurity', level: 82, color: '#10b981' },
    ],
  },
  {
    title: 'DevOps & Tools',
    icon: '◈',
    accent: '#06b6d4',
    skills: [
      { name: 'Docker', level: 88, color: '#3b82f6' },
      { name: 'Kubernetes', level: 80, color: '#8b5cf6' },
      { name: 'Git', level: 95, color: '#f43f5e' },
      { name: 'OpenTelemetry', level: 78, color: '#06b6d4' },
      { name: 'Terraform', level: 70, color: '#8b5cf6' },
      { name: 'CI/CD', level: 85, color: '#10b981' },
    ],
  },
]

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative min-h-screen flex flex-col justify-center px-6 py-24"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="absolute inset-0 dot-grid pointer-events-none opacity-20" aria-hidden="true" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <SectionHeading
          number="02"
          title="Skills & Expertise"
          subtitle="Technologies and domains I work with to build production-grade systems."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.title}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: ci * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{
                    background: `${cat.accent}15`,
                    border: `1px solid ${cat.accent}30`,
                    color: cat.accent,
                  }}
                >
                  {cat.icon}
                </div>
                <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                  {cat.title}
                </h3>
              </div>

              {/* Skills list */}
              <div className="space-y-4">
                {cat.skills.map((skill, si) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.15 + si * 0.05, duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {skill.name}
                      </span>
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div className="skill-bar-track">
                      <motion.div
                        className="skill-bar-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.15 + si * 0.05 + 0.3, duration: 1, ease: 'easeOut' }}
                        style={{ background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
