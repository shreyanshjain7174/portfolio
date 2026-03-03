'use client'
import { useEffect, useRef } from 'react'

interface Star { x: number; y: number; r: number; alpha: number; alphaDir: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; gold: boolean }

export default function PixelCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() < 0.2 ? 2 : 1,
      alpha: 0.3 + Math.random() * 0.7,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
    }))

    const particles: Particle[] = []
    let tick = 0

    const spawnParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height * (0.3 + Math.random() * 0.7),
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.3 + Math.random() * 0.5),
        life: 0,
        maxLife: 100 + Math.random() * 100,
        size: Math.random() < 0.4 ? 2 : 1,
        gold: Math.random() > 0.6,
      })
    }

    const draw = () => {
      tick++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of stars) {
        s.alpha += s.alphaDir * 0.004
        if (s.alpha >= 1) { s.alpha = 1; s.alphaDir = -1 }
        if (s.alpha <= 0.2) { s.alpha = 0.2; s.alphaDir = 1 }
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
        ctx.fillRect(Math.round(s.x), Math.round(s.y), s.r, s.r)
      }

      if (tick % 6 === 0) spawnParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        const t = p.life / p.maxLife
        const alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7
        ctx.fillStyle = p.gold ? `rgba(255,215,0,${alpha * 0.7})` : `rgba(0,245,255,${alpha * 0.7})`
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
        if (p.life >= p.maxLife) particles.splice(i, 1)
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  )
}
