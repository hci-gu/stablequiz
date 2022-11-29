/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'whoamai.s3.eu-central-1.amazonaws.com',
        port: '',
      },
    ],
    domains: ['whoamai.s3.eu-central-1.amazonaws.com'],
  },
}

module.exports = nextConfig
