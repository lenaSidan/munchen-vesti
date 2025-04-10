import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta name="language" content="ru" />
        <meta httpEquiv="Content-Language" content="ru" />
        {/* hreflang для языковых версий */}
        <link rel="alternate" href="https://munchen-vesti.de/" hrefLang="ru" />
        <link rel="alternate" href="https://munchen-vesti.de/de" hrefLang="de" />
        <link rel="alternate" href="https://munchen-vesti.de/" hrefLang="x-default" />
        {/* Favicon для разных устройств */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
