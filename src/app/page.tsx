import { Showroom } from '@/components/showroom/Showroom'
import { liveProjects } from '@/lib/github'

// Static page, refreshed from GitHub at most once an hour.
export const revalidate = 3600

export default async function Home() {
  const live = await liveProjects()
  return <Showroom live={live} />
}
