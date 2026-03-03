'use client'

import { motion } from 'framer-motion'

interface SkillBarProps {
  label: string
  percentage: number
  color?: string
}

export function SkillBar({ label, percentage, color = 'var(--color-luffy-red)' }: SkillBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span
          className="font-mono text-xs tracking-wider uppercase"
          style={{ color: 'var(--color-text-dark)', opacity: 0.7 }}
        >
          {label}
        </span>
        <span className="font-mono text-xs" style={{ color: 'var(--color-text-dark)', opacity: 0.5 }}>
          {percentage}%
        </span>
      </div>
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(26,26,46,0.1)' }}
      >
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
