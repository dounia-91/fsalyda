const withPWA = require('next-pwa');

const isProd = process.env.NODE_ENV === 'production';

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
    ];
  },
  images: {
    domains: ["fsalydabucket.s3.amazonaws.com"],
  },
  experimental: {},
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: !isProd,
  },
};

module.exports = withPWA(nextConfig);
