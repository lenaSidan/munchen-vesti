import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import { Old_Standard_TT, Merriweather } from "next/font/google";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script"; // 👈 импортируем Script

const oldStandard = Old_Standard_TT({ subsets: ["latin", "cyrillic"], weight: "400" });
const merriweather = Merriweather({ subsets: ["latin", "cyrillic"], weight: ["300", "400"] });

import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.querySelectorAll('a[href^="http"]').forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }, []);

  return (
    <div className={merriweather.className}>
      <Head>
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Google Analytics Scripts 👇 */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-BRM8FPV3SS"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BRM8FPV3SS');
        `}
      </Script>

      <Header />
      <main className={oldStandard.className}>
        <Component {...pageProps} />
      </main>
      <CookieConsent />
      <Footer />
    </div>
  );
}
