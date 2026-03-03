'use client'

import { useEffect, useRef } from 'react'

/**
 * OceanCanvas — lightweight sine-wave animation at 60fps.
 * Renders 3 layered translucent wave curves over the hero.
 */
export function OceanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const waves = [
        { alpha: 0.12, amplitude: 18, frequency: 0.009, speed: 0.4, yFactor: 0.62 },
        { alpha: 0.08, amplitude: 28, frequency: 0.006, speed: 0.25, yFactor: 0.72 },
        { alpha: 0.05, amplitude: 40, frequency: 0.004, speed: 0.15, yFactor: 0.82 },
      ]

      waves.forEach(({ alpha, amplitude, frequency, speed, yFactor }) => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.lineWidth = 2

        const yBase = canvas.height * yFactor
        ctx.moveTo(0, yBase)
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = yBase + Math.sin(x * frequency + t * speed) * amplitude
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      })

      t += 0.02
      animId = requestAnimationFrame(draw)
    }

    draw()

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId)
      } else {
        draw()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  )
}

export default OceanCanvas
