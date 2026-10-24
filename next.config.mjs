/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/', has: [{ type: 'query', key: 'view', value: 'plain' }], destination: '/plain', permanent: false }]
  },
  async headers() {
    // 3D models and images change rarely: cache them for a month, refresh quietly in the background
    const longCache = [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }]
    return [
      { source: '/models/:path*', headers: longCache },
      { source: '/images/:path*', headers: longCache },
    ]
  },
}

export default nextConfig
