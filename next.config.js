const path = require("path");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["fsalydabucket.s3.amazonaws.com"],
  },
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-transform",
        },
        // Décommente si tu veux permettre les appels externes
        // {
        //   key: "Access-Control-Allow-Origin",
        //   value: "*",
        // },
      ],
    },
  ],
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fsalyda-stockage-2025.s3.amazonaws.com', // or your deployed domain
      },
    ],
  },
};

module.exports = withPWA(nextConfig);

// images: {
//   remotePatterns: [
//     {
//       protocol: 'https',
//       hostname: 'fsalyda-stockage-2025.s3.amazonaws.com',
//       // Optionally restrict paths:
//       // pathname: '/uploads/**',
//     },
//     // Add other domains if needed
//   ],
// },

// next.config.js

