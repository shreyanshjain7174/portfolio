'use client'

import { motion } from 'framer-motion'

interface SkillBarProps {
  label: string
  percentage: number
  color?: string
}

/**
 * SkillBar — Horizontal power bar with animated fill on scroll.
 */
export function SkillBar({ label, percentage, color = 'var(--color-luffy-red)' }: SkillBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-xs tracking-wider text-white/70 uppercase">
          {label}
        </span>
        <span className="font-mono text-xs text-white/40">{percentage}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

export default SkillBar
