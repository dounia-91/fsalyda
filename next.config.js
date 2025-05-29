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
  // swcMinify: true, // Supprimez cette ligne, c'est la valeur par défaut à partir de Next.js 12
  // experimental: {
  //   appDir: true, // Supprimez cette ligne, l'App Router est stable et activé par défaut dans Next.js 15
  // },
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
};

module.exports = withPWA(nextConfig);
