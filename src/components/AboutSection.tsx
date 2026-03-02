'use client'

import { motion } from 'framer-motion'
import { SkillBar } from './SkillBar'
import { CompassRose, Anchor, JollyRoger } from './OnePieceDecorations'

const skills = [
  { label: 'C / C++', percentage: 95, color: 'var(--color-luffy-red)' },
  { label: 'Python', percentage: 90, color: 'var(--color-gold)' },
  { label: 'Go', percentage: 85, color: 'var(--color-sky-blue)' },
  { label: 'Kubernetes', percentage: 88, color: 'var(--color-luffy-red)' },
  { label: 'DPDK / Networking', percentage: 92, color: 'var(--color-gold)' },
  { label: 'Ceph / Storage', percentage: 85, color: 'var(--color-sky-blue)' },
  { label: 'React / TypeScript', percentage: 80, color: 'var(--color-luffy-red)' },
  { label: 'Linux / Systems', percentage: 93, color: 'var(--color-gold)' },
]

const stats = [
  { value: '400G+', label: 'Throughput' },
  { value: '15+', label: 'Ceph PRs' },
  { value: '500+', label: 'K8s VMs' },
  { value: '99.9%', label: 'Uptime' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center py-24 px-6 overflow-hidden"
      style={{ backgroundColor: 'var(--color-ocean-deep)' }}
    >
      {/* Background watermark */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-[0.03]">
        <JollyRoger size={600} />
      </div>

      {/* Floating compass decoration */}
      <CompassRose className="absolute top-16 left-8 opacity-15 hidden lg:block" size={70} />
      <Anchor className="absolute bottom-20 right-10 opacity-10 hidden lg:block" size={55} />

      <div className="relative max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Character Card — manga panel style */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Manga panel border frame */}
          <div
            className="relative overflow-hidden rounded-sm p-8"
            style={{
              background: 'linear-gradient(170deg, rgba(15,30,50,0.95) 0%, rgba(7,17,32,0.98) 100%)',
              border: '3px solid rgba(215,0,0,0.4)',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.3), 0 0 30px rgba(215,0,0,0.08)',
            }}
          >
            {/* Corner accents — manga panel corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-luffy-red/60" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-luffy-red/60" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-luffy-red/60" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-luffy-red/60" />

            {/* Card header */}
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-luffy-red/60 mb-2">
                ── Crew Dossier ──
              </div>
              <h2
                className="font-display text-3xl md:text-4xl tracking-wide"
                style={{
                  color: 'var(--color-gold)',
                  textShadow: '0 0 20px rgba(255,206,0,0.2), 2px 2px 0 rgba(0,0,0,0.5)',
                }}
              >
                CHARACTER STATS
              </h2>
              <p className="font-mono text-xs text-sky-blue/60 tracking-wider uppercase mt-1">
                Role: Systems Engineer
              </p>
            </motion.div>

            {/* Skill bars */}
            <motion.div variants={itemVariants} className="space-y-4 mb-8">
              {skills.map((skill) => (
                <SkillBar key={skill.label} {...skill} />
              ))}
            </motion.div>

            {/* Stats row — bounty-style */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-4 gap-3 pt-6 border-t-2 border-bronze/20"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="font-display text-xl md:text-2xl"
                    style={{
                      color: 'var(--color-luffy-red)',
                      textShadow: '0 0 12px rgba(215,0,0,0.3), 1px 1px 0 rgba(0,0,0,0.4)',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="font-mono text-[10px] text-bronze/50 tracking-wider uppercase mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right: Bio — with manga-inspired accents */}
        <motion.div
          className="flex flex-col justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants}>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-luffy-red/60 mb-3">
              ── Captain&apos;s Log ──
            </div>
            <h2
              className="font-display text-4xl md:text-5xl tracking-wide mb-6"
              style={{
                color: 'var(--color-gold)',
                textShadow: '0 0 30px rgba(255,206,0,0.2), 3px 3px 0 rgba(0,0,0,0.5)',
              }}
            >
              ABOUT
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4 font-body text-white/70 leading-relaxed">
            <p>
              Software Engineer at{' '}
              <span className="text-gold font-semibold">Arista Networks</span>, building
              high-performance packet processing systems that handle{' '}
              <span
                className="font-semibold"
                style={{ color: 'var(--color-luffy-red)', textShadow: '0 0 8px rgba(215,0,0,0.3)' }}
              >
                400G+ throughput
              </span>{' '}
              with zero packet loss using DPDK.
            </p>
            <p>
              Active open-source contributor with{' '}
              <span className="text-sky-blue font-semibold">15+ merged PRs</span> to the
              Ceph distributed storage project. Building infrastructure at{' '}
              <span className="text-gold font-semibold">xBattery</span> — orchestrating{' '}
              <span
                className="font-semibold"
                style={{ color: 'var(--color-luffy-red)', textShadow: '0 0 8px rgba(215,0,0,0.3)' }}
              >
                500+ VMs
              </span>{' '}
              on Kubernetes with 99.9% uptime.
            </p>
            <p>
              Passionate about distributed systems, systems programming, and building
              tools that scale. When not shipping code, exploring the Grand Line of
              infrastructure engineering.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <div
              className="font-mono text-xs tracking-wider px-4 py-3 rounded-sm"
              style={{
                background: 'rgba(15,30,50,0.6)',
                border: '1px solid rgba(96,191,245,0.15)',
              }}
            >
              <span style={{ color: 'rgba(255,206,0,0.6)' }}>current_status</span>:{' '}
              <span style={{ color: 'rgba(96,191,245,0.6)' }}>
                &quot;shipping code at Arista + building infra at xBattery&quot;
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
