'use client'

import { motion } from 'framer-motion'

/* ── Straw Hat SVG ─────────────────────────────────────────────────── */
export function StrawHat({ className = '', size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hat brim */}
      <ellipse cx="100" cy="90" rx="95" ry="25" fill="var(--color-gold)" opacity="0.9" />
      <ellipse cx="100" cy="90" rx="95" ry="25" stroke="var(--color-bronze)" strokeWidth="3" fill="none" />
      {/* Hat dome */}
      <path
        d="M35 90 C35 90 40 25 100 20 C160 25 165 90 165 90"
        fill="var(--color-gold)"
        opacity="0.95"
      />
      <path
        d="M35 90 C35 90 40 25 100 20 C160 25 165 90 165 90"
        stroke="var(--color-bronze)"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Red band */}
      <path
        d="M42 72 C42 72 60 62 100 60 C140 62 158 72 158 72 L158 82 C158 82 140 72 100 70 C60 72 42 82 42 82 Z"
        fill="var(--color-luffy-red)"
      />
      {/* Straw texture lines */}
      <path d="M60 40 C70 35 80 30 100 28" stroke="var(--color-bronze)" strokeWidth="0.8" opacity="0.4" />
      <path d="M70 50 C80 44 90 38 110 36" stroke="var(--color-bronze)" strokeWidth="0.8" opacity="0.3" />
      <path d="M55 60 C75 52 95 48 120 47" stroke="var(--color-bronze)" strokeWidth="0.8" opacity="0.3" />
    </svg>
  )
}

/* ── Animated Straw Hat (floating + rotating) ──────────────────────── */
export function FloatingStrawHat({ className = '', size = 120 }: { className?: string; size?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -8, 0],
        rotate: [-3, 3, -3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <StrawHat size={size} />
    </motion.div>
  )
}

/* ── Compass Rose / Log Pose ───────────────────────────────────────── */
export function CompassRose({ className = '', size = 80 }: { className?: string; size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="45" stroke="var(--color-gold)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="50" cy="50" r="40" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.3" />
      {/* Cardinal points */}
      <polygon points="50,8 54,42 50,38 46,42" fill="var(--color-luffy-red)" opacity="0.8" />
      <polygon points="50,92 54,58 50,62 46,58" fill="var(--color-gold)" opacity="0.5" />
      <polygon points="8,50 42,46 38,50 42,54" fill="var(--color-gold)" opacity="0.5" />
      <polygon points="92,50 58,46 62,50 58,54" fill="var(--color-gold)" opacity="0.5" />
      {/* Ordinal points */}
      <polygon points="20,20 44,44 40,44 44,40" fill="var(--color-sky-blue)" opacity="0.3" />
      <polygon points="80,20 56,44 60,44 56,40" fill="var(--color-sky-blue)" opacity="0.3" />
      <polygon points="20,80 44,56 40,56 44,60" fill="var(--color-sky-blue)" opacity="0.3" />
      <polygon points="80,80 56,56 60,56 56,60" fill="var(--color-sky-blue)" opacity="0.3" />
      {/* Center dot */}
      <circle cx="50" cy="50" r="3" fill="var(--color-gold)" opacity="0.8" />
      <circle cx="50" cy="50" r="1.5" fill="var(--color-luffy-red)" />
      {/* N/S/E/W letters */}
      <text x="50" y="7" textAnchor="middle" fill="var(--color-gold)" fontSize="6" fontFamily="var(--font-display)" opacity="0.6">N</text>
      <text x="50" y="99" textAnchor="middle" fill="var(--color-gold)" fontSize="6" fontFamily="var(--font-display)" opacity="0.4">S</text>
      <text x="96" y="52" textAnchor="middle" fill="var(--color-gold)" fontSize="6" fontFamily="var(--font-display)" opacity="0.4">E</text>
      <text x="4" y="52" textAnchor="middle" fill="var(--color-gold)" fontSize="6" fontFamily="var(--font-display)" opacity="0.4">W</text>
    </motion.svg>
  )
}

/* ── Jolly Roger (skull + crossbones, straw hat style) ─────────────── */
export function JollyRoger({ className = '', size = 100 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Crossbones */}
      <line x1="15" y1="75" x2="85" y2="35" stroke="var(--color-gold)" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
      <line x1="15" y1="35" x2="85" y2="75" stroke="var(--color-gold)" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
      {/* Skull */}
      <circle cx="50" cy="45" r="22" fill="none" stroke="var(--color-gold)" strokeWidth="2" opacity="0.5" />
      {/* Eyes */}
      <circle cx="42" cy="42" r="4" fill="var(--color-luffy-red)" opacity="0.6" />
      <circle cx="58" cy="42" r="4" fill="var(--color-luffy-red)" opacity="0.6" />
      {/* Smile */}
      <path d="M38 54 Q50 62 62 54" stroke="var(--color-gold)" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Straw hat on skull */}
      <path d="M26 36 Q28 20 50 17 Q72 20 74 36" stroke="var(--color-gold)" strokeWidth="1.5" fill="var(--color-gold)" opacity="0.15" />
      <line x1="24" y1="36" x2="76" y2="36" stroke="var(--color-gold)" strokeWidth="2" opacity="0.4" />
      {/* Hat band */}
      <line x1="30" y1="32" x2="70" y2="32" stroke="var(--color-luffy-red)" strokeWidth="3" opacity="0.4" />
    </svg>
  )
}

/* ── Manga Impact Burst ────────────────────────────────────────────── */
export function MangaImpact({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        width="700"
        height="400"
        viewBox="0 0 700 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Starburst spikes */}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 15) * (Math.PI / 180)
          const innerR = 100 + (i % 3) * 20
          const outerR = 250 + (i % 4) * 40
          const x1 = 350 + Math.cos(angle) * innerR
          const y1 = 200 + Math.sin(angle) * innerR * 0.6
          const x2 = 350 + Math.cos(angle) * outerR
          const y2 = 200 + Math.sin(angle) * outerR * 0.6
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-luffy-red)"
              strokeWidth={2 + (i % 3)}
              opacity={0.08 + (i % 3) * 0.03}
            />
          )
        })}
        {/* Inner glow ellipse */}
        <ellipse
          cx="350"
          cy="200"
          rx="180"
          ry="100"
          fill="url(#impactGradient)"
        />
        <defs>
          <radialGradient id="impactGradient" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--color-luffy-red)" stopOpacity="0.08" />
            <stop offset="60%" stopColor="var(--color-luffy-red)" stopOpacity="0.03" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

/* ── Anchor decoration ─────────────────────────────────────────────── */
export function Anchor({ className = '', size = 60 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ring at top */}
      <circle cx="30" cy="10" r="5" stroke="var(--color-gold)" strokeWidth="2" opacity="0.4" />
      {/* Vertical shaft */}
      <line x1="30" y1="15" x2="30" y2="48" stroke="var(--color-gold)" strokeWidth="2.5" opacity="0.4" />
      {/* Horizontal bar */}
      <line x1="18" y1="25" x2="42" y2="25" stroke="var(--color-gold)" strokeWidth="2" opacity="0.4" />
      {/* Curved arms */}
      <path d="M10 42 Q10 52 20 55 Q25 50 30 48" stroke="var(--color-gold)" strokeWidth="2.5" fill="none" opacity="0.4" />
      <path d="M50 42 Q50 52 40 55 Q35 50 30 48" stroke="var(--color-gold)" strokeWidth="2.5" fill="none" opacity="0.4" />
      {/* Arrow tips */}
      <polygon points="7,40 10,42 13,40 10,46" fill="var(--color-gold)" opacity="0.4" />
      <polygon points="47,40 50,42 53,40 50,46" fill="var(--color-gold)" opacity="0.4" />
    </svg>
  )
}

/* ── Floating Kanji decoration ─────────────────────────────────────── */
export function FloatingKanji({ className = '' }: { className?: string }) {
  const kanji = ['海', '夢', '力', '冒', '険'] // sea, dream, power, adventure, danger
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {kanji.map((char, i) => (
        <motion.span
          key={i}
          className="absolute font-display select-none"
          style={{
            fontSize: `${60 + i * 20}px`,
            left: `${10 + i * 18}%`,
            top: `${15 + (i % 3) * 25}%`,
            color: 'rgba(255, 206, 0, 0.04)',
          }}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}

export default {
  StrawHat,
  FloatingStrawHat,
  CompassRose,
  JollyRoger,
  MangaImpact,
  Anchor,
  FloatingKanji,
}
