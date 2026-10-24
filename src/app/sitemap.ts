import type { MetadataRoute } from 'next'

const base = 'https://portfolio-ssancheti.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/plain`, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
