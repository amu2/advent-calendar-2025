/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/advent-calendar-2025',
  assetPrefix: '/advent-calendar-2025/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
