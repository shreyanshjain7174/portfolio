import { PROJECTS } from '@/content/content'

export type RepoLive = { stars: number; pushedAt: string; lastCommit: string | null }

// Fetched on the server and cached for an hour, so visitors get static pages with fresh numbers
// and never call GitHub themselves. Any failure falls back to the static content.
const headers: HeadersInit = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

async function repo(full: string): Promise<RepoLive | null> {
  try {
    const opts = { headers, next: { revalidate: 3600 } }
    const [r, c] = await Promise.all([
      fetch(`https://api.github.com/repos/${full}`, opts),
      fetch(`https://api.github.com/repos/${full}/commits?per_page=1`, opts),
    ])
    if (!r.ok) return null
    const meta = await r.json()
    const commits = c.ok ? await c.json() : []
    const msg: string | undefined = commits?.[0]?.commit?.message
    return { stars: meta.stargazers_count ?? 0, pushedAt: meta.pushed_at, lastCommit: msg ? msg.split('\n')[0].slice(0, 90) : null }
  } catch {
    return null
  }
}

export async function liveProjects(): Promise<Record<string, RepoLive>> {
  const entries = await Promise.all(
    PROJECTS.map(async (p) => {
      const full = p.url.replace('https://github.com/', '')
      return [p.id, await repo(full)] as const
    }),
  )
  return Object.fromEntries(entries.filter(([, v]) => v)) as Record<string, RepoLive>
}
