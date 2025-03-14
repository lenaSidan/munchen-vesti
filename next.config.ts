import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   reactStrictMode: false,
   i18n: {
    locales: ["ru", "de"],
    defaultLocale: "ru",
    localeDetection: false,
  },
  
};

export default nextConfig;
