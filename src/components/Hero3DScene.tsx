'use client'
import { useEffect, useRef } from 'react'

/**
 * Animated hero 3D-style visual — built with pure Canvas2D.
 * No WebGL, no Three.js, no crash risk.
 * Creates a glowing orbiting particle system with a pulsing core.
 */
export default function Hero3DScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        let w = 0
        let h = 0

        const resize = () => {
            w = canvas.width = window.innerWidth
            h = canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Particle system
        const PARTICLE_COUNT = 120
        const particles: {
            angle: number
            radius: number
            speed: number
            size: number
            orbitTilt: number
            color: string
            phase: number
        }[] = []

        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#a78bfa', '#38bdf8', '#c084fc']

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                angle: Math.random() * Math.PI * 2,
                radius: 80 + Math.random() * 200,
                speed: 0.002 + Math.random() * 0.006,
                size: 1 + Math.random() * 2.5,
                orbitTilt: -0.3 + Math.random() * 0.6,
                color: colors[Math.floor(Math.random() * colors.length)],
                phase: Math.random() * Math.PI * 2,
            })
        }

        // Orbit rings
        const rings = [
            { radius: 120, tilt: 0.4, speed: 0.003, color: 'rgba(139,92,246,0.15)', width: 1 },
            { radius: 170, tilt: -0.3, speed: -0.002, color: 'rgba(59,130,246,0.12)', width: 0.8 },
            { radius: 220, tilt: 0.2, speed: 0.0015, color: 'rgba(6,182,212,0.08)', width: 0.6 },
        ]

        function draw(time: number) {
            ctx!.clearRect(0, 0, w, h)
            const cx = w / 2
            const cy = h / 2

            // Glowing core
            const coreRadius = 50 + Math.sin(time * 0.002) * 8
            const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2.5)
            grad.addColorStop(0, 'rgba(139,92,246,0.25)')
            grad.addColorStop(0.3, 'rgba(59,130,246,0.12)')
            grad.addColorStop(0.6, 'rgba(6,182,212,0.05)')
            grad.addColorStop(1, 'transparent')
            ctx!.fillStyle = grad
            ctx!.beginPath()
            ctx!.arc(cx, cy, coreRadius * 2.5, 0, Math.PI * 2)
            ctx!.fill()

            // Inner bright core
            const innerGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreRadius)
            innerGrad.addColorStop(0, 'rgba(139,92,246,0.5)')
            innerGrad.addColorStop(0.5, 'rgba(99,102,241,0.2)')
            innerGrad.addColorStop(1, 'rgba(59,130,246,0.05)')
            ctx!.fillStyle = innerGrad
            ctx!.beginPath()
            ctx!.arc(cx, cy, coreRadius, 0, Math.PI * 2)
            ctx!.fill()

            // Icosahedron wireframe simulation (rotating hexagon-ish shape)
            const rot = time * 0.0005
            const icoSize = 55 + Math.sin(time * 0.0015) * 5
            ctx!.strokeStyle = 'rgba(6,182,212,0.3)'
            ctx!.lineWidth = 0.8
            for (let ring = 0; ring < 3; ring++) {
                const tilt = ring * 0.4 - 0.4
                const sides = 5 + ring
                ctx!.beginPath()
                for (let j = 0; j <= sides; j++) {
                    const a = (j / sides) * Math.PI * 2 + rot + ring * 0.5
                    const rx = icoSize * (1 + ring * 0.15)
                    const x = cx + Math.cos(a) * rx
                    const y = cy + Math.sin(a) * rx * (0.5 + tilt * 0.3) + Math.sin(a + rot) * 10
                    if (j === 0) { ctx!.moveTo(x, y) } else { ctx!.lineTo(x, y) }
                }
                ctx!.closePath()
                ctx!.stroke()
            }

            // Orbit rings
            rings.forEach((ring) => {
                const angle = time * ring.speed
                ctx!.strokeStyle = ring.color
                ctx!.lineWidth = ring.width
                ctx!.beginPath()
                ctx!.ellipse(
                    cx,
                    cy,
                    ring.radius,
                    ring.radius * (0.35 + ring.tilt * 0.15),
                    angle,
                    0,
                    Math.PI * 2
                )
                ctx!.stroke()
            })

            // Orbiting particles  
            particles.forEach((p) => {
                p.angle += p.speed
                const x = cx + Math.cos(p.angle) * p.radius
                const yBase = cy + Math.sin(p.angle) * p.radius * (0.4 + p.orbitTilt * 0.2)
                const y = yBase + Math.sin(p.angle * 2 + p.phase) * 15

                const opacity = 0.3 + Math.sin(time * 0.003 + p.phase) * 0.3
                ctx!.globalAlpha = opacity
                ctx!.fillStyle = p.color
                ctx!.beginPath()
                ctx!.arc(x, y, p.size, 0, Math.PI * 2)
                ctx!.fill()

                // Glow
                ctx!.globalAlpha = opacity * 0.3
                ctx!.beginPath()
                ctx!.arc(x, y, p.size * 3, 0, Math.PI * 2)
                ctx!.fill()
            })

            ctx!.globalAlpha = 1
            animId = requestAnimationFrame(draw)
        }

        animId = requestAnimationFrame(draw)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1, opacity: 0.9 }}
            aria-hidden="true"
        />
    )
}
