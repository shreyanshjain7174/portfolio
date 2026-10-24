'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { JOBS, PROJECTS, SOCIALS } from '@/content/content'
import { Loader } from './Loader'
import { AVAILABLE_MODELS } from './modelManifest'
import { placardFor } from './Placards'
import type { SceneApi } from './scene'
import { ROOMS, STATIONS, VEHICLES } from './stations'


function labelsForPlaques() {
  const out: Record<string, string[]> = {}
  for (const v of VEHICLES) {
    const j = JOBS.find((x) => x.id === v.job)!
    out[v.job] = [j.company, j.range, v.era]
  }
  return out
}

function hoverLabel(id: string) {
  if (id.startsWith('watch:')) return id.slice(6)
  if (id === 'projects') return 'Next project'
  if (id === 'hobbies') return 'Off the clock'
  if (id === 'exit') return 'Reach out'
  if (id.startsWith('social:')) return `Open ${id.slice(7)} ↗`
  if (id === 'hall') return 'Hall of fame'
  const j = JOBS.find((x) => x.id === id); if (j) return `${j.company} · ${VEHICLES.find((v) => v.job === id)?.era}`
  const p = PROJECTS.find((x) => x.id === id); if (p) return p.name
  if (id === 'lounge') return 'The lounge'
  return null
}

export function Showroom() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const api = useRef<SceneApi | null>(null)
  const sections = useRef<HTMLElement[]>([])
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [entered, setEntered] = useState(false)
  const [active, setActive] = useState(0)
  const [project, setProjectState] = useState(0)
  const projectRef = useRef(0)
  const setProject = useCallback((i: number) => {
    projectRef.current = i
    setProjectState(i)
    api.current?.setProject(i)
  }, [])
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState<{ label: string; x: number; y: number } | null>(null)
  const lenis = useRef<{ scrollTo: (t: HTMLElement | number, o?: object) => void; stop: () => void; start: () => void } | null>(null)

  const go = useCallback((id: string) => {
    if (id.startsWith('social:')) {
      const so = SOCIALS.find((x) => x.label === id.slice(7))
      if (so) window.open(so.url, '_blank', 'noopener')
      return
    }
    const target = id.startsWith('watch:') ? 'watches' : id
    const el = document.getElementById(target)
    if (!el) return
    if (lenis.current) lenis.current.scrollTo(el, { duration: 2.2 })
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }, [reduce])

  // the room is built on the first sign of a visitor (or the press), never during the first paint
  const building = useRef(false)
  const build = useCallback(() => {
    if (building.current || !canvas.current) return
    building.current = true
    const small = innerWidth < 860
    import('./scene').then(async ({ createShowroom }) => {
      if (!canvas.current) return
      api.current = await createShowroom({
        canvas: canvas.current,
        small,
        reduce: !!reduce,
        labels: labelsForPlaques(),
        onHover: (id, x, y) => { const l = id ? hoverLabel(id) : null; setHover(l ? { label: l, x, y } : null) },
        onSelect: (id) => {
          if (id === 'projects') setProject((projectRef.current + 1) % PROJECTS.length)
          go(id)
        },
      })
      setReady(true)
    })
  }, [reduce, go, setProject])

  useEffect(() => {
    const evs = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    const once = () => { build(); evs.forEach((e) => removeEventListener(e, once)) }
    evs.forEach((e) => addEventListener(e, once, { passive: true }))
    return () => { evs.forEach((e) => removeEventListener(e, once)); api.current?.dispose(); api.current = null }
  }, [build])

  // smooth scrolling, held until the visitor enters
  useEffect(() => {
    if (reduce) return
    let raf = 0
    let instance: { raf: (t: number) => void; destroy: () => void; scrollTo: (t: HTMLElement | number, o?: object) => void; stop: () => void; start: () => void } | null = null
    import('lenis').then(({ default: Lenis }) => {
      instance = new Lenis({ duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
      lenis.current = instance
      instance.stop()
      const loop = (t: number) => { instance?.raf(t); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    })
    return () => { cancelAnimationFrame(raf); instance?.destroy(); lenis.current = null }
  }, [reduce])

  useEffect(() => {
    document.documentElement.style.overflow = entered ? '' : 'hidden'
    if (entered) lenis.current?.start()
  }, [entered])

  // scroll position becomes a place on the camera rail
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const els = sections.current
      if (!els.length) return
      const mid = scrollY + innerHeight / 2
      const centers = els.map((el) => el.offsetTop + el.offsetHeight / 2)
      let k = 0
      if (mid <= centers[0]) k = 0
      else if (mid >= centers[centers.length - 1]) k = centers.length - 1
      else for (let i = 0; i < centers.length - 1; i++) if (mid < centers[i + 1]) { k = i + (mid - centers[i]) / (centers[i + 1] - centers[i]); break }
      api.current?.setStation(k)
      setActive(Math.round(k))
    }
    const onScroll = () => { setHover(null); if (!raf) raf = requestAnimationFrame(update) }
    addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => removeEventListener('scroll', onScroll)
  }, [ready])

  const [pressed, setPressed] = useState(false)
  const enter = () => { setPressed(true); build() }
  // once pressed and the room is ready: doors open, then walk in
  useEffect(() => {
    if (!pressed || !ready || entered) return
    setEntered(true)
    api.current?.openDoors()
    const t = setTimeout(() => go('garage'), reduce ? 0 : 1300)
    return () => clearTimeout(t)
  }, [pressed, ready, entered, go, reduce])

  const room = STATIONS[active]?.room ?? 'entrance'

  return (
    <>
      <canvas ref={canvas} className="fixed inset-0 h-[100svh] w-screen" aria-hidden />
      <Loader ready={ready} onEnter={enter} />

      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <a href="#entrance" onClick={(e) => { e.preventDefault(); go('entrance') }} aria-label="Shreyansh Sancheti, back to the entrance" className="font-display text-2xl leading-none">S2</a>
        <nav aria-label="Rooms" className="hidden items-center gap-7 text-[15px] md:flex">
          {ROOMS.map((r) => (
            <a key={r.id} href={`#${r.id}`} onClick={(e) => { e.preventDefault(); go(r.id) }} className={`relative py-1 transition-colors ${room === r.id ? 'text-ink' : 'text-muted hover:text-ink'}`}>
              {r.label}
              {room === r.id ? <motion.span layoutId="room" className="absolute inset-x-0 -bottom-0.5 h-px bg-ink" transition={{ type: 'spring', stiffness: 300, damping: 32 }} /> : null}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5 text-[15px]">
          <button type="button" onClick={() => { setPaused(!paused); api.current?.setPaused(!paused) }} className="text-muted hover:text-ink">{paused ? 'Play' : 'Pause'}</button>
          <a href="/plain" className="text-muted hover:text-ink">Plain view</a>
        </div>
      </header>

      <AnimatePresence>
        {hover ? (
          <motion.p
            key="tip"
            className="pointer-events-none fixed z-40 bg-ink px-3 py-1.5 text-sm text-ground"
            style={{ left: hover.x + 16, top: hover.y + 12 }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {hover.label}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <main className="pointer-events-none relative z-10">
        {STATIONS.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            ref={(el) => { if (el) sections.current[i] = el }}
            aria-label={s.id}
            className="relative min-h-[125svh] px-4 sm:px-8"
          >
            <div className="sticky top-0 flex h-[100svh] items-end pb-6 pt-24 sm:pb-10 md:items-end">
              {placardFor(s.id, { project, setProject })}
            </div>
          </section>
        ))}
        <footer className="pointer-events-auto relative bg-ground px-5 py-10 text-[15px] text-muted sm:px-8">
          <p>Built with Next.js, three.js and Framer Motion.</p>
          {Object.keys(AVAILABLE_MODELS).length ? (
            <p className="mt-2">3D models: {Object.values(AVAILABLE_MODELS).map((m) => m.credit).join('; ')}. Shown as a personal collection; names and marks belong to their owners.</p>
          ) : null}
        </footer>
      </main>
    </>
  )
}
