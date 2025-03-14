import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        {/* Определение языка страницы */}
        <meta name="language" content="ru" />
        <meta httpEquiv="Content-Language" content="ru" />

        {/* Apple Touch Icon (для iOS) */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Favicon для разных устройств */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* PWA (Прогрессивное веб-приложение) */}
        <link rel="manifest" href="/site.webmanifest" />
      
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
