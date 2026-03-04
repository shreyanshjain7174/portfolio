'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/shreyanshjain7174', icon: '⟁' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/shreyansh-sancheti', icon: '◈' },
  { label: 'Twitter', href: 'https://twitter.com/shrey_sancheti', icon: '✦' },
  { label: 'Email', href: 'mailto:007ssancheti@gmail.com', icon: '◉' },
]

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animated particles background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number; color: string }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    const colors = ['rgba(139,92,246,', 'rgba(59,130,246,', 'rgba(6,182,212,']
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        o: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.o})`
        ctx.fill()

        // Connect nearby particles
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(139,92,246,${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Mesh gradient orbs */}
      <div className="mesh-gradient" aria-hidden="true" />

      {/* Dot grid subtle overlay */}
      <div className="absolute inset-0 dot-grid pointer-events-none opacity-30" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full"
          style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            SDE @ Arista Networks
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="font-display font-bold leading-[1.1] mb-6"
          style={{ fontSize: 'clamp(36px, 7vw, 80px)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={{ color: 'var(--text-primary)' }}>Hi, I&apos;m </span>
          <span className="gradient-text">Shreyansh</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>I build </span>
          <span className="gradient-text">systems</span>
          <span style={{ color: 'var(--text-primary)' }}> that scale.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Software Engineer specializing in{' '}
          <span style={{ color: 'var(--accent-cyan)' }}>distributed systems</span>,{' '}
          <span style={{ color: 'var(--accent-violet)' }}>networking</span>, and{' '}
          <span style={{ color: 'var(--accent-blue)' }}>system programming</span>.
          Building resilient infrastructure with C++, Rust, Go &amp; Python.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <a href="#projects" className="btn-primary">
            View My Work
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#contact" className="btn-outline">
            Get in Touch
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--text-secondary)',
                fontSize: 16,
              }}
              title={s.label}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = 'rgba(139,92,246,0.15)';
                (e.target as HTMLElement).style.borderColor = 'rgba(139,92,246,0.3)';
                (e.target as HTMLElement).style.color = '#8b5cf6';
                (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {s.icon}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>scroll</span>
        <div
          className="w-5 h-8 rounded-full flex items-start justify-center p-1.5"
          style={{ border: '1.5px solid var(--text-muted)' }}
        >
          <motion.div
            className="w-1 h-1.5 rounded-full"
            style={{ background: 'var(--accent-violet)' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
