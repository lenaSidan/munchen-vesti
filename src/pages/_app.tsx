import CookieConsent from "@/components/CookieConsent";
import EasterEggSidebarHint from "@/components/EasterEggSidebarHint";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Merriweather, Old_Standard_TT } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

const oldStandard = Old_Standard_TT({ subsets: ["latin", "cyrillic"], weight: "400" });
const merriweather = Merriweather({ subsets: ["latin", "cyrillic"], weight: ["300", "400"] });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Открытие внешних ссылок в новой вкладке
  useEffect(() => {
    document.querySelectorAll('a[href^="http"]').forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }, []);

  // Отправка page_view при переходах
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag?.("config", "G-BRM8FPV3SS", {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <div className={merriweather.className}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* ✅ Google Analytics через next/script */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-BRM8FPV3SS"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BRM8FPV3SS', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <Header />
      <main className={oldStandard.className}>
        <Component {...pageProps} />
        <EasterEggSidebarHint />
      </main>
      <CookieConsent />
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}
