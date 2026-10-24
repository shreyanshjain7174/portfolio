'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { HALL_OF_FAME, JOBS, PROJECTS, SOCIALS } from '@/content/content'
import { QUOTES, nextQuote, type Quote } from '@/content/quotes'
import type { RepoLive } from '@/lib/github'
import { Cursor } from './Cursor'
import { Inspect } from './Inspect'
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

function softwareGL() {
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    if (!gl) return true
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return /swiftshader|llvmpipe|software/i.test(name)
  } catch {
    return true
  }
}

function hoverLabel(id: string) {
  if (id.startsWith('watch:')) return `${id.slice(6)} · pick it up`
  if (id === 'projects') return 'Next project'
  if (id === 'hobbies') return 'Off the clock'
  if (id === 'exit') return 'Another thought'
  if (id.startsWith('social:')) return `Open ${id.slice(7)} ↗`
  if (id.startsWith('hall:')) return `${HALL_OF_FAME[Number(id.slice(5))]?.title} · look closer`
  const v = VEHICLES.find((x) => x.job === id); if (v) return `${v.era} · look closer`
  const p = PROJECTS.find((x) => x.id === id); if (p) return p.name
  if (id === 'lounge') return 'The lounge'
  return null
}

export function Showroom({ live = {} }: { live?: Record<string, RepoLive> }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const api = useRef<SceneApi | null>(null)
  const sections = useRef<HTMLElement[]>([])
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [entered, setEntered] = useState(false)
  const [active, setActive] = useState(0)
  const [project, setProjectState] = useState(0)
  const [pieces, setPieces] = useState<{ done: number; total: number } | null>(null)
  const projectRef = useRef(0)
  const setProject = useCallback((i: number) => {
    projectRef.current = i
    setProjectState(i)
    api.current?.setProject(i)
  }, [])
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState<string | null>(null)
  const [inspecting, setInspecting] = useState<string | null>(null)
  // the server renders the first quote; the visitor's browser picks its own once it is running
  const [quote, setQuote] = useState<Quote>(QUOTES[0])
  const quoteRef = useRef(quote)
  const changeQuote = useCallback(() => {
    const q = nextQuote(quoteRef.current)
    quoteRef.current = q; setQuote(q)
    api.current?.setQuote(q.text, q.by)
  }, [])
  useEffect(() => { changeQuote() }, [changeQuote])
  const inspectingRef = useRef<string | null>(null)
  const inspect = useCallback((job: string | null) => {
    inspectingRef.current = job
    setInspecting(job)
    // the panel sits right on a wide screen and along the bottom on a phone: keep the car in the open part
    const wide = innerWidth >= 768
    api.current?.inspect(job, wide ? { x: 230, y: 0 } : { x: 0, y: Math.round(innerHeight * 0.2) })
    setHover(null)
  }, [])
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
        onHover: (id) => setHover(id ? hoverLabel(id) : null),
        onProgress: (done, total) => setPieces({ done, total }),
        quote: quoteRef.current,
        onSelect: (id) => {
          if (VEHICLES.some((v) => v.job === id) || id.startsWith('watch:')) return inspect(id)
          // the hall opens on the whole wall; once there, a click goes to that honour
          if (id.startsWith('hall:')) return inspect(inspectingRef.current?.startsWith('hall') ? id : 'hall')
          if (id === 'exit') return changeQuote()
          if (id === 'projects') setProject((projectRef.current + 1) % PROJECTS.length)
          go(id)
        },
      })
      setReady(true)
    })
  }, [reduce, go, setProject, inspect, changeQuote])

  // start building as soon as the page has painted and the browser is idle, or at the first
  // sign of a visitor, whichever comes first: by the time they press Enter the room is ready
  useEffect(() => {
    const evs = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    const once = () => { build(); evs.forEach((e) => removeEventListener(e, once)) }
    evs.forEach((e) => addEventListener(e, once, { passive: true }))
    const soon = () => ('requestIdleCallback' in window ? requestIdleCallback(once, { timeout: 2500 }) : setTimeout(once, 1200))
    // on phones and machines without a real GPU, building unasked would block the main thread:
    // wait for the visitor's first touch instead
    if (innerWidth >= 860 && !softwareGL()) {
      if (document.readyState === 'complete') soon()
      else addEventListener('load', soon, { once: true })
    }
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

  // the page holds still while a vehicle is being looked at
  useEffect(() => {
    const hold = !entered || !!inspecting
    document.documentElement.style.overflow = hold ? 'hidden' : ''
    if (hold) lenis.current?.stop(); else lenis.current?.start()
  }, [entered, inspecting])

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
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
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

  // standing at the end wall, the thought changes on its own every so often
  const atExit = STATIONS[active]?.id === 'exit'
  useEffect(() => {
    if (!atExit || reduce || paused) return
    const t = setInterval(changeQuote, 16000)
    return () => clearInterval(t)
  }, [atExit, reduce, paused, changeQuote])

  const room = STATIONS[active]?.room ?? 'entrance'

  return (
    <>
      <canvas ref={canvas} className="fixed inset-0 h-[100svh] w-screen" aria-hidden />
      <Loader ready={ready} onEnter={enter} pieces={pieces} />

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

      <Cursor label={hover} mode={inspecting && !inspecting.startsWith('hall') ? 'drag' : null} />
      <AnimatePresence>
        {inspecting ? (
          <Inspect
            key={inspecting.startsWith('watch:') ? 'watch' : inspecting.startsWith('hall') ? 'hall' : inspecting}
            job={inspecting}
            onPick={inspect}
            onClose={() => inspect(null)}
            onEngine={(state, rev) => api.current?.setEngine(inspecting, state, rev)}
          />
        ) : null}
      </AnimatePresence>

      <main className={`pointer-events-none relative z-10 transition-opacity duration-500 ${inspecting ? 'opacity-0 [&_*]:!pointer-events-none' : ''}`} aria-hidden={inspecting ? true : undefined}>
        {STATIONS.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            ref={(el) => { if (el) sections.current[i] = el }}
            aria-label={s.id}
            className="relative min-h-[125svh] px-4 sm:px-8"
          >
            <div className="sticky top-0 flex h-[100svh] items-end pb-6 pt-24 sm:pb-10 md:items-end">
              {placardFor(s.id, { project, setProject, live, inspect, quote, nextQuote: changeQuote })}
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
