'use client'

import { motion } from 'framer-motion'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  stat?: string
  link?: string
}

/**
 * ProjectCard — Bounty-poster style card.
 * Cream/parchment bg, thick border, slight rotation, hover lift.
 */
export function ProjectCard({ title, description, tags, stat, link }: ProjectCardProps) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative p-6 border-4 border-ocean-dark transition-all duration-300
          group-hover:shadow-poster-hover group-hover:-translate-y-2 group-hover:rotate-0"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f1923 100%)',
          transform: 'rotate(-0.5deg)',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.5), 8px 8px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-luffy-red" />

        {/* Stat badge */}
        {stat && (
          <div className="absolute -top-3 -right-3 bg-luffy-red text-white font-display text-sm px-3 py-1 rotate-3 shadow-red-glow">
            {stat}
          </div>
        )}

        <h3 className="font-display text-2xl text-gold tracking-wide mb-3 leading-tight">
          {title}
        </h3>

        <p className="font-body text-sm text-white/70 leading-relaxed mb-4">
          {description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs px-2 py-0.5 rounded border border-sky-blue/30 text-sky-blue/80 bg-sky-blue/5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase
              text-luffy-red hover:text-white transition-colors duration-200
              border border-luffy-red/40 hover:border-luffy-red hover:bg-luffy-red/10 px-4 py-2 rounded"
          >
            View Project
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default ProjectCard
