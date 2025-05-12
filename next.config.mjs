import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-transform",
          },
        ],
      },
    ]
  },
  images: {
    domains: ["fsalydabucket.s3.amazonaws.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
}

export default withPWA(nextConfig)
