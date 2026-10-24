'use client'

import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { EDUCATION, HALL_OF_FAME, HIGHLIGHT_SKILLS, HOBBIES, JOBS, OPEN_SOURCE, PERSON, PROJECTS, SKILL_RACKS, SOCIALS, STAGES, TALK } from '@/content/content'
import type { RepoLive } from '@/lib/github'
import { PROJECT_IMAGES, VEHICLES, WATCHES } from './stations'

/* Words rise out of a mask, one after another (adapted from the 21st.dev "Text Reveal (Mask)" pattern). */
export function MaskText({ text, className, as: Tag = 'h2', still }: { text: string; className?: string; as?: 'h1' | 'h2' | 'h3'; still?: boolean }) {
  const reduce = useReducedMotion() || still
  const words = text.split(' ')
  const MotionTag = Tag === 'h1' ? motion.h1 : Tag === 'h3' ? motion.h3 : motion.h2
  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial={reduce ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: false, amount: 0.3 }}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '105%' }, shown: { y: '0%' } }}
            transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

function Rise({ children, i = 0, className, still }: { children: ReactNode; i?: number; className?: string; still?: boolean }) {
  const reduce = useReducedMotion() || still
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Count({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [v, setV] = useState(to)
  useEffect(() => {
    if (!seen || reduce) return
    const a = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: setV })
    return () => a.stop()
  }, [seen, reduce, to])
  return <span ref={ref} className="tnum">{v.toFixed(decimals)}{suffix}</span>
}

/** The plate beside each stop. Real page text: readable without the 3D. */
function Plate({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`pointer-events-auto max-h-[46svh] overflow-y-auto bg-ground/95 p-5 sm:p-8 md:max-h-[72svh] ${wide ? 'md:w-[min(640px,46vw)]' : 'md:w-[min(500px,40vw)]'}`}>
      {children}
    </div>
  )
}

function ProjectShowcase({ ctx }: { ctx: PlacardCtx }) {
  const n = PROJECTS.length
  const p = PROJECTS[ctx.project]
  const go = (d: number) => ctx.setProject((ctx.project + d + n) % n)
  return (
    <Plate wide>
      <MaskText text="The workshop" className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[0.95]" />
      <Rise i={1}><p className="mt-3 text-[15px] text-muted">Projects I build in public. Flip through them here or on the lightbox.</p></Rise>
      <AnimatePresence mode="wait">
        <motion.div key={p.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="mt-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PROJECT_IMAGES[p.id]} alt="" width={1000} height={747} className="aspect-[4/3] w-full object-cover md:hidden" />
          <p className="font-display text-4xl leading-none">{p.name}</p>
          {p.role ? <p className="mt-1 text-[15px] text-muted">{p.role}</p> : null}
          <p className="mt-3 text-[16.5px]">{p.summary}</p>
          {p.meter ? (
            <div className="mt-4 flex gap-10">
              <p><span className="block font-display text-4xl leading-none"><Count to={p.meter.acks} decimals={1} suffix="K" /></span><span className="text-[15px] text-muted">acks per second</span></p>
              <p><span className="block font-display text-4xl leading-none"><Count to={p.meter.p99} suffix=" µs" /></span><span className="text-[15px] text-muted">p99 latency</span></p>
            </div>
          ) : null}
          <p className="mt-3 text-[15px] text-muted">{p.stack.join(' · ')}</p>
          {ctx.live[p.id] ? (
            <p className="tnum mt-2 text-[15px]">
              <span>★ {ctx.live[p.id].stars}</span>
              <span className="text-muted"> · updated {ago(ctx.live[p.id].pushedAt)}</span>
              {ctx.live[p.id].lastCommit ? <span className="block text-muted">Latest: {ctx.live[p.id].lastCommit}</span> : null}
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => go(-1)} className={btn} aria-label="Previous project">←</button>
        <button type="button" onClick={() => go(1)} className={btn} aria-label="Next project">→</button>
        <a href={p.url} target="_blank" rel="noreferrer" className={`${btn} bg-ink text-ground hover:bg-warm`}>Open on GitHub ↗</a>
        <span className="tnum ml-auto text-[15px] text-muted">{ctx.project + 1} / {n}</span>
      </div>
      <ul className="sr-only">{PROJECTS.map((q) => <li key={q.id}><a href={q.url}>{q.name}: {q.summary}</a></li>)}</ul>
    </Plate>
  )
}

const btn = 'inline-flex items-center gap-2 border border-ink/30 px-4 py-2.5 text-[15px] transition-colors duration-300 hover:bg-ink hover:text-ground'

export type PlacardCtx = { project: number; setProject: (i: number) => void; live: Record<string, RepoLive> }

function ago(iso: string) {
  const d = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000))
  return d === 0 ? 'today' : d === 1 ? 'yesterday' : d < 30 ? `${d} days ago` : d < 365 ? `${Math.round(d / 30)} months ago` : `${Math.round(d / 365)} years ago`
}

export function placardFor(id: string, ctx: PlacardCtx): ReactNode {
  if (id === 'entrance') return (
    <Plate>
      {/* painted with the first frame: it sits behind the loader and is the largest text on load */}
      <MaskText as="h1" still text="Shreyansh Sancheti" className="font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em]" />
      <Rise i={1} still><p className="mt-5 text-lg">{PERSON.role} at {PERSON.org}. I build open-source infrastructure for AI agents, in public. This is my showroom.</p></Rise>
      <Rise i={2} still><p className="mt-4 text-[15px] text-muted">Scroll to walk through. Click anything on display.</p></Rise>
    </Plate>
  )
  if (id === 'garage') return (
    <Plate>
      <MaskText text="The garage" className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[0.95]" />
      <Rise i={1}><p className="mt-4 text-lg">Experience, parked in order: the oldest on the left, the newest on the right. Each car is a chapter.</p></Rise>
      <Rise i={2}>
        <ul className="mt-6 space-y-2 text-[15px]">
          {VEHICLES.map((v) => { const j = JOBS.find((x) => x.id === v.job)!; return (
            <li key={v.job} className="flex justify-between gap-4"><span>{j.company}</span><span className="text-muted">{v.era}</span></li>
          ) })}
        </ul>
      </Rise>
    </Plate>
  )
  const v = VEHICLES.find((x) => x.job === id)
  if (v) {
    const j = JOBS.find((x) => x.id === v.job)!
    return (
      <Plate wide>
        <Rise><p className="text-[15px] text-muted">{v.era} · {v.note}</p></Rise>
        <MaskText text={j.company} className="mt-2 font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[0.95]" />
        <Rise i={1}><p className="mt-3">{j.title}</p><p className="tnum text-muted">{j.range}</p></Rise>
        <Rise i={2}>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            {j.readouts.map((r) => (
              <li key={r.label}><span className="tnum block font-display text-4xl leading-none">{r.value}</span><span className="mt-1 block text-[15px] text-muted">{r.label}</span></li>
            ))}
          </ul>
        </Rise>
        <Rise i={3}>
          <ul className="mt-6 space-y-2 text-[15.5px] leading-relaxed">
            {j.bullets.map((b, k) => <li key={k} className="flex gap-3"><span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-warm" />{b}</li>)}
          </ul>
        </Rise>
      </Plate>
    )
  }
  if (id === 'skills') return (
    <Plate wide>
      <MaskText text="The tool wall" className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[0.95]" />
      <Rise i={1}><p className="mt-4 text-lg">Every tool I reach for, kept on the wall. The warm ones are the ones I use most: {[...HIGHLIGHT_SKILLS].join(', ')}.</p></Rise>
      <Rise i={2}>
        <dl className="mt-6 space-y-3 text-[15px]">
          {SKILL_RACKS.map((r) => (<div key={r.rack}><dt className="text-ink">{r.rack}</dt><dd className="text-muted">{r.items.join(', ')}</dd></div>))}
        </dl>
      </Rise>
    </Plate>
  )
  if (id === 'projects') return <ProjectShowcase ctx={ctx} />
  if (id === 'wardrobe') return (
    <Plate>
      <MaskText text="The wardrobe" className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[0.95]" />
      <Rise i={1}><p className="mt-4 text-lg">The get-to-know-me room. A good suit, a few watches, and what I do when the laptop is shut.</p></Rise>
    </Plate>
  )
  if (id === 'hobbies') return (
    <Plate wide>
      <MaskText text="Off the clock" className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[0.95]" />
      <Rise i={1}>
        <ul className="mt-6 grid gap-5 sm:grid-cols-3">
          {HOBBIES.map((h) => (
            <li key={h.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={h.image} alt={h.name} width={403} height={500} loading="lazy" className="aspect-[4/5] w-full object-cover" />
              <p className="mt-2 font-display text-2xl leading-none">{h.name}</p>
              <p className="text-[15px] text-muted">{h.note}</p>
            </li>
          ))}
        </ul>
      </Rise>
    </Plate>
  )
  if (id === 'watches') return (
    <Plate>
      <MaskText text="The watch drawer" className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[0.95]" />
      <Rise i={1}><p className="mt-4 text-lg">Kept for the craft. Every one of them is set to Bengaluru time.</p></Rise>
      <Rise i={2}><ul className="mt-5 space-y-1 text-[15.5px]">{WATCHES.map((w) => <li key={w.label}>{w.label}</li>)}</ul></Rise>
    </Plate>
  )
  if (id === 'hall') return (
    <Plate wide>
      <MaskText text="Hall of fame" className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[0.95]" />
      <Rise i={1}>
        <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {HALL_OF_FAME.map((h0) => {
            const stars = ctx.live['agentic-operator']?.stars
            const h = h0.detail === 'agentic-operator-core' && stars ? { ...h0, title: `${stars} stars` } : h0
            return (
            <li key={h.title}>
              {h.url ? <a href={h.url} target="_blank" rel="noreferrer" className="font-display text-2xl leading-tight hover:text-warm">{h.title}</a> : <span className="font-display text-2xl leading-tight">{h.title}</span>}
              <p className="text-[15px]">{h.detail}</p>
              <p className="text-[15px] text-muted">{h.note}</p>
            </li>
          ) })}
        </ul>
      </Rise>
      <Rise i={2}>
        <div className="mt-7 flex flex-wrap gap-3">
          {SOCIALS.map((so) => <a key={so.label} href={so.url} target="_blank" rel="noreferrer" className={btn}>{so.label} <span className="text-muted">{so.handle}</span></a>)}
        </div>
      </Rise>
    </Plate>
  )
  if (id === 'exit') return (
    <Plate wide>
      <MaskText text="Reach out" className="font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.95]" />
      <Rise i={1}><p className="mt-4 text-lg">{PERSON.summary}</p></Rise>
      <Rise i={2}>
        <div className="mt-6 space-y-2 text-[15.5px]">
          <p><span className="text-muted">On stage:</span> {TALK.event} ({TALK.where}), {TALK.title.toLowerCase()}; also {STAGES.filter((s) => s !== TALK.event).join(' and ')}.</p>
          <p><span className="text-muted">Upstream:</span> {OPEN_SOURCE.map((o, k) => <span key={o.name}><a className="underline underline-offset-4 hover:text-warm" href={o.url}>{o.name}</a> ({o.note.toLowerCase()}){k < OPEN_SOURCE.length - 1 ? ', ' : ''}</span>)}.</p>
          <p><span className="text-muted">Studied:</span> {EDUCATION.degree}, {EDUCATION.school}, {EDUCATION.grade}.</p>
        </div>
      </Rise>
      <Rise i={3}>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={`mailto:${PERSON.email}`} className={`${btn} bg-ink text-ground hover:bg-warm`}>Email me</a>
          <a href={PERSON.resume} download="Shreyansh_Sancheti_Resume.pdf" className={btn}>Download resume</a>
          {SOCIALS.map((so) => <a key={so.label} href={so.url} target="_blank" rel="noreferrer" className={btn}>{so.label} ↗</a>)}
        </div>
      </Rise>
    </Plate>
  )
  return null
}
