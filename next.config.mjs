// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://xp-backend.sytes.net/api/v1/:path*',
      },
    ]
  },
}

export default nextConfig
