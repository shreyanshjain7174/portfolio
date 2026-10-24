'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { carFor } from '@/content/cars'
import { WATCH_STORIES, watchFor } from '@/content/watches'
import { HALL_OF_FAME, JOBS, PERSON, SOCIALS } from '@/content/content'
import { Engine, prepare, type Ignition } from './engine'
import { VEHICLES } from './stations'

type Props = {
  job: string
  onClose: () => void
  /** mirrors the ignition into the scene: lamps, and the shiver of a running engine */
  onEngine: (state: Ignition, rev: number) => void
  /** move to another piece without stepping back first */
  onPick: (id: string) => void
}

export function Inspect(props: Props) {
  if (props.job.startsWith('watch:')) return <WatchInspect id={props.job} onClose={props.onClose} onPick={props.onPick} />
  if (props.job === 'hall' || props.job.startsWith('hall:')) return <HallInspect id={props.job} onClose={props.onClose} onPick={props.onPick} />
  return <CarInspect {...props} />
}

function CarInspect({ job, onClose, onEngine }: Props) {
  const car = carFor(job)!
  const j = JOBS.find((x) => x.id === job)!
  const v = VEHICLES.find((x) => x.job === job)!
  const reduce = useReducedMotion()
  const [tab, setTab] = useState<'me' | 'car'>('me')
  const [state, setState] = useState<Ignition>('off')
  const [revving, setRevving] = useState(false)
  const engine = useRef<Engine | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const touch = typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches
  const bike = v.kind === 'motorcycle'

  useEffect(() => {
    engine.current = new Engine(car)
    prepare(car)
    closeBtn.current?.focus({ preventScroll: true })
    return () => { engine.current?.stop(); engine.current = null }
  }, [car])

  const set = useCallback((s: Ignition) => {
    const e = engine.current
    if (!e) return
    if (s === 'off') e.stop()
    else if (s === 'standby') { if (state === 'running') e.stop(); else e.standby() }
    else {
      if (state === 'off') e.standby()
      void e.start()
    }
    setState(s); setRevving(false)
    onEngine(s, 0)
  }, [state, onEngine])

  const rev = useCallback((on: boolean) => {
    if (state !== 'running') return
    setRevving(on)
    engine.current?.rev(on ? 1 : 0)
    onEngine('running', on ? 1 : 0)
  }, [state, onEngine])

  const close = useCallback(() => {
    engine.current?.stop()
    onEngine('off', 0)
    onClose()
  }, [onClose, onEngine])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === ' ' && !e.repeat && state === 'running' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); rev(true) }
    }
    const up = (e: KeyboardEvent) => { if (e.key === ' ') rev(false) }
    addEventListener('keydown', k); addEventListener('keyup', up)
    return () => { removeEventListener('keydown', k); removeEventListener('keyup', up) }
  }, [close, rev, state])

  const steps: { id: Ignition; label: string }[] = [
    { id: 'off', label: 'Off' },
    { id: 'standby', label: 'Standby' },
    { id: 'running', label: car.electric ? 'Ready' : 'Start engine' },
  ]

  return (
    <>
      <motion.p
        className="pointer-events-none fixed inset-x-0 top-20 z-30 text-center text-[15px] text-muted"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: reduce ? 0 : 0.8 }}
      >
        {touch ? 'Drag to turn it · pinch to come closer' : 'Drag to turn it · scroll to come closer'}
      </motion.p>

      <motion.aside
        role="dialog"
        aria-modal="false"
        aria-label={`${car.years} ${car.name}`}
        // let the panel scroll on its own while the page behind it is held still
        data-lenis-prevent
        className="fixed inset-x-0 bottom-0 z-30 max-h-[52svh] overflow-y-auto overscroll-contain bg-ground/95 p-5 sm:p-7 md:inset-x-auto md:bottom-6 md:right-6 md:top-24 md:max-h-none md:w-[420px]"
        initial={reduce ? false : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[15px] text-muted">{v.era}</p>
          <button ref={closeBtn} type="button" onClick={close} className="-mr-1 -mt-1 px-1 text-[15px] text-muted hover:text-ink">Close <span aria-hidden>×</span></button>
        </div>

        <div role="tablist" aria-label="What to read" className="mt-4 flex gap-6 border-b border-ink/10 text-[15px]">
          {([['me', 'My chapter'], ['car', `The ${bike ? 'bike' : 'car'}`]] as const).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={`relative pb-2.5 transition-colors ${tab === id ? 'text-ink' : 'text-muted hover:text-ink'}`}
            >
              {label}
              {tab === id ? <motion.span layoutId="inspect-tab" className="absolute inset-x-0 -bottom-px h-px bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 34 }} /> : null}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="pt-5"
          >
            {tab === 'me' ? (
              <>
                <h2 className="font-display text-[2.6rem] leading-[0.95]">{j.company}</h2>
                <p className="mt-3">{j.title}</p>
                <p className="tnum text-muted">{j.range}</p>
                <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                  {j.readouts.map((r) => (
                    <li key={r.label}><span className="tnum block font-display text-3xl leading-none">{r.value}</span><span className="mt-1 block text-[15px] text-muted">{r.label}</span></li>
                  ))}
                </ul>
                <ul className="mt-5 space-y-2 text-[15px] leading-relaxed">
                  {j.bullets.map((b, k) => <li key={k} className="flex gap-3"><span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-warm" />{b}</li>)}
                </ul>
              </>
            ) : (
              <>
                <h2 className="font-display text-[2.6rem] leading-[0.95]">{car.name}</h2>
                <p className="tnum mt-2 text-muted">{car.years}</p>
                <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                  {car.facts.map((f) => (
                    <li key={f.label}><span className="tnum block font-display text-3xl leading-none">{f.value}</span><span className="mt-1 block text-[15px] text-muted">{f.label}</span></li>
                  ))}
                </ul>
                <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[15px]">
                  <dt className="text-muted">Engine</dt><dd>{car.engine}</dd>
                  <dt className="text-muted">Power</dt><dd>{car.power}</dd>
                </dl>
                <div className="mt-5 space-y-3 text-[15px] leading-relaxed">
                  {car.story.map((p, k) => <p key={k}>{p}</p>)}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* the ignition: off, standby, running; a held Rev blips the throttle */}
        <div className="mt-7 border-t border-ink/10 pt-5">
          <p className="text-[15px] text-muted">Ignition</p>
          <div role="radiogroup" aria-label="Ignition" className="mt-3 grid grid-cols-3 border border-ink/20 text-[15px]">
            {steps.map((st) => (
              <button
                key={st.id}
                type="button"
                role="radio"
                aria-checked={state === st.id}
                onClick={() => set(st.id)}
                className={`relative px-2 py-2.5 transition-colors ${state === st.id ? 'text-ground' : 'text-ink hover:bg-ink/10'}`}
              >
                {state === st.id ? <motion.span layoutId="ignition" className="absolute inset-0 bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 36 }} /> : null}
                <span className="relative">{st.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex min-h-[44px] items-center justify-between gap-4">
            <p aria-live="polite" className="text-[15px] text-muted">
              {state === 'off' ? (car.electric ? 'Electric: listen for the motors.' : 'Sound on. Turn the key to hear it.') : state === 'standby' ? car.standby : car.electric ? 'Ready. Hold Press on, or the space bar.' : 'Running. Hold Rev, or the space bar.'}
            </p>
            {state === 'running' ? (
              <button
                type="button"
                onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); rev(true) }}
                onPointerUp={() => rev(false)}
                onPointerCancel={() => rev(false)}
                onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); rev(true) } }}
                onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') rev(false) }}
                aria-pressed={revving}
                className={`shrink-0 select-none border px-5 py-2.5 text-[15px] transition-colors ${revving ? 'border-warm bg-warm text-ground' : 'border-ink/30 hover:border-ink'}`}
              >
                {car.electric ? 'Press on' : 'Rev'}
              </button>
            ) : null}
          </div>
          <p className="mt-3 text-[13px] text-muted">Recording: {car.sound.credit}.</p>
        </div>
      </motion.aside>
    </>
  )
}

// the watch drawer: one piece held up, its story beside it, and the next one a click away
function WatchInspect({ id, onClose, onPick }: { id: string; onClose: () => void; onPick: (id: string) => void }) {
  const w = watchFor(id)!
  const reduce = useReducedMotion()
  const closeBtn = useRef<HTMLButtonElement>(null)
  const touch = typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches
  const i = WATCH_STORIES.indexOf(w), n = WATCH_STORIES.length
  const step = (d: number) => onPick(`watch:${WATCH_STORIES[(i + d + n) % n].label}`)

  useEffect(() => { closeBtn.current?.focus({ preventScroll: true }) }, [])
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  })

  return (
    <>
      <motion.p
        className="pointer-events-none fixed inset-x-0 top-20 z-30 text-center text-[15px] text-muted"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: reduce ? 0 : 0.8 }}
      >
        {touch ? 'Drag to turn it · pinch to look closer' : 'Drag to turn it · scroll to look closer'}
      </motion.p>
      <motion.aside
        role="dialog"
        aria-modal="false"
        aria-label={w.label}
        data-lenis-prevent
        className="fixed inset-x-0 bottom-0 z-30 max-h-[46svh] overflow-y-auto overscroll-contain bg-ground/95 p-5 sm:p-7 md:inset-x-auto md:bottom-auto md:right-6 md:top-24 md:max-h-[calc(100svh-7.5rem)] md:w-[400px]"
        initial={reduce ? false : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[15px] text-muted">The watch drawer · {i + 1} of {n}</p>
          <button ref={closeBtn} type="button" onClick={onClose} className="-mr-1 -mt-1 px-1 text-[15px] text-muted hover:text-ink">Close <span aria-hidden>×</span></button>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={w.label} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
            <h2 className="mt-4 font-display text-[2.6rem] leading-[0.95]">{w.maker}</h2>
            <p className="mt-2 text-muted">{w.model}</p>
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {w.facts.map((f) => (
                <li key={f.label}><span className="tnum block font-display text-3xl leading-none">{f.value}</span><span className="mt-1 block text-[15px] text-muted">{f.label}</span></li>
              ))}
            </ul>
            <div className="mt-5 space-y-3 text-[15px] leading-relaxed">{w.story.map((p, k) => <p key={k}>{p}</p>)}</div>
            <p className="mt-5 text-[15px] text-muted">Set to Bengaluru time, like every watch in the room.</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-[15px]">
          <button type="button" onClick={() => step(-1)} className="py-1 text-muted hover:text-ink"><span aria-hidden>←</span> Previous</button>
          <button type="button" onClick={() => step(1)} className="py-1 text-muted hover:text-ink">Next <span aria-hidden>→</span></button>
        </div>
      </motion.aside>
    </>
  )
}

// the hall of fame, read straight on: the whole wall, then each honour in turn, with the ways to reach me underneath
function HallInspect({ id, onClose, onPick }: { id: string; onClose: () => void; onPick: (id: string) => void }) {
  const reduce = useReducedMotion()
  const closeBtn = useRef<HTMLButtonElement>(null)
  const n = HALL_OF_FAME.length
  const i = id === 'hall' ? -1 : Number(id.slice(5))
  const h = HALL_OF_FAME[i]
  // stepping runs wall, first, second, ... last, and round again
  const step = (d: number) => {
    const next = ((i + 1 + d) % (n + 1) + n + 1) % (n + 1) - 1
    onPick(next < 0 ? 'hall' : `hall:${next}`)
  }

  useEffect(() => { closeBtn.current?.focus({ preventScroll: true }) }, [])
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  })

  const tile = 'inline-flex items-center gap-2 border border-ink/30 px-3.5 py-2 text-[15px] transition-colors hover:bg-ink hover:text-ground'
  return (
    <motion.aside
      role="dialog"
      aria-modal="false"
      aria-label="Hall of fame"
      data-lenis-prevent
      className="fixed inset-x-0 bottom-0 z-30 max-h-[46svh] overflow-y-auto overscroll-contain bg-ground/95 p-5 sm:p-7 md:inset-x-auto md:bottom-auto md:right-6 md:top-24 md:max-h-[calc(100svh-7.5rem)] md:w-[400px]"
      initial={reduce ? false : { opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-[15px] text-muted">Hall of fame{h ? ` · ${i + 1} of ${n}` : ''}</p>
        <button ref={closeBtn} type="button" onClick={onClose} className="-mr-1 -mt-1 px-1 text-[15px] text-muted hover:text-ink">Close <span aria-hidden>×</span></button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={id} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
          {h ? (
            <>
              <h2 className="mt-4 font-display text-[2.6rem] leading-[0.95]">{h.title}</h2>
              <p className="mt-3">{h.detail}</p>
              <p className="mt-1 text-muted">{h.note}</p>
              {h.url ? <a href={h.url} target="_blank" rel="noreferrer" className={`${tile} mt-5`}>See it on GitHub <span aria-hidden>↗</span></a> : null}
            </>
          ) : (
            <>
              <h2 className="mt-4 font-display text-[2.6rem] leading-[0.95]">The whole wall</h2>
              <ul className="mt-4 divide-y divide-ink/10 text-[15px]">
                {HALL_OF_FAME.map((x, k) => (
                  <li key={x.title}>
                    <button type="button" onClick={() => onPick(`hall:${k}`)} className="group flex w-full items-baseline justify-between gap-4 py-2.5 text-left">
                      <span><span className="font-display text-xl">{x.title}</span><span className="block text-muted">{x.detail}</span></span>
                      <span aria-hidden className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-[15px]">
        <button type="button" onClick={() => step(-1)} className="py-1 text-muted hover:text-ink"><span aria-hidden>←</span> Previous</button>
        {h ? <button type="button" onClick={() => onPick('hall')} className="py-1 text-muted hover:text-ink">Whole wall</button> : null}
        <button type="button" onClick={() => step(1)} className="py-1 text-muted hover:text-ink">Next <span aria-hidden>→</span></button>
      </div>
      <div className="mt-6 border-t border-ink/10 pt-5">
        <p className="text-[15px] text-muted">Reach me</p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <a href={`mailto:${PERSON.email}`} className={`${tile} border-ink bg-ink text-ground hover:bg-warm`}>Email me</a>
          {SOCIALS.map((so) => <a key={so.label} href={so.url} target="_blank" rel="noreferrer" className={tile}>{so.label} <span aria-hidden>↗</span></a>)}
          <a href={PERSON.resume} download="Shreyansh_Sancheti_Resume.pdf" className={tile}>Resume</a>
        </div>
      </div>
    </motion.aside>
  )
}
