'use client'

import { motion } from 'framer-motion'

interface WantedPosterProps {
  title: string
  description: string
  tags: string[]
  stat?: string
  link?: string
}

/**
 * WantedPoster — One Piece "WANTED" bounty poster style project card.
 * Aged parchment look, WANTED header, bounty stat, torn-edge aesthetic.
 */
export function WantedPoster({ title, description, tags, stat, link }: WantedPosterProps) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 50, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative overflow-hidden transition-all duration-500
          group-hover:-translate-y-3 group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(215,0,0,0.15)]"
        style={{
          background: 'linear-gradient(170deg, #2a2215 0%, #1a1508 40%, #12100a 100%)',
          border: '3px solid rgba(223,193,138,0.3)',
          borderRadius: '2px',
          boxShadow: '6px 6px 0px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Aged paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23DFC18A'/%3E%3C/svg%3E")`,
          }}
        />

        {/* WANTED header */}
        <div className="relative px-6 pt-5 pb-2 text-center border-b-2 border-bronze/20">
          <div
            className="font-display text-3xl md:text-4xl tracking-[0.15em] leading-none"
            style={{
              color: 'var(--color-bronze)',
              textShadow: '0 0 20px rgba(223,193,138,0.3), 2px 2px 0 rgba(0,0,0,0.5)',
            }}
          >
            WANTED
          </div>
          <div className="font-mono text-[9px] text-bronze/40 tracking-[0.3em] mt-1 uppercase">
            Dead or Alive
          </div>
        </div>

        {/* Content area (represents the "photo" area of a wanted poster) */}
        <div className="relative px-6 py-5">
          {/* Project name as the "criminal" name */}
          <h3
            className="font-display text-xl md:text-2xl text-center mb-3 leading-tight"
            style={{
              color: 'var(--color-gold)',
              textShadow: '0 0 10px rgba(255,206,0,0.2)',
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="font-body text-sm text-white/60 leading-relaxed mb-4 text-center">
            {description}
          </p>

          {/* Tech tags as "charges" */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider
                  border border-bronze/25 text-bronze/70 bg-bronze/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bounty section */}
        <div className="relative px-6 pb-5 pt-2 border-t-2 border-bronze/20">
          <div className="text-center">
            <div className="font-mono text-[9px] text-bronze/40 tracking-[0.3em] uppercase mb-1">
              Bounty
            </div>
            <div
              className="font-display text-3xl md:text-4xl"
              style={{
                color: 'var(--color-luffy-red)',
                textShadow: '0 0 20px rgba(215,0,0,0.4), 2px 2px 0 rgba(0,0,0,0.5)',
              }}
            >
              {stat || '???'}
            </div>
          </div>
        </div>

        {/* View link */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3 font-mono text-xs tracking-[0.2em] uppercase
              text-bronze/40 hover:text-luffy-red border-t border-bronze/10
              hover:bg-luffy-red/5 transition-all duration-300"
          >
            View Bounty Details →
          </a>
        )}

        {/* Corner stamps */}
        <div className="absolute top-3 right-3 w-8 h-8 border-2 border-luffy-red/20 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-luffy-red/30 rounded-full" />
        </div>

        {/* Red glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(215,0,0,0.05) 0%, transparent 70%)',
          }}
        />
      </div>
    </motion.div>
  )
}

export default WantedPoster
