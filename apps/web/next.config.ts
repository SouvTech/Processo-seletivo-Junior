import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@bemviver/shared'],
  // O web chama /api/... e o Next repassa para a api, então não precisamos de CORS
  async rewrites() {
    return [{ source: '/api/:caminho*', destination: `${process.env.API_URL ?? 'http://localhost:3333'}/:caminho*` }]
  },
}

export default nextConfig
