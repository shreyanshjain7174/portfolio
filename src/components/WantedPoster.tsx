'use client'

import { motion } from 'framer-motion'

interface WantedPosterProps {
  title: string
  description: string
  tags: string[]
  stat?: string
  link?: string
}

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
          group-hover:-translate-y-3"
        style={{
          background: 'linear-gradient(170deg, #FFF8E7 0%, #FFF0C8 40%, #FFEAA0 100%)',
          border: '3px solid rgba(215,0,0,0.5)',
          borderRadius: '2px',
          boxShadow: '6px 6px 0px rgba(0,0,0,0.12), 8px 8px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* Aged paper texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23D4A042' opacity='0.08'/%3E%3C/svg%3E\")",
            opacity: 0.4,
          }}
        />

        {/* WANTED header */}
        <div
          className="relative px-6 pt-5 pb-2 text-center"
          style={{ borderBottom: '2px solid rgba(215,0,0,0.2)' }}
        >
          <div
            className="font-display text-3xl md:text-4xl tracking-[0.15em] leading-none"
            style={{
              color: 'var(--color-luffy-red)',
              textShadow: '0 0 20px rgba(215,0,0,0.2), 2px 2px 0 rgba(0,0,0,0.1)',
            }}
          >
            WANTED
          </div>
          <div
            className="font-mono text-[9px] tracking-[0.3em] mt-1 uppercase"
            style={{ color: 'rgba(215,0,0,0.5)' }}
          >
            Dead or Alive
          </div>
        </div>

        {/* Content */}
        <div className="relative px-6 py-5">
          <h3
            className="font-display text-xl md:text-2xl text-center mb-3 leading-tight"
            style={{
              color: 'var(--color-text-dark)',
              textShadow: '1px 1px 0 rgba(0,0,0,0.1)',
            }}
          >
            {title}
          </h3>

          <p
            className="font-body text-sm leading-relaxed mb-4 text-center"
            style={{ color: 'rgba(26,26,46,0.65)' }}
          >
            {description}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider"
                style={{
                  border: '1px solid rgba(215,0,0,0.3)',
                  color: 'rgba(215,0,0,0.7)',
                  background: 'rgba(215,0,0,0.05)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bounty */}
        <div
          className="relative px-6 pb-5 pt-2"
          style={{ borderTop: '2px solid rgba(215,0,0,0.2)' }}
        >
          <div className="text-center">
            <div
              className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1"
              style={{ color: 'rgba(215,0,0,0.5)' }}
            >
              Bounty
            </div>
            <div
              className="font-display text-3xl md:text-4xl"
              style={{
                color: 'var(--color-luffy-red)',
                textShadow: '0 0 20px rgba(215,0,0,0.3), 2px 2px 0 rgba(0,0,0,0.1)',
              }}
            >
              {stat || '???'}
            </div>
          </div>
        </div>

        {/* Link */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View bounty details for ${title}`}
            className="block text-center py-3 font-mono text-xs tracking-[0.2em] uppercase
              transition-all duration-300"
            style={{
              color: 'rgba(215,0,0,0.5)',
              borderTop: '1px solid rgba(215,0,0,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-luffy-red)'
              e.currentTarget.style.background = 'rgba(215,0,0,0.04)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(215,0,0,0.5)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            View Bounty Details →
          </a>
        )}

        {/* Red glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 40px rgba(215,0,0,0.06)',
          }}
        />
      </div>
    </motion.div>
  )
}

export default WantedPoster
