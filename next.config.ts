import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   reactStrictMode: true,
   i18n: {
    locales: ["ru", "de"],
    defaultLocale: "ru",
    localeDetection: false,
  },
  
};

export default nextConfig;
