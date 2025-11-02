import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["ru", "de"],
    defaultLocale: "de",
    localeDetection: false,
  },
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 86400,
    deviceSizes: [360, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 700],
    domains: [],
  },
  compress: true,
  experimental: {
    scrollRestoration: true,
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
  headers() {
    return Promise.resolve([
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ]);
  },

  // ✅ Добавляем редирект для старых событий
  async redirects() {
    return [
      {
        source: "/events/:slug*",
        destination: "/events-info/:slug*",
        permanent: true, // 301 redirect для SEO
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
