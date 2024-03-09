/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.pngkit.com', 'picsum.photos'],
  },
}

module.exports = nextConfig
