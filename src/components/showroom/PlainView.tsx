import Link from 'next/link'
import { EDUCATION, HALL_OF_FAME, HOBBIES, JOBS, OPEN_SOURCE, PERSON, PROJECTS, SKILL_RACKS, SOCIALS, STAGES, TALK } from '@/content/content'

// Recruiter view: everything in the showroom, as one readable column.
export function PlainView() {
  const h2 = 'mt-16 font-display text-4xl leading-none'
  return (
    <main className="mx-auto max-w-[760px] px-5 py-12 sm:px-8 sm:py-20">
      <header className="flex flex-wrap items-baseline justify-between gap-4 text-[15px]">
        <Link href="/" className="underline underline-offset-4 hover:text-warm">Back to the showroom</Link>
        <a href={PERSON.resume} download className="bg-ink px-4 py-2 text-ground hover:bg-warm">Download resume</a>
      </header>

      <h1 className="mt-12 font-display text-6xl leading-[0.95] sm:text-7xl">{PERSON.name}</h1>
      <p className="mt-4 text-xl">{PERSON.role}, {PERSON.org}. {PERSON.location}.</p>
      <p className="mt-2">
        <a className="underline underline-offset-4" href={`mailto:${PERSON.email}`}>{PERSON.email}</a> ·{' '}
        <a className="underline underline-offset-4" href={PERSON.github}>GitHub</a> ·{' '}
        {SOCIALS.filter((so) => so.label !== 'GitHub').map((so, i) => (
          <span key={so.label}><a className="underline underline-offset-4" href={so.url}>{so.label}</a>{i < 2 ? ' · ' : ''}</span>
        ))}
      </p>

      <h2 className={h2}>About</h2>
      <p className="mt-4">{PERSON.summary}</p>

      <h2 className={h2}>Experience</h2>
      {JOBS.map((j) => (
        <section key={j.id} className="mt-8">
          <h3 className="text-xl">{j.company} <span className="tnum text-muted">· {j.range}</span></h3>
          <p className="text-muted">{j.title}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">{j.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
        </section>
      ))}

      <h2 className={h2}>Projects</h2>
      {PROJECTS.map((p) => (
        <section key={p.id} className="mt-6">
          <h3 className="text-xl"><a href={p.url} className="underline underline-offset-4">{p.name}</a>{p.role ? <span className="text-muted">, {p.role}</span> : null}</h3>
          <p className="text-[15px] text-muted">{p.stack.join(', ')}</p>
          <p>{p.summary}</p>
        </section>
      ))}

      <h2 className={h2}>Talks and open source</h2>
      <ul className="mt-4 list-disc space-y-1 pl-5">
        <li>{TALK.event} ({TALK.where}), {TALK.format.toLowerCase()}: {TALK.title.toLowerCase()}.</li>
        <li>Speaker at {STAGES.filter((s) => s !== TALK.event).join(' and ')}.</li>
        {OPEN_SOURCE.map((o) => <li key={o.name}><a href={o.url} className="underline underline-offset-4">{o.name}</a>: {o.note.toLowerCase()}.</li>)}
      </ul>

      <h2 className={h2}>Hall of fame</h2>
      <ul className="mt-4 list-disc space-y-1 pl-5">
        {HALL_OF_FAME.map((h) => <li key={h.title}>{h.title}, {h.detail.toLowerCase()}: {h.note.toLowerCase()}.</li>)}
      </ul>

      <h2 className={h2}>Skills</h2>
      <dl className="mt-4 space-y-3">
        {SKILL_RACKS.map((r) => <div key={r.rack}><dt>{r.rack}</dt><dd className="text-muted">{r.items.join(', ')}</dd></div>)}
      </dl>

      <h2 className={h2}>Off the clock</h2>
      <p className="mt-4">{HOBBIES.map((h) => h.name).join(', ')}.</p>

      <h2 className={h2}>Education</h2>
      <p className="mt-4">{EDUCATION.school}, {EDUCATION.degree}. {EDUCATION.range}. {EDUCATION.grade}.</p>
    </main>
  )
}
