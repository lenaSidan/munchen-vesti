import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";

interface SeoProps {
  title?: string;
  description?: string;
  type?: "website" | "article";
}

export default function Seo({ title, description, type = "website" }: SeoProps) {
  const router = useRouter();
  const t = useTranslation();

  const fullTitle = title ? `${title} – ${t("meta.default_title")}` : t("meta.default_title");
  const fullDescription = description || t("meta.default_description");

  const locale = router.locale || "ru";
  const baseUrl = "https://munchen-vesti.de";
  const path = router.asPath;
  const url = `${baseUrl}${path}`;
  const imageUrl = `${baseUrl}/images/og-card.png`; // Всегда визитка

  const altLocale = locale === "ru" ? "de" : "ru";
  const cleanPath = path.startsWith(`/${locale}`) ? path.replace(`/${locale}`, "") : path;
  const altHref = `${baseUrl}/${altLocale}${cleanPath}`;

  const ogLocale = locale === "ru" ? "ru_RU" : "de_DE";
  const ogLocaleAlt = altLocale === "ru" ? "ru_RU" : "de_DE";

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content="index, follow" />

      {/* Canonical и hreflang */}
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang={locale} href={url} />
      <link rel="alternate" hrefLang={altLocale} href={altHref} />
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlt} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:card" content="summary_large_image" />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
