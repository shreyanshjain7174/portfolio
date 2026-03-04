'use client'
import { motion } from 'framer-motion'

interface SectionHeadingProps {
    number: string
    title: string
    subtitle?: string
}

export default function SectionHeading({ number, title, subtitle }: SectionHeadingProps) {
    return (
        <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="flex items-center gap-4 mb-3">
                <span
                    className="font-mono text-sm font-medium"
                    style={{ color: 'var(--accent-violet)' }}
                >
                    {number}
                </span>
                <div className="section-divider" />
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl" style={{ color: 'var(--text-primary)' }}>
                {title}
            </h2>
            {subtitle && (
                <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)', maxWidth: 600 }}>
                    {subtitle}
                </p>
            )}
        </motion.div>
    )
}
