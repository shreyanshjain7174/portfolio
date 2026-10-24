/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/', has: [{ type: 'query', key: 'view', value: 'plain' }], destination: '/plain', permanent: false }]
  },
}

export default nextConfig
