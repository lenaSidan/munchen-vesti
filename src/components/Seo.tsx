import useTranslation from "@/hooks/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";

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
  const path = router.asPath.split(/[?#]/)[0]; // чистим query/hash

  const altLocale = locale === "ru" ? "de" : "ru";
  const cleanPath = path.startsWith(`/${locale}`) ? path.replace(`/${locale}`, "") : path;

  // 🔹 DE всегда каноническая версия
  const canonicalUrl =
    locale === "de" ? `${baseUrl}${cleanPath}` : `${baseUrl}/${locale}${cleanPath}`;

  const currentUrl = `${baseUrl}/${locale}${cleanPath}`;
  const altUrl = `${baseUrl}/${altLocale}${cleanPath}`;

  const imageUrl = `${baseUrl}/default-og-image-${locale}.png`;

  const ogLocale = locale === "ru" ? "ru_RU" : "de_DE";
  const ogLocaleAlt = altLocale === "ru" ? "ru_RU" : "de_DE";

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content="index, follow" />

      {/* Canonical и hreflang */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}${cleanPath}`} />
      <link rel="alternate" hrefLang="ru" href={`${baseUrl}/ru${cleanPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${cleanPath}`} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

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
