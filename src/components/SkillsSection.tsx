'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

type Category = 'WEAPONS' | 'ARMOR' | 'TOOLS'

interface Skill {
  name: string
  level: number
  desc: string
  category: Category
  color: string
  icon: string
}

const SKILLS: Skill[] = [
  { name: 'TypeScript', level: 95, desc: 'Primary language — type-safe code at scale.', category: 'WEAPONS', color: '#3178C6', icon: 'TS' },
  { name: 'JavaScript', level: 92, desc: 'The language of the web.',                   category: 'WEAPONS', color: '#F7DF1E', icon: 'JS' },
  { name: 'Python',     level: 80, desc: 'Scripts, automation, data pipelines.',         category: 'WEAPONS', color: '#3776AB', icon: 'PY' },
  { name: 'Go',         level: 70, desc: 'High-performance backend services.',           category: 'WEAPONS', color: '#00ADD8', icon: 'GO' },
  { name: 'SQL',        level: 88, desc: 'Complex queries and optimisation.',            category: 'WEAPONS', color: '#E67E22', icon: 'SQ' },
  { name: 'React',      level: 94, desc: 'Component-driven, interactive UIs.',           category: 'ARMOR',   color: '#61DAFB', icon: 'RE' },
  { name: 'Next.js',    level: 90, desc: 'SSR, SSG, full-stack React apps.',             category: 'ARMOR',   color: '#E8E8F0', icon: 'NX' },
  { name: 'Node.js',    level: 88, desc: 'Event-driven backend services.',               category: 'ARMOR',   color: '#339933', icon: 'ND' },
  { name: 'Tailwind',   level: 92, desc: 'Utility-first CSS — rapid UI.',               category: 'ARMOR',   color: '#06B6D4', icon: 'TW' },
  { name: 'PostgreSQL', level: 85, desc: 'Relational database of choice.',               category: 'ARMOR',   color: '#336791', icon: 'PG' },
  { name: 'Docker',     level: 80, desc: 'Container-first development.',                 category: 'TOOLS',   color: '#2496ED', icon: 'DK' },
  { name: 'AWS',        level: 75, desc: 'Cloud infrastructure at scale.',               category: 'TOOLS',   color: '#FF9900', icon: 'AW' },
  { name: 'Git',        level: 95, desc: 'Version control, branching, CI.',              category: 'TOOLS',   color: '#F05032', icon: 'GT' },
  { name: 'Figma',      level: 72, desc: 'Design-to-code pipeline.',                     category: 'TOOLS',   color: '#F24E1E', icon: 'FG' },
  { name: 'GraphQL',    level: 78, desc: 'Declarative API query language.',              category: 'TOOLS',   color: '#E535AB', icon: 'GQ' },
]

const CATEGORIES: Category[] = ['WEAPONS', 'ARMOR', 'TOOLS']

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<Skill>(SKILLS[0])
  const [activeCategory, setActiveCategory] = useState<Category>('WEAPONS')

  useEffect(() => {
    if (!gridRef.current) return
    const slots = gridRef.current.querySelectorAll<HTMLElement>('.inventory-slot')

    gsap.fromTo(
      slots,
      { opacity: 0, scale: 0.4 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        stagger: { amount: 0.7, from: 'random' },
        ease: 'back.out(1.8)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          once: true,
        },
      }
    )
  }, [activeCategory])

  const filtered = SKILLS.filter(s => s.category === activeCategory)

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center px-4 py-24"
      style={{ background: 'var(--px-bg)' }}
    >
      {/* Section label */}
      <div className="max-w-4xl mx-auto w-full mb-12">
        <div className="flex items-center gap-4">
          <span className="font-pixel text-px-cyan" style={{ fontSize: 8 }}>03.</span>
          <h2 className="font-pixel text-px-gold text-glow-gold" style={{ fontSize: 'clamp(14px, 2.5vw, 24px)' }}>
            INVENTORY
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--px-border)' }} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <div className="pixel-border" style={{ background: 'var(--px-surface)' }}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '2px solid var(--px-border)' }}>
            <span className="font-pixel text-px-cyan" style={{ fontSize: 9 }}>INVENTORY</span>
            <span className="font-pixel text-px-dim" style={{ fontSize: 7 }}>{SKILLS.length}/64 SLOTS</span>
          </div>

          {/* Category tabs */}
          <div className="flex" style={{ borderBottom: '2px solid var(--px-border)' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-1 py-3 font-pixel transition-colors"
                style={{
                  fontSize: 8,
                  cursor: 'none',
                  color: activeCategory === cat ? 'var(--px-cyan)' : 'var(--px-text-dim)',
                  background: activeCategory === cat ? 'var(--px-bg)' : 'transparent',
                  borderRight: '1px solid var(--px-border)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Slot grid */}
            <div
              ref={gridRef}
              className="p-4 flex flex-wrap gap-2"
              style={{ minWidth: 0, flex: '1 1 auto' }}
            >
              {filtered.map(skill => (
                <div
                  key={skill.name}
                  className={`inventory-slot ${selected.name === skill.name ? 'selected' : ''}`}
                  onClick={() => setSelected(skill)}
                  role="button"
                  aria-label={skill.name}
                  aria-pressed={selected.name === skill.name}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setSelected(skill)}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-pixel" style={{ fontSize: 9, color: skill.color }}>{skill.icon}</span>
                    <div className="w-10 h-1" style={{ background: 'var(--px-border)' }}>
                      <div style={{ width: `${skill.level}%`, height: '100%', background: skill.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail sidebar */}
            <div
              className="p-4"
              style={{ minWidth: 180, maxWidth: 240, borderLeft: '2px solid var(--px-border)', flex: '0 0 auto' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  <div className="font-pixel" style={{ fontSize: 9, color: selected.color }}>
                    {selected.name}
                  </div>
                  <div className="font-terminal text-px-dim" style={{ fontSize: 17, lineHeight: 1.3 }}>
                    {selected.desc}
                  </div>
                  <div>
                    <div className="font-pixel text-px-dim mb-1" style={{ fontSize: 7 }}>PROFICIENCY</div>
                    <div className="stat-bar-track">
                      <motion.div
                        className="stat-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${selected.level}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        style={{ background: `linear-gradient(90deg, ${selected.color}66, ${selected.color})` }}
                      />
                    </div>
                    <div className="font-pixel text-px-dim mt-1 text-right" style={{ fontSize: 7 }}>
                      {selected.level}/100
                    </div>
                  </div>
                  <div className="font-pixel text-px-dim" style={{ fontSize: 7 }}>
                    CAT: {selected.category}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
