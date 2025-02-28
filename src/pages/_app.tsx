import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import { Old_Standard_TT, Merriweather } from "next/font/google";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const oldStandard = Old_Standard_TT({ subsets: ["latin", "cyrillic"], weight: "400" });
const merriweather = Merriweather({ subsets: ["latin", "cyrillic"], weight: ["300", "400"] });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.querySelectorAll('a[href^="http"]').forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }, []);

  return (
    <div className={merriweather.className}>
      <Header />
      <main className={oldStandard.className}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
