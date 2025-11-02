import "@/styles/globals.css";
import type { AppProps } from "next/app";

import CookieConsent from "@/components/CookieConsent";
import EasterEggSidebarHint from "@/components/EasterEggSidebarHint";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";

import { Merriweather, Old_Standard_TT } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";

const oldStandard = Old_Standard_TT({ subsets: ["latin", "cyrillic"], weight: "400" });
const merriweather = Merriweather({ subsets: ["latin", "cyrillic"], weight: ["300", "400"] });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [hasVersionCheckRun, setHasVersionCheckRun] = useState(false);

  // 🔁 Автообновление сайта при новой версии
  useEffect(() => {
    // 🔹 В режиме разработки автообновление отключено
    if (process.env.NODE_ENV === "development") {
      console.log("%c⏸ Автообновление отключено (режим разработки)", "color: gray;");
      return;
    }

    let interval: NodeJS.Timeout;

    async function checkForUpdate() {
      try {
        const res = await fetch("/version.txt", { cache: "no-store" });
        if (!res.ok) return; // если файла нет — просто выходим

        const latest = (await res.text()).trim();
        if (!latest) return;

        const current = localStorage.getItem("siteVersion");

        // 🔁 если версия изменилась — обновляем страницу
        if (current && latest !== current) {
          console.log(
            "%c💡 Найдена новая версия сайта. Выполняется автообновление...",
            "color: green; font-weight: bold;"
          );
          window.location.reload();
        }

        localStorage.setItem("siteVersion", latest);
        setHasVersionCheckRun(true);
      } catch {
        // Тихо игнорируем ошибки (например, при локальной разработке)
      }
    }

    checkForUpdate();
    interval = setInterval(checkForUpdate, 60_000); // проверка каждые 60 сек.

    return () => clearInterval(interval);
  }, []);

  // Установка <html lang> по языку браузера
  useEffect(() => {
    if (typeof window !== "undefined") {
      const browserLang = navigator.language || navigator.languages[0];
      document.documentElement.lang = browserLang.split("-")[0];
    }
  }, []);

  // 📊 Google Analytics: логика переходов
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

      {/* GA4 скрипты */}
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
              page_path: window.location.pathname
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
