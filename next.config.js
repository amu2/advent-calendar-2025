/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/advent-calendar-2025',
  assetPrefix: '/advent-calendar-2025/',
  trailingSlash: true,
  images: { unoptimized: true },
};
module.exports = nextConfig;
