/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    limit: '1000mb',
  },
}

module.exports = nextConfig
