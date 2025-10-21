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
        destination: 'https://161.97.134.211:4443/api/v1/:path*',
      },
    ]
  },
}

export default nextConfig
